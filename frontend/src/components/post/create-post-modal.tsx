'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image, Smile, Hash, Sparkles, Check } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { useCreatePostMutation, useGetCategoriesQuery, useGetVibesQuery } from '@/store/api/api'
import { toast } from 'react-hot-toast'
import { ImageUpload } from '@/components/upload/image-upload'
import { cn } from '@/lib/utils'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated: () => void
}

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { user } = useAppSelector((state) => state.auth)
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showCategorySelect, setShowCategorySelect] = useState(false)
  const [showVibeSelect, setShowVibeSelect] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])

  const [createPost, { isLoading }] = useCreatePostMutation()
  const { data: categories } = useGetCategoriesQuery({ isActive: true })
  const { data: vibes } = useGetVibesQuery({ isActive: true })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Lütfen bir içerik yazın')
      return
    }

    if (content.length > 500) {
      toast.error('Gönderi en fazla 500 karakter olabilir')
      return
    }

    try {
      await createPost({
        content: content.trim(),
        imageUrl: imageUrl || undefined,
        categoryIds: selectedCategories,
        vibeIds: selectedVibes
      }).unwrap()
      toast.success('Gönderi başarıyla oluşturuldu! 🎉')
      resetForm()
      onClose()
      onPostCreated()
    } catch (error: any) {
      toast.error(error.data?.message || 'Gönderi oluşturulamadı')
    }
  }

  function resetForm() {
    setContent('')
    setImageUrl('')
    setShowImageUpload(false)
    setShowCategorySelect(false)
    setShowVibeSelect(false)
    setSelectedCategories([])
    setSelectedVibes([])
  }

  function toggleCategory(id: string) {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  function toggleVibe(id: string) {
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Yeni Gönderi Oluştur</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {user.username[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Ne düşünüyorsun?"
                      className="w-full min-h-[150px] p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl resize-none outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-150"
                      autoFocus
                      maxLength={500}
                    />

                    {/* Image Upload */}
                    {showImageUpload && (
                      <div className="mt-4">
                        <ImageUpload
                          onImageUploaded={(url) => setImageUrl(url)}
                          existingImage={imageUrl}
                          type="post"
                        />
                      </div>
                    )}

                    {/* Categories Selection */}
                    {showCategorySelect && categories && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori Seç (İsteğe bağlı)</p>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(category => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => toggleCategory(category.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                                selectedCategories.includes(category.id)
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                                  : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                              )}
                            >
                              {category.icon} {category.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Vibes Selection */}
                    {showVibeSelect && vibes && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vibe Seç (İsteğe bağlı)</p>
                        <div className="flex flex-wrap gap-2">
                          {vibes.map(vibe => (
                            <button
                              key={vibe.id}
                              type="button"
                              onClick={() => toggleVibe(vibe.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                                selectedVibes.includes(vibe.id)
                                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                  : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                              )}
                            >
                              {vibe.icon} {vibe.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Tools Bar */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <motion.button
                          type="button"
                          onClick={() => setShowImageUpload(!showImageUpload)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "p-2 rounded-lg transition-colors duration-150",
                            showImageUpload
                              ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400"
                          )}
                          title="Resim ekle"
                        >
                          <Image className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={() => setShowCategorySelect(!showCategorySelect)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "p-2 rounded-lg transition-colors duration-150",
                            showCategorySelect || selectedCategories.length > 0
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                          )}
                          title="Kategori ekle"
                        >
                          <Hash className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={() => setShowVibeSelect(!showVibeSelect)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "p-2 rounded-lg transition-colors duration-150",
                            showVibeSelect || selectedVibes.length > 0
                              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                          )}
                          title="Vibe ekle"
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                          title="Emoji ekle (yakında)"
                          disabled
                        >
                          <Smile className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <span
                        className={`text-sm font-medium ${content.length > 450
                          ? 'text-red-600 dark:text-red-400'
                          : content.length > 400
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-600 dark:text-gray-400'
                          }`}
                      >
                        {content.length}/500
                      </span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex-shrink-0">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                  disabled={isLoading}
                >
                  İptal
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  disabled={isLoading || !content.trim() || content.length > 500}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Paylaşılıyor...
                    </span>
                  ) : (
                    'Paylaş'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

