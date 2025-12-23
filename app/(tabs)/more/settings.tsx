import { ScrollView, useColorScheme, View } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsItem from "@/components/settings/SettingsItem";
import SettingsToggle from "@/components/settings/SettingsToggle";
import ThemeSelector from "@/components/settings/ThemeSelector";
import VersionInfo from "@/components/settings/VersionInfo";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Toggle states
  const [autoLocation, setAutoLocation] = useState(true);
  const [adhanNotifications, setAdhanNotifications] = useState(true);
  const [prePrayerAlerts, setPrePrayerAlerts] = useState(false);
  const [playAdhanAudio, setPlayAdhanAudio] = useState(true);
  const [vibration, setVibration] = useState(true);

  return (
    <View
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
    >
      <SettingsHeader isDark={isDark} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-2">
          {/* Prayer & Location */}
          <SettingsSection title="Prayer & Location" isDark={isDark} />
          <View
            className={clsx(
              "rounded-xl overflow-hidden",
              isDark ? "bg-background-cardDark" : "bg-background-cardLight"
            )}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <SettingsItem
              title="Calculation Method"
              value="ISNA"
              isDark={isDark}
              onPress={() => {}}
            />
            <View
              className="h-px"
              style={{
                backgroundColor: isDark
                  ? "rgba(34, 56, 51, 0.5)"
                  : "#E2ECE8",
              }}
            />
            <SettingsItem
              title="Asr Juristic Method"
              value="Standard"
              isDark={isDark}
              onPress={() => {}}
            />
            <View
              className="h-px"
              style={{
                backgroundColor: isDark
                  ? "rgba(34, 56, 51, 0.5)"
                  : "#E2ECE8",
              }}
            />
            <SettingsToggle
              title="Auto Location"
              subtitle="Use GPS for accurate times"
              value={autoLocation}
              onValueChange={setAutoLocation}
              isDark={isDark}
            />
          </View>

          {/* Notifications */}
          <SettingsSection title="Notifications" isDark={isDark} />
          <View
            className={clsx(
              "rounded-xl overflow-hidden",
              isDark ? "bg-background-cardDark" : "bg-background-cardLight"
            )}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <SettingsToggle
              title="Adhan Notifications"
              value={adhanNotifications}
              onValueChange={setAdhanNotifications}
              isDark={isDark}
            />
            <View
              className="h-px"
              style={{
                backgroundColor: isDark
                  ? "rgba(34, 56, 51, 0.5)"
                  : "#E2ECE8",
              }}
            />
            <SettingsToggle
              title="Pre-Prayer Alerts"
              subtitle="Remind 15 mins before"
              value={prePrayerAlerts}
              onValueChange={setPrePrayerAlerts}
              isDark={isDark}
            />
          </View>

          {/* Sound & Haptics */}
          <SettingsSection title="Sound & Haptics" isDark={isDark} />
          <View
            className={clsx(
              "rounded-xl overflow-hidden",
              isDark ? "bg-background-cardDark" : "bg-background-cardLight"
            )}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <SettingsToggle
              title="Play Adhan Audio"
              value={playAdhanAudio}
              onValueChange={setPlayAdhanAudio}
              isDark={isDark}
            />
            <View
              className="h-px"
              style={{
                backgroundColor: isDark
                  ? "rgba(34, 56, 51, 0.5)"
                  : "#E2ECE8",
              }}
            />
            <SettingsToggle
              title="Vibration"
              value={vibration}
              onValueChange={setVibration}
              isDark={isDark}
            />
          </View>

          {/* Appearance */}
          <SettingsSection title="Appearance" isDark={isDark} />
          <View
            className={clsx(
              "rounded-xl overflow-hidden",
              isDark ? "bg-background-cardDark" : "bg-background-cardLight"
            )}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <ThemeSelector isDark={isDark} />
          </View>

          {/* Support & About */}
          <SettingsSection title="Support & About" isDark={isDark} />
          <View
            className={clsx(
              "rounded-xl overflow-hidden",
              isDark ? "bg-background-cardDark" : "bg-background-cardLight"
            )}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <SettingsItem
              title="Help Center"
              isDark={isDark}
              onPress={() => {}}
            />
            <View
              className="h-px"
              style={{
                backgroundColor: isDark
                  ? "rgba(34, 56, 51, 0.5)"
                  : "#E2ECE8",
              }}
            />
            <SettingsItem
              title="Privacy Policy"
              isDark={isDark}
              onPress={() => {}}
            />
            <View
              className="h-px"
              style={{
                backgroundColor: isDark
                  ? "rgba(34, 56, 51, 0.5)"
                  : "#E2ECE8",
              }}
            />
            <SettingsItem
              title="Rate the App"
              isDark={isDark}
              isPrimary
              onPress={() => {}}
            />
          </View>

          <VersionInfo isDark={isDark} />
        </View>
      </ScrollView>
    </View>
  );
}

