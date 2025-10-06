'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassmorphismCard({
  children,
  className,
  hover = true
}: GlassmorphismCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      whileHover={hover ? { y: -2, transition: { duration: 0.15 } } : {}}
      className={cn(
        "relative rounded-2xl p-6",
        "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-md shadow-gray-200/30 dark:shadow-gray-900/30",
        "transition-shadow duration-150 ease-out will-change-transform",
        hover && "hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40",
        className
      )}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

