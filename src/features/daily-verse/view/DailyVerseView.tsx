import { ScrollView } from "react-native";
import clsx from "clsx";

import { useTheme } from "@/lib/storage/useThemeStore";
import DailyVerseHeader from "../components/DailyVerseHeader";
import DailyVerseCard from "../components/DailyVerseCard";

export const DailyVerseView = () => {
    const { isDark } = useTheme();

    return (
        <ScrollView
            className={clsx(
                "flex-1 p-4",
                isDark ? "bg-background-dark" : "bg-background-light"
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
        >
            <DailyVerseHeader isDark={isDark} />
            <DailyVerseCard isDark={isDark} />
        </ScrollView>
    )
};