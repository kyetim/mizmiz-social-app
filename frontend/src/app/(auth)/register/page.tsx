'use client'

import { ModernRegisterForm } from '@/components/auth/modern-register-form'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { motion } from 'framer-motion'

const FloatingCube = dynamic(
  () => import('@/components/3d/floating-cube').then((mod) => mod.FloatingCube),
  { ssr: false }
)

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 items-center justify-center p-12 relative overflow-hidden transition-colors duration-300">
        {/* 3D Floating Cube */}
        <div className="absolute inset-0 opacity-20">
          <FloatingCube />
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-72 h-72 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-60 animate-pulse"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
          >
            Topluluğa<br />katıl
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
          >
            Binlerce kullanıcıya katıl, düşüncelerini paylaş ve
            ilham verici bir topluluğun parçası ol.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-6 mb-8"
          >
            {[
              { value: '1.2K+', label: 'Kullanıcı' },
              { value: '5K+', label: 'Gönderi' },
              { value: '10K+', label: 'Etkileşim' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '🎨', text: 'Kişiselleştirilebilir profil' },
              { icon: '💬', text: 'Gerçek zamanlı etkileşim' },
              { icon: '🚀', text: 'Hızlı ve kolay paylaşım' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
              >
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-lg">{feature.icon}</span>
                </div>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Avatar Group */}
        <div className="absolute top-1/3 right-12 flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
              className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              style={{ transform: `translateY(${i * 4}px)` }}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md"
            >
              <span className="text-white font-bold text-xl">M</span>
            </motion.div>
            <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white transition-colors">
              MIZMIZ
            </span>
          </Link>

          {/* Form */}
          <ModernRegisterForm />

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
