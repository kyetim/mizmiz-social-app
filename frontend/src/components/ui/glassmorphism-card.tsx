'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type CardTone = 'emerald' | 'cyan' | 'rose' | 'neutral'

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  tone?: CardTone
}

const toneBorders: Record<CardTone, string> = {
  emerald:
    'border-emerald-200/60 dark:border-emerald-500/30 shadow-[0_8px_40px_rgba(16,185,129,0.15)] dark:shadow-[0_8px_40px_rgba(16,185,129,0.15)]',
  cyan: 'border-cyan-200/60 dark:border-cyan-500/30 shadow-[0_8px_40px_rgba(6,182,212,0.12)] dark:shadow-[0_8px_40px_rgba(6,182,212,0.12)]',
  rose: 'border-rose-200/60 dark:border-rose-500/30 shadow-[0_8px_40px_rgba(244,114,182,0.12)] dark:shadow-[0_8px_40px_rgba(244,114,182,0.12)]',
  neutral: 'border-gray-200/60 dark:border-white/10 shadow-[0_10px_40px_rgba(15,23,42,0.15)] dark:shadow-[0_10px_40px_rgba(15,23,42,0.25)]',
}

export function GlassmorphismCard({
  children,
  className,
  hover = true,
  tone = 'neutral',
}: GlassmorphismCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={
        hover
          ? {
            y: -6,
            scale: 1.01,
            transition: { type: 'spring', stiffness: 240, damping: 18 },
          }
          : {}
      }
      className={cn(
        'group relative overflow-hidden rounded-3xl p-6',
        'bg-white/90 dark:bg-slate-900/60 backdrop-blur-2xl',
        'border transition-all duration-300 ease-out will-change-transform',
        toneBorders[tone],
        hover && 'hover:border-gray-300/80 dark:hover:border-white/40',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 mix-blend-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/10" />
        <div className="absolute -inset-1 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="aurora-trace h-full w-full" />
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
