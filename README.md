# MIZMIZ - Neon Sosyal Medya Platformu 💎

> **Geleceğin sosyal ağ deneyimi.** Cyberpunk estetiği, ultra-modern teknolojiler ve kesintisiz performans ile donatılmış yeni nesil sosyal medya platformu.

![MIZMIZ Banner](https://via.placeholder.com/1200x400/050505/06b6d4?text=MIZMIZ+SOCIAL+PLATFORM)

## 🌟 Proje Hakkında

MIZMIZ, modern web teknolojilerinin sınırlarını zorlayan, tam donanımlı bir sosyal medya platformudur. Next.js 15 ve Node.js/Express mimarisi üzerine kurulu olan bu proje, **PWA desteği**, **sanallaştırılmış mesajlaşma listeleri** ve **gelişmiş görsel optimizasyonları** ile hem mobil hem masaüstünde kusursuz, "app-like" bir deneyim sunar.

Tasarım dili olarak **"Cyberpunk"** ve **"Glassmorphism"** benimsenmiş; koyu mod, neon vurgular ve akıcı animasyonlarla kullanıcıyı içine çeken bir atmosfer yaratılmıştır.

## ✨ Öne Çıkan Özellikler

*   **🎨 Cyberpunk UI/UX:** Derin siyah zemin üzerinde neon cyan/blue vurgular, glassmorphism paneller ve Framer Motion ile güçlendirilmiş akıcı animasyonlar.
*   **📱 PWA (Progressive Web App):** Mobil cihazlara kurulabilir (installable), çevrimdışı (offline) yeteneklere sahip ve native uygulama hissi verir.
*   **⚡ Yüksek Performanslı Mesajlaşma:** `react-virtuoso` ile sanallaştırılmış liste yapısı sayesinde binlerce mesaj olsa bile takılmayan, yağ gibi akan bir sohbet deneyimi.
*   **🖼️ Gelişmiş Görsel Optimizasyonu:** `next/image` entegrasyonu ile görseller otomatik olarak formatlanır (WebP/AVIF), lazy load edilir ve CLS (Layout Shift) önlenir.
*   **🔐 Güvenli Kimlik Doğrulama:** HTTP-Only Cookie tabanlı güvenli auth sistemi ve mobil tarayıcılar için `localStorage` fallback mekanizması ile kesintisiz oturum yönetimi.
*   **💬 Gerçek Zamanlı İletişim (WebSocket):** Socket.io altyapısı ile anlık mesajlaşma, "yazıyor..." göstergesi, canlı okundu bilgisi ve çevrimiçi durumu takibi.
*   **🏆 Gamification:** Kullanıcı etkileşimlerini artıran rozetler ve puan sistemi.
*   **📂 Kategorizasyon:** İçerikleri akıllıca ayıran kategori ve etiket sistemi.

## 🛠️ Teknoloji Yığını

Bu proje, endüstri standardı en güncel teknolojiler kullanılarak geliştirilmiştir.

### Frontend (Client)
*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Dil:** [TypeScript](https://www.typescriptlang.org/)
*   **Stil:** [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), GSAP
*   **State Yönetimi:** [Redux Toolkit](https://redux-toolkit.js.org/), RTK Query
*   **UI Bileşenleri:** [Radix UI](https://www.radix-ui.com/), Lucide React Icons
*   **3D Grafikler:** Three.js, React Three Fiber, Drei
*   **Form Yönetimi:** React Hook Form, Zod
*   **Optimizasyon:** `next-pwa`, `react-virtuoso`, `next/image`

### Backend (Server)
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Real-time:** [Socket.io](https://socket.io/) (WebSocket)
*   **Veritabanı:** [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
*   **Auth:** JWT (JSON Web Tokens), BCryptJS
*   **Dosya Yönetimi:** Cloudinary, Multer
*   **Güvenlik:** Helmet, Rate Limiting, CORS

## 🚀 Kurulum ve Başlatma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Ön Gereksinimler
*   Node.js (v18 veya üzeri)
*   PostgreSQL Veritabanı
*   npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kyetim/mizmiz-social-app.git
cd mizmiz-social-app
```

### 2. Backend Kurulumu
Backend servisini ayağa kaldırın ve veritabanı bağlantılarını yapın.

```bash
cd backend
npm install

# Örnek env dosyasını kopyalayın
cp .env.example .env

# .env dosyasını kendi veritabanı ve Cloudinary bilgilerinizle düzenleyin!

# Veritabanı şemasını oluşturun ve migration yapın
npm run prisma:generate
npm run prisma:migrate

# Opsiyonel: Test verilerini yükleyin
npm run prisma:seed

# Sunucuyu başlatın
npm run dev
```
Backend `http://localhost:5000` adresinde çalışacaktır.

### 3. Frontend Kurulumu
Frontend uygulamasını başlatın.

```bash
cd ../frontend
npm install

# Örnek env dosyasını kopyalayın
cp .env.example .env.local

# .env.local dosyasında NEXT_PUBLIC_API_URL'in doğru olduğundan emin olun (varsayılan: http://localhost:5000/api)

# Uygulamayı başlatın
npm run dev
```
Frontend `http://localhost:3000` adresinde çalışacaktır.

## 🌍 Environment Variables

Projenin çalışması için aşağıdaki çevre değişkenlerinin `.env` dosyalarında tanımlanması gerekir.

**Backend (.env)**
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/mizmiz?schema=public"
JWT_SECRET="guclu-bir-secret-key"
JWT_REFRESH_SECRET="guclu-bir-refresh-key"
CORS_ORIGIN="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NODE_ENV="development"
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## 📱 Mobil Uyumluluk & PWA

MIZMIZ, **Progressive Web App (PWA)** standartlarına tam uyumludur.
*   **Kurulum:** Mobil tarayıcınızda (Chrome/Safari) "Ana Ekrana Ekle" seçeneği ile native uygulama gibi yükleyebilirsiniz.
*   **Icon:** Özel olarak tasarlanmış app ikonları mevcuttur.
*   **Offline:** İnternet bağlantısı kesildiğinde bile temel arayüz elementleri çalışmaya devam eder.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen büyük değişiklikler yapmadan önce bir "Issue" açarak tartışma başlatın.

1.  Forklayın
2.  Feature branch oluşturun (`git checkout -b feature/harika-ozellik`)
3.  Commit atın (`git commit -m 'feat: harika özellik eklendi'`)
4.  Pushlayın (`git push origin feature/harika-ozellik`)
5.  Pull Request açın

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---
<p align="center">
  <sub>Designed & Developed by <strong>MIZMIZ Team</strong> 🚀</sub>
</p>
