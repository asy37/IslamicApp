import { City } from "@/constants/popular-cities";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Pressable, Text, View } from "react-native";

type CityItemProps = {
  readonly city: City;
  readonly isDark: boolean;
  readonly onPress: () => void;
  readonly isLast: boolean;
};

export function CityListItem({ city, isDark, onPress, isLast }: CityItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "flex-row items-center gap-4 px-6 py-4",
        !isLast &&
          (isDark
            ? "border-b border-border-dark/20"
            : "border-b border-border-light/40")
      )}
    >
      <View
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isDark ? "bg-primary-500/20" : "bg-primary-50"
        )}
      >
        <MaterialIcons
          name="location-on"
          size={22}
          color={isDark ? "#4CAF84" : "#1F8F5F"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={clsx(
            "text-base font-semibold",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {city.name}
        </Text>
        <Text
          className={clsx(
            "text-sm mt-0.5",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          {city.country}
        </Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={20}
        color={isDark ? "#8FA6A0" : "#9CA3AF"}
      />
    </Pressable>
  );
}
