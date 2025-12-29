import { ScrollView, useColorScheme, View } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import AdhanHeader from "@/components/adhan/AdhanHeader";
import DateInfo from "@/components/adhan/DateInfo";
import NextPrayerCard from "@/components/adhan/NextPrayerCard";
import PrayerScheduleList from "@/components/adhan/PrayerScheduleList";
import { useNextPrayerTimes, usePrayerTimes } from "@/lib/hooks/usePrayerTimes";
import { PrayerDate } from "@/components/adhan/types/date-info";
import { PrayerTimings } from "@/components/adhan/types/prayer-timings";
import { useLocation, type LocationData } from "@/lib/hooks/useLocation";
function getLocalDateTR(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
}
export default function AdhanScreen() {
  const colorScheme = useColorScheme();
  const { location: gpsLocation, requestLocation } = useLocation();
  const [manualLocation, setManualLocation] = useState<LocationData | null>(
    null
  );

  const isDark = colorScheme === "dark";

  // Manuel lokasyon varsa onu kullan, yoksa GPS lokasyonu, yoksa default (Istanbul)
  const activeLocation = manualLocation || gpsLocation;
  const latitudeLocation = activeLocation?.latitude ?? 41.0082;
  const longitudeLocation = activeLocation?.longitude ?? 28.9784;
//TODO: Add user settings for method and calendar method 
  const { data } = usePrayerTimes({
    latitude: latitudeLocation,
    longitude: longitudeLocation,
  });
  const { data: nextPrayerTimes } = useNextPrayerTimes({
    latitude: latitudeLocation,
    longitude: longitudeLocation,
    date: getLocalDateTR(),
  });
console.log(nextPrayerTimes);

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
        <AdhanHeader
          isDark={isDark}
          requestLocation={requestLocation}
          location={activeLocation}
          onLocationSelect={setManualLocation}
        />
        <DateInfo isDark={isDark} data={prayerDate} />
        <NextPrayerCard isDark={isDark} data={prayerTimings} />
        <PrayerScheduleList isDark={isDark} data={prayerTimings} />
      </ScrollView>
    </View>
  );
}
