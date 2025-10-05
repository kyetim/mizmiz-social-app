'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/auth-slice'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/ui/post-card'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { Bell, Home, Search, User, LogOut, Plus, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link href="/feed" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">M</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">MIZMIZ</span>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                <Link
                                    href="/feed"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    Ana Sayfa
                                </Link>
                                <Link
                                    href="/explore"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Keşfet
                                </Link>
                                <Link
                                    href="/people"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Users className="w-4 h-4" />
                                    İnsanlar
                                </Link>
                            </nav>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Ara..."
                                    className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 w-48"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium text-gray-900">
                                        {user.username}
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Çıkış Yap"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-[1fr_300px] gap-6">
                        {/* Feed Column */}
                        <div className="space-y-4">
                            {/* Create Post Card */}
                            <GlassmorphismCard hover={false}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <button className="flex-1 text-left px-4 py-3 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg text-gray-500 text-sm transition-colors backdrop-blur-sm">
                                        Ne düşünüyorsun?
                                    </button>
                                    <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </GlassmorphismCard>

                            {/* Welcome Card */}
                            <GlassmorphismCard className="bg-gradient-to-br from-primary-50/80 to-white/80 border-primary-100">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                                            🎉 Hoş geldin, {user.firstName || user.username}!
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            MIZMIZ sosyal platformuna başarıyla giriş yaptın
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white/80 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">0</div>
                                        <div className="text-xs text-gray-600">Gönderi</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">0</div>
                                        <div className="text-xs text-gray-600">Takipçi</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">0</div>
                                        <div className="text-xs text-gray-600">Takip</div>
                                    </div>
                                </div>

                                <Link
                                    href="/profile"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    Profilini tamamla
                                </Link>
                            </GlassmorphismCard>

                            {/* Example Posts with Glassmorphism */}
                            <PostCard
                                author={{
                                    name: "Ahmet Yılmaz",
                                    username: "ahmetyilmaz",
                                }}
                                content="MIZMIZ platformunu yeni keşfettim! Modern tasarımı ve kullanıcı dostu arayüzü gerçekten çok başarılı. Topluluğa katılmaktan mutluyum! 🎉"
                                timestamp="5 dk önce"
                                likes={12}
                                comments={3}
                            />

                            <PostCard
                                author={{
                                    name: "Ayşe Demir",
                                    username: "aysedemir",
                                }}
                                content="Bugün yeni bir proje başlattım. Next.js 15 ve TypeScript kombinasyonu harika çalışıyor! Tavsiye ederim. 🚀"
                                timestamp="15 dk önce"
                                likes={24}
                                comments={8}
                            />

                            <PostCard
                                author={{
                                    name: "Mehmet Kaya",
                                    username: "mehmetkaya",
                                }}
                                content="Minimal ve temiz tasarımın gücünü asla hafife almayın. Kullanıcı deneyimi her şeyden önemli! 💚"
                                timestamp="1 saat önce"
                                likes={45}
                                comments={12}
                            />

                            {/* Coming Soon Card */}
                            <GlassmorphismCard>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    🚧 Yakında Gelecek Özellikler
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: '📝', text: 'Post oluşturma ve paylaşma', status: 'Sprint 4' },
                                        { icon: '❤️', text: 'Beğenme ve yorum yapma', status: 'Sprint 5' },
                                        { icon: '👥', text: 'Kullanıcı takip sistemi', status: 'Sprint 6' },
                                        { icon: '🔔', text: 'Bildirim sistemi', status: 'Sprint 7' },
                                        { icon: '🌟', text: 'Keşfet sayfası', status: 'Sprint 8' },
                                    ].map((feature, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{feature.icon}</span>
                                                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-white rounded">
                                                {feature.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </GlassmorphismCard>
                        </div>

                        {/* Sidebar */}
                        <div className="hidden md:block space-y-4">
                            {/* User Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-white text-2xl font-bold">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900">@{user.username}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-600 mb-2">
                                        Üyelik Tarihi
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Trending Topics */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h3 className="font-bold text-gray-900 mb-4">📈 Trend Konular</h3>
                                <div className="space-y-3">
                                    {['#development', '#design', '#startup', '#ai', '#tech'].map((tag, i) => (
                                        <a
                                            key={i}
                                            href={`/explore?tag=${tag.slice(1)}`}
                                            className="block text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                        >
                                            {tag}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
