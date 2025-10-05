'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Users, MessageCircle, Heart, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Sparkles,
    title: 'İçerik Paylaş',
    description: 'Düşüncelerini, fotoğraflarını ve deneyimlerini toplulukla paylaş',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Bağlantı Kur',
    description: 'İlgi alanlarına uygun kişileri keşfet ve takip et',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageCircle,
    title: 'Etkileşim',
    description: 'Beğen, yorum yap ve anlamlı konuşmalar başlat',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Heart,
    title: 'Topluluk',
    description: 'Ortak ilgi alanlarına sahip insanlarla bağlantı kur',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Keşfet',
    description: 'Trend olan içerikleri ve popüler konuları keşfet',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: Shield,
    title: 'Güvenlik',
    description: 'Verileriniz şifreli ve güvende, gizliliğiniz bizim önceliğimiz',
    color: 'from-indigo-500 to-purple-500',
  },
]

const stats = [
  { label: 'Aktif Kullanıcı', value: '10K+' },
  { label: 'Paylaşılan İçerik', value: '50K+' },
  { label: 'Günlük Etkileşim', value: '100K+' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8"
            >
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-medium">Yeni nesil sosyal platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-accent bg-clip-text text-transparent leading-tight"
            >
              MIZMIZ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Topluluk deneyimini yeniden keşfet. Paylaş, bağlan, etkileş.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
              >
                <a href="/register">
                  Hemen Başla
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 hover:bg-primary/5"
              >
                <a href="/login">Giriş Yap</a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Neden MIZMIZ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern sosyal medya deneyimi için ihtiyacın olan her şey
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border-border/50">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="size-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative overflow-hidden border-primary/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
              <CardContent className="relative p-12 md:p-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Topluluğa Katıl
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Binlerce kullanıcı zaten MIZMIZ&apos;de. Sende aramıza katıl, deneyimi yaşa.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                >
                  <a href="/register">
                    Ücretsiz Başla
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 MIZMIZ. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Kullanım Koşulları
              </a>
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Gizlilik
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                İletişim
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              Versiyon 0.1.0 (MVP)
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
