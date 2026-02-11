'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GlowCard, GradientText, FloatingParticles, GlowRing } from '@/components/CosmicEffects'
import { Flame, Feather, Mountain, Sprout, Compass } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ShamanicMapPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'input' | 'processing' | 'result'>('input')
    const [birthDate, setBirthDate] = useState('')
    const [result, setResult] = useState<any>(null)

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!birthDate) {
            addToast({ type: 'error', title: 'Data necessária', message: 'Informe sua data de nascimento.' })
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
            const res = await fetch('/api/readings/shamanic-map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ birthDate })
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
            addToast({ type: 'error', title: 'Erro', message: 'Falha ao conectar com os espíritos.' })
            setStep('input')
        }
    }

    return (
        <div className="min-h-screen relative pb-20 pt-10">
            <CosmicBackground />
            <FloatingParticles count={20} color="emerald" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-500/20 mb-4">
                        <Feather className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono text-emerald-200 uppercase tracking-widest">Sabedoria Ancestral</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Mapa <GradientText animate>Xamânico</GradientText>
                    </h1>
                    <p className="text-emerald-100/60 text-lg max-w-xl mx-auto">
                        Descubra seu Animal de Poder e a medicina da Terra para sua alma.
                    </p>
                </div>

                {step === 'input' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <GlowCard glowColor="cyan" className="p-8 border-emerald-500/30">
                            <form onSubmit={handleCalculate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white">Data de Nascimento</Label>
                                    <Input
                                        type="date"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" className="w-full h-14 bg-emerald-700 hover:bg-emerald-600 text-white text-lg font-display tracking-widest mt-4">
                                    Invocar Totem <span className="ml-2 text-xs bg-black/20 px-2 py-1 rounded">100 pts</span>
                                </Button>
                            </form>
                        </GlowCard>
                    </motion.div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8">
                        <GlowRing color="cyan" size="lg">
                            <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                        </GlowRing>
                        <p className="text-emerald-200 animate-pulse text-xl font-display text-center">
                            Tocando o tambor sagrado...<br />
                            <span className="text-sm opacity-60 font-sans">Conectando com a natureza</span>
                        </p>
                    </div>
                )}

                {step === 'result' && result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Totem Highlight */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                                <GlowCard glowColor="cyan" className="p-10 text-center border-emerald-500/50 max-w-lg relative z-10">
                                    <div className="mb-6 flex justify-center">
                                        <div className="p-6 bg-emerald-900/30 rounded-full border border-emerald-500/30">
                                            <Feather className="w-16 h-16 text-emerald-400" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl text-emerald-300 font-display uppercase tracking-widest mb-2">Seu Animal de Poder</h2>
                                    <h3 className="text-5xl font-display text-white mb-6">{result.totem.animal}</h3>
                                    <p className="text-emerald-100/80 italic text-lg">"{result.totem.mantra}"</p>
                                </GlowCard>
                            </div>
                        </div>

                        {/* Medicine Wheel Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <TotemCard
                                title="Pedra"
                                value={result.totem.stone}
                                icon={<Mountain className="w-6 h-6 text-stone-400" />}
                            />
                            <TotemCard
                                title="Planta"
                                value={result.totem.plant}
                                icon={<Sprout className="w-6 h-6 text-green-400" />}
                            />
                            <TotemCard
                                title="Direção"
                                value={result.totem.direction}
                                icon={<Compass className="w-6 h-6 text-blue-400" />}
                            />
                        </div>

                        {/* Detailed Analysis */}
                        <GlowCard glowColor="cyan" className="p-8 md:p-12 border-emerald-500/20">
                            <h2 className="text-3xl font-display text-white mb-6 border-b border-white/10 pb-4">A Medicina do Seu Totem</h2>
                            <div
                                className="prose prose-invert prose-lg max-w-none prose-p:text-emerald-50/80 prose-headings:text-emerald-200"
                                dangerouslySetInnerHTML={{ __html: result.content }}
                            />

                            <div className="mt-12 text-center">
                                <Button variant="outline" onClick={() => setStep('input')} className="border-white/20 text-white hover:bg-white/10">
                                    Consultar Outro Totem
                                </Button>
                            </div>
                        </GlowCard>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

function TotemCard({ title, value, icon }: any) {
    return (
        <div className="bg-emerald-950/30 border border-emerald-500/20 p-6 rounded-xl flex items-center gap-4 hover:bg-emerald-900/30 transition-colors">
            <div className="p-3 bg-emerald-900/50 rounded-full">
                {icon}
            </div>
            <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block">{title}</span>
                <span className="text-lg text-white font-display">{value}</span>
            </div>
        </div>
    )
}
