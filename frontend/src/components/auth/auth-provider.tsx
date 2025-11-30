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
        // Skip on auth routes - user is already set from login action
        // Also skip on public routes
        skip: publicRoutes.includes(pathname) || authRoutes.includes(pathname),
    })

    useEffect(() => {
        if (currentUser && currentUser.id !== user?.id) {
            dispatch(setCredentials({ user: currentUser }))
        }
    }, [currentUser, dispatch, user?.id])

    useEffect(() => {
        // Only logout on 401 if we're not on a public route AND we don't have a user in state
        // This prevents logout during initial load on mobile and after successful login
        if (currentUserError && 'status' in currentUserError && currentUserError.status === 401) {
            const isPublicRoute = publicRoutes.includes(pathname)
            const isAuthRoute = authRoutes.includes(pathname)
            // Don't logout if we have a user in state (login just succeeded) or we're on auth routes
            if (!isPublicRoute && !isAuthRoute && !user) {
                dispatch(logout())
            }
        }
    }, [currentUserError, dispatch, pathname, user])

    useEffect(() => {
        const isPublicRoute = publicRoutes.includes(pathname)
        const isAuthRoute = authRoutes.includes(pathname)

        // Redirect authenticated users away from auth pages
        // But only if we have a confirmed user (not just isAuthenticated flag)
        // Add a small delay to ensure state is fully synced after login
        if (user && isAuthenticated && isAuthRoute) {
            const timer = setTimeout(() => {
                router.replace('/feed')
            }, 300)
            return () => clearTimeout(timer)
        }

        // Redirect unauthenticated users to login
        // Only redirect if we've finished loading, not fetching user, and still not authenticated
        // IMPORTANT: Don't redirect if we're on an auth route (login/register) - user might be logging in
        if (!isLoading && !isFetchingUser && !isAuthenticated && !isPublicRoute && !user && !isAuthRoute) {
            // Longer delay to allow cookie processing on mobile
            const timer = setTimeout(() => {
                // Triple check - user might have been set by now, or we might be on auth route
                const currentPath = window.location.pathname
                const isCurrentlyAuthRoute = authRoutes.some(route => currentPath.startsWith(route))
                if (!user && !isAuthenticated && !isCurrentlyAuthRoute) {
                    const redirectUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
                    router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
                }
            }, 2000) // Increased delay for mobile
            return () => clearTimeout(timer)
        }
    }, [pathname, router, searchParams, isAuthenticated, isLoading, isFetchingUser, user])

    return <>{children}</>
}

