'use client'

import { ModernRegisterForm } from '@/components/auth/modern-register-form'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const FloatingCube = dynamic(
  () => import('@/components/3d/floating-cube').then((mod) => mod.FloatingCube),
  { ssr: false }
)

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-50 via-white to-primary-50 items-center justify-center p-12 relative overflow-hidden">
        {/* 3D Floating Cube */}
        <div className="absolute inset-0 opacity-20">
          <FloatingCube />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Topluluğa<br />katıl
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Binlerce kullanıcıya katıl, düşüncelerini paylaş ve
            ilham verici bir topluluğun parçası ol.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { value: '1.2K+', label: 'Kullanıcı' },
              { value: '5K+', label: 'Gönderi' },
              { value: '10K+', label: 'Etkileşim' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '🎨', text: 'Kişiselleştirilebilir profil' },
              { icon: '💬', text: 'Gerçek zamanlı etkileşim' },
              { icon: '🚀', text: 'Hızlı ve kolay paylaşım' },
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

        {/* Floating Avatar Group */}
        <div className="absolute top-1/3 right-12 flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full border-4 border-white shadow-lg"
              style={{ transform: `translateY(${i * 4}px)` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
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
          <ModernRegisterForm />

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
    </div>
  )
}
