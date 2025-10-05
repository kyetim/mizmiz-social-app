# MIZMIZ - Backend Geliştirme Rehberi

## 🎯 Genel Bakış

Bu rehber, MIZMIZ backend'ini geliştirmek için adım adım kılavuzdur. Backend deneyimi olmayanlar için detaylı açıklamalar içerir.

---

## 📚 Temel Kavramlar

### Backend Nedir?
Backend, uygulamanın sunucu tarafıdır. Veritabanı işlemleri, iş mantığı ve API endpoint'leri burada bulunur.

### API (Application Programming Interface)
Frontend'in backend ile iletişim kurduğu arayüzdür. REST API kullanacağız.

### Database (Veritabanı)
Kullanıcı, gönderi, yorum gibi verilerin saklandığı yerdir. PostgreSQL kullanacağız.

### Authentication (Kimlik Doğrulama)
Kullanıcıların kim olduğunu doğrulama işlemidir. JWT (JSON Web Token) kullanacağız.

---

## 🛠️ Teknoloji Stack

- **Runtime:** Node.js (JavaScript çalıştırma ortamı)
- **Framework:** Express.js (web framework)
- **Language:** TypeScript (type-safe JavaScript)
- **Database:** PostgreSQL (ilişkisel veritabanı)
- **ORM:** Prisma (veritabanı işlemleri için)
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **File Upload:** Multer + Cloudinary

---

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── config/              # Konfigürasyon dosyaları
│   │   ├── database.ts      # Veritabanı bağlantısı
│   │   ├── jwt.ts           # JWT ayarları
│   │   └── cloudinary.ts    # Resim upload ayarları
│   │
│   ├── middleware/          # Express middleware'leri
│   │   ├── auth.middleware.ts          # JWT doğrulama
│   │   ├── error.middleware.ts         # Hata yakalama
│   │   ├── validation.middleware.ts    # Input validation
│   │   └── upload.middleware.ts        # File upload
│   │
│   ├── models/              # Prisma modelleri (schema.prisma'da)
│   │
│   ├── controllers/         # Route handler'ları
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── post.controller.ts
│   │   └── ...
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── post.service.ts
│   │   └── ...
│   │
│   ├── routes/              # API route tanımları
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── post.routes.ts
│   │   └── index.ts         # Tüm route'ları birleştir
│   │
│   ├── utils/               # Yardımcı fonksiyonlar
│   │   ├── hash.ts          # Şifre hashing
│   │   ├── jwt.ts           # JWT oluşturma/doğrulama
│   │   ├── response.ts      # Standart response format
│   │   └── errors.ts        # Custom error classes
│   │
│   ├── interfaces/          # TypeScript interface'leri
│   │   ├── user.interface.ts
│   │   ├── post.interface.ts
│   │   └── request.interface.ts
│   │
│   └── server.ts            # Ana server dosyası
│
├── prisma/
│   └── schema.prisma        # Database schema
│
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Kurulum Adımları

