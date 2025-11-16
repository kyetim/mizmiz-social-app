import { Router } from 'express'
import { notificationController } from '../controllers/notification.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// All routes require authentication
router.use(authenticate)

// GET /api/notifications - Get user's notifications
router.get('/', notificationController.getNotifications)

// GET /api/notifications/unread-count - Get unread notification count
router.get('/unread-count', notificationController.getUnreadCount)

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead)

// PUT /api/notifications/:notificationId/read - Mark single notification as read
router.put('/:notificationId/read', notificationController.markAsRead)

// DELETE /api/notifications/:notificationId - Delete notification
router.delete('/:notificationId', notificationController.deleteNotification)

export default router

