'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Sparkles, User, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-midnight-950 flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-magenta-200" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signIn, signInWithGoogle } = useAuth()
    const { addToast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const from = searchParams.get('from') || '/dashboard'

    const methods = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        try {
            await signIn(data.email, data.password)
            addToast({
                type: 'success',
                title: 'Alinhamento Concluído',
                message: 'Bem-vindo ao Portal Cósmico.',
            })
            router.push(from)
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Acesso Negado',
                message: error.message || 'As estrelas não reconhecem estas credenciais.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        try {
            await signInWithGoogle()
            addToast({
                type: 'success',
                title: 'Sinergia Confirmada',
                message: 'Conexão estelar estabelecida.',
            })
            router.push(from)
        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Erro de Conexão',
                message: error.message || 'Falha na comunicação intergaláctica.',
            })
        } finally {
            setIsGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-midnight-950 bg-noise relative overflow-hidden flex items-center justify-center p-4 md:p-6 text-magenta-50">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 bg-radial-gradient from-midnight-900 to-midnight-950 opacity-80" />
            <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-magenta-900/10 rounded-full blur-[80px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-900/10 rounded-full blur-[60px] mix-blend-screen" />

            {/* Stars Animation Layer */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0s' }} />
                <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-magenta-200 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-20"
            >
                <div className="bg-midnight-900/50 backdrop-blur-md border border-magenta-50/10 rounded-none shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-0 text-center relative z-20">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-midnight-800 border border-magenta-50/20 mb-6"
                        >
                            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-magenta-200" />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-display font-light mb-2 tracking-tight text-magenta-50">
                            Acessar Portal
                        </h1>
                        <p className="text-magenta-200/60 text-sm font-mono tracking-wide">
                            Continue sua jornada pelas estrelas.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-magenta-200/30 group-focus-within:text-magenta-200 transition-colors z-30">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <FormField
                                            name="email"
                                            placeholder="E-mail Cósmico"
                                            type="email"
                                            className="pl-12 bg-midnight-950/50 border-magenta-50/10 text-magenta-50 placeholder:text-magenta-200/20 focus:border-magenta-200/50 focus:ring-0 w-full rounded-none transition-all relative z-20 text-sm h-14"
                                            style={{ height: '56px' }}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-magenta-200/30 group-focus-within:text-magenta-200 transition-colors z-30">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <FormField
                                            name="password"
                                            placeholder="Sua Chave Secreta"
                                            type="password"
                                            className="pl-12 bg-midnight-950/50 border-magenta-50/10 text-magenta-50 placeholder:text-magenta-200/20 focus:border-magenta-200/50 focus:ring-0 w-full rounded-none transition-all relative z-20 text-sm h-14"
                                            style={{ height: '56px' }}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-magenta-50 hover:bg-white text-midnight-950 font-display uppercase tracking-widest text-xs rounded-none transition-all duration-500"
                                    disabled={isLoading || isGoogleLoading}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="flex items-center">Entrar <ArrowRight className="ml-2 h-4 w-4" /></span>}
                                </Button>
                            </form>
                        </FormProvider>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-magenta-50/5" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                <span className="bg-midnight-900 px-3 text-magenta-200/40">
                                    Ou acesse com
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading || isGoogleLoading}
                            className="w-full h-14 border-magenta-50/10 bg-transparent hover:bg-magenta-50/5 text-magenta-200/60 hover:text-magenta-50 rounded-none transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-sans"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <svg className="w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                            )}
                            Continuar com Google
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-midnight-950/30 border-t border-magenta-50/5 flex flex-col items-center gap-4 text-xs text-magenta-200/40 font-mono">
                        <Link href="/forgot-password" className="hover:text-magenta-200 transition-colors">
                            Esqueceu a senha?
                        </Link>
                        <span>
                            Sem conta?{' '}
                            <Link href="/register" className="text-magenta-200 hover:text-white transition-colors uppercase tracking-wider ml-2">
                                Crie agora
                            </Link>
                        </span>
                    </div>
                </div>

                {/* Copyright/Decor */}
                <div className="mt-8 text-center text-magenta-200/10 text-[10px] uppercase tracking-[0.3em] font-medium">
                    GUIA DO CORAÇÃO © 2026
                </div>
            </motion.div>
        </div>
    )
}
