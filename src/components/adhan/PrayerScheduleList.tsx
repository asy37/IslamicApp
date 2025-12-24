import clsx from "clsx";
import { Text, View } from "react-native";
import PrayerScheduleItem from "./PrayerScheduleItem";
import { PrayerTimings } from "./types/prayer-timings";

type PrayerItem = {
  readonly name: string;
  readonly time: string;
  readonly key: string;
  readonly meaning: string;
  readonly icon: string;
};


/**
 * Şu anki saatin hangi namaz vakti aralığında olduğunu ve vakitlerin geçip geçmediğini belirler
 */
export function getPrayerStatus(
  prayerKey: string,
  allPrayers: PrayerItem[]
): { isPast: boolean; isActive: boolean } {
  const now = new Date();
  
  const prayerOrder = ["Imsak", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  // Tüm vakitleri sıralı olarak al
  const sortedPrayers = prayerOrder
    .map((key) => allPrayers.find((p) => p.key === key))
    .filter((p): p is PrayerItem => p !== undefined);

  if (sortedPrayers.length === 0) {
    return { isPast: false, isActive: false };
  }

  // Imsak zamanını bul (gün dönümü için)
  const imsakPrayer = sortedPrayers.find((p) => p.key === "Imsak");
  if (!imsakPrayer) {
    return { isPast: false, isActive: false };
  }

  // Bugünün tarihini gece yarısından başlat
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  
  // Imsak zamanını hesapla
  const [imsakHours, imsakMinutes] = imsakPrayer.time.split(":").map(Number);
  const imsakTime = new Date(today);
  imsakTime.setHours(imsakHours, imsakMinutes, 0, 0);
  imsakTime.setSeconds(0);
  imsakTime.setMilliseconds(0);

  // Şu an Imsak'tan önce mi? (gece yarısından sonra ama Imsak'tan önce)
  const isBeforeImsak = now.getTime() < imsakTime.getTime();

  // Şu anki namaz vaktini bul
  const currentPrayerIndex = sortedPrayers.findIndex((p) => p.key === prayerKey);
  if (currentPrayerIndex === -1) {
    return { isPast: false, isActive: false };
  }

  const currentPrayer = sortedPrayers[currentPrayerIndex];
  
  // Eğer şu an Imsak'tan önceyse, tüm vakitler dünün vakitleri olarak değerlendirilmeli
  let currentPrayerTime: Date;
  let nextPrayerTime: Date;
  
  if (isBeforeImsak) {
    // Dünün tarihini kullan
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Dünün vakit saatini hesapla
    const [hours, minutes] = currentPrayer.time.split(":").map(Number);
    currentPrayerTime = new Date(yesterday);
    currentPrayerTime.setHours(hours, minutes, 0, 0);
    currentPrayerTime.setSeconds(0);
    currentPrayerTime.setMilliseconds(0);

    // Bir sonraki namaz vaktini bul
    const nextPrayerIndex = currentPrayerIndex + 1;
    
    if (nextPrayerIndex < sortedPrayers.length) {
      // Aynı gün içinde bir sonraki vakit var (dün)
      const nextPrayer = sortedPrayers[nextPrayerIndex];
      const [nextHours, nextMinutes] = nextPrayer.time.split(":").map(Number);
      nextPrayerTime = new Date(yesterday);
      nextPrayerTime.setHours(nextHours, nextMinutes, 0, 0);
      nextPrayerTime.setSeconds(0);
      nextPrayerTime.setMilliseconds(0);
    } else {
      // Son vakit (Isha), bugünün Imsak'ına kadar
      nextPrayerTime = imsakTime;
    }
  } else {
    // Normal durum: Bugünün vakitleri
    const [hours, minutes] = currentPrayer.time.split(":").map(Number);
    currentPrayerTime = new Date(today);
    currentPrayerTime.setHours(hours, minutes, 0, 0);
    currentPrayerTime.setSeconds(0);
    currentPrayerTime.setMilliseconds(0);

    // Bir sonraki namaz vaktini bul
    const nextPrayerIndex = currentPrayerIndex + 1;
    
    if (nextPrayerIndex < sortedPrayers.length) {
      // Aynı gün içinde bir sonraki vakit var
      const nextPrayer = sortedPrayers[nextPrayerIndex];
      const [nextHours, nextMinutes] = nextPrayer.time.split(":").map(Number);
      nextPrayerTime = new Date(today);
      nextPrayerTime.setHours(nextHours, nextMinutes, 0, 0);
      nextPrayerTime.setSeconds(0);
      nextPrayerTime.setMilliseconds(0);
    } else {
      // Son vakit (Isha), yarının Imsak'ına kadar
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowImsak = sortedPrayers.find((p) => p.key === "Imsak");
      if (tomorrowImsak) {
        const [tomorrowImsakHours, tomorrowImsakMinutes] = tomorrowImsak.time.split(":").map(Number);
        nextPrayerTime = new Date(tomorrow);
        nextPrayerTime.setHours(tomorrowImsakHours, tomorrowImsakMinutes, 0, 0);
        nextPrayerTime.setSeconds(0);
        nextPrayerTime.setMilliseconds(0);
      } else {
        // Imsak yoksa, yarının aynı saatine 24 saat ekle
        nextPrayerTime = new Date(currentPrayerTime);
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
      }
    }
  }

  // Vakit geçmiş mi?
  const isPast = now.getTime() > currentPrayerTime.getTime();

  // Şu anki zaman aralığında mı? (bu vakit ile bir sonraki vakit arasında)
  const isActive = 
    now.getTime() >= currentPrayerTime.getTime() && 
    now.getTime() < nextPrayerTime.getTime();

  return { isPast, isActive };
}

function transformPrayerTimings(timings: PrayerTimings | undefined): PrayerItem[] {
  if (!timings) {
    return [];
  }

  const prayerMap: Record<string, { name: string; key: string; meaning: string; icon: string }> = {
    Imsak: { name: "Imsak", key: "Imsak", meaning: "The Imsak", icon: "wb-twilight" },
    Sunrise: { name: "Sunrise", key: "Sunrise", meaning: "The Sunrise", icon: "light-mode" },
    Dhuhr: { name: "Dhuhr", key: "Dhuhr", meaning: "The Noon", icon: "light-mode" },
    Asr: { name: "Asr", key: "Asr", meaning: "The Afternoon", icon: "wb-twilight" },
    Maghrib: { name: "Maghrib", key: "Maghrib", meaning: "The Sunset", icon: "nights-stay" },
    Isha: { name: "Isha", key: "Isha", meaning: "The Night", icon: "bedtime" },
  };

  return Object.entries(timings)
    .filter(([key]) => prayerMap[key])
    .map(([key, time]) => ({
      name: prayerMap[key].name,
      time,
      key: prayerMap[key].key,
      meaning: prayerMap[key].meaning,
      icon: prayerMap[key].icon,
    }));
}

type PrayerScheduleListProps = {
  readonly isDark: boolean;
  readonly data: PrayerTimings | undefined;
};

export default function PrayerScheduleList({
  isDark,
  data,
}: PrayerScheduleListProps) {
  const prayerItems = transformPrayerTimings(data);

  return (
    <View className="flex-1 px-4 flex-col gap-3">
      <Text
        className={clsx(
          "text-lg font-semibold px-2 mb-1",
          isDark ? "text-text-primaryDark" : "text-text-primaryLight"
        )}
      >
        Today's Schedule
      </Text>
      {prayerItems.map((prayer) => {
        const { isPast, isActive } = getPrayerStatus(prayer.key, prayerItems);
        return (
          <PrayerScheduleItem
            key={prayer.key}
            prayer={prayer}
            isDark={isDark}
            isPast={isPast}
            isActive={isActive}
          />
        );
      })}
      <View className="h-8" />
    </View>
  );
}
