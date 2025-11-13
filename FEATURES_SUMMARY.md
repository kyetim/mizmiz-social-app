# 🚀 MIZMIZ - Proje Özellikleri

## 📌 Genel Bakış
**MIZMIZ**, modern web teknolojileri kullanılarak geliştirilmiş, topluluk odaklı bir sosyal medya platformudur. Kullanıcıların içerik paylaşabileceği, etkileşime girebileceği ve kişiselleştirilmiş feed deneyimi yaşayabileceği yenilikçi bir platformdur.

## 🎯 Belirgin Özellikler

### 1. 🎭 Akıllı Kategori Sistemi
- **Topluluk Oylamalı Kategoriler**: Kullanıcılar post'ları oylayarak kategorize eder (Reddit ve Twitter'dan farklı)
- **Çok Boyutlu Kategorilendirme**: Bir post birden fazla kategoriye sahip olabilir (%70 Mizah, %20 Spor)
- **Dinamik Güven Skoru**: Topluluk oylarıyla belirlenen güven seviyesi
- **12 Ana Kategori**: Mizah, Spor, Teknoloji, Sanat, Yemek, Gezi, Gündem, Siyaset, Eğitim, Moda, Oyun, Müzik

### 2. 😊 Vibe Check Sistemi
- **8 Farklı Vibe**: Pozitif, Tartışmalı, Düşündürücü, Eğlenceli, Üzücü, Öfke, İlham Verici, Bilgilendirici
- Post'ların ton ve ruh halini belirleme
- Mental sağlık odaklı içerik filtreleme
- Vibe oylaması ile doğrulama

### 3. 🎛️ Smart Feed Mixer (Akıllı Feed Karışımı)
- **Kişiselleştirilmiş İçerik Kokteyli**: Kullanıcılar kategori ağırlıkları belirler (0-100%)
- **3 Feed Modu**:
  - 🌈 **Normal**: Dengeli içerik karışımı
  - 🧘 **Yumuşak**: Sadece pozitif ve ilham verici içerikler
  - 🎯 **Odaklanma**: Eğitici ve bilgilendirici içerikler
- **Negatif Filtreleme**: İstenmeyen kategorileri engelleme
- **AI-Destekli Öneri**: Kullanıcı davranışlarına göre akıllı öneriler

### 4. 🏆 Gamification Sistemi
- **Rozet Sistemi**:
  - 🌱 Acemi (0-10 oy)
  - 🔍 Meraklı (11-50 oy)
  - 🎓 Usta (51-200 oy)
  - 👑 Kategori Uzmanı (200+ oy, %80+ doğruluk)
- **Expertise Skoru**: `doğruluk × log(toplam_oylar) × 100`
- **Haftalık Liderlik Tablosu**: En iyi kategorize eden kullanıcılar
- **Kategori Savaşları**: Haftalık yarışmalar

### 5. 🔐 Güvenlik ve Kimlik Doğrulama
- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **bcrypt Şifreleme**: 10 round hash ile güvenli şifre saklama
- **Protected Routes**: Middleware ile korunan endpoint'ler
- **Role-Based Access**: Admin/moderatör yetkilendirme sistemi

### 6. 📝 Zengin İçerik Paylaşımı
- **Metin + Resim Post'ları**: Maksimum 500 karakter + görsel
- **Cloudinary Entegrasyonu**: Optimize edilmiş görsel yükleme ve CDN
- **Otomatik Kategori Önerisi**: AI-destekli keyword matching
- **Post Düzenleme**: Metin düzenleme ve düzenlenme etiketi

### 7. 💬 Gelişmiş Etkileşim Sistemi
- **Like/Unlike**: Anında güncellenen beğeni sistemi
- **Yorum Sistemi**: 300 karaktere kadar yorumlar
- **Nested Comments**: Yorumlara yanıt verme (gelecek özellik)
- **Real-time Updates**: Anlık etkileşim güncellemeleri

### 8. 👥 Sosyal Ağ Özellikleri
- **Takip Sistemi**: Kullanıcıları takip etme/takipten çıkma
- **Takipçi İstatistikleri**: Anlık takipçi/takip sayıları
- **Profil Yönetimi**: Avatar, cover foto, bio düzenleme
- **Kullanıcı Arama**: Gerçek zamanlı kullanıcı arama

### 9. 🔔 Bildirim Sistemi
- **4 Tip Bildirim**:
  - Yeni takipçi
  - Post beğenisi
  - Yorum
  - Bahsetme (mention)
