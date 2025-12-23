import { Text, useColorScheme, View } from "react-native";
import ProgressCircle from "./ProgressCircle";
import MiniPrayerProgress from "./MiniPrayerProgress";

export default function TodayJourneyCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
            İstikrar çok kıymetli. Bugün 5 vakitten 3&apos;ünü kıldın. Devam
            edelim inşallah.
          </Text>
        </View>

        <ProgressCircle />
      </View>

      <MiniPrayerProgress />
    </View>
  );
}
