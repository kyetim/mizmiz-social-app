import {
  CreatePostDTO,
  UpdatePostDTO,
  PostResponse,
  PostFilters,
  CreateCommentDTO,
  CommentResponse,
} from '../interfaces/post.interface'
import { prisma } from '../lib/prisma'
import { NotFoundError, ForbiddenError, BusinessLogicError, ErrorCode } from '../utils/errors'
import { logInfo } from '../utils/logger'
import { NotificationService } from './notification.service'

export const postService = {
  // Create a new post
  async createPost(userId: string, data: CreatePostDTO): Promise<PostResponse> {
    const { content, imageUrl, categoryIds, vibeIds } = data

    const post = await prisma.post.create({
      data: {
        userId,
        content,
        imageUrl,
        postCategories: categoryIds && categoryIds.length > 0 ? {
          create: categoryIds.map(categoryId => ({
            categoryId,
            voteCount: 1, // Initial vote
            confidence: 1.0, // User explicitly selected it
          }))
        } : undefined,
        postVibes: vibeIds && vibeIds.length > 0 ? {
          create: vibeIds.map(vibeId => ({
            vibeId,
            voteCount: 1,
            confidence: 1.0,
          }))
        } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        postCategories: {
          include: {
            category: true
          }
        },
        postVibes: {
          include: {
            vibe: true
          }
        }
      },
    })

    // Update user's posts count
    await prisma.user.update({
      where: { id: userId },
      data: { postsCount: { increment: 1 } },
    })

    return post as unknown as PostResponse
  },

  // Get all posts with filters
  async getPosts(filters: PostFilters, currentUserId?: string): Promise<PostResponse[]> {
    const { userId, following, limit = 20, cursor, categoryId, vibeId } = filters

    const where: any = {
      isDeleted: false,
    }

    if (userId) {
      where.userId = userId
    }

    if (categoryId) {
      where.postCategories = {
        some: {
          categoryId
        }
      }
    }

    if (vibeId) {
      where.postVibes = {
        some: {
          vibeId
        }
      }
    }

    let followingUsers: { followingId: string }[] = []

    if (following && currentUserId) {
      followingUsers = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      })

      // Kullanıcının kendi gönderilerinin de timeline'da görünmesi için kendisini ekle
      const userIds = new Set(followingUsers.map((f) => f.followingId))
      userIds.add(currentUserId)

      where.userId = {
        in: Array.from(userIds),
      }
    }

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        postCategories: {
          include: {
            category: true
          }
        },
        postVibes: {
          include: {
            vibe: true
          }
        }
      },
    })

    // Check if current user liked/followed each post
    if (currentUserId) {
      const postIds = posts.map((p) => p.id)
      const likes = await prisma.like.findMany({
        where: {
          userId: currentUserId,
          postId: { in: postIds },
        },
        select: { postId: true },
      })
      const likedPostIds = new Set(likes.map((l) => l.postId))

      let followedAuthorIds = new Set<string>()
      if (following && currentUserId) {
        followedAuthorIds = new Set(followingUsers.map((f) => f.followingId))
      } else {
        const authorIds = Array.from(new Set(posts.map((p) => p.userId)))
        if (authorIds.length > 0) {
          const followedAuthors = await prisma.follow.findMany({
            where: {
              followerId: currentUserId,
              followingId: {
                in: authorIds,
              },
            },
            select: { followingId: true },
          })
          followedAuthorIds = new Set(followedAuthors.map((f) => f.followingId))
        }
      }

      return posts.map((post) => ({
        ...post,
        isLikedByCurrentUser: likedPostIds.has(post.id),
        isAuthorFollowed: followedAuthorIds.has(post.userId),
      })) as PostResponse[]
    }

    return posts as PostResponse[]
  },

  // Get a single post by ID
  async getPostById(postId: string, currentUserId?: string): Promise<PostResponse | null> {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        postCategories: {
          include: {
            category: true
          }
        },
        postVibes: {
          include: {
            vibe: true
          }
        }
      },
    })

    if (!post) return null

    // Check if current user liked this post
    if (currentUserId) {
      const [like, follow] = await Promise.all([
        prisma.like.findUnique({
          where: {
            userId_postId: {
              userId: currentUserId,
              postId: post.id,
            },
          },
        }),
        prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: post.userId,
            },
          },
        }),
      ])
      return {
        ...post,
        isLikedByCurrentUser: !!like,
        isAuthorFollowed: !!follow,
      } as PostResponse
    }

    return post as PostResponse
  },

  // Update a post
  async updatePost(postId: string, userId: string, data: UpdatePostDTO): Promise<PostResponse> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundError('Post')
    }

    if (post.userId !== userId) {
      throw new ForbiddenError('You are not authorized to update this post')
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
        isEdited: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return updatedPost as PostResponse
  },

  // Delete a post
  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundError('Post')
    }

    if (post.userId !== userId) {
      throw new ForbiddenError('You are not authorized to delete this post')
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Decrement user's posts count
    await prisma.user.update({
      where: { id: userId },
      data: { postsCount: { decrement: 1 } },
    })

    logInfo('Post deleted', { postId, userId })
  },

  // Like a post
  async likePost(postId: string, userId: string): Promise<void> {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      throw new NotFoundError('Post')
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (existingLike) {
      throw new BusinessLogicError('Post already liked', ErrorCode.ALREADY_LIKED)
    }

    // Create like
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    })

    // Increment likes count
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    })

    // Create notification if post owner is different from liker
    if (post.userId !== userId) {
      await NotificationService.notifyLike(userId, post.userId, postId)
    }
  },

  // Unlike a post
  async unlikePost(postId: string, userId: string): Promise<void> {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (!like) {
      throw new BusinessLogicError('Post not liked yet', ErrorCode.NOT_LIKED)
    }

    // Delete like
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    // Decrement likes count
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { decrement: 1 } },
    })
  },

  // Get comments for a post
  async getComments(postId: string): Promise<CommentResponse[]> {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return comments as CommentResponse[]
  },

  // Create a comment
  async createComment(
    postId: string,
    userId: string,
    data: CreateCommentDTO
  ): Promise<CommentResponse> {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      throw new NotFoundError('Post')
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Increment comments count
    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    })

    // Create notification if post owner is different from commenter
    if (post.userId !== userId) {
      await NotificationService.notifyComment(userId, post.userId, postId)
    }

    return comment as CommentResponse
  },

  // Delete a comment
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new NotFoundError('Comment')
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('You are not authorized to delete this comment')
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Decrement comments count
    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    })
  },
}

