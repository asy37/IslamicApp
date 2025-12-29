import { Modal, ScrollView, View, useColorScheme } from "react-native";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { searchCities, type City } from "@/constants/popular-cities";
import { ManualLocationModalHeader } from "./ManualLocationModalHeader";
import { CitiesList } from "./CityList";
import { UserLocation } from "@/lib/storage/locationStore";

type ManualLocationModalProps = {
  readonly visible: boolean;
  readonly onSelectLocation: (location: UserLocation) => void;
  readonly onClose: () => void;
};

export default function ManualLocationModal({
  visible,
  onSelectLocation,
  onClose,
}: ManualLocationModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = useMemo(() => {
    return searchCities(searchQuery);
  }, [searchQuery]);

  const handleSelectCity = (city: City) => {
    onSelectLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      country: city.country,
    });
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60">
        <View
          className={clsx(
            "absolute bottom-0 left-0 right-0 rounded-t-3xl max-h-[90%]",
            isDark ? "bg-background-dark" : "bg-background-light"
          )}
        >
          <ManualLocationModalHeader
            isDark={isDark}
            searchQuery={searchQuery}
            onClose={onClose}
            onSearchChange={setSearchQuery}
          />

          <View
            className="h-px w-full"
            style={{
              backgroundColor: isDark
                ? "rgba(34, 56, 51, 0.4)"
                : "rgba(226, 236, 232, 0.6)",
            }}
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <CitiesList
              cities={filteredCities}
              isDark={isDark}
              onSelectCity={handleSelectCity}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
