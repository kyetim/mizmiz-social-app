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
  user?: UserInterface
}

export interface CreatePostDto {
  content: string
  imageUrl?: string
}

