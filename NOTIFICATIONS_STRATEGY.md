# 🔔 Bildirim Stratejisi - iOS Güvenli Yaklaşım

## 🎯 Amaç

iOS'un arka plan kısıtlamalarına rağmen güvenilir, zamanında ve kullanıcı dostu bildirimler sağlamak.

---

## ⚠️ iOS Background Limitations

### Problemler

1. **Background App Refresh (BAR)**
   - Kullanıcı tarafından kapatılabilir
   - Sistem tarafından otomatik kapatılabilir (düşük batarya, veri tasarrufu)
   - Garanti edilmez

2. **Background Tasks**
   - Çok kısa süreli (30 saniye)
   - Sistem tarafından iptal edilebilir
   - Sık kullanımda throttling

3. **Local Notifications**
   - Güvenilir ama sınırlı (64 bildirim kuyruğu)
   - Zamanlama hassasiyeti ±1 dakika
   - iOS 13+ için kullanıcı izni gerekli

4. **Push Notifications**
   - İnternet bağlantısı gerekli
   - APNs gecikmeleri olabilir
   - Token yönetimi karmaşık

---

## ✅ Çözüm: Hybrid Notification Strategy

### 1. Local Scheduled Notifications (Primary)

**Kullanım:** Namaz vakitleri, günlük hatırlatıcılar

**Avantajlar:**
- ✅ iOS'ta güvenilir (BAR kapalı olsa bile)
- ✅ Offline çalışır
- ✅ Anında tetiklenir (sistem seviyesi)
- ✅ Batarya dostu

**Zamanlama Stratejisi:**

```typescript
// Her gün saat 00:00'da ertesi günün bildirimleri zamanlanır
// Haftalık önbellek tutulur (7 gün)

async function schedulePrayerNotifications() {
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return getPrayerTimesForDate(date);
  });

  for (const day of next7Days) {
    for (const prayer of day.prayers) {
      await scheduleLocalNotification({
        identifier: `prayer-${day.date}-${prayer.name}`,
        title: `${prayer.name} Vakti`,
        body: `Namaz vaktiniz geldi`,
        trigger: {
          date: prayer.time,
          repeats: false,
        },
        categoryIdentifier: 'PRAYER_TIME',
        sound: getNotificationSound(),
      });
    }
  }
}
```

**iOS Optimizasyonları:**

1. **Notification Categories**
```typescript
// Hızlı aksiyonlar için
const categories = [
  {
    identifier: 'PRAYER_TIME',
    actions: [
      {
        identifier: 'OPEN_APP',
        buttonTitle: 'Aç',
        options: { foreground: true },
      },
    ],
  },
  {
    identifier: 'PRAYER_REMINDER',
    actions: [
      {
        identifier: 'PRAYED',
        buttonTitle: '✅ Kıldım',
        options: { foreground: true },
      },
      {
        identifier: 'REMIND_LATER',
        buttonTitle: '⏰ Sonra Hatırlat',
        options: { foreground: false },
      },
    ],
  },
];
```

2. **Critical Alerts (Premium Feature)**
```typescript
// iOS 12+ Critical Alerts
// Sessiz modu bypass eder
// Sadece kritik namaz vakitleri için

await scheduleLocalNotification({
  // ... diğer ayarlar
  critical: true, // iOS 12+ için
  sound: {
    critical: true,
    volume: 1.0,
  },
});
```

3. **Time-Sensitive Notifications (iOS 15+)**
```typescript
// Kullanıcıya daha fazla görünürlük
await scheduleLocalNotification({
  // ... diğer ayarlar
  interruptionLevel: 'timeSensitive', // iOS 15+
});
```

### 2. Remote Push Notifications (Secondary)

**Kullanım:** Dinamik içerik, kullanıcı tercihlerine göre özelleştirilmiş bildirimler

**Avantajlar:**
- ✅ Dinamik içerik
- ✅ Kullanıcı tercihlerine göre özelleştirilebilir
- ✅ Gerçek zamanlı güncellemeler

**Kullanım Senaryoları:**

1. **Namaz Takip Hatırlatıcıları**
```typescript
// Namaz vaktinden X dakika sonra
// "Did you pray Dhuhr?" bildirimi

// Edge Function: schedule-prayer-reminders
export async function schedulePrayerReminder(
  userId: string,
  prayerName: string,
  prayerTime: Date
) {
  const reminderTime = addMinutes(prayerTime, 15); // 15 dakika sonra
  
  await supabase.functions.invoke('send-prayer-reminder', {
    body: {
      userId,
      prayerName,
      scheduledTime: reminderTime.toISOString(),
    },
  });
}
```

