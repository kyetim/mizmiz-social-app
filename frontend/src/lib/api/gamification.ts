import apiClient from './client'
import {
  UserGamification,
  LeaderboardEntry,
} from '@/interfaces/category.interface'

export const gamificationApi = {
  // Get my gamification stats
  async getMyStats(): Promise<UserGamification> {
    const response = await apiClient.get('/gamification/me')
    return response.data
  },

  // Get user stats
  async getUserStats(userId: string): Promise<UserGamification> {
    const response = await apiClient.get(`/gamification/users/${userId}`)
    return response.data
  },

  // Get leaderboard
  async getLeaderboard(limit?: number): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get('/gamification/leaderboard', {
      params: { limit },
    })
    return response.data
  },
}

