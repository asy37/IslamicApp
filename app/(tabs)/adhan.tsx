import { ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import AdhanHeader from "@/components/adhan/AdhanHeader";
import DateInfo from "@/components/adhan/DateInfo";
import NextPrayerCard from "@/components/adhan/NextPrayerCard";
import PrayerScheduleList from "@/components/adhan/PrayerScheduleList";

export const PRAYER_SCHEDULE = [
  {
    key: "fajr",
    name: "Fajr",
    meaning: "The Dawn",
    icon: "dark-mode",
    time: "04:55 AM",
    status: "past" as const,
  },
  {
    key: "dhuhr",
    name: "Dhuhr",
    meaning: "The Noon",
    icon: "light-mode",
    time: "12:15 PM",
    status: "past" as const,
  },
  {
    key: "asr",
    name: "Asr",
    meaning: "The Afternoon",
    icon: "wb-twilight",
    time: "03:45 PM",
    status: "past" as const,
  },
  {
    key: "maghrib",
    name: "Maghrib",
    meaning: "The Sunset",
    icon: "nights-stay",
    time: "06:10 PM",
    status: "active" as const,
  },
  {
    key: "isha",
    name: "Isha",
    meaning: "The Night",
    icon: "bedtime",
    time: "07:40 PM",
    status: "upcoming" as const,
  },
];

export default function AdhanScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <AdhanHeader isDark={isDark} />
        <DateInfo isDark={isDark} />
        <NextPrayerCard isDark={isDark} />
        <PrayerScheduleList isDark={isDark} />
      </ScrollView>
    </View>
  );
}
