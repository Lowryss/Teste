'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ArrowLeft } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { FormProvider } from 'react-hook-form'

const forgotPasswordSchema = z.object({
    email: z.string().email('E-mail inválido'),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth()
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const methods = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ForgotPasswordValues) => {
        setIsLoading(true)
        try {
            await resetPassword(data.email)
            setIsSent(true)
            addToast({
                type: 'success',
                title: 'E-mail enviado',
                message: 'Verifique sua caixa de entrada para redefinir a senha.',
            })
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Erro no envio',
                message: error.message || 'Falha ao enviar e-mail de recuperação.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-midnight-950 bg-noise relative overflow-hidden flex items-center justify-center p-4 text-magenta-50">
            <div className="absolute inset-0 bg-radial-gradient from-midnight-900 to-midnight-950 opacity-80" />

            <div className="w-full max-w-md relative z-20">
                <div className="bg-midnight-900/50 backdrop-blur-md border border-magenta-50/10 rounded-none shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <Link href="/login" className="inline-flex items-center text-xs text-magenta-200/50 hover:text-magenta-50 mb-6 uppercase tracking-widest transition-colors">
                            <ArrowLeft className="mr-2 h-3 w-3" /> Voltar
                        </Link>
                        <h1 className="text-2xl font-display font-light mb-2">Recuperar Acesso</h1>
                        <p className="text-magenta-200/60 text-sm font-mono">
                            Digite seu e-mail para receber as instruções
                        </p>
                    </div>

                    {isSent ? (
                        <div className="text-center space-y-6 animate-fade-in">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-200 text-sm">
                                <p>E-mail enviado com sucesso!</p>
                            </div>
                            <p className="text-xs text-magenta-200/40">
                                Se não encontrar, verifique a caixa de spam.
                            </p>
                            <Link href="/login">
                                <Button className="w-full h-12 bg-magenta-50 hover:bg-white text-midnight-950 rounded-none uppercase tracking-widest text-xs">
                                    Voltar para Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <FormField
                                        name="email"
                                        placeholder="Seu e-mail cadastrado"
                                        type="email"
                                        className="pl-4 bg-midnight-950/50 border-magenta-50/10 text-magenta-50 placeholder:text-magenta-200/20 focus:border-magenta-200/50 focus:ring-0 w-full rounded-none h-12 text-sm"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-magenta-50 hover:bg-white text-midnight-950 font-display uppercase tracking-widest text-xs rounded-none transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar Instruções"}
                                </Button>
                            </form>
                        </FormProvider>
                    )}
                </div>
            </div>
        </div>
    )
}
