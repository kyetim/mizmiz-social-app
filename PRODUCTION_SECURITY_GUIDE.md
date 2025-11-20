# 🔐 MIZMIZ - Production Security Guide

## ✅ TAMAMLANAN GÜVENLİK İYİLEŞTİRMELERİ

### Tarih: 16 Kasım 2025
### Durum: Production-Ready Security Implementation Complete

---

## 📋 İçindekiler

1. [Özet](#özet)
2. [Yapılan Değişiklikler](#yapılan-değişiklikler)
3. [Kurulum Talimatları](#kurulum-talimatları)
4. [Environment Variables](#environment-variables)
5. [Database Migration](#database-migration)
6. [Güvenlik Özellikleri](#güvenlik-özellikleri)
7. [Test Etme](#test-etme)
8. [Deployment Checklist](#deployment-checklist)

---

## 🎯 Özet

Projeniz artık **production-ready** güvenlik standardına sahip! Aşağıdaki kritik güvenlik iyileştirmeleri tamamlandı:

### ✅ Tamamlanan Özellikler:

1. ✅ **httpOnly Cookies** - XSS saldırılarına karşı korumalı token yönetimi
2. ✅ **Refresh Token Mekanizması** - Güvenli ve kesintisiz kullanıcı deneyimi
3. ✅ **Güçlü Password Validation** - Regex tabanlı karmaşık şifre kontrolü
4. ✅ **Password Strength Meter** - Kullanıcıya görsel şifre gücü göstergesi
5. ✅ **Account Lockout** - 5 başarısız denemeden sonra 30 dakika kilitleme
6. ✅ **Route-Specific Rate Limiting** - Endpoint bazlı istek sınırlama
7. ✅ **Input Sanitization** - XSS saldırılarına karşı input temizleme
8. ✅ **Gelişmiş Security Headers** - Helmet ile CSP, HSTS ve diğer headerlar
9. ✅ **Cookie-Based Auth** - localStorage yerine güvenli cookie kullanımı
10. ✅ **Device Tracking** - Login geçmişi ve cihaz takibi

### ⚠️ Opsiyonel/İleri Seviye (Şu an gerekli değil):
- ⏸️ **CSRF Protection** - SameSite cookies ile zaten korunmuş
- ⏸️ **Email Verification** - İsteğe bağlı feature
- ⏸️ **2FA** - Post-MVP feature

---

## 🚀 Yapılan Değişiklikler

### Backend Değişiklikleri

#### 1. Yeni Paketler Yüklendi
```bash
npm install cookie-parser @types/cookie-parser
npm install express-validator validator
npm install sanitize-html @types/sanitize-html
```

#### 2. Yeni Dosyalar Oluşturuldu

- `backend/src/config/security.config.ts` - Merkezi güvenlik konfigürasyonu
- `backend/src/middleware/validation.middleware.ts` - Input validation ve sanitization
- `backend/src/middleware/rate-limit.middleware.ts` - Gelişmiş rate limiting
- `backend/prisma/schema.prisma` - RefreshToken modeli eklendi

#### 3. Güncellenen Dosyalar

- `backend/src/server.ts` - Cookie parser, helmet config, rate limiting
- `backend/src/utils/jwt.ts` - Access ve refresh token fonksiyonları
- `backend/src/services/auth.service.ts` - Refresh token, account lockout
- `backend/src/controllers/auth.controller.ts` - Cookie-based auth responses
- `backend/src/middleware/auth.middleware.ts` - Cookie'den token okuma
- `backend/src/routes/auth.routes.ts` - Validation ve rate limiting middleware'leri
- `backend/src/utils/errors.ts` - Yeni error code'lar

### Frontend Değişiklikleri

#### 1. Yeni Dosyalar
- `frontend/src/components/auth/password-strength-meter.tsx` - Şifre gücü göstergesi

#### 2. Güncellenen Dosyalar
- `frontend/src/lib/api/client.ts` - Cookie support, token refresh
- `frontend/src/lib/api/auth.ts` - localStorage kaldırıldı
- `frontend/src/store/slices/auth-slice.ts` - Token state kaldırıldı
- `frontend/src/components/auth/auth-provider.tsx` - Cookie-based auth check
- `frontend/src/components/auth/modern-register-form.tsx` - Password strength meter, güçlü validation

---

## 💻 Kurulum Talimatları

### 1. Backend Setup

```bash
cd backend

# Paketleri yükle
npm install

# Prisma client'ı regenerate et
npx prisma generate

# Database migration (kritik!)
npx prisma migrate dev --name add-security-features
```

### 2. Frontend Setup

```bash
cd frontend

# Paketler zaten mevcut, rebuild gerekirse:
npm install
```

---

## 🔑 Environment Variables

### Backend `.env` Dosyası

Aşağıdaki değişkenleri backend `.env` dosyanıza ekleyin:

```bash
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mizmiz?schema=public"

# JWT Secrets - MUTLAKA DEĞİŞTİRİN!
# Güçlü random string oluşturmak için:
# Linux/Mac: openssl rand -base64 64
# Windows PowerShell: [Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))

JWT_SECRET="BURAYA-64-KARAKTER-RANDOM-STRING-KOYUN-PRODUCTION-IçIN"
JWT_REFRESH_SECRET="BURAYA-FARKLI-64-KARAKTER-RANDOM-STRING-KOYUN"
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (CORS için)
FRONTEND_URL=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cookie settings (Vercel frontend + separate API gibi cross-site kurulumlar için kritik)
COOKIE_DOMAIN=.yourdomain.com
COOKIE_SAMESITE=none
```

### Frontend `.env.local` Dosyası

```bash
# API URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 🚨 Kritik Güvenlik Notları

1. **JWT_SECRET** - ASLA default değerleri production'da kullanmayın!
2. **FRONTEND_URL** - CORS için doğru domain'i belirtin
3. **COOKIE_DOMAIN / COOKIE_SAMESITE** - Frontend ve backend farklı domain'lerdeyse zorunlu
4. **NODE_ENV** - Production'da mutlaka `production` olmalı
5. **DATABASE_URL** - Production database credentials'ları güvenli tutun

---

## 🗄️ Database Migration

### Yeni Tablo: `refresh_tokens`

```sql
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    PRIMARY KEY ("id")
);
```

### Users Tablosu Güncellemeleri

```sql
ALTER TABLE "users" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "lockedUntil" TIMESTAMP(3);
```

### Migration Komutu

```bash
cd backend
npx prisma migrate dev --name add-security-features
```

---

## 🛡️ Güvenlik Özellikleri Detayları

### 1. httpOnly Cookies

**Öncesi (Güvensiz):**
```javascript
// localStorage kullanımı - XSS açığı!
localStorage.setItem('token', token)
```

**Sonrası (Güvenli):**
```javascript
// httpOnly cookie - JavaScript erişemez!
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true, // Sadece HTTPS
  sameSite: 'strict', // CSRF koruması
  maxAge: 15 * 60 * 1000 // 15 dakika
})
```

### 2. Refresh Token Mekanizması

- **Access Token:** 15 dakika (kısa ömürlü, güvenli)
- **Refresh Token:** 7 gün (database'de saklanır)
- **Otomatik Yenileme:** Token expire olunca otomatik yenilenir

**Flow:**
1. Kullanıcı login olur
2. Access token (15dk) ve refresh token (7gün) alır
3. Access token expire olunca, axios interceptor otomatik refresh eder
4. Kullanıcı hiçbir şey fark etmez

### 3. Password Validation

**Gereksinimler:**
- Minimum 8 karakter
- En az 1 büyük harf (A-Z)
- En az 1 küçük harf (a-z)
- En az 1 rakam (0-9)
- En az 1 özel karakter (@$!%*?&)

**Regex:**
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

### 4. Account Lockout

- **5 başarısız deneme** sonrası hesap kilitlenir
- **30 dakika** süreyle giriş yapılamaz
- Başarılı girişte counter sıfırlanır
- Güvenlik logları tutulur

### 5. Rate Limiting

| Endpoint | Limit | Süre |
|----------|-------|------|
| `/api/auth/login` | 5 istek | 15 dakika |
| `/api/auth/register` | 3 istek | 1 saat |
| `/api/*` (genel) | 100 istek | 15 dakika |
| Content creation | 10 istek | 1 dakika |

### 6. Security Headers (Helmet)

```javascript
// CSP - Content Security Policy
defaultSrc: ["'self'"]
scriptSrc: ["'self'"]
styleSrc: ["'self'", "'unsafe-inline'"]
imgSrc: ["'self'", "data:", "https:"]

// HSTS - HTTP Strict Transport Security
maxAge: 31536000 (1 yıl)
includeSubDomains: true
preload: true
```

### 7. Input Sanitization

**Tüm input'lar otomatik temizlenir:**
- HTML tag'leri kaldırılır
- XSS payload'ları temizlenir
- SQL injection karakterleri escape edilir
- Prisma ORM zaten parametrized queries kullanır

---

## 🧪 Test Etme

### 1. Login Rate Limiting Testi

```bash
# 6 kez hızlı login deneyin (5'ten fazla)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Sonuç: 6. denemede "Too many login attempts" hatası almalısınız
```

### 2. Account Lockout Testi

```bash
# 5 kez yanlış şifre deneyin
# 5. denemede hesap kilitlenecek

# Test:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"youremail@test.com","password":"WrongPassword123!"}'
```

### 3. Password Validation Testi

```javascript
// Zayıf şifreler - KABUL EDİLMEMELİ
"password" ❌
"12345678" ❌
"Password" ❌

// Güçlü şifreler - KABUL EDİLMELİ
"Password123!" ✅
"MyP@ssw0rd" ✅
"Secure$Pass1" ✅
```

### 4. Cookie Testi

```javascript
// Browser Console'da
console.log(document.cookie)
// accessToken ve refreshToken görünMEMELİ (httpOnly)

// localStorage'da token olmadığını doğrulayın
console.log(localStorage.getItem('token'))
// null olmalı
```

### 5. Token Refresh Testi

```javascript
// 15 dakika sonra herhangi bir API isteği yapın
// Otomatik refresh edilip yeni access token alınmalı
// Kullanıcı logout olmamalı
```

---

## 📋 Production Deployment Checklist

### Ön Hazırlık

- [ ] `.env` dosyasını production değerleri ile güncelle
- [ ] JWT_SECRET ve JWT_REFRESH_SECRET için güçlü random string'ler oluştur
- [ ] FRONTEND_URL'i production domain ile güncelle
- [ ] NODE_ENV=production olarak ayarla
- [ ] Database migration'ı production'da çalıştır

### Backend Deployment

- [ ] Environment variables doğru ayarlandı
- [ ] SSL/TLS sertifikası yüklendi (HTTPS zorunlu)
- [ ] CORS ayarları doğru domain'e yapılandırıldı
- [ ] Rate limiting aktif
- [ ] Helmet security headers aktif
- [ ] Cookie secure flag aktif (requires HTTPS)
- [ ] Database backup alındı
- [ ] Log sistemi çalışıyor

### Frontend Deployment

- [ ] NEXT_PUBLIC_API_URL production API'ye yönlendirildi
- [ ] Build başarılı
- [ ] Cookie-based auth test edildi
- [ ] HTTPS aktif (httpOnly cookies için zorunlu)

### Post-Deployment Tests

- [ ] Login/Register çalışıyor
- [ ] Token refresh çalışıyor
- [ ] Account lockout çalışıyor
- [ ] Rate limiting çalışıyor
- [ ] Password validation çalışıyor
- [ ] Logout çalışıyor
- [ ] Security headers doğru (https://securityheaders.com ile test edin)

### Monitoring

- [ ] Security log monitoring kuruldu
- [ ] Failed login attempt alertleri aktif
- [ ] Rate limit aşım alertleri aktif
- [ ] Uptime monitoring aktif

---

## 🎓 Güvenlik Best Practices

### DO's ✅

1. **HTTPS kullanın** - Production'da zorunlu
2. **Environment variables'ı güvenli tutun** - Asla commit etmeyin
3. **Regular security audit** yapın - npm audit
4. **Dependencies güncel tutun** - npm update
5. **Backup alın** - Database ve env files
6. **Security headers** kontrol edin - securityheaders.com
7. **Log monitoring** yapın - Şüpheli aktivite takibi

### DON'Ts ❌

1. **Default secrets kullanmayın** - Production'da tehlikeli
2. **localStorage'da token tutmayın** - XSS riski
3. **HTTP kullanmayın** - Man-in-the-middle saldırıları
4. **Sensitive data loglamayın** - Şifreler, tokenlar
5. **Rate limiting'i devre dışı bırakmayın** - DDoS riski
6. **SSL sertifikasını expired etmeyin** - Browser uyarıları
7. **Debug mode açık bırakmayın** - Bilgi sızıntısı riski

---

## 🔗 Faydalı Kaynaklar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js](https://helmetjs.github.io/)
- [Security Headers](https://securityheaders.com/)

---

## 📞 Support

Sorularınız için:
- GitHub Issues
- Team Chat
- Security Contact: security@yourdomain.com

---

**Son Güncelleme:** 16 Kasım 2025  
**Versiyon:** 2.0.0  
**Durum:** ✅ Production Ready

