'use client'

import Link from 'next/link'
import { ArrowRight, Users, Zap, Shield, Heart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MIZMIZ</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-1"
              >
                Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary-700">
                1,234 kullanıcı aktif
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Modern sosyal<br />
              <span className="text-primary-600">deneyim</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Düşüncelerini paylaş, insanlarla bağlantı kur ve ilham verici
              bir topluluğun parçası ol. Tamamen ücretsiz.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 group"
              >
                Ücretsiz Başla
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 inline-flex items-center gap-2"
              >
                Giriş Yap
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-600" />
                <span>Güvenli</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary-600" />
                <span>Ücretsiz</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                <span>1K+ Kullanıcı</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden MIZMIZ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern, hızlı ve kullanıcı dostu bir platform
            </p>
          </div>

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
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hemen katıl, ücretsiz başla
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Binlerce kullanıcının deneyimlediği modern sosyal platformu sen de keşfet
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-xl group"
              >
                Ücretsiz Hesap Oluştur
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-gray-900">MIZMIZ</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="/terms" className="hover:text-gray-900 transition-colors">Kullanım Koşulları</a>
              <a href="/privacy" className="hover:text-gray-900 transition-colors">Gizlilik</a>
              <a href="/contact" className="hover:text-gray-900 transition-colors">İletişim</a>
            </div>

            <div className="text-sm text-gray-500">
              © 2025 MIZMIZ. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
