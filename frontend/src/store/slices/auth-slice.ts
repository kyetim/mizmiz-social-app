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

// Initialize state from localStorage if available (for mobile persistence)
const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    }
  }

  try {
    const storedUser = localStorage.getItem('auth_user')
    const storedAuthenticated = localStorage.getItem('auth_authenticated')
    
    if (storedUser && storedAuthenticated === 'true') {
      const user = JSON.parse(storedUser)
      return {
        user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      }
    }
  } catch (e) {
    console.warn('Failed to load auth from localStorage:', e)
  }

  return {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  }
}

const initialState: AuthState = getInitialState()

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
      // Clear localStorage as well
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_authenticated')
        } catch (e) {
          console.warn('Failed to clear auth from localStorage:', e)
        }
      }
      // Cookies are cleared by backend
      // Note: Cache clearing for posts and categories will be handled by middleware
    },
    setCredentials: (state, action: PayloadAction<{ user: UserInterface }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      // Store in localStorage as well
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
          localStorage.setItem('auth_authenticated', 'true')
        } catch (e) {
          console.warn('Failed to store auth in localStorage:', e)
        }
      }
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
        // Store user in localStorage as fallback for mobile devices
        // This ensures state persists even if cookies aren't immediately available
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
            localStorage.setItem('auth_authenticated', 'true')
          } catch (e) {
            console.warn('Failed to store auth in localStorage:', e)
          }
        }
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
        // Store user in localStorage as fallback for mobile devices
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
            localStorage.setItem('auth_authenticated', 'true')
          } catch (e) {
            console.warn('Failed to store auth in localStorage:', e)
          }
        }
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
      .addMatcher(api.endpoints.getCurrentUser.matchRejected, (state, action) => {
        state.isLoading = false
        // Don't clear state on 401 error from getCurrentUser
        // This causes issues on mobile where cookies might be delayed or unstable
        // We trust localStorage/state persistence instead
        // If the token is truly invalid, backend API calls will fail anyway
        if (action.payload?.status === 401) {
           console.warn('getCurrentUser returned 401, but keeping session active based on client state')
        }
      })
  },
})

export const { logout, setCredentials, updateUser } = authSlice.actions
export default authSlice.reducer

