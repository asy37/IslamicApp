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
import { SurahListItem } from "./SurahModalItem";

type SurahSelectionModalProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly setCurrentPage: (page: number) => void;
};

export default function SurahSelectionModal({
  visible,
  onClose,
  setCurrentPage,
}: SurahSelectionModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Backdrop */}
        <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />

        {/* Bottom Sheet */}
        <View
          className={
            "absolute left-0 right-0 bottom-0 rounded-t-3xl shadow-2xl " +
            (isDark ? "bg-[#1a1a1a]" : "bg-background-light")
          }
          style={{ height: "92%", maxHeight: 800 }}
        >
          {/* Handle & Header */}
          <View className="pb-2 pt-3">
            {/* Handle */}
            <View className="mb-2 flex items-center">
              <View
                className="h-1.5 w-12 rounded-full"
                style={{
                  backgroundColor: isDark ? "#223833" : "#E2ECE8",
                }}
              />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-3">
              <Text
                className={
                  "text-xl font-bold tracking-tight " +
                  (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
                }
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
                  color={isDark ? "#EAF3F0" : "#6B7F78"}
                />
              </Pressable>
            </View>

            {/* Search Bar */}
            <View className="px-6 pb-2">
              <View
                className="relative flex-row items-center rounded-xl px-3 py-2.5"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "#f3f4f6",
                }}
              >
                <MaterialIcons
                  name="search"
                  size={20}
                  color={isDark ? "#8FA6A0" : "#9CA3AF"}
                />
                <TextInput
                  placeholder="Sure ara (Bakara, Yasin…)"
                  placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                  className={
                    "ml-2 flex-1 text-base " +
                    (isDark
                      ? "text-text-primaryDark"
                      : "text-text-primaryLight")
                  }
                />
              </View>
            </View>
          </View>

          {/* Divider */}
          <View
            className="h-px w-full"
            style={{
              backgroundColor: isDark
                ? "rgba(34, 56, 51, 0.4)"
                : "rgba(226, 236, 232, 0.6)",
            }}
          />

          {/* Surah List */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {SurahData.map((surah) => (
              <SurahListItem
                setCurrentPage={setCurrentPage}
                key={surah.id}
                surah={surah}
                isDark={isDark}
                onClose={onClose}
              />
            ))}
          </ScrollView>

          {/* Bottom fade hint */}
          <View
            className="absolute bottom-0 left-0 right-0 h-10"
            style={{
              backgroundColor: isDark ? "#1a1a1a" : "#F8FAF9",
              opacity: 0.8,
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
