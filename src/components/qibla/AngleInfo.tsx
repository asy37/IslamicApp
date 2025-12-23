import { Text, View } from "react-native";

type AngleInfoProps = {
  readonly angle: number;
  readonly isDark: boolean;
};

export default function AngleInfo({ angle, isDark }: AngleInfoProps) {
  return (
    <View
      className="rounded-xl p-4 items-center justify-center min-w-[100px]"
      style={{
        backgroundColor: "#1F8F5F",
        shadowColor: "#1F8F5F",
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
        Açı
      </Text>
      <Text className="text-2xl font-bold tracking-tight text-white">
        {angle}°
      </Text>
    </View>
  );
}

