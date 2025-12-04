import apiClient from './client'

export interface UploadResponse {
    url: string
    publicId: string
    width?: number
    height?: number
}

export const uploadApi = {
    /**
     * Upload post image
     */
    async uploadPostImage(file: File): Promise<UploadResponse> {
        const formData = new FormData()
        formData.append('image', file)

        const response = await apiClient.post('/upload/post-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data.data || response.data
    },

    /**
     * Upload avatar (profile picture)
     */
    async uploadAvatar(file: File): Promise<UploadResponse> {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await apiClient.post('/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data.data || response.data
    },

    /**
     * Upload cover photo
     */
    async uploadCover(file: File): Promise<UploadResponse> {
        const formData = new FormData()
        formData.append('cover', file)

        const response = await apiClient.post('/upload/cover', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data.data || response.data
    },

    /**
     * Upload message media
     */
    async uploadMessageMedia(file: File): Promise<UploadResponse> {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post('/upload/message-media', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data.data || response.data
    },
}

