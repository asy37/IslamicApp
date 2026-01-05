import { useMemo, useState } from "react";
import QuranData from "@/lib/quran/arabic/ar.json";
import { Surah, Ayah } from "@/types/quran";

const AYAH_PER_PAGE = 10;

export function useQuran(initialSurahNumber = 1) {
  const [currentSurahNumber, setCurrentSurahNumber] =
    useState(initialSurahNumber);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  /** Aktif sure */
  const surah: Surah | undefined = useMemo(() => {
    return QuranData.surahs.find(
      (s) => s.number === currentSurahNumber
    ) as Surah | undefined;
  }, [currentSurahNumber]);

  /** Sure yoksa (edge case) */
  if (!surah) {
    throw new Error("Surah not found");
  }

  /** Ayetleri sayfalara böl */
  const pages: Ayah[][] = useMemo(() => {
    const result: Ayah[][] = [];
    for (let i = 0; i < surah.ayahs.length; i += AYAH_PER_PAGE) {
      result.push(surah.ayahs.slice(i, i + AYAH_PER_PAGE));
    }
    return result;
  }, [surah]);

  /** Ekranda gösterilecek ayetler */
  const visibleAyahs = pages[currentPageIndex] ?? [];

  /** Next */
  const goNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((p) => p + 1);
      return;
    }

    // Sure sonu → sonraki sure
    if (currentSurahNumber < QuranData.surahs.length) {
      setCurrentSurahNumber((s) => s + 1);
      setCurrentPageIndex(0);
    }
  };

  /** Prev */
  const goPrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((p) => p - 1);
      return;
    }

    // Sure başı → önceki sure (son sayfa)
    if (currentSurahNumber > 1) {
      const prevSurah = QuranData.surahs.find(
        (s) => s.number === currentSurahNumber - 1
      ) as Surah | undefined;

      if (!prevSurah) return;

      const prevPageCount = Math.ceil(prevSurah.ayahs.length / AYAH_PER_PAGE);

      setCurrentSurahNumber((s) => s - 1);
      setCurrentPageIndex(prevPageCount - 1);
    }
  };

  return {
    surah,
    surahNumber: currentSurahNumber,
    pageIndex: currentPageIndex,
    totalPages: pages.length,
    ayahs: visibleAyahs,
    goNext,
    goPrev,
    setCurrentSurahNumber,
  };
}
