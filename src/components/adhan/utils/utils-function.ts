import { PrayerItem, PrayerTimings } from "../types/prayer-timings";

/**
 * Vakit zamanını Date objesine çevirir
 */
export function createPrayerTime(time: string, baseDate: Date): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

/**
 * Dünün vakit zamanlarını hesaplar (Imsak'tan önceki saatler için)
 */
export function getYesterdayPrayerTimes(
  currentPrayer: PrayerItem,
  currentPrayerIndex: number,
  sortedPrayers: PrayerItem[],
  yesterday: Date,
  imsakTime: Date
): { currentPrayerTime: Date; nextPrayerTime: Date } {
  const currentPrayerTime = createPrayerTime(currentPrayer.time, yesterday);
  const nextPrayerIndex = currentPrayerIndex + 1;

  let nextPrayerTime: Date;
  if (nextPrayerIndex < sortedPrayers.length) {
    const nextPrayer = sortedPrayers[nextPrayerIndex];
    nextPrayerTime = createPrayerTime(nextPrayer.time, yesterday);
  } else {
    nextPrayerTime = imsakTime;
  }

  return { currentPrayerTime, nextPrayerTime };
}

/**
 * Bugünün vakit zamanlarını hesaplar
 */
export function getTodayPrayerTimes(
  currentPrayer: PrayerItem,
  currentPrayerIndex: number,
  sortedPrayers: PrayerItem[],
  today: Date
): { currentPrayerTime: Date; nextPrayerTime: Date } {
  const currentPrayerTime = createPrayerTime(currentPrayer.time, today);
  const nextPrayerIndex = currentPrayerIndex + 1;

  let nextPrayerTime: Date;
  if (nextPrayerIndex < sortedPrayers.length) {
    const nextPrayer = sortedPrayers[nextPrayerIndex];
    nextPrayerTime = createPrayerTime(nextPrayer.time, today);
  } else {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowImsak = sortedPrayers.find((p) => p.key === "Imsak");
    if (tomorrowImsak) {
      nextPrayerTime = createPrayerTime(tomorrowImsak.time, tomorrow);
    } else {
      nextPrayerTime = new Date(currentPrayerTime);
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }
  }

  return { currentPrayerTime, nextPrayerTime };
}

/**
 * Şu anki saatin hangi namaz vakti aralığında olduğunu ve vakitlerin geçip geçmediğini belirler
 */
export function getPrayerStatus(
  prayerKey: string,
  allPrayers: PrayerItem[]
): { isPast: boolean; isActive: boolean } {
  const now = new Date();
  const prayerOrder = ["Imsak", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const sortedPrayers = prayerOrder
    .map((key) => allPrayers.find((p) => p.key === key))
    .filter((p): p is PrayerItem => p !== undefined);

  if (sortedPrayers.length === 0) {
    return { isPast: false, isActive: false };
  }

  const imsakPrayer = sortedPrayers.find((p) => p.key === "Imsak");
  if (!imsakPrayer) {
    return { isPast: false, isActive: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const imsakTime = createPrayerTime(imsakPrayer.time, today);
  const isBeforeImsak = now.getTime() < imsakTime.getTime();

  const currentPrayerIndex = sortedPrayers.findIndex(
    (p) => p.key === prayerKey
  );
  if (currentPrayerIndex === -1) {
    return { isPast: false, isActive: false };
  }

  const currentPrayer = sortedPrayers[currentPrayerIndex];
  let currentPrayerTime: Date;
  let nextPrayerTime: Date;

  if (isBeforeImsak) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const times = getYesterdayPrayerTimes(
      currentPrayer,
      currentPrayerIndex,
      sortedPrayers,
      yesterday,
      imsakTime
    );
    currentPrayerTime = times.currentPrayerTime;
    nextPrayerTime = times.nextPrayerTime;
  } else {
    const times = getTodayPrayerTimes(
      currentPrayer,
      currentPrayerIndex,
      sortedPrayers,
      today
    );
    currentPrayerTime = times.currentPrayerTime;
    nextPrayerTime = times.nextPrayerTime;
  }

  const isPast = now.getTime() > currentPrayerTime.getTime();
  const isActive =
    now.getTime() >= currentPrayerTime.getTime() &&
    now.getTime() < nextPrayerTime.getTime();

  return { isPast, isActive };
}

export function transformPrayerTimings(
  timings: PrayerTimings | undefined
): PrayerItem[] {
  if (!timings) {
    return [];
  }

  const prayerMap: Record<
    string,
    { name: string; key: string; meaning: string; icon: string }
  > = {
    Imsak: {
      name: "Imsak",
      key: "Imsak",
      meaning: "The Imsak",
      icon: "wb-twilight",
    },
    Sunrise: {
      name: "Sunrise",
      key: "Sunrise",
      meaning: "The Sunrise",
      icon: "light-mode",
    },
    Dhuhr: {
      name: "Dhuhr",
      key: "Dhuhr",
      meaning: "The Noon",
      icon: "light-mode",
    },
    Asr: {
      name: "Asr",
      key: "Asr",
      meaning: "The Afternoon",
      icon: "wb-twilight",
    },
    Maghrib: {
      name: "Maghrib",
      key: "Maghrib",
      meaning: "The Sunset",
      icon: "nights-stay",
    },
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
  if (!timings) {
    return null;
  }

  const now = new Date();
  const prayerOrder = ["Imsak", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  // Tüm vakitleri sıralı olarak al
  const prayerItems = transformPrayerTimings(timings);
  const sortedPrayers = prayerOrder
    .map((key) => prayerItems.find((p) => p.key === key))
    .filter((p): p is PrayerItem => p !== undefined);

  if (sortedPrayers.length === 0) {
    return null;
  }

  // Bugünün tarihini gece yarısından başlat
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  // Imsak zamanını hesapla
  const imsakPrayer = sortedPrayers.find((p) => p.key === "Imsak");
  if (!imsakPrayer) {
    return null;
  }

  const imsakTime = createPrayerTime(imsakPrayer.time, today);
  const isBeforeImsak = now.getTime() < imsakTime.getTime();

  // Tüm vakitleri kontrol et ve bir sonraki vakti bul
  let nextPrayer: PrayerItem | null = null;
  let nextPrayerTime: Date | null = null;

  for (const prayer of sortedPrayers) {
    let prayerTime: Date;

    if (isBeforeImsak) {
      // Dünün vakitleri
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      prayerTime = createPrayerTime(prayer.time, yesterday);
    } else {
      // Bugünün vakitleri
      prayerTime = createPrayerTime(prayer.time, today);
    }

    // Eğer bu vakit henüz gelmediyse, bu bir sonraki vakit
    if (now.getTime() < prayerTime.getTime()) {
      nextPrayer = prayer;
      nextPrayerTime = prayerTime;
      break;
    }
  }

  // Eğer bugün hiç vakit kalmadıysa, yarının Imsak'ı bir sonraki vakit
  if (!nextPrayer || !nextPrayerTime) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextPrayer = imsakPrayer;
    nextPrayerTime = createPrayerTime(imsakPrayer.time, tomorrow);
  }

  // Kalan süreyi hesapla
  const timeDiff = nextPrayerTime.getTime() - now.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  // Format: HH:MM:SS
  const timeRemaining = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Yerel saati formatla: HH:MM
  const localHours = now.getHours();
  const localMinutes = now.getMinutes();
  const localTime = `${String(localHours).padStart(2, "0")}:${String(localMinutes).padStart(2, "0")}`;

  return {
    name: nextPrayer.name,
    timeRemaining,
    localTime,
  };
}
