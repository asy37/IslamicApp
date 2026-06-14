import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";
import Button from "../button/Button";
import { colors } from "@/components/theme/colors";
import QuranSettings from "../quran-reading/modals/QuranSettings";
import { useTranslation } from "@/i18n";
import { useState } from "react";

type DailyVerseHeaderProps = {
  readonly isDark: boolean;
};

export default function DailyVerseHeader({ isDark }: DailyVerseHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [translationModal, setTranslationModal] = useState(false);
  return (
    <View className="flex-row items-center p-6 justify-between z-10">
      <Button onPress={() => router.back()} size="small" backgroundColor="primary">
        <MaterialIcons
          name="arrow-back"
          color={"#fff"}
          size={20}
        />
      </Button>
      <View className="flex-col items-center">
        <Text
          className={clsx(
            "text-lg font-bold tracking-tight",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {t("quran.dailyReflection")}
        </Text>
      </View>
      <Button onPress={() => setTranslationModal(true)}
        leftIcon="settings"
        size="small"
        backgroundColor="primary"
      />
      <QuranSettings
        visible={translationModal}
        onClose={() => setTranslationModal(false)}
      />
    </View >
  );
}

