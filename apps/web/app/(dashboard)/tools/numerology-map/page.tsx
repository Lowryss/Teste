'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GradientText, FloatingParticles, GlowRing } from '@/components/CosmicEffects'
import { PremiumGlassCard, HolographicCard } from '@/components/PremiumGlassEffects'
import { Sparkles, Fingerprint } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NumerologyMapPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'input' | 'processing' | 'result'>('input')
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: ''
    })
    const [result, setResult] = useState<any>(null)

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.fullName || !formData.birthDate) {
            addToast({ type: 'error', title: 'Dados incompletos', message: 'Preencha nome e data de nascimento.' })
            return
        }

        const COST = 100
        if (!user?.cosmicPoints || user.cosmicPoints < COST) {
            addToast({ type: 'error', title: 'Energia Insuficiente', message: `Você precisa de ${COST} pontos.` })
            return
        }

        setStep('processing')

        try {
            const token = await user?.getIdToken()
            const res = await fetch('/api/readings/numerology-map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setResult(data)
                setStep('result')
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error(error)
            addToast({ type: 'error', title: 'Erro', message: 'Falha ao calcular mapa numérico.' })
            setStep('input')
        }
    }

    return (
        <div className="min-h-screen relative pb-20 pt-10">
            <CosmicBackground />
            <FloatingParticles count={15} color="magenta" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-magenta-900/30 border border-magenta-500/20 mb-4">
                        <Fingerprint className="w-4 h-4 text-magenta-400" />
                        <span className="text-xs font-mono text-magenta-200 uppercase tracking-widest">Autoconhecimento</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Mapa <GradientText animate>Numerológico</GradientText>
                    </h1>
                    <p className="text-magenta-100/60 text-lg max-w-xl mx-auto">
                        Descubra os números que regem sua alma, sua personalidade e seu destino.
                    </p>
                </div>

                {step === 'input' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <PremiumGlassCard glowColor="magenta" intensity="high" className="p-8">
                            <form onSubmit={handleCalculate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white">Nome Completo</Label>
                                    <Input
                                        type="text"
                                        placeholder="Como na certidão de nascimento"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white">Data de Nascimento</Label>
                                    <Input
                                        type="date"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-magenta-600 via-pink-600 to-purple-600 hover:from-magenta-500 hover:via-pink-500 hover:to-purple-500 text-white text-lg font-display tracking-widest shadow-lg shadow-magenta-500/50">
                                    Calcular Mapa <span className="ml-2 text-xs bg-black/30 px-2 py-1 rounded">100 pts</span>
                                </Button>
                            </form>
                        </PremiumGlassCard>
                    </motion.div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                        <GlowRing color="magenta" size="lg">
                            <span className="text-2xl font-display text-white animate-pulse">∞</span>
                        </GlowRing>
                        <p className="text-magenta-200 animate-pulse text-xl font-display">Calculando Vibrações...</p>
                    </div>
                )}

                {step === 'result' && result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Numbers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <NumberCard
                                title="Alma"
                                number={result.numbers.soul}
                                description="Seus desejos mais profundos e motivações internas."
                                color="rose"
                            />
                            <NumberCard
                                title="Destino"
                                number={result.numbers.destiny}
                                description="Sua missão de vida e talentos naturais."
                                color="magenta"
                                highlighted
                            />
                            <NumberCard
                                title="Personalidade"
                                number={result.numbers.personality}
                                description="Como o mundo te vê e sua primeira impressão."
                                color="purple"
                            />
                        </div>

                        {/* Analysis Content */}
                        <HolographicCard className="p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                                <Sparkles className="w-8 h-8 text-magenta-400" />
                                <h2 className="text-3xl font-display text-white">Análise Vibracional</h2>
                            </div>

                            <div
                                className="prose prose-invert prose-lg max-w-none prose-p:text-magenta-50/80 prose-headings:text-magenta-200 prose-strong:text-white"
                                dangerouslySetInnerHTML={{ __html: result.content }}
                            />

                            <div className="mt-12 flex justify-center">
                                <Button variant="outline" onClick={() => setStep('input')} className="border-white/20 text-white hover:bg-white/10">
                                    Calcular Outro Mapa
                                </Button>
                            </div>
                        </HolographicCard>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

function NumberCard({ title, number, description, color, highlighted = false }: { title: string, number: number, description: string, color: 'rose' | 'magenta' | 'purple', highlighted?: boolean }) {
    return (
        <PremiumGlassCard glowColor={color} intensity="medium" className={`p-6 text-center h-full flex flex-col items-center ${highlighted ? 'border-magenta-500/50' : ''}`}>
            <h3 className="text-white/60 uppercase tracking-widest text-sm mb-4 font-bold">{title}</h3>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br mb-6 ${highlighted ? 'from-magenta-500 via-purple-500 to-indigo-500 scale-110' : 'from-white/10 to-white/5'}`}>
                <span className="text-5xl font-display text-white">{number}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">{description}</p>
        </PremiumGlassCard>
    )
}
