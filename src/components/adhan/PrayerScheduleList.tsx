import clsx from "clsx";
import { Text, View } from "react-native";
import { PRAYER_SCHEDULE } from "../../../app/(tabs)/adhan";
import PrayerScheduleItem from "./PrayerScheduleItem";

export default function PrayerScheduleList({ isDark }: { isDark: boolean }) {
  return (
    <View className="flex-1 px-4 flex-col gap-3">
      <Text
        className={clsx(
          "text-lg font-semibold px-2 mb-1",
          isDark ? "text-text-primaryDark" : "text-text-primaryLight"
        )}
      >
        Today's Schedule
      </Text>
      {PRAYER_SCHEDULE.map((prayer) => (
        <PrayerScheduleItem key={prayer.key} prayer={prayer} isDark={isDark} />
      ))}
      <View className="h-8" />
    </View>
  );
}
