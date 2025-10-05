export interface UserInterface {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  bio?: string
  avatarUrl?: string
  coverImageUrl?: string
  location?: string
  website?: string
  isVerified: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  createdAt: string
}

