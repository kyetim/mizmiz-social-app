'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout, getCurrentUser } from '@/store/slices/auth-slice'
import { addPost } from '@/store/slices/posts-slice'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { CreatePostModal } from '@/components/post/create-post-modal'
import { PostInterface } from '@/interfaces/post.interface'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Users, Bell, User, LogOut, Plus, Search } from 'lucide-react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const { user, isLoading } = useAppSelector((state) => state.auth)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }

        if (token && !user && !isLoading) {
            dispatch(getCurrentUser())
        }

        setIsInitialized(true)
    }, [router, user, isLoading, dispatch])

    function handleLogout() {
        dispatch(logout())
        router.push('/login')
    }

    function handlePostCreated(newPost?: PostInterface) {
        setIsCreateModalOpen(false)
        
        if (newPost) {
            // Optimistic update: Add new post immediately to Redux
            dispatch(addPost(newPost))
        }
        
        // Refresh the current page if on feed (for other updates)
        if (pathname === '/feed') {
            router.refresh()
        }
    }

    const isActive = (path: string) => pathname === path

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
            {/* Left Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 xl:w-72 border-r border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-4 flex flex-col z-40 hidden lg:flex">
                {/* Logo */}
                <Link href="/feed" className="flex items-center gap-3 px-3 py-2 mb-4">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ duration: 0.15 }}
                        className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md"
                    >
                        <span className="text-white font-bold text-lg">M</span>
                    </motion.div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">MIZMIZ</span>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    <Link href="/feed">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/feed')
                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Home className="w-6 h-6" />
                            <span className="text-lg">Timeline</span>
                        </motion.div>
                    </Link>

                    <Link href="/explore">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/explore')
                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-lg">Keşfet</span>
                        </motion.div>
                    </Link>

                    <Link href="/people">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/people')
                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Users className="w-6 h-6" />
                            <span className="text-lg">İnsanlar</span>
                        </motion.div>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors relative"
                    >
                        <Bell className="w-6 h-6" />
                        <span className="text-lg">Bildirimler</span>
                        <span className="absolute top-2 left-7 w-2 h-2 bg-green-600 rounded-full"></span>
                    </motion.button>

                    <Link href="/profile">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/profile')
                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <User className="w-6 h-6" />
                            <span className="text-lg">Profil</span>
                        </motion.div>
                    </Link>

                    <div className="pt-2">
                        <motion.button
                            onClick={() => setIsCreateModalOpen(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-lg">Gönderi Yaz</span>
                        </motion.button>
                    </div>
                </nav>

                {/* User Info & Settings */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <ThemeToggle />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Tema</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer group">
                        <Link href="/profile" className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-sm font-semibold">
                                        {user.username[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    @{user.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </Link>
                        <motion.button
                            onClick={handleLogout}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Çıkış Yap"
                        >
                            <LogOut className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50">
                <div className="flex items-center justify-between px-4 h-14">
                    <Link href="/feed" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">MIZMIZ</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/profile">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center overflow-hidden">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-xs font-semibold">{user.username[0].toUpperCase()}</span>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Wrapper */}
            <main className="lg:ml-64 xl:ml-72 pt-14 lg:pt-0 min-h-screen">
                <div className={`mx-auto px-4 py-4 lg:py-6 ${pathname === '/explore' ? 'max-w-[1400px]' : 'max-w-7xl'}`}>
                    {pathname === '/explore' ? (
                        // Explore page renders its own grid
                        children
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
                            {/* Content Area */}
                            <div className="w-full max-w-2xl mx-auto xl:mx-0 xl:ml-auto xl:mr-6">
                                {children}
                            </div>

                            {/* Right Sidebar - Twitter Style */}
                            <aside className="hidden xl:block sticky top-4 h-fit space-y-4">
                                {/* Search Box */}
                                <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700/30 p-3">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="MIZMIZ'de Ara..."
                                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Trending Topics */}
                                <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700/30 p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        🔥 Gündemdekiler
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { tag: 'development', count: '12.5K', trending: 1 },
                                            { tag: 'design', count: '8.3K', trending: 2 },
                                            { tag: 'AI', count: '15.2K', trending: 3 },
                                            { tag: 'startup', count: '5.7K', trending: 4 },
                                            { tag: 'tech', count: '9.1K', trending: 5 }
                                        ].map((item, i) => (
                                            <motion.a
                                                key={i}
                                                href={`/explore?tag=${item.tag}`}
                                                whileHover={{ x: 3 }}
                                                transition={{ duration: 0.1 }}
                                                className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">
                                                                {item.trending}. Trend
                                                            </span>
                                                        </div>
                                                        <p className="font-bold text-gray-900 dark:text-white">
                                                            #{item.tag}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.count} gönderi
                                                        </p>
                                                    </div>
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                    <Link href="/explore">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            className="w-full mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium py-2"
                                        >
                                            Daha fazla göster
                                        </motion.button>
                                    </Link>
                                </div>

                                {/* Suggested People */}
                                <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700/30 p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        👥 Kimi takip etmeli?
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Tech Hub', username: 'techhub', avatar: null },
                                            { name: 'Design Daily', username: 'designdaily', avatar: null },
                                            { name: 'Code Master', username: 'codemaster', avatar: null }
                                        ].map((person, i) => (
                                            <div key={i} className="flex items-center justify-between gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                <Link href={`/people`} className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white text-sm font-semibold">
                                                            {person.name[0]}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                            {person.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            @{person.username}
                                                        </p>
                                                    </div>
                                                </Link>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                                                >
                                                    Takip Et
                                                </motion.button>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/people">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            className="w-full mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium py-2"
                                        >
                                            Daha fazla göster
                                        </motion.button>
                                    </Link>
                                </div>

                                {/* Footer Links */}
                                <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700/30 p-4">
                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                        <a href="#" className="hover:underline">Hizmet Şartları</a>
                                        <a href="#" className="hover:underline">Gizlilik Politikası</a>
                                        <a href="#" className="hover:underline">Çerez Politikası</a>
                                        <a href="#" className="hover:underline">Hakkımızda</a>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">
                                        © 2025 MIZMIZ. Tüm hakları saklıdır.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Action Button - Mobile Only */}
            <motion.button
                onClick={() => setIsCreateModalOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
            >
                <Plus className="w-6 h-6" />
            </motion.button>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </div>
    )
}

