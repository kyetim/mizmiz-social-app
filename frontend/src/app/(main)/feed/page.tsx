'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { CreatePostModal } from '@/components/post/create-post-modal'
import { Plus, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { postsApi } from '@/lib/api/posts'
import { PostInterface } from '@/interfaces/post.interface'
import { toast } from 'react-hot-toast'

export default function FeedPage() {
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth)
    const [posts, setPosts] = useState<PostInterface[]>([])
    const [isLoadingPosts, setIsLoadingPosts] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [filter, setFilter] = useState<'all' | 'following'>('all')

    useEffect(() => {
        if (user) {
            loadPosts()
        }
    }, [user, filter])

    async function loadPosts() {
        setIsLoadingPosts(true)
        try {
            const data = await postsApi.getPosts({
                following: filter === 'following',
                limit: 50
            })
            setPosts(data)
        } catch (error: any) {
            toast.error('Gönderiler yüklenemedi')
        } finally {
            setIsLoadingPosts(false)
        }
    }

    function handlePostCreated() {
        loadPosts()
    }

    function handlePostUpdated() {
        loadPosts()
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4">
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
                        onClick={loadPosts}
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
            {isLoadingPosts ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Gönderiler yükleniyor...</p>
                    </div>
                </div>
            ) : posts.length === 0 ? (
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
                posts.map((post) => (
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
