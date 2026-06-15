import { Text, View } from "react-native";
import clsx from "clsx";
import ProgressCircle from "./ProgressCircle";
import type { PrayerTrackingData } from "@/features/prayer-tracking/types";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { getIndicatorColor, getMotivationMessage } from "../utils/utils";

type TodayJourneyCardProps = {
  readonly data: PrayerTrackingData;
};

export default function TodayJourneyCard({ data }: TodayJourneyCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const completionPercentage = data.percent || 0;
  const totalPrayed = Object.values(data.prayers).filter((s) => s === 'prayed').length;
  const totalCount = 5;

  const motivationMessage = getMotivationMessage(completionPercentage, totalPrayed, totalCount)

  return (
    <View
      className={
        "relative overflow-hidden rounded-2xl border p-6 shadow-sm " +
        (isDark
          ? "border-border-dark bg-background-cardDark"
          : "border-border-light bg-background-cardLight")
      }
    >
      <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />

      <View className="relative z-10 mb-5 flex-row items-start justify-between">
        <View className="pr-4 flex-1">
          <Text
            className={
              "mb-1 text-xl font-bold " +
              (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
            }
          >
            {t("tracking.todayJourney")}
          </Text>
          <Text
            className={
              "text-sm leading-relaxed " +
              (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
            }
          >
            {t(motivationMessage)}
          </Text>
        </View>

        <ProgressCircle percentage={completionPercentage} />
      </View>

      {/* Mini progress indicators */}
      <View className="flex-row gap-2">
        {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
          <View
            key={prayer}
            className={clsx("h-2 flex-1 rounded-full", getIndicatorColor(data.prayers[prayer], isDark))}
          />
        ))}
      </View>
    </View>
  );
}
