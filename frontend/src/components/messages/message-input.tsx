import { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { Paperclip, Send, Smile, X, Image as ImageIcon, File as FileIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'

interface MessageInputProps {
  onSend: (content: string, file?: File) => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({ onSend, disabled = false, placeholder = 'Mesaj yazın...' }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSend = () => {
    const trimmedContent = content.trim()
    if ((trimmedContent || selectedFile) && !disabled) {
      onSend(trimmedContent, selectedFile || undefined)
      setContent('')
      setSelectedFile(null)
      setPreviewUrl(null)
      setShowEmojiPicker(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)

      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="px-2 lg:px-6 pb-4 relative">
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-full left-6 mb-2 z-50"
            ref={emojiPickerRef}
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.AUTO}
              width={320}
              height={400}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-6 right-6 mb-2 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg flex items-center gap-3"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-black/5 dark:border-white/5">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <FileIcon className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          'w-full rounded-[28px] border border-black/5 bg-white/90 text-slate-900',
          'dark:border-white/10 dark:bg-black/70 dark:text-white',
          'backdrop-blur-2xl shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]',
          'flex items-end gap-3 px-4 py-3'
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,application/pdf"
        />

        <div className="flex gap-1 pb-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors',
              'text-cyan-600 dark:text-cyan-400',
              disabled && 'pointer-events-none opacity-40'
            )}
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={cn(
              'p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors',
              'text-cyan-600 dark:text-cyan-400',
              showEmojiPicker && 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600',
              disabled && 'pointer-events-none opacity-40'
            )}
          >
            <Smile className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex-1 py-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            style={{ minHeight: '24px' }}
            maxLength={2000}
            className={cn(
              'w-full bg-transparent text-sm leading-relaxed placeholder:text-slate-400 text-slate-900',
              'dark:text-white dark:placeholder:text-white/40',
              'focus:outline-none resize-none max-h-32 py-1'
            )}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`
            }}
          />
        </div>

        <motion.button
          type="button"
          onClick={handleSend}
          disabled={(!content.trim() && !selectedFile) || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5',
            'bg-gradient-to-br from-cyan-400 to-blue-600 text-white',
            'shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
          )}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </motion.button>
      </div>
    </div>
  )
}

