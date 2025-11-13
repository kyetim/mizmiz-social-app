import { prisma } from '../lib/prisma'
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors'
import { logInfo } from '../utils/logger'

export interface UpdateUserProfileDto {
    firstName?: string
    lastName?: string
    bio?: string
    avatarUrl?: string
    coverImageUrl?: string
    location?: string
    website?: string
}

export class UserService {
    // Get user by ID
    static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                coverImageUrl: true,
                location: true,
                website: true,
                isVerified: true,
                followersCount: true,
                followingCount: true,
                postsCount: true,
                createdAt: true
            }
        })

        if (!user) {
            throw new NotFoundError('User not found')
        }

        return user
    }

    // Update user profile
    static async updateProfile(userId: string, data: UpdateUserProfileDto) {
        // Validate bio length
        if (data.bio && data.bio.length > 160) {
            throw new ValidationError('Bio must be at most 160 characters')
        }

        // Validate website URL
        if (data.website && data.website.length > 0) {
            try {
                new URL(data.website)
            } catch {
                throw new ValidationError('Invalid website URL')
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                coverImageUrl: data.coverImageUrl,
                location: data.location,
                website: data.website,
                updatedAt: new Date()
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                coverImageUrl: true,
                location: true,
                website: true,
                isVerified: true,
                followersCount: true,
                followingCount: true,
                postsCount: true,
                createdAt: true,
                updatedAt: true
            }
        })

        logInfo('User profile updated', {
            userId,
            updates: Object.keys(data)
        })

        return updatedUser
    }

    // Update avatar only
    static async updateAvatar(userId: string, avatarUrl: string) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                avatarUrl,
                updatedAt: new Date()
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                coverImageUrl: true,
                location: true,
                website: true,
                isVerified: true,
                followersCount: true,
                followingCount: true,
                postsCount: true,
                createdAt: true,
                updatedAt: true
            }
        })

        logInfo('User avatar updated', { userId })

        return updatedUser
    }

    // Update cover image only
    static async updateCoverImage(userId: string, coverImageUrl: string) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                coverImageUrl,
                updatedAt: new Date()
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                coverImageUrl: true,
                location: true,
                website: true,
                isVerified: true,
                followersCount: true,
                followingCount: true,
                postsCount: true,
                createdAt: true,
                updatedAt: true
            }
        })

        logInfo('User cover image updated', { userId })

        return updatedUser
    }

    // Get users list (for explore/search)
    static async getUsers(params?: {
        search?: string
        limit?: number
        offset?: number
    }) {
        const { search, limit = 20, offset = 0 } = params || {}

        const where = search
            ? {
                  OR: [
                      { username: { contains: search, mode: 'insensitive' as const } },
                      { firstName: { contains: search, mode: 'insensitive' as const } },
                      { lastName: { contains: search, mode: 'insensitive' as const } }
                  ]
              }
            : {}

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                isVerified: true,
                followersCount: true,
                followingCount: true,
                postsCount: true
            },
            take: limit,
            skip: offset,
            orderBy: [{ followersCount: 'desc' }, { postsCount: 'desc' }]
        })

        return users
    }

    // Get user's liked posts
    static async getUserLikedPosts(userId: string, limit: number = 50) {
        const likes = await prisma.like.findMany({
            where: {
                userId,
                post: {
                    isDeleted: false
                }
            },
            include: {
                post: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                                isVerified: true
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

        // Return posts with isLikedByCurrentUser flag
        return likes
            .filter(like => like.post !== null)
            .map(like => ({
                ...like.post!,
                isLikedByCurrentUser: true,
                likesCount: like.post!._count.likes,
                commentsCount: like.post!._count.comments
            }))
    }
}

