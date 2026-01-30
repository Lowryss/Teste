'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Gift, Sparkles, Flame, Star, X } from 'lucide-react'

interface DailyBonusProps {
    onClose?: () => void
}

export function DailyBonusButton() {
    const { user } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [canClaim, setCanClaim] = useState(false)

    useEffect(() => {
        if (!user) return

        // Check if user can claim bonus today
        const today = new Date().toISOString().split('T')[0]
        const lastClaim = (user as any).lastDailyBonusDate
        setCanClaim(lastClaim !== today)
    }, [user])

    if (!canClaim) return null

    return (
        <>
            <Button
                onClick={() => setShowModal(true)}
                className="relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white animate-pulse"
                size="sm"
            >
                <Gift className="w-4 h-4 mr-2" />
                Bônus Diário
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </Button>

            <AnimatePresence>
                {showModal && <DailyBonusModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </>
    )
}

export function DailyBonusModal({ onClose }: DailyBonusProps) {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [claiming, setClaiming] = useState(false)
    const [claimed, setClaimed] = useState(false)
    const [result, setResult] = useState<{
        pointsAwarded: number
        currentStreak: number
        message: string
    } | null>(null)

    const currentStreak = (user as any)?.dailyStreak || 0

    const handleClaim = async () => {
        if (!user || claiming) return
        setClaiming(true)

        try {
            const res = await fetch('/api/daily-bonus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error)
            }

            setResult(data)
            setClaimed(true)
            addToast({
                type: 'success',
                title: `+${data.pointsAwarded} Pontos Cósmicos!`,
                message: data.message
            })

        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: error.message || 'Não foi possível resgatar o bônus'
            })
        } finally {
            setClaiming(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-midnight-900 via-midnight-950 to-purple-950 border border-amber-500/30 p-8 max-w-md w-full relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {!claimed ? (
                    <>
                        {/* Header */}
                        <div className="text-center relative z-10 mb-8">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block mb-4"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
                                    <Gift className="w-10 h-10 text-white" />
                                </div>
                            </motion.div>
                            <h2 className="text-2xl font-display text-white mb-2">
                                Bônus Diário
                            </h2>
                            <p className="text-amber-200/60 text-sm">
                                Volte todos os dias para ganhar mais pontos!
                            </p>
                        </div>

                        {/* Streak Display */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Flame className="w-5 h-5 text-orange-400" />
                                <span className="text-sm text-orange-300">
                                    Sequência: {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
                                </span>
                            </div>

                            {/* Streak indicators */}
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                    <div
                                        key={day}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${day <= currentStreak
                                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                                : day === currentStreak + 1
                                                    ? 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-400 animate-pulse'
                                                    : 'bg-white/5 text-white/30'
                                            }`}
                                    >
                                        {day <= currentStreak ? (
                                            <Star className="w-4 h-4" />
                                        ) : (
                                            day
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-white/40 mt-3">
                                7 dias = máximo de bônus diário
                            </p>
                        </div>

                        {/* Reward Preview */}
                        <div className="bg-black/20 border border-white/10 p-4 rounded-lg mb-6 text-center">
                            <div className="text-xs text-amber-200/50 uppercase tracking-wider mb-1">
                                Você receberá
                            </div>
                            <div className="text-3xl font-display text-amber-400 flex items-center justify-center gap-2">
                                <Sparkles className="w-6 h-6" />
                                {2 + Math.min(currentStreak, 6)} Pontos
                            </div>
                            {currentStreak > 0 && (
                                <div className="text-xs text-amber-200/40 mt-1">
                                    (2 base + {Math.min(currentStreak, 6)} bônus de sequência)
                                </div>
                            )}
                        </div>

                        {/* Claim Button */}
                        <Button
                            onClick={handleClaim}
                            disabled={claiming}
                            className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-lg font-semibold shadow-lg shadow-amber-500/30"
                        >
                            {claiming ? (
                                <span className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                    Resgatando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Gift className="w-5 h-5" />
                                    Resgatar Bônus
                                </span>
                            )}
                        </Button>
                    </>
                ) : (
                    /* Success State */
                    <div className="text-center relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                            className="mb-6"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-display text-white mb-2"
                        >
                            +{result?.pointsAwarded} Pontos!
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-emerald-200/80 mb-6"
                        >
                            {result?.message}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center justify-center gap-2 text-amber-400 mb-8"
                        >
                            <Flame className="w-5 h-5" />
                            <span>Sequência: {result?.currentStreak} dias</span>
                        </motion.div>

                        <Button
                            onClick={onClose}
                            className="w-full bg-white/10 hover:bg-white/20 text-white"
                        >
                            Continuar
                        </Button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}
