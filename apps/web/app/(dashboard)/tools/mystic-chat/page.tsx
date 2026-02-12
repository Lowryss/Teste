"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, Send, Loader2, Moon, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
    role: 'user' | 'guide'
    content: string
    timestamp: Date
}

export default function MysticChatPage() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'guide',
            content: `<p>✨ Bem-vindo(a) ao <strong>Portal do Guia Místico</strong>, buscador de luz.</p>

<p>Sou sua conexão com a sabedoria ancestral e os mistérios do universo. Aqui, você pode fazer qualquer pergunta sobre:</p>

<p>🌙 <strong>Vida e Propósito</strong> - Descubra sua missão de alma<br/>
⭐ <strong>Relacionamentos</strong> - Amor, família, conexões profundas<br/>
🔮 <strong>Carreira e Abundância</strong> - Manifeste seu potencial<br/>
💫 <strong>Espiritualidade</strong> - Desenvolva sua consciência<br/>
✨ <strong>Desafios Atuais</strong> - Transforme obstáculos em crescimento</p>

<p><em>Cada mensagem custa apenas 10 pontos cósmicos. Fale com seu coração, e eu responderei com a sabedoria das estrelas.</em></p>`,
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading || !user) return

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const token = await user.getIdToken()
            const response = await fetch('/api/mystic-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erro ao enviar mensagem')
            }

            const data = await response.json()

            const guideMessage: Message = {
                role: 'guide',
                content: data.response,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, guideMessage])

        } catch (error: any) {
            console.error(error)
            const errorMessage: Message = {
                role: 'guide',
                content: `<p>⚠️ ${error.message || 'Ocorreu um erro. Tente novamente.'}</p>`,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-purple-950/30 to-midnight-950 p-6">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Sparkles className="w-8 h-8 text-magenta-400" />
                        </motion.div>
                        <h1 className="text-4xl font-bold">
                            <span className="bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Guia Místico
                            </span>
                        </h1>
                        <motion.div
                            animate={{
                                rotate: [0, -360],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        >
                            <Moon className="w-8 h-8 text-cyan-400" />
                        </motion.div>
                    </div>
                    <p className="text-zinc-400">Sabedoria ancestral ao alcance de suas perguntas</p>
                </motion.div>

                {/* Chat Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Messages Area */}
                    <div className="h-[600px] overflow-y-auto p-6 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-4 ${
                                            message.role === 'user'
                                                ? 'bg-gradient-to-br from-magenta-600 to-purple-600 text-white'
                                                : 'backdrop-blur-md bg-white/10 border border-white/20 text-zinc-100'
                                        }`}
                                    >
                                        {message.role === 'guide' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-4 h-4 text-cyan-400" />
                                                <span className="text-xs font-semibold text-cyan-400">Guia Místico</span>
                                            </div>
                                        )}
                                        <div
                                            className="prose prose-invert prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: message.content }}
                                        />
                                        <div className="text-xs opacity-60 mt-2">
                                            {message.timestamp.toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                        <span className="text-zinc-300">O Guia está consultando as estrelas...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/10 bg-white/5 p-4">
                        <div className="flex gap-3">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua pergunta ao universo..."
                                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-zinc-400 resize-none"
                                rows={2}
                                disabled={loading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="bg-gradient-to-r from-magenta-600 to-purple-600 hover:from-magenta-500 hover:to-purple-500 text-white h-auto px-6"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                            💫 Cada mensagem custa 10 pontos cósmicos • Pressione Enter para enviar
                        </p>
                    </div>
                </motion.div>

                {/* Floating Particles */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                            animate={{
                                y: [-20, -100],
                                x: [0, Math.random() * 100 - 50],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                bottom: 0
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
