import { FlatList } from "react-native";
import AyahBlock from "./AyahBlock";
import { Ayah } from "@/types/quran";
import PageIndicator from "./PageIndicator";
import { useEffect, useRef } from "react";

type QuranContentProps = Readonly<{
  ayahs: Ayah[];
  isDark: boolean;
  goNext: () => void;
  goPrev: () => void;
  numberOfSurah: number;
}>;
export default function QuranContent({
  isDark,
  ayahs,
  goNext,
  goPrev,
  numberOfSurah,
}: QuranContentProps) {
  const listRef = useRef<FlatList<Ayah>>(null);
  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [ayahs]);

  return (
    <FlatList
      ref={listRef}
      data={ayahs}
      keyExtractor={(item) => `${item.number}-${item.numberInSurah}`}
      renderItem={({ item }) => <AyahBlock ayah={item} isDark={isDark} />}
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      windowSize={5}
      removeClippedSubviews
      scrollsToTop={true}
      ListFooterComponent={() => (
        <PageIndicator
          goPrev={goPrev}
          goNext={goNext}
          isDark={isDark}
          numberOfSurah={numberOfSurah}
        />
      )}
    />
  );
}
