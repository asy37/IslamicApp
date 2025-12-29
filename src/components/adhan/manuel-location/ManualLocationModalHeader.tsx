import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Pressable, Text, TextInput, View } from "react-native";

type ModalHeaderProps = {
  readonly isDark: boolean;
  readonly searchQuery: string;
  readonly onClose: () => void;
  readonly onSearchChange: (query: string) => void;
};

export function ManualLocationModalHeader({
  isDark,
  searchQuery,
  onClose,
  onSearchChange,
}: ModalHeaderProps) {
  return (
    <View className="pt-3 pb-2">
      <View className="flex items-center mb-2">
        <View
          className="h-1.5 w-12 rounded-full"
          style={{
            backgroundColor: isDark ? "#223833" : "#E2ECE8",
          }}
        />
      </View>

      <View className="flex-row items-center justify-between px-6 pb-3">
        <Text
          className={clsx(
            "text-xl font-bold tracking-tight",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          Select Location
        </Text>
        <Pressable onPress={onClose} className="rounded-full p-2" hitSlop={10}>
          <MaterialIcons
            name="close"
            size={26}
            color={isDark ? "#EAF3F0" : "#6B7F78"}
          />
        </Pressable>
      </View>

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
            placeholder="Search city (Istanbul, Mecca...)"
            placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
            value={searchQuery}
            onChangeText={onSearchChange}
            className={clsx(
              "ml-2 flex-1 text-base",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onSearchChange("")}>
              <MaterialIcons
                name="clear"
                size={20}
                color={isDark ? "#8FA6A0" : "#9CA3AF"}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
