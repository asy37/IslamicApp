import { Text, View } from "react-native";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n";

export default function VersionInfo({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  return (
    <View className="mt-10 mb-8 items-center">
      <Text
        className={clsx(
          "text-xs font-medium",
          isDark ? "text-text-secondaryDark/60" : "text-text-secondaryLight"
        )}
      >
        {t("settings.version", { version: "2.4.0", build: "152" })}
      </Text>
      <Text
        className={clsx(
          "text-xs mt-1",
          isDark ? "text-text-secondaryDark/60" : "text-text-secondaryLight"
        )}
      >
        © 2024 Muslim Life App
      </Text>
    </View>
  );
}

