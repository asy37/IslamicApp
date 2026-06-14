import { View } from "react-native";
import clsx from "clsx";
import ProfileForm from "@/components/profile/ProfileForm/ProfileForm";
import { useTheme } from "@/lib/storage/useThemeStore";
import Button from "@/components/button/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
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
  );
}

