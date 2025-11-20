'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout, setCredentials } from '@/store/slices/auth-slice'
import { useGetCurrentUserQuery } from '@/store/api/api'

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

    const {
        data: currentUser,
        error: currentUserError,
    } = useGetCurrentUserQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })

    useEffect(() => {
        if (currentUser && currentUser.id !== user?.id) {
            dispatch(setCredentials({ user: currentUser }))
        }
    }, [currentUser, dispatch, user?.id])

    useEffect(() => {
        if (currentUserError && 'status' in currentUserError && currentUserError.status === 401) {
            dispatch(logout())
        }
    }, [currentUserError, dispatch])

    useEffect(() => {
        const isPublicRoute = publicRoutes.includes(pathname)
        const isAuthRoute = authRoutes.includes(pathname)

        // Redirect authenticated users away from auth pages
        if (isAuthenticated && isAuthRoute) {
            router.replace('/feed')
            return
        }

        // Redirect unauthenticated users to login
        // Only redirect if we've finished loading and still not authenticated
        if (!isLoading && !isAuthenticated && !isPublicRoute) {
            const redirectUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
            router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
            return
        }
    }, [pathname, router, searchParams, isAuthenticated, isLoading])

    return <>{children}</>
}

