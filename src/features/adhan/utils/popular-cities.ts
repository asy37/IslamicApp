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
  // Türkiye (81 Cities in alphabetical order)
  { name: "Adana", country: "Türkiye", latitude: 36.9914, longitude: 35.3308 },
  { name: "Adıyaman", country: "Türkiye", latitude: 37.7648, longitude: 38.2786 },
  { name: "Afyonkarahisar", country: "Türkiye", latitude: 38.7507, longitude: 30.5567 },
  { name: "Ağrı", country: "Türkiye", latitude: 39.7191, longitude: 43.0503 },
  { name: "Aksaray", country: "Türkiye", latitude: 38.3687, longitude: 34.0372 },
  { name: "Amasya", country: "Türkiye", latitude: 40.6499, longitude: 35.8353 },
  { name: "Ankara", country: "Türkiye", latitude: 39.9334, longitude: 32.8597 },
  { name: "Antalya", country: "Türkiye", latitude: 36.8841, longitude: 30.7056 },
  { name: "Ardahan", country: "Türkiye", latitude: 41.1105, longitude: 42.7022 },
  { name: "Artvin", country: "Türkiye", latitude: 41.1828, longitude: 41.8183 },
  { name: "Aydın", country: "Türkiye", latitude: 37.8560, longitude: 27.8416 },
  { name: "Balıkesir", country: "Türkiye", latitude: 39.6484, longitude: 27.8826 },
  { name: "Bartın", country: "Türkiye", latitude: 41.6344, longitude: 32.3375 },
  { name: "Batman", country: "Türkiye", latitude: 37.8812, longitude: 41.1351 },
  { name: "Bayburt", country: "Türkiye", latitude: 40.2552, longitude: 40.2249 },
  { name: "Bilecik", country: "Türkiye", latitude: 40.1426, longitude: 29.9793 },
  { name: "Bingöl", country: "Türkiye", latitude: 38.8854, longitude: 40.4980 },
  { name: "Bitlis", country: "Türkiye", latitude: 38.4006, longitude: 42.1095 },
  { name: "Bolu", country: "Türkiye", latitude: 40.7350, longitude: 31.6077 },
  { name: "Burdur", country: "Türkiye", latitude: 37.7269, longitude: 30.2889 },
  { name: "Bursa", country: "Türkiye", latitude: 40.1826, longitude: 29.0665 },
  { name: "Çanakkale", country: "Türkiye", latitude: 40.1553, longitude: 26.4142 },
  { name: "Çankırı", country: "Türkiye", latitude: 40.6013, longitude: 33.6134 },
  { name: "Çorum", country: "Türkiye", latitude: 40.5506, longitude: 34.9556 },
  { name: "Denizli", country: "Türkiye", latitude: 37.7760, longitude: 29.0864 },
  { name: "Diyarbakır", country: "Türkiye", latitude: 37.9144, longitude: 40.2306 },
  { name: "Düzce", country: "Türkiye", latitude: 40.8438, longitude: 31.1625 },
  { name: "Edirne", country: "Türkiye", latitude: 41.6818, longitude: 26.5623 },
  { name: "Elazığ", country: "Türkiye", latitude: 38.6810, longitude: 39.2264 },
  { name: "Erzincan", country: "Türkiye", latitude: 39.7500, longitude: 39.5000 },
  { name: "Erzurum", country: "Türkiye", latitude: 39.9000, longitude: 41.2700 },
  { name: "Eskişehir", country: "Türkiye", latitude: 39.7767, longitude: 30.5206 },
  { name: "Gaziantep", country: "Türkiye", latitude: 37.0662, longitude: 37.3833 },
  { name: "Giresun", country: "Türkiye", latitude: 40.9128, longitude: 38.3895 },
  { name: "Gümüşhane", country: "Türkiye", latitude: 40.4600, longitude: 39.4814 },
  { name: "Hakkari", country: "Türkiye", latitude: 37.5833, longitude: 43.7333 },
  { name: "Hatay", country: "Türkiye", latitude: 36.4018, longitude: 36.3498 },
  { name: "Iğdır", country: "Türkiye", latitude: 39.9167, longitude: 44.0333 },
  { name: "Isparta", country: "Türkiye", latitude: 37.7648, longitude: 30.5566 },
  { name: "İstanbul", country: "Türkiye", latitude: 41.0082, longitude: 28.9784 },
  { name: "İzmir", country: "Türkiye", latitude: 38.4237, longitude: 27.1428 },
  { name: "Kahramanmaraş", country: "Türkiye", latitude: 37.5858, longitude: 36.9371 },
  { name: "Karabük", country: "Türkiye", latitude: 41.2061, longitude: 32.6204 },
  { name: "Karaman", country: "Türkiye", latitude: 37.1759, longitude: 33.2287 },
  { name: "Kars", country: "Türkiye", latitude: 40.6167, longitude: 43.1000 },
  { name: "Kastamonu", country: "Türkiye", latitude: 41.3887, longitude: 33.7827 },
  { name: "Kayseri", country: "Türkiye", latitude: 38.7312, longitude: 35.4787 },
  { name: "Kırıkkale", country: "Türkiye", latitude: 39.8453, longitude: 33.5153 },
  { name: "Kırklareli", country: "Türkiye", latitude: 41.7333, longitude: 27.2167 },
  { name: "Kırşehir", country: "Türkiye", latitude: 39.1425, longitude: 34.1709 },
  { name: "Kilis", country: "Türkiye", latitude: 36.7184, longitude: 37.1212 },
  { name: "Kocaeli", country: "Türkiye", latitude: 40.8533, longitude: 29.8815 },
  { name: "Konya", country: "Türkiye", latitude: 37.8746, longitude: 32.4932 },
  { name: "Kütahya", country: "Türkiye", latitude: 39.4167, longitude: 29.9833 },
  { name: "Malatya", country: "Türkiye", latitude: 38.3552, longitude: 38.3095 },
  { name: "Manisa", country: "Türkiye", latitude: 38.6191, longitude: 27.4289 },
  { name: "Mardin", country: "Türkiye", latitude: 37.3122, longitude: 40.7339 },
  { name: "Mersin", country: "Türkiye", latitude: 36.8000, longitude: 34.6333 },
  { name: "Muğla", country: "Türkiye", latitude: 37.2153, longitude: 28.3636 },
  { name: "Muş", country: "Türkiye", latitude: 38.7432, longitude: 41.5064 },
  { name: "Nevşehir", country: "Türkiye", latitude: 38.6244, longitude: 34.7144 },
  { name: "Niğde", country: "Türkiye", latitude: 37.9667, longitude: 34.6793 },
  { name: "Ordu", country: "Türkiye", latitude: 40.9839, longitude: 37.8764 },
  { name: "Osmaniye", country: "Türkiye", latitude: 37.0742, longitude: 36.2467 },
  { name: "Rize", country: "Türkiye", latitude: 41.0201, longitude: 40.5234 },
  { name: "Sakarya", country: "Türkiye", latitude: 40.7569, longitude: 30.3783 },
  { name: "Samsun", country: "Türkiye", latitude: 41.2928, longitude: 36.3313 },
  { name: "Şanlıurfa", country: "Türkiye", latitude: 37.1591, longitude: 38.7969 },
  { name: "Siirt", country: "Türkiye", latitude: 37.9333, longitude: 41.9500 },
  { name: "Sinop", country: "Türkiye", latitude: 42.0264, longitude: 35.1628 },
  { name: "Sivas", country: "Türkiye", latitude: 39.7477, longitude: 37.0179 },
  { name: "Şırnak", country: "Türkiye", latitude: 37.5164, longitude: 42.4611 },
  { name: "Tekirdağ", country: "Türkiye", latitude: 40.9833, longitude: 27.5167 },
  { name: "Tokat", country: "Türkiye", latitude: 40.3167, longitude: 36.5500 },
  { name: "Trabzon", country: "Türkiye", latitude: 41.0027, longitude: 39.7168 },
  { name: "Tunceli", country: "Türkiye", latitude: 39.1079, longitude: 39.5401 },
  { name: "Uşak", country: "Türkiye", latitude: 38.6823, longitude: 29.4082 },
  { name: "Van", country: "Türkiye", latitude: 38.4891, longitude: 43.4019 },
  { name: "Yalova", country: "Türkiye", latitude: 40.6500, longitude: 29.2667 },
  { name: "Yozgat", country: "Türkiye", latitude: 39.8181, longitude: 34.8147 },
  { name: "Zonguldak", country: "Türkiye", latitude: 41.4564, longitude: 31.7987 },

  // Holy Islamic Cities & Capitals of Saudi Arabia
  { name: "Mecca", country: "Saudi Arabia", latitude: 21.3891, longitude: 39.8579 },
  { name: "Medina", country: "Saudi Arabia", latitude: 24.5247, longitude: 39.5692 },
  { name: "Riyadh", country: "Saudi Arabia", latitude: 24.7136, longitude: 46.6753 },
  { name: "Jeddah", country: "Saudi Arabia", latitude: 21.4858, longitude: 39.1925 },

  // Important Capitals & Metropolises
  { name: "Baku", country: "Azerbaijan", latitude: 40.4093, longitude: 49.8671 },
  { name: "London", country: "UK", latitude: 51.5074, longitude: -0.1278 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { name: "Berlin", country: "Germany", latitude: 52.5200, longitude: 13.4050 },
  { name: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964 },
  { name: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038 },
  { name: "Vienna", country: "Austria", latitude: 48.2082, longitude: 16.3738 },
  { name: "Brussels", country: "Belgium", latitude: 50.8503, longitude: 4.3517 },
  { name: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041 },
  { name: "Athens", country: "Greece", latitude: 37.9838, longitude: 23.7275 },
  { name: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6173 },
  { name: "Kyiv", country: "Ukraine", latitude: 50.4501, longitude: 30.5234 },
  { name: "Sarajevo", country: "Bosnia and Herzegovina", latitude: 43.8563, longitude: 18.4131 },
  { name: "Washington, D.C.", country: "USA", latitude: 38.9072, longitude: -77.0369 },
  { name: "New York", country: "USA", latitude: 40.7128, longitude: -74.0060 },
  { name: "Ottawa", country: "Canada", latitude: 45.4215, longitude: -75.6972 },
  { name: "Brasilia", country: "Brazil", latitude: -15.7975, longitude: -47.8919 },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { name: "Beijing", country: "China", latitude: 39.9042, longitude: 116.4074 },
  { name: "Seoul", country: "South Korea", latitude: 37.5665, longitude: 126.9780 },
  { name: "New Delhi", country: "India", latitude: 28.6139, longitude: 77.2090 },
  { name: "Islamabad", country: "Pakistan", latitude: 33.6844, longitude: 73.0479 },
  { name: "Jakarta", country: "Indonesia", latitude: -6.2088, longitude: 106.8456 },
  { name: "Kuala Lumpur", country: "Malaysia", latitude: 3.1390, longitude: 101.6869 },
  { name: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  { name: "Bangkok", country: "Thailand", latitude: 13.7563, longitude: 100.5018 },
  { name: "Canberra", country: "Australia", latitude: -35.2809, longitude: 149.1300 },
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  { name: "Baghdad", country: "Iraq", latitude: 33.3152, longitude: 44.3661 },
  { name: "Tehran", country: "Iran", latitude: 35.6892, longitude: 51.3890 },
  { name: "Damascus", country: "Syria", latitude: 33.5138, longitude: 36.2765 },
  { name: "Amman", country: "Jordan", latitude: 31.9454, longitude: 35.9284 },
  { name: "Beirut", country: "Lebanon", latitude: 33.8938, longitude: 35.5018 },
  { name: "Jerusalem", country: "Palestine", latitude: 31.7683, longitude: 35.2137 },
  { name: "Doha", country: "Qatar", latitude: 25.2854, longitude: 51.5310 },
  { name: "Abu Dhabi", country: "UAE", latitude: 24.4539, longitude: 54.3773 },
  { name: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708 },
  { name: "Kuwait City", country: "Kuwait", latitude: 29.3759, longitude: 47.9774 },
] as const;

/**
 * Normalizes text to handle Turkish characters and accents for case-insensitive matching
 */
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Search cities by name or country with Turkish character tolerance
 */
export function searchCities(query: string): City[] {
  if (!query.trim()) {
    return Array.from(POPULAR_CITIES);
  }

  const normalizedQuery = normalizeText(query);

  return POPULAR_CITIES.filter(
    (city) =>
      normalizeText(city.name).includes(normalizedQuery) ||
      normalizeText(city.country).includes(normalizedQuery)
  );
}
