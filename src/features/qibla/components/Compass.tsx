import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import type { FeedbackLevel } from "@/features/qibla/hooks/useQiblaGuide";
import { getCompassColor } from "../utils/utils";
import CompassRing from "./compass/CompassRing";
import CompassIcons from "./compass/CompassIcons";

type CompassProps = {
  readonly isDark: boolean;
  readonly heading: number | null;
  readonly qiblaBearing: number | null;
  readonly angleDiff: number;
  readonly feedbackLevel: FeedbackLevel;
};

function getShortestPathTarget(currentCumulative: number, nextValue: number): number {
  const currentNormalized = ((currentCumulative % 360) + 360) % 360;
  let diff = nextValue - currentNormalized;
  diff = ((((diff + 180) % 360) + 360) % 360) - 180;
  return currentCumulative + diff;
}

export default function Compass({
  isDark,
  heading,
  qiblaBearing,
  angleDiff,
  feedbackLevel,
}: CompassProps) {
  const compassSize = 320;
  const accent = getCompassColor(feedbackLevel);

  const dialRotationAnim = useRef(new Animated.Value(0)).current;
  const qiblaRotationAnim = useRef(new Animated.Value(0)).current;

  const isFirstHeadingRef = useRef(true);
  const currentDialRotationRef = useRef(0);

  const isFirstAngleRef = useRef(true);
  const currentQiblaRotationRef = useRef(0);

  // Animate dial background (rotates with device heading)
  useEffect(() => {
    if (heading !== null) {
      const targetDial = -heading;
      if (isFirstHeadingRef.current) {
        dialRotationAnim.setValue(targetDial);
        currentDialRotationRef.current = targetDial;
        isFirstHeadingRef.current = false;
      } else {
        const nextDial = getShortestPathTarget(currentDialRotationRef.current, targetDial);
        currentDialRotationRef.current = nextDial;
        Animated.spring(dialRotationAnim, {
          toValue: nextDial,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();
      }
    }
  }, [heading]);

  // Animate qibla arrow (relative to user facing)
  useEffect(() => {
    if (heading !== null && qiblaBearing !== null) {
      if (isFirstAngleRef.current) {
        qiblaRotationAnim.setValue(angleDiff);
        currentQiblaRotationRef.current = angleDiff;
        isFirstAngleRef.current = false;
      } else {
        const nextQibla = getShortestPathTarget(currentQiblaRotationRef.current, angleDiff);
        currentQiblaRotationRef.current = nextQibla;
        Animated.spring(qiblaRotationAnim, {
          toValue: nextQibla,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();
      }
    }
  }, [angleDiff, qiblaBearing, heading]);

  const dialRotation = dialRotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const qiblaRotation = qiblaRotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="relative items-center justify-center">
      {/* Subtitle (Dark theme only) */}
      {isDark && (
        <View className="z-10 text-center px-4 pb-4">
          <Text className="text-sm font-normal leading-normal opacity-80">
            Turn your direction to Kaaba
          </Text>
        </View>
      )}

      {/* Compass Circle Container */}
      <View
        className="relative items-center justify-center"
        style={{ width: compassSize, height: compassSize }}
      >
        {/* Compass Dial Background (rotates with device heading) */}
        <CompassRing
          compassSize={compassSize}
          isDark={isDark}
          dialRotation={dialRotation}
        />
        <CompassIcons
          dialRotation={dialRotation}
          qiblaRotation={qiblaRotation}
          accent={accent}
          compassSize={compassSize}
        />
      </View>
    </View>
  );
}
