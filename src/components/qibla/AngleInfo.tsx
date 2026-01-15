import { Text, View } from "react-native";
import type { FeedbackLevel } from "@/lib/hooks/useQiblaGuide";

type AngleInfoProps = {
  readonly angle: number;
  readonly isDark: boolean;
  readonly feedbackLevel: FeedbackLevel;
};

const COLORS = {
  far: "#EF4444",
  near: "#F59E0B",
  aligned: "#1F8F5F",
} as const;

export default function AngleInfo({ angle, isDark, feedbackLevel }: AngleInfoProps) {
  return (
    <View
      className="rounded-xl p-4 items-center justify-center min-w-[100px]"
      style={{
        backgroundColor: COLORS[feedbackLevel],
        shadowColor: COLORS[feedbackLevel],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      <Text
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: "rgba(255, 255, 255, 0.8)" }}
      >
        Fark
      </Text>
      <Text className="text-2xl font-bold tracking-tight text-white">
        {angle}°
      </Text>
    </View>
  );
}

