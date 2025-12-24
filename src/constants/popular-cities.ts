/**
 * Popular Cities Data
 * Predefined list of popular cities with coordinates for manual location selection
 */

export type City = {
  readonly name: string;
  readonly country: string;
  readonly latitude: number;
  readonly longitude: number;
};

export const POPULAR_CITIES: readonly City[] = [
  // Türkiye
  { name: "Istanbul", country: "Türkiye", latitude: 41.0082, longitude: 28.9784 },
  { name: "Ankara", country: "Türkiye", latitude: 39.9334, longitude: 32.8597 },
  { name: "İzmir", country: "Türkiye", latitude: 38.4237, longitude: 27.1428 },
  { name: "Bursa", country: "Türkiye", latitude: 40.1826, longitude: 29.0665 },
  { name: "Antalya", country: "Türkiye", latitude: 36.8841, longitude: 30.7056 },
  { name: "Konya", country: "Türkiye", latitude: 37.8746, longitude: 32.4932 },
  { name: "Adana", country: "Türkiye", latitude: 36.9914, longitude: 35.3308 },
  { name: "Gaziantep", country: "Türkiye", latitude: 37.0662, longitude: 37.3833 },
  { name: "Kayseri", country: "Türkiye", latitude: 38.7312, longitude: 35.4787 },
  { name: "Mersin", country: "Türkiye", latitude: 36.8000, longitude: 34.6333 },
  
  // Suudi Arabistan
  { name: "Mecca", country: "Saudi Arabia", latitude: 21.3891, longitude: 39.8579 },
  { name: "Medina", country: "Saudi Arabia", latitude: 24.5247, longitude: 39.5692 },
  { name: "Riyadh", country: "Saudi Arabia", latitude: 24.7136, longitude: 46.6753 },
  { name: "Jeddah", country: "Saudi Arabia", latitude: 21.4858, longitude: 39.1925 },
  
  // Diğer Popüler Şehirler
  { name: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708 },
  { name: "Abu Dhabi", country: "UAE", latitude: 24.4539, longitude: 54.3773 },
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  { name: "London", country: "UK", latitude: 51.5074, longitude: -0.1278 },
  { name: "New York", country: "USA", latitude: 40.7128, longitude: -74.0060 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { name: "Berlin", country: "Germany", latitude: 52.5200, longitude: 13.4050 },
  { name: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041 },
] as const;

/**
 * Search cities by name or country
 */
export function searchCities(query: string): City[] {
  if (!query.trim()) {
    return Array.from(POPULAR_CITIES);
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  );
}

