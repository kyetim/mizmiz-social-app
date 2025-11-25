'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/auth-slice'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { CreatePostModal } from '@/components/post/create-post-modal'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, TrendingUp, Users, Bell, User, LogOut, Plus, Search, Menu, X } from 'lucide-react'
import { useGetUnreadNotificationsCountQuery } from '@/store/api/api'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const { user, isLoading } = useAppSelector((state) => state.auth)
    const { unreadCount } = useAppSelector((state) => state.notifications)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)

    useEffect(() => {
        if (isLoading) {
            return
        }

        setIsInitialized(true)

        if (!user) {
            router.replace('/login')
        }
    }, [router, user, isLoading])

    useGetUnreadNotificationsCountQuery(undefined, {
        skip: !user,
        pollingInterval: 30000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })

    function handleLogout() {
        dispatch(logout())
        router.push('/login')
    }

    function handlePostCreated() {
        setIsCreateModalOpen(false)

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

                    <Link href="/notifications">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors relative ${isActive('/notifications')
                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Bell className="w-6 h-6" />
                            <span className="text-lg">Bildirimler</span>
                            {unreadCount > 0 && (
                                <span className="absolute top-2 left-7 px-1.5 min-w-[20px] h-5 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </motion.div>
                    </Link>

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
                    <div className="mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Tema</span>
                        <ThemeToggle />
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
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-gray-700 dark:text-gray-300"
                    >
                        <Menu className="w-6 h-6" />
                    </motion.button>

                    <Link href="/feed" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">MIZMIZ</span>
                    </Link>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsRightSidebarOpen(true)}
                        className="p-2 -mr-2 text-gray-700 dark:text-gray-300"
                    >
                        <Search className="w-6 h-6" />
                    </motion.button>
                </div>
            </header>

            {/* Mobile Left Drawer Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-[70] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex flex-col h-full p-4">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <Link href="/feed" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                                            <span className="text-white font-bold text-lg">M</span>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">MIZMIZ</span>
                                    </Link>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                {/* User Info */}
                                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="mb-6">
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white text-lg font-semibold">
                                                    {user.username[0].toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                @{user.username}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Navigation */}
                                <nav className="flex-1 space-y-1">
                                    <Link href="/feed" onClick={() => setIsMobileMenuOpen(false)}>
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/feed')
                                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Home className="w-6 h-6" />
                                            <span className="text-lg">Timeline</span>
                                        </motion.div>
                                    </Link>

                                    <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)}>
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/explore')
                                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <TrendingUp className="w-6 h-6" />
                                            <span className="text-lg">Keşfet</span>
                                        </motion.div>
                                    </Link>

                                    <Link href="/people" onClick={() => setIsMobileMenuOpen(false)}>
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/people')
                                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Users className="w-6 h-6" />
                                            <span className="text-lg">İnsanlar</span>
                                        </motion.div>
                                    </Link>

                                    <Link href="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors relative ${isActive('/notifications')
                                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Bell className="w-6 h-6" />
                                            <span className="text-lg">Bildirimler</span>
                                            {unreadCount > 0 && (
                                                <span className="absolute top-2 left-7 px-1.5 min-w-[20px] h-5 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </span>
                                            )}
                                        </motion.div>
                                    </Link>

                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/profile')
                                                ? 'text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 font-semibold'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <User className="w-6 h-6" />
                                            <span className="text-lg">Profil</span>
                                        </motion.div>
                                    </Link>
                                </nav>

                                {/* Theme Toggle & Logout */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                    <div className="mb-4">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Tema</span>
                                        <ThemeToggle />
                                    </div>

                                    <motion.button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false)
                                            handleLogout()
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl font-medium transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Çıkış Yap</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Right Sidebar (Bottom Sheet) */}
            <AnimatePresence>
                {isRightSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRightSidebarOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed left-0 right-0 bottom-0 max-h-[85vh] bg-white dark:bg-gray-900 z-[70] overflow-y-auto rounded-t-3xl shadow-2xl"
                        >
                            <div className="p-4">
                                {/* Handle */}
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />

                                {/* Search Box */}
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 mb-4">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-xl">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="MIZMIZ'de Ara..."
                                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Trending Topics */}
                                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        🔥 Gündemdekiler
                                    </h3>
                                    <div className="space-y-3">
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
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setIsRightSidebarOpen(false)}
                                                className="block hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
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
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                    <Link href="/explore" onClick={() => setIsRightSidebarOpen(false)}>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full mt-3 text-sm text-green-600 dark:text-green-400 font-medium py-2"
                                        >
                                            Daha fazla göster
                                        </motion.button>
                                    </Link>
                                </div>

                                {/* Suggested People */}
                                <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        👥 Kimi takip etmeli?
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Tech Hub', username: 'techhub', avatar: null },
                                            { name: 'Design Daily', username: 'designdaily', avatar: null },
                                            { name: 'Code Master', username: 'codemaster', avatar: null }
                                        ].map((person, i) => (
                                            <div key={i} className="flex items-center justify-between gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                <Link
                                                    href={`/people`}
                                                    className="flex items-center gap-2 flex-1 min-w-0"
                                                    onClick={() => setIsRightSidebarOpen(false)}
                                                >
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
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-full"
                                                >
                                                    Takip Et
                                                </motion.button>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/people" onClick={() => setIsRightSidebarOpen(false)}>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full mt-3 text-sm text-green-600 dark:text-green-400 font-medium py-2"
                                        >
                                            Daha fazla göster
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/50 pb-safe">
                <div className="flex items-center justify-around px-2 h-16">
                    <Link href="/feed" className="flex flex-col items-center justify-center flex-1 h-full">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${isActive('/feed')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Home className={`w-6 h-6 ${isActive('/feed') ? 'fill-current' : ''}`} />
                            <span className="text-xs font-medium">Timeline</span>
                        </motion.div>
                    </Link>

                    <Link href="/explore" className="flex flex-col items-center justify-center flex-1 h-full">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${isActive('/explore')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <TrendingUp className={`w-6 h-6 ${isActive('/explore') ? 'fill-current' : ''}`} />
                            <span className="text-xs font-medium">Keşfet</span>
                        </motion.div>
                    </Link>

                    {/* Central FAB Button */}
                    <div className="flex flex-col items-center justify-center flex-1 h-full -mt-8">
                        <motion.button
                            onClick={() => setIsCreateModalOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-900"
                        >
                            <Plus className="w-7 h-7" />
                        </motion.button>
                    </div>

                    <Link href="/people" className="flex flex-col items-center justify-center flex-1 h-full">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${isActive('/people')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Users className={`w-6 h-6 ${isActive('/people') ? 'fill-current' : ''}`} />
                            <span className="text-xs font-medium">İnsanlar</span>
                        </motion.div>
                    </Link>

                    <Link href="/profile" className="flex flex-col items-center justify-center flex-1 h-full">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${isActive('/profile')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <User className={`w-6 h-6 ${isActive('/profile') ? 'fill-current' : ''}`} />
                            <span className="text-xs font-medium">Profil</span>
                        </motion.div>
                    </Link>
                </div>
            </nav>

            {/* Main Content Wrapper */}
            <main className="lg:ml-64 xl:ml-72 pt-14 lg:pt-0 pb-16 lg:pb-0 min-h-screen">
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


            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </div>
    )
}

