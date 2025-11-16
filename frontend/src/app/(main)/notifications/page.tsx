'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from '@/store/slices/notifications-slice'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    Check,
    Trash2,
    CheckCheck
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import { NotificationInterface } from '@/interfaces/notification.interface'

export default function NotificationsPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { notifications, unreadCount, isLoading } = useAppSelector((state) => state.notifications)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }
        dispatch(fetchNotifications({}))
    }, [router, dispatch])

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await dispatch(markNotificationAsRead(notificationId)).unwrap()
        } catch (error) {
            toast.error('Bildirim güncellenemedi')
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await dispatch(markAllNotificationsAsRead()).unwrap()
            toast.success('Tüm bildirimler okundu olarak işaretlendi')
        } catch (error) {
            toast.error('Bildirimler güncellenemedi')
        }
    }

    const handleDelete = async (notificationId: string) => {
        try {
            await dispatch(deleteNotification(notificationId)).unwrap()
            toast.success('Bildirim silindi')
        } catch (error) {
            toast.error('Bildirim silinemedi')
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
            <div className="bg-white dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700/30 overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Bildirimler
                                </h1>
                                {unreadCount > 0 && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {unreadCount} okunmamış bildirim
                                    </p>
                                )}
                            </div>
                        </div>

                        {notifications.length > 0 && unreadCount > 0 && (
                            <motion.button
                                onClick={handleMarkAllAsRead}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <CheckCheck className="w-4 h-4" />
                                <span className="hidden sm:inline">Tümünü Okundu İşaretle</span>
                            </motion.button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-3 font-medium transition-colors relative ${filter === 'all'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Tümü
                            {filter === 'all' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-3 font-medium transition-colors relative ${filter === 'unread'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Okunmamış
                            {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                            {filter === 'unread' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className={`group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${!notification.isRead ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4 p-4 sm:p-6">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                                                    className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
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
                                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
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
                            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {filter === 'unread' ? 'Okunmamış bildirim yok' : 'Henüz bildirim yok'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {filter === 'unread'
                                    ? 'Tüm bildirimlerinizi okudunuz'
                                    : 'Bildirimleriniz burada görünecek'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

