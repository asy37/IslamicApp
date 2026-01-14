import { Text, View } from "react-native";
import { useState } from "react";
import QuranSettings from "./modals/QuranSettings";
import Button from "../button/Button";
import { TranslationMetadata } from "@/lib/database/sqlite/translation/repository";
import clsx from "clsx";
import { useAudioStore, useSurahStore } from "@/lib/storage/useQuranStore";

type QuranSubHeaderProps = {
  readonly isDark: boolean;
  readonly onOpenSurahModal: () => void;
  readonly setSelectTranslation: (item: TranslationMetadata) => void;
  readonly selectedTranslation: string | null;
};

export default function QuranSubHeader({
  isDark,
  onOpenSurahModal,
  setSelectTranslation,
  selectedTranslation,
}: QuranSubHeaderProps) {
  const [settingsModal, setSettingsModal] = useState(false);
  const { surahName, surahEnglishName, juz, surahNumber } = useSurahStore();
  const {
    audioMode,
    audioNumber,
    setAudioMode,
    setAudioNumber,
    isPlaying,
    setIsPlaying,
  } = useAudioStore();

  const handlePlayAudio = (surahNum: number) => {
    // Eğer aynı sure seçiliyse play/pause toggle, değilse yeni sure çal
    if (audioNumber === surahNum && audioMode === "surah") {
      setIsPlaying(!isPlaying);
    } else {
      setAudioMode("surah");
      setAudioNumber(surahNum);
      setIsPlaying(true);
    }
  };
  return (
    <>
      <View
        className={clsx(
          "z-10 flex-row items-center justify-between border-b px-5 py-3 ",
          isDark
            ? "border-b border-primary-100"
            : " border-b border-primary-500"
        )}
      >
        <Button
          onPress={onOpenSurahModal}
          isDark={isDark}
          leftIcon="menu-open"
          size="small"
          backgroundColor="primary"
        />
        <View className="items-center">
          <Text
            className={clsx(
              "text-lg font-bold leading-tight ",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}
          >
            {surahEnglishName} / {surahName}
          </Text>
          <Text className="text-xs font-medium uppercase tracking-wide text-primary-500">
            {juz ? `Juz ${juz}` : ""}
          </Text>
          <Button
            onPress={() => handlePlayAudio(surahNumber)}
            isDark={isDark}
            leftIcon={
              audioMode === "surah" && isPlaying ? "pause" : "play-arrow"
            }
            size="small"
            backgroundColor="primary"
          />
        </View>
        <Button
          onPress={() => setSettingsModal(true)}
          isDark={isDark}
          leftIcon="settings"
          size="small"
          backgroundColor="primary"
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
