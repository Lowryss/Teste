import { NextResponse } from 'next/server'
import { adminDb, auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import OpenAI from 'openai'
import cardsData from '@/lib/data/cards-database.json'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
})

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const authHeader = (await headers()).get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // 2. Check Time Limit (One reading per day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const readingsRef = adminDb.collection('users').doc(userId).collection('readings')
        const snapshot = await readingsRef
            .where('type', '==', 'tarot-daily')
            .where('createdAt', '>=', today)
            .get()

        if (!snapshot.empty) {
            return NextResponse.json({ error: 'Você já tirou sua carta do dia hoje.' }, { status: 429 })
        }

        // 3. Draw Card (Random Major Arcana)
        const randomIndex = Math.floor(Math.random() * cardsData.tarot_major.length)
        const card = cardsData.tarot_major[randomIndex]

        // 4. Generate AI Interpretation
        let readingContent = ''

        if (process.env.OPENAI_API_KEY) {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um guia espiritual calmo e sábio. Explique a carta de tarot "${card.name}" como conselho diário.
                        Foco: Energia do dia, conselho prático.
                        Tamanho: Curto (máx 3 parágrafos).
                        Tom: Positivo e construtivo.
                        Palavras-chave: ${card.keywords.join(', ')}.`
                    }
                ]
            })
            readingContent = completion.choices[0].message.content || 'Erro na leitura do oráculo.'
        } else {
            readingContent = `<p>A carta <strong>${card.name}</strong> traz hoje a energia de ${card.keywords.join(', ')}. Use isso para guiar suas decisões.</p>`
        }

        // 5. Save Reading
        await readingsRef.add({
            type: 'tarot-daily',
            title: 'Carta do Dia',
            cards: [card.name],
            content: readingContent,
            createdAt: new Date(),
            pointsUsed: 0
        })

        return NextResponse.json({
            success: true,
            card: card,
            content: readingContent
        })

    } catch (error) {
        console.error('Daily Tarot Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
