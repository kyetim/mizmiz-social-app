import apiClient from './client'
import { UserInterface } from '@/interfaces/user.interface'

export interface UpdateUserProfileDto {
    firstName?: string
    lastName?: string
    bio?: string
    avatarUrl?: string
    coverImageUrl?: string
    location?: string
    website?: string
}

export const usersApi = {
    // Get all users
    async getUsers(params?: {
        search?: string
        limit?: number
        offset?: number
    }): Promise<UserInterface[]> {
        const response = await apiClient.get('/users', {
            params
        })
        return response.data.data || response.data
    },

    // Get current user
    async getCurrentUser(): Promise<UserInterface> {
        const response = await apiClient.get('/users/me')
        return response.data.data || response.data
    },

    // Get user by ID
    async getUser(userId: string): Promise<UserInterface> {
        const response = await apiClient.get(`/users/${userId}`)
        return response.data.data || response.data
    },

    // Update user profile
    async updateProfile(data: UpdateUserProfileDto): Promise<UserInterface> {
        const response = await apiClient.put('/users/me', data)
        return response.data.data || response.data
    },

    // Update avatar
    async updateAvatar(avatarUrl: string): Promise<UserInterface> {
        const response = await apiClient.put('/users/me/avatar', { avatarUrl })
        return response.data.data || response.data
    },

    // Update cover image
    async updateCoverImage(coverImageUrl: string): Promise<UserInterface> {
        const response = await apiClient.put('/users/me/cover', { coverImageUrl })
        return response.data.data || response.data
    },

    // Follow user
    async followUser(userId: string): Promise<void> {
        await apiClient.post(`/users/${userId}/follow`)
    },

    // Unfollow user
    async unfollowUser(userId: string): Promise<void> {
        await apiClient.delete(`/users/${userId}/follow`)
    },

    // Check if following a user
    async isFollowing(userId: string): Promise<boolean> {
        const response = await apiClient.get(`/users/${userId}/is-following`)
        return response.data.data.isFollowing
    },

    // Get followers
    async getFollowers(userId: string, limit?: number, offset?: number): Promise<UserInterface[]> {
        const response = await apiClient.get(`/users/${userId}/followers`, {
            params: { limit, offset }
        })
        return response.data.data || response.data
    },

    // Get following
    async getFollowing(userId: string, limit?: number, offset?: number): Promise<UserInterface[]> {
        const response = await apiClient.get(`/users/${userId}/following`, {
            params: { limit, offset }
        })
        return response.data.data || response.data
    },

    // Get user's liked posts
    async getUserLikedPosts(userId: string, limit?: number) {
        const response = await apiClient.get(`/users/${userId}/liked-posts`, {
            params: { limit }
        })
        return response.data.data || response.data
    },
}

