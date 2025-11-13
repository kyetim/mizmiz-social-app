import { v2 as cloudinary } from 'cloudinary'
import { logInfo, logError } from './logger'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export interface UploadResult {
    url: string
    publicId: string
    width: number
    height: number
    format: string
    resourceType: string
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
    file: Express.Multer.File,
    folder: string = 'mizmiz'
): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: 'auto',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' },
                { width: 2000, crop: 'limit' } // Max width 2000px
            ]
        })

        logInfo('Image uploaded to Cloudinary', {
            publicId: result.public_id,
            url: result.secure_url
        })

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            resourceType: result.resource_type
        }
    } catch (error) {
        logError('Cloudinary upload failed', error)
        throw new Error('Failed to upload image')
    }
}

/**
 * Upload avatar (profile picture)
 */
export async function uploadAvatar(file: Express.Multer.File): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'mizmiz/avatars',
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        })

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            resourceType: result.resource_type
        }
    } catch (error) {
        logError('Avatar upload failed', error)
        throw new Error('Failed to upload avatar')
    }
}

/**
 * Upload cover photo
 */
export async function uploadCover(file: Express.Multer.File): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'mizmiz/covers',
            transformation: [
                { width: 1500, height: 500, crop: 'fill' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        })

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            resourceType: result.resource_type
        }
    } catch (error) {
        logError('Cover photo upload failed', error)
        throw new Error('Failed to upload cover photo')
    }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId)
        logInfo('Image deleted from Cloudinary', { publicId })
    } catch (error) {
        logError('Cloudinary delete failed', error)
        throw new Error('Failed to delete image')
    }
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
    return !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    )
}

export default cloudinary

