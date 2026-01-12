import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { useState } from "react";
import QuranSettings from "./modals/QuranSettings";

type QuranSubHeaderProps = {
  readonly isDark: boolean;
  readonly onOpenSurahModal: () => void;
  readonly surahName: string;
  readonly surahTranslation: string;
  readonly juz: number;
};

export default function QuranSubHeader({
  isDark,
  onOpenSurahModal,
  surahName,
  surahTranslation,
  juz,
}: QuranSubHeaderProps) {
  const [settingsModal, setSettingsModal] = useState(false);



  return (
    <>
      <View
        className={
          "z-10 flex-row items-center justify-between border-b px-5 py-3 " +
          (isDark
            ? "border-b border-primary-100"
            : " border-b border-primary-500")
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
            {surahTranslation} / {surahName}
          </Text>
          <Text className="text-xs font-medium uppercase tracking-wide text-primary-500">
            {juz ? `Juz ${juz}` : ""}
          </Text>
        </View>

        <Pressable
          onPress={() => setSettingsModal(true)}
          className="flex items-center justify-center rounded-full p-2"
          hitSlop={10}
        >
          <MaterialIcons
            name="settings"
            size={22}
            color={isDark ? colors.text.primaryDark : colors.text.primaryLight}
          />
        </Pressable>
      </View>
      <QuranSettings
        isDark={isDark}
        visible={settingsModal}
        onClose={() => setSettingsModal(false)}
      />
    </>
  );
}
