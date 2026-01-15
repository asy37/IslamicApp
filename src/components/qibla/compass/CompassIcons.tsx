import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { View } from "react-native";
import KaabaIcon from "@/assets/svg/Kaaba";

type CompassIconsProps = Readonly<{
  readonly dialRotation: number;
  readonly qiblaRotation: number;
  readonly accent: string;
  readonly compassSize: number;
}>;

export default function CompassIcons({
  dialRotation,
  qiblaRotation,
  accent,
  compassSize,
}: CompassIconsProps) {
    
  return (
    <>
      <View
        className={clsx(
          "absolute items-center justify-center rounded-full",
          dialRotation
        )}
      >
        <MaterialIcons name="navigation" size={80} color={accent} />
      </View>
      <View
        className="absolute items-center justify-center"
        style={{
          width: compassSize,
          height: compassSize,
          transform: [{ rotate: `${qiblaRotation}deg` }],
        }}
      >
        <View className="absolute items-center justify-center rounded-full top-0">
          <KaabaIcon width={60} height={60} />
        </View>
      </View>
    </>
  );
}
