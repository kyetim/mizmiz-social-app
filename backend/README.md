# MIZMIZ Backend API

Modern sosyal medya platformu backend servisi.

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Environment Variables
`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli bilgileri doldurun.

```bash
cp .env.example .env
```

### 3. Veritabanı Kurulumu
```bash
# Prisma client oluştur
npm run prisma:generate

# Veritabanı migration
npm run prisma:migrate

# (Opsiyonel) Prisma Studio ile veritabanını görüntüle
npm run prisma:studio
```

### 4. Development Server
```bash
npm run dev
```

Server `http://localhost:5000` adresinde çalışacak.

## 📚 Dokümantasyon

Detaylı backend geliştirme rehberi için ana dizindeki `BACKEND_GUIDE.md` dosyasına bakın.

## 🛠️ Scripts

- `npm run dev` - Development server (hot reload)
- `npm run build` - Production build
- `npm start` - Production server
- `npm run prisma:generate` - Prisma client oluştur
- `npm run prisma:migrate` - Database migration
- `npm run prisma:studio` - Prisma Studio aç
- `npm test` - Testleri çalıştır
- `npm run lint` - Lint kontrolü
- `npm run format` - Code formatting

## 📁 Klasör Yapısı

```
backend/src/
├── config/         # Konfigürasyon
├── controllers/    # Route handler'ları
├── middleware/     # Express middleware
├── models/         # Database modelleri (Prisma)
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Yardımcı fonksiyonlar
├── interfaces/     # TypeScript interfaces
└── server.ts       # Ana server dosyası
```

## 🔒 Güvenlik

- JWT Authentication
- bcrypt password hashing
- Rate limiting
- CORS protection
- Input validation
- SQL injection protection (Prisma)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt ol
- `POST /api/auth/login` - Giriş yap
- `POST /api/auth/logout` - Çıkış yap
- `GET /api/auth/me` - Mevcut kullanıcı

### Users
- `GET /api/users/:id` - Kullanıcı detayı
- `PUT /api/users/:id` - Kullanıcı güncelle
- `GET /api/users/search` - Kullanıcı ara

### Posts
- `GET /api/posts` - Feed
- `GET /api/posts/:id` - Gönderi detayı
- `POST /api/posts` - Yeni gönderi
- `PUT /api/posts/:id` - Gönderi güncelle
- `DELETE /api/posts/:id` - Gönderi sil
- `POST /api/posts/:id/like` - Beğen

### Comments
- `GET /api/posts/:id/comments` - Yorumlar
- `POST /api/posts/:id/comments` - Yorum yap
- `DELETE /api/comments/:id` - Yorum sil

## 📊 Database Schema

Prisma schema için `prisma/schema.prisma` dosyasına bakın.

## 🧪 Testing

```bash
npm test
```

## 📄 License

MIT

