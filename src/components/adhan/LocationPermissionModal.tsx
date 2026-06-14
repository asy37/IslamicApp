import { Image, Text, View } from "react-native";
import clsx from "clsx";
import { useLocation } from "@/lib/hooks/qibla/useLocation";
import ModalComponent from "@/components/modal/ModalComponent";
import Button from "../button/Button";
import ManualLocationModal from "./manuel-location/ManualLocationModal";
import { queryKeys } from "@/lib/query/queryKeys";
import { useLocationStore, UserLocation } from "@/lib/storage/locationStore";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { storage } from "@/lib/storage/mmkv";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/i18n";
import * as Location from "expo-location";

type LocationPermissionModalProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onPermissionGranted?: () => void;
};

const LOCATION_PERMISSION_ASKED_KEY = "location_permission_asked";
const LOCATION_PERMISSION_GRANTED_KEY = "location_permission_granted";

export default function LocationPermissionModal({
  visible,
  onClose,
  onPermissionGranted,
}: LocationPermissionModalProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const setLocation = useLocationStore((state) => state.setLocation);
  const setAutoLocation = useLocationStore((state) => state.setAutoLocation);
  const queryClient = useQueryClient();
  const [showManualModal, setShowManualModal] = React.useState(false);

  const { requestLocation } = useLocation();
  const handleRequestPermission = async () => {
    await requestLocation();
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      setAutoLocation(true);
      onPermissionGranted?.();
    }
    onClose();
  };
  const handleManualEntry = async () => {
    await storage.set(LOCATION_PERMISSION_ASKED_KEY, "true");
    await storage.set(LOCATION_PERMISSION_GRANTED_KEY, "false");
    setShowManualModal(true);
  };

  const handleSelectLocation = (selectedLocation: UserLocation) => {
    setLocation(selectedLocation);
    setAutoLocation(false);
    setShowManualModal(false);
    queryClient.invalidateQueries({
      queryKey: queryKeys.prayerTimes.all,
    });
    onClose();
  };
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title={t("onboarding.locationPermissionTitle")}
      scrollable={true}
    >
      <View className="items-center gap-4">
        <View className="w-[280px] aspect-square rounded-xl overflow-hidden">
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9fE1Xovp9VwziN1mba7pVKP903EzR-MYa7Uo8lvgrEAUHOu-Do02cZbkIAK-OBNEdBs31X4wBFMiJYZzfj-WDYk1Pc9nNQw1TDywJ1EyqnyLLdrvSDKhXBVbor2-9OkSOvTjNfcBIeUXrml0HJ5TKIKOsZ_uubLM4TuPOfKdCl2-rJ5c3ECX2ScrVQdAzVa2f0KWc0ttX4RoAQqBRUWEZpQiy5chZ_oFrCCch7GyJhW2VulZsOCm67JWBm4uFH7udAmzjLwVJIZ8p",
            }}
            className="w-full max-w-[280px] aspect-square rounded-xl"
            resizeMode="contain"
          />
        </View>
        <Text
          className={clsx(
            "text-base font-normal leading-relaxed text-center max-w-[340px]",
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
        />
        <Button
          onPress={handleManualEntry}
          size="medium"
          leftIcon="near-me"
          text={t("onboarding.locationManual")}
          backgroundColor="primary"
        />
        <ManualLocationModal
          visible={showManualModal}
          onSelectLocation={handleSelectLocation}
          onClose={() => setShowManualModal(false)}
        />
      </View>
    </ModalComponent>
  );
}
