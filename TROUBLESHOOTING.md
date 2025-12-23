# 🔧 Sorun Giderme Rehberi

## Yaygın Hatalar ve Çözümleri

### 1. "Cannot find native module 'ExpoLinking'"

**Çözüm:**
```bash
# expo-linking paketini yükle
npm install expo-linking

# Cache'i temizle ve yeniden başlat
npx expo start --clear
```

### 2. "main" has not been registered

Bu genellikle native modül hatasından sonra oluşur.

**Çözüm:**
```bash
# Cache'i temizle
npx expo start --clear

# veya
rm -rf node_modules
npm install
npx expo start --clear
```

### 3. Metro bundler hataları

**Çözüm:**
```bash
# Watchman cache'i temizle (macOS)
watchman watch-del-all

# Metro cache'i temizle
npx expo start --clear

# node_modules'ı yeniden yükle
rm -rf node_modules
npm install
```

### 4. iOS Simulator'da native modül hataları

**Çözüm:**
```bash
# iOS build cache'i temizle
cd ios
rm -rf build
pod deintegrate
pod install
cd ..

# Uygulamayı yeniden başlat
npx expo run:ios
```

### 5. Android'de native modül hataları

**Çözüm:**
```bash
# Android build cache'i temizle
cd android
./gradlew clean
cd ..

# Uygulamayı yeniden başlat
npx expo run:android
```

### 6. Font yükleme hataları

**Çözüm:**
- Font dosyalarının `assets/fonts/` klasöründe olduğundan emin olun
- `app/_layout.tsx` dosyasındaki font require'larını kontrol edin
- Uygulamayı yeniden başlatın

### 7. Supabase bağlantı hataları

**Çözüm:**
- `.env` dosyasının doğru doldurulduğundan emin olun
- Supabase projenizin aktif olduğunu kontrol edin
- Network bağlantınızı kontrol edin
- Console'da hata mesajını kontrol edin

### 8. TypeScript hataları

**Çözüm:**
```bash
# Type check yap
npm run type-check

# Hataları düzelt
# Eğer hata devam ederse, tsconfig.json'ı kontrol edin
```

### 9. NativeWind (Tailwind) stilleri çalışmıyor

**Çözüm:**
- `global.css` dosyasının import edildiğinden emin olun (`app/_layout.tsx`)
- `tailwind.config.js` dosyasını kontrol edin
- `metro.config.js` dosyasını kontrol edin
- Uygulamayı yeniden başlatın

### 10. Expo Router navigasyon hataları

**Çözüm:**
- Dosya yapısını kontrol edin (`app/` klasörü)
- Route dosyalarının doğru isimlendirildiğinden emin olun
- `app/_layout.tsx` dosyasını kontrol edin

## Genel Çözüm Adımları

Eğer yukarıdaki çözümler işe yaramazsa:

1. **Tam temizlik:**
```bash
# Tüm cache'leri temizle
rm -rf node_modules
rm -rf .expo
rm -rf ios/build
rm -rf android/build
watchman watch-del-all

# Yeniden yükle
npm install

# Yeniden başlat
npx expo start --clear
```

2. **Expo CLI'yi güncelle:**
```bash
npm install -g expo-cli@latest
```

3. **Node.js versiyonunu kontrol et:**
```bash
node --version  # 18+ olmalı
```

4. **Xcode/Android Studio'yu güncelle:**
- iOS için: Xcode'u App Store'dan güncelleyin
- Android için: Android Studio'yu güncelleyin

## Hala Sorun mu Var?

1. Hata mesajının tamamını kopyalayın
2. Console loglarını kontrol edin
3. `package.json` dosyasındaki versiyonları kontrol edin
4. Expo SDK versiyonunu kontrol edin (`expo --version`)

## Yararlı Komutlar

```bash
# Expo versiyonunu kontrol et
expo --version

# Tüm paketleri güncelle
npm update

# Expo'yu güncelle
npx expo install --fix

# Type check
npm run type-check

# Lint
npm run lint
```

