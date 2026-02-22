'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import {
    AetherisLayout,
    AetherisIntro,
    AetherisShuffleAnimation,
    AetherisResult,
    AETHERIS_THEMES,
} from '@/components/aetheris'

type Card = { id: number, name: string, meaning: string }

const theme = AETHERIS_THEMES.cigano

export default function CiganoPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'intro' | 'shuffling' | 'reading'>('intro')
    const [result, setResult] = useState<{ cards: Card[], content: string } | null>(null)
    const [loading, setLoading] = useState(false)

    const handlePlay = async () => {
        if (!user?.cosmicPoints || user.cosmicPoints < 7) {
            addToast({ type: 'error', title: 'Saldo insuficiente', message: 'Você precisa de 7 pontos.' })
            return
        }

        setLoading(true)
        setStep('shuffling')
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/ai/cigano', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()

            if (res.ok) {
                setResult(data)
                setTimeout(() => setStep('reading'), 3000)
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', message: error.message || 'Falha na leitura.' })
            setStep('intro')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AetherisLayout theme={theme}>
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <AetherisIntro
                        key="intro"
                        theme={theme}
                        onStart={handlePlay}
                        loading={loading}
                        description="Método das 5 Cartas. Ideal para perguntas objetivas e situações do cotidiano. Respostas diretas e sem rodeios."
                        buttonLabel={'Jogar as\nCartas'}
                    />
                )}

                {step === 'shuffling' && (
                    <AetherisShuffleAnimation
                        key="shuffling"
                        theme={theme}
                        statusText="Lendo padrões cósmicos..."
                    />
                )}

                {step === 'reading' && result && (
                    <AetherisResult
                        key="result"
                        theme={theme}
                        cards={result.cards.map((card, i) => ({
                            name: card.name,
                            position: `Carta ${i + 1}`,
                        }))}
                        content={result.content}
                        contentFormat="html"
                        onReset={() => { setStep('intro'); setResult(null) }}
                        resetLabel="Nova Tiragem"
                    />
                )}
            </AnimatePresence>
        </AetherisLayout>
    )
}
