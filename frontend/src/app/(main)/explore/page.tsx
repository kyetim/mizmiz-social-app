'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { ArrowLeft, Compass, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ExplorePage() {
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
        }
    }, [router])

    if (!user) {
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
                        <div className="flex items-center gap-4">
                            <Link href="/feed">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Keşfet</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Trend konuları ve içerikleri keşfet</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                            className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <Compass className="w-12 h-12 text-white" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            🚧 Keşfet Sayfası Yapım Aşamasında
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Bu özellik şu anda geliştirilme aşamasında. Çok yakında trend konuları, popüler içerikleri ve önerilen kullanıcıları keşfedebileceksiniz!
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                            {[
                                { icon: TrendingUp, title: 'Trend Konular', desc: 'Popüler hashtag\'ler' },
                                { icon: Zap, title: 'Önerilen İçerik', desc: 'Sana özel paylaşımlar' },
                                { icon: Compass, title: 'Keşfet', desc: 'Yeni kullanıcılar bul' }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
                                >
                                    <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <Link href="/feed">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                            >
                                Ana Sayfaya Dön
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

