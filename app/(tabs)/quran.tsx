import { View, useColorScheme } from "react-native";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import QuranSubHeader from "@/components/quran-reading/QuranSubHeader";
import QuranContent from "@/components/quran-reading/QuranContent";
import QuranAudioPlayer from "@/components/quran-reading/QuranAudioPlayer";
import { useQuran } from "@/lib/hooks/useQuran";
import QuranData from "@/lib/quran/arabic/ar.json";
import { useTranslationByIdentifier } from "@/lib/hooks/useTranslationByIdentifier";
import SurahSelectionModal from "@/components/quran-reading/modals/SurahSelectionModal";
import { TranslationMetadata } from "@/lib/database/sqlite/translation/repository";
import { useSurahPlayer } from "@/lib/hooks/useSurahPlayer";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { splitAyahText } from "@/lib/quran/utils/wordSplitter";

export default function QuranScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSurahModalVisible, setIsSurahModalVisible] = useState(false);
  const [selectedTranslation, setSelectedTranslation] =
    useState<TranslationMetadata | null>(null);

  const { translation: quran } = useTranslationByIdentifier(
    selectedTranslation?.edition_identifier || null
  );
  const { surah, ayahs, goNext, goPrev, setCurrentSurahNumber } = useQuran(
    QuranData,
    1,
    quran?.surahs ? { surahs: quran.surahs } : undefined
  );

  const {
    activeAyahNumber,
    activeWordIndex,
    position,
    duration,
    isPlaying,
    setIsPlaying,
    setActiveWordIndex,
  } = useAudioStore();

  // useSurahPlayer - sure okuma akışı
  const surahPlayer = useSurahPlayer(surah.ayahs, (page) => {
    // Sayfa değişimi callback'i - useQuran'ın sayfa geçiş mantığı zaten var
    // Burada sadece loglama yapabiliriz veya ek işlemler yapabiliriz
  });

  // Kelime highlight için positionMillis'e göre activeWordIndex güncelle
  useEffect(() => {
    if (
      activeAyahNumber === null ||
      duration === 0 ||
      position === 0 ||
      !isPlaying
    ) {
      return;
    }

    // Aktif ayeti bul
    const activeAyah = surah.ayahs.find(
      (ayah) => ayah.number === activeAyahNumber
    );

    if (!activeAyah) return;

    // Ayet metnini kelimelere böl
    const words = splitAyahText(activeAyah.text);
    if (words.length === 0) return;

    // Her kelime için tahmini süre hesapla (eşit dağılım)
    const wordDuration = duration / words.length;

    // Hangi kelimenin aktif olduğunu bul
    const currentWordIndex = Math.floor(position / wordDuration);
    const clampedIndex = Math.min(currentWordIndex, words.length - 1);

    if (clampedIndex !== activeWordIndex) {
      setActiveWordIndex(clampedIndex);
    }
  }, [
    activeAyahNumber,
    position,
    duration,
    isPlaying,
    surah.ayahs,
    activeWordIndex,
    setActiveWordIndex,
  ]);

  // Sure okuma başlatma fonksiyonu
  const handlePlaySurah = (surahNumber: number) => {
    // Eğer aynı sure'deysek ve sure okuma aktifse, pause yap
    if (surah.number === surahNumber && surahPlayer.isSurahPlaybackActive) {
      if (surahPlayer.isPlaying) {
        surahPlayer.pauseSurah();
      } else {
        // Devam et
        surahPlayer.resumeSurah();
      }
      return;
    }

    // Yeni sure okuma başlat
    surahPlayer.playSurah(surahNumber, 0);
  };

  // Ayet tıklandığında sure okumasını iptal et
  const handleAyahPress = (ayahNumber: number) => {
    // Manuel etkileşim: sure okuması iptal edilmeli
    if (surahPlayer.isSurahPlaybackActive) {
      surahPlayer.cancelSurahPlayback();
    }

    // Aynı ayetse toggle (pause artık çalışmalı)
    if (activeAyahNumber === ayahNumber) {
      setIsPlaying(!isPlaying);
      return;
    }

    // Farklı ayet: tek instance üzerinden çal
    surahPlayer.playAyahManually(ayahNumber);
  };

  // Kullanıcı scroll yaptığında sure okumasını iptal et
  const handleScroll = () => {
    surahPlayer.cancelSurahPlayback();
  };

  return (
    <View
      className={clsx(
        "relative flex-1",
        isDark ? "flex-1 bg-background-dark" : "flex-1 bg-background-light"
      )}
    >
      <QuranSubHeader
        setSelectTranslation={setSelectedTranslation}
        selectedTranslation={selectedTranslation?.edition_identifier || null}
        isDark={isDark}
        onOpenSurahModal={() => setIsSurahModalVisible(true)}
        onPlaySurah={handlePlaySurah}
      />

      <QuranContent
        isDark={isDark}
        ayahs={ayahs}
        goNext={goNext}
        goPrev={goPrev}
        activeAyahNumber={activeAyahNumber}
        activeWordIndex={activeWordIndex}
        onScroll={handleScroll}
        onAyahPress={handleAyahPress}
      />
      <QuranAudioPlayer
        isDark={isDark}
      />
      <SurahSelectionModal
        setCurrentPage={setCurrentSurahNumber}
        visible={isSurahModalVisible}
        onClose={() => setIsSurahModalVisible(false)}
      />
    </View>
  );
}
