'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, TrendingUp } from 'lucide-react'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'

export function RightSidebar() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <aside className="hidden xl:block sticky top-4 h-fit space-y-4">
            {/* Search Box */}
            <GlassmorphismCard hover={false} tone="cyan" className="p-3">
                <form onSubmit={handleSearch} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/70 px-3 py-2 dark:bg-white/5">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="MIZMIZ'de Ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                </form>
            </GlassmorphismCard>

            {/* Trending Topics */}
            <GlassmorphismCard hover tone="emerald" className="p-4 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
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
                            whileHover={{ x: 6 }}
                            transition={{ duration: 0.15 }}
                            className="block rounded-2xl border border-white/10 bg-white/70 p-3 transition dark:bg-white/5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{item.trending}. Trend</span>
                                    </div>
                                    <p className="font-semibold text-foreground">#{item.tag}</p>
                                    <p className="text-xs text-muted-foreground">{item.count} gönderi</p>
                                </div>
                                <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-300" />
                            </div>
                        </motion.a>
                    ))}
                </div>
                <Link href="/explore">
                    <motion.button whileHover={{ scale: 1.02 }} className="w-full text-sm text-muted-foreground font-medium py-2 dark:text-white/80">
                        Daha fazla göster
                    </motion.button>
                </Link>
            </GlassmorphismCard>

            {/* Suggested People */}
            <GlassmorphismCard hover tone="neutral" className="p-4 space-y-3">
                <h3 className="text-lg font-bold text-foreground dark:text-white">👥 Kimi takip etmeli?</h3>
                {[
                    { name: 'Tech Hub', username: 'techhub', avatar: null },
                    { name: 'Design Daily', username: 'designdaily', avatar: null },
                    { name: 'Code Master', username: 'codemaster', avatar: null }
                ].map((person, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/70 p-3 dark:bg-white/5">
                        <Link href={`/people`} className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold">
                                {person.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground dark:text-white truncate">
                                    {person.name}
                                </p>
                                <p className="text-xs text-muted-foreground dark:text-white/60 truncate">
                                    @{person.username}
                                </p>
                            </div>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-md"
                        >
                            Takip Et
                        </motion.button>
                    </div>
                ))}
                <Link href="/people">
                    <motion.button whileHover={{ scale: 1.02 }} className="w-full text-sm text-muted-foreground font-medium py-2 dark:text-white/80">
                        Daha fazla göster
                    </motion.button>
                </Link>
            </GlassmorphismCard>

            {/* Footer Links */}
            <GlassmorphismCard hover={false} tone="neutral" className="p-4 text-sm text-muted-foreground space-y-3">
                <div className="flex flex-wrap gap-3">
                    <a href="#" className="hover:text-foreground">Hizmet Şartları</a>
                    <a href="#" className="hover:text-foreground">Gizlilik Politikası</a>
                    <a href="#" className="hover:text-foreground">Çerez Politikası</a>
                    <a href="#" className="hover:text-foreground">Hakkımızda</a>
                </div>
                <p className="text-xs text-muted-foreground">
                    © 2025 MIZMIZ. Tüm hakları saklıdır.
                </p>
            </GlassmorphismCard>
        </aside>
    )
}
