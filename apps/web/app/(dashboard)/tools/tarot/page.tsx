

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

const theme = AETHERIS_THEMES.tarot

export default function TarotPage() {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [step, setStep] = useState<'question' | 'shuffling' | 'reading'>('question')
    const [question, setQuestion] = useState('')
    const [cards, setCards] = useState<string[]>([])
    const [reading, setReading] = useState<string | null>(null)

    const startReading = async () => {
        if ((user?.cosmicPoints || 0) < 5) {
            addToast({ type: 'warning', title: 'Saldo insuficiente', message: 'Necessário 5 pontos cósmicos.' })
            return
        }

        setStep('shuffling')

        try {
            const res = await fetch('/api/ai/tarot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    question
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            setTimeout(() => {
                setCards(data.cards)
                setReading(data.content)
                setStep('reading')
            }, 3000)

        } catch (error: any) {
            setStep('question')
            addToast({ type: 'error', title: 'Erro no Tarot', message: error.message })
        }
    }

    const reset = () => {
        setStep('question')
        setQuestion('')
        setCards([])
        setReading(null)
    }

    const positions = ['Passado', 'Presente', 'Futuro']

    return (
        <AetherisLayout theme={theme}>
            <AnimatePresence mode="wait">
                {step === 'question' && (
                    <AetherisIntro
                        key="question"
                        theme={theme}
                        onStart={startReading}
                        description="Mentalize sua pergunta ou peça um conselho geral. As cartas revelarão o Passado, Presente e Futuro."
                        showQuestionInput
                        question={question}
                        onQuestionChange={setQuestion}
                        buttonLabel={'Embaralhar\nas Cartas'}
                    />
                )}

                {step === 'shuffling' && (
                    <AetherisShuffleAnimation
                        key="shuffling"
                        theme={theme}
                        statusText="As energias estão se alinhando..."
                    />
                )}

                {step === 'reading' && reading && (
                    <AetherisResult
                        key="reading"
                        theme={theme}
                        cards={cards.map((card, i) => ({
                            name: card,
                            position: positions[i],
                        }))}
                        content={reading}
                        contentFormat="markdown"
                        onReset={reset}
                        resetLabel="Nova Leitura"
                    />
                )}
            </AnimatePresence>
        </AetherisLayout>
    )
}
