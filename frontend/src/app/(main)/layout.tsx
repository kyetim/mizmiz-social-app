'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/auth-slice'
import { CreatePostModal } from '@/components/post/create-post-modal'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, Search } from 'lucide-react'
import { useGetUnreadNotificationsCountQuery } from '@/store/api/api'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Sidebar } from '@/components/layout/sidebar'
import { RightSidebar } from '@/components/layout/right-sidebar'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { BottomNav } from '@/components/layout/bottom-nav'
import { MobileSearchSheet } from '@/components/layout/mobile-search-sheet'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const { user, isLoading } = useAppSelector((state) => state.auth)
    const { unreadCount } = useAppSelector((state) => state.notifications)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)

    useEffect(() => {
        // Wait for auth state to stabilize before checking
        // This prevents premature redirects on mobile devices
        if (isLoading) {
            return
        }

        setIsInitialized(true)

        // Only redirect if user is definitely not authenticated
        // AuthProvider will handle the redirect logic
        // This prevents double redirects on mobile
        if (!user && !isLoading) {
            // Small delay to allow AuthProvider to handle redirect first
            const timer = setTimeout(() => {
                if (!user) {
                    router.replace('/login')
                }
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [router, user, isLoading])

    useGetUnreadNotificationsCountQuery(undefined, {
        skip: !user,
        pollingInterval: 30000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })

    function handleLogout() {
        dispatch(logout())
        router.push('/login')
    }

    function handlePostCreated() {
        setIsCreateModalOpen(false)

        // Refresh the current page if on feed (for other updates)
        if (pathname === '/feed') {
            router.refresh()
        }
    }

    // Loading durumunu göster
    if (!isInitialized || isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/90 to-background text-foreground transition-colors duration-300">
            <AmbientBackground intensity="bold" />

            {/* Left Sidebar */}
            <Sidebar
                user={user}
                unreadCount={unreadCount}
                onLogout={handleLogout}
                onCreatePost={() => setIsCreateModalOpen(true)}
            />

            {/* Mobile Top Bar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/15 dark:bg-slate-950/60 backdrop-blur-2xl shadow-[0_15px_45px_rgba(15,23,42,0.25)] dark:shadow-[0_25px_55px_rgba(2,6,23,0.85)]">
                <div className="flex items-center justify-between px-4 h-14">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-gray-700 dark:text-gray-300"
                    >
                        <Menu className="w-6 h-6" />
                    </motion.button>

                    <Link href="/feed" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">MIZMIZ</span>
                    </Link>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsRightSidebarOpen(true)}
                        className="p-2 -mr-2 text-gray-700 dark:text-gray-300"
                    >
                        <Search className="w-6 h-6" />
                    </motion.button>
                </div>
            </header>

            {/* Mobile Left Drawer Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
                unreadCount={unreadCount}
                onLogout={handleLogout}
            />

            {/* Mobile Right Sidebar (Bottom Sheet) */}
            <MobileSearchSheet
                isOpen={isRightSidebarOpen}
                onClose={() => setIsRightSidebarOpen(false)}
            />

            {/* Mobile Bottom Navigation */}
            <BottomNav onCreatePost={() => setIsCreateModalOpen(true)} />

            {/* Main Content Wrapper */}
            <main className="relative z-10 lg:ml-80 pt-14 lg:pt-0 pb-16 lg:pb-0 min-h-screen">
                <div className={`mx-auto px-4 py-4 lg:py-6 ${pathname === '/explore' ? 'max-w-[1400px]' : pathname === '/messages' ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
                    {pathname === '/explore' ? (
                        // Explore page renders its own grid
                        children
                    ) : pathname === '/messages' ? (
                        // Messages page: wide layout without right sidebar
                        <div className="w-full">
                            {children}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
                            {/* Content Area */}
                            <div className="w-full max-w-2xl mx-auto xl:mx-0 xl:ml-auto xl:mr-6">
                                {children}
                            </div>

                            {/* Right Sidebar - Twitter Style */}
                            <RightSidebar />
                        </div>
                    )}
                </div>
            </main>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </div>
    )
}


