'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { CosmicBackground, GlowCard, GradientText, FloatingParticles, GradientButton } from '@/components/CosmicEffects'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Heart, Sparkles, Repeat, Infinity as InfinityIcon } from 'lucide-react'

const ZODIAC_SIGNS = [
    { name: 'Áries', icon: '♈', element: 'Fogo' },
    { name: 'Touro', icon: '♉', element: 'Terra' },
    { name: 'Gêmeos', icon: '♊', element: 'Ar' },
    { name: 'Câncer', icon: '♋', element: 'Água' },
    { name: 'Leão', icon: '♌', element: 'Fogo' },
    { name: 'Virgem', icon: '♍', element: 'Terra' },
    { name: 'Libra', icon: '♎', element: 'Ar' },
    { name: 'Escorpião', icon: '♏', element: 'Água' },
    { name: 'Sagitário', icon: '♐', element: 'Fogo' },
    { name: 'Capricórnio', icon: '♑', element: 'Terra' },
    { name: 'Aquário', icon: '♒', element: 'Ar' },
    { name: 'Peixes', icon: '♓', element: 'Água' },
]

export default function CompatibilityPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [sign1, setSign1] = useState<string | null>(null)
    const [sign2, setSign2] = useState<string | null>(null)
    const [result, setResult] = useState<any>(null)

    const handleCheckCompatibility = async () => {
        if (!sign1 || !sign2) return

        setLoading(true)
        try {
            const token = await user?.getIdToken()
            // Simulação de chamada de API
            await new Promise(r => setTimeout(r, 2500))

            setResult({
                sign1,
                sign2,
                percentage: 85,
                summary: 'Uma conexão intensa e transformadora.',
                content: `
                    <h3>Alquimia Estelar</h3>
                    <p>A combinação entre ${sign1} e ${sign2} gera uma energia poderosa. Ambos compartilham uma visão de mundo expansiva, embora possam divergir nos detalhes práticos.</p>
                    <h4>Pontos Fortes</h4>
                    <ul>
                        <li>Paixão mútua e admiração intelectual.</li>
                        <li>Capacidade de crescimento conjunto.</li>
                    </ul>
                    <h4>Desafios</h4>
                    <p>Cuidado com a teimosia. Aprender a ceder será o grande teste desta relação.</p>
                `
            })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', message: 'Falha ao calcular a sinastria.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative pb-20 flex flex-col items-center justify-center">
            <CosmicBackground />
            <FloatingParticles count={25} color="rose" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <header className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-900/30 border border-rose-500/20 mb-4">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-mono text-rose-200 uppercase tracking-widest">Sinastria Amorosa</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display text-white">
                        Compatibilidade <GradientText animate>Astral</GradientText>
                    </h1>
                </header>

                <AnimatePresence mode='wait'>
                    {!result ? (
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <GlowCard glowColor="rose" className="p-8 md:p-12">
                                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                                    {/* Seletor 1 */}
                                    <div className="space-y-4">
                                        <label className="block text-center text-rose-200 font-display text-xl">Sua Energia</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {ZODIAC_SIGNS.map(s => (
                                                <button
                                                    key={s.name}
                                                    onClick={() => setSign1(s.name)}
                                                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all ${sign1 === s.name ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-black/40 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                                >
                                                    <span className="text-xl">{s.icon}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {sign1 && <div className="text-center text-rose-400 font-bold">{sign1}</div>}
                                    </div>

                                    {/* Conector */}
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className={`w-[1px] h-20 bg-gradient-to-b from-transparent via-rose-500 to-transparent hidden md:block ${sign1 && sign2 ? 'opacity-100' : 'opacity-20'}`} />
                                        <div className={`p-4 rounded-full border border-rose-500/30 bg-rose-900/20 text-rose-400 ${sign1 && sign2 ? 'animate-pulse' : 'opacity-50'}`}>
                                            <InfinityIcon className="w-8 h-8" />
                                        </div>
                                        <div className={`w-[1px] h-20 bg-gradient-to-b from-transparent via-rose-500 to-transparent hidden md:block ${sign1 && sign2 ? 'opacity-100' : 'opacity-20'}`} />
                                    </div>

                                    {/* Seletor 2 */}
                                    <div className="space-y-4">
                                        <label className="block text-center text-rose-200 font-display text-xl">Parceiro(a)</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {ZODIAC_SIGNS.map(s => (
                                                <button
                                                    key={s.name}
                                                    onClick={() => setSign2(s.name)}
                                                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all ${sign2 === s.name ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-black/40 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                                >
                                                    <span className="text-xl">{s.icon}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {sign2 && <div className="text-center text-purple-400 font-bold">{sign2}</div>}
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-center">
                                    <GradientButton
                                        onClick={handleCheckCompatibility}
                                        disabled={!sign1 || !sign2 || loading}
                                        size="lg"
                                        variant="cosmic"
                                        className="w-full md:w-auto min-w-[300px]"
                                    >
                                        {loading ? <span className="animate-pulse">Calculando Ressonância...</span> : <><Sparkles className="w-5 h-5 mr-2" /> Calcular Compatibilidade</>}
                                    </GradientButton>
                                </div>
                            </GlowCard>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <GlowCard glowColor="magenta" className="overflow-hidden">
                                <div className="grid md:grid-cols-2">
                                    {/* Visual da Porcentagem */}
                                    <div className="bg-gradient-to-br from-rose-900/50 to-purple-900/50 p-12 flex flex-col items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />

                                        <div className="relative w-48 h-48 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                                <motion.circle
                                                    cx="96"
                                                    cy="96"
                                                    r="88"
                                                    fill="none"
                                                    stroke="url(#gradient)"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: result.percentage / 100 }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#ec4899" />
                                                        <stop offset="100%" stopColor="#a855f7" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="text-center">
                                                <span className="text-5xl font-bold text-white block">{result.percentage}%</span>
                                                <span className="text-rose-200 text-sm uppercase tracking-widest">Sinergia</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 mt-8 text-2xl font-display text-white">
                                            <span>{result.sign1}</span>
                                            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                                            <span>{result.sign2}</span>
                                        </div>
                                    </div>

                                    {/* Conteúdo do Texto */}
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div
                                            className="prose prose-invert prose-p:text-magenta-50/80 prose-headings:text-magenta-200"
                                            dangerouslySetInnerHTML={{ __html: result.content }}
                                        />

                                        <Button
                                            onClick={() => setResult(null)}
                                            variant="ghost"
                                            className="mt-8 text-magenta-300 hover:text-white hover:bg-white/10 self-start"
                                        >
                                            <Repeat className="w-4 h-4 mr-2" /> Nova Combinação
                                        </Button>
                                    </div>
                                </div>
                            </GlowCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
