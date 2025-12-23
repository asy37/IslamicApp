# 🕌 IslamicApp - Mimari Dokümantasyon

## 📐 Genel Mimari Yaklaşım

### Mimari Prensipler
1. **Offline-First**: Tüm kritik veriler yerel olarak saklanır
2. **Privacy-First**: Hesap olmadan kullanılabilir, veriler varsayılan olarak yerel
3. **Modüler Yapı**: Her özellik bağımsız modül olarak geliştirilebilir
4. **Type-Safe**: TypeScript ile tam tip güvenliği
5. **Testable**: Her katman test edilebilir olmalı

---

## 🏗️ Katmanlı Mimari

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Screens, Components, Navigation)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  (Hooks, Services, State Management)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  (API, Local Storage, Cache)           │
└─────────────────────────────────────────┘
```

### 1. Presentation Layer
- **Screens**: Tam sayfa bileşenleri
- **Components**: Yeniden kullanılabilir UI bileşenleri
- **Navigation**: React Navigation yapılandırması
- **Theming**: NativeWind ile tema yönetimi

### 2. Business Logic Layer
- **Hooks**: Özel React hooks (usePrayerTimes, useDhikr, etc.)
- **Services**: İş mantığı servisleri
- **State Management**: Zustand store'ları
- **Validation**: Zod şemaları

### 3. Data Layer
- **API Client**: Supabase client ve custom API çağrıları
- **Local Storage**: 
  - SQLite (structured data: prayer logs, dhikr history)
  - MMKV (key-value: settings, cache)
- **Cache**: TanStack Query cache stratejisi

---

## 📁 Proje Yapısı

```
IslamicApp/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/                   # Auth flow
│   ├── (tabs)/                   # Main tabs
│   │   ├── index.tsx            # Prayer times (home)
│   │   ├── quran.tsx            # Quran reader
│   │   ├── dhikr.tsx            # Dhikr counter
│   │   └── profile.tsx          # Profile & settings
│   └── _layout.tsx              # Root layout
│
├── src/
│   ├── components/              # UI Components
│   │   ├── ui/                  # Base UI (buttons, cards, etc.)
│   │   ├── prayer/              # Prayer-specific components
│   │   ├── quran/               # Quran-specific components
│   │   └── dhikr/               # Dhikr-specific components
│   │
│   ├── features/                # Feature modules
│   │   ├── prayer-times/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── types.ts
│   │   ├── dhikr/
│   │   ├── quran/
│   │   ├── prayer-tracking/
│   │   └── notifications/
│   │
│   ├── lib/                     # Core libraries
│   │   ├── supabase/            # Supabase client & types
│   │   ├── storage/              # Local storage utilities
│   │   │   ├── sqlite.ts
│   │   │   └── mmkv.ts
│   │   ├── notifications/        # Notification service
│   │   ├── location/            # Location utilities
│   │   └── api/                 # External API clients
│   │       ├── aladhan.ts       # Prayer times API
│   │       └── quran.ts         # Quran data
│   │
│   ├── hooks/                   # Shared hooks
│   │   ├── useLocation.ts
│   │   ├── useNotifications.ts
│   │   └── useOffline.ts
│   │
│   ├── store/                   # Global Zustand stores
│   │   ├── settings.ts
│   │   ├── auth.ts
│   │   └── index.ts
│   │
│   ├── types/                   # Shared TypeScript types
│   │   ├── prayer.ts
│   │   ├── quran.ts
│   │   └── user.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── date.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   │
│   └── constants/              # App constants
│       ├── prayer-methods.ts
│       ├── dhikr-presets.ts
│       └── colors.ts
│
├── supabase/                    # Supabase config
│   ├── functions/               # Edge Functions
│   │   ├── send-daily-verse/
│   │   ├── schedule-prayer-reminders/
│   │   └── sync-prayer-logs/
│   ├── migrations/              # Database migrations
│   └── seed.sql                 # Seed data
│
├── assets/                      # Static assets
│   ├── fonts/                   # Custom fonts
│   ├── images/
│   └── sounds/                  # Adhan sounds
│
├── app.json                     # Expo config
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🔔 Bildirim Mimarisi (iOS Güvenli)

### Problem: iOS Background Limitations
iOS, arka planda çalışan uygulamaları ciddi şekilde kısıtlar:
- **Background App Refresh**: Kullanıcı tarafından kapatılabilir
- **Background Tasks**: Çok kısa süreli (30 saniye)
- **Local Notifications**: Güvenilir ama zamanlama sınırlı

### Çözüm: Hybrid Notification Strategy

#### 1. Local Scheduled Notifications (Primary)
```typescript
// Her gün için 5 vakit namaz bildirimi yerel olarak zamanlanır
// Avantajlar:
// - iOS'ta güvenilir
// - Offline çalışır
// - Anında tetiklenir
```

