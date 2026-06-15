import React from "react";
import { View } from "react-native";
import clsx from "clsx";
import ModalComponent from "@/lib/components/modal/ModalComponent";
import AyahBlock from "@/features/quran/components/AyahBlock";
import SurahInfo from "@/features/daily-verse/components/SurahInfo";
import { DailyVerseAudio } from "@/features/daily-verse/components/DailyVerseAudio";
import { BookmarkedAyah } from "../types";

interface LikedVerseDetailModalProps {
    visible: boolean;
    onClose: () => void;
    selectedBookmark: BookmarkedAyah | null;
    activeAyahNumber: number | null;
    activeWordIndex: number;
    onAyahPress: (ayahNumber: number) => void;
    onLikePress: () => void;
    onSharePress: () => void;
    isDark: boolean;
}

export const LikedVerseDetailModal: React.FC<LikedVerseDetailModalProps> = ({
    visible,
    onClose,
    selectedBookmark,
    activeAyahNumber,
    activeWordIndex,
    onAyahPress,
    onLikePress,
    onSharePress,
    isDark,
}) => {
    if (!selectedBookmark) return null;

    return (
        <ModalComponent
            visible={visible}
            onClose={onClose}
            title={selectedBookmark.surahTranslation}
            scrollable={true}
        >
            <View className="p-2 gap-4 ">
                <AyahBlock
                    ayah={selectedBookmark}
                    onAyahPress={onAyahPress}
                    activeWordIndex={
                        activeAyahNumber === selectedBookmark.number ? activeWordIndex : -1
                    }
                    onLikePress={onLikePress}
                    onSharePress={onSharePress}
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
                    handleAyahPress={onAyahPress}
                    onSharePress={onSharePress}
                    onLikePress={onLikePress}
                    isLiked={true}
                />
            </View>
        </ModalComponent>
    );
};
