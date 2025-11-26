import { prisma } from '../lib/prisma'
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors'
import { logInfo } from '../utils/logger'
import { NotificationService } from './notification.service'

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
                createdAt: true,
                gamification: true
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
                updatedAt: true,
                gamification: true
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
                updatedAt: true,
                gamification: true
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
                updatedAt: true,
                gamification: true
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
        currentUserId?: string // Optional: to check if current user is following each user
    }) {
        const { search, limit = 20, offset = 0, currentUserId } = params || {}

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

        // If currentUserId is provided, check follow status for each user
        if (currentUserId) {
            const userIds = users.map(u => u.id)
            const followRelations = await prisma.follow.findMany({
                where: {
                    followerId: currentUserId,
                    followingId: { in: userIds }
                },
                select: {
                    followingId: true
                }
            })

            const followingIds = new Set(followRelations.map(f => f.followingId))

            // Add isFollowing property to each user
            return users.map(user => ({
                ...user,
                isFollowing: followingIds.has(user.id)
            }))
        }

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

    // Follow a user
    static async followUser(followerId: string, followingId: string) {
        // Can't follow yourself
        if (followerId === followingId) {
            throw new ValidationError('You cannot follow yourself')
        }

        // Check if user to follow exists
        const userToFollow = await prisma.user.findUnique({
            where: { id: followingId }
        })

        if (!userToFollow) {
            throw new NotFoundError('User not found')
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        })

        if (existingFollow) {
            throw new ConflictError('Already following this user')
        }

        // Create follow relationship
        await prisma.$transaction(async (tx) => {
            // Create follow record
            await tx.follow.create({
                data: {
                    followerId,
                    followingId
                }
            })

            // Update follower's following count
            await tx.user.update({
                where: { id: followerId },
                data: { followingCount: { increment: 1 } }
            })

            // Update following's followers count
            await tx.user.update({
                where: { id: followingId },
                data: { followersCount: { increment: 1 } }
            })
        })

        // Create notification
        await NotificationService.notifyFollow(followerId, followingId)

        logInfo('User followed', { followerId, followingId })
    }

    // Unfollow a user
    static async unfollowUser(followerId: string, followingId: string) {
        // Can't unfollow yourself
        if (followerId === followingId) {
            throw new ValidationError('Invalid operation')
        }

        // Check if follow exists
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        })

        if (!existingFollow) {
            throw new NotFoundError('Follow relationship not found')
        }

        // Delete follow relationship
        await prisma.$transaction(async (tx) => {
            // Delete follow record
            await tx.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            })

            // Update follower's following count
            await tx.user.update({
                where: { id: followerId },
                data: { followingCount: { decrement: 1 } }
            })

            // Update following's followers count
            await tx.user.update({
                where: { id: followingId },
                data: { followersCount: { decrement: 1 } }
            })
        })

        logInfo('User unfollowed', { followerId, followingId })
    }

    // Check if user is following another user
    static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        })

        return !!follow
    }

    // Get user's followers
    static async getFollowers(userId: string, limit: number = 50, offset: number = 0) {
        const follows = await prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        bio: true,
                        avatarUrl: true,
                        isVerified: true,
                        followersCount: true,
                        followingCount: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
        })

        return follows.map(f => f.follower)
    }

    // Get user's following
    static async getFollowing(userId: string, limit: number = 50, offset: number = 0) {
        const follows = await prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        bio: true,
                        avatarUrl: true,
                        isVerified: true,
                        followersCount: true,
                        followingCount: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
        })

        return follows.map(f => f.following)
    }
}

