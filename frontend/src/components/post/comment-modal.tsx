'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Trash2, MessageCircle, Heart } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { postsApi } from '@/lib/api/posts'
import { toast } from 'react-hot-toast'
import { CommentInterface } from '@/interfaces/post.interface'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'

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
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-xl shadow-lg shadow-green-500/30">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Yorumlar
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {comments.length} yorum
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-150 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50 dark:bg-gray-900">
                {isLoadingComments ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Yorumlar yükleniyor...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Henüz yorum yok
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      İlk yorumu sen yap ve konuşmayı başlat! 💬
                    </p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex gap-3">
                        {/* Avatar with online indicator */}
                        <Link 
                          href={`/user/${comment.userId}`}
                          className="relative flex-shrink-0 hover:opacity-80 transition-opacity"
                        >
                          <div className="w-11 h-11 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-800 overflow-hidden">
                            {comment.user.avatarUrl ? (
                              <img 
                                src={comment.user.avatarUrl} 
                                alt={comment.user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold text-sm">
                                {comment.user.username[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* User Info */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Link 
                              href={`/user/${comment.userId}`}
                              className="font-bold text-gray-900 dark:text-white text-sm hover:underline"
                            >
                              {comment.user.firstName && comment.user.lastName
                                ? `${comment.user.firstName} ${comment.user.lastName}`
                                : comment.user.username}
                            </Link>
                            <Link 
                              href={`/user/${comment.userId}`}
                              className="text-xs text-gray-500 dark:text-gray-400 font-medium hover:underline"
                            >
                              @{comment.user.username}
                            </Link>
                            <span className="text-xs text-gray-400 dark:text-gray-500">·</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                                locale: tr,
                              })}
                            </span>
                          </div>

                          {/* Comment Text */}
                          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed break-words">
                            {comment.content}
                          </p>

                          {/* Interaction buttons */}
                          <div className="flex items-center gap-4 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xs font-medium"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>{comment.likesCount || 0}</span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Delete Button (only for own comments) */}
                        {comment.userId === user.id && (
                          <motion.button
                            onClick={() => handleDeleteComment(comment.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150"
                            title="Yorumu sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form
                onSubmit={handleSubmit}
                className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white dark:ring-gray-800">
                    <span className="text-white font-bold text-sm">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Yorumunu paylaş..."
                        className="w-full px-4 py-3.5 pr-24 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-150 text-sm"
                        maxLength={300}
                        disabled={isLoading}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading || !content.trim() || content.length > 300}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-150 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span className="hidden sm:inline">Gönderiliyor...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Gönder</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-between mt-2 px-1">
                      <span
                        className={`text-xs font-semibold transition-colors ${
                          content.length > 270
                            ? 'text-red-600 dark:text-red-400'
                            : content.length > 250
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {content.length > 0 && `${content.length}/300 karakter`}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Enter ile gönder
                      </span>
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

