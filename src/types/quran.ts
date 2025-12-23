/**
 * Quran-related types
 */

export interface Ayah {
  number: number;
  arabic: string;
  translation?: string;
}

export interface Surah {
  number: number;
  name: string;
  arabicName: string;
  englishName: string;
  ayahCount: number;
  revelationType: 'meccan' | 'medinan';
  ayahs: Ayah[];
}

export interface Verse {
  surah: number;
  ayah: number;
  text: string;
  translation?: string;
}

