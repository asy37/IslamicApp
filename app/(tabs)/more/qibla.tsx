import { useColorScheme, View } from "react-native";
import clsx from "clsx";
import QiblaHeader from "@/components/qibla/QiblaHeader";
import Compass from "@/components/qibla/Compass";
import AlignmentFeedback from "@/components/qibla/AlignmentFeedback";
import LocationInfo from "@/components/qibla/LocationInfo";
import AngleInfo from "@/components/qibla/AngleInfo";
import CalibrationHint from "@/components/qibla/CalibrationHint";

export default function QiblaScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const qiblaAngle = 152; // Örnek açı - gerçek uygulamada hesaplanacak

  return (
    <View
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
    >
      <QiblaHeader isDark={isDark} />
      <View className="flex-1 flex-col items-center justify-center relative">
        <Compass isDark={isDark} qiblaAngle={qiblaAngle} />
        <AlignmentFeedback isDark={isDark} />
      </View>
      <View className="p-6 pb-8 z-10">
        <View className="flex-row items-center justify-between gap-4">
          <LocationInfo isDark={isDark} />
          <AngleInfo angle={qiblaAngle} isDark={isDark} />
        </View>
        <CalibrationHint isDark={isDark} />
      </View>
    </View>
  );
}

