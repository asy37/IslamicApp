import { City } from "@/constants/popular-cities";
import { CityListItem } from "./CityListItem";

type CitiesListProps = {
  readonly cities: readonly City[];
  readonly isDark: boolean;
  readonly onSelectCity: (city: City) => void;
};

export function CitiesList({ cities, isDark, onSelectCity }: CitiesListProps) {
  return (
    <>
      {cities.map((city, index) => (
        <CityListItem
          key={`${city.name}-${city.country}-${index}`}
          city={city}
          isDark={isDark}
          onPress={() => onSelectCity(city)}
          isLast={index === cities.length - 1}
        />
      ))}
    </>
  );
}
