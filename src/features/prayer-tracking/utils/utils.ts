import { PrayerStatus } from "../types";

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

export const getMotivationMessage = (completionPercentage: number, totalPrayed: number, totalCount: number): string => {
  if (completionPercentage === 100) {
    return ("tracking.motivationPerfect");
  } else if (completionPercentage >= 80) {
    return ("tracking.motivationGreat");
  } else if (completionPercentage >= 50) {
    return ("tracking.motivationSteady");
  } else if (totalPrayed > 0) {
    return ("tracking.motivationStarted");
  } else {
    return ("tracking.motivationNotStarted");
  }
};

export const getIndicatorColor = (status: PrayerStatus, isDark: boolean): string => {
  if (status === "prayed") return "bg-green-500";
  if (status === "unprayed") return "bg-red-500";
  if (status === "later") return "bg-amber-400";
  return isDark ? "bg-border-dark" : "bg-gray-200";
};