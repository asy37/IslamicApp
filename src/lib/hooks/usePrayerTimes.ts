/**
 * Prayer Times Hook
 * Fetches prayer times from Aladhan API using TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { fetchNextPrayerTimes, fetchPrayerTimes, type PrayerTimesParams } from '@/lib/api/services/prayerTimes';
import { queryKeys } from '@/lib/query/queryKeys';

  export function usePrayerTimes(params: PrayerTimesParams) {  
    return useQuery({
      queryKey: queryKeys.prayerTimes.byLocation(
        params.latitude,
        params.longitude,
        params.date,
        params.method,
        params.calendarMethod,
      ),
      queryFn: () => fetchPrayerTimes(params),
      staleTime: 24 * 60 * 60 * 1000, // 24 saat (günlük veri)
      gcTime: 24 * 60 * 60 * 1000, // 24 saat cache
    });
  }

export function useNextPrayerTimes(params: PrayerTimesParams) {
  return useQuery({
    queryKey: queryKeys.prayerTimes.byLocation(
      params.latitude,
      params.longitude,
      params.date,
      params.method,
      params.calendarMethod,
    ),
    queryFn: () => fetchNextPrayerTimes(params),
  });
}