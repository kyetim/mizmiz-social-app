import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { usersApi } from '@/lib/api/users'
import { postsApi } from '@/lib/api/posts'
import { UserInterface } from '@/interfaces/user.interface'
import { PostInterface } from '@/interfaces/post.interface'

interface SearchState {
    users: UserInterface[]
    posts: PostInterface[]
    query: string
    isLoading: boolean
    error: string | null
    hasSearched: boolean
}

const initialState: SearchState = {
    users: [],
    posts: [],
    query: '',
    isLoading: false,
    error: null,
    hasSearched: false
}

// Async thunks
export const searchUsers = createAsyncThunk(
    'search/searchUsers',
    async (query: string, { rejectWithValue }) => {
        try {
            const users = await usersApi.getUsers({ search: query, limit: 20 })
            return users
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search users')
        }
    }
)

export const searchPosts = createAsyncThunk(
    'search/searchPosts',
    async (query: string, { rejectWithValue }) => {
        try {
            // For now, we'll use explore posts with filters
            // TODO: Implement proper post search on backend
            const posts = await postsApi.getExplorePosts({ limit: 20 })
            // Client-side filtering as fallback
            const filtered = posts.filter(post => 
                post.content.toLowerCase().includes(query.toLowerCase())
            )
            return filtered
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search posts')
        }
    }
)

export const searchAll = createAsyncThunk(
    'search/searchAll',
    async (query: string, { dispatch, rejectWithValue }) => {
        try {
            // Search both users and posts
            await Promise.all([
                dispatch(searchUsers(query)),
                dispatch(searchPosts(query))
            ])
            return query
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search')
        }
    }
)

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.users = []
            state.posts = []
            state.query = ''
            state.error = null
            state.hasSearched = false
        },
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload
        }
    },
    extraReducers: (builder) => {
        // Search users
        builder
            .addCase(searchUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = action.payload
                state.hasSearched = true
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Search posts
        builder
            .addCase(searchPosts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(searchPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.posts = action.payload
                state.hasSearched = true
            })
            .addCase(searchPosts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Search all
        builder
            .addCase(searchAll.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(searchAll.fulfilled, (state, action) => {
                state.isLoading = false
                state.query = action.payload
                state.hasSearched = true
            })
            .addCase(searchAll.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})

export const { clearSearch, setQuery } = searchSlice.actions
export default searchSlice.reducer

