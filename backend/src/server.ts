import express, { Application, Request, Response } from 'express'
import { createServer } from 'http'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import routes from './routes'
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware'
import { requestLoggerMiddleware } from './middleware/request-logger.middleware'
import { generalRateLimiter } from './middleware/rate-limit.middleware'
import { PrismaClient } from '@prisma/client'
import logger, { logInfo, logError } from './utils/logger'
import { securityConfig } from './config/security.config'
import fs from 'fs'
import path from 'path'
import { socketService } from './services/socket.service'

// Load environment variables
dotenv.config()

// Initialize Express app
const app: Application = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

// Initialize Socket.io
socketService.initialize(httpServer)

// Initialize Prisma Client
export const prisma = new PrismaClient()

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

// Trust proxy (for rate limiting and IP detection behind reverse proxy)
app.set('trust proxy', 1)

// Middleware

// Advanced Helmet configuration for enhanced security
app.use(helmet(securityConfig.helmet))

// CORS Configuration with credentials support
app.use(cors(securityConfig.cors))

// Cookie parser for httpOnly cookies
app.use(cookieParser())

// Request logging
app.use(requestLoggerMiddleware)

// General rate limiting (applies to all routes)
app.use(generalRateLimiter)

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'MIZMIZ Backend is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    })
})

// Root endpoint - friendly message for browser visits
app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to MIZMIZ API Server',
        version: '0.1.0',
        documentation: {
            health: '/health',
            api: '/api',
            endpoints: 'Visit /api for available endpoints'
        }
    })
})

// API Routes
app.use('/api', routes)

// 404 Handler - Must be before error middleware
app.use(notFoundMiddleware)

// Error handling middleware (must be last)
app.use(errorMiddleware)

// Graceful shutdown
process.on('SIGINT', async () => {
    logInfo('Shutting down gracefully...')
    await prisma.$disconnect()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    logInfo('SIGTERM received, shutting down gracefully...')
    await prisma.$disconnect()
    process.exit(0)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logError('Uncaught Exception:', error)
    process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
    logError('Unhandled Rejection:', reason)
    process.exit(1)
})

// Start server
httpServer.listen(PORT, () => {
    logInfo(`Server started on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
    })
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`📚 Health check: http://localhost:${PORT}/health`)
    console.log(`📝 Logs directory: ${logsDir}\n`)
})

export default app

// Backend restart trigger

