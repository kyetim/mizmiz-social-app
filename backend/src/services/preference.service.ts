import { prisma } from '../lib/prisma'
import {
  UserCategoryPreferenceResponse,
  UserVibePreferenceResponse,
  UpdateCategoryPreferenceDTO,
  UpdateVibePreferenceDTO,
} from '../interfaces/preference.interface'


export const preferenceService = {
  // ==================== CATEGORY PREFERENCES ====================

  // Get user's category preferences
  async getUserCategoryPreferences(
    userId: string
  ): Promise<UserCategoryPreferenceResponse[]> {
    const preferences = await prisma.userCategoryPreference.findMany({
      where: { userId },
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

    return preferences as any[]
  },

  // Set or update category preference
  async setCategoryPreference(
    userId: string,
    data: UpdateCategoryPreferenceDTO
  ): Promise<UserCategoryPreferenceResponse> {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    // Validate weight
    if (data.weight !== undefined && (data.weight < 0 || data.weight > 100)) {
      throw new Error('Weight must be between 0 and 100')
    }

    const preference = await prisma.userCategoryPreference.upsert({
      where: {
        userId_categoryId: {
          userId,
          categoryId: data.categoryId,
        },
      },
      update: {
        weight: data.weight,
        isBlocked: data.isBlocked,
      },
      create: {
        userId,
        categoryId: data.categoryId,
        weight: data.weight || 0,
        isBlocked: data.isBlocked || false,
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

    return preference as any
  },

  // Set multiple category preferences at once (for feed mixer)
  async setBulkCategoryPreferences(
    userId: string,
    preferences: UpdateCategoryPreferenceDTO[]
  ): Promise<UserCategoryPreferenceResponse[]> {
    const results: UserCategoryPreferenceResponse[] = []

    for (const pref of preferences) {
      const result = await this.setCategoryPreference(userId, pref)
      results.push(result)
    }

    return results
  },

  // Block a category
  async blockCategory(userId: string, categoryId: string): Promise<void> {
    await this.setCategoryPreference(userId, {
      categoryId,
      isBlocked: true,
    })
  },

  // Unblock a category
  async unblockCategory(userId: string, categoryId: string): Promise<void> {
    await this.setCategoryPreference(userId, {
      categoryId,
      isBlocked: false,
    })
  },

  // ==================== VIBE PREFERENCES ====================

  // Get user's vibe preferences
  async getUserVibePreferences(
    userId: string
  ): Promise<UserVibePreferenceResponse[]> {
    const preferences = await prisma.userVibePreference.findMany({
      where: { userId },
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

    return preferences as any[]
  },

  // Set or update vibe preference
  async setVibePreference(
    userId: string,
    data: UpdateVibePreferenceDTO
  ): Promise<UserVibePreferenceResponse> {
    // Check if vibe exists
    const vibe = await prisma.vibe.findUnique({
      where: { id: data.vibeId },
    })

    if (!vibe) {
      throw new Error('Vibe not found')
    }

    const preference = await prisma.userVibePreference.upsert({
      where: {
        userId_vibeId: {
          userId,
          vibeId: data.vibeId,
        },
      },
      update: {
        isBlocked: data.isBlocked,
      },
      create: {
        userId,
        vibeId: data.vibeId,
        isBlocked: data.isBlocked,
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

    return preference as any
  },

  // Block a vibe
  async blockVibe(userId: string, vibeId: string): Promise<void> {
    await this.setVibePreference(userId, {
      vibeId,
      isBlocked: true,
    })
  },

  // Unblock a vibe
  async unblockVibe(userId: string, vibeId: string): Promise<void> {
    await this.setVibePreference(userId, {
      vibeId,
      isBlocked: false,
    })
  },

  // ==================== GET ALL PREFERENCES ====================

  async getAllPreferences(userId: string): Promise<{
    categoryPreferences: UserCategoryPreferenceResponse[]
    vibePreferences: UserVibePreferenceResponse[]
  }> {
    const [categoryPreferences, vibePreferences] = await Promise.all([
      this.getUserCategoryPreferences(userId),
      this.getUserVibePreferences(userId),
    ])

    return {
      categoryPreferences,
      vibePreferences,
    }
  },
}

