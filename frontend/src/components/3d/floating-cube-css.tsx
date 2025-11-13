'use client'

import { motion } from 'framer-motion'

/**
 * CSS-based Floating Cube - No WebGL/Three.js dependencies
 * This is a fallback for when React Three Fiber has compatibility issues
 */
export function FloatingCubeCss() {
  return (
    <div className="w-full h-full flex items-center justify-center perspective-1000">
      <div className="relative w-48 h-48 transform-style-3d">
        {/* Main Cube */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl shadow-2xl opacity-90"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: [0, 15, 0, -15, 0],
            rotateY: [0, 360],
            scale: [1, 1.05, 1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Top Face Highlight */}
          <div className="absolute -top-2 inset-x-0 h-8 bg-gradient-to-b from-green-300 to-transparent rounded-t-2xl opacity-60" />
          
          {/* Side Shadows */}
          <div className="absolute top-0 -right-2 bottom-0 w-8 bg-gradient-to-l from-green-700 to-transparent rounded-r-2xl opacity-40" />
          <div className="absolute top-0 left-0 -bottom-2 inset-x-0 h-8 bg-gradient-to-t from-green-700 to-transparent rounded-b-2xl opacity-40" />
        </motion.div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-green-400 blur-2xl opacity-40"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Highlight Dot */}
        <motion.div
          className="absolute top-12 left-12 w-12 h-12 rounded-full bg-white opacity-50 blur-lg"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-300 rounded-full opacity-60"
            style={{
              top: `${30 + i * 20}%`,
              left: `${20 + i * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}

