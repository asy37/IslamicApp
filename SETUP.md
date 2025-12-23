# 🚀 Kurulum Rehberi

## 📋 Ön Gereksinimler

- Node.js 18+ yüklü olmalı
- npm veya yarn
- Expo CLI (`npm install -g expo-cli` veya `npx expo` kullanabilirsiniz)
- iOS Simulator (Mac için) veya Android Emulator
- Supabase hesabı (cloud için) veya Supabase CLI (local için)

---

## 🔧 Adım 1: Frontend Kurulumu

### 1.1 Bağımlılıkları Yükle

```bash
cd /Users/ahmet/Projects/IslamicApp
npm install
```

### 1.2 Environment Variables

`.env` dosyası oluşturun (`.env.example` dosyasını kopyalayın):

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve Supabase bilgilerinizi ekleyin:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_EXPO_PROJECT_ID=your-expo-project-id
```

### 1.3 Font Dosyalarını Ekleyin

`assets/fonts/` klasörüne şu font dosyalarını ekleyin:
- `Amiri-Regular.ttf`
- `Amiri-Bold.ttf`
- `ScheherazadeNew-Regular.ttf`
- `ScheherazadeNew-Bold.ttf`

Fontları [Google Fonts](https://fonts.google.com) üzerinden indirebilirsiniz.

### 1.4 App Icon ve Splash Screen

`assets/images/` klasörüne şu dosyaları ekleyin:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)
- `notification-icon.png` (96x96)

**Not:** Şimdilik placeholder olarak herhangi bir görsel kullanabilirsiniz. Production için özel tasarım yapılmalı.

### 1.5 Projeyi Çalıştır

```bash
# Development server'ı başlat
npm start

# iOS'ta çalıştır
npm run ios

# Android'de çalıştır
npm run android
```

---

## 🗄️ Adım 2: Backend Kurulumu (Supabase)

### Seçenek A: Supabase Cloud (Önerilen - Production)

1. **Supabase Projesi Oluştur**
   - [Supabase Dashboard](https://app.supabase.com) üzerinden yeni proje oluşturun
   - Project Settings > API'den URL ve anon key'i kopyalayın
   - `.env` dosyasına ekleyin

2. **Database Migration**
   - Supabase Dashboard > SQL Editor'e gidin
   - `supabase/migrations/001_initial_schema.sql` dosyasının içeriğini kopyalayın
   - SQL Editor'de çalıştırın

3. **Edge Functions Deployment**
   ```bash
   # Supabase CLI ile login
   supabase login
   
   # Projeyi link et
   supabase link --project-ref your-project-ref
   
   # Edge Function'ı deploy et
   supabase functions deploy send-daily-verse
   ```

### Seçenek B: Local Development

1. **Supabase CLI Kurulumu**
   ```bash
   # macOS
   brew install supabase/tap/supabase
   
   # veya npm ile
   npm install -g supabase
   ```

2. **Local Supabase Başlat**
   ```bash
   # Supabase'i local olarak başlat
   supabase start
   
   # Migration'ları çalıştır
   supabase db reset
   ```

3. **Local URL'leri `.env`'e ekle**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=local-anon-key
   ```

---

## ✅ Kurulum Kontrolü

### Frontend Kontrolü

1. `npm start` komutu çalışıyor mu?
2. Expo Go veya simulator'da uygulama açılıyor mu?
3. Console'da hata var mı?

### Backend Kontrolü

1. Supabase Dashboard'da tablolar oluştu mu?
   - `profiles`
   - `prayer_logs`
   - `push_tokens`
   - `user_settings`

2. RLS policies aktif mi?
   - Her tablo için RLS enabled olmalı

3. Edge Functions deploy edildi mi?
   - Supabase Dashboard > Edge Functions'da görünüyor mu?

---

## 🐛 Sorun Giderme

### Font Hataları

Eğer font yükleme hatası alırsanız:
- Font dosyalarının `assets/fonts/` klasöründe olduğundan emin olun
- `app.json` içindeki font path'lerini kontrol edin
- Uygulamayı yeniden başlatın

### Supabase Bağlantı Hatası

- `.env` dosyasındaki URL ve key'leri kontrol edin
- Supabase projenizin aktif olduğundan emin olun
- Network bağlantınızı kontrol edin

### Expo Başlatma Hatası

- Node.js versiyonunu kontrol edin (`node --version`)
- `node_modules` klasörünü silip `npm install` yapın
- Expo CLI'yi güncelleyin: `npm install -g expo-cli@latest`

---

## 📝 Sonraki Adımlar

Kurulum tamamlandıktan sonra:

1. ✅ Prayer Times feature'ını implement edin
2. ✅ Notification service'i test edin
3. ✅ Dhikr counter'ı geliştirin
4. ✅ Quran reader'ı implement edin

Detaylı geliştirme planı için [MVP_SCOPE.md](./MVP_SCOPE.md) dosyasına bakın.

