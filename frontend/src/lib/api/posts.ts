import apiClient from './client'
import { PostInterface, CreatePostDto, CommentInterface, CreateCommentDto } from '@/interfaces/post.interface'

export const postsApi = {
  // Get all posts
  async getPosts(params?: { userId?: string; following?: boolean; limit?: number; cursor?: string }): Promise<PostInterface[]> {
    const response = await apiClient.get('/posts', { params })
    return response.data.data
  },

  // Get a single post
  async getPost(postId: string): Promise<PostInterface> {
    const response = await apiClient.get(`/posts/${postId}`)
    return response.data.data
  },

  // Create a new post
  async createPost(data: CreatePostDto): Promise<PostInterface> {
    const response = await apiClient.post('/posts', data)
    return response.data.data
  },

  // Update a post
  async updatePost(postId: string, data: Partial<CreatePostDto>): Promise<PostInterface> {
    const response = await apiClient.put(`/posts/${postId}`, data)
    return response.data.data
  },

  // Delete a post
  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}`)
  },

  // Like a post
  async likePost(postId: string): Promise<void> {
    await apiClient.post(`/posts/${postId}/like`)
  },

  // Unlike a post
  async unlikePost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}/like`)
  },

  // Get comments for a post
  async getComments(postId: string): Promise<CommentInterface[]> {
    const response = await apiClient.get(`/posts/${postId}/comments`)
    return response.data.data
  },

  // Create a comment
  async createComment(postId: string, data: CreateCommentDto): Promise<CommentInterface> {
    const response = await apiClient.post(`/posts/${postId}/comments`, data)
    return response.data.data
  },

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/posts/comments/${commentId}`)
  },

  // Get explore/all posts (not filtered by following)
  async getExplorePosts(params?: { limit?: number; cursor?: string }): Promise<PostInterface[]> {
    const response = await apiClient.get('/posts', {
      params: {
        ...params,
        following: false
      }
    })
    return response.data.data
  },

  // Get timeline/feed posts (filtered by following)
  async getFeedPosts(params?: { limit?: number; cursor?: string }): Promise<PostInterface[]> {
    const response = await apiClient.get('/posts', {
      params: {
        ...params,
        following: true
      }
    })
    return response.data.data
  },


  // Search posts
  async searchPosts(query: string, limit: number = 20, offset: number = 0): Promise<PostInterface[]> {
    const response = await apiClient.get('/posts/search', {
      params: {
        query,
        limit,
        offset
      }
    })
    return response.data.data
  },
}

