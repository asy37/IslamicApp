import { View } from "react-native";
import clsx from "clsx";
import { useTheme } from "@/lib/storage/useThemeStore";
import Button from "@/lib/components/button/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import ProfileForm from "../components/ProfileForm";

export const ProfileView = () => {
    const { isDark } = useTheme();

    return (
        <View
            className={clsx(
                "flex-1 items-start justify-center p-4 w-full",
                isDark ? "bg-background-dark" : "bg-background-light"
            )}
        >
            <Button onPress={() => router.back()} size="small" backgroundColor="primary">
                <MaterialIcons
                    name="arrow-back"
                    size={20}
                    color={"white"}
                />
            </Button>
            <ProfileForm />
        </View>
    )
}