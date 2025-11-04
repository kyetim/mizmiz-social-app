# 🛡️ Modern Hata Yönetimi Sistemi - Kurulum Rehberi

Bu dokümantasyon, MIZMIZ uygulamasına entegre edilen kapsamlı, modern ve kullanıcı dostu hata yönetimi sistemini açıklamaktadır.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Backend Hata Yönetimi](#backend-hata-yönetimi)
- [Frontend Hata Yönetimi](#frontend-hata-yönetimi)
- [Kurulum](#kurulum)
- [Kullanım Örnekleri](#kullanım-örnekleri)
- [Best Practices](#best-practices)

---

## 🎯 Genel Bakış

### Eklenen Özellikler

#### Backend ✅
- ✅ Özel Error sınıfları (AppError, ValidationError, NotFoundError, vb.)
- ✅ Error kodları ve tipleri sistemi
- ✅ Modern error middleware (request tracking, structured logging)
- ✅ Winston logger entegrasyonu
- ✅ Prisma error handling
- ✅ JWT error handling
- ✅ Request/Response logging
- ✅ Graceful shutdown handling
- ✅ Uncaught exception handling

#### Frontend ✅
- ✅ Error types ve utilities
- ✅ API client iyileştirmeleri (retry logic, exponential backoff)
- ✅ React Error Boundary
- ✅ Offline detector
- ✅ Gelişmiş toast notification sistemi
- ✅ Kullanıcı dostu Türkçe hata mesajları
- ✅ Form validation error handling
- ✅ Network error handling

---

## 🔧 Backend Hata Yönetimi

### 1. Error Sınıfları (`backend/src/utils/errors.ts`)

```typescript
// Özel error sınıfları
- AppError (Base class)
- ValidationError (400)
- UnauthorizedError (401)
- ForbiddenError (403)
- NotFoundError (404)
- ConflictError (409)
- RateLimitError (429)
- InternalServerError (500)
- DatabaseError (500)
- BusinessLogicError (400)
```

#### Error Kodları
```typescript
AUTH_001: Unauthorized
AUTH_002: Invalid Credentials
AUTH_003: Token Expired
AUTH_004: Token Invalid
AUTH_005: Account Deactivated
VAL_001: Validation Error
RES_001: Not Found
RES_002: Already Exists
BUS_001: Already Liked
... ve daha fazlası
```

### 2. Winston Logger (`backend/src/utils/logger.ts`)

**Özellikler:**
- Console ve file logging
- Log rotation (5MB, 5 files)
- Colored console output (development)
- JSON format (production)
- Structured logging with metadata
- Error, warn, info, debug, http levels

**Log Dosyaları:**
- `backend/logs/combined.log` - Tüm loglar
- `backend/logs/error.log` - Sadece hatalar

### 3. Error Middleware (`backend/src/middleware/error.middleware.ts`)

**Özellikler:**
- Request ID tracking
- Prisma error handling
- JWT error handling
- Structured error responses
- Development/Production mode ayrımı
- Error context logging (user, IP, path, method)

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "message": "User-friendly error message",
    "code": "ERR_CODE",
    "requestId": "1234567890-abc123",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "details": { ... }
  }
}
```

### 4. Request Logger (`backend/src/middleware/request-logger.middleware.ts`)

**Features:**
- HTTP request logging
- Response time tracking
- User tracking
- IP logging

### 5. Servis Katmanında Kullanım

```typescript
// auth.service.ts örneği
import { ConflictError, ValidationError, UnauthorizedError } from '../utils/errors'
import { logInfo } from '../utils/logger'

// Email zaten varsa
throw new ConflictError('Email already exists', {
  field: 'email',
  value: data.email
})

// Başarılı işlem
logInfo('User registered successfully', {
  userId: user.id,
  username: user.username
})
```

### 6. Controller Katmanında Kullanım

```typescript
// asyncHandler kullanımı
import { asyncHandler } from '../middleware/error.middleware'
import { createValidationError } from '../utils/errors'

export const controller = {
  method: asyncHandler(async (req, res) => {
    // Validation
    const errors: Record<string, string> = {}
    if (!data.field) errors.field = 'Field is required'
    
    if (Object.keys(errors).length > 0) {
      throw createValidationError(errors)
    }
    
    // Business logic
    const result = await service.method(data)
    
    res.json({
      success: true,
      data: result
    })
  })
}
```

---

## 🎨 Frontend Hata Yönetimi

### 1. Error Utilities (`frontend/src/lib/utils/error-handler.ts`)

**Fonksiyonlar:**
- `extractErrorMessage(error)` - Kullanıcı dostu mesaj çıkarma
- `getErrorMessage(code)` - Error code'dan Türkçe mesaj
- `isAuthError(error)` - Auth error kontrolü
- `isNetworkError(error)` - Network error kontrolü
- `isValidationError(error)` - Validation error kontrolü
- `formatValidationErrors(error)` - Form için validation errors
- `logError(error, context)` - Development logging
- `isOnline()` - Online/offline kontrolü

**Türkçe Hata Mesajları:**
```typescript
AUTH_001: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.'
AUTH_002: 'Email veya şifre hatalı.'
VAL_001: 'Lütfen formu doğru şekilde doldurun.'
NET_001: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
... 20+ hata mesajı
```

### 2. API Client (`frontend/src/lib/api/client.ts`)

**Özellikler:**
- ✅ Automatic retry (3 attempts)
- ✅ Exponential backoff (1s, 2s, 4s)
- ✅ Timeout handling (30 seconds)
- ✅ Offline detection
- ✅ Auth error handling (auto redirect)
- ✅ Request timing logging
- ✅ Error context logging

**Retry Logic:**
```typescript
Retry edilen durumlar:
- Network errors (no response)
- Server errors (500, 502, 503, 504)
- Rate limiting (429)
- Timeout (408)

Retry edilmeyen:
- Auth errors (401, 403)
- Validation errors (400)
- Offline durumunda
```

### 3. Error Boundary (`frontend/src/components/shared/error-boundary.tsx`)

**React Error Boundary:**
- React hatalarını yakalar
- Kullanıcı dostu fallback UI
- Development'ta detaylı error info
- "Tekrar Dene" ve "Ana Sayfaya Dön" butonları
- Custom fallback support

**Kullanım:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// veya custom fallback ile
<ErrorBoundary fallback={<CustomError />}>
  <YourComponent />
</ErrorBoundary>
```

### 4. Offline Detector (`frontend/src/components/shared/offline-detector.tsx`)

**Özellikler:**
- Real-time online/offline detection
- Toast notifications
- Persistent warning banner (offline'da)
- Auto-reconnect detection

### 5. Gelişmiş Toast Sistemi

**Providers'da configure edildi:**
```tsx
// Success toast - Yeşil, 3 saniye
toast.success('İşlem başarılı! 🎉')

// Error toast - Kırmızı, 5 saniye
toast.error('Bir hata oluştu!', {
  icon: <AlertCircle />
})

// Loading toast - Mavi
toast.loading('Yükleniyor...')

// Custom toast
toast('Custom mesaj', {
  duration: 4000,
  icon: '⚡'
})
```

### 6. Form Error Handling

**Login/Register Form örneği:**
```tsx
try {
  await dispatch(login(data)).unwrap()
  toast.success('Giriş başarılı! 🎉')
  router.push('/feed')
} catch (error: any) {
  // User-friendly message
  const errorMessage = extractErrorMessage(error)
  toast.error(errorMessage)
  
  // Set form field errors
  const validationErrors = formatValidationErrors(error)
  Object.entries(validationErrors).forEach(([field, message]) => {
    setError(field, { message })
  })
}
```

---

## 📦 Kurulum

### Backend

1. **Winston paketini kur:**
```bash
cd backend
npm install winston
```

2. **Logs dizinini oluştur (otomatik oluşur):**
```bash
mkdir logs
```

3. **Tüm dosyalar zaten eklendi:**
- ✅ `src/utils/errors.ts`
- ✅ `src/utils/logger.ts`
- ✅ `src/middleware/error.middleware.ts`
- ✅ `src/middleware/request-logger.middleware.ts`
- ✅ `src/server.ts` (updated)
- ✅ Tüm services (updated)
- ✅ Tüm controllers (updated)

### Frontend

1. **Tüm dosyalar zaten eklendi:**
- ✅ `src/lib/utils/error-handler.ts`
- ✅ `src/lib/api/client.ts` (updated)
- ✅ `src/components/shared/error-boundary.tsx`
- ✅ `src/components/shared/offline-detector.tsx`
- ✅ `src/components/shared/providers.tsx` (updated)
- ✅ `src/components/auth/modern-login-form.tsx` (updated)
- ✅ `src/components/auth/modern-register-form.tsx` (updated)

2. **Paketler zaten mevcut:**
- axios
- react-hot-toast
- lucide-react

---

## 💡 Kullanım Örnekleri

### Backend Service

```typescript
import { NotFoundError, ValidationError } from '../utils/errors'
import { logInfo, logError } from '../utils/logger'

export class UserService {
  static async getUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    
    if (!user) {
      throw new NotFoundError('User')
    }
    
    logInfo('User fetched', { userId: id })
    return user
  }
  
  static async createUser(data: CreateUserDto) {
    if (!data.email) {
      throw new ValidationError('Email is required', {
        field: 'email'
      })
    }
    
    const user = await prisma.user.create({ data })
    logInfo('User created', { userId: user.id })
    return user
  }
}
```

### Frontend Component

```tsx
'use client'

import { useState } from 'react'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import toast from 'react-hot-toast'

export function MyComponent() {
  const [loading, setLoading] = useState(false)
  
  const handleAction = async () => {
    setLoading(true)
    try {
      await apiClient.post('/endpoint', data)
      toast.success('İşlem başarılı! 🎉')
    } catch (error) {
      const message = extractErrorMessage(error)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button onClick={handleAction} disabled={loading}>
      {loading ? 'Yükleniyor...' : 'Gönder'}
    </button>
  )
}
```

---

## 🎯 Best Practices

### Backend

1. **Doğru Error Sınıfını Kullan:**
   - Validation → `ValidationError`
   - Not found → `NotFoundError`
   - Already exists → `ConflictError`
   - Unauthorized → `UnauthorizedError`
   - Business logic → `BusinessLogicError`

2. **Her Zaman Context Ekle:**
   ```typescript
   throw new ConflictError('Email already exists', {
     field: 'email',
     value: data.email
   })
   ```

3. **Başarılı İşlemleri Logla:**
   ```typescript
   logInfo('User action completed', {
     userId: user.id,
     action: 'profile_update'
   })
   ```

4. **asyncHandler Kullan:**
   ```typescript
   export const controller = {
     method: asyncHandler(async (req, res) => {
       // No try-catch needed!
     })
   }
   ```

### Frontend

1. **extractErrorMessage Kullan:**
   ```typescript
   const message = extractErrorMessage(error)
   toast.error(message)
   ```

2. **Error Boundary Kullan:**
   ```tsx
   <ErrorBoundary>
     <CriticalComponent />
   </ErrorBoundary>
   ```

3. **Form Validation Errors:**
   ```typescript
   const validationErrors = formatValidationErrors(error)
   Object.entries(validationErrors).forEach(([field, msg]) => {
     setError(field, { message: msg })
   })
   ```

4. **Loading States:**
   ```tsx
   const loadingToast = toast.loading('İşlem yapılıyor...')
   try {
     await action()
     toast.success('Başarılı!', { id: loadingToast })
   } catch (error) {
     toast.error(extractErrorMessage(error), { id: loadingToast })
   }
   ```

---

## 🚀 Sonuç

Artık MIZMIZ uygulaması:

✅ **Backend'de:**
- Structured error handling
- Professional logging
- Request tracking
- Detailed error contexts
- Graceful error recovery

✅ **Frontend'de:**
- Kullanıcı dostu Türkçe mesajlar
- Automatic retry mekanizması
- Offline detection
- React error boundary
- Gelişmiş toast notifications
- Form validation error handling

✅ **Development:**
- Detaylı console logging
- Stack traces
- Request/Response timing
- Error debugging tools

✅ **Production:**
- Kullanıcı dostu mesajlar
- File-based logging
- Error tracking ready
- Performance monitoring

---

## 📝 Notlar

- Tüm error mesajları Türkçe
- Tüm loglar Winston ile yönetiliyor
- Retry logic otomatik çalışıyor
- Error boundary tüm React hatalarını yakalar
- Offline detection real-time çalışıyor
- Toast notifications modern ve güzel görünüyor

**Kullanıma hazır! 🎉**

