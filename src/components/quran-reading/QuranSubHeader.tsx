import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";

type QuranSubHeaderProps = {
  readonly isDark: boolean;
  readonly onOpenSurahModal: () => void;
};

export default function QuranSubHeader({
  isDark,
  onOpenSurahModal,
}: QuranSubHeaderProps) {
  return (
    <View
      className={
        "z-10 flex-row items-center justify-between border-b px-5 py-3 " +
        (isDark
          ? "border-border-dark bg-background-dark/95"
          : "border-border-light bg-background-light/95")
      }
    >
      <Pressable
        className="flex items-center justify-center rounded-full p-2"
        hitSlop={10}
        onPress={onOpenSurahModal}
      >
        <MaterialIcons
          name="menu-open"
          size={22}
          color={isDark ? "#EAF3F0" : "#1C2A26"}
        />
      </Pressable>

      <View className="items-center">
        <Text
          className={
            "text-lg font-bold leading-tight " +
            (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
          }
        >
          Surah Al-Mulk
        </Text>
        <Text className="text-xs font-medium uppercase tracking-wide text-primary-500">
          Juz 29
        </Text>
      </View>

      <Pressable
        className="flex items-center justify-center rounded-full p-2"
        hitSlop={10}
      >
        <MaterialIcons
          name="text-fields"
          size={22}
          color={isDark ? colors.text.primaryDark : colors.text.primaryLight}
        />
      </Pressable>
    </View>
  );
}
