import { Text, View } from "react-native";
import clsx from "clsx";

type SettingsSectionProps = {
  readonly title: string;
  readonly isDark: boolean;
};

export default function SettingsSection({
  title,
  isDark,
}: SettingsSectionProps) {
  return (
    <View className="mt-6 mb-2 px-1">
      <Text
        className={clsx(
          "text-xs font-semibold uppercase tracking-wider",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        {title}
      </Text>
    </View>
  );
}

