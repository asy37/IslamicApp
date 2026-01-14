import QuranData from "@/lib/quran/arabic/ar.json";

type SegmentRaw = number[];

export type VerseTiming = {
  verse_key: string; // e.g. "2:255"
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments?: SegmentRaw[];
};

type SurahAudio = {
  chapter_id: number;
  duration: number;
  verse_timings: VerseTiming[];
};

type SurahJson = {
  number: number;
  audio?: SurahAudio[];
};

type QuranJson = {
  surahs: SurahJson[];
};

type NormalizedSegment = {
  wordIndex0: number; // 0-based
  fromMs: number;
  toMs: number;
};

const quran = QuranData as unknown as QuranJson;

// Lazy cache: surahNumber -> (verseKey -> VerseTiming)
const verseTimingCacheBySurah = new Map<number, Map<string, VerseTiming>>();

function getSurahAudio0(surahNumber: number): SurahAudio | null {
  const surah = quran.surahs.find((s) => s.number === surahNumber);
  const audio0 = surah?.audio?.[0];
  if (!audio0 || !audio0.verse_timings) return null;
  return audio0;
}

function getVerseTimingMapForSurah(surahNumber: number): Map<string, VerseTiming> {
  const cached = verseTimingCacheBySurah.get(surahNumber);
  if (cached) return cached;

  const audio0 = getSurahAudio0(surahNumber);
  const map = new Map<string, VerseTiming>();
  if (audio0) {
    // Cache only once per surah for fast lookups during playback
    for (const vt of audio0.verse_timings) {
      if (vt?.verse_key) {
        map.set(vt.verse_key, vt);
      }
    }
  }

  verseTimingCacheBySurah.set(surahNumber, map);
  return map;
}

export function getVerseTiming(
  surahNumber: number,
  ayahNumberInSurah: number
): VerseTiming | null {
  const verseKey = `${surahNumber}:${ayahNumberInSurah}`;
  const map = getVerseTimingMapForSurah(surahNumber);
  return map.get(verseKey) ?? null;
}

function normalizeSegments(segments: SegmentRaw[] | undefined): NormalizedSegment[] {
  if (!segments || segments.length === 0) return [];

  const normalized: NormalizedSegment[] = [];
  for (const seg of segments) {
    // Expected: [wordIndex, startMs, endMs]
    if (!Array.isArray(seg) || seg.length !== 3) continue;
    const [wordIndex1, fromMs, toMs] = seg;
    if (
      typeof wordIndex1 !== "number" ||
      typeof fromMs !== "number" ||
      typeof toMs !== "number"
    ) {
      continue;
    }
    if (!Number.isFinite(wordIndex1) || !Number.isFinite(fromMs) || !Number.isFinite(toMs)) {
      continue;
    }
    if (toMs < fromMs) continue;

    // Convert 1-based -> 0-based
    const wordIndex0 = Math.max(0, Math.floor(wordIndex1) - 1);
    normalized.push({ wordIndex0, fromMs, toMs });
  }

  return normalized;
}

/**
 * positionMillis (ayet sesinin içindeki pozisyon) -> aktif kelime index'i (0-based)
 *
 * Not: `segments` zamanları sure audio timeline'ında görünüyor.
 * Ayet bazlı audio'da positionMillis'i bu timeline'a taşımak için:
 * - önce verseTiming.timestamp_from + positionMillis deneriz
 * - segmentler timestamp_from'tan biraz önce başlayabildiği için fallback olarak minSegmentStart + positionMillis deneriz
 */
export function getActiveWordIndexFromTimings(
  positionMillis: number,
  verseTiming: VerseTiming
): number | null {
  const segments = normalizeSegments(verseTiming.segments);
  if (segments.length === 0) return null;

  const baseA = verseTiming.timestamp_from ?? 0;
  const globalA = baseA + Math.max(0, positionMillis);

  const hitA = segments.find((s) => globalA >= s.fromMs && globalA <= s.toMs);
  if (hitA) return hitA.wordIndex0;

  const minStart = segments.reduce((min, s) => Math.min(min, s.fromMs), segments[0].fromMs);
  const globalB = minStart + Math.max(0, positionMillis);
  const hitB = segments.find((s) => globalB >= s.fromMs && globalB <= s.toMs);
  if (hitB) return hitB.wordIndex0;

  // Fallback: en yakın segment
  const nearest = segments.reduce((best, s) => {
    const d = globalA < s.fromMs ? s.fromMs - globalA : globalA > s.toMs ? globalA - s.toMs : 0;
    if (!best) return { seg: s, d };
    return d < best.d ? { seg: s, d } : best;
  }, null as null | { seg: NormalizedSegment; d: number });

  return nearest?.seg.wordIndex0 ?? null;
}

