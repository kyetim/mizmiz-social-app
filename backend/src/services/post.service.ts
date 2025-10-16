import {
  CreatePostDTO,
  UpdatePostDTO,
  PostResponse,
  PostFilters,
  CreateCommentDTO,
  CommentResponse,
} from '../interfaces/post.interface'
import { prisma } from '../lib/prisma'

export const postService = {
  // Create a new post
  async createPost(userId: string, data: CreatePostDTO): Promise<PostResponse> {
    const post = await prisma.post.create({
      data: {
        userId,
        content: data.content,
        imageUrl: data.imageUrl,
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

    // Update user's posts count
    await prisma.user.update({
      where: { id: userId },
      data: { postsCount: { increment: 1 } },
    })

    return post as PostResponse
  },

  // Get all posts with filters
  async getPosts(filters: PostFilters, currentUserId?: string): Promise<PostResponse[]> {
    const { userId, following, limit = 20, cursor } = filters

    const where: any = {
      isDeleted: false,
    }

    if (userId) {
      where.userId = userId
    }

    if (following && currentUserId) {
      const followingUsers = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      })
      where.userId = {
        in: followingUsers.map((f) => f.followingId),
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
      },
    })

    // Check if current user liked each post
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

      return posts.map((post) => ({
        ...post,
        isLikedByCurrentUser: likedPostIds.has(post.id),
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
      },
    })

    if (!post) return null

    // Check if current user liked this post
    if (currentUserId) {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: currentUserId,
            postId: post.id,
          },
        },
      })
      return { ...post, isLikedByCurrentUser: !!like } as PostResponse
    }

    return post as PostResponse
  },

  // Update a post
  async updatePost(postId: string, userId: string, data: UpdatePostDTO): Promise<PostResponse> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.userId !== userId) {
      throw new Error('Post not found or unauthorized')
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

    if (!post || post.userId !== userId) {
      throw new Error('Post not found or unauthorized')
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
  },

  // Like a post
  async likePost(postId: string, userId: string): Promise<void> {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      throw new Error('Post not found')
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
      throw new Error('Post already liked')
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
      throw new Error('Like not found')
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
      throw new Error('Post not found')
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

    return comment as CommentResponse
  },

  // Delete a comment
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment || comment.userId !== userId) {
      throw new Error('Comment not found or unauthorized')
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

