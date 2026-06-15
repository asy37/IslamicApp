import React from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import clsx from "clsx";
import { DuasHeader, DuasList, FloatingActionButton } from "../components";
import { useDuas } from "@/features/my-duas/hooks/useDuas";
import SelectButton from "@/lib/components/button/SelectButton";
import { FILTERS, filterDuas } from "../utils";
import { useTheme } from "@/lib/storage/useThemeStore";
import { colors } from "@/lib/components/theme/colors";
import { useTranslation } from "@/lib/i18n";
import { FilterType } from "../types";

export const MyDuas = () => {
    const { isDark } = useTheme();
    const [selectedFilter, setSelectedFilter] = React.useState<FilterType>("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const { duas, isLoading, createDua, updateDua, deleteDua, toggleFavorite, isSaving } = useDuas();
    const { t, i18n } = useTranslation();

    const localizedFilters = React.useMemo(() => {
        return FILTERS.map((f) => ({
            key: f.key,
            label: t(`duas.${f.key}`),
        }));
    }, [t]);

    // Convert Dua to display format and filter
    const filteredDuas = React.useMemo(() => {
        return filterDuas(duas, selectedFilter, searchQuery, i18n.language);
    }, [duas, selectedFilter, searchQuery, i18n.language]);

    return (
        <View
            className={clsx(
                "flex-1",
                isDark ? "bg-background-dark" : "bg-background-light"
            )}
        >
            <DuasHeader setSearchQuery={setSearchQuery} />
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            ) : (
                <>
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ paddingBottom: 100, paddingLeft: 12, paddingRight: 12 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <SelectButton
                            buttonData={localizedFilters}
                            selectedFilter={selectedFilter}
                            onPress={setSelectedFilter}
                        />
                        <View className="flex-1 flex-col p-4 gap-4">
                            <DuasList duas={filteredDuas} updateDua={updateDua} deleteDua={deleteDua} toggleFavorite={toggleFavorite} isSaving={isSaving} />
                        </View>
                    </ScrollView>
                    <FloatingActionButton createDua={createDua} isSaving={isSaving} />
                </>
            )}
        </View>
    );
}