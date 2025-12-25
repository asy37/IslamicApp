import { ScrollView, useColorScheme, View, Text, ActivityIndicator } from "react-native";
import TodayJourneyCard from "@/components/tracking/TodayJourneyCard";
import DailyPrayersSection from "@/components/tracking/DailyPrayersSection";
import clsx from "clsx";
import { usePrayerTrackingV2 } from "@/lib/hooks/usePrayerTrackingV2";

export default function PrayerTrackingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { data, isLoading } = usePrayerTrackingV2();
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

  if (!data) {
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
      <TodayJourneyCard 
        stats={data.stats}
        prayers={data.prayers} 
      />
      <DailyPrayersSection prayers={data.prayers} />
    </ScrollView>
  );
}
