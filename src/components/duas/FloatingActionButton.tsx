import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import clsx from "clsx";

export default function FloatingActionButton({
  isDark,
}: {
  isDark: boolean;
}) {
  return (
    <View className="absolute bottom-6 right-6 z-50">
      <Pressable
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500"
        style={{
          shadowColor: "#1F8F5F",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <MaterialIcons
          name="add"
          size={30}
          color={isDark ? "#0F1F1A" : "#FFFFFF"}
        />
      </Pressable>
    </View>
  );
}

