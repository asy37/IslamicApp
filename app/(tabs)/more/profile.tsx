import { View, Text, useColorScheme } from "react-native";
import clsx from "clsx";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={clsx(
        "flex-1 items-center justify-center p-4",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
    >
      <Text
        className={clsx(
          "text-lg",
          isDark ? "text-text-primaryDark" : "text-text-primaryLight"
        )}
      >
        Profile Screen
      </Text>
      <Text
        className={clsx(
          "mt-2 text-sm",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        Coming soon...
      </Text>
    </View>
  );
}

