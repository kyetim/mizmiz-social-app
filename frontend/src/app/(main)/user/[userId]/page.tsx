'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { followUser, unfollowUser, checkIsFollowing } from '@/store/slices/follow-slice'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import {
    ArrowLeft,
    MapPin,
    Link as LinkIcon,
    Calendar,
    MessageCircle,
    Grid,
    Image as ImageIcon,
    UserPlus,
    UserMinus,
    Heart
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { postsApi } from '@/lib/api/posts'
import { usersApi } from '@/lib/api/users'
import { PostInterface } from '@/interfaces/post.interface'
import { UserInterface } from '@/interfaces/user.interface'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function UserProfilePage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const params = useParams()
    const userId = params.userId as string
    const { user: currentUser } = useAppSelector((state) => state.auth)
    const { following } = useAppSelector((state) => state.follow)
    const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'media'>('posts')
    const [posts, setPosts] = useState<PostInterface[]>([])
    const [likedPosts, setLikedPosts] = useState<PostInterface[]>([])
    const [profileUser, setProfileUser] = useState<UserInterface | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showAvatarLightbox, setShowAvatarLightbox] = useState(false)
    const [showCoverLightbox, setShowCoverLightbox] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }
        if (userId) {
            loadUserProfile()
        }
    }, [router, userId])

    async function loadUserProfile() {
        setIsLoading(true)
        try {
            // Load user profile, posts, and liked posts
            const [user, userPosts, userLikedPosts] = await Promise.all([
                usersApi.getUser(userId),
                postsApi.getPosts({ userId, limit: 50 }),
                usersApi.getUserLikedPosts(userId, 50)
            ])
            setProfileUser(user)
            setPosts(userPosts)
            setLikedPosts(userLikedPosts)

            // Check if following this user
            if (userId !== currentUser?.id) {
                dispatch(checkIsFollowing(userId))
            }
        } catch (error) {
            toast.error('Kullanıcı profili yüklenemedi')
            console.error('Load user profile error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleFollowToggle() {
        try {
            if (following.has(userId)) {
                await dispatch(unfollowUser(userId)).unwrap()
                toast.success('Takibi bıraktınız')
            } else {
                await dispatch(followUser(userId)).unwrap()
                toast.success('Takip ediyorsunuz! 🎉')
            }
        } catch (error: any) {
            toast.error(error || 'İşlem başarısız')
        }
    }

    function handlePostUpdated() {
        loadUserProfile()
    }

    const isOwnProfile = currentUser?.id === userId

    // Filter posts based on active tab
    const displayPosts = activeTab === 'posts'
        ? posts
        : activeTab === 'media'
            ? posts.filter(p => p.imageUrl)
            : likedPosts

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Kullanıcı bulunamadı</p>
                    <Link href="/feed">
                        <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                            Ana Sayfaya Dön
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    const userName = profileUser.firstName && profileUser.lastName
        ? `${profileUser.firstName} ${profileUser.lastName}`
        : profileUser.username

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{userName}</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{posts.length} gönderi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16">
                <div className="container mx-auto max-w-4xl">
                    {/* Cover Photo */}
                    <div
                        className="relative h-48 sm:h-64 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => profileUser.coverImageUrl && setShowCoverLightbox(true)}
                    >
                        {profileUser.coverImageUrl && (
                            <img
                                src={profileUser.coverImageUrl}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="px-4 sm:px-6">
                        <div className="relative -mt-16 mb-4">
                            {/* Avatar */}
                            <div className="relative inline-block">
                                <div
                                    className="w-32 h-32 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-gray-900 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => profileUser.avatarUrl && setShowAvatarLightbox(true)}
                                >
                                    {profileUser.avatarUrl ? (
                                        <img
                                            src={profileUser.avatarUrl}
                                            alt={profileUser.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-4xl">
                                            {profileUser.username[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {!isOwnProfile && (
                            <div className="flex items-center gap-2 mb-4">
                                <motion.button
                                    onClick={handleFollowToggle}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex-1 px-4 py-2.5 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
                                        following.has(userId)
                                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/30'
                                    }`}
                                >
                                    {following.has(userId) ? (
                                        <>
                                            <UserMinus className="w-4 h-4" />
                                            Takipten Çık
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Takip Et
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        )}

                        {isOwnProfile && (
                            <div className="flex items-center gap-2 mb-4">
                                <Link href="/profile" className="flex-1">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 transition-all"
                                    >
                                        Profilimi Düzenle
                                    </motion.button>
                                </Link>
                            </div>
                        )}

                        {/* User Info */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {userName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">@{profileUser.username}</p>

                            {profileUser.bio && (
                                <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                                    {profileUser.bio}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {profileUser.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{profileUser.location}</span>
                                    </div>
                                )}
                                {profileUser.website && (
                                    <a
                                        href={profileUser.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        <span>{profileUser.website.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {formatDistanceToNow(new Date(profileUser.createdAt), {
                                            addSuffix: true,
                                            locale: tr
                                        })} katıldı
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6">
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white">{profileUser.followingCount || 0}</span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1">Takip</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white">{profileUser.followersCount || 0}</span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1">Takipçi</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white">{posts.length}</span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1">Gönderi</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`flex-1 py-4 px-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'posts'
                                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                    <span className="hidden sm:inline">Gönderiler</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('likes')}
                                    className={`flex-1 py-4 px-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'likes'
                                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Heart className="w-4 h-4" />
                                    <span className="hidden sm:inline">Beğeniler</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('media')}
                                    className={`flex-1 py-4 px-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'media'
                                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Medya</span>
                                </button>
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="pb-12">
                            <AnimatePresence mode="wait">
                                {displayPosts.length > 0 ? (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        {displayPosts.map((post) => (
                                            <PostCard key={post.id} post={post} onPostUpdated={handlePostUpdated} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <GlassmorphismCard>
                                        <div className="text-center py-12">
                                            {activeTab === 'posts' ? (
                                                <>
                                                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Henüz gönderi yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Bu kullanıcı henüz gönderi paylaşmamış
                                                    </p>
                                                </>
                                            ) : activeTab === 'likes' ? (
                                                <>
                                                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Beğeni yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Bu kullanıcı henüz gönderi beğenmemiş
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Medya yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Fotoğraf içeren gönderi bulunamadı
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </GlassmorphismCard>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            {/* Avatar Lightbox */}
            {profileUser?.avatarUrl && (
                <ImageLightbox
                    isOpen={showAvatarLightbox}
                    onClose={() => setShowAvatarLightbox(false)}
                    imageUrl={profileUser.avatarUrl}
                    alt={`${profileUser.username} profil fotoğrafı`}
                />
            )}

            {/* Cover Lightbox */}
            {profileUser?.coverImageUrl && (
                <ImageLightbox
                    isOpen={showCoverLightbox}
                    onClose={() => setShowCoverLightbox(false)}
                    imageUrl={profileUser.coverImageUrl}
                    alt={`${profileUser.username} kapak fotoğrafı`}
                />
            )}
        </div>
    )
}

