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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api/auth'

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
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      })
      
      toast.success('Kayıt başarılı! Hoş geldiniz 🎉')
      router.push('/login')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Hesap Oluştur
        </CardTitle>
        <CardDescription className="text-center">
          Topluluğa katılmak için bilgilerini gir
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              type="text"
              placeholder="kullanici_adi"
              autoComplete="username"
              disabled={isLoading}
              aria-invalid={!!errors.username}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Şifre</Label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
              {...register('password')}
            />
            
            {/* Password Strength Indicator */}
            {password && password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.strength
                          ? passwordStrength.color
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Şifre gücü: <span className="font-medium">{passwordStrength.label}</span>
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                {...register('confirmPassword')}
              />
              {confirmPassword && confirmPassword.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {password === confirmPassword ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <X className="size-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            Kayıt olarak{' '}
            <a href="/terms" className="text-primary hover:underline">
              Kullanım Koşulları
            </a>{' '}
            ve{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Gizlilik Politikası
            </a>
            'nı kabul etmiş olursunuz
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Hesap oluşturuluyor...
              </>
            ) : (
              'Hesap Oluştur'
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Zaten hesabın var mı?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Giriş yap
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

