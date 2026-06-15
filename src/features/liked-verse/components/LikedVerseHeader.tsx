import React from "react";
import { View, Text } from "react-native";
import clsx from "clsx";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "@/lib/components/button/Button";

interface LikedVerseHeaderProps {
    onBack: () => void;
    title: string;
    isDark: boolean;
}

export const LikedVerseHeader: React.FC<LikedVerseHeaderProps> = ({
    onBack,
    title,
    isDark,
}) => {
    return (
        <View className="flex-row items-center p-6 justify-between z-10">
            <Button onPress={onBack} size="small" backgroundColor="primary">
                <MaterialIcons name="arrow-back" color="#fff" size={20} />
            </Button>
            <View className="flex-col items-center">
                <Text
                    className={clsx(
                        "text-lg font-bold tracking-tight",
                        isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                    )}
                >
                    {title}
                </Text>
            </View>
            <View style={{ width: 40 }} />
        </View>
    );
};
