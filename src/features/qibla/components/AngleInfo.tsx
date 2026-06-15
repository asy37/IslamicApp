import { Text, View } from "react-native";
import type { FeedbackLevel } from "@/lib/hooks/qibla/useQiblaGuide";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n";

type AngleInfoProps = {
  readonly angle: number;
  readonly isDark: boolean;
  readonly feedbackLevel: FeedbackLevel;
};

export default function AngleInfo({
  angle,
  isDark,
  feedbackLevel,
}: AngleInfoProps) {
  const { t } = useTranslation();

  return (
    <View
      className={clsx(
        "rounded-xl p-4 items-center justify-center min-w-[100px]",
        isDark ? "bg-background-cardDark" : "bg-background-cardLight",
        feedbackLevel === "far" ? "bg-error" : "bg-warning",
        feedbackLevel === "aligned" && "bg-success"
      )}
    >
      <Text className="text-xs font-medium uppercase tracking-wider text-white">
        {t("qibla.difference")}
      </Text>
      <Text className="text-2xl font-bold tracking-tight text-white">
        {angle}°
      </Text>
    </View>
  );
}
