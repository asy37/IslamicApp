import { ScrollView, View, Text, TouchableOpacity, Share } from "react-native";
import clsx from "clsx";
import { useTheme } from "@/lib/storage/useThemeStore";
import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { quranBookmarkRepo } from "@/lib/database/sqlite/quran-bookmark/repository";
import { queryKeys } from "@/lib/query/queryKeys";
import { useTranslation } from "@/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/components/theme/colors";
import ModalComponent from "@/components/modal/ModalComponent";
import AyahBlock from "@/components/quran-reading/AyahBlock";
import SurahInfo from "@/components/daily-verse/SurahInfo";
import { DailyVerseAudio } from "@/components/daily-verse/DailyVerseAudio";
import { ShareCard } from "@/components/daily-verse/ShareCard";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Ayah } from "@/types/quran";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { useQuranAudio } from "@/contexts/QuranAudioContext";
import Button from "@/components/button/Button";
import { useRouter } from "expo-router";
import { getSurahTranslationName } from "@/lib/quran/utils/surahTranslation";

export default function LikedVersesScreen() {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { play } = useQuranAudio();
  const shareViewShotRef = useRef<View>(null);

  const [selectedBookmarkState, setSelectedBookmarkState] = useState<Ayah | null>(null);
  const setSelectedBookmark = setSelectedBookmarkState;

  const {
    activeAyahNumber,
    isPlaying,
    setIsPlaying,
    setIsSurahPlaybackActive,
    setCurrentSurahAyahIndex,
    setActiveWordIndex,
    activeWordIndex,
  } = useAudioStore();

  // Query liked verses list
  const { data: rawBookmarks = [], refetch: refetchBookmarks } = useQuery({
    queryKey: queryKeys.quranBookmarks.list(),
    queryFn: () => quranBookmarkRepo.getBookmarks(),
  });

  const bookmarks = React.useMemo(() => {
    return rawBookmarks.map((item) => ({
      ...item,
      surahTranslation: getSurahTranslationName(item.surahNumber ?? 1, i18n.language),
    }));
  }, [rawBookmarks, i18n.language]);

  const selectedBookmark = React.useMemo(() => {
    if (!selectedBookmarkState) return null;
    return bookmarks.find((b) => b.number === selectedBookmarkState.number) ?? {
      ...selectedBookmarkState,
      surahTranslation: getSurahTranslationName(selectedBookmarkState.surahNumber ?? 1, i18n.language),
    };
  }, [selectedBookmarkState, bookmarks, i18n.language]);

  const handleBookmarkAyahPress = (ayahNumber: number) => {
    if (activeAyahNumber === ayahNumber) {
      setIsPlaying(!isPlaying);
      return;
    }
    setIsSurahPlaybackActive(false);
    setCurrentSurahAyahIndex(null);
    setActiveWordIndex(0);
    play(ayahNumber);
  };

  const handleBookmarkUnlike = async () => {
    if (!selectedBookmark) return;
    try {
      await quranBookmarkRepo.removeBookmark(selectedBookmark.number);
      refetchBookmarks();
      setSelectedBookmark(null);
      // Invalidate all bookmarks caches to sync icon states everywhere (including Quran page)
      queryClient.invalidateQueries({ queryKey: queryKeys.quranBookmarks.all });
    } catch (err) {
      console.error("[LikedVersesScreen] Error removing bookmark:", err);
      const Alert = require("react-native").Alert;
      Alert.alert("Error removing bookmark", String(err));
    }
  };

  const handleBookmarkShare = async () => {
    try {
      if (!shareViewShotRef.current || !selectedBookmark) return;
      const uri = await captureRef(shareViewShotRef, {
        format: "png",
        quality: 0.9,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing bookmarked card image:", error);
      if (selectedBookmark) {
        const text = `Salah - ${t("quran.likedVerses")}\n\nبِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\n\n${selectedBookmark.text}\n\n${selectedBookmark.translationText ?? ""
          }\n\n— ${selectedBookmark.surahArabicName} (${selectedBookmark.surahTranslation}) - ${t("quran.ayah", { ayah: selectedBookmark.numberInSurah })}`
        await Share.share({ message: text });
      }
    }
  };

  return (
    <ScrollView
      className={clsx(
        "flex-1 p-4",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
      contentContainerStyle={{ paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Off-screen card for sharing capture */}
      {selectedBookmark && (
        <View style={{ position: "absolute", left: -9999, top: -9999 }}>
          <ShareCard ref={shareViewShotRef} ayah={selectedBookmark} />
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center p-6 justify-between z-10">
        <Button
          onPress={() => router.back()}
          size="small"
          backgroundColor="primary"
        >
          <MaterialIcons name="arrow-back" color="#fff" size={20} />
        </Button>
        <View className="flex-col items-center">
          <Text
            className={clsx(
              "text-lg font-bold tracking-tight",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}
          >
            {t("quran.likedVerses")}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Bookmarks List */}
      <View className="px-2">
        {bookmarks.length === 0 ? (
          <View
            className={clsx(
              "p-8 rounded-xl border border-dashed items-center justify-center mt-6",
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-gray-50 border-gray-200"
            )}
          >
            <MaterialIcons
              name="favorite-border"
              size={48}
              color={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
              style={{ marginBottom: 12, opacity: 0.5 }}
            />
            <Text
              className={clsx(
                "text-sm font-medium text-center",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              {t("quran.noLikedVerses")}
            </Text>
          </View>
        ) : (
          <View className="gap-2 mt-4">
            {bookmarks.map((item, index) => (
              <TouchableOpacity
                key={`${item.number}-${index}`}
                onPress={() => setSelectedBookmark(item)}
                className={clsx(
                  "flex-row items-center justify-between p-4 rounded-xl border",
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-100 shadow-sm"
                )}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={clsx(
                      "p-2 rounded-lg",
                      isDark ? "bg-primary-500/10" : "bg-primary-50"
                    )}
                  >
                    <MaterialIcons
                      name="bookmark"
                      size={20}
                      color={colors.primary[500]}
                    />
                  </View>
                  <View>
                    <Text
                      className={clsx(
                        "font-semibold text-sm",
                        isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                      )}
                    >
                      {item.surahArabicName} ({item.surahTranslation})
                    </Text>
                    <Text
                      className={clsx(
                        "text-xs mt-0.5",
                        isDark
                          ? "text-text-secondaryDark"
                          : "text-text-secondaryLight"
                      )}
                    >
                      {t("quran.ayah", { ayah: item.numberInSurah })} • {t("quran.juz", { juz: item.juz })}
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={
                    isDark
                      ? colors.text.secondaryDark
                      : colors.text.secondaryLight
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Bookmark Detail Modal */}
      {selectedBookmark && (
        <ModalComponent
          visible={!!selectedBookmark}
          onClose={() => setSelectedBookmark(null)}
          title={selectedBookmark.surahTranslation}
          scrollable={true}
        >
          <View className="p-2 gap-4 ">
            <AyahBlock
              ayah={selectedBookmark}
              onAyahPress={handleBookmarkAyahPress}
              activeWordIndex={
                activeAyahNumber === selectedBookmark.number
                  ? activeWordIndex
                  : -1
              }
              onLikePress={handleBookmarkUnlike}
              onSharePress={handleBookmarkShare}
              isLiked={true}
            />
            <View className="mt-2">
              <SurahInfo dailyAyah={selectedBookmark} isDark={isDark} />
            </View>
            <View
              className={clsx(
                "w-full h-[1px] rounded-full my-2",
                isDark ? "bg-light" : "bg-primary-400"
              )}
            />
            <DailyVerseAudio
              dailyAyah={selectedBookmark}
              isDark={isDark}
              handleAyahPress={handleBookmarkAyahPress}
              onSharePress={handleBookmarkShare}
              onLikePress={handleBookmarkUnlike}
              isLiked={true}
            />
          </View>
        </ModalComponent>
      )}
    </ScrollView>
  );
}
