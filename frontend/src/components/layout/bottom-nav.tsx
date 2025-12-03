'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Users, User, Plus, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
    onCreatePost: () => void
}

export function BottomNav({ onCreatePost }: BottomNavProps) {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(15,23,42,0.05)] dark:shadow-[0_-10px_40px_rgba(15,23,42,0.35)] pb-safe">
            <div className="flex items-center justify-around px-2 h-16">
                <Link href="/feed" className="flex flex-col items-center justify-center flex-1 h-full">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all border border-transparent',
                            isActive('/feed')
                                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 shadow-sm dark:shadow-[0_12px_35px_rgba(255,255,255,0.15)]'
                                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white',
                        )}
                    >
                        <Home className={`w-5 h-5 ${isActive('/feed') ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">Timeline</span>
                    </motion.div>
                </Link>

                <Link href="/explore" className="flex flex-col items-center justify-center flex-1 h-full">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all border border-transparent',
                            isActive('/explore')
                                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 shadow-sm dark:shadow-[0_12px_35px_rgba(255,255,255,0.15)]'
                                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white',
                        )}
                    >
                        <TrendingUp className={`w-5 h-5 ${isActive('/explore') ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">Keşfet</span>
                    </motion.div>
                </Link>

                {/* Central FAB Button */}
                <div className="flex flex-col items-center justify-center flex-1 h-full -mt-8">
                    <motion.button
                        onClick={onCreatePost}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:shadow-[0_15px_45px_rgba(16,185,129,0.5)] text-white rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-slate-950"
                    >
                        <Plus className="w-7 h-7" />
                    </motion.button>
                </div>

                <Link href="/people" className="flex flex-col items-center justify-center flex-1 h-full">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all border border-transparent',
                            isActive('/people')
                                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 shadow-sm dark:shadow-[0_12px_35px_rgba(255,255,255,0.15)]'
                                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white',
                        )}
                    >
                        <Users className={`w-5 h-5 ${isActive('/people') ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">İnsanlar</span>
                    </motion.div>
                </Link>

                <Link href="/messages" className="flex flex-col items-center justify-center flex-1 h-full">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all border border-transparent',
                            isActive('/messages')
                                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 shadow-sm dark:shadow-[0_12px_35px_rgba(255,255,255,0.15)]'
                                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white',
                        )}
                    >
                        <MessageCircle className={`w-5 h-5 ${isActive('/messages') ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">Mesajlar</span>
                    </motion.div>
                </Link>

                <Link href="/profile" className="flex flex-col items-center justify-center flex-1 h-full">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all border border-transparent',
                            isActive('/profile')
                                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 shadow-sm dark:shadow-[0_12px_35px_rgba(255,255,255,0.15)]'
                                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white',
                        )}
                    >
                        <User className={`w-5 h-5 ${isActive('/profile') ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">Profil</span>
                    </motion.div>
                </Link>
            </div>
        </nav>
    )
}
