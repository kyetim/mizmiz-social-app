'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchFeedPosts, addPost } from '@/store/slices/posts-slice'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { CreatePostModal } from '@/components/post/create-post-modal'
import { Plus, RefreshCw, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { PostInterface } from '@/interfaces/post.interface'
import { toast } from 'react-hot-toast'

export default function FeedPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const { feedPosts, isLoading: isLoadingPosts } = useAppSelector((state) => state.posts)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [filter, setFilter] = useState<'all' | 'following'>('all')

    // Load posts from Redux (with cache)
    useEffect(() => {
        if (user) {
            loadPosts()
        }
    }, [user, filter])

    async function loadPosts(forceRefresh = false) {
        try {
            await dispatch(fetchFeedPosts({
                following: filter === 'following',
                limit: 50,
                forceRefresh
            })).unwrap()
        } catch (error: any) {
            toast.error('Gönderiler yüklenemedi')
        }
    }

    function handlePostCreated(newPost?: PostInterface) {
        if (newPost) {
            // Optimistic update: Add new post immediately to Redux
            dispatch(addPost(newPost))
        } else {
            // Fallback: Force refresh if post not provided
            loadPosts(true)
        }
    }

    function handlePostUpdated() {
        // Force refresh to get latest data
        loadPosts(true)
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4 lg:pt-2">
            {/* Page Title */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Home className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ana Sayfa</h1>
            </div>

            {/* Create Post Card - Hidden on mobile, use button instead */}
            <div className="hidden lg:block">
                <GlassmorphismCard hover={false}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-semibold">
                                    {user.username[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex-1 text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 text-sm transition-colors duration-150 font-medium"
                        >
                            Ne düşünüyorsun?
                        </button>
                    </div>
                </GlassmorphismCard>
            </div>

            {/* Filter Tabs */}
            <GlassmorphismCard hover={false}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-150 ${filter === 'all'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Tüm Gönderiler
                    </button>
                    <button
                        onClick={() => setFilter('following')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-150 ${filter === 'following'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Takip Edilenler
                    </button>
                    <motion.button
                        onClick={() => loadPosts(true)}
                        whileHover={{ scale: 1.05, rotate: 180 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-150"
                        title="Yenile"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </motion.button>
                </div>
            </GlassmorphismCard>

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
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {filter === 'following' ? 'Takip ettiğin kimse yok' : 'Henüz gönderi yok'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {filter === 'following'
                                ? 'Kullanıcıları takip ederek onların gönderilerini görebilirsin'
                                : 'İlk gönderiyi sen oluştur!'}
                        </p>
                        <Button
                            onClick={() => filter === 'following' ? router.push('/people') : setIsCreateModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {filter === 'following' ? 'Kullanıcıları Keşfet' : 'Gönderi Oluştur'}
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
