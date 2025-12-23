# ⚡ Hızlı Başlangıç

## ✅ Kurulum Tamamlandı!

Frontend ve backend projeleri kuruldu. Şimdi çalıştırmak için:

## 🚀 Projeyi Çalıştırma

### Frontend

```bash
# Development server'ı başlat
npm start

# iOS Simulator'da çalıştır
npm run ios

# Android Emulator'da çalıştır
npm run android
```

### Backend (Supabase)

#### Seçenek 1: Supabase Cloud (Önerilen)

1. [Supabase Dashboard](https://app.supabase.com) üzerinden proje oluşturun
2. Project Settings > API'den URL ve anon key'i alın
3. `.env` dosyası oluşturun:

```bash
cp .env.example .env
```

4. `.env` dosyasını düzenleyin:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_EXPO_PROJECT_ID=your-expo-project-id
```

5. Database migration'ı çalıştırın:
   - Supabase Dashboard > SQL Editor
   - `supabase/migrations/001_initial_schema.sql` içeriğini kopyalayıp çalıştırın

#### Seçenek 2: Local Development

```bash
# Supabase CLI kurulumu (eğer yoksa)
brew install supabase/tap/supabase

# Local Supabase başlat
supabase start

# Migration'ları çalıştır
supabase db reset
```

## 📝 Önemli Notlar

### Font Dosyaları

Font dosyaları şu anda yok. Uygulama çalışır ama Arapça fontlar görünmez. Fontları eklemek için:

1. `assets/fonts/` klasörüne şu dosyaları ekleyin:
   - `Amiri-Regular.ttf`
   - `Amiri-Bold.ttf`
   - `ScheherazadeNew-Regular.ttf`
   - `ScheherazadeNew-Bold.ttf`

2. `app/_layout.tsx` dosyasındaki yorumları kaldırın

### App Icon ve Splash Screen

Şu anda placeholder. Production için:
- `assets/images/icon.png` (1024x1024)
- `assets/images/splash.png` (1242x2436)
- `assets/images/adaptive-icon.png` (1024x1024)

## 🎯 Sonraki Adımlar

1. ✅ Supabase projesi oluştur ve `.env` dosyasını doldur
2. ✅ Database migration'ı çalıştır
3. ✅ Prayer Times feature'ını implement et
4. ✅ Notification service'i test et

Detaylı bilgi için:
- [SETUP.md](./SETUP.md) - Detaylı kurulum rehberi
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Mimari dokümantasyon
- [MVP_SCOPE.md](./MVP_SCOPE.md) - MVP planı

## 🐛 Sorun mu var?

### Babel Hatası
✅ Düzeltildi - `expo-router/babel` plugin'i kaldırıldı

### Font Hatası
- Font dosyaları yoksa uygulama çalışır ama Arapça fontlar görünmez
- Fontları ekledikten sonra `app/_layout.tsx`'deki yorumları kaldırın

### Supabase Bağlantı Hatası
- `.env` dosyasının doğru doldurulduğundan emin olun
- Supabase projenizin aktif olduğunu kontrol edin

## ✨ Proje Hazır!

Artık geliştirmeye başlayabilirsiniz. İyi çalışmalar! 🚀

