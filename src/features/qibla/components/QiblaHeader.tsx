import clsx from "clsx";
import { View, Text } from "react-native";
import { useTranslation } from "@/lib/i18n";

type QiblaHeaderProps = {
  readonly isDark: boolean;
};

export default function QiblaHeader({ isDark }: QiblaHeaderProps) {
  const { t } = useTranslation();
  return (
    <View className="flex-row items-center p-6 pb-2 justify-between z-10">
      <View className="flex-1 items-center">
        <Text
          className={clsx(
            "text-lg font-bold leading-tight tracking-wide",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {t("qibla.qiblaFinder")}
        </Text>
        {!isDark && (
          <Text className="text-xs text-text-secondary-light font-medium mt-0.5">
            {t("qibla.turnToKaaba")}
          </Text>
        )}
      </View>
    </View>
  );
}
