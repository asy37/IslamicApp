import { View, Text } from "react-native";
import clsx from "clsx";
import { colors } from "@/components/theme/colors";

type CompassRingProps = Readonly<{
  compassSize: number;
  isDark: boolean;
  dialRotation: number;
}>;
export default function CompassRing({
  compassSize,
  isDark,
  dialRotation,
}: CompassRingProps) {
  return (
    <View
      className={clsx(
        "relative rounded-full items-center justify-center border",
        isDark ? "bg-success border-primary-500" : "bg-white border-white"
      )}
      style={{
        width: compassSize,
        height: compassSize,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 8,
        transform: [{ rotate: `${dialRotation}deg` }],
      }}
    >
      {/* Degree Markings Ring */}
      <View
        className="absolute rounded-full"
        style={{
          width: compassSize - 8,
          height: compassSize - 8,
          borderWidth: 1,
          borderColor: isDark ? colors.border.dark : colors.border.light,
        }}
      />

      {/* Cardinal Direction Ticks */}
      <View className="absolute inset-0 opacity-30">
        {/* North */}
        <View
          className="absolute"
          style={{
            top: 16,
            left: compassSize / 2 - 0.5,
            width: 1,
            height: 12,
            backgroundColor: isDark ? colors.text.primaryDark : colors.text.primaryLight,
          }}
        />
        {/* East */}
        <View
          className="absolute"
          style={{
            right: 16,
            top: compassSize / 2 - 0.5,
            width: 12,
            height: 1,
            backgroundColor: isDark ? colors.text.primaryDark : colors.text.primaryLight,
          }}
        />
        {/* South */}
        <View
          className="absolute"
          style={{
            bottom: 16,
            left: compassSize / 2 - 0.5,
            width: 1,
            height: 12,
            backgroundColor: isDark ? colors.text.primaryDark : colors.text.primaryLight,
          }}
        />
        {/* West */}
        <View
          className="absolute"
          style={{
            left: 16,
            top: compassSize / 2 - 0.5,
            width: 12,
            height: 1,
            backgroundColor: isDark ? colors.text.primaryDark : colors.text.primaryLight,
          }}
        />
      </View>

      {/* Cardinal Directions Labels */}
      <View className="absolute inset-0 justify-between items-center py-8">
        <Text
          className={clsx(
            "text-xs font-semibold",
            isDark ? "text-muted-dark" : "text-muted-light"
          )}
        >
          N
        </Text>
        <Text
          className={clsx(
            "text-xs font-semibold",
            isDark ? "text-muted-dark" : "text-muted-light"
          )}
        >
          S
        </Text>
      </View>
      <View className="absolute inset-0 flex-row justify-between items-center px-8">
        <Text
          className={clsx(
            "text-xs font-semibold",
            isDark ? "text-muted-dark" : "text-muted-light"
          )}
        >
          W
        </Text>
        <Text
          className={clsx(
            "text-xs font-semibold",
            isDark ? "text-muted-dark" : "text-muted-light"
          )}
        >
          E
        </Text>
      </View>

      {/* Inner Decorative Circle */}
      <View
        className="absolute rounded-full"
        style={{
          width: (compassSize * 3) / 4,
          height: (compassSize * 3) / 4,
          borderWidth: 1,
          borderColor: isDark ? colors.border.dark : colors.border.light,
          backgroundColor: isDark ? colors.background.dark : colors.background.light,
        }}
      />
    </View>
  );
}
