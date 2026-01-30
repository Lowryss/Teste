'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Infinity as InfinityIcon, Calculator, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'

const numerologySchema = z.object({
    name1: z.string().min(2, 'Nome é necessário'),
    birth1: z.string().min(10, 'Data completa necessária'),
    name2: z.string().min(2, 'Nome da pessoa 2 é necessário'),
    birth2: z.string().min(10, 'Data completa pessoa 2 necessária'),
    context: z.string().optional()
})

type NumerologyFormValues = z.infer<typeof numerologySchema>

export default function NumerologyPage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const methods = useForm<NumerologyFormValues>({
        resolver: zodResolver(numerologySchema),
        defaultValues: {
            name1: user?.displayName || '',
            birth1: '',
            name2: '',
            birth2: '',
            context: ''
        }
    })

    const onSubmit = async (data: NumerologyFormValues) => {
        if ((user?.cosmicPoints || 0) < 20) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 20 pontos cósmicos.' })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/ai/numerology', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    compatData: {
                        name1: data.name1,
                        birth1: data.birth1,
                        name2: data.name2,
                        birth2: data.birth2
                    },
                    context: data.context
                })
            })

            const resultData = await res.json()

            if (!res.ok) throw new Error(resultData.error)

            setResult(resultData.content)
            addToast({ type: 'success', title: 'Equação Resolvida', message: 'Os números do destino foram calculados.' })

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro de Cálculo', message: error.message })
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setResult(null)
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                </Link>
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
                    <span className="text-gold-500">∞</span> Numerologia do Amor
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
                                    <CardTitle>Análise de Compatibilidade Numérica</CardTitle>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm">
                                        <Sparkles className="w-3 h-3" /> Custo: 20 Pontos
                                    </div>
                                </div>
                                <CardDescription>
                                    A união mais profunda que oferecemos. Cruzamento de destinos, expressões e ciclos de vida.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Person 1 */}
                                            <div className="space-y-4 p-6 rounded-xl bg-midnight-900/50 border border-white/5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-9xl font-display text-white">1</div>
                                                <h3 className="text-lg font-semibold text-gold-300">Sua Vibração</h3>
                                                <FormField name="name1" label="Nome Completo (Certidão)" placeholder="Como na certidão de nascimento" />
                                                <FormField name="birth1" label="Data de Nascimento" type="date" />
                                            </div>

                                            {/* Person 2 */}
                                            <div className="space-y-4 p-6 rounded-xl bg-midnight-900/50 border border-white/5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-9xl font-display text-white">2</div>
                                                <h3 className="text-lg font-semibold text-gold-300">Vibração do Parceiro(a)</h3>
                                                <FormField name="name2" label="Nome Completo (Certidão)" placeholder="Como na certidão de nascimento" />
                                                <FormField name="birth2" label="Data de Nascimento" type="date" />
                                            </div>
                                        </div>

                                        <FormField
                                            name="context"
                                            label="Pergunta Específica (Opcional)"
                                            placeholder="Ex: Estamos pensando em casar..."
                                        />

                                        <div className="flex justify-center pt-4">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full md:w-1/2 bg-gold-600 hover:bg-gold-500 text-midnight-900 font-bold shadow-lg shadow-gold-900/20"
                                                isLoading={loading}
                                            >
                                                <Calculator className="ml-2 w-5 h-5 mr-2" /> Calcular Destinos Cruzados
                                            </Button>
                                        </div>
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
                        <Card variant="glass" className="border-gold-500/30 bg-midnight-800/80 shadow-[0_0_50px_rgba(251,191,36,0.1)]">
                            <CardContent className="p-8 sm:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <InfinityIcon className="w-64 h-64 text-gold-500" />
                                </div>

                                <div className="relative z-10 prose prose-invert prose-lg max-w-none prose-p:text-gray-200 prose-headings:text-gold-300 prose-strong:text-gold-200 prose-table:border-white/10 prose-th:text-gold-400">
                                    <ReactMarkdown>{result}</ReactMarkdown>
                                </div>

                                <div className="mt-12 text-center pt-8 border-t border-white/5 relative z-10">
                                    <Button onClick={reset} variant="secondary">
                                        Nova Análise
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
