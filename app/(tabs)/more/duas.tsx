import { ScrollView, useColorScheme, View } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import DuasHeader from "@/components/duas/DuasHeader";
import FilterTabs from "@/components/duas/FilterTabs";
import DailyReflectionCard from "@/components/duas/DailyReflectionCard";
import DuasList from "@/components/duas/DuasList";
import FloatingActionButton from "@/components/duas/FloatingActionButton";

const DUAS = [
  {
    id: "1",
    date: "12 Ramadan 1445",
    text: "Oh Allah, grant my parents health, long life, and fill their hearts with tranquility. Protect them as they protected me when I was small.",
    status: "pending" as const,
    isFavorite: false,
  },
  {
    id: "2",
    date: "2 Rajab 1445",
    text: "Guide me in my new job opportunity and make it a source of barakah for my family and my deen.",
    status: "answered" as const,
    isFavorite: true,
  },
  {
    id: "3",
    date: "15 Shaban 1445",
    text: "Ya Rabb, ease the hardship of my friend Ahmed and grant him shifa. You are the Healer.",
    status: "pending" as const,
    isFavorite: false,
  },
  {
    id: "4",
    date: "10 Shawwal 1444",
    text: "Oh Allah, bless me with knowledge that is beneficial and sustenance that is good.",
    status: "pending" as const,
    isFavorite: false,
  },
];

export default function DuasScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "answered" | "favorites">("all");

  const filteredDuas = DUAS.filter((dua) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "pending") return dua.status === "pending";
    if (selectedFilter === "answered") return dua.status === "answered";
    if (selectedFilter === "favorites") return dua.isFavorite;
    return true;
  });

  return (
    <View
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
    >
      <DuasHeader isDark={isDark} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <FilterTabs
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          isDark={isDark}
        />
        <View className="flex-1 flex-col p-4 gap-4">
          <DailyReflectionCard isDark={isDark} />
          <DuasList duas={filteredDuas} isDark={isDark} />
        </View>
      </ScrollView>
      <FloatingActionButton isDark={isDark} />
    </View>
  );
}

