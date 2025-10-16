export interface UserCategoryPreferenceResponse {
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
  createdAt: Date
  updatedAt: Date
}

export interface UserVibePreferenceResponse {
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
  createdAt: Date
  updatedAt: Date
}

export interface UpdateCategoryPreferenceDTO {
  categoryId: string
  weight?: number
  isBlocked?: boolean
}

export interface UpdateVibePreferenceDTO {
  vibeId: string
  isBlocked: boolean
}

export interface FeedMixerSettings {
  categoryPreferences: {
    categoryId: string
    weight: number
  }[]
  blockedCategories: string[]
  blockedVibes: string[]
  mode: 'normal' | 'soft' | 'focus'
}

export interface FeedFilters {
  mode?: 'normal' | 'soft' | 'focus'
  categories?: string[] // Category IDs to filter by
  vibes?: string[] // Vibe IDs to filter by
  limit?: number
  cursor?: string
}

