'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Moon, CloudMoon, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'

const dreamSchema = z.object({
    dream: z.string().min(20, 'Descreva seu sonho com mais detalhes (mínimo 20 caracteres).'),
    context: z.string().optional()
})

type DreamFormValues = z.infer<typeof dreamSchema>

export default function DreamsPage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const methods = useForm<DreamFormValues>({
        resolver: zodResolver(dreamSchema),
        defaultValues: {
            dream: '',
            context: ''
        }
    })

    const onSubmit = async (data: DreamFormValues) => {
        if ((user?.cosmicPoints || 0) < 10) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 10 pontos cósmicos.' })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/ai/dreams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    dream: data.dream,
                    context: data.context
                })
            })

            const resultData = await res.json()

            if (!res.ok) throw new Error(resultData.error)

            setResult(resultData.content)
            addToast({ type: 'success', title: 'Sonho Decifrado', message: 'A mensagem do subconsciente foi revelada.' })

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro de Interpretação', message: error.message })
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setResult(null)
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
                    <span className="text-purple-400">☾</span> Diário dos Sonhos
                </h1>
            </div>

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-midnight-800/50 border-midnight-700">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>O que você sonhou?</CardTitle>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
                                        <Sparkles className="w-3 h-3" /> Custo: 10 Pontos
                                    </div>
                                </div>
                                <CardDescription>
                                    Descreva seu sonho com o máximo de detalhes possível. Cores, sensações e pessoas são importantes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="space-y-4">
                                            <FormField
                                                name="dream"
                                                label="Descrição do Sonho"
                                                placeholder="Eu estava voando sobre um oceano roxo..."
                                                component={Textarea}
                                                className="min-h-[200px] resize-none items-start bg-midnight-900/50 focus:bg-midnight-900 transition-colors"
                                            />

                                            <FormField
                                                name="context"
                                                label="Contexto da Vida Real (Opcional)"
                                                placeholder="Ex: Estou passando por mudanças no trabalho..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner size="sm" className="mr-2 text-white" /> Navegando no Subconsciente...
                                                </>
                                            ) : (
                                                <>
                                                    Interpretar Sonho <CloudMoon className="ml-2 w-5 h-5 fill-current" />
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
                        <Card variant="glass" className="border-purple-500/30 bg-midnight-800/80 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                            <CardContent className="p-8 sm:p-12 relative overflow-hidden">
                                <div className="fixed inset-0 pointer-events-none z-[-1]" />

                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <Moon className="w-64 h-64 text-purple-500" />
                                </div>

                                <div className="relative z-10 prose prose-invert prose-lg max-w-none prose-p:text-gray-200 prose-headings:text-purple-300 prose-strong:text-purple-200">
                                    <ReactMarkdown>{result}</ReactMarkdown>
                                </div>

                                <div className="mt-12 text-center pt-8 border-t border-white/5 relative z-10">
                                    <Button onClick={reset} variant="secondary">
                                        Registrar Novo Sonho
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
