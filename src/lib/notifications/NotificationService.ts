/**
 * NotificationService
 * 
 * iOS-safe notification service that combines:
 * - Local scheduled notifications (primary)
 * - Remote push notifications (secondary)
 * - Background tasks (critical operations)
 */

import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
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
    // Cancel existing prayer notifications
    await this.cancelPrayerNotifications();

    // Schedule new notifications
    for (const day of prayerTimes.slice(0, days)) {
      for (const prayer of day.prayers) {
        await Notifications.scheduleNotificationAsync({
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
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const prayerNotifications = notifications.filter(
      (n) => n.content.data?.type === 'prayer_time'
    );

    for (const notification of prayerNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }

  /**
   * Register push notification token
   */
  async registerPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
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
    response: Notifications.NotificationResponse
  ): Promise<void> {
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

