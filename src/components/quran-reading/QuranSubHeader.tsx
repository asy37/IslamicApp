import { Text, View } from "react-native";
import { useState } from "react";
import QuranSettings from "./modals/QuranSettings";
import Button from "../button/Button";
import { TranslationMetadata } from "@/lib/database/sqlite/translation/repository";

type QuranSubHeaderProps = {
  readonly isDark: boolean;
  readonly onOpenSurahModal: () => void;
  readonly surahName: string;
  readonly surahTranslation: string;
  readonly juz: number;
  readonly setSelectTranslation: (item: TranslationMetadata) => void;
  readonly selectedTranslation: string | null;
};

export default function QuranSubHeader({
  isDark,
  onOpenSurahModal,
  surahName,
  surahTranslation,
  juz,
  setSelectTranslation,
  selectedTranslation,
}: QuranSubHeaderProps) {
  const [settingsModal, setSettingsModal] = useState(false);

  return (
    <>
      <View
        className={
          "z-10 flex-row items-center justify-between border-b px-5 py-3 " +
          (isDark
            ? "border-b border-primary-100"
            : " border-b border-primary-500")
        }
      >
        <Button onPress={onOpenSurahModal} isDark={isDark} icon="menu-open" />
        <View className="items-center">
          <Text
            className={
              "text-lg font-bold leading-tight " +
              (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
            }
          >
            {surahTranslation} / {surahName}
          </Text>
          <Text className="text-xs font-medium uppercase tracking-wide text-primary-500">
            {juz ? `Juz ${juz}` : ""}
          </Text>
        </View>

        <Button
          onPress={() => setSettingsModal(true)}
          isDark={isDark}
          icon="settings"
        />
      </View>
      <QuranSettings
        setSelectTranslation={setSelectTranslation}
        selectedTranslation={selectedTranslation}
        isDark={isDark}
        visible={settingsModal}
        onClose={() => setSettingsModal(false)}
      />
    </>
  );
}
