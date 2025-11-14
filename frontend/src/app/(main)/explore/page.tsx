'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchExplorePosts } from '@/store/slices/posts-slice'
import { fetchTrendingCategories } from '@/store/slices/categories-slice'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import {
    Search,
    TrendingUp,
    Hash,
    Sparkles,
    Heart,
    MessageCircle,
    X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PostInterface } from '@/interfaces/post.interface'
import { Category } from '@/interfaces/category.interface'
import { toast } from 'react-hot-toast'

export default function ExplorePage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const { explorePosts, isLoading: isLoadingPosts } = useAppSelector((state) => state.posts)
    const { trendingCategories, isLoading: isLoadingCategories } = useAppSelector((state) => state.categories)
    const [activeTab, setActiveTab] = useState<'trending' | 'categories' | 'popular'>('trending')
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredPosts, setFilteredPosts] = useState<PostInterface[]>([])
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const isLoading = isLoadingPosts || isLoadingCategories

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }
        loadData()
    }, [router, activeTab])

    // Search effect
    useEffect(() => {
        if (searchQuery.trim()) {
            performSearch()
        } else {
            setFilteredPosts(explorePosts)
            setFilteredCategories(trendingCategories)
            setIsSearching(false)
        }
    }, [searchQuery, explorePosts, trendingCategories])

    async function loadData(forceRefresh = false) {
        try {
            if (activeTab === 'trending' || activeTab === 'popular') {
                await dispatch(fetchExplorePosts({ limit: 20, forceRefresh })).unwrap()
            }

            await dispatch(fetchTrendingCategories({ limit: 10, forceRefresh })).unwrap()
        } catch (error) {
            toast.error('Veriler yüklenemedi')
        }
    }

    function handlePostUpdated() {
        loadData(true)
    }

    function performSearch() {
        setIsSearching(true)
        const query = searchQuery.toLowerCase().trim()

        // Filter posts by content or username
        const searchedPosts = explorePosts.filter(post =>
            post.content.toLowerCase().includes(query) ||
            post.user?.username?.toLowerCase().includes(query) ||
            post.user?.firstName?.toLowerCase().includes(query) ||
            post.user?.lastName?.toLowerCase().includes(query)
        )

        // Filter categories by name or description
        const searchedCategories = trendingCategories.filter(category =>
            category.name.toLowerCase().includes(query) ||
            category.description?.toLowerCase().includes(query)
        )

        setFilteredPosts(searchedPosts)
        setFilteredCategories(searchedCategories)
    }

    // Get display posts based on search
    const displayPosts = searchQuery.trim() ? filteredPosts : explorePosts
    const displayCategories = searchQuery.trim() ? filteredCategories : trendingCategories

    if (!user) {
        return null
    }

    return (
        <div className="pt-6">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,680px)_380px] gap-8 justify-center">
                {/* Main Content */}
                <div className="space-y-4 w-full">
                    {/* Page Title */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Keşfet</h1>
                    </div>

                    {/* Search Bar */}
                    <GlassmorphismCard hover={false}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Gönderi, kategori veya kullanıcı ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-none rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        {searchQuery && isSearching && (
                            <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
                                "{searchQuery}" için {filteredPosts.length} gönderi, {filteredCategories.length} kategori bulundu
                            </p>
                        )}
                    </GlassmorphismCard>

                    {/* Tabs */}
                    <GlassmorphismCard hover={false}>
                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={() => setActiveTab('trending')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'trending'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <TrendingUp className="w-4 h-4" />
                                <span>Trendler</span>
                            </motion.button>

                            <motion.button
                                onClick={() => setActiveTab('categories')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'categories'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Hash className="w-4 h-4" />
                                <span>Kategoriler</span>
                            </motion.button>

                            <motion.button
                                onClick={() => setActiveTab('popular')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'popular'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Heart className="w-4 h-4" />
                                <span>Popüler</span>
                            </motion.button>
                        </div>
                    </GlassmorphismCard>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {/* Trending Posts */}
                        {activeTab === 'trending' && (
                            <motion.div
                                key="trending"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="text-center">
                                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                                        </div>
                                    </div>
                                ) : displayPosts.length > 0 ? (
                                    displayPosts.map((post) => (
                                        <PostCard key={post.id} post={post} onPostUpdated={handlePostUpdated} />
                                    ))
                                ) : (
                                    <GlassmorphismCard>
                                        <div className="text-center py-12">
                                            {searchQuery ? (
                                                <>
                                                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Arama sonucu bulunamadı
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                        "{searchQuery}" için gönderi bulunamadı
                                                    </p>
                                                    <button
                                                        onClick={() => setSearchQuery('')}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                                    >
                                                        Aramayı Temizle
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Henüz trend gönderi yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        İlk trend gönderileri oluşturmaya başla!
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </GlassmorphismCard>
                                )}
                            </motion.div>
                        )}

                        {/* Categories */}
                        {activeTab === 'categories' && (
                            <motion.div
                                key="categories"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <GlassmorphismCard>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Hash className="w-5 h-5 text-green-600" />
                                        {searchQuery ? `"${searchQuery}" için Kategoriler` : 'Tüm Kategoriler'}
                                    </h3>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : displayCategories.length > 0 ? (
                                        <div className="grid gap-3">
                                            {displayCategories.map((category) => (
                                                <motion.div
                                                    key={category.id}
                                                    whileHover={{ scale: 1.01 }}
                                                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-all"
                                                    style={{ borderColor: category.color + '40' }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                                                            style={{ backgroundColor: category.color + '20' }}
                                                        >
                                                            {category.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900 dark:text-white">{category.name}</h4>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                {category.postsCount} gönderi
                                                            </p>
                                                            {category.description && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                    {category.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            {searchQuery ? (
                                                <>
                                                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Kategori bulunamadı
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                        "{searchQuery}" ile eşleşen kategori yok
                                                    </p>
                                                    <button
                                                        onClick={() => setSearchQuery('')}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                                    >
                                                        Aramayı Temizle
                                                    </button>
                                                </>
                                            ) : (
                                                <p className="text-gray-600 dark:text-gray-400">Henüz kategori yok</p>
                                            )}
                                        </div>
                                    )}
                                </GlassmorphismCard>
                            </motion.div>
                        )}

                        {/* Popular Posts */}
                        {activeTab === 'popular' && (
                            <motion.div
                                key="popular"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="text-center">
                                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                                        </div>
                                    </div>
                                ) : displayPosts.length > 0 ? (
                                    displayPosts
                                        .sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount))
                                        .map((post) => (
                                            <PostCard key={post.id} post={post} onPostUpdated={handlePostUpdated} />
                                        ))
                                ) : (
                                    <GlassmorphismCard>
                                        <div className="text-center py-12">
                                            {searchQuery ? (
                                                <>
                                                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Arama sonucu bulunamadı
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                        "{searchQuery}" için popüler gönderi bulunamadı
                                                    </p>
                                                    <button
                                                        onClick={() => setSearchQuery('')}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                                    >
                                                        Aramayı Temizle
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Henüz popüler gönderi yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Gönderilere beğeni ve yorum yaparak popüler hale getir!
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </GlassmorphismCard>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Custom Right Sidebar for Explore Page */}
                <aside className="hidden xl:block sticky top-4 h-fit space-y-4 w-full">
                {/* Trending Categories */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-green-600" />
                            Trend Kategoriler
                        </h3>
                        <div className="space-y-3">
                            {trendingCategories.slice(0, 6).map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer group"
                                    onClick={() => setActiveTab('categories')}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: category.color + '20' }}
                                        >
                                            {category.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                                {category.name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {category.postsCount} gönderi
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                                        #{index + 1}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {trendingCategories.length > 5 && (
                            <button
                                onClick={() => setActiveTab('categories')}
                                className="w-full mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium py-2"
                            >
                                Tüm kategorileri gör
                            </button>
                        )}
                    </div>

                {/* Statistics */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            İstatistikler
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Gönderi
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {explorePosts.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                                        <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kategori
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    {trendingCategories.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Toplam Beğeni
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                    {explorePosts.reduce((sum, post) => sum + post.likesCount, 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-5 cursor-default"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base">
                                    Kategoriler Nasıl Çalışır?
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Gönderiler otomatik olarak <span className="font-semibold text-green-600 dark:text-green-400">AI</span> tarafından analiz edilir ve ilgili kategorilere atanır.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-green-200 dark:border-green-800">
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                Otomatik analiz
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                Kullanıcı onayı
                            </div>
                        </div>
                    </motion.div>
                </aside>
            </div>
        </div>
    )
}
