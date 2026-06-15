import { ScrollView, View, Text } from "react-native";
import clsx from "clsx";
import { PrayerTimings } from "@/lib/components/prayer-list/types/prayer-timings";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { AladhanPrayerTimesResponse } from "@/lib/api/services/prayerTimes";
import { PrayerDate } from "../types/date-info";
import AdhanHeader from "../components/AdhanHeader";
import DateInfo from "../components/DateInfo";
import NextPrayerCard from "../components/NextPrayerCard";
import React from "react";
import { adhanMap } from "../utils/utils-function";
import PrayerScheduleList from "@/lib/components/prayer-list/PrayerList";

interface AdhanViewProps {
    todayData: AladhanPrayerTimesResponse["data"] | null;
}

export const AdhanView = ({ todayData }: AdhanViewProps) => {
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const prayerDate = todayData?.date as PrayerDate | undefined;
    const prayerTimings = todayData?.timings as PrayerTimings | undefined;
    const hasData = todayData?.timings != null;
    return (
        <View
            className={clsx(
                "flex-1",
                isDark ? "bg-background-dark" : "bg-background-light"
            )}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <AdhanHeader isDark={isDark} />
                {hasData ? (
                    <>
                        <DateInfo isDark={isDark} data={prayerDate!} />
                        <NextPrayerCard isDark={isDark} data={prayerTimings} />
                        <PrayerScheduleList
                            prayerMap={adhanMap}
                            isDark={isDark}
                            data={prayerTimings}
                            extended={false}
                        />
                    </>
                ) : (
                    <View className="flex-1 items-center justify-center px-6 py-12">
                        <Text
                            className={clsx(
                                "text-base text-center",
                                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                            )}
                        >
                            {t("adhan.offlineMessage")}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}
