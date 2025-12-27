import { ScrollView, useColorScheme, View, Text, ActivityIndicator } from "react-native";
import clsx from "clsx";
import TodayJourneyCard from "@/components/tracking/TodayJourneyCard";
import DailyProgressSection from "@/components/tracking/DailyProgressSection";
import StreakCounter from "@/components/tracking/StreakCounter";
import { usePrayerTracking } from "@/lib/hooks/usePrayerTracking";
import { usePrayerStreak } from "@/lib/hooks/usePrayerTracking";

export default function PrayerTrackingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { data, isLoading, error } = usePrayerTracking();
  const { data: streakData } = usePrayerStreak();

  if (isLoading) {
    return (
      <View
        className={clsx(
          "flex-1 items-center justify-center",
          isDark ? "bg-background-dark" : "bg-background-light"
        )}
      >
        <ActivityIndicator size="large" color={isDark ? "#4CAF84" : "#1F8F5F"} />
        <Text
          className={clsx(
            "mt-4 text-sm",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          Namaz vakitleri yükleniyor...
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View
        className={clsx(
          "flex-1 items-center justify-center p-4",
          isDark ? "bg-background-dark" : "bg-background-light"
        )}
      >
        <Text
          className={clsx(
            "text-base text-center",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          Veri yüklenirken bir hata oluştu
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={clsx("flex-1 p-4", isDark ? "bg-background-dark" : "bg-background-light")}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Streak Counter */}
      {streakData && <StreakCounter streak={streakData} />}

      {/* Today's Journey Card */}
      <View className="mt-6">
        <TodayJourneyCard data={data} />
      </View>

      {/* Daily Progress Section */}
      <DailyProgressSection data={data} />
    </ScrollView>
  );
}
