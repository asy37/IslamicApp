import { Text, View } from "react-native";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

type DhikrCounterProps = {
  readonly count: number;
  readonly dhikrName: string;
  readonly target: number;
  readonly progress: number;
  readonly strokeDashoffset: number;
  readonly circumference: number;
  readonly isDark: boolean;
};

export default function DhikrCounter({
  count,
  dhikrName,
  target,
  progress,
  strokeDashoffset,
  circumference,
  isDark,
}: DhikrCounterProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for background glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    // Scale animation on count change
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [count, scaleAnim]);

  const radius = 140;
  const size = 320;

  return (
    <View className="relative z-10 flex-col items-center justify-center">
      <View className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Background glow */}
        <Animated.View
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: isDark
              ? "rgba(31, 143, 95, 0.1)"
              : "rgba(31, 143, 95, 0.05)",
            transform: [{ scale: pulseAnim }],
          }}
        />

        {/* Progress Ring - Simplified View-based approach */}
        <View className="absolute inset-0 items-center justify-center">
          {/* Background circle */}
          <View
            className="absolute rounded-full"
            style={{
              width: radius * 2 + (isDark ? 16 : 12),
              height: radius * 2 + (isDark ? 16 : 12),
              borderWidth: isDark ? 8 : 6,
              borderColor: isDark ? "rgba(34, 56, 51, 0.3)" : "rgba(226, 236, 232, 0.3)",
            }}
          />
          {/* Progress circle - partial border based on progress */}
          <View
            className="absolute rounded-full"
            style={{
              width: radius * 2 + (isDark ? 16 : 12),
              height: radius * 2 + (isDark ? 16 : 12),
              borderWidth: isDark ? 8 : 6,
              borderColor: "transparent",
              borderTopColor: progress > 0 ? (isDark ? "#4CAF84" : "#1F8F5F") : "transparent",
              borderRightColor: progress > 25 ? (isDark ? "#4CAF84" : "#1F8F5F") : "transparent",
              borderBottomColor: progress > 50 ? (isDark ? "#4CAF84" : "#1F8F5F") : "transparent",
              borderLeftColor: progress > 75 ? (isDark ? "#4CAF84" : "#1F8F5F") : "transparent",
              transform: [{ rotate: "-90deg" }],
              shadowColor: isDark ? "#4CAF84" : "#1F8F5F",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isDark ? 0.4 : 0.25,
              shadowRadius: isDark ? 15 : 12,
            }}
          />
        </View>

        {/* Content */}
        <View className="absolute inset-0 flex-col items-center justify-center text-center">
          <Text
            className={clsx(
              "text-xl font-light tracking-wide mb-1",
              isDark ? "text-text-primaryDark/70" : "text-text-primaryLight/70"
            )}
          >
            {dhikrName}
          </Text>
          <Animated.Text
            className={clsx(
              "text-7xl sm:text-8xl font-bold tracking-tighter tabular-nums leading-none",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight"
            )}
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            {count}
          </Animated.Text>
          <Text
            className={clsx(
              "text-xs font-medium mt-4 tracking-widest uppercase opacity-80",
              isDark ? "text-primary-500" : "text-primary-500"
            )}
          >
            Target: {target}
          </Text>
        </View>
      </View>
      <Text
        className={clsx(
          "mt-10 text-sm font-light tracking-wide",
          isDark ? "text-text-secondaryDark/40" : "text-text-secondaryLight/40"
        )}
      >
        Tap anywhere to count
      </Text>
    </View>
  );
}

