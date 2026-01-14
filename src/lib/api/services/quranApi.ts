/**
 * AlQuran Cloud API Service
 * Handles fetching Quran data from alquran.cloud API
 * Documentation: https://alquran.cloud/api
 */

import { alQuranClient, QueryParamValue } from "../client";
import type {
  QuranApiResponse,
  CompleteQuranResponse,
  SurahResponse,
  MultipleEditionsResponse,
  AyahResponse,
  JuzResponse,
  PageResponse,
  ManzilResponse,
  RukuResponse,
  HizbQuarterResponse,
  SajdaResponse,
  SearchResponse,
  MetaResponse,
  QuranEdition,
} from "@/types/quran";

// --------------------
// Edition Endpoints
// --------------------

/**
 * Get all available editions
 */
export interface GetEditionsParams extends Record<string, QueryParamValue> {
  format?: "text" | "audio";
  language?: string; // 2-digit language code (e.g., "en", "tr", "ar")
  type?: "quran" | "translation" | "tafsir" | "versebyverse";
}

export async function getEditions(
  params?: GetEditionsParams
): Promise<QuranApiResponse<QuranEdition[]>> {
  return alQuranClient.get<QuranApiResponse<QuranEdition[]>>(
    "/edition",
    params
  );
}

/**
 * Get all available languages
 */
export async function getLanguages(): Promise<QuranApiResponse<string[]>> {
  return alQuranClient.get<QuranApiResponse<string[]>>("/edition/language");
}

/**
 * Get editions for a specific language
 */
export async function getEditionsByLanguage(
  language: string
): Promise<QuranApiResponse<QuranEdition[]>> {
  return alQuranClient.get<QuranApiResponse<QuranEdition[]>>(
    `/edition/language/${language}`
  );
}

/**
 * Get all available types
 */
export async function getTypes(): Promise<QuranApiResponse<string[]>> {
  return alQuranClient.get<QuranApiResponse<string[]>>("/edition/type");
}

/**
 * Get editions for a specific type
 */
export async function getEditionsByType(
  type: string
): Promise<QuranApiResponse<QuranEdition[]>> {
  return alQuranClient.get<QuranApiResponse<QuranEdition[]>>(
    `/edition/type/${type}`
  );
}

/**
 * Get all available formats
 */
export async function getFormats(): Promise<QuranApiResponse<string[]>> {
  return alQuranClient.get<QuranApiResponse<string[]>>("/edition/format");
}

/**
 * Get editions for a specific format
 */
export async function getEditionsByFormat(
  format: "text" | "audio"
): Promise<QuranApiResponse<QuranEdition[]>> {
  return alQuranClient.get<QuranApiResponse<QuranEdition[]>>(
    `/edition/format/${format}`
  );
}

// --------------------
// Quran Endpoints
// --------------------

/**
 * Get complete Quran edition
 * @param edition - Edition identifier (e.g., "quran-uthmani", "en.asad", "ar.alafasy")
 */
export async function getCompleteQuran(
  edition: string = "quran-uthmani"
): Promise<QuranApiResponse<CompleteQuranResponse>> {
  return alQuranClient.get<QuranApiResponse<CompleteQuranResponse>>(
    `/quran/${edition}`
  );
}

// --------------------
// Juz Endpoints
// --------------------

/**
 * Get a Juz (1-30)
 */
export interface GetJuzParams extends Record<string, QueryParamValue> {
  offset?: number; // Offset ayahs in a juz
  limit?: number; // Limit number of ayahs
}

export async function getJuz(
  juz: number,
  edition: string = "quran-uthmani",
  params?: GetJuzParams
): Promise<QuranApiResponse<JuzResponse>> {
  return alQuranClient.get<QuranApiResponse<JuzResponse>>(
    `/juz/${juz}/${edition}`,
    params
  );
}

// --------------------
// Surah Endpoints
// --------------------

/**
 * Get list of all Surahs
 */
export async function getSurahs(): Promise<
  QuranApiResponse<
    Array<{
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      revelationType: "Meccan" | "Medinan";
      numberOfAyahs: number;
    }>
  >
> {
  return alQuranClient.get<
    QuranApiResponse<
      Array<{
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: "Meccan" | "Medinan";
        numberOfAyahs: number;
      }>
    >
  >("/surah");
}

/**
 * Get a single Surah (1-114)
 */
export interface GetSurahParams extends Record<string, QueryParamValue> {
  offset?: number; // Offset ayahs in a surah
  limit?: number; // Limit number of ayahs
}

export async function getSurah(
  surah: number,
  edition: string = "quran-uthmani",
  params?: GetSurahParams
): Promise<QuranApiResponse<SurahResponse>> {
  return alQuranClient.get<QuranApiResponse<SurahResponse>>(
    `/surah/${surah}/${edition}`,
    params
  );
}

/**
 * Get a Surah from multiple editions
 * @param editions - Comma-separated edition identifiers (e.g., "quran-uthmani,en.asad,en.pickthall")
 */
export async function getSurahMultipleEditions(
  surah: number,
  editions: string,
  params?: GetSurahParams
): Promise<QuranApiResponse<MultipleEditionsResponse>> {
  return alQuranClient.get<QuranApiResponse<MultipleEditionsResponse>>(
    `/surah/${surah}/editions/${editions}`,
    params
  );
}

// --------------------
// Ayah Endpoints
// --------------------

/**
 * Get a single Ayah
 * @param reference - Ayah number (1-6236) or surah:ayah format (e.g., "2:255")
 */
