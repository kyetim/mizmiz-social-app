'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout, getCurrentUser } from '@/store/slices/auth-slice'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Bell, Home, Search, User, LogOut, Plus, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FeedPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user, isLoading } = useAppSelector((state) => state.auth)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }

        // Token varsa ama user yoksa getCurrentUser'ı çağır
        if (token && !user && !isLoading) {
            dispatch(getCurrentUser())
        }

        setIsInitialized(true)
    }, [router, user, isLoading, dispatch])

    function handleLogout() {
        dispatch(logout())
        router.push('/login')
    }

    // Loading durumunu göster
    if (!isInitialized || isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link href="/feed" className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 3 }}
                                    transition={{ duration: 0.15 }}
                                    className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-md"
                                >
                                    <span className="text-white font-bold text-base">M</span>
                                </motion.div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-150">MIZMIZ</span>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                <Link
                                    href="/feed"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    Ana Sayfa
                                </Link>
                                <Link
                                    href="/explore"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Keşfet
                                </Link>
                                <Link
                                    href="/people"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Users className="w-4 h-4" />
                                    İnsanlar
                                </Link>
                            </nav>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Ara..."
                                    className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder:text-gray-500 w-48"
                                />
                            </div>

                            {/* Notifications */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 relative"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
                            </motion.button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.1 }}
                                        className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm"
                                    >
                                        <span className="text-white text-sm font-semibold">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    </motion.div>
                                    <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-white transition-colors duration-150">
                                        {user.username}
                                    </span>
                                </Link>

                                <motion.button
                                    onClick={handleLogout}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                                    title="Çıkış Yap"
                                >
                                    <LogOut className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-[1fr_300px] gap-6">
                        {/* Feed Column */}
                        <div className="space-y-4">
                            {/* Create Post Card */}
                            <GlassmorphismCard hover={false}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-white font-semibold">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <button className="flex-1 text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 text-sm transition-colors duration-150 font-medium">
                                        Ne düşünüyorsun?
                                    </button>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors duration-150">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </GlassmorphismCard>

                            {/* Welcome Card */}
                            <GlassmorphismCard className="bg-gradient-to-br from-green-50/90 dark:from-green-900/20 to-white/95 dark:to-gray-800/95 border-green-200 dark:border-green-800">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            🎉 Hoş geldin, {user.firstName || user.username}!
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            MIZMIZ sosyal platformuna başarıyla giriş yaptın
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white/80 dark:bg-gray-700/50 rounded-lg">
                                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.1 }} className="text-center cursor-pointer">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Gönderi</div>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.1 }} className="text-center cursor-pointer">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Takipçi</div>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.1 }} className="text-center cursor-pointer">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Takip</div>
                                    </motion.div>
                                </div>

                                <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.1 }}>
                                    <Link
                                        href="/profile"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-150"
                                    >
                                        <User className="w-4 h-4" />
                                        Profilini tamamla
                                    </Link>
                                </motion.div>
                            </GlassmorphismCard>

                            {/* Example Posts with Glassmorphism */}
                            <PostCard
                                author={{
                                    name: "Ahmet Yılmaz",
                                    username: "ahmetyilmaz",
                                }}
                                content="MIZMIZ platformunu yeni keşfettim! Modern tasarımı ve kullanıcı dostu arayüzü gerçekten çok başarılı. Topluluğa katılmaktan mutluyum! 🎉"
                                timestamp="5 dk önce"
                                likes={12}
                                comments={3}
                            />

                            <PostCard
                                author={{
                                    name: "Ayşe Demir",
                                    username: "aysedemir",
                                }}
                                content="Bugün yeni bir proje başlattım. Next.js 15 ve TypeScript kombinasyonu harika çalışıyor! Tavsiye ederim. 🚀"
                                timestamp="15 dk önce"
                                likes={24}
                                comments={8}
                            />

                            <PostCard
                                author={{
                                    name: "Mehmet Kaya",
                                    username: "mehmetkaya",
                                }}
                                content="Minimal ve temiz tasarımın gücünü asla hafife almayın. Kullanıcı deneyimi her şeyden önemli! 💚"
                                timestamp="1 saat önce"
                                likes={45}
                                comments={12}
                            />

                            {/* Coming Soon Card */}
                            <GlassmorphismCard>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    🚧 Yakında Gelecek Özellikler
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: '📝', text: 'Post oluşturma ve paylaşma', status: 'Sprint 4' },
                                        { icon: '❤️', text: 'Beğenme ve yorum yapma', status: 'Sprint 5' },
                                        { icon: '👥', text: 'Kullanıcı takip sistemi', status: 'Sprint 6' },
                                        { icon: '🔔', text: 'Bildirim sistemi', status: 'Sprint 7' },
                                        { icon: '🌟', text: 'Keşfet sayfası', status: 'Sprint 8' },
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 3 }}
                                            transition={{ duration: 0.1 }}
                                            className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-150"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{feature.icon}</span>
                                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{feature.text}</span>
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold px-2 py-1 bg-white/90 dark:bg-gray-800/90 rounded border border-gray-200 dark:border-gray-600">
                                                {feature.status}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </GlassmorphismCard>
                        </div>

                        {/* Sidebar */}
                        <div className="hidden md:block space-y-4">
                            {/* User Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-shadow duration-150">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                                        <span className="text-white text-2xl font-bold">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">@{user.username}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Üyelik Tarihi
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Trending Topics */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-shadow duration-150">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base">📈 Trend Konular</h3>
                                <div className="space-y-3">
                                    {['#development', '#design', '#startup', '#ai', '#tech'].map((tag, i) => (
                                        <motion.a
                                            key={i}
                                            href={`/explore?tag=${tag.slice(1)}`}
                                            whileHover={{ x: 3 }}
                                            transition={{ duration: 0.1 }}
                                            className="block text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-150 hover:underline"
                                        >
                                            {tag}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}
