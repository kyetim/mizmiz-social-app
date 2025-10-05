# MIZMIZ - Ürün Gereksinim Belgesi (PRD)

**Proje Adı:** MIZMIZ Sosyal Medya Platformu  
**Versiyon:** 0.1.0 (MVP)  
**Tarih:** 3 Ekim 2025  
**Durum:** Planlama Aşaması

---

## 1. Genel Bakış

### 1.1 Amaç
MIZMIZ, kullanıcıların içerik paylaşabileceği, etkileşime girebileceği ve topluluk oluşturabileceği modern, hızlı ve kullanıcı dostu bir sosyal medya platformudur.

### 1.2 Vizyon
- Genç yazılımcılar, öğrenciler ve içerik üreticileri için ilham verici bir topluluk alanı yaratmak
- Sade, hızlı ve modern bir kullanıcı deneyimi sunmak
- Kullanıcı mahremiyetini ve veri güvenliğini ön planda tutmak

### 1.3 Misyon
Kullanıcıların fikirlerini özgürce paylaşabilecekleri, birbirleriyle bağlantı kurabilecekleri ve ilgi alanlarına uygun içerikleri keşfedebilecekleri bir platform oluşturmak.

---

## 2. Hedef Kitle

### 2.1 Birincil Hedef Kitle
- **Genç Yazılımcılar** (18-30 yaş)
  - Teknolojiyle ilgilenen
  - Kod paylaşımı ve teknik içerik üretimi yapan
  - Topluluk ve networking arayan

- **Öğrenciler** (16-25 yaş)
  - Üniversite öğrencileri
  - Bilgi paylaşımı yapan
  - Sosyal etkileşim arayan

- **İçerik Üreticileri** (20-35 yaş)
  - Blog yazarları
  - Düşünce liderleri
  - Kreatif profesyoneller

### 2.2 İkincil Hedef Kitle
- Hobi ve ilgi grupları
- Küçük topluluklar
- Mikro-influencer'lar

### 2.3 Kullanıcı Personaları

#### Persona 1: Ali - Yazılım Geliştirici
- **Yaş:** 24
- **Meslek:** Frontend Developer
- **İhtiyaçlar:**
  - Kod snippet'leri paylaşmak
  - Diğer geliştiricilerle network kurmak
  - Güncel teknoloji trendlerini takip etmek
- **Motivasyon:** Öğrenme ve toplulukla etkileşim

#### Persona 2: Ayşe - Üniversite Öğrencisi
- **Yaş:** 21
- **Eğitim:** Bilgisayar Mühendisliği 3. Sınıf
- **İhtiyaçlar:**
  - Ders notları ve kaynak paylaşımı
  - Kampüs etkinliklerini duyurmak
  - Arkadaşlarıyla bağlantıda kalmak
- **Motivasyon:** Bilgi paylaşımı ve sosyalleşme

---

## 3. Kapsam

### 3.1 MVP (Minimum Viable Product)
İlk versiyonda aşağıdaki temel özellikler bulunacaktır:

#### 3.1.1 Temel Özellikler
- ✅ Kullanıcı kaydı ve girişi
- ✅ Profil oluşturma ve düzenleme
- ✅ Metin ve resim içerikli gönderi paylaşma
- ✅ Gönderi beğenme
- ✅ Gönderi yorumlama
- ✅ Kullanıcı takip etme / takipçi sistemi
- ✅ Ana feed (akış)
- ✅ Basit bildirim sistemi

#### 3.1.2 MVP Dışında (Sonraki Versiyonlar)
- ⏳ Video paylaşımı
- ⏳ Direkt mesajlaşma
- ⏳ Hikaye (Stories) özelliği
- ⏳ Hashtag sistemi
- ⏳ Gelişmiş arama ve filtreleme
- ⏳ İki faktörlü kimlik doğrulama
- ⏳ Sosyal medya entegrasyonları

### 3.2 Teknik Gereksinimler
- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion, Three.js
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (önerilen)
- **Authentication:** JWT
- **Hosting:** Vercel (Frontend), Railway/Render (Backend)
- **Storage:** Cloudinary veya AWS S3 (görseller için)

---

## 4. Fonksiyonel Gereksinimler

### 4.1 Kimlik Doğrulama ve Yetkilendirme

#### 4.1.1 Kayıt Olma
- **Gerekli Alanlar:**
  - Kullanıcı adı (unique, 3-20 karakter)
  - E-posta (valid format, unique)
  - Şifre (min 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam)
  - Şifre tekrarı
