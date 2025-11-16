import { Request, Response } from 'express'
import { NotificationService } from '../services/notification.service'
import { asyncHandler } from '../middleware/error.middleware'

interface AuthRequest extends Request {
    user?: { userId: string; role?: string }
}

export const notificationController = {
    // Get user's notifications
    getNotifications: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const { limit, offset } = req.query

        const notifications = await NotificationService.getUserNotifications(
            req.user.userId,
            limit ? parseInt(limit as string) : undefined,
            offset ? parseInt(offset as string) : undefined
        )

        res.status(200).json({
            success: true,
            data: notifications
        })
    }),

    // Get unread notification count
    getUnreadCount: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const count = await NotificationService.getUnreadCount(req.user.userId)

        res.status(200).json({
            success: true,
            data: { count }
        })
    }),

    // Mark notification as read
    markAsRead: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const { notificationId } = req.params

        const notification = await NotificationService.markAsRead(
            notificationId,
            req.user.userId
        )

        res.status(200).json({
            success: true,
            data: notification
        })
    }),

    // Mark all notifications as read
    markAllAsRead: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        await NotificationService.markAllAsRead(req.user.userId)

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        })
    }),

    // Delete notification
    deleteNotification: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const { notificationId } = req.params

        await NotificationService.deleteNotification(
            notificationId,
            req.user.userId
        )

        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        })
    })
}

