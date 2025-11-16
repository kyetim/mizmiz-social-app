import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { NotificationInterface } from '@/interfaces/notification.interface'
import { notificationsApi } from '@/lib/api/notifications'

interface NotificationsState {
    notifications: NotificationInterface[]
    unreadCount: number
    isLoading: boolean
    error: string | null
}

const initialState: NotificationsState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null
}

// Async thunks
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (params: { limit?: number; offset?: number } = {}) => {
        const notifications = await notificationsApi.getNotifications(
            params.limit,
            params.offset
        )
        return notifications
    }
)

export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async () => {
        const count = await notificationsApi.getUnreadCount()
        return count
    }
)

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId: string) => {
        const notification = await notificationsApi.markAsRead(notificationId)
        return notification
    }
)

export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async () => {
        await notificationsApi.markAllAsRead()
    }
)

export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (notificationId: string) => {
        await notificationsApi.deleteNotification(notificationId)
        return notificationId
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<NotificationInterface>) => {
            state.notifications.unshift(action.payload)
            if (!action.payload.isRead) {
                state.unreadCount += 1
            }
        },
        incrementUnreadCount: (state) => {
            state.unreadCount += 1
        },
        resetUnreadCount: (state) => {
            state.unreadCount = 0
        }
    },
    extraReducers: (builder) => {
        // Fetch notifications
        builder.addCase(fetchNotifications.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.isLoading = false
            state.notifications = action.payload
        })
        builder.addCase(fetchNotifications.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'Failed to fetch notifications'
        })

        // Fetch unread count
        builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
            state.unreadCount = action.payload
        })

        // Mark as read
        builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload.id)
            if (notification && !notification.isRead) {
                notification.isRead = true
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
        })

        // Mark all as read
        builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
            state.notifications.forEach(n => {
                n.isRead = true
            })
            state.unreadCount = 0
        })

        // Delete notification
        builder.addCase(deleteNotification.fulfilled, (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload)
            if (notification && !notification.isRead) {
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
            state.notifications = state.notifications.filter(n => n.id !== action.payload)
        })
    }
})

export const { addNotification, incrementUnreadCount, resetUnreadCount } = notificationsSlice.actions
export default notificationsSlice.reducer

