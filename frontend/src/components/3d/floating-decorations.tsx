'use client'

import { motion } from 'framer-motion'

interface FloatingDecorationsProps {
  enabled?: boolean
}

export function FloatingDecorations({ enabled = true }: FloatingDecorationsProps) {
  if (!enabled) return null

  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
      {/* Floating Mini Cards - Top Area */}
      <motion.div
        className="absolute top-10 right-[15%] w-12 h-12 rounded-lg bg-gradient-to-br from-green-400/10 to-green-600/5 backdrop-blur-sm border border-green-200/10 shadow-lg"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-32 left-[12%] w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/8 to-green-500/5 backdrop-blur-sm shadow-md"
        animate={{
          y: [0, 12, 0],
          x: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Middle Area Decorations */}
      <motion.div
        className="absolute top-[40%] right-[8%] w-8 h-8 rounded-lg bg-gradient-to-tl from-green-300/12 to-teal-400/8 backdrop-blur-sm border border-green-200/10"
        animate={{
          y: [0, -10, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div
        className="absolute top-[55%] left-[10%] w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/8 to-emerald-600/5 backdrop-blur-sm shadow-lg"
        animate={{
          y: [0, 18, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Bottom Area - Subtle Stars/Dots */}
      <motion.div
        className="absolute bottom-[20%] right-[18%] w-6 h-6 rounded-full bg-green-400/15 shadow-lg shadow-green-400/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-[35%] left-[15%] w-5 h-5 rounded-full bg-emerald-400/12 shadow-md shadow-emerald-400/20"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      {/* Floating Lines - Very Subtle */}
      <motion.div
        className="absolute top-[25%] right-[20%] w-24 h-0.5 bg-gradient-to-r from-transparent via-green-400/20 to-transparent rounded-full"
        animate={{
          x: [0, 30, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div
        className="absolute bottom-[28%] left-[22%] w-20 h-0.5 bg-gradient-to-l from-transparent via-emerald-400/15 to-transparent rounded-full"
        animate={{
          x: [0, -25, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      />
    </div>
  )
}

