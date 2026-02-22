'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import { Calendar, Heart, Sparkles } from 'lucide-react'
import {
    AetherisLayout,
    AetherisIntro,
    AetherisShuffleAnimation,
    AetherisResult,
    AetherisCardSelection,
    AETHERIS_THEMES,
} from '@/components/aetheris'

const theme = AETHERIS_THEMES.semanal
const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

type Step = 'intro' | 'selection' | 'reading' | 'result'

export default function TarotSemanalPage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const router = useRouter()
    const [step, setStep] = useState<Step>('intro')
    const [selectedCards, setSelectedCards] = useState<number[]>([])
    const [readingResult, setReadingResult] = useState<{ content: string, cards: string[] } | null>(null)

    const handleStart = () => {
        if (!user?.cosmicPoints || user.cosmicPoints < 50) {
            addToast({ type: 'error', title: 'Energia Insuficiente', message: 'Você precisa de 50 pontos para esta leitura.' })
            return
        }
        setStep('selection')
    }

    const handleCardSelect = async (index: number) => {
        if (selectedCards.includes(index)) return

        const newSelection = [...selectedCards, index]
        setSelectedCards(newSelection)

        if (newSelection.length === 7) {
            setTimeout(async () => {
                setStep('reading')

                try {
                    const token = await user?.getIdToken()
                    const res = await fetch('/api/readings/tarot-semanal', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    const data = await res.json()

                    if (res.ok) {
                        setReadingResult({ content: data.content, cards: data.cards })
                        setTimeout(() => setStep('result'), 2000)
                    } else {
                        throw new Error(data.error)
                    }
                } catch (error) {
                    console.error(error)
                    addToast({ type: 'error', title: 'Erro na leitura', message: 'As estrelas estão nubladas. Tente novamente.' })
                    setStep('intro')
                }
            }, 500)
        }
    }

    const featureCards = [
        { icon: <Calendar className="w-5 h-5" />, title: 'Planejamento', description: 'Energia dia a dia (Seg a Dom).' },
        { icon: <Heart className="w-5 h-5" />, title: 'Direcionamento', description: 'Foco nas oportunidades da semana.' },
        { icon: <Sparkles className="w-5 h-5" />, title: 'Clareza', description: 'Conselho para sua melhor semana.' },
    ]

    return (
        <AetherisLayout theme={theme}>
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <AetherisIntro
                        key="intro"
                        theme={theme}
                        onStart={handleStart}
                        description="Uma jornada profunda pelos próximos 7 dias. Descubra as energias de cada dia da sua semana com a sabedoria dos arcanos."
                        buttonLabel={'Iniciar\nLeitura'}
                        featureCards={featureCards}
                    />
                )}

                {step === 'selection' && (
                    <AetherisCardSelection
                        key="selection"
                        theme={theme}
                        totalCards={7}
                        requiredCount={7}
                        selectedIndices={selectedCards}
                        labels={DAYS}
                        onSelect={handleCardSelect}
                    />
                )}

                {step === 'reading' && (
                    <AetherisShuffleAnimation
                        key="reading"
                        theme={theme}
                        statusText="Interpretando sua semana..."
                    />
                )}

                {step === 'result' && readingResult && (
                    <AetherisResult
                        key="result"
                        theme={theme}
                        cards={readingResult.cards.map((card, i) => ({
                            name: card,
                            position: DAYS[i]?.substring(0, 3),
                        }))}
                        content={readingResult.content}
                        contentFormat="html"
                        onReset={() => router.push('/history')}
                        resetLabel="Salvar no Diário"
                    />
                )}
            </AnimatePresence>
        </AetherisLayout>
    )
}
