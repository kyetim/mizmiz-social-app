import { Request, Response, NextFunction } from 'express'
import { postService } from '../services/post.service'
import { CreatePostDTO, UpdatePostDTO, CreateCommentDTO } from '../interfaces/post.interface'
import { JwtPayload } from '../interfaces/auth.interface'
import { ValidationError, createValidationError } from '../utils/errors'
import { asyncHandler } from '../middleware/error.middleware'

// Extend Express Request type
interface AuthRequest extends Request {
  user?: JwtPayload
}

export const postController = {
  // Create a new post
  createPost: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId
    const data: CreatePostDTO = req.body

    // Validation
    const errors: Record<string, string> = {}
    if (!data.content || data.content.trim().length === 0) {
      errors.content = 'Content is required'
    } else if (data.content.length > 500) {
      errors.content = 'Content must be 500 characters or less'
    }

    if (Object.keys(errors).length > 0) {
      throw createValidationError(errors)
    }

    const post = await postService.createPost(userId, data)
    res.status(201).json({
      success: true,
      data: post
    })
  }),

  // Get all posts
  getPosts: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.query.userId as string | undefined
    const following = req.query.following === 'true'
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
    const cursor = req.query.cursor as string | undefined

    const currentUserId = req.user?.userId

    const posts = await postService.getPosts(
      { userId, following, limit, cursor },
      currentUserId
    )
    res.json({
      success: true,
      data: posts
    })
  }),

  // Get a single post
  getPost: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { postId } = req.params
    const currentUserId = req.user?.userId

    const post = await postService.getPostById(postId, currentUserId)

    if (!post) {
      throw new ValidationError('Post not found')
    }

    res.json({
      success: true,
      data: post
    })
  }),

  // Update a post
  updatePost: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { postId } = req.params
    const userId = req.user!.userId
    const data: UpdatePostDTO = req.body

    // Validation
    if (data.content && data.content.length > 500) {
      throw new ValidationError('Content must be 500 characters or less', {
        field: 'content',
        maxLength: 500
      })
    }

    const post = await postService.updatePost(postId, userId, data)
    res.json({
      success: true,
      data: post
    })
  }),

  // Delete a post
  deletePost: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { postId } = req.params
    const userId = req.user!.userId

    await postService.deletePost(postId, userId)
    res.status(204).send()
  }),

  // Like a post
  likePost: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { postId } = req.params
    const userId = req.user!.userId

    await postService.likePost(postId, userId)
    res.status(200).json({
      success: true,
      message: 'Post liked successfully'
    })
  }),

  // Unlike a post
  unlikePost: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { postId } = req.params
    const userId = req.user!.userId

    await postService.unlikePost(postId, userId)
    res.status(200).json({
      success: true,
      message: 'Post unliked successfully'
    })
  }),

  // Get comments for a post
  getComments: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params

    const comments = await postService.getComments(postId)
    res.json({
      success: true,
      data: comments
    })
  }),

  // Create a comment
  createComment: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { postId } = req.params
    const userId = req.user!.userId
    const data: CreateCommentDTO = req.body

    // Validation
    const errors: Record<string, string> = {}
    if (!data.content || data.content.trim().length === 0) {
      errors.content = 'Content is required'
    } else if (data.content.length > 300) {
      errors.content = 'Content must be 300 characters or less'
    }

    if (Object.keys(errors).length > 0) {
      throw createValidationError(errors)
    }

    const comment = await postService.createComment(postId, userId, data)
    res.status(201).json({
      success: true,
      data: comment
    })
  }),

  // Delete a comment
  deleteComment: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { commentId } = req.params
    const userId = req.user!.userId

    await postService.deleteComment(commentId, userId)
    res.status(204).send()
  }),
}
