'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Search, User, Video } from 'lucide-react'
import { ConversationInterface, MessageInterface } from '@/interfaces/message.interface'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface ConversationViewProps {
  conversation: ConversationInterface
  messages: MessageInterface[]
  currentUserId: string
  isLoading?: boolean
  onSendMessage: (content: string) => void
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isOnline = conversation.otherUser.lastLoginAt
    ? new Date(conversation.otherUser.lastLoginAt).getTime() > Date.now() - 5 * 60 * 1000
    : false

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Mesajlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    if (!containerRef.current.contains(event.target as Node)) return
    event.preventDefault()
    containerRef.current.scrollTop += event.deltaY
  }

  return (
    <div
      className="relative flex flex-col h-full min-h-0 rounded-[40px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-3xl overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.55)] text-slate-900 dark:text-white"
      onWheel={handleWheel}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-24 w-80 h-80 bg-cyan-200/30 dark:bg-cyan-500/20 blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-purple-200/30 dark:bg-purple-700/30 blur-[200px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="px-4 lg:px-10 py-5 border-b border-black/5 dark:border-white/10 flex items-center gap-4">
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

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-700 flex items-center justify-center overflow-hidden ring-2 ring-white/70 dark:ring-white/20 shadow-lg shadow-cyan-500/40">
            {conversation.otherUser.avatarUrl ? (
              <img src={conversation.otherUser.avatarUrl} alt={conversation.otherUser.username} className="w-full h-full object-cover" />
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

        <div
          ref={containerRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-10 py-6 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-600 dark:text-white/70">
              <User className="w-14 h-14 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Henüz mesaj yok</h3>
              <p className="text-sm text-slate-500 dark:text-white/60">Neon hatlarını ilk sen ateşle.</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="flex-shrink-0">
          <MessageInput
            onSend={onSendMessage}
            disabled={isSending}
            placeholder="Neon ağında bir mesaj bırak..."
          />
        </div>
      </div>
    </div>
  )
}

