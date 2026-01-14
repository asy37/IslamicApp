import { useEffect, useRef, useCallback } from "react";
import { useAyahPlayer } from "./useAyahPlayer";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { Ayah } from "@/types/quran";

type OnPageChangeCallback = (page: number) => void;

/**
 * Sure okuma akışını yöneten hook
 * useAyahPlayer'ı kullanır
 * 
 * Sorumlulukları:
 * - currentAyahIndex state'i (sure içindeki ayet index'i)
 * - Ayet bittiğinde (didJustFinish) currentAyahIndex + 1
 * - Sure bittiğinde oynatmayı durdurur (pause/stop)
 * - Kullanıcı manuel işlem yaparsa (scroll, ayet seçimi) otomatik sure okumasını iptal eder
 */
export function useSurahPlayer(
  surahAyahs: Ayah[],
  onPageChange?: OnPageChangeCallback
) {
  const {
    isSurahPlaybackActive,
    currentSurahAyahIndex,
    isPlaying,
    activeAyahNumber,
    setIsSurahPlaybackActive,
    setCurrentSurahAyahIndex,
    setActiveWordIndex,
    setIsPlaying,
  } = useAudioStore();

  const surahAyahsRef = useRef<Ayah[]>(surahAyahs);
  const onPageChangeRef = useRef<OnPageChangeCallback | undefined>(
    onPageChange
  );

  // Refs'i güncelle
  useEffect(() => {
    surahAyahsRef.current = surahAyahs;
  }, [surahAyahs]);

  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  }, [onPageChange]);

  // Ayet player ref'i (circular dependency'yi önlemek için)
  const ayahPlayerRef = useRef<ReturnType<typeof useAyahPlayer> | null>(null);

  // Ayet bittiğinde bir sonraki ayete geç
  const handleAyahFinish = useCallback(() => {
    if (!isSurahPlaybackActive) return;
    if (currentSurahAyahIndex === null) return;

    const nextIndex = currentSurahAyahIndex + 1;

    // Sure bitti mi kontrol et
    if (nextIndex >= surahAyahsRef.current.length) {
      // Sure bitti, oynatmayı durdur
      setIsSurahPlaybackActive(false);
      setCurrentSurahAyahIndex(null);
      setActiveWordIndex(0);
      ayahPlayerRef.current?.stop();
      return;
    }

    // Bir sonraki ayete geç
    setCurrentSurahAyahIndex(nextIndex);
    setActiveWordIndex(0); // Yeni ayet için kelime index'ini sıfırla

    const nextAyah = surahAyahsRef.current[nextIndex];
    if (nextAyah && ayahPlayerRef.current) {
      // Yeni ayeti çal
      ayahPlayerRef.current.play(nextAyah.number);

      // Sayfa değişimi kontrolü
      const currentAyah = surahAyahsRef.current[currentSurahAyahIndex];
      if (currentAyah && nextAyah.page !== currentAyah.page) {
        // Sayfa değişti, callback çağır
        if (onPageChangeRef.current) {
          onPageChangeRef.current(nextAyah.page);
        }
      }
    }
  }, [
    isSurahPlaybackActive,
    currentSurahAyahIndex,
    setIsSurahPlaybackActive,
    setCurrentSurahAyahIndex,
    setActiveWordIndex,
  ]);

  // useAyahPlayer'ı kullan
  const ayahPlayer = useAyahPlayer(handleAyahFinish);
  
  // Ref'i güncelle
  useEffect(() => {
    ayahPlayerRef.current = ayahPlayer;
  }, [ayahPlayer]);

  // Sure okuma başlat
  const playSurah = useCallback(
    (surahNumber: number, startAyahIndex: number = 0) => {
      if (surahAyahsRef.current.length === 0) return;

      const startIndex = Math.max(0, Math.min(startAyahIndex, surahAyahsRef.current.length - 1));
      const startAyah = surahAyahsRef.current[startIndex];

      if (!startAyah) return;

      setIsSurahPlaybackActive(true);
      setCurrentSurahAyahIndex(startIndex);
      setActiveWordIndex(0);
      ayahPlayerRef.current?.play(startAyah.number);
    },
    [setIsSurahPlaybackActive, setCurrentSurahAyahIndex, setActiveWordIndex]
  );

  // Sure okumayı durdur
  const stopSurah = useCallback(() => {
    setIsSurahPlaybackActive(false);
    setCurrentSurahAyahIndex(null);
    setActiveWordIndex(0);
    ayahPlayerRef.current?.stop();
  }, [setIsSurahPlaybackActive, setCurrentSurahAyahIndex, setActiveWordIndex]);

  // Sure okumayı duraklat
  const pauseSurah = useCallback(() => {
    ayahPlayerRef.current?.pause();
  }, []);

  // Sure okumayı devam ettir (pause sonrası)
  const resumeSurah = useCallback(() => {
    // Aynı ayet yüklüyse sadece play state'ini açmak yeterli
    setIsPlaying(true);
  }, [setIsPlaying]);

  /**
   * Manuel ayet çalma: sure okumasını kesin iptal eder ve tek instance üzerinden ayeti çalar.
   * (Echo/pause karışması olmaması için kritik)
   */
  const playAyahManually = useCallback(
    (ayahNumber: number) => {
      // Sure okumasını iptal et
      setIsSurahPlaybackActive(false);
      setCurrentSurahAyahIndex(null);
      setActiveWordIndex(0);
      ayahPlayerRef.current?.play(ayahNumber);
    },
    [
      setIsSurahPlaybackActive,
      setCurrentSurahAyahIndex,
      setActiveWordIndex,
    ]
  );

  const toggleCurrentAyahPlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  // Kullanıcı manuel işlem yaptığında sure okumasını iptal et
  const cancelSurahPlayback = useCallback(() => {
    if (isSurahPlaybackActive) {
      stopSurah();
    }
  }, [isSurahPlaybackActive, stopSurah]);

  // currentSurahAyahIndex değiştiğinde aktif ayet numarasını güncelle
  useEffect(() => {
    if (isSurahPlaybackActive && currentSurahAyahIndex !== null) {
      const ayah = surahAyahsRef.current[currentSurahAyahIndex];
      if (ayah) {
        // activeAyahNumber zaten useAyahPlayer tarafından güncelleniyor
        // Burada sadece kontrol ediyoruz
      }
    }
  }, [isSurahPlaybackActive, currentSurahAyahIndex]);

  return {
    playSurah,
    stopSurah,
    pauseSurah,
    resumeSurah,
    cancelSurahPlayback,
    playAyahManually,
    toggleCurrentAyahPlayPause,
    isSurahPlaybackActive,
    currentSurahAyahIndex,
    currentAyahNumber: ayahPlayer.currentAyahNumber,
    isPlaying: ayahPlayer.isPlaying,
    activeAyahNumber,
  };
}
