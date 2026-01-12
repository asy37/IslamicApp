import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/components/theme/colors";
import clsx from "clsx";

type ButtonProps = {
  readonly text?: string | number;
  readonly onPress: () => void;
  readonly isDark: boolean;
  readonly rightIcon?: string;
  readonly leftIcon?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly size?: "small" | "medium" | "large";
  readonly isActive?: boolean;
  readonly children?: React.ReactNode;
};
export default function Button({
  className,
  text,
  onPress,
  isDark,
  rightIcon,
  leftIcon,
  disabled = false,
  size,
  isActive = false,
  children,
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        "flex-row items-center justify-between gap-2 rounded-full px-3 py-1.5 shadow-sm",
        isDark ? " bg-background-cardDark" : " bg-background-cardLight",
        size === "large" && "w-full py-4",
        size === "medium" && "w-full py-2",
        size === "small" && "w-full py-1",
        isActive && "border-l-8 border-primary-500",
        className
      )}
    >
      <View className="flex-row items-center justify-start gap-2">
        {leftIcon && (
          <MaterialIcons
            name={leftIcon as keyof typeof MaterialIcons.glyphMap}
            size={18}
            color={isDark ? colors.success : colors.primary[500]}
          />
        )}
        {text && (
          <Text className="text-sm font-semibold text-success">{text}</Text>
        )}
        {children}
      </View>
      {rightIcon && (
        <MaterialIcons
          className="text-end"
          name={rightIcon as keyof typeof MaterialIcons.glyphMap}
          size={18}
          color={isDark ? colors.success : colors.primary[500]}
        />
      )}
    </Pressable>
  );
}
