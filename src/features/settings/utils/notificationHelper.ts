import { useMethodStore } from "@/lib/storage/useMethodStore";
import { useLocationStore } from "@/lib/storage/locationStore";
import { getTodayDDMMYYYY } from "@/lib/services/dailyReset";
import { getMonth, upsertMonth } from "@/lib/database/prayer-times/repository";
import { fetchPrayerTimes, fetchPrayerTimesCalendar } from "@/lib/api/services/prayerTimes";
import type { PrayerTimesDayData } from "@/lib/api/services/prayerTimes";
import { notificationScheduler } from "@/lib/services/notificationScheduler";
import { queryClient } from "@/lib/query/queryClient";
import { queryKeys } from "@/lib/query/queryKeys";
import { syncPushTokenAndSettings } from "@/lib/services/pushTokenSync";

/**
 * Reschedules prayer notifications based on the current settings and location.
 * First tries to load the month's prayer times from the SQLite cache,
 * then fetches from calendar API if cache is empty, and schedules 7 days of notifications.
 */
export const rescheduleNotifications = async () => {
    try {
        const method = useMethodStore.getState().method?.id ?? 13;
        const location = useLocationStore.getState().location;
        const lat = location?.latitude ?? 41.0082;
        const lng = location?.longitude ?? 28.9784;
        const today = getTodayDDMMYYYY();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Önce SQLite’daki aylık cache’ten 7 gün al (sistem: aylık Aladhan → SQLite → offline kullanım)
        let monthData = await getMonth(year, month, lat, lng, method);
        if (!monthData?.length) {
            try {
                const cal = await fetchPrayerTimesCalendar({
                    latitude: lat,
                    longitude: lng,
                    method,
                    year,
                    month,
                });
                await upsertMonth(year, month, lat, lng, method, cal.data);
                monthData = cal.data;
            } catch {
                /* offline veya API hatası */
            }
        }

        const dayIndex = monthData?.findIndex((d) => d.date?.gregorian?.date === today) ?? -1;
        const weekData: PrayerTimesDayData[] =
            dayIndex >= 0 && monthData
                ? monthData.slice(dayIndex, dayIndex + 7).map((d) => ({
                    date: d.date?.gregorian?.date ?? "",
                    data: d,
                }))
                : [];

        if (weekData.length > 0) {
            await notificationScheduler.scheduleAllNotificationsFromWeek(weekData);
        } else {
            const res = await fetchPrayerTimes({
                latitude: lat,
                longitude: lng,
                method,
                date: today,
            });
            await notificationScheduler.scheduleAllNotifications(res, 7);
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.prayerTimes.all });
        syncPushTokenAndSettings();
    } catch (e) {
        console.error("[Settings] Reschedule failed:", e);
    }
};
