# Backend Setup Guide

## 1. Environment Variables Kurulumu

### `.env` Dosyası Oluşturma

`.env.example` dosyasını kopyalayıp `.env` olarak kaydedin:

```bash
cp .env.example .env
```

### Güvenli JWT_SECRET Oluşturma

Aşağıdaki komutlardan birini kullanarak güvenli bir JWT secret oluşturun:

**Node.js ile:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**PowerShell ile:**
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Online Tool:**
- https://randomkeygen.com/ (CodeIgniter Encryption Keys bölümünü kullanın)

Oluşturduğunuz secret'ı `.env` dosyasındaki `JWT_SECRET` değerine yapıştırın.

### Database URL Ayarlama

**Supabase Kullanıyorsanız:**
1. Supabase Dashboard'a gidin
2. Project Settings > Database
3. Connection String > URI kopyalayın
4. `.env` dosyasındaki `DATABASE_URL` değerine yapıştırın

**Lokal PostgreSQL Kullanıyorsanız:**
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mizmiz"
```

## 2. Bağımlılıkları Yükleme

```bash
npm install
```

## 3. Prisma Setup

### Prisma Client Oluşturma
```bash
npm run prisma:generate
```

### Database Migration
```bash
npm run prisma:migrate
```

Bu komut:
- Veritabanında tabloları oluşturur
- Migration dosyalarını kaydeder

### Prisma Studio (Opsiyonel - Database GUI)
```bash
npm run prisma:studio
```

## 4. Backend'i Çalıştırma

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 5. Test Etme

### Health Check
Backend çalıştıktan sonra:
```
http://localhost:5000/health
```

### Test Kullanıcı Oluşturma (Postman/Thunder Client)

**POST** `http://localhost:5000/api/auth/register`

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123456",
  "firstName": "Test",
  "lastName": "User"
}
```

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "test@example.com",
  "password": "test123456"
}
```

## 6. Yaygın Sorunlar ve Çözümleri

### "Can't reach database server" hatası
- PostgreSQL çalışıyor mu kontrol edin
- DATABASE_URL doğru mu kontrol edin
- Supabase kullanıyorsanız, project sleep mode'dan çıkmış mı kontrol edin

### "Port already in use" hatası
```bash
# Windows'da port'u kullanan process'i bul
netstat -ano | findstr :5000

# Process'i öldür (PID kullanarak)
taskkill /PID <PID> /F
```

### Prisma hatası
```bash
# Prisma client'ı yeniden oluştur
npm run prisma:generate

# Migration sıfırla (DEV ONLY!)
npx prisma migrate reset
```

## 7. Güvenlik Notları

⚠️ **ÖNEMLİ:**
- `.env` dosyasını asla git'e commit etmeyin
- JWT_SECRET'ı production'da mutlaka değiştirin (minimum 64 karakter)
- Production'da NODE_ENV=production ayarlayın
- Database şifresini güçlü tutun
- CORS ayarlarını production'da daraltın

## 8. Faydalı Komutlar

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Prisma Studio
npm run prisma:studio

# Database schema sync (dikkatli kullanın!)
npx prisma db push
```

## 9. Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
DATABASE_URL="your_production_database_url"
JWT_SECRET="your_production_jwt_secret_minimum_64_chars"
FRONTEND_URL="https://yourdomain.com"
```

### Railway / Render / DigitalOcean
1. GitHub'a push yapın
2. Platform'da yeni service oluşturun
3. Environment variables'ları ekleyin
4. Deploy edin

Daha fazla bilgi için `README.md` dosyasına bakın.

