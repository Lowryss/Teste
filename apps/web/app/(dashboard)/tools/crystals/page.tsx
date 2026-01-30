'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Gem, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'

const crystalSchema = z.object({
    intention: z.string().min(3, 'Descreva o que você está sentindo ou buscando.'),
    context: z.string().optional()
})

type CrystalFormValues = z.infer<typeof crystalSchema>

export default function CrystalsPage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const methods = useForm<CrystalFormValues>({
        resolver: zodResolver(crystalSchema),
        defaultValues: {
            intention: '',
            context: ''
        }
    })

    const onSubmit = async (data: CrystalFormValues) => {
        if ((user?.cosmicPoints || 0) < 7) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 7 pontos cósmicos.' })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/ai/crystals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    intention: data.intention,
                    context: data.context
                })
            })

            const resultData = await res.json()

            if (!res.ok) throw new Error(resultData.error)

            setResult(resultData.content)
            addToast({ type: 'success', title: 'Cristal Revelado', message: 'Sua pedra de poder foi escolhida.' })

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro de Conexão', message: error.message })
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
                    <span className="text-cyan-400">♦</span> Oráculo dos Cristais
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
                                    <CardTitle>Qual energia você busca?</CardTitle>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
                                        <Sparkles className="w-3 h-3" /> Custo: 7 Pontos
                                    </div>
                                </div>
                                <CardDescription>
                                    Conte-nos como você está se sentindo ou o que deseja atrair (ex: "ansiedade", "amor próprio", "clareza mental").
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="space-y-4">
                                            <FormField
                                                name="intention"
                                                label="Sua Intenção ou Sentimento"
                                                placeholder="Ex: Estou me sentindo muito cansado mentalmente..."
                                                component={Textarea}
                                                className="min-h-[100px] resize-none items-start bg-midnight-900/50 focus:bg-midnight-900 transition-colors"
                                            />

                                            <FormField
                                                name="context"
                                                label="Contexto (Opcional)"
                                                placeholder="Ex: Tenho uma reunião importante amanhã."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner size="sm" className="mr-2 text-white" /> Consultando a Terra...
                                                </>
                                            ) : (
                                                <>
                                                    Descobrir Meu Cristal <Gem className="ml-2 w-5 h-5 fill-current" />
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
                        <Card variant="glass" className="border-cyan-500/30 bg-midnight-800/80 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
                            <CardContent className="p-8 sm:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <Gem className="w-64 h-64 text-cyan-500" />
                                </div>

                                <div className="relative z-10 prose prose-invert prose-lg max-w-none prose-p:text-gray-200 prose-headings:text-cyan-300 prose-strong:text-cyan-200">
                                    <ReactMarkdown>{result}</ReactMarkdown>
                                </div>

                                <div className="mt-12 text-center pt-8 border-t border-white/5 relative z-10">
                                    <Button onClick={reset} variant="secondary">
                                        Nova Consulta
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
