/**
 * Background Notification Refresh Task
 *
 * Bu dosya, uygulama arka plandayken (veya kapalıyken) çalışarak
 * namaz vakti bildirimlerini SQLite cache'den yeniden planlar.
 * İnternet bağlantısı gerekmez — cached veriyi kullanır.
 *
 * entry.js'de TaskManager.defineTask ile kaydedilir.
 */

import { Platform } from 'react-native';
import { format, parse } from 'date-fns';
import { getMonth } from '../database/prayer-times/repository';

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

/**
 * Normalize Aladhan time string: "05:52 (+03)" → "05:52"
 */
function normalizeTimeString(time: string): string {
  const match = /^\d{1,2}:\d{2}(?::\d{2})?/.exec(time.trim());
  return match ? match[0] : time;
}

/**
 * Create Date from time string and base date
 */
function createPrayerTimeFromString(time: string, baseDate: Date): Date {
  const normalized = normalizeTimeString(time);
  const [hours, minutes] = normalized.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Background task ana fonksiyonu.
 * SQLite cache'den bugün + gelecek günlerin verilerini okuyup bildirimleri yeniden planlar.
 */
export async function backgroundNotificationRefresh(): Promise<void> {
  console.log('[BackgroundTask] Starting notification refresh...');

  try {
    // Lazy import — background context'te sadece gerekli modülleri yükle
    const { useNotificationSettings } = await import('@/lib/storage/notificationSettings');
    const { notificationService } = await import('@/lib/services/NotificationService');
    const { i18n } = await import('@/lib/i18n');

    // Ensure i18n is initialized
    try {
      const { initI18n } = await import('@/lib/i18n');
      await initI18n();
    } catch {
      // i18n already initialized or not available
    }

    const settings = useNotificationSettings.getState();

    // Location and method from stores
    let latitude = 41.0082; // Istanbul default
    let longitude = 28.9784;
    let method = 13; // Diyanet default

    try {
      const { useLocationStore } = await import('@/lib/storage/locationStore');
      const { useMethodStore } = await import('@/lib/storage/useMethodStore');
      const loc = useLocationStore.getState().location;
      if (loc) {
        latitude = loc.latitude;
        longitude = loc.longitude;
      }
      const m = useMethodStore.getState().method?.id;
      if (m) method = m;
    } catch {
      // Use defaults if stores not available
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Get cached month data from SQLite
    const monthData = await getMonth(year, month, latitude, longitude, method);
    if (!monthData || monthData.length === 0) {
      console.log('[BackgroundTask] No cached prayer times found, skipping');
      return;
    }

    // Find today in the data
    const todayDDMMYYYY = format(now, 'dd-MM-yyyy');
    const dayIndex = monthData.findIndex(
      (d: any) => d.date?.gregorian?.date === todayDDMMYYYY
    );

    if (dayIndex < 0) {
      console.log('[BackgroundTask] Today not found in cached data');
      return;
    }

    // Build 14 days of data (from today onwards, across month boundary if needed)
    const daysFromCurrentMonth = monthData.slice(dayIndex, dayIndex + 14);

    // If we need more days from next month
    let allDays = [...daysFromCurrentMonth];
    if (allDays.length < 14) {
      try {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const nextMonthData = await getMonth(nextYear, nextMonth, latitude, longitude, method);
        if (nextMonthData && nextMonthData.length > 0) {
          const needed = 14 - allDays.length;
          allDays = [...allDays, ...nextMonthData.slice(0, needed)];
        }
      } catch {
        // Next month data not available — use what we have
      }
    }

    // Convert to PrayerTimeData format
    type PrayerTimeData = {
      date: string;
      prayers: Array<{ name: string; time: Date }>;
    };

    const prayerTimes: PrayerTimeData[] = allDays.map((dayData: any) => {
      const dateStr = dayData.date?.gregorian?.date ?? '';
      const baseDate = dateStr ? parse(dateStr, 'dd-MM-yyyy', new Date()) : now;
      const dateString = baseDate.toISOString().slice(0, 10);
      const timings = dayData.timings ?? {};

      const prayers: Array<{ name: string; time: Date }> = PRAYER_ORDER.map((prayerName) => {
        const timeString = timings[prayerName as keyof typeof timings];
        if (!timeString) return null;
        const time = createPrayerTimeFromString(timeString, baseDate);
        return { name: prayerName as string, time };
      }).filter((p): p is { name: string; time: Date } => p !== null);

      return { date: dateString, prayers };
    });

    if (prayerTimes.length === 0) {
      console.log('[BackgroundTask] No prayer times to schedule');
      return;
    }

    // Calculate effective days considering iOS 64 notification limit
    const totalPrayerCount = prayerTimes.reduce(
      (sum, day) => sum + day.prayers.length, 0
    );
    const estimatedEzan = settings.adhanNotifications ? totalPrayerCount : 0;
    const estimatedReminder = settings.prayerReminderEnabled ? totalPrayerCount : 0;
    const estimatedOther =
      (settings.dailyVerseEnabled ? 1 : 0) + (settings.streakEnabled ? 1 : 0);
    const estimatedTotal = estimatedEzan + estimatedReminder + estimatedOther;

    let effectiveDays = prayerTimes.length;
    if (Platform.OS === 'ios' && estimatedTotal > 64 && totalPrayerCount > 0) {
      const ratio = 64 / estimatedTotal;
      effectiveDays = Math.max(1, Math.floor(prayerTimes.length * ratio));
    }

    const limitedPrayerTimes = prayerTimes.slice(0, effectiveDays);

    // Schedule notifications based on settings
    if (settings.adhanNotifications) {
      await notificationService.schedulePrayerTimeNotifications(
        limitedPrayerTimes,
        effectiveDays,
        settings.playAdhanAudio,
        settings.vibration
      );
    }

    if (settings.prayerReminderEnabled) {
      // For background task, we skip "already prayed" check since we don't have UI context
      await notificationService.schedulePrayerReminderNotifications(
        limitedPrayerTimes,
        effectiveDays,
        settings.vibration
      );
    }

    console.log(
      `[BackgroundTask] Scheduled notifications for ${effectiveDays} days (${limitedPrayerTimes.reduce((s, d) => s + d.prayers.length, 0)} prayer slots)`
    );
  } catch (error) {
    console.error('[BackgroundTask] Fatal error:', error);
    throw error;
  }
}
