import { prisma } from '../lib/prisma'

export interface NotificationDto {
    userId: string
    actorId: string
    type: 'follow' | 'like' | 'comment' | 'mention'
    targetId?: string
    message: string
}

export const NotificationService = {
    // Create a new notification
    async createNotification(data: NotificationDto) {
        // Don't create notification if user is notifying themselves
        if (data.userId === data.actorId) {
            return null
        }

        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                actorId: data.actorId,
                type: data.type,
                targetId: data.targetId,
                message: data.message,
                isRead: false
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                    }
                }
            }
        })

        return notification
    },

    // Get user's notifications
    async getUserNotifications(userId: string, limit = 50, offset = 0) {
        const notifications = await prisma.notification.findMany({
            where: {
                userId
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip: offset
        })

        return notifications
    },

    // Get unread notification count
    async getUnreadCount(userId: string) {
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        })

        return count
    },

    // Mark notification as read
    async markAsRead(notificationId: string, userId: string) {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        })

        if (!notification) {
            throw new Error('Notification not found')
        }

        if (notification.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const updated = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
            include: {
                actor: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                    }
                }
            }
        })

        return updated
    },

    // Mark all notifications as read
    async markAllAsRead(userId: string) {
        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        })

        return { success: true }
    },

    // Delete a notification
    async deleteNotification(notificationId: string, userId: string) {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        })

        if (!notification) {
            throw new Error('Notification not found')
        }

        if (notification.userId !== userId) {
            throw new Error('Unauthorized')
        }

        await prisma.notification.delete({
            where: { id: notificationId }
        })

        return { success: true }
    },

    // Helper: Create follow notification
    async notifyFollow(followerId: string, followingId: string) {
        const follower = await prisma.user.findUnique({
            where: { id: followerId },
            select: { username: true, firstName: true, lastName: true }
        })

        if (!follower) return null

        const name = follower.firstName && follower.lastName
            ? `${follower.firstName} ${follower.lastName}`
            : follower.username

        return this.createNotification({
            userId: followingId,
            actorId: followerId,
            type: 'follow',
            message: `${name} seni takip etti`
        })
    },

    // Helper: Create like notification
    async notifyLike(likerId: string, postOwnerId: string, postId: string) {
        const liker = await prisma.user.findUnique({
            where: { id: likerId },
            select: { username: true, firstName: true, lastName: true }
        })

        if (!liker) return null

        const name = liker.firstName && liker.lastName
            ? `${liker.firstName} ${liker.lastName}`
            : liker.username

        return this.createNotification({
            userId: postOwnerId,
            actorId: likerId,
            type: 'like',
            targetId: postId,
            message: `${name} gönderini beğendi`
        })
    },

    // Helper: Create comment notification
    async notifyComment(commenterId: string, postOwnerId: string, postId: string) {
        const commenter = await prisma.user.findUnique({
            where: { id: commenterId },
            select: { username: true, firstName: true, lastName: true }
        })

        if (!commenter) return null

        const name = commenter.firstName && commenter.lastName
            ? `${commenter.firstName} ${commenter.lastName}`
            : commenter.username

        return this.createNotification({
            userId: postOwnerId,
            actorId: commenterId,
            type: 'comment',
            targetId: postId,
            message: `${name} gönderine yorum yaptı`
        })
    }
}