- **Okundu/Okunmadı Durumu**: Badge ile görsel gösterim
- **Bildirim Filtreleme**: Tercih yönetimi

### 10. 🎨 Modern UI/UX
- **Glassmorphism Tasarım**: Cam efektli modern kartlar
- **Dark/Light Mode**: Otomatik tema değiştirme
- **Responsive Design**: Mobile-first yaklaşım
- **Framer Motion Animasyonlar**: Akıcı geçişler ve hover efektleri
- **3D Öğeler**: Three.js ile 3D arka plan elementleri

### 11. ⚡ Performans Optimizasyonları
- **Server-Side Rendering (SSR)**: Next.js 14 App Router
- **Image Optimization**: WebP format, lazy loading
- **Code Splitting**: Otomatik parçalara bölme
- **Infinite Scroll**: Sayfalama ile optimize feed yükleme
- **Redis Caching**: Hızlı veri erişimi (hazırda)

### 12. 🔍 Keşfet ve Arama
- **Trend Kategoriler**: Popüler içerik keşfi
- **Zaman Filtresi**: Bugün, bu hafta, bu ay
- **Kullanıcı Arama**: Autocomplete destekli
- **Akıllı Öneri**: Kullanıcı tercihlerine göre içerik önerisi

## 💻 Teknoloji Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Dil**: TypeScript
- **UI**: Shadcn UI, Radix UI, Tailwind CSS
- **Animasyon**: Framer Motion
- **3D**: Three.js + React Three Fiber
- **State**: Redux Toolkit
- **Form**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js + Express.js
- **Dil**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + bcrypt
- **Storage**: Cloudinary
- **Validation**: Zod

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database**: Supabase / Neon
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions

## 🎯 Rakiplerden Ayrışan Özellikler

### vs Twitter/X
- ✅ Topluluk oylamalı kategoriler (hashtag yerine)
- ✅ Vibe check sistemi
- ✅ Feed mixer ile tam kontrol

### vs Reddit
- ✅ Çok boyutlu kategoriler (tek subreddit yerine)
- ✅ Dinamik güven skoru
- ✅ Mental sağlık odaklı modlar

### vs Instagram
- ✅ İçerik kalitesi odaklı (görsel odaklı değil)
- ✅ Akıllı kategorilendirme
- ✅ Gamification sistemi

## 📊 Mevcut Durum

### ✅ Tamamlanan Özellikler
- [x] JWT Authentication ve Authorization
- [x] Post oluşturma, düzenleme, silme
- [x] Kategori ve Vibe sistemi
- [x] Feed Mixer ve kişiselleştirme
- [x] Gamification ve rozet sistemi
- [x] Like ve yorum sistemi
- [x] Takip sistemi
- [x] Profil yönetimi
- [x] Cloudinary medya yönetimi
- [x] Dark/Light mode
- [x] Responsive tasarım
- [x] 3D arka plan öğeleri

### 🚧 Devam Eden Özellikler
- [ ] Bildirim sistemi (UI)
- [ ] Gerçek zamanlı güncellemeler (WebSocket)
- [ ] E-posta doğrulama
- [ ] Advanced search
- [ ] Category battles UI
- [ ] Leaderboard sayfası

### 🔮 Gelecek Özellikler
- [ ] Video paylaşımı
- [ ] Direct mesajlaşma
- [ ] Stories (hikayeler)
- [ ] Hashtag sistemi
- [ ] Mention (@username)
- [ ] OpenAI/Claude entegrasyonu
- [ ] Mobile app (React Native)

## 🏆 Başarı Kriterleri

### Performans
- ⚡ First Contentful Paint < 1.5s
- ⚡ Time to Interactive < 2.5s
- ⚡ Lighthouse Score > 90

### Kullanıcı Deneyimi
- 🎯 Kayıt süreci < 2 dakika
- 🎯 İlk gönderi paylaşımı %80+
- 🎯 Day 7 Retention %40+

### Teknik
- 🔒 %99.9 Uptime
- 🔒 < %1 Error Rate
- 🔒 WCAG 2.1 Level AA

## 📝 Notlar

- **Proje Durumu**: Active Development (MVP Tamamlandı)
- **Son Güncelleme**: 13 Kasım 2025
- **Versiyon**: 0.1.0-MVP
- **Lisans**: MIT

## 🔗 Linkler

- **Repository**: [GitHub](https://github.com/yourusername/mizmiz-social-app)
- **Demo**: TBD
- **Dokümantasyon**: `/docs` klasöründe

---

**MIZMIZ ile topluluk deneyimini yeniden keşfedin! 🚀**

