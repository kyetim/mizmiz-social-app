import axios from 'axios'
import { NotificationInterface } from '@/interfaces/notification.interface'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const notificationsApi = {
    // Get user's notifications
    async getNotifications(limit = 50, offset = 0): Promise<NotificationInterface[]> {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/notifications`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { limit, offset }
        })
        return response.data.data
    },

    // Get unread notification count
    async getUnreadCount(): Promise<number> {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/notifications/unread-count`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data.count
    },

    // Mark notification as read
    async markAsRead(notificationId: string): Promise<NotificationInterface> {
        const token = localStorage.getItem('token')
        const response = await axios.put(
            `${API_URL}/notifications/${notificationId}/read`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data.data
    },

    // Mark all notifications as read
    async markAllAsRead(): Promise<void> {
        const token = localStorage.getItem('token')
        await axios.put(
            `${API_URL}/notifications/read-all`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    },

    // Delete notification
    async deleteNotification(notificationId: string): Promise<void> {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_URL}/notifications/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

