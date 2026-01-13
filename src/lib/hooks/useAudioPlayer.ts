import { useEffect, useRef, useCallback } from "react";
import { Audio } from "expo-av";
import { getAudioUrl } from "../api/services/quranApi";
import { useAudioStore } from "@/lib/storage/useQuranStore";

type AudioMode = "surah" | "ayah";

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentAudioRef = useRef<{ mode: AudioMode; number: number } | null>(
    null
  );

  const {
    isPlaying,
    position,
    duration,
    setIsPlaying,
    setPosition,
    setDuration,
  } = useAudioStore();

  const cleanupSound = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    currentAudioRef.current = null;
  }, []);

  /**
   * Audio player'ı başlatır veya durdurur
   * @param audioMode - "surah" veya "ayah"
   * @param audioNumber - Sure veya ayet numarası (null ise durdurur)
   */
  const playAudio = useCallback(
    async (audioMode: AudioMode, audioNumber: number | null) => {
      // audioNumber null ise durdur ve temizle
      if (audioNumber == null) {
        await cleanupSound();
        currentAudioRef.current = null;
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        return;
      }

      // Eğer aynı audio zaten çalıyorsa, play/pause toggle yap
      const isSameAudio =
        currentAudioRef.current?.mode === audioMode &&
        currentAudioRef.current?.number === audioNumber;

      if (isSameAudio && soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          // Aynı audio ise toggle yap
          if (isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
          } else {
            // Ses bittiğinde tekrar çalmak için başa al
            if (status.didJustFinish) {
              await soundRef.current.setPositionAsync(0);
            }
            await soundRef.current.playAsync();
            setIsPlaying(true);
          }
          return;
        }
      }

      // Yeni audio yükle ve çal
      await cleanupSound();

      try {
        const audioUrl = getAudioUrl(audioMode, audioNumber);

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          (status) => {
            if (!status.isLoaded) return;

            setPosition(status.positionMillis ?? 0);
            setDuration(status.durationMillis ?? 0);
            setIsPlaying(status.isPlaying ?? false);

            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
              soundRef.current?.setPositionAsync(0).catch(() => {});
            }
          }
        );

        soundRef.current = sound;
        currentAudioRef.current = { mode: audioMode, number: audioNumber };
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio yükleme hatası:", error);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
      }
    },
    [cleanupSound, isPlaying, setIsPlaying, setPosition, setDuration]
  );

  /** Audio mode setup */
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    return () => {
      cleanupSound();
    };
  }, [cleanupSound]);

  return {
    isPlaying,
    position,
    duration,
    playAudio,
  };
}
