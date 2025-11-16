import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth-slice'
import postsReducer from './slices/posts-slice'
import categoriesReducer from './slices/categories-slice'
import followReducer from './slices/follow-slice'
import searchReducer from './slices/search-slice'
import notificationsReducer from './slices/notifications-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    follow: followReducer,
    search: searchReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

