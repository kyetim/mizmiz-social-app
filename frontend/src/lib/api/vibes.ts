import apiClient from './client'
import { Vibe, PostVibe } from '@/interfaces/category.interface'

export const vibesApi = {
  // Get all vibes
  async getVibes(isActive?: boolean): Promise<Vibe[]> {
    const response = await apiClient.get('/vibes', {
      params: { isActive },
    })
    return response.data
  },

  // Get post vibes
  async getPostVibes(postId: string): Promise<PostVibe[]> {
    const response = await apiClient.get(`/posts/${postId}/vibes`)
    return response.data
  },

  // Add vibe to post
  async addVibeToPost(postId: string, vibeId: string): Promise<PostVibe> {
    const response = await apiClient.post(`/posts/${postId}/vibes`, {
      vibeId,
    })
    return response.data
  },

  // Remove vibe from post
  async removeVibeFromPost(postId: string, vibeId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}/vibes/${vibeId}`)
  },

  // Vote on vibe
  async voteOnVibe(
    postVibeId: string,
    voteType: 'UPVOTE' | 'DOWNVOTE'
  ): Promise<void> {
    await apiClient.post(`/post-vibes/${postVibeId}/vote`, {
      voteType,
    })
  },
}

