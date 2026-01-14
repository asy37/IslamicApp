import { View, useColorScheme } from "react-native";
import React, { useState } from "react";
import clsx from "clsx";
import QuranSubHeader from "@/components/quran-reading/QuranSubHeader";
import QuranContent from "@/components/quran-reading/QuranContent";
import QuranAudioPlayer from "@/components/quran-reading/QuranAudioPlayer";
import { useQuran } from "@/lib/hooks/useQuran";
import QuranData from "@/lib/quran/arabic/ar.json";
import { useTranslationByIdentifier } from "@/lib/hooks/useTranslationByIdentifier";
import SurahSelectionModal from "@/components/quran-reading/modals/SurahSelectionModal";
import { TranslationMetadata } from "@/lib/database/sqlite/translation/repository";
import { useAudioPlayer } from "@/lib/hooks/useAudioPlayer";

export default function QuranScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSurahModalVisible, setIsSurahModalVisible] = useState(false);
  const [selectedTranslation, setSelectedTranslation] =
    useState<TranslationMetadata | null>(null);

  // Audio player hook'u sadece burada çağrılır
  useAudioPlayer();

  const { translation: quran } = useTranslationByIdentifier(
    selectedTranslation?.edition_identifier || null
  );
  const { ayahs, goNext, goPrev, setCurrentSurahNumber } = useQuran(
    QuranData,
    1,
    quran?.surahs ? { surahs: quran.surahs } : undefined
  );

  return (
    <View
      className={clsx(
        "relative flex-1",
        isDark ? "flex-1 bg-background-dark" : "flex-1 bg-background-light"
      )}
    >
      <QuranSubHeader
        setSelectTranslation={setSelectedTranslation}
        selectedTranslation={selectedTranslation?.edition_identifier || null}
        isDark={isDark}
        onOpenSurahModal={() => setIsSurahModalVisible(true)}
      />

      <QuranContent
        isDark={isDark}
        ayahs={ayahs}
        goNext={goNext}
        goPrev={goPrev}
      />
      <QuranAudioPlayer
        isDark={isDark}
      />
      <SurahSelectionModal
        setCurrentPage={setCurrentSurahNumber}
        visible={isSurahModalVisible}
        onClose={() => setIsSurahModalVisible(false)}
      />
    </View>
  );
}
