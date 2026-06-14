// expo-router entry ile aynı; sadece metro-runtime'dan hemen sonra debug init çalıştırıyoruz.
// @expo/metro-runtime MUST be the first import (expo-router kuralı).
import "@expo/metro-runtime";
import "./src/lib/utils/debugLogInit";

// ── Background Notification Refresh Task ──
// TaskManager.defineTask component dışında, en üst seviyede tanımlanmalı.
// Uygulama kapalıyken bile iOS/Android bu task'ı çalıştırarak bildirimleri yeniler.
try {
  const TaskManager = require("expo-task-manager");
  const { backgroundNotificationRefresh } = require("./src/lib/notifications/backgroundTask");

  TaskManager.defineTask("BACKGROUND_NOTIFICATION_REFRESH", async () => {
    try {
      await backgroundNotificationRefresh();
      const BackgroundFetch = require("expo-background-fetch");
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.warn("[BackgroundTask] Notification refresh failed:", error);
      const BackgroundFetch = require("expo-background-fetch");
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
} catch (error) {
  // expo-task-manager Expo Go'da yok — sessizce devam et
}

import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";

renderRootComponent(App);
