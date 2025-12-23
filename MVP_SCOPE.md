# 🎯 MVP Kapsamı - IslamicApp

## 📋 Genel Bakış

MVP, temel özellikleri içeren, production-ready bir uygulama olmalı. Kullanıcılar uygulamayı indirdiğinde değer görmeli ve günlük kullanıma uygun olmalı.

---

## ✅ Phase 1: Core MVP (4-6 Hafta)

### 1.1 Prayer Times & Notifications ⭐⭐⭐

**Öncelik:** En Yüksek

**Özellikler:**
- [x] Konum tabanlı otomatik namaz vakitleri
- [x] 3 hesaplama yöntemi:
  - Diyanet (Türkiye)
  - Muslim World League
  - Umm al-Qura (Suudi Arabistan)
- [x] Bildirim türleri:
  - Sessiz
  - Ezan sesi
  - Titreşim
- [x] Offline destek:
  - Günlük ve haftalık vakitler önbelleğe alınır
  - SQLite'da saklanır
- [x] iOS güvenilir bildirimler:
  - Local scheduled notifications (primary)
  - Push notifications (backup)
  - Background task ile cache refresh

**Ekranlar:**
- Ana ekran: Bugünün namaz vakitleri (büyük, okunabilir)
- Ayarlar: Hesaplama yöntemi seçimi, bildirim tercihleri

**Teknik Detaylar:**
- Aladhan API entegrasyonu
- expo-location ile konum
- expo-notifications ile bildirimler
- SQLite cache

