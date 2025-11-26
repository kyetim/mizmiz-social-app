'use client'

import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/store/hooks'
import { useGetNotificationsQuery } from '@/store/api/api'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react'
import type { NotificationInterface } from '@/interfaces/notification.interface'

/**
 * Global Notification Listener
 * Monitors for new notifications and shows pop-up toasts
 */
export function NotificationListener() {
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth)
    const previousNotificationsRef = useRef<Set<string>>(new Set())
    const isInitialLoadRef = useRef(true)

    // Poll for notifications every 10 seconds
    const { data: notifications = [] } = useGetNotificationsQuery(
        { limit: 10 },
        {
            skip: !user,
            pollingInterval: 10000, // Poll every 10 seconds
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    )

    useEffect(() => {
        if (!user || !notifications.length) return

        // Skip first load to avoid showing old notifications
        if (isInitialLoadRef.current) {
            previousNotificationsRef.current = new Set(notifications.map(n => n.id))
            isInitialLoadRef.current = false
            return
        }

        // Find new unread notifications
        const currentNotificationIds = new Set(notifications.map(n => n.id))
        const newNotifications = notifications.filter(
            n => !previousNotificationsRef.current.has(n.id) && !n.isRead
        )

        // Show toast for each new notification
        newNotifications.forEach((notification) => {
            const icon = getNotificationIcon(notification.type)

            toast(
                (t) => (
                    <div
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => {
                            toast.dismiss(t.id)
                            handleNotificationClick(notification)
                        }}
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-500 flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-emerald-500/20">
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
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {icon}
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    @{notification.actor.username}
                                </p>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {notification.message}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium group-hover:underline">
                                {getNotificationAction(notification)} →
                            </p>
                        </div>
                    </div>
                ),
                {
                    id: notification.id, // Prevent duplicate toasts
                    duration: 6000,
                    position: 'top-right',
                    style: {
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '20px',
                        padding: '16px',
                        boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 10px 10px -5px rgba(16, 185, 129, 0.1)',
                        maxWidth: '400px',
                    },
                    className: 'dark:bg-gray-900/95 dark:border-emerald-500/40 hover:shadow-xl transition-shadow',
                }
            )
        })

        // Update previous notifications set
        previousNotificationsRef.current = currentNotificationIds
    }, [notifications, user, router])

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'follow':
                return <UserPlus className="w-5 h-5 text-emerald-500" />
            case 'like':
                return <Heart className="w-5 h-5 text-red-500" />
            case 'comment':
                return <MessageCircle className="w-5 h-5 text-blue-500" />
            default:
                return <Bell className="w-5 h-5 text-gray-500" />
        }
    }

    const getNotificationAction = (notification: NotificationInterface) => {
        switch (notification.type) {
            case 'follow':
                return 'Profilini görüntüle'
            case 'like':
            case 'comment':
                return 'Gönderiyi görüntüle'
            default:
                return 'Görüntüle'
        }
    }

    const handleNotificationClick = (notification: NotificationInterface) => {
        if (notification.type === 'follow') {
            router.push(`/user/${notification.actorId}`)
        } else if (notification.type === 'like' || notification.type === 'comment') {
            if (notification.targetId) {
                router.push(`/post/${notification.targetId}`)
            }
        }
    }

    return null
}

