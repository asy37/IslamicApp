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

type SurahSelectionModalProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
};

const SURAH_LIST = [
  { number: 1, name: "Fatiha", meaning: "Açılış", type: "Mekki", ayahCount: 7 },
  { number: 2, name: "Bakara", meaning: "İnek", type: "Medeni", ayahCount: 286 },
  {
    number: 3,
    name: "Al-i İmran",
    meaning: "İmran Ailesi",
    type: "Medeni",
    ayahCount: 200,
  },
  {
    number: 18,
    name: "Kehf",
    meaning: "Mağara",
    type: "Mekki",
    ayahCount: 110,
    active: true,
  },
  { number: 36, name: "Yasin", meaning: "Ya-Sin", type: "Mekki", ayahCount: 83 },
  { number: 55, name: "Rahman", meaning: "Merhametli", type: "Medeni", ayahCount: 78 },
  { number: 67, name: "Mülk", meaning: "Hükümranlık", type: "Mekki", ayahCount: 30 },
  { number: 114, name: "Nas", meaning: "İnsanlar", type: "Mekki", ayahCount: 6 },
];

export default function SurahSelectionModal({
  visible,
  onClose,
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
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={onClose}
        />

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
                backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6",
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
                  (isDark ? "text-text-primaryDark" : "text-text-primaryLight")
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
          {SURAH_LIST.map((surah) => (
            <SurahListItem key={surah.number} surah={surah} isDark={isDark} />
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

type SurahListItemProps = {
  readonly surah: (typeof SURAH_LIST)[number];
  readonly isDark: boolean;
};

function SurahListItem({ surah, isDark }: SurahListItemProps) {
  const isActive = surah.active === true;

  const getBorderColor = () => {
    if (isActive) return "transparent";
    return isDark ? "rgba(34, 56, 51, 0.2)" : "rgba(226, 236, 232, 0.4)";
  };

  const getBackgroundColor = () => {
    if (!isActive) return "transparent";
    return isDark ? "rgba(31, 143, 95, 0.1)" : "rgba(31, 143, 95, 0.05)";
  };

  return (
    <Pressable
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
            color: isActive
              ? "#1F8F5F"
              : isDark
              ? "#8FA6A0"
              : "#6B7F78",
          }}
        >
          {surah.number}
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
            {surah.name}
          </Text>
          <Text
            className={
              "truncate text-sm " +
              (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
            }
          >
            {surah.meaning}
          </Text>
        </View>

        <View className="mt-0.5 flex-row items-center gap-2">
          <View
            className={
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
              (surah.type === "Mekki"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400")
            }
          >
            <Text>{surah.type}</Text>
          </View>
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


