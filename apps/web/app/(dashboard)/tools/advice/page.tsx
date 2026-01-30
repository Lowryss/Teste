'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, MessageCircleHeart, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'

const adviceSchema = z.object({
    context: z.string().min(10, 'Descreva um pouco mais sobre sua situação (mínimo 10 caracteres).'),
    category: z.enum(['love', 'career', 'spirituality', 'self-knowledge'])
})

type AdviceFormValues = z.infer<typeof adviceSchema>

export default function AdvicePage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [advice, setAdvice] = useState<string | null>(null)

    const methods = useForm<AdviceFormValues>({
        resolver: zodResolver(adviceSchema),
        defaultValues: {
            context: '',
            category: 'love'
        }
    })

    const onSubmit = async (data: AdviceFormValues) => {
        if ((user?.cosmicPoints || 0) < 3) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 3 pontos cósmicos.' })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/ai/advice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    context: data.context,
                    category: data.category
                })
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.error)

            setAdvice(result.content)
            addToast({ type: 'success', title: 'Conselho Recebido', message: 'A sabedoria fluiu para você.' })

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro no Conselho', message: error.message })
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setAdvice(null)
        methods.reset()
    }

    return (
        <div className="max-w-3xl mx-auto pb-12 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                </Link>
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
                    <span className="text-magenta-500">♥</span> Conselhos do Coração
                </h1>
            </div>

            <AnimatePresence mode="wait">
                {!advice ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-midnight-800/50 border-midnight-700">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Qual é sua dúvida hoje?</CardTitle>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magenta-500/10 border border-magenta-500/20 text-magenta-400 text-sm">
                                        <Sparkles className="w-3 h-3" /> Custo: 3 Pontos
                                    </div>
                                </div>
                                <CardDescription>
                                    Descreva sua situação e receba uma orientação espiritual personalizada.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            {['love', 'career', 'spirituality', 'self-knowledge'].map((cat) => (
                                                <div key={cat} className="relative">
                                                    <input
                                                        type="radio"
                                                        id={cat}
                                                        value={cat}
                                                        {...methods.register('category')}
                                                        className="peer sr-only"
                                                    />
                                                    <label
                                                        htmlFor={cat}
                                                        className="flex flex-col items-center justify-center p-4 rounded-lg border border-midnight-600 bg-midnight-900/50 cursor-pointer transition-all hover:bg-midnight-800 peer-checked:border-magenta-500 peer-checked:bg-magenta-500/10 peer-checked:text-white text-gray-400"
                                                    >
                                                        <span className="capitalize">{cat === 'love' ? 'Amor' : cat === 'career' ? 'Carreira' : cat === 'spirituality' ? 'Espiritualidade' : 'Autoconhecimento'}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <FormField
                                            name="context"
                                            label="O que está acontecendo?"
                                            placeholder="Ex: Estou me sentindo insegura sobre..."
                                            // @ts-ignore - Input component handles props but TS complains about textarea specific props if strictly typed as InputHTMLAttributes
                                            as="textarea"
                                            className="min-h-[150px] resize-none items-start"
                                        />

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-magenta-600 hover:bg-magenta-500 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner size="sm" className="mr-2 text-white" /> Meditando sobre sua questão...
                                                </>
                                            ) : (
                                                <>
                                                    Receber Conselho <MessageCircleHeart className="ml-2 w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </FormProvider>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <Card variant="glass" className="border-magenta-500/30 bg-midnight-800/80 shadow-[0_0_50px_rgba(219,39,119,0.1)]">
                            <CardContent className="p-8 sm:p-12">
                                <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-200 prose-headings:text-magenta-400 prose-strong:text-magenta-200 prose-blockquote:border-l-magenta-500 prose-blockquote:bg-magenta-500/5 prose-blockquote:rounded-r-lg prose-blockquote:py-2">
                                    <ReactMarkdown>{advice}</ReactMarkdown>
                                </div>

                                <div className="mt-12 text-center pt-8 border-t border-white/5">
                                    <p className="text-gray-400 mb-4 text-sm">Esse conselho ressoou com você?</p>
                                    <Button onClick={reset} variant="secondary">
                                        Fazer Nova Pergunta
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
