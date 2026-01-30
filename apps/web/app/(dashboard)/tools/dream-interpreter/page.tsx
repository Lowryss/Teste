'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { CosmicBackground, GlowCard, GradientText, GradientButton, FloatingParticles } from '@/components/CosmicEffects'
import { useToast } from '@/contexts/ToastContext'
import { Cloud, Moon, Sparkles, BookOpen, RefreshCw } from 'lucide-react'

export default function DreamInterpreterPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [dream, setDream] = useState('')
    const [interpretation, setInterpretation] = useState<string | null>(null)

    const handleInterpret = async () => {
        if (!dream) return

        setLoading(true)
        try {
            const token = await user?.getIdToken()
            // Simulação de chamada de API
            await new Promise(r => setTimeout(r, 3000))

            setInterpretation(`
                <h3>O Simbolismo do Seu Sonho</h3>
                <p>Sonhar com essa situação sugere que seu subconsciente está processando emoções de <strong>transformação</strong>.</p>
                <h4>Significados Ocultos:</h4>
                <ul>
                    <li>Desejo de liberdade ainda não expresso.</li>
                    <li>Necessidade de reconexão espiritual.</li>
                </ul>
                <p>O universo aconselha: <em>"Confie na sua intuição nas próximas 24 horas."</em></p>
            `)
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', message: 'Não foi possível conectar ao plano onírico.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative pb-20 flex flex-col items-center justify-center">
            <CosmicBackground />
            <FloatingParticles count={40} color="purple" />

            {/* Efeito de Névoa */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent opacity-80" />
                <motion.div
                    animate={{ opacity: [0.3, 0.5, 0.3], x: [-20, 20, -20] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/foggy-birds.png')] mix-blend-screen opacity-30"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <header className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/20 mb-4">
                        <Cloud className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-mono text-purple-200 uppercase tracking-widest">Oráculo dos Sonhos</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Interpretação de <GradientText animate>Sonhos</GradientText>
                    </h1>
                    <p className="text-purple-100/60 max-w-xl mx-auto text-lg">
                        Desvende as mensagens ocultas do seu subconsciente.
                        Relate seu sonho e a IA mística revelará seus segredos.
                    </p>
                </header>

                <GlowCard glowColor="purple" className="p-8 md:p-12 relative overflow-hidden">
                    {/* Elemento Decorativo flutuante */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="space-y-6 relative">
                        {!interpretation ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <label className="block text-purple-200 font-display text-xl">O que você sonhou?</label>
                                <textarea
                                    value={dream}
                                    onChange={(e) => setDream(e.target.value)}
                                    placeholder="Descreva seu sonho com o máximo de detalhes possível... Ex: Eu estava voando sobre uma cidade de cristal..."
                                    className="w-full h-48 bg-midnight-900/50 border border-purple-500/30 rounded-xl p-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none backdrop-blur-sm"
                                />

                                <div className="flex justify-end">
                                    <GradientButton
                                        onClick={handleInterpret}
                                        disabled={!dream || loading}
                                        size="lg"
                                        variant="secondary"
                                        className="w-full md:w-auto min-w-[200px]"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Moon className="w-4 h-4 animate-spin" /> Consultando o Oráculo...
                                            </span>
                                        ) : (
                                            <><BookOpen className="w-5 h-5 mr-2" /> Interpretar Sonho</>
                                        )}
                                    </GradientButton>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex items-center gap-4 text-purple-300 border-b border-purple-500/20 pb-4">
                                    <Moon className="w-8 h-8" />
                                    <h2 className="text-2xl font-display">Revelação</h2>
                                </div>

                                <div
                                    className="prose prose-invert prose-lg prose-p:text-purple-50/80 prose-headings:text-purple-200 prose-strong:text-purple-300"
                                    dangerouslySetInnerHTML={{ __html: interpretation }}
                                />

                                <div className="pt-6 flex justify-end">
                                    <button
                                        onClick={() => setInterpretation(null)}
                                        className="text-purple-400 hover:text-white flex items-center gap-2 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Interpretar outro sonho
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </GlowCard>
            </div>
        </div>
    )
}
