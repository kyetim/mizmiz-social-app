import { Router } from 'express'
import { postController } from '../controllers/post.controller'
import { categoryController } from '../controllers/category.controller'
import { authenticate, optionalAuth } from '../middleware/auth.middleware'

const router = Router()

// Post routes
router.post('/', authenticate, postController.createPost)
router.get('/', optionalAuth, postController.getPosts) // Public route, but returns more data if authenticated
router.get('/search', optionalAuth, postController.searchPosts)
router.get('/:postId', optionalAuth, postController.getPost)
router.put('/:postId', authenticate, postController.updatePost)
router.delete('/:postId', authenticate, postController.deletePost)

// Like routes
router.post('/:postId/like', authenticate, postController.likePost)
router.delete('/:postId/like', authenticate, postController.unlikePost)

// Comment routes
router.get('/:postId/comments', postController.getComments)
router.post('/:postId/comments', authenticate, postController.createComment)
router.delete('/comments/:commentId', authenticate, postController.deleteComment)

// Category and vibe routes for posts
router.get('/:postId/categories', categoryController.getPostCategories)
router.get('/:postId/vibes', categoryController.getPostVibes)

export default router

