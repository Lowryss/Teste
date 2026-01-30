'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { FloatingParticles } from '@/components/CosmicEffects'
import { HelpCircle, RefreshCcw } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

type Card = { id: number, name: string }

export default function YesNoTarotPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'intro' | 'reading'>('intro')
    const [result, setResult] = useState<{ card: Card, answer: string, content: string } | null>(null)
    const [loading, setLoading] = useState(false)

    const handlePlay = async () => {
        if (!user?.cosmicPoints || user.cosmicPoints < 1) {
            addToast({ type: 'error', title: 'Saldo insuficiente', message: 'Você precisa de 1 ponto.' })
            return
        }

        setLoading(true)
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/ai/tarot-yesno', {
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
            {/* Cyan/Electric Mood */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 to-black z-0" />
            <div className="fixed inset-0 pointer-events-none z-0">
                <FloatingParticles count={25} color="#22d3ee" />
            </div>

            <div className="relative z-10 w-full max-w-lg text-center">
                <AnimatePresence mode='wait'>
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-8"
                        >
                            <div className="w-24 h-24 mx-auto bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30 animate-pulse">
                                <HelpCircle className="w-12 h-12 text-cyan-400" />
                            </div>
                            <h1 className="text-5xl font-display text-white">
                                Sim ou <span className="text-cyan-400">Não</span>?
                            </h1>
                            <p className="text-cyan-100/60 text-lg">
                                Mentalize sua pergunta de forma objetiva e receba uma resposta direta.
                            </p>
                            <Button
                                onClick={handlePlay}
                                disabled={loading}
                                className="h-16 px-12 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-display text-lg tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all hover:scale-105"
                            >
                                {loading ? 'Consultando...' : 'Obter Resposta • 1 pt'}
                            </Button>
                        </motion.div>
                    )}

                    {step === 'reading' && result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-cyan-950/20 backdrop-blur border border-cyan-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${result.answer === 'SIM' ? 'from-green-500' : result.answer === 'NÃO' ? 'from-red-500' : 'from-yellow-500'} to-transparent`} />

                            <span className="text-xs text-cyan-400 uppercase tracking-widest font-bold block mb-4">A carta {result.card.name} responde:</span>

                            <h2 className={`text-6xl md:text-8xl font-display mb-8 ${result.answer === 'SIM' ? 'text-green-400' : result.answer === 'NÃO' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {result.answer}
                            </h2>

                            <div
                                className="prose prose-invert text-cyan-100/80 mx-auto"
                                dangerouslySetInnerHTML={{ __html: result.content }}
                            />

                            <Button variant="ghost" className="mt-8 text-cyan-400 hover:text-cyan-300" onClick={() => setStep('intro')}>
                                <RefreshCcw className="w-4 h-4 mr-2" /> Perguntar Novamente
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
