'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import {
  useGetConversationsQuery,
  useGetOrCreateConversationMutation,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} from '@/store/api/api'
import { MessageCircle, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ConversationList } from '@/components/messages/conversation-list'
import { ConversationView } from '@/components/messages/conversation-view'
import { cn } from '@/lib/utils'

export default function MessagesPage() {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [showConversationList, setShowConversationList] = useState(true)

  // Check for conversation query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const conversationId = params.get('conversation')
      if (conversationId) {
        setSelectedConversationId(conversationId)
        setShowConversationList(false)
        // Clean URL
        router.replace('/messages', { scroll: false })
      }
    }
  }, [router])

  // Get conversations with polling for real-time updates
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useGetConversationsQuery(undefined, {
    skip: !user,
    pollingInterval: 10000, // Poll every 10 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  // Get selected conversation
  const {
    data: selectedConversation,
    isLoading: isLoadingConversation,
    refetch: refetchConversation,
  } = useGetConversationQuery(selectedConversationId!, {
    skip: !selectedConversationId || !user,
    pollingInterval: 10000,
  })

  // Get messages for selected conversation
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    { conversationId: selectedConversationId!, limit: 50 },
    {
      skip: !selectedConversationId || !user,
      pollingInterval: 5000, // Poll messages more frequently
    }
  )

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [markAsRead] = useMarkMessagesAsReadMutation()
  const [getOrCreateConversation] = useGetOrCreateConversationMutation()

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user, router])

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId && selectedConversation?.unreadCount && selectedConversation.unreadCount > 0) {
      markAsRead(selectedConversationId)
        .unwrap()
        .then(() => {
          refetchConversations()
        })
        .catch((error) => {
          console.error('Failed to mark messages as read:', error)
        })
    }
  }, [selectedConversationId, selectedConversation?.unreadCount, markAsRead, refetchConversations])

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setShowConversationList(false)
  }

  const handleSendMessage = async (content: string, media?: { url: string; type: 'IMAGE' | 'VIDEO' | 'FILE'; mimeType: string }) => {
    if (!selectedConversationId || !user) return

    try {
      await sendMessage({
        conversationId: selectedConversationId,
        data: {
          content,
          ...(media && {
            type: media.type,
            mediaUrl: media.url,
            mediaType: media.mimeType
          })
        },
      }).unwrap()
      refetchMessages()
      refetchConversations()
    } catch (error: any) {
      toast.error(error.data?.message || 'Mesaj gönderilemedi')
    }
  }

  const handleBack = () => {
    setShowConversationList(true)
    setSelectedConversationId(undefined)
  }

  // Start conversation with a user (can be called from user profile page)
  const handleStartConversation = async (userId: string) => {
    try {
      const result = await getOrCreateConversation({ userId }).unwrap()
      setSelectedConversationId(result.id)
      setShowConversationList(false)
      refetchConversations()
    } catch (error: any) {
      toast.error(error.data?.message || 'Konuşma başlatılamadı')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-white dark:bg-[#050505]">
      <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-50" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")' }} />
      <div className="absolute -top-40 -left-20 w-[420px] h-[420px] bg-cyan-200/40 dark:bg-cyan-500/30 blur-[220px]" />
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-purple-300/30 dark:bg-purple-700/25 blur-[260px]" />

      <div className="relative z-10 flex-1 min-h-0 px-4 lg:px-10 py-4 lg:py-6 flex flex-col">
        <div className="flex items-center justify-between mb-4 lg:mb-6 text-slate-900 dark:text-white">
          <div>
            <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.4em] text-cyan-500/80 dark:text-cyan-300/70">MIZMIZ</p>
            <h1 className="text-2xl lg:text-3xl font-semibold">Neon Mesaj Ağı</h1>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-sm text-slate-500 dark:text-white/60">
            <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-300" />
            {conversations.length} bağlantı aktif
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 flex-1 min-h-0">
          <div
            className={cn(
              'transition-all duration-300 h-full',
              showConversationList ? 'flex' : 'hidden',
              'lg:flex w-full lg:w-[280px] xl:w-[320px]'
            )}
          >
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoadingConversations}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentUserId={user.id}
            />
          </div>

          <div
            className={cn(
              'flex-1 min-h-0 h-full transition-all duration-300',
              showConversationList && !selectedConversation
                ? 'hidden lg:flex'
                : 'flex'
            )}
          >
            {selectedConversationId && selectedConversation ? (
              <ConversationView
                conversation={selectedConversation}
                messages={[...messages].reverse()}
                currentUserId={user.id}
                isLoading={isLoadingMessages || isLoadingConversation}
                onSendMessage={handleSendMessage}
                onBack={handleBack}
                isSending={isSending}
              />
            ) : (
              <div className="flex flex-1 min-h-0 items-center justify-center rounded-[40px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-2xl text-center text-slate-700 dark:text-white/70">
                <div className="space-y-4 max-w-sm px-6">
                  <MessageCircle className="w-16 h-16 mx-auto text-cyan-500 dark:text-cyan-400" />
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Bir konuşma seç</h3>
                  <p className="text-sm text-slate-600 dark:text-white/60">
                    Sol panelden bir kullanıcı seçerek neon hattını aç veya yeni konuşma başlat.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

