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
  readonly backgroundColor?: 'white' | 'transparent' | 'primary';
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
  backgroundColor = "white",
}: ButtonProps) {

  const backgroundColorClass = {
    white: isDark ? "bg-background-cardDark" : "bg-background-cardLight",
    transparent: "bg-transparent",
    primary: isDark ? "bg-primary-500/20" : "bg-primary-500",
  };

  const textColorClass = {
    white: isDark ? colors.success : "text-success",
    transparent: isDark ? colors.text.secondaryDark : "text-text-primaryLight",
    primary: "text-white",
  };

  const iconColorClass = {
    white: isDark ? colors.success : colors.primary[500],
    transparent: "text-text-primaryLight",
    primary: isDark ? colors.text.muted : colors.text.white,
  };
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        "flex-row items-center justify-between gap-2 rounded-full shadow-sm",
        isDark ? " bg-background-cardDark" : " bg-background-cardLight",
        size === "large" && "w-full p-4",
        size === "medium" && "w-fit min-w-[150px] p-3",
        size === "small" && "w-fit p-2",
        isActive && "border-l-8 border-primary-500",
        backgroundColorClass[backgroundColor],
        className
      )}
    >
      <View className="flex-row items-center justify-start gap-2">
        {leftIcon && (
          <MaterialIcons
            name={leftIcon as keyof typeof MaterialIcons.glyphMap}
            size={18}
            color={iconColorClass[backgroundColor]}
          />
        )}
        {text && (
          <Text
            className={clsx(
              "text-sm font-semibold text-center",
              textColorClass[backgroundColor],
            )}
          >
            {text}
          </Text>
        )}
        {children}
      </View>
      {rightIcon && (
        <MaterialIcons
          className="text-end"
          name={rightIcon as keyof typeof MaterialIcons.glyphMap}
          size={18}
          color={iconColorClass[backgroundColor]}
          />
      )}
    </Pressable>
  );
}
