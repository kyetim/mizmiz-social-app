import { Router } from 'express'
import authRoutes from './auth.routes'

const router = Router()

// API version and welcome message
router.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Welcome to MIZMIZ API',
        version: '0.1.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            posts: '/api/posts',
            comments: '/api/comments',
            notifications: '/api/notifications'
        }
    })
})

// Mount route modules
router.use('/auth', authRoutes)
// router.use('/users', userRoutes)
// router.use('/posts', postRoutes)
// router.use('/comments', commentRoutes)
// router.use('/notifications', notificationRoutes)

export default router

