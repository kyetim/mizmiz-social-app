'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { useGetFeedPostsQuery } from '@/store/api/api'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { CreatePostModal } from '@/components/post/create-post-modal'
import { FilterBar } from '@/components/feed/filter-bar'
import { RefreshCw, Home, Sparkles, Flame, Compass } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FeedPage() {
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
    const [selectedVibeId, setSelectedVibeId] = useState<string | undefined>()

    const {
        data: feedPosts = [],
        isLoading: isLoadingPosts,
        refetch: refetchFeedPosts,
    } = useGetFeedPostsQuery({ limit: 50, categoryId: selectedCategoryId, vibeId: selectedVibeId })
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    function handlePostCreated() {
        // RTK Query will automatically invalidate and refetch
        refetchFeedPosts()
    }

    function handlePostUpdated() {
        // RTK Query will automatically invalidate and refetch
        refetchFeedPosts()
    }

    if (!user) {
        return null
    }

    const heroTiles = [
        {
            title: 'Anlık vibe',
            value: `${feedPosts.length}`,
            description: 'Yeni gönderi',
            icon: Sparkles,
            tone: 'emerald' as const,
        },
        {
            title: 'Trend yoğunluğu',
            value: '82%',
            description: 'Topluluk aktifliği',
            icon: Flame,
            tone: 'rose' as const,
        },
        {
            title: 'Keşfet akışı',
            value: '12 yeni',
            description: 'Takip edilecek kişi',
            icon: Compass,
            tone: 'cyan' as const,
        },
    ]

    return (
        <div className="space-y-8 lg:pt-2">
            {/* Page Title */}
            <GlassmorphismCard hover={false} tone="emerald" className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg text-white">
                            <Home className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Timeline</h1>
                            <p className="text-sm text-muted-foreground">
                                Lenis destekli akışkan scroll ile topluluktaki en güncel hareket
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none" onClick={() => router.push('/explore')}>
                            Trendleri Gör
                        </Button>
                        <motion.button
                            onClick={() => refetchFeedPosts()}
                            whileHover={{ scale: 1.05, rotate: 180 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 rounded-2xl border border-gray-200/80 dark:border-white/30 bg-gray-50/90 dark:bg-white/5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100/90 dark:hover:bg-white/10"
                            title="Yenile"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Yenile
                        </motion.button>
                    </div>
                </div>
            </GlassmorphismCard>

            <div className="grid gap-4 md:grid-cols-3">
                {heroTiles.map((tile) => {
                    const Icon = tile.icon
                    return (
                        <GlassmorphismCard key={tile.title} tone={tile.tone} className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{tile.title}</p>
                                    <p className="text-3xl font-semibold text-foreground">{tile.value}</p>
                                    <p className="text-xs text-muted-foreground">{tile.description}</p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50/80 dark:bg-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-500/20">
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                        </GlassmorphismCard>
                    )
                })}
            </div>

            {/* Create Post Card - Hidden on mobile, use button instead */}
            <div className="hidden lg:block">
                <GlassmorphismCard hover tone="neutral">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-semibold uppercase">
                                    {user.username[0]}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex-1 rounded-2xl border border-dashed border-gray-300/60 dark:border-white/40 bg-gray-50/80 dark:bg-white/5 px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-muted-foreground transition hover:border-gray-400/80 dark:hover:border-white/70 hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-100/80 dark:hover:bg-white/10"
                        >
                            Ne düşünüyorsun?
                        </button>
                    </div>
                </GlassmorphismCard>
            </div>

            {/* Filter Bar */}
            <FilterBar
                selectedCategoryId={selectedCategoryId}
                selectedVibeId={selectedVibeId}
                onCategorySelect={setSelectedCategoryId}
                onVibeSelect={setSelectedVibeId}
            />

            {/* Posts List */}
            {isLoadingPosts && feedPosts.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Gönderiler yükleniyor...</p>
                    </div>
                </div>
            ) : feedPosts.length === 0 ? (
                <GlassmorphismCard>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Timeline&apos;ın henüz boş
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Kullanıcıları takip ederek onların gönderilerini burada görebilirsin
                        </p>
                        <Button
                            onClick={() => router.push('/people')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Kullanıcıları Keşfet
                        </Button>
                    </div>
                </GlassmorphismCard>
            ) : (
                feedPosts.map((post) => (
                    <PostCard key={post.id} post={post} onPostUpdated={handlePostUpdated} />
                ))
            )}

            {/* Create Post Modal - Only for feed page "Ne düşünüyorsun?" input */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </div>
    )
}
