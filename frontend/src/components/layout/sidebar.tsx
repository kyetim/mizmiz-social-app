'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Users, Bell, User, LogOut, Plus, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/shared/theme-toggle'

interface SidebarProps {
    user: {
        username: string
        email: string
        avatarUrl?: string | null
    }
    unreadCount: number
    onLogout: () => void
    onCreatePost: () => void
}

export function Sidebar({ user, unreadCount, onLogout, onCreatePost }: SidebarProps) {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path
    const navItemBase =
        'flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all border border-transparent'
    const getNavClass = (path: string) =>
        cn(
            navItemBase,
            isActive(path)
                ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 text-white shadow-[0_20px_45px_rgba(16,185,129,0.25)] border-emerald-400/30 dark:from-emerald-500/40 dark:via-cyan-500/20 dark:to-transparent dark:border-white/30'
                : 'text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10',
        )

    return (
        <aside className="fixed left-0 top-0 hidden lg:flex h-screen w-80 flex-col border-r border-gray-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/40 backdrop-blur-2xl text-foreground shadow-[0_25px_80px_rgba(15,23,42,0.15)] dark:shadow-[0_25px_80px_rgba(2,6,23,0.85)] z-40 overflow-hidden">
            {/* Logo */}
            <Link href="/feed" className="flex items-center gap-3 px-4 py-3 mb-6">
                <motion.div
                    whileHover={{ rotate: 3 }}
                    transition={{ duration: 0.15 }}
                    className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                >
                    <span className="text-white font-bold text-lg">M</span>
                </motion.div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">MIZMIZ</span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-2 overflow-y-auto overflow-x-hidden">
                <Link href="/feed">
                    <motion.div
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(getNavClass('/feed'), 'overflow-hidden')}
                    >
                        <Home className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg">Timeline</span>
                    </motion.div>
                </Link>

                <Link href="/explore">
                    <motion.div
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(getNavClass('/explore'), 'overflow-hidden')}
                    >
                        <TrendingUp className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg">Keşfet</span>
                    </motion.div>
                </Link>

                <Link href="/people">
                    <motion.div
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(getNavClass('/people'), 'overflow-hidden')}
                    >
                        <Users className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg">İnsanlar</span>
                    </motion.div>
                </Link>

                <Link href="/notifications">
                    <motion.div
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(getNavClass('/notifications'), 'relative overflow-hidden')}
                    >
                        <Bell className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg">Bildirimler</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-2 left-7 px-1.5 min-w-[20px] h-5 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </motion.div>
                </Link>

                <Link href="/messages">
                    <motion.div
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(getNavClass('/messages'), 'overflow-hidden')}
                    >
                        <MessageCircle className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg">Mesajlar</span>
                    </motion.div>
                </Link>

                <Link href="/profile">
                    <motion.div
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(getNavClass('/profile'), 'overflow-hidden')}
                    >
                        <User className="w-6 h-6 flex-shrink-0" />
                        <span className="text-lg">Profil</span>
                    </motion.div>
                </Link>

                <div className="pt-3 px-2">
                    <motion.button
                        onClick={onCreatePost}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden"
                    >
                        <Plus className="w-5 h-5 flex-shrink-0" />
                        <span className="text-lg">Gönderi Yaz</span>
                    </motion.button>
                </div>
            </nav>

            {/* User Info & Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 px-2">
                <div className="mb-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block px-2">Tema</span>
                    <ThemeToggle />
                </div>

                <div className="flex items-center justify-between gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer group overflow-hidden">
                    <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0">
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
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                @{user.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    </Link>
                    <motion.button
                        onClick={onLogout}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                        title="Çıkış Yap"
                    >
                        <LogOut className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </aside>
    )
}
