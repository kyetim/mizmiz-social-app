import { Router } from 'express'
import { gamificationController } from '../controllers/gamification.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Get own stats (authenticated)
router.get('/gamification/me', authMiddleware, gamificationController.getMyStats)

// Get user stats (public)
router.get('/gamification/users/:userId', gamificationController.getUserStats)

// Get leaderboard (public)
router.get('/gamification/leaderboard', gamificationController.getLeaderboard)

export default router

