'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CosmicBackground, GlowCard, GradientText, FloatingParticles, GlowRing } from '@/components/CosmicEffects'
import { Sun, Moon, Star, Heart, Compass, Zap, ArrowRight, HelpCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const methodologies = [
    {
        id: 'daily',
        title: 'Tarot do Dia',
        desc: 'Sua carta conselheira para as próximas 24h. Tire uma carta e receba orientação rápida.',
        icon: Sun,
        href: '/tools/tarot/daily',
        points: 0,
        color: 'gold',
        badges: ['Grátis']
    },
    {
        id: 'semanal',
        title: 'Tarot Semanal',
        desc: 'Uma análise detalhada dos seus próximos 7 dias. Energias diárias e conselhos.',
        icon: Compass,
        href: '/tools/tarot-semanal',
        points: 50,
        color: 'purple',
        badges: ['Premium', 'Novo']
    },
    {
        id: 'love',
        title: 'Tarot do Amor',
        desc: 'Entenda os sentimentos, desafios e futuro do seu relacionamento.',
        icon: Heart,
        href: '/tools/tarot/love',
        points: 15,
        color: 'rose',
        badges: ['Novo']
    },
    {
        id: 'cigano',
        title: 'Baralho Cigano',
        desc: 'Perguntas objetivas e situações do cotidiano. Método das 5 cartas.',
        icon: Moon,
        href: '/tools/tarot/cigano',
        points: 7,
        color: 'magenta',
        badges: ['Clássico']
    },
    {
        id: 'yesno',
        title: 'Tarot Sim/Não',
        desc: 'Dúvida cruel? Receba uma resposta binária e direta do universo.',
        icon: HelpCircle,
        href: '/tools/tarot/yesno',
        points: 1,
        color: 'cyan',
        badges: ['Rápido']
    }
]

export default function TarotHubPage() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen relative pb-20">
            <CosmicBackground />
            <div className="fixed inset-0 pointer-events-none z-0">
                <FloatingParticles count={25} />
            </div>

            <div className="container mx-auto px-4 pt-10 relative z-10">
                <header className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                        <Star className="w-4 h-4 text-gold-400 animate-pulse" />
                        <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Portal Oracular</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Escolha sua <GradientText animate>Leitura</GradientText>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
                        Conecte-se com a sabedoria ancestral. Selecione o método que melhor ressoa com sua dúvida atual.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {methodologies.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={item.href} className={item.badges.includes('Em Breve') ? 'pointer-events-none opacity-50' : ''}>
                                <GlowCard
                                    className="h-full hover:scale-[1.02] transition-transform duration-300 group"
                                    glowColor={item.color as any}
                                >
                                    <div className="p-8 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <GlowRing size="md" color={item.color as any}>
                                                <item.icon className="w-8 h-8 text-white" />
                                            </GlowRing>
                                            <div className="flex items-center gap-2">
                                                {item.badges.map(badge => (
                                                    <span key={badge} className={`text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 ${badge === 'Novo' ? 'text-gold-400' : 'text-white/60'}`}>
                                                        {badge}
                                                    </span>
                                                ))}
                                                {item.points > 0 ? (
                                                    <span className="flex items-center gap-1 text-xs font-mono text-white/80 bg-white/5 px-2 py-1 rounded border border-white/10">
                                                        <Zap className="w-3 h-3 text-gold-500" /> {item.points} pts
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/20">
                                                        Grátis
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-display text-white mb-2 group-hover:text-gold-200 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/50 mb-8 flex-1 leading-relaxed">
                                            {item.desc}
                                        </p>

                                        <div className="flex items-center text-sm font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                                            Jogar Agora <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </GlowCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
