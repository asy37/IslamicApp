import { MaterialIcons } from "@expo/vector-icons";
import { Animated, View } from "react-native";
import KaabaIcon from "@/assets/svg/Kaaba";

type CompassIconsProps = Readonly<{
  readonly dialRotation: any;
  readonly qiblaRotation: any;
  readonly accent: string;
  readonly compassSize: number;
}>;

export default function CompassIcons({
  qiblaRotation,
  accent,
  compassSize,
}: CompassIconsProps) {
    
  return (
    <>
      <View
        className="absolute items-center justify-center rounded-full"
      >
        <MaterialIcons name="navigation" size={80} color={accent} />
      </View>
      <Animated.View
        className="absolute items-center justify-center"
        style={{
          width: compassSize,
          height: compassSize,
          transform: [{ rotate: qiblaRotation }],
        }}
      >
        <View className="absolute items-center justify-center rounded-full top-0">
          <KaabaIcon width={60} height={60} />
        </View>
      </Animated.View>
    </>
  );
}
