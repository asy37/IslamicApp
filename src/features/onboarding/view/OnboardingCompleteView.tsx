import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import Button from "@/lib/components/button/Button";
import { useAuthFlow } from "@/lib/hooks/auth/useAuth";
import { OnboardingContainer } from "../components";
import { setOnboardingCompleted } from "../utils";

export const OnboardingCompleteView = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { shouldShowRegister, canAccessApp } = useAuthFlow();

  const handleStart = async () => {
    await setOnboardingCompleted(true);
    if (shouldShowRegister) {
      router.replace("/auth/register");
    } else if (canAccessApp) {
      router.replace("/(tabs)");
    } else {
      router.replace("/auth/register");
    }
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
          {t("onboarding.completeTitle")}
        </Text>
        <Text
          className={clsx(
            "text-base text-center max-w-[320px] mb-10",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          {t("onboarding.completeMessage")}
        </Text>
        <Button
          text={t("onboarding.startButton")}
          onPress={handleStart}
          size="medium"
          backgroundColor="white"
          disabled={false}
        />
      </View>
    </OnboardingContainer>
  );
};
