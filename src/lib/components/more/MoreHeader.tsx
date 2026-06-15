import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import clsx from "clsx";
import { colors } from "@/lib/components/theme/colors";
import { useTranslation } from "@/lib/i18n";

export default function MoreHeader({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();

  return (
    <View
      className={clsx(
        "pt-12 px-6 pb-2",
        isDark ? "bg-background-dark/95" : "bg-background-light/95"
      )}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text
          className={clsx(
            "text-3xl font-bold tracking-tight",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {t("more.title")}
        </Text>
      </View>
      <Text
        className={clsx(
          "text-base font-normal",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        {t("more.subtitle")}
      </Text>
    </View>
  );
}

