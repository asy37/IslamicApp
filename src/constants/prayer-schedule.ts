/**
 * Prayer Schedule Constants
 * Moved from adhan.tsx to avoid require cycles
 */

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
] as const;

