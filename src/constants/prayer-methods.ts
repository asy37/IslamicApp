/**
 * Prayer calculation methods
 */

export type PrayerMethod = 'diyanet' | 'mwl' | 'umm_al_qura';

export interface PrayerMethodConfig {
  id: PrayerMethod;
  name: string;
  description: string;
  apiValue: number;
}

export const PRAYER_METHODS: Record<PrayerMethod, PrayerMethodConfig> = {
  diyanet: {
    id: 'diyanet',
    name: 'Diyanet İşleri Başkanlığı',
    description: 'Türkiye için resmi hesaplama yöntemi',
    apiValue: 13, // Aladhan API value
  },
  mwl: {
    id: 'mwl',
    name: 'Muslim World League',
    description: 'Uluslararası standart hesaplama yöntemi',
    apiValue: 3,
  },
  umm_al_qura: {
    id: 'umm_al_qura',
    name: 'Umm al-Qura',
    description: 'Suudi Arabistan için resmi hesaplama yöntemi',
    apiValue: 4,
  },
};

export const DEFAULT_PRAYER_METHOD: PrayerMethod = 'diyanet';

