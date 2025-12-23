import { Text, View } from "react-native";
import clsx from "clsx";

export default function VersionInfo({ isDark }: { isDark: boolean }) {
  return (
    <View className="flex-col items-center justify-center pb-8 pt-4">
      <Text
        className={clsx(
          "text-xs opacity-60",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        Sürüm 1.0.2
      </Text>
    </View>
  );
}

