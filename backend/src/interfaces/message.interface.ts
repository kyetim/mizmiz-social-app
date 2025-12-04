export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE'
}

export interface CreateMessageDTO {
  content?: string
  type?: MessageType
  mediaUrl?: string
  mediaType?: string
}

export interface MessageResponse {
  id: string
  conversationId: string
  senderId: string
  content: string | null
  type: MessageType
  mediaUrl?: string | null
  mediaType?: string | null
  isRead: boolean
  readAt: Date | null
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  sender: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
}

export interface ConversationResponse {
  id: string
  user1Id: string
  user2Id: string
  lastMessageId: string | null
  lastMessageAt: Date | null
  user1UnreadCount: number
  user2UnreadCount: number
  user1CanMessage: boolean
  user2CanMessage: boolean
  createdAt: Date
  updatedAt: Date
  otherUser: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    lastLoginAt: Date | null
  }
  lastMessage: MessageResponse | null
  unreadCount: number // Current user's unread count
}

export interface CreateConversationDTO {
  userId: string // The user to start conversation with
}

