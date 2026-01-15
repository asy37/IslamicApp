import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import clsx from "clsx";
import type { FeedbackLevel } from "@/lib/hooks/useQiblaGuide";

type CompassProps = {
  readonly isDark: boolean;
  readonly heading: number | null;
  readonly qiblaBearing: number | null;
  readonly angleDiff: number;
  readonly feedbackLevel: FeedbackLevel;
};

const COLORS = {
  far: "#EF4444",
  near: "#F59E0B",
  aligned: "#1F8F5F",
} as const;

export default function Compass({
  isDark,
  heading,
  qiblaBearing,
  angleDiff,
  feedbackLevel,
}: CompassProps) {
  const compassSize = 320;
  const dialRotation = heading == null ? 0 : -heading; // pusula arka planını kullanıcının yönüne göre döndür
  const qiblaRotation = qiblaBearing == null ? 0 : angleDiff; // kıble oku (relative)
  const accent = COLORS[feedbackLevel];

  return (
    <View className="relative items-center justify-center">
      {/* Subtitle (Dark theme only) */}
      {isDark && (
        <View className="z-10 text-center px-4 pb-4">
          <Text
            className="text-sm font-normal leading-normal opacity-80"
            style={{ color: "#8FA6A0" }}
          >
            Yönünüzü Kaabe'ye çevirin
          </Text>
        </View>
      )}

      {/* Compass Circle Container */}
      <View
        className="relative items-center justify-center"
        style={{ width: compassSize, height: compassSize }}
      >
        {/* Outer Glow */}
        <View
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: "rgba(31, 143, 95, 0.05)",
            shadowColor: "#1F8F5F",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 40,
            elevation: 0,
          }}
        />

        {/* Compass Dial Background (rotates with device heading) */}
        <View
          className="relative rounded-full items-center justify-center"
          style={{
            width: compassSize,
            height: compassSize,
            backgroundColor: isDark ? "#1A2C26" : "#FFFFFF",
            borderWidth: 1,
            borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#E2ECE8",
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
              borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#E2ECE8",
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
                backgroundColor: isDark ? "#FFFFFF" : "#1C2A26",
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
                backgroundColor: isDark ? "#FFFFFF" : "#1C2A26",
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
                backgroundColor: isDark ? "#FFFFFF" : "#1C2A26",
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
                backgroundColor: isDark ? "#FFFFFF" : "#1C2A26",
              }}
            />
          </View>

          {/* Cardinal Directions Labels */}
          <View className="absolute inset-0 justify-between items-center py-8">
            <Text
              className="text-xs font-semibold"
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.4)" : "#6B7F78",
              }}
            >
              N
            </Text>
            <Text
              className="text-xs font-semibold"
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.4)" : "#6B7F78",
              }}
            >
              S
            </Text>
          </View>
          <View className="absolute inset-0 flex-row justify-between items-center px-8">
            <Text
              className="text-xs font-semibold"
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.4)" : "#6B7F78",
              }}
            >
              W
            </Text>
            <Text
              className="text-xs font-semibold"
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.4)" : "#6B7F78",
              }}
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
              borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#E2ECE8",
              backgroundColor: isDark ? "#12241E" : "#CFEBDD",
            }}
          />

        </View>

        {/* Qibla Arrow (fixed center, rotates relative to device) */}
        <View
          className="absolute items-center justify-center"
          style={{
            width: compassSize,
            height: compassSize,
            transform: [{ rotate: `${qiblaRotation}deg` }],
          }}
        >
          <View
            className="absolute items-center justify-center rounded-full"
            style={{
              top: 20,
              width: 44,
              height: 44,
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.06)"
                : "rgba(0,0,0,0.04)",
              borderWidth: 2,
              borderColor: accent,
            }}
          >
            <MaterialIcons name="navigation" size={20} color={accent} />
          </View>
        </View>
      </View>
    </View>
  );
}

