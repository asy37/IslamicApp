import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";

export const OnboardingBackButton = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => router.back()}
      className="flex-row items-center gap-1 mb-4"
    >
      <MaterialIcons
        name="arrow-back"
        size={24}
        color={isDark ? "#f5f5f5" : "#171717"}
      />
      <Text
        className={clsx(
          "text-base font-medium",
          isDark ? "text-text-primaryDark" : "text-text-primaryLight"
        )}
      >
        {t("common.back")}
      </Text>
    </Pressable>
  );
};
