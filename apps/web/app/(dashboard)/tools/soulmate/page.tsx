'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { SIGNS_PT, ZodiacSign } from '@/lib/ai/prompts/horoscope'

const soulmateSchema = z.object({
    userName: z.string().min(2, 'Seu nome é necessário'),
    userSign: z.string().min(1, 'Selecione seu signo'),
    partnerName: z.string().min(2, 'Nome do parceiro(a) é necessário'),
    partnerSign: z.string().min(1, 'Selecione o signo dele(a)'),
    context: z.string().optional()
})

type SoulmateFormValues = z.infer<typeof soulmateSchema>

const SIGNS_OPTIONS = Object.entries(SIGNS_PT).map(([value, label]) => ({ value, label }))

export default function SoulmatePage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const methods = useForm<SoulmateFormValues>({
        resolver: zodResolver(soulmateSchema),
        defaultValues: {
            userName: user?.displayName || '',
            userSign: '',
            partnerName: '',
            partnerSign: '',
            context: ''
        }
    })

    const onSubmit = async (data: SoulmateFormValues) => {
        if ((user?.cosmicPoints || 0) < 8) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 8 pontos cósmicos.' })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/ai/soulmate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    userData: { name: data.userName, sign: SIGNS_PT[data.userSign as ZodiacSign] },
                    partnerData: { name: data.partnerName, sign: SIGNS_PT[data.partnerSign as ZodiacSign] },
                    context: data.context
                })
            })

            const resultData = await res.json()

            if (!res.ok) throw new Error(resultData.error)

            setResult(resultData.content)
            addToast({ type: 'success', title: 'Almas Conectadas', message: 'A compatibilidade foi revelada.' })

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro de Conexão', message: error.message })
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setResult(null)
        methods.reset({ ...methods.getValues(), context: '' }) // keeps names/signs optionally
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
                    <span className="text-magenta-500">♡</span> Alma Gêmea
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
                                    <CardTitle>Calculadora de Compatibilidade</CardTitle>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magenta-500/10 border border-magenta-500/20 text-magenta-400 text-sm">
                                        <Sparkles className="w-3 h-3" /> Custo: 8 Pontos
                                    </div>
                                </div>
                                <CardDescription>
                                    Descubra a sinergia cósmica entre você e seu amor através de uma análise profunda e poética.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">

                                        {/* User Data */}
                                        <div className="space-y-4 p-4 rounded-lg bg-midnight-900/30 border border-white/5">
                                            <h3 className="text-sm font-semibold text-magenta-300 uppercase tracking-widest">Sua Energia</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField name="userName" label="Seu Nome" placeholder="Nome completo" />

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-magenta-200 ml-1">Seu Signo</label>
                                                    <select
                                                        {...methods.register('userSign')}
                                                        className="flex w-full rounded-md border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-base text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500 transition-all hover:border-magenta-500/30"
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {SIGNS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Partner Data */}
                                        <div className="space-y-4 p-4 rounded-lg bg-midnight-900/30 border border-white/5">
                                            <h3 className="text-sm font-semibold text-teal-300 uppercase tracking-widest">Energia Dele(a)</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField name="partnerName" label="Nome do Parceiro(a)" placeholder="Nome completo" />

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-magenta-200 ml-1">Signo Dele(a)</label>
                                                    <select
                                                        {...methods.register('partnerSign')}
                                                        className="flex w-full rounded-md border border-midnight-700 bg-midnight-800/50 px-3 py-2 text-base text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500 transition-all hover:border-magenta-500/30"
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {SIGNS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <FormField
                                            name="context"
                                            label="Contexto Adicional (Opcional)"
                                            placeholder="Ex: Estamos namorando há 3 meses..."
                                            component={Textarea}
                                            className="min-h-[100px] resize-none"
                                        />

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-magenta-600 to-teal-600 hover:from-magenta-500 hover:to-teal-500 text-white shadow-lg shadow-magenta-900/20"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner size="sm" className="mr-2 text-white" /> Analisando as Estrelas...
                                                </>
                                            ) : (
                                                <>
                                                    Calcular Compatibilidade <Heart className="ml-2 w-5 h-5 fill-current" />
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
                            <CardContent className="p-8 sm:p-12 relative overflow-hidden">
                                {/* Decorative Background */}
                                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                                    <Heart className="w-64 h-64 text-magenta-500" />
                                </div>

                                <div className="relative z-10 prose prose-invert prose-lg max-w-none prose-p:text-gray-200 prose-headings:text-magenta-400 prose-strong:text-magenta-200">
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
