# Supabase Backend Setup

## 🚀 Hızlı Başlangıç

### 1. Supabase CLI Kurulumu

```bash
# macOS
brew install supabase/tap/supabase

# veya npm ile
npm install -g supabase
```

### 2. Supabase Projesi Oluşturma

#### Seçenek A: Cloud (Önerilen - Production)

1. [Supabase Dashboard](https://app.supabase.com) üzerinden yeni proje oluşturun
2. Project Settings > API'den URL ve anon key'i alın
3. `.env` dosyasına ekleyin:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Seçenek B: Local Development

```bash
# Supabase'i local olarak başlat
supabase start

# Migration'ları çalıştır
supabase db reset
```

### 3. Migration'ları Çalıştırma

```bash
# Cloud için (Supabase Dashboard > SQL Editor)
# supabase/migrations/001_initial_schema.sql dosyasını çalıştırın

# Local için
supabase db reset
```

### 4. Edge Functions Deployment

```bash
# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy send-daily-verse
```

## 📁 Klasör Yapısı

```
supabase/
├── migrations/          # Database migrations
├── functions/           # Edge Functions (Deno)
│   └── send-daily-verse/
└── config.toml         # Local development config
```

## 🔧 Edge Functions

### send-daily-verse

Günlük ayet bildirimi gönderir. Cron job ile zamanlanmalı.

**Zamanlama:**
- Supabase Dashboard > Database > Cron Jobs
- Veya external cron service (Vercel Cron, etc.)

## 📝 Notlar

- Production için Supabase Cloud kullanın
- Local development için `supabase start` kullanın
- Migration'ları version control'de tutun
- Edge Functions için Deno runtime kullanılır

