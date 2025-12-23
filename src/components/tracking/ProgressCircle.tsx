import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme, View } from "react-native";
import { colors } from "../theme/colors";

export default function ProgressCircle() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="relative flex h-16 w-16 items-center justify-center">
      <View
        className="h-16 w-16 rounded-full border-[5px]"
        style={{
          borderColor: isDark
            ? colors.background.dark
            : colors.background.light,
        }}
      />
      <View
        className="absolute h-16 w-16 rounded-full border-[5px]"
        style={{
          borderColor: isDark ? colors.success : colors.primary[500],
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
        }}
      />
      <View className="absolute flex items-center justify-center">
        <MaterialIcons
          name="check"
          size={20}
          color={isDark ? colors.success : colors.primary[500]}
        />
      </View>
    </View>
  );
}
