import apiClient from './client'
import {
  UserCategoryPreference,
  UserVibePreference,
} from '@/interfaces/category.interface'
import { PostInterface } from '@/interfaces/post.interface'

export const preferencesApi = {
  // Get all preferences
  async getAllPreferences(): Promise<{
    categoryPreferences: UserCategoryPreference[]
    vibePreferences: UserVibePreference[]
  }> {
    const response = await apiClient.get('/preferences')
    return response.data
  },

  // Get category preferences
  async getCategoryPreferences(): Promise<UserCategoryPreference[]> {
    const response = await apiClient.get('/preferences/categories')
    return response.data
  },

  // Set category preference
  async setCategoryPreference(
    categoryId: string,
    weight?: number,
    isBlocked?: boolean
  ): Promise<UserCategoryPreference> {
    const response = await apiClient.post('/preferences/categories', {
      categoryId,
      weight,
      isBlocked,
    })
    return response.data
  },

  // Set bulk category preferences
  async setBulkCategoryPreferences(
    preferences: Array<{ categoryId: string; weight: number }>
  ): Promise<UserCategoryPreference[]> {
    const response = await apiClient.post('/preferences/categories/bulk', {
      preferences,
    })
    return response.data
  },

  // Block/unblock category
  async blockCategory(categoryId: string): Promise<void> {
    await apiClient.post('/preferences/block-category', { categoryId })
  },

  async unblockCategory(categoryId: string): Promise<void> {
    await apiClient.post('/preferences/unblock-category', { categoryId })
  },

  // Block/unblock vibe
  async blockVibe(vibeId: string): Promise<void> {
    await apiClient.post('/preferences/block-vibe', { vibeId })
  },

  async unblockVibe(vibeId: string): Promise<void> {
    await apiClient.post('/preferences/unblock-vibe', { vibeId })
  },

  // Get mixed feed
  async getMixedFeed(params?: {
    mode?: 'normal' | 'soft' | 'focus'
    categories?: string[]
    vibes?: string[]
    limit?: number
    cursor?: string
  }): Promise<PostInterface[]> {
    const response = await apiClient.get('/feed/mixed', {
      params: {
        ...params,
        categories: params?.categories?.join(','),
        vibes: params?.vibes?.join(','),
      },
    })
    return response.data
  },
}

