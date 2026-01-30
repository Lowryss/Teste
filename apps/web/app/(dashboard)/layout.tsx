'use client'

import { useAuth } from '@/contexts/AuthContext'
import { OnboardingGuard } from '@/components/OnboardingGuard'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Home, ShoppingBag, LogOut, History, User } from 'lucide-react'
import { DailyBonusButton } from '@/components/DailyBonus'
import { BackgroundAmbience } from '@/components/BackgroundAmbience'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-magenta-500 font-display text-xl">
                    Conectando ao Cosmos...
                </div>
            </div>
        )
    }

    if (!user) return null

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    const navLinks = [
        { href: '/dashboard', icon: Home, label: 'Início' },
        { href: '/history', icon: History, label: 'Histórico' },
        { href: '/shop', icon: ShoppingBag, label: 'Loja' },
        { href: '/profile', icon: User, label: 'Perfil' },
    ]

    return (
        <OnboardingGuard>
            <div className="min-h-screen bg-midnight-950 bg-noise relative font-sans text-magenta-50 selection:bg-magenta-200 selection:text-midnight-950">
                {/* Ambient Background Effects (Global) */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-radial-gradient from-midnight-900 to-midnight-950 opacity-80" />
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-magenta-900/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] mix-blend-screen opacity-50" />
                </div>

                {/* Header */}
                <header className="border-b border-magenta-50/5 bg-midnight-950/80 backdrop-blur-md sticky top-0 z-40 relative">
                    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                        {/* Logo - Clicável */}
                        <Link href="/dashboard" className="font-display font-light text-2xl text-magenta-50 tracking-tighter hover:text-magenta-200 transition-colors">
                            Guia<span className="text-magenta-200/50">.</span>
                        </Link>

                        {/* Navegação Central */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${pathname === link.href
                                        ? 'text-magenta-200 bg-magenta-500/10 border-b-2 border-magenta-500'
                                        : 'text-magenta-200/60 hover:text-magenta-200 hover:bg-white/5'
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Área direita */}
                        <div className="flex items-center gap-3">
                            {/* Daily Bonus */}
                            <DailyBonusButton />

                            {/* Pontos */}
                            <Link
                                href="/shop"
                                className="px-4 py-1.5 rounded-full bg-midnight-900 border border-magenta-50/10 text-magenta-200/80 text-xs font-mono uppercase tracking-wider flex items-center gap-3 hover:border-magenta-500/30 hover:bg-midnight-800 transition-all"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-magenta-500 animate-pulse" />
                                {user.cosmicPoints || 0} Pontos
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="p-2 text-magenta-200/40 hover:text-magenta-200 hover:bg-white/5 transition-all rounded"
                                title="Sair"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Navegação Mobile */}
                    <nav className="md:hidden flex border-t border-magenta-50/5">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-all ${pathname === link.href
                                    ? 'text-magenta-200 bg-magenta-500/10'
                                    : 'text-magenta-200/60'
                                    }`}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}\n                    </nav>
                </header>

                <main className="container mx-auto px-6 py-12 relative z-10">
                    {children}
                </main>

                {/* Global Ambient Sound */}
                <BackgroundAmbience />
            </div>
        </OnboardingGuard>
    )
}
