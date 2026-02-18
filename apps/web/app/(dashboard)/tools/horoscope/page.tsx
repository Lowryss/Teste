'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { CosmicBackground, GlowCard, GradientText, FloatingParticles } from '@/components/CosmicEffects'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Moon, Star, Sun, ChevronRight, Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const ZODIAC_SIGNS = [
    { key: 'aries', name: 'Áries', icon: '♈', date: '21/03 - 19/04', element: 'Fogo' },
    { key: 'taurus', name: 'Touro', icon: '♉', date: '20/04 - 20/05', element: 'Terra' },
    { key: 'gemini', name: 'Gêmeos', icon: '♊', date: '21/05 - 20/06', element: 'Ar' },
    { key: 'cancer', name: 'Câncer', icon: '♋', date: '21/06 - 22/07', element: 'Água' },
    { key: 'leo', name: 'Leão', icon: '♌', date: '23/07 - 22/08', element: 'Fogo' },
    { key: 'virgo', name: 'Virgem', icon: '♍', date: '23/08 - 22/09', element: 'Terra' },
    { key: 'libra', name: 'Libra', icon: '♎', date: '23/09 - 22/10', element: 'Ar' },
    { key: 'scorpio', name: 'Escorpião', icon: '♏', date: '23/10 - 21/11', element: 'Água' },
    { key: 'sagittarius', name: 'Sagitário', icon: '♐', date: '22/11 - 21/12', element: 'Fogo' },
    { key: 'capricorn', name: 'Capricórnio', icon: '♑', date: '22/12 - 19/01', element: 'Terra' },
    { key: 'aquarius', name: 'Aquário', icon: '♒', date: '20/01 - 18/02', element: 'Ar' },
    { key: 'pisces', name: 'Peixes', icon: '♓', date: '19/02 - 20/03', element: 'Água' },
]

export default function HoroscopePage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [selectedSign, setSelectedSign] = useState<string | null>(null)
    const [period, setPeriod] = useState<'daily' | 'weekly'>('daily')
    const [result, setResult] = useState<any>(null)

    const handleGetHoroscope = async (signKey: string, signName: string) => {
        setLoading(true)
        setSelectedSign(signName)
        try {
            const res = await fetch('/api/ai/horoscope', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    sign: signKey,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 429 && data.cached) {
                    setResult({
                        sign: signName,
                        period,
                        content: data.cached.content,
                    })
                    return
                }
                throw new Error(data.error || 'Erro ao consultar os astros')
            }

            setResult({
                sign: signName,
                period,
                content: data.content,
            })
        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', message: error.message || 'Falha ao consultar os astros.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative pb-20">
            <CosmicBackground />
            <FloatingParticles count={20} color="cyan" />

            <div className="container mx-auto px-4 pt-10 relative z-10">
                <header className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/30 border border-cyan-500/20 mb-4">
                        <Moon className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-mono text-cyan-200 uppercase tracking-widest">Astrologia Diária</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Seu <GradientText animate>Horóscopo</GradientText>
                    </h1>
                    <p className="text-cyan-100/60 max-w-xl mx-auto text-lg">
                        Descubra o que os astros reservam para o seu signo.
                        Orientação precisa baseada em trânsitos planetários reais.
                    </p>
                </header>

                {!result ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {ZODIAC_SIGNS.map((sign, index) => (
                            <motion.div
                                key={sign.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <button
                                    onClick={() => handleGetHoroscope(sign.key, sign.name)}
                                    className="w-full group relative"
                                >
                                    <GlowCard className="h-full" glowColor={sign.element === 'Fogo' ? 'rose' : sign.element === 'Água' ? 'cyan' : sign.element === 'Ar' ? 'gold' : 'purple'}>
                                        <div className="p-6 flex flex-col items-center gap-4 text-center hover:bg-white/5 transition-colors h-full">
                                            <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform duration-300">
                                                {sign.icon}
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-display text-white group-hover:text-cyan-200">{sign.name}</h3>
                                                <p className="text-xs text-white/40 font-mono">{sign.date}</p>
                                            </div>
                                        </div>
                                    </GlowCard>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <GlowCard glowColor="cyan" className="overflow-hidden">
                            <div className="p-8 md:p-12 relative">
                                <div className="absolute top-0 right-0 p-8 opacity-20">
                                    <Star className="w-32 h-32 text-cyan-500 animate-pulse" />
                                </div>

                                <button
                                    onClick={() => setResult(null)}
                                    className="text-cyan-400 hover:text-white flex items-center gap-2 mb-8 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Escolher outro signo
                                </button>

                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-6xl">{ZODIAC_SIGNS.find(s => s.name === result.sign)?.icon}</span>
                                    <div>
                                        <h2 className="text-4xl font-display text-white">{result.sign}</h2>
                                        <p className="text-cyan-200/60">Previsão para {period === 'daily' ? 'Hoje' : 'esta Semana'}</p>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-lg prose-p:text-cyan-50/80 prose-headings:text-cyan-200">
                                    <ReactMarkdown>{result.content}</ReactMarkdown>
                                </div>
                            </div>
                        </GlowCard>
                    </motion.div>
                )}
            </div>

            {loading && (
                <div className="fixed inset-0 bg-midnight-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                        <p className="text-cyan-200 font-display text-xl animate-pulse">Consultando as Estrelas...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
