'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Star, User, Heart, Moon, Sun, ArrowRight, Plus, Flame, Zap, Infinity as InfinityIcon, Gem } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    CosmicBackground,
    GlowCard,
    GradientButton,
    GradientText,
    FloatingParticles,
    GlowRing
} from '@/components/CosmicEffects'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
}

const item = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 50 }
    }
}

type Tool = {
    id: string
    title: string
    description: string
    icon: any
    href: string
    points: number
    color: "gold" | "purple" | "rose" | "magenta" | "cyan"
}

type Stat = {
    label: string
    value: string | number
    sub: string
    icon: any
    color: "gold" | "magenta" | "purple" | "cyan" | "rose"
}

export default function DashboardPage() {
    const { user } = useAuth()

    const tools: Tool[] = [
        {
            id: 'horoscope',
            title: 'Horóscopo IA',
            description: 'Previsões diárias baseadas no seu mapa astral exato.',
            icon: Sun,
            href: '/tools/horoscope',
            points: 1,
            color: 'gold'
        },
        {
            id: 'tarot',
            title: 'Tarot Digital',
            description: 'As cartas revelam caminhos ocultos do seu inconsciente.',
            icon: Moon,
            href: '/tools/tarot-hub',
            points: 5,
            color: 'purple'
        },
        {
            id: 'soulmate',
            title: 'Sinastria',
            description: 'Calcule a compatibilidade e ressonância entre almas.',
            icon: Heart,
            href: '/tools/soulmate',
            points: 8,
            color: 'rose'
        },
        {
            id: 'dreams',
            title: 'Oniromancia',
            description: 'Decodifique os símbolos dos seus sonhos.',
            icon: Sparkles,
            href: '/tools/dreams',
            points: 10,
            color: 'magenta'
        },
        {
            id: 'numerology',
            title: 'Numerologia do Amor',
            description: 'Descubra a vibração e compatibilidade dos seus números.',
            icon: InfinityIcon,
            href: '/tools/numerology',
            points: 20,
            color: 'purple'
        },
        {
            id: 'crystals',
            title: 'Oráculo dos Cristais',
            description: 'Descubra qual pedra ou cristal você precisa agora.',
            icon: Gem,
            href: '/tools/crystals',
            points: 7,
            color: 'cyan'
        }
    ]

    const stats: Stat[] = [
        { label: "Saldo Cósmico", value: user?.cosmicPoints || 0, sub: "Pontos disponíveis", icon: Sparkles, color: "magenta" },
        { label: "Nível Atual", value: "Iniciado", sub: "Jornada do Louco", icon: Star, color: "purple" },
        { label: "Sequência", value: user?.dailyStreak ? `${user.dailyStreak} dias` : "0 dias", sub: "Visitas consecutivas", icon: Flame, color: "gold" }
    ]

    return (
        <div className="space-y-20 relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <FloatingParticles count={20} />
            </div>

            {/* Welcome Section */}
            <section className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-8"
                >
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-magenta-200/80 backdrop-blur-sm">
                                Oráculo Digital
                            </span>
                            <span className="w-16 h-[1px] bg-gradient-to-r from-magenta-500/50 to-transparent" />
                        </motion.div>

                        <h1 className="text-6xl md:text-7xl font-display font-thin text-white mb-6 leading-tight tracking-tight">
                            Olá, <br className="md:hidden" />
                            <GradientText animate={true}>
                                {user?.displayName?.split(' ')[0] || 'Viajante'}
                            </GradientText>
                        </h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-4 text-magenta-100/70 font-light text-sm max-w-lg leading-relaxed"
                        >
                            <div className="w-1 h-12 bg-gradient-to-b from-magenta-400 to-purple-600 rounded-full shrink-0" />
                            <p>
                                O alinhamento planetário de <b className="text-white font-medium">hoje</b> favorece a
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"> introspecção profunda</span>.
                                O universo aguarda suas perguntas.
                            </p>
                        </motion.div>
                    </div>

                    <Link href="/shop">
                        <GradientButton variant="gold" className="group" size="lg">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            <span className="tracking-widest uppercase text-xs font-bold">Adquirir Pontos</span>
                        </GradientButton>
                    </Link>
                </motion.div>
            </section>

            {/* Featured Tarot Semestral Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative group overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-r from-gold-900/20 to-amber-900/20"
            >
                <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full" />

                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] uppercase tracking-widest font-bold mb-4">
                            <Star className="w-3 h-3" />
                            <span>Novo & Premium</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display text-white mb-2">
                            Jogue agora seu <GradientText animate>Tarot Semanal</GradientText>
                        </h3>
                        <p className="text-white/60 max-w-md">
                            Descubra o que a próxima semana reserva para você com uma leitura detalhada dia a dia.
                        </p>
                    </div>

                    <Link href="/tools/tarot-semanal">
                        <GradientButton variant="gold" size="lg" className="shadow-[0_0_25px_rgba(217,119,6,0.3)] hover:scale-105 transition-transform">
                            <span className="uppercase tracking-widest font-bold text-sm px-6">Iniciar Leitura • 50 pts</span>
                        </GradientButton>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Modules */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <GlowCard className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="p-8 hover:bg-white/5 transition-all duration-500 group relative overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
                                        {stat.label}
                                    </span>
                                    <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="text-4xl font-display text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                    {stat.value}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-white/30 font-mono uppercase tracking-wide group-hover:text-white/60 transition-colors">
                                    <div className={`w-1 h-1 rounded-full bg-${stat.color}-500 animate-pulse`} />
                                    {stat.sub}
                                </div>
                            </div>
                        </div>
                    ))}
                </GlowCard>
            </motion.div>

            {/* Tools Grid */}
            <section>
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display text-white mb-2">
                            Ferramentas <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 italic">Místicas</span>
                        </h2>
                        <p className="text-white/40 font-light">Escolha seu caminho de iluminação</p>
                    </div>

                    <div className="hidden md:flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-magenta-500 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-150" />
                    </div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {tools.map((tool) => (
                        <motion.div key={tool.id} variants={item}>
                            <Link href={tool.href} className="block h-full">
                                <GlowCard
                                    className="h-full min-h-[280px] bg-gradient-to-b from-midnight-900/80 to-midnight-950/80"
                                    glowColor={tool.color}
                                >
                                    <div className="p-8 h-full flex flex-col relative overflow-hidden group">
                                        {/* Background Aurora Effect on Hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)]" />

                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <GlowRing size="sm" color={tool.color}>
                                                <tool.icon className="w-6 h-6 text-white" />
                                            </GlowRing>

                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-white/20 transition-colors">
                                                <Zap className="w-3 h-3 text-gold-500" />
                                                <span className="text-xs font-mono text-white/60">{tool.points} pts</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-display text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                                                {tool.title}
                                            </h3>
                                            <p className="text-white/50 font-light leading-relaxed max-w-sm group-hover:text-white/70 transition-colors duration-300">
                                                {tool.description}
                                            </p>
                                        </div>

                                        {/* Footer Action */}
                                        <div className="mt-auto pt-8 flex items-center justify-between relative z-10">
                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent mr-4" />
                                            <div className="flex items-center text-xs uppercase tracking-[0.2em] font-bold text-white/40 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                                                <span className="mr-2">Iniciar</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </GlowCard>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    )
}
