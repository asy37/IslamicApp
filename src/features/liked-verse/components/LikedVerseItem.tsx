import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/lib/components/theme/colors";
import { BookmarkedAyah } from "../types";

interface LikedVerseItemProps {
    item: BookmarkedAyah;
    onPress: () => void;
    isDark: boolean;
    t: (key: string, options?: any) => string;
}

export const LikedVerseItem: React.FC<LikedVerseItemProps> = ({ item, onPress, isDark, t }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={clsx(
                "flex-row items-center justify-between p-4 rounded-xl border",
                isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm"
            )}
        >
            <View className="flex-row items-center gap-3">
                <View
                    className={clsx(
                        "p-2 rounded-lg",
                        isDark ? "bg-primary-500/10" : "bg-primary-50"
                    )}
                >
                    <MaterialIcons name="bookmark" size={20} color={colors.primary[500]} />
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
                            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                        )}
                    >
                        {t("quran.ayah", { ayah: item.numberInSurah })} •{" "}
                        {t("quran.juz", { juz: item.juz })}
                    </Text>
                </View>
            </View>
            <MaterialIcons
                name="chevron-right"
                size={20}
                color={isDark ? colors.text.secondaryDark : colors.text.secondaryLight}
            />
        </TouchableOpacity>
    );
};
