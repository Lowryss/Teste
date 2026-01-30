'use client'

/**
 * Cosmic History Page 
 * Updated: 2026-01-30
 */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import {
    History, Moon, Sun, Heart, Sparkles, Star,
    BookOpen, Calculator, MessageCircle, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { GlowCard, FloatingParticles, GlowRing, GradientText } from '@/components/CosmicEffects'

interface Reading {
    id: string
    type: 'tarot' | 'horoscope' | 'soulmate' | 'dreams' | 'numerology' | 'astrology' | 'advice'
    title: string
    preview: string
    cards?: string[]
    createdAt: Date
    pointsUsed: number
}

type ColorType = "purple" | "gold" | "rose" | "cyan" | "magenta";

type ToolVisuals = {
    icon: any;
    glowColor: ColorType;
    label: string;
}

const TOOLS: Record<string, ToolVisuals> = {
    tarot: { icon: Moon, glowColor: 'purple', label: 'Tarot' },
    horoscope: { icon: Sun, glowColor: 'gold', label: 'Horóscopo' },
    soulmate: { icon: Heart, glowColor: 'rose', label: 'Compatibilidade' },
    dreams: { icon: Sparkles, glowColor: 'magenta', label: 'Sonhos' },
    numerology: { icon: Calculator, glowColor: 'cyan', label: 'Numerologia' },
    astrology: { icon: Star, glowColor: 'cyan', label: 'Astrologia' },
    advice: { icon: MessageCircle, glowColor: 'rose', label: 'Conselhos' }
}

export default function HistoryPage() {
    const { user } = useAuth()
    const [readings, setReadings] = useState<Reading[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        if (!user) return
        const q = query(collection(db, 'users', user.uid, 'readings'), orderBy('createdAt', 'desc'), limit(50))
        getDocs(q).then(snapshot => {
            setReadings(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as Reading[])
        }).catch(console.error).finally(() => setLoading(false))
    }, [user])

    const filtered = filter === 'all' ? readings : readings.filter(r => r.type === filter)

    const formatDate = (date: Date) => {
        const diff = Math.floor((new Date().getTime() - date.getTime()) / 86400000)
        if (diff === 0) return 'Hoje'
        if (diff === 1) return 'Ontem'
        if (diff < 7) return `${diff} dias atrás`
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 pt-8 relative min-h-screen">
            <div className="fixed inset-0 pointer-events-none z-0">
                <FloatingParticles count={25} />
            </div>

            <div className="mb-12 relative z-10 px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <History className="w-8 h-8 text-magenta-300" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display text-white mb-2">
                            Histórico <GradientText animate>Cósmico</GradientText>
                        </h1>
                        <p className="text-white/50">Suas conexões com o universo.</p>
                    </div>
                </motion.div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={`rounded-full ${filter === 'all' ? 'bg-magenta-600' : 'bg-transparent border-white/10 text-white/60'}`}
                    >
                        Todos
                    </Button>
                    {Object.entries(TOOLS).map(([key, config]) => (
                        <Button
                            key={key}
                            size="sm"
                            variant={filter === key ? 'default' : 'outline'}
                            onClick={() => setFilter(key)}
                            className={`rounded-full ${filter === key ? `bg-${config.glowColor}-500 border-${config.glowColor}-400` : 'bg-transparent border-white/10 text-white/60'}`}
                        >
                            {config.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="px-4 space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-white/30 animate-pulse">Carregando estrelas...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl text-white">Histórico Vazio</h3>
                        <Link href="/dashboard" className="inline-block mt-4">
                            <Button className="rounded-full bg-magenta-600 hover:bg-magenta-500">Explorar</Button>
                        </Link>
                    </div>
                ) : (
                    filtered.map((reading, i) => {
                        const visual = TOOLS[reading.type] || TOOLS['tarot']
                        return (
                            <motion.div key={reading.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                <GlowCard glowColor={visual.glowColor} className="hover:scale-[1.01] transition-transform">
                                    <div className="p-6 flex flex-col md:flex-row gap-6 items-center relative z-10">
                                        <div className="flex items-center gap-4 min-w-[160px]">
                                            <GlowRing size="sm" color={visual.glowColor}>
                                                <visual.icon className="w-5 h-5 text-white" />
                                            </GlowRing>
                                            <div>
                                                <div className={`text-[10px] font-bold uppercase tracking-widest text-${visual.glowColor}-300`}>{visual.label}</div>
                                                <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(reading.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-lg font-display text-white mb-1">{reading.title}</h3>
                                            <p className="text-white/50 text-sm line-clamp-1">{reading.preview}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-white/30">Energia</div>
                                            <div className="font-mono text-white">-{reading.pointsUsed}</div>
                                        </div>
                                    </div>
                                </GlowCard>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
