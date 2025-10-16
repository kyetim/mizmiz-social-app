export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  earned: boolean
  earnedAt?: Date
}

export interface UserGamificationResponse {
  id: string
  userId: string
  totalVotes: number
  accurateVotes: number
  categoryExpertiseScore: number
  badges: Badge[]
  weeklyVotes: number
  weeklyAccuracy: number
  rank: number | null
  createdAt: Date
  updatedAt: Date
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

export interface CategoryBattleResponse {
  id: string
  name: string
  description: string | null
  category1: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  category2: {
    id: string
    name: string
    slug: string
    icon: string
    color: string
  }
  category1Score: number
  category2Score: number
  startDate: Date
  endDate: Date
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
  winnerId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateBattleDTO {
  name: string
  description?: string
  category1Id: string
  category2Id: string
  startDate: Date
  endDate: Date
}

