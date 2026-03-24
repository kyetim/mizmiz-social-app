<div align="center">

# 💬 MIZMIZ Social App

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)

**Modern, full-stack bir sosyal medya platformu.**  
Next.js 14 · Express · PostgreSQL · Prisma · Socket.IO

</div>

---

## 📌 Proje Hakkında

Mızmız, kullanıcıların gönderi paylaşabildiği, yorum yapabildiği, gerçek zamanlı mesajlaşabildiği ve birbirini takip edebildiği tam kapsamlı bir sosyal medya platformudur. Frontend ve backend tamamen TypeScript ile yazılmıştır.

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🔐 Kimlik Doğrulama | JWT tabanlı güvenli kayıt/giriş |
| 📝 Gönderi & Feed | Gönderi oluşturma, beğenme, yorum yapma |
| 💬 Anlık Mesajlaşma | WebSocket tabanlı gerçek zamanlı sohbet |
| 👤 Kullanıcı Profili | Avatar ve bilgi güncellenebilir profil sayfaları |
| 🔍 Arama | Kullanıcı ve gönderi arama |
| 🔔 Bildirimler | Gerçek zamanlı bildirim sistemi |
| 🏷️ Kategoriler | Gönderileri kategoriye göre düzenleme |
| 🖼️ Medya Yükleme | Resim ve dosya paylaşımı (Multer) |

## 🛠️ Teknoloji Yığını

### Frontend
| Teknoloji | Kullanım |
|-----------|----------|
| Next.js 14 (App Router) | Frontend framework |
| TypeScript | Tip güvenliği |
| Tailwind CSS | Stil |
| Redux Toolkit + RTK Query | State yönetimi |
| Socket.IO Client | Gerçek zamanlı iletişim |

### Backend
| Teknoloji | Kullanım |
|-----------|----------|
| Express + TypeScript | API sunucusu |
| PostgreSQL | Veritabanı |
| Prisma ORM | Veritabanı erişim katmanı |
| JWT + bcrypt | Kimlik doğrulama ve şifreleme |
| Socket.IO | WebSocket sunucusu |
| Multer | Dosya yükleme |

## 📁 Proje Yapısı

```
mizmiz-social-app/
├── frontend/          # Next.js 14 uygulaması
│   ├── app/           # App Router sayfaları
│   ├── components/    # Yeniden kullanılabilir bileşenler
│   └── store/         # Redux state yönetimi
├── backend/           # Express API sunucusu
│   ├── src/
│   │   ├── routes/    # API rotaları
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── prisma/    # Şema ve migration
└── README.md
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- npm veya yarn

### Adımlar

**1. Repoyu klonla**
```bash
git clone https://github.com/kyetim/mizmiz-social-app.git
cd mizmiz-social-app
```

**2. Backend kurulumu**
```bash
cd backend
npm install
cp .env.example .env   # .env dosyasını yapılandır
npx prisma generate
npx prisma db push
npm run dev
```

**3. Frontend kurulumu**
```bash
cd frontend
npm install
cp .env.example .env.local   # .env.local dosyasını yapılandır
npm run dev
```

**4. Uygulamaya eriş**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 Ortam Değişkenleri

**Backend (`.env`)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mizmiz
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
```

**Frontend (`.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama (access + refresh token)
- bcrypt ile şifre hashleme
- CORS yapılandırması
- Rate limiting
- Input validasyonu
- XSS koruması

## 🌐 Deploy

**Frontend → Vercel**
1. Repoyu Vercel'e bağla
2. Root Directory: `frontend` olarak ayarla
3. Ortam değişkenlerini ekle
4. Deploy otomatik gerçekleşir

**Backend → Railway / Render**
1. Backend klasörünü tercih ettiğin platforma deploy et
2. PostgreSQL veritabanını bağla
3. Ortam değişkenlerini ayarla

---

<div align="center">
  <strong>Kadir Yetim</strong> tarafından yapıldı · <a href="https://github.com/kyetim">@kyetim</a> · <a href="https://www.linkedin.com/in/kadir-yetim-3069b21b2/">LinkedIn</a>
</div>
