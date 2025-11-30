'use client'

import { useEffect, useState } from 'react'
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

    // Load user from localStorage on mount if state is empty (mobile fallback)
    // This MUST run before getCurrentUser to prevent logout
    // Use a ref to track if we've loaded from localStorage to prevent loops
    const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false)
    
    useEffect(() => {
        if (!user && !isLoading && !hasLoadedFromStorage && typeof window !== 'undefined') {
            try {
                const storedUser = localStorage.getItem('auth_user')
                const storedAuthenticated = localStorage.getItem('auth_authenticated')
                if (storedUser && storedAuthenticated === 'true') {
                    const parsedUser = JSON.parse(storedUser)
                    dispatch(setCredentials({ user: parsedUser }))
                    setHasLoadedFromStorage(true)
                } else {
                    setHasLoadedFromStorage(true) // Mark as loaded even if no user found
                }
            } catch (e) {
                console.warn('Failed to load auth from localStorage:', e)
                setHasLoadedFromStorage(true)
            }
        } else if (user) {
            setHasLoadedFromStorage(true) // Mark as loaded if user exists
        }
    }, [dispatch, user, isLoading, hasLoadedFromStorage])

    // Also check localStorage whenever user becomes null (fallback recovery)
    useEffect(() => {
        if (!user && !isLoading && isAuthenticated === false && typeof window !== 'undefined') {
            try {
                const storedUser = localStorage.getItem('auth_user')
                const storedAuthenticated = localStorage.getItem('auth_authenticated')
                if (storedUser && storedAuthenticated === 'true') {
                    const parsedUser = JSON.parse(storedUser)
                    dispatch(setCredentials({ user: parsedUser }))
                }
            } catch (e) {
                console.warn('Failed to recover auth from localStorage:', e)
            }
        }
    }, [user, isLoading, isAuthenticated, dispatch])

    const {
        data: currentUser,
        error: currentUserError,
        isLoading: isFetchingUser,
    } = useGetCurrentUserQuery(undefined, {
        refetchOnFocus: false, // Disable refetch on focus to prevent mobile keyboard issues
        refetchOnReconnect: false, // Disable auto reconnect fetch
        // Skip on auth routes - user is already set from login action
        // Also skip on public routes
        // CRITICAL: Skip if user already exists in state - prevents pending loop
        // Also skip if we just loaded from localStorage (mobile fallback)
        skip: publicRoutes.includes(pathname) || authRoutes.includes(pathname) || !!user || (hasLoadedFromStorage && !!user),
    })

    useEffect(() => {
        if (currentUser && currentUser.id !== user?.id) {
            dispatch(setCredentials({ user: currentUser }))
        }
    }, [currentUser, dispatch, user?.id])

    useEffect(() => {
        // Only logout on 401 if we're not on a public route AND we don't have a user in state OR localStorage
        // This prevents logout during initial load on mobile and after successful login
        // CRITICAL: Never logout if user exists in state or localStorage
        if (currentUserError && 'status' in currentUserError && currentUserError.status === 401) {
            const isPublicRoute = publicRoutes.includes(pathname)
            const isAuthRoute = authRoutes.includes(pathname)
            
            // Check localStorage as well
            let hasStoredUser = false
            if (typeof window !== 'undefined') {
                try {
                    const storedUser = localStorage.getItem('auth_user')
                    hasStoredUser = !!storedUser
                } catch (e) {
                    // Ignore
                }
            }
            
            // NEVER logout if we have a user in state or localStorage
            // Login just succeeded, cookies might not be ready yet
            if (!isPublicRoute && !isAuthRoute && !user && !isAuthenticated && !hasStoredUser) {
                // Only logout if we're truly unauthenticated (no user anywhere)
                dispatch(logout())
            } else if (hasStoredUser && !user) {
                // Recover user from localStorage if we have it but state is empty
                try {
                    const storedUser = localStorage.getItem('auth_user')
                    if (storedUser) {
                        const parsedUser = JSON.parse(storedUser)
                        dispatch(setCredentials({ user: parsedUser }))
                    }
                } catch (e) {
                    console.warn('Failed to recover user from localStorage:', e)
                }
            }
        }
    }, [currentUserError, dispatch, pathname, user, isAuthenticated])

    useEffect(() => {
        const isPublicRoute = publicRoutes.includes(pathname)
        const isAuthRoute = authRoutes.includes(pathname)

        // Don't do any redirects if we're still loading or fetching
        // Also don't redirect if we haven't loaded from localStorage yet
        if (isLoading || isFetchingUser || !hasLoadedFromStorage) {
            return
        }

        // Check localStorage for user (mobile fallback)
        let hasStoredUser = false
        if (typeof window !== 'undefined') {
            try {
                const storedUser = localStorage.getItem('auth_user')
                const storedAuthenticated = localStorage.getItem('auth_authenticated')
                hasStoredUser = !!(storedUser && storedAuthenticated === 'true')
                
                // If we have stored user but not in state, recover it
                if (storedUser && hasStoredUser && !user) {
                    const parsedUser = JSON.parse(storedUser)
                    dispatch(setCredentials({ user: parsedUser }))
                    return // Don't redirect yet, let state update
                }
            } catch (e) {
                // Ignore
            }
        }

        // Determine if user exists (in state or localStorage)
        const hasUser = !!(user || hasStoredUser)

        // Redirect authenticated users away from auth pages
        // But only if we have a confirmed user (not just isAuthenticated flag)
        if (hasUser && isAuthRoute) {
            const timer = setTimeout(() => {
                router.replace('/feed')
            }, 100)
            return () => clearTimeout(timer)
        }

        // Redirect unauthenticated users to login
        // Only redirect if we're NOT on a public route, NOT on an auth route, and have no user
        // CRITICAL: Never redirect if user exists in state or localStorage
        if (!isPublicRoute && !isAuthRoute && !hasUser) {
            const timer = setTimeout(() => {
                const redirectUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
                router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [pathname, router, searchParams, isAuthenticated, isLoading, isFetchingUser, user, dispatch, hasLoadedFromStorage])

    return <>{children}</>
}