### 1. Node.js Kurulumu
Node.js 18 veya üzeri versiyonunu [nodejs.org](https://nodejs.org/) adresinden indirin.

### 2. PostgreSQL Kurulumu

#### Option A: Yerel Kurulum
[PostgreSQL](https://www.postgresql.org/download/) indirin ve kurun.

#### Option B: Cloud Database (Önerilen - Yeni Başlayanlar İçin)
- [Supabase](https://supabase.com/) (Ücretsiz, kolay)
- [Neon](https://neon.tech/) (Ücretsiz, modern)
- [Railway](https://railway.app/) (Ücretsiz tier)

### 3. Proje Kurulumu

Backend klasörüne gidin ve bağımlılıkları yükleyin:

```bash
cd backend
npm install
```

### 4. Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase/Neon'dan alacaksınız)
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Secret (rastgele karmaşık bir string)
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="24h"

# Cloudinary (resim upload için)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Frontend URL (CORS için)
FRONTEND_URL="http://localhost:3000"
```

### 5. Database Migration

Prisma ile veritabanı tablolarını oluşturun:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Server'ı Çalıştırın

```bash
npm run dev
```

✅ Server `http://localhost:5000` adresinde çalışacak.

---

## 📘 Adım Adım Geliştirme

### Adım 1: Server Kurulumu (server.ts)

```typescript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes'
import { errorMiddleware } from './middleware/error.middleware'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware'ler
app.use(helmet())  // Güvenlik
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(morgan('dev'))  // Logging
app.use(express.json())  // JSON parse
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', routes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MIZMIZ Backend is running!' })
})

// Error handling
app.use(errorMiddleware)

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
```

### Adım 2: Database Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  username      String   @unique
  email         String   @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  bio           String?
  avatarUrl     String?
  coverImageUrl String?
  location      String?
  website       String?
  birthDate     DateTime?
  isVerified    Boolean  @default(false)
  isActive      Boolean  @default(true)
  role          String   @default("user")
  
  followersCount Int @default(0)
  followingCount Int @default(0)
  postsCount     Int @default(0)
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  lastLoginAt DateTime?
  
  // İlişkiler
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  notifications Notification[] @relation("UserNotifications")
  sentNotifications Notification[] @relation("ActorNotifications")
  
  followers     Follow[] @relation("Following")
  following     Follow[] @relation("Follower")
}

model Post {
  id            String   @id @default(uuid())
  userId        String
  content       String
  imageUrl      String?
  likesCount    Int      @default(0)
  commentsCount Int      @default(0)
  sharesCount   Int      @default(0)
  isEdited      Boolean  @default(false)
  isDeleted     Boolean  @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
  
  // İlişkiler
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  comments Comment[]
  likes    Like[]
}

model Comment {
  id         String   @id @default(uuid())
  postId     String
  userId     String
  content    String
  likesCount Int      @default(0)
  isDeleted  Boolean  @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
  
  // İlişkiler
  post  Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes Like[]
}

model Like {
  id         String   @id @default(uuid())
  userId     String
  targetId   String
  targetType String   // 'post' | 'comment'
  
  createdAt DateTime @default(now())
  
  // İlişkiler
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post    Post?    @relation(fields: [targetId], references: [id], onDelete: Cascade)
  comment Comment? @relation(fields: [targetId], references: [id], onDelete: Cascade)
  
  @@unique([userId, targetId, targetType])
}

model Follow {
  id          String   @id @default(uuid())
  followerId  String
  followingId String
  
  createdAt DateTime @default(now())
  
  // İlişkiler
  follower  User @relation("Follower", fields: [followerId], references: [id], onDelete: Cascade)
  following User @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  
  @@unique([followerId, followingId])
}

model Notification {
  id       String  @id @default(uuid())
  userId   String
  actorId  String
  type     String  // 'follow' | 'like' | 'comment'
  targetId String?
  message  String
  isRead   Boolean @default(false)
  
  createdAt DateTime @default(now())
  
  // İlişkiler
  user  User @relation("UserNotifications", fields: [userId], references: [id], onDelete: Cascade)
  actor User @relation("ActorNotifications", fields: [actorId], references: [id], onDelete: Cascade)
}
```

### Adım 3: Auth Service (Örnek)

```typescript
// src/services/auth.service.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'

const prisma = new PrismaClient()

export class AuthService {
  static async register(data: {
    username: string
    email: string
    password: string
  }) {
    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    })
    
    if (existingUser) {
      throw new Error('Email or username already exists')
    }
    
    // Şifreyi hashle
    const passwordHash = await bcrypt.hash(data.password, 10)
    
    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true
      }
    })
    
    // JWT token oluştur
    const token = generateToken({ userId: user.id })
    
    return { user, token }
  }
  
  static async login(email: string, password: string) {
    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    // Şifreyi doğrula
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }
    
    // JWT token oluştur
    const token = generateToken({ userId: user.id })
    
    // Last login güncelle
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })
    
    // Şifreyi response'dan çıkar
    const { passwordHash, ...userWithoutPassword } = user
    
    return { user: userWithoutPassword, token }
  }
}
```

---

## 🔒 Güvenlik

### 1. Şifre Güvenliği
- bcrypt ile hash (10 rounds)
- Şifre kuralları: min 8 karakter, 1 büyük, 1 küçük, 1 rakam

### 2. JWT
- Secret key çok karmaşık olmalı
- Token expiration kullan
- Refresh token mekanizması

### 3. Input Validation
- Tüm user input'ları validate et
- SQL injection koruması (Prisma zaten koruyor)
- XSS koruması

### 4. Rate Limiting
- API isteklerini sınırla
- express-rate-limit kullan

---

## 🧪 Test

```bash
# Unit tests
npm run test

# Test coverage
npm run test:coverage
```

---

## 📚 Kaynak ve Öğrenme

### Önerilen Kaynaklar
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)

### Video Kurslar (Türkçe)
- YouTube: "Node.js Backend Geliştirme"
- YouTube: "Express.js Dersleri"
- YouTube: "PostgreSQL Tutorial"

---

## ❓ Sık Karşılaşılan Hatalar ve Çözümleri

### Hata 1: "Cannot connect to database"
**Çözüm:** DATABASE_URL'i kontrol edin, veritabanı çalışıyor mu?

### Hata 2: "JWT malformed"
**Çözüm:** Token formatı yanlış, JWT_SECRET doğru mu?

### Hata 3: "CORS error"
**Çözüm:** CORS ayarlarını kontrol edin, FRONTEND_URL doğru mu?

---

**Detaylı API Dokümantasyonu için:** Projeyi çalıştırdıktan sonra `/api/docs` adresine bakın (Swagger).

