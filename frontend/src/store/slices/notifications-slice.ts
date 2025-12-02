import { createSlice, createAsyncThunk, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { NotificationInterface } from '@/interfaces/notification.interface'
import { notificationsApi } from '@/lib/api/notifications'
import { api } from '@/store/api/api'
import { RootState } from '@/store/store'

const notificationsAdapter = createEntityAdapter<NotificationInterface>({
    sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
})

interface NotificationsState extends EntityState<NotificationInterface, string> {
    unreadCount: number
    isLoading: boolean
    error: string | null
}

const initialState: NotificationsState = notificationsAdapter.getInitialState({
    unreadCount: 0,
    isLoading: false,
    error: null
})

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
        addNotification: (state, action) => {
            notificationsAdapter.addOne(state, action.payload)
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
            notificationsAdapter.setAll(state, action.payload)
        })
        builder.addCase(fetchNotifications.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'Failed to fetch notifications'
        })

        // Mark as read
        builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
            const { id } = action.payload
            const existingNotification = state.entities[id]
            if (existingNotification && !existingNotification.isRead) {
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
            notificationsAdapter.updateOne(state, {
                id,
                changes: { isRead: true }
            })
        })

        // Mark all as read
        builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
            const updates = state.ids.map(id => ({
                id,
                changes: { isRead: true }
            }))
            notificationsAdapter.updateMany(state, updates)
            state.unreadCount = 0
        })

        // Delete notification
        builder.addCase(deleteNotification.fulfilled, (state, action) => {
            const id = action.payload
            const existingNotification = state.entities[id]
            if (existingNotification && !existingNotification.isRead) {
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
            notificationsAdapter.removeOne(state, id)
        })

        // RTK Query integration
        builder.addMatcher(
            api.endpoints.getUnreadNotificationsCount.matchFulfilled,
            (state, action) => {
                state.unreadCount = action.payload?.count ?? 0
            }
        )
    }
})

export const { addNotification, incrementUnreadCount, resetUnreadCount } = notificationsSlice.actions

export const {
    selectAll: selectAllNotifications,
    selectById: selectNotificationById,
    selectIds: selectNotificationIds
} = notificationsAdapter.getSelectors((state: RootState) => state.notifications)

export default notificationsSlice.reducer
