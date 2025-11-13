/**
 * Frontend Error Handling Utilities
 * Provides consistent error handling across the application
 */

export interface ApiError {
    message: string
    code?: string
    requestId?: string
    timestamp?: string
    details?: any
    stack?: string
}

export interface ApiErrorResponse {
    success: false
    error: ApiError
}

/**
 * Error codes matching backend
 */
export const ErrorCode = {
    // Authentication & Authorization
    UNAUTHORIZED: 'AUTH_001',
    INVALID_CREDENTIALS: 'AUTH_002',
    TOKEN_EXPIRED: 'AUTH_003',
    TOKEN_INVALID: 'AUTH_004',
    ACCOUNT_DEACTIVATED: 'AUTH_005',
    INSUFFICIENT_PERMISSIONS: 'AUTH_006',

    // Validation
    VALIDATION_ERROR: 'VAL_001',
    INVALID_INPUT: 'VAL_002',
    MISSING_REQUIRED_FIELD: 'VAL_003',
    INVALID_FORMAT: 'VAL_004',

    // Resource Errors
    NOT_FOUND: 'RES_001',
    ALREADY_EXISTS: 'RES_002',
    CONFLICT: 'RES_003',

    // Business Logic
    ALREADY_LIKED: 'BUS_001',
    NOT_LIKED: 'BUS_002',
    CANNOT_VOTE_OWN_POST: 'BUS_003',
    DAILY_LIMIT_REACHED: 'BUS_004',

    // Server Errors
    INTERNAL_ERROR: 'SRV_001',
    DATABASE_ERROR: 'SRV_002',
    DATABASE_CONNECTION_ERROR: 'SRV_003',
    EXTERNAL_SERVICE_ERROR: 'SRV_004',

    // Rate Limiting
    RATE_LIMIT_EXCEEDED: 'RATE_001',
    TOO_MANY_REQUESTS: 'RATE_002',

    // Network Errors (Frontend only)
    NETWORK_ERROR: 'NET_001',
    TIMEOUT_ERROR: 'NET_002',
    OFFLINE: 'NET_003',
} as const

/**
 * User-friendly error messages in Turkish
 */
const errorMessages: Record<string, string> = {
    // Auth errors
    [ErrorCode.UNAUTHORIZED]: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
    [ErrorCode.INVALID_CREDENTIALS]: 'Email veya şifre hatalı.',
    [ErrorCode.TOKEN_EXPIRED]: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
    [ErrorCode.TOKEN_INVALID]: 'Geçersiz oturum. Lütfen tekrar giriş yapın.',
    [ErrorCode.ACCOUNT_DEACTIVATED]: 'Hesabınız devre dışı bırakılmış.',
    [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Bu işlem için yetkiniz yok.',

    // Validation errors
    [ErrorCode.VALIDATION_ERROR]: 'Lütfen formu doğru şekilde doldurun.',
    [ErrorCode.INVALID_INPUT]: 'Geçersiz veri girişi.',
    [ErrorCode.MISSING_REQUIRED_FIELD]: 'Zorunlu alanları doldurun.',
    [ErrorCode.INVALID_FORMAT]: 'Geçersiz format.',

    // Resource errors
    [ErrorCode.NOT_FOUND]: 'Aradığınız içerik bulunamadı.',
    [ErrorCode.ALREADY_EXISTS]: 'Bu kayıt zaten mevcut.',
    [ErrorCode.CONFLICT]: 'İşlem çakışması oluştu.',

    // Business logic
    [ErrorCode.ALREADY_LIKED]: 'Bu gönderiyi zaten beğendiniz.',
    [ErrorCode.NOT_LIKED]: 'Bu gönderiyi henüz beğenmediniz.',
    [ErrorCode.CANNOT_VOTE_OWN_POST]: 'Kendi gönderinize oy veremezsiniz.',
    [ErrorCode.DAILY_LIMIT_REACHED]: 'Günlük limitinize ulaştınız.',

    // Server errors
    [ErrorCode.INTERNAL_ERROR]: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    [ErrorCode.DATABASE_ERROR]: 'Veritabanı hatası. Lütfen tekrar deneyin.',
    [ErrorCode.DATABASE_CONNECTION_ERROR]: 'Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.',
    [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Harici servis hatası.',

    // Rate limiting
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
    [ErrorCode.TOO_MANY_REQUESTS]: 'Çok fazla istek. Lütfen bir süre bekleyin.',

    // Network errors
    [ErrorCode.NETWORK_ERROR]: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
    [ErrorCode.TIMEOUT_ERROR]: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
    [ErrorCode.OFFLINE]: 'İnternet bağlantınız yok.',
}

/**
 * Extract error from various error types
 */
export function extractErrorMessage(error: any): string {
    // Network/Axios error
    if (error.response) {
        const data = error.response.data as ApiErrorResponse
        if (data?.error) {
            // Return user-friendly message if available
            if (data.error.code && errorMessages[data.error.code]) {
                return errorMessages[data.error.code]
            }
            return data.error.message || 'Bir hata oluştu'
        }
    }

    // Network error (no response)
    if (error.request) {
        return errorMessages[ErrorCode.NETWORK_ERROR]
    }

    // Timeout error
    if (error.code === 'ECONNABORTED') {
        return errorMessages[ErrorCode.TIMEOUT_ERROR]
    }

    // Generic error
    if (error.message) {
        return error.message
    }

    return 'Bilinmeyen bir hata oluştu'
}

/**
 * Get user-friendly message for error code
 */
export function getErrorMessage(code: string, defaultMessage?: string): string {
    return errorMessages[code] || defaultMessage || 'Bir hata oluştu'
}

/**
 * Check if error is a specific type
 */
export function isAuthError(error: any): boolean {
    const code = error.response?.data?.error?.code
    return [
        ErrorCode.UNAUTHORIZED,
        ErrorCode.INVALID_CREDENTIALS,
        ErrorCode.TOKEN_EXPIRED,
        ErrorCode.TOKEN_INVALID,
    ].includes(code)
}

export function isNetworkError(error: any): boolean {
    return !error.response && error.request
}

export function isValidationError(error: any): boolean {
    const code = error.response?.data?.error?.code
    return code?.startsWith('VAL_')
}

/**
 * Format validation errors for form display
 */
export function formatValidationErrors(error: any): Record<string, string> {
    const details = error.response?.data?.error?.details
    if (details?.fields) {
        return details.fields
    }
    return {}
}

/**
 * Log error to console in development
 */
export function logError(error: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🔴 Error${context ? ` - ${context}` : ''}`)
        console.error('Message:', extractErrorMessage(error))
        console.error('Full error:', error)
        if (error.response) {
            console.error('Response:', error.response.data)
            console.error('Status:', error.response.status)
        }
        console.groupEnd()
    }
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
    if (typeof window !== 'undefined') {
        return navigator.onLine
    }
    return true
}

/**
 * Error handler for async operations
 */
export async function handleAsyncError<T>(
    fn: () => Promise<T>,
    onError?: (error: any) => void
): Promise<T | null> {
    try {
        return await fn()
    } catch (error) {
        logError(error)
        if (onError) {
            onError(error)
        }
        return null
    }
}

