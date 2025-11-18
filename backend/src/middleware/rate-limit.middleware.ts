import rateLimit from 'express-rate-limit'
import { securityConfig } from '../config/security.config'

/**
 * General API rate limiter
 */
export const generalRateLimiter = rateLimit({
    windowMs: securityConfig.rateLimit.general.windowMs,
    max: securityConfig.rateLimit.general.max,
    message: {
        success: false,
        message: securityConfig.rateLimit.general.message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limit for successful requests in development
    skip: (req) => process.env.NODE_ENV === 'development' && req.path === '/health',
})

/**
 * Login endpoint rate limiter (stricter)
 * Only counts failed attempts - successful logins don't count
 * More lenient in development environment
 */
export const loginRateLimiter = rateLimit({
    windowMs: securityConfig.rateLimit.login.windowMs,
    // In development, allow many more attempts for testing
    max: process.env.NODE_ENV === 'development' ? 100 : securityConfig.rateLimit.login.max,
    message: {
        success: false,
        message: securityConfig.rateLimit.login.message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins - only failed attempts count
    // Store failed attempts by IP + email
    keyGenerator: (req) => {
        const email = req.body?.email || 'unknown'
        return `${req.ip}-${email}`
    },
})

/**
 * Register endpoint rate limiter
 */
export const registerRateLimiter = rateLimit({
    windowMs: securityConfig.rateLimit.register.windowMs,
    max: securityConfig.rateLimit.register.max,
    message: {
        success: false,
        message: securityConfig.rateLimit.register.message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
})

/**
 * Password reset rate limiter
 */
export const passwordResetRateLimiter = rateLimit({
    windowMs: securityConfig.rateLimit.passwordReset.windowMs,
    max: securityConfig.rateLimit.passwordReset.max,
    message: {
        success: false,
        message: securityConfig.rateLimit.passwordReset.message,
    },
    standardHeaders: true,
    legacyHeaders: false,
})

/**
 * Upload endpoint rate limiter
 */
export const uploadRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 uploads per window
    message: {
        success: false,
        message: 'Too many upload requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
})

/**
 * Comment/Post creation rate limiter (prevent spam)
 */
export const contentCreationRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 posts/comments per minute
    message: {
        success: false,
        message: 'Slow down! You are creating content too quickly',
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Use user ID if available, otherwise IP
    keyGenerator: (req) => {
        return (req as any).user?.userId || req.ip || 'anonymous'
    },
})

