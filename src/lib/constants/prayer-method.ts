export type PrayerCalculationMethod = {
  id: number;
  label: string;
  description?: string;
  requiresShafaq?: boolean;
};

export const PRAYER_CALCULATION_METHODS: PrayerCalculationMethod[] = [
  { id: 0, label: "Jafari", description: "Shia Ithna-Ashari" },
  {
    id: 1,
    label: "Karachi",
    description: "University of Islamic Sciences, Karachi",
  },
  { id: 2, label: "ISNA", description: "Islamic Society of North America" },
  { id: 3, label: "MWL", description: "Muslim World League" },
  {
    id: 4,
    label: "Umm Al-Qura",
    description: "Umm Al-Qura University, Makkah",
  },
  {
    id: 5,
    label: "Egyptian Survey",
    description: "Egyptian General Authority of Survey",
  },
  {
    id: 7,
    label: "Tehran",
    description: "Institute of Geophysics, University of Tehran",
  },
  { id: 8, label: "Gulf Region" },
  { id: 9, label: "Kuwait" },
  { id: 10, label: "Qatar" },
  { id: 11, label: "Singapore", description: "Majlis Ugama Islam Singapura" },
  {
    id: 12,
    label: "France",
    description: "Union Organization Islamic de France",
  },
  {
    id: 13,
    label: "Diyanet",
    description: "Diyanet İşleri Başkanlığı (Turkey)",
  },
  {
    id: 14,
    label: "Russia",
    description: "Spiritual Administration of Muslims of Russia",
  },
  {
    id: 15,
    label: "Moonsighting",
    description: "Moonsighting Committee Worldwide",
    requiresShafaq: true,
  },
  { id: 16, label: "Dubai", description: "Dubai (experimental)" },
  { id: 17, label: "Malaysia", description: "JAKIM" },
  { id: 18, label: "Tunisia" },
  { id: 19, label: "Algeria" },
  { id: 20, label: "Indonesia", description: "KEMENAG" },
  { id: 21, label: "Morocco" },
  { id: 22, label: "Lisbon", description: "Comunidade Islamica de Lisboa" },
  {
    id: 23,
    label: "Jordan",
    description: "Ministry of Awqaf, Islamic Affairs and Holy Places",
  },
];
