# MIZMIZ - Kodlama Standartları & Proje Yapısı

## 1. Genel Yaklaşım

### 1.1 Temel Prensipler
- **Dil:** Tüm kod TypeScript ile yazılmalıdır
- **Framework:** Next.js (App Router), React, Shadcn UI, Radix UI, Tailwind CSS, Redux Toolkit
- **Programlama Tarzı:** Fonksiyonel ve deklaratif - sınıflardan kaçınılmalıdır
- **Kod Organizasyonu:** Her dosyada sıralama şu şekilde olmalıdır:
  1. Import'lar
  2. Ana bileşen/fonksiyon
  3. Alt bileşenler
  4. Yardımcı fonksiyonlar
  5. Statik içerik ve sabitler
  6. Type/Interface tanımları

### 1.2 Proje Felsefesi
- **Clean Code:** Okunabilir, bakımı kolay ve test edilebilir kod yazın
- **DRY (Don't Repeat Yourself):** Kod tekrarından kaçının
- **SOLID Prensipleri:** Özellikle Single Responsibility ve Dependency Inversion
- **Composition over Inheritance:** Bileşenleri birleştirerek karmaşık yapılar oluşturun

---

## 2. Dosya ve Dizin Yapısı

### 2.1 Dizin Adlandırma
- **Format:** Küçük harf + tire (kebab-case)
- **Örnekler:**
  ```
  ✅ components/auth-wizard
  ✅ components/user-profile
  ✅ components/post-card
  
  ❌ components/AuthWizard
  ❌ components/userProfile
  ❌ components/post_card
  ```

### 2.2 Dosya Yapısı

#### Frontend Yapısı
```
frontend/src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group - authentication
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                   # Route group - main app
│   │   ├── feed/
│   │   ├── profile/
│   │   └── explore/
│   ├── api/                      # API routes (eğer gerekirse)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                   # React bileşenleri
│   ├── ui/                       # Shadcn UI bileşenleri
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── auth/                     # Auth ile ilgili bileşenler
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── post/                     # Post ile ilgili bileşenler
│   │   ├── post-card.tsx
│   │   ├── post-list.tsx
│   │   └── create-post.tsx
│   ├── profile/
│   ├── layout/                   # Layout bileşenleri
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── shared/                   # Paylaşılan bileşenler
│       ├── loading.tsx
│       └── error-boundary.tsx
│
├── lib/                          # Yardımcı kütüphaneler
│   ├── api/                      # API client fonksiyonları
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── utils/                    # Utility fonksiyonlar
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── cn.ts                 # classNames utility
│   └── constants/                # Sabitler
│       ├── routes.ts
│       └── config.ts
│
├── store/                        # Redux Toolkit
│   ├── slices/
│   │   ├── auth-slice.ts
│   │   ├── post-slice.ts
│   │   └── user-slice.ts
│   ├── hooks.ts                  # Typed Redux hooks
│   └── store.ts                  # Store configuration
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-posts.ts
│   └── use-media-query.ts
│
├── interfaces/                   # TypeScript interfaces
│   ├── user.interface.ts
│   ├── post.interface.ts
│   └── api.interface.ts
│
└── styles/
    └── globals.css               # Global styles
```

#### Backend Yapısı
```
backend/src/
├── config/                       # Konfigürasyon
│   ├── database.ts
│   ├── jwt.ts
│   └── env.ts
│
├── middleware/                   # Express middleware'leri
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validation.middleware.ts
│   └── upload.middleware.ts
│
├── models/                       # Database modelleri
│   ├── user.model.ts
│   ├── post.model.ts
│   └── comment.model.ts
│
├── controllers/                  # Route controller'ları
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── post.controller.ts
│
├── services/                     # Business logic
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── post.service.ts
│
├── routes/                       # API route'ları
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── post.routes.ts
│
├── utils/                        # Yardımcı fonksiyonlar
│   ├── hash.ts
│   ├── validation.ts
│   └── response.ts
│
├── interfaces/                   # TypeScript interfaces
│   ├── user.interface.ts
│   └── request.interface.ts
│
└── server.ts                     # Ana server dosyası
```

### 2.3 Bileşen Organizasyonu
Her bileşen kendi dosyasında olmalı ve **named export** kullanmalıdır:

```typescript
// ✅ Doğru
// components/post/post-card.tsx
export function PostCard({ post }: PostCardProps) {
  return <div>...</div>
}

// ❌ Yanlış
export default function PostCard() { ... }
```

---

## 3. Adlandırma Kuralları

### 3.1 Genel Kurallar

| Öğe | Format | Örnek |
|-----|--------|-------|
| Dizinler | kebab-case | `user-profile`, `auth-wizard` |
| Dosyalar | kebab-case | `post-card.tsx`, `use-auth.ts` |
| Bileşenler | PascalCase | `PostCard`, `UserProfile` |
| Fonksiyonlar | camelCase | `getUserById`, `formatDate` |
| Değişkenler | camelCase | `userData`, `isLoading` |
| Sabitler | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| Interface | PascalCase + Interface suffix | `UserInterface`, `PostInterface` |

### 3.2 Boolean Değişkenler
Boolean değişkenler için yardımcı fiil kullanın:

```typescript
// ✅ Doğru
const isLoading = true
const hasError = false
const canEdit = true
const shouldUpdate = false

// ❌ Yanlış
const loading = true
const error = false
const edit = true
```

### 3.3 Fonksiyon İsimlendirme
Fonksiyonlar eylemi açıkça belirtmeli:

```typescript
// ✅ Doğru
function getUserById(id: string) { }
function createPost(data: PostInterface) { }
function deleteComment(id: string) { }
function validateEmail(email: string) { }

// ❌ Yanlış
function user(id: string) { }
function post(data: PostInterface) { }
function comment(id: string) { }
```

---

## 4. TypeScript Kullanımı

### 4.1 Temel Kurallar
- ✅ **SADECE `interface` kullanın** - `type` ve `enum` yasaktır
- ✅ Sabitler için `Map` veya obje kullanın
- ✅ Her fonksiyon parametresi tiplenmelidir
- ✅ Return type'ları açıkça belirtin
- ✅ `any` kullanımından kaçının

### 4.2 Interface Tanımlama

```typescript
// ✅ Doğru
interface UserInterface {
  id: string
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface PostInterface {
  id: string
  userId: string
  content: string
  imageUrl?: string  // Optional property
  likes: number
  createdAt: Date
}

interface PostCardProps {
  post: PostInterface
  onLike: (postId: string) => void
  onComment: (postId: string) => void 
}

// ❌ Yanlış - type kullanımı
type User = {
  id: string
  username: string
}

// ❌ Yanlış - enum kullanımı
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
```

### 4.3 Sabitler için Map Kullanımı

```typescript
// ✅ Doğru - Map ile sabitler
const USER_ROLES = new Map([
  ['ADMIN', 'admin'],
  ['USER', 'user'],
  ['MODERATOR', 'moderator']
])

const API_ENDPOINTS = new Map([
  ['AUTH', '/api/auth'],
  ['POSTS', '/api/posts'],
  ['USERS', '/api/users']
])

// Kullanım
const adminRole = USER_ROLES.get('ADMIN')

// Alternatif: Const object (sadece basit durumlar için)
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401
} as const
```

---

## 5. React ve Bileşen Kuralları

### 5.1 Fonksiyon Bildirimi
Her zaman `function` anahtar kelimesi kullanın:

```typescript
// ✅ Doğru
export function PostCard({ post }: PostCardProps) {
  return <div>{post.content}</div>
}

function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

// ❌ Yanlış - arrow function ile bileşen
const PostCard = ({ post }: PostCardProps) => {
  return <div>{post.content}</div>
}
```

### 5.2 Props ve State Tiplendirme

```typescript
// ✅ Doğru
interface ButtonProps {
  text: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ text, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}

// State ile
interface FormState {
  email: string
  password: string
  errors: Record<string, string>
}

export function LoginForm() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    errors: {}
  })
  
  // ...
}
```

### 5.3 Dosya Yapısı Örneği

```typescript
// components/post/post-card.tsx
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 1. Ana bileşen
export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  
  function handleLike() {
    setIsLiked(!isLiked)
    onLike(post.id)
  }
  
  return (
    <Card>
      <PostHeader user={post.user} />
      <PostContent content={post.content} />
      <PostActions onLike={handleLike} isLiked={isLiked} />
    </Card>
  )
}

// 2. Alt bileşenler
function PostHeader({ user }: PostHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <img src={user.avatar} alt={user.username} />
      <span>{user.username}</span>
    </div>
  )
}

function PostContent({ content }: PostContentProps) {
  return <p>{content}</p>
}

function PostActions({ onLike, isLiked }: PostActionsProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onLike}>
        {isLiked ? '❤️' : '🤍'}
      </Button>
    </div>
  )
}

// 3. Yardımcı fonksiyonlar
function formatTimestamp(date: Date): string {
  return new Intl.RelativeTimeFormat('tr').format(
    Math.floor((date.getTime() - Date.now()) / 1000),
    'second'
  )
}

// 4. Interface'ler (dosyanın sonunda)
interface PostCardProps {
  post: PostInterface
  onLike: (postId: string) => void
  onComment: (postId: string) => void
}

interface PostHeaderProps {
  user: UserInterface
}

interface PostContentProps {
  content: string
}

interface PostActionsProps {
  onLike: () => void
  isLiked: boolean
}
```

---

## 6. JSX ve UI Kuralları

### 6.1 JSX Yazımı
- Deklaratif ve okunabilir olmalıdır
- Kısa koşullar için gereksiz süslü parantezlerden kaçının
- Shadcn UI ve Radix UI bileşenlerini kullanın

```typescript
// ✅ Doğru
export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{user.username[0]}</AvatarFallback>
      </Avatar>
      
      {user.bio && (
        <p className="text-sm text-muted-foreground">{user.bio}</p>
      )}
      
      <div className="flex gap-4">
        <span>{user.followersCount} Takipçi</span>
        <span>{user.followingCount} Takip</span>
      </div>
    </div>
  )
}

// ❌ Yanlış
export function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      {user.bio ? (
        <p>{user.bio}</p>
      ) : null}
    </div>
  )
}
```

### 6.2 Tailwind CSS Kuralları
- Mobile-first yaklaşım kullanın
- Utility-first pattern'i benimseyin
- Custom sınıflardan kaçının

```typescript
// ✅ Doğru - Mobile first
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  <div className="w-full md:w-1/2 lg:w-1/3">
    ...
  </div>
</div>

// ❌ Yanlış - Desktop first
<div className="lg:flex lg:gap-8 md:gap-6 gap-4">
  ...
</div>
```

### 6.3 Responsive Tasarım
Her bileşen mobilde düzgün çalışmalıdır:

```typescript
export function Navigation() {
  return (
    <nav className="
      fixed bottom-0 w-full 
      md:static md:w-auto
      bg-background border-t md:border-0
      p-4
    ">
      <ul className="flex justify-around md:justify-start md:gap-6">
        <li>Ana Sayfa</li>
        <li>Keşfet</li>
        <li>Profil</li>
      </ul>
    </nav>
  )
}
```

---

## 7. Performans ve Optimizasyon

### 7.1 use client Kullanımı
- **Minimum kullanın**
- Sadece Web API erişimi gereken küçük bileşenlerde kullanın
- Veri çekme ve state yönetimi için KULLANMAYIN

```typescript
// ✅ Doğru - Küçük interaktif bileşen
// components/ui/theme-toggle.tsx
'use client'

export function ThemeToggle() {
  const [theme, setTheme] = useState('light')
  
  function toggle() {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }
  
  return <button onClick={toggle}>Toggle Theme</button>
}

// ✅ Doğru - Server component (varsayılan)
// components/post/post-list.tsx
export async function PostList() {
  const posts = await fetchPosts() // Server-side
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// ❌ Yanlış - Gereksiz use client
'use client'
export function PostList() {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetchPosts().then(setPosts)
  }, [])
  
  return <div>...</div>
}
```

### 7.2 React Server Components (RSC)
- Varsayılan olarak tercih edin
- Veri çekme işlemlerini server'da yapın
- Client component'leri mümkün olduğunca küçük tutun

### 7.3 Suspense Kullanımı

```typescript
// app/feed/page.tsx
import { Suspense } from 'react'

export default function FeedPage() {
  return (
    <div>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}
```

### 7.4 Görsel Optimizasyonu

```typescript
import Image from 'next/image'

export function PostImage({ src, alt }: PostImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={400}
      format="webp"
      loading="lazy"
      className="rounded-lg"
    />
  )
}
```

### 7.5 Dinamik Yükleme

```typescript
import dynamic from 'next/dynamic'

const CommentSection = dynamic(() => import('@/components/post/comment-section'), {
  loading: () => <CommentSectionSkeleton />,
  ssr: false
})

export function PostDetails({ post }: PostDetailsProps) {
  return (
    <div>
      <PostCard post={post} />
      <CommentSection postId={post.id} />
    </div>
  )
}
```

---

## 8. State ve URL Yönetimi

### 8.1 URL Parametreleri (nuqs)

```typescript
import { useQueryState } from 'nuqs'

export function SearchPage() {
  const [query, setQuery] = useQueryState('q')
  const [filter, setFilter] = useQueryState('filter')
  
  return (
    <div>
      <input 
        value={query || ''} 
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  )
}
```

### 8.2 State Yönetimi Öncelikleri
1. **Server Component** (en tercih edilen)
2. **URL State** (nuqs ile)
3. **Local State** (useState)
4. **Redux Toolkit** (global state için)

```typescript
// ✅ Doğru - Server component ile
export async function UserProfile({ userId }: UserProfileProps) {
  const user = await fetchUser(userId)
  return <div>{user.name}</div>
}

// ✅ Doğru - URL state ile
function SearchResults() {
  const [query] = useQueryState('q')
  return <Results query={query} />
}

// ✅ Doğru - Local state ile
function CommentForm() {
  const [comment, setComment] = useState('')
  return <textarea value={comment} onChange={e => setComment(e.target.value)} />
}

// ✅ Doğru - Redux ile (global state)
function Header() {
  const user = useAppSelector(state => state.auth.user)
  return <div>{user?.name}</div>
}
```

---

## 9. Backend Standartları

### 9.1 Express Route Yapısı

```typescript
// routes/post.routes.ts
import { Router } from 'express'
import { authMiddleware } from '@/middleware/auth.middleware'
import { PostController } from '@/controllers/post.controller'

const router = Router()

router.get('/', PostController.getAllPosts)
router.get('/:id', PostController.getPostById)
router.post('/', authMiddleware, PostController.createPost)
router.put('/:id', authMiddleware, PostController.updatePost)
router.delete('/:id', authMiddleware, PostController.deletePost)

export default router
```

### 9.2 Controller Yapısı

```typescript
// controllers/post.controller.ts
import { Request, Response } from 'express'
import { PostService } from '@/services/post.service'

export class PostController {
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await PostService.getAllPosts()
      res.status(200).json({
        success: true,
        data: posts
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gönderiler alınırken hata oluştu'
      })
    }
  }
  
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await PostService.createPost(req.body, req.user.id)
      res.status(201).json({
        success: true,
        data: post
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gönderi oluşturulurken hata oluştu'
      })
    }
  }
}
```

### 9.3 Service Yapısı

```typescript
// services/post.service.ts
import { Post } from '@/models/post.model'

export class PostService {
  static async getAllPosts(): Promise<PostInterface[]> {
    return await Post.find().populate('user').sort({ createdAt: -1 })
  }
  
  static async createPost(data: CreatePostDto, userId: string): Promise<PostInterface> {
    const post = new Post({
      ...data,
      userId,
      createdAt: new Date()
    })
    return await post.save()
  }
}
```

---

## 10. Test ve Kalite

### 10.1 Linting
- ESLint kullanın
- Prettier ile format yapın
- Her commit'te lint kontrolü

### 10.2 Commit Mesajları
Conventional Commits formatını kullanın:

```
feat: Yeni özellik eklendi
fix: Hata düzeltildi
docs: Dokümantasyon güncellendi
style: Stil değişikliği
refactor: Kod yeniden yapılandırıldı
test: Test eklendi
chore: Bakım işlemi
```

### 10.3 Code Review Checklist
- ✅ TypeScript hataları yok mu?
- ✅ Linter hataları yok mu?
- ✅ Interface kullanımı doğru mu?
- ✅ Named export kullanılmış mı?
- ✅ Fonksiyon bildirimi (`function`) kullanılmış mı?
- ✅ Responsive tasarım var mı?
- ✅ Performance optimizasyonları yapılmış mı?

---

## Özet Kontrol Listesi

**✅ YAPILMASI GEREKENLER:**
- TypeScript kullan
- Interface kullan (type ve enum YASAK)
- Named export kullan
- Function declaration kullan
- Mobile-first responsive tasarım
- Server Components tercih et
- Anlamlı değişken isimleri (isLoading, hasError)
- Tailwind CSS kullan
- kebab-case dizin/dosya isimleri
- PascalCase bileşen isimleri

**❌ YAPILMAMASI GEREKENLER:**
- type veya enum kullanma
- Default export kullanma
- Arrow function ile bileşen tanımlama
- use client'ı gereksiz kullanma
- Desktop-first tasarım
- any tipini kullanma
- Kod tekrarı yapma
- Anlaşılmaz kısaltmalar kullanma

---

Bu standartlara uyarak, temiz, bakımı kolay ve performanslı bir kod tabanı oluşturacağız! 🚀

