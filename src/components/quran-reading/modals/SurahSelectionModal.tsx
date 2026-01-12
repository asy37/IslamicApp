import { MaterialIcons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import SurahData from "@/lib/quran/surah/surah.json";
import { useState } from "react";
import clsx from "clsx";
import { useFilteredSurahs, useSearchableSurahs } from "../utils";
import { colors } from "@/components/theme/colors";
import { SurahListItem } from "./SurahModalItem";

type SurahSelectionModalProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly setCurrentPage: (surahNumber: number) => void;
  readonly numberOfSurah: number;
};

export default function SurahSelectionModal({
  visible,
  onClose,
  setCurrentPage,
  numberOfSurah,
}: SurahSelectionModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [search, setSearch] = useState("");

  const searchableSurah = useSearchableSurahs(SurahData);
  const filteredSurahs = useFilteredSurahs(searchableSurah, search);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable onPress={onClose} className="absolute inset-0">
          <View className="absolute inset-0 bg-black/40" />
        </Pressable>
        <View
          className={clsx(
            "absolute left-0 right-0 bottom-0 rounded-t-3xl shadow-2xl h-[700px]",
            isDark ? "bg-background-cardDark" : "bg-background-light"
          )}
        >
          <View className="pb-2 pt-3">
            <View className="flex-row items-center justify-between px-6 pb-3">
              <Text
                className={clsx(
                  "text-xl font-bold tracking-tight ",
                  isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                )}
              >
                Sure Seç
              </Text>
              <Pressable
                onPress={onClose}
                className="rounded-full p-2"
                hitSlop={10}
              >
                <MaterialIcons
                  name="close"
                  size={26}
                  color={isDark ? colors.text.muted : colors.text.primaryLight}
                />
              </Pressable>
            </View>

            <View className="px-6 pb-2">
              <View
                className={clsx(
                  "relative flex-row items-center rounded-xl px-3 py-2.5",
                  isDark ? "bg-primary-400" : "bg-white"
                )}
              >
                <MaterialIcons
                  name="search"
                  size={20}
                  color={colors.text.primaryLight}
                />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Sure ara (Bakara, Yasin, 2…)"
                  placeholderTextColor={colors.text.primaryLight}
                  className={"ml-2 flex-1 text-base text-text-muted"}
                />
              </View>
            </View>
          </View>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {filteredSurahs.map((surah) => (
              <SurahListItem
                setSearch={setSearch}
                setCurrentPage={setCurrentPage}
                key={surah.id}
                surah={surah}
                isDark={isDark}
                onClose={onClose}
                numberOfSurah={numberOfSurah}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
