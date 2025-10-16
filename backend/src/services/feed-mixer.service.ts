import { PostResponse } from '../interfaces/post.interface'
import { FeedFilters } from '../interfaces/preference.interface'
import { prisma } from '../lib/prisma'

export const feedMixerService = {
  // Get personalized mixed feed
  async getMixedFeed(
    userId: string,
    filters: FeedFilters
  ): Promise<PostResponse[]> {
    const { mode = 'normal', categories, vibes, limit = 20, cursor } = filters

    // Get user preferences
    const [categoryPrefs, vibePrefs] = await Promise.all([
      prisma.userCategoryPreference.findMany({
        where: { userId },
      }),
      prisma.userVibePreference.findMany({
        where: { userId },
      }),
    ])

    // Get blocked categories and vibes
    const blockedCategoryIds = categoryPrefs
      .filter((p) => p.isBlocked)
      .map((p) => p.categoryId)
    const blockedVibeIds = vibePrefs
      .filter((p) => p.isBlocked)
      .map((p) => p.vibeId)

    // Build where clause
    const where: any = {
      isDeleted: false,
    }

    // Apply mode filters
    if (mode === 'soft') {
      // Only show positive/uplifting vibes
      const positiveVibes = await prisma.vibe.findMany({
        where: {
          slug: {
            in: ['positive', 'inspiring', 'fun'],
          },
        },
      })
      const positiveVibeIds = positiveVibes.map((v) => v.id)

      where.postVibes = {
        some: {
          vibeId: {
            in: positiveVibeIds,
          },
          confidence: {
            gte: 0.5,
          },
        },
      }
    } else if (mode === 'focus') {
      // Only show informative/educational vibes
      const focusVibes = await prisma.vibe.findMany({
        where: {
          slug: {
            in: ['informative', 'thoughtful'],
          },
        },
      })
      const focusVibeIds = focusVibes.map((v) => v.id)

      where.postVibes = {
        some: {
          vibeId: {
            in: focusVibeIds,
          },
          confidence: {
            gte: 0.5,
          },
        },
      }
    }

    // Filter by specific categories if provided
    if (categories && categories.length > 0) {
      where.postCategories = {
        some: {
          categoryId: {
            in: categories,
          },
        },
      }
    }

    // Filter by specific vibes if provided
    if (vibes && vibes.length > 0) {
      where.postVibes = {
        some: {
          vibeId: {
            in: vibes,
          },
        },
      }
    }

    // Get posts
    let posts = await prisma.post.findMany({
      where,
      take: limit * 3, // Get more posts to allow for filtering
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
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                color: true,
              },
            },
          },
        },
        postVibes: {
          include: {
            vibe: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
    })

    // Filter out blocked categories and vibes
    posts = posts.filter((post) => {
      // Check if post has any blocked categories
      const hasBlockedCategory = post.postCategories.some((pc) =>
        blockedCategoryIds.includes(pc.categoryId)
      )
      if (hasBlockedCategory) return false

      // Check if post has any blocked vibes
      const hasBlockedVibe = post.postVibes.some((pv) =>
        blockedVibeIds.includes(pv.vibeId)
      )
      if (hasBlockedVibe) return false

      return true
    })

    // Score posts based on user preferences
    const scoredPosts = posts.map((post) => {
      let score = 0

      // Calculate score based on category preferences
      post.postCategories.forEach((pc) => {
        const pref = categoryPrefs.find((p) => p.categoryId === pc.categoryId)
        if (pref) {
          // weight (0-100) * confidence (0-1) * post category weight (0-100)
          score += (pref.weight * pc.confidence * pc.weight) / 10000
        }
      })

      // Add recency bonus (newer posts get higher scores)
      const ageInHours =
        (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60)
      const recencyBonus = Math.max(0, 10 - ageInHours / 24) // Bonus decreases over days
      score += recencyBonus

      // Add engagement bonus
      const engagementScore =
        post.likesCount * 0.5 + post.commentsCount * 1 + post.sharesCount * 2
      score += Math.log(engagementScore + 1) * 2 // Logarithmic scaling

      return { post, score }
    })

    // Sort by score
    scoredPosts.sort((a, b) => b.score - a.score)

    // Take only the requested limit
    const finalPosts = scoredPosts.slice(0, limit).map((sp) => sp.post)

    // Check if user liked each post
    const postIds = finalPosts.map((p) => p.id)
    const likes = await prisma.like.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    })
    const likedPostIds = new Set(likes.map((l) => l.postId))

    return finalPosts.map((post) => ({
      ...post,
      isLikedByCurrentUser: likedPostIds.has(post.id),
    })) as any[]
  },

  // Get default feed for new users (no preferences yet)
  async getDefaultFeed(
    userId: string,
    limit: number = 20,
    cursor?: string
  ): Promise<PostResponse[]> {
    const posts = await prisma.post.findMany({
      where: {
        isDeleted: false,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [
        // TODO: Re-enable when categoryScore field is added back to schema
        // { categoryScore: 'desc' }, // Posts with good category confidence
        { createdAt: 'desc' }, // Recent posts
      ],
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
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                color: true,
              },
            },
          },
        },
        postVibes: {
          include: {
            vibe: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
    })

    // Check if user liked each post
    const postIds = posts.map((p) => p.id)
    const likes = await prisma.like.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    })
    const likedPostIds = new Set(likes.map((l) => l.postId))

    return posts.map((post) => ({
      ...post,
      isLikedByCurrentUser: likedPostIds.has(post.id),
    })) as any[]
  },
}

