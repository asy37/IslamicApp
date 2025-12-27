/**
 * Prayer Row Component V2
 * Displays prayer with status and action buttons
 * Based on new prayer tracking system
 */

import { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import type { PrayerName, PrayerStatus } from "@/types/prayer-tracking";
import { useUpdatePrayerStatus } from "@/lib/hooks/usePrayerTracking";

type PrayerRowV2Props = {
  readonly prayerName: PrayerName;
  readonly displayName: string;
  readonly time: string; // Display time (e.g., "06:30 AM")
  readonly status: PrayerStatus;
  readonly isPast: boolean; // Whether prayer time has passed
  readonly icon: keyof typeof MaterialIcons.glyphMap;
};

const PRAYER_ICONS: Record<PrayerName, keyof typeof MaterialIcons.glyphMap> = {
  fajr: "wb-twilight",
  dhuhr: "light-mode",
  asr: "sunny",
  maghrib: "nights-stay",
  isha: "dark-mode",
};

export default function PrayerRow({
  prayerName,
  displayName,
  time,
  status,
  isPast,
  icon,
}: PrayerRowV2Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdatePrayerStatus();

  const handleStatusUpdate = (newStatus: PrayerStatus) => {
    updateStatus(
      { prayer: prayerName, status: newStatus },
      {
        onSuccess: () => {
          setIsExpanded(false);
        },
      }
    );
  };

  const getStatusColor = () => {
    switch (status) {
      case "prayed":
        return isDark ? "#4CAF84" : "#1F8F5F";
      case "unprayed":
        return isDark ? "#D96C6C" : "#C62828";
      case "later":
        return isDark ? "#E6B566" : "#F57C00";
      default:
        return isDark ? "#8FA6A0" : "#6B7F78";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "prayed":
        return "check-circle";
      case "unprayed":
        return "cancel";
      case "later":
        return "schedule";
      default:
        return "radio-button-unchecked";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "prayed":
        return "Kılındı";
      case "unprayed":
        return "Kılmadım";
      case "later":
        return "Daha Sonra";
      default:
        return "Beklemede";
    }
  };

  // Determine which buttons to show based on spec:
  // - "Kıldım" → always available
  // - "Daha sonra kılacağım" → for current/upcoming prayers
  // - "Kılmadım" → only for past prayers if not marked as prayed
  const showButtons = (isPast: boolean) => {
    if (status === "prayed") {
      // If prayed, show option to mark as unprayed (correction)
      return ["unprayed"];
    }

    // For upcoming or later status
    if (status === "upcoming" || status === "later") {
      return ["prayed", "later"];
    }

    // For unprayed status - show all options
    if (status === "unprayed") {
      return ["prayed", "later"];
    }

    // Default: show based on time
    // If past and not prayed, show "Kılmadım" option
    if (isPast && status !== "prayed") {
      return ["prayed", "later", "unprayed"];
    }

    // For upcoming prayers
    return ["prayed", "later"];
  };

  const buttons = showButtons(isPast);

  return (
    <View
      className={clsx(
        "rounded-xl border overflow-hidden",
        isDark
          ? "bg-background-cardDark border-border-dark"
          : "bg-background-cardLight border-border-light"
      )}
    >
      {/* Main Row */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4"
        disabled={isPending}
      >
        <View className="flex-row items-center gap-4 flex-1">
          {/* Icon */}
          <View
            className={clsx(
              "w-10 h-10 rounded-lg items-center justify-center",
              isDark ? "bg-primary-500/20" : "bg-primary-50"
            )}
          >
            <MaterialIcons
              name={icon || PRAYER_ICONS[prayerName]}
              size={22}
              color={isDark ? "#4CAF84" : "#1F8F5F"}
            />
          </View>

          {/* Prayer Info */}
          <View className="flex-1">
            <Text
              className={clsx(
                "text-base font-medium",
                isDark ? "text-text-primaryDark" : "text-text-primaryLight"
              )}
            >
              {displayName}
            </Text>
            <Text
              className={clsx(
                "text-xs mt-0.5",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              {time}
            </Text>
          </View>

          {/* Status Badge */}
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name={getStatusIcon() as any}
              size={20}
              color={getStatusColor()}
            />
            <Text
              style={{
                color:
                  status === "prayed"
                    ? isDark
                      ? "#4CAF84"
                      : "#1F8F5F"
                    : status === "unprayed"
                    ? "#D96C6C"
                    : status === "later"
                    ? "#E6B566"
                    : isDark
                    ? "#8FA6A0"
                    : "#6B7F78",
              }}
              className="text-sm font-medium"
            >
              {getStatusText()}
            </Text>
          </View>

          {/* Expand Icon */}
          <MaterialIcons
            name={isExpanded ? "expand-less" : "expand-more"}
            size={20}
            color={isDark ? "#8FA6A0" : "#6B7F78"}
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Actions */}
      {isExpanded && (
        <View
          className={clsx(
            "border-t px-4 py-3 gap-2",
            isDark ? "border-border-dark" : "border-border-light"
          )}
        >
          {buttons.includes("prayed") && (
            <TouchableOpacity
              onPress={() => handleStatusUpdate("prayed")}
              disabled={isPending}
              className={clsx(
                "flex-row items-center justify-center gap-2 h-11 rounded-lg",
                isDark ? "bg-primary-500/20" : "bg-primary-50"
              )}
            >
              <MaterialIcons name="check-circle" size={18} color="#1F8F5F" />
              <Text className="text-primary-500 font-semibold">Kıldım</Text>
            </TouchableOpacity>
          )}

          {buttons.includes("later") && (
            <TouchableOpacity
              onPress={() => handleStatusUpdate("later")}
              disabled={isPending}
              className={clsx(
                "flex-row items-center justify-center gap-2 h-11 rounded-lg",
                isDark ? "bg-warning/20" : "bg-warning/10"
              )}
            >
              <MaterialIcons name="schedule" size={18} color="#E6B566" />
              <Text
                className={clsx(
                  "font-semibold",
                  isDark ? "text-warning" : "text-warning"
                )}
              >
                Daha sonra kılacağım
              </Text>
            </TouchableOpacity>
          )}

          {buttons.includes("unprayed") && (
            <TouchableOpacity
              onPress={() => handleStatusUpdate("unprayed")}
              disabled={isPending}
              className={clsx(
                "flex-row items-center justify-center gap-2 h-11 rounded-lg",
                isDark ? "bg-error/20" : "bg-error/10"
              )}
            >
              <MaterialIcons name="cancel" size={18} color="#D96C6C" />
              <Text
                style={{ color: isDark ? "#D96C6C" : "#C62828" }}
                className="font-semibold"
              >
                Kılmadım
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
