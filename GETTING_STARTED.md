# MIZMIZ - Başlangıç Rehberi

## 🎯 İlk Adımlar

Projeyi sıfırdan başlatmak için bu adımları takip edin.

---

## 📋 Ön Gereksinimler

1. **Node.js 18+** yüklü olmalı ([nodejs.org](https://nodejs.org/))
2. **PostgreSQL** veritabanı (yerel veya cloud)
   - **Önerilen Cloud Seçenekler (Ücretsiz):**
     - [Supabase](https://supabase.com/) - En kolay
     - [Neon](https://neon.tech/) - Modern, hızlı
     - [Railway](https://railway.app/) - Basit setup
3. **Git** yüklü olmalı
4. **Bir kod editörü** (VSCode önerilen)

---

## 🚀 Kurulum

### 1. Veritabanı Kurulumu

#### Option A: Supabase (Önerilen - Yeni Başlayanlar İçin)

1. [Supabase](https://supabase.com/) adresine gidin ve ücretsiz hesap oluşturun
2. "New Project" butonuna tıklayın
3. Proje adı girin (örn: mizmiz-db)
4. Database şifresi belirleyin (güçlü bir şifre seçin)
5. Region seçin (Europe West (Ireland) Türkiye'ye yakın)
6. "Create new project" butonuna tıklayın
7. Sol menüden "Settings" → "Database" sekmesine gidin
8. "Connection string" bölümünde "URI" formatını kopyalayın
   - Örnek: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### 2. Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
# Windows PowerShell:
Copy-Item .env.example .env
# veya manuel olarak .env.example'ı kopyalayıp .env olarak kaydedin

# .env dosyasını bir metin editörü ile açın ve doldurun:
```

**.env dosyası içeriği:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase'den aldığınız connection string)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# JWT Secret (rastgele karmaşık bir string oluşturun)
# https://www.grc.com/passwords.htm adresinden güvenli bir şifre alabilirsiniz
JWT_SECRET="rastgele-cok-guvenlı-bır-anahtar-12345-ABC"
JWT_EXPIRES_IN="24h"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

**Prisma ve database'i başlatın:**
```bash
# Prisma client oluştur
npm run prisma:generate

# Database tablolarını oluştur
npm run prisma:migrate

# Backend'i başlat
npm run dev
```

✅ Backend başarıyla çalışıyorsa `http://localhost:5000/health` adresinde "MIZMIZ Backend is running!" mesajını görmelisiniz.

### 3. Frontend Kurulumu

Yeni bir terminal penceresi açın:

```bash
# Ana dizine dönün
cd ..

# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin (zaten yüklü olabilir)
npm install

# Frontend'i başlat
npm run dev
```

✅ Frontend başarıyla çalışıyorsa `http://localhost:3000` adresinde MIZMIZ landing page'i görmelisiniz!

---

## 🎨 İlk Kullanım

### 1. Backend Test Et

Postman, Insomnia veya Thunder Client kullanarak API'yi test edebilirsiniz:

**Kayıt Olma:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test1234",
  "firstName": "Test",
  "lastName": "User"
}
```

**Giriş Yapma:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test1234"
}
```

Response'dan aldığınız `token`'ı kopyalayın.

**Kullanıcı Bilgisi Alma:**
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 2. Frontend'de Gezin

1. `http://localhost:3000` adresine gidin
2. Landing page'i görün
3. (Yakında) "Hemen Başla" ve "Giriş Yap" butonları çalışacak

---

## 🔍 Veritabanını Görüntüleme

### Prisma Studio ile

```bash
cd backend
npm run prisma:studio
```

Bu komut `http://localhost:5555` adresinde Prisma Studio'yu açar. Buradan veritabanınızdaki tabloları görüntüleyebilir ve düzenleyebilirsiniz.

### Supabase Dashboard ile

1. [Supabase Dashboard](https://app.supabase.com/) adresine gidin
2. Projenizi seçin
3. Sol menüden "Table Editor" sekmesine tıklayın
4. Tablolarınızı görün ve düzenleyin

---

## 🐛 Sorun Giderme

### Backend çalışmıyor

**Hata: "Cannot connect to database"**
- ✅ `.env` dosyasındaki `DATABASE_URL`'i kontrol edin
- ✅ Veritabanı servisiniz çalışıyor mu? (Supabase dashboard'da "Paused" durumunda olabilir)
- ✅ Şifrenizde özel karakterler varsa URL encode edin (örn: `@` → `%40`)

**Hata: "Port 5000 already in use"**
```bash
# Windows'ta portu kullanan programı kapatın veya .env'de PORT değerini değiştirin
PORT=5001
```

**Hata: "Prisma schema not found"**
```bash
# Prisma'yı yeniden oluşturun
npm run prisma:generate
```

### Frontend çalışmıyor

**Hata: "Module not found"**
```bash
# node_modules'ı temizleyip yeniden yükleyin
rm -rf node_modules
npm install
```

**Hata: "Port 3000 already in use"**
```bash
# Next.js'i farklı bir portta başlatın
npm run dev -- -p 3001
```

---

## 📚 Sonraki Adımlar

### Sprint 2: Auth Sayfaları (Tahmini: 1 Hafta)

1. **Login Page** (`frontend/src/app/(auth)/login/page.tsx`)
2. **Register Page** (`frontend/src/app/(auth)/register/page.tsx`)
3. **Protected Route HOC**

### Sprint 3: Profil Sayfası (Tahmini: 1 Hafta)

1. **Backend:** User endpoints oluştur
2. **Frontend:** Profile page ve edit profile

### Sprint 4: Gönderi Sistemi (Tahmini: 1.5 Hafta)

1. **Backend:** Post endpoints
2. **Frontend:** Create post, post feed, post card

---

## 📖 Daha Fazla Bilgi

- **Backend Rehberi:** [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)
- **Frontend Rehberi:** [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)
- **Kodlama Standartları:** [CODE_STYLE.md](./CODE_STYLE.md)
- **Yol Haritası:** [ROADMAP.md](./ROADMAP.md)
- **Özellikler:** [FEATURES.md](./FEATURES.md)

---

## 💡 İpuçları

1. **Backend ve Frontend'i aynı anda çalıştırın** (iki terminal penceresi)
2. **Değişiklikleri test edin:** Her değişiklikten sonra hem backend hem frontend'i test edin
3. **Git kullanın:** Her önemli değişiklikten sonra commit yapın
4. **Dokümantasyonu okuyun:** Takıldığınız yerde rehber dosyalarına bakın
5. **Console'u kontrol edin:** Hata mesajları için browser console ve terminal'i takip edin

---

## 🆘 Yardım

Bir sorunla karşılaştıysanız:

1. **Error mesajını okuyun:** Genelde sorunu açıklar
2. **Konsolu kontrol edin:** Browser ve terminal konsolu
3. **Dokümantasyonu inceleyin:** İlgili `.md` dosyalarına bakın
4. **Google/Stack Overflow:** Hata mesajını aratın
5. **GitHub Issues:** Proje repository'sinde issue açın

---

**Başarılar! MIZMIZ'i birlikte inşa edelim! 🚀**

