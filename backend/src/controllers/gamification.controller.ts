import { Request, Response, NextFunction } from 'express'
import { gamificationService } from '../services/gamification.service'
import { JwtPayload } from '../interfaces/auth.interface'

// Extend Express Request type
interface AuthRequest extends Request {
  user?: JwtPayload
}

export const gamificationController = {
  // Get user's own gamification stats
  async getMyStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const stats = await gamificationService.getUserGamification(userId)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  },

  // Get user gamification stats by ID
  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      const stats = await gamificationService.getUserGamification(userId)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  },

  // Get leaderboard
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50
      const leaderboard = await gamificationService.getLeaderboard(limit)
      res.json(leaderboard)
    } catch (error) {
      next(error)
    }
  },
}

