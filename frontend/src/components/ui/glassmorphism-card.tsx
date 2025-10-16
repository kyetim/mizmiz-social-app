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
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={cn(
        "relative rounded-2xl p-6",
        "bg-card/95 backdrop-blur-sm",
        "border border-border/50",
        "shadow-md transition-shadow duration-200 ease-out will-change-transform",
        hover && "hover:shadow-lg",
        className
      )}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none dark:from-white/5" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

