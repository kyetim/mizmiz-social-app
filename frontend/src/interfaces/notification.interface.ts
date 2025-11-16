export interface NotificationInterface {
    id: string
    userId: string
    actorId: string
    type: 'follow' | 'like' | 'comment' | 'mention'
    targetId?: string
    message: string
    isRead: boolean
    createdAt: string
    actor: {
        id: string
        username: string
        firstName?: string
        lastName?: string
        avatarUrl?: string
    }
}

