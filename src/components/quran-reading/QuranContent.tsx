import {
  FlatList,
  View,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import AyahBlock from "./AyahBlock";
import { Ayah } from "@/types/quran";
import PageIndicator from "./PageIndicator";
import { useEffect, useRef, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { useSurahStore } from "@/lib/storage/useQuranStore";

type QuranContentProps = Readonly<{
  ayahs: Ayah[];
  isDark: boolean;
  goNext: () => void;
  goPrev: () => void;
}>;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5;

export default function QuranContent({
  isDark,
  ayahs,
  goNext,
  goPrev,
}: QuranContentProps) {
  const listRef = useRef<FlatList<Ayah>>(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const { surahNumber } = useSurahStore();

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    translateX.setValue(0);
  }, [ayahs, translateX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.dx) > 10
          );
        },
        onPanResponderMove: (_, gestureState) => {
          translateX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          const swipeDistance = gestureState.dx;
          const isSwipeLeft = swipeDistance < 0;

          if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            const targetX = isSwipeLeft ? -SCREEN_WIDTH : SCREEN_WIDTH;
            Animated.timing(translateX, {
              toValue: targetX,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              if (isSwipeLeft) {
                goPrev();
              } else {
                goNext();
              }
              translateX.setValue(0);
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [goNext, goPrev, translateX]
  );

  const footerComponent = useMemo(
    () => (
      <PageIndicator
        goPrev={goPrev}
        goNext={goNext}
        isDark={isDark}
        numberOfSurah={surahNumber}
      />
    ),
    [goPrev, goNext, isDark, surahNumber]
  );

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX }],
        }}
      >
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
          ListFooterComponent={footerComponent}
        />
      </Animated.View>
    </View>
  );
}
