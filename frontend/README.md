# MIZMIZ Frontend

Modern sosyal medya platformu frontend uygulaması.

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Environment Variables
`.env.example` dosyasını `.env.local` olarak kopyalayın.

```bash
cp .env.example .env.local
```

### 3. Development Server
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacak.

## 📚 Dokümantasyon

Detaylı frontend geliştirme rehberi için ana dizindeki `FRONTEND_GUIDE.md` dosyasına bakın.

## 🛠️ Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npm run lint` - Lint kontrolü
- `npm run lint:fix` - Lint düzeltme

## 📁 Klasör Yapısı

```
frontend/src/
├── app/            # Next.js App Router
├── components/     # React bileşenleri
├── lib/           # Yardımcı kütüphaneler
├── store/         # Redux store
├── hooks/         # Custom hooks
├── interfaces/    # TypeScript interfaces
└── styles/        # Global stiller
```

## 🎨 Teknoloji Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- Redux Toolkit
- Three.js

## 📝 Kodlama Standartları

Proje kodlama standartları için `CODE_STYLE.md` dosyasına bakın.

## 📄 License

MIT
