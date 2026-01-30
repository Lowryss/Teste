'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, MapPin, Calendar, Clock, Globe, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'

const astrologySchema = z.object({
    date: z.string().min(1, 'Data de nascimento é obrigatória'),
    time: z.string().min(1, 'Hora de nascimento é obrigatória'),
    place: z.string().min(3, 'Local de nascimento é obrigatório'),
    context: z.string().optional()
})

type AstrologyFormValues = z.infer<typeof astrologySchema>

export default function AstrologyPage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const methods = useForm<AstrologyFormValues>({
        resolver: zodResolver(astrologySchema),
        defaultValues: {
            date: '',
            time: '',
            place: '',
            context: ''
        }
    })

    const onSubmit = async (data: AstrologyFormValues) => {
        if ((user?.cosmicPoints || 0) < 15) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 15 pontos cósmicos.' })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/ai/astrology', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    birthData: {
                        date: data.date,
                        time: data.time,
                        place: data.place
                    },
                    context: data.context
                })
            })

            const resultData = await res.json()

            if (!res.ok) throw new Error(resultData.error)

            setResult(resultData.content)
            addToast({ type: 'success', title: 'Mapa Revelado', message: 'O céu do seu nascimento foi decifrado.' })

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro Celestial', message: error.message })
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setResult(null)
        // Keep form data populated for adjustments
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
                    <span className="text-blue-400">⊕</span> Mapa Astral do Amor
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
                                    <CardTitle>Dados de Nascimento</CardTitle>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                                        <Sparkles className="w-3 h-3" /> Custo: 15 Pontos
                                    </div>
                                </div>
                                <CardDescription>
                                    Para calcularmos a posição dos astros no momento exato da sua chegada ao mundo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-blue-400" /> Data
                                                </label>
                                                <FormField name="date" type="date" className="bg-midnight-900/50 border-midnight-600" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-blue-400" /> Hora (Aprox.)
                                                </label>
                                                <FormField name="time" type="time" className="bg-midnight-900/50 border-midnight-600" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-blue-400" /> Cidade/Estado
                                                </label>
                                                <FormField name="place" placeholder="Ex: São Paulo, SP" className="bg-midnight-900/50 border-midnight-600" />
                                            </div>
                                        </div>

                                        <FormField
                                            name="context"
                                            label="O que você busca entender no amor? (Opcional)"
                                            placeholder="Ex: Tenho dificuldade em confiar..."
                                            // @ts-ignore
                                            as="textarea"
                                            className="min-h-[100px] resize-none"
                                        />

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner size="sm" className="mr-2 text-white" /> Calculando Órbitas Planetárias...
                                                </>
                                            ) : (
                                                <>
                                                    Gerar Mapa Astral <Globe className="ml-2 w-5 h-5" />
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
                        <Card variant="glass" className="border-blue-500/30 bg-midnight-800/80 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                            <CardContent className="p-8 sm:p-12 relative overflow-hidden">
                                {/* Decorative Background */}
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <Globe className="w-64 h-64 text-blue-500" />
                                </div>

                                <div className="relative z-10 prose prose-invert prose-lg max-w-none prose-p:text-gray-200 prose-headings:text-blue-300 prose-strong:text-blue-200">
                                    <div className="flex items-center gap-4 mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <div className="bg-blue-500 rounded-full p-2">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white m-0">Mandala Astrológica</h3>
                                            <p className="text-sm text-blue-200 m-0">Sol em {methods.getValues().date.split('-')[1]} • Ascendente Calculado</p>
                                        </div>
                                    </div>

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
