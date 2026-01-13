# AGENTS.md

## Amaç

Bu projede çoklu ajan yaklaşımı kullanılmaktadır.
Tüm süreç Orchestrator Agent üzerinden yönetilir.

## Giriş Noktası

- Orchestrator Agent

## Kullanılabilir Ajanlar

- Orchestrator Agent
- Feature Builder Agent
- Refactor Guardian
- Bug Fixer Agent
- Security Auditor Agent
- Dependency Advisor Agent
- Decision Maker Agent
- Clean Code Inspector
- Design Consistency Agent
- Performance Hunter Agent
- Test Strategy Agent
- Release Gatekeeper Agent
- UX Logic Reviewer Agent

## Global Kurallar

- Minimal diff tercih edilir
- Tahmine dayalı değişiklik yapılmaz
- Mevcut mimariye sadık kalınır
- Emin olunmayan konularda soru sorulur

## Performans Kuralları

Render sürecini, veri çekme yöntemlerini, görselleri, fontları
veya üçüncü parti scriptleri etkileyebilecek HER DEĞİŞİKLİK
Performance Hunter Agent tarafından MUTLAKA incelenmelidir.

## Orchestrator Akışı (Zorunlu)

Bir istek alındığında Orchestrator Agent ŞUNLARI YAPMAK ZORUNDADIR:

1. `/agents` klasörü altındaki tüm ajan tanımlarını okur
2. İlgili görev için hangi ajanların gerekli olduğuna karar verir
3. Seçilen ajanları **paralel değil, sıralı (ardışık)** şekilde simüle eder
4. Her ajanın bulgularını ve çıktısını toplar
5. Tüm sonuçları tek bir rapor haline getirerek Decision Maker Agent’a sunar
6. **Go (onay) kararı verilmeden hiçbir aksiyon almaz**

Hiçbir ajan bu akışı atlayamaz veya bu akışın dışına çıkamaz.
