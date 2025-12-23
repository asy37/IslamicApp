# 🐳 Supabase Local Development Setup

## Docker Desktop Kurulumu

Supabase local development için Docker Desktop gereklidir.

### macOS için:

1. **Docker Desktop'ı İndirin**
   - [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/) adresinden indirin
   - `.dmg` dosyasını açıp kurulumu tamamlayın

2. **Docker Desktop'ı Başlatın**
   - Applications klasöründen Docker Desktop'ı açın
   - Docker'ın tamamen başlamasını bekleyin (menü çubuğunda Docker ikonu görünmeli)

3. **Supabase'i Başlatın**
   ```bash
   cd /Users/ahmet/Projects/IslamicApp
   supabase start
   ```

### Kurulum Sonrası

Docker Desktop başladıktan sonra:

```bash
# Supabase'i başlat
supabase start

# Migration'ları çalıştır
supabase db reset

# Local URL'leri al
supabase status
```

Local URL'ler:
- API URL: `http://localhost:54321`
- Studio URL: `http://localhost:54323`
- Anon Key: `supabase status` komutuyla görebilirsiniz

### `.env` Dosyasını Güncelleyin

Local development için `.env` dosyasına ekleyin:

```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=local-anon-key-here
```

**Not:** `supabase status` komutuyla anon key'i görebilirsiniz.

## Sorun Giderme

### Docker Desktop çalışmıyor
- Docker Desktop'ın başlatıldığından emin olun
- Sistem tercihlerinde Docker'ın çalıştığını kontrol edin

### Port çakışması
- Eğer portlar kullanılıyorsa, `config.toml` dosyasındaki portları değiştirebilirsiniz

### Supabase başlamıyor
```bash
# Supabase'i durdur ve yeniden başlat
supabase stop
supabase start
```

