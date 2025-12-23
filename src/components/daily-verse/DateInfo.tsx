import clsx from "clsx";
import { Text, View } from "react-native";

export default function DateInfo({ isDark }: { isDark: boolean }) {
  return (
    <View className="px-6 pb-2 text-center">
      <Text
        className={clsx(
          "text-sm font-medium tracking-wide text-center opacity-80",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        14 Ramadan 1445 • March 24, 2024
      </Text>
    </View>
  );
}
