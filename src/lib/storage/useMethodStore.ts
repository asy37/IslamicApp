import { create } from "zustand";

export type PrayerCalculationMethod = {
  id: number;
  label: string;
  description?: string;
  requiresShafaq?: boolean;
};
type MethodState = {
  method: PrayerCalculationMethod | null;
  setMethod: (method: PrayerCalculationMethod) => void;
};
const DEFAULT_METHOD: PrayerCalculationMethod = {
  id: 13,
  label: "Diyanet",
  description: "Diyanet İşleri Başkanlığı (Turkey)",
};
export const useMethodStore = create<MethodState>((set) => ({
  method: DEFAULT_METHOD,

  setMethod: (method) =>
    set({
      method,
    }),
}));
