import { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { getAudioUrl } from "../api/services/quranApi";
import { useAudioStore } from "@/lib/storage/useQuranStore";

type AudioMode = "surah" | "ayah";

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentAudioRef = useRef<{ mode: AudioMode; number: number } | null>(
    null
  );
  const isPlayingRef = useRef<boolean>(false);

  const {
    isPlaying,
    position,
    duration,
    audioNumber,
    audioMode,
    setIsPlaying,
    setPosition,
    setDuration,
  } = useAudioStore();

  const cleanupSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    currentAudioRef.current = null;
  };

  /** Audio mode setup */
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    return () => {
      cleanupSound();
    };
  }, []);

  /** audioNumber veya audioMode değiştiğinde yeni ses yükle */
  useEffect(() => {
    // audioMode veya audioNumber null ise durdur ve temizle
    if (!audioMode || audioNumber == null) {
      cleanupSound();
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      isPlayingRef.current = false;
      return;
    }

    // Yeni audio yükle
    const loadAudio = async () => {
      await cleanupSound();

      try {
        const audioUrl = getAudioUrl(audioMode, audioNumber);
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          (status) => {
            if (!status.isLoaded) return;

            setPosition(status.positionMillis ?? 0);
            setDuration(status.durationMillis ?? 0);

            if (status.didJustFinish) {
              setIsPlaying(false);
              isPlayingRef.current = false;
              setPosition(0);
              soundRef.current?.setPositionAsync(0).catch(() => {});
            }
          }
        );

        soundRef.current = sound;
        currentAudioRef.current = { mode: audioMode, number: audioNumber };
        isPlayingRef.current = false;

        // Eğer isPlaying true ise, sesi çal
        if (isPlaying) {
          await sound.playAsync();
          isPlayingRef.current = true;
        }
      } catch (error) {
        console.error("Audio yükleme hatası:", error);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setPosition(0);
        setDuration(0);
      }
    };

    loadAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioNumber, audioMode, setIsPlaying, setPosition, setDuration]);

  /** isPlaying değiştiğinde play/pause toggle yap */
  useEffect(() => {
    if (!soundRef.current) return;
    if (isPlayingRef.current === isPlaying) return; // Aynı değerse işlem yapma

    const handlePlayPause = async () => {
      const status = await soundRef.current?.getStatusAsync();
      if (!status?.isLoaded || !soundRef.current) return;

      if (isPlaying) {
        await soundRef.current.playAsync();
        isPlayingRef.current = true;
      } else {
        await soundRef.current.pauseAsync();
        isPlayingRef.current = false;
      }
    };

    handlePlayPause();
  }, [isPlaying]);

  return {
    isPlaying,
    position,
    duration,
  };
}
