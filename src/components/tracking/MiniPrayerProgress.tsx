import { Text, useColorScheme, View } from "react-native";
import { colors } from "../theme/colors";
import type { PrayerTrackingItem } from "@/types/prayer-tracking-v2";
import type { PrayerName } from "@/types/prayer-tracking-v2";

type MiniPrayerProgressProps = {
  readonly prayers: Array<PrayerTrackingItem & { scheduledTime: string; displayTime: string }>;
};

const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function MiniPrayerProgress({ prayers }: MiniPrayerProgressProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Sort prayers by order
  const sortedPrayers = PRAYER_ORDER.map((name) => 
    prayers.find((p) => p.id === name)
  ).filter((p): p is PrayerTrackingItem & { scheduledTime: string; displayTime: string } => p !== undefined);

  return (
    <>
      <View className="mt-2 h-1.5 w-full flex-row gap-1.5">
        {sortedPrayers.map((prayer) => {
          const isPrayed = prayer.status === 'prayed';
          return (
            <View
              key={prayer.id}
              className={
                isPrayed
                  ? "h-full flex-1 rounded-full bg-primary-500"
                  : isDark
                  ? "h-full flex-1 rounded-full bg-border-dark/40"
                  : "h-full flex-1 rounded-full bg-border-light/40"
              }
              style={
                isPrayed
                  ? {
                      shadowColor: colors.primary[500],
                      shadowOpacity: 0.4,
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 4,
                    }
                  : undefined
              }
            />
          );
        })}
      </View>

      <View className="mt-2 flex-row justify-between text-[10px] font-medium uppercase tracking-widest">
        {sortedPrayers.map((prayer) => {
          const isPrayed = prayer.status === 'prayed';
          return (
            <Text
              key={prayer.id}
              className={
                isPrayed
                  ? "text-[10px] text-primary-500"
                  : "text-[10px] " +
                    (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
              }
            >
              {prayer.name}
            </Text>
          );
        })}
      </View>
    </>
  );
}
