import { ScrollView, Text, View } from "react-native";
import AyahBlock from "./AyahBlock";
import { Ayah } from "@/types/quran";

export default function QuranContent({
  isDark,
  ayats,
}: {
  isDark: boolean;
  ayats: Ayah[];
}) {
  return (
    <ScrollView
      className="flex-1 px-5"
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Bismillah */}
      <View className="select-none items-center py-10 opacity-90">
        <Text
          className={
            "text-3xl " +
            (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
          }
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </Text>
      </View>

      {/* Ayetler */}
      {ayats.map((ayah) => (
        <AyahBlock key={ayah.number} ayah={ayah} isDark={isDark} />
      ))}

      <View className="py-10">
        <Text
          className={
            "text-center text-sm font-medium tracking-[0.2em] uppercase " +
            (isDark
              ? "text-text-secondaryDark/40"
              : "text-text-secondaryLight/60")
          }
        >
          Page 562 / 604
        </Text>
      </View>
    </ScrollView>
  );
}
