import { View, useColorScheme } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import QuranSubHeader from "@/components/quran-reading/QuranSubHeader";
import QuranContent from "@/components/quran-reading/QuranContent";
import AudioPlayer from "@/components/quran-reading/QuranAudioPlayer";
import { useQuran } from "@/lib/hooks/useQuran";
import QuranData from "@/lib/quran/arabic/ar.json";
import { useTranslationByIdentifier } from "@/lib/hooks/useTranslationByIdentifier";
import SurahSelectionModal from "@/components/quran-reading/modals/SurahSelectionModal";
import { TranslationMetadata } from "@/lib/database/sqlite/translation/repository";

export default function QuranScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSurahModalVisible, setIsSurahModalVisible] = useState(false);
  const [selectedTranslation, setSelectedTranslation] =
    useState<TranslationMetadata | null>(null);

  const { translation: quran } = useTranslationByIdentifier(
    selectedTranslation?.edition_identifier || null
  );
  const { surah, ayahs, goNext, goPrev, setCurrentSurahNumber } = useQuran(
    QuranData,
    1,
    quran?.surahs ? { surahs: quran.surahs } : undefined
  );
  const juz = surah?.ayahs[0]?.juz;
  const surahName = surah?.name;
  const surahTranslation = surah?.englishNameTranslation;
  const numberOfSurah = surah?.number;

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
        surahName={surahName}
        surahTranslation={surahTranslation}
        juz={juz}
      />

      <QuranContent
        isDark={isDark}
        ayahs={ayahs}
        numberOfSurah={numberOfSurah}
        goNext={goNext}
        goPrev={goPrev}
      />
      <AudioPlayer isDark={isDark} />
      <SurahSelectionModal
        setCurrentPage={setCurrentSurahNumber}
        visible={isSurahModalVisible}
        onClose={() => setIsSurahModalVisible(false)}
        numberOfSurah={numberOfSurah}
      />
    </View>
  );
}
