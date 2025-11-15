'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    )
  }

  return (
    <div className="flex items-center justify-between gap-1 w-full bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme('light')}
        className={`flex-1 p-2 rounded-md transition-colors duration-200 ${theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm border border-gray-200 dark:border-gray-600'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4 mx-auto" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme('system')}
        className={`flex-1 p-2 rounded-md transition-colors duration-200 ${theme === 'system'
            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm border border-gray-200 dark:border-gray-600'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        title="System"
      >
        <Monitor className="w-4 h-4 mx-auto" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme('dark')}
        className={`flex-1 p-2 rounded-md transition-colors duration-200 ${theme === 'dark'
            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm border border-gray-200 dark:border-gray-600'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4 mx-auto" />
      </motion.button>
    </div>
  )
}

