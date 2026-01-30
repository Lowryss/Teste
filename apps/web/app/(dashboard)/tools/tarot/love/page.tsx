'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GradientText, FloatingParticles } from '@/components/CosmicEffects'
import { Sparkles, Heart, RefreshCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

type Card = { id: number, name: string, keywords: string[] }

export default function LoveTarotPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'intro' | 'reading'>('intro')
    const [result, setResult] = useState<{ cards: Card[], positions: string[], content: string } | null>(null)
    const [loading, setLoading] = useState(false)

    const handlePlay = async () => {
        if (!user?.cosmicPoints || user.cosmicPoints < 15) {
            addToast({ type: 'error', title: 'Saldo insuficiente', message: 'Você precisa de 15 pontos.' })
            return
        }

        setLoading(true)
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/ai/tarot-love', {
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
            {/* Rose/Love Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-950/50 to-black z-0" />
            <div className="fixed inset-0 pointer-events-none z-0">
                <FloatingParticles count={30} color="#fb7185" />
            </div>

            <div className="relative z-10 w-full max-w-5xl text-center">
                {step === 'intro' && (
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-900/40 border border-rose-500/30 text-rose-400 font-mono text-xs uppercase tracking-widest">
                            <Heart className="w-4 h-4" /> <span>Oráculo do Amor</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display text-white">
                            Tarot do <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-200">Amor</span>
                        </h1>

                        <p className="text-rose-100/60 max-w-lg mx-auto text-lg">
                            Entenda seus sentimentos, a energia do parceiro e o futuro da relação com este método de 3 cartas.
                        </p>

                        <Button
                            onClick={handlePlay}
                            disabled={loading}
                            className="h-16 px-12 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-display text-lg tracking-widest shadow-[0_0_40px_rgba(251,113,133,0.4)] transition-all hover:scale-105"
                        >
                            {loading ? 'Sintonizando Corações...' : 'Consultar Amor • 15 pts'}
                        </Button>
                    </div>
                )}

                {step === 'reading' && result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                        {/* Cards Display */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                            {result.cards.map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <span className="text-xs font-mono uppercase tracking-widest text-rose-300">{result.positions[i]}</span>
                                    <div className="w-48 h-72 bg-gradient-to-b from-rose-900/40 to-black border border-rose-500/30 rounded-xl flex items-center justify-center p-4 relative group hover:border-rose-400/60 transition-colors shadow-2xl shadow-rose-900/20">
                                        <div className="absolute inset-2 border border-white/5 rounded-lg" />
                                        <span className="text-center font-display text-rose-100 text-xl">{card.name}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Interpretation */}
                        <div className="bg-rose-950/30 border border-rose-500/20 p-8 md:p-12 rounded-3xl text-left max-w-4xl mx-auto backdrop-blur-sm">
                            <h3 className="text-rose-300 font-display text-3xl mb-6 flex items-center gap-3">
                                <Sparkles className="w-6 h-6" /> Mensagem do Coração
                            </h3>
                            <div
                                className="prose prose-invert prose-lg prose-p:text-rose-100/80 prose-strong:text-rose-200 prose-headings:text-rose-300"
                                dangerouslySetInnerHTML={{ __html: result.content }}
                            />
                        </div>

                        <Button variant="ghost" className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30" onClick={() => setStep('intro')}>
                            <RefreshCcw className="w-4 h-4 mr-2" /> Nova Consulta
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
