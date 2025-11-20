import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/lib/api/auth'
import { UserInterface } from '@/interfaces/user.interface'
import { api } from '@/store/api/api'

interface AuthState {
  user: UserInterface | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password })
      // Token is now in httpOnly cookie, no localStorage needed
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      username,
      email,
      password,
      firstName,
      lastName,
    }: {
      username: string
      email: string
      password: string
      firstName?: string
      lastName?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register({ username, email, password, firstName, lastName })
      // Token is now in httpOnly cookie, no localStorage needed
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      // Cookies are cleared by backend
      // Note: Cache clearing for posts and categories will be handled by middleware
    },
    setCredentials: (state, action: PayloadAction<{ user: UserInterface }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    updateUser: (state, action: PayloadAction<UserInterface>) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // RTK Query integration
    builder
      .addMatcher(api.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addMatcher(api.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addMatcher(api.endpoints.getCurrentUser.matchRejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { logout, setCredentials, updateUser } = authSlice.actions
export default authSlice.reducer

