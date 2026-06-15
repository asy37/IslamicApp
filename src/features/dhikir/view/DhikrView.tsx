import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import clsx from "clsx";
import type { Dhikr } from "@/features/dhikir/types";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/lib/components/theme/colors";
import DhikrAdd from "@/features/dhikir/components/DhikrAdd";
import DhikrCounter from "@/features/dhikir/components/DhikrCounter";
import DhikrBottomBar from "@/features/dhikir/components/DhikrBottomBar";
import DhikrHeader from "@/features/dhikir/components/DhikrHeader";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { initializeUserDhikrs } from "@/features/dhikir/utils/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDhikr } from "@/features/dhikir/hooks/useDhikr";
import { useDhikrSync } from "@/features/dhikir/hooks/useDhikrSync";
import { getDb } from "@/lib/database/db";

export const DhikrView = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const userId = user?.id || null;

    const [openAddDhikrModal, setOpenAddDhikrModal] = React.useState(false);
    const [currentSlug, setCurrentSlug] = React.useState<string | null>(null);
    const [isLoadingDhikrs, setIsLoadingDhikrs] = React.useState(true);

    // Initialize database and load available dhikrs
    React.useEffect(() => {
        const initialize = async () => {
            try {
                // Ensure database is initialized
                await getDb();

                // Load and initialize dhikrs for current user
                if (userId && !currentSlug) {
                    const initialSlug = await initializeUserDhikrs(userId);
                    if (initialSlug) {
                        setCurrentSlug(initialSlug);
                    }
                }
            } catch (error) {
                console.error('[DhikrScreen] Error loading dhikrs:', error);
            } finally {
                setIsLoadingDhikrs(false);
            }
        };

        initialize();
    }, [userId, currentSlug]);

    // Use dhikr hook for current selected dhikr
    const { dhikr: currentDhikr, isLoading: isLoadingDhikr, increment, reset } = useDhikr(currentSlug);

    // Enable auto-sync
    useDhikrSync();

    const targetReached = currentDhikr ? currentDhikr.current_count >= currentDhikr.target_count : false;

    const handleIncrement = React.useCallback(() => {
        increment();
    }, [increment]);

    const handleReset = React.useCallback(() => {
        reset();
    }, [reset]);

    const handleSelectDhikr = React.useCallback((dhikr: Dhikr) => {
        setCurrentSlug(dhikr.slug);
    }, []);

    const handleDhikrAdded = React.useCallback(async (newDhikr: Dhikr) => {
        // Set new dhikr as current
        setCurrentSlug(newDhikr.slug);
        // Modal is already closed by DhikrAdd component
    }, []);

    return (
        <SafeAreaView
            className={clsx(
                "flex-1",
                isDark ? "bg-background-dark" : "bg-background-light"
            )}
            edges={["top"]}
        >
            <DhikrHeader isDark={isDark} setOpenAddDhikrModal={setOpenAddDhikrModal} />
            {(() => {
                if (isLoadingDhikrs || isLoadingDhikr) {
                    return (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color={colors.primary[500]} />
                        </View>
                    );
                }

                if (currentDhikr) {
                    return (
                        <>
                            <Text className="text-2xl font-bold text-center">
                                {currentDhikr.label || t("more.dhikrTracker")}
                            </Text>
                            <View className="relative flex-1">
                                <TouchableOpacity
                                    className="flex-1 flex-col items-center justify-center"
                                    onPress={handleIncrement}
                                >
                                    {targetReached && (
                                        <View className="absolute top-10 items-center justify-center">
                                            <MaterialIcons name="check-circle" size={24} color={colors.success} />
                                            <Text className="text-lg font-bold text-center text-success">{t("dhikr.targetReached")}</Text>
                                        </View>
                                    )}
                                    <DhikrCounter
                                        count={currentDhikr.current_count}
                                        dhikrName={currentDhikr.label}
                                        target={currentDhikr.target_count}
                                        isDark={isDark}
                                    />
                                </TouchableOpacity>
                            </View>
                        </>
                    );
                }

                return (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-2xl font-bold text-center">
                            {t("dhikr.selectOrAdd")}
                        </Text>
                    </View>
                );
            })()}
            <DhikrBottomBar
                setCurrentDhikr={handleSelectDhikr}
                currentDhikr={currentDhikr}
                onReset={handleReset}
                isDark={isDark}
            />
            <DhikrAdd
                openAddDhikrModal={openAddDhikrModal}
                setOpenAddDhikrModal={setOpenAddDhikrModal}
                onDhikrAdded={handleDhikrAdded}
            />
        </SafeAreaView>
    );
};