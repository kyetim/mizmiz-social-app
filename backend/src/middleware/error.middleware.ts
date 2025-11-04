import { Request, Response, NextFunction } from 'express'
import { AppError, isOperationalError, InternalServerError } from '../utils/errors'
import logger, { logError } from '../utils/logger'
import { Prisma } from '@prisma/client'

/**
 * Generate unique request ID for tracking
 */
function generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Handle Prisma errors and convert to AppError
 */
function handlePrismaError(error: any): AppError {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
            const field = (error.meta?.target as string[])?.[0] || 'field'
            return new AppError(
                `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
                409,
                'RES_002' as any
            )
        }

        // Record not found
        if (error.code === 'P2025') {
            return new AppError('Resource not found', 404, 'RES_001' as any)
        }

        // Foreign key constraint failed
        if (error.code === 'P2003') {
            return new AppError('Related resource not found', 404, 'RES_001' as any)
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return new AppError('Invalid data provided', 400, 'VAL_001' as any)
    }

    // Generic database error
    return new InternalServerError('Database operation failed')
}

/**
 * Handle JWT errors
 */
function handleJWTError(error: any): AppError {
    if (error.name === 'JsonWebTokenError') {
        return new AppError('Invalid token', 401, 'AUTH_004' as any)
    }
    if (error.name === 'TokenExpiredError') {
        return new AppError('Token expired', 401, 'AUTH_003' as any)
    }
    return new InternalServerError()
}

/**
 * Modern Error Middleware with Structured Logging
 */
export function errorMiddleware(
    error: any,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Generate request ID for tracking
    const requestId = generateRequestId()

    let appError: AppError

    // Convert known errors to AppError
    if (error instanceof AppError) {
        appError = error
    } else if (error.name?.includes('Prisma')) {
        appError = handlePrismaError(error)
    } else if (error.name?.includes('JsonWebToken') || error.name?.includes('TokenExpired')) {
        appError = handleJWTError(error)
    } else {
        // Unknown error - treat as internal server error
        appError = new InternalServerError(
            process.env.NODE_ENV === 'development'
                ? error.message
                : 'An unexpected error occurred'
        )
    }

    // Log error with context
    const errorContext = {
        requestId,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userId: (req as any).user?.userId,
        statusCode: appError.statusCode,
        code: appError.code,
        isOperational: isOperationalError(appError),
    }

    // Log based on severity
    if (appError.statusCode >= 500) {
        logError(appError.message, error, errorContext)
    } else if (appError.statusCode >= 400) {
        logger.warn(appError.message, errorContext)
    } else {
        logger.info(appError.message, errorContext)
    }

    // Log to console in development for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('\n🔴 Error Details:')
        console.error('Message:', appError.message)
        console.error('Status:', appError.statusCode)
        console.error('Code:', appError.code)
        console.error('Stack:', error.stack)
        console.error('Context:', errorContext)
        console.error('\n')
    }

    // Prepare response
    const errorResponse: any = {
        success: false,
        error: {
            message: appError.message,
            code: appError.code,
            requestId,
            timestamp: appError.timestamp,
        },
    }

    // Add details if available
    if (appError.details) {
        errorResponse.error.details = appError.details
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = error.stack
    }

    // Send response
    res.status(appError.statusCode).json(errorResponse)
}

/**
 * Handle 404 - Not Found
 */
export function notFoundMiddleware(req: Request, res: Response, _next: NextFunction): void {
    const requestId = generateRequestId()

    logger.warn('Route not found', {
        requestId,
        path: req.path,
        method: req.method,
        ip: req.ip,
    })

    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
            code: 'RES_001',
            requestId,
            timestamp: new Date(),
        },
    })
}

/**
 * Async error handler wrapper
 */
export function asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

