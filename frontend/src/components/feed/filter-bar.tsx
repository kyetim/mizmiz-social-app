'use client'

import { useRef, useEffect, useState } from 'react'
import { useGetCategoriesQuery, useGetVibesQuery } from '@/store/api/api'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface FilterBarProps {
    selectedCategoryId?: string
    selectedVibeId?: string
    onCategorySelect: (id?: string) => void
    onVibeSelect: (id?: string) => void
}

export function FilterBar({ selectedCategoryId, selectedVibeId, onCategorySelect, onVibeSelect }: FilterBarProps) {
    const { data: categories } = useGetCategoriesQuery({ isActive: true })
    const { data: vibes } = useGetVibesQuery({ isActive: true })
    const categoryScrollRef = useRef<HTMLDivElement>(null)
    const vibeScrollRef = useRef<HTMLDivElement>(null)
    const [showCategoryLeftFade, setShowCategoryLeftFade] = useState(false)
    const [showCategoryRightFade, setShowCategoryRightFade] = useState(true)
    const [showVibeLeftFade, setShowVibeLeftFade] = useState(false)
    const [showVibeRightFade, setShowVibeRightFade] = useState(true)



    const checkScrollPosition = (ref: React.RefObject<HTMLDivElement>, setLeft: (val: boolean) => void, setRight: (val: boolean) => void) => {
        if (!ref.current) return
        const { scrollLeft, scrollWidth, clientWidth } = ref.current
        setLeft(scrollLeft > 0)
        setRight(scrollLeft < scrollWidth - clientWidth - 1)
    }

    useEffect(() => {
        const categoryEl = categoryScrollRef.current
        const vibeEl = vibeScrollRef.current

        const handleCategoryScroll = () => checkScrollPosition(categoryScrollRef, setShowCategoryLeftFade, setShowCategoryRightFade)
        const handleVibeScroll = () => checkScrollPosition(vibeScrollRef, setShowVibeLeftFade, setShowVibeRightFade)

        categoryEl?.addEventListener('scroll', handleCategoryScroll)
        vibeEl?.addEventListener('scroll', handleVibeScroll)

        // Initial check
        handleCategoryScroll()
        handleVibeScroll()

        return () => {
            categoryEl?.removeEventListener('scroll', handleCategoryScroll)
            vibeEl?.removeEventListener('scroll', handleVibeScroll)
        }
    }, [categories, vibes])

    if (!categories && !vibes) return null


    return (
        <div className="mb-6 space-y-4">
            {/* Categories */}
            <div className="relative group">
                {showCategoryLeftFade && (
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/60 to-transparent z-10 pointer-events-none" />
                )}
                {showCategoryRightFade && (
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/60 to-transparent z-10 pointer-events-none" />
                )}
                <div
                    ref={categoryScrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth pb-1"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <motion.button
                        onClick={() => onCategorySelect(undefined)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0",
                            !selectedCategoryId
                                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                                : "bg-gray-100/90 dark:bg-black/30 text-gray-700 dark:text-foreground/80 hover:bg-gray-200/90 dark:hover:bg-black/50 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm"
                        )}
                    >
                        Tümü
                    </motion.button>
                    {categories?.map((category) => (
                        <motion.button
                            key={category.id}
                            onClick={() => onCategorySelect(selectedCategoryId === category.id ? undefined : category.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0",
                                selectedCategoryId === category.id
                                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                                    : "bg-gray-100/90 dark:bg-black/30 text-gray-700 dark:text-foreground/80 hover:bg-gray-200/90 dark:hover:bg-black/50 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm"
                            )}
                        >
                            <span>{category.icon}</span>
                            {category.name}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Vibes */}
            {vibes && vibes.length > 0 && (
                <div className="relative group">
                    {showVibeLeftFade && (
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/60 to-transparent z-10 pointer-events-none" />
                    )}
                    {showVibeRightFade && (
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/60 to-transparent z-10 pointer-events-none" />
                    )}
                    <div
                        ref={vibeScrollRef}
                        className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 items-center scroll-smooth pb-1"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex-shrink-0">Vibe:</span>
                        {vibes.map((vibe) => (
                            <motion.button
                                key={vibe.id}
                                onClick={() => onVibeSelect(selectedVibeId === vibe.id ? undefined : vibe.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0",
                                    selectedVibeId === vibe.id
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                                        : "bg-gray-100/90 dark:bg-black/30 text-gray-700 dark:text-foreground/80 hover:bg-gray-200/90 dark:hover:bg-black/50 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm"
                                )}
                            >
                                <span>{vibe.icon}</span>
                                {vibe.name}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
