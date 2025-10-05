import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Public routes
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

// Protected routes
router.post('/logout', authMiddleware, AuthController.logout)
router.get('/me', authMiddleware, AuthController.getCurrentUser)

export default router

