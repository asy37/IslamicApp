/**
 * Daily Progress Section
 * Shows prayer statuses and completion percentage
 */

import { View, Text, useColorScheme } from "react-native";
import clsx from "clsx";
import type { PrayerTrackingData } from "@/types/prayer-tracking";
import PrayerRow from "./PrayerRow";
import { usePrayerTimes } from "@/lib/hooks/usePrayerTimes";
import { useLocation } from "@/lib/hooks/useLocation";
import { transformPrayerTimings } from "@/components/adhan/utils/utils-function";

type DailyProgressSectionProps = {
  readonly data: PrayerTrackingData;
};

const PRAYER_ORDER: Array<{
  name: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
  displayName: string;
}> = [
  { name: "fajr", displayName: "Sabah" },
  { name: "dhuhr", displayName: "Öğle" },
  { name: "asr", displayName: "İkindi" },
  { name: "maghrib", displayName: "Akşam" },
  { name: "isha", displayName: "Yatsı" },
];

export default function DailyProgressSection({
  data,
}: DailyProgressSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { location } = useLocation();
  const latitude = location?.latitude ?? 41.0082;
  const longitude = location?.longitude ?? 28.9784;

  // Fetch prayer times
  const { data: prayerTimesData } = usePrayerTimes({
    latitude,
    longitude,
    method: 2,
  });

  // Get prayer times for display
  const prayerItems = prayerTimesData
    ? transformPrayerTimings(prayerTimesData.data.timings)
    : [];

  // Format time for display
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
  };

  // Map prayer items to get times
  const getPrayerTime = (
    prayerName: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
  ): string => {
    const prayerItem = prayerItems.find((item) => {
      const key = item.key.toLowerCase();
      if (prayerName === "fajr") return key === "imsak" || key === "fajr";
      return key === prayerName;
    });
    return prayerItem ? formatTime(prayerItem.time) : "--:--";
  };

  // Check if prayer time has passed
  const isPrayerPast = (
    prayerName: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
  ): boolean => {
    const prayerItem = prayerItems.find((item) => {
      const key = item.key.toLowerCase();
      if (prayerName === "fajr") return key === "imsak" || key === "fajr";
      return key === prayerName;
    });

    if (!prayerItem) return false;

    const now = new Date();
    const [hours, minutes] = prayerItem.time.split(":").map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    return prayerTime < now;
  };

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
        {PRAYER_ORDER.map((prayer) => (
          <PrayerRow
            key={prayer.name}
            prayerName={prayer.name}
            displayName={prayer.displayName}
            time={getPrayerTime(prayer.name)}
            status={data.prayers[prayer.name]}
            isPast={isPrayerPast(prayer.name)}
            icon={
              prayer.name === "fajr"
                ? "wb-twilight"
                : prayer.name === "dhuhr"
                ? "light-mode"
                : prayer.name === "asr"
                ? "sunny"
                : prayer.name === "maghrib"
                ? "nights-stay"
                : "dark-mode"
            }
          />
        ))}
      </View>
    </View>
  );
}
