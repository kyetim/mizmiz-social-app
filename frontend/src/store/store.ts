import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './slices/auth-slice'
import postsReducer from './slices/posts-slice'
import followReducer from './slices/follow-slice'
import searchReducer from './slices/search-slice'
import notificationsReducer from './slices/notifications-slice'
import { api } from './api/api'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    posts: postsReducer,
    follow: followReducer,
    search: searchReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

