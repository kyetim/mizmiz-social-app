'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  Sparkles,
  Shield,
  MousePointerClick,
  Zap,
  Globe,
  Heart,
  Users,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { AmbientBackground } from '@/components/layout/ambient-background'

type Metric = {
  value: string
  label: string
  detail: string
}

type BentoCard = {
  title: string
  description: string
  detail: string
  icon: LucideIcon
  className: string
  accent: string
  cta?: string
}

type TimelineItem = {
  badge: string
  title: string
  copy: string
}

const heroMetrics: Metric[] = [
  { value: '12K+', label: 'aktif kullanıcı', detail: 'Topluluk canlı verilerle yenileniyor' },
  { value: '60fps', label: 'scroll animasyonu', detail: 'Lenis + GSAP ile akışkan geçişler' },
  { value: '∞', label: 'dark/light mod', detail: 'Neon vurgular iki moda da uyumlu' },
]

const bentoGrid: BentoCard[] = [
  {
    title: 'Bento Grid Layout',
    description: 'Asimetrik kartlar Apple tarzı deneyim sunuyor.',
    detail: 'Aceternity + Magic UI yaklaşımı ile tamamen özelleştirilebilir.',
    icon: Sparkles,
    className: 'md:col-span-3 lg:col-span-4 row-span-2',
    accent: 'from-emerald-400/20 to-cyan-400/10',
    cta: 'Explore feed',
  },
  {
    title: 'Glassmorphism Cards',
    description: 'Frosted glass yüzeyler neon sınırlar ile birleşti.',
    detail: 'Light & dark modlarda otomatik kontrast.',
    icon: Shield,
    className: 'md:col-span-3 lg:col-span-2',
    accent: 'from-white/40 to-emerald-200/10 dark:from-slate-800/60 dark:to-emerald-500/10',
  },
  {
    title: 'Spotlight Effect',
    description: 'Mouse hareketine yanıt veren spotlight ile etkileşim artıyor.',
    detail: 'Framer Motion + custom shader benzeri gradientler.',
    icon: MousePointerClick,
    className: 'md:col-span-2 lg:col-span-2',
    accent: 'from-emerald-500/10 via-cyan-500/10 to-transparent',
  },
  {
    title: 'Scroll-driven Animations',
    description: 'GSAP ScrollTrigger ile sahne sahne hikaye anlatımı.',
    detail: 'Bölümler arası keskin sınırlar yerine renk geçişleri.',
    icon: Zap,
    className: 'md:col-span-2 lg:col-span-3 row-span-2',
    accent: 'from-amber-400/10 to-pink-500/10',
  },
  {
    title: 'Dark Mode with Neon Accents',
    description: 'Siyah zemin üzerinde neon yeşilleri, mor auroralar.',
    detail: 'WCAG AA kontrastı koruyan renk sistemi.',
    icon: Globe,
    className: 'md:col-span-2 lg:col-span-2',
    accent: 'from-emerald-500/20 via-lime-400/20 to-transparent',
  },
  {
    title: 'Radial Gradient Mesh',
    description: 'Yumuşak geçişli arka planlar immersive hissi güçlendirir.',
    detail: 'Cihaz başına GPU dostu blur seviyeleri.',
    icon: Waves,
    className: 'md:col-span-2 lg:col-span-3',
    accent: 'from-cyan-500/15 via-purple-500/15 to-pink-500/10',
  },
]

const immersiveTimeline: TimelineItem[] = [
  {
    badge: '01 • Dikey akış',
    title: 'Hero sonrası boşluk yok, içerik hemen başlıyor',
    copy: 'Yukarıdan aşağı akan bloklar Lenis sayesinde kesintisiz, her bölümde radial mesh ile renkler birbirine akıyor.',
  },
  {
    badge: '02 • Scroll-driven',
    title: 'GSAP sahne geçişleri',
    copy: 'Kartlar viewport’a girdiğinde parlayıp yerine oturuyor, timeline çizgisi scroll’a göre büyüyor.',
  },
  {
    badge: '03 • Immersive CTA',
    title: 'Neon çerçeveli çağrı',
    copy: 'Kullanıcıyı kayıt akışına yönlendiren aurora arka planlı CTA, dark & light modlarda aynı etkiyi veriyor.',
  },
]

