'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadApi } from '@/lib/api/upload'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  existingImage?: string
  type?: 'post' | 'avatar' | 'cover'
  className?: string
}

export function ImageUpload({ 
  onImageUploaded, 
  existingImage,
  type = 'post',
  className = ''
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(existingImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Sadece resim dosyaları yüklenebilir (JPEG, PNG, GIF, WEBP)')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu en fazla 10MB olabilir')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploading(true)
    try {
      let result
      if (type === 'avatar') {
        result = await uploadApi.uploadAvatar(file)
      } else if (type === 'cover') {
        result = await uploadApi.uploadCover(file)
      } else {
        result = await uploadApi.uploadPostImage(file)
      }

      onImageUploaded(result.url)
      toast.success('Fotoğraf başarıyla yüklendi!')
    } catch (error) {
      toast.error('Fotoğraf yüklenirken bir hata oluştu')
      setPreview(existingImage || null)
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative group"
          >
            <img
              src={preview}
              alt="Preview"
              className={`w-full ${
                type === 'avatar' 
                  ? 'h-64 object-cover rounded-2xl' 
                  : type === 'cover'
                  ? 'h-48 object-cover rounded-xl'
                  : 'max-h-96 object-contain rounded-xl'
              } bg-gray-100 dark:bg-gray-800`}
            />
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Yükleniyor...</p>
                </div>
              </div>
            )}

            {!isUploading && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <motion.button
                  onClick={handleClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
                  title="Değiştir"
                >
                  <Upload className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={handleRemove}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors"
                  title="Kaldır"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="upload"
            onClick={handleClick}
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${
              type === 'cover' ? 'h-48' : 'h-64'
            } border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 transition-colors bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-3 group`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
                {type === 'avatar' 
                  ? 'Profil fotoğrafı yükle' 
                  : type === 'cover'
                  ? 'Kapak fotoğrafı yükle'
                  : 'Fotoğraf ekle'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tıkla veya sürükle bırak
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                JPEG, PNG, GIF, WEBP (Max 10MB)
              </p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

