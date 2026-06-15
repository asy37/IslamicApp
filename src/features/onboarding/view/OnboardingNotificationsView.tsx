import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";
import { useState } from "react";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import Button from "@/lib/components/button/Button";
import { notificationService } from "@/lib/notifications/NotificationService";
import { OnboardingContainer } from "../components";
import { NotificationChoice } from "../types";

export const OnboardingNotificationsView = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<NotificationChoice>(null);

  const handleAllowNotifications = async () => {
    setRequesting(true);
    await notificationService.requestPermissions();
    setRequesting(false);
    setHasResult(true);
    setSelectedChoice("allow");
  };

  const handleNotNow = () => {
    setHasResult(true);
    setSelectedChoice("notNow");
  };

  const handleContinue = () => {
    router.push("/onboarding/complete");
  };

  return (
    <OnboardingContainer showBackButton={true}>
      <View className="flex-1 justify-center items-center">
        <Text
          className={clsx(
            "text-2xl font-semibold text-center mb-3",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {t("onboarding.notificationsTitle")}
        </Text>
        <Text
          className={clsx(
            "text-base text-center max-w-[320px] mb-8",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          {t("onboarding.notificationsDescription")}
        </Text>
        <Button
          text={t("onboarding.notificationsAllow")}
          onPress={handleAllowNotifications}
          size="medium"
          backgroundColor="primary"
          disabled={requesting}
          isActive={selectedChoice === "allow"}
          className="mb-3 w-full max-w-[280px]"
        />
        <Button
          text={t("onboarding.notificationsNotNow")}
          onPress={handleNotNow}
          size="medium"
          backgroundColor="primary"
          isActive={selectedChoice === "notNow"}
          className="mb-4 w-full max-w-[280px]"
        />
        <Button
          text={t("common.continue")}
          onPress={handleContinue}
          size="medium"
          backgroundColor="white"
          disabled={!hasResult}
          className="w-full max-w-[280px]"
        />
      </View>
    </OnboardingContainer>
  );
};
