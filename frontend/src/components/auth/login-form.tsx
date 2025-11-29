'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
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

export function LoginForm() {
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
      toast.success('Giriş başarılı! Hoş geldiniz 🎉')

      // Wait for cookies to be set and then verify auth before redirect
      // This prevents redirect loop on mobile devices
      await new Promise(resolve => setTimeout(resolve, 300))

      // Force a page reload to ensure cookies are properly set and auth state is synced
      // This is especially important for mobile devices
      window.location.href = redirectTo
    } catch (error: any) {
      showErrorToast(error)

      const validationErrors = formatValidationErrors(error)
      Object.entries(validationErrors).forEach(([field, message]) => {
        if (field === 'email' || field === 'password') {
          setError(field, { message })
        }
      })
    }
  }

  return (
    <div className="w-full">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Giriş Yap
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400">
          Hesabına giriş yapmak için email ve şifreni gir
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@email.com"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            className="h-12 px-4 rounded-xl border-2 focus:border-purple-500 transition-all"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">
              Şifre
            </Label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
              tabIndex={-1}
            >
              {showPassword ? 'Gizle' : 'Göster'}
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            className="h-12 px-4 rounded-xl border-2 focus:border-purple-500 transition-all"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            Şifremi unuttum
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Giriş yapılıyor...
            </>
          ) : (
            'Giriş Yap'
          )}
        </Button>

        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mt-6">
          Hesabın yok mu?{' '}
          <a href="/register" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
            Kayıt ol
          </a>
        </p>
      </form>
    </div>
  )
}

