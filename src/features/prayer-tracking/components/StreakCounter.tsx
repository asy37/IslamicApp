/**
 * Streak Counter Component
 * Displays consecutive days with ALL prayers prayed
 */

import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import type { PrayerStreak } from "@/features/prayer-tracking/types";
import { useTheme } from "@/lib/storage/useThemeStore";
import { colors } from "@/lib/components/theme/colors";
import { useTranslation } from "@/lib/i18n";

type StreakCounterProps = {
  readonly streak: PrayerStreak;
};

export default function StreakCounter({ streak }: StreakCounterProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className={clsx(
        "rounded-2xl border p-4 flex-row items-center justify-between",
        isDark ? "bg-background-cardDark border-border-dark" : "bg-background-cardLight border-border-light"
      )}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={clsx(
            "w-12 h-12 rounded-full items-center justify-center",
            isDark ? "bg-primary-500/20" : "bg-primary-50"
          )}
        >
          <MaterialIcons name="local-fire-department" size={24} color={colors.primary[500]} />
        </View>
        <View>
          <Text
            className={clsx(
              "text-sm",
              isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
            )}
          >
            {t("tracking.streakTitle")}
          </Text>
          <Text
            className={clsx(
              "text-2xl font-bold",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}
          >
            {streak.count} {streak.count === 1 ? t("common.day") : t("common.days")}
          </Text>
        </View>
      </View>

      {streak.count > 0 && (
        <View className="items-end">
          <Text
            className={clsx(
              "text-xs font-medium",
              isDark ? "text-primary-400" : "text-primary-600"
            )}
          >
            {t("tracking.perfect")}
          </Text>
        </View>
      )}
    </View>
  );
}

