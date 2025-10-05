'use client'

import Link from 'next/link'
import { ArrowRight, Users, Zap, Shield, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm"
              >
                <span className="text-white font-bold text-lg">M</span>
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">MIZMIZ</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Giriş Yap
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-1 shadow-sm"
                >
                  Başla
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full mb-6"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                1,234 kullanıcı aktif
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight"
            >
              Modern sosyal<br />
              <span className="text-green-600 dark:text-green-400">deneyim</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
            >
              Düşüncelerini paylaş, insanlarla bağlantı kur ve ilham verici
              bir topluluğun parçası ol. Tamamen ücretsiz.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 group"
                >
                  Ücretsiz Başla
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border-2 border-gray-300 dark:border-gray-700 inline-flex items-center gap-2 shadow-sm"
                >
                  Giriş Yap
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
            >
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Güvenli</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Ücretsiz</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>1K+ Kullanıcı</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 px-6 transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Neden MIZMIZ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Modern, hızlı ve kullanıcı dostu bir platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Hızlı ve Modern',
                description: 'Son teknoloji ile geliştirilmiş, hızlı ve akıcı bir deneyim',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Güvenli ve Gizli',
                description: 'Verileriniz güvende, gizliliğiniz bizim için öncelik',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Topluluk Odaklı',
                description: 'Gerçek insanlarla gerçek bağlantılar kur',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700 hover:shadow-lg transition-all group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Decorative Elements */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
              className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Hemen katıl, ücretsiz başla
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl text-green-50 mb-8 max-w-2xl mx-auto"
              >
                Binlerce kullanıcının deneyimlediği modern sosyal platformu sen de keşfet
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-xl group"
                >
                  Ücretsiz Hesap Oluştur
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <span className="text-white font-bold">M</span>
              </motion.div>
              <span className="font-bold text-gray-900 dark:text-white transition-colors">MIZMIZ</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Kullanım Koşulları</a>
              <a href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Gizlilik</a>
              <a href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">İletişim</a>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 MIZMIZ. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
