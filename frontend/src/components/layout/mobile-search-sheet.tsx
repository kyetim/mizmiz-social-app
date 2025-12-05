'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp } from 'lucide-react'

interface MobileSearchSheetProps {
    isOpen: boolean
    onClose: () => void
}

export function MobileSearchSheet({ isOpen, onClose }: MobileSearchSheetProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
            onClose()
        }
    }

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
                                <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-xl">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="MIZMIZ'de Ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                                    />
                                </form>
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
                                            onClick={onClose}
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
                                <Link href="/explore" onClick={onClose}>
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
                                                onClick={onClose}
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
                                <Link href="/people" onClick={onClose}>
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
    )
}
