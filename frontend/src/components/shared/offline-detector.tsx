'use client'

import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Offline Detector Component
 * Detects when user goes offline/online and shows notifications
 */
export function OfflineDetector() {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        // Initial state
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            toast.success('İnternet bağlantınız geri geldi! 🎉', {
                icon: <Wifi className="w-5 h-5 text-green-500" />,
                duration: 3000,
            })
        }

        const handleOffline = () => {
            setIsOnline(false)
            toast.error('İnternet bağlantınız kesildi!', {
                icon: <WifiOff className="w-5 h-5 text-red-500" />,
                duration: 5000,
            })
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Show persistent warning when offline
    if (!isOnline) {
        return (
            <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-2 px-4 text-center text-sm font-medium shadow-lg">
                <div className="flex items-center justify-center gap-2">
                    <WifiOff className="w-4 h-4" />
                    <span>İnternet bağlantınız yok. Bazı özellikler çalışmayabilir.</span>
                </div>
            </div>
        )
    }

    return null
}

export default OfflineDetector

