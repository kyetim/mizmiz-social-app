'use client'

import { useState, KeyboardEvent } from 'react'
import { Paperclip, Send, Smile } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({ onSend, disabled = false, placeholder = 'Mesaj yazın...' }: MessageInputProps) {
  const [content, setContent] = useState('')

  const handleSend = () => {
    const trimmedContent = content.trim()
    if (trimmedContent && !disabled) {
      onSend(trimmedContent)
      setContent('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-2 lg:px-6 pb-4">
      <div
        className={cn(
          'w-full rounded-full border border-black/5 bg-white/90 text-slate-900',
          'dark:border-white/10 dark:bg-black/70 dark:text-white',
          'backdrop-blur-2xl shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]',
          'flex items-center gap-4 px-5 py-4'
        )}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          className={cn(
            'text-cyan-600 hover:text-cyan-700 transition-colors',
            'dark:text-cyan-300/80 dark:hover:text-white',
            disabled && 'pointer-events-none opacity-40'
          )}
        >
          <Paperclip className="w-5 h-5" />
        </motion.button>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={2}
            maxLength={2000}
            className={cn(
              'w-full bg-transparent text-sm leading-relaxed placeholder:text-slate-400 text-slate-900',
              'dark:text-white dark:placeholder:text-white/40',
              'focus:outline-none resize-none max-h-32'
            )}
          />
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-slate-400 dark:text-white/30">
            <span>Shift + Enter yeni satır</span>
            <span>{content.length}/2000</span>
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className={cn(
            'text-cyan-600 hover:text-cyan-700 transition-colors',
            'dark:text-cyan-300/80 dark:hover:text-white',
            disabled && 'pointer-events-none opacity-40'
          )}
        >
          <Smile className="w-5 h-5" />
        </motion.button>

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-cyan-400 to-blue-600 text-white',
            'shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

