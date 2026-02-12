"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { Heart, Loader2, Sparkles, TrendingUp, MessageCircle, Zap, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ZODIAC_SIGNS = [
    'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
    'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

export default function DeepCompatibilityPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const [person1Name, setPerson1Name] = useState('')
    const [person1BirthDate, setPerson1BirthDate] = useState('')
    const [person1ZodiacSign, setPerson1ZodiacSign] = useState('')

    const [person2Name, setPerson2Name] = useState('')
    const [person2BirthDate, setPerson2BirthDate] = useState('')
    const [person2ZodiacSign, setPerson2ZodiacSign] = useState('')

    const handleAnalyze = async () => {
        if (!user) return

        setLoading(true)
        setResult(null)

        try {
            const token = await user.getIdToken()
            const response = await fetch('/api/deep-compatibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    person1Name,
                    person1BirthDate,
                    person1ZodiacSign,
                    person2Name,
                    person2BirthDate,
                    person2ZodiacSign
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erro ao analisar compatibilidade')
            }

            const data = await response.json()
            setResult(data)

        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-500'
        if (score >= 60) return 'from-cyan-500 to-blue-500'
        if (score >= 40) return 'from-amber-500 to-orange-500'
        return 'from-red-500 to-rose-500'
    }

    const getScoreText = (score: number) => {
        if (score >= 90) return 'Conexão Extraordinária'
        if (score >= 80) return 'Alta Compatibilidade'
        if (score >= 70) return 'Boa Compatibilidade'
        if (score >= 60) return 'Compatibilidade Moderada'
        if (score >= 50) return 'Desafiador mas Possível'
        return 'Muitos Desafios'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-purple-950/30 to-midnight-950 p-6">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Heart className="w-12 h-12 text-rose-400" />
                        <h1 className="text-5xl font-bold">
                            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Compatibilidade Profunda
                            </span>
                        </h1>
                        <Heart className="w-12 h-12 text-rose-400" />
                    </div>
                    <p className="text-zinc-400 text-lg">Análise completa: Astrologia + Numerologia + Insights de Relacionamento</p>
                </motion.div>

                {/* Form */}
                <AnimatePresence mode="wait">
                    {!result && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Person 1 */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-magenta-500 to-pink-500 flex items-center justify-center text-sm">1</span>
                                        Primeira Pessoa
                                    </h3>
                                    <div>
                                        <Label className="text-zinc-300">Nome Completo</Label>
                                        <Input
                                            value={person1Name}
                                            onChange={(e) => setPerson1Name(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                            placeholder="Nome completo"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-300">Data de Nascimento</Label>
                                        <Input
                                            type="date"
                                            value={person1BirthDate}
                                            onChange={(e) => setPerson1BirthDate(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-300">Signo Solar</Label>
                                        <Select
                                            value={person1ZodiacSign}
                                            onChange={(e) => setPerson1ZodiacSign(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                        >
                                            <option value="">Selecione o signo</option>
                                            {ZODIAC_SIGNS.map(sign => (
                                                <option key={sign} value={sign}>{sign}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                {/* Person 2 */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm">2</span>
                                        Segunda Pessoa
                                    </h3>
                                    <div>
                                        <Label className="text-zinc-300">Nome Completo</Label>
                                        <Input
                                            value={person2Name}
                                            onChange={(e) => setPerson2Name(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                            placeholder="Nome completo"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-300">Data de Nascimento</Label>
                                        <Input
                                            type="date"
                                            value={person2BirthDate}
                                            onChange={(e) => setPerson2BirthDate(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-zinc-300">Signo Solar</Label>
                                        <Select
                                            value={person2ZodiacSign}
                                            onChange={(e) => setPerson2ZodiacSign(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                        >
                                            <option value="">Selecione o signo</option>
                                            {ZODIAC_SIGNS.map(sign => (
                                                <option key={sign} value={sign}>{sign}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={loading || !person1Name || !person2Name || !person1BirthDate || !person2BirthDate}
                                className="w-full mt-8 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:via-pink-500 hover:to-purple-500 text-white py-6 text-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Consultando as estrelas...
                                    </>
                                ) : (
                                    <>
                                        <Heart className="w-5 h-5 mr-2" />
                                        Analisar Compatibilidade (150 pontos)
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Overall Score */}
                            <div className={`backdrop-blur-xl bg-gradient-to-r ${getScoreColor(result.analysis.overallScore)}/20 border border-white/20 rounded-3xl p-8 text-center`}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                >
                                    <div className="text-7xl font-bold text-white mb-2">{result.analysis.overallScore}%</div>
                                    <div className="text-2xl text-white font-semibold mb-3">{getScoreText(result.analysis.overallScore)}</div>
                                    <div className="flex justify-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-6 h-6 ${i < Math.floor(result.analysis.overallScore / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Score Breakdown */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { key: 'emotional', label: 'Emocional', icon: Heart },
                                    { key: 'intellectual', label: 'Intelectual', icon: MessageCircle },
                                    { key: 'physical', label: 'Física', icon: Zap },
                                    { key: 'spiritual', label: 'Espiritual', icon: Sparkles }
                                ].map(({ key, label, icon: Icon }) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                                    >
                                        <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                        <div className="text-3xl font-bold text-white mb-1">{result.analysis.scoreBreakdown[key]}%</div>
                                        <div className="text-sm text-zinc-400">{label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Strengths */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                    Pontos Fortes
                                </h3>
                                <div className="space-y-3">
                                    {result.analysis.strengths.map((strength: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <Sparkles className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                            <p className="text-zinc-300">{strength}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Challenges */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-amber-400" />
                                    Desafios a Superar
                                </h3>
                                <div className="space-y-3">
                                    {result.analysis.challenges.map((challenge: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-amber-400" />
                                            </div>
                                            <p className="text-zinc-300">{challenge}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Deep Analysis */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                                >
                                    <h3 className="text-xl font-bold text-white mb-4">🌟 Análise Astrológica</h3>
                                    <p className="text-zinc-300 whitespace-pre-line">{result.analysis.astrologicalAnalysis}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                                >
                                    <h3 className="text-xl font-bold text-white mb-4">🔢 Análise Numerológica</h3>
                                    <p className="text-zinc-300 whitespace-pre-line">{result.analysis.numerologicalAnalysis}</p>
                                </motion.div>
                            </div>

                            {/* More sections... */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">💑 Dinâmica do Relacionamento</h3>
                                <p className="text-zinc-300 whitespace-pre-line">{result.analysis.relationshipDynamics}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="backdrop-blur-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">💝 Conselho do Amor</h3>
                                <p className="text-zinc-100 whitespace-pre-line text-lg">{result.analysis.loveAdvice}</p>
                            </motion.div>

                            <Button
                                onClick={() => setResult(null)}
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-white/10"
                            >
                                Nova Análise
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
