# MIZMIZ - Modern Sosyal Medya Platformu

![MIZMIZ Logo](https://img.shields.io/badge/MIZMIZ-Social%20Platform-1DA1F2?style=for-the-badge)
![Version](https://img.shields.io/badge/version-0.1.0--MVP-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## 🎯 Proje Hakkında

MIZMIZ, kullanıcıların içerik paylaşabileceği, etkileşime girebileceği ve topluluk oluşturabileceği modern bir sosyal medya platformudur. Genç yazılımcılar, öğrenciler ve içerik üreticileri için tasarlanmıştır.

## ✨ Özellikler

### Kullanıcı Özellikleri
- 🔐 Güvenli kayıt ve giriş sistemi (JWT Authentication)
- 👤 Profil oluşturma ve düzenleme
- 📝 Gönderi paylaşma (metin + resim)
- ❤️ Beğenme ve yorum yapma
- 👥 Takip etme / takipçi sistemi
- 🔔 Bildirim sistemi
- 🔍 Arama ve keşfet bölümü

### Yönetici Özellikleri
- 👨‍💼 Kullanıcı yönetimi
- 🛡️ İçerik moderasyonu

## 🛠️ Teknoloji Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Dil:** TypeScript
- **UI Kütüphaneleri:** Shadcn UI, Radix UI
- **Stil:** Tailwind CSS
- **Animasyon:** Framer Motion
- **3D:** Three.js + React Three Fiber
- **State Yönetimi:** Redux Toolkit
- **URL State:** nuqs

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Dil:** TypeScript
- **Kimlik Doğrulama:** JWT
- **Veritabanı:** PostgreSQL (önerilen) / MongoDB
- **ORM/ODM:** Prisma (PostgreSQL için) / Mongoose (MongoDB için)

## 📁 Proje Yapısı

```
mizmiz-social-app/
├── backend/              # Backend API
│   ├── src/
│   │   ├── controllers/  # Route controller'ları
│   │   ├── middleware/   # Express middleware'leri
│   │   ├── models/       # Database modelleri
│   │   ├── routes/       # API route'ları
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Yardımcı fonksiyonlar
│   │   ├── config/       # Konfigürasyon dosyaları
│   │   └── server.ts     # Ana server dosyası
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/             # Next.js Frontend
    ├── src/
    │   ├── app/          # Next.js App Router sayfaları
    │   ├── components/   # React bileşenleri
    │   ├── lib/          # Yardımcı kütüphaneler
    │   ├── store/        # Redux store
    │   ├── hooks/        # Custom React hooks
    │   ├── interfaces/   # TypeScript interface'leri
    │   └── styles/       # Global stiller
    ├── public/           # Statik dosyalar
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.ts
    └── tsconfig.json
```

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn
- PostgreSQL 14+ (veya MongoDB 6+)

### Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd mizmiz-social-app
```

2. **Backend Kurulumu:**
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

3. **Frontend Kurulumu:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local dosyasını düzenleyin
npm run dev
```

4. **Tarayıcınızda açın:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Dokümantasyon

Detaylı dokümantasyon için aşağıdaki dosyalara göz atın:

- [CODE_STYLE.md](./CODE_STYLE.md) - Kodlama standartları ve stil rehberi
- [ROADMAP.md](./ROADMAP.md) - Proje yol haritası ve sprint planlaması
- [FEATURES.md](./FEATURES.md) - Detaylı özellik listesi
- [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) - Backend geliştirme rehberi
- [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) - Frontend geliştirme rehberi
- [PRD.md](./PRD.md) - Ürün gereksinim belgesi

## 🎨 Marka Kimliği

### Renk Paleti
- **Primary:** #1DA1F2 (Mavi - Güven ve iletişim)
- **Secondary:** #14171A (Koyu gri - Okunabilirlik)
- **Accent:** #FFAD1F (Canlı vurgu rengi)

### Tipografi
- **Başlıklar:** Poppins, Bold
- **Gövde Metni:** Roboto, Regular

### Ses Tonu
Samimi, topluluk odaklı ve kullanıcı dostu

## 📊 Başarı Kriterleri (MVP)

- ✅ Kullanıcıların %80'i kayıt olduktan sonra en az 1 gönderi paylaşmalı
- ✅ Sayfa yüklenme süresi < 2 saniye
- ✅ %100 mobil uyumluluk
- ✅ Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

Proje Link: [https://github.com/yourusername/mizmiz-social-app](https://github.com/yourusername/mizmiz-social-app)

---

**MIZMIZ** ile topluluk deneyimini yeniden keşfedin! 🚀

