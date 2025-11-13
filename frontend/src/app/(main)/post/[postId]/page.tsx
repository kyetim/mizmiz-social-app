'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Trash2,
    Tag,
    Calendar
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { postsApi } from '@/lib/api/posts'
import { categoriesApi } from '@/lib/api/categories'
import { vibesApi } from '@/lib/api/vibes'
import { PostInterface, CommentInterface } from '@/interfaces/post.interface'
import { PostCategory, PostVibe } from '@/interfaces/category.interface'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function PostDetailPage() {
    const router = useRouter()
    const params = useParams()
    const postId = params.postId as string
    const { user } = useAppSelector((state) => state.auth)

    const [post, setPost] = useState<PostInterface | null>(null)
    const [comments, setComments] = useState<CommentInterface[]>([])
    const [categories, setCategories] = useState<PostCategory[]>([])
    const [vibes, setVibes] = useState<PostVibe[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [commentsCount, setCommentsCount] = useState(0)
    const [isLiking, setIsLiking] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
            return
        }
        if (postId) {
            loadPostDetails()
        }
    }, [router, postId])

    async function loadPostDetails() {
        setIsLoading(true)
        try {
            // Load post, comments, categories, and vibes in parallel
            const [postData, commentsData, categoriesData, vibesData] = await Promise.all([
                postsApi.getPost(postId),
                postsApi.getComments(postId),
                categoriesApi.getPostCategories(postId),
                vibesApi.getPostVibes(postId)
            ])

            setPost(postData)
            setComments(commentsData)
            setCategories(categoriesData)
            setVibes(vibesData)
            setIsLiked(postData.isLikedByCurrentUser || false)
            setLikesCount(postData.likesCount)
            setCommentsCount(postData.commentsCount)
        } catch (error) {
            toast.error('Post yüklenemedi')
            console.error('Load post error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleLike() {
        if (!user || !post || isLiking) return

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
        if (!post || !confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return

        try {
            await postsApi.deletePost(post.id)
            toast.success('Gönderi silindi')
            router.push('/feed')
        } catch (error) {
            toast.error('Gönderi silinemedi')
        }
    }

    async function handleSubmitComment(e: React.FormEvent) {
        e.preventDefault()

        if (!commentContent.trim()) {
            toast.error('Lütfen bir yorum yazın')
            return
        }

        if (commentContent.length > 300) {
            toast.error('Yorum en fazla 300 karakter olabilir')
            return
        }

        setIsSubmittingComment(true)

        try {
            const newComment = await postsApi.createComment(postId, { content: commentContent.trim() })
            setComments([newComment, ...comments])
            setCommentsCount(commentsCount + 1)
            setCommentContent('')
            toast.success('Yorum eklendi! 💬')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Yorum eklenemedi')
        } finally {
            setIsSubmittingComment(false)
        }
    }

    async function handleDeleteComment(commentId: string) {
        if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

        try {
            await postsApi.deleteComment(commentId)
            setComments(comments.filter((c) => c.id !== commentId))
            setCommentsCount(commentsCount - 1)
            toast.success('Yorum silindi')
        } catch (error) {
            toast.error('Yorum silinemedi')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (!post || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Post bulunamadı</p>
                    <Link href="/feed">
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                            Ana Sayfaya Dön
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    const authorName = post.user?.firstName && post.user?.lastName
        ? `${post.user.firstName} ${post.user.lastName}`
        : post.user?.username || 'Kullanıcı'

    const isOwnPost = user?.id === post.userId

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Gönderi</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {authorName} tarafından
                                </p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-12 px-4 sm:px-6">
                <div className="container mx-auto max-w-3xl">
                    {/* Post */}
                    <GlassmorphismCard>
                        {/* Author Header */}
                        <div className="flex items-center justify-between mb-6">
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
                                        @{post.user?.username || 'unknown'}
                                    </p>
                                </div>
                            </Link>

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

                        {/* Post Date */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: tr })}
                                {post.isEdited && ' · düzenlendi'}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <p className="text-foreground leading-relaxed text-lg">
                                {post.content}
                            </p>
                        </div>

                        {/* Image */}
                        {post.imageUrl && (
                            <div
                                className="mb-6 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => setIsImageLightboxOpen(true)}
                            >
                                <img
                                    src={post.imageUrl}
                                    alt="Post"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Categories and Vibes */}
                        {(categories.length > 0 || vibes.length > 0) && (
                            <div className="mb-6 space-y-2">
                                {/* Categories */}
                                {categories.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {categories.slice(0, 5).map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                                                style={{ borderColor: cat.category.color + '40' }}
                                            >
                                                <span>{cat.category.icon}</span>
                                                <span>{cat.category.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Vibes */}
                                {vibes.length > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        {vibes.slice(0, 6).map((vibe) => (
                                            <span key={vibe.id} className="text-lg" title={vibe.vibe.name}>
                                                {vibe.vibe.icon}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-6 py-4 border-y border-border text-sm">
                            <div>
                                <span className="font-bold text-foreground">{likesCount}</span>
                                <span className="text-muted-foreground ml-1">Beğeni</span>
                            </div>
                            <div>
                                <span className="font-bold text-foreground">{commentsCount}</span>
                                <span className="text-muted-foreground ml-1">Yorum</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-8 pt-4">
                            <motion.button
                                onClick={handleLike}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={isLiking}
                                className={`flex items-center gap-2 transition-colors duration-200 group ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500' : 'group-hover:fill-red-500'}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                            >
                                <MessageCircle className="w-6 h-6" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                                title="Paylaş (yakında)"
                            >
                                <Share2 className="w-6 h-6" />
                            </motion.button>
                        </div>
                    </GlassmorphismCard>

                    {/* Add Comment */}
                    {user && (
                        <GlassmorphismCard className="mt-4">
                            <form onSubmit={handleSubmitComment}>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {user.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-semibold text-sm">
                                                {user.username[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder="Yorumunuzu yazın..."
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                                            rows={3}
                                            maxLength={300}
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">
                                                {commentContent.length}/300
                                            </span>
                                            <motion.button
                                                type="submit"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                disabled={isSubmittingComment || !commentContent.trim()}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmittingComment ? 'Gönderiliyor...' : 'Yorum Yap'}
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </GlassmorphismCard>
                    )}

                    {/* Comments */}
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Yorumlar ({comments.length})
                        </h2>

                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <GlassmorphismCard key={comment.id}>
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/user/${comment.userId}`}
                                            className="flex-shrink-0"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center overflow-hidden">
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

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
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
                                                    className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                                                >
                                                    @{comment.user.username}
                                                </Link>
                                                <span className="text-xs text-gray-400">·</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDistanceToNow(new Date(comment.createdAt), {
                                                        addSuffix: true,
                                                        locale: tr,
                                                    })}
                                                </span>
                                            </div>

                                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed break-words">
                                                {comment.content}
                                            </p>

                                            {user?.id === comment.userId && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="mt-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Sil
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </GlassmorphismCard>
                            ))
                        ) : (
                            <GlassmorphismCard>
                                <div className="text-center py-8">
                                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Henüz yorum yok. İlk yorumu siz yapın!
                                    </p>
                                </div>
                            </GlassmorphismCard>
                        )}
                    </div>
                </div>
            </main>

            {/* Image Lightbox */}
            {post.imageUrl && (
                <ImageLightbox
                    isOpen={isImageLightboxOpen}
                    onClose={() => setIsImageLightboxOpen(false)}
                    imageUrl={post.imageUrl}
                    alt="Post image"
                />
            )}
        </div>
    )
}

