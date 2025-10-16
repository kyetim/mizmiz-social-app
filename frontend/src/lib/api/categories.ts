import apiClient from './client'
import { Category, PostCategory, PostVibe } from '@/interfaces/category.interface'

export const categoriesApi = {
  // Get all categories
  async getCategories(filters?: {
    type?: string
    isActive?: boolean
  }): Promise<Category[]> {
    const response = await apiClient.get('/categories', { params: filters })
    return response.data
  },

  // Get trending categories
  async getTrendingCategories(limit?: number): Promise<Category[]> {
    const response = await apiClient.get('/categories/trending', {
      params: { limit },
    })
    return response.data
  },

  // Get temporal categories
  async getTemporalCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories/temporal')
    return response.data
  },

  // Get post categories
  async getPostCategories(postId: string): Promise<PostCategory[]> {
    const response = await apiClient.get(`/posts/${postId}/categories`)
    return response.data
  },

  // Add category to post
  async addCategoryToPost(
    postId: string,
    categoryId: string
  ): Promise<PostCategory> {
    const response = await apiClient.post(`/posts/${postId}/categories`, {
      categoryId,
    })
    return response.data
  },

  // Remove category from post
  async removeCategoryFromPost(
    postId: string,
    categoryId: string
  ): Promise<void> {
    await apiClient.delete(`/posts/${postId}/categories/${categoryId}`)
  },

  // Vote on category
  async voteOnCategory(
    postCategoryId: string,
    voteType: 'UPVOTE' | 'DOWNVOTE'
  ): Promise<void> {
    await apiClient.post(`/post-categories/${postCategoryId}/vote`, {
      voteType,
    })
  },

  // Get AI suggestions
  async getSuggestedCategories(content: string): Promise<{ suggestions: string[] }> {
    const response = await apiClient.post('/categories/suggest', { content })
    return response.data
  },
}

