import { getSurahTranslationName } from "@/lib/quran/utils/surahTranslation";
import { Ayah } from "@/types/quran";
import { BookmarkedAyah } from "../types";

export const formatBookmarks = (rawBookmarks: Ayah[], language: string): BookmarkedAyah[] => {
    return rawBookmarks.map((item) => ({
        ...item,
        surahTranslation: getSurahTranslationName(item.surahNumber ?? 1, language),
    }));
};

export const getBookmarkShareText = (
    bookmark: BookmarkedAyah,
    t: (key: string, options?: any) => string
): string => {
    return `Salah - ${t("quran.likedVerses")}\n\n${t("quran.basmala")}\n\n${bookmark.text}\n\n${
        bookmark.translationText ?? ""
    }\n\n— ${bookmark.surahArabicName} (${bookmark.surahTranslation ?? ""}) - ${t("quran.ayah", {
        ayah: bookmark.numberInSurah,
    })}`;
};
