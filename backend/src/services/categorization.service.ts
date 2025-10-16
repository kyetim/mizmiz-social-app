import { VoteType } from '@prisma/client'
import {
  PostCategoryResponse,
  PostVibeResponse,
  AddCategoryToPostDTO,
  AddVibeToPostDTO,
} from '../interfaces/category.interface'
import { prisma } from '../lib/prisma'

// Helper functions for scoring
function calculateConfidence(upvotes: number, downvotes: number): number {
  const total = upvotes + downvotes
  if (total === 0) return 0

  const ratio = upvotes / total
  // Confidence increases with vote count, but plateaus at 10 votes
  const volumeMultiplier = Math.min(1, total / 10)
  const confidence = ratio * volumeMultiplier

  return Math.round(confidence * 100) / 100 // Round to 2 decimals
}

async function recalculatePostCategoryWeights(postId: string): Promise<void> {
  const postCategories = await prisma.postCategory.findMany({
    where: { postId },
  })

  const totalConfidence = postCategories.reduce(
    (sum, pc) => sum + pc.confidence,
    0
  )

  if (totalConfidence === 0) {
    // No confidence, set all weights to 0
    await prisma.postCategory.updateMany({
      where: { postId },
      data: { weight: 0 },
    })
    return
  }

  // Update each category's weight
  for (const pc of postCategories) {
    const weight = (pc.confidence / totalConfidence) * 100
    await prisma.postCategory.update({
      where: { id: pc.id },
      data: { weight: Math.round(weight * 100) / 100 },
    })
  }

  // Update post's overall category score (average confidence)
  // TODO: Re-enable when categoryScore field is added back to schema
  // const avgConfidence =
  //   postCategories.reduce((sum, pc) => sum + pc.confidence, 0) /
  //   postCategories.length
  // await prisma.post.update({
  //   where: { id: postId },
  //   data: { categoryScore: Math.round(avgConfidence * 100) / 100 },
  // })
}

async function recalculatePostVibeWeights(postId: string): Promise<void> {
  const postVibes = await prisma.postVibe.findMany({
    where: { postId },
  })

  const totalConfidence = postVibes.reduce((sum, pv) => sum + pv.confidence, 0)

  if (totalConfidence === 0) {
    await prisma.postVibe.updateMany({
      where: { postId },
      data: { weight: 0 },
    })
    return
  }

  for (const pv of postVibes) {
    const weight = (pv.confidence / totalConfidence) * 100
    await prisma.postVibe.update({
      where: { id: pv.id },
      data: { weight: Math.round(weight * 100) / 100 },
    })
  }

  // Update post's overall vibe score
  // TODO: Re-enable when vibeScore field is added back to schema
  // const avgConfidence =
  //   postVibes.reduce((sum, pv) => sum + pv.confidence, 0) / postVibes.length
  // await prisma.post.update({
  //   where: { id: postId },
  //   data: { vibeScore: Math.round(avgConfidence * 100) / 100 },
  // })
}

