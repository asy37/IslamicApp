import { colors } from "@/lib/components/theme/colors";
import { FeedbackLevel } from "@/features/qibla/hooks/useQiblaGuide";

export const getCompassColor = (feedbackLevel: FeedbackLevel) => {
  switch (feedbackLevel) {
    case "far":
      return colors.error;
    case "near":
      return colors.warning;
    case "aligned":
      return colors.success;
  }
};