'use client'

import { ModernLoginForm } from '@/components/auth/modern-login-form'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const FloatingSphere = dynamic(
  () => import('@/components/3d/floating-sphere').then((mod) => mod.FloatingSphere),
  { ssr: false }
)

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">
              MIZMIZ
            </span>
          </Link>

          {/* Form */}
          <ModernLoginForm />

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section with 3D Element */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-50 via-white to-primary-50 items-center justify-center p-12 relative overflow-hidden">
        {/* 3D Floating Sphere */}
        <div className="absolute inset-0 opacity-20">
          <FloatingSphere />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">1,234 kullanıcı aktif</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Topluluğuna<br />geri dön
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Arkadaşlarınla bağlantıda kal, düşüncelerini paylaş ve
            ilham verici içerikleri keşfet.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '✨', text: 'Modern ve hızlı arayüz' },
              { icon: '🔒', text: 'Güvenli ve gizli' },
              { icon: '🌍', text: 'Türkçe topluluk' },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 text-gray-700"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-lg">{feature.icon}</span>
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute bottom-12 right-12 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 animate-bounce-slow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full"></div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Yeni Gönderi</p>
              <p className="text-xs text-gray-500">2 dakika önce</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
