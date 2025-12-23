/**
 * Prayer-related types
 */

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  name: PrayerName;
  displayName: string;
  time: Date;
}

export interface DailyPrayerTimes {
  date: string; // YYYY-MM-DD
  prayers: PrayerTime[];
}

export interface PrayerLog {
  id: string;
  date: string;
  prayerName: PrayerName;
  status: 'completed' | 'missed' | 'pending';
  loggedAt: Date;
  userId?: string; // Optional, for cloud sync
}

export interface PrayerStats {
  total: number;
  completed: number;
  missed: number;
  streak: number;
  lastPrayed?: Date;
}

