import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { FeedbackLevel } from "@/lib/hooks/useQiblaGuide";

const COLORS = {
  far: "#EF4444",
  near: "#F59E0B",
  aligned: "#1F8F5F",
} as const;

export default function AlignmentFeedback({
  isDark,
  feedbackLevel,
}: {
  isDark: boolean;
  feedbackLevel: FeedbackLevel;
}) {
  if (feedbackLevel !== "aligned") return null;

  return (
    <View className="absolute bottom-32 items-center gap-1 opacity-100">
      <MaterialIcons name="check-circle" size={32} color={COLORS.aligned} />
      <Text
        className="text-sm font-medium tracking-wide"
        style={{ color: COLORS.aligned }}
      >
        Kıble Hizalandı
      </Text>
    </View>
  );
}

