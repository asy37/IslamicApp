/**
 * Daily Progress Section
 * Shows prayer statuses and completion percentage
 */

import { View, Text, useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import type { PrayerTrackingData } from "@/types/prayer-tracking";
import PrayerRow from "./PrayerRow";
import { usePrayerTimes } from "@/lib/hooks/usePrayerTimes";
import { useLocation } from "@/lib/hooks/useLocation";
import { transformPrayerTimings } from "@/components/adhan/utils/utils-function";

type DailyProgressSectionProps = {
  readonly data: PrayerTrackingData;
};

type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

const PRAYER_ORDER: Array<{
  name: PrayerName;
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
    const hour = Number.parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    let displayHour: number;
    if (hour > 12) {
      displayHour = hour - 12;
    } else if (hour === 0) {
      displayHour = 12;
    } else {
      displayHour = hour;
    }
    return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
  };

  // Map prayer items to get times
  const getPrayerTime = (
    prayerName: PrayerName
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
    prayerName: PrayerName
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

  // Get icon for prayer
  const getPrayerIcon = (
    prayerName: PrayerName
  ): keyof typeof MaterialIcons.glyphMap => {
    if (prayerName === "fajr") return "wb-twilight";
    if (prayerName === "dhuhr") return "light-mode";
    if (prayerName === "asr") return "sunny";
    if (prayerName === "maghrib") return "nights-stay";
    return "dark-mode";
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
            icon={getPrayerIcon(prayer.name)}
          />
        ))}
      </View>
    </View>
  );
}
