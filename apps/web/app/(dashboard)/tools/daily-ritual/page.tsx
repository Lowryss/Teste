"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Moon, Heart, Flame, Droplets, Wind, Mountain, Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface Ritual {
    affirmation: string
    meditation: {
        title: string
        description: string
        duration: string
    }
    crystal: {
        name: string
        properties: string
        howToUse: string
    }
    color: {
        name: string
        meaning: string
        suggestion: string
    }
    practice: {
        title: string
        description: string
        time: string
    }
    intention: string
    moonPhase: string
    element: string
}

const elementIcons: Record<string, any> = {
    'Fogo': Flame,
    'Terra': Mountain,
    'Ar': Wind,
    'Água': Droplets,
    'Water': Droplets,
    'Fire': Flame,
    'Earth': Mountain,
    'Air': Wind
}

export default function DailyRitualPage() {
    const { user } = useAuth()
    const [ritual, setRitual] = useState<Ritual | null>(null)
    const [loading, setLoading] = useState(true)
    const [cached, setCached] = useState(false)

    const loadRitual = async () => {
        if (!user) return

        setLoading(true)
        try {
            const token = await user.getIdToken()
            const response = await fetch('/api/daily-ritual', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Erro ao carregar ritual')

            const data = await response.json()
            setRitual(data.ritual)
            setCached(data.cached)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRitual()
    }, [user])

    const getElementIcon = (elementText: string) => {
        const elementName = elementText.split(' ')[0]
        const Icon = elementIcons[elementName] || Sparkles
        return Icon
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-purple-950/30 to-midnight-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-12 h-12 animate-spin text-magenta-400 mx-auto mb-4" />
                    <p className="text-zinc-300">Preparando seu ritual sagrado...</p>
                </motion.div>
            </div>
        )
    }

    if (!ritual) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-purple-950/30 to-midnight-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-zinc-300 mb-4">Erro ao carregar ritual</p>
                    <Button onClick={loadRitual} className="bg-gradient-to-r from-magenta-600 to-purple-600">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        )
    }

    const ElementIcon = getElementIcon(ritual.element)

    return (
        <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-purple-950/30 to-midnight-950 p-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        animate={{
                            y: [0, -100],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 3
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="inline-block mb-4"
                    >
                        <Sparkles className="w-16 h-16 text-magenta-400" />
                    </motion.div>
                    <h1 className="text-5xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Seu Ritual Sagrado Diário
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {cached && (
                        <div className="mt-4 inline-block">
                            <span className="text-xs text-cyan-400 backdrop-blur-md bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                                ✨ Ritual de hoje já foi gerado
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Affirmation Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 backdrop-blur-xl bg-gradient-to-r from-magenta-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 rounded-3xl p-8 text-center"
                >
                    <Moon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-3">Afirmação do Dia</h2>
                    <p className="text-xl text-zinc-100 italic leading-relaxed">"{ritual.affirmation}"</p>
                </motion.div>

                {/* Main Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Meditation */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{ritual.meditation.title}</h3>
                                <span className="text-sm text-cyan-400">{ritual.meditation.duration}</span>
                            </div>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{ritual.meditation.description}</p>
                    </motion.div>

                    {/* Crystal */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Cristal do Dia</h3>
                                <span className="text-sm text-cyan-400">{ritual.crystal.name}</span>
                            </div>
                        </div>
                        <p className="text-zinc-300 mb-3"><strong>Propriedades:</strong> {ritual.crystal.properties}</p>
                        <p className="text-zinc-300"><strong>Como usar:</strong> {ritual.crystal.howToUse}</p>
                    </motion.div>

                    {/* Color */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Cor do Dia</h3>
                                <span className="text-sm text-cyan-400">{ritual.color.name}</span>
                            </div>
                        </div>
                        <p className="text-zinc-300 mb-3"><strong>Significado:</strong> {ritual.color.meaning}</p>
                        <p className="text-zinc-300"><strong>Sugestão:</strong> {ritual.color.suggestion}</p>
                    </motion.div>

                    {/* Practice */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{ritual.practice.title}</h3>
                                <span className="text-sm text-cyan-400">{ritual.practice.time}</span>
                            </div>
                        </div>
                        <p className="text-zinc-300">{ritual.practice.description}</p>
                    </motion.div>
                </div>

                {/* Bottom Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Intention */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-magenta-400" />
                            Intenção
                        </h3>
                        <p className="text-zinc-300 italic">{ritual.intention}</p>
                    </motion.div>

                    {/* Moon Phase */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Moon className="w-5 h-5 text-cyan-400" />
                            Fase Lunar
                        </h3>
                        <p className="text-zinc-300">{ritual.moonPhase}</p>
                    </motion.div>

                    {/* Element */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <ElementIcon className="w-5 h-5 text-amber-400" />
                            Elemento
                        </h3>
                        <p className="text-zinc-300">{ritual.element}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
