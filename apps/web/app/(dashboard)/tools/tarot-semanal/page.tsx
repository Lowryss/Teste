'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GlowCard, GradientText, FloatingParticles } from '@/components/CosmicEffects'
import { Calendar, ChevronRight, Lock, Sparkles, Star, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'

// Steps: Intro -> Selection -> Reading -> Result
type Step = 'intro' | 'selection' | 'reading' | 'result'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

export default function TarotSemanalPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const router = useRouter()
    const [step, setStep] = useState<Step>('intro')
    const [selectedCards, setSelectedCards] = useState<number[]>([])
    const [isThinking, setIsThinking] = useState(false)
    const [readingResult, setReadingResult] = useState<{ content: string, cards: string[] } | null>(null)

    const handleStart = () => {
        if (!user?.cosmicPoints || user.cosmicPoints < 50) {
            addToast({ type: 'error', title: 'Energia Insuficiente', message: 'Você precisa de 50 pontos para esta leitura.' })
            // In real app, maybe open shop modal
            return
        }
        setStep('selection')
    }

    const handleCardSelect = async (index: number) => {
        if (selectedCards.includes(index)) return

        const newSelection = [...selectedCards, index]
        setSelectedCards(newSelection)

        if (newSelection.length === 7) {
            setTimeout(async () => {
                setStep('reading')
                setIsThinking(true)

                try {
                    const token = await user?.getIdToken()
                    const res = await fetch('/api/readings/tarot-semanal', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    const data = await res.json()

                    if (res.ok) {
                        setReadingResult({ content: data.content, cards: data.cards })
                        setTimeout(() => {
                            setIsThinking(false)
                            setStep('result')
                        }, 2000)
                    } else {
                        throw new Error(data.error)
                    }
                } catch (error) {
                    console.error(error)
                    addToast({ type: 'error', title: 'Erro na leitura', message: 'As estrelas estão nubladas. Tente novamente.' })
                    setStep('intro')
                }
            }, 500)
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
            <CosmicBackground />
            <div className="fixed inset-0 pointer-events-none z-0">
                <FloatingParticles count={25} />
            </div>

            {step === 'intro' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full text-center relative z-10 space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs uppercase tracking-widest">
                        <Star className="w-4 h-4" />
                        <span>Previsão Premium</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display text-white drop-shadow-lg">
                        Tarot <GradientText animate>Semanal</GradientText>
                    </h1>

                    <p className="text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
                        Uma jornada profunda pelos próximos 7 dias.
                        Descubra as energias de cada dia da sua semana com a sabedoria dos arcanos.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-xl mx-auto opacity-80">
                        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                            <Calendar className="w-6 h-6 text-purple-400 mb-2" />
                            <h3 className="text-white font-display">Planejamento</h3>
                            <p className="text-xs text-white/50">Energia dia a dia (Seg a Dom).</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                            <Heart className="w-6 h-6 text-rose-400 mb-2" />
                            <h3 className="text-white font-display">Direcionamento</h3>
                            <p className="text-xs text-white/50">Foco nas oportunidades da semana.</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                            <Sparkles className="w-6 h-6 text-gold-400 mb-2" />
                            <h3 className="text-white font-display">Clareza</h3>
                            <p className="text-xs text-white/50">Conselho para sua melhor semana.</p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button
                            onClick={handleStart}
                            className="h-16 px-12 text-lg rounded-full bg-gradient-to-r from-gold-600 to-amber-600 hover:from-gold-500 hover:to-amber-500 text-white font-display tracking-widest shadow-[0_0_30px_rgba(217,119,6,0.4)] transition-all hover:scale-105"
                        >
                            Iniciar Leitura <span className="ml-2 text-xs opacity-70 bg-black/20 px-2 py-1 rounded">50 pts</span>
                        </Button>
                    </div>
                </motion.div>
            )}

            {step === 'selection' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-5xl relative z-10"
                >
                    <h2 className="text-3xl font-display text-white text-center mb-2">Escolha 7 Cartas</h2>
                    <p className="text-white/50 text-center text-sm mb-12 uppercase tracking-widest">Concentre-se na sua semana</p>

                    {/* Deck Spread Animation Simulation */}
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                        {DAYS.map((day, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div
                                    onClick={() => handleCardSelect(i)}
                                    className={`aspect-[2/3] rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${selectedCards.includes(i) ? 'border-gold-500 shadow-[0_0_20px_rgba(217,119,6,0.3)] bg-gold-900/20' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                >
                                    {/* Card Back Pattern */}
                                    <div className="absolute inset-0 bg-[url('/bg-stars.png')] opacity-30" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {selectedCards.includes(i) ? (
                                            <Sparkles className="w-6 h-6 text-gold-400 animate-pulse" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border border-white/10 group-hover:scale-110 transition-transform" />
                                        )}
                                    </div>

                                    {/* Day Label */}
                                    <div className="absolute bottom-3 inset-x-0 text-center">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedCards.includes(i) ? 'text-gold-300' : 'text-white/30'}`}>
                                            {day}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center text-white/30 text-xs">
                        {selectedCards.length} / 7 selecionadas
                    </div>
                </motion.div>
            )}

            {step === 'reading' && (
                <div className="flex flex-col items-center gap-6 z-10">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 border-4 border-gold-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-t-gold-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-gold-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-display text-white animate-pulse">Interpretando sua Semana...</h2>
                    <p className="text-white/40 text-sm">Consultando os arcanos para cada dia</p>
                </div>
            )}

            {step === 'result' && readingResult && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10 w-full max-w-4xl pb-20"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-display text-white mb-2">
                            <GradientText animate>Previsão Semanal</GradientText>
                        </h1>
                        <p className="text-white/60">Sua jornada para os próximos 7 dias</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cards Display */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-gold-300 uppercase tracking-widest text-xs font-bold mb-4">Cartas da Semana</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {readingResult.cards.map((card, i) => (
                                    <div key={i} className="text-center">
                                        <div className="aspect-[2/3] bg-gold-900/20 border border-gold-500/30 rounded-lg flex items-center justify-center mb-1 relative">
                                            <span className="absolute top-1 left-1 text-[8px] text-white/40">{DAYS[i].substring(0, 3)}</span>
                                            <Sparkles className="w-3 h-3 text-gold-400" />
                                        </div>
                                        <span className="text-[9px] text-white/50 block truncate">{card}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interpretation */}
                        <div className="bg-midnight-950/50 border border-white/10 rounded-2xl p-6 h-full overflow-y-auto max-h-[500px]">
                            <div
                                className="prose prose-invert prose-sm max-w-none prose-p:text-white/80 prose-strong:text-gold-400"
                                dangerouslySetInnerHTML={{ __html: readingResult.content }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-10">
                        <Button onClick={() => router.push('/history')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8">
                            Salvar no Diário
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
