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

// Messaging privacy settings
router.get('/me/message-settings', userController.getMessageSettings)
router.put('/me/message-settings', userController.updateMessageSettings)

// Update current user profile
router.put('/me', userController.updateProfile)

// Update avatar
router.put('/me/avatar', userController.updateAvatar)

// Update cover image
router.put('/me/cover', userController.updateCoverImage)

// Get user's liked posts (before :userId to avoid conflict)
router.get('/:userId/liked-posts', userController.getUserLikedPosts)

// Follow/Unfollow operations
router.post('/:userId/follow', userController.followUser)
router.delete('/:userId/follow', userController.unfollowUser)
router.get('/:userId/is-following', userController.isFollowing)

// Get followers and following
router.get('/:userId/followers', userController.getFollowers)
router.get('/:userId/following', userController.getFollowing)

// Get user by ID (must be last among :userId routes)
router.get('/:userId', userController.getUser)

export default router

