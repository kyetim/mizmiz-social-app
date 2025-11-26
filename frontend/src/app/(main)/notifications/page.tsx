'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import {
    useGetNotificationsQuery,
    useGetUnreadNotificationsCountQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useDeleteNotificationMutation,
} from '@/store/api/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    Check,
    Trash2,
    CheckCheck,
    Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import { NotificationInterface } from '@/interfaces/notification.interface'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'

export default function NotificationsPage() {
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    // Real-time notifications with polling every 10 seconds
    const {
        data: notifications = [],
        isLoading: isLoadingNotifications,
        refetch: refetchNotifications,
    } = useGetNotificationsQuery(
        { limit: 100 },
        {
            skip: !user,
            pollingInterval: 10000, // Poll every 10 seconds for real-time updates
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    )

    // Real-time unread count with polling
    const {
        data: unreadCountData,
        refetch: refetchUnreadCount,
    } = useGetUnreadNotificationsCountQuery(undefined, {
        skip: !user,
        pollingInterval: 10000, // Poll every 10 seconds
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })

    const unreadCount = unreadCountData?.count || 0

    const [markAsRead] = useMarkNotificationAsReadMutation()
    const [markAllAsRead] = useMarkAllNotificationsAsReadMutation()
    const [deleteNotification] = useDeleteNotificationMutation()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
        }
    }, [router])

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead(notificationId).unwrap()
        } catch (error: any) {
            toast.error(error.data?.message || 'Bildirim güncellenemedi')
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead().unwrap()
            toast.success('Tüm bildirimler okundu olarak işaretlendi')
        } catch (error: any) {
            toast.error(error.data?.message || 'Bildirimler güncellenemedi')
        }
    }

    const handleDelete = async (notificationId: string) => {
        try {
            await deleteNotification(notificationId).unwrap()
            toast.success('Bildirim silindi')
        } catch (error: any) {
            toast.error(error.data?.message || 'Bildirim silinemedi')
        }
    }

    const handleNotificationClick = async (notification: NotificationInterface) => {
        // Mark as read if not already read
        if (!notification.isRead) {
            await handleMarkAsRead(notification.id)
        }

        // Navigate based on notification type
        if (notification.type === 'follow') {
            router.push(`/user/${notification.actorId}`)
        } else if (notification.type === 'like' || notification.type === 'comment') {
            if (notification.targetId) {
                router.push(`/post/${notification.targetId}`)
            }
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'follow':
                return <UserPlus className="w-5 h-5 text-green-600" />
            case 'like':
                return <Heart className="w-5 h-5 text-red-600" />
            case 'comment':
                return <MessageCircle className="w-5 h-5 text-blue-600" />
            default:
                return <Bell className="w-5 h-5 text-gray-600" />
        }
    }

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications

    return (
        <div className="space-y-4 lg:pt-2">
            {/* Header */}
            <GlassmorphismCard hover={false} tone="emerald" className="overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={() => router.back()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </motion.button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg text-white">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                        Bildirimler
                                        {unreadCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </motion.span>
                                        )}
                                    </h1>
                                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="flex items-center gap-1"
                                        >
                                            <Sparkles className="w-3 h-3 text-emerald-500" />
                                            Gerçek zamanlı güncelleniyor
                                        </motion.span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {notifications.length > 0 && unreadCount > 0 && (
                            <motion.button
                                onClick={handleMarkAllAsRead}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
                            >
                                <CheckCheck className="w-4 h-4" />
                                <span className="hidden sm:inline">Tümünü Okundu İşaretle</span>
                            </motion.button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 border-b border-white/10 dark:border-white/5">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-3 font-semibold transition-colors relative ${filter === 'all'
                                ? 'text-emerald-500'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Tümü
                            {filter === 'all' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-3 font-semibold transition-colors relative ${filter === 'unread'
                                ? 'text-emerald-500'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Okunmamış
                            {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                            {filter === 'unread' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-white/10 dark:divide-white/5">
                    {isLoadingNotifications ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                            </div>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <AnimatePresence>
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -100, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className={`group hover:bg-white/5 dark:hover:bg-white/5 transition-all cursor-pointer ${!notification.isRead
                                        ? 'bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent dark:from-emerald-500/5 dark:via-cyan-500/5 border-l-4 border-emerald-500'
                                        : 'border-l-4 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start gap-4 p-4 sm:p-6">
                                        {/* Icon */}
                                        <motion.div
                                            className="flex-shrink-0 mt-1"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            <div className={`p-2 rounded-xl ${!notification.isRead
                                                ? 'bg-emerald-500/20 dark:bg-emerald-500/10'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                                }`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        </motion.div>

                                        {/* Content */}
                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-500 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm ring-2 ring-emerald-500/20">
                                                    {notification.actor.avatarUrl ? (
                                                        <img
                                                            src={notification.actor.avatarUrl}
                                                            alt={notification.actor.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white text-sm font-semibold">
                                                            {notification.actor.username[0].toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-foreground">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                                            addSuffix: true,
                                                            locale: tr
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {!notification.isRead && (
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleMarkAsRead(notification.id)
                                                    }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors"
                                                    title="Okundu olarak işaretle"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </motion.button>
                                            )}
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(notification.id)
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="text-center py-16 px-4">
                            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                {filter === 'unread' ? 'Okunmamış bildirim yok' : 'Henüz bildirim yok'}
                            </h3>
                            <p className="text-muted-foreground">
                                {filter === 'unread'
                                    ? 'Tüm bildirimlerinizi okudunuz'
                                    : 'Bildirimleriniz burada görünecek'}
                            </p>
                        </div>
                    )}
                </div>
            </GlassmorphismCard>
        </div>
    )
}

