'use client'

import { motion } from 'framer-motion'
import { Check, CheckCheck } from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { MessageInterface } from '@/interfaces/message.interface'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: MessageInterface
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  if (message.isDeleted) {
    return (
      <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
        <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm italic">
          Bu mesaj silindi
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className={cn('flex gap-3 max-w-[90%] lg:max-w-[70%] xl:max-w-[60%]', isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto')}
    >
      {!isOwn && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg shadow-cyan-500/40 ring-2 ring-white/10 relative">
          {message.sender.avatarUrl ? (
            <Image
              src={message.sender.avatarUrl}
              alt={message.sender.username}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <span className="text-white text-xs font-semibold">
              {message.sender.username[0].toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div className={cn('flex flex-col gap-1', isOwn ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-5 py-4 rounded-[28px] backdrop-blur-lg border text-sm lg:text-base leading-relaxed',
            isOwn
              ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white border-transparent shadow-[0_10px_35px_rgba(34,211,238,0.25)]'
              : 'bg-white text-slate-900 border-black/5 shadow-[0_20px_60px_rgba(15,23,42,0.15)] dark:bg-white/10 dark:text-white/90 dark:border-white/10 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]'
          )}
        >
          {message.mediaUrl && (
            <div className="mb-2 rounded-xl overflow-hidden relative min-w-[200px]">
              {message.type === 'IMAGE' ? (
                <Image
                  src={message.mediaUrl}
                  alt="Media"
                  width={500}
                  height={300}
                  className="w-auto h-auto max-h-[300px] object-cover"
                />
              ) : message.type === 'VIDEO' ? (
                <video
                  src={message.mediaUrl}
                  controls
                  className="max-w-full h-auto max-h-[300px]"
                />
              ) : (
                <a
                  href={message.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-black/10 dark:bg-white/10 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                >
                  <span className="underline">Dosyayı Görüntüle</span>
                </a>
              )}
            </div>
          )}
          <p className="whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        <div
          className={cn(
            'flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-slate-400 dark:text-white/40',
            isOwn ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <span>
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
              locale: tr,
            })}
          </span>
          {isOwn && (
            <div className="flex items-center">
              {message.isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Check className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

