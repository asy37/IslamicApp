export const prayerMap: Record<
  string,
  { name: string; key: string; meaning: string; icon: string }
> = {
  Fajr: {
    name: "Fajr",
    key: "Fajr",
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