export const categorizationService = {
  // ==================== CATEGORY MANAGEMENT ====================

  // Add category to post
  async addCategoryToPost(
    postId: string,
    data: AddCategoryToPostDTO,
    userId: string
  ): Promise<PostCategoryResponse> {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      throw new Error('Post not found')
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    })

    if (!category || !category.isActive) {
      throw new Error('Category not found or inactive')
    }

    // Check if already exists
    const existing = await prisma.postCategory.findUnique({
      where: {
        postId_categoryId: {
          postId,
          categoryId: data.categoryId,
        },
      },
    })

    if (existing) {
      throw new Error('Category already added to this post')
    }

    // Create post category
    const postCategory = await prisma.postCategory.create({
      data: {
        postId,
        categoryId: data.categoryId,
        isAISuggested: data.isAISuggested || false,
      },
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
    })

    // Update category posts count
    await prisma.category.update({
      where: { id: data.categoryId },
      data: { postsCount: { increment: 1 } },
    })

    // Recalculate weights
    await recalculatePostCategoryWeights(postId)

    return postCategory as any
  },

  // Remove category from post
  async removeCategoryFromPost(
    postId: string,
    categoryId: string,
    userId: string
  ): Promise<void> {
    const postCategory = await prisma.postCategory.findUnique({
      where: {
        postId_categoryId: {
          postId,
          categoryId,
        },
      },
      include: {
        post: true,
      },
    })

    if (!postCategory) {
      throw new Error('Post category not found')
    }

    // Only post owner can remove categories
    if (postCategory.post.userId !== userId) {
      throw new Error('Unauthorized')
    }

    await prisma.postCategory.delete({
      where: {
        postId_categoryId: {
          postId,
          categoryId,
        },
      },
    })

    // Update category posts count
    await prisma.category.update({
      where: { id: categoryId },
      data: { postsCount: { decrement: 1 } },
    })

    // Recalculate weights
    await recalculatePostCategoryWeights(postId)
  },

  // Vote on category
  async voteOnCategory(
    postCategoryId: string,
    userId: string,
    voteType: VoteType
  ): Promise<void> {
    const postCategory = await prisma.postCategory.findUnique({
      where: { id: postCategoryId },
    })

    if (!postCategory) {
      throw new Error('Post category not found')
    }

    // Check if user already voted
    const existingVote = await prisma.categoryVote.findUnique({
      where: {
        userId_postCategoryId: {
          userId,
          postCategoryId,
        },
      },
    })

    if (existingVote) {
      // User is changing their vote
      if (existingVote.voteType === voteType) {
        throw new Error('You already voted this way')
      }

      // Update the vote
      await prisma.categoryVote.update({
        where: {
          userId_postCategoryId: {
            userId,
            postCategoryId,
          },
        },
        data: { voteType },
      })

      // Update counts
      if (voteType === VoteType.UPVOTE) {
        await prisma.postCategory.update({
          where: { id: postCategoryId },
          data: {
            upvotes: { increment: 1 },
            downvotes: { decrement: 1 },
          },
        })
      } else {
        await prisma.postCategory.update({
          where: { id: postCategoryId },
          data: {
            upvotes: { decrement: 1 },
            downvotes: { increment: 1 },
          },
        })
      }
    } else {
      // New vote
      await prisma.categoryVote.create({
        data: {
          userId,
          postCategoryId,
          voteType,
        },
      })

      // Update counts
      const updateData: any = { voteCount: { increment: 1 } }
      if (voteType === VoteType.UPVOTE) {
        updateData.upvotes = { increment: 1 }
      } else {
        updateData.downvotes = { increment: 1 }
      }

      await prisma.postCategory.update({
        where: { id: postCategoryId },
        data: updateData,
      })

      // Update category votes count
      await prisma.category.update({
        where: { id: postCategory.categoryId },
        data: { votesCount: { increment: 1 } },
      })

      // Update post total votes
      // TODO: Re-enable when totalCategoryVotes field is added back to schema
      // await prisma.post.update({
      //   where: { id: postCategory.postId },
      //   data: { totalCategoryVotes: { increment: 1 } },
      // })
    }

    // Recalculate confidence and weights
    const updated = await prisma.postCategory.findUnique({
      where: { id: postCategoryId },
    })

    if (updated) {
      const confidence = calculateConfidence(updated.upvotes, updated.downvotes)
      await prisma.postCategory.update({
        where: { id: postCategoryId },
        data: { confidence },
      })

      await recalculatePostCategoryWeights(postCategory.postId)
    }
  },

  // Get categories for a post
  async getPostCategories(
    postId: string,
    userId?: string
  ): Promise<PostCategoryResponse[]> {
    try {
      const postCategories = await prisma.postCategory.findMany({
        where: { postId },
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
        orderBy: {
          weight: 'desc',
        },
      })

      // Get user votes if userId provided
      let userVotes: any[] = []
      if (userId) {
        userVotes = await prisma.categoryVote.findMany({
          where: {
            userId,
            postCategoryId: { in: postCategories.map((pc) => pc.id) },
          },
        })
      }

      return postCategories.map((pc) => {
        const userVote = userVotes.find((v) => v.postCategoryId === pc.id)
        return {
          ...pc,
          userVote: userVote?.voteType || null,
        } as any
      })
    } catch (error) {
      console.error('Error getting post categories:', error)
      // Return empty array if tables don't exist yet
      return []
    }
  },

  // ==================== VIBE MANAGEMENT ====================

  // Add vibe to post
  async addVibeToPost(
    postId: string,
    data: AddVibeToPostDTO,
    userId: string
  ): Promise<PostVibeResponse> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      throw new Error('Post not found')
    }

    const vibe = await prisma.vibe.findUnique({
      where: { id: data.vibeId },
    })

    if (!vibe || !vibe.isActive) {
      throw new Error('Vibe not found or inactive')
    }

    const existing = await prisma.postVibe.findUnique({
      where: {
        postId_vibeId: {
          postId,
          vibeId: data.vibeId,
        },
      },
    })

    if (existing) {
      throw new Error('Vibe already added to this post')
    }

    const postVibe = await prisma.postVibe.create({
      data: {
        postId,
        vibeId: data.vibeId,
        isAISuggested: data.isAISuggested || false,
      },
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
    })

    await prisma.vibe.update({
      where: { id: data.vibeId },
      data: { postsCount: { increment: 1 } },
    })

    await recalculatePostVibeWeights(postId)

    return postVibe as any
  },

  // Remove vibe from post
  async removeVibeFromPost(
    postId: string,
    vibeId: string,
    userId: string
  ): Promise<void> {
    const postVibe = await prisma.postVibe.findUnique({
      where: {
        postId_vibeId: {
          postId,
          vibeId,
        },
      },
      include: {
        post: true,
      },
    })

    if (!postVibe) {
      throw new Error('Post vibe not found')
    }

    if (postVibe.post.userId !== userId) {
      throw new Error('Unauthorized')
    }

    await prisma.postVibe.delete({
      where: {
        postId_vibeId: {
          postId,
          vibeId,
        },
      },
    })

    await prisma.vibe.update({
      where: { id: vibeId },
      data: { postsCount: { decrement: 1 } },
    })

    await recalculatePostVibeWeights(postId)
  },

  // Vote on vibe
  async voteOnVibe(
    postVibeId: string,
    userId: string,
    voteType: VoteType
  ): Promise<void> {
    const postVibe = await prisma.postVibe.findUnique({
      where: { id: postVibeId },
    })

    if (!postVibe) {
      throw new Error('Post vibe not found')
    }

    const existingVote = await prisma.vibeVote.findUnique({
      where: {
        userId_postVibeId: {
          userId,
          postVibeId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        throw new Error('You already voted this way')
      }

      await prisma.vibeVote.update({
        where: {
          userId_postVibeId: {
            userId,
            postVibeId,
          },
        },
        data: { voteType },
      })

      if (voteType === VoteType.UPVOTE) {
        await prisma.postVibe.update({
          where: { id: postVibeId },
          data: {
            upvotes: { increment: 1 },
            downvotes: { decrement: 1 },
          },
        })
      } else {
        await prisma.postVibe.update({
          where: { id: postVibeId },
          data: {
            upvotes: { decrement: 1 },
            downvotes: { increment: 1 },
          },
        })
      }
    } else {
      await prisma.vibeVote.create({
        data: {
          userId,
          postVibeId,
          voteType,
        },
      })

      const updateData: any = { voteCount: { increment: 1 } }
      if (voteType === VoteType.UPVOTE) {
        updateData.upvotes = { increment: 1 }
      } else {
        updateData.downvotes = { increment: 1 }
      }

      await prisma.postVibe.update({
        where: { id: postVibeId },
        data: updateData,
      })

      // TODO: Re-enable when totalVibeVotes field is added back to schema
      // await prisma.post.update({
      //   where: { id: postVibe.postId },
      //   data: { totalVibeVotes: { increment: 1 } },
      // })
    }

    const updated = await prisma.postVibe.findUnique({
      where: { id: postVibeId },
    })

    if (updated) {
      const confidence = calculateConfidence(updated.upvotes, updated.downvotes)
      await prisma.postVibe.update({
        where: { id: postVibeId },
        data: { confidence },
      })

      await recalculatePostVibeWeights(postVibe.postId)
    }
  },

  // Get vibes for a post
  async getPostVibes(
    postId: string,
    userId?: string
  ): Promise<PostVibeResponse[]> {
    try {
      const postVibes = await prisma.postVibe.findMany({
        where: { postId },
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
        orderBy: {
          weight: 'desc',
        },
      })

      let userVotes: any[] = []
      if (userId) {
        userVotes = await prisma.vibeVote.findMany({
          where: {
            userId,
            postVibeId: { in: postVibes.map((pv) => pv.id) },
          },
        })
      }

      return postVibes.map((pv) => {
        const userVote = userVotes.find((v) => v.postVibeId === pv.id)
        return {
          ...pv,
          userVote: userVote?.voteType || null,
        } as any
      })
    } catch (error) {
      console.error('Error getting post vibes:', error)
      // Return empty array if tables don't exist yet
      return []
    }
  },

  // ==================== AI SUGGESTIONS ====================

  // Get AI-suggested categories for post content (simple keyword-based for now)
  async suggestCategories(content: string): Promise<string[]> {
    const suggestions: string[] = []
    const lowerContent = content.toLowerCase()

    // Simple keyword matching - can be replaced with AI later
    const keywords: { [key: string]: string[] } = {
      mizah: ['😂', '🤣', 'komik', 'gülmek', 'şaka', 'mizah', 'eğlence'],
      spor: ['⚽', '🏀', 'maç', 'gol', 'spor', 'futbol', 'basketbol'],
      teknoloji: ['💻', '📱', 'yazılım', 'teknoloji', 'kod', 'program', 'ai'],
      yemek: ['🍴', '🍕', 'yemek', 'tarif', 'leziz', 'restoran'],
      gezi: ['✈️', '🗺️', 'gezi', 'seyahat', 'tatil', 'tur'],
    }

    for (const [slug, words] of Object.entries(keywords)) {
      if (words.some((word) => lowerContent.includes(word))) {
        suggestions.push(slug)
      }
    }

    return suggestions.slice(0, 3) // Max 3 suggestions
  },
}

