/**
 * User-related types
 */

export interface User {
  id: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  prayerMethod: 'diyanet' | 'mwl' | 'umm_al_qura';
  notificationSettings: NotificationSettings;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  dailyVerseEnabled: boolean;
  dailyVerseTime?: string; // HH:mm format
  onboardingCompleted: boolean;
}

export interface NotificationSettings {
  prayerTimes: {
    enabled: boolean;
    sound: 'silent' | 'adhan' | 'vibration';
    minutesBefore: number; // Bildirim kaç dakika önce gelsin
  };
  prayerReminders: {
    enabled: boolean;
    minutesAfter: number; // Namaz vaktinden kaç dakika sonra hatırlatıcı
  };
  dailyVerse: {
    enabled: boolean;
    time: string; // HH:mm format
  };
}

