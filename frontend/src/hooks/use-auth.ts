import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'

interface UseAuthOptions {
    redirectTo?: string
    redirectIfFound?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
    const { redirectTo = '/login', redirectIfFound = false } = options
    const router = useRouter()
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

    useEffect(() => {
        // If redirectIfFound is true, redirect if user is authenticated
        if (!isLoading) {
            if (redirectIfFound && isAuthenticated) {
                router.replace(redirectTo)
            } else if (!redirectIfFound && !isAuthenticated) {
                router.replace(redirectTo)
            }
        }
    }, [isAuthenticated, isLoading, redirectIfFound, redirectTo, router])

    return { user, isAuthenticated, isLoading }
}

export function useRequireAuth(redirectTo: string = '/login') {
    return useAuth({ redirectTo, redirectIfFound: false })
}

export function useRedirectIfAuth(redirectTo: string = '/feed') {
    return useAuth({ redirectTo, redirectIfFound: true })
}

