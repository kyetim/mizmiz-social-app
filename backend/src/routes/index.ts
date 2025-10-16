import { Router } from 'express'
import authRoutes from './auth.routes'
import postRoutes from './post.routes'
import categoryRoutes from './category.routes'
import preferenceRoutes from './preference.routes'
import gamificationRoutes from './gamification.routes'

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
            notifications: '/api/notifications',
            categories: '/api/categories',
            vibes: '/api/vibes',
            preferences: '/api/preferences',
            feed: '/api/feed',
            gamification: '/api/gamification'
        }
    })
})

// Mount route modules
router.use('/auth', authRoutes)
router.use('/posts', postRoutes)
router.use('/', categoryRoutes) // Category routes are at root level
router.use('/', preferenceRoutes) // Preference and feed routes
router.use('/', gamificationRoutes) // Gamification routes
// router.use('/users', userRoutes)
// router.use('/comments', commentRoutes)
// router.use('/notifications', notificationRoutes)

export default router

