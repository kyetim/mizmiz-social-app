'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login } from '@/store/slices/auth-slice'
import { formatValidationErrors, showErrorToast } from '@/lib/utils/error-handler'

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email gereklidir')
    .email('Geçerli bir email adresi giriniz'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre çok uzun'),
})

interface LoginFormData {
  email: string
  password: string
}

export function ModernLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const redirectTo = searchParams.get('redirect') || '/feed'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      const result = await dispatch(login(data)).unwrap()

      // Success message
      toast.success('Giriş başarılı! Hoş geldiniz 🎉', {
        icon: '🎉',
        duration: 2000,
      })

      router.push(redirectTo)
    } catch (error: any) {
      showErrorToast(error, {
        icon: <AlertCircle className="w-5 h-5" />,
      })

      // Handle validation errors
      const validationErrors = formatValidationErrors(error)
      if (Object.keys(validationErrors).length > 0) {
        // Set form errors
        Object.entries(validationErrors).forEach(([field, message]) => {
          if (field === 'email' || field === 'password') {
            setError(field, { message })
          }
        })
      }
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Tekrar hoş geldin
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Hesabına giriş yapmak için bilgilerini gir
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
            autoComplete="current-password"
            disabled={isLoading}
            className="h-11 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 transition-colors"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Şifremi unuttum
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 sm:h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group min-h-[48px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Giriş yapılıyor...
            </>
          ) : (
            <>
              Giriş Yap
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

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hesabın yok mu?{' '}
            <a
              href="/register"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
            >
              Kayıt ol
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

