import { View, Text } from "react-native";
import clsx from "clsx";
import MenuItem from "./MenuItem";

type MenuItemType = {
  key: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconBg: "primary" | "gray";
};

type MenuSectionProps = {
  readonly title: string;
  readonly items: readonly MenuItemType[];
  readonly isDark: boolean;
};

export default function MenuSection({
  title,
  items,
  isDark,
}: MenuSectionProps) {
  return (
    <View className="space-y-3">
      {title && (
        <Text
          className={clsx(
            "px-2 text-sm font-semibold uppercase tracking-wider opacity-80",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          {title}
        </Text>
      )}
      <View
        className={clsx(
          "rounded-2xl overflow-hidden",
          isDark ? "bg-background-cardDark" : "bg-background-cardLight"
        )}
        style={{
          shadowColor: "#1F8F5F",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.key}
            item={item}
            isDark={isDark}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

