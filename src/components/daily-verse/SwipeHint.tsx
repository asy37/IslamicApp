import clsx from "clsx";
import { Text } from "react-native";

export default function SwipeHint({ isDark }: { isDark: boolean }) {
  return (
    <Text
      className={clsx(
        "text-center mt-6 text-xs font-medium opacity-70",
        isDark ? "text-text-secondaryDark/40" : "text-text-secondaryLight/60"
      )}
    >
      Swipe left to view yesterday's verse
    </Text>
  );
}
