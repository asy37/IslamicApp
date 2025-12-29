import { MaterialIcons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { searchCities, type City } from "@/constants/popular-cities";
import { type LocationData } from "@/lib/hooks/useLocation";
import { useLocationStore } from "@/lib/storage/locationStore";

type ManualLocationModalProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
};

export default function ManualLocationModal({
  visible,
  onClose,
}: ManualLocationModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const setLocation = useLocationStore((state) => state.setLocation);
  
  const filteredCities = useMemo(() => {
    return searchCities(searchQuery);
  }, [searchQuery]);

  const handleSelectCity = (city: City) => {
    setLocation({
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
          {/* Handle */}
          <View className="pt-3 pb-2">
            <View className="flex items-center mb-2">
              <View
                className="h-1.5 w-12 rounded-full"
                style={{
                  backgroundColor: isDark ? "#223833" : "#E2ECE8",
                }}
              />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-3">
              <Text
                className={clsx(
                  "text-xl font-bold tracking-tight",
                  isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                )}
              >
                Select Location
              </Text>
              <Pressable
                onPress={onClose}
                className="rounded-full p-2"
                hitSlop={10}
              >
                <MaterialIcons
                  name="close"
                  size={26}
                  color={isDark ? "#EAF3F0" : "#6B7F78"}
                />
              </Pressable>
            </View>

            {/* Search Bar */}
            <View className="px-6 pb-2">
              <View
                className="relative flex-row items-center rounded-xl px-3 py-2.5"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "#f3f4f6",
                }}
              >
                <MaterialIcons
                  name="search"
                  size={20}
                  color={isDark ? "#8FA6A0" : "#9CA3AF"}
                />
                <TextInput
                  placeholder="Search city (Istanbul, Mecca...)"
                  placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className={clsx(
                    "ml-2 flex-1 text-base",
                    isDark ? "text-text-primaryDark" : "text-text-primaryLight"
                  )}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <MaterialIcons
                      name="clear"
                      size={20}
                      color={isDark ? "#8FA6A0" : "#9CA3AF"}
                    />
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          {/* Divider */}
          <View
            className="h-px w-full"
            style={{
              backgroundColor: isDark
                ? "rgba(34, 56, 51, 0.4)"
                : "rgba(226, 236, 232, 0.6)",
            }}
          />

          {/* Cities List */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {filteredCities.length === 0 ? (
              <View className="px-6 py-8 items-center">
                <MaterialIcons
                  name="location-off"
                  size={48}
                  color={isDark ? "#6B7F78" : "#9CA3AF"}
                />
                <Text
                  className={clsx(
                    "text-base font-medium mt-4 text-center",
                    isDark
                      ? "text-text-secondaryDark"
                      : "text-text-secondaryLight"
                  )}
                >
                  No cities found
                </Text>
                <Text
                  className={clsx(
                    "text-sm mt-2 text-center",
                    isDark
                      ? "text-text-secondaryDark"
                      : "text-text-secondaryLight"
                  )}
                >
                  Try a different search term
                </Text>
              </View>
            ) : (
              filteredCities.map((city, index) => (
                <CityItem
                  key={`${city.name}-${city.country}-${index}`}
                  city={city}
                  isDark={isDark}
                  onPress={() => handleSelectCity(city)}
                  isLast={index === filteredCities.length - 1}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type CityItemProps = {
  readonly city: City;
  readonly isDark: boolean;
  readonly onPress: () => void;
  readonly isLast: boolean;
};

function CityItem({ city, isDark, onPress, isLast }: CityItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "flex-row items-center gap-4 px-6 py-4",
        !isLast &&
          (isDark
            ? "border-b border-border-dark/20"
            : "border-b border-border-light/40")
      )}
    >
      <View
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isDark ? "bg-primary-500/20" : "bg-primary-50"
        )}
      >
        <MaterialIcons
          name="location-on"
          size={22}
          color={isDark ? "#4CAF84" : "#1F8F5F"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={clsx(
            "text-base font-semibold",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight"
          )}
        >
          {city.name}
        </Text>
        <Text
          className={clsx(
            "text-sm mt-0.5",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight"
          )}
        >
          {city.country}
        </Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={20}
        color={isDark ? "#8FA6A0" : "#9CA3AF"}
      />
    </Pressable>
  );
}
