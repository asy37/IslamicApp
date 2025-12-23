import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function AlignmentFeedback({ isDark }: { isDark: boolean }) {
  return (
    <View className="absolute bottom-32 items-center gap-1 opacity-100">
      <MaterialIcons
        name="check-circle"
        size={32}
        color="#1F8F5F"
      />
      <Text
        className="text-sm font-medium tracking-wide"
        style={{ color: "#1F8F5F" }}
      >
        Kıble Hizalandı
      </Text>
    </View>
  );
}

