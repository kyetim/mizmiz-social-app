'use client'

import { motion } from 'framer-motion'
import { RegisterForm } from '@/components/auth/register-form'
import { Sparkles, Users } from 'lucide-react'

const floatingVariants = {
  animate: {
    y: [-15, 15, -15],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-20" />
      
      {/* Floating Orbs */}
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
      />
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
      />

      {/* Logo and Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <div className="p-4 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-2xl">
            <Users className="size-8 text-white" />
          </div>
        </motion.div>
        
        <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          MIZMIZ
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          Topluluğa katıl, deneyimi yaşa
        </p>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-1 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8">
            <RegisterForm />
          </div>
        </div>
      </motion.div>

      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 relative z-10"
      >
        <a 
          href="/" 
          className="inline-flex items-center gap-2 hover:text-purple-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
        >
          ← Ana sayfaya dön
        </a>
      </motion.div>
    </div>
  )
}
