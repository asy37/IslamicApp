import { ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import DailyVerseHeader from "@/components/daily-verse/DailyVerseHeader";
import DailyVerseCard from "@/components/daily-verse/DailyVerseCard";
import DateInfo from "@/components/daily-verse/DateInfo";
import SwipeHint from "@/components/daily-verse/SwipeHint";

export default function DailyVerseScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ScrollView
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <DailyVerseHeader isDark={isDark} />
      <DateInfo isDark={isDark} />
      <DailyVerseCard isDark={isDark} />
      <SwipeHint isDark={isDark} />
    </ScrollView>
  );
}
