'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GlowCard, GradientText, FloatingParticles, GlowRing } from '@/components/CosmicEffects'
import { Crown, Shield, Zap, User } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ArchetypePage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'input' | 'processing' | 'result'>('input')
    const [formData, setFormData] = useState({ name: '', birthDate: '' })
    const [result, setResult] = useState<any>(null)

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.birthDate) {
            addToast({ type: 'error', title: 'Dados incompletos', message: 'Preencha nome e data.' })
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
            const res = await fetch('/api/readings/archetypes', {
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
            addToast({ type: 'error', title: 'Erro', message: 'Falha ao descobrir arquétipo.' })
            setStep('input')
        }
    }

    return (
        <div className="min-h-screen relative pb-20 pt-10">
            <CosmicBackground />
            <FloatingParticles count={20} color="gold" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/30 border border-amber-500/20 mb-4">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono text-amber-200 uppercase tracking-widest">Psicologia Junguiana Mística</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Seu <GradientText animate>Arquétipo</GradientText>
                    </h1>
                    <p className="text-amber-100/60 text-lg max-w-xl mx-auto">
                        Qual é o personagem mítico que protagoniza a sua jornada?
                    </p>
                </div>

                {step === 'input' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <GlowCard glowColor="gold" className="p-8">
                            <form onSubmit={handleCalculate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white">Seu Nome Completo</Label>
                                    <Input
                                        type="text"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

                                <Button type="submit" className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-lg font-display tracking-widest mt-4 shadow-lg shadow-amber-900/50">
                                    Revelar Arquétipo <span className="ml-2 text-xs bg-black/20 px-2 py-1 rounded">100 pts</span>
                                </Button>
                            </form>
                        </GlowCard>
                    </motion.div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8">
                        <GlowRing color="gold" size="lg">
                            <User className="w-8 h-8 text-amber-200 animate-pulse" />
                        </GlowRing>
                        <p className="text-amber-200 animate-pulse text-xl font-display text-center">
                            Acessando Inconsciente Coletivo...<br />
                            <span className="text-sm opacity-60 font-sans">Analisando jornada do herói</span>
                        </p>
                    </div>
                )}

                {step === 'result' && result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Archetype Hero Card */}
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-2xl">
                                <div className="absolute inset-0 bg-amber-500/10 blur-[80px] rounded-full" />
                                <GlowCard glowColor="gold" className="p-10 text-center border-amber-500/50 relative z-10 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

                                    <div className="mb-4 inline-block p-4 rounded-full bg-amber-400/10 border border-amber-400/20">
                                        <Crown className="w-12 h-12 text-amber-300" />
                                    </div>

                                    <h2 className="text-sm text-amber-300 font-bold uppercase tracking-[0.2em] mb-4">Arquétipo Dominante</h2>
                                    <h3 className="text-6xl font-display text-white mb-4 drop-shadow-lg">{result.archetype}</h3>

                                    <div className="flex justify-center gap-4 text-sm text-amber-200/60 mb-8 font-mono">
                                        <span>Luz: {result.traits.light}</span>
                                        <span>•</span>
                                        <span>Sombra: {result.traits.shadow}</span>
                                    </div>

                                    <div className="h-px w-2/3 mx-auto bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-8" />

                                    <div
                                        className="prose prose-invert prose-lg max-w-none text-left prose-p:text-amber-50/80 prose-headings:text-amber-200"
                                        dangerouslySetInnerHTML={{ __html: result.content }}
                                    />
                                </GlowCard>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={() => setStep('input')} className="border-white/20 text-white hover:bg-white/10">
                                Consultar Novamente
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
