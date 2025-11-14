import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { categoriesApi } from '@/lib/api/categories'
import { Category } from '@/interfaces/category.interface'

interface CategoriesState {
    categories: Category[]
    trendingCategories: Category[]
    isLoading: boolean
    error: string | null
    lastFetch: number | null
    cacheTimeout: number
}

const CACHE_TIMEOUT = 10 * 60 * 1000 // 10 minutes (categories change less frequently)

const initialState: CategoriesState = {
    categories: [],
    trendingCategories: [],
    isLoading: false,
    error: null,
    lastFetch: null,
    cacheTimeout: CACHE_TIMEOUT,
}

// Async thunks with cache
export const fetchTrendingCategories = createAsyncThunk(
    'categories/fetchTrending',
    async ({ limit = 10, forceRefresh = false }: { limit?: number; forceRefresh?: boolean }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { categories: CategoriesState }
            const now = Date.now()

            // Check cache
            if (
                !forceRefresh &&
                state.categories.trendingCategories.length > 0 &&
                state.categories.lastFetch &&
                now - state.categories.lastFetch < state.categories.cacheTimeout
            ) {
                console.log('📦 Using cached trending categories')
                return { categories: state.categories.trendingCategories, fromCache: true }
            }

            console.log('🌐 Fetching fresh trending categories from server')
            const categories = await categoriesApi.getTrendingCategories(limit)
            return { categories, fromCache: false }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories')
        }
    }
)

export const fetchAllCategories = createAsyncThunk(
    'categories/fetchAll',
    async ({ forceRefresh = false }: { forceRefresh?: boolean }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { categories: CategoriesState }
            const now = Date.now()

            // Check cache
            if (
                !forceRefresh &&
                state.categories.categories.length > 0 &&
                state.categories.lastFetch &&
                now - state.categories.lastFetch < state.categories.cacheTimeout
            ) {
                console.log('📦 Using cached categories')
                return { categories: state.categories.categories, fromCache: true }
            }

            console.log('🌐 Fetching fresh categories from server')
            const categories = await categoriesApi.getCategories()
            return { categories, fromCache: false }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories')
        }
    }
)

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCache: (state) => {
            state.categories = []
            state.trendingCategories = []
            state.lastFetch = null
        },
        setCacheTimeout: (state, action: PayloadAction<number>) => {
            state.cacheTimeout = action.payload
        },
    },
    extraReducers: (builder) => {
        // Fetch Trending Categories
        builder
            .addCase(fetchTrendingCategories.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchTrendingCategories.fulfilled, (state, action) => {
                state.isLoading = false
                if (!action.payload.fromCache) {
                    state.trendingCategories = action.payload.categories
                    state.lastFetch = Date.now()
                }
            })
            .addCase(fetchTrendingCategories.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // Fetch All Categories
        builder
            .addCase(fetchAllCategories.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.isLoading = false
                if (!action.payload.fromCache) {
                    state.categories = action.payload.categories
                    state.lastFetch = Date.now()
                }
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { clearCache, setCacheTimeout } = categoriesSlice.actions
export default categoriesSlice.reducer

