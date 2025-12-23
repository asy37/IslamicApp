import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Text, View } from "react-native";
import { PRAYER_SCHEDULE } from "../../../app/(tabs)/adhan";
import {
  getActiveBorderColor,
  getBackgroundColor,
  getBorderColor,
  getIconBackgroundColor,
  getIconColor,
  getMeaningTextColor,
  getNameTextColor,
  getNotificationBadgeBg,
  getNotificationIconColor,
  getTimeTextColor,
} from "./utils";

type PrayerScheduleItemProps = {
  readonly prayer: (typeof PRAYER_SCHEDULE)[number];
  readonly isDark: boolean;
};

export default function PrayerScheduleItem({
  prayer,
  isDark,
}: PrayerScheduleItemProps) {
  const isActive = prayer.status === "active";
  const isPast = prayer.status === "past";

  return (
    <View
      className={clsx(
        "flex-row items-center gap-4 p-4 rounded-xl border shadow-sm relative overflow-hidden",
        getBackgroundColor(isActive, isDark),
        getBorderColor(isActive, isDark)
      )}
    >
      {isActive && (
        <View
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: getActiveBorderColor() }}
        />
      )}
      <View
        className="p-2 rounded-full flex items-center justify-center"
        style={{ backgroundColor: getIconBackgroundColor(isActive, isDark) }}
      >
        <MaterialIcons
          name={prayer.icon as any}
          size={20}
          color={getIconColor(isActive, isDark)}
        />
      </View>
      <View className="flex-1" style={{ opacity: isPast ? 0.7 : 1 }}>
        <Text
          className={clsx(
            "text-base font-medium leading-normal",
            getNameTextColor(isActive, isDark)
          )}
        >
          {prayer.name}
        </Text>
        <Text
          className={clsx("text-xs", getMeaningTextColor(isActive, isDark))}
        >
          {prayer.meaning}
        </Text>
      </View>
      <View className="shrink-0 text-right flex-col items-end">
        <Text
          className={clsx(
            "text-base font-medium leading-normal",
            getTimeTextColor(isActive, isPast, isDark)
          )}
        >
          {prayer.time}
        </Text>
        {isActive && (
          <View
            className="flex-row items-center gap-1 px-2 py-0.5 rounded-full mt-1"
            style={{ backgroundColor: getNotificationBadgeBg(isDark) }}
          >
            <MaterialIcons
              name="notifications-active"
              size={10}
              color={getNotificationIconColor()}
            />
            <Text
              className="text-[10px] font-medium"
              style={{ color: getNotificationIconColor() }}
            >
              ON
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
