export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  description: string | null
  type: 'STANDARD' | 'TEMPORAL' | 'TRENDING' | 'EVENT'
  isActive: boolean
  startDate: string | null
  endDate: string | null
  postsCount: number
  votesCount: number
  createdAt: string
  updatedAt: string
}

export interface Vibe {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  description: string | null
  isActive: boolean
  postsCount: number
  createdAt: string
  updatedAt: string
}

export interface PostCategory {
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

export interface PostVibe {
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

export interface UserCategoryPreference {
  id: string
  userId: string
  categoryId: string
  weight: number
  isBlocked: boolean
  category: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  createdAt: string
  updatedAt: string
}

export interface UserVibePreference {
  id: string
  userId: string
  vibeId: string
  isBlocked: boolean
  vibe: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  createdAt: string
  updatedAt: string
}

export interface UserGamification {
  id: string
  userId: string
  totalVotes: number
  accurateVotes: number
  categoryExpertiseScore: number
  badges: Badge[]
  weeklyVotes: number
  weeklyAccuracy: number
  rank: number | null
  createdAt: string
  updatedAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  earned: boolean
  earnedAt?: string
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatarUrl: string | null
  categoryExpertiseScore: number
  totalVotes: number
  accurateVotes: number
  rank: number
  badges: Badge[]
}

