import { Ayah } from "@/types/quran";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AudioMode = "surah" | "ayah";

type AudioStateType = {
  audioNumber: number;
  audioMode: AudioMode;
  isPlaying: boolean;
  position: number;
  duration: number;
  autoPlayEnabled: boolean;
  setAutoPlayEnabled: (autoPlayEnabled: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setAudioMode: (audioMode: AudioMode) => void;
  setAudioNumber: (audioNumber: number) => void;
};

type SurahStateType = {
  juz: number;
  surahName: string;
  surahEnglishName: string;
  surahNumber: number;
  setJuz: (juz: number) => void;
  setSurahName: (surahName: string) => void;
  setSurahEnglishName: (surahEnglishName: string) => void;
  setSurahNumber: (surahNumber: number) => void;
};
type PageStateType = {
  currentSurahNumber: number;
  currentPageIndex: number;
  setCurrentSurahNumber: (surahNumber: number) => void;
  setCurrentPageIndex: (pageIndex: number) => void;
};
type AyahStateType = {
  ayahs: Ayah[];
  setAyahs: (ayahs: Ayah[]) => void;
  clearCache: () => void;
};

export const useAudioStore = create<AudioStateType>()(
  persist(
    (set) => ({
      audioNumber: 1,
      audioMode: "surah",
      isPlaying: false,
      position: 0,
      duration: 0,
      autoPlayEnabled: false,
      setAutoPlayEnabled: (autoPlayEnabled: boolean) =>
        set({ autoPlayEnabled: autoPlayEnabled }),
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying: isPlaying }),
      setPosition: (position: number) => set({ position: position }),
      setDuration: (duration: number) => set({ duration: duration }),
      setAudioNumber: (audioNumber: number) =>
        set({ audioNumber: audioNumber }),
      setAudioMode: (audioMode: AudioMode) => set({ audioMode: audioMode }),
    }),
    {
      name: "audio-state",
      partialize: (state) => ({
        audioNumber: state.audioNumber,
        audioMode: state.audioMode,
        autoPlayEnabled: state.autoPlayEnabled,
      }),
    }
  )
);

export const useSurahStore = create<SurahStateType>()(
  persist(
    (set) => ({
      juz: 1,
      surahName: "",
      surahEnglishName: "",
      surahEnglishNameTranslation: "",
      surahNumber: 1,

      setJuz: (juz: number) => set({ juz: juz }),
      setSurahName: (surahName: string) => set({ surahName: surahName }),
      setSurahEnglishName: (surahEnglishName: string) =>
        set({ surahEnglishName: surahEnglishName }),
      setSurahNumber: (surahNumber: number) =>
        set({ surahNumber: surahNumber }),
    }),
    {
      name: "surah-state",
    }
  )
);

export const usePageStore = create<PageStateType>()(
  persist(
    (set) => ({
      currentSurahNumber: 1,
      currentPageIndex: 0,
      setCurrentSurahNumber: (surahNumber: number) =>
        set({ currentSurahNumber: surahNumber }),
      setCurrentPageIndex: (pageIndex: number) =>
        set({ currentPageIndex: pageIndex }),
    }),
    {
      name: "page-state",
    }
  )
);

export const useAyahStore = create<AyahStateType>()(
  persist(
    (set) => ({
      ayahs: [],

      setAyahs: (ayahs: Ayah[]) => set({ ayahs: ayahs }),

      clearCache: () =>
        set({
          ayahs: [],
        }),
    }),
    {
      name: "quran-store",
    }
  )
);
