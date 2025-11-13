import { Router } from 'express'
import { uploadController } from '../controllers/upload.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()

// All upload routes require authentication
router.use(authMiddleware)

// Upload post image
router.post('/post-image', upload.single('image'), uploadController.uploadPostImage)

// Upload avatar
router.post('/avatar', upload.single('avatar'), uploadController.uploadAvatar)

// Upload cover photo
router.post('/cover', upload.single('cover'), uploadController.uploadCover)

export default router

