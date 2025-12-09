'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/hooks/use-auth'
import apiClient from '@/lib/api/client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Determine WebSocket URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    // Remove '/api' suffix to get base URL if present
    const socketUrl = apiUrl.replace(/\/api\/?$/, '')

    if (!isAuthenticated || !user) {
        if (socket) {
            socket.disconnect()
            setSocket(null)
            setIsConnected(false)
        }
        return
    }

    if (socket && socket.connected) return

    console.log('Connecting to socket at:', socketUrl)

    // Connect to socket
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Prioritize websocket
      auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      }
    })

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', async (err) => {
        console.error('Socket connection error:', err.message)
        
        // If authentication error, try to refresh token
        if (err.message.includes('Authentication error')) {
            try {
                console.log('Socket auth failed, attempting to refresh token...')
                await apiClient.post('/auth/refresh')
                console.log('Token refreshed, retrying socket connection...')
                
                // Update token in auth object for next attempt
                const newToken = localStorage.getItem('auth_token')
                if (newToken) {
                    socketInstance.auth = { token: newToken }
                }
                
                // Retry connection
                socketInstance.connect()
            } catch (refreshError) {
                console.error('Socket token refresh failed:', refreshError)
                // If refresh fails, user might need to login again
                // apiClient interceptor handles redirect usually
            }
        }
    })

    setSocket(socketInstance)

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [isAuthenticated, user]) 

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

