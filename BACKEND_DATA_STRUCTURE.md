# 📊 Backend Veri Yapıları ve Tablolar

Bu dokümantasyon, görsel tasarımlar için gerekli tüm veri yapılarını ve backend tablolarını içerir.

---

## 🎯 Genel Bakış

### Tablolar Listesi

1. **profiles** - Kullanıcı profilleri
2. **prayer_logs** - Namaz takip kayıtları
3. **push_tokens** - Push notification token'ları
4. **user_settings** - Kullanıcı ayarları
5. **dhikr_sessions** - Zikir oturumları (yeni)
6. **dhikr_presets** - Zikir preset'leri (yeni)
7. **quran_surahs** - Kuran sureleri (yeni)
8. **quran_ayahs** - Kuran ayetleri (yeni)
9. **quran_translations** - Kuran çevirileri (yeni)
10. **daily_verses** - Günlük ayetler (yeni)
11. **prayer_times_cache** - Namaz vakitleri önbelleği (yeni)

---

## 1️⃣ Prayer Times (Namaz Vakitleri) Sayfası

### Ekranda Gösterilecek Veriler

```typescript
interface PrayerTimesScreenData {
  // Bugünün namaz vakitleri
  today: {
    date: string; // "2024-01-15"
    hijriDate: string; // "1445-07-04"
    location: {
      city: string; // "İstanbul"
      country: string; // "Türkiye"
      coordinates: {
        lat: number;
        lng: number;
      }
    };
    prayers: [
      {
        name: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
        displayName: string; // "Sabah", "Öğle", "İkindi", "Akşam", "Yatsı"
        time: string; // "06:30" (HH:mm format)
        time24: string; // "06:30"
        time12: string; // "6:30 AM"
        isNext: boolean; // Bir sonraki namaz mı?
        isPassed: boolean; // Geçti mi?
        minutesUntil: number | null; // Kaç dakika kaldı (null ise geçti)
      }
    ];
    nextPrayer: {
      name: string;
      time: string;
      minutesUntil: number;
    } | null;
  };
  
  // Haftalık görünüm için (opsiyonel)
  week: Array<{
    date: string;
    prayers: Array<{
      name: string;
      time: string;
    }>;
  }>;
  
  // İstatistikler
  stats: {
    todayCompleted: number; // Bugün kılınan namaz sayısı (0-5)
    weekCompleted: number; // Bu hafta kılınan toplam
    currentStreak: number; // Günlük streak
  };
}
```

### Backend Tabloları

#### `prayer_times_cache` (Yeni Tablo)

```sql
CREATE TABLE public.prayer_times_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  location_city TEXT,
  location_country TEXT,
  prayer_method TEXT NOT NULL, -- 'diyanet', 'mwl', 'umm_al_qura'
  fajr_time TIME NOT NULL,
  dhuhr_time TIME NOT NULL,
  asr_time TIME NOT NULL,
  maghrib_time TIME NOT NULL,
  isha_time TIME NOT NULL,
  hijri_date TEXT, -- "1445-07-04"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, location_lat, location_lng, prayer_method)
);

CREATE INDEX idx_prayer_times_cache_date_location 
ON public.prayer_times_cache(date, location_lat, location_lng);
```

**Not:** Bu tablo cache için. Asıl veri Aladhan API'den çekilir, burada saklanır.

---

## 2️⃣ Dhikr Counter (Zikir Matik) Sayfası

### Ekranda Gösterilecek Veriler

```typescript
interface DhikrScreenData {
  // Aktif zikir oturumu
  currentSession: {
    id: string;
    dhikrId: string;
    dhikrName: string; // "Subhanallah"
    arabic: string; // "سُبْحَانَ اللَّهِ"
    target: number; // 33
    currentCount: number; // 15
    progress: number; // 0-100
    startedAt: Date;
  } | null;
  
  // Preset zikirler
  presets: Array<{
    id: string;
    name: string;
    arabic: string;
    transliteration: string;
    target: number;
    description: string;
    isCustom: boolean;
  }>;
  
  // Bugünün istatistikleri
  todayStats: {
    totalCount: number; // Bugün toplam kaç zikir
    completedDhikrs: number; // Kaç zikir tamamlandı
    sessions: Array<{
      dhikrName: string;
      count: number;
      completedAt: Date;
    }>;
  };
  
  // Haftalık istatistikler (opsiyonel)
  weekStats: {
    totalCount: number;
    dailyBreakdown: Array<{
      date: string;
      count: number;
    }>;
  };
}
```

### Backend Tabloları

#### `dhikr_presets` (Yeni Tablo)

```sql
CREATE TABLE public.dhikr_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- "Subhanallah"
  arabic TEXT NOT NULL, -- "سُبْحَانَ اللَّهِ"
  transliteration TEXT NOT NULL, -- "Subhanallah"
  target INTEGER NOT NULL DEFAULT 33,
  description TEXT,
  is_system BOOLEAN DEFAULT true, -- Sistem preset'i mi?
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- null ise sistem preset'i
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name) -- Kullanıcı başına aynı isimde tek zikir
);

CREATE INDEX idx_dhikr_presets_user ON public.dhikr_presets(user_id);
```

#### `dhikr_sessions` (Yeni Tablo)

```sql
CREATE TABLE public.dhikr_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dhikr_preset_id UUID REFERENCES public.dhikr_presets(id) ON DELETE SET NULL,
  dhikr_name TEXT NOT NULL, -- Preset silinse bile isim kalsın
  count INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  date DATE NOT NULL, -- Oturumun tarihi
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dhikr_sessions_user_date 
ON public.dhikr_sessions(user_id, date DESC);
CREATE INDEX idx_dhikr_sessions_user_completed 
ON public.dhikr_sessions(user_id, completed);
```

**Seed Data (Sistem Preset'leri):**

```sql
INSERT INTO public.dhikr_presets (name, arabic, transliteration, target, description, is_system) VALUES
('Subhanallah', 'سُبْحَانَ اللَّهِ', 'Subhanallah', 33, 'Allah''ı tesbih etmek', true),
('Alhamdulillah', 'الْحَمْدُ لِلَّهِ', 'Alhamdulillah', 33, 'Allah''a hamd etmek', true),
('Allahu Akbar', 'اللَّهُ أَكْبَرُ', 'Allahu Akbar', 34, 'Allah''ı tekbir etmek', true);
```

---

## 3️⃣ Quran (Kuran) Sayfası

### Ekranda Gösterilecek Veriler

```typescript
interface QuranScreenData {
  // Sure listesi
  surahs: Array<{
    number: number; // 1-114
    name: string; // "Al-Fatiha"
    arabicName: string; // "الفاتحة"
    englishName: string; // "The Opening"
    ayahCount: number; // 7
    revelationType: "meccan" | "medinan";
    revelationOrder: number; // Vahiy sırası
  }>;
  
  // Seçili sure detayı
  selectedSurah: {
    number: number;
    name: string;
    arabicName: string;
    ayahs: Array<{
      number: number; // Ayah numarası (1'den başlar)
      text: string; // Arapça metin
      translation?: string; // Türkçe çeviri
    }>;
  } | null;
  
  // Ayet detayı (ayet görüntüleme sayfası için)
  selectedAyah: {
    surah: number;
    surahName: string;
    ayah: number;
    text: string;
    translation?: string;
    context?: string; // Önceki/sonraki ayetler
  } | null;
  
  // Kullanıcı tercihleri
  preferences: {
    fontSize: number; // 14-24
    showTranslation: boolean;
    translationId?: string; // Hangi çeviri
    darkMode: boolean;
  };
}
```

### Backend Tabloları

#### `quran_surahs` (Yeni Tablo)

```sql
CREATE TABLE public.quran_surahs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER UNIQUE NOT NULL, -- 1-114
  name TEXT NOT NULL, -- "Al-Fatiha"
  arabic_name TEXT NOT NULL, -- "الفاتحة"
  english_name TEXT NOT NULL, -- "The Opening"
  ayah_count INTEGER NOT NULL, -- 7
  revelation_type TEXT NOT NULL CHECK (revelation_type IN ('meccan', 'medinan')),
  revelation_order INTEGER, -- Vahiy sırası
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quran_surahs_number ON public.quran_surahs(number);
```

#### `quran_ayahs` (Yeni Tablo)

```sql
CREATE TABLE public.quran_ayahs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surah_number INTEGER NOT NULL REFERENCES public.quran_surahs(number) ON DELETE CASCADE,
  ayah_number INTEGER NOT NULL, -- Sure içindeki ayah numarası (1'den başlar)
  text TEXT NOT NULL, -- Arapça metin
  juz_number INTEGER, -- Cüz numarası
  page_number INTEGER, -- Sayfa numarası
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(surah_number, ayah_number)
);

CREATE INDEX idx_quran_ayahs_surah ON public.quran_ayahs(surah_number, ayah_number);
```

#### `quran_translations` (Yeni Tablo)

```sql
CREATE TABLE public.quran_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  translation_id TEXT NOT NULL, -- 'diyanet', 'elmalili', etc.
  translation_text TEXT NOT NULL,
  translator_name TEXT,
  language TEXT DEFAULT 'tr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (surah_number, ayah_number) 
    REFERENCES public.quran_ayahs(surah_number, ayah_number) 
    ON DELETE CASCADE,
  UNIQUE(surah_number, ayah_number, translation_id)
);

CREATE INDEX idx_quran_translations_surah_ayah 
ON public.quran_translations(surah_number, ayah_number);
```

**Not:** Kuran verileri static JSON dosyalarından da yüklenebilir. Tablolar opsiyonel ama cloud sync için faydalı.

---

## 4️⃣ Prayer Tracking (Namaz Takibi) Sayfası

### Ekranda Gösterilecek Veriler

```typescript
interface PrayerTrackingScreenData {
  // Bugünün checklist'i
  today: {
    date: string;
    prayers: Array<{
      name: string;
      displayName: string;
      time: string;
      status: "completed" | "missed" | "pending";
      loggedAt?: Date;
    }>;
    completedCount: number; // 0-5
    totalCount: number; // 5
  };
  
  // Haftalık görünüm
  week: Array<{
    date: string;
    prayers: Array<{
      name: string;
      status: "completed" | "missed" | "pending";
    }>;
    completedCount: number;
  }>;
  
  // İstatistikler
  stats: {
    currentStreak: number; // Günlük streak
    longestStreak: number;
    totalPrayers: number; // Toplam kılınan namaz
    completionRate: number; // 0-100
    weeklyStats: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
    };
  };
}
```

### Backend Tabloları

#### `prayer_logs` (Mevcut - Güncellenmiş)

Mevcut tablo yeterli, ama şu index'ler eklenebilir:

```sql
-- Zaten var, sadece index'ler
CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_status 
ON public.prayer_logs(user_id, status, date DESC);
```

---

## 5️⃣ Daily Verse (Günlük Ayet) - Notification

### Ekranda Gösterilecek Veriler

```typescript
interface DailyVerseData {
  verse: {
    surah: number;
    surahName: string;
    ayah: number;
    text: string;
    translation: string;
    date: string; // Hangi günün ayeti
  };
  
  // Ayarlar
  settings: {
    enabled: boolean;
    time: string; // "08:00"
    type: "random" | "scheduled"; // Random mı yoksa sırayla mı
  };
}
```

### Backend Tabloları

#### `daily_verses` (Yeni Tablo)

```sql
CREATE TABLE public.daily_verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE, -- Her gün için bir ayet
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  text TEXT NOT NULL, -- Arapça
  translation TEXT NOT NULL, -- Türkçe çeviri
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (surah_number, ayah_number) 
    REFERENCES public.quran_ayahs(surah_number, ayah_number)
);

CREATE INDEX idx_daily_verses_date ON public.daily_verses(date DESC);
```

**Not:** Bu tablo her gün için bir ayet saklar. Edge Function bu tabloyu doldurur.

---

## 6️⃣ Profile/Settings (Profil/Ayarlar) Sayfası

### Ekranda Gösterilecek Veriler

```typescript
interface ProfileScreenData {
  user: {
    id: string;
    email?: string;
    createdAt: Date;
  };
  
  settings: {
    prayerMethod: "diyanet" | "mwl" | "umm_al_qura";
    location: {
      city: string;
      country: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    notifications: {
      prayerTimes: {
        enabled: boolean;
        sound: "silent" | "adhan" | "vibration";
        minutesBefore: number;
      };
      prayerReminders: {
        enabled: boolean;
        minutesAfter: number;
      };
      dailyVerse: {
        enabled: boolean;
        time: string; // "08:00"
      };
    };
    quran: {
      fontSize: number;
      showTranslation: boolean;
      translationId: string;
    };
    app: {
      theme: "light" | "dark" | "auto";
      language: "tr" | "en";
    };
  };
  
  stats: {
    totalPrayers: number;
    currentStreak: number;
    totalDhikr: number;
    accountCreated: Date;
  };
}
```

### Backend Tabloları

#### `user_settings` (Mevcut - Güncellenmiş)

Mevcut tablo yeterli, ama `notification_settings` JSONB alanı şu yapıda olmalı:

```json
{
  "prayerTimes": {
    "enabled": true,
    "sound": "adhan",
    "minutesBefore": 0
  },
  "prayerReminders": {
    "enabled": true,
    "minutesAfter": 15
  },
  "dailyVerse": {
    "enabled": true,
    "time": "08:00"
  }
}
```

---

## 📋 Tüm Tabloların Özeti

### Yeni Oluşturulacak Tablolar

1. ✅ `prayer_times_cache` - Namaz vakitleri önbelleği
2. ✅ `dhikr_presets` - Zikir preset'leri
3. ✅ `dhikr_sessions` - Zikir oturumları
4. ✅ `quran_surahs` - Kuran sureleri
5. ✅ `quran_ayahs` - Kuran ayetleri
6. ✅ `quran_translations` - Kuran çevirileri
7. ✅ `daily_verses` - Günlük ayetler

### Mevcut Tablolar (Migration'da Var)

1. ✅ `profiles` - Kullanıcı profilleri
2. ✅ `prayer_logs` - Namaz takip kayıtları
3. ✅ `push_tokens` - Push notification token'ları
4. ✅ `user_settings` - Kullanıcı ayarları

---

## 🎨 Tasarım İçin Önemli Notlar

### 1. Prayer Times Sayfası
- **Büyük saat gösterimi** - Bir sonraki namaz için
- **5 vakit kartları** - Her namaz için ayrı kart
- **Progress bar** - Bugün kaç namaz kılındı
- **Haftalık takvim görünümü** (opsiyonel)

### 2. Dhikr Counter Sayfası
- **Büyük sayaç** - Merkezi, tıklanabilir
- **Preset seçimi** - Scrollable liste
- **Progress ring** - Hedefe ne kadar kaldı
- **İstatistik kartları** - Bugünün özeti

### 3. Quran Sayfası
- **Sure listesi** - Arama özellikli
- **Ayah görüntüleme** - Büyük, okunabilir font
- **Çeviri toggle** - Arapça/Türkçe geçiş
- **Font boyutu kontrolü** - Slider

### 4. Prayer Tracking Sayfası
- **Günlük checklist** - 5 vakit checkbox'ları
- **Haftalık grid** - 7 gün x 5 vakit
- **İstatistik grafikleri** - Streak, completion rate
- **Motivasyon mesajları** - Teşvik edici

### 5. Profile Sayfası
- **Ayarlar listesi** - Kategorize edilmiş
- **Toggle'lar** - Bildirim ayarları
- **Picker'lar** - Namaz yöntemi, tema
- **İstatistik özeti** - Kullanıcı başarıları

---

## 📝 Sonraki Adımlar

1. ✅ Bu dokümantasyonu inceleyin
2. ✅ Görsel tasarımları oluşturun
3. ✅ Tasarımları onayladıktan sonra migration'ları hazırlayacağız
4. ✅ Frontend'de bu veri yapılarını kullanacağız

**Not:** Tüm tablolar için RLS (Row Level Security) policies eklenecek. Kullanıcılar sadece kendi verilerini görebilecek.

