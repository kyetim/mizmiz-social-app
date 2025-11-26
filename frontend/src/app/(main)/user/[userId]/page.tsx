'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import {
    useGetUserProfileQuery,
    useGetUserPostsQuery,
    useGetUserLikedPostsQuery,
    useFollowUserMutation,
    useUnfollowUserMutation,
} from '@/store/api/api'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { GamificationStats } from '@/components/profile/gamification-stats'
import {
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
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function UserProfilePage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.userId as string
    const { user: currentUser } = useAppSelector((state) => state.auth)
    const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'media'>('posts')
    const [showAvatarLightbox, setShowAvatarLightbox] = useState(false)
    const [showCoverLightbox, setShowCoverLightbox] = useState(false)

    const {
        data: profileUser,
        isLoading: isLoadingProfile,
    } = useGetUserProfileQuery(userId, { skip: !userId })
    const {
        data: posts = [],
        isLoading: isLoadingPosts,
        refetch: refetchUserPosts,
    } = useGetUserPostsQuery(
        { userId, limit: 50 },
        { skip: !userId }
    )
    const {
        data: likedPosts = [],
        isLoading: isLoadingLikedPosts,
    } = useGetUserLikedPostsQuery({ userId, limit: 50 }, { skip: !userId })
    const [followUser] = useFollowUserMutation()
    const [unfollowUser] = useUnfollowUserMutation()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
        }
    }, [router])

    async function handleFollowToggle() {
        if (!profileUser) return
        const isFollowing = profileUser.isFollowedByCurrentUser ?? false

        try {
            if (isFollowing) {
                await unfollowUser(userId).unwrap()
                toast.success('Takibi bıraktınız')
            } else {
                await followUser(userId).unwrap()
                toast.success('Takip ediyorsunuz! 🎉')
            }
            // RTK Query will automatically invalidate and refetch
        } catch (error: any) {
            // 409 Conflict - İşlem zaten yapılmış (race condition veya state senkronizasyon sorunu)
            if (error.status === 409 || error.data?.status === 409) {
                // Sessizce handle et, RTK Query zaten state'i güncelleyecek
                // Sadece kullanıcıya bilgi ver
                const message = error.data?.message || 'Bu işlem zaten yapılmış'
                if (message.includes('zaten') || message.includes('already')) {
                    // Sessizce handle et, toast gösterme
                    return
                }
            }
            // Diğer hatalar için toast göster
            const errorMessage = error.data?.message || error.message || 'İşlem başarısız'
            if (errorMessage !== 'Bu işlem zaten yapılmış.') {
                toast.error(errorMessage)
            }
        }
    }

    function handlePostUpdated() {
        refetchUserPosts()
    }

    const isLoading = isLoadingProfile || isLoadingPosts || isLoadingLikedPosts

    const isOwnProfile = currentUser?.id === userId

    // Filter posts based on active tab
    const displayPosts = activeTab === 'posts'
        ? posts
        : activeTab === 'media'
            ? posts.filter(p => p.imageUrl)
            : likedPosts

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center transition-colors duration-300">
                <GlassmorphismCard>
                    <div className="text-center py-12">
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kullanıcı bulunamadı</p>
                        <Link href="/feed">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all"
                            >
                                Ana Sayfaya Dön
                            </motion.button>
                        </Link>
                    </div>
                </GlassmorphismCard>
            </div>
        )
    }

    const userName = profileUser.firstName && profileUser.lastName
        ? `${profileUser.firstName} ${profileUser.lastName}`
        : profileUser.username

    return (
        <div className="space-y-4 lg:pt-2">
            {/* Cover & Profile Section */}
            <div className="relative">
                <div className="container mx-auto max-w-4xl">
                    {/* Cover Photo */}
                    <div
                        className="relative h-48 sm:h-64 bg-gradient-to-br from-emerald-500 via-cyan-500 to-teal-500 overflow-hidden cursor-pointer rounded-2xl shadow-xl"
                        onClick={() => profileUser.coverImageUrl && setShowCoverLightbox(true)}
                    >
                        {profileUser.coverImageUrl && (
                            <img
                                src={profileUser.coverImageUrl}
                                alt="Cover"
                                className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                            />
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="px-4 sm:px-6">
                        <div className="relative -mt-16 mb-4">
                            {/* Avatar */}
                            <div className="relative inline-block">
                                <div
                                    className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/40 ring-4 ring-white dark:ring-gray-900 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
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
                        <div className="flex items-center gap-2 mb-4">
                            {!isOwnProfile ? (
                                <motion.button
                                    onClick={handleFollowToggle}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex-1 px-4 py-2.5 rounded-2xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${profileUser?.isFollowedByCurrentUser
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        : 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-teal-600 text-white shadow-emerald-500/30'
                                        }`}
                                >
                                    {profileUser?.isFollowedByCurrentUser ? (
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
                            ) : (
                                <Link href="/profile" className="flex-1">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-teal-600 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        Profilimi Düzenle
                                    </motion.button>
                                </Link>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                {userName}
                            </h2>
                            <p className="text-muted-foreground mb-3">@{profileUser.username}</p>

                            {profileUser.bio && (
                                <p className="text-foreground/90 mb-3 leading-relaxed">
                                    {profileUser.bio}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
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
                                    <span className="font-bold text-foreground">{profileUser.followingCount || 0}</span>
                                    <span className="text-muted-foreground ml-1">Takip</span>
                                </div>
                                <div>
                                    <span className="font-bold text-foreground">{profileUser.followersCount || 0}</span>
                                    <span className="text-muted-foreground ml-1">Takipçi</span>
                                </div>
                                <div>
                                    <span className="font-bold text-foreground">{posts.length}</span>
                                    <span className="text-muted-foreground ml-1">Gönderi</span>
                                </div>
                            </div>
                        </div>

                        {/* Gamification Stats */}
                        {profileUser.gamification && (
                            <div className="mb-6">
                                <GamificationStats stats={profileUser.gamification} />
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="border-b border-white/10 dark:border-white/5 mb-6">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`flex-1 py-4 px-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'posts'
                                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                    <span className="hidden sm:inline">Gönderiler</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('media')}
                                    className={`flex-1 py-4 px-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'media'
                                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Medya</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('likes')}
                                    className={`flex-1 py-4 px-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'likes'
                                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <Heart className="w-4 h-4" />
                                    <span className="hidden sm:inline">Beğeniler</span>
                                </button>
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="pb-12">
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="text-center">
                                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                                        </div>
                                    </div>
                                ) : displayPosts.length > 0 ? (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
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
                                            ) : activeTab === 'media' ? (
                                                <>
                                                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Medya yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Fotoğraf içeren gönderiler burada görünecek
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                        Beğeni yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        Beğendiği gönderiler burada görünecek
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
            </div>

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


