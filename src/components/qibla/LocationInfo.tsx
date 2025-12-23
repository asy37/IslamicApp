import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function LocationInfo({ isDark }: { isDark: boolean }) {
  return (
    <View
      className="flex-1 rounded-xl p-4 border flex-row items-center gap-4"
      style={{
        backgroundColor: isDark
          ? "rgba(26, 44, 38, 0.8)"
          : "#FFFFFF",
        borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#E2ECE8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "#CFEBDD",
        }}
      >
        <MaterialIcons
          name={isDark ? "near-me" : "location-on"}
          size={22}
          color={isDark ? "rgba(255, 255, 255, 0.8)" : "#1F8F5F"}
        />
      </View>
      <View className="flex-col flex-1">
        {isDark ? (
          <>
            <Text
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "#8FA6A0" }}
            >
              Konum
            </Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-lg font-bold text-white">İstanbul</Text>
              <Text className="text-sm" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                Türkiye
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text
              className="text-sm font-bold leading-tight"
              style={{ color: "#1C2A26" }}
            >
              Istanbul, TR
            </Text>
            <Text
              className="text-xs mt-0.5"
              style={{ color: "#6B7F78" }}
            >
              Fatih Camii
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

