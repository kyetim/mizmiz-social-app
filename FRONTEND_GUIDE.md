# MIZMIZ - Frontend Geliştirme Rehberi

## 🎯 Genel Bakış

Modern, performanslı ve kullanıcı dostu bir frontend geliştirme rehberi.

---

## 🛠️ Teknoloji Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI + Radix UI
- **Animation:** Framer Motion
- **3D:** Three.js + React Three Fiber
- **State Management:** Redux Toolkit
- **URL State:** nuqs
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

---

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (main)/            # Main app route group
│   │   │   ├── feed/
│   │   │   ├── profile/[id]/
│   │   │   ├── explore/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                # Shadcn UI components
│   │   ├── auth/
│   │   ├── post/
│   │   ├── profile/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── api/               # API client
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── store/                 # Redux
│   │   ├── slices/
│   │   ├── hooks.ts
│   │   └── store.ts
│   │
│   ├── hooks/                 # Custom hooks
│   ├── interfaces/            # TypeScript interfaces
│   └── styles/
│
├── public/
│   ├── images/
│   └── fonts/
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Kurulum

### 1. Next.js Projesi Oluştur

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
cd frontend
```

### 2. Bağımlılıkları Yükle

```bash
# UI Libraries
npx shadcn-ui@latest init
npm install framer-motion
npm install three @react-three/fiber @react-three/drei

# State Management
npm install @reduxjs/toolkit react-redux
npm install nuqs

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# HTTP & Utils
npm install axios
npm install clsx tailwind-merge
npm install react-hot-toast
npm install react-intersection-observer

# Icons
npm install lucide-react

# Dev Dependencies
npm install -D @types/three
```

### 3. Environment Variables

`.env.local` dosyası:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Tailwind Konfigürasyonu

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        accent: '#FFAD1F',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

---

## 🎨 UI Bileşenleri (Shadcn UI)

### Gerekli Bileşenleri Yükle

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
```

### Örnek Bileşen Kullanımı

```typescript
// components/post/post-card.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.user.avatarUrl} />
          <AvatarFallback>{post.user.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.user.username}</p>
          <p className="text-sm text-muted-foreground">2 hours ago</p>
        </div>
      </CardHeader>
      
      <CardContent>
        <p>{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" className="mt-4 rounded-lg" />
        )}
      </CardContent>
      
      <CardFooter className="flex gap-4">
        <Button variant="ghost" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          {post.likesCount}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          {post.commentsCount}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

interface PostCardProps {
  post: PostInterface
}
```

---

## 🎭 Animasyonlar (Framer Motion)

### Page Transitions

```typescript
// app/layout.tsx
'use client'
import { motion } from 'framer-motion'

export function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### Like Animation

```typescript
'use client'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export function LikeButton({ isLiked, onClick }: LikeButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={isLiked ? 'text-red-500' : 'text-gray-500'}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart className={isLiked ? 'fill-current' : ''} />
      </motion.div>
    </motion.button>
  )
}
```

---

## 🌐 API Integration

### API Client Setup

```typescript
// lib/api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (token ekle)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor (hata yönetimi)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### API Service Example

```typescript
// lib/api/posts.ts
import apiClient from './client'
import { PostInterface, CreatePostDto } from '@/interfaces/post.interface'

export const postService = {
  async getPosts(page: number = 1): Promise<PostInterface[]> {
    const response = await apiClient.get(`/api/posts?page=${page}`)
    return response.data.data
  },
  
  async createPost(data: CreatePostDto): Promise<PostInterface> {
    const response = await apiClient.post('/api/posts', data)
    return response.data.data
  },
  
  async likePost(postId: string): Promise<void> {
    await apiClient.post(`/api/posts/${postId}/like`)
  },
  
  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/api/posts/${postId}`)
  },
}
```

---

## 📦 State Management (Redux Toolkit)

### Store Setup

```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth-slice'
import postReducer from './slices/post-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### Typed Hooks

```typescript
// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### Auth Slice Example

```typescript
// store/slices/auth-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/lib/api/auth'

interface AuthState {
  user: UserInterface | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authService.login(email, password)
    localStorage.setItem('token', response.token)
    return response
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
```

---

## 🎯 Best Practices

### 1. Server Components (Varsayılan)

```typescript
// app/(main)/feed/page.tsx
export default async function FeedPage() {
  const posts = await fetchPosts() // Server-side
  
  return (
    <div>
      <h1>Feed</h1>
      <PostList posts={posts} />
    </div>
  )
}
```

### 2. Client Components (Sadece Gerektiğinde)

```typescript
// components/post/create-post-form.tsx
'use client'

export function CreatePostForm() {
  const [content, setContent] = useState('')
  
  function handleSubmit() {
    // ...
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### 3. Loading States

```typescript
// app/(main)/feed/loading.tsx
export default function Loading() {
  return <PostListSkeleton />
}
```

### 4. Error Handling

```typescript
// app/(main)/feed/error.tsx
'use client'

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

## 🎨 Styling Patterns

### 1. Tailwind Utility Classes

```typescript
<div className="flex items-center gap-4 p-6 rounded-lg bg-card shadow-md">
  ...
</div>
```

### 2. Conditional Classes (clsx)

```typescript
import { clsx } from 'clsx'

<button 
  className={clsx(
    'px-4 py-2 rounded-lg',
    isActive && 'bg-primary text-white',
    !isActive && 'bg-gray-200 text-gray-700'
  )}
>
  ...
</button>
```

### 3. cn Utility (Shadcn)

```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-classes', className)}>...</div>
```

---

## 📱 Responsive Design

```typescript
// Mobile-first approach
<div className="
  flex flex-col gap-4
  md:flex-row md:gap-6
  lg:gap-8
">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

---

## ⚡ Performance Optimization

### 1. Image Optimization

```typescript
import Image from 'next/image'

<Image
  src={post.imageUrl}
  alt="Post image"
  width={600}
  height={400}
  className="rounded-lg"
  loading="lazy"
/>
```

### 2. Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

const CommentSection = dynamic(
  () => import('@/components/post/comment-section'),
  { ssr: false, loading: () => <Skeleton /> }
)
```

### 3. Memoization

```typescript
import { memo, useMemo } from 'react'

export const PostCard = memo(function PostCard({ post }: Props) {
  const formattedDate = useMemo(
    () => formatDate(post.createdAt),
    [post.createdAt]
  )
  
  return <div>...</div>
})
```

---

## 🧪 Testing

```bash
# Install
npm install -D @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

---

Bu rehber ile modern, performanslı ve kullanıcı dostu bir frontend geliştirebilirsiniz! 🚀

