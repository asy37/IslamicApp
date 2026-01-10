import { useMemo, useState } from "react";
import { Surah, Ayah } from "@/types/quran";

const AYAH_PER_PAGE = 10;

export function useQuran(
  quranData: unknown,
  initialSurahNumber = 1,
  translationData?: { surahs: Surah[] }
) {
  const [currentSurahNumber, setCurrentSurahNumber] =
    useState(initialSurahNumber);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  /** Aktif sure */
  const surah: Surah | undefined = useMemo(() => {
    const data = quranData as {
      surahs: Array<{
        number: number;
        ayahs: Ayah[];
      }>;
    };
    const found = data.surahs.find((s) => s.number === currentSurahNumber);
    return found as unknown as Surah | undefined;
  }, [currentSurahNumber, quranData]);

  /** Sure yoksa (edge case) */
  if (!surah) {
    throw new Error("Surah not found");
  }

  /** Ayetleri çevirilerle eşleştir */
  const enrichedAyahs: Ayah[] = useMemo(() => {
    const translationSurah = translationData?.surahs.find(
      (ts) => ts.number === currentSurahNumber
    );

    return surah.ayahs.map((arabicAyah) => {
      const translationAyah = translationSurah?.ayahs.find(
        (ta) => ta.numberInSurah === arabicAyah.numberInSurah
      );

      return {
        ...arabicAyah,
        translationText: translationAyah?.text,
      };
    });
  }, [surah, translationData, currentSurahNumber]);

  /** Ayetleri sayfalara böl */
  const pages: Ayah[][] = useMemo(() => {
    const result: Ayah[][] = [];
    for (let i = 0; i < enrichedAyahs.length; i += AYAH_PER_PAGE) {
      result.push(enrichedAyahs.slice(i, i + AYAH_PER_PAGE));
    }
    return result;
  }, [enrichedAyahs]);

  /** Ekranda gösterilecek ayetler */
  const visibleAyahs = pages[currentPageIndex] ?? [];

  /** Next */
  const goNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((p) => p + 1);
      return;
    }

    // Sure sonu → sonraki sure
    const data = quranData as {
      surahs: Array<{
        number: number;
        ayahs: Ayah[];
      }>;
    };
    if (currentSurahNumber < data.surahs.length) {
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
      const data = quranData as {
        surahs: Array<{
          number: number;
          ayahs: Ayah[];
        }>;
      };
      const prevSurah = data.surahs.find(
        (s) => s.number === currentSurahNumber - 1
      ) as unknown as Surah | undefined;

      if (!prevSurah) return;

      const prevPageCount = Math.ceil(prevSurah.ayahs.length / AYAH_PER_PAGE);

      setCurrentSurahNumber((s) => s - 1);
      setCurrentPageIndex(prevPageCount - 1);
    }
  };

  return {
    surah: {
      ...surah,
      ayahs: enrichedAyahs,
    },
    surahNumber: currentSurahNumber,
    pageIndex: currentPageIndex,
    totalPages: pages.length,
    ayahs: visibleAyahs,
    goNext,
    goPrev,
    setCurrentSurahNumber,
  };
}
