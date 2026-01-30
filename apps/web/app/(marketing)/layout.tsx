import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden font-sans text-magenta-50 selection:bg-magenta-200 selection:text-midnight-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-6 px-6 md:px-12 bg-gradient-to-b from-midnight-950/80 to-transparent pointer-events-none">
                {/* Logo */}
                <Link href="/" className="pointer-events-auto group mix-blend-difference">
                    <span className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-magenta-50 group-hover:text-magenta-200 transition-colors">
                        Guia.
                    </span>
                </Link>

                {/* Auth Nav */}
                <nav className="flex items-center gap-6 pointer-events-auto">
                    <Link href="/login" className="hidden sm:block text-xs uppercase tracking-[0.2em] font-medium text-magenta-200/70 hover:text-magenta-50 transition-colors">
                        Login
                    </Link>
                    <Link href="/register">
                        <Button size="sm" className="rounded-none bg-magenta-50 text-midnight-950 hover:bg-white font-medium uppercase tracking-widest text-xs px-6 h-9 transition-transform hover:-translate-y-0.5">
                            Start
                        </Button>
                    </Link>
                </nav>
            </header>

            <div className="flex-1 relative z-10 w-full pt-20">
                {children}
            </div>

            <footer className="relative z-10 py-12 text-center border-t border-magenta-50/5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-magenta-200/40">
                    &copy; 2026 Guia do Coração. The Stars Have Spoken.
                </p>
            </footer>
        </div>
    )
}
