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

const theme = AETHERIS_THEMES.daily

export default function DailyTarotPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [step, setStep] = useState<'intro' | 'shuffling' | 'reading' | 'result'>('intro')
    const [cardData, setCardData] = useState<any>(null)

    const handleStart = () => {
        setStep('shuffling')
        setTimeout(() => handleDraw(), 3000)
    }

    const handleDraw = async () => {
        setStep('reading')
        try {
            const token = await user?.getIdToken()
            const res = await fetch('/api/ai/tarot-daily', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
            const data = await res.json()

            if (res.ok) {
                setCardData(data)
                setTimeout(() => setStep('result'), 2000)
            } else {
                addToast({ type: 'info', title: 'Volte Amanhã', message: data.error || 'Você já tirou sua carta hoje.' })
                setStep('intro')
            }
        } catch (error) {
            addToast({ type: 'error', title: 'Erro Cósmico', message: 'Falha ao conectar com o oráculo.' })
            setStep('intro')
        }
    }

    return (
        <AetherisLayout theme={theme}>
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <AetherisIntro
                        key="intro"
                        theme={theme}
                        onStart={handleStart}
                        description="A sabedoria do universo para o seu momento presente. Tire uma carta gratuitamente todos os dias."
                        buttonLabel={'Consultar\nOráculo'}
                    />
                )}

                {(step === 'shuffling' || step === 'reading') && (
                    <AetherisShuffleAnimation
                        key="shuffling"
                        theme={theme}
                        statusText={step === 'shuffling' ? 'Embaralhando energias...' : 'Interpretando sinais...'}
                    />
                )}

                {step === 'result' && cardData && (
                    <AetherisResult
                        key="result"
                        theme={theme}
                        cards={[{ name: cardData.card.name }]}
                        content={cardData.content}
                        contentFormat="html"
                        onReset={() => { setStep('intro'); setCardData(null) }}
                        resetLabel="Voltar ao Início"
                    />
                )}
            </AnimatePresence>
        </AetherisLayout>
    )
}
