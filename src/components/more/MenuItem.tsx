import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";

type MenuItemType = {
  key: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconBg: "primary" | "gray";
  route?: string;
  onPress?: () => void | Promise<void>;
};

type MenuItemProps = {
  readonly item: MenuItemType;
  readonly isDark: boolean;
  readonly isLast: boolean;
};

export default function MenuItem({
  item,
  isDark,
  isLast,
}: MenuItemProps) {
  const router = useRouter();

  const getIconBackgroundColor = () => {
    if (item.iconBg === "primary") {
      return isDark ? "bg-primary-500/20" : "bg-primary-50";
    }
    return isDark ? "bg-gray-800" : "bg-gray-100";
  };

  const getIconColor = () => {
    if (item.iconBg === "primary") {
      return isDark ? "#4CAF84" : "#1F8F5F";
    }
    return isDark ? "#D1D5DB" : "#4B5563";
  };

  const handlePress = async () => {
    if (item.onPress) {
      await item.onPress();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <Pressable
      className={clsx(
        "flex-row items-center justify-between p-4",
        !isLast && (isDark ? "border-b border-gray-800" : "border-b border-gray-100")
      )}
      onPress={handlePress}
    >
      <View className="flex-row items-center gap-4">
        <View
          className={clsx(
            "flex items-center justify-center rounded-xl w-10 h-10",
            getIconBackgroundColor()
          )}
        >
          <MaterialIcons
            name={item.icon as any}
            size={22}
            color={getIconColor()}
          />
        </View>
        <View className="flex-col">
          <Text
            className={clsx(
              "text-base font-medium",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}
          >
            {item.title}
          </Text>
          {item.subtitle && (
            <Text
              className={clsx(
                "text-xs",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
      {!item.onPress && (
        <MaterialIcons
          name="navigate-next"
          size={20}
          color={isDark ? "#4B5563" : "#9CA3AF"}
        />
      )}
    </Pressable>
  );
}

