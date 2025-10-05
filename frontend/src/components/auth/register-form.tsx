'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Loader2, Check, X } from 'lucide-react'
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

export function RegisterForm() {
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

    if (strength <= 2) return { label: 'Zayıf', strength, color: 'bg-destructive' }
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
      
      // Force navigation after short delay to ensure token is stored
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
    <div className="w-full">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Hesap Oluştur
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400">
          Topluluğa katılmak için bilgilerini gir
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-semibold">
            Kullanıcı Adı
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="kullanici_adi"
            autoComplete="username"
            disabled={isLoading}
            aria-invalid={!!errors.username}
            className="h-11 px-4 rounded-xl border-2 focus:border-purple-500 transition-all"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-red-500 font-medium">{errors.username.message}</p>
          )}
        </div>

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
            className="h-11 px-4 rounded-xl border-2 focus:border-purple-500 transition-all"
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
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={!!errors.password}
            className="h-11 px-4 rounded-xl border-2 focus:border-purple-500 transition-all"
            {...register('password')}
          />

          {/* Password Strength Indicator */}
          {password && password.length > 0 && (
            <div className="space-y-2 mt-2">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength
                      ? passwordStrength.color
                      : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Şifre gücü: <span className="font-semibold">{passwordStrength.label}</span>
              </p>
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-semibold">
              Şifre Tekrarı
            </Label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? 'Gizle' : 'Göster'}
            </button>
          </div>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              className="h-11 px-4 rounded-xl border-2 focus:border-purple-500 transition-all pr-12"
              {...register('confirmPassword')}
            />
            {confirmPassword && confirmPassword.length > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {password === confirmPassword ? (
                  <Check className="size-5 text-green-500" />
                ) : (
                  <X className="size-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Kayıt olarak{' '}
          <a href="/terms" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
            Kullanım Koşulları
          </a>{' '}
          ve{' '}
          <a href="/privacy" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
            Gizlilik Politikası
          </a>
          'nı kabul etmiş olursunuz
        </p>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Hesap oluşturuluyor...
            </>
          ) : (
            'Hesap Oluştur'
          )}
        </Button>

        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mt-6">
          Zaten hesabın var mı?{' '}
          <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
            Giriş yap
          </a>
        </p>
      </form>
    </div>
  )
}

