import { Request, Response, NextFunction } from 'express'
import { uploadImage, uploadAvatar, uploadCover, isCloudinaryConfigured } from '../utils/cloudinary'
import { cleanupFile } from '../middleware/upload.middleware'
import { asyncHandler } from '../middleware/error.middleware'

interface AuthRequest extends Request {
    user?: { userId: string; role?: string }
}

export const uploadController = {
    // Upload post image
    uploadPostImage: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: { message: 'No file uploaded' }
            })
            return
        }

        // Check if Cloudinary is configured
        if (!isCloudinaryConfigured()) {
            cleanupFile(req.file.path)
            res.status(500).json({
                success: false,
                error: { message: 'Upload service not configured' }
            })
            return
        }

        try {
            const result = await uploadImage(req.file, 'mizmiz/posts')
            
            // Cleanup local file
            cleanupFile(req.file.path)

            res.status(200).json({
                success: true,
                data: {
                    url: result.url,
                    publicId: result.publicId,
                    width: result.width,
                    height: result.height
                }
            })
        } catch (error) {
            cleanupFile(req.file.path)
            throw error
        }
    }),

    // Upload avatar
    uploadAvatar: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: { message: 'No file uploaded' }
            })
            return
        }

        if (!isCloudinaryConfigured()) {
            cleanupFile(req.file.path)
            res.status(500).json({
                success: false,
                error: { message: 'Upload service not configured' }
            })
            return
        }

        try {
            const result = await uploadAvatar(req.file)
            
            // Cleanup local file
            cleanupFile(req.file.path)

            res.status(200).json({
                success: true,
                data: {
                    url: result.url,
                    publicId: result.publicId
                }
            })
        } catch (error) {
            cleanupFile(req.file.path)
            throw error
        }
    }),

    // Upload cover photo
    uploadCover: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: { message: 'No file uploaded' }
            })
            return
        }

        if (!isCloudinaryConfigured()) {
            cleanupFile(req.file.path)
            res.status(500).json({
                success: false,
                error: { message: 'Upload service not configured' }
            })
            return
        }

        try {
            const result = await uploadCover(req.file)
            
            // Cleanup local file
            cleanupFile(req.file.path)

            res.status(200).json({
                success: true,
                data: {
                    url: result.url,
                    publicId: result.publicId
                }
            })
        } catch (error) {
            cleanupFile(req.file.path)
            throw error
        }
    })
}

