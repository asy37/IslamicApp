import { LocationData } from "@/lib/hooks/useLocation";
import { PrayerTimings } from "@/components/prayer-list/prayer-timings";
import { createPrayerTime } from "@/components/prayer-list/utils";




export type NextPrayerInfo = {
  readonly name: string;
  readonly timeRemaining: string;
  readonly localTime: string;
};

/**
 * Bir sonraki ezan vaktini belirler ve kalan süreyi hesaplar
 */
export function getNextPrayer(
  timings: PrayerTimings | undefined
): NextPrayerInfo | null {
  if (!timings) return null;

  const now = new Date();
  const today = new Date();
  today.setSeconds(0, 0);

  const PRAYER_ORDER = [
    "Imsak",
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ] as const;

  // Bugünkü vakitleri Date'e çevir
  const prayersToday = PRAYER_ORDER.filter((key) => timings[key]).map(
    (key) => ({
      name: key,
      time: timings[key],
      date: createPrayerTime(timings[key], today),
    })
  );

  // Bir sonraki vakti bul
  let nextPrayer = prayersToday.find((p) => p.date.getTime() > now.getTime());

  // Eğer bugünkü tüm vakitler geçtiyse → yarının imsak vakti
  if (!nextPrayer) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    nextPrayer = {
      name: "Imsak",
      time: timings.Imsak,
      date: createPrayerTime(timings.Imsak, tomorrow),
    };
  }

  const diffMs = nextPrayer.date.getTime() - now.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return {
    name: nextPrayer.name,
    localTime: nextPrayer.time,
    timeRemaining: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}

export function getLocationText(location: LocationData | null): string {
  if (location?.city && location?.country) {
    return `${location.city}, ${location.country}`;
  }
  if (location?.city) {
    return location.city;
  }
  if (location?.country) {
    return location.country;
  }
  return "Istanbul, Türkiye";
}
