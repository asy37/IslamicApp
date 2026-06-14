import { Text, View } from "react-native";
import clsx from "clsx";
import { useTranslation } from "@/i18n";

export default function VersionInfo({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  return (
    <View className="flex-col items-center justify-center pb-8 pt-4">
      <Text
        className={clsx(
          "text-xs opacity-60",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        {t("settings.version", { version: "1.0.2", build: "1" })}
      </Text>
    </View>
  );
}

