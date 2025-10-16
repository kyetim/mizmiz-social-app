'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Trash2 } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { postsApi } from '@/lib/api/posts'
import { toast } from 'react-hot-toast'
import { CommentInterface } from '@/interfaces/post.interface'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  onCommentAdded: () => void
}

export function CommentModal({ isOpen, onClose, postId, onCommentAdded }: CommentModalProps) {
  const { user } = useAppSelector((state) => state.auth)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState<CommentInterface[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadComments()
    }
  }, [isOpen, postId])

  async function loadComments() {
    setIsLoadingComments(true)
    try {
      const data = await postsApi.getComments(postId)
      setComments(data)
    } catch (error) {
      toast.error('Yorumlar yüklenemedi')
    } finally {
      setIsLoadingComments(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Lütfen bir yorum yazın')
      return
    }

    if (content.length > 300) {
      toast.error('Yorum en fazla 300 karakter olabilir')
      return
    }

    setIsLoading(true)

    try {
      const newComment = await postsApi.createComment(postId, { content: content.trim() })
      setComments([newComment, ...comments])
      setContent('')
      toast.success('Yorum eklendi! 💬')
      onCommentAdded()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Yorum eklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

    try {
      await postsApi.deleteComment(commentId)
      setComments(comments.filter((c) => c.id !== commentId))
      toast.success('Yorum silindi')
      onCommentAdded()
    } catch (error) {
      toast.error('Yorum silinemedi')
    }
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
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Yorumlar ({comments.length})
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingComments ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">Henüz yorum yok</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      İlk yorumu sen yap! 💬
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-750 rounded-xl"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {comment.user.username[0].toUpperCase()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {comment.user.firstName && comment.user.lastName
                              ? `${comment.user.firstName} ${comment.user.lastName}`
                              : comment.user.username}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            @{comment.user.username}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">·</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-sm break-words">
                          {comment.content}
                        </p>
                      </div>

                      {/* Delete Button (only for own comments) */}
                      {comment.userId === user.id && (
                        <motion.button
                          onClick={() => handleDeleteComment(comment.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150 self-start"
                          title="Yorumu sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Yorumunu yaz..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-150"
                      maxLength={300}
                      disabled={isLoading}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <span
                        className={`text-xs font-medium ${
                          content.length > 270
                            ? 'text-red-600 dark:text-red-400'
                            : content.length > 250
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-500 dark:text-gray-500'
                        }`}
                      >
                        {content.length}/300
                      </span>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading || !content.trim() || content.length > 300}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center gap-1.5"
                      >
                        {isLoading ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Gönder
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

