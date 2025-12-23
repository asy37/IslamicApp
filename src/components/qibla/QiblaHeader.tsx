import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";

export default function QiblaHeader({ isDark }: { isDark: boolean }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center p-6 pb-2 justify-between z-10">
      <Pressable
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        onPress={() => router.back()}
        hitSlop={10}
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
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
          color={isDark ? "#EAF3F0" : "#1C2A26"}
        />
      </Pressable>
      <View className="flex-1 items-center">
        <Text
          className={clsx(
            "text-lg font-bold leading-tight tracking-wide",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          Kıble Bulucu
        </Text>
        {!isDark && (
          <Text
            className="text-xs font-medium mt-0.5"
            style={{ color: "#6B7F78" }}
          >
            Yönünüzü Kaabe'ye çevirin
          </Text>
        )}
      </View>
      <Pressable
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        hitSlop={10}
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "transparent",
        }}
      >
        <MaterialIcons
          name="settings"
          size={24}
          color={isDark ? "#EAF3F0" : "#1C2A26"}
        />
      </Pressable>
    </View>
  );
}

