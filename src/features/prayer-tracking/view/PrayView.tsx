import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import clsx from "clsx";
import TodayJourneyCard from "@/features/prayer-tracking/components/TodayJourneyCard";
import DailyProgressSection from "@/features/prayer-tracking/components/DailyProgressSection";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { colors } from "@/lib/components/theme/colors";
import { PrayerTrackingData } from "@/features/prayer-tracking/types";

interface PrayViewProps {
    data: PrayerTrackingData;
    isLoading: boolean;
    error: Error | null;
}

export const PrayView = ({ data, isLoading, error }: PrayViewProps) => {
    const { isDark } = useTheme();
    const { t } = useTranslation();
    if (isLoading) {
        return (
            <View
                className={clsx(
                    "flex-1 items-center justify-center",
                    isDark ? "bg-background-dark" : "bg-background-light"
                )}
            >
                <ActivityIndicator size="large" color={isDark ? colors.secondary : colors.primary[500]} />
                <Text
                    className={clsx(
                        "mt-4 text-sm",
                        isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                    )}
                >
                    {t("prayer.loadingTimes")}
                </Text>
            </View>
        );
    }



    return (
        <ScrollView
            className={clsx("flex-1 p-4", isDark ? "bg-background-dark" : "bg-background-light")}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
        >


            {/* Today's Journey Card */}
            <View className="mt-6">
                <TodayJourneyCard data={data} />
            </View>

            {/* Daily Progress Section */}
            <DailyProgressSection data={data} />
        </ScrollView>
    );
}