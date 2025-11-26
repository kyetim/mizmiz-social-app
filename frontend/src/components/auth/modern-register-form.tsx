'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { ArrowRight, Check, Eye, EyeOff, Loader2, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/api/auth'
import { formatValidationErrors, showErrorToast } from '@/lib/utils/error-handler'
import { PasswordStrengthMeter } from './password-strength-meter'

// Strong password validation (matches backend requirements)
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
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Şifre en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter (@$!%*?&) içermelidir'
    ),
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
    setError,
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

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    try {
      await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      // Token is now in httpOnly cookie, automatically handled

      // Success message
      toast.success('Kayıt başarılı! Hoş geldiniz 🎉', {
        icon: '🎉',
        duration: 2000,
      })

      // Small delay before redirect for better UX
      setTimeout(() => {
        router.push('/feed')
        router.refresh()
      }, 500)
    } catch (error: any) {
      showErrorToast(error, {
        icon: <AlertCircle className="w-5 h-5" />,
      })

      // Handle validation errors
      const validationErrors = formatValidationErrors(error)
      if (Object.keys(validationErrors).length > 0) {
        // Set form errors
        Object.entries(validationErrors).forEach(([field, message]) => {
          if (field === 'username' || field === 'email' || field === 'password') {
            setError(field as 'username' | 'email' | 'password', { message })
          }
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Hesap oluştur
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Topluluğa katılmak için bilgilerini gir
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
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

          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password || ''} />

          {errors.password && (
            <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
          &apos;nı kabul etmiş olursunuz
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 sm:h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group min-h-[48px]"
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
            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
              VEYA
            </span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabın var mı?{' '}
            <a
              href="/login"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
            >
              Giriş yap
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

