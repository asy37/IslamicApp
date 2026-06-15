import { Text, View } from "react-native";
import clsx from "clsx";
import DuaCard from "./DuaCard";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { DuasListProps } from "../types";

export default function DuasList({ duas, updateDua, deleteDua, toggleFavorite, isSaving }: DuasListProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between mt-2 mb-1 px-1">
        <Text
          className={clsx(
            "text-lg font-bold",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {t("duas.yourPrayers")}
        </Text>
        <View
          className={clsx(
            "px-2 py-1 rounded-md",
            isDark ? "bg-background-cardDark/50" : "bg-background-cardLight/50"
          )}
        >
          <Text
            className={clsx(
              "text-xs font-medium",
              isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
            )}
          >
            {t("duas.entriesCount", { count: duas.length })}
          </Text>
        </View>
      </View>
      {duas.map((dua) => (
        <DuaCard key={dua.id} dua={dua} isDark={isDark} updateDua={updateDua} deleteDua={deleteDua} toggleFavorite={toggleFavorite} isSaving={isSaving} />
      ))}
    </View>
  );
}

