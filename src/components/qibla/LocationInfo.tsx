import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { UserLocation } from "@/lib/storage/locationStore";

export default function LocationInfo({
  isDark,
  location,
  loading,
  error,
}: {
  isDark: boolean;
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
}) {
  const title = loading
    ? "Konum alınıyor…"
    : error
      ? "Konum hatası"
      : location
        ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
        : "Konum yok";

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
        <Text
          className={isDark ? "text-xs font-medium uppercase tracking-wider" : "text-xs font-medium uppercase tracking-wider"}
          style={{ color: isDark ? "#8FA6A0" : "#6B7F78" }}
        >
          Konum
        </Text>
        <Text
          className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold"}
          style={{ color: isDark ? "#FFFFFF" : "#1C2A26" }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {error && !loading && (
          <Text
            className="text-[10px] mt-0.5"
            style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}
            numberOfLines={2}
          >
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}

