# MIZMIZ - Özellik Listesi

## 📋 MVP Özellikleri (Versiyon 0.1.0)

### 🔐 Kimlik Doğrulama
- [x] Kullanıcı kaydı (e-posta, kullanıcı adı, şifre)
- [x] Giriş yapma (JWT Authentication)
- [x] Çıkış yapma
- [x] Şifre güvenliği (bcrypt hashing)
- [ ] E-posta doğrulama (opsiyonel MVP'de)

### 👤 Kullanıcı Profili
- [ ] Profil oluşturma
- [ ] Profil düzenleme
  - Ad, soyad
  - Biyografi (max 160 karakter)
  - Profil fotoğrafı
  - Kapak fotoğrafı
  - Konum, web sitesi, doğum tarihi
- [ ] Profil görüntüleme
  - Kullanıcı bilgileri
  - İstatistikler (gönderi, takipçi, takip sayıları)
  - Kullanıcının gönderileri
- [ ] Şifre değiştirme

### 📝 Gönderi Sistemi
- [ ] Gönderi oluşturma
  - Metin (max 500 karakter)
  - Resim ekleme (JPG, PNG, WebP - max 5MB)
- [ ] Gönderi listeleme (Feed)
  - Kronolojik sıralama
  - Infinite scroll
  - Skeleton loader
- [ ] Gönderi detayı görüntüleme
- [ ] Gönderi düzenleme (sadece metin)
- [ ] Gönderi silme (soft delete)

### ❤️ Etkileşim Sistemi
- [ ] Gönderi beğenme / beğenmekten vazgeçme
- [ ] Beğeni sayısı gösterimi
- [ ] Yorum yapma (max 300 karakter)
- [ ] Yorum listeleme
- [ ] Yorum silme
- [ ] Yorum beğenme

### 👥 Takip Sistemi
- [ ] Kullanıcı takip etme
- [ ] Takibi bırakma
- [ ] Takipçi listesi görüntüleme
- [ ] Takip edilen listesi görüntüleme
- [ ] Takip edilen kullanıcıların gönderilerini feed'de gösterme

### 🔔 Bildirim Sistemi
- [ ] Bildirim tipleri:
  - Yeni takipçi
  - Gönderi beğenisi
  - Gönderi yorumu
  - Yorum yanıtı
- [ ] Bildirim listesi
- [ ] Okunmamış bildirim badge
- [ ] Bildirimi okundu işaretleme
- [ ] Tüm bildirimleri okundu işaretleme

### 🔍 Arama ve Keşfet
- [ ] Kullanıcı arama (kullanıcı adı, ad soyad)
- [ ] Arama otomatik tamamlama
- [ ] Keşfet feed (popüler gönderiler)
- [ ] Zaman filtresi (bugün, bu hafta, bu ay)

### 🎨 UI/UX
- [ ] Modern ve minimalist tasarım
- [ ] Responsive tasarım (mobile-first)
- [ ] Dark/Light mode
- [ ] Smooth animations (Framer Motion)
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states

### 🚀 Performans
- [ ] Server-side rendering (SSR)
- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting
- [ ] Caching stratejileri
- [ ] Web Vitals optimization (LCP < 2.5s, FID < 100ms, CLS < 0.1)

---

## 🔮 Gelecek Özellikler

### Fase 2: Gelişmiş Özellikler (3-6 ay)
- [ ] Video paylaşımı
- [ ] Direkt mesajlaşma (DM)
- [ ] Hikaye (Stories) özelliği
- [ ] Hashtag sistemi
- [ ] Mention (@username) sistemi
- [ ] Gelişmiş arama ve filtreleme
- [ ] İki faktörlü kimlik doğrulama (2FA)
- [ ] Sosyal medya entegrasyonları (Twitter, GitHub, LinkedIn)
- [ ] Gönderi paylaşma (repost)
- [ ] Bookmark (kaydetme) özelliği
- [ ] Pin gönderi (profile sabitlenmiş gönderi)

### Fase 3: Topluluk Özellikleri (6-12 ay)
- [ ] Gruplar ve topluluklar
- [ ] Etkinlikler (Events)
- [ ] Anketler (Polls)
- [ ] Canlı yayın (Live streaming)
- [ ] Audio rooms (Clubhouse benzeri)
- [ ] Rozetler ve başarı sistemi
- [ ] Kullanıcı doğrulama (verified badge)
- [ ] Premium abonelik

### Fase 4: Yapay Zeka ve Gelişmiş Özellikler (12+ ay)
- [ ] AI-powered içerik önerileri
- [ ] Otomatik içerik moderasyonu
- [ ] Sentiment analysis
- [ ] Trend detection
- [ ] Chatbot desteği
- [ ] Görüntü tanıma ve etiketleme
- [ ] Sesli içerik tanıma

---

## 🎯 Özellik Önceliklendirme

### Yüksek Öncelikli (Sprint 1-6)
1. Kimlik doğrulama
2. Profil yönetimi
3. Gönderi sistemi
4. Etkileşim (beğeni, yorum)
5. Takip sistemi
6. Ana feed

### Orta Öncelikli (Sprint 7-9)
1. Bildirim sistemi
2. Arama sistemi
3. Keşfet sayfası
4. Performans optimizasyonları

### Düşük Öncelikli (Post-MVP)
1. Dark mode
2. 3D öğeler
3. Gelişmiş animasyonlar
4. E-posta bildirimleri

---

## 📊 Özellik Başarı Kriterleri

### Kullanıcı Kaydı
- **Hedef:** Kayıt süreci < 2 dakika
- **Ölçüm:** Average time to complete registration

### Gönderi Paylaşımı
- **Hedef:** %80 kullanıcı ilk 24 saatte gönderi paylaşmalı
- **Ölçüm:** (İlk gönderi paylaşan / Toplam kayıt) * 100

### Etkileşim
- **Hedef:** Gönderi başına ortalama 5 beğeni, 2 yorum
- **Ölçüm:** Toplam etkileşim / Toplam gönderi

### Performans
- **Hedef:** Sayfa yüklenme < 2 saniye
- **Ölçüm:** Google Lighthouse, Web Vitals

---

**Güncelleme:** Bu doküman düzenli olarak güncellenecektir. Yeni özellikler eklenip mevcut özellikler tamamlandıkça checkbox'lar işaretlenecektir.

