import { FlatList, Text, View, ActivityIndicator } from "react-native";
import ModalComponent from "../modal/ModalComponent";
import { MaterialIcons } from "@expo/vector-icons";
import { useDhikrStats } from "@/lib/hooks/dhikir/useDhikirStats";
import clsx from "clsx";
import { useTheme } from "@/lib/storage/useThemeStore";
import { colors } from "@/components/theme/colors";
import { useTranslation } from "@/i18n";

type DhikirStatsProps = Readonly<{
    readonly visible: boolean;
    readonly onClose: () => void;
}>;

export default function DhikirStats({ visible, onClose }: DhikirStatsProps) {
    const { isDark } = useTheme();
    const { stats, loading } = useDhikrStats();
    const { t } = useTranslation();

    const statsList = stats
        ? [
              {
                  key: "week",
                  label: t("dhikr.thisWeek"),
                  completed: stats.week.completed,
                  continued: stats.week.active,
                  streak: 0, // Streak calculation not implemented yet
              },
              {
                  key: "month",
                  label: t("dhikr.thisMonth"),
                  completed: stats.month.completed,
                  continued: stats.month.active,
                  streak: 0, // Streak calculation not implemented yet
              },
              {
                  key: "year",
                  label: t("dhikr.thisYear"),
                  completed: stats.year.completed,
                  continued: stats.year.active,
                  streak: 0, // Streak calculation not implemented yet
              },
          ]
        : [];

    return (
        <ModalComponent
            visible={visible}
            onClose={onClose}
            title={t("dhikr.statsTitle")}
        >
            {(() => {
                if (loading) {
                    return (
                        <View className="flex-1 items-center justify-center py-8">
                            <ActivityIndicator size="large" color={colors.primary[500]} />
                            <Text className={clsx("mt-4", isDark ? "text-text-primaryDark" : "text-text-primaryLight")}>
                                {t("dhikr.loadingStats")}
                            </Text>
                        </View>
                    );
                }

                if (!stats || statsList.length === 0) {
                    return (
                        <View className="flex-1 items-center justify-center py-8">
                            <Text className={clsx("text-center", isDark ? "text-text-primaryDark" : "text-text-primaryLight")}>
                                {t("dhikr.noStats")}
                            </Text>
                            <Text className={clsx("text-center mt-2", isDark ? "text-text-secondaryDark" : "text-text-secondaryLight")}>
                                {t("dhikr.startTracking")}
                            </Text>
                        </View>
                    );
                }

                return (
                <FlatList
                    className="w-full"
                    data={statsList}
                    keyExtractor={(item) => item.key}
                    contentContainerClassName="gap-4 pb-4"
                    renderItem={({ item }) => (
                        <View className="flex items-start gap-2">
                            <Text
                                className={clsx(
                                    "text-3xl font-bold",
                                    isDark ? "text-text-primaryDark" : "text-text-secondaryLight"
                                )}
                            >
                                {item.label}
                            </Text>
                            <View
                                className={clsx(
                                    "flex-1 justify-start items-start rounded-2xl shadow-sm p-4 gap-10 w-full",
                                    isDark ? "bg-background-cardDark" : "bg-white"
                                )}
                            >
                                {item.streak > 0 && (
                                    <View className="flex-row items-center justify-between w-full">
                                        <Text className={clsx(isDark ? "text-text-primaryDark" : "text-text-primaryLight")}>
                                            {t("dhikr.streakPrefix")}<Text className="font-bold text-primary-500">{item.streak}</Text>{t("dhikr.streakSuffix")}
                                        </Text>
                                        <View className="p-2 rounded-full bg-primary-500">
                                            <MaterialIcons name="calendar-month" size={24} color="white" />
                                        </View>
                                    </View>
                                )}
                                <View className="flex-row items-center justify-between w-full">
                                    <Text className={clsx(isDark ? "text-text-primaryDark" : "text-text-primaryLight")}>
                                        {t("dhikr.completed")}: <Text className="font-bold text-primary-500">{item.completed}</Text>
                                    </Text>
                                    <Text className={clsx(isDark ? "text-text-primaryDark" : "text-text-primaryLight")}>
                                        {t("dhikr.continued")}: <Text className="font-bold text-primary-500">{item.continued}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
                );
            })()}
        </ModalComponent>
    )
}