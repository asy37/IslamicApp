import SurahData from "../surah/surah.json";

/**
 * Gets the translated name of a surah by its number and target language code.
 * Falls back to English if the translation is not found or language is not supported.
 * 
 * @param surahNumber 1-indexed surah number (1-114)
 * @param language Language code (e.g. 'tr', 'en', 'ar')
 * @returns Translated surah name
 */
export function getSurahTranslationName(surahNumber: number, language: string): string {
  const surah = SurahData.find((s) => s.surahNumber === surahNumber);
  if (!surah) return "";

  const baseLang = language.split("-")[0]?.toLowerCase();

  if (baseLang === "tr") {
    return surah.surahTurkishName;
  }
  if (baseLang === "ar") {
    return surah.surahArabicName;
  }
  return surah.surahEnglishName;
}
