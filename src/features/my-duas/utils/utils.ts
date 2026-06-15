import { FilterType, DuaType } from "../types";

export const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "favorites", label: "Favorites" },
];

export const formatDuaDate = (createdAt: string | Date | number, language: string): string => {
  return new Date(createdAt).toLocaleDateString(language, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDua = (dua: any, language: string): DuaType => {
  return {
    id: dua.id,
    title: dua.title,
    text: dua.text,
    isFavorite: dua.is_favorite,
    date: formatDuaDate(dua.created_at, language),
  };
};

export const filterDuas = (
  duas: any[],
  selectedFilter: FilterType,
  searchQuery: string,
  language: string
): DuaType[] => {
  return duas
    .map((dua) => formatDua(dua, language))
    .filter((dua) => {
      if (selectedFilter === "favorites") return dua.isFavorite;
      return true;
    })
    .filter((dua) => {
      if (!searchQuery) return true;
      return dua.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
};