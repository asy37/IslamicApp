import { MaterialIcons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";
import type { Prayer } from "../../../app/(tabs)";
import { colors } from "../theme/colors";

type PrayerRowProps = {
  readonly prayer: Prayer;
};

export default function PrayerRow({ prayer }: PrayerRowProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View
      className={
        "flex-row items-center justify-between rounded-xl border p-4 opacity-80 shadow-sm " +
        (isDark
          ? "border-border-dark bg-background-cardDark"
          : "border-border-light bg-background-cardLight")
      }
    >
      <View className="flex-row items-center gap-4">
        <View
          className={
            isDark
              ? "size-10 items-center justify-center rounded-lg bg-background-cardDark"
              : "size-10 items-center justify-center rounded-lg bg-background-light"
          }
        >
          <MaterialIcons
            name={prayer.icon as any}
            size={20}
            color={isDark ? "secondaryDark" : "secondaryLight"}
          />
        </View>
        <View>
          <Text
            className={
              "text-base font-medium line-through " +
              (isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")
            }
          >
            {prayer.label}
          </Text>
          <Text
            className={
              "text-xs " +
              (isDark
                ? "text-text-secondaryDark/70"
                : "text-text-secondaryLight/70")
            }
          >
            {prayer.time}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="hidden text-sm font-medium text-success sm:block">
          Kılındı
        </Text>
        <MaterialIcons
          name="check-circle"
          size={22}
          color={isDark ? colors.success : colors.primary[500]}
        />
      </View>
    </View>
  );
}
