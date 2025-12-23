import clsx from "clsx";
import { Text, View } from "react-native";

export default function DateInfo({ isDark }: { isDark: boolean }) {
  return (
    <View className={clsx("px-6 pb-6", isDark ? "bg-background-dark" : "bg-background-light")}>
      <Text
        className={clsx(
          "text-sm font-normal leading-normal",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        Monday, 12 Oct | 27 Rabi' al-Awwal 1445
      </Text>
    </View>
  );
}
