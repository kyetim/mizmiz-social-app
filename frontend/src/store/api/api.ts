import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import apiClient from '@/lib/api/client'
import type { UserInterface } from '@/interfaces/user.interface'
import type { Category, Vibe, PostVibe, PostCategory } from '@/interfaces/category.interface'
import type { PostInterface, CommentInterface, CreatePostDto, CreateCommentDto } from '@/interfaces/post.interface'
import type { UpdateUserProfileDto } from '@/lib/api/users'

type AxiosBaseQueryArgs = {
  url: string
  method?: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
}

type AxiosBaseQueryError = {
  status?: number | string
  data?: unknown
}

const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
    async ({ url, method = 'get', data, params }) => {
      try {
        const result = await apiClient.request({
          url,
          method,
          data,
          params,
        })

        return { data: result.data?.data ?? result.data }
      } catch (error) {
        const err = error as AxiosError
        return {
          error: {
            status: err.response?.status ?? err.code ?? 'FETCH_ERROR',
            data: err.response?.data ?? err.message,
          },
        }
      }
    }

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'Notifications', 'Categories', 'Vibes', 'Feed', 'Posts', 'Comments', 'Users'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserInterface, void>({
      query: () => ({ url: '/auth/me', method: 'get' }),
      providesTags: ['Auth'],
    }),
    getUnreadNotificationsCount: builder.query<{ count: number }, void>({
      query: () => ({ url: '/notifications/unread-count', method: 'get' }),
      providesTags: ['Notifications'],
    }),
    getCategories: builder.query<Category[], { type?: string; isActive?: boolean } | void>({
      query: (params) => ({ url: '/categories', method: 'get', params }),
      providesTags: ['Categories'],
    }),
    getTrendingCategories: builder.query<Category[], { limit?: number } | void>({
      query: (params) => ({ url: '/categories/trending', method: 'get', params }),
      providesTags: ['Categories'],
    }),
    getPostCategories: builder.query<PostCategory[], string>({
      query: (postId) => ({ url: `/posts/${postId}/categories`, method: 'get' }),
      providesTags: (result, error, postId) => [
        { type: 'Categories', id: `post-${postId}` },
      ],
    }),
    addCategoryToPost: builder.mutation<PostCategory, { postId: string; categoryId: string }>({
      query: ({ postId, categoryId }) => ({
        url: `/posts/${postId}/categories`,
        method: 'post',
        data: { categoryId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Categories', id: `post-${postId}` },
      ],
    }),
    removeCategoryFromPost: builder.mutation<void, { postId: string; categoryId: string }>({
      query: ({ postId, categoryId }) => ({
        url: `/posts/${postId}/categories/${categoryId}`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Categories', id: `post-${postId}` },
      ],
    }),
    voteOnCategory: builder.mutation<
      void,
      { postCategoryId: string; voteType: 'UPVOTE' | 'DOWNVOTE'; postId: string }
    >({
      query: ({ postCategoryId, voteType }) => ({
        url: `/post-categories/${postCategoryId}/vote`,
        method: 'post',
        data: { voteType },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Categories', id: `post-${postId}` },
      ],
    }),
    getVibes: builder.query<Vibe[], { isActive?: boolean } | void>({
      query: (params) => ({ url: '/vibes', method: 'get', params }),
      providesTags: ['Vibes'],
    }),
    getPostVibes: builder.query<PostVibe[], string>({
      query: (postId) => ({ url: `/posts/${postId}/vibes`, method: 'get' }),
      providesTags: (result, error, postId) => [
        { type: 'Vibes', id: `post-${postId}` },
      ],
    }),
    addVibeToPost: builder.mutation<PostVibe, { postId: string; vibeId: string }>({
      query: ({ postId, vibeId }) => ({
        url: `/posts/${postId}/vibes`,
        method: 'post',
        data: { vibeId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Vibes', id: `post-${postId}` },
      ],
    }),
    removeVibeFromPost: builder.mutation<void, { postId: string; vibeId: string }>({
      query: ({ postId, vibeId }) => ({
        url: `/posts/${postId}/vibes/${vibeId}`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Vibes', id: `post-${postId}` },
      ],
    }),
    voteOnVibe: builder.mutation<
      void,
      { postVibeId: string; voteType: 'UPVOTE' | 'DOWNVOTE'; postId: string }
    >({
      query: ({ postVibeId, voteType }) => ({
        url: `/post-vibes/${postVibeId}/vote`,
        method: 'post',
        data: { voteType },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Vibes', id: `post-${postId}` },
      ],
    }),
    // Posts endpoints
    getFeedPosts: builder.query<
      PostInterface[],
      { following?: boolean; limit?: number; cursor?: string } | void
    >({
      query: (params = {}) => ({
        url: '/posts',
        method: 'get',
        params: { following: true, ...params },
      }),
      providesTags: ['Posts'],
    }),
    getExplorePosts: builder.query<
      PostInterface[],
      { limit?: number; cursor?: string } | void
    >({
      query: (params = {}) => ({
        url: '/posts',
        method: 'get',
        params: { following: false, ...params },
      }),
      providesTags: ['Posts'],
    }),
    getPost: builder.query<PostInterface, string>({
      query: (postId) => ({ url: `/posts/${postId}`, method: 'get' }),
      providesTags: (result, error, postId) => [
        { type: 'Posts', id: postId },
      ],
    }),
    createPost: builder.mutation<PostInterface, CreatePostDto>({
      query: (data) => ({
        url: '/posts',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Posts', 'Feed'],
    }),
    updatePost: builder.mutation<
      PostInterface,
      { postId: string; data: Partial<CreatePostDto> }
    >({
      query: ({ postId, data }) => ({
        url: `/posts/${postId}`,
        method: 'put',
        data,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Posts', id: postId },
        'Posts',
        'Feed',
      ],
    }),
    deletePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: 'delete',
      }),
      invalidatesTags: ['Posts', 'Feed'],
    }),
    likePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: 'post',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Posts', id: postId },
        'Posts',
      ],
    }),
    unlikePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Posts', id: postId },
        'Posts',
      ],
    }),
    // Comments endpoints
    getComments: builder.query<CommentInterface[], string>({
      query: (postId) => ({
        url: `/posts/${postId}/comments`,
        method: 'get',
      }),
      providesTags: (result, error, postId) => [
        { type: 'Comments', id: postId },
      ],
    }),
    createComment: builder.mutation<
      CommentInterface,
      { postId: string; data: CreateCommentDto }
    >({
      query: ({ postId, data }) => ({
        url: `/posts/${postId}/comments`,
        method: 'post',
        data,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comments', id: postId },
        { type: 'Posts', id: postId },
        'Posts',
      ],
    }),
    deleteComment: builder.mutation<
      void,
      { commentId: string; postId: string }
    >({
      query: ({ commentId }) => ({
        url: `/posts/comments/${commentId}`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comments', id: postId },
        { type: 'Posts', id: postId },
        'Posts',
      ],
    }),
    // Users endpoints
    getUserProfile: builder.query<UserInterface, string>({
      query: (userId) => ({ url: `/users/${userId}`, method: 'get' }),
      providesTags: (result, error, userId) => [
        { type: 'Users', id: userId },
      ],
    }),
    getUserPosts: builder.query<
      PostInterface[],
      { userId: string; limit?: number; cursor?: string }
    >({
      query: ({ userId, ...params }) => ({
        url: '/posts',
        method: 'get',
        params: { userId, ...params },
      }),
      providesTags: (result, error, { userId }) => [
        { type: 'Posts', id: `user-${userId}` },
      ],
    }),
    updateProfile: builder.mutation<UserInterface, UpdateUserProfileDto>({
      query: (data) => ({
        url: '/users/me',
        method: 'put',
        data,
      }),
      invalidatesTags: ['Auth', 'Users'],
    }),
    getUsers: builder.query<UserInterface[], { search?: string; limit?: number; offset?: number } | void>({
      query: (params) => ({
        url: '/users',
        method: 'get',
        params,
      }),
      providesTags: ['Users'],
    }),
    getUserLikedPosts: builder.query<PostInterface[], { userId: string; limit?: number }>({
      query: ({ userId, ...params }) => ({
        url: `/users/${userId}/liked-posts`,
        method: 'get',
        params,
      }),
      providesTags: (result, error, { userId }) => [
        { type: 'Posts', id: `user-liked-${userId}` },
      ],
    }),
    // Follow endpoints
    followUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/follow`,
        method: 'post',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Users', id: userId },
        'Users',
        'Auth',
      ],
    }),
    unfollowUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/follow`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Users', id: userId },
        'Users',
        'Auth',
      ],
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useGetUnreadNotificationsCountQuery,
  useGetCategoriesQuery,
  useGetTrendingCategoriesQuery,
  useGetPostCategoriesQuery,
  useAddCategoryToPostMutation,
  useRemoveCategoryFromPostMutation,
  useVoteOnCategoryMutation,
  useGetVibesQuery,
  useGetPostVibesQuery,
  useAddVibeToPostMutation,
  useRemoveVibeFromPostMutation,
  useVoteOnVibeMutation,
  useGetFeedPostsQuery,
  useGetExplorePostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetUserProfileQuery,
  useGetUserPostsQuery,
  useUpdateProfileMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetUsersQuery,
  useGetUserLikedPostsQuery,
} = api


