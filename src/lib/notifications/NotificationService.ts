/**
 * NotificationService
 * 
 * iOS-safe notification service that combines:
 * - Local scheduled notifications (primary)
 * - Remote push notifications (secondary)
 * - Background tasks (critical operations)
 * 
 * Note: expo-notifications is not fully supported in Expo Go.
 * Use a development build for full functionality.
 */

// Conditional import for Expo Go compatibility
// Use lazy loading to avoid errors in Expo Go
let Notifications: typeof import('expo-notifications') | null = null;
let TaskManager: typeof import('expo-task-manager') | null = null;
let BackgroundFetch: typeof import('expo-background-fetch') | null = null;

// Lazy load modules to avoid errors in Expo Go
function loadNotificationModules() {
  if (Notifications !== null) {
    return; // Already loaded
  }

  try {
    // Use dynamic require to avoid errors at module load time
    // This will only fail when the function is called, not at import time
    Notifications = require('expo-notifications');
    TaskManager = require('expo-task-manager');
    BackgroundFetch = require('expo-background-fetch');
  } catch (error) {
    // Silently fail in Expo Go - this is expected
    // The error will only occur when the service is actually used
    Notifications = null;
    TaskManager = null;
    BackgroundFetch = null;
  }
}

// Expose a getter for Notifications that lazy loads
const getNotifications = () => {
  loadNotificationModules();
  return Notifications;
};

// Configure notification behavior (only if available)
// This will be called when the service is first used
function configureNotifications() {
  const NotificationsModule = getNotifications();
  if (NotificationsModule) {
    NotificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    const NotificationsModule = getNotifications();
    if (!NotificationsModule) {
      console.warn('[NotificationService] Notifications not available');
      return false;
    }

    configureNotifications(); // Ensure handler is set

    const { status: existingStatus } = await NotificationsModule.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await NotificationsModule.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  /**
   * Schedule prayer time notifications for the next N days
   */
  async schedulePrayerNotifications(
    prayerTimes: Array<{
      date: string;
      prayers: Array<{ name: string; time: Date }>;
    }>,
    days: number = 7
  ): Promise<void> {
    const NotificationsModule = getNotifications();
    if (!NotificationsModule) {
      console.warn('[NotificationService] Notifications not available');
      return;
    }

    configureNotifications(); // Ensure handler is set

    // Cancel existing prayer notifications
    await this.cancelPrayerNotifications();

    // Schedule new notifications
    for (const day of prayerTimes.slice(0, days)) {
      for (const prayer of day.prayers) {
        await NotificationsModule.scheduleNotificationAsync({
          content: {
            title: `${prayer.name} Vakti`,
            body: 'Namaz vaktiniz geldi',
            sound: true,
            categoryIdentifier: 'PRAYER_TIME',
            data: {
              type: 'prayer_time',
              prayerName: prayer.name,
              date: day.date,
            },
          },
          trigger: {
            date: prayer.time,
            repeats: false,
          },
        });
      }
    }
  }

  /**
   * Cancel all prayer time notifications
   */
  async cancelPrayerNotifications(): Promise<void> {
    const NotificationsModule = getNotifications();
    if (!NotificationsModule) {
      return;
    }

    const notifications = await NotificationsModule.getAllScheduledNotificationsAsync();
    const prayerNotifications = notifications.filter(
      (n) => n.content.data?.type === 'prayer_time'
    );

    for (const notification of prayerNotifications) {
      await NotificationsModule.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  /**
   * Register push notification token
   */
  async registerPushToken(): Promise<string | null> {
    const NotificationsModule = getNotifications();
    if (!NotificationsModule) {
      console.warn('[NotificationService] Notifications not available');
      return null;
    }

    try {
      const token = await NotificationsModule.getExpoPushTokenAsync({
        projectId: 'your-project-id', // TODO: Replace with actual project ID
      });
      return token.data;
    } catch (error) {
      console.error('Failed to register push token:', error);
      return null;
    }
  }

  /**
   * Register background task for critical operations
   */
  async registerBackgroundTask(): Promise<void> {
    loadNotificationModules();
    if (!BackgroundFetch) {
      console.warn('[NotificationService] BackgroundFetch not available');
      return;
    }

    try {
      await BackgroundFetch.registerTaskAsync('refresh-prayer-times', {
        minimumInterval: 15 * 60, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error('Background task registration failed:', error);
    }
  }

  /**
   * Handle notification response (when user taps notification)
   */
  async handleNotificationResponse(
    response: { notification: { request: { content: { data?: any } } } }
  ): Promise<void> {
    const NotificationsModule = getNotifications();
    if (!NotificationsModule) {
      return;
    }
    const data = response.notification.request.content.data;

    // Handle different notification types
    switch (data?.type) {
      case 'prayer_time':
        // Navigate to prayer times screen
        // TODO: Implement navigation
        break;
      case 'daily_verse':
        // Navigate to Quran screen with specific verse
        // TODO: Implement navigation
        break;
      case 'prayer_reminder':
        // Handle prayer reminder response
        // TODO: Implement prayer tracking
        break;
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

