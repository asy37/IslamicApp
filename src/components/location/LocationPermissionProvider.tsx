/**
 * Location Permission Provider
 * Shows location permission modal on first app launch
 * Manages first-time user experience for location access
 */

import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useAuth } from "@/lib/hooks/useAuth";
import { storage } from "@/lib/storage/mmkv";
import LocationPermissionModal from "@/components/adhan/LocationPermissionModal";

const LOCATION_PERMISSION_ASKED_KEY = "location_permission_asked";
const LOCATION_PERMISSION_GRANTED_KEY = "location_permission_granted";

export default function LocationPermissionProvider() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isAuthLoading || !session) {
      return;
    }

    const checkLocationPermission = async () => {
      try {
        setIsChecking(true);

        // Check if we've already asked for permission
        const hasAsked = await storage.getString(LOCATION_PERMISSION_ASKED_KEY);
        const hasGranted = await storage.getString(LOCATION_PERMISSION_GRANTED_KEY);

        // If already asked and granted, don't show modal
        if (hasAsked === "true" && hasGranted === "true") {
          setIsChecking(false);
          return;
        }

        // Check current permission status
        const { status } = await Location.getForegroundPermissionsAsync();

        // If permission is already granted, mark as asked and granted
        if (status === "granted") {
          await storage.set(LOCATION_PERMISSION_ASKED_KEY, "true");
          await storage.set(LOCATION_PERMISSION_GRANTED_KEY, "true");
          setIsChecking(false);
          return;
        }

        // If permission is denied and we've asked before, don't show modal
        if (status === "denied" && hasAsked === "true") {
          setIsChecking(false);
          return;
        }

        // First time - show modal after a short delay
        if (!hasAsked || hasAsked !== "true") {
          setTimeout(() => {
            setShowModal(true);
          }, 1500); // Show after 1.5 seconds to let app load
        }
      } catch (error) {
        console.error("[LocationPermissionProvider] Error checking permission:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkLocationPermission();
  }, [session, isAuthLoading]);

  const handleRequestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Mark as asked
      await storage.set(LOCATION_PERMISSION_ASKED_KEY, "true");

      if (status === "granted") {
        // Mark as granted
        await storage.set(LOCATION_PERMISSION_GRANTED_KEY, "true");
        setShowModal(false);
      } else {
        // Permission denied
        await storage.set(LOCATION_PERMISSION_GRANTED_KEY, "false");
        setShowModal(false);
      }
    } catch (error) {
      console.error("[LocationPermissionProvider] Error requesting permission:", error);
      await storage.set(LOCATION_PERMISSION_ASKED_KEY, "true");
      setShowModal(false);
    }
  };

  const handleManualEntry = async () => {
    // Mark as asked (user chose manual entry)
    await storage.set(LOCATION_PERMISSION_ASKED_KEY, "true");
    await storage.set(LOCATION_PERMISSION_GRANTED_KEY, "false");
    setShowModal(false);
  };

  const handleClose = async () => {
    // Mark as asked (user dismissed)
    await storage.set(LOCATION_PERMISSION_ASKED_KEY, "true");
    setShowModal(false);
  };

  // Don't show modal while checking or if auth is loading
  if (isChecking || isAuthLoading || !session) {
    return null;
  }

  return (
    <LocationPermissionModal
      visible={showModal}
      onRequestPermission={handleRequestPermission}
      onManualEntry={handleManualEntry}
      onClose={handleClose}
    />
  );
}

