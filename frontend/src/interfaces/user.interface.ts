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
  isFollowing?: boolean // Whether current user is following this user
  isFollowedByCurrentUser?: boolean // Whether current user is following this user (alternative naming)
}

