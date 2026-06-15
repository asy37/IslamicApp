import { View } from "react-native";
import Button from "@/lib/components/button/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import type { DhikrHeaderProps } from "@/features/dhikir/types";

export default function DhikrHeader({ isDark, setOpenAddDhikrModal }: DhikrHeaderProps) {
    return (
        <View className="w-full flex-row items-center justify-between px-4">
            <Button onPress={() => router.back()} size="small" backgroundColor="primary">
                <MaterialIcons
                    name="arrow-back"
                    size={20}
                    color={"white"}
                />
            </Button>
            <Button onPress={() => setOpenAddDhikrModal(true)} size="small" backgroundColor="primary">
                <MaterialIcons name="add" size={20} color={"white"} />
            </Button>
        </View>
    );
}