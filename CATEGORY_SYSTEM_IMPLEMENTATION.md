# Kategori ve Vibe Sistemi - Detaylı İmplementasyon Planı

**Proje:** MizMiz Social App
**Tarih:** 6 Ekim 2025
**Amaç:** Sosyal medya platformuna 8 yenilikçi özellik ekleyerek rakiplerden ayrışmak

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Veritabanı Yapısı](#veritabanı-yapısı)
3. [Backend Implementasyonu](#backend-implementasyonu)
4. [Frontend Implementasyonu](#frontend-implementasyonu)
5. [Özellik Detayları](#özellik-detayları)
6. [Adım Adım Uygulama Planı](#adım-adım-uygulama-planı)

---

## 🎯 Genel Bakış

### Özellikler Listesi

1. **Dinamik Kategori Skorlaması** - Kullanıcı oylarıyla belirlenen çok boyutlu kategoriler
2. **Vibe Check Sistemi** - İçeriğin ton/ruh halini etiketleme
3. **Smart Feed Mixer** - Kullanıcının özel içerik kokteyli
4. **Kategori Keşif Gamification** - Rozetler, skorlar ve leaderboard
5. **AI-Assisted Kategorilendirme** - Otomatik öneri + insan doğrulama
6. **Temporal Categories** - Zamansal alakalı kategoriler
7. **Kategori Savaşları** - Haftalık kategori yarışmaları
8. **Kişisel No-Trigger Modu** - Mental sağlık odaklı filtreleme

### Temel Kavramlar

- **Kategori**: Post'un konusu (Mizah, Spor, Teknoloji, vb.)
- **Vibe**: Post'un tonu/duygusu (Pozitif, Tartışmalı, Düşündürücü, vb.)
- **Vote (Oy)**: Kullanıcıların kategori/vibe doğruluğunu oylaması
- **Confidence (Güven)**: Kategori skorunun güvenilirliği (0-1 arası)
- **Weight (Ağırlık)**: Kategorinin post içindeki yüzdesi

---

## 🗄️ Veritabanı Yapısı

### Yeni Tablolar

#### 1. Categories (Kategoriler)
```prisma
model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  icon        String   // Emoji veya icon identifier
  color       String   // HEX color code
  description String?
  
  // Kategori tipleri
  type        CategoryType @default(STANDARD)
  
  // Temporal özellikler
  isActive    Boolean  @default(true)
  startDate   DateTime?
  endDate     DateTime?
  
  // İstatistikler
  postsCount  Int      @default(0)
  votesCount  Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  postCategories  PostCategory[]
  categoryVotes   CategoryVote[]
  userPreferences UserCategoryPreference[]
  
  @@map("categories")
}

enum CategoryType {
  STANDARD      // Sürekli kategoriler (Mizah, Spor, vb.)
  TEMPORAL      // Zamansal kategoriler (Dünya Kupası, vb.)
  TRENDING      // Trend kategoriler
  EVENT         // Özel etkinlik kategorileri
}
```

#### 2. Vibes (Ruh Halleri)
```prisma
model Vibe {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  icon        String   // Emoji
  color       String   // HEX color
  description String?
  
  isActive    Boolean  @default(true)
  postsCount  Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  postVibes    PostVibe[]
  vibeVotes    VibeVote[]
  userPreferences UserVibePreference[]
  
  @@map("vibes")
}
```

#### 3. PostCategory (Post-Kategori İlişkisi)
```prisma
model PostCategory {
  id          String   @id @default(uuid())
  postId      String
  categoryId  String
  
  // Skorlama
  voteCount   Int      @default(0)
  upvotes     Int      @default(0)
  downvotes   Int      @default(0)
  confidence  Float    @default(0.0)  // 0-1 arası
  weight      Float    @default(0.0)  // 0-100 arası, yüzde
  
  // AI önerisi mi?
  isAISuggested Boolean @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  votes       CategoryVote[]
  
  @@unique([postId, categoryId])
  @@index([postId])
  @@index([categoryId])
  @@map("post_categories")
}
```

#### 4. PostVibe (Post-Vibe İlişkisi)
```prisma
model PostVibe {
  id          String   @id @default(uuid())
  postId      String
  vibeId      String
  
  // Skorlama
  voteCount   Int      @default(0)
  upvotes     Int      @default(0)
  downvotes   Int      @default(0)
  confidence  Float    @default(0.0)
  weight      Float    @default(0.0)
  
  isAISuggested Boolean @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  vibe        Vibe     @relation(fields: [vibeId], references: [id], onDelete: Cascade)
  votes       VibeVote[]
  
  @@unique([postId, vibeId])
  @@index([postId])
  @@index([vibeId])
  @@map("post_vibes")
}
```

#### 5. CategoryVote (Kategori Oyları)
```prisma
model CategoryVote {
  id             String       @id @default(uuid())
  userId         String
  postCategoryId String
  voteType       VoteType     // UPVOTE veya DOWNVOTE
  
  createdAt      DateTime     @default(now())
  
  // Relations
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  postCategory   PostCategory @relation(fields: [postCategoryId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postCategoryId])
  @@index([userId])
  @@index([postCategoryId])
  @@map("category_votes")
}

enum VoteType {
  UPVOTE
  DOWNVOTE
}
```

#### 6. VibeVote (Vibe Oyları)
```prisma
model VibeVote {
  id         String   @id @default(uuid())
  userId     String
  postVibeId String
  voteType   VoteType
  
  createdAt  DateTime @default(now())
  
  // Relations
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postVibe   PostVibe @relation(fields: [postVibeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postVibeId])
  @@index([userId])
  @@index([postVibeId])
  @@map("vibe_votes")
}
```

#### 7. UserCategoryPreference (Kullanıcı Kategori Tercihleri)
```prisma
model UserCategoryPreference {
  id         String   @id @default(uuid())
  userId     String
  categoryId String
  
  // Feed mixer ayarları
  weight     Float    @default(0.0)  // 0-100 arası yüzde
  isBlocked  Boolean  @default(false) // Hiç gösterme
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relations
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  @@unique([userId, categoryId])
  @@index([userId])
  @@map("user_category_preferences")
}
```

#### 8. UserVibePreference (Kullanıcı Vibe Tercihleri)
```prisma
model UserVibePreference {
  id        String   @id @default(uuid())
  userId    String
  vibeId    String
  
  isBlocked Boolean  @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  vibe      Vibe     @relation(fields: [vibeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, vibeId])
  @@index([userId])
  @@map("user_vibe_preferences")
}
```

#### 9. UserGamification (Gamification - Rozetler ve Skorlar)
```prisma
model UserGamification {
  id     String @id @default(uuid())
  userId String @unique
  
  // Skorlar
  totalVotes          Int @default(0)
  accurateVotes       Int @default(0)
  categoryExpertiseScore Float @default(0.0)
  
  // Rozetler (JSON olarak saklanacak)
  badges              Json @default("[]")
  
  // Haftalık istatistikler
  weeklyVotes         Int @default(0)
  weeklyAccuracy      Float @default(0.0)
  
  // Leaderboard pozisyonu
  rank                Int? 
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relations
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([categoryExpertiseScore])
  @@index([rank])
  @@map("user_gamification")
}
```

#### 10. CategoryBattle (Kategori Savaşları)
```prisma
model CategoryBattle {
  id            String   @id @default(uuid())
  name          String
  description   String?
  
  category1Id   String
  category2Id   String
  
  // Skorlar
  category1Score Int    @default(0)
  category2Score Int    @default(0)
  
  // Tarihler
  startDate     DateTime
  endDate       DateTime
  
  status        BattleStatus @default(UPCOMING)
  winnerId      String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  category1     Category @relation("BattleCategory1", fields: [category1Id], references: [id])
  category2     Category @relation("BattleCategory2", fields: [category2Id], references: [id])
  
  @@index([startDate])
  @@index([status])
  @@map("category_battles")
}

enum BattleStatus {
  UPCOMING
  ACTIVE
  COMPLETED
}
```

### Mevcut Tablolara Eklemeler

#### Post Tablosuna Eklemeler
```prisma
model Post {
  // ... mevcut alanlar ...
  
  // Yeni alanlar
  categoryScore      Float @default(0.0)  // Genel kategori güven skoru
  vibeScore          Float @default(0.0)  // Genel vibe güven skoru
  totalCategoryVotes Int   @default(0)
  totalVibeVotes     Int   @default(0)
  
  // Yeni relations
  postCategories PostCategory[]
  postVibes      PostVibe[]
}
```

#### User Tablosuna Eklemeler
```prisma
model User {
  // ... mevcut alanlar ...
  
  // Yeni relations
  categoryVotes          CategoryVote[]
  vibeVotes              VibeVote[]
  categoryPreferences    UserCategoryPreference[]
  vibePreferences        UserVibePreference[]
  gamification           UserGamification?
}
```

---

## 🔧 Backend Implementasyonu

### API Endpoints

#### 1. Kategori Yönetimi

```typescript
// GET /api/categories - Tüm kategorileri getir
// GET /api/categories/:id - Tek kategori detayı
// POST /api/categories - Yeni kategori oluştur (Admin)
// PUT /api/categories/:id - Kategori güncelle (Admin)
// DELETE /api/categories/:id - Kategori sil (Admin)

// GET /api/categories/trending - Trend kategoriler
// GET /api/categories/temporal - Zamansal kategoriler
```

#### 2. Vibe Yönetimi

```typescript
// GET /api/vibes - Tüm vibe'ları getir
// POST /api/vibes - Yeni vibe oluştur (Admin)
```

#### 3. Post Kategorilendirme

```typescript
// POST /api/posts/:postId/categories - Post'a kategori ekle
// DELETE /api/posts/:postId/categories/:categoryId - Kategoriyi kaldır
// POST /api/posts/:postId/categories/:categoryId/vote - Kategori oylaması
// GET /api/posts/:postId/categories - Post'un kategorilerini getir

// POST /api/posts/:postId/vibes - Post'a vibe ekle
// POST /api/posts/:postId/vibes/:vibeId/vote - Vibe oylaması
// GET /api/posts/:postId/vibes - Post'un vibe'larını getir
```

#### 4. Kullanıcı Tercihleri

```typescript
// GET /api/users/me/preferences - Kullanıcı tercihlerini getir
// PUT /api/users/me/preferences/categories - Kategori tercihlerini güncelle
// PUT /api/users/me/preferences/vibes - Vibe tercihlerini güncelle
// POST /api/users/me/preferences/block-category - Kategori engelle
// POST /api/users/me/preferences/block-vibe - Vibe engelle
```

#### 5. Feed Mixer

```typescript
// GET /api/feed/mixed - Kişiselleştirilmiş feed
// Query params:
//   - categories: string[] (kategori filtreleri)
//   - vibes: string[] (vibe filtreleri)
//   - mode: 'balanced' | 'soft' | 'focus' (No-trigger modları)
```

#### 6. Gamification

```typescript
// GET /api/gamification/me - Kendi gamification skorlarım
// GET /api/gamification/leaderboard - Lider tablosu
// GET /api/gamification/badges - Mevcut rozetler
```

#### 7. Kategori Savaşları

```typescript
// GET /api/battles - Aktif savaşları getir
// GET /api/battles/:id - Savaş detayı
// POST /api/battles - Yeni savaş oluştur (Admin)
// GET /api/battles/history - Geçmiş savaşlar
```

### Servis Katmanı

```typescript
// services/category.service.ts
// services/vibe.service.ts
// services/categorization.service.ts
// services/feed-mixer.service.ts
// services/gamification.service.ts
// services/battle.service.ts
```

### Skorlama Algoritmaları

#### Kategori Güven Skoru Hesaplama
```typescript
function calculateConfidence(upvotes: number, downvotes: number): number {
  const total = upvotes + downvotes
  if (total === 0) return 0
  
  const ratio = upvotes / total
  const confidence = ratio * Math.min(1, total / 10) // Min 10 oy için full güven
  
  return confidence
}

function calculateWeight(categoryConfidences: Array<{categoryId: string, confidence: number}>): Array<{categoryId: string, weight: number}> {
  const totalConfidence = categoryConfidences.reduce((sum, c) => sum + c.confidence, 0)
  
  if (totalConfidence === 0) {
    return categoryConfidences.map(c => ({ categoryId: c.categoryId, weight: 0 }))
  }
  
  return categoryConfidences.map(c => ({
    categoryId: c.categoryId,
    weight: (c.confidence / totalConfidence) * 100
  }))
}
```

#### Feed Mixer Algoritması
```typescript
function mixFeed(
  posts: Post[],
  userPreferences: UserCategoryPreference[],
  mode: 'normal' | 'soft' | 'focus'
): Post[] {
  // 1. Engellenen kategorileri filtrele
  const blockedCategories = userPreferences
    .filter(p => p.isBlocked)
    .map(p => p.categoryId)
  
  let filtered = posts.filter(post => {
    return !post.postCategories.some(pc => 
      blockedCategories.includes(pc.categoryId)
    )
  })
  
  // 2. Mode'a göre ek filtreleme
  if (mode === 'soft') {
    filtered = filtered.filter(post => {
      const positiveVibes = post.postVibes.filter(pv => 
        pv.vibe.slug === 'positive' || pv.vibe.slug === 'uplifting'
      )
      return positiveVibes.length > 0
    })
  }
  
  // 3. Kullanıcı tercihlerine göre skorla ve sırala
  const scored = filtered.map(post => {
    let score = 0
    
    post.postCategories.forEach(pc => {
      const pref = userPreferences.find(p => p.categoryId === pc.categoryId)
      if (pref) {
        score += (pref.weight * pc.weight) / 100
      }
    })
    
    return { post, score }
  })
  
  // 4. Skora göre sırala
  scored.sort((a, b) => b.score - a.score)
  
  return scored.map(s => s.post)
}
```

---

## 🎨 Frontend Implementasyonu

### Yeni Bileşenler

#### 1. Kategori Oylama Bileşeni
```typescript
// components/post/category-voting.tsx
// Post altında kategori öneri ve oylama UI'ı
```

#### 2. Vibe Seçici
```typescript
// components/post/vibe-selector.tsx
// Post oluştururken vibe seçimi
```

#### 3. Feed Mixer Ayarları
```typescript
// components/feed/feed-mixer-settings.tsx
// Kullanıcının feed tercihlerini ayarlama paneli
```

#### 4. Gamification Dashboard
```typescript
// components/gamification/user-stats.tsx
// components/gamification/leaderboard.tsx
// components/gamification/badge-showcase.tsx
```

#### 5. Kategori Savaşları Widget
```typescript
// components/battles/active-battle-card.tsx
// components/battles/battle-leaderboard.tsx
```

### Redux Store Güncellemeleri

```typescript
// store/slices/category-slice.ts
// store/slices/preference-slice.ts
// store/slices/gamification-slice.ts
```

### API İstemcileri

```typescript
// lib/api/categories.ts
// lib/api/vibes.ts
// lib/api/preferences.ts
// lib/api/gamification.ts
// lib/api/battles.ts
```

---

## 🎯 Özellik Detayları

### 1. Dinamik Kategori Skorlaması

**Nasıl Çalışır:**
1. Kullanıcı post oluşturur
2. İlk 3 kategori otomatik önerilir (AI-assisted)
3. Diğer kullanıcılar bu kategorilere oy verir
4. Her kategori için güven skoru ve ağırlık hesaplanır
5. Post, dominant kategorilerde gösterilir

**UI Flow:**
- Post altında "🏷️ Kategorileri Onayla" butonu
- Tıklanınca modal açılır
- Mevcut kategoriler gösterilir (👍/👎 butonları)
- "➕ Başka Kategori Ekle" seçeneği

### 2. Vibe Check Sistemi

**Başlangıç Vibe'ları:**
- 😊 Pozitif (positive)
- 🔥 Tartışmalı (controversial)
- 💭 Düşündürücü (thoughtful)
- 😂 Eğlenceli (fun)
- 😢 Üzücü (sad)
- 💢 Öfke (angry)

**UI Flow:**
- Post oluştururken vibe seçimi (opsiyonel)
- Post altında "Bu post nasıl hissettirdi?" anketi
- Swipe up/down ile hızlı vibe oylaması

### 3. Smart Feed Mixer

**Ayarlar Sayfası:**
```
🎛️ Feed Karışımım

Kategori Ağırlıkları:
🎭 Mizah:        [========>---] 40%
⚽ Spor:         [======>-----] 30%
🎨 Sanat:        [====>-------] 20%
🍴 Yemek:        [==>---------] 10%

❌ Engellenmiş Kategoriler:
- Siyaset
- Nefret Söylemi

Mod Seçimi:
○ Normal
○ Yumuşak (Sadece pozitif)
● Dengeli (Önerilen)
```

### 4. Kategori Keşif Gamification

**Rozetler:**
- 🥉 Acemi Kategorizör (50 oy)
- 🥈 Kategori Meraklısı (200 oy)
- 🥇 Kategori Ustası (1000 oy)
- 🎭 Mizah Uzmanı (Mizah kategorisinde %90+ doğruluk)
- ⚽ Spor Hakemi (Spor kategorisinde %90+ doğruluk)

**Skorlama:**
```
Doğruluk Skoru = (Doğru Oylar / Toplam Oylar) * 100
Expertise Skoru = Doğruluk Skoru * log(Toplam Oylar)
```

### 5. AI-Assisted Kategorilendirme

**İlk Aşama (Basit):**
- Keyword matching ile otomatik öneriler
- Hashtag parse etme
- Emoji analizi

**Gelecek (OpenAI/Claude API):**
- GPT-4 ile içerik analizi
- Çok dilli destek
- Context-aware kategorilendirme

### 6. Temporal Categories

**Örnekler:**
- ⚽ Dünya Kupası 2026 (01.06.2026 - 15.07.2026)
- 🎄 Yılbaşı 2025 (15.12.2025 - 05.01.2026)
- 🎓 YKS 2025 (01.05.2025 - 30.06.2025)

**Otomatik Yönetim:**
- Tarih geçince kategori pasif olur
- Feed'de görünmez hale gelir
- Arşivlenir

### 7. Kategori Savaşları

**Haftalık Format:**
- Pazartesi: Savaş başlar
- Pazar: Savaş biter, kazanan açıklanır

**Skorlama:**
- Her kategorideki post etkileşimi puanlanır
- Engagement = (Likes * 1) + (Comments * 2) + (Shares * 3)
- Kazanan kategori bir hafta "🏆 Şampiyon" rozeti alır

### 8. Kişisel No-Trigger Modu

**3 Mod:**
1. **Normal:** Tüm içerik gösterilir
2. **Yumuşak:** Sadece pozitif vibe'lı içerik
3. **Odaklanma:** Sadece eğitici/yapıcı içerik

**Mental Sağlık Bildirimi:**
```
🧘 Zihin Sağlığınız Önemli
Rahatsız edici içeriklerden uzak durmak istiyorsanız,
"Yumuşak Mod"u deneyebilirsiniz.
```

---

## 📝 Adım Adım Uygulama Planı

### PHASE 1: Veritabanı ve Temel Backend (Adım 1-3)

**Adım 1: Prisma Şemasını Güncelle**
- [ ] Tüm yeni modelleri ekle
- [ ] Mevcut modellere relation'ları ekle
- [ ] Migration oluştur ve çalıştır

**Adım 2: Seed Data Oluştur**
- [ ] Başlangıç kategorileri (10 adet)
- [ ] Başlangıç vibe'ları (6 adet)
- [ ] Seed script yaz ve çalıştır

**Adım 3: Kategori ve Vibe Servisleri**
- [ ] `category.service.ts` oluştur
- [ ] `vibe.service.ts` oluştur
- [ ] CRUD işlemleri implement et

### PHASE 2: Post Kategorilendirme (Adım 4-6)

**Adım 4: Kategorilendirme Servisi**
- [ ] `categorization.service.ts` oluştur
- [ ] Post'a kategori ekleme fonksiyonu
- [ ] Kategori skorlama algoritması
- [ ] Weight hesaplama fonksiyonu

**Adım 5: Oylama Sistemi**
- [ ] Kategori oylama endpoint'leri
- [ ] Vibe oylama endpoint'leri
- [ ] Vote güncelleme fonksiyonları
- [ ] Confidence hesaplama

**Adım 6: Post API Güncellemeleri**
- [ ] `getPosts` içinde kategorileri include et
- [ ] `createPost` içinde otomatik kategori önerisi
- [ ] Post response'una kategori/vibe bilgilerini ekle

### PHASE 3: Feed Mixer (Adım 7-9)

**Adım 7: Kullanıcı Tercihleri Servisi**
- [ ] `user-preference.service.ts` oluştur
- [ ] Tercih kaydetme/güncelleme
- [ ] Engelleme fonksiyonları

**Adım 8: Feed Mixer Algoritması**
- [ ] `feed-mixer.service.ts` oluştur
- [ ] Skorlama algoritması
- [ ] Filtreleme (blocked categories)
- [ ] Mode implementasyonu (soft, focus)

**Adım 9: Feed Mixer API**
- [ ] `/api/feed/mixed` endpoint
- [ ] Kullanıcı tercih API'leri
- [ ] Query parameter handling

### PHASE 4: Gamification (Adım 10-11)

**Adım 10: Gamification Servisi**
- [ ] `gamification.service.ts` oluştur
- [ ] Skor hesaplama fonksiyonları
- [ ] Rozet sistemi
- [ ] Leaderboard algoritması

**Adım 11: Gamification API**
- [ ] Kullanıcı istatistikleri endpoint
- [ ] Leaderboard endpoint
- [ ] Rozet listesi endpoint

### PHASE 5: Advanced Features (Adım 12-13)

**Adım 12: Temporal Categories**
- [ ] Tarih kontrolü fonksiyonları
- [ ] Otomatik aktif/pasif güncelleme
- [ ] Cron job için endpoint

**Adım 13: Kategori Savaşları**
- [ ] `battle.service.ts` oluştur
- [ ] Savaş oluşturma/yönetme
- [ ] Skorlama sistemi
- [ ] Kazanan belirleme algoritması

### PHASE 6: Frontend UI (Adım 14-20)

**Adım 14: Kategori Oylama UI**
- [ ] `category-voting.tsx` bileşeni
- [ ] Modal/Sheet tasarımı
- [ ] API entegrasyonu

**Adım 15: Vibe UI**
- [ ] `vibe-selector.tsx` bileşeni
- [ ] `vibe-voting.tsx` bileşeni
- [ ] Emoji picker entegrasyonu

**Adım 16: Post Card Güncellemeleri**
- [ ] Kategorileri göster (pills)
- [ ] Vibe indicator'ları ekle
- [ ] Oylama butonları ekle

**Adım 17: Post Oluşturma Güncellemesi**
- [ ] Kategori seçimi ekle
- [ ] Vibe seçimi ekle
- [ ] Öneri sistemi UI

**Adım 18: Feed Mixer Ayarları**
- [ ] `feed-mixer-settings.tsx` sayfası
- [ ] Slider'lar ile ağırlık ayarlama
- [ ] Engelleme UI'ı
- [ ] Mod seçici

**Adım 19: Gamification UI**
- [ ] `user-stats.tsx` bileşeni
- [ ] `leaderboard.tsx` sayfası
- [ ] `badge-showcase.tsx` bileşeni
- [ ] Profil sayfasına rozetleri ekle

**Adım 20: Kategori Savaşları UI**
- [ ] `active-battle-card.tsx` widget
- [ ] `battle-detail.tsx` sayfası
- [ ] Savaş geçmişi sayfası

### PHASE 7: Test ve Optimizasyon (Adım 21-22)

**Adım 21: Test ve Debug**
- [ ] Backend API testleri
- [ ] Frontend component testleri
- [ ] Integration testleri
- [ ] Performance optimizasyonu

**Adım 22: Dökümentasyon ve Son Rötuşlar**
- [ ] API dökümentasyonu
- [ ] Kullanıcı rehberi
- [ ] Admin paneli (kategori yönetimi)

---

## 🚀 Hızlı Başlangıç Komutları

### Backend
```bash
cd backend

# Prisma şemasını güncelle
npx prisma migrate dev --name add_category_system

# Seed data çalıştır
npx prisma db seed

# Server başlat
npm run dev
```

### Frontend
```bash
cd frontend

# Bağımlılıkları kur (gerekirse)
npm install

# Development server başlat
npm run dev
```

---

## 📊 Beklenen Sonuçlar

### Kullanıcı Deneyimi İyileştirmeleri
- ✅ Daha alakalı içerik keşfi
- ✅ Kişiselleştirilmiş feed deneyimi
- ✅ Mental sağlık dostu filtreleme
- ✅ Eğlenceli gamification unsurları

### Rakiplerden Ayrışma
- ✅ Topluluk odaklı kategorilendirme (vs hashtag'ler)
- ✅ Çok boyutlu içerik etiketleme (kategori + vibe)
- ✅ Akıllı feed mixer algoritması
- ✅ Sosyal kategori savaşları

### Teknik Kazanımlar
- ✅ Ölçeklenebilir veritabanı yapısı
- ✅ Esnek skorlama algoritmaları
- ✅ Modern React bileşen mimarisi
- ✅ Type-safe API yapısı

---

## 📚 Referanslar

- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Redux Toolkit:** https://redux-toolkit.js.org
- **shadcn/ui:** https://ui.shadcn.com

---

**Not:** Bu döküman sürekli güncellenecektir. Her aşama tamamlandıkça checkbox'lar işaretlenecektir.

**Son Güncelleme:** 6 Ekim 2025

