'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Edit, Tag } from 'lucide-react'
import { GlassmorphismCard } from './glassmorphism-card'
import { PostInterface } from '@/interfaces/post.interface'
import { postsApi } from '@/lib/api/posts'
import { categoriesApi } from '@/lib/api/categories'
import { vibesApi } from '@/lib/api/vibes'
import { PostCategory, PostVibe } from '@/interfaces/category.interface'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'react-hot-toast'
import { CommentModal } from '@/components/post/comment-modal'
import { CategoryVotingModal } from '@/components/post/category-voting-modal'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface PostCardProps {
  post: PostInterface
  onPostUpdated: () => void
}

export function PostCard({ post, onPostUpdated }: PostCardProps) {
  const { user } = useAppSelector((state) => state.auth)
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [commentsCount, setCommentsCount] = useState(post.commentsCount)
  const [isLiking, setIsLiking] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [categories, setCategories] = useState<PostCategory[]>([])
  const [vibes, setVibes] = useState<PostVibe[]>([])

  useEffect(() => {
    loadCategoriesAndVibes()
  }, [post.id])

  async function loadCategoriesAndVibes() {
    try {
      const [cats, vbs] = await Promise.all([
        categoriesApi.getPostCategories(post.id),
        vibesApi.getPostVibes(post.id),
      ])
      setCategories(cats)
      setVibes(vbs)
    } catch (error) {
      console.error('Failed to load categories/vibes:', error)
    }
  }

  const isOwnPost = user?.id === post.userId

  async function handleLike() {
    if (!user || isLiking) return

    setIsLiking(true)
    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    try {
      if (isLiked) {
        await postsApi.unlikePost(post.id)
      } else {
        await postsApi.likePost(post.id)
      }
    } catch (error: any) {
      // Revert on error
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
      toast.error(error.response?.data?.message || 'İşlem başarısız')
    } finally {
      setIsLiking(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return

    try {
      await postsApi.deletePost(post.id)
      toast.success('Gönderi silindi')
      onPostUpdated()
    } catch (error) {
      toast.error('Gönderi silinemedi')
    }
  }

  function handleCommentAdded() {
    setCommentsCount(commentsCount + 1)
    onPostUpdated()
  }

  const authorName =
    post.user?.firstName && post.user?.lastName
      ? `${post.user.firstName} ${post.user.lastName}`
      : post.user?.username || 'Kullanıcı'

  return (
    <>
      <GlassmorphismCard>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center shadow-sm ring-2 ring-primary/20">
              <span className="text-white font-semibold text-base">
                {authorName[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{authorName}</p>
              <p className="text-muted-foreground text-xs">
                @{post.user?.username || 'unknown'} ·{' '}
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: tr })}
                {post.isEdited && ' · düzenlendi'}
              </p>
            </div>
          </div>

          {/* Menu */}
          {isOwnPost && (
            <div className="relative">
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </motion.button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                >
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Sil
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-foreground leading-relaxed font-normal text-base">
            {post.content}
          </p>
        </div>

        {/* Image */}
        {post.imageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden">
            <img src={post.imageUrl} alt="Post" className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Categories and Vibes */}
        {(categories.length > 0 || vibes.length > 0) && (
          <div className="mb-4 space-y-2">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {categories.slice(0, 3).map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    style={{ borderColor: cat.category.color + '40' }}
                    title={`${cat.category.name} - Güven: ${(cat.confidence * 100).toFixed(0)}%`}
                  >
                    <span>{cat.category.icon}</span>
                    <span>{cat.category.name}</span>
                    {cat.weight > 20 && (
                      <span className="text-xs opacity-75">{cat.weight.toFixed(0)}%</span>
                    )}
                  </span>
                ))}
                {categories.length > 3 && (
                  <span className="text-xs text-gray-500">+{categories.length - 3}</span>
                )}
              </div>
            )}

            {/* Vibes */}
            {vibes.length > 0 && (
              <div className="flex items-center gap-1.5">
                {vibes.slice(0, 4).map((vibe) => (
                  <span
                    key={vibe.id}
                    className="text-lg"
                    title={`${vibe.vibe.name} - ${(vibe.confidence * 100).toFixed(0)}%`}
                  >
                    {vibe.vibe.icon}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-8 pt-4 border-t border-border">
          <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            disabled={isLiking || !user}
            className={`flex items-center gap-2 transition-colors duration-200 group ${isLiked
              ? 'text-destructive'
              : 'text-muted-foreground hover:text-destructive'
              }`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'fill-current' : 'group-hover:fill-current'
                }`}
            />
            <span className="text-sm font-medium">{likesCount}</span>
          </motion.button>

          <motion.button
            onClick={() => user && setIsCommentModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            disabled={!user}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
            title="Paylaş (yakında)"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>

          {/* Category Voting Button */}
          {user && (
            <motion.button
              onClick={() => setIsCategoryModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-200 ml-auto"
              title="Kategorileri Onayla"
            >
              <Tag className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </GlassmorphismCard>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={post.id}
        onCommentAdded={handleCommentAdded}
      />

      {/* Category Voting Modal */}
      <CategoryVotingModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false)
          loadCategoriesAndVibes()
        }}
        postId={post.id}
      />
    </>
  )
}

