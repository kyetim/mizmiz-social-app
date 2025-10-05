'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getCurrentUser } from '@/store/slices/auth-slice'

interface AuthProviderProps {
    children: React.ReactNode
}

const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/terms', '/privacy']
const authRoutes = ['/login', '/register', '/forgot-password']

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        const token = localStorage.getItem('token')

        // If token exists but user is not loaded, fetch user data
        if (token && !user && !isLoading) {
            dispatch(getCurrentUser())
        }
    }, [dispatch, user, isLoading])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const isPublicRoute = publicRoutes.includes(pathname)
        const isAuthRoute = authRoutes.includes(pathname)

        // Redirect authenticated users away from auth pages
        if (token && isAuthRoute) {
            router.replace('/feed')
            return
        }

        // Redirect unauthenticated users to login
        if (!token && !isPublicRoute) {
            const redirectUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
            router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
            return
        }
    }, [pathname, router, searchParams])

    return <>{children}</>
}

