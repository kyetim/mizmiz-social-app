export interface MessageInterface {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  readAt: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE'
  mediaUrl?: string | null
  mediaType?: string | null
}

export interface ConversationInterface {
  id: string
  user1Id: string
  user2Id: string
  lastMessageId: string | null
  lastMessageAt: string | null
  user1UnreadCount: number
  user2UnreadCount: number
  user1CanMessage: boolean
  user2CanMessage: boolean
  createdAt: string
  updatedAt: string
  otherUser: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    lastLoginAt: string | null
  }
  lastMessage: MessageInterface | null
  unreadCount: number
}

export interface CreateMessageDto {
  content?: string
  type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE'
  mediaUrl?: string
  mediaType?: string
}

export interface CreateConversationDto {
  userId: string
}

