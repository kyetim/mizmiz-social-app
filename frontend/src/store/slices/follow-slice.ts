import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { usersApi } from '@/lib/api/users'
import { UserInterface } from '@/interfaces/user.interface'

interface FollowState {
    following: string[] // User IDs that current user is following
    followers: UserInterface[]
    followingUsers: UserInterface[]
    isLoading: boolean
    error: string | null
}

const initialState: FollowState = {
    following: [],
    followers: [],
    followingUsers: [],
    isLoading: false,
    error: null
}

// Async thunks
export const followUser = createAsyncThunk(
    'follow/followUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            await usersApi.followUser(userId)
            return userId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to follow user')
        }
    }
)

export const unfollowUser = createAsyncThunk(
    'follow/unfollowUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            await usersApi.unfollowUser(userId)
            return userId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user')
        }
    }
)

export const checkIsFollowing = createAsyncThunk(
    'follow/checkIsFollowing',
    async (userId: string, { rejectWithValue }) => {
        try {
            const result = await usersApi.isFollowing(userId)
            return { userId, isFollowing: result }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to check follow status')
        }
    }
)

export const fetchFollowers = createAsyncThunk(
    'follow/fetchFollowers',
    async (userId: string, { rejectWithValue }) => {
        try {
            const followers = await usersApi.getFollowers(userId)
            return followers
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers')
        }
    }
)

export const fetchFollowing = createAsyncThunk(
    'follow/fetchFollowing',
    async (userId: string, { rejectWithValue }) => {
        try {
            const following = await usersApi.getFollowing(userId)
            return following
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch following')
        }
    }
)

const followSlice = createSlice({
    name: 'follow',
    initialState,
    reducers: {
        clearFollowError: (state) => {
            state.error = null
        },
        setFollowing: (state, action: PayloadAction<string[]>) => {
            state.following = action.payload
        }
    },
    extraReducers: (builder) => {
        // Follow user
        builder
            .addCase(followUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.isLoading = false
                if (!state.following.includes(action.payload)) {
                    state.following.push(action.payload)
                }
            })
            .addCase(followUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Unfollow user
        builder
            .addCase(unfollowUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.following = state.following.filter(id => id !== action.payload)
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Check is following
        builder
            .addCase(checkIsFollowing.fulfilled, (state, action) => {
                if (action.payload.isFollowing) {
                    if (!state.following.includes(action.payload.userId)) {
                        state.following.push(action.payload.userId)
                    }
                } else {
                    state.following = state.following.filter(id => id !== action.payload.userId)
                }
            })

        // Fetch followers
        builder
            .addCase(fetchFollowers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                state.isLoading = false
                state.followers = action.payload
            })
            .addCase(fetchFollowers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Fetch following
        builder
            .addCase(fetchFollowing.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchFollowing.fulfilled, (state, action) => {
                state.isLoading = false
                state.followingUsers = action.payload
            })
            .addCase(fetchFollowing.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})

export const { clearFollowError, setFollowing } = followSlice.actions
export default followSlice.reducer

