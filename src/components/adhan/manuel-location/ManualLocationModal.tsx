import { FlatList, Text, TextInput, View, Pressable } from "react-native";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { MaterialIcons } from "@expo/vector-icons";
import { searchCities, type City } from "@/constants/popular-cities";
import { UserLocation } from "@/lib/storage/locationStore";
import ModalComponent from "@/components/modal/ModalComponent";
import Button from "@/components/button/Button";
import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/i18n";
import { colors } from "@/components/theme/colors";

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
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
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

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <ModalComponent
      visible={visible}
      onClose={handleClose}
      title={t("qibla.locationLabel")}
    >
      <View className="pb-3 w-full">
        <View
          className={clsx(
            "relative flex-row items-center rounded-xl px-3 py-2.5",
            isDark ? "bg-primary-400" : "bg-white"
          )}
        >
          <MaterialIcons
            name="search"
            size={20}
            color={colors.text.primaryLight}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t("qibla.searchCityPlaceholder")}
            placeholderTextColor={colors.text.primaryLight}
            className="ml-2 flex-1 text-base text-text-primaryLight"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              className="p-1"
            >
              <MaterialIcons
                name="clear"
                size={18}
                color={colors.text.primaryLight}
              />
            </Pressable>
          )}
        </View>
      </View>
      <FlatList
        className="w-full"
        contentContainerClassName="gap-2 pb-4"
        keyExtractor={(item) => `${item.name}-${item.country}`}
        showsVerticalScrollIndicator={false}
        data={filteredCities}
        renderItem={({ item }) => {
          const isActive = selectedCity === item.name;
          return (
            <Button
              onPress={() => handleSelectCity(item)}
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
