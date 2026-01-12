import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { colors } from "@/components/theme/colors";
import clsx from "clsx";

type ButtonProps = {
  readonly text: string | number | undefined;
  readonly onPress: () => void;
  readonly isDark: boolean;
  readonly icon?: string;
  readonly className?: string;
  readonly iconSide?: "left" | "right";
  readonly disabled?: boolean;
  readonly size?: "small" | "medium" | "large";
};
export default function Button({
  className,
  text,
  onPress,
  isDark,
  icon,
  iconSide = "left",
  disabled = false,
  size,
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        "items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm justify-between",
        isDark
          ? "border-border-dark bg-background-cardDark"
          : "border-border-light bg-background-cardLight",
        iconSide === "left" ? "flex-row-reverse " : "flex-row",
        size === "large" && "w-full py-4",
        size === "medium" && "w-full py-2",
        size === "small" && "w-full py-1",
        className
      )}
    >
      {icon && (
        <MaterialIcons
          name={icon as keyof typeof MaterialIcons.glyphMap}
          size={18}
          color={isDark ? colors.success : colors.primary[500]}
        />
      )}
      <Text className="text-sm font-semibold text-success">{text}</Text>
    </Pressable>
  );
}
