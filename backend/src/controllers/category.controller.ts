import { Request, Response, NextFunction } from 'express'
import { categoryService } from '../services/category.service'
import { vibeService } from '../services/vibe.service'
import { categorizationService } from '../services/categorization.service'
import { VoteType } from '@prisma/client'
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateVibeDTO,
  UpdateVibeDTO,
  AddCategoryToPostDTO,
  AddVibeToPostDTO,
} from '../interfaces/category.interface'
import { JwtPayload } from '../interfaces/auth.interface'

// Extend Express Request type
interface AuthRequest extends Request {
  user?: JwtPayload
}

export const categoryController = {
  // ==================== CATEGORY CRUD ====================

  // Get all categories
  async getCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as any
      const isActive = req.query.isActive === 'true'

      const categories = await categoryService.getAllCategories({
        type,
        isActive: req.query.isActive ? isActive : undefined,
      })

      res.json(categories)
    } catch (error) {
      next(error)
    }
  },

  // Get category by ID
  async getCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const category = await categoryService.getCategoryById(id)

      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }

      res.json(category)
    } catch (error) {
      next(error)
    }
  },

  // Get category by slug
  async getCategoryBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params
      const category = await categoryService.getCategoryBySlug(slug)

      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }

      res.json(category)
    } catch (error) {
      next(error)
    }
  },

  // Create category (Admin only)
  async createCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Check if user is admin
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }

      const data: CreateCategoryDTO = req.body

      if (!data.name || !data.slug || !data.icon || !data.color) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const category = await categoryService.createCategory(data)
      res.status(201).json(category)
    } catch (error: any) {
      if (error.message === 'Category with this slug already exists') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Update category (Admin only)
  async updateCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }

      const { id } = req.params
      const data: UpdateCategoryDTO = req.body

      const category = await categoryService.updateCategory(id, data)
      res.json(category)
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Category with this slug already exists') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Delete category (Admin only)
  async deleteCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }

      const { id } = req.params
      await categoryService.deleteCategory(id)
      res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  },

  // Get trending categories
  async getTrendingCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
      const categories = await categoryService.getTrendingCategories(limit)
      res.json(categories)
    } catch (error) {
      next(error)
    }
  },

  // Get temporal categories
  async getTemporalCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getTemporalCategories()
      res.json(categories)
    } catch (error) {
      next(error)
    }
  },

  // ==================== VIBE CRUD ====================

  // Get all vibes
  async getVibes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isActive = req.query.isActive === 'true'
      const vibes = await vibeService.getAllVibes(
        req.query.isActive ? isActive : undefined
      )
      res.json(vibes)
    } catch (error) {
      next(error)
    }
  },

  // Get vibe by ID
  async getVibe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const vibe = await vibeService.getVibeById(id)

      if (!vibe) {
        return res.status(404).json({ message: 'Vibe not found' })
      }

      res.json(vibe)
    } catch (error) {
      next(error)
    }
  },

  // Create vibe (Admin only)
  async createVibe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }

      const data: CreateVibeDTO = req.body

      if (!data.name || !data.slug || !data.icon || !data.color) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const vibe = await vibeService.createVibe(data)
      res.status(201).json(vibe)
    } catch (error: any) {
      if (error.message === 'Vibe with this slug already exists') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Update vibe (Admin only)
  async updateVibe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }

      const { id } = req.params
      const data: UpdateVibeDTO = req.body

      const vibe = await vibeService.updateVibe(id, data)
      res.json(vibe)
    } catch (error: any) {
      if (error.message === 'Vibe not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Vibe with this slug already exists') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Delete vibe (Admin only)
  async deleteVibe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }

      const { id } = req.params
      await vibeService.deleteVibe(id)
      res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Vibe not found') {
        return res.status(404).json({ message: error.message })
      }
      next(error)
    }
  },

  // ==================== POST CATEGORIZATION ====================

  // Add category to post
  async addCategoryToPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params
      const userId = req.user!.userId
      const data: AddCategoryToPostDTO = req.body

      if (!data.categoryId) {
        return res.status(400).json({ message: 'Category ID is required' })
      }

      const postCategory = await categorizationService.addCategoryToPost(
        postId,
        data,
        userId
      )
      res.status(201).json(postCategory)
    } catch (error: any) {
      if (
        error.message === 'Post not found' ||
        error.message === 'Category not found or inactive'
      ) {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Category already added to this post') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Remove category from post
  async removeCategoryFromPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId, categoryId } = req.params
      const userId = req.user!.userId

      await categorizationService.removeCategoryFromPost(
        postId,
        categoryId,
        userId
      )
      res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Post category not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: error.message })
      }
      next(error)
    }
  },

  // Get categories for a post
  async getPostCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params
      const userId = req.user?.userId

      const categories = await categorizationService.getPostCategories(
        postId,
        userId
      )
      res.json(categories)
    } catch (error) {
      next(error)
    }
  },

  // Vote on category
  async voteOnCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postCategoryId } = req.params
      const userId = req.user!.userId
      const { voteType } = req.body

      console.log('Vote request:', { postCategoryId, userId, voteType })

      if (!voteType || !['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
        return res.status(400).json({ message: 'Invalid vote type' })
      }

      await categorizationService.voteOnCategory(
        postCategoryId,
        userId,
        voteType as VoteType
      )
      res.json({ message: 'Vote recorded successfully' })
    } catch (error: any) {
      console.error('Vote error:', error)
      if (error.message === 'Post category not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'You already voted this way') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Add vibe to post
  async addVibeToPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params
      const userId = req.user!.userId
      const data: AddVibeToPostDTO = req.body

      if (!data.vibeId) {
        return res.status(400).json({ message: 'Vibe ID is required' })
      }

      const postVibe = await categorizationService.addVibeToPost(
        postId,
        data,
        userId
      )
      res.status(201).json(postVibe)
    } catch (error: any) {
      if (
        error.message === 'Post not found' ||
        error.message === 'Vibe not found or inactive'
      ) {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Vibe already added to this post') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Remove vibe from post
  async removeVibeFromPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId, vibeId } = req.params
      const userId = req.user!.userId

      await categorizationService.removeVibeFromPost(postId, vibeId, userId)
      res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Post vibe not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ message: error.message })
      }
      next(error)
    }
  },

  // Get vibes for a post
  async getPostVibes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params
      const userId = req.user?.userId

      const vibes = await categorizationService.getPostVibes(postId, userId)
      res.json(vibes)
    } catch (error) {
      next(error)
    }
  },

  // Vote on vibe
  async voteOnVibe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postVibeId } = req.params
      const userId = req.user!.userId
      const { voteType } = req.body

      if (!voteType || !['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
        return res.status(400).json({ message: 'Invalid vote type' })
      }

      await categorizationService.voteOnVibe(
        postVibeId,
        userId,
        voteType as VoteType
      )
      res.json({ message: 'Vote recorded successfully' })
    } catch (error: any) {
      if (error.message === 'Post vibe not found') {
        return res.status(404).json({ message: error.message })
      }
      if (error.message === 'You already voted this way') {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },

  // Get AI suggestions for post
  async getSuggestedCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { content } = req.body

      if (!content) {
        return res.status(400).json({ message: 'Content is required' })
      }

      const suggestions = await categorizationService.suggestCategories(content)
      res.json({ suggestions })
    } catch (error) {
      next(error)
    }
  },
}

