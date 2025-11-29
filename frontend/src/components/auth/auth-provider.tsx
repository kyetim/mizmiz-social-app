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
        isLoading: isFetchingUser,
    } = useGetCurrentUserQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        // Skip if we're on a public route to avoid unnecessary calls
        skip: publicRoutes.includes(pathname),
    })

    useEffect(() => {
        if (currentUser && currentUser.id !== user?.id) {
            dispatch(setCredentials({ user: currentUser }))
        }
    }, [currentUser, dispatch, user?.id])

    useEffect(() => {
        // Only logout on 401 if we're not on a public route
        // This prevents logout during initial load on mobile
        if (currentUserError && 'status' in currentUserError && currentUserError.status === 401) {
            const isPublicRoute = publicRoutes.includes(pathname)
            if (!isPublicRoute) {
                dispatch(logout())
            }
        }
    }, [currentUserError, dispatch, pathname])

    useEffect(() => {
        const isPublicRoute = publicRoutes.includes(pathname)
        const isAuthRoute = authRoutes.includes(pathname)

        // Redirect authenticated users away from auth pages
        if (isAuthenticated && isAuthRoute) {
            router.replace('/feed')
            return
        }

        // Redirect unauthenticated users to login
        // Only redirect if we've finished loading, not fetching user, and still not authenticated
        // This prevents premature redirects on mobile devices during initial auth check
        if (!isLoading && !isFetchingUser && !isAuthenticated && !isPublicRoute) {
            const redirectUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
            router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
            return
        }
    }, [pathname, router, searchParams, isAuthenticated, isLoading, isFetchingUser])

    return <>{children}</>
}

