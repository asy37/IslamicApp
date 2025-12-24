import { ScrollView, useColorScheme, View } from "react-native";
import clsx from "clsx";
import AdhanHeader from "@/components/adhan/AdhanHeader";
import DateInfo from "@/components/adhan/DateInfo";
import NextPrayerCard from "@/components/adhan/NextPrayerCard";
import PrayerScheduleList from "@/components/adhan/PrayerScheduleList";
import { usePrayerTimes } from "@/lib/hooks/usePrayerTimes";
import { PrayerDate } from "@/components/adhan/types/date-info";
import { PrayerTimings } from "@/components/adhan/types/prayer-timings";

export default function AdhanScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // İstanbul koordinatları
  const istanbulLatitude = 41.0082;
  const istanbulLongitude = 28.9784;

  // Prayer times API çağrısı
  const { data } = usePrayerTimes({
    latitude: istanbulLatitude,
    longitude: istanbulLongitude,
    method: 2, // ISNA
  });

  const prayerDate = data?.data.date as PrayerDate;
  const prayerTimings = data?.data.timings as PrayerTimings;

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
        <DateInfo isDark={isDark} data={prayerDate} />
        <NextPrayerCard isDark={isDark} data={prayerTimings} />
        <PrayerScheduleList isDark={isDark} data={prayerTimings} />
      </ScrollView>
    </View>
  );
}
