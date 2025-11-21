'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setFollowing } from '@/store/slices/follow-slice'
import { useFollowUserMutation, useUnfollowUserMutation } from '@/store/api/api'
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
import { usersApi } from '@/lib/api/users'
import { UserInterface } from '@/interfaces/user.interface'
import { toast } from 'react-hot-toast'

export default function PeoplePage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user: currentUser } = useAppSelector((state) => state.auth)
    const { following } = useAppSelector((state) => state.follow)
    const [followUser] = useFollowUserMutation()
    const [unfollowUser] = useUnfollowUserMutation()
    const [users, setUsers] = useState<UserInterface[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<'all' | 'suggested'>('all')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }
        loadUsers()
    }, [router])

    useEffect(() => {
        if (searchQuery.trim()) {
            performSearch()
        } else {
            setFilteredUsers(users)
        }
    }, [searchQuery, users])

    async function loadUsers() {
        setIsLoading(true)
        try {
            const usersData = await usersApi.getUsers({ limit: 50 })
            // Filter out current user
            const otherUsers = usersData.filter(u => u.id !== currentUser?.id)
            setUsers(otherUsers)
            setFilteredUsers(otherUsers)
            
            // Update Redux state with following status from API
            const followingIds = otherUsers
                .filter(u => u.isFollowing)
                .map(u => u.id)
            if (followingIds.length > 0) {
                dispatch(setFollowing([...following, ...followingIds.filter(id => !following.includes(id))]))
            }
        } catch (error) {
            toast.error('Kullanıcılar yüklenemedi')
        } finally {
            setIsLoading(false)
        }
    }

    function performSearch() {
        const query = searchQuery.toLowerCase().trim()
        const searched = users.filter(user =>
            user.username?.toLowerCase().includes(query) ||
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        )
        setFilteredUsers(searched)
    }

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
            toast.error(error.data?.message || 'İşlem başarısız')
        }
    }

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
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">İnsanlar</h1>
            </div>
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
                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-16 py-3 sm:py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 transition-all shadow-sm"
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
                        "{searchQuery}" için {filteredUsers.length} kullanıcı bulundu
                    </motion.p>
                )}
            </motion.div>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <motion.button
                    onClick={() => setActiveTab('all')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-sm min-h-[44px] ${activeTab === 'all'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-sm min-h-[44px] ${activeTab === 'suggested'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                                                    {user.bio}
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
                                            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${(user.isFollowing || following.includes(user.id))
                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/30'
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
                                        "{searchQuery}" ile eşleşen kullanıcı yok
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
