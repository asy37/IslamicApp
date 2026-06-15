/**
 * Prayer Tracking Types
 * Based on Supabase prayer_logs table structure
 */

export type PrayerStatus = 'upcoming' | 'prayed' | 'unprayed' | 'later';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerStatuses {
  fajr: PrayerStatus;
  dhuhr: PrayerStatus;
  asr: PrayerStatus;
  maghrib: PrayerStatus;
  isha: PrayerStatus;
}

export interface PrayerTrackingData {
  prayers: PrayerStatuses;
  percent: number; // 0-100
}

export interface PrayerStreak {
  count: number; // consecutive days with ALL prayers prayed
}

export interface UpdatePrayerStatusRequest {
  prayer: PrayerName;
  status: PrayerStatus;
}

export interface PrayerWithTime {
  prayer_name: PrayerName;
  scheduledTime: string;
  displayName?: string;
  time?: string;
  icon?: string;
}


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
