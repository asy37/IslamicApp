import { Pressable, ScrollView, Text, View } from "react-native";
import clsx from "clsx";

type FilterType = "all" | "pending" | "answered" | "favorites";

type FilterTabsProps = {
  readonly selectedFilter: FilterType;
  readonly onFilterChange: (filter: FilterType) => void;
  readonly isDark: boolean;
};

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "answered", label: "Answered" },
  { key: "favorites", label: "Favorites" },
];

export default function FilterTabs({
  selectedFilter,
  onFilterChange,
  isDark,
}: FilterTabsProps) {
  return (
    <View className="flex-row gap-3 px-4 pb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {FILTERS.map((filter) => {
          const isActive = selectedFilter === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => onFilterChange(filter.key)}
              className={clsx(
                "flex h-9 shrink-0 items-center justify-center rounded-full px-5",
                isActive
                  ? "bg-primary-500"
                  : isDark
                  ? "bg-background-cardDark border border-border-dark"
                  : "bg-background-cardLight border border-gray-100"
              )}
              style={{
                shadowColor: isActive ? "#1F8F5F" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isActive ? 0.2 : 0,
                shadowRadius: 2,
                elevation: isActive ? 2 : 0,
              }}
            >
              <Text
                className={clsx(
                  "text-sm",
                  isActive
                    ? "text-white font-semibold"
                    : isDark
                    ? "text-text-secondaryDark font-medium"
                    : "text-text-secondaryLight font-medium"
                )}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

