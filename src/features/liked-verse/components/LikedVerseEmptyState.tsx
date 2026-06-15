import React from "react";
import { View, Text } from "react-native";
import clsx from "clsx";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/lib/components/theme/colors";

interface LikedVerseEmptyStateProps {
    isDark: boolean;
    message: string;
}

export const LikedVerseEmptyState: React.FC<LikedVerseEmptyStateProps> = ({
    isDark,
    message,
}) => {
    return (
        <View
            className={clsx(
                "p-8 rounded-xl border border-dashed items-center justify-center mt-6",
                isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
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
                {message}
            </Text>
        </View>
    );
};
