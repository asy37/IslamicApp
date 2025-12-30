/**
 * Daily Progress Section
 * Shows prayer statuses and completion percentage
 */

import { View, Text, useColorScheme } from "react-native";
import clsx from "clsx";
import type { PrayerTrackingData } from "@/types/prayer-tracking";
import { usePrayerTimesStore } from "@/lib/storage/prayerTimesStore";
import type { PrayerTimings } from "@/components/prayer-list/prayer-timings";
import PrayerList from "@/components/prayer-list/PrayerList";

type DailyProgressSectionProps = {
  readonly data: PrayerTrackingData;
};

type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export default function DailyProgressSection({
  data,
}: DailyProgressSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const prayerTimesData = usePrayerTimesStore((state) => state.cache);

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-4 px-1">
        <Text
          className={clsx(
            "text-lg font-bold",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          Günlük Namazlar
        </Text>
        <Text
          className={clsx(
            "text-sm font-medium",
            isDark ? "text-primary-400" : "text-primary-600"
          )}
        >
          %{data.percent}
        </Text>
      </View>

      <View className="gap-3">
        <PrayerList
          extended={true}
          isDark={isDark}
          data={prayerTimesData?.data.timings}
        />
      </View>
    </View>
  );
}
