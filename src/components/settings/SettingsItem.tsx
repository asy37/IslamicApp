import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

type SettingsItemProps = {
  readonly title: string;
  readonly value?: string;
  readonly isDark: boolean;
  readonly isPrimary?: boolean;
  readonly onPress: () => void;
};

export default function SettingsItem({
  title,
  value,
  isDark,
  isPrimary = false,
  onPress,
}: SettingsItemProps) {
  return (
    <Pressable
      className="flex-row items-center justify-between p-4"
      onPress={onPress}
    >
      <View className="flex-1 pr-4">
        <Text
          className={clsx(
            "text-base font-medium",
            isPrimary
              ? "text-primary-500"
              : isDark
              ? "text-text-primaryDark"
              : "text-text-primaryLight"
          )}
        >
          {title}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && (
          <Text
            className={clsx(
              "text-sm",
              isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
            )}
          >
            {value}
          </Text>
        )}
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={isDark ? "#8FA6A0" : "#6B7F78"}
        />
      </View>
    </Pressable>
  );
}