- **Validation:**
  - E-posta formatı kontrolü
  - Kullanıcı adı benzersizlik kontrolü
  - Şifre güçlülük kontrolü
- **Akış:**
  1. Kullanıcı formu doldurur
  2. Sistem validasyon yapar
  3. Şifre hash'lenir (bcrypt)
  4. Kullanıcı veritabanına kaydedilir
  5. Otomatik giriş yapılır veya e-posta doğrulama gönderilir

#### 4.1.2 Giriş Yapma
- **Gerekli Alanlar:**
  - E-posta veya kullanıcı adı
  - Şifre
- **Akış:**
  1. Kullanıcı credentials girer
  2. Sistem kullanıcıyı veritabanında arar
  3. Şifre doğrulanır
  4. JWT token üretilir
  5. Token client'a gönderilir
  6. Kullanıcı ana sayfaya yönlendirilir

#### 4.1.3 Çıkış Yapma
- Token'ı client'tan sil
- Kullanıcıyı login sayfasına yönlendir

### 4.2 Kullanıcı Profili

#### 4.2.1 Profil Bilgileri
- **Zorunlu Alanlar:**
  - Kullanıcı adı
  - E-posta
- **Opsiyonel Alanlar:**
  - Ad Soyad
  - Biyografi (max 160 karakter)
  - Profil fotoğrafı
  - Kapak fotoğrafı
  - Konum
  - Web sitesi
  - Doğum tarihi

#### 4.2.2 Profil Düzenleme
- Kullanıcı tüm bilgilerini güncelleyebilir
- Profil ve kapak fotoğrafı yükleyebilir
- Şifresini değiştirebilir (eski şifre gerekli)

#### 4.2.3 Profil Görüntüleme
- Herkes herkesi görüntüleyebilir
- Gösterilecek bilgiler:
  - Profil fotoğrafı
  - Kullanıcı adı
  - Ad Soyad
  - Biyografi
  - Takipçi sayısı
  - Takip edilen sayısı
  - Gönderi sayısı
  - Son gönderiler

### 4.3 Gönderi (Post) Sistemi

#### 4.3.1 Gönderi Oluşturma
- **İçerik Tipleri:**
  - Metin (max 500 karakter)
  - Metin + 1 resim
- **Validation:**
  - En az 1 karakter metin veya 1 resim zorunlu
  - Resim formatı: JPG, PNG, WebP
  - Resim boyutu: Max 5MB
- **Akış:**
  1. Kullanıcı içerik girer/yükler
  2. Sistem validasyon yapar
  3. Resim optimize edilir ve storage'a yüklenir
  4. Gönderi veritabanına kaydedilir
  5. Feed'e eklenir
  6. Takipçilere bildirim gönderilir (opsiyonel)

#### 4.3.2 Gönderi Görüntüleme
- **Feed'de:**
  - Kullanıcı bilgisi (avatar, kullanıcı adı)
  - Gönderi zamanı (relatif: "2 saat önce")
  - İçerik (metin + resim)
  - İstatistikler (beğeni sayısı, yorum sayısı)
  - Aksiyon butonları (beğen, yorum yap, paylaş)
- **Detay Sayfasında:**
  - Yukarıdaki tüm bilgiler
  - Tüm yorumlar

#### 4.3.3 Gönderi Düzenleme
- Sadece gönderi sahibi düzenleyebilir
- Sadece metin düzenlenebilir (resim değiştirilemez)
- "Düzenlendi" etiketi gösterilir

#### 4.3.4 Gönderi Silme
- Sadece gönderi sahibi silebilir
- Soft delete (veritabanından silinmez, gizlenir)
- Kullanıcıya onay sorulur

### 4.4 Etkileşim Sistemi

#### 4.4.1 Beğenme (Like)
- Kullanıcı bir gönderiyi beğenebilir/beğenmekten vazgeçebilir
- Beğeni sayısı anlık güncellenir
- Gönderi sahibine bildirim gider
- **Akış:**
  1. Kullanıcı beğen butonuna tıklar
  2. Sistem beğeniyi kaydeder/siler
  3. Beğeni sayısı güncellenir
  4. Bildirim oluşturulur

