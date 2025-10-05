'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { ArrowRight, Check, Eye, EyeOff, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/api/auth'

// Validation schema
const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
    .max(30, 'Kullanıcı adı en fazla 30 karakter olabilir')
    .regex(/^[a-zA-Z0-9_]+$/, 'Sadece harf, rakam ve _ kullanabilirsiniz'),
  email: z
    .string()
    .min(1, 'Email gereklidir')
    .email('Geçerli bir email adresi giriniz'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre çok uzun'),
  confirmPassword: z
    .string()
    .min(1, 'Şifre tekrarı gereklidir'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export function ModernRegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', strength: 0, color: '' }

    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 10) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++

    if (strength <= 2) return { label: 'Zayıf', strength, color: 'bg-red-500' }
    if (strength === 3) return { label: 'Orta', strength, color: 'bg-yellow-500' }
    return { label: 'Güçlü', strength, color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(password || '')

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    try {
      const response = await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      // Automatically log in after successful registration
      localStorage.setItem('token', response.token)
      toast.success('Kayıt başarılı! Hoş geldiniz 🎉')

      setTimeout(() => {
        router.push('/feed')
        router.refresh()
      }, 100)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Hesap oluştur
        </h1>
        <p className="text-gray-600 text-sm">
          Topluluğa katılmak için bilgilerini gir
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            Kullanıcı Adı
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="kullanici_adi"
            autoComplete="username"
            disabled={isLoading}
            className="h-11 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 transition-colors"
            aria-invalid={!!errors.username}
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-red-600 font-medium">{errors.username.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@email.com"
            autoComplete="email"
            disabled={isLoading}
            className="h-11 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 transition-colors"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Şifre
            </Label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Gizle
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Göster
                </span>
              )}
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            className="h-11 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 transition-colors"
            aria-invalid={!!errors.password}
            {...register('password')}
          />

          {/* Password Strength Indicator */}
          {password && password.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength
                        ? passwordStrength.color
                        : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                Şifre gücü: <span className="font-semibold">{passwordStrength.label}</span>
              </p>
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Şifre Tekrarı
            </Label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Gizle
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Göster
                </span>
              )}
            </button>
          </div>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              className="h-11 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 transition-colors pr-12"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {confirmPassword && confirmPassword.length > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {password === confirmPassword ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 leading-relaxed">
          Kayıt olarak{' '}
          <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Kullanım Koşulları
          </a>{' '}
          ve{' '}
          <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Gizlilik Politikası
          </a>
          'nı kabul etmiş olursunuz
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Hesap oluşturuluyor...
            </>
          ) : (
            <>
              Hesap Oluştur
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-gray-500 font-medium">
              VEYA
            </span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <a
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Giriş yap
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