export async function getAyah(
  reference: number | string,
  edition: string = "quran-uthmani"
): Promise<QuranApiResponse<AyahResponse>> {
  return alQuranClient.get<QuranApiResponse<AyahResponse>>(
    `/ayah/${reference}/${edition}`
  );
}

/**
 * Get an Ayah from multiple editions
 * @param reference - Ayah number (1-6236) or surah:ayah format (e.g., "2:255")
 * @param editions - Comma-separated edition identifiers
 */
export async function getAyahMultipleEditions(
  reference: number | string,
  editions: string
): Promise<QuranApiResponse<MultipleEditionsResponse>> {
  return alQuranClient.get<QuranApiResponse<MultipleEditionsResponse>>(
    `/ayah/${reference}/editions/${editions}`
  );
}

// --------------------
// Search Endpoints
// --------------------

/**
 * Search the Quran
 * @param keyword - Search keyword
 * @param surah - Surah number (1-114) or "all"
 * @param editionOrLanguage - Edition identifier or 2-digit language code
 */
export async function searchQuran(
  keyword: string,
  surah: number | "all" = "all",
  editionOrLanguage: string = "en"
): Promise<QuranApiResponse<SearchResponse>> {
  return alQuranClient.get<QuranApiResponse<SearchResponse>>(
    `/search/${keyword}/${surah}/${editionOrLanguage}`
  );
}

// --------------------
// Manzil Endpoints
// --------------------

/**
 * Get a Manzil (1-7)
 */
export interface GetManzilParams extends Record<string, QueryParamValue> {
  offset?: number;
  limit?: number;
}

export async function getManzil(
  manzil: number,
  edition: string = "quran-uthmani",
  params?: GetManzilParams
): Promise<QuranApiResponse<ManzilResponse>> {
  return alQuranClient.get<QuranApiResponse<ManzilResponse>>(
    `/manzil/${manzil}/${edition}`,
    params
  );
}

// --------------------
// Ruku Endpoints
// --------------------

/**
 * Get a Ruku (1-556)
 */
export interface GetRukuParams extends Record<string, QueryParamValue> {
  offset?: number;
  limit?: number;
}

export async function getRuku(
  ruku: number,
  edition: string = "quran-uthmani",
  params?: GetRukuParams
): Promise<QuranApiResponse<RukuResponse>> {
  return alQuranClient.get<QuranApiResponse<RukuResponse>>(
    `/ruku/${ruku}/${edition}`,
    params
  );
}

// --------------------
// Page Endpoints
// --------------------

/**
 * Get a Page (1-604)
 */
export interface GetPageParams extends Record<string, QueryParamValue> {
  offset?: number;
  limit?: number;
}

export async function getPage(
  page: number,
  edition: string = "quran-uthmani",
  params?: GetPageParams
): Promise<QuranApiResponse<PageResponse>> {
  return alQuranClient.get<QuranApiResponse<PageResponse>>(
    `/page/${page}/${edition}`,
    params
  );
}

// --------------------
// Hizb Quarter Endpoints
// --------------------

/**
 * Get a Hizb Quarter (1-240)
 */
export interface GetHizbQuarterParams extends Record<string, QueryParamValue> {
  offset?: number;
  limit?: number;
}

export async function getHizbQuarter(
  hizb: number,
  edition: string = "quran-uthmani",
  params?: GetHizbQuarterParams
): Promise<QuranApiResponse<HizbQuarterResponse>> {
  return alQuranClient.get<QuranApiResponse<HizbQuarterResponse>>(
    `/hizbQuarter/${hizb}/${edition}`,
    params
  );
}

// --------------------
// Sajda Endpoints
// --------------------

/**
 * Get all verses requiring Sajda (Prostration)
 */
export async function getSajda(
  edition: string = "quran-uthmani"
): Promise<QuranApiResponse<SajdaResponse>> {
  return alQuranClient.get<QuranApiResponse<SajdaResponse>>(
    `/sajda/${edition}`
  );
}

// --------------------
// Meta Endpoints
// --------------------

/**
 * Get meta data about Surahs, Pages, Hizbs and Juzs
 */
export async function getMeta(): Promise<QuranApiResponse<MetaResponse>> {
  return alQuranClient.get<QuranApiResponse<MetaResponse>>("/meta");
}

// --------------------
// Audio Endpoints
// --------------------

/**
 * Ayet bazlı ses dosyası URL'ini oluşturur
 * @param ayahNumber - Ayet numarası (1-6236)
 * @param options - Edition ve bitrate seçenekleri
 * @returns Ayet ses dosyası URL'i
 */
export function getAyahAudioUrl(
  ayahNumber: number,
  options?: {
    edition?: string;
    bitrate?: number;
  }
): string {
  if (ayahNumber === null || ayahNumber === undefined) {
    throw new Error("Ayah number cannot be null or undefined");
  }

  const baseUrl = "https://cdn.islamic.network/quran/audio";
  const edition = options?.edition ?? "ar.alafasy";
  const bitrate = options?.bitrate ?? 128;
  const url = `${baseUrl}/${bitrate}/${edition}/${ayahNumber}.mp3`;

  return url;
}

/**
 * @deprecated Use getAyahAudioUrl instead. This function is kept for backward compatibility.
 */
export function getAudioUrl(
  audioMode: "surah" | "ayah" | null,
  number: number | null,
  options?: {
    edition?: string;
    bitrate?: number;
  }
) {
  // Sadece ayet bazlı URL döndür (surah modu artık desteklenmiyor)
  return getAyahAudioUrl(number ?? 1, options);
}