**Kullanım Senaryoları:**
- Namaz vakitleri (her gün 5 bildirim)
- Dhikr hatırlatıcıları
- Günlük ayet (kullanıcı tercihine göre)

**Zamanlama Stratejisi:**
- Her gün saat 00:00'da ertesi günün bildirimleri zamanlanır
- Haftalık önbellek (7 gün) tutulur
- Konum değiştiğinde yeniden zamanlanır

#### 2. Remote Push Notifications (Secondary)
```typescript
// Supabase Edge Functions ile zamanlanmış gönderimler
// Avantajlar:
// - Dinamik içerik
// - Kullanıcı tercihlerine göre özelleştirilebilir
```

**Kullanım Senaryoları:**
- Günlük ayet (random seçim)
- Namaz takip hatırlatıcıları ("Did you pray Dhuhr?")
- Özel günler (Kandil, Ramazan)
- Premium özellikler

**Edge Function Örnekleri:**
- `send-daily-verse`: Her gün saat 08:00'de gönderir
- `schedule-prayer-reminders`: Namaz sonrası hatırlatıcılar
- `send-ramadan-reminders`: Ramazan özel bildirimleri

#### 3. Background Tasks (iOS Safe)
```typescript
// expo-task-manager ile kritik görevler
// Kullanım:
// - Prayer times cache refresh
// - Notification rescheduling
```

**Kritik Görevler:**
- Günlük namaz vakitlerini önbelleğe alma
- Bildirim zamanlamasını yenileme
- Offline veri senkronizasyonu

### Bildirim Akış Diyagramı

```
┌─────────────────────────────────────────────────┐
│  App Launch / Daily 00:00                       │
│  └─> Schedule next 7 days of prayer times       │
│      └─> Store in local SQLite                  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Prayer Time Arrives                            │
│  └─> Local notification fires                   │
│      └─> User sees notification                 │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  X minutes after prayer time                     │
│  └─> Remote push: "Did you pray?"               │
│      └─> User can respond                       │
│          ├─> ✅ I prayed → Log to DB            │
│          └─> ⏰ Remind later → Schedule reminder │
└─────────────────────────────────────────────────┘
```

### iOS-Specific Optimizations

1. **Notification Categories & Actions**
```typescript
// iOS notification actions ile hızlı yanıt
const categories = {
  prayerReminder: {
    identifier: 'PRAYER_REMINDER',
    actions: [
      { identifier: 'PRAYED', title: '✅ I prayed' },
      { identifier: 'REMIND_LATER', title: '⏰ Remind later' }
    ]
  }
}
```

2. **Critical Alerts (Premium)**
```typescript
// iOS 12+ Critical Alerts
// Daha yüksek öncelik, sessiz modu bypass eder
// Kullanım: Sadece kritik namaz vakitleri için
```

3. **Time-Sensitive Notifications**
```typescript
// iOS 15+ Time-Sensitive
// Kullanıcıya daha fazla görünürlük sağlar
```

4. **Background App Refresh Handling**
```typescript
// Kullanıcı BAR'ı kapatırsa bile çalışacak fallback
// - Local notifications her zaman çalışır
// - Remote push backup olarak kullanılır
```

---

## 💾 Veri Yönetimi

### Local Storage Stratejisi

#### SQLite (Structured Data)
```typescript
// Kullanım alanları:
// - Prayer logs (tarih, vakit, durum)
// - Dhikr history (tarih, dhikr tipi, sayı)
// - Quran bookmarks
// - Dua journal entries
```

**Tablo Yapısı:**
- `prayer_logs`: prayer_id, date, prayer_name, status, logged_at
- `dhikr_sessions`: session_id, dhikr_type, count, date
- `quran_bookmarks`: bookmark_id, surah, ayah, created_at
- `dua_journal`: entry_id, content, is_answered, created_at

#### MMKV (Key-Value)
```typescript
// Kullanım alanları:
// - User settings (prayer method, notification prefs)
// - Cache (prayer times, daily verse)
// - App state (onboarding completed, etc.)
```

**Key Örnekleri:**
- `settings.prayerMethod`: "diyanet" | "mwl" | "umm_al_qura"
- `cache.prayerTimes.2024-01-15`: JSON string
- `cache.dailyVerse.2024-01-15`: JSON string
- `onboarding.completed`: boolean

### Supabase Sync (Optional)

**Senkronizasyon Stratejisi:**
- Kullanıcı giriş yapana kadar tüm veriler yerel
- Giriş sonrası:
  - Local → Cloud: İlk senkronizasyon
  - Cloud → Local: Mevcut verileri çek
  - İki yönlü senkronizasyon: Conflict resolution