#### 4.4.2 Yorum Yapma (Comment)
- Kullanıcı gönderilere yorum yapabilir
- Yorum uzunluğu: 1-300 karakter
- Yorumlar kronolojik sırayla gösterilir
- **Akış:**
  1. Kullanıcı yorum yazar ve gönderir
  2. Sistem validasyon yapar
  3. Yorum veritabanına kaydedilir
  4. Yorum sayısı güncellenir
  5. Gönderi sahibine bildirim gider

#### 4.4.3 Yorum Silme
- Sadece yorum sahibi silebilir
- Gönderi sahibi başkalarının yorumlarını silebilir

### 4.5 Takip Sistemi

#### 4.5.1 Takip Etme (Follow)
- Kullanıcı başka kullanıcıları takip edebilir
- Takip edilen kullanıcının gönderileri feed'de görünür
- Takip edilen kullanıcıya bildirim gider
- **Akış:**
  1. Kullanıcı "Takip Et" butonuna tıklar
  2. Takip ilişkisi veritabanına kaydedilir
  3. Takipçi/takip sayıları güncellenir
  4. Bildirim gönderilir

#### 4.5.2 Takibi Bırakma (Unfollow)
- Kullanıcı takip ettiği kişileri bırakabilir
- Feed'den o kullanıcının gönderileri kaldırılır

#### 4.5.3 Takipçi/Takip Listesi
- Kullanıcı takipçilerini görebilir
- Kullanıcı takip ettiklerini görebilir
- Liste formatında gösterim

### 4.6 Feed (Akış) Sistemi

#### 4.6.1 Ana Feed
- Takip edilen kullanıcıların gönderileri
- Kronolojik sıralama (en yeni üstte)
- Sonsuz scroll (infinite scroll)
- Sayfa başına 10 gönderi
- **Optimizasyon:**
  - Server-side pagination
  - Lazy loading images
  - Virtual scrolling (uzun listeler için)

#### 4.6.2 Keşfet (Explore) Feed
- Tüm kullanıcıların popüler gönderileri
- Sıralama: En çok beğenilen/yorumlanan
- Zaman filtresi: Bugün, Bu hafta, Bu ay

#### 4.6.3 Profil Feed
- Belirli bir kullanıcının tüm gönderileri
- Kronolojik sıralama

### 4.7 Bildirim Sistemi

#### 4.7.1 Bildirim Tipleri
- Yeni takipçi
- Gönderi beğenisi
- Gönderi yorumu
- Yanıt yorumu

#### 4.7.2 Bildirim Gösterimi
- Header'da bildirim ikonu
- Okunmamış bildirim sayısı badge
- Bildirim listesi dropdown
- Bildirim detayı gösterimi

#### 4.7.3 Bildirim Durumu
- Okunmamış (bold)
- Okunmuş (normal)
- Tıklandığında ilgili içeriğe yönlendir

### 4.8 Arama Sistemi

#### 4.8.1 Kullanıcı Arama
- Kullanıcı adı veya ad soyad ile arama
- Otomatik tamamlama (autocomplete)
- Arama sonuçları listesi

#### 4.8.2 İçerik Arama
- Gönderi içeriğinde arama
- Basit metin araması
- Sonuçlar relevance'e göre sıralı

---

## 5. Fonksiyonel Olmayan Gereksinimler

### 5.1 Performans

#### 5.1.1 Sayfa Yükleme Süreleri
- **İlk Yükleme (First Contentful Paint):** < 1.5 saniye
- **Tam Yükleme (Fully Loaded):** < 2 saniye
- **Time to Interactive:** < 2.5 saniye

#### 5.1.2 Web Vitals Hedefleri
- **LCP (Largest Contentful Paint):** < 2.5 saniye
- **FID (First Input Delay):** < 100 milisaniye
- **CLS (Cumulative Layout Shift):** < 0.1

#### 5.1.3 API Response Süreleri
- **GET istekleri:** < 200ms
- **POST istekleri:** < 500ms
- **Image upload:** < 2 saniye

### 5.2 Güvenlik

#### 5.2.1 Kimlik Doğrulama
- JWT token kullanımı
- Token expiration: 24 saat
- Refresh token mekanizması
- HTTPS zorunlu

#### 5.2.2 Veri Güvenliği
- Şifre hashing (bcrypt, 10 rounds)
- SQL injection koruması
- XSS koruması
- CSRF koruması
- Rate limiting (API istekleri için)

#### 5.2.3 Dosya Güvenliği
- File type validation
- File size limits
- Virus scanning (opsiyonel)
- Secure file storage

### 5.3 Ölçeklenebilirlik

