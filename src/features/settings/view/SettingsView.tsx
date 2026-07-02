import { ScrollView, View, Text } from "react-native";
import { router } from "expo-router";
import clsx from "clsx";
import SettingsHeader from "@/features/settings/components/SettingsHeader";
import SettingsSection from "@/features/settings/components/SettingsSection";
import SettingsItem from "@/features/settings/components/SettingsItem";
import SettingsToggle from "@/features/settings/components/SettingsToggle";
import ThemeSelector from "@/features/settings/components/ThemeSelector";
import VersionInfo from "@/features/settings/components/VersionInfo";
import CalculationMethodModal from "@/features/adhan/components/CalculationMethodModal";
import ManualLocationModal from "@/features/adhan/components/ManualLocationModal";
import { useSettings } from "@/features/settings/hooks";

export const SettingsView = () => {
    const {
        isDark,
        t,
        effectiveLang,
        showCalculationMethodModal,
        setShowCalculationMethodModal,
        showManualLocationModal,
        setShowManualLocationModal,
        notificationPermission,
        autoLocation,
        method,
        adhanNotifications,
        setAdhanNotifications,
        prayerReminderEnabled,
        setPrayerReminderEnabled,
        playAdhanAudio,
        setPlayAdhanAudio,
        vibration,
        setVibration,
        dailyVerseEnabled,
        setDailyVerseEnabled,
        handleToggleChange,
        handleSelectCalculationMethod,
        handleCalculationMethodSelect,
        showLanguagePicker,
        handleAutoLocationChange,
        handleManualLocationSelect,
    } = useSettings();

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
                    <SettingsSection title={t("settings.prayerAndLocation")} isDark={isDark} />
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
                            title={t("settings.calculationMethod")}
                            value={method?.label ?? "Diyanet"}
                            isDark={isDark}
                            onPress={handleSelectCalculationMethod}
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
                            title={t("settings.autoLocation")}
                            subtitle={t("settings.autoLocationSubtitle")}
                            value={autoLocation}
                            onValueChange={handleAutoLocationChange}
                            isDark={isDark}
                        />
                    </View>

                    {/* Notifications */}
                    <SettingsSection title={t("settings.notifications")} isDark={isDark} />
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
                        {notificationPermission === false && (
                            <View className="px-4 py-2">
                                <Text
                                    className={clsx(
                                        "text-sm",
                                        isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                                    )}
                                >
                                    {t("settings.notificationsOff")}
                                </Text>
                            </View>
                        )}
                        <SettingsToggle
                            title={t("settings.adhanNotifications")}
                            value={adhanNotifications}
                            onValueChange={(v) => handleToggleChange(setAdhanNotifications, v, "adhan")}
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
                            title={t("settings.prayerReminder")}
                            subtitle={t("settings.prayerReminderSubtitle")}
                            value={prayerReminderEnabled}
                            onValueChange={(v) => handleToggleChange(setPrayerReminderEnabled, v, "prayerReminder")}
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
                            title={t("settings.dailyVerseNotification")}
                            subtitle={t("settings.dailyVerseSubtitle")}
                            value={dailyVerseEnabled}
                            onValueChange={(v) => handleToggleChange(setDailyVerseEnabled, v, "dailyVerse")}
                            isDark={isDark}
                        />
                    </View>

                    {/* Sound & Haptics */}
                    <SettingsSection title={t("settings.soundAndHaptics")} isDark={isDark} />
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
                            title={t("settings.playAdhanAudio")}
                            value={playAdhanAudio}
                            onValueChange={(v) => handleToggleChange(setPlayAdhanAudio, v, "playAdhan")}
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
                            title={t("settings.vibration")}
                            value={vibration}
                            onValueChange={(v) => handleToggleChange(setVibration, v, "vibration")}
                            isDark={isDark}
                        />
                    </View>

                    {/* Appearance */}
                    <SettingsSection title={t("settings.appearance")} isDark={isDark} />
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
                        <ThemeSelector />
                        <View
                            className="h-px"
                            style={{
                                backgroundColor: isDark
                                    ? "rgba(34, 56, 51, 0.5)"
                                    : "#E2ECE8",
                            }}
                        />
                        <SettingsItem
                            title={t("settings.language")}
                            value={t(`language.${effectiveLang}`)}
                            isDark={isDark}
                            onPress={showLanguagePicker}
                        />
                    </View>

                    {/* Support & About */}
                    <SettingsSection title={t("settings.supportAndAbout")} isDark={isDark} />
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
                            title={t("settings.helpCenter")}
                            isDark={isDark}
                            onPress={() => { }}
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
                            title={t("settings.privacyPolicy")}
                            isDark={isDark}
                            onPress={() => router.push("/privacy-policy")}
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
                            title={t("settings.rateTheApp")}
                            isDark={isDark}
                            isPrimary
                            onPress={() => { }}
                        />
                    </View>

                    <VersionInfo isDark={isDark} />
                </View>
            </ScrollView>
            <CalculationMethodModal
                visible={showCalculationMethodModal}
                onClose={() => setShowCalculationMethodModal(false)}
                onSelect={handleCalculationMethodSelect}
            />
            <ManualLocationModal
                visible={showManualLocationModal}
                onClose={() => setShowManualLocationModal(false)}
                onSelectLocation={handleManualLocationSelect}
            />
        </View>
    );
};