**Conflict Resolution:**
- Son yazma kazanır (Last Write Wins)
- Kullanıcıya çakışma durumunda seçim hakkı ver

---

## 🔐 Güvenlik & Privacy

### Authentication Flow
```
1. Anonymous usage (default)
   └─> Local data only
   
2. Optional sign-up
   └─> Email/Password veya Social Auth
   └─> Cloud sync enabled
   
3. Premium subscription
   └─> Stripe integration
   └─> Supabase RLS ile feature gating
```

### Row Level Security (RLS) Policies
```sql
-- Örnek: prayer_logs tablosu
CREATE POLICY "Users can view own prayer logs"
  ON prayer_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer logs"
  ON prayer_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🎨 UI/UX Prensipleri

### Tasarım Felsefesi
- **Sakin**: Yumuşak renkler, bol beyaz alan
- **Saygılı**: İslami değerlere uygun görsel dil
- **Yargılamayan**: Pozitif, teşvik edici dil
- **Erişilebilir**: Büyük fontlar, yüksek kontrast

### Renk Paleti
```typescript
const colors = {
  primary: '#2D5016',      // Koyu yeşil (İslami)
  secondary: '#4A7C59',    // Orta yeşil
  accent: '#8B9A46',       // Açık yeşil
  background: '#F5F5F5',   // Açık gri
  text: '#1A1A1A',         // Koyu gri
  textSecondary: '#666666',
  error: '#C53030',        // Yumuşak kırmızı
  success: '#2F855A',      // Yeşil
  warning: '#D69E2E',      // Altın
}
```

### Tipografi
- **Arapça**: Amiri, Scheherazade
- **Türkçe**: System font (SF Pro / Roboto)

---

## 🚀 MVP Kapsamı

### Phase 1: Core MVP (4-6 hafta)
✅ **Must Have:**
1. Prayer times (location-based)
2. Basic notifications (local)
3. Dhikr counter (3 preset)
4. Quran reader (basic, offline)
5. Daily verse notification

### Phase 2: Enhanced MVP (2-3 hafta)
✅ **Should Have:**
1. Prayer tracking ("Did you pray?")
2. Custom dhikr creation
3. Prayer logs & stats
4. Improved notification reliability

### Phase 3: Premium Features (2-3 hafta)
✅ **Nice to Have:**
1. Premium subscription
2. Advanced stats
3. Cloud sync
4. Ad-free experience

---

## 📊 State Management

### Zustand Store Yapısı

```typescript
// stores/settings.ts
interface SettingsStore {
  prayerMethod: PrayerMethod;
  notificationSettings: NotificationSettings;
  location: Location | null;
  updatePrayerMethod: (method: PrayerMethod) => void;
}

// stores/auth.ts
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### TanStack Query (Server State)
```typescript
// Prayer times (cached, refetch on location change)
useQuery({
  queryKey: ['prayerTimes', location, date],
  queryFn: () => fetchPrayerTimes(location, date),
  staleTime: 24 * 60 * 60 * 1000, // 24 saat
})

// Daily verse (cached per day)
useQuery({
  queryKey: ['dailyVerse', today],
  queryFn: () => fetchDailyVerse(),
  staleTime: 24 * 60 * 60 * 1000,
})
```

---

## 🧪 Test Stratejisi

### Unit Tests
- Utility functions
- Business logic services
- Validation schemas

### Integration Tests
- API clients
- Local storage operations
- Notification scheduling

### E2E Tests (Future)
- Critical user flows
- Prayer tracking flow
- Notification delivery

---

## 📦 Dependency Management

### Core Dependencies
```json
{
  "expo": "~51.0.0",
  "react-native": "0.74.0",
  "react": "18.2.0",
  "typescript": "~5.3.0",
  "@react-navigation/native": "^6.1.0",
  "nativewind": "^4.0.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0",
  "expo-notifications": "~0.28.0",
  "expo-location": "~17.0.0",
  "expo-sqlite": "~14.0.0",
  "react-native-mmkv": "^2.12.0",
  "date-fns": "^3.0.0",
  "date-fns-tz": "^2.0.0"
}
```

---

## 🔄 Deployment Strategy

### Development
- Expo Go (development)
- EAS Build (development builds)

### Production
- EAS Build (production)
- App Store & Play Store
- OTA updates (Expo Updates)

### CI/CD
- GitHub Actions
- Automated testing
- EAS Build on push to main

---

## 📝 Sonraki Adımlar

1. ✅ Mimari dokümantasyon (bu dosya)
2. ⏭️ Expo projesi kurulumu
3. ⏭️ Temel klasör yapısı
4. ⏭️ Supabase setup
5. ⏭️ Notification service implementation
6. ⏭️ Prayer times feature (MVP)
7. ⏭️ Dhikr counter (MVP)
8. ⏭️ Quran reader (MVP)

