

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Sparkles, Check, Zap, CreditCard, QrCode, Copy, X } from 'lucide-react'
import { PACKAGES } from '@/lib/shared/packages'

const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(cents / 100)
}

type VisualConfig = {
    color: string;
    border: string;
    bg: string;
    popular?: boolean;
}

const PACKAGE_VISUALS: Record<string, VisualConfig> = {
    mini: { color: 'text-magenta-400', border: 'border-magenta-500/30', bg: 'bg-magenta-500/10' },
    basic: { color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    medium: { color: 'text-pink-300', border: 'border-pink-500/50', bg: 'bg-pink-500/20', popular: true },
    premium: { color: 'text-indigo-300', border: 'border-indigo-500/50', bg: 'bg-indigo-500/20' }
}

interface PixData {
    txid: string
    qr_code: string
    imagem_qrcode: string  // Base64 image
    valor: string
    packageName?: string
    points?: number
}

export default function ShopPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [loadingPkg, setLoadingPkg] = useState<string | null>(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
    const [pixData, setPixData] = useState<PixData | null>(null)
    const [showPixModal, setShowPixModal] = useState(false)
    const [checkingPayment, setCheckingPayment] = useState(false)

    const handleSelectPackage = (pkgId: string) => {
        if (!user) {
            addToast({ type: 'warning', title: 'Login Necessário', message: 'Faça login para comprar pontos.' })
            return
        }
        setSelectedPackage(pkgId)
        setShowPaymentModal(true)
    }

    const handleStripePayment = async () => {
        if (!user || !selectedPackage) return

        setLoadingPkg(selectedPackage)
        setShowPaymentModal(false)

        try {
            const res = await fetch('/api/payments/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    packageId: selectedPackage
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            window.location.href = data.url

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro de Pagamento', message: error.message })
            setLoadingPkg(null)
        }
    }

    const handlePixPayment = async () => {
        if (!user || !selectedPackage) return

        setLoadingPkg(selectedPackage)
        setShowPaymentModal(false)

        try {
            const pkg = PACKAGES[selectedPackage as keyof typeof PACKAGES]
            const res = await fetch('/api/checkout/pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    packageId: selectedPackage,
                    packageName: pkg.name,
                    amount: pkg.price,
                    points: pkg.points
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            // Add package info to pix data
            setPixData({
                ...data,
                packageName: pkg.name,
                points: pkg.points
            })
            setShowPixModal(true)

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro no PIX', message: error.message })
        } finally {
            setLoadingPkg(null)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        addToast({ type: 'success', title: 'Copiado!', message: 'Código PIX copiado para a área de transferência.' })
    }

    const handleCheckPixPayment = async () => {
        if (!user || !pixData?.txid) return

        setCheckingPayment(true)

        try {
            const res = await fetch('/api/pix/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    txid: pixData.txid,
                    userId: user.uid
                })
            })

            const data = await res.json()

            if (data.status === 'paid') {
                addToast({
                    type: 'success',
                    title: '🎉 Pagamento confirmado!',
                    message: `${data.points} pontos foram creditados na sua conta!`
                })
                setShowPixModal(false)
                setPixData(null)
                // Recarregar página para atualizar pontos
                window.location.reload()
            } else if (data.status === 'CONCLUIDA') {
                addToast({
                    type: 'success',
                    title: '🎉 Pagamento confirmado!',
                    message: `Pontos creditados com sucesso!`
                })
                setShowPixModal(false)
                setPixData(null)
                window.location.reload()
            } else if (data.status === 'ATIVA') {
                addToast({
                    type: 'warning',
                    title: 'Aguardando pagamento',
                    message: 'O pagamento ainda não foi detectado. Aguarde alguns segundos e tente novamente.'
                })
            } else {
                addToast({
                    type: 'info',
                    title: 'Status',
                    message: data.message || 'Verificando...'
                })
            }

        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', message: error.message })
        } finally {
            setCheckingPayment(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto pb-12 pt-6">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-display font-light text-magenta-50 tracking-tight">
                    Loja Cósmica
                </h1>
                <p className="text-lg text-magenta-200/60 max-w-2xl mx-auto font-light">
                    Energia pura para desvendar os mistérios do seu destino.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {Object.entries(PACKAGES).map(([key, pkg], index) => {
                    const visual = PACKAGE_VISUALS[key as keyof typeof PACKAGE_VISUALS]

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`relative h-full flex flex-col ${visual.border} ${visual.popular ? 'bg-midnight-900/80 shadow-2xl scale-105 z-10' : 'bg-midnight-900/40 hover:bg-midnight-900/60'} backdrop-blur-sm transition-all duration-300 rounded-none`}
                            >
                                {visual.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                        Mais Popular
                                    </div>
                                )}

                                <CardHeader className="text-center pb-2">
                                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${visual.bg} border border-white/5`}>
                                        <Sparkles className={`w-5 h-5 ${visual.color}`} />
                                    </div>
                                    <CardTitle className={`text-lg font-display tracking-wide ${visual.color}`}>{pkg.name}</CardTitle>
                                    <div className="flex items-center justify-center mt-2">
                                        <span className="text-3xl font-light text-white">{formatMoney(pkg.price)}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-6 text-center">
                                    <div className="space-y-1">
                                        <span className="block text-3xl font-bold text-white tracking-tighter">{pkg.points}</span>
                                        <span className="text-[10px] text-magenta-200/50 uppercase tracking-[0.2em]">Pontos Cósmicos</span>
                                    </div>

                                    <ul className="space-y-3 text-xs text-magenta-100/70 text-left px-2">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-green-400" /> <span className="flex-1 border-b border-dashed border-white/5 pb-1">Acesso imediato</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-3 h-3 text-green-400" /> <span className="flex-1 border-b border-dashed border-white/5 pb-1">Sem validade</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Zap className="w-3 h-3 text-yellow-400" /> <span className="flex-1 border-b border-dashed border-white/5 pb-1">Suporte prioritário</span>
                                        </li>
                                    </ul>
                                </CardContent>

                                <CardFooter className="pt-2">
                                    <Button
                                        className={`w-full h-12 font-display uppercase tracking-widest text-xs rounded-none transition-all ${visual.popular ? 'bg-magenta-600 hover:bg-magenta-500 text-white' : 'bg-white/5 hover:bg-white/10 text-magenta-100 border border-white/10'}`}
                                        variant={visual.popular ? 'default' : 'outline'}
                                        onClick={() => handleSelectPackage(key)}
                                        disabled={!!loadingPkg}
                                    >
                                        {loadingPkg === key ? (
                                            <Spinner size="sm" className="text-white" />
                                        ) : (
                                            'Adquirir'
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Payment Method Modal */}
            <AnimatePresence>
                {showPaymentModal && selectedPackage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPaymentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-midnight-900 border border-magenta-500/30 p-8 max-w-md w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-display text-magenta-50 text-center mb-2">
                                Escolha a Forma de Pagamento
                            </h2>
                            <p className="text-magenta-200/60 text-center text-sm mb-8">
                                {PACKAGES[selectedPackage as keyof typeof PACKAGES]?.name} - {formatMoney(PACKAGES[selectedPackage as keyof typeof PACKAGES]?.price || 0)}
                            </p>

                            <div className="space-y-4">
                                <Button
                                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white flex items-center justify-center gap-4 rounded-none"
                                    onClick={handleStripePayment}
                                >
                                    <CreditCard className="w-6 h-6" />
                                    <div className="text-left">
                                        <div className="font-semibold">Cartão de Crédito</div>
                                        <div className="text-xs opacity-80">Visa, Mastercard, Amex</div>
                                    </div>
                                </Button>

                                <Button
                                    className="w-full h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-4 rounded-none"
                                    onClick={handlePixPayment}
                                >
                                    <QrCode className="w-6 h-6" />
                                    <div className="text-left">
                                        <div className="font-semibold">PIX</div>
                                        <div className="text-xs opacity-80">Pagamento instantâneo</div>
                                    </div>
                                </Button>
                            </div>

                            <button
                                className="mt-6 w-full text-center text-magenta-200/50 text-sm hover:text-magenta-200"
                                onClick={() => setShowPaymentModal(false)}
                            >
                                Cancelar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PIX Modal */}
            <AnimatePresence>
                {showPixModal && pixData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-midnight-900 border border-emerald-500/30 p-8 max-w-lg w-full relative"
                        >
                            <button
                                className="absolute top-4 right-4 text-magenta-200/50 hover:text-white"
                                onClick={() => setShowPixModal(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-6">
                                {/* QR Code Image from Efí */}
                                {pixData.imagem_qrcode ? (
                                    <img
                                        src={pixData.imagem_qrcode}
                                        alt="QR Code Pix"
                                        className="w-48 h-48 mx-auto mb-4 bg-white p-2 rounded-lg"
                                    />
                                ) : (
                                    <QrCode className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                )}
                                <h2 className="text-2xl font-display text-emerald-50">
                                    Pagamento via PIX
                                </h2>
                                <p className="text-emerald-200/60 text-sm mt-2">
                                    {pixData.packageName} - R$ {pixData.valor}
                                </p>
                            </div>

                            <div className="bg-midnight-950 p-4 border border-white/10 mb-6">
                                <label className="text-[10px] uppercase tracking-widest text-magenta-200/40 block mb-2">
                                    PIX Copia e Cola
                                </label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-xs text-emerald-300 break-all bg-black/30 p-3 rounded max-h-20 overflow-y-auto">
                                        {pixData.qr_code}
                                    </code>
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-500 rounded-none"
                                        onClick={() => copyToClipboard(pixData.qr_code)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-magenta-200/70">
                                <p className="font-semibold text-magenta-100 mb-3">Instruções:</p>
                                <div className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0">1</span>
                                    <span>Abra o app do seu banco</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0">2</span>
                                    <span>Escaneie o QR Code ou use Pix Copia e Cola</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0">3</span>
                                    <span>Confirme o pagamento</span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-xs">
                                <strong>⚠️ Importante:</strong> Após pagar, clique no botão abaixo para confirmar.
                            </div>

                            <Button
                                className="w-full mt-4 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg rounded-none"
                                onClick={handleCheckPixPayment}
                                disabled={checkingPayment}
                            >
                                {checkingPayment ? (
                                    <><Spinner size="sm" className="mr-2" /> Verificando...</>
                                ) : (
                                    '✓ Já paguei - Verificar pagamento'
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

