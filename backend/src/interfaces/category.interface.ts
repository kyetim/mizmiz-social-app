import { CategoryType } from '@prisma/client'

export interface CategoryResponse {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  description: string | null
  type: CategoryType
  isActive: boolean
  startDate: Date | null
  endDate: Date | null
  postsCount: number
  votesCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryDTO {
  name: string
  slug: string
  icon: string
  color: string
  description?: string
  type?: CategoryType
  startDate?: Date
  endDate?: Date
}

export interface UpdateCategoryDTO {
  name?: string
  slug?: string
  icon?: string
  color?: string
  description?: string
  type?: CategoryType
  isActive?: boolean
  startDate?: Date
  endDate?: Date
}

export interface VibeResponse {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  description: string | null
  isActive: boolean
  postsCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateVibeDTO {
  name: string
  slug: string
  icon: string
  color: string
  description?: string
}

export interface UpdateVibeDTO {
  name?: string
  slug?: string
  icon?: string
  color?: string
  description?: string
  isActive?: boolean
}

export interface PostCategoryResponse {
  id: string
  postId: string
  categoryId: string
  voteCount: number
  upvotes: number
  downvotes: number
  confidence: number
  weight: number
  isAISuggested: boolean
  category: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  userVote?: 'UPVOTE' | 'DOWNVOTE' | null
}

export interface PostVibeResponse {
  id: string
  postId: string
  vibeId: string
  voteCount: number
  upvotes: number
  downvotes: number
  confidence: number
  weight: number
  isAISuggested: boolean
  vibe: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  userVote?: 'UPVOTE' | 'DOWNVOTE' | null
}

export interface AddCategoryToPostDTO {
  categoryId: string
  isAISuggested?: boolean
}

export interface AddVibeToPostDTO {
  vibeId: string
  isAISuggested?: boolean
}

export interface VoteDTO {
  voteType: 'UPVOTE' | 'DOWNVOTE'
}

