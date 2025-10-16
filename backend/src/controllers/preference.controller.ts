import { Request, Response, NextFunction } from 'express'
import { preferenceService } from '../services/preference.service'
import { feedMixerService } from '../services/feed-mixer.service'
import {
  UpdateCategoryPreferenceDTO,
  UpdateVibePreferenceDTO,
  FeedFilters,
} from '../interfaces/preference.interface'
import { JwtPayload } from '../interfaces/auth.interface'

// Extend Express Request type
interface AuthRequest extends Request {
  user?: JwtPayload
}

export const preferenceController = {
  // ==================== GET PREFERENCES ====================

  // Get all user preferences
  async getAllPreferences(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const preferences = await preferenceService.getAllPreferences(userId)
      res.json(preferences)
    } catch (error) {
      next(error)
    }
  },

  // Get category preferences
  async getCategoryPreferences(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const preferences =
        await preferenceService.getUserCategoryPreferences(userId)
      res.json(preferences)
    } catch (error) {
      next(error)
    }
  },

  // Get vibe preferences
  async getVibePreferences(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const preferences = await preferenceService.getUserVibePreferences(userId)
      res.json(preferences)
    } catch (error) {
      next(error)
    }
  },

  // ==================== UPDATE PREFERENCES ====================

  // Set single category preference
  async setCategoryPreference(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const data: UpdateCategoryPreferenceDTO = req.body

      if (!data.categoryId) {
        return res.status(400).json({ message: 'Category ID is required' })
      }

      const preference = await preferenceService.setCategoryPreference(
        userId,
        data
      )
      res.json(preference)
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Weight must be between 0 and 100') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Set multiple category preferences (Feed Mixer)
  async setBulkCategoryPreferences(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.userId
      const { preferences } = req.body

      if (!Array.isArray(preferences)) {
        return res
          .status(400)
          .json({ message: 'Preferences must be an array' })
      }

      const result = await preferenceService.setBulkCategoryPreferences(
        userId,
        preferences
      )
      res.json(result)
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Weight must be between 0 and 100') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Set vibe preference
  async setVibePreference(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const data: UpdateVibePreferenceDTO = req.body

      if (!data.vibeId) {
        return res.status(400).json({ message: 'Vibe ID is required' })
      }

      const preference = await preferenceService.setVibePreference(userId, data)
      res.json(preference)
    } catch (error: any) {
      if (error.message === 'Vibe not found') {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  },

  // ==================== BLOCK/UNBLOCK ====================

  // Block category
  async blockCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { categoryId } = req.body

      if (!categoryId) {
        return res.status(400).json({ message: 'Category ID is required' })
      }

      await preferenceService.blockCategory(userId, categoryId)
      res.json({ message: 'Category blocked successfully' })
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  },

  // Unblock category
  async unblockCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { categoryId } = req.body

      if (!categoryId) {
        return res.status(400).json({ message: 'Category ID is required' })
      }

      await preferenceService.unblockCategory(userId, categoryId)
      res.json({ message: 'Category unblocked successfully' })
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  },

  // Block vibe
  async blockVibe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { vibeId } = req.body

      if (!vibeId) {
        return res.status(400).json({ message: 'Vibe ID is required' })
      }

      await preferenceService.blockVibe(userId, vibeId)
      res.json({ message: 'Vibe blocked successfully' })
    } catch (error: any) {
      if (error.message === 'Vibe not found') {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  },

  // Unblock vibe
  async unblockVibe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { vibeId } = req.body

      if (!vibeId) {
        return res.status(400).json({ message: 'Vibe ID is required' })
      }

      await preferenceService.unblockVibe(userId, vibeId)
      res.json({ message: 'Vibe unblocked successfully' })
    } catch (error: any) {
      if (error.message === 'Vibe not found') {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  },

  // ==================== FEED MIXER ====================

  // Get mixed/personalized feed
  async getMixedFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const mode = req.query.mode as 'normal' | 'soft' | 'focus' | undefined
      const categories = req.query.categories
        ? (req.query.categories as string).split(',')
        : undefined
      const vibes = req.query.vibes
        ? (req.query.vibes as string).split(',')
        : undefined
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
      const cursor = req.query.cursor as string | undefined

      const filters: FeedFilters = {
        mode,
        categories,
        vibes,
        limit,
        cursor,
      }

      const posts = await feedMixerService.getMixedFeed(userId, filters)
      res.json(posts)
    } catch (error) {
      next(error)
    }
  },

  // Get default feed (for new users)
  async getDefaultFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
      const cursor = req.query.cursor as string | undefined

      const posts = await feedMixerService.getDefaultFeed(userId, limit, cursor)
      res.json(posts)
    } catch (error) {
      next(error)
    }
  },
}

