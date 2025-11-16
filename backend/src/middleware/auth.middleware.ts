import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { securityConfig } from '../config/security.config'

/**
 * Authentication Middleware
 * Checks for access token in httpOnly cookie OR Authorization header (for API clients)
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        let token: string | undefined

        // Priority 1: Check httpOnly cookie (most secure)
        token = req.cookies[securityConfig.cookie.accessToken.name]

        // Priority 2: Check Authorization header (for API clients, mobile apps)
        if (!token) {
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7) // Remove 'Bearer ' prefix
            }
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            })
            return
        }

        // Verify token
        const decoded = verifyAccessToken(token)

            // Attach user info to request
            ; (req as any).user = decoded

        next()
    } catch (error: any) {
        // Token is invalid or expired
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            hint: 'Please refresh your token or login again'
        })
    }
}

/**
 * Optional authentication middleware
 * Doesn't fail if no token, but attaches user if token is valid
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        let token: string | undefined

        // Check cookie first
        token = req.cookies[securityConfig.cookie.accessToken.name]

        // Then check header
        if (!token) {
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7)
            }
        }

        if (token) {
            const decoded = verifyAccessToken(token)
                ; (req as any).user = decoded
        }

        next()
    } catch (error) {
        // Fail silently for optional auth
        next()
    }
}

// Export alias for better readability
export const authenticate = authMiddleware
export const optionalAuth = optionalAuthMiddleware

