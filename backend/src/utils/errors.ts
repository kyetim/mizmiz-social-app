/**
 * Custom Error Classes for Better Error Handling
 * These provide structured, consistent error responses throughout the application
 */

export enum ErrorCode {
    // Authentication & Authorization (1000-1099)
    UNAUTHORIZED = 'AUTH_001',
    INVALID_CREDENTIALS = 'AUTH_002',
    TOKEN_EXPIRED = 'AUTH_003',
    TOKEN_INVALID = 'AUTH_004',
    ACCOUNT_DEACTIVATED = 'AUTH_005',
    INSUFFICIENT_PERMISSIONS = 'AUTH_006',

    // Validation (2000-2099)
    VALIDATION_ERROR = 'VAL_001',
    INVALID_INPUT = 'VAL_002',
    MISSING_REQUIRED_FIELD = 'VAL_003',
    INVALID_FORMAT = 'VAL_004',

    // Resource Errors (3000-3099)
    NOT_FOUND = 'RES_001',
    ALREADY_EXISTS = 'RES_002',
    CONFLICT = 'RES_003',

    // Business Logic (4000-4099)
    ALREADY_LIKED = 'BUS_001',
    NOT_LIKED = 'BUS_002',
    CANNOT_VOTE_OWN_POST = 'BUS_003',
    DAILY_LIMIT_REACHED = 'BUS_004',

    // Server Errors (5000-5099)
    INTERNAL_ERROR = 'SRV_001',
    DATABASE_ERROR = 'SRV_002',
    EXTERNAL_SERVICE_ERROR = 'SRV_003',

    // Rate Limiting (6000-6099)
    RATE_LIMIT_EXCEEDED = 'RATE_001',
    TOO_MANY_REQUESTS = 'RATE_002',
}

/**
 * Base Application Error
 */
export class AppError extends Error {
    public readonly statusCode: number
    public readonly code: ErrorCode
    public readonly isOperational: boolean
    public readonly timestamp: Date
    public readonly details?: any

    constructor(
        message: string,
        statusCode: number = 500,
        code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        isOperational: boolean = true,
        details?: any
    ) {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.isOperational = isOperational
        this.timestamp = new Date()
        this.details = details

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor)
        Object.setPrototypeOf(this, AppError.prototype)
    }

    toJSON() {
        return {
            success: false,
            error: {
                message: this.message,
                code: this.code,
                timestamp: this.timestamp,
                ...(this.details && { details: this.details }),
            },
        }
    }
}

/**
 * 400 Bad Request - Validation Error
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed', details?: any) {
        super(message, 400, ErrorCode.VALIDATION_ERROR, true, details)
        Object.setPrototypeOf(this, ValidationError.prototype)
    }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access', code: ErrorCode = ErrorCode.UNAUTHORIZED) {
        super(message, 401, code, true)
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super(message, 403, ErrorCode.INSUFFICIENT_PERMISSIONS, true)
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, ErrorCode.NOT_FOUND, true)
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists', details?: any) {
        super(message, 409, ErrorCode.ALREADY_EXISTS, true, details)
        Object.setPrototypeOf(this, ConflictError.prototype)
    }
}

/**
 * 429 Too Many Requests
 */
export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests, please try again later') {
        super(message, 429, ErrorCode.RATE_LIMIT_EXCEEDED, true)
        Object.setPrototypeOf(this, RateLimitError.prototype)
    }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error', details?: any) {
        super(message, 500, ErrorCode.INTERNAL_ERROR, false, details)
        Object.setPrototypeOf(this, InternalServerError.prototype)
    }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
    constructor(message: string = 'Database operation failed', details?: any) {
        super(message, 500, ErrorCode.DATABASE_ERROR, false, details)
        Object.setPrototypeOf(this, DatabaseError.prototype)
    }
}

/**
 * Business Logic Error
 */
export class BusinessLogicError extends AppError {
    constructor(message: string, code: ErrorCode, details?: any) {
        super(message, 400, code, true, details)
        Object.setPrototypeOf(this, BusinessLogicError.prototype)
    }
}

/**
 * Helper function to check if error is operational
 */
export function isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
        return error.isOperational
    }
    return false
}

/**
 * Helper to create validation error with field details
 */
export function createValidationError(fields: Record<string, string>): ValidationError {
    return new ValidationError('Validation failed', { fields })
}

