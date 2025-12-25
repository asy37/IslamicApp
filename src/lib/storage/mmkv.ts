/**
 * Storage Configuration
 * Uses @react-native-async-storage/async-storage for Expo Go compatibility
 * Async API for compatibility with React hooks
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage API wrapper for compatibility (async version)
export const storage = {
  getString: async (key: string): Promise<string | undefined> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value || undefined;
    } catch {
      return undefined;
    }
  },
  set: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  getBoolean: async (key: string): Promise<boolean | undefined> => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    } catch {
      return undefined;
    }
  },
  setBoolean: async (key: string, value: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value ? 'true' : 'false');
    } catch (error) {
      console.error('Storage setBoolean error:', error);
    }
  },
  delete: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
    }
  },
  
  // Sync versions for immediate access (use with caution)
  // Note: AsyncStorage doesn't have sync methods, so we'll use async with immediate await
  getStringSync: (key: string): string | undefined => {
    // AsyncStorage is async-only, so we return undefined for sync calls
    // The caller should use getString instead
    console.warn('getStringSync is not supported with AsyncStorage. Use getString instead.');
    return undefined;
  },
  setSync: (key: string, value: string): void => {
    // AsyncStorage is async-only, so we call async method without await
    // This is not ideal but works for immediate writes
    AsyncStorage.setItem(key, value).catch((error) => {
      console.error('Storage setSync error:', error);
    });
  },
};

