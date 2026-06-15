import clsx from "clsx";
import { Text, View } from "react-native";
import { PrayerDate } from "../types/date-info";
import { useTranslation } from "@/lib/i18n";
import { formatGregorianDate, formatHijriDate } from "@/lib/utils/date";

type DateInfoProps = {
  readonly isDark: boolean;
  readonly data: PrayerDate;
};

export default function DateInfo({
  isDark,
  data,
}: DateInfoProps) {
  const { i18n } = useTranslation();
  const { hijri, gregorian } = data ?? {};

  const currentLocale = i18n.language || "tr";
  const hijriDate = formatHijriDate(hijri, gregorian, currentLocale);
  const gregorianDate = formatGregorianDate(gregorian, currentLocale);

  return (
    <View
      className={clsx(
        "px-6 pb-6",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
    >
      <Text
        className={clsx(
          "text-sm font-normal leading-normal",
          isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
        )}
      >
        {hijriDate} | {gregorianDate}
      </Text>
    </View>
  );
}
