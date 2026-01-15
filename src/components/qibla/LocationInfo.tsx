import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { UserLocation } from "@/lib/storage/locationStore";
import clsx from "clsx";

type LocationInfoProps = {
  readonly isDark: boolean;
  readonly location: UserLocation | null;
  readonly loading: boolean;
  readonly error: string | null;
};

export default function LocationInfo({
  isDark,
  location,
  loading,
  error,
}: LocationInfoProps) {
  let title = "Location not found";

  if (loading) {
    title = "Location is being fetched…";
  } else if (error) {
    title = "Location error";
  } else if (location) {
    title = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  }
  return (
    <View
      className={clsx(
        "flex-1 rounded-xl p-4  flex-row items-center gap-4",
        isDark ? "bg-background-cardDark" : "bg-background-cardLight"
      )}
    >
      <View
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          isDark ? "bg-background-cardDark" : "bg-background-cardLight"
        )}
      >
        <MaterialIcons
          name={isDark ? "near-me" : "location-on"}
          size={22}
          color={isDark ? "rgba(255, 255, 255, 0.8)" : "#1F8F5F"}
        />
      </View>
      <View className="flex-col flex-1">
        <Text
          className={clsx(
            "text-xs font-medium uppercase tracking-wider",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          Location
        </Text>
        <Text
          className={clsx(
            "text-sm font-bold",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
          numberOfLines={1}
        >
          {title}
        </Text>
        {error && !loading && (
          <Text
            className={clsx(
              "text-[10px] mt-0.5",
              isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
            )}
            numberOfLines={2}
          >
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}
