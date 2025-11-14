import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { postsApi } from '@/lib/api/posts'
import { PostInterface } from '@/interfaces/post.interface'

interface PostsState {
  posts: PostInterface[]
  feedPosts: PostInterface[]
  explorePosts: PostInterface[]
  isLoading: boolean
  error: string | null
  lastFetch: number | null
  cacheTimeout: number // 5 minutes in ms
}

const CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes

const initialState: PostsState = {
  posts: [],
  feedPosts: [],
  explorePosts: [],
  isLoading: false,
  error: null,
  lastFetch: null,
  cacheTimeout: CACHE_TIMEOUT,
}

// Async thunks with cache check
export const fetchFeedPosts = createAsyncThunk(
  'posts/fetchFeedPosts',
  async ({ following, limit = 50, forceRefresh = false }: { following?: boolean; limit?: number; forceRefresh?: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { posts: PostsState }
      const now = Date.now()
      
      // Check if cache is still valid and we have data
      if (
        !forceRefresh &&
        state.posts.feedPosts.length > 0 &&
        state.posts.lastFetch &&
        now - state.posts.lastFetch < state.posts.cacheTimeout
      ) {
        console.log('📦 Using cached feed posts')
        return { posts: state.posts.feedPosts, fromCache: true }
      }

      console.log('🌐 Fetching fresh feed posts from server')
      const posts = await postsApi.getPosts({ following, limit })
      return { posts, fromCache: false }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts')
    }
  }
)

export const fetchExplorePosts = createAsyncThunk(
  'posts/fetchExplorePosts',
  async ({ limit = 20, forceRefresh = false }: { limit?: number; forceRefresh?: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { posts: PostsState }
      const now = Date.now()
      
      // Check if cache is still valid
      if (
        !forceRefresh &&
        state.posts.explorePosts.length > 0 &&
        state.posts.lastFetch &&
        now - state.posts.lastFetch < state.posts.cacheTimeout
      ) {
        console.log('📦 Using cached explore posts')
        return { posts: state.posts.explorePosts, fromCache: true }
      }

      console.log('🌐 Fetching fresh explore posts from server')
      const posts = await postsApi.getPosts({ limit })
      return { posts, fromCache: false }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts')
    }
  }
)

export const likePostOptimistic = createAsyncThunk(
  'posts/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postsApi.likePost(postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post')
    }
  }
)

export const unlikePostOptimistic = createAsyncThunk(
  'posts/unlikePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postsApi.unlikePost(postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post')
    }
  }
)

export const deletePostOptimistic = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postsApi.deletePost(postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post')
    }
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Optimistic update for like
    toggleLikeOptimistic: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
      const updatePost = (post: PostInterface) => {
        if (post.id === action.payload.postId) {
          post.isLikedByCurrentUser = !post.isLikedByCurrentUser
          post.likesCount += post.isLikedByCurrentUser ? 1 : -1
        }
      }

      state.feedPosts.forEach(updatePost)
      state.explorePosts.forEach(updatePost)
      state.posts.forEach(updatePost)
    },

    // Add new post to the beginning
    addPost: (state, action: PayloadAction<PostInterface>) => {
      state.feedPosts.unshift(action.payload)
      state.explorePosts.unshift(action.payload)
      state.posts.unshift(action.payload)
    },

    // Update existing post
    updatePost: (state, action: PayloadAction<PostInterface>) => {
      const updatePostInArray = (posts: PostInterface[]) => {
        const index = posts.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          posts[index] = action.payload
        }
      }

      updatePostInArray(state.feedPosts)
      updatePostInArray(state.explorePosts)
      updatePostInArray(state.posts)
    },

    // Increment comment count
    incrementCommentCount: (state, action: PayloadAction<string>) => {
      const updatePost = (post: PostInterface) => {
        if (post.id === action.payload) {
          post.commentsCount += 1
        }
      }

      state.feedPosts.forEach(updatePost)
      state.explorePosts.forEach(updatePost)
      state.posts.forEach(updatePost)
    },

    // Clear cache (for manual refresh or logout)
    clearCache: (state) => {
      state.posts = []
      state.feedPosts = []
      state.explorePosts = []
      state.lastFetch = null
    },

    // Set cache timeout (for testing or custom needs)
    setCacheTimeout: (state, action: PayloadAction<number>) => {
      state.cacheTimeout = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch Feed Posts
    builder
      .addCase(fetchFeedPosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.isLoading = false
        if (!action.payload.fromCache) {
          state.feedPosts = action.payload.posts
          state.lastFetch = Date.now()
        }
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Explore Posts
    builder
      .addCase(fetchExplorePosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchExplorePosts.fulfilled, (state, action) => {
        state.isLoading = false
        if (!action.payload.fromCache) {
          state.explorePosts = action.payload.posts
          state.lastFetch = Date.now()
        }
      })
      .addCase(fetchExplorePosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete Post Optimistic
    builder
      .addCase(deletePostOptimistic.fulfilled, (state, action) => {
        const postId = action.payload
        state.feedPosts = state.feedPosts.filter(p => p.id !== postId)
        state.explorePosts = state.explorePosts.filter(p => p.id !== postId)
        state.posts = state.posts.filter(p => p.id !== postId)
      })
  },
})

export const {
  toggleLikeOptimistic,
  addPost,
  updatePost,
  incrementCommentCount,
  clearCache,
  setCacheTimeout,
} = postsSlice.actions

export default postsSlice.reducer

