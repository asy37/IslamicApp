import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

export default function DhikrHeader({ isDark }: { isDark: boolean }) {
  return (
    <View className="absolute top-0 left-0 right-0 z-20 flex-row items-center justify-between p-6">
      <Pressable
        className="flex items-center justify-center w-10 h-10 rounded-full"
        hitSlop={10}
      >
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={isDark ? "#8FA6A0" : "#6B7F78"}
        />
      </Pressable>
      <Text
        className={clsx(
          "text-sm font-medium tracking-widest uppercase",
          isDark ? "text-text-secondaryDark/40" : "text-text-secondaryLight/40"
        )}
      >
        Tasbih
      </Text>
      <Pressable
        className="flex items-center justify-center w-10 h-10 rounded-full"
        hitSlop={10}
      >
        <MaterialIcons
          name="settings"
          size={24}
          color={isDark ? "#8FA6A0" : "#6B7F78"}
        />
      </Pressable>
    </View>
  );
}

