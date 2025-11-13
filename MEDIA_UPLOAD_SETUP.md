# 📸 Medya Yükleme Sistemi - Kurulum Talimatları

## 🎯 Özellikler

Proje artık kapsamlı bir medya yükleme sistemi ile donatıldı:

### ✅ Backend
- **Cloudinary Entegrasyonu**: Güvenli ve optimize edilmiş medya depolama
- **Multer Middleware**: Dosya yükleme işlemleri
- **Otomatik Resim Optimizasyonu**: Cloudinary ile otomatik boyutlandırma ve format optimizasyonu
- **3 Endpoint**:
  - `POST /api/upload/post-image` - Gönderi fotoğrafları
  - `POST /api/upload/avatar` - Profil fotoğrafları (400x400 crop)
  - `POST /api/upload/cover` - Kapak fotoğrafları (1500x500 crop)

### ✅ Frontend
- **ImageUpload Component**: Drag & drop, preview, ve progress gösterimi
- **Post Creation**: Gönderilere fotoğraf ekleme
- **Profile Photos**: Avatar ve cover fotoğraf yükleme
- **Responsive Design**: Mobil uyumlu
- **Dark Mode Support**: Tam dark mode desteği

---

## 🚀 Kurulum Adımları

### 1. Cloudinary Hesabı Oluşturma

