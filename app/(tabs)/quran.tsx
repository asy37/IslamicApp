import React, { useRef, useState } from "react";
import { View, Share } from "react-native";
import clsx from "clsx";
import QuranSubHeader from "@/components/quran-reading/QuranSubHeader";
import { useTranslation } from "@/i18n";
import QuranContent from "@/components/quran-reading/QuranContent";
import QuranAudioPlayer from "@/components/quran-reading/QuranAudioPlayer";
import { useQuran } from "@/lib/hooks/quran/useQuran";
import QuranData from "@/lib/quran/arabic/ar.json";
import SurahSelectionModal from "@/components/quran-reading/modals/SurahSelectionModal";
import { useSurahPlayer } from "@/lib/hooks/audio-player/useSurahPlayer";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { useAyahWordSync } from "@/lib/hooks/quran/useAyahWordSync";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quranBookmarkRepo } from "@/lib/database/sqlite/quran-bookmark/repository";
import { queryKeys } from "@/lib/query/queryKeys";
import { ShareCard } from "@/components/daily-verse/ShareCard";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Ayah } from "@/types/quran";

export default function QuranScreen() {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [isSurahModalVisible, setIsSurahModalVisible] = React.useState(false);
  const [shareAyah, setShareAyah] = useState<Ayah | null>(null);
  const shareViewShotRef = useRef<View>(null);
  const queryClient = useQueryClient();

  const { surah, ayahs, goNext, goPrev, setCurrentSurahNumber } = useQuran(
    QuranData,
    1,
  );

  const {
    activeAyahNumber,
    activeWordIndex,
    isPlaying,
    setIsPlaying,
  } = useAudioStore();

  // useSurahPlayer - sure okuma akışı
  const surahPlayer = useSurahPlayer(surah.ayahs, (page) => {
    // Sayfa değişimi callback'i - useQuran'ın sayfa geçiş mantığı zaten var
    // Burada sadece loglama yapabiliriz veya ek işlemler yapabiliriz
  });

  // Kelime highlight için positionMillis'e göre activeWordIndex güncelle
  useAyahWordSync({
    surahNumber: surah.number,
    ayahs: surah.ayahs,
  });

  // Query to get all liked/bookmarked Ayah numbers
  const { data: likedAyahNumbers = [], refetch: refetchBookmarks } = useQuery({
    queryKey: queryKeys.quranBookmarks.likedNumbers(),
    queryFn: async () => {
      const list = await quranBookmarkRepo.getBookmarks();
      return list.map((a) => a.number);
    },
  });

  // Mutation to toggle bookmark
  const toggleLikeMutation = useMutation({
    mutationFn: async (ayah: Ayah) => {
      const isCurrentlyLiked = likedAyahNumbers.includes(ayah.number);
      if (isCurrentlyLiked) {
        await quranBookmarkRepo.removeBookmark(ayah.number);
      } else {
        await quranBookmarkRepo.addBookmark(ayah);
      }
    },
    onSuccess: () => {
      refetchBookmarks();
      // Invalidate both dailyVerse queries and bookmarks queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: queryKeys.quranBookmarks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dailyVerse.all });
    },
    onError: (err) => {
      console.error("[QuranScreen] Error toggling bookmark:", err);
      const Alert = require("react-native").Alert;
      Alert.alert("Error toggling bookmark", String(err));
    }
  });

  // Share handler with visual card generation
  const handleShare = async (ayah: Ayah) => {
    setShareAyah(ayah);
    // Wait for state rendering off-screen before capture
    setTimeout(async () => {
      try {
        if (!shareViewShotRef.current) return;
        const uri = await captureRef(shareViewShotRef, {
          format: "png",
          quality: 0.9,
        });
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error("Error sharing quran card image:", error);
        // Fallback to text share
        const text = `Salah - ${t("quran.quranLabel")}\n\nبِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\n${ayah.text}\n\n${
          ayah.translationText ?? ""
        }\n\n— ${ayah.surahArabicName} (${ayah.surahTranslation}) - ${t("quran.ayah", { ayah: ayah.numberInSurah })}`;
        await Share.share({ message: text });
      } finally {
        setShareAyah(null);
      }
    }, 150);
  };

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
      {/* Off-screen card for sharing capture */}
      {shareAyah && (
        <View style={{ position: "absolute", left: -9999, top: -9999 }}>
          <ShareCard ref={shareViewShotRef} ayah={shareAyah} />
        </View>
      )}

      <QuranSubHeader
        onOpenSurahModal={() => setIsSurahModalVisible(true)}
        onPlaySurah={handlePlaySurah}
      />

      <QuranContent
        ayahs={ayahs}
        goNext={goNext}
        goPrev={goPrev}
        activeAyahNumber={activeAyahNumber}
        activeWordIndex={activeWordIndex}
        onScroll={handleScroll}
        onAyahPress={handleAyahPress}
        onLikePress={(ayah) => toggleLikeMutation.mutate(ayah)}
        onSharePress={handleShare}
        likedAyahNumbers={likedAyahNumbers}
      />
      <QuranAudioPlayer
      />
      <SurahSelectionModal
        setCurrentPage={setCurrentSurahNumber}
        visible={isSurahModalVisible}
        onClose={() => setIsSurahModalVisible(false)}
      />
    </View>
  );
}
