'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GradientText, FloatingParticles } from '@/components/CosmicEffects'
import { Sparkles, Flower, AlertCircle } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

type Card = { id: number, name: string, meaning: string }

export default function CiganoPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'intro' | 'reading'>('intro')
    const [result, setResult] = useState<{ cards: Card[], content: string } | null>(null)
    const [loading, setLoading] = useState(false)

    const handlePlay = async () => {
        if (!user?.cosmicPoints || user.cosmicPoints < 7) {
            addToast({ type: 'error', title: 'Saldo insuficiente', message: 'Você precisa de 7 pontos.' })
            return
        }

        setLoading(true)
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/ai/cigano', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()

            if (res.ok) {
                setResult(data)
                setStep('reading')
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', message: error.message || 'Falha na leitura.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* Greenish Mystical Mood for Cigano */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 to-black z-0" />
            <div className="fixed inset-0 pointer-events-none z-0">
                <FloatingParticles count={20} color="#10b981" />
            </div>

            <div className="relative z-10 w-full max-w-4xl text-center">
                {step === 'intro' && (
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest">
                            <Flower className="w-4 h-4" /> <span>Baralho Lenormand</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-display text-white">
                            Baralho <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Cigano</span>
                        </h1>

                        <p className="text-emerald-100/60 max-w-lg mx-auto">
                            Método das 5 Cartas. Ideal para perguntas objetivas e situações do cotidiano.
                            Respostas diretas e sem rodeios.
                        </p>

                        <Button
                            onClick={handlePlay}
                            disabled={loading}
                            className="h-16 px-12 rounded-full bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white font-display text-lg tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                        >
                            {loading ? 'Consultando...' : 'Jogar as Cartas • 7 pts'}
                        </Button>
                    </div>
                )}

                {step === 'reading' && result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {result.cards.map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.15 }}
                                    className="aspect-[2/3] bg-emerald-950/80 border border-emerald-500/30 rounded-xl flex flex-col items-center justify-center p-2 relative group hover:bg-emerald-900 transition-colors"
                                >
                                    <span className="absolute top-2 left-2 text-xs font-mono text-emerald-500">{card.id}</span>
                                    <span className="text-center font-display text-emerald-100 text-sm md:text-base">{card.name}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-emerald-950/50 border border-emerald-500/20 p-8 rounded-2xl text-left max-w-3xl mx-auto">
                            <h3 className="text-emerald-400 font-display text-2xl mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" /> Interpretação
                            </h3>
                            <div
                                className="prose prose-invert prose-p:text-emerald-100/80 prose-strong:text-emerald-300"
                                dangerouslySetInnerHTML={{ __html: result.content }}
                            />
                        </div>

                        <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/50" onClick={() => setStep('intro')}>
                            Nova Tiragem
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
