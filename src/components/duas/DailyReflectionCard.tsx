import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import clsx from "clsx";

export default function DailyReflectionCard({ isDark }: { isDark: boolean }) {
  return (
    <View
      className="relative overflow-hidden rounded-2xl p-6 border"
      style={{
        backgroundColor: isDark ? "#223833" : "#E8F5E9",
        borderColor: isDark ? "rgba(34, 56, 51, 0.5)" : "rgba(200, 230, 201, 0.5)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="relative z-10">
        <View className="flex-row items-center gap-2 mb-2">
          <MaterialIcons
            name="lightbulb"
            size={18}
            color={isDark ? "#4CAF84" : "#1F8F5F"}
          />
          <Text
            className={clsx(
              "text-xs font-semibold uppercase tracking-wider",
              isDark ? "text-primary-500" : "text-primary-500"
            )}
          >
            Daily Reflection
          </Text>
        </View>
        <Text
          className={clsx(
            "text-lg font-medium mb-4 leading-relaxed",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          What are you most grateful for today?
        </Text>
        <Pressable
          className="flex-row items-center gap-2 bg-white dark:bg-background-cardDark px-4 py-2 rounded-full w-max"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text
            className="text-sm font-bold"
            style={{ color: isDark ? "#4CAF84" : "#1F8F5F" }}
          >
            Write it down
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={16}
            color={isDark ? "#4CAF84" : "#1F8F5F"}
          />
        </Pressable>
      </View>
      {/* Decorative Circle */}
      <View
        className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
        style={{
          backgroundColor: isDark
            ? "rgba(31, 143, 95, 0.1)"
            : "rgba(31, 143, 95, 0.1)",
        }}
      />
    </View>
  );
}

