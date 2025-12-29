/**
 * Prayer Times API Service
 * Handles fetching prayer times from Aladhan API
 */

import { aladhanClient } from "../client";

export interface AladhanPrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
      Imsak: string;
      Midnight: string;
      Firstthird: string;
      Lastthird: string;
    };
    date: {
      readable: string;
      timestamp: string;
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
          days: number;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
        holidays: string[];
        adjustedHolidays: string[];
        method: string;
      };
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
        };
        month: {
          number: number;
          en: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
        lunarSighting: boolean;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: {
          Fajr: number;
          Isha: number;
        };
        location: {
          latitude: number;
          longitude: number;
        };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: {
        Imsak: number;
        Fajr: number;
        Sunrise: number;
        Dhuhr: number;
        Asr: number;
        Sunset: number;
        Maghrib: number;
        Isha: number;
        Midnight: number;
      };
    };
  };
}

export interface PrayerTimesParams {
  latitude: number;
  longitude: number;
  method?: number; // Prayer calculation method (default: 2 = ISNA)
  calendarMethod?: string; // Calendar method (default: "ISNA")
  date?: string; // DD-MM-YYYY format
  timezone?: string;
}

/**
 * Fetch prayer times from Aladhan API
 */
export async function fetchPrayerTimes(
  params: PrayerTimesParams
): Promise<AladhanPrayerTimesResponse> {
  const { latitude, longitude, method = 13, calendarMethod = "DIYANET", date, timezone } = params;

  try {
    const response = await aladhanClient.get<AladhanPrayerTimesResponse>(
      "/timings",
      {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        method: method.toString(),
        calendarMethod: calendarMethod,
        ...(date && { date }),
        ...(timezone && { timezone }),
      }
    );

    if (response.code !== 200) {
      throw new Error(response.status || "Failed to fetch prayer times");
    }

    return response;
  } catch (error) {
    console.error("❌ Aladhan API hatası:", error);
    throw error;
  }
}
export async function fetchNextPrayerTimes(
  params: PrayerTimesParams
): Promise<AladhanPrayerTimesResponse> {
  const { latitude, longitude, method = 13, calendarMethod = "DIYANET", date, timezone } = params;

  try {
    const response = await aladhanClient.get<AladhanPrayerTimesResponse>(
      `/nextPrayer/${date}`,
      {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        method: method.toString(),
        calendarMethod: calendarMethod,
        ...(date && { date }),
        ...(timezone && { timezone }),
      }
    );

    if (response.code !== 200) {
      throw new Error(response.status || "Failed to fetch prayer times");
    }

    return response;
  } catch (error) {
    console.error("❌ Aladhan API hatası:", error);
    throw error;
  }
}