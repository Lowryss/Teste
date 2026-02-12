"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Loader2, Sparkles, Smile, Meh, Frown, Heart, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MOODS = [
    { value: 'happy', label: 'Feliz', icon: Smile, color: 'text-green-400' },
    { value: 'neutral', label: 'Neutro', icon: Meh, color: 'text-cyan-400' },
    { value: 'sad', label: 'Triste', icon: Frown, color: 'text-blue-400' },
    { value: 'grateful', label: 'Grato', icon: Heart, color: 'text-rose-400' },
    { value: 'anxious', label: 'Ansioso', icon: Sparkles, color: 'text-amber-400' }
]

interface JournalEntry {
    id: string
    content: string
    mood: string
    aiComment: string
    createdAt: string
}

export default function CosmicJournalPage() {
    const { user } = useAuth()
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const [newContent, setNewContent] = useState('')
    const [newMood, setNewMood] = useState('neutral')

    const loadEntries = async () => {
        if (!user) return

        setLoading(true)
        try {
            const token = await user.getIdToken()
            const response = await fetch('/api/cosmic-journal', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Erro ao carregar entradas')

            const data = await response.json()
            setEntries(data.entries)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadEntries()
    }, [user])

    const handleSubmit = async () => {
        if (!newContent.trim() || !user) return

        setSubmitting(true)
        try {
            const token = await user.getIdToken()
            const response = await fetch('/api/cosmic-journal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: newContent,
                    mood: newMood
                })
            })

            if (!response.ok) throw new Error('Erro ao criar entrada')

            const data = await response.json()
            setEntries([data.entry, ...entries])
            setNewContent('')
            setNewMood('neutral')
            setShowForm(false)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const getMoodIcon = (mood: string) => {
        const moodData = MOODS.find(m => m.value === mood)
        return moodData || MOODS[1]
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-purple-950/30 to-midnight-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-magenta-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-purple-950/30 to-midnight-950 p-6">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BookOpen className="w-12 h-12 text-purple-400" />
                        <h1 className="text-5xl font-bold">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                Diário Cósmico
                            </span>
                        </h1>
                    </div>
                    <p className="text-zinc-400 text-lg mb-6">Suas reflexões com insights do universo</p>

                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                    >
                        {showForm ? 'Cancelar' : '+ Nova Entrada'}
                    </Button>
                </motion.div>

                {/* New Entry Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="mb-4">
                                    <label className="text-zinc-300 text-sm mb-2 block">Como você está se sentindo?</label>
                                    <Select
                                        value={newMood}
                                        onChange={(e) => setNewMood(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white"
                                    >
                                        {MOODS.map(mood => (
                                            <option key={mood.value} value={mood.value}>
                                                {mood.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <Textarea
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="O que você gostaria de registrar hoje? Seus pensamentos, sentimentos, experiências..."
                                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 min-h-[200px] mb-4"
                                    disabled={submitting}
                                />

                                <Button
                                    onClick={handleSubmit}
                                    disabled={!newContent.trim() || submitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Consultando o universo...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Registrar e Receber Insight
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Entries List */}
                <div className="space-y-6">
                    {entries.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 text-lg">Seu diário está vazio</p>
                            <p className="text-zinc-500">Comece sua jornada de autorreflexão agora</p>
                        </motion.div>
                    ) : (
                        entries.map((entry, index) => {
                            const moodData = getMoodIcon(entry.mood)
                            const MoodIcon = moodData.icon

                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                                >
                                    {/* Entry Header */}
                                    <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <MoodIcon className={`w-6 h-6 ${moodData.color}`} />
                                            <span className="text-zinc-300">{moodData.label}</span>
                                        </div>
                                        <span className="text-sm text-zinc-500">
                                            {new Date(entry.createdAt).toLocaleDateString('pt-BR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    {/* User Content */}
                                    <div className="px-6 py-4">
                                        <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                                    </div>

                                    {/* AI Comment */}
                                    {entry.aiComment && (
                                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-t border-white/10 px-6 py-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="w-5 h-5 text-cyan-400" />
                                                <span className="text-sm font-semibold text-cyan-400">Mensagem do Universo</span>
                                            </div>
                                            <div
                                                className="prose prose-invert prose-sm max-w-none text-zinc-300"
                                                dangerouslySetInnerHTML={{ __html: entry.aiComment }}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
