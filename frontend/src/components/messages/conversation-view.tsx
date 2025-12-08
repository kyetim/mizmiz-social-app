'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Search, User, Video } from 'lucide-react'
import Image from 'next/image'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { ConversationInterface, MessageInterface } from '@/interfaces/message.interface'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

import { uploadApi } from '@/lib/api/upload'
import { toast } from 'react-hot-toast'

interface ConversationViewProps {
  conversation: ConversationInterface
  messages: MessageInterface[]
  currentUserId: string
  isLoading?: boolean
  onSendMessage: (content: string, media?: { url: string; type: 'IMAGE' | 'VIDEO' | 'FILE'; mimeType: string }) => void
  onBack?: () => void
  isSending?: boolean
}

export function ConversationView({
  conversation,
  messages,
  currentUserId,
  isLoading = false,
  onSendMessage,
  onBack,
  isSending = false,
}: ConversationViewProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Auto-scroll to bottom when sending a new message
  useEffect(() => {
    if (isSending) {
      virtuosoRef.current?.scrollToIndex({ index: messages.length - 1, behavior: 'smooth' })
    }
  }, [isSending, messages.length])

  const isOnline = conversation.otherUser.lastLoginAt
    ? new Date(conversation.otherUser.lastLoginAt).getTime() > Date.now() - 5 * 60 * 1000
    : false

  const handleSend = async (content: string, file?: File) => {
    if (!file) {
      onSendMessage(content)
      return
    }

    try {
      setIsUploading(true)
      const response = await uploadApi.uploadMessageMedia(file)

      let type: 'IMAGE' | 'VIDEO' | 'FILE' = 'FILE'
      if (file.type.startsWith('image/')) type = 'IMAGE'
      else if (file.type.startsWith('video/')) type = 'VIDEO'

      onSendMessage(content, {
        url: response.url,
        type,
        mimeType: file.type
      })
    } catch (error) {
      console.error('Failed to upload media:', error)
      toast.error('Dosya yüklenirken bir hata oluştu')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full rounded-[40px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-3xl shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="px-4 lg:px-10 py-5 border-b border-black/5 dark:border-white/10 flex items-center gap-4">
          <div className="lg:hidden">
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
          <Skeleton className="w-16 h-16 rounded-3xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="hidden lg:flex gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-12 h-12 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 lg:p-10 space-y-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("flex gap-4 max-w-[80%]", i % 2 === 0 ? "ml-auto flex-row-reverse" : "")}>
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className={cn("space-y-2", i % 2 === 0 ? "items-end" : "")}>
                <Skeleton className={cn("h-12 rounded-2xl", i % 2 === 0 ? "w-64 rounded-tr-none" : "w-56 rounded-tl-none")} />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-col h-full min-h-0 rounded-[40px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-3xl overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.55)] text-slate-900 dark:text-white"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-24 w-80 h-80 bg-cyan-200/30 dark:bg-cyan-500/20 blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-purple-200/30 dark:bg-purple-700/30 blur-[200px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="px-4 lg:px-10 py-5 border-b border-black/5 dark:border-white/10 flex items-center gap-4 shrink-0">
          {onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-700 flex items-center justify-center overflow-hidden ring-2 ring-white/70 dark:ring-white/20 shadow-lg shadow-cyan-500/40 relative">
            {conversation.otherUser.avatarUrl ? (
              <Image
                src={conversation.otherUser.avatarUrl}
                alt={conversation.otherUser.username}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <span className="text-white text-xl font-semibold">
                {conversation.otherUser.username[0]?.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">
              {conversation.otherUser.firstName && conversation.otherUser.lastName
                ? `${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`
                : `@${conversation.otherUser.username}`}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/60">
              <span className={cn('w-2 h-2 rounded-full', isOnline ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-white/30')} />
              {isOnline
                ? 'Çevrimiçi'
                : conversation.otherUser.lastLoginAt
                  ? `Son görülme ${formatDistanceToNow(new Date(conversation.otherUser.lastLoginAt), {
                    addSuffix: true,
                    locale: tr,
                  })}`
                  : 'Çevrimdışı'}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {[Search, Phone, Video].map((Icon, index) => (
              <button
                key={index}
                className="w-12 h-12 rounded-2xl border border-black/5 bg-white text-cyan-500 hover:text-cyan-600 transition dark:border-white/15 dark:bg-white/5 dark:text-cyan-300 dark:hover:text-white flex items-center justify-center leading-none"
                type="button"
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 dark:text-white/70">
              <User className="w-14 h-14 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Henüz mesaj yok</h3>
              <p className="text-sm text-slate-500 dark:text-white/60">Neon hatlarını ilk sen ateşle.</p>
            </div>
          ) : (
            <Virtuoso
              ref={virtuosoRef}
              data={messages}
              initialTopMostItemIndex={messages.length - 1}
              followOutput="auto"
              style={{ height: '100%' }}
              className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20"
              itemContent={(index, message) => (
                <div className="py-2 px-4 lg:px-10 first:pt-6 last:pb-6">
                  <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />
                </div>
              )}
            />
          )}
        </div>

        <div className="flex-shrink-0">
          <MessageInput
            onSend={handleSend}
            disabled={isSending || isUploading}
            placeholder="Neon ağında bir mesaj bırak..."
          />
        </div>
      </div>
    </div>
  )
}

