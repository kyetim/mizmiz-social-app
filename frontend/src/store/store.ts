import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth-slice'
import postsReducer from './slices/posts-slice'
import categoriesReducer from './slices/categories-slice'
import followReducer from './slices/follow-slice'
import searchReducer from './slices/search-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    follow: followReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ['follow/setFollowing'],
        ignoredPaths: ['follow.following'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

