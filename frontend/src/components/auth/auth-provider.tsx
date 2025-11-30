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
        // CRITICAL: Never logout if user exists in state - this means login just succeeded
        if (currentUserError && 'status' in currentUserError && currentUserError.status === 401) {
            const isPublicRoute = publicRoutes.includes(pathname)
            const isAuthRoute = authRoutes.includes(pathname)
            // NEVER logout if we have a user in state - login just succeeded, cookies might not be ready yet
            if (!isPublicRoute && !isAuthRoute && !user && !isAuthenticated) {
                // Only logout if we're truly unauthenticated (no user, not authenticated)
                dispatch(logout())
            }
        }
    }, [currentUserError, dispatch, pathname, user, isAuthenticated])

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
        // CRITICAL: Never redirect if user exists in state - login just succeeded
        // IMPORTANT: Don't redirect if we're on an auth route (login/register) - user might be logging in
        if (!isLoading && !isFetchingUser && !isAuthenticated && !isPublicRoute && !user && !isAuthRoute) {
            // Much longer delay to allow cookie processing on mobile, especially after login
            const timer = setTimeout(() => {
                // Final check - user might have been set by now, or we might be on auth route
                const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname
                const isCurrentlyAuthRoute = authRoutes.some(route => currentPath.startsWith(route))
                
                // Re-check state values - they might have been updated
                if (!user && !isAuthenticated && !isCurrentlyAuthRoute) {
                    const redirectUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
                    router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
                }
            }, 3000) // Even longer delay for mobile - give cookies time to be processed
            return () => clearTimeout(timer)
        }
    }, [pathname, router, searchParams, isAuthenticated, isLoading, isFetchingUser, user])

    return <>{children}</>
}

