'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  useGetConversationsQuery,
  useGetOrCreateConversationMutation,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  api,
} from '@/store/api/api'
import { MessageCircle, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ConversationList } from '@/components/messages/conversation-list'
import { ConversationView } from '@/components/messages/conversation-view'
import { useSocket } from '@/lib/socket-context'
import { MessageInterface } from '@/interfaces/message.interface'

import { cn } from '@/lib/utils'

export default function MessagesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { socket, isConnected } = useSocket()
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
    // Polling removed in favor of Socket.io
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
      // Polling removed in favor of Socket.io
    }
  )

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [markAsRead] = useMarkMessagesAsReadMutation()
  const [getOrCreateConversation] = useGetOrCreateConversationMutation()

  // Socket.io Integration
  useEffect(() => {
    if (!socket || !isConnected) return

    // Listen for new messages
    const handleNewMessage = (message: MessageInterface) => {
      // Update messages cache if in the active conversation
      if (selectedConversationId && message.conversationId === selectedConversationId) {
        // Optimistic update
        dispatch(
          api.util.updateQueryData('getMessages', { conversationId: selectedConversationId, limit: 50 }, (draft) => {
            const exists = draft.find((m) => m.id === message.id)
            if (!exists) {
              draft.unshift(message) 
            }
          })
        )
        
        // Also invalidate tags to ensure full consistency and trigger refetch
        dispatch(api.util.invalidateTags([{ type: 'Messages', id: selectedConversationId }]))

        // Mark as read immediately if user is viewing this conversation and it's not their message
        if (message.senderId !== user?.id) {
            socket.emit('mark_read', { conversationId: selectedConversationId, messageId: message.id })
            markAsRead(selectedConversationId)
        }
      }

      // Update conversations list cache
      dispatch(
        api.util.updateQueryData('getConversations', undefined, (draft) => {
          const conversation = draft.find((c) => c.id === message.conversationId)
          if (conversation) {
            conversation.lastMessage = message
            conversation.lastMessageAt = message.createdAt
            
            // Increment unread count if it's not our message and we are not in this conversation
            if (message.senderId !== user?.id && message.conversationId !== selectedConversationId) {
                 if (conversation.user1Id === user?.id) {
                     conversation.user1UnreadCount = (conversation.user1UnreadCount || 0) + 1
                 } else {
                     conversation.user2UnreadCount = (conversation.user2UnreadCount || 0) + 1
                 }
            }
          }
        })
      )
    }

    const handleMessagesRead = ({ conversationId }: { conversationId: string }) => {
        // Update messages cache to mark as read
        if (selectedConversationId && conversationId === selectedConversationId) {
            dispatch(api.util.updateQueryData('getMessages', { conversationId, limit: 50 }, (draft) => {
                draft.forEach(msg => {
                    if (!msg.isRead && msg.senderId === user?.id) {
                        msg.isRead = true
                        msg.readAt = new Date().toISOString()
                    }
                })
            }))
        }
    }

    socket.on('new_message', handleNewMessage)
    socket.on('messages_read', handleMessagesRead)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('messages_read', handleMessagesRead)
    }
  }, [socket, isConnected, selectedConversationId, dispatch, user?.id, markAsRead])

  // Join/Leave conversation room
  useEffect(() => {
    if (!socket || !isConnected || !selectedConversationId) return

    socket.emit('join_conversation', selectedConversationId)

    return () => {
      socket.emit('leave_conversation', selectedConversationId)
    }
  }, [socket, isConnected, selectedConversationId])

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

        {/* CSS GRID LAYOUT - Strict columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 flex-1 min-h-0 w-full">
          <div
            className={cn(
              'h-full min-h-0 overflow-hidden',
              showConversationList ? 'block' : 'hidden',
              'lg:block'
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
              'h-full min-h-0 overflow-hidden',
              showConversationList && !selectedConversation
                ? 'hidden lg:block'
                : 'block'
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
              <div className="flex flex-1 h-full min-h-0 items-center justify-center rounded-[40px] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-2xl text-center text-slate-700 dark:text-white/70">
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