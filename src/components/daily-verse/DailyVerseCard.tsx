import { Text, View, Share } from "react-native";
import clsx from "clsx";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { useTranslation } from "@/i18n";
import React, { useEffect, useRef } from "react";
import { useQuran } from "@/lib/hooks/quran/useQuran";
import QuranData from "@/lib/quran/arabic/ar.json";
import { useQuranAudio } from "@/contexts/QuranAudioContext";
import AyahBlock from "../quran-reading/AyahBlock";
import { DailyVerseAudio } from "./DailyVerseAudio";
import SurahInfo from "./SurahInfo";
import { useAyahWordSync } from "@/lib/hooks/daily-verse/useAyahWordSync";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quranBookmarkRepo } from "@/lib/database/sqlite/quran-bookmark/repository";
import { queryKeys } from "@/lib/query/queryKeys";
import { ShareCard } from "./ShareCard";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

type DailyVerseCardProps = {
  readonly isDark: boolean;
};

export default function DailyVerseCard({ isDark }: DailyVerseCardProps) {
  const { t } = useTranslation();
  const { getDailyAyah } = useQuran(QuranData, 1);
  const dailyAyah = getDailyAyah();
  const { play } = useQuranAudio();
  const queryClient = useQueryClient();
  const viewShotRef = useRef<View>(null);

  const {
    activeAyahNumber,
    setActiveAyahNumber,
    isPlaying,
    setIsPlaying,
    setIsSurahPlaybackActive,
    setCurrentSurahAyahIndex,
    setActiveWordIndex,
    activeWordIndex,
  } = useAudioStore();

  useEffect(() => {
    if (dailyAyah) setActiveAyahNumber(dailyAyah.number);
  }, [dailyAyah?.number, setActiveAyahNumber]);

  // Kelime takibi: günlük ayet çalarken activeWordIndex güncelle
  useAyahWordSync({
    ayahText: dailyAyah?.text,
    ayahNumber: dailyAyah?.number,
    surahNumber: dailyAyah?.surahNumber,
    verseNumberInSurah: dailyAyah?.numberInSurah,
  });

  // Query to check if the current Ayah is bookmarked
  const { data: isLiked, refetch: refetchIsLiked } = useQuery({
    queryKey: queryKeys.quranBookmarks.isBookmarked(dailyAyah?.number),
    queryFn: () => quranBookmarkRepo.isBookmarked(dailyAyah!.number),
    enabled: !!dailyAyah,
  });

  // Mutation to toggle bookmark
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (!dailyAyah) return;
      console.log("[DailyVerse] Toggling bookmark for ayah number:", dailyAyah.number);
      const currentlyLiked = await quranBookmarkRepo.isBookmarked(dailyAyah.number);
      console.log("[DailyVerse] Current liked status in DB:", currentlyLiked);
      if (currentlyLiked) {
        await quranBookmarkRepo.removeBookmark(dailyAyah.number);
        console.log("[DailyVerse] Removed bookmark successfully");
      } else {
        await quranBookmarkRepo.addBookmark(dailyAyah);
        console.log("[DailyVerse] Added bookmark successfully");
      }
    },
    onSuccess: () => {
      console.log("[DailyVerse] Mutation onSuccess triggering refetches...");
      refetchIsLiked();
      queryClient.invalidateQueries({ queryKey: queryKeys.quranBookmarks.list() });
    },
    onError: (err) => {
      console.error("[DailyVerse] Mutation error:", err);
      // Alert the error so it is visible in the UI for the user
      const Alert = require("react-native").Alert;
      Alert.alert("Error toggling bookmark", String(err));
    }
  });

  const handleAyahPress = (ayahNumber: number) => {
    if (activeAyahNumber === ayahNumber) {
      setIsPlaying(!isPlaying);
      return;
    }
    setIsSurahPlaybackActive(false);
    setCurrentSurahAyahIndex(null);
    setActiveWordIndex(0);
    play(ayahNumber);
  };

  const handleShare = async () => {
    try {
      if (!viewShotRef.current || !dailyAyah) return;
      // Capture the off-screen ShareCard view
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.9,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing card image:", error);
      // Fallback: share beautifully formatted text
      if (dailyAyah) {
        const text = `Salah - ${t("quran.dailyReflection")}\n\nبِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\n${dailyAyah.text}\n\n${
          dailyAyah.translationText ?? ""
        }\n\n— ${dailyAyah.surahArabicName} (${dailyAyah.surahTranslation}) - ${t("quran.ayah", { ayah: dailyAyah.numberInSurah })}`;
        await Share.share({ message: text });
      }
    }
  };

  if (!dailyAyah) return null;

  return (
    <View className="flex-1 flex-col justify-center p-5 gap-6 bg-white border border-gray-200 rounded-2xl">
      {/* Off-screen card for sharing capture */}
      <View style={{ position: "absolute", left: -9999, top: -9999 }}>
        <ShareCard ref={viewShotRef} ayah={dailyAyah} />
      </View>

      <Text
        className={clsx(
          "text-3xl md:text-4xl font-bold leading-loose py-2 text-center",
          isDark ? "text-text-primaryDark" : "text-text-primaryLight"
        )}
        style={{ lineHeight: 60 }}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </Text>
      <AyahBlock
        ayah={dailyAyah}
        onAyahPress={handleAyahPress}
        activeWordIndex={
          activeAyahNumber === dailyAyah.number ? activeWordIndex : -1
        }
        onLikePress={() => toggleLikeMutation.mutate()}
        onSharePress={handleShare}
        isLiked={!!isLiked}
      />
      <SurahInfo dailyAyah={dailyAyah} isDark={isDark} />
      <View
        className={clsx(
          "w-full h-[1px] rounded-full",
          isDark ? "bg-light" : "bg-primary-400"
        )}
      />
      <DailyVerseAudio
        dailyAyah={dailyAyah}
        isDark={isDark}
        handleAyahPress={handleAyahPress}
        onSharePress={handleShare}
        onLikePress={() => toggleLikeMutation.mutate()}
        isLiked={!!isLiked}
      />
    </View>
  );
}


