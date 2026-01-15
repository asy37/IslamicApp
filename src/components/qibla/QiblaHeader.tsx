import clsx from "clsx";
import { View, Text } from "react-native";

type QiblaHeaderProps = {
  readonly isDark: boolean;
};

export default function QiblaHeader({ isDark }: QiblaHeaderProps) {
  return (
    <View className="flex-row items-center p-6 pb-2 justify-between z-10">
      <View className="flex-1 items-center">
        <Text
          className={clsx(
            "text-lg font-bold leading-tight tracking-wide",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          Qibla Finder
        </Text>
        {!isDark && (
          <Text className="text-xs text-text-secondary-light font-medium mt-0.5">
            Turn your direction to Kaaba
          </Text>
        )}
      </View>
    </View>
  );
}
