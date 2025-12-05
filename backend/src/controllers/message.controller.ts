import { Request, Response } from 'express'
import { MessageService } from '../services/message.service'
import { CreateMessageDTO, CreateConversationDTO } from '../interfaces/message.interface'
import { JwtPayload } from '../interfaces/auth.interface'
import { ValidationError, createValidationError } from '../utils/errors'
import { asyncHandler } from '../middleware/error.middleware'

interface AuthRequest extends Request {
  user?: JwtPayload
}

export const messageController = {
  // Get or create a conversation
  getOrCreateConversation: asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const userId = req.user!.userId
      const data: CreateConversationDTO = req.body

      // Validation
      const errors: Record<string, string> = {}
      if (!data.userId) {
        errors.userId = 'User ID is required'
      }

      if (Object.keys(errors).length > 0) {
        throw createValidationError(errors)
      }

      const conversation = await MessageService.getOrCreateConversation(userId, data)
      res.status(200).json({
        success: true,
        data: conversation,
      })
    }
  ),

  // Get all conversations for current user
  getConversations: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId

    const conversations = await MessageService.getConversations(userId)
    res.json({
      success: true,
      data: conversations,
    })
  }),

  // Get a single conversation
  getConversation: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId
    const { conversationId } = req.params

    const conversation = await MessageService.getConversation(userId, conversationId)
    res.json({
      success: true,
      data: conversation,
    })
  }),

  // Get messages for a conversation
  getMessages: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId
    const { conversationId } = req.params
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50
    const cursor = req.query.cursor as string | undefined

    const messages = await MessageService.getMessages(userId, conversationId, limit, cursor)
    res.json({
      success: true,
      data: messages,
    })
  }),

  // Send a message
  sendMessage: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId
    const { conversationId } = req.params
    const data: CreateMessageDTO = req.body

    // Validation
    // Validation
    const errors: Record<string, string> = {}

    const hasContent = data.content && data.content.trim().length > 0
    const hasMedia = !!data.mediaUrl

    if (!hasContent && !hasMedia) {
      errors.content = 'Message must have content or media'
    }

    if (hasContent && data.content!.length > 2000) {
      errors.content = 'Message content cannot exceed 2000 characters'
    }

    if (Object.keys(errors).length > 0) {
      throw createValidationError(errors)
    }

    const message = await MessageService.sendMessage(userId, conversationId, data)
    res.status(201).json({
      success: true,
      data: message,
    })
  }),

  // Mark messages as read
  markMessagesAsRead: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId
    const { conversationId } = req.params

    await MessageService.markMessagesAsRead(userId, conversationId)
    res.json({
      success: true,
      message: 'Messages marked as read',
    })
  }),

  // Delete a message
  deleteMessage: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId
    const { messageId } = req.params

    await MessageService.deleteMessage(userId, messageId)
    res.json({
      success: true,
      message: 'Message deleted',
    })
  }),
}