#### 5.3.1 Kullanıcı Kapasitesi
- **MVP:** 1,000 aktif kullanıcı
- **6 Ay:** 10,000 aktif kullanıcı
- **1 Yıl:** 50,000 aktif kullanıcı

#### 5.3.2 Veri Kapasitesi
- **Gönderi sayısı:** 100,000+
- **Toplam storage:** 10GB (MVP), 100GB (6 ay)

#### 5.3.3 Eşzamanlı Kullanıcı
- **MVP:** 100 concurrent users
- **6 Ay:** 1,000 concurrent users

### 5.4 Kullanılabilirlik

#### 5.4.1 Responsive Tasarım
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+
- Touch-friendly UI (min 44px touch targets)

#### 5.4.2 Erişilebilirlik
- WCAG 2.1 Level AA uyumluluğu
- Keyboard navigation
- Screen reader desteği
- High contrast mode

#### 5.4.3 Tarayıcı Desteği
- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

### 5.5 Güvenilirlik

#### 5.5.1 Uptime
- **Hedef:** %99.9 uptime
- **Maximum downtime:** 8.76 saat/yıl

#### 5.5.2 Backup
- Günlük otomatik backup
- 30 gün backup retention
- Disaster recovery planı

#### 5.5.3 Error Handling
- Graceful degradation
- User-friendly error messages
- Error logging ve monitoring

---

## 6. Kullanıcı Senaryoları

### Senaryo 1: Yeni Kullanıcı Kaydı ve İlk Gönderi

**Aktör:** Ali (24 yaş, yazılım geliştirici)

**Hedef:** Platforma kayıt olup ilk gönderisini paylaşmak

**Adımlar:**
1. Ali MIZMIZ ana sayfasını ziyaret eder
2. "Kayıt Ol" butonuna tıklar
3. Kayıt formunu doldurur:
   - Kullanıcı adı: `ali_dev`
   - E-posta: `ali@example.com`
   - Şifre: `SecurePass123`
