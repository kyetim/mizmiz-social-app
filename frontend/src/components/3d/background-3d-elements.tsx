'use client'

import { motion } from 'framer-motion'

interface Background3DElementsProps {
  enabled?: boolean
}

export function Background3DElements({ enabled = true }: Background3DElementsProps) {
  if (!enabled) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Top Right - Floating Sphere */}
      <motion.div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/10 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Top Left - Small Floating Circle */}
      <motion.div
        className="absolute top-40 -left-10 w-64 h-64 rounded-full bg-gradient-to-br from-green-300/15 to-emerald-500/10 blur-2xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Center - Large Ambient Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-green-400/5 via-green-500/3 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Bottom Right - Floating Oval */}
      <motion.div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-tl from-green-500/15 to-teal-400/10 blur-3xl"
        animate={{
          y: [0, -25, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Bottom Left - Small Accent */}
      <motion.div
        className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-400/20 to-green-600/10 blur-2xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Middle Right - Subtle Glow */}
      <motion.div
        className="absolute top-1/3 -right-16 w-56 h-56 rounded-full bg-gradient-to-l from-green-400/12 to-green-600/8 blur-2xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </div>
  )
}

