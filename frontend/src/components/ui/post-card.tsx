'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Edit, Tag } from 'lucide-react'
import { GlassmorphismCard } from './glassmorphism-card'
import { ImageLightbox } from './image-lightbox'
import { PostInterface } from '@/interfaces/post.interface'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'react-hot-toast'
import { CommentModal } from '@/components/post/comment-modal'
import { CategoryVotingModal } from '@/components/post/category-voting-modal'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'
import {
  useGetPostCategoriesQuery,
  useGetPostVibesQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useDeletePostMutation,
  useFollowUserMutation,
} from '@/store/api/api'

interface PostCardProps {
  post: PostInterface
  onPostUpdated: () => void
}

export function PostCard({ post, onPostUpdated }: PostCardProps) {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const { following } = useAppSelector((state) => state.follow)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isAuthorFollowed, setIsAuthorFollowed] = useState(
    post.isAuthorFollowed ?? following.includes(post.userId)
  )
  const {
    data: categories = [],
    refetch: refetchPostCategories,
  } = useGetPostCategoriesQuery(post.id)
  const {
    data: vibes = [],
  } = useGetPostVibesQuery(post.id)

  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [deletePost] = useDeletePostMutation()
  const [followUser] = useFollowUserMutation()

  useEffect(() => {
    setIsAuthorFollowed(post.isAuthorFollowed ?? following.includes(post.userId))
  }, [post.isAuthorFollowed, post.userId, following])

  const isOwnPost = user?.id === post.userId

  async function handleFollowUser(event: React.MouseEvent) {
    event.stopPropagation()
    if (!user || isAuthorFollowed || isFollowLoading) return

    setIsFollowLoading(true)
    try {
      await followUser(post.userId).unwrap()
      setIsAuthorFollowed(true)
      toast.success('Takip edildi')
      // RTK Query will automatically invalidate and refetch
    } catch (error: any) {
      toast.error(error.data?.message || 'İşlem başarısız')
    } finally {
      setIsFollowLoading(false)
    }
  }

  async function handleLike() {
    if (!user) return

    try {
      if (post.isLikedByCurrentUser) {
        await unlikePost(post.id).unwrap()
      } else {
        await likePost(post.id).unwrap()
      }
      // RTK Query will automatically invalidate and refetch
    } catch (error: any) {
      toast.error(error.data?.message || 'İşlem başarısız')
    }
  }

  async function handleDelete() {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return

    try {
      await deletePost(post.id).unwrap()
      toast.success('Gönderi silindi')
      onPostUpdated()
      // RTK Query will automatically invalidate and refetch
    } catch (error: any) {
      toast.error(error.data?.message || 'Gönderi silinemedi')
    }
  }

  function handleCommentAdded() {
    // RTK Query will automatically invalidate and refetch
    onPostUpdated()
  }

  function handlePostClick() {
    router.push(`/post/${post.id}`)
  }

  const authorName =
    post.user?.firstName && post.user?.lastName
      ? `${post.user.firstName} ${post.user.lastName}`
      : post.user?.username || 'Kullanıcı'

  return (
    <>
      <div onClick={handlePostClick}>
        <GlassmorphismCard className="cursor-pointer hover:shadow-lg transition-shadow">
          {/* Header */}
          <div className="flex items-center justify-between mb-6" onClick={(e) => e.stopPropagation()}>
            <Link
              href={post.userId ? `/user/${post.userId}` : '#'}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center shadow-sm ring-2 ring-primary/20 overflow-hidden">
                {post.user?.avatarUrl ? (
                  <img
                    src={post.user.avatarUrl}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-base">
                    {authorName[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm hover:underline">{authorName}</p>
                <p className="text-muted-foreground text-xs">
                  @{post.user?.username || 'unknown'} ·{' '}
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: tr })}
                  {post.isEdited && ' · düzenlendi'}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {!isOwnPost && user && (
                isAuthorFollowed ? (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 opacity-70 border border-gray-200 dark:border-gray-700">
                    Takip ediliyor
                  </span>
                ) : (
                  <button
                    onClick={handleFollowUser}
                    disabled={isFollowLoading}
                    className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm hover:opacity-90 disabled:opacity-60 transition-colors"
                  >
                    Takip et
                  </button>
                )
              )}

              {/* Menu */}
              {isOwnPost && (
                <div className="relative">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(!showMenu)
                    }}
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
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete()
                        }}
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
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-foreground leading-relaxed font-normal text-base">
              {post.content}
            </p>
          </div>

          {/* Image */}
          {post.imageUrl && (
            <div
              className="mb-6 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                setIsImageLightboxOpen(true)
              }}
            >
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-auto max-h-[400px] object-cover"
              />
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
          <div className="flex items-center gap-8 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                handleLike()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              disabled={!user}
              className={`flex items-center gap-2 transition-colors duration-200 group ${post.isLikedByCurrentUser
                ? 'text-red-500'
                : 'text-muted-foreground hover:text-red-500'
                }`}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${post.isLikedByCurrentUser ? 'fill-red-500' : 'group-hover:fill-red-500'
                  }`}
              />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                user && setIsCommentModalOpen(true)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              disabled={!user}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </motion.button>

            <motion.button
              onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => {
                  e.stopPropagation()
                  setIsCategoryModalOpen(true)
                }}
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
      </div>

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
          refetchPostCategories()
        }}
        postId={post.id}
      />

      {/* Image Lightbox */}
      {post.imageUrl && (
        <ImageLightbox
          isOpen={isImageLightboxOpen}
          onClose={() => setIsImageLightboxOpen(false)}
          imageUrl={post.imageUrl}
          alt="Post image"
        />
      )}
    </>
  )
}

