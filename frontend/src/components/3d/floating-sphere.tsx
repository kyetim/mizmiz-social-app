'use client'

import { motion } from 'framer-motion'

export function FloatingSphere() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Ana küre */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 opacity-80 shadow-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Işıltı efekti */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-300 to-transparent opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Parlama efekti */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white opacity-40 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  )
}

