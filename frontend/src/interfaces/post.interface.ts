import { UserInterface } from './user.interface'

export interface PostInterface {
  id: string
  userId: string
  content: string
  imageUrl?: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  isEdited: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
  isLikedByCurrentUser?: boolean
}

export interface CreatePostDto {
  content: string
  imageUrl?: string
}

export interface CommentInterface {
  id: string
  postId: string
  userId: string
  content: string
  likesCount: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
}

export interface CreateCommentDto {
  content: string
}

