'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CosmicBackground, GradientText, FloatingParticles, GlowRing } from '@/components/CosmicEffects'
import { PremiumGlassCard, HolographicCard, BorderBeam } from '@/components/PremiumGlassEffects'
import { Moon, Sun, Compass } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AstralMapPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'input' | 'processing' | 'result'>('input')
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: ''
    })
    const [result, setResult] = useState<any>(null)

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
            addToast({ type: 'error', title: 'Dados incompletos', message: 'Preencha todos os campos para um mapa preciso.' })
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
            const res = await fetch('/api/readings/astral-map', {
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
            addToast({ type: 'error', title: 'Erro', message: 'Falha ao gerar Mapa Astral.' })
            setStep('input')
        }
    }

    return (
        <div className="min-h-screen relative pb-20 pt-10">
            <CosmicBackground />
            <FloatingParticles count={20} color="cyan" />

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/30 border border-cyan-500/20 mb-4">
                        <Compass className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-mono text-cyan-200 uppercase tracking-widest">Astrologia Avançada</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Mapa <GradientText animate>Astral</GradientText>
                    </h1>
                    <p className="text-cyan-100/60 text-lg max-w-xl mx-auto">
                        A fotografia exata do céu no momento do seu nascimento.
                    </p>
                </div>

                {step === 'input' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto"
                    >
                        <BorderBeam color="cyan" className="p-8">
                            <form onSubmit={handleCalculate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white">Nome Completo</Label>
                                    <Input
                                        type="text"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-white">Data de Nascimento</Label>
                                        <Input
                                            type="date"
                                            className="bg-white/5 border-white/10 text-white"
                                            value={formData.birthDate}
                                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white">Hora (Exata)</Label>
                                        <Input
                                            type="time"
                                            className="bg-white/5 border-white/10 text-white"
                                            value={formData.birthTime}
                                            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white">Cidade e Estado</Label>
                                    <Input
                                        type="text"
                                        placeholder="Ex: São Paulo, SP"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={formData.birthPlace}
                                        onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full h-14 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:via-teal-500 hover:to-blue-500 text-white text-lg font-display tracking-widest mt-4 shadow-lg shadow-cyan-500/50">
                                    Gerar Mapa Completo <span className="ml-2 text-xs bg-black/30 px-2 py-1 rounded">100 pts</span>
                                </Button>
                            </form>
                        </BorderBeam>
                    </motion.div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8">
                        <div className="relative">
                            <GlowRing color="cyan" size="lg">
                                <Sun className="w-8 h-8 text-yellow-500 animate-spin-slow" />
                            </GlowRing>
                            <div className="absolute top-0 right-0 -m-4">
                                <GlowRing color="purple" size="sm">
                                    <Moon className="w-4 h-4 text-purple-300" />
                                </GlowRing>
                            </div>
                        </div>
                        <p className="text-cyan-200 animate-pulse text-xl font-display text-center">
                            Calculando posições planetárias...<br />
                            <span className="text-sm opacity-60 font-sans">Triangulando Sol, Lua e Ascendente</span>
                        </p>
                    </div>
                )}

                {step === 'result' && result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Big Three */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PlanetCard
                                title="Sol"
                                sign={result.planets.sun.sign}
                                description="Sua essência primordial e brilho pessoal."
                                icon={<Sun className="w-8 h-8 text-yellow-400" />}
                                color="gold"
                            />
                            <PlanetCard
                                title="Ascendente"
                                sign={result.planets.ascendant.sign}
                                description="Como você se apresenta ao mundo."
                                icon={<Compass className="w-8 h-8 text-cyan-400" />}
                                color="cyan"
                                highlighted
                            />
                            <PlanetCard
                                title="Lua"
                                sign={result.planets.moon.sign}
                                description="Suas emoções e mundo interior."
                                icon={<Moon className="w-8 h-8 text-purple-400" />}
                                color="purple"
                            />
                        </div>

                        {/* Detailed Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <HolographicCard className="p-8 md:p-12">
                                    <h2 className="text-3xl font-display text-white mb-6 border-b border-white/10 pb-4">Interpretação Profunda</h2>
                                    <div
                                        className="prose prose-invert prose-lg max-w-none prose-p:text-cyan-50/80 prose-headings:text-cyan-200"
                                        dangerouslySetInnerHTML={{ __html: result.content }}
                                    />
                                </HolographicCard>
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                {/* Elements Chart Placeholder */}
                                <PremiumGlassCard glowColor="purple" intensity="high" className="p-6">
                                    <h3 className="text-white mb-4 font-display">Elementos</h3>
                                    <div className="space-y-4">
                                        <ElementBar element="Fogo" percentage={result.elements.fire} color="bg-red-500" />
                                        <ElementBar element="Terra" percentage={result.elements.earth} color="bg-emerald-500" />
                                        <ElementBar element="Ar" percentage={result.elements.air} color="bg-yellow-200" />
                                        <ElementBar element="Água" percentage={result.elements.water} color="bg-blue-500" />
                                    </div>
                                </PremiumGlassCard>

                                <Button variant="outline" onClick={() => setStep('input')} className="w-full border-white/20 text-white hover:bg-white/10">
                                    Novo Mapa
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

function PlanetCard({ title, sign, description, icon, color, highlighted }: any) {
    return (
        <PremiumGlassCard glowColor={color} intensity="medium" className={`p-6 flex items-start gap-4 ${highlighted ? 'border-cyan-500/50' : ''}`}>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                {icon}
            </div>
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">{title}</h3>
                <p className="text-2xl font-display text-white mb-1">{sign}</p>
                <p className="text-xs text-white/60">{description}</p>
            </div>
        </PremiumGlassCard>
    )
}

function ElementBar({ element, percentage, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{element}</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    )
}
