import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStreak } from "@/lib/hooks/prayer-tracking/useStreak";
import StreakCounter from "@/components/tracking/StreakCounter";
import { useState } from "react";
import Button from "@/components/button/Button";
import clsx from "clsx";
import { useTheme } from "@/lib/storage/useThemeStore";
import { usePrayerTimesStore } from "@/lib/storage/prayerTimesStore";
import { PrayerDate } from "../adhan/types/date-info";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import { useUserProfile, useAvatarUrl } from "@/lib/hooks/profile/useUserProfile";
import { useTranslation } from "@/i18n";
import { formatGregorianDate, formatHijriDate } from "@/lib/utils/date";

const PLACEHOLDER_AVATAR = "https://github.com/shadcn.png";

export default function PrayerHeader() {
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);

  const { isDark } = useTheme();
  const { data: streakData } = useStreak();
  const todayData = usePrayerTimesStore((state) => state.getTodayData());
  const { user } = useAuth();
  const { data: profile } = useUserProfile();
  const avatarUrl = useAvatarUrl();
  const displayName = profile?.name ?? user?.user_metadata?.name ?? "";
  const AVATAR_URL = avatarUrl ?? PLACEHOLDER_AVATAR;
  const { t, i18n } = useTranslation();
  const prayerDate = todayData?.date as PrayerDate;
  const currentLocale = i18n.language || "tr";
  const hijriDate = formatHijriDate(prayerDate?.hijri, prayerDate?.gregorian, currentLocale);
  const gregorianDate = formatGregorianDate(prayerDate?.gregorian, currentLocale);

  const count = streakData?.count ?? 0;
  const streakText = `${count} ${count === 1 ? t("common.day") : t("common.days")}`;

  return (
    <SafeAreaView
      edges={["top"]}
      className={isDark ? "bg-background-dark" : "bg-background-light"}
    >
      <View
        className={clsx(
          "border-b px-4 py-2 ",
          isDark
            ? "border-b border-border-dark bg-background-dark/95"
            : "border-b border-border-light bg-background-light/95"
        )}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: AVATAR_URL }}
              className="size-10 rounded-full bg-center bg-cover ring-2 ring-primary-500/20"
            />
            <View>
              <Text
                className={clsx(
                  "text-base font-bold ",
                  isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                )}
              >
                {displayName}
              </Text>
              <View>
                <Text
                  className={clsx(
                    "text-xs ",
                    isDark
                      ? "text-text-secondaryDark"
                      : "text-text-secondaryLight"
                  )}
                >
                  {hijriDate}
                </Text>
                <Text
                  className={clsx(
                    "text-xs ",
                    isDark
                      ? "text-text-secondaryDark"
                      : "text-text-secondaryLight"
                  )}
                >
                  {gregorianDate}
                </Text>
              </View>
            </View>
          </View>
          <Button
            text={streakText}
            onPress={() => setIsStreakModalVisible(true)}
            rightIcon="local-fire-department"
            size="small"
            backgroundColor="primary"
          />

          <Modal
            visible={isStreakModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsStreakModalVisible(false)}
          >
            <Pressable
              className="flex-1 items-center justify-center bg-black/40"
              onPress={() => setIsStreakModalVisible(false)}
            >
              <Pressable
                onPress={() => { }}
                className={clsx(
                  "w-[90%] max-w-sm rounded-2xl p-4 shadow-lg ",
                  isDark ? "bg-background-cardDark" : "bg-background-cardLight"
                )}
              >
                {streakData && <StreakCounter streak={streakData} />}
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}
