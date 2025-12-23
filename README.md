# 🕌 IslamicApp

Modern, privacy-first İslami yaşam tarzı mobil uygulaması.

## 🎯 Özellikler

- **Namaz Vakitleri**: Konum tabanlı otomatik hesaplama, güvenilir bildirimler
- **Zikir Matik**: Preset ve özel zikirler, günlük hedefler
- **Kuran Okuyucu**: Offline-first, Arapça + Türkçe çeviri
- **Namaz Takibi**: Teşvik edici, yargılamayan takip sistemi
- **Günlük Ayet**: Her gün yeni ayet bildirimi

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator veya Android Emulator (veya fiziksel cihaz)

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start

# iOS'ta çalıştır
npm run ios

# Android'de çalıştır
npm run android
```

## 📁 Proje Yapısı

Detaylı mimari için [ARCHITECTURE.md](./ARCHITECTURE.md) dosyasına bakın.

## 🔔 Bildirimler

iOS güvenli bildirim stratejisi için [NOTIFICATIONS_STRATEGY.md](./NOTIFICATIONS_STRATEGY.md) dosyasına bakın.

## 📋 MVP Kapsamı

MVP özellikleri ve timeline için [MVP_SCOPE.md](./MVP_SCOPE.md) dosyasına bakın.

## 🛠️ Teknoloji Stack

- **Frontend**: Expo (React Native + TypeScript)
- **Styling**: NativeWind (Tailwind CSS)
- **State**: Zustand + TanStack Query
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Storage**: SQLite + MMKV
- **Notifications**: expo-notifications + Expo Push API

## 📝 Lisans

Private - All rights reserved

