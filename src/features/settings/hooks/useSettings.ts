import { useState, useEffect } from "react";
import { Alert, I18nManager } from "react-native";
import * as Location from "expo-location";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { useMethodStore } from "@/lib/storage/useMethodStore";
import { useLocationStore, type UserLocation } from "@/lib/storage/locationStore";
import { useNotificationSettings } from "@/lib/storage/notificationSettings";
import { setStoredLanguage } from "@/lib/i18n/localeStorage";
import type { SupportedLocale } from "@/lib/i18n/localeStorage";
import { queryClient } from "@/lib/query/queryClient";
import { queryKeys } from "@/lib/query/queryKeys";
import { rescheduleNotifications } from "../utils";
import type { SettingsToggleKey } from "../types";
import type { PrayerCalculationMethod } from "@/features/adhan/utils/prayer-method";

export const useSettings = () => {
    const { isDark } = useTheme();
    const { t, i18n: i18nInstance } = useTranslation();
    const currentLang = (i18nInstance.language?.split(/[-_]/)[0] ?? "tr") as string;
    const effectiveLang: SupportedLocale = currentLang === "en" || currentLang === "tr" || currentLang === "ar" ? currentLang : "tr";

    const [showCalculationMethodModal, setShowCalculationMethodModal] = useState(false);
    const [showManualLocationModal, setShowManualLocationModal] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);

    const autoLocation = useLocationStore((s) => s.autoLocation);
    const setAutoLocation = useLocationStore((s) => s.setAutoLocation);
    const setLocation = useLocationStore((s) => s.setLocation);

    const method = useMethodStore((state) => state.method);
    const setMethod = useMethodStore((state) => state.setMethod);

    const adhanNotifications = useNotificationSettings((s) => s.adhanNotifications);
    const setAdhanNotifications = useNotificationSettings((s) => s.setAdhanNotifications);
    const prayerReminderEnabled = useNotificationSettings((s) => s.prayerReminderEnabled);
    const setPrayerReminderEnabled = useNotificationSettings((s) => s.setPrayerReminderEnabled);
    const playAdhanAudio = useNotificationSettings((s) => s.playAdhanAudio);
    const setPlayAdhanAudio = useNotificationSettings((s) => s.setPlayAdhanAudio);
    const vibration = useNotificationSettings((s) => s.vibration);
    const setVibration = useNotificationSettings((s) => s.setVibration);
    const dailyVerseEnabled = useNotificationSettings((s) => s.dailyVerseEnabled);
    const setDailyVerseEnabled = useNotificationSettings((s) => s.setDailyVerseEnabled);

    useEffect(() => {
        import("expo-notifications")
            .then((Notifications) =>
                Notifications.getPermissionsAsync().then(({ status }) => {
                    setNotificationPermission(status === "granted");
                })
            )
            .catch(() => setNotificationPermission(null));
    }, []);

    const handleToggleChange = async (
        setter: (v: boolean) => void,
        value: boolean,
        key: SettingsToggleKey
    ) => {
        setter(value);
        if (key === "adhan" || key === "prayerReminder" || key === "playAdhan" || key === "vibration" || key === "dailyVerse") {
            await rescheduleNotifications();
        }
    };

    const handleSelectCalculationMethod = () => {
        setShowCalculationMethodModal(true);
    };

    const handleCalculationMethodSelect = (selectedMethod: PrayerCalculationMethod) => {
        setMethod(selectedMethod);
        setShowCalculationMethodModal(false);
    };

    const handleLanguageSelect = (code: SupportedLocale) => {
        const isRTL = code === "ar";
        const wasRTL = I18nManager.isRTL;
        i18nInstance.changeLanguage(code);
        setStoredLanguage(code);
        if (isRTL !== wasRTL) {
            I18nManager.forceRTL(isRTL);
            Alert.alert(t("language.restartMessage"));
        }
    };

    const showLanguagePicker = () => {
        Alert.alert(
            t("language.sectionTitle"),
            undefined,
            [
                { text: t("language.en"), onPress: () => handleLanguageSelect("en") },
                { text: t("language.tr"), onPress: () => handleLanguageSelect("tr") },
                { text: t("language.ar"), onPress: () => handleLanguageSelect("ar") },
                { text: t("common.cancel"), style: "cancel" },
            ]
        );
    };

    const handleAutoLocationChange = async (v: boolean) => {
        if (v) {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                    setAutoLocation(true);
                    const position = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });
                    const [address] = await Location.reverseGeocodeAsync({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        city: address?.city || address?.subregion || undefined,
                        country: address?.country || undefined,
                    });
                    queryClient.invalidateQueries({ queryKey: queryKeys.prayerTimes.all });
                } else {
                    Alert.alert(
                        t("settings.locationPermissionRequired"),
                        t("settings.locationPermissionDeniedMessage")
                    );
                }
            } catch (error) {
                console.error("[Settings] Error enabling auto location:", error);
                Alert.alert(t("common.error"), t("prayer.errorLoading"));
            }
        } else {
            setAutoLocation(false);
            setShowManualLocationModal(true);
        }
    };

    const handleManualLocationSelect = (loc: UserLocation) => {
        setLocation(loc);
        setAutoLocation(false);
        queryClient.invalidateQueries({ queryKey: queryKeys.prayerTimes.all });
    };

    return {
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
    };
};
