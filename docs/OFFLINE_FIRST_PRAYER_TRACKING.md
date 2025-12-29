# 🕌 Offline-First Prayer Tracking - Final Implementation

## 📋 Genel Bakış

Bu implementasyon, **offline-first** mimari prensiplerine göre tasarlanmış bir namaz takip sistemidir.

### Temel Prensipler

1. ✅ **SQLite source of truth** - Günlük namaz durumu SQLite'da tutulur
2. ✅ **Supabase sadece senkronizasyon** - Supabase günlük UI state'i için kullanılmaz
3. ✅ **Tek satırlık daily state** - `daily_prayer_state` tablosu sadece 1 satır içerir
4. ✅ **Günlük reset (imsak bazlı)** - Her yeni günde (imsak sonrası) state reset edilir
5. ✅ **Kalıcı sync queue** - Senkronize edilene kadar veri kaybolmaz (DELETE on success)
6. ✅ **Milliseconds timestamp** - Tüm zaman alanları `Date.now()` kullanır

---

## 🗄️ Veri Yapısı

### 1. SQLite: Daily Prayer State (SINGLE ROW)

**Tablo:** `daily_prayer_state`

```sql
CREATE TABLE daily_prayer_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  date TEXT NOT NULL,              -- YYYY-MM-DD
  fajr TEXT NOT NULL DEFAULT 'upcoming',
  dhuhr TEXT NOT NULL DEFAULT 'upcoming',
  asr TEXT NOT NULL DEFAULT 'upcoming',
  maghrib TEXT NOT NULL DEFAULT 'upcoming',
  isha TEXT NOT NULL DEFAULT 'upcoming',
  updated_at INTEGER NOT NULL       -- milliseconds (Date.now())
);
```

**Status Değerleri:**
- `'upcoming'` - Henüz vakti gelmedi
- `'prayed'` - Kılındı
- `'unprayed'` - Kılınmadı
- `'later'` - Daha sonra kılacağım

**Kurallar:**
- ✅ Tablo sadece **1 satır** içerir (`id = 1` CHECK constraint)
- ✅ Gün değiştiğinde `date` güncellenir
- ✅ Reset işlemi `UPDATE` veya `DELETE + INSERT` ile yapılır
- ✅ Geçmiş günler bu tabloda tutulmaz

### 2. SQLite: Sync Queue (PERSISTENT UNTIL SYNCED)

**Tablo:** `prayer_sync_queue`

```sql
CREATE TABLE prayer_sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,              -- YYYY-MM-DD
  payload TEXT NOT NULL,           -- JSON: {fajr: boolean, ...}
  created_at INTEGER NOT NULL      -- milliseconds (Date.now())
);
```

**Payload Format:**
```json
{
  "fajr": true,
  "dhuhr": false,
  "asr": true,
  "maghrib": true,
  "isha": false
}
```

**Kurallar:**
- ✅ Veri uygulama restart'larında korunur
- ✅ Supabase başarılı olana kadar silinmez
- ✅ Başarılı sync sonrası **DELETE** edilir (synced flag yok)
- ✅ Queue sadece pending işlemleri içerir
- ✅ SQLite şişmesi engellenir

### 3. Supabase: Prayer Logs (SYNC ONLY)

**Tablo:** `prayer_logs`

```sql
CREATE TABLE prayer_logs (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  date date NOT NULL,
  fajr boolean NOT NULL DEFAULT false,
  dhuhr boolean NOT NULL DEFAULT false,
  asr boolean NOT NULL DEFAULT false,
  maghrib boolean NOT NULL DEFAULT false,
  isha boolean NOT NULL DEFAULT false,
  created_at timestamptz,
  updated_at timestamptz,
  UNIQUE (user_id, date)
);
```

**Kurallar:**
- ✅ Sadece **boolean format** (prayed = true, diğerleri = false)
- ✅ **UPSERT** kullanılır (conflict safe)
- ✅ Streak hesaplama için kullanılır
- ✅ Geçmiş veriler için kullanılır
- ❌ Günlük UI state için kullanılmaz

---

## 🔄 Günlük Reset Mantığı (İmsak Bazlı)

### Senaryo: Yeni Gün Başladı (İmsak Sonrası)

1. **İmsak saati** Aladhan API'den alınır
2. **Local device saati** ile karşılaştırılır
3. **Local saat ≥ imsak saati** olduğunda:
   - Önceki günün `daily_prayer_state` okunur
   - Boolean payload'a çevrilir (`prayed` → `true`, diğerleri → `false`)
   - Sync queue'ya eklenir
   - `daily_prayer_state` yeni gün için reset edilir

### Kod Örneği

