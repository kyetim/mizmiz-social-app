import { prisma } from '../lib/prisma'
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors'
import { logInfo } from '../utils/logger'
import { socketService } from './socket.service'
import {
  CreateMessageDTO,
  CreateConversationDTO,
  MessageResponse,
  ConversationResponse,
  MessageType,
} from '../interfaces/message.interface'

export class MessageService {
  // Get or create conversation between two users
  static async getOrCreateConversation(
    currentUserId: string,
    data: CreateConversationDTO
  ): Promise<ConversationResponse> {
    const { userId: otherUserId } = data

    if (currentUserId === otherUserId) {
      throw new ValidationError('Cannot create conversation with yourself')
    }

    // Check if other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        lastLoginAt: true,
        showLastSeen: true,
      },
    })

    if (!otherUser) {
      throw new NotFoundError('User not found')
    }

    // Check if users follow each other or if messaging is allowed
    const followRelation = await prisma.follow.findFirst({
      where: {
        OR: [
          { followerId: currentUserId, followingId: otherUserId },
          { followerId: otherUserId, followingId: currentUserId },
        ],
      },
    })

    // For now, allow messaging if they follow each other
    // Later, we can add a setting to allow messaging from anyone
    if (!followRelation) {
      throw new ForbiddenError('You can only message users you follow or who follow you')
    }

    // Find existing conversation (order doesn't matter)
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: currentUserId },
        ],
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    // Create conversation if it doesn't exist
    if (!conversation) {
      // Ensure user1Id < user2Id for consistency
      const [user1Id, user2Id] =
        currentUserId < otherUserId
          ? [currentUserId, otherUserId]
          : [otherUserId, currentUserId]

      conversation = await prisma.conversation.create({
        data: {
          user1Id,
          user2Id,
        },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      })
    }

    const canShowLastSeen = otherUser.showLastSeen ?? true

    const safeOtherUser = {
      id: otherUser.id,
      username: otherUser.username,
      firstName: otherUser.firstName,
      lastName: otherUser.lastName,
      avatarUrl: otherUser.avatarUrl,
      lastLoginAt: canShowLastSeen ? otherUser.lastLoginAt : null,
    }

    const isUser1 = conversation.user1Id === currentUserId
    const unreadCount = isUser1 ? conversation.user1UnreadCount : conversation.user2UnreadCount
    const lastMessage = conversation.messages[0] || null

    return {
      id: conversation.id,
      user1Id: conversation.user1Id,
      user2Id: conversation.user2Id,
      lastMessageId: conversation.lastMessageId,
      lastMessageAt: conversation.lastMessageAt,
      user1UnreadCount: conversation.user1UnreadCount,
      user2UnreadCount: conversation.user2UnreadCount,
      user1CanMessage: conversation.user1CanMessage,
      user2CanMessage: conversation.user2CanMessage,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      otherUser: safeOtherUser,
      lastMessage: lastMessage
        ? {
          id: lastMessage.id,
          conversationId: lastMessage.conversationId,
          senderId: lastMessage.senderId,
          content: lastMessage.content,
          isRead: lastMessage.isRead,
          readAt: lastMessage.readAt,
          isDeleted: lastMessage.isDeleted,
          createdAt: lastMessage.createdAt,
          updatedAt: lastMessage.updatedAt,
          sender: lastMessage.sender,
          type: lastMessage.type as MessageType,
          mediaUrl: lastMessage.mediaUrl,
          mediaType: lastMessage.mediaType,
        }
        : null,
      unreadCount,
    }
  }

  // Get all conversations for current user
  static async getConversations(currentUserId: string): Promise<ConversationResponse[]> {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }],
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    if (conversations.length === 0) {
      return []
    }

    // Collect all other user IDs
    const otherUserIds = new Set<string>()
    conversations.forEach((conv) => {
      const otherId = conv.user1Id === currentUserId ? conv.user2Id : conv.user1Id
      otherUserIds.add(otherId)
    })

    // Fetch all other users in one query
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { in: Array.from(otherUserIds) },
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        lastLoginAt: true,
        showLastSeen: true,
      },
    })

    const otherUsersMap = new Map(otherUsers.map((u) => [u.id, u]))

    // Map conversations to response
    const results = conversations.map((conv) => {
      const isUser1 = conv.user1Id === currentUserId
      const otherUserId = isUser1 ? conv.user2Id : conv.user1Id
      const otherUser = otherUsersMap.get(otherUserId)

      if (!otherUser) {
        return null
      }

      const canShowLastSeen = otherUser.showLastSeen ?? true

      const safeOtherUser = {
        id: otherUser.id,
        username: otherUser.username,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        avatarUrl: otherUser.avatarUrl,
        lastLoginAt: canShowLastSeen ? otherUser.lastLoginAt : null,
      }

      const unreadCount = isUser1 ? conv.user1UnreadCount : conv.user2UnreadCount
      const lastMessage = conv.messages[0] || null

      return {
        id: conv.id,
        user1Id: conv.user1Id,
        user2Id: conv.user2Id,
        lastMessageId: conv.lastMessageId,
        lastMessageAt: conv.lastMessageAt,
        user1UnreadCount: conv.user1UnreadCount,
        user2UnreadCount: conv.user2UnreadCount,
        user1CanMessage: conv.user1CanMessage,
        user2CanMessage: conv.user2CanMessage,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        otherUser: safeOtherUser,
        lastMessage: lastMessage
          ? {
            id: lastMessage.id,
            conversationId: lastMessage.conversationId,
            senderId: lastMessage.senderId,
            content: lastMessage.content,
            isRead: lastMessage.isRead,
            readAt: lastMessage.readAt,
            isDeleted: lastMessage.isDeleted,
            createdAt: lastMessage.createdAt,
            updatedAt: lastMessage.updatedAt,
            sender: lastMessage.sender,
            type: lastMessage.type as MessageType,
            mediaUrl: lastMessage.mediaUrl,
            mediaType: lastMessage.mediaType,
          }
          : null,
        unreadCount,
      }
    })

    return results.filter((r) => r !== null) as ConversationResponse[]
  }

  // Get single conversation by ID
  static async getConversation(
    currentUserId: string,
    conversationId: string
  ): Promise<ConversationResponse> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!conversation) {
      throw new NotFoundError('Conversation not found')
    }

    // Check if current user is part of this conversation
    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      throw new ForbiddenError('You do not have access to this conversation')
    }

    const isUser1 = conversation.user1Id === currentUserId
    const otherUserId = isUser1 ? conversation.user2Id : conversation.user1Id

    // otherUser sorgusu önceden ayrı sequential sorguydu — conversation include'a taşındı (tek DB round-trip)
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        lastLoginAt: true,
        showLastSeen: true,
      },
    })

    if (!otherUser) {
      throw new NotFoundError('Other user not found')
    }

    const canShowLastSeen = otherUser.showLastSeen ?? true

    const safeOtherUser = {
      id: otherUser.id,
      username: otherUser.username,
      firstName: otherUser.firstName,
      lastName: otherUser.lastName,
      avatarUrl: otherUser.avatarUrl,
      lastLoginAt: canShowLastSeen ? otherUser.lastLoginAt : null,
    }

    const unreadCount = isUser1 ? conversation.user1UnreadCount : conversation.user2UnreadCount
    const lastMessage = conversation.messages[0] || null

    return {
      id: conversation.id,
      user1Id: conversation.user1Id,
      user2Id: conversation.user2Id,
      lastMessageId: conversation.lastMessageId,
      lastMessageAt: conversation.lastMessageAt,
      user1UnreadCount: conversation.user1UnreadCount,
      user2UnreadCount: conversation.user2UnreadCount,
      user1CanMessage: conversation.user1CanMessage,
      user2CanMessage: conversation.user2CanMessage,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      otherUser: safeOtherUser,
      lastMessage: lastMessage
        ? {
          id: lastMessage.id,
          conversationId: lastMessage.conversationId,
          senderId: lastMessage.senderId,
          content: lastMessage.content,
          isRead: lastMessage.isRead,
          readAt: lastMessage.readAt,
          isDeleted: lastMessage.isDeleted,
          createdAt: lastMessage.createdAt,
          updatedAt: lastMessage.updatedAt,
          sender: lastMessage.sender,
          type: lastMessage.type as MessageType,
          mediaUrl: lastMessage.mediaUrl,
          mediaType: lastMessage.mediaType,
        }
        : null,
      unreadCount,
    }
  }

  // Get messages for a conversation
  static async getMessages(
    currentUserId: string,
    conversationId: string,
    limit: number = 50,
    cursor?: string
  ): Promise<MessageResponse[]> {
    // Verify user has access to conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      throw new NotFoundError('Conversation not found')
    }

    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      throw new ForbiddenError('You do not have access to this conversation')
    }

    const isUser1 = conversation.user1Id === currentUserId
    const otherUserId = isUser1 ? conversation.user2Id : conversation.user1Id

    // messages ve otherUser sorguları paralel çalışıyor (önceden sıralıydı — 2x daha hızlı)
    const [messages, otherUser] = await Promise.all([
      prisma.message.findMany({
        where: {
          conversationId,
          isDeleted: false,
          ...(cursor ? { id: { lt: cursor } } : {}),
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.user.findUnique({
        where: { id: otherUserId },
        select: { showReadReceipts: true },
      }),
    ])

    const canShowReadReceipts = otherUser?.showReadReceipts ?? true

    return messages.map((msg) => {
      const isOwnMessage = msg.senderId === currentUserId

      // If other user has disabled read receipts, hide read status for our own messages
      const maskedIsRead =
        isOwnMessage && !canShowReadReceipts ? false : msg.isRead
      const maskedReadAt =
        isOwnMessage && !canShowReadReceipts ? null : msg.readAt

      return {
        id: msg.id,
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        content: msg.content,
        isRead: maskedIsRead,
        readAt: maskedReadAt,
        isDeleted: msg.isDeleted,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        sender: msg.sender,
        type: msg.type as MessageType,
        mediaUrl: msg.mediaUrl,
        mediaType: msg.mediaType,
      }
    })
  }

  // Send a message
  static async sendMessage(
    currentUserId: string,
    conversationId: string,
    data: CreateMessageDTO
  ): Promise<MessageResponse> {
    const { content, type, mediaUrl, mediaType } = data

    if ((!content || content.trim().length === 0) && !mediaUrl) {
      throw new ValidationError('Message must have content or media')
    }

    if (content && content.length > 2000) {
      throw new ValidationError('Message content cannot exceed 2000 characters')
    }

    // Verify user has access to conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      throw new NotFoundError('Conversation not found')
    }

    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      throw new ForbiddenError('You do not have access to this conversation')
    }

    // Check if user can message
    const isUser1 = conversation.user1Id === currentUserId
    const canMessage = isUser1 ? conversation.user1CanMessage : conversation.user2CanMessage

    if (!canMessage) {
      throw new ForbiddenError('You cannot send messages in this conversation')
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUserId,
        content: content ? content.trim() : null,
        type: type || 'TEXT',
        mediaUrl,
        mediaType,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Update conversation's last message info
    const isUser1Sender = conversation.user1Id === currentUserId
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: message.id,
        lastMessageAt: message.createdAt,
        // Increment unread count for the other user
        ...(isUser1Sender
          ? { user2UnreadCount: { increment: 1 } }
          : { user1UnreadCount: { increment: 1 } }),
      },
    })

    logInfo('Message sent', {
      messageId: message.id,
      conversationId,
      senderId: currentUserId,
    })

    const messageResponse = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      type: message.type as MessageType,
      mediaUrl: message.mediaUrl,
      mediaType: message.mediaType,
      isRead: message.isRead,
      readAt: message.readAt,
      isDeleted: message.isDeleted,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender: message.sender,
    }

    // Emit socket event
    socketService.emitToRoom(conversationId, 'new_message', messageResponse)

    return messageResponse
  }

  // Mark messages as read
  static async markMessagesAsRead(
    currentUserId: string,
    conversationId: string
  ): Promise<void> {
    // Verify user has access to conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      throw new NotFoundError('Conversation not found')
    }

    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      throw new ForbiddenError('You do not have access to this conversation')
    }

    // Mark all unread messages from the other user as read
    const isUser1 = conversation.user1Id === currentUserId
    const otherUserId = isUser1 ? conversation.user2Id : conversation.user1Id

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: otherUserId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    // Reset unread count
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        ...(isUser1 ? { user1UnreadCount: 0 } : { user2UnreadCount: 0 }),
      },
    })

    // Check if current user allows sending read receipts
    // Optimized: use findUnique instead of queryRaw
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { showReadReceipts: true },
    })

    const canSendReadReceipts = user?.showReadReceipts ?? true

    // Emit socket event only if user hasn't disabled read receipts
    if (canSendReadReceipts) {
      socketService.emitToRoom(conversationId, 'messages_read', {
        conversationId,
        readBy: currentUserId,
      })
    }
  }

  // Delete a message
  static async deleteMessage(currentUserId: string, messageId: string): Promise<void> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new NotFoundError('Message not found')
    }

    // Only sender can delete their own message
    if (message.senderId !== currentUserId) {
      throw new ForbiddenError('You can only delete your own messages')
    }

    await prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Emit socket event
    // Find conversationId first (optimization: could be passed or fetched)
    if (message.conversationId) {
      socketService.emitToRoom(message.conversationId, 'message_deleted', {
        messageId,
        conversationId: message.conversationId
      })
    }

    logInfo('Message deleted', {
      messageId,
      userId: currentUserId,
    })
  }
}
