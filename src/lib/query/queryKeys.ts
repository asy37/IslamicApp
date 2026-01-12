/**
 * Query Keys Factory
 * Centralized query key management for type-safe query keys
 */

export const queryKeys = {
  // Translation
  translation: {
    all: ['translation'] as const,
    downloaded: () => ['translation', 'downloaded'] as const,
  },
  // Prayer Times
  prayerTimes: {
    all: ['prayerTimes'] as const,
    byLocation: (
      latitude?: number,
      longitude?: number,
      date?: string,
      method?: number,
      calendarMethod?: string
    ) =>
      ['prayerTimes', latitude, longitude, date, method, calendarMethod] as const,
  },

  // Daily Verse
  dailyVerse: {
    all: ['dailyVerse'] as const,
    byDate: (date: string) => ['dailyVerse', date] as const,
  },

  // Quran
  quran: {
    all: ['quran'] as const,
    surah: (surahNumber: number) => ['quran', 'surah', surahNumber] as const,
    ayah: (surahNumber: number, ayahNumber: number) =>
      ['quran', 'surah', surahNumber, 'ayah', ayahNumber] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => ['user', 'profile'] as const,
    settings: () => ['user', 'settings'] as const,
  },

  // Prayer Logs
  prayerLogs: {
    all: ['prayerLogs'] as const,
    byDate: (date: string) => ['prayerLogs', date] as const,
    byUser: (userId: string) => ['prayerLogs', 'user', userId] as const,
  },

  // Prayer Tracking
  prayerTracking: {
    all: ['prayerTracking'] as const,
    today: () => ['prayerTracking', 'today'] as const,
  },

  // Dhikr
  dhikr: {
    all: ['dhikr'] as const,
    history: (userId?: string) => ['dhikr', 'history', userId] as const,
    stats: (userId?: string) => ['dhikr', 'stats', userId] as const,
  },

  // Language
  language: {
    all: ['language'] as const,
    list: () => ['language', 'list'] as const,
  },
} as const;

