'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, TrendingUp, Users, Bell, User, LogOut, X } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/theme-toggle'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    user: {
        username: string
        email: string
        avatarUrl?: string | null
    }
    unreadCount: number
    onLogout: () => void
}

export function MobileMenu({ isOpen, onClose, user, unreadCount, onLogout }: MobileMenuProps) {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
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
                                <Link href="/feed" className="flex items-center gap-3" onClick={onClose}>
                                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                                        <span className="text-white font-bold text-lg">M</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">MIZMIZ</span>
                                </Link>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                            </div>

                            {/* User Info */}
                            <Link href="/profile" onClick={onClose} className="mb-6">
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
                                <Link href="/feed" onClick={onClose}>
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

                                <Link href="/explore" onClick={onClose}>
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

                                <Link href="/people" onClick={onClose}>
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

                                <Link href="/notifications" onClick={onClose}>
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

                                <Link href="/profile" onClick={onClose}>
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
                                        onClose()
                                        onLogout()
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
    )
}
