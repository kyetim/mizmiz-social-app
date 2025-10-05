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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={cn(
        "relative rounded-2xl p-6",
        "bg-white/80 backdrop-blur-xl",
        "border border-white/20",
        "shadow-lg shadow-gray-200/50",
        "transition-all duration-300",
        hover && "hover:shadow-xl hover:shadow-gray-200/60",
        className
      )}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

