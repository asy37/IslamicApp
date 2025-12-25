import { Text, useColorScheme, View } from "react-native";
import ProgressCircle from "./ProgressCircle";
import MiniPrayerProgress from "./MiniPrayerProgress";
import type { PrayerTrackingItem, PrayerTrackingResponse } from "@/types/prayer-tracking-v2";

type TodayJourneyCardProps = {
  readonly stats: PrayerTrackingResponse['stats'];
  readonly prayers: Array<PrayerTrackingItem & { scheduledTime: string; displayTime: string }>;
};

export default function TodayJourneyCard({ stats, prayers }: TodayJourneyCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const completionPercentage = stats?.completionPercentage || 0;
  const totalPrayed = stats?.completedCount || 0;
  const totalCount = stats?.totalCount || 5;

  // Motivasyon mesajı
  const getMotivationMessage = (): string => {
    if (completionPercentage === 100) {
      return "Mükemmel! Bugün tüm vakitleri kıldın. Allah kabul etsin.";
    } else if (completionPercentage >= 80) {
      return `Harika! Bugün ${totalCount} vakitten ${totalPrayed}'ünü kıldın. Devam edelim inşallah.`;
    } else if (completionPercentage >= 50) {
      return `İstikrar çok kıymetli. Bugün ${totalCount} vakitten ${totalPrayed}'ünü kıldın. Devam edelim inşallah.`;
    } else if (totalPrayed > 0) {
      return `Başlangıç güzel. Bugün ${totalPrayed} vakit kıldın. Devam edelim inşallah.`;
    } else {
      return "Bugün henüz vakit kılmadın. Hemen başlayalım inşallah.";
    }
  };

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
            Bugünkü Yolculuğun
          </Text>
          <Text
            className={
              "text-sm leading-relaxed " +
              (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
            }
          >
            {getMotivationMessage()}
          </Text>
        </View>

        <ProgressCircle percentage={completionPercentage} />
      </View>

      <MiniPrayerProgress prayers={prayers} />
    </View>
  );
}
