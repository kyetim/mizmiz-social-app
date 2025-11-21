import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInterface } from '@/interfaces/user.interface'
import { api } from '@/store/api/api'

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

// Note: followUser and unfollowUser are now RTK Query mutations
// This slice is kept for backward compatibility and local state management

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
        // Sync with RTK Query follow/unfollow mutations
        builder
            .addMatcher(api.endpoints.followUser.matchFulfilled, (state, action) => {
                const userId = action.meta.arg.originalArgs
                if (!state.following.includes(userId)) {
                    state.following.push(userId)
                }
            })
            .addMatcher(api.endpoints.unfollowUser.matchFulfilled, (state, action) => {
                const userId = action.meta.arg.originalArgs
                state.following = state.following.filter(id => id !== userId)
            })
            // Sync with getUserProfile query to update following state
            .addMatcher(api.endpoints.getUserProfile.matchFulfilled, (state, action) => {
                const user = action.payload
                const userId = action.meta.arg.originalArgs
                const isFollowing = user.isFollowedByCurrentUser ?? user.isFollowing ?? false
                if (isFollowing) {
                    if (!state.following.includes(userId)) {
                        state.following.push(userId)
                    }
                } else {
                    state.following = state.following.filter(id => id !== userId)
                }
            })
    }
})

export const { clearFollowError, setFollowing } = followSlice.actions
export default followSlice.reducer