let gsapRegistered = false

export default function HomePage() {
  const bentoRef = useRef<HTMLDivElement | null>(null)
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!gsapRegistered) {
      gsap.registerPlugin(ScrollTrigger)
      gsapRegistered = true
    }

    const contexts: gsap.Context[] = []

    if (bentoRef.current) {
      contexts.push(
        gsap.context(() => {
          const cards = gsap.utils.toArray<HTMLElement>('.feature-card')
          cards.forEach((card, index) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 80, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.1,
                delay: index * 0.05,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  once: true,
                },
              },
            )
          })
        }, bentoRef),
      )
    }

    if (timelineRef.current) {
      contexts.push(
        gsap.context(() => {
          gsap.fromTo(
            '.timeline-line',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineRef.current,
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: true,
              },
            },
          )
        }, timelineRef),
      )
    }

    return () => {
      contexts.forEach((ctx) => ctx.revert())
    }
  }, [])

  const handleSpotlight = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background/95 to-background text-foreground">
      <AmbientBackground />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/40"
            >
              M
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-[0.3em] text-emerald-500">MIZMIZ</span>
              <span className="text-base font-medium text-muted-foreground">Immersive social layer</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:border-emerald-400/60 hover:text-foreground md:inline-flex"
            >
              Giriş Yap
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30"
              >
                Başla
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="relative mt-28 space-y-24 px-4 pb-24 pt-10 sm:px-6 lg:px-0">
        {/* Hero */}
        <section className="mx-auto max-w-6xl">
          <div
            className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/80 p-6 text-left shadow-2xl shadow-emerald-500/10 transition dark:border-white/5 dark:bg-gray-900/80"
            onPointerMove={handleSpotlight}
            onPointerLeave={() => setSpotlight({ x: 50, y: 50 })}
          >
            <div className="pointer-events-none absolute inset-0 aurora-trace" />
            <div
              className="pointer-events-none absolute inset-0 transition duration-500"
              style={{
                background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(16, 185, 129, 0.25), transparent 55%)`,
              }}
            />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200"
                >
                  <Sparkles className="h-4 w-4" />
                  Dark Mode with Neon Accents
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="space-y-6"
                >
                  <h1 className="text-4xl leading-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
                    Dikey, immersive ve <span className="text-emerald-500">scroll-driven</span> sosyal deneyim
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Bento grid layout, glassmorphism yüzeyler, spotlight efektleri ve Lenis destekli smooth scroll ile
                    modern web’in tasarım sözlüğündeki tüm anahtar kelimeleri tek yerde topladık.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <Link
                    href="/register"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-600/40 transition hover:shadow-emerald-400/50 sm:w-auto"
                  >
                    Ücretsiz Başla
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/40 px-6 py-4 text-base font-semibold text-foreground/80 backdrop-blur-md transition hover:border-emerald-400/60 sm:w-auto"
                  >
                    Giriş Yap
                  </Link>
                </motion.div>

                <div className="grid gap-4 md:grid-cols-3">
                  {heroMetrics.map((metric) => (
                    <GlassmorphismCard key={metric.label} className="bg-white/50 p-4 dark:bg-black/30">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
                      <p className="text-3xl font-semibold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.detail}</p>
                    </GlassmorphismCard>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 blur-3xl">
                  <div className="radial-gradient-mesh h-full w-full opacity-80 dark:opacity-60" />
                </div>
                <div className="relative grid gap-4">
                  <GlassmorphismCard className="bg-white/60 p-6 dark:bg-slate-900/70">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Realtime vibe</span>
                      <Users className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="mt-4 text-4xl font-semibold text-foreground">+342</p>
                    <p className="text-xs text-muted-foreground">dakikada topluluğa katılan yeni kişi</p>
                  </GlassmorphismCard>
                  <GlassmorphismCard className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-6 shadow-xl shadow-emerald-500/20 dark:from-emerald-500/30 dark:to-cyan-500/10">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/80">Magic UI vibes</p>
                    <p className="mt-2 text-3xl font-bold text-white">Aurora background</p>
                    <p className="text-sm text-white/80">Aurora & spotlight aynı anda çalışır.</p>
                  </GlassmorphismCard>
                  <GlassmorphismCard className="bg-white/70 p-6 dark:bg-slate-900/60">
                    <div className="flex items-center gap-3">
                      <Heart className="h-6 w-6 text-rose-400" />
                      <div>
                        <p className="text-sm font-semibold">Topluluk modu</p>
                        <p className="text-xs text-muted-foreground">Günlük 480K etkileşim</p>
                      </div>
                    </div>
                  </GlassmorphismCard>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="mx-auto max-w-6xl space-y-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.5em] text-emerald-500">Bento Grid Layout</p>
            <h2 className="text-3xl font-semibold text-foreground md:text-5xl">
              Kartların boyutları ve animasyonları Magic UI ve shadcn tabanlı sistemle yönetiliyor
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Radial gradient mesh, glassmorphism ve spotlight efektleri aynı ızgara üzerinde harmanlandı. Her kart kendi
              mikro animasyonuna sahip.
            </p>
          </div>

          <div
            ref={bentoRef}
            className="grid auto-rows-[220px] gap-4 md:grid-cols-4 lg:auto-rows-[260px] lg:grid-cols-6"
          >
            {bentoGrid.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className={`feature-card group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br ${card.accent} p-6 text-left backdrop-blur-xl dark:border-white/10 ${card.className}`}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="aurora-trace h-full w-full" />
                  </div>
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/30 px-3 py-1 text-xs font-semibold text-foreground/90 dark:bg-white/10 dark:text-white">
                        <Icon className="h-4 w-4" />
                        {card.title}
                      </div>
                      <p className="text-lg font-semibold text-foreground">{card.description}</p>
                      <p className="text-sm text-muted-foreground">{card.detail}</p>
                    </div>
                    {card.cta ? (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        {card.cta}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Scroll-driven narrative */}
        <section className="mx-auto max-w-5xl space-y-12" ref={timelineRef}>
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-500">Scroll-driven Animations</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Lenis ile akışkan, GSAP ile anlatan dikey akış</h2>
            <p className="text-lg text-muted-foreground">
              Bölümler arası keskin çizgiler yok; renkler birbirine karışıyor, timeline çizgisi scroll sırasında
              büyüyor.
            </p>
          </div>

          <div className="relative pl-10">
            <span className="timeline-line absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-emerald-400 via-cyan-400 to-transparent" />
            <div className="space-y-10">
              {immersiveTimeline.map((item) => (
                <div key={item.badge} className="relative rounded-3xl border border-white/10 bg-white/70 p-6 shadow-lg dark:bg-gray-900/70">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                    {item.badge}
                  </span>
                  <h3 className="text-2xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[36px] border border-emerald-500/30 bg-gradient-to-br from-gray-900 via-emerald-900/40 to-gray-900 p-10 text-center text-white shadow-emerald-500/30 dark:border-emerald-500/50">
            <div className="absolute inset-0 aurora-trace opacity-70" />
            <div className="relative z-10 space-y-6">
              <p className="text-sm uppercase tracking-[0.6em] text-emerald-200">Immersive CTA</p>
              <h2 className="text-3xl font-semibold md:text-5xl">Scroll’un sonunda bile enerjisi düşmeyen çağrı</h2>
              <p className="text-lg text-emerald-100">
                Lenis, GSAP, Framer Motion, shadcn/ui ve Magic UI esintileri ile modern sosyal deneyime giriş yap.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/register"
                  className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-white px-8 py-3 text-base font-semibold text-emerald-600 shadow-xl shadow-white/20 hover:bg-emerald-50"
                >
                  Hesap Oluştur
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/40 px-8 py-3 text-base font-semibold text-white backdrop-blur-lg hover:border-white"
                >
                  Zaten üyeyim
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-white/70 px-4 py-10 text-sm text-muted-foreground backdrop-blur-xl dark:bg-gray-900/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">M</div>
            <div>
              <p className="font-semibold text-foreground">MIZMIZ</p>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">Modern sosyal deneyim</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-foreground">
              Kullanım Koşulları
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Gizlilik
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              İletişim
            </Link>
          </div>
          <p>© 2025 MIZMIZ. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
