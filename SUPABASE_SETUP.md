# 🗄️ Supabase Setup Adımları

## ✅ 1. Database Migration'ı Çalıştırma

Supabase Dashboard'da SQL Editor'ü kullanarak migration'ı çalıştırmanız gerekiyor.

### Adımlar:

1. **Supabase Dashboard'a gidin**
   - [app.supabase.com](https://app.supabase.com)
   - Projenizi seçin

2. **SQL Editor'ü açın**
   - Sol menüden "SQL Editor" seçin
   - "New query" butonuna tıklayın

3. **Migration dosyasını çalıştırın**
   - `supabase/migrations/001_initial_schema.sql` dosyasını açın
   - Tüm içeriği kopyalayın
   - SQL Editor'e yapıştırın
   - "Run" butonuna tıklayın (veya Cmd+Enter)

4. **Başarı kontrolü**
   - "Success" mesajı görünmeli
   - Sol menüden "Table Editor" seçin
   - Şu tablolar oluşmuş olmalı:
     - ✅ `profiles`
     - ✅ `prayer_logs`
     - ✅ `push_tokens`
     - ✅ `user_settings`

## ✅ 2. RLS (Row Level Security) Kontrolü

Migration'da RLS zaten aktif edildi, ama kontrol edelim:

1. **Table Editor'da herhangi bir tabloya gidin**
2. **"Policies" sekmesine tıklayın**
3. **Her tablo için policies görünmeli:**
   - `profiles`: Users can view/update/insert own profile
   - `prayer_logs`: Users can view/insert/update/delete own prayer logs
   - `push_tokens`: Users can view/insert/update/delete own push tokens
   - `user_settings`: Users can view/insert/update own settings

## ⏭️ 3. Edge Functions (Opsiyonel - Şimdilik Gerekli Değil)

Edge Functions'ları şimdilik deploy etmenize gerek yok. İleride günlük ayet bildirimi için kullanılacak.

### İleride Deploy Etmek İçin:

```bash
# Supabase CLI ile login
supabase login

# Projeyi link et
supabase link --project-ref your-project-ref

# Function'ı deploy et
supabase functions deploy send-daily-verse
```

## 🧪 4. Test Etme

Migration başarılı olduktan sonra, uygulamanızı test edebilirsiniz:

1. **Uygulamayı başlatın:**
   ```bash
   npm start
   ```

2. **Supabase bağlantısını test edin:**
   - Uygulama açıldığında console'da hata olmamalı
   - Supabase client başarıyla bağlanmalı

## 📋 Kontrol Listesi

- [ ] Supabase projesi oluşturuldu
- [ ] `.env` dosyası dolduruldu
- [ ] Database migration çalıştırıldı
- [ ] Tablolar oluşturuldu (profiles, prayer_logs, push_tokens, user_settings)
- [ ] RLS policies aktif
- [ ] Uygulama Supabase'e bağlanıyor

## 🐛 Sorun Giderme

### Migration hatası alıyorum
- SQL Editor'de hata mesajını kontrol edin
- Bazı tablolar zaten varsa, migration'ı tekrar çalıştırmayın
- Hata varsa, hata mesajını paylaşın

### Tablolar görünmüyor
- Table Editor'da "Refresh" butonuna tıklayın
- Sol menüden "Database" > "Tables" seçin

### RLS hatası
- Migration'da RLS zaten aktif edildi
- Eğer sorun varsa, Table Editor'da "Policies" sekmesinden kontrol edin

