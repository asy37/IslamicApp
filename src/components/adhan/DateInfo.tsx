import clsx from "clsx";
import { Text, View } from "react-native";
import { PrayerDate } from "./types/date-info";

type DateInfoProps = {
  readonly isDark: boolean;
  readonly data: PrayerDate;
};

export default function DateInfo({
  isDark,
  data,
}: DateInfoProps) {
  const { hijri, gregorian } = data ?? {};
  const hijriDate = `${hijri?.day}, ${hijri?.weekday.en} ${hijri?.month.en} ${hijri?.year}`;
  const gregorianDate = `${gregorian?.day}, ${gregorian?.weekday.en} ${gregorian?.month.en} ${gregorian?.year}`;
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
