'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GradientText, FloatingParticles } from '@/components/CosmicEffects'
import { CosmicCard } from '@/components/CosmicCard'
import { Sparkles, RefreshCcw, Sun } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export default function DailyTarotPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'intro' | 'shuffling' | 'reading' | 'result'>('intro')
    const [cardData, setCardData] = useState<any>(null)

    const handleStart = () => {
        setStep('shuffling')
        setTimeout(() => handleDraw(), 3000)
    }

    const handleDraw = async () => {
        setStep('reading')
        try {
            const token = await user?.getIdToken()
            const res = await fetch('/api/ai/tarot-daily', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
            const data = await res.json()

            if (res.ok) {
                setCardData(data)
                setTimeout(() => setStep('result'), 2000)
            } else {
                addToast({ type: 'info', title: 'Volte Amanhã', message: data.error || 'Você já tirou sua carta hoje.' })
                setStep('intro')
            }
        } catch (error) {
            addToast({ type: 'error', title: 'Erro Cósmico', message: 'Falha ao conectar com o oráculo.' })
            setStep('intro')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <CosmicBackground />
                <div className="absolute inset-0 bg-gold-950/20 mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto">
                <AnimatePresence mode='wait'>
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-8"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 mx-auto border border-gold-500/30 rounded-full flex items-center justify-center relative"
                            >
                                <Sun className="w-12 h-12 text-gold-400" />
                                <div className="absolute inset-0 rounded-full border border-gold-500/20 border-t-gold-400 animate-spin-slow" />
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-display text-white">
                                Tarot do <GradientText animate>Dia</GradientText>
                            </h1>

                            <p className="text-gold-100/60 text-xl max-w-lg mx-auto leading-relaxed">
                                A sabedoria do universo para o seu momento presente.
                                Tire uma carta gratuitamente todos os dias.
                            </p>

                            <Button
                                onClick={handleStart}
                                className="h-16 px-12 rounded-full bg-gradient-to-r from-gold-600 to-amber-600 hover:from-gold-500 hover:to-amber-500 text-white font-display text-lg tracking-widest shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-all hover:scale-105"
                            >
                                <Sparkles className="w-5 h-5 mr-3" /> Consultar Oráculo
                            </Button>
                        </motion.div>
                    )}

                    {step === 'shuffling' && (
                        <motion.div
                            key="shuffling"
                            className="flex items-center justify-center perspective-1000"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="relative w-48 h-80">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute inset-0"
                                        animate={{
                                            rotateY: [0, 180, 0],
                                            x: [-100, 100, 0],
                                            scale: [1, 0.8, 1],
                                            zIndex: [0, 10, 0]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <CosmicCard isRevealed={false} className="w-full h-full shadow-2xl" />
                                    </motion.div>
                                ))}
                            </div>
                            <p className="absolute mt-96 text-gold-200/50 font-mono tracking-widest uppercase animate-pulse">Embaralhando Energias...</p>
                        </motion.div>
                    )}

                    {step === 'reading' && (
                        <motion.div key="reading" className="text-center space-y-6">
                            <CosmicCard isRevealed={false} className="w-48 h-80 mx-auto animate-pulse" />
                            <p className="text-gold-200/50 font-mono tracking-widest uppercase">Interpretando Sinais...</p>
                        </motion.div>
                    )}

                    {step === 'result' && cardData && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto bg-midnight-900/40 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-xl"
                        >
                            <div className="flex-shrink-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1 }}
                                >
                                    <CosmicCard isRevealed={true} name={cardData.card.name} className="w-72 h-[450px] shadow-[0_0_60px_rgba(251,191,36,0.2)]" />
                                </motion.div>
                            </div>

                            <div className="flex-1 text-left space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-900/30 border border-gold-500/20 text-gold-400 font-mono text-xs uppercase">
                                    <Sun className="w-3 h-3" /> Arcano do Dia
                                </div>

                                <h2 className="text-5xl font-display text-white">
                                    {cardData.card.name}
                                </h2>

                                <div
                                    className="prose prose-invert prose-lg prose-p:text-gold-50/80 prose-strong:text-gold-200"
                                    dangerouslySetInnerHTML={{ __html: cardData.content }}
                                />

                                <Button
                                    onClick={() => setStep('intro')}
                                    variant="ghost"
                                    className="text-gold-400 hover:text-gold-200 hover:bg-gold-900/20"
                                >
                                    <RefreshCcw className="w-4 h-4 mr-2" /> Voltar ao Início
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