2. **Günlük Ayet (Random)**
```typescript
// Her gün saat 08:00'de random ayet gönderimi
// Edge Function: send-daily-verse

export async function sendDailyVerse() {
  const users = await getUsersWithDailyVerseEnabled();
  const verse = await getRandomVerse();
  
  for (const user of users) {
    await sendPushNotification({
      token: user.pushToken,
      title: 'Günlük Ayet',
      body: `${verse.text} - ${verse.surah}:${verse.ayah}`,
      data: {
        type: 'daily_verse',
        surah: verse.surah,
        ayah: verse.ayah,
      },
    });
  }
}
```

3. **Özel Günler (Kandil, Ramazan)**
```typescript
// Kandil günleri için özel bildirimler
export async function sendSpecialDayNotification(
  dayType: 'kandil' | 'ramadan' | 'eid'
) {
  const users = await getUsersForSpecialDay(dayType);
  const content = await getSpecialDayContent(dayType);
  
  // ... gönderim
}
```

### 3. Background Tasks (iOS Safe)

**Kullanım:** Kritik görevler (cache refresh, rescheduling)

**Strateji:**
- Sadece kritik görevler için kullan
- Kısa süreli görevler (30 saniye limit)
- Fallback mekanizması olarak kullan

```typescript
// expo-task-manager ile
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_TASK = 'refresh-prayer-times';

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    // Prayer times cache refresh
    await refreshPrayerTimesCache();
    
    // Notification rescheduling
    await rescheduleNotifications();
    
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register task
async function registerBackgroundTask() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 15 * 60, // 15 dakika
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (error) {
    console.error('Background task registration failed:', error);
  }
}
```

---

## 🔄 Bildirim Akış Diyagramı

### Namaz Vakti Bildirimi

```
┌─────────────────────────────────────────────┐
│  App Launch / Daily 00:00                   │
│  └─> Background Task veya App Foreground   │
│      └─> fetchPrayerTimes(location, date)  │
│          └─> scheduleLocalNotifications()   │
│              └─> Store in SQLite cache     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Prayer Time Arrives (e.g., 12:30 Dhuhr)   │
│  └─> iOS fires local notification          │
│      └─> User sees notification            │
│          ├─> Tap → Open app                │
│          └─> Ignore → Continue             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  15 minutes after prayer time               │
│  └─> Edge Function triggers                │
│      └─> Send push: "Did you pray Dhuhr?"  │
│          └─> User can respond              │
│              ├─> ✅ I prayed               │
│              │   └─> Log to DB             │
│              └─> ⏰ Remind later           │
│                  └─> Schedule reminder     │
│                      (30-40 min before next)│
└─────────────────────────────────────────────┘
```

### Günlük Ayet Bildirimi

```
┌─────────────────────────────────────────────┐
│  Daily 08:00 (Cron Job)                     │
│  └─> Edge Function: send-daily-verse       │
│      └─> Get random verse from DB          │
│          └─> For each user:                 │
│              └─> Send push notification    │
│                  └─> User taps             │
│                      └─> Open Quran        │
│                          └─> Show verse    │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Implementation Details

### Notification Service Structure

```typescript
// src/lib/notifications/NotificationService.ts

export class NotificationService {
  // 1. Permissions
  async requestPermissions(): Promise<boolean>
  
  // 2. Local Notifications
  async schedulePrayerNotifications(days: number): Promise<void>
  async cancelPrayerNotifications(): Promise<void>
  async scheduleDailyVerseNotification(time: Date): Promise<void>
  
  // 3. Push Notifications
  async registerPushToken(): Promise<string | null>
  async unregisterPushToken(): Promise<void>
  
  // 4. Background Tasks
  async registerBackgroundTask(): Promise<void>
  async unregisterBackgroundTask(): Promise<void>
  
  // 5. Notification Handling
  async handleNotificationResponse(response: NotificationResponse): Promise<void>
}
```

### Notification Scheduling Logic

```typescript
// src/features/prayer-times/services/notificationScheduler.ts

