import { Request, Response } from 'express'
import { UserService, UpdateUserProfileDto } from '../services/user.service'
import { asyncHandler } from '../middleware/error.middleware'

interface AuthRequest extends Request {
    user?: { userId: string; role?: string }
}

export const userController = {
    // Get user by ID
    getUser: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { userId } = req.params
        const currentUserId = req.user?.userId

        const user = await UserService.getUserById(userId, currentUserId)

        res.status(200).json({
            success: true,
            data: user
        })
    }),

    // Get current user profile
    getCurrentUser: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const user = await UserService.getUserById(req.user.userId)

        res.status(200).json({
            success: true,
            data: user
        })
    }),

    // Update user profile
    updateProfile: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const updateData: UpdateUserProfileDto = req.body

        const updatedUser = await UserService.updateProfile(req.user.userId, updateData)

        res.status(200).json({
            success: true,
            data: updatedUser
        })
    }),

    // Update avatar
    updateAvatar: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const { avatarUrl } = req.body

        if (!avatarUrl) {
            res.status(400).json({
                success: false,
                error: { message: 'Avatar URL is required' }
            })
            return
        }

        const updatedUser = await UserService.updateAvatar(req.user.userId, avatarUrl)

        res.status(200).json({
            success: true,
            data: updatedUser
        })
    }),

    // Update cover image
    updateCoverImage: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.user?.userId) {
            res.status(401).json({
                success: false,
                error: { message: 'Unauthorized' }
            })
            return
        }

        const { coverImageUrl } = req.body

        if (!coverImageUrl) {
            res.status(400).json({
                success: false,
                error: { message: 'Cover image URL is required' }
            })
            return
        }

        const updatedUser = await UserService.updateCoverImage(req.user.userId, coverImageUrl)

        res.status(200).json({
            success: true,
            data: updatedUser
        })
    }),

    // Get users list
    getUsers: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { search, limit, offset } = req.query
        const currentUserId = req.user?.userId // Get current user ID if authenticated

        const users = await UserService.getUsers({
            search: search as string,
            limit: limit ? parseInt(limit as string) : undefined,
            offset: offset ? parseInt(offset as string) : undefined,
            currentUserId: currentUserId // Pass current user ID to check follow status
        })

        res.status(200).json({
            success: true,
            data: users
        })
    }),

    // Get user's liked posts
    getUserLikedPosts: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { userId } = req.params
        const { limit } = req.query

        const posts = await UserService.getUserLikedPosts(
            userId,
            limit ? parseInt(limit as string) : undefined
        )

        res.status(200).json({
            success: true,
            data: posts
        })
    }),

    // Follow a user
    followUser: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const followerId = req.user!.userId
        const { userId: followingId } = req.params

        await UserService.followUser(followerId, followingId)

        res.status(200).json({
            success: true,
            message: 'User followed successfully'
        })
    }),

    // Unfollow a user
    unfollowUser: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const followerId = req.user!.userId
        const { userId: followingId } = req.params

        await UserService.unfollowUser(followerId, followingId)

        res.status(200).json({
            success: true,
            message: 'User unfollowed successfully'
        })
    }),

    // Check if following a user
    isFollowing: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const followerId = req.user!.userId
        const { userId: followingId } = req.params

        const isFollowing = await UserService.isFollowing(followerId, followingId)

        res.status(200).json({
            success: true,
            data: { isFollowing }
        })
    }),

    // Get user's followers
    getFollowers: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { userId } = req.params
        const { limit, offset } = req.query

        const followers = await UserService.getFollowers(
            userId,
            limit ? parseInt(limit as string) : undefined,
            offset ? parseInt(offset as string) : undefined
        )

        res.status(200).json({
            success: true,
            data: followers
        })
    }),

    // Get user's following
    getFollowing: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { userId } = req.params
        const { limit, offset } = req.query

        const following = await UserService.getFollowing(
            userId,
            limit ? parseInt(limit as string) : undefined,
            offset ? parseInt(offset as string) : undefined
        )

        res.status(200).json({
            success: true,
            data: following
        })
    })
}

