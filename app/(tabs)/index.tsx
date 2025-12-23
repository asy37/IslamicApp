import { ScrollView, useColorScheme } from "react-native";
import TodayJourneyCard from "@/components/tracking/TodayJourneyCard";
import DailyPrayersSection from "@/components/tracking/DailyPrayersSection";
import clsx from "clsx";

const PRAYERS = [
  {
    key: "fajr",
    label: "Fajr",
    icon: "wb-twilight",
    time: "05:12 AM",
    status: "prayed" as const,
  },
  {
    key: "dhuhr",
    label: "Dhuhr",
    icon: "light-mode",
    time: "12:30 PM",
    status: "prayed" as const,
  },
  {
    key: "asr",
    label: "Asr",
    icon: "sunny",
    time: "03:45 PM",
    status: "upcoming" as const,
  },
  {
    key: "isha",
    label: "Isha",
    icon: "dark-mode",
    time: "07:45 PM",
    status: "upcoming" as const,
  },
];

export type Prayer = (typeof PRAYERS)[number];

export default function PrayerTrackingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ScrollView
      className={clsx("flex-1 p-4", isDark ? "bg-background-dark" : "bg-background-light")}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >

        <TodayJourneyCard />
        <DailyPrayersSection prayers={PRAYERS} />
    </ScrollView>
  );
}