export async function schedulePrayerNotificationsForWeek(
  location: Location,
  startDate: Date
) {
  // 1. Fetch prayer times for next 7 days
  const prayerTimes = await fetchPrayerTimesForWeek(location, startDate);
  
  // 2. Cancel existing notifications
  await cancelAllPrayerNotifications();
  
  // 3. Schedule new notifications
  for (const day of prayerTimes) {
    for (const prayer of day.prayers) {
      await scheduleNotification({
        identifier: `prayer-${day.date}-${prayer.name}`,
        title: getPrayerTitle(prayer.name),
        body: getPrayerBody(prayer.name),
        trigger: {
          date: prayer.time,
          repeats: false,
        },
        categoryIdentifier: 'PRAYER_TIME',
        sound: getNotificationSound(),
        data: {
          type: 'prayer_time',
          prayerName: prayer.name,
          date: day.date,
        },
      });
    }
  }
  
  // 4. Cache in SQLite
  await cachePrayerTimes(prayerTimes);
}
```

### Location Change Handling

```typescript
// src/hooks/useLocation.ts

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  
  useEffect(() => {
    // Watch location changes
    const subscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 60000, // 1 dakika
      },
      async (newLocation) => {
        const hasChanged = hasLocationChanged(location, newLocation);
        
        if (hasChanged) {
          setLocation(newLocation);
          
          // Reschedule notifications
          await schedulePrayerNotificationsForWeek(
            newLocation,
            new Date()
          );
        }
      }
    );
    
    return () => subscription.remove();
  }, [location]);
  
  return location;
}
```

---

## 📊 Notification Reliability Metrics

### Monitoring

1. **Local Notification Delivery Rate**
   - iOS sistem seviyesi, %99+ güvenilir
   - Monitoring: Notification response tracking

2. **Push Notification Delivery Rate**
   - APNs delivery tracking
   - Failed token detection

3. **User Engagement**
   - Notification tap rate
   - Response rate (prayer reminders)

### Fallback Mechanisms

1. **Local → Push Fallback**
   - Local notification başarısız olursa push gönder
   - Edge case handling

2. **Cache → API Fallback**
   - Offline durumda cached prayer times kullan
   - API başarısız olursa cache'den devam et

3. **Retry Logic**
   - Push notification başarısız olursa retry
   - Exponential backoff

---

## 🧪 Testing Strategy

### Unit Tests
- Notification scheduling logic
- Time calculation
- Category handling

### Integration Tests
- Local notification delivery
- Push notification registration
- Background task execution

### Manual Testing Checklist
- [ ] Local notifications fire at correct time
- [ ] Push notifications received
- [ ] Notification actions work
- [ ] Background task executes
- [ ] Location change triggers reschedule
- [ ] Offline mode works
- [ ] Critical alerts bypass silent mode (iOS 12+)
- [ ] Time-sensitive notifications show (iOS 15+)

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Notification Limit (64)
**Problem:** iOS local notification limit
**Solution:** 
- Sadece 7 günlük önbellek tut
- Eski bildirimleri otomatik temizle
- Push notifications için fallback

### Pitfall 2: Background Task Throttling
**Problem:** Çok sık background task çalıştırma
**Solution:**
- Minimum interval: 15 dakika
- Sadece kritik görevler için kullan
- Local notifications primary olarak kullan

### Pitfall 3: Time Zone Changes
**Problem:** Kullanıcı time zone değiştirirse
**Solution:**
- Time zone değişikliğini dinle
- Bildirimleri yeniden zamanla
- date-fns-tz ile time zone handling

### Pitfall 4: App Uninstall/Reinstall
**Problem:** Push token kaybolur
**Solution:**
- App launch'ta token kontrolü
- Eksikse yeniden kayıt
- Supabase'de token validation

---

## 📝 Best Practices

1. **Always Request Permissions Early**
   - App launch'ta izin iste
   - Açıklayıcı mesaj ver

2. **Cache Prayer Times**
   - Offline çalışabilmek için
   - SQLite'da tut

3. **Handle Edge Cases**
   - Location unavailable
   - Network unavailable
   - Permission denied

4. **User Control**
   - Bildirim ayarları ekranı
   - Her bildirim tipi için toggle
   - Zaman seçimi (daily verse)

5. **Respect User Preferences**
   - Silent mode
   - Do Not Disturb
   - App notification settings

---

## 🔮 Future Enhancements

1. **Smart Notifications**
   - Machine learning ile optimal zamanlama
   - Kullanıcı davranışına göre özelleştirme

2. **Rich Notifications**
   - Images (daily verse with beautiful design)
   - Interactive buttons
   - Custom sounds

3. **Notification Analytics**
   - Delivery rates
   - Engagement metrics
   - A/B testing

4. **Multi-language Support**
   - Notification content in user's language
   - RTL support for Arabic

