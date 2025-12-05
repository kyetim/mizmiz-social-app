'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ConversationInterface } from '@/interfaces/message.interface'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface ConversationListProps {
  conversations: ConversationInterface[]
  selectedConversationId?: string
  onSelectConversation: (conversationId: string) => void
  isLoading?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
  currentUserId?: string
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  currentUserId,
}: ConversationListProps) {
  const filteredConversations = conversations.filter((conv) => {
    // Henüz mesaj gönderilmemiş konuşmaları filtrele
    if (!conv.lastMessage || !conv.lastMessageAt) {
      return false
    }

    // Arama sorgusu varsa filtrele
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      conv.otherUser.username.toLowerCase().includes(query) ||
      conv.otherUser.firstName?.toLowerCase().includes(query) ||
      conv.otherUser.lastName?.toLowerCase().includes(query) ||
      conv.lastMessage?.content.toLowerCase().includes(query)
    )
  })

  if (isLoading) {
    return (
      <div className="flex flex-col h-full rounded-[32px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(15,23,42,0.08)] dark:shadow-[0_0_60px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="p-6 border-b border-black/5 dark:border-white/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="w-12 h-12 rounded-2xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-2xl" />
        </div>
        <div className="flex-1 p-3 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/5">
              <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full rounded-[32px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(15,23,42,0.08)] dark:shadow-[0_0_60px_rgba(0,0,0,0.45)] text-slate-900 dark:text-white">
      <div className="p-6 border-b border-black/5 dark:border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-500/70 dark:text-cyan-300/70">Neon grid</p>
            <h2 className="text-2xl font-semibold">Kanallar</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 text-white">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>

        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ghost link ara..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-black/5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 dark:bg-white/10 dark:border-white/10 dark:text-white dark:placeholder:text-white/40"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 text-slate-700 dark:text-white/70">
            <MessageCircle className="w-14 h-14 text-slate-400 dark:text-white/30 mb-3" />
            <h3 className="text-sm font-semibold">Yankı yok</h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              {searchQuery ? 'Aramana uygun sonuç bulunamadı.' : 'Bir konuşma başlatarak neon hattını aç.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredConversations.map((conversation) => {
              const isActive = selectedConversationId === conversation.id
              let lastMessageText = conversation.lastMessage?.content
              if (!lastMessageText && conversation.lastMessage) {
                if (conversation.lastMessage.type === 'IMAGE') lastMessageText = '📷 Fotoğraf'
                else if (conversation.lastMessage.type === 'VIDEO') lastMessageText = '🎥 Video'
                else if (conversation.lastMessage.type === 'FILE') lastMessageText = '📁 Dosya'
              }
              lastMessageText = lastMessageText || 'Henüz mesaj yok'
              const lastActivity = conversation.lastMessageAt
                ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                  addSuffix: true,
                  locale: tr,
                }).replace('yaklaşık ', '')
                : conversation.otherUser.lastLoginAt
                  ? formatDistanceToNow(new Date(conversation.otherUser.lastLoginAt), {
                    addSuffix: true,
                    locale: tr,
                  }).replace('yaklaşık ', '')
                  : 'Bilinmiyor'
              const isOnline =
                conversation.otherUser.lastLoginAt &&
                new Date(conversation.otherUser.lastLoginAt).getTime() > Date.now() - 5 * 60 * 1000
              const isTyping =
                typeof currentUserId !== 'undefined' &&
                conversation.unreadCount > 0 &&
                conversation.lastMessage?.senderId !== currentUserId

              return (
                <motion.button
                  key={conversation.id}
                  layout
                  onClick={() => onSelectConversation(conversation.id)}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    'relative w-full flex items-center gap-4 p-4 rounded-3xl border backdrop-blur-2xl text-left transition',
                    isActive
                      ? 'border-cyan-400/70 bg-cyan-50/60 text-slate-900 shadow-[0_0_25px_rgba(34,211,238,0.35)] dark:bg-white/10 dark:text-white'
                      : 'border-black/5 bg-white hover:border-cyan-400/40 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute inset-y-4 -left-1 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                    />
                  )}
                  <div className="relative">
                    <div className="w-14 h-14 lg:w-12 lg:h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-600">
                      {conversation.otherUser.avatarUrl ? (
                        <img src={conversation.otherUser.avatarUrl} alt={conversation.otherUser.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xl">
                          {conversation.otherUser.username[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    {isOnline && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#050505]" />}
                    {isTyping && (
                      <motion.span
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500/70 text-[10px] uppercase tracking-[0.3em] text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        ...
                      </motion.span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold lg:text-sm truncate">
                        {conversation.otherUser.firstName && conversation.otherUser.lastName
                          ? `${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`
                          : `@${conversation.otherUser.username}`}
                      </h3>
                      <span className="text-xs lg:text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/50">{lastActivity}</span>
                    </div>
                    <p className="text-sm lg:text-xs text-slate-500 dark:text-white/60 truncate">{lastMessageText}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-auto px-3 py-1 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-[11px] font-semibold">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

