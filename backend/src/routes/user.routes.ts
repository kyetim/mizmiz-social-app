import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get users list (search/explore)
router.get('/', userController.getUsers)

// Get current user profile
router.get('/me', userController.getCurrentUser)

// Update current user profile
router.put('/me', userController.updateProfile)

// Update avatar
router.put('/me/avatar', userController.updateAvatar)

// Update cover image
router.put('/me/cover', userController.updateCoverImage)

// Get user's liked posts (before :userId to avoid conflict)
router.get('/:userId/liked-posts', userController.getUserLikedPosts)

// Get user by ID (must be last among :userId routes)
router.get('/:userId', userController.getUser)

export default router

