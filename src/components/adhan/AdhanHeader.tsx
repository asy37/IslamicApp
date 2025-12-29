import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import LocationPermissionModal from "./LocationPermissionModal";
import ManualLocationModal from "./ManualLocationModal";

import CalculationMethodModal from "./CalculationMethodModal";
import { useLocationStore } from "@/lib/storage/locationStore";
import { getLocationText } from "./utils/utils-function";

type AdhanHeaderProps = {
  readonly isDark: boolean;
};

export default function AdhanHeader({ isDark }: AdhanHeaderProps) {
  const location = useLocationStore((state) => state.location);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showCalculationMethodModal, setShowCalculationMethodModal] =
    useState(false);

  const handleManualEntry = () => {
    console.log('work');
    setShowPermissionModal(false);
    setShowManualModal(true);
  };

  const handleSelectCalculationMethod = () => {
    setShowCalculationMethodModal(true);
  };

  const locationText = getLocationText(location);

  return (
    <>
      <View
        className={clsx(
          "px-6 pt-8 pb-2",
          isDark ? "bg-background-dark/95" : "bg-background-light/95"
        )}
      >
        <Pressable
          onPress={() => setShowPermissionModal(true)}
          className="flex-col items-start w-full"
        >
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name="location-on"
              size={20}
              color={isDark ? "#4CAF84" : "#1F8F5F"}
            />
            <Text
              className={clsx(
                "text-sm font-medium tracking-wide uppercase opacity-90",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
              )}
            >
              Current Location
            </Text>
          </View>
          <View className="flex-row items-center justify-between w-full mt-1">
            <Text
              className={clsx(
                "text-2xl font-bold leading-tight tracking-tight",
                isDark ? "text-text-primaryDark" : "text-text-primaryLight"
              )}
            >
              {locationText}
            </Text>
            <Pressable
              className="rounded-full p-2"
              hitSlop={10}
              onPress={handleSelectCalculationMethod}
            >
              <MaterialIcons
                name="settings"
                size={22}
                color={isDark ? "#EAF3F0" : "#6B7F78"}
              />
            </Pressable>
          </View>
        </Pressable>
      </View>

      <LocationPermissionModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onManualEntry={handleManualEntry}
      />

      <ManualLocationModal
        visible={showManualModal}
        onClose={() => setShowManualModal(false)}
      />

      <CalculationMethodModal
        visible={showCalculationMethodModal}
        onClose={() => setShowCalculationMethodModal(false)}
        onSelect={handleSelectCalculationMethod}
      />
    </>
  );
}
