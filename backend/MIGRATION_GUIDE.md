# 🗄️ Database Migration Guide - Security Update

## Genel Bakış

Bu migration, aşağıdaki güvenlik özelliklerini ekler:
1. Refresh token tablosu
2. User tablosuna güvenlik alanları (failedLoginAttempts, lockedUntil)

## ⚠️ Önemli Notlar

- Bu migration **geri alınamaz** (irreversible)
- Production'da çalıştırmadan önce backup alın
- Migration sırasında downtime olabilir (~30 saniye)

## 🚀 Migration Adımları

### 1. Backup Alın (Kritik!)

```bash
# PostgreSQL backup
pg_dump -U your_user -d your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# Veya Supabase kullanıyorsanız, dashboard'dan backup alın
```

### 2. Migration Önizleme (Development)

```bash
cd backend

# Migration'ı önce development'ta test edin
npx prisma migrate dev --name add-security-features
```

### 3. Production Migration

```bash
# Production database URL'ini ayarlayın
export DATABASE_URL="your-production-database-url"

# Migration'ı production'a uygulayın
npx prisma migrate deploy
```

## 📋 Migration Detayları

### Yeni Tablo: refresh_tokens

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
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Users Tablosu Güncellemeleri

```sql
ALTER TABLE "users" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "lockedUntil" TIMESTAMP(3);
```

## ✅ Migration Doğrulama

### 1. Tabloların Oluşturulduğunu Kontrol Edin

```sql
-- refresh_tokens tablosunu kontrol et
SELECT * FROM pg_tables WHERE tablename = 'refresh_tokens';

-- users tablosunda yeni kolonları kontrol et
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('failedLoginAttempts', 'lockedUntil');
```

### 2. İndexlerin Oluşturulduğunu Kontrol Edin

```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'refresh_tokens';
```

## 🔧 Sorun Giderme

### Migration Başarısız Olursa

```bash
# Migration durumunu kontrol edin
npx prisma migrate status

# Eğer "drift" varsa:
npx prisma migrate resolve --applied <migration-name>

# Veya migration'ı rollback edin (manuel)
# backup.sql dosyasını restore edin
psql -U your_user -d your_database < backup.sql
```

### Mevcut Verilerle Çakışma

Eğer users tablosunda zaten `failedLoginAttempts` veya `lockedUntil` kolonları varsa:

```sql
-- Önce mevcut kolonları silin
ALTER TABLE "users" DROP COLUMN IF EXISTS "failedLoginAttempts";
ALTER TABLE "users" DROP COLUMN IF EXISTS "lockedUntil";

-- Sonra migration'ı tekrar çalıştırın
```

## 🧹 Post-Migration Temizlik

### Expired Refresh Tokenları Temizleme (Opsiyonel)

Migration sonrası, expired tokenları temizlemek için bir cron job kurun:

```javascript
// backend/src/cron/cleanup-tokens.ts
import { AuthService } from '../services/auth.service'

// Her gün 03:00'te çalışsın
cron.schedule('0 3 * * *', async () => {
  await AuthService.cleanupExpiredTokens()
})
```

### Test Verileri Oluşturma (Development)

```sql
-- Test kullanıcısı için refresh token oluştur
INSERT INTO "refresh_tokens" (id, token, "userId", "expiresAt", "userAgent", "ipAddress")
VALUES (
  gen_random_uuid()::text,
  'test_refresh_token_' || gen_random_uuid()::text,
  'your-test-user-id',
  NOW() + INTERVAL '7 days',
  'Mozilla/5.0 Test Browser',
  '127.0.0.1'
);
```

## 📊 Performans Notları

- **refresh_tokens** tablosu hızla büyüyebilir
- Index'ler sorgu performansını optimize eder
- Expired tokenlar için düzenli cleanup önerilir
- Cascade delete sayesinde user silinince tokenları da silinir

## 🔍 Monitoring

Migration sonrası izlenmesi gerekenler:

```sql
-- Refresh token sayısı
SELECT COUNT(*) FROM refresh_tokens;

-- Expired token sayısı
SELECT COUNT(*) FROM refresh_tokens WHERE "expiresAt" < NOW();

-- Revoked token sayısı
SELECT COUNT(*) FROM refresh_tokens WHERE "isRevoked" = true;

-- Kilitli kullanıcı sayısı
SELECT COUNT(*) FROM users WHERE "lockedUntil" > NOW();
```

## 🚨 Acil Durum Planı

Eğer migration ciddi sorun yaratırsa:

1. **Immediate rollback**
   ```bash
   psql -U user -d db < backup.sql
   ```

2. **Eski kodu deploy edin**
   ```bash
   git checkout previous-commit
   npm run build
   pm2 restart backend
   ```

3. **Kullanıcıları bilgilendirin**
   - Status page update
   - Email/notification

## ✅ Migration Checklist

Pre-Migration:
- [ ] Database backup alındı
- [ ] Migration development'ta test edildi
- [ ] Downtime maintenance window planlandı
- [ ] Rollback planı hazır

During Migration:
- [ ] Users bilgilendirildi
- [ ] Migration çalıştırıldı
- [ ] Errors loglandı

Post-Migration:
- [ ] Tablo ve indexler doğrulandı
- [ ] Application başarıyla başladı
- [ ] Login/Logout test edildi
- [ ] Monitoring aktif

---

**Sorularınız için:** DevOps team veya Tech Lead ile iletişime geçin.