**Kabul Kriterleri:**
- ✅ Namaz vakitleri doğru hesaplanıyor
- ✅ Bildirimler zamanında geliyor (iOS'ta güvenilir)
- ✅ Offline modda çalışıyor
- ✅ Konum değiştiğinde otomatik güncelleniyor

---

### 1.2 Dhikr Counter (Zikir Matik) ⭐⭐⭐

**Öncelik:** Yüksek

**Özellikler:**
- [x] 3 preset dhikr:
  - Subhanallah (33)
  - Alhamdulillah (33)
  - Allahu Akbar (34)
- [x] Özel dhikr oluşturma
- [x] Günlük hedefler
- [x] Titreşim geri bildirimi
- [x] Ekran kilitliyken çalışma
- [x] Basit istatistikler (günlük toplam)

**Ekranlar:**
- Dhikr ekranı: Büyük sayaç, preset seçimi
- Özel dhikr ekranı: Oluşturma/düzenleme
- İstatistikler: Günlük toplam (basit)

**Teknik Detaylar:**
- MMKV ile sayaç durumu (hızlı erişim)
- SQLite ile geçmiş kayıtları
- expo-haptics ile titreşim
- Background mode (iOS için özel izin)

**Kabul Kriterleri:**
- ✅ Sayaç doğru çalışıyor
- ✅ Ekran kilitliyken çalışıyor
- ✅ Veriler kaybolmuyor
- ✅ Titreşim geri bildirimi çalışıyor

---

### 1.3 Quran Reader (Offline First) ⭐⭐

**Öncelik:** Orta-Yüksek

**Özellikler:**
- [x] Surah listesi
- [x] Ayah listesi (surah içinde)
- [x] Arapça metin
- [x] Türkçe çeviri (1 çeviri, genişletilebilir)
- [x] Font boyutu kontrolü
- [x] Karanlık mod (gece okuma)
- [x] Offline çalışma:
  - Static JSON dosyaları (bundle içinde)
  - Surah bazlı indirme (gelecek için hazırlık)

**Ekranlar:**
- Quran ana ekran: Surah listesi
- Surah ekranı: Ayah listesi + çeviri
- Ayah detay: Büyük metin, font ayarları

**Teknik Detaylar:**
- Static JSON (Tanzil/Quran.com format)
- React Native SectionList ile performans
- NativeWind ile tema
- MMKV ile font boyutu tercihi

**Kabul Kriterleri:**
- ✅ Tüm surah'lar görüntüleniyor
- ✅ Çeviri doğru gösteriliyor
- ✅ Offline çalışıyor
- ✅ Font boyutu değişikliği anında uygulanıyor

---

### 1.4 Daily Verse Notification ⭐⭐

**Öncelik:** Orta

**Özellikler:**
- [x] Günlük ayet bildirimi
- [x] Ayet + kısa çeviri
- [x] Surah & ayah referansı
- [x] Bildirime tıklayınca ayeti aç
- [x] Kullanıcı seçimi:
  - Random ayet
  - Zamanlanmış ayet (sırayla)

**Ekranlar:**
- Ayarlar: Günlük ayet toggle, zaman seçimi

**Teknik Detaylar:**
- Edge Function: send-daily-verse
- Push notification
- Deep linking (notification → Quran screen)

**Kabul Kriterleri:**
- ✅ Bildirim zamanında geliyor
- ✅ Bildirime tıklayınca doğru ayet açılıyor
- ✅ Random/scheduled seçimi çalışıyor

---

### 1.5 Temel UI/UX ⭐⭐⭐

**Öncelik:** En Yüksek

**Özellikler:**
- [x] Modern, sakin tasarım
- [x] NativeWind ile styling
- [x] Dark mode desteği
- [x] Türkçe dil desteği
- [x] Onboarding flow (ilk açılış)
- [x] Temel navigasyon (tabs)

**Ekranlar:**
- Onboarding: 3-4 ekran (hoş geldin, izinler, ayarlar)
- Tab Navigation: Prayer, Quran, Dhikr, Profile

**Teknik Detaylar:**
- NativeWind (Tailwind CSS)
- React Navigation (tabs)
- Custom fonts (Amiri, Scheherazade)
- MMKV ile onboarding durumu

**Kabul Kriterleri:**
- ✅ Tasarım tutarlı ve profesyonel
- ✅ Navigasyon akıcı
- ✅ Dark mode düzgün çalışıyor
- ✅ Fontlar doğru yükleniyor

---

## ✅ Phase 2: Enhanced MVP (2-3 Hafta)

### 2.1 Prayer Tracking ⭐⭐⭐

**Öncelik:** Yüksek (Differentiator)

**Özellikler:**
- [x] "Did you pray?" akışı:
  1. Ezan bildirimi
  2. X dakika sonra hatırlatıcı
  3. Kullanıcı yanıtı:
     - ✅ Kıldım → DB'ye kaydet
     - ⏰ Sonra hatırlat → 30-40 dk sonra tekrar
- [x] Günlük namaz checklist
- [x] Haftalık istatistikler
- [x] Streak tracking (örn: "7 gün Dhuhr kaçırmadın")
- [x] Yumuşak, teşvik edici dil

**Ekranlar:**
- Prayer tracking ekranı: Günlük checklist, istatistikler
- Notification actions: Hızlı yanıt butonları

**Teknik Detaylar:**
- Edge Function: schedule-prayer-reminders
- Push notification with actions
- SQLite: prayer_logs tablosu
- Zustand: prayer tracking state

**Kabul Kriterleri:**
- ✅ Hatırlatıcı zamanında geliyor
- ✅ Kullanıcı yanıtı kaydediliyor
- ✅ İstatistikler doğru hesaplanıyor
- ✅ Dil yumuşak ve teşvik edici

---

### 2.2 Enhanced Dhikr ⭐

**Öncelik:** Orta

**Özellikler:**
- [x] Özel dhikr düzenleme/silme
- [x] Haftalık istatistikler
- [x] Geçmiş kayıtlar (son 7 gün)
- [x] Export (gelecek için hazırlık)

**Ekranlar:**
- Dhikr istatistikleri: Grafik, trend

**Teknik Detaylar:**
- SQLite: dhikr_sessions tablosu
- TanStack Query: istatistik hesaplama

---

### 2.3 Improved Notifications ⭐⭐

**Öncelik:** Yüksek

**Özellikler:**
- [x] Notification reliability improvements
- [x] Failed notification retry
- [x] Notification history (son 7 gün)
- [x] Better error handling

**Teknik Detaylar:**
- Monitoring & logging
- Retry logic
- Error tracking

---

## ✅ Phase 3: Premium Features (2-3 Hafta)

### 3.1 Premium Subscription ⭐

**Öncelik:** Düşük (MVP sonrası)

**Özellikler:**
- [x] Stripe entegrasyonu
- [x] Supabase RLS ile feature gating
- [x] Premium özellikler:
  - Reklamsız deneyim
  - Critical alerts (sessiz modu bypass)
  - Gelişmiş istatistikler
  - Cloud sync
  - Özel temalar

**Teknik Detaylar:**
- Stripe Checkout
- Supabase subscriptions tablosu
- RLS policies

---

### 3.2 Cloud Sync ⭐

**Öncelik:** Düşük

**Özellikler:**
- [x] Optional sign-up
- [x] Prayer logs sync
- [x] Dhikr history sync
- [x] Settings sync
- [x] Conflict resolution

**Teknik Detaylar:**
- Supabase Auth
- Two-way sync
- Last Write Wins strategy

---

## 🚫 MVP'de Olmayacaklar (Sonraki Versiyonlar)

- ❌ Audio recitation (Quran)
- ❌ Ayah bookmarks (Quran)
- ❌ Dua Journal
- ❌ Islamic Calendar (Hijri, Kandil)
- ❌ Ramadan Mode
- ❌ Hadith notifications
- ❌ Multiple translation support (Quran)
- ❌ Social features
- ❌ Community features

---

## 📊 MVP Success Metrics

### Teknik Metrikler
- App crash rate < 0.1%
- Notification delivery rate > 95%
- Offline functionality: %100
- App size < 50MB (initial)

### Kullanıcı Metrikleri
- Daily active users (DAU)
- Notification engagement rate
- Prayer tracking completion rate
- App store rating > 4.5

---

## 🗓️ Timeline

### Hafta 1-2: Setup & Foundation
- Expo projesi kurulumu
- Klasör yapısı
- Supabase setup
- Temel UI components
- Navigation setup

### Hafta 3-4: Prayer Times
- Location service
- Prayer times API
- Notification service
- Cache implementation
- UI implementation

### Hafta 5: Dhikr Counter
- Counter logic
- Preset dhikr
- Custom dhikr
- Statistics
- Background mode

### Hafta 6: Quran Reader
- Data structure
- UI implementation
- Translation display
- Font controls
- Dark mode

### Hafta 7: Daily Verse
- Edge Function
- Push notification
- Deep linking
- Settings UI

### Hafta 8: Polish & Testing
- Bug fixes
- Performance optimization
- UI/UX improvements
- Testing
- App Store preparation

---

## 🎯 MVP Definition of Done

MVP tamamlanmış sayılır:

1. ✅ Tüm Phase 1 özellikleri çalışıyor
2. ✅ iOS'ta bildirimler güvenilir
3. ✅ Offline modda çalışıyor
4. ✅ App Store'a yüklenebilir durumda
5. ✅ Temel testler geçiyor
6. ✅ Performance kabul edilebilir
7. ✅ UI/UX tutarlı ve profesyonel

---

## 📝 Notlar

- **MVP First**: Sadece kritik özelliklere odaklan
- **Quality over Quantity**: Az özellik ama mükemmel çalışan
- **User Feedback**: MVP sonrası kullanıcı geri bildirimine göre önceliklendirme
- **Iterative Development**: Her phase sonrası değerlendirme ve önceliklendirme

