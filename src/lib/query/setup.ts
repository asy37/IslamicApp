/**
 * TanStack Query React Native Setup
 * Configures focus manager and online manager for React Native
 */

import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager, onlineManager } from '@tanstack/react-query';

/**
 * Setup focus manager for React Native
 * Automatically refetches queries when app comes to foreground
 */
export function setupFocusManager() {
  if (Platform.OS === 'web') {
    // Web'de window focus zaten otomatik çalışıyor
    return;
  }

  const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
    focusManager.setFocused(status === 'active');
  });

  return () => {
    subscription.remove();
  };
}

/**
 * Setup online manager for React Native
 * Automatically refetches queries when network reconnects
 * Note: Requires @react-native-community/netinfo or expo-network
 */
export function setupOnlineManager() {
  // Expo Network kullanılıyorsa
  if (Platform.OS !== 'web') {
    // expo-network kullanımı için
    // import * as Network from 'expo-network';
    // onlineManager.setEventListener((setOnline) => {
    //   const eventSubscription = Network.addNetworkStateListener((state) => {
    //     setOnline(!!state.isConnected);
    //   });
    //   return eventSubscription.remove;
    // });

    // Şimdilik basit bir implementasyon
    // Gerçek implementasyon için expo-network veya @react-native-community/netinfo gerekli
    onlineManager.setEventListener((setOnline) => {
      // Default olarak online kabul et
      setOnline(true);
      return () => {};
    });
  }
}

/**
 * Initialize all TanStack Query managers
 * Call this once at app startup
 */
export function setupQueryManagers() {
  setupFocusManager();
  setupOnlineManager();
}

