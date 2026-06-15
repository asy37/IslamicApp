import { storage } from "@/lib/storage/mmkv";

export const ONBOARDING_COMPLETED_KEY = "onboarding_completed";
export const LOCATION_PERMISSION_ASKED_KEY = "location_permission_asked";
export const LOCATION_PERMISSION_GRANTED_KEY = "location_permission_granted";

export const setOnboardingCompleted = async (value: boolean): Promise<void> => {
  await storage.set(ONBOARDING_COMPLETED_KEY, value ? "true" : "false");
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  const val = await storage.getString(ONBOARDING_COMPLETED_KEY);
  return val === "true";
};

export const setLocationPermissionAsked = async (value: boolean): Promise<void> => {
  await storage.set(LOCATION_PERMISSION_ASKED_KEY, value ? "true" : "false");
};

export const setLocationPermissionGranted = async (value: boolean): Promise<void> => {
  await storage.set(LOCATION_PERMISSION_GRANTED_KEY, value ? "true" : "false");
};
