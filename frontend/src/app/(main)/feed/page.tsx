'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/auth-slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FeedPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user, isAuthenticated } = useAppSelector((state) => state.auth)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
        }
    }, [router])

    function handleLogout() {
        dispatch(logout())
        router.push('/login')
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            MIZMIZ
                        </h1>
                        <nav className="hidden md:flex gap-6">
                            <a href="/feed" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                Ana Sayfa
                            </a>
                            <a href="/explore" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Keşfet
                            </a>
                            <a href="/notifications" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Bildirimler
                            </a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                            Hoş geldin, <span className="font-medium text-foreground">{user.username}</span>
                        </span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Çıkış Yap
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Welcome Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🎉 Hoş Geldin!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                MIZMIZ sosyal platformuna başarıyla giriş yaptın!
                            </p>

                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Kullanıcı Adı</p>
                                    <p className="font-medium">{user.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                {user.firstName && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ad</p>
                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Üyelik Tarihi</p>
                                    <p className="font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="font-semibold mb-2">🚧 Geliştirme Aşamasında</h3>
                                <p className="text-sm text-muted-foreground">
                                    Bu sayfa şu anda geliştirme aşamasında. Yakında post paylaşma,
                                    beğenme ve yorum yapma özelliklerini ekleyeceğiz!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coming Soon Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📋 Yakında Gelecek Özellikler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">⏳</span>
                                    Post oluşturma ve paylaşma
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">⏳</span>
                                    Beğenme ve yorum yapma
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">⏳</span>
                                    Kullanıcı takip sistemi
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">⏳</span>
                                    Bildirimler
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">⏳</span>
                                    Keşfet sayfası
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

