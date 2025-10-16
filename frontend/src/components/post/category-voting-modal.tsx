'use client'

import React, { useState, useEffect } from 'react'
import { X, ThumbsUp, ThumbsDown, Plus } from 'lucide-react'
import { categoriesApi } from '@/lib/api/categories'
import { Category, PostCategory } from '@/interfaces/category.interface'

interface CategoryVotingModalProps {
  postId: string
  isOpen: boolean
  onClose: () => void
}

export function CategoryVotingModal({
  postId,
  isOpen,
  onClose,
}: CategoryVotingModalProps) {
  const [postCategories, setPostCategories] = useState<PostCategory[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCategory, setShowAddCategory] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, postId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [postCats, allCats] = await Promise.all([
        categoriesApi.getPostCategories(postId),
        categoriesApi.getCategories({ isActive: true }),
      ])
      setPostCategories(postCats)
      setAllCategories(allCats)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (
    postCategoryId: string,
    voteType: 'UPVOTE' | 'DOWNVOTE'
  ) => {
    try {
      console.log('Voting on postCategoryId:', postCategoryId, 'voteType:', voteType)
      await categoriesApi.voteOnCategory(postCategoryId, voteType)
      // Refresh data
      const updated = await categoriesApi.getPostCategories(postId)
      setPostCategories(updated)
      // Show success message
      const voteText = voteType === 'UPVOTE' ? '👍 Beğendiniz' : '👎 Beğenmediniz'
      alert(`Oyunuz kaydedildi: ${voteText}`)
    } catch (error) {
      console.error('Failed to vote:', error)
      console.error('Error details:', error.response?.data)
      alert('Oylama sırasında hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleAddCategory = async (categoryId: string) => {
    try {
      await categoriesApi.addCategoryToPost(postId, categoryId)
      const updated = await categoriesApi.getPostCategories(postId)
      setPostCategories(updated)
      setShowAddCategory(false)
      // Show success message
      alert('Kategori başarıyla eklendi! 🎉')
    } catch (error) {
      console.error('Failed to add category:', error)
      alert('Kategori eklenirken hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  if (!isOpen) return null

  // Available categories to add (not already on post)
  const availableCategories = allCategories.filter(
    (cat) => !postCategories.find((pc) => pc.categoryId === cat.id)
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl m-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🏷️ Kategorileri Onayla
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Existing Categories */}
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bu post'un kategorilerini oylayarak doğruluğunu teyit edebilir veya
                  yanlış kategorileri işaretleyebilirsiniz.
                </p>

                {postCategories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Henüz kategori eklenmemiş. İlk kategoriyi sen ekle!
                  </div>
                ) : (
                  postCategories.map((pc) => (
                    <div
                      key={pc.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                    >
                      {/* Category Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-3xl">{pc.category.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {pc.category.name}
                            </h3>
                            {pc.isAISuggested && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                AI Önerisi
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Güven: {(pc.confidence * 100).toFixed(0)}%
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Ağırlık: {pc.weight.toFixed(0)}%
                            </span>
                            <span className="text-xs text-gray-500">
                              {pc.voteCount} oy
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Vote Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(pc.id, 'UPVOTE')}
                          className={`p-2 rounded-lg transition-colors ${pc.userVote === 'UPVOTE'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                          <ThumbsUp className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center text-gray-700 dark:text-gray-300">
                          {pc.upvotes}
                        </span>

                        <button
                          onClick={() => handleVote(pc.id, 'DOWNVOTE')}
                          className={`p-2 rounded-lg transition-colors ${pc.userVote === 'DOWNVOTE'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center text-gray-700 dark:text-gray-300">
                          {pc.downvotes}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Category Section */}
              <div className="mt-6">
                {!showAddCategory ? (
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Başka Kategori Ekle</span>
                  </button>
                ) : (
                  <div className="border-2 border-purple-500 dark:border-purple-600 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Kategori Ekle
                      </h3>
                      <button
                        onClick={() => setShowAddCategory(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        İptal
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {availableCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleAddCategory(cat.id)}
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors text-left"
                          style={{ borderColor: cat.color + '30' }}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>💡 İpucu: Doğru kategorilendirme yaparak rozet kazan!</span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

