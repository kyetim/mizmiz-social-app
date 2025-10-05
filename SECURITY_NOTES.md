# 🔐 MIZMIZ - Güvenlik Notları ve İyileştirmeler

## ⚠️ Production Öncesi Yapılması Gerekenler

### 1. Token Storage - Kritik Güvenlik İyileştirmesi

#### Şu Anki Durum (Development)
- **Token Storage:** localStorage
- **Transport:** Authorization header (Bearer token)
- **Durum:** ✅ Development için uygun, ⚠️ Production için riskli

#### Sorun: XSS (Cross-Site Scripting) Zafiyeti
```javascript
// Saldırgan XSS ile bu kodu çalıştırabilir:
const token = localStorage.getItem('token')
sendToAttacker(token) // Token çalındı! 😱
```

#### Çözüm: httpOnly Cookie'ye Geçiş (Production Öncesi)

**Backend Değişiklikleri:**

1. **Login/Register Controller** (`backend/src/controllers/auth.controller.ts`)
```typescript
// Token'ı response body'de değil, cookie'de gönder
res.cookie('token', token, {
  httpOnly: true,        // JavaScript erişemez
  secure: true,          // Sadece HTTPS
  sameSite: 'strict',    // CSRF koruması
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 gün
})

// Response'da token göndermiyoruz artık
res.status(200).json({
  success: true,
  data: { user }  // Token yok!
})
```

2. **Auth Middleware** (`backend/src/middleware/auth.middleware.ts`)
```typescript
// Authorization header yerine cookie'den oku
const token = req.cookies.token

if (!token) {
  return res.status(401).json({ message: 'Unauthorized' })
}
```

3. **Cookie Parser Middleware**
```bash
npm install cookie-parser @types/cookie-parser
```

```typescript
// server.ts
import cookieParser from 'cookie-parser'
app.use(cookieParser())
```

**Frontend Değişiklikleri:**

1. **API Client** (`frontend/src/lib/api/client.ts`)
```typescript
// Axios config
axios.create({
  withCredentials: true,  // Cookie'leri gönder
  // Authorization header kaldırılır
})
```

2. **Auth Service** (`frontend/src/lib/api/auth.ts`)
```typescript
// localStorage.setItem('token') çağrılarını kaldır
// Cookie otomatik yönetilir
```

3. **Middleware** (`frontend/src/middleware.ts`)
```typescript
// Token cookie'den okunabilir artık
const token = request.cookies.get('token')?.value
```

#### Implementasyon Zamanlaması
- **Ne Zaman:** Sprint 9 (Performans ve Optimizasyon) veya Post-MVP
- **Süre:** ~2-3 saat
- **Öncelik:** Yüksek (Production öncesi mutlaka)

---

### 2. CSRF (Cross-Site Request Forgery) Koruması

httpOnly cookie kullanırken CSRF'e karşı korunma gerekir.

**Çözüm: CSRF Token**

```bash
npm install csurf
```

```typescript
// Backend - server.ts
import csrf from 'csurf'

const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
})

app.use(csrfProtection)

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})
```

```typescript
// Frontend - Her request'te CSRF token ekle
axios.interceptors.request.use(async (config) => {
  const { data } = await axios.get('/api/csrf-token')
  config.headers['X-CSRF-Token'] = data.csrfToken
  return config
})
```

---

### 3. Refresh Token Mekanizması

**Problem:** 
- Access token expire olunca kullanıcı logout olur
- Güvenlik için access token kısa ömürlü olmalı (15 dakika)

**Çözüm:** Refresh Token Pattern

```typescript
// Access token: 15 dakika (JWT)
// Refresh token: 7 gün (Database'de)

// Login sırasında
const accessToken = generateToken({ userId }, '15m')
const refreshToken = generateRefreshToken({ userId }, '7d')

// Database'e kaydet
await prisma.refreshToken.create({
  data: {
    token: refreshToken,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
})

// Cookie'lerde gönder
res.cookie('accessToken', accessToken, { maxAge: 15 * 60 * 1000 })
res.cookie('refreshToken', refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000 })
```

**Refresh Endpoint:**
```typescript
// POST /api/auth/refresh
const { refreshToken } = req.cookies

// Validate refresh token
const tokenRecord = await prisma.refreshToken.findFirst({
  where: { token: refreshToken, expiresAt: { gt: new Date() } }
})

if (!tokenRecord) {
  return res.status(401).json({ message: 'Invalid refresh token' })
}

// Generate new access token
const newAccessToken = generateToken({ userId: tokenRecord.userId }, '15m')
res.cookie('accessToken', newAccessToken, { maxAge: 15 * 60 * 1000 })
```

