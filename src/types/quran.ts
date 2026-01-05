// Quran API Types - alquran.cloud
// These types are designed for UI usage and future SQLite normalization

// --------------------
// Ayah (Verse)
// --------------------
export interface Ayah {
  number: number; // Global ayah number
  surahArabicName: string;
  surahTranslation: string;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda:
    | boolean
    | {
        id: number;
        recommended: boolean;
        obligatory: boolean;
      };
}

// --------------------
// Surah
// --------------------
export interface Surah {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: Ayah[];
}

// --------------------
// Quran Edition (Arabic / Translation / Audio)
// --------------------
export interface QuranEdition {
  identifier: string; // e.g. "en.asad"
  language: string; // "ar", "tr", "en"
  name: string;
  englishName: string;
  format: "text" | "audio";
  type: "quran" | "translation";
}

// --------------------
// API Response
// --------------------
export interface QuranApiResponse {
  code: number;
  status: string;
  data: {
    surahs: Surah[];
    edition: QuranEdition;
  };
}
