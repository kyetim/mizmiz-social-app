'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

type SmoothScrollProviderProps = {
    children: React.ReactNode
}

/**
 * Lenis tabanlı smooth-scroll sağlayıcısı.
 * Reduced motion tercih eden kullanıcılar için otomatik devre dışı kalır.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            lerp: 0.1,
        })

        lenisRef.current = lenis

        let frameId: number
        const raf = (time: number) => {
            lenis.raf(time)
            frameId = requestAnimationFrame(raf)
        }

        frameId = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(frameId)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    return <>{children}</>
}


