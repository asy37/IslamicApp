import { create } from "zustand";

export type UserLocation = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

type LocationState = {
  location: UserLocation | null;

  setLocation: (location: UserLocation) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,

  setLocation: (location) =>
    set({
      location,
    }),

  clearLocation: () =>
    set({
      location: null,
    }),
}));
