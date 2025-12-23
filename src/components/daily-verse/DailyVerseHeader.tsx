import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";

export default function DailyVerseHeader({ isDark }: { isDark: boolean }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center p-6 justify-between z-10">
      <Pressable
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        onPress={() => router.back()}
        hitSlop={10}
        style={{
          backgroundColor: isDark
            ? "rgba(22, 41, 37, 0.5)"
            : "rgba(255, 255, 255, 0.8)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={isDark ? "#EAF3F0" : "#6B7F78"}
        />
      </Pressable>
      <View className="flex-col items-center">
        <Text
          className={clsx(
            "text-lg font-bold tracking-tight",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          Daily Reflection
        </Text>
      </View>
      <Pressable
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        hitSlop={10}
        style={{
          backgroundColor: isDark
            ? "rgba(22, 41, 37, 0.5)"
            : "rgba(255, 255, 255, 0.8)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <MaterialIcons
          name="settings"
          size={24}
          color={isDark ? "#EAF3F0" : "#6B7F78"}
        />
      </Pressable>
    </View>
  );
}

