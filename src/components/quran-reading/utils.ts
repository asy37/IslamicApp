import { useMemo } from "react";
import { SurahType } from "./types";

export const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // aksanları sil
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .trim();

export const useSearchableSurahs = (SurahData: SurahType[]) => {
  const data = useMemo(() => {
    return SurahData.map((surah) => {
      const combinedText = [
        surah.surahArabicName,
        surah.surahEnglishName,
        surah.surahTurkishName,
        String(surah.surahNumber),
      ]
        .filter(Boolean)
        .join(" ");

      return {
        ...surah,
        searchableText: normalizeText(combinedText),
      };
    });
  }, []);
  return data;
};
export const useFilteredSurahs = (
  searchableSurahs: SurahType[],
  search: string
) => {
  const data = useMemo(() => {
    if (!search.trim()) return searchableSurahs;

    const normalizedSearch = normalizeText(search);

    return searchableSurahs.filter((surah) =>
      surah?.searchableText?.includes(normalizedSearch)
    );
  }, [search, searchableSurahs]);
  return data;
};
