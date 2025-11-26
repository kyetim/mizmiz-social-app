'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setFollowing } from '@/store/slices/follow-slice'
import { useFollowUserMutation, useUnfollowUserMutation, useGetUsersQuery } from '@/store/api/api'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import {
    ArrowLeft,
    Users,
    UserPlus,
    Search,
    UserCheck,
    TrendingUp,
    Sparkles,
    X,
    Check
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { UserInterface } from '@/interfaces/user.interface'
import { getReadableErrorMessage, showErrorToast } from '@/lib/utils/error-handler'

export default function PeoplePage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user: currentUser } = useAppSelector((state) => state.auth)
    const { following } = useAppSelector((state) => state.follow)
    const [followUser] = useFollowUserMutation()
    const [unfollowUser] = useUnfollowUserMutation()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<'all' | 'suggested'>('all')
    const {
        data: usersData = [],
        isLoading: isFetchingUsers,
        isError: isUsersError,
        error: usersError,
        refetch: refetchUsers,
    } = useGetUsersQuery({ limit: 50 })
    const otherUsers = useMemo(
        () => usersData.filter((user) => user.id !== currentUser?.id),
        [usersData, currentUser?.id]
    )

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
        }
    }, [router])

    useEffect(() => {
        const followingIds = otherUsers
            .filter((user) => user.isFollowedByCurrentUser ?? user.isFollowing)
            .map((user) => user.id)
        if (followingIds.length > 0) {
            const newIds = followingIds.filter((id) => !following.includes(id))
            if (newIds.length > 0) {
                dispatch(setFollowing([...following, ...newIds]))
            }
        }
    }, [otherUsers, following, dispatch])

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return otherUsers
        const query = searchQuery.toLowerCase().trim()
        return otherUsers.filter(user =>
            user.username?.toLowerCase().includes(query) ||
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        )
    }, [searchQuery, otherUsers])

    async function handleFollow(userId: string) {
        try {
            if (following.includes(userId)) {
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
                const message = error.data?.message || 'Bu işlem zaten yapılmış'
                if (message.includes('zaten') || message.includes('already')) {
                    // Sessizce handle et, toast gösterme
                    return
                }
            }
            // Diğer hatalar için toast göster
            showErrorToast(error)
        }
    }

    const isLoading = isFetchingUsers && !isUsersError
    const usersErrorMessage = useMemo(
        () => (usersError ? getReadableErrorMessage(usersError, 'Kullanıcılar yüklenemedi') : ''),
        [usersError]
    )

    const displayUsers = activeTab === 'suggested'
        ? filteredUsers.slice(0, 10) // Show top 10 as suggestions
        : filteredUsers

    if (!currentUser) {
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
        <div className="space-y-3 sm:space-y-4 lg:pt-2">
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 ring-2 ring-blue-500/20">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">İnsanlar</h1>
            </motion.div>
            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-6"
            >
                <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-16 py-3 sm:py-3.5 bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm sm:text-base text-foreground placeholder-muted-foreground transition-all shadow-sm backdrop-blur-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                    >
                        &quot;{searchQuery}&quot; için {filteredUsers.length} kullanıcı bulundu
                    </motion.p>
                )}
            </motion.div>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <motion.button
                    onClick={() => setActiveTab('all')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-semibold text-sm sm:text-base transition-all shadow-sm min-h-[44px] ${activeTab === 'all'
                        ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/50 dark:bg-black/30 text-foreground/80 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 dark:border-white/10'
                        }`}
                >
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Tüm Kullanıcılar</span>
                    <span className="xs:hidden">Tümü</span>
                </motion.button>

                <motion.button
                    onClick={() => setActiveTab('suggested')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-semibold text-sm sm:text-base transition-all shadow-sm min-h-[44px] ${activeTab === 'suggested'
                        ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/50 dark:bg-black/30 text-foreground/80 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 dark:border-white/10'
                        }`}
                >
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Önerilen</span>
                </motion.button>
            </div>

            {/* Users Grid */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Kullanıcılar yükleniyor...</p>
                        </div>
                    </div>
                ) : isUsersError ? (
                    <GlassmorphismCard>
                        <div className="py-10 text-center space-y-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Bir sorun oluştu
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {usersErrorMessage || 'Kullanıcılar yüklenemedi. Lütfen tekrar deneyin.'}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => refetchUsers()}
                                    className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                                >
                                    Tekrar Dene
                                </button>
                            </div>
                        </div>
                    </GlassmorphismCard>
                ) : displayUsers.length > 0 ? (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                    >
                        {displayUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassmorphismCard className="hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        {/* Avatar */}
                                        <Link
                                            href={`/user/${user.id}`}
                                            className="relative flex-shrink-0 hover:opacity-80 transition-opacity"
                                        >
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-800 overflow-hidden">
                                                {user.avatarUrl ? (
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt={user.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white font-bold text-lg sm:text-xl">
                                                        {user.username?.[0]?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            {user.isVerified && (
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <UserCheck className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </Link>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/user/${user.id}`}
                                                className="block"
                                            >
                                                <h3 className="font-bold text-gray-900 dark:text-white text-base truncate hover:underline">
                                                    {user.firstName && user.lastName
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : user.username}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate hover:underline">
                                                    @{user.username}
                                                </p>
                                            </Link>
                                            {user.bio && (
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                                                    &quot;{user.bio}&quot;
                                                </p>
                                            )}

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    <span>{user.postsCount || 0} gönderi</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span>{user.followersCount || 0} takipçi</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Follow Button */}
                                        <motion.button
                                            onClick={() => handleFollow(user.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-sm ${(user.isFollowing || following.includes(user.id))
                                                ? 'bg-white/50 dark:bg-black/30 text-foreground/80 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 dark:border-white/10'
                                                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:shadow-lg shadow-blue-500/30'
                                                }`}
                                        >
                                            {(user.isFollowing || following.includes(user.id)) ? (
                                                <span className="flex items-center gap-1">
                                                    <UserCheck className="w-4 h-4" />
                                                    Takip Ediliyor
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <UserPlus className="w-4 h-4" />
                                                    Takip Et
                                                </span>
                                            )}
                                        </motion.button>
                                    </div>
                                </GlassmorphismCard>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <GlassmorphismCard>
                        <div className="text-center py-12">
                            {searchQuery ? (
                                <>
                                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        Kullanıcı bulunamadı
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        &quot;{searchQuery}&quot; ile eşleşen kullanıcı yok
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
                                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        Henüz kullanıcı yok
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        İlk kullanıcılar yakında burada görünecek!
                                    </p>
                                </>
                            )}
                        </div>
                    </GlassmorphismCard>
                )}
            </AnimatePresence>
        </div>
    )
}
