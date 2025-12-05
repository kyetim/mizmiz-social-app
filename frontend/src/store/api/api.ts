import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import apiClient from '@/lib/api/client'
import type { UserInterface } from '@/interfaces/user.interface'
import type { Category, Vibe, PostVibe, PostCategory } from '@/interfaces/category.interface'
import type { PostInterface, CommentInterface, CreatePostDto, CreateCommentDto } from '@/interfaces/post.interface'
import type { UpdateUserProfileDto } from '@/lib/api/users'
import type { NotificationInterface } from '@/interfaces/notification.interface'
import type { MessageInterface, ConversationInterface, CreateMessageDto, CreateConversationDto } from '@/interfaces/message.interface'

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
  tagTypes: ['Auth', 'Notifications', 'Categories', 'Vibes', 'Feed', 'Posts', 'Comments', 'Users', 'Messages', 'Conversations'],
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
      keepUnusedDataFor: 600, // Cache for 10 minutes
      providesTags: ['Categories'],
    }),
    getTrendingCategories: builder.query<Category[], { limit?: number } | void>({
      query: (params) => ({ url: '/categories/trending', method: 'get', params }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
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
      { following?: boolean; limit?: number; cursor?: string; categoryId?: string; vibeId?: string } | void
    >({
      query: (params = {}) => ({
        url: '/posts',
        method: 'get',
        params: { following: true, ...params },
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts', id: 'LIST' },
            'Feed',
          ]
          : [{ type: 'Posts', id: 'LIST' }, 'Feed'],
    }),
    getExplorePosts: builder.query<
      PostInterface[],
      { limit?: number; cursor?: string; categoryId?: string; vibeId?: string } | void
    >({
      query: (params = {}) => ({
        url: '/posts',
        method: 'get',
        params: { following: false, ...params },
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts', id: 'LIST' },
          ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    searchPosts: builder.query<
      PostInterface[],
      { query: string; limit?: number; offset?: number }
    >({
      query: (params) => ({
        url: '/posts/search',
        method: 'get',
        params,
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts', id: 'LIST' },
          ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getPost: builder.query<PostInterface, string>({
      query: (postId) => ({ url: `/posts/${postId}`, method: 'get' }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
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
      ],
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResultFeed = dispatch(
          api.util.updateQueryData('getFeedPosts', undefined, (draft) => {
            const post = draft.find((p) => p.id === postId)
            if (post) {
              post.isLikedByCurrentUser = true
              post.likesCount += 1
            }
          })
        )
        const patchResultExplore = dispatch(
          api.util.updateQueryData('getExplorePosts', undefined, (draft) => {
            const post = draft.find((p) => p.id === postId)
            if (post) {
              post.isLikedByCurrentUser = true
              post.likesCount += 1
            }
          })
        )
        const patchResultPost = dispatch(
          api.util.updateQueryData('getPost', postId, (draft) => {
            draft.isLikedByCurrentUser = true
            draft.likesCount += 1
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResultFeed.undo()
          patchResultExplore.undo()
          patchResultPost.undo()
        }
      },
    }),
    unlikePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Posts', id: postId },
      ],
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResultFeed = dispatch(
          api.util.updateQueryData('getFeedPosts', undefined, (draft) => {
            const post = draft.find((p) => p.id === postId)
            if (post) {
              post.isLikedByCurrentUser = false
              post.likesCount -= 1
            }
          })
        )
        const patchResultExplore = dispatch(
          api.util.updateQueryData('getExplorePosts', undefined, (draft) => {
            const post = draft.find((p) => p.id === postId)
            if (post) {
              post.isLikedByCurrentUser = false
              post.likesCount -= 1
            }
          })
        )
        const patchResultPost = dispatch(
          api.util.updateQueryData('getPost', postId, (draft) => {
            draft.isLikedByCurrentUser = false
            draft.likesCount -= 1
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResultFeed.undo()
          patchResultExplore.undo()
          patchResultPost.undo()
        }
      },
    }),
    // Comments endpoints
    getComments: builder.query<CommentInterface[], string>({
      query: (postId) => ({
        url: `/posts/${postId}/comments`,
        method: 'get',
      }),
      providesTags: (result, error, postId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Comments' as const, id })),
            { type: 'Comments', id: `LIST-${postId}` },
          ]
          : [{ type: 'Comments', id: `LIST-${postId}` }],
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
      keepUnusedDataFor: 300, // Cache for 5 minutes
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
      keepUnusedDataFor: 300, // Cache for 5 minutes
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
      keepUnusedDataFor: 300, // Cache for 5 minutes
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
      ],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getUserProfile', userId, (draft) => {
            draft.isFollowing = true
            draft.followersCount += 1
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    unfollowUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/follow`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Users', id: userId },
      ],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getUserProfile', userId, (draft) => {
            draft.isFollowing = false
            draft.followersCount -= 1
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    // Notifications endpoints
    getNotifications: builder.query<NotificationInterface[], { limit?: number; offset?: number } | void>({
      query: (params) => ({ url: '/notifications', method: 'get', params }),
      providesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation<NotificationInterface, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'put',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'put',
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'delete',
      }),
      invalidatesTags: ['Notifications'],
    }),
    // Messages endpoints
    getConversations: builder.query<ConversationInterface[], void>({
      query: () => ({ url: '/messages/conversations', method: 'get' }),
      providesTags: ['Conversations'],
    }),
    getOrCreateConversation: builder.mutation<ConversationInterface, CreateConversationDto>({
      query: (data) => ({
        url: '/messages/conversations',
        method: 'post',
        data,
      }),
      invalidatesTags: ['Conversations'],
    }),
    getConversation: builder.query<ConversationInterface, string>({
      query: (conversationId) => ({
        url: `/messages/conversations/${conversationId}`,
        method: 'get',
      }),
      providesTags: (result, error, conversationId) => [
        { type: 'Conversations', id: conversationId },
      ],
    }),
    getMessages: builder.query<
      MessageInterface[],
      { conversationId: string; limit?: number; cursor?: string }
    >({
      query: ({ conversationId, limit, cursor }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: 'get',
        params: { limit, cursor },
      }),
      providesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
      ],
    }),
    sendMessage: builder.mutation<
      MessageInterface,
      { conversationId: string; data: CreateMessageDto }
    >({
      query: ({ conversationId, data }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: 'post',
        data,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        { type: 'Conversations', id: conversationId },
        'Conversations',
      ],
    }),
    markMessagesAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/messages/conversations/${conversationId}/read`,
        method: 'put',
      }),
      invalidatesTags: (result, error, conversationId) => [
        { type: 'Messages', id: conversationId },
        { type: 'Conversations', id: conversationId },
        'Conversations',
      ],
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'delete',
      }),
      invalidatesTags: ['Messages', 'Conversations'],
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
  useSearchPostsQuery,
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
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useGetConversationsQuery,
  useGetOrCreateConversationMutation,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useDeleteMessageMutation,
} = api


