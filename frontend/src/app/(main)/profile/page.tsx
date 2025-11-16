'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout, updateUser } from '@/store/slices/auth-slice'
import { usersApi } from '@/lib/api/users'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { AvatarUploadModal } from '@/components/profile/avatar-upload-modal'
import { CoverUploadModal } from '@/components/profile/cover-upload-modal'
import { EditProfileModal } from '@/components/profile/edit-profile-modal'
import {
    ArrowLeft,
    Settings,
    Camera,
    MapPin,
    Link as LinkIcon,
    Calendar,
    Edit3,
    LogOut,
    TrendingUp,
    Heart,
    MessageCircle,
    Grid,
    Bookmark,
    Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { postsApi } from '@/lib/api/posts'
import { PostInterface } from '@/interfaces/post.interface'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function ProfilePage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'media'>('posts')
    const [posts, setPosts] = useState<PostInterface[]>([])
    const [likedPosts, setLikedPosts] = useState<PostInterface[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [showCoverModal, setShowCoverModal] = useState(false)
    const [showAvatarLightbox, setShowAvatarLightbox] = useState(false)
    const [showCoverLightbox, setShowCoverLightbox] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [coverUrl, setCoverUrl] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }
        if (user) {
            loadUserPosts()
            // Set initial avatar and cover from user data
            if (user.avatarUrl) {
                setAvatarUrl(user.avatarUrl)
            }
            if (user.coverImageUrl) {
                setCoverUrl(user.coverImageUrl)
            }
        }
    }, [router, user])

    async function loadUserPosts() {
        if (!user) return

        setIsLoading(true)
        try {
            const [userPosts, userLikedPosts] = await Promise.all([
                postsApi.getPosts({ userId: user.id, limit: 50 }),
                usersApi.getUserLikedPosts(user.id, 50)
            ])
            setPosts(userPosts)
            setLikedPosts(userLikedPosts)
        } catch (error) {
            toast.error('Gönderiler yüklenemedi')
        } finally {
            setIsLoading(false)
        }
    }

    function handlePostUpdated() {
        loadUserPosts()
    }

    function handleLogout() {
        dispatch(logout())
        router.push('/login')
    }

    async function handleAvatarUploaded(url: string) {
        try {
            const updatedUser = await usersApi.updateAvatar(url)
            setAvatarUrl(url)
            dispatch(updateUser(updatedUser))
            toast.success('Profil fotoğrafı güncellendi!')
        } catch (error) {
            toast.error('Profil fotoğrafı güncellenemedi')
            console.error('Avatar update error:', error)
        }
    }

    async function handleCoverUploaded(url: string) {
        try {
            const updatedUser = await usersApi.updateCoverImage(url)
            setCoverUrl(url)
            dispatch(updateUser(updatedUser))
            toast.success('Kapak fotoğrafı güncellendi!')
        } catch (error) {
            toast.error('Kapak fotoğrafı güncellenemedi')
            console.error('Cover update error:', error)
        }
    }

    // Filter posts based on active tab
    const displayPosts = activeTab === 'posts'
        ? posts
        : activeTab === 'media'
            ? posts.filter(p => p.imageUrl)
            : likedPosts

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

    const userName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username

    return (
        <div className="space-y-4 lg:pt-2">
            {/* Cover & Profile Section */}
            <div className="relative">
                <div className="container mx-auto max-w-4xl">
                    {/* Cover Photo */}
                    <div
                        className="relative h-48 sm:h-64 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 overflow-hidden cursor-pointer"
                        onClick={() => coverUrl && setShowCoverLightbox(true)}
                    >
                        {coverUrl && (
                            <img
                                src={coverUrl}
                                alt="Cover"
                                className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                            />
                        )}
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowCoverModal(true)
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors z-10"
                            title="Kapak fotoğrafını değiştir"
                        >
                            <Camera className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Profile Info */}
                    <div className="px-4 sm:px-6">
                        <div className="relative -mt-16 mb-4">
                            {/* Avatar */}
                            <div className="relative inline-block">
                                <div
                                    className="w-32 h-32 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-gray-900 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => avatarUrl && setShowAvatarLightbox(true)}
                                >
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-4xl">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowAvatarModal(true)
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute bottom-2 right-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-colors z-10"
                                    title="Profil fotoğrafını değiştir"
                                >
                                    <Camera className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mb-4">
                            <motion.button
                                onClick={() => setShowEditModal(true)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                Profili Düzenle
                            </motion.button>

                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Çıkış
                            </motion.button>
                        </div>

                        {/* User Info */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {userName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">@{user.username}</p>

                            {user.bio && (
                                <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                                    {user.bio}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {user.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                                {user.website && (
                                    <a
                                        href={user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        <span>{user.website.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {formatDistanceToNow(new Date(user.createdAt), {
                                            addSuffix: true,
                                            locale: tr
                                        })} katıldı
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6">
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white">{user.followingCount || 0}</span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-1">Takip</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 dark:text-white">{user.followersCount || 0}</span>
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
                                    onClick={() => setActiveTab('media')}
                                    className={`flex-1 py-4 px-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'media'
                                        ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Medya</span>
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
                                                        Henüz gönderin yok
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                        İlk gönderini oluştur ve topluluğa katıl!
                                                    </p>
                                                    <Link href="/feed">
                                                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                                                            Gönderi Oluştur
                                                        </button>
                                                    </Link>
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
                                                        Beğendiğin gönderiler burada görünecek
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

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />

            {/* Avatar Upload Modal */}
            <AvatarUploadModal
                isOpen={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                onAvatarUploaded={handleAvatarUploaded}
                currentAvatar={avatarUrl}
            />

            {/* Cover Upload Modal */}
            <CoverUploadModal
                isOpen={showCoverModal}
                onClose={() => setShowCoverModal(false)}
                onCoverUploaded={handleCoverUploaded}
                currentCover={coverUrl}
            />

            {/* Avatar Lightbox */}
            {avatarUrl && (
                <ImageLightbox
                    isOpen={showAvatarLightbox}
                    onClose={() => setShowAvatarLightbox(false)}
                    imageUrl={avatarUrl}
                    alt={`${user.username} profil fotoğrafı`}
                />
            )}

            {/* Cover Lightbox */}
            {coverUrl && (
                <ImageLightbox
                    isOpen={showCoverLightbox}
                    onClose={() => setShowCoverLightbox(false)}
                    imageUrl={coverUrl}
                    alt={`${user.username} kapak fotoğrafı`}
                />
            )}
        </div>
    )
}
