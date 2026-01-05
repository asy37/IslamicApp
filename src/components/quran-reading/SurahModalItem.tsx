import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type SurahType = {
  readonly id: number;
  readonly surahArabicName: string;
  readonly surahEnglishName: string;
  readonly surahTurkishName: string;
  readonly ayahCount: number;
  readonly surahNumber: number;
  readonly startPage: number;
};
type SurahListItemProps = {
  readonly surah: SurahType;
  readonly isDark: boolean;
  readonly setCurrentPage: (page: number) => void;
  readonly onClose: () => void;
};

export function SurahListItem({
  surah,
  isDark,
  setCurrentPage,
  onClose,
}: SurahListItemProps) {
  const isActive = surah.surahNumber;

  const getBorderColor = () => {
    if (isActive) return "transparent";
    return isDark ? "rgba(34, 56, 51, 0.2)" : "rgba(226, 236, 232, 0.4)";
  };

  const getBackgroundColor = () => {
    if (!isActive) return "transparent";
    return isDark ? "rgba(31, 143, 95, 0.1)" : "rgba(31, 143, 95, 0.05)";
  };

  const handlePress = () => {
    setCurrentPage(surah.surahNumber);
    onClose();
  };
  return (
    <Pressable
      onPress={handlePress}
      className="w-full flex-row items-center gap-4 px-6 py-4 border-b relative overflow-hidden"
      style={{
        borderBottomColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
      }}
    >
      {isActive && (
        <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
      )}

      {/* Number */}
      <View
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{
          backgroundColor: isActive
            ? isDark
              ? "rgba(0,0,0,0.2)"
              : "#F8FAF9"
            : isDark
            ? "rgba(255,255,255,0.05)"
            : "#F3F4F6",
        }}
      >
        <Text
          className="text-sm font-semibold"
          style={{
            color: isActive ? "#1F8F5F" : isDark ? "#8FA6A0" : "#6B7F78",
          }}
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
          color={isActive ? "#1F8F5F" : isDark ? "#8FA6A0" : "#9CA3AF"}
        />
      </View>
    </Pressable>
  );
}
