/**
 * Location Hook
 * Handles location permissions and fetching user location
 */

import { useState, useEffect } from "react";
import * as Location from "expo-location";

export type LocationData = {
  readonly latitude: number;
  readonly longitude: number;
  readonly city?: string;
  readonly country?: string;
};

export type LocationState = {
  readonly location: LocationData | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly permissionStatus: Location.PermissionStatus | null;
};

/**
 * Hook to get user location with permission handling
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
    permissionStatus: null,
  });

  /**
   * Request location permission and get current location
   */
  const requestLocation = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Check if permission is already granted
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      let finalStatus = existingStatus;

      // Request permission if not granted
      if (existingStatus !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      setState((prev) => ({
        ...prev,
        permissionStatus: finalStatus,
      }));

      if (finalStatus !== "granted") {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Location permission denied",
        }));
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get city and country
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setState({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: address.city || address.subAdministrativeArea || undefined,
          country: address.country || undefined,
        },
        loading: false,
        error: null,
        permissionStatus: finalStatus,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to get location",
      }));
    }
  };

  /**
   * Check current permission status
   */
  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setState((prev) => ({
        ...prev,
        permissionStatus: status,
      }));
      return status;
    } catch (error) {
      console.error("Error checking location permission:", error);
      return null;
    }
  };

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  return {
    ...state,
    requestLocation,
    checkPermission,
  };
}

