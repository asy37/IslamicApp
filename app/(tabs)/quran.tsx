import { View, useColorScheme } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import QuranSubHeader from "@/components/quran-reading/QuranSubHeader";
import QuranContent from "@/components/quran-reading/QuranContent";
import AudioPlayer from "@/components/quran-reading/QuranAudioPlayer";
import SurahSelectionModal from "@/components/quran-reading/SurahSelectionModal";
import { useQuran } from "@/lib/hooks/useQuran";

export default function QuranScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSurahModalVisible, setIsSurahModalVisible] = useState(false);
  const { surah, ayahs, goNext, goPrev, setCurrentSurahNumber } = useQuran();
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
      />
    </View>
  );
}
