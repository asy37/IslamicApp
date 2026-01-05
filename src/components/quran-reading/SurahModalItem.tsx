import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { SurahType } from "./types";


type SurahListItemProps = {
  readonly surah: SurahType;
  readonly isDark: boolean;
  readonly setCurrentPage: (page: number) => void;
  readonly onClose: () => void;
  readonly numberOfSurah: number;
  readonly setSearch: (value: string) => void;
};

export function SurahListItem({
  numberOfSurah,
  surah,
  isDark,
  setCurrentPage,
  onClose,
  setSearch,
}: SurahListItemProps) {
  const isActive = surah.surahNumber === numberOfSurah;

  const handlePress = () => {
    setCurrentPage(surah.surahNumber);
    onClose();
    setSearch("");
  };
  return (
    <Pressable
      onPress={handlePress}
      className={clsx(
        "w-full flex-row items-center gap-4 px-6 py-4 relative overflow-hidden",
        isDark && isActive && "bg-primary-400/50",
        !isDark && isActive && "bg-primary-200/50"
      )}
    >
      {isActive && (
        <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
      )}

      {/* Number */}
      <View
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          isDark && isActive && "bg-primary-800/50",
          !isDark && isActive && "bg-primary-400/50 "
        )}
      >
        <Text
          className={clsx(
            "text-sm font-semibold",
            isActive ? "text-white" : "text-text-primaryLight"
          )}
        >
          {surah.surahNumber}
        </Text>
      </View>

      {/* Title & meta */}
      <View className="min-w-0 flex-1">
        <View className="flex-row items-baseline gap-2">
          <Text
            className={
              "truncate text-base font-semibold " +
              (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
            }
          >
            {surah.surahArabicName}
          </Text>
          <Text
            className={
              "truncate text-sm " +
              (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
            }
          >
            {surah.surahEnglishName}
          </Text>
        </View>

        <View className="mt-0.5 flex-row items-center gap-2">
          <Text
            className={
              "text-xs " +
              (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
            }
          >
            • {surah.ayahCount} Ayet
          </Text>
        </View>
      </View>

      {/* Right icon */}
      <View className="items-center justify-center">
        <MaterialIcons
          name={isActive ? "play-circle" : "chevron-right"}
          size={isActive ? 26 : 20}
          color={isActive ? colors.primary[500] : colors.text.secondaryLight}
        />
      </View>
    </Pressable>
  );
}
