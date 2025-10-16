export interface CreatePostDTO {
  content: string
  imageUrl?: string
}

export interface UpdatePostDTO {
  content?: string
  imageUrl?: string
}

export interface PostResponse {
  id: string
  userId: string
  content: string
  imageUrl: string | null
  likesCount: number
  commentsCount: number
  sharesCount: number
  isEdited: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
  isLikedByCurrentUser?: boolean
}

export interface CommentResponse {
  id: string
  postId: string
  userId: string
  content: string
  likesCount: number
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
}

export interface CreateCommentDTO {
  content: string
}

export interface PostFilters {
  userId?: string
  following?: boolean
  limit?: number
  cursor?: string
}

