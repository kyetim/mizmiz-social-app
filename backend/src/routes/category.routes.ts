import { Router } from 'express'
import { categoryController } from '../controllers/category.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// ==================== CATEGORY ROUTES ====================

// Public routes
router.get('/categories', categoryController.getCategories)
router.get('/categories/trending', categoryController.getTrendingCategories)
router.get('/categories/temporal', categoryController.getTemporalCategories)
router.get('/categories/:id', categoryController.getCategory)
router.get('/categories/slug/:slug', categoryController.getCategoryBySlug)

// Admin only routes
router.post('/categories', authenticate, categoryController.createCategory)
router.put('/categories/:id', authenticate, categoryController.updateCategory)
router.delete('/categories/:id', authenticate, categoryController.deleteCategory)

// ==================== VIBE ROUTES ====================

// Public routes
router.get('/vibes', categoryController.getVibes)
router.get('/vibes/:id', categoryController.getVibe)

// Admin only routes
router.post('/vibes', authenticate, categoryController.createVibe)
router.put('/vibes/:id', authenticate, categoryController.updateVibe)
router.delete('/vibes/:id', authenticate, categoryController.deleteVibe)

// ==================== POST CATEGORIZATION ROUTES ====================

// Get categories/vibes for a post (public)
router.get('/posts/:postId/categories', categoryController.getPostCategories)
router.get('/posts/:postId/vibes', categoryController.getPostVibes)

// Add/remove categories/vibes (authenticated)
router.post(
  '/posts/:postId/categories',
  authenticate,
  categoryController.addCategoryToPost
)
router.delete(
  '/posts/:postId/categories/:categoryId',
  authenticate,
  categoryController.removeCategoryFromPost
)

router.post(
  '/posts/:postId/vibes',
  authenticate,
  categoryController.addVibeToPost
)
router.delete(
  '/posts/:postId/vibes/:vibeId',
  authenticate,
  categoryController.removeVibeFromPost
)

// Voting (authenticated)
router.post(
  '/post-categories/:postCategoryId/vote',
  authenticate,
  categoryController.voteOnCategory
)
router.post(
  '/post-vibes/:postVibeId/vote',
  authenticate,
  categoryController.voteOnVibe
)

// AI suggestions
router.post(
  '/categories/suggest',
  authenticate,
  categoryController.getSuggestedCategories
)

export default router

