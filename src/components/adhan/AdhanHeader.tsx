import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Pressable, Text, View } from "react-native";

export default function AdhanHeader({ isDark }: { isDark: boolean }) {
  return (
    <View
      className={clsx(
        "px-6 pt-8 pb-2",
        isDark ? "bg-background-dark/95" : "bg-background-light/95"
      )}
    >
      <View className="flex-col items-start w-full">
        <View className="flex-row items-center gap-2">
          <MaterialIcons
            name="location-on"
            size={20}
            color={isDark ? "#4CAF84" : "#1F8F5F"}
          />
          <Text
            className={clsx(
              "text-sm font-medium tracking-wide uppercase opacity-90",
              isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
            )}
          >
            Current Location
          </Text>
        </View>
        <View className="flex-row items-center justify-between w-full mt-1">
          <Text
            className={clsx(
              "text-2xl font-bold leading-tight tracking-tight",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}
          >
            Mecca, Saudi Arabia
          </Text>
          <Pressable className="rounded-full p-2" hitSlop={10}>
            <MaterialIcons
              name="settings"
              size={22}
              color={isDark ? "#EAF3F0" : "#6B7F78"}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