```typescript
// dailyReset.ts
async performDailyReset() {
  // 1. Read current state (before reset)
  const currentState = await prayerTrackingRepo.getCurrentPrayerState();

  // 2. Add to sync queue
  if (currentState) {
    await prayerTrackingRepo.addToSyncQueue(currentState.date, currentState);
  }

  // 3. Reset daily state for new day
  const today = getTodayDateString();
  await prayerTrackingRepo.resetDailyPrayerState(today);
}
```

### İmsak Zamanı Kontrolü

```typescript
// Parse Imsak time from Aladhan API
function parseImsakTime(timings: AladhanPrayerTimesResponse['data']['timings']): Date {
  const imsakString = timings.Imsak; // "HH:mm" format
  const [hours, minutes] = imsakString.split(':').map(Number);
  
  const imsakDate = new Date();
  imsakDate.setHours(hours, minutes, 0, 0);
  
  return imsakDate;
}

// Check if current time is after imsak
function isAfterImsak(imsakTime: Date): boolean {
  return new Date() >= imsakTime;
}
```

---

## 🔄 Senkronizasyon Mantığı

### Otomatik Senkronizasyon

1. **Periyodik:** Her 30 dakikada bir
2. **AppState değişikliği:** Uygulama foreground'a geldiğinde
3. **Manuel:** Kullanıcı "Senkronize Et" butonuna basarsa

### Senkronizasyon Adımları

