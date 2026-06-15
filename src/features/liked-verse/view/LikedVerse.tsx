import { ScrollView, View, Share } from "react-native";
import clsx from "clsx";
import { useTheme } from "@/lib/storage/useThemeStore";
import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { quranBookmarkRepo } from "@/lib/sqlite/quran-bookmark/repository";
import { queryKeys } from "@/lib/query/queryKeys";
import { useTranslation } from "@/lib/i18n";
import { ShareCard } from "@/features/daily-verse/components/ShareCard";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { useQuranAudio } from "@/lib/contexts/QuranAudioContext";
import { useRouter } from "expo-router";

import { BookmarkedAyah } from "../types";
import { formatBookmarks, getBookmarkShareText } from "../utils";
import {
    LikedVerseHeader,
    LikedVerseEmptyState,
    LikedVerseItem,
    LikedVerseDetailModal,
} from "../components";

export const LikedVerseView = () => {
    const { isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { play } = useQuranAudio();
    const shareViewShotRef = useRef<View>(null);

    const [selectedBookmarkState, setSelectedBookmarkState] = useState<BookmarkedAyah | null>(null);
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
        return formatBookmarks(rawBookmarks, i18n.language);
    }, [rawBookmarks, i18n.language]);

    const selectedBookmark = React.useMemo(() => {
        if (!selectedBookmarkState) return null;
        return bookmarks.find((b) => b.number === selectedBookmarkState.number) ?? {
            ...selectedBookmarkState,
            surahTranslation: formatBookmarks([selectedBookmarkState], i18n.language)[0].surahTranslation,
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
                const text = getBookmarkShareText(selectedBookmark, t);
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
            <LikedVerseHeader
                onBack={() => router.back()}
                title={t("quran.likedVerses")}
                isDark={isDark}
            />

            {/* Bookmarks List */}
            <View className="px-2">
                {bookmarks.length === 0 ? (
                    <LikedVerseEmptyState
                        isDark={isDark}
                        message={t("quran.noLikedVerses")}
                    />
                ) : (
                    <View className="gap-2 mt-4">
                        {bookmarks.map((item, index) => (
                            <LikedVerseItem
                                key={`${item.number}-${index}`}
                                item={item}
                                onPress={() => setSelectedBookmark(item)}
                                isDark={isDark}
                                t={t}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* Bookmark Detail Modal */}
            <LikedVerseDetailModal
                visible={!!selectedBookmark}
                onClose={() => setSelectedBookmark(null)}
                selectedBookmark={selectedBookmark}
                activeAyahNumber={activeAyahNumber}
                activeWordIndex={activeWordIndex}
                onAyahPress={handleBookmarkAyahPress}
                onLikePress={handleBookmarkUnlike}
                onSharePress={handleBookmarkShare}
                isDark={isDark}
            />
        </ScrollView>
    );
};

