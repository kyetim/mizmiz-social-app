import { Router } from 'express'
import { messageController } from '../controllers/message.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// All message routes require authentication
router.use(authenticate)

// Conversation routes
router.post('/conversations', messageController.getOrCreateConversation)
router.get('/conversations', messageController.getConversations)
router.get('/conversations/:conversationId', messageController.getConversation)

// Message routes
router.get('/conversations/:conversationId/messages', messageController.getMessages)
router.post('/conversations/:conversationId/messages', messageController.sendMessage)
router.put('/conversations/:conversationId/read', messageController.markMessagesAsRead)

// Delete message
router.delete('/messages/:messageId', messageController.deleteMessage)

export default router

