import { Image, Text, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";
import React, { useState } from "react";
import { useLocation } from "@/lib/hooks/qibla/useLocation";
import Button from "@/lib/components/button/Button";
import ManualLocationModal from "@/features/adhan/components/ManualLocationModal";
import { queryKeys } from "@/lib/query/queryKeys";
import { useLocationStore, UserLocation } from "@/lib/storage/locationStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { OnboardingContainer } from "../components";
import { LocationChoice } from "../types";
import {
  LOCATION_ILLUSTRATION_URI,
  setLocationPermissionAsked,
  setLocationPermissionGranted,
} from "../utils";

export const OnboardingLocationView = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const setLocation = useLocationStore((state) => state.setLocation);
  const setAutoLocation = useLocationStore((state) => state.setAutoLocation);
  const queryClient = useQueryClient();
  const [showManualModal, setShowManualModal] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<LocationChoice>(null);
  const { requestLocation } = useLocation();

  const handleRequestPermission = async () => {
    await requestLocation();
    await setLocationPermissionAsked(true);
    setAutoLocation(true);
    setHasResult(true);
    setSelectedChoice("allow");
  };

  const handleManualEntry = () => {
    setShowManualModal(true);
  };

  const handleSelectLocation = async (selectedLocation: UserLocation) => {
    await setLocationPermissionAsked(true);
    await setLocationPermissionGranted(false);
    setLocation(selectedLocation);
    setAutoLocation(false);
    setShowManualModal(false);
    queryClient.invalidateQueries({ queryKey: queryKeys.prayerTimes.all });
    setHasResult(true);
    setSelectedChoice("manual");
  };

  return (
    <OnboardingContainer showBackButton={true}>
      <View className="flex-1 justify-center items-center">
        <View className="w-[280px] aspect-square rounded-xl overflow-hidden mb-6">
          <Image
            source={{
              uri: LOCATION_ILLUSTRATION_URI,
            }}
            className="w-full max-w-[280px] aspect-square rounded-xl"
            resizeMode="contain"
          />
        </View>
        <Text
          className={clsx(
            "text-base font-normal leading-relaxed text-center max-w-[340px] mb-8",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          {t("onboarding.locationDescription")}
        </Text>
        <Button
          leftIcon="near-me"
          size="medium"
          onPress={handleRequestPermission}
          text={t("onboarding.locationAllow")}
          backgroundColor="primary"
          isActive={selectedChoice === "allow"}
          isIconActive={selectedChoice === "allow"}
          className="mb-3 w-full max-w-[280px]"
        />
        <Button
          onPress={handleManualEntry}
          size="medium"
          leftIcon="near-me"
          text={t("onboarding.locationManual")}
          backgroundColor="primary"
          isActive={selectedChoice === "manual"}
          isIconActive={selectedChoice === "manual"}
          className="mb-4 w-full max-w-[280px]"
        />
        <Button
          text={t("common.continue")}
          onPress={() => router.push("/onboarding/notifications")}
          size="medium"
          backgroundColor="white"
          disabled={!hasResult}
          className="w-full max-w-[280px]"
        />
      </View>
      <ManualLocationModal
        visible={showManualModal}
        onSelectLocation={handleSelectLocation}
        onClose={() => setShowManualModal(false)}
      />
    </OnboardingContainer>
  );
};
