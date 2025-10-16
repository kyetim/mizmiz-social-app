import { Request, Response, NextFunction } from 'express'
import { postService } from '../services/post.service'
import { CreatePostDTO, UpdatePostDTO, CreateCommentDTO } from '../interfaces/post.interface'
import { JwtPayload } from '../interfaces/auth.interface'

// Extend Express Request type
interface AuthRequest extends Request {
  user?: JwtPayload
}

export const postController = {
  // Create a new post
  async createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId
      const data: CreatePostDTO = req.body

      if (!data.content || data.content.trim().length === 0) {
        res.status(400).json({ message: 'Content is required' })
        return
      }

      if (data.content.length > 500) {
        res.status(400).json({ message: 'Content must be 500 characters or less' })
        return
      }

      const post = await postService.createPost(userId, data)
      res.status(201).json(post)
    } catch (error) {
      next(error)
    }
  },

  // Get all posts
  async getPosts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string | undefined
      const following = req.query.following === 'true'
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
      const cursor = req.query.cursor as string | undefined

      const currentUserId = req.user?.userId

      const posts = await postService.getPosts(
        { userId, following, limit, cursor },
        currentUserId
      )
      res.json(posts)
    } catch (error) {
      next(error)
    }
  },

  // Get a single post
  async getPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params
      const currentUserId = req.user?.userId

      const post = await postService.getPostById(postId, currentUserId)

      if (!post) {
        res.status(404).json({ message: 'Post not found' })
        return
      }

      res.json(post)
    } catch (error) {
      next(error)
    }
  },

  // Update a post
  async updatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params
      const userId = req.user!.userId
      const data: UpdatePostDTO = req.body

      if (data.content && data.content.length > 500) {
        res.status(400).json({ message: 'Content must be 500 characters or less' })
        return
      }

      const post = await postService.updatePost(postId, userId, data)
      res.json(post)
    } catch (error: any) {
      if (error.message === 'Post not found or unauthorized') {
        res.status(404).json({ message: error.message })
        return
      }
      next(error)
    }
  },

  // Delete a post
  async deletePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params
      const userId = req.user!.userId

      await postService.deletePost(postId, userId)
      res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Post not found or unauthorized') {
        res.status(404).json({ message: error.message })
        return
      }
      next(error)
    }
  },

  // Like a post
  async likePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params
      const userId = req.user!.userId

      await postService.likePost(postId, userId)
      res.status(200).json({ message: 'Post liked successfully' })
    } catch (error: any) {
      if (error.message === 'Post not found') {
        res.status(404).json({ message: error.message })
        return
      }
      if (error.message === 'Post already liked') {
        res.status(400).json({ message: error.message })
        return
      }
      next(error)
    }
  },

  // Unlike a post
  async unlikePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params
      const userId = req.user!.userId

      await postService.unlikePost(postId, userId)
      res.status(200).json({ message: 'Post unliked successfully' })
    } catch (error: any) {
      if (error.message === 'Like not found') {
        res.status(404).json({ message: error.message })
        return
      }
      next(error)
    }
  },

  // Get comments for a post
  async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params

      const comments = await postService.getComments(postId)
      res.json(comments)
    } catch (error) {
      next(error)
    }
  },

  // Create a comment
  async createComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params
      const userId = req.user!.userId
      const data: CreateCommentDTO = req.body

      if (!data.content || data.content.trim().length === 0) {
        res.status(400).json({ message: 'Content is required' })
        return
      }

      if (data.content.length > 300) {
        res.status(400).json({ message: 'Content must be 300 characters or less' })
        return
      }

      const comment = await postService.createComment(postId, userId, data)
      res.status(201).json(comment)
    } catch (error: any) {
      if (error.message === 'Post not found') {
        res.status(404).json({ message: error.message })
        return
      }
      next(error)
    }
  },

  // Delete a comment
  async deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params
      const userId = req.user!.userId

      await postService.deleteComment(commentId, userId)
      res.status(204).send()
    } catch (error: any) {
      if (error.message === 'Comment not found or unauthorized') {
        res.status(404).json({ message: error.message })
        return
      }
      next(error)
    }
  },
}
