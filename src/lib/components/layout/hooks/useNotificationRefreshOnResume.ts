/**
 * useNotificationRefreshOnResume
 *
 * Uygulama arka plandan foreground'a geçtiğinde bildirimleri kontrol eder.
 * Eğer yakın gelecekte (24 saat) planlanmış namaz bildirimi yoksa,
 * SQLite cache'den bildirimleri yeniden planlar.
 *
 * İnternet bağlantısı gerektirmez — tamamen offline çalışır.
 */

import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { notificationService } from '@/lib/services/NotificationService';
import { notificationScheduler } from '@/lib/services/notificationScheduler';

const RESCHEDULE_COOLDOWN_MS = 5 * 60 * 1000; // 5 dakika cooldown

export function useNotificationRefreshOnResume(): void {
  const lastCheckRef = useRef<number>(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      // Sadece arka plan → foreground geçişinde çalış
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const now = Date.now();

        // Cooldown: çok sık kontrol etme
        if (now - lastCheckRef.current < RESCHEDULE_COOLDOWN_MS) {
          appStateRef.current = nextAppState;
          return;
        }
        lastCheckRef.current = now;

        try {
          // Önce planlanmış bildirimleri kontrol et
          const hasUpcoming = await notificationService.hasUpcomingPrayerNotifications(24);

          if (!hasUpcoming) {
            console.log('[NotificationResume] No upcoming notifications found, rescheduling from cache...');
            await notificationScheduler.rescheduleFromCache();
          } else {
            console.log('[NotificationResume] Upcoming notifications found, no action needed');
          }
        } catch (error) {
          console.warn('[NotificationResume] Check/reschedule failed:', error);
        }
      }

      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);
}
