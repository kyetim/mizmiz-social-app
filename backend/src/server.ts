import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import routes from './routes'
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware'
import { requestLoggerMiddleware } from './middleware/request-logger.middleware'
import { PrismaClient } from '@prisma/client'
import logger, { logInfo, logError } from './utils/logger'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config()

// Initialize Express app
const app: Application = express()
const PORT = process.env.PORT || 5000

// Initialize Prisma Client
export const prisma = new PrismaClient()

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

// Middleware
app.use(helmet()) // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(requestLoggerMiddleware) // Request logging with Winston
app.use(express.json({ limit: '10mb' })) // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })) // Parse URL-encoded bodies

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
app.listen(PORT, () => {
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

