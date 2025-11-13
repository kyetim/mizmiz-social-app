'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// This wrapper ensures the 3D component only loads on the client
const FloatingCubeClient = dynamic(
  () => import('./floating-cube').then((mod) => mod.FloatingCube),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400 to-green-600 opacity-60 animate-pulse" />
        </div>
      </div>
    ),
  }
)

export function FloatingCubeWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400 to-green-600 opacity-60 animate-pulse" />
        </div>
      </div>
    )
  }

  return <FloatingCubeClient />
}

