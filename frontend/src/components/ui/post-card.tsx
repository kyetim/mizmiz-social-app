'use client'

import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { GlassmorphismCard } from './glassmorphism-card'

interface PostCardProps {
  author: {
    name: string
    username: string
    avatar?: string
  }
  content: string
  timestamp: string
  likes?: number
  comments?: number
  image?: string
}

export function PostCard({
  author,
  content,
  timestamp,
  likes = 0,
  comments = 0,
  image
}: PostCardProps) {
  return (
    <GlassmorphismCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {author.name[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{author.name}</p>
            <p className="text-gray-500 text-xs">@{author.username} · {timestamp}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 leading-relaxed font-normal">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={image}
            alt="Post"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-sm font-medium">{likes}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{comments}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors ml-auto"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </div>
    </GlassmorphismCard>
  )
}

