import { FlatList, Text, useColorScheme } from "react-native";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { searchCities, type City } from "@/constants/popular-cities";
import { UserLocation } from "@/lib/storage/locationStore";
import ModalComponent from "@/components/modal/ModalComponent";
import Button from "@/components/button/Button";

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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
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
    setSelectedCity(city.name);
    setSearchQuery("");
    onClose();
  };

  return (
    <ModalComponent
      isDark={isDark}
      visible={visible}
      onClose={onClose}
      title="Select Location"
    >
      <FlatList
        className="w-full"
        contentContainerClassName="gap-2 pb-4"
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        data={filteredCities}
        renderItem={({ item }) => {
          const isActive = selectedCity === item.name;
          return (
            <Button
              onPress={() => handleSelectCity(item)}
              isDark={isDark}
              leftIcon="location-on"
              rightIcon={isActive ? "check" : "chevron-right"}
              size="large"
              isActive={isActive}
            >
              <Text
                className={clsx(
                  "text-base font-semibold",
                  isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                )}
              >
                {item.name}
              </Text>
              <Text
                className={clsx(
                  "text-sm mt-0.5",
                  isDark
                    ? "text-text-secondaryDark"
                    : "text-text-secondaryLight"
                )}
              >
                {item.country}
              </Text>
            </Button>
          );
        }}
      />
    </ModalComponent>
  );
}
