import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { extractErrorMessage, isAuthError, logError, isOnline } from '../utils/error-handler'

/**
 * Enhanced API Client with Retry Logic, Better Error Handling, and Offline Detection
 */

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const RETRY_STATUS_CODES = [408, 500, 502, 503, 504] // 429 excluded - rate limiting shouldn't be retried

// Create axios instance with cookie support
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
})

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Check if error should be retried
 */
function shouldRetry(error: AxiosError, retryCount: number): boolean {
  if (retryCount >= MAX_RETRIES) return false

  // Don't retry if offline
  if (!isOnline()) return false

  // Don't retry auth errors
  if (isAuthError(error)) return false

  // Retry on network errors
  if (!error.response) return true

  // Retry on specific status codes
  if (error.response && RETRY_STATUS_CODES.includes(error.response.status)) {
    return true
  }

  return false
}

/**
 * Request interceptor - Handle offline check
 * Note: Token is now handled via httpOnly cookies automatically
 */
apiClient.interceptors.request.use(
  (config) => {
    // Check if online
    if (!isOnline()) {
      return Promise.reject(new Error('No internet connection'))
    }

    // Add request metadata for logging
    config.metadata = {
      startTime: new Date(),
      retryCount: config.metadata?.retryCount || 0
    }

    // Add Authorization header from localStorage if available (fallback for mobile)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    logError(error, 'Request Interceptor')
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle errors and retry logic
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log request duration in development
    if (
      process.env.NODE_ENV === 'development' &&
      response.config.metadata &&
      response.config.metadata.startTime instanceof Date
    ) {
      const duration =
        new Date().getTime() - response.config.metadata.startTime.getTime();
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & {
      metadata?: { retryCount: number; startTime: Date }
    }

    // Enhanced error logging for debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 API Error Details')
      console.log('URL:', config?.url)
      console.log('Method:', config?.method)
      console.log('Status:', error.response?.status)
      console.log('Response Data:', error.response?.data)
      console.log('Error Code:', error.code)
      console.log('Error Message:', error.message)
      console.log('Has Response:', !!error.response)
      console.log('Has Request:', !!error.request)
      console.groupEnd()
    }

    // Handle auth errors (401, 403)
    if (error.response?.status === 401) {
      // Don't try to refresh if the error is from the refresh endpoint itself
      const isRefreshEndpoint = config?.url?.includes('/auth/refresh')

      if (isRefreshEndpoint) {
        // Refresh endpoint failed, redirect to login immediately
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          // Clear auth data to prevent infinite loops
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_authenticated')
          localStorage.removeItem('auth_token')

          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        }
        logError(error, 'Token Refresh Endpoint Failed')
        return Promise.reject(error)
      }

      // Try to refresh token on 401 (only once)
      if (!config._retry) {
        config._retry = true

        try {
          // Attempt to refresh access token
          await apiClient.post('/auth/refresh')

          // Retry original request
          return apiClient(config)
        } catch (refreshError: any) {
          // Refresh failed - create a more descriptive error
          const authError = new Error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.')
            ; (authError as any).response = refreshError.response || {
              status: 401,
              data: {
                success: false,
                error: {
                  code: 'AUTH_003',
                  message: 'Token refresh failed'
                }
              }
            }

          // Redirect to login
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            // Clear auth data
            localStorage.removeItem('auth_user')
            localStorage.removeItem('auth_authenticated')
            localStorage.removeItem('auth_token')

            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
          }
          logError(refreshError, 'Token Refresh Failed')
          return Promise.reject(authError)
        }
      }

      // If retry already attempted, redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Clear auth data
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_authenticated')
        localStorage.removeItem('auth_token')

        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      }
      logError(error, 'Authentication Error')
      return Promise.reject(error)
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      logError(error, 'Rate Limit Exceeded')
      // Don't retry rate limit errors - they will fail again
      return Promise.reject(error)
    }

    // Handle forbidden (403)
    if (error.response?.status === 403) {
      logError(error, 'Authorization Error')
      return Promise.reject(error)
    }

    // Initialize retry count
    if (!config.metadata) {
      config.metadata = { retryCount: 0, startTime: new Date() }
    }

    // Check if should retry
    if (shouldRetry(error, config.metadata.retryCount)) {
      config.metadata.retryCount++

      // Calculate delay with exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, config.metadata.retryCount - 1)

      console.log(
        `🔄 Retrying request (${config.metadata.retryCount}/${MAX_RETRIES}) after ${delay}ms...`
      )

      await sleep(delay)

      // Retry request
      return apiClient(config)
    }

    // Log error
    logError(error, 'API Error')

    return Promise.reject(error)
  }
)

/**
 * Helper function to handle API errors consistently
 */
export function handleApiError(error: any): never {
  const message = extractErrorMessage(error)
  throw new Error(message)
}

/**
 * Generic request wrapper with error handling
 */
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data,
      ...config,
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

export default apiClient

// Extend AxiosRequestConfig type to include metadata and retry flag
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      retryCount: number
      startTime: Date
    }
    _retry?: boolean
  }
}

