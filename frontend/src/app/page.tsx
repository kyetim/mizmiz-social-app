'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Users, MessageCircle, Heart, TrendingUp, Shield, Zap, Star, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

const features = [
  {
    icon: Sparkles,
    title: 'İçerik Paylaş',
    description: 'Düşüncelerini, fotoğraflarını ve deneyimlerini toplulukla paylaş',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
  },
  {
    icon: Users,
    title: 'Bağlantı Kur',
    description: 'İlgi alanlarına uygun kişileri keşfet ve takip et',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
  },
  {
    icon: MessageCircle,
    title: 'Etkileşim',
    description: 'Beğen, yorum yap ve anlamlı konuşmalar başlat',
    gradient: 'from-green-500 via-emerald-500 to-lime-500',
  },
  {
    icon: Heart,
    title: 'Topluluk',
    description: 'Ortak ilgi alanlarına sahip insanlarla bağlantı kur',
    gradient: 'from-red-500 via-pink-500 to-rose-500',
  },
  {
    icon: TrendingUp,
    title: 'Keşfet',
    description: 'Trend olan içerikleri ve popüler konuları keşfet',
    gradient: 'from-yellow-500 via-orange-500 to-amber-500',
  },
  {
    icon: Shield,
    title: 'Güvenlik',
    description: 'Verileriniz şifreli ve güvende, gizliliğiniz bizim önceliğimiz',
    gradient: 'from-indigo-500 via-purple-500 to-violet-500',
  },
]

const stats = [
  { label: 'Aktif Kullanıcı', value: '10K+', icon: Users },
  { label: 'Paylaşılan İçerik', value: '50K+', icon: Zap },
  { label: 'Günlük Etkileşim', value: '100K+', icon: Star },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const floatingVariants = {
  animate: {
    y: [-20, 20, -20],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function HomePage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 animated-gradient opacity-30" />
        
        {/* Floating Orbs */}
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"
        />

        <motion.div
          style={{ y, opacity }}
          className="container relative z-10 mx-auto px-6 py-20 md:py-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.3 
              }}
              className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full mb-8 shadow-lg hover:shadow-xl transition-all group cursor-pointer"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="size-5 text-purple-600" />
              </motion.div>
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Yeni nesil sosyal platform
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="size-4 text-purple-600" />
              </motion.div>
            </motion.div>

            {/* Main Heading with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight"
            >
              <span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                MIZMIZ
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-3xl text-slate-700 dark:text-slate-300 mb-4 font-light max-w-3xl mx-auto"
            >
              Topluluk deneyimini yeniden keşfet
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto"
            >
              Paylaş, bağlan, etkileş. Modern sosyal medya deneyiminin yeni adresi.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            >
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border-0"
              >
                <a href="/register" className="flex items-center gap-2">
                  <span className="relative z-10">Hemen Başla</span>
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="glass hover:glass-dark border-2 border-purple-200 dark:border-purple-800 px-8 py-6 text-lg rounded-2xl hover:scale-105 transition-all duration-300 backdrop-blur-xl"
              >
                <a href="/login" className="text-purple-700 dark:text-purple-300 font-semibold">
                  Giriş Yap
                </a>
              </Button>
            </motion.div>

            {/* Stats with Glass Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass p-6 rounded-2xl shadow-xl cursor-pointer group"
                  >
                    <Icon className="size-8 md:size-10 mx-auto mb-3 text-purple-600 group-hover:text-pink-600 transition-colors" />
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-purple-400 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-purple-600 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Neden MIZMIZ?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Modern sosyal medya deneyimi için ihtiyacın olan her şey, bir arada
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="glass p-8 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 h-full relative overflow-hidden">
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                    
                    {/* Icon with Gradient Background */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="size-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute bottom-8 right-8"
                    >
                      <ArrowRight className={`size-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-6"
            >
              <Globe className="size-20 text-white/90" />
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Topluluğa Katıl
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
              Binlerce kullanıcı zaten MIZMIZ'de. Sende aramıza katıl, deneyimi yaşa.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-7 text-xl rounded-2xl shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 font-bold group"
            >
              <a href="/register" className="flex items-center gap-3">
                Ücretsiz Başla
                <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-purple-200/50 dark:border-purple-800/50 py-12 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 MIZMIZ. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-8 text-sm">
              <a href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors font-medium">
                Kullanım Koşulları
              </a>
              <a href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors font-medium">
                Gizlilik
              </a>
              <a href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 transition-colors font-medium">
                İletişim
              </a>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
              v0.1.0 (MVP)
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
