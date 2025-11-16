import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import {
    validateRegister,
    validateLogin,
    handleValidationErrors,
    sanitizeInput
} from '../middleware/validation.middleware'
import {
    loginRateLimiter,
    registerRateLimiter
} from '../middleware/rate-limit.middleware'

const router = Router()

// Public routes with validation and rate limiting
router.post(
    '/register',
    registerRateLimiter,
    sanitizeInput,
    validateRegister,
    handleValidationErrors,
    AuthController.register
)

router.post(
    '/login',
    loginRateLimiter,
    sanitizeInput,
    validateLogin,
    handleValidationErrors,
    AuthController.login
)

// Refresh token endpoint
router.post('/refresh', AuthController.refreshToken)

// Protected routes
router.post('/logout', authMiddleware, AuthController.logout)
router.post('/logout-all', authMiddleware, AuthController.logoutAllDevices)
router.get('/me', authMiddleware, AuthController.getCurrentUser)

export default router