---

### 4. Rate Limiting İyileştirmeleri

**Şu anki durum:** Basit rate limiting var
**İyileştirme:** Route bazlı ve user bazlı rate limiting

```typescript
// Login endpoint için özel rate limit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // IP başına 5 deneme
  message: 'Çok fazla giriş denemesi, lütfen 15 dakika sonra tekrar deneyin'
})

router.post('/login', loginLimiter, AuthController.login)

// User bazlı rate limiting
const userRateLimiter = async (req, res, next) => {
  const userId = req.user?.userId
  if (!userId) return next()
  
  const key = `ratelimit:${userId}`
  const requests = await redis.incr(key)
  
  if (requests === 1) {
    await redis.expire(key, 60) // 1 dakika
  }
  
  if (requests > 100) {
    return res.status(429).json({ message: 'Too many requests' })
  }
  
  next()
}
```

---

### 5. Security Headers

**Helmet.js Konfigürasyonu:**

```typescript
// server.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))
```

---

### 6. Input Validation ve Sanitization

**Backend:**
```typescript
// Zod ile güçlü validation
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .transform(val => val.toLowerCase().trim()),
  
  email: z.string()
    .email()
    .transform(val => val.toLowerCase().trim()),
  
  password: z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Şifre en az 1 küçük harf, 1 büyük harf ve 1 rakam içermelidir')
})

// SQL Injection koruması (Prisma zaten koruyor)
// XSS koruması için sanitize
import sanitizeHtml from 'sanitize-html'

const sanitizedContent = sanitizeHtml(req.body.content, {
  allowedTags: [],
  allowedAttributes: {}
})
```

---

### 7. Password Hashing İyileştirmesi

**Şu anki:** bcrypt rounds = 10
**İyileştirme:** bcrypt rounds = 12-14 (Production için)

```typescript
// auth.service.ts
const passwordHash = await bcrypt.hash(data.password, 12)
```

---

### 8. Environment Variables Güvenliği

**Production Checklist:**

```bash
# .env.production
NODE_ENV=production
JWT_SECRET=<64+ karakter random string>
DATABASE_URL=<production database>
FRONTEND_URL=https://yourdomain.com

# Cookie ayarları
COOKIE_SECURE=true
COOKIE_SAMESITE=strict

# Rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=100
```

**Asla commit edilmemeli:**
- .env dosyaları
- API keys
- Database credentials
- JWT secrets

---

### 9. Logging ve Monitoring

**Security Events Log:**

```typescript
// Log security events
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
})

// Failed login attempts
securityLogger.warn({
  event: 'LOGIN_FAILED',
  email: req.body.email,
  ip: req.ip,
  timestamp: new Date()
})

// Suspicious activities
securityLogger.error({
  event: 'SUSPICIOUS_ACTIVITY',
  userId: req.user.id,
  action: 'MULTIPLE_FAILED_ATTEMPTS',
  count: 5
})
```

---

### 10. Database Güvenliği

**Connection Security:**
```bash
# SSL/TLS bağlantı
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

**SQL Injection Koruması:**
- ✅ Prisma ORM kullanıyoruz (parametrized queries)
- ❌ Raw SQL query'lerden kaçın
- ✅ Input validation yap

---

## 📋 Production Deployment Checklist

### Güvenlik
- [ ] httpOnly cookie implementasyonu
- [ ] CSRF protection
- [ ] Refresh token mekanizması
- [ ] Rate limiting iyileştirme
- [ ] Security headers konfigürasyonu
- [ ] SSL/TLS sertifikası
- [ ] Environment variables güvenliği
- [ ] Password hashing rounds = 12
- [ ] Input validation ve sanitization
- [ ] Logging ve monitoring

### Testing
- [ ] Penetration testing
- [ ] Security audit
- [ ] Dependency vulnerability scan (`npm audit`)
- [ ] OWASP Top 10 kontrolü

### Compliance
- [ ] GDPR compliance (EU kullanıcıları için)
- [ ] KVKK compliance (TR kullanıcıları için)
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie policy

---

## 🔗 Faydalı Kaynaklar

- **OWASP Top 10:** https://owasp.org/Top10/
- **JWT Best Practices:** https://tools.ietf.org/html/rfc8725
- **Node.js Security Checklist:** https://cheatsheetseries.owasp.org/
- **Express Security Best Practices:** https://expressjs.com/en/advanced/best-practice-security.html

---

**Son Güncelleme:** 5 Ekim 2025  
**Durum:** Development Phase  
**Sonraki Review:** Sprint 9 (Performans ve Optimizasyon)

