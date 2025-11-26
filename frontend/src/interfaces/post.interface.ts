import { UserInterface } from './user.interface'
import { PostCategory, PostVibe } from './category.interface'

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
  isAuthorFollowed?: boolean
  postCategories?: PostCategory[]
  postVibes?: PostVibe[]
}

export interface CreatePostDto {
  content: string
  imageUrl?: string
  categoryIds?: string[]
  vibeIds?: string[]
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

