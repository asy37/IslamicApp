import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import clsx from "clsx";

type Dua = {
  id: string;
  date: string;
  text: string;
  status: "pending" | "answered";
  isFavorite: boolean;
};

type DuaCardProps = {
  readonly dua: Dua;
  readonly isDark: boolean;
};

export default function DuaCard({ dua, isDark }: DuaCardProps) {
  const [isFavorite, setIsFavorite] = useState(dua.isFavorite);
  const isAnswered = dua.status === "answered";

  const getStatusBadgeStyle = () => {
    if (isAnswered) {
      return {
        backgroundColor: isDark ? "rgba(76, 175, 122, 0.1)" : "#E8F5E9",
        color: isDark ? "#4CAF84" : "#1F8F5F",
      };
    }
    return {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(233, 246, 240, 0.5)",
      color: isDark ? "#8FA6A0" : "#6B7F78",
    };
  };

  return (
    <Pressable
      className={clsx(
        "group relative flex-col gap-3 rounded-2xl p-5 border",
        isDark
          ? "bg-background-cardDark border-border-dark/50"
          : "bg-background-cardLight border-gray-100"
      )}
      style={{
        shadowColor: "#1E2D24",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
      }}
    >
      {/* Left border for answered duas */}
      {isAnswered && (
        <View
          className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
          style={{ backgroundColor: "#1F8F5F" }}
        />
      )}

      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-2">
          <MaterialIcons
            name="calendar-today"
            size={16}
            color={isDark ? "#8FA6A0" : "#6B7F78"}
          />
          <Text
            className={clsx(
              "text-xs font-medium",
              isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
            )}
          >
            {dua.date}
          </Text>
        </View>
        <View
          className="px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: getStatusBadgeStyle().backgroundColor }}
        >
          {isAnswered ? (
            <View className="flex-row items-center gap-1">
              <MaterialIcons
                name="check-circle"
                size={12}
                color={getStatusBadgeStyle().color}
              />
              <Text
                className="text-xs font-semibold"
                style={{ color: getStatusBadgeStyle().color }}
              >
                Answered
              </Text>
            </View>
          ) : (
            <Text
              className="text-xs font-semibold"
              style={{ color: getStatusBadgeStyle().color }}
            >
              Pending
            </Text>
          )}
        </View>
      </View>

      <Text
        className={clsx(
          "text-base font-normal leading-relaxed",
          isDark ? "text-text-primaryDark" : "text-text-primaryLight",
          isAnswered && "opacity-80"
        )}
        numberOfLines={2}
      >
        {dua.text}
      </Text>

      <View
        className="flex-row justify-end pt-1 mt-1"
        style={{
          borderTopWidth: 1,
          borderTopColor: isDark
            ? "rgba(34, 56, 51, 0.3)"
            : "rgba(249, 250, 251, 1)",
        }}
      >
        <Pressable
          className="p-2 -mr-2 rounded-full"
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={20}
            color={isFavorite ? "#1F8F5F" : isDark ? "#8FA6A0" : "#6B7F78"}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

