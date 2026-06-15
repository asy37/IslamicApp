import NetInfo from "@react-native-community/netinfo";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/**
 * Check if the device is currently online and internet is reachable.
 */
export const checkOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected && state.isInternetReachable);
};

/**
 * Request photo library permissions and show an alert if denied.
 */
export const requestPhotoPermission = async (
  title: string,
  message: string
): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(title, message);
    return false;
  }
  return true;
};

/**
 * Normalize and resolve the creation date format for profile updates.
 */
export const resolveCreatedAt = (
  createdAt: string | number | null | undefined,
  defaultTimestamp: number
): string => {
  if (createdAt == null) {
    return new Date(defaultTimestamp).toISOString();
  }
  if (typeof createdAt === "number") {
    return new Date(createdAt).toISOString();
  }
  return createdAt;
};