1. **İnternet kontrolü** yapılır
2. **Pending queue items** okunur (tüm queue items pending'dir)
3. **Her item için:**
   - Supabase RPC `sync_prayer_log` çağrılır (UPSERT)
   - Başarılıysa → **DELETE** edilir
   - Başarısızsa → Tekrar denenmek üzere bırakılır

### Kod Örneği

```typescript
// prayerSync.ts
async syncPendingItems() {
  const pendingItems = await prayerTrackingRepo.getPendingQueueItems();

  for (const item of pendingItems) {
    const success = await this.syncSingleItem(item);
    if (success) {
      // DELETE after successful sync
      await prayerTrackingRepo.deleteQueueItem(item.id);
    }
  }
}
```

### Supabase UPSERT

```sql
-- sync_prayer_log.sql
INSERT INTO prayer_logs (user_id, date, fajr, dhuhr, asr, maghrib, isha)
VALUES (v_user_id, p_date, p_fajr, p_dhuhr, p_asr, p_maghrib, p_isha)
ON CONFLICT (user_id, date) DO UPDATE
SET
  fajr = excluded.fajr,
  dhuhr = excluded.dhuhr,
  asr = excluded.asr,
  maghrib = excluded.maghrib,
  isha = excluded.isha,
  updated_at = now();
```

---

## ⏰ Timestamp Standardı

**ZORUNLU:** Tüm SQLite zaman alanları için `Date.now()` (milliseconds) kullanılır.

```typescript
// ✅ DOĞRU
const now = Date.now(); // milliseconds
await db.runAsync('INSERT INTO table (updated_at) VALUES (?)', [now]);

// ❌ YANLIŞ
const now = Math.floor(Date.now() / 1000); // UNIX seconds
await db.runAsync('INSERT INTO table (updated_at) VALUES (?)', [now]);
```

**Kurallar:**
- ✅ `created_at` / `updated_at` → milliseconds
- ❌ UNIX seconds kullanılmayacak
- ✅ Tüm servislerde tek format

---

## 📱 Frontend Kullanımı

### 1. Günlük State Okuma

```typescript
import { usePrayerTrackingLocal } from '@/lib/hooks/usePrayerTrackingLocal';

function PrayerScreen() {
  const { data, isLoading } = usePrayerTrackingLocal();

  if (isLoading) return <Loading />;

  return (
    <View>
      <PrayerRow name="fajr" status={data.fajr} />
      <PrayerRow name="dhuhr" status={data.dhuhr} />
      {/* ... */}
    </View>
  );
}
```

### 2. Status Güncelleme

```typescript
import { useUpdatePrayerStatusLocal } from '@/lib/hooks/usePrayerTrackingLocal';

function PrayerRow({ name, status }) {
  const { mutate: updateStatus } = useUpdatePrayerStatusLocal();

  const handlePress = () => {
    updateStatus({
      prayer: name,
      status: 'prayed', // veya 'unprayed', 'later'
    });
  };

  return <Button onPress={handlePress}>Kıldım</Button>;
}
```

### 3. Otomatik Senkronizasyon

```typescript
import { useAutoSync } from '@/lib/hooks/usePrayerSync';

function App() {
  // Otomatik senkronizasyonu başlat
  useAutoSync();

  return <Navigation />;
}
```

### 4. Manuel Senkronizasyon

```typescript
import { useSyncPrayers, usePrayerSyncStatus } from '@/lib/hooks/usePrayerSync';

function SettingsScreen() {
  const { mutate: sync, isPending } = useSyncPrayers();
  const { data: status } = usePrayerSyncStatus();

  return (
    <View>
      <Text>Bekleyen: {status?.pendingCount || 0}</Text>
      <Button onPress={() => sync()} disabled={isPending}>
        {isPending ? 'Senkronize ediliyor...' : 'Şimdi Senkronize Et'}
      </Button>
    </View>
  );
}
```

### 5. Daily Reset (İmsak Bazlı)

```typescript
import { dailyResetService } from '@/lib/services/dailyReset';
import { usePrayerTimes } from '@/lib/hooks/usePrayerTimes';

function App() {
  const { data: prayerTimes } = usePrayerTimes({ latitude, longitude });

  useEffect(() => {
    // Initialize daily reset with imsak time
    dailyResetService.initialize(prayerTimes?.data);
  }, [prayerTimes]);

  return <Navigation />;
}
```

---

## 🗂️ Dosya Yapısı

```
src/
├── lib/
│   ├── database/
│   │   └── sqlite/
│   │       ├── schema.sql          # SQLite schema
│   │       └── repository.ts       # Repository pattern
│   ├── services/
│   │   ├── prayerSync.ts          # Sync service
│   │   └── dailyReset.ts          # Daily reset service (imsak-based)
│   └── hooks/
│       ├── usePrayerTrackingLocal.ts  # Local state hooks
│       └── usePrayerSync.ts          # Sync hooks

supabase/
└── migrations/
    └── prayer_tracking/
        ├── prayer_logs.sql        # Boolean table
        ├── sync_prayer_log.sql    # Sync RPC function (UPSERT)
        ├── get_prayer_streak.sql  # Streak function
        └── index.sql              # Migration index
```

---

## ✅ Implementasyon Checklist

### Supabase Migrations

- [x] `prayer_logs` tablosu (boolean format)
- [x] `sync_prayer_log` RPC function (UPSERT)
- [x] `get_prayer_streak` function (boolean format)
- [x] RLS policies
- [x] Update triggers

### SQLite

- [x] `daily_prayer_state` tablosu (single row, id = 1)
- [x] `prayer_sync_queue` tablosu (no synced flag)
- [x] Repository pattern
- [x] Indexes
- [x] Milliseconds timestamp

### Services

- [x] `prayerTrackingRepo` - SQLite operations
- [x] `prayerSyncService` - Sync logic (DELETE on success)
- [x] `dailyResetService` - Daily reset logic (imsak-based)

### Hooks

- [x] `usePrayerTrackingLocal` - Local state
- [x] `useUpdatePrayerStatusLocal` - Update status
- [x] `usePrayerSync` - Sync operations
- [x] `useAutoSync` - Auto sync setup

### Frontend Integration

- [ ] Component güncellemeleri (local hooks kullan)
- [ ] App.tsx'te `useAutoSync` ekle
- [ ] Daily reset'i imsak zamanına göre başlat
- [ ] Settings'te sync status göster

---

## 🚀 Sonraki Adımlar

1. **Component Güncellemeleri:**
   - `DailyProgressSection` → `usePrayerTrackingLocal` kullan
   - `PrayerRow` → `useUpdatePrayerStatusLocal` kullan
   - `StreakCounter` → Supabase'den streak çek (günde bir kez)

2. **App Initialization:**
   - `_layout.tsx`'te `useAutoSync` ekle
   - `dailyResetService.initialize(prayerTimes)` çağır (imsak zamanı ile)

3. **Testing:**
   - Offline mod testi
   - Gün reset testi (imsak bazlı)
   - Sync queue testi (DELETE on success)
   - Conflict resolution testi (UPSERT)

---

## 📝 Önemli Notlar

- **İmsak Time:** Aladhan API'den alınır, local device saati ile karşılaştırılır
- **Sync Frequency:** 30 dakika varsayılan. İhtiyaca göre ayarlanabilir
- **Queue Cleanup:** Başarılı sync sonrası otomatik DELETE (synced flag yok)
- **Timestamp:** Tüm zaman alanları milliseconds (`Date.now()`)
- **Single Row:** `daily_prayer_state` tablosu sadece 1 satır içerir

---

## 🔒 Güvenlik

- ✅ RLS policies aktif
- ✅ User ID kontrolü (auth.uid())
- ✅ SQLite local only (güvenli)
- ✅ Supabase sync authenticated
- ✅ UPSERT conflict safe

---

**Bu implementasyon offline-first prensiplerine tam uyumludur! 🎉**
