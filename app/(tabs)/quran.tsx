import { View, useColorScheme } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import QuranSubHeader from "@/components/quran-reading/QuranSubHeader";
import QuranContent from "@/components/quran-reading/QuranContent";
import AudioPlayer from "@/components/quran-reading/QuranAudioPlayer";
import SurahSelectionModal from "@/components/quran-reading/SurahSelectionModal";

const AYAT = [
  {
    number: 1,
    arabic:
      "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    translation:
      "Hükümranlık elinde olan Allah, yücedir ve O her şeye hakkıyla gücü yetendir.",
  },
  {
    number: 2,
    arabic:
      "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
    translation:
      "O ki, hanginizin daha güzel iş yapacağını denemek için ölümü ve hayatı yarattı. O, mutlak güç sahibidir, çok bağışlayandır.",
  },
  {
    number: 3,
    arabic:
      "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    translation:
      "O ki, birbiri ile ahenkli yedi göğü yaratmıştır. Rahmân'ın yaratışında hiçbir uyumsuzluk göremezsin. Gözünü çevir de bir bak, bir bozukluk görüyor musun?",
  },
  {
    number: 4,
    arabic:
      "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
    translation:
      "Sonra gözünü, tekrar tekrar çevir bak; göz (aradığı bozukluğu bulamayıp) âciz ve bitkin halde sana dönecektir.",
  },
];

export default function QuranScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSurahModalVisible, setIsSurahModalVisible] = useState(false);

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
      />

      {/* Progres bar (sayfa ilerleme) */}
      <View
        className={
          "sticky top-0 h-0.5 w-full " +
          (isDark ? "bg-border-dark" : "bg-border-light")
        }
      >
        <View className="h-full w-[35%] bg-primary-500" />
      </View>

      <QuranContent isDark={isDark} ayats={AYAT} />
      <AudioPlayer isDark={isDark} />
      <SurahSelectionModal
        visible={isSurahModalVisible}
        onClose={() => setIsSurahModalVisible(false)}
      />
    </View>
  );
}

export type Ayah = (typeof AYAT)[number];
