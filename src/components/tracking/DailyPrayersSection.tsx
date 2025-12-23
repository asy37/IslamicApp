import { Text, useColorScheme, View } from "react-native";
import type { Prayer } from "../../../app/(tabs)";
import PrayerRow from "./PrayerRow";
import ActiveMaghribCard from "./ActiveMaghribCard";
import IshaRow from "./IshaRow";

type DailyPrayersSectionProps = {
  readonly prayers: readonly Prayer[];
};

export default function DailyPrayersSection({ prayers }: DailyPrayersSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const prayedPrayers = prayers.slice(0, 3);

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

      {prayedPrayers.map((prayer) => (
        <PrayerRow key={prayer.key} prayer={prayer} />
      ))}

      <ActiveMaghribCard />
      <IshaRow />
    </View>
  );
}
