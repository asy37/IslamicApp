import clsx from "clsx"
import { useTheme } from "@/lib/storage/useThemeStore"
import { useTranslation } from "@/lib/i18n"
import { Text, View } from "react-native"

export const ErrorView = ({ text }: { text: string }) => {
    const { isDark } = useTheme();
    const { t } = useTranslation();
    return (
        <View
            className={clsx(
                "flex-1 items-center justify-center p-4",
                isDark ? "bg-background-dark" : "bg-background-light"
            )}
        >
            <Text
                className={clsx(
                    "text-base text-center",
                    isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
                )}
            >
                {t(text)}
            </Text>
        </View>
    )
}
