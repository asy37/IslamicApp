import React from "react";
import { View } from "react-native";
import clsx from "clsx";
import { useQuran } from "@/features/quran/hooks/useQuran";
import QuranData from "@/features/quran/quran-text/arabic/ar.json";
import { useSurahPlayer } from "@/lib/components/audio-player/hooks/useSurahPlayer";
import { useAudioStore } from "@/lib/storage/useQuranStore";
import { useAyahWordSync } from "@/features/quran/hooks/useAyahWordSync";
import { useTheme } from "@/lib/storage/useThemeStore";
import { ShareCard } from "@/features/daily-verse/components/ShareCard";
import QuranSubHeader from "../components/QuranSubHeader";
import QuranContent from "../components/QuranContent";
import QuranAudioPlayer from "../../../lib/components/audio-player/view/QuranAudioPlayer";
import SurahSelectionModal from "../components/modals/SurahSelectionModal";
import { useQuranBookmarks, useQuranShare } from "../hooks";

export const QuranView = () => {
    const { isDark } = useTheme();
    const [isSurahModalVisible, setIsSurahModalVisible] = React.useState(false);

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
    const surahPlayer = useSurahPlayer(surah.ayahs, () => {
        // Sayfa değişimi callback'i - useQuran'ın sayfa geçiş mantığı zaten var
    });

    // Kelime highlight için positionMillis'e göre activeWordIndex güncelle
    useAyahWordSync({
        surahNumber: surah.number,
        ayahs: surah.ayahs,
    });

    // Bookmarks / Likes hook
    const { likedAyahNumbers, toggleBookmark } = useQuranBookmarks();

    // Share card / text hook
    const { shareAyah, shareViewShotRef, handleShare } = useQuranShare();

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
                onLikePress={toggleBookmark}
                onSharePress={handleShare}
                likedAyahNumbers={likedAyahNumbers}
            />
            <QuranAudioPlayer />
            <SurahSelectionModal
                setCurrentPage={setCurrentSurahNumber}
                visible={isSurahModalVisible}
                onClose={() => setIsSurahModalVisible(false)}
            />
        </View>
    );
};