import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import routes from './routes'
import { errorMiddleware } from './middleware/error.middleware'
import { PrismaClient } from '@prisma/client'

// Load environment variables
dotenv.config()

// Initialize Express app
const app: Application = express()
const PORT = process.env.PORT || 5000

// Initialize Prisma Client
export const prisma = new PrismaClient()

// Middleware
app.use(helmet()) // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(morgan('dev')) // Logging
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

// API Routes
app.use('/api', routes)

// 404 Handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    })
})

// Error handling middleware (must be last)
app.use(errorMiddleware)

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...')
    await prisma.$disconnect()
    process.exit(0)
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`📚 Health check: http://localhost:${PORT}/health`)
})

export default app

