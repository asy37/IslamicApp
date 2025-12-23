import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";

export default function SettingsHeader({ isDark }: { isDark: boolean }) {
  const router = useRouter();

  return (
    <View
      className={clsx(
        "sticky top-0 z-50 border-b",
        isDark
          ? "bg-background-dark/95 border-border-dark/50"
          : "bg-background-light/95 border-border-light"
      )}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text
          className={clsx(
            "text-xl font-bold tracking-tight",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          Settings
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text
            className="text-base font-bold"
            style={{ color: "#1F8F5F" }}
          >
            Done
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

