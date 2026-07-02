/**
 * Streak from Supabase (authoritative). Uses effective Islamic date.
 */

import { useQuery } from '@tanstack/react-query';
import { getPrayerLogsRecent } from '@/lib/api/services/prayerTracking';
import { getEffectiveToday } from '@/lib/services/prayerDate';
import {
  calculateStreakFromMergedLogs,
  isDayComplete,
  type DailyCompletionRow,
  type PrayerLogRow,
} from '@/lib/services/streakCalculation';
import { prayerTrackingRepo } from '@/lib/database/prayer-tracking/repository';
import type { PrayerStreak } from '@/features/prayer-tracking/types';

const STALE_MS = 90 * 1000;

export function useStreak() {
  const effectiveToday = getEffectiveToday();

  return useQuery<PrayerStreak>({
    queryKey: ['prayerStreak', effectiveToday],
    queryFn: async () => {
      const logs: PrayerLogRow[] = await getPrayerLogsRecent();
      const localRows = await prayerTrackingRepo.getLocalCompletionRows();

      const mergedRows: DailyCompletionRow[] = [
        ...logs.map((log) => ({ date: log.date, complete: isDayComplete(log) })),
        ...localRows,
      ];

      const count = calculateStreakFromMergedLogs(mergedRows, effectiveToday);
      return { count };
    },
    staleTime: STALE_MS,
    gcTime: 5 * 60 * 1000,
  });
}
