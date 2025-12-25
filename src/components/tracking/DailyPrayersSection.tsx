import { Text, useColorScheme, View } from "react-native";
import type { PrayerTrackingItem } from "@/types/prayer-tracking-v2";
import PrayerRowV2 from "./PrayerRowV2";

type DailyPrayersSectionProps = {
  readonly prayers: Array<PrayerTrackingItem & { scheduledTime: string; displayTime: string }>;
};

export default function DailyPrayersSection({ prayers }: DailyPrayersSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Always show all 5 prayers
  const order: Record<string, number> = {
    fajr: 1,
    dhuhr: 2,
    asr: 3,
    maghrib: 4,
    isha: 5,
  };
  const sortedPrayers = [...prayers].sort((a, b) => {
    return (order[a.id] || 0) - (order[b.id] || 0);
  });

  return (
    <View className="mt-6 space-y-4">
      <Text
        className={
          "px-1 text-lg font-bold " +
          (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
        }
      >
        Günlük Namazlar
      </Text>

      {/* All prayers - always show 5 */}
      {sortedPrayers.map((prayer) => (
        <PrayerRowV2 key={prayer.id} prayer={prayer} />
      ))}
    </View>
  );
}
