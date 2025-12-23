import { Switch, Text, View } from "react-native";
import clsx from "clsx";

type SettingsToggleProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
  readonly isDark: boolean;
};

export default function SettingsToggle({
  title,
  subtitle,
  value,
  onValueChange,
  isDark,
}: SettingsToggleProps) {
  return (
    <View className="flex-row items-center justify-between p-4">
      <View className="flex-1 pr-4">
        <Text
          className={clsx(
            "text-base font-medium",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className={clsx(
              "text-xs mt-0.5",
              isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
            )}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: isDark ? "rgba(255, 255, 255, 0.1)" : "#E5E7EB",
          true: "#1F8F5F",
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={isDark ? "rgba(255, 255, 255, 0.1)" : "#E5E7EB"}
      />
    </View>
  );
}