4. "Hesap Oluştur" butonuna tıklar
5. Sistem e-posta doğrulama linki gönderir (opsiyonel MVP'de)
6. Ali otomatik olarak giriş yapar ve ana sayfaya yönlendirilir
7. "Profili Tamamla" modalı açılır
8. Ali profil fotoğrafı yükler ve biyografi ekler
9. Ana feed'e yönlendirilir
10. "Yeni Gönderi" butonuna tıklar
11. İlk gönderisini yazar: "Merhaba MIZMIZ! İlk gönderim 🚀"
12. İsteğe bağlı bir resim ekler
13. "Paylaş" butonuna tıklar
14. Gönderi feed'de görünür

**Beklenen Sonuç:**
- Ali başarıyla kayıt oldu
- Profili tamamlandı
- İlk gönderisi paylaşıldı ve feed'de görünür

**Başarı Kriteri:**
- Kayıt süreci < 2 dakika
- İlk gönderi paylaşımı < 30 saniye

---

### Senaryo 2: İçerik Keşfi ve Etkileşim

**Aktör:** Ayşe (21 yaş, üniversite öğrencisi)

**Hedef:** İlginç içerikleri keşfetmek, beğenmek ve yorum yapmak

**Adımlar:**
1. Ayşe MIZMIZ'e giriş yapar
2. Ana feed'de gönderileri görüntüler
3. Scroll yaparak içeriklere göz atar
4. Ali'nin gönderisini görür ve beğenir (❤️)
5. Gönderi kartına tıklayarak detay sayfasını açar
6. "Yorum Yap" kutusuna tıklar
7. Yorumunu yazar: "Harika bir başlangıç! Başarılar 👏"
8. "Gönder" butonuna tıklar
9. Yorumu gönderideki yorumlar arasında görür
10. Ali'nin profiline tıklar
11. Profil sayfasında Ali'nin diğer gönderilerini görür
12. "Takip Et" butonuna tıklar
13. Ana sayfaya döner
14. "Keşfet" sekmesine tıklar
15. Popüler içerikleri inceler
16. İlginç bir gönderiyi beğenir ve paylaşır

**Beklenen Sonuç:**
- Ayşe içerikleri kolayca keşfetti
- Ali ile etkileşime geçti (beğeni, yorum)
- Ali'yi takip etmeye başladı
- Keşfet bölümünde popüler içerikleri görüntüledi

**Başarı Kriteri:**
- Feed yükleme süresi < 1 saniye
- Beğeni/yorum işlemleri anlık gerçekleşti
- Kullanıcı deneyimi sorunsuz

---

### Senaryo 3: Profil Yönetimi ve Takipçi Etkileşimi

**Aktör:** Ali (daha önce kayıt olmuş)

**Hedef:** Profilini güncellemek ve takipçileriyle etkileşim kurmak

**Adımlar:**
1. Ali giriş yapar
2. Header'daki bildirim ikonunda yeni bildirim badge'i görür (1)
3. Bildirim ikonuna tıklar
4. Ayşe'nin kendisini takip ettiğini ve yorumunu görür
5. Bildirimlere tıklayarak gönderisinin detay sayfasına gider
6. Ayşe'nin yorumunu okur
7. Yorum üzerine hover yaparak "Beğen" butonuna tıklar
8. Ayşe'nin profiline gider
9. "Takip Et" butonuna tıklar
10. Profil menüsüne tıklar
11. "Profili Düzenle" seçeneğine tıklar
12. Biyografisini günceller: "Full-stack developer | React & Node.js enthusiast"
13. Konum ekler: "İstanbul, Türkiye"
14. Web sitesi ekler: "https://ali-dev.com"
15. "Kaydet" butonuna tıklar
16. Profil sayfasına yönlendirilir ve güncellenmiş bilgileri görür

**Beklenen Sonuç:**
- Ali bildirimleri gördü ve yanıt verdi
- Ayşe ile karşılıklı takip ilişkisi kuruldu
- Profil bilgileri başarıyla güncellendi

**Başarı Kriteri:**
- Bildirimler gerçek zamanlı geldi
- Profil güncelleme işlemi < 1 saniye
- Tüm değişiklikler anında yansıdı

---

## 7. Başarı Kriterleri ve Metrikler

### 7.1 Kullanıcı Metrikleri

#### 7.1.1 Kayıt ve Aktivasyon
- **Hedef:** Kayıt olan kullanıcıların %80'i ilk 24 saat içinde en az 1 gönderi paylaşmalı
- **Ölçüm:** `(İlk gönderiyi paylaşan kullanıcılar / Toplam kayıtlar) * 100`

#### 7.1.2 Kullanıcı Tutma (Retention)
- **Hedef:** %40 Day 7 retention, %20 Day 30 retention
- **Ölçüm:** Belirli bir gün sonra aktif kalan kullanıcı oranı

#### 7.1.3 Günlük Aktif Kullanıcı (DAU)
- **Hedef (MVP):** 500 DAU
- **Hedef (6 ay):** 5,000 DAU

#### 7.1.4 Aylık Aktif Kullanıcı (MAU)
- **Hedef (MVP):** 2,000 MAU
- **Hedef (6 ay):** 20,000 MAU

### 7.2 Etkileşim Metrikleri

#### 7.2.1 Gönderi Başına Etkileşim
- **Hedef:** Ortalama 5 beğeni, 2 yorum per gönderi
- **Ölçüm:** Toplam etkileşim / Toplam gönderi sayısı

#### 7.2.2 Kullanıcı Başına Günlük Gönderi
- **Hedef:** 1.5 gönderi / kullanıcı / gün
- **Ölçüm:** Toplam günlük gönderi / DAU

#### 7.2.3 Oturum Süresi
- **Hedef:** Ortalama 10 dakika / oturum
- **Ölçüm:** Google Analytics / Mixpanel

#### 7.2.4 Oturum Başına Sayfa Görüntüleme
- **Hedef:** 15 sayfa / oturum
- **Ölçüm:** Toplam sayfa görüntüleme / Toplam oturum

### 7.3 Teknik Metrikler

#### 7.3.1 Sayfa Performansı
- **LCP:** < 2.5 saniye (%90 kullanıcı)
- **FID:** < 100ms (%95 kullanıcı)
- **CLS:** < 0.1 (%75 kullanıcı)
- **Ölçüm:** Google Lighthouse, Web Vitals

#### 7.3.2 API Performansı
- **P95 response time:** < 500ms
- **Error rate:** < %1
- **Ölçüm:** Application monitoring (New Relic, Datadog)

#### 7.3.3 Uptime
- **Hedef:** %99.9
- **Ölçüm:** Uptime monitoring tools

### 7.4 İş Metrikleri

#### 7.4.1 Kayıt Dönüşüm Oranı
- **Hedef:** %30 (Landing page ziyaretçilerinden kayıt)
- **Ölçüm:** `(Kayıtlar / Landing page ziyaretçileri) * 100`

#### 7.4.2 Viral Katsayı
- **Hedef:** K > 1 (Her kullanıcı en az 1 yeni kullanıcı getirmeli)
- **Ölçüm:** `(Davetler * Davet dönüşüm oranı) / Mevcut kullanıcılar`

#### 7.4.3 Churn Rate
- **Hedef:** < %5 aylık churn
- **Ölçüm:** `(Ayrılan kullanıcılar / Toplam aktif kullanıcılar) * 100`

---

## 8. Veri Modeli

### 8.1 User (Kullanıcı)
```typescript
interface UserInterface {
  id: string                    // UUID
  username: string               // Unique, 3-20 karakter
  email: string                  // Unique, valid email
  passwordHash: string           // Hashed password
  firstName?: string
  lastName?: string
  bio?: string                   // Max 160 karakter
  avatarUrl?: string
  coverImageUrl?: string
  location?: string
  website?: string
  birthDate?: Date
  isVerified: boolean            // E-posta doğrulaması
  isActive: boolean              // Hesap aktif mi
  role: string                   // 'user' | 'admin' | 'moderator'
  followersCount: number
  followingCount: number
  postsCount: number
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}
```

### 8.2 Post (Gönderi)
```typescript
interface PostInterface {
  id: string                     // UUID
  userId: string                 // Foreign key to User
  content: string                // Max 500 karakter
  imageUrl?: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  isEdited: boolean
  isDeleted: boolean             // Soft delete
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### 8.3 Comment (Yorum)
```typescript
interface CommentInterface {
  id: string                     // UUID
  postId: string                 // Foreign key to Post
  userId: string                 // Foreign key to User
  content: string                // Max 300 karakter
  likesCount: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

### 8.4 Like (Beğeni)
```typescript
interface LikeInterface {
  id: string                     // UUID
  userId: string                 // Foreign key to User
  targetId: string               // Post ID veya Comment ID
  targetType: string             // 'post' | 'comment'
  createdAt: Date
}
```

### 8.5 Follow (Takip)
```typescript
interface FollowInterface {
  id: string                     // UUID
  followerId: string             // Foreign key to User (takip eden)
  followingId: string            // Foreign key to User (takip edilen)
  createdAt: Date
}
```

### 8.6 Notification (Bildirim)
```typescript
interface NotificationInterface {
  id: string                     // UUID
  userId: string                 // Foreign key to User (bildirimi alan)
  actorId: string                // Foreign key to User (aksiyonu yapan)
  type: string                   // 'follow' | 'like' | 'comment'
  targetId?: string              // Post ID veya Comment ID
  message: string
  isRead: boolean
  createdAt: Date
}
```

---

## 9. API Endpoints

### 9.1 Authentication
```
POST   /api/auth/register       # Kayıt ol
POST   /api/auth/login          # Giriş yap
POST   /api/auth/logout         # Çıkış yap
POST   /api/auth/refresh        # Token yenile
GET    /api/auth/me             # Mevcut kullanıcı bilgisi
```

### 9.2 Users
```
GET    /api/users/:id           # Kullanıcı detayı
PUT    /api/users/:id           # Kullanıcı güncelle
GET    /api/users/:id/posts     # Kullanıcının gönderileri
GET    /api/users/:id/followers # Takipçiler
GET    /api/users/:id/following # Takip edilenler
GET    /api/users/search        # Kullanıcı ara
```

### 9.3 Posts
```
GET    /api/posts               # Feed (takip edilen kullanıcıların gönderileri)
GET    /api/posts/explore       # Keşfet (tüm gönderiler)
GET    /api/posts/:id           # Gönderi detayı
POST   /api/posts               # Yeni gönderi
PUT    /api/posts/:id           # Gönderi güncelle
DELETE /api/posts/:id           # Gönderi sil
POST   /api/posts/:id/like      # Gönderi beğen
DELETE /api/posts/:id/like      # Beğeniyi geri al
```

### 9.4 Comments
```
GET    /api/posts/:id/comments  # Gönderi yorumları
POST   /api/posts/:id/comments  # Yorum yap
DELETE /api/comments/:id        # Yorum sil
POST   /api/comments/:id/like   # Yorum beğen
```

### 9.5 Follow
```
POST   /api/users/:id/follow    # Kullanıcıyı takip et
DELETE /api/users/:id/follow    # Takibi bırak
```

### 9.6 Notifications
```
GET    /api/notifications       # Bildirimler
PUT    /api/notifications/:id/read  # Bildirimi okundu işaretle
PUT    /api/notifications/read-all  # Tümünü okundu işaretle
```

### 9.7 Upload
```
POST   /api/upload/image        # Resim yükle
```

---

## 10. Kullanıcı Arayüzü (UI/UX)

### 10.1 Tasarım Prensipleri
- **Minimalist:** Sade ve odaklanmış tasarım
- **Modern:** Güncel tasarım trendleri (glassmorphism, neumorphism opsiyonel)
- **Hızlı:** Instant feedback, animasyonlar
- **Erişilebilir:** Keyboard navigation, screen reader desteği

### 10.2 Ana Sayfalar

#### 10.2.1 Landing Page (Giriş yapmamış kullanıcılar için)
- Hero section (başlık, açıklama, CTA)
- Özellikler bölümü
- Sosyal kanıt (kullanıcı sayısı, gönderi sayısı)
- Footer (linkler, sosyal medya)

#### 10.2.2 Login / Register Pages
- Minimal form tasarımı
- Social login (opsiyonel, sonraki versiyonlar)
- Password strength indicator
- Error handling

#### 10.2.3 Feed Page (Ana Sayfa)
- Header (logo, arama, profil menüsü, bildirimler)
- Sol sidebar (navigasyon)
  - Ana Sayfa
  - Keşfet
  - Bildirimler
  - Profil
- Orta alan (feed)
  - "Yeni Gönderi" input
  - Gönderi kartları (infinite scroll)
- Sağ sidebar (keşfet önerileri, trendler - opsiyonel)
- Mobile: Bottom navigation

#### 10.2.4 Profile Page
- Kapak fotoğrafı
- Profil fotoğrafı
- Kullanıcı bilgileri (ad, kullanıcı adı, bio)
- İstatistikler (gönderi, takipçi, takip)
- "Takip Et" / "Düzenle" butonu
- Gönderiler sekmesi

#### 10.2.5 Post Detail Page
- Gönderi kartı (genişletilmiş)
- Yorumlar bölümü
- Yorum yapma input'u

#### 10.2.6 Explore Page
- Popüler gönderiler
- Filtreleme (bugün, bu hafta, bu ay)
- Grid veya list view

#### 10.2.7 Notifications Page
- Bildirim listesi
- "Tümünü okundu işaretle" butonu
- Bildirim tipleri için farklı iconlar

### 10.3 UI Bileşenleri
- Button (primary, secondary, ghost, icon)
- Input (text, textarea, file)
- Card (post card, user card)
- Avatar (küçük, orta, büyük)
- Modal (gönderi oluştur, profil düzenle)
- Dropdown (profil menüsü, post actions)
- Toast (başarı/hata mesajları)
- Skeleton loader
- Empty state

### 10.4 Animasyonlar (Framer Motion)
- Page transitions
- Hover effects
- Like animation (kalp patlaması)
- Loading animations
- Scroll animations

### 10.5 3D Öğeler (Three.js - Opsiyonel)
- Landing page hero 3D background
- Profile page 3D avatar showcase
- Onboarding 3D elements

---

## 11. Geliştirme Aşamaları

### Sprint 1: Proje Kurulumu ve Temel Altyapı (1 Hafta)
- [x] Proje yapısı oluşturma
- [ ] Frontend kurulumu (Next.js, Tailwind, Shadcn UI)
- [ ] Backend kurulumu (Express, PostgreSQL, JWT)
- [ ] Database schema oluşturma
- [ ] Temel CI/CD pipeline

### Sprint 2: Kimlik Doğrulama (1 Hafta)
- [ ] Kayıt olma API ve UI
- [ ] Giriş yapma API ve UI
- [ ] JWT implementation
- [ ] Protected routes
- [ ] Auth context/store

### Sprint 3: Kullanıcı Profili (1 Hafta)
- [ ] Profil görüntüleme API ve UI
- [ ] Profil düzenleme API ve UI
- [ ] Profil fotoğrafı yükleme
- [ ] User service

### Sprint 4: Gönderi Sistemi (1.5 Hafta)
- [ ] Gönderi oluşturma API ve UI
- [ ] Gönderi listeleme (feed) API ve UI
- [ ] Gönderi detayı API ve UI
- [ ] Resim yükleme
- [ ] Gönderi düzenleme/silme

### Sprint 5: Etkileşim Sistemi (1 Hafta)
- [ ] Beğenme sistemi API ve UI
- [ ] Yorum sistemi API ve UI
- [ ] Yorum silme
- [ ] Real-time updates

### Sprint 6: Takip Sistemi (1 Hafta)
- [ ] Takip etme API ve UI
- [ ] Takipçi/takip listeleri API ve UI
- [ ] Feed algoritması (takip edilen kullanıcılar)

### Sprint 7: Bildirim ve Arama (1 Hafta)
- [ ] Bildirim sistemi API
- [ ] Bildirim UI
- [ ] Kullanıcı arama API
- [ ] Arama UI ve autocomplete

### Sprint 8: Keşfet ve Optimizasyon (1 Hafta)
- [ ] Keşfet feed API (popüler gönderiler)
- [ ] Keşfet UI
- [ ] Performance optimizations
- [ ] Image optimization
- [ ] SEO

### Sprint 9: Testing ve Bug Fixes (1 Hafta)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Bug fixing
- [ ] Code review

### Sprint 10: Deployment ve Launch (0.5 Hafta)
- [ ] Production deployment
- [ ] SSL sertifikası
- [ ] Domain bağlama
- [ ] Monitoring setup
- [ ] Analytics setup
- [ ] Launch! 🚀

**Toplam Süre:** ~10 hafta (2.5 ay)

---

## 12. Riskler ve Zorluklar

### 12.1 Teknik Riskler
- **Ölçeklenebilirlik:** Kullanıcı sayısı arttıkça performans sorunları
  - **Çözüm:** Caching, CDN, load balancing, database optimization
- **Real-time Özellikler:** Bildirimler ve feed güncellemeleri
  - **Çözüm:** WebSocket veya Server-Sent Events (SSE)
- **Image Storage:** Yüksek maliyet
  - **Çözüm:** Image compression, CDN kullanımı, lazy loading

### 12.2 Ürün Riskleri
- **Kullanıcı Kazanımı:** Yeni kullanıcıları platforma çekmek
  - **Çözüm:** Referral program, sosyal medya pazarlama, SEO
- **Kullanıcı Tutma:** Kullanıcıların aktif kalması
  - **Çözüm:** Gamification, bildirimler, ilgi çekici içerik
- **İçerik Kalitesi:** Spam ve düşük kaliteli içerik
  - **Çözüm:** Moderasyon araçları, AI-powered content filtering

### 12.3 Güvenlik Riskleri
- **Veri İhlali:** Kullanıcı verilerinin çalınması
  - **Çözüm:** Encryption, secure authentication, regular security audits
- **Spam ve Abuse:** Kötü niyetli kullanıcılar
  - **Çözüm:** Rate limiting, captcha, ban sistemi

---

## 13. Sonraki Adımlar (Post-MVP)

### Fase 2: Gelişmiş Özellikler (3-6 ay)
- Video paylaşımı
- Direkt mesajlaşma
- Hikaye (Stories)
- Hashtag sistemi
- Gelişmiş arama ve filtreleme
- İki faktörlü kimlik doğrulama
- Sosyal medya entegrasyonları

### Fase 3: Topluluk Özellikleri (6-12 ay)
- Gruplar
- Events
- Polls (anketler)
- Live streaming
- Monetization (abonelik, bağış)

### Fase 4: Yapay Zeka Entegrasyonu (12+ ay)
- AI-powered content recommendations
- Automatic content moderation
- Sentiment analysis
- Chatbot support

---

## 14. Sonuç

MIZMIZ, modern web teknolojileri kullanılarak geliştirilecek, kullanıcı odaklı bir sosyal medya platformudur. MVP versiyonu ile temel özellikleri sunarak piyasaya girecek ve kullanıcı geri bildirimleri doğrultusunda geliştirilmeye devam edecektir.

**Başarı için kritik faktörler:**
- Hızlı ve akıcı kullanıcı deneyimi
- Temiz ve modern arayüz
- Güvenli ve güvenilir altyapı
- Aktif topluluk oluşturma
- Sürekli geliştirme ve iyileştirme

---

**Doküman Versiyonu:** 1.0  
**Son Güncelleme:** 3 Ekim 2025  
**Hazırlayan:** MIZMIZ Geliştirme Ekibi

**Onay:**
- [ ] Proje Sahibi
- [ ] Teknik Lead
- [ ] UX Designer
- [ ] Product Manager

