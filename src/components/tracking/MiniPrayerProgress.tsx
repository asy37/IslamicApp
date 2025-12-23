import { Text, useColorScheme, View } from "react-native";
import { colors } from "../theme/colors";

export default function MiniPrayerProgress() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <>
      <View className="mt-2 h-1.5 w-full flex-row gap-1.5">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className="h-full flex-1 rounded-full bg-primary-500"
            style={{
              shadowColor: colors.primary[500],
              shadowOpacity: 0.4,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 4,
            }}
          />
        ))}
        {[3, 4].map((i) => (
          <View
            key={i}
            className={
              isDark
                ? "h-full flex-1 rounded-full bg-border-dark/40"
                : "h-full flex-1 rounded-full bg-border-light/40"
            }
          />
        ))}
      </View>

      <View className="mt-2 flex-row justify-between text-[10px] font-medium uppercase tracking-widest">
        <Text className="text-[10px] text-primary-500">Fajr</Text>
        <Text className="text-[10px] text-primary-500">Dhuhr</Text>
        <Text className="text-[10px] text-primary-500">Asr</Text>
        <Text
          className={
            "text-[10px] " +
            (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
          }
        >
          Maghrib
        </Text>
        <Text
          className={
            "text-[10px] " +
            (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
          }
        >
          Isha
        </Text>
      </View>
    </>
  );
}
