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
    <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg border border-border">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-background text-primary shadow-sm border border-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          theme === 'system'
            ? 'bg-background text-primary shadow-sm border border-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="System"
      >
        <Monitor className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors duration-200 ${
          theme === 'dark'
            ? 'bg-background text-primary shadow-sm border border-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </motion.button>
    </div>
  )
}

