import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { verifyAccessToken } from '../utils/jwt'
import { logInfo, logError } from '../utils/logger'
import { securityConfig } from '../config/security.config'
import cookie from 'cookie'

interface AuthSocket extends Socket {
  user?: {
    userId: string
    role?: string
  }
}

class SocketService {
  private static instance: SocketService
  private io: Server | null = null
  private userSockets: Map<string, string[]> = new Map() // userId -> socketIds[]

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  public initialize(httpServer: HttpServer): void {
    this.io = new Server(httpServer, {
      cors: {
        origin: securityConfig.cors.origin,
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
    })

    // Authentication Middleware
    this.io.use((socket: AuthSocket, next) => {
      try {
        let token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.split(' ')[1]

        // Check cookies if no token found
        if (!token && socket.handshake.headers.cookie) {
          const cookies = cookie.parse(socket.handshake.headers.cookie)
          token = cookies[securityConfig.cookie.accessToken.name]
        }

        if (!token) {
          return next(new Error('Authentication error: No token provided'))
        }

        const decoded = verifyAccessToken(token)
        socket.user = decoded
        next()
      } catch (err) {
        next(new Error('Authentication error: Invalid token'))
      }
    })

    this.io.on('connection', (socket: AuthSocket) => {
      const userId = socket.user?.userId
      
      if (userId) {
        logInfo(`User connected to socket: ${userId}`)
        
        // Add socket to user's list
        const userSocketIds = this.userSockets.get(userId) || []
        this.userSockets.set(userId, [...userSocketIds, socket.id])

        // Join a room with their own user ID for direct user events
        socket.join(userId)

        // Handle user going online (could emit to friends)
        this.io?.emit('user_online', { userId })

        socket.on('join_conversation', (conversationId: string) => {
          socket.join(conversationId)
          logInfo(`User ${userId} joined conversation ${conversationId}`)
        })

        socket.on('leave_conversation', (conversationId: string) => {
          socket.leave(conversationId)
          logInfo(`User ${userId} left conversation ${conversationId}`)
        })

        socket.on('typing_start', ({ conversationId }: { conversationId: string }) => {
          socket.to(conversationId).emit('typing_started', {
            conversationId,
            userId,
          })
        })

        socket.on('typing_stop', ({ conversationId }: { conversationId: string }) => {
          socket.to(conversationId).emit('typing_stopped', {
            conversationId,
            userId,
          })
        })

        socket.on('disconnect', () => {
          logInfo(`User disconnected from socket: ${userId}`)
          
          // Remove socket from user's list
          const currentSockets = this.userSockets.get(userId) || []
          const updatedSockets = currentSockets.filter(id => id !== socket.id)
          
          if (updatedSockets.length === 0) {
            this.userSockets.delete(userId)
            // Handle user going offline
            this.io?.emit('user_offline', { userId, lastSeen: new Date() })
          } else {
            this.userSockets.set(userId, updatedSockets)
          }
        })
      }
    })
  }

  public emitToUser(userId: string, event: string, data: any): void {
    this.io?.to(userId).emit(event, data)
  }

  public emitToRoom(roomId: string, event: string, data: any): void {
    this.io?.to(roomId).emit(event, data)
  }
  
  public getIO(): Server | null {
    return this.io
  }
}

export const socketService = SocketService.getInstance()