1. [Cloudinary](https://cloudinary.com) web sitesine git
2. **Sign Up for Free** butonuna tıkla
3. Email, username ve password ile ücretsiz hesap oluştur
4. Email adresini doğrula

### 2. Cloudinary Credentials Alma

1. Cloudinary Dashboard'a giriş yap
2. Sol menüden **Dashboard** sekmesine git
3. Aşağıdaki bilgileri kopyala:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Backend .env Konfigürasyonu

Backend klasöründeki `.env` dosyasını aç ve şu satırları ekle:

```bash
# Cloudinary (Media Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
```

**ÖNEMLİ**: `your-cloud-name-here`, `your-api-key-here`, ve `your-api-secret-here` yerine Cloudinary Dashboard'dan aldığın gerçek değerleri yaz.

### 4. Backend Paketlerini Yükle (Zaten Yüklendi ✅)

```bash
cd backend
npm install cloudinary multer
npm install --save-dev @types/multer
```

### 5. Backend'i Yeniden Başlat

Backend'i yeniden başlat ki Cloudinary konfigürasyonu yüklensin:

```bash
cd backend
npm run dev
```

### 6. Test Et!

1. Frontend'i çalıştır: `npm run dev` (frontend klasöründe)
2. Tarayıcıda `http://localhost:3000` adresine git
3. Login yap
4. **Yeni Gönderi** butonuna tıkla
5. Fotoğraf ikonuna tıkla ve bir fotoğraf seç
6. Fotoğrafın yüklendiğini ve preview'ını gör
7. Profile sayfasına git ve avatar/cover fotoğrafı yükle

---

## 📁 Dosya Yapısı

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   └── upload.controller.ts       # Upload endpoints
│   ├── middleware/
│   │   └── upload.middleware.ts       # Multer config
│   ├── routes/
│   │   └── upload.routes.ts           # Upload routes
│   └── utils/
│       └── cloudinary.ts              # Cloudinary config
└── uploads/                           # Temporary local storage
```

### Frontend
```
frontend/
└── src/
    ├── components/
    │   ├── upload/
    │   │   └── image-upload.tsx       # Main upload component
    │   ├── profile/
    │   │   ├── avatar-upload-modal.tsx
    │   │   └── cover-upload-modal.tsx
    │   └── post/
    │       └── create-post-modal.tsx  # Updated with image upload
    └── lib/
        └── api/
            └── upload.ts              # Upload API client
```

---

## 🎨 Kullanım Örnekleri

### 1. Gönderi Oluştururken Fotoğraf Ekle

```typescript
// CreatePostModal içinde
const [imageUrl, setImageUrl] = useState('')

// ImageUpload component'i
<ImageUpload
  onImageUploaded={(url) => setImageUrl(url)}
  type="post"
/>

// Post oluştururken
await postsApi.createPost({ 
  content: content.trim(),
  imageUrl: imageUrl || undefined
})
```

### 2. Profile Avatar Yükle

```typescript
<AvatarUploadModal
  isOpen={showAvatarModal}
  onClose={() => setShowAvatarModal(false)}
  onAvatarUploaded={(url) => {
    setAvatarUrl(url)
    toast.success('Profil fotoğrafı güncellendi!')
  }}
/>
```

### 3. Cover Photo Yükle

```typescript
<CoverUploadModal
  isOpen={showCoverModal}
  onClose={() => setShowCoverModal(false)}
  onCoverUploaded={(url) => {
    setCoverUrl(url)
    toast.success('Kapak fotoğrafı güncellendi!')
  }}
/>
```

---

## 🔒 Güvenlik Özellikleri

- ✅ **File Type Validation**: Sadece resim dosyaları kabul edilir (JPEG, PNG, GIF, WEBP)
- ✅ **File Size Limit**: Maksimum 10MB dosya boyutu
- ✅ **Authentication Required**: Tüm upload endpoint'leri authentication gerektirir
- ✅ **Temporary File Cleanup**: Yüklenen dosyalar Cloudinary'ye gönderildikten sonra lokal'den silinir
- ✅ **Automatic Image Optimization**: Cloudinary otomatik olarak format ve kalite optimizasyonu yapar

---

## 🎯 Desteklenen Dosya Formatları

### Resimler
- JPEG / JPG
- PNG
- GIF
- WEBP

### Video (İleride Eklenecek)
- MP4
- MPEG
- QuickTime

---

## ⚙️ Cloudinary Transformations

### Avatar (Profil Fotoğrafı)
- **Boyut**: 400x400px
- **Crop**: Fill (yüz merkezli)
- **Kalite**: Otomatik
- **Format**: Otomatik (WebP destekleyen tarayıcılarda WebP)

### Cover (Kapak Fotoğrafı)
- **Boyut**: 1500x500px
- **Crop**: Fill
- **Kalite**: Otomatik
- **Format**: Otomatik

### Post Images
- **Max Genişlik**: 2000px
- **Kalite**: Otomatik
- **Format**: Otomatik
- **Aspect Ratio**: Korunur

---

## 🐛 Troubleshooting

### Problem: "Upload service not configured" Hatası
**Çözüm**: Backend `.env` dosyasında Cloudinary credentials'ların doğru olduğundan emin ol ve backend'i yeniden başlat.

### Problem: Fotoğraf yüklenmiyor
**Çözüm**: 
1. Cloudinary Dashboard'da Cloud Name, API Key ve API Secret'ın doğru olduğunu kontrol et
2. Backend console'da hata mesajlarını kontrol et
3. Browser console'da network tab'ı kontrol et

### Problem: "File too large" Hatası
**Çözüm**: Dosya boyutu 10MB'den küçük olmalı. Daha büyük dosyalar için resmi sıkıştır.

### Problem: "Invalid file type" Hatası
**Çözüm**: Sadece JPEG, PNG, GIF, WEBP formatları desteklenir.

---

## 📊 API Response Örnekleri

### Başarılı Upload
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "mizmiz/posts/abc123",
    "width": 1920,
    "height": 1080
  }
}
```

### Hata Response
```json
{
  "success": false,
  "error": {
    "message": "No file uploaded"
  }
}
```

---

## 🎉 Sonuç

Artık projenin tüm yerlerinde medya yükleme sistemi çalışıyor! 🚀

### Özellikler:
✅ Post creation'da fotoğraf ekleme  
✅ Profile avatar yükleme  
✅ Cover photo yükleme  
✅ Drag & drop desteği  
✅ Preview özelliği  
✅ Loading states  
✅ Error handling  
✅ Dark mode support  
✅ Responsive design  

---

## 📞 Destek

Herhangi bir sorun yaşarsan:
1. Backend console loglarını kontrol et
2. Browser console'da network tab'ı kontrol et
3. Cloudinary Dashboard'da Media Library'yi kontrol et
4. `.env` dosyasındaki credentials'ları tekrar kontrol et

---

**Not**: Cloudinary free plan'da aylık 25GB bandwidth ve 25GB storage limiti var, bu proje için fazlasıyla yeterli! 🎯

