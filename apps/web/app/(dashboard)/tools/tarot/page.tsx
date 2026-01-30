

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import clsx from 'clsx'

// Card Back Design (CSS/SVG)
const CardBack = () => (
    <div className="w-full h-full bg-midnight-900 border border-magenta-500/30 relative overflow-hidden group hover:border-magenta-400 transition-colors shadow-2xl">
        <div className="absolute inset-2 border border-magenta-500/20 flex items-center justify-center bg-midnight-950/50">
            <Sparkles className="w-8 h-8 text-magenta-500/40 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-noise opacity-20" />
    </div>
)

// Card Front Design
const CardFront = ({ card, position }: { card: string, position: string }) => (
    <div className="w-full h-full bg-midnight-950 border border-magenta-200/20 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center shadow-[0_0_30px_rgba(235,0,255,0.1)]">
        <div className="absolute inset-0 bg-radial-gradient from-magenta-900/10 to-transparent opacity-50" />
        <span className="text-[10px] text-magenta-200/40 uppercase tracking-[0.2em] mb-3 relative z-10">{position}</span>
        <h3 className="text-lg font-display text-magenta-50 relative z-10 tracking-wide">{card}</h3>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-magenta-500 to-transparent" />
    </div>
)

export default function TarotPage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [step, setStep] = useState<'question' | 'shuffling' | 'reading'>('question')
    const [question, setQuestion] = useState('')
    const [cards, setCards] = useState<string[]>([])
    const [reading, setReading] = useState<string | null>(null)

    const startReading = async () => {
        if ((user?.cosmicPoints || 0) < 5) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 5 pontos cósmicos.' })
            return
        }

        setStep('shuffling')

        // Simulate shuffling time then fetch
        try {
            const res = await fetch('/api/ai/tarot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    question
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            // Add delay for suspense
            setTimeout(() => {
                setCards(data.cards)
                setReading(data.content)
                setStep('reading')
            }, 3000) // 3s shuffling animation

        } catch (error: any) {
            setStep('question')
            addToast({ type: 'error', title: 'Erro no Tarot', message: error.message })
        }
    }

    const reset = () => {
        setStep('question')
        setQuestion('')
        setCards([])
        setReading(null)
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 pt-6 px-4 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-12">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-magenta-200/50 hover:text-white hover:bg-white/5 uppercase tracking-widest text-xs">
                        <ArrowLeft className="mr-2 h-3 w-3" /> Voltar
                    </Button>
                </Link>
                <h1 className="text-2xl font-display font-light text-magenta-50 flex items-center gap-2">
                    <span className="text-magenta-500">☾</span> Tarot do Destino
                </h1>
            </div>

            <AnimatePresence mode='wait'>
                {step === 'question' && (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-xl mx-auto space-y-12"
                    >
                        <div className="text-center space-y-4">
                            <p className="text-lg text-magenta-200/60 font-light">
                                Mentalize sua pergunta ou peça um conselho geral.<br />
                                As cartas revelarão o Passado, Presente e Futuro.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-magenta-500/10 border border-magenta-500/20 text-magenta-300 text-xs uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" /> Custo: 5 Pontos Cósmicos
                            </div>
                        </div>

                        <Card className="bg-midnight-900/40 border border-magenta-50/10 backdrop-blur-sm rounded-none shadow-2xl">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-magenta-200/40">Sua Pergunta (Opcional)</label>
                                    <Input
                                        placeholder="Ex: O que esperar do meu relacionamento atual?"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        className="h-14 bg-midnight-950/50 border-magenta-50/10 text-magenta-50 placeholder:text-magenta-200/20 focus:border-magenta-50/30 focus:ring-0 rounded-none w-full"
                                    />
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full h-14 bg-magenta-600 hover:bg-magenta-500 text-white shadow-lg shadow-magenta-900/40 uppercase tracking-widest text-xs rounded-none transition-all"
                                    onClick={startReading}
                                >
                                    Embaralhar as Cartas
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 'shuffling' && (
                    <motion.div
                        key="shuffling"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 space-y-12"
                    >
                        {/* Shuffling Animation */}
                        <div className="relative w-48 h-72">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 bg-midnight-900 border border-magenta-500/40 shadow-2xl origin-bottom"
                                    animate={{
                                        rotate: [0, -10, 10, 0],
                                        x: [0, -20, 20, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="absolute inset-2 border border-magenta-500/20 flex items-center justify-center bg-midnight-950/50">
                                        <Sparkles className="w-8 h-8 text-magenta-500/30" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-magenta-200/60 font-display text-lg animate-pulse tracking-wide">
                            As energias estão se alinhando...
                        </p>
                    </motion.div>
                )}

                {step === 'reading' && reading && (
                    <motion.div
                        key="reading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        {/* 3 Card Spread */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['Passado', 'Presente', 'Futuro'].map((pos, i) => (
                                <motion.div
                                    key={pos}
                                    initial={{ opacity: 0, y: 50, rotateY: 90 }}
                                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                    transition={{ delay: i * 0.3 + 0.5, duration: 0.8 }}
                                    className="aspect-[2/3]"
                                >
                                    <CardFront card={cards[i]} position={pos} />
                                </motion.div>
                            ))}
                        </div>

                        {/* AI Interpretation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 }}
                        >
                            <Card className="border border-magenta-50/10 bg-midnight-900/80 backdrop-blur-md rounded-none shadow-2xl">
                                <CardContent className="p-8 sm:p-12">
                                    <div className="prose prose-invert prose-p:font-light prose-p:text-magenta-50/80 prose-headings:text-magenta-200 prose-strong:text-magenta-100 max-w-none">
                                        <ReactMarkdown>{reading}</ReactMarkdown>
                                    </div>

                                    <div className="mt-12 text-center pt-8 border-t border-white/5">
                                        <Button
                                            onClick={reset}
                                            variant="outline"
                                            className="border-magenta-50/20 hover:bg-magenta-50/10 text-magenta-100 uppercase tracking-widest text-xs h-12 px-8 rounded-none"
                                        >
                                            Nova Leitura
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
