import { NextResponse } from 'next/server'
import { adminDb, auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import OpenAI from 'openai'
import cardsData from '@/lib/data/cards-database.json'
import { decrementUserPoints } from '@/lib/points'

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

        // 2. Points Check (7 pts cost)
        const COST = 7
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        const userData = userDoc.data()

        if (!userData || (userData.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Pontos insuficientes. Baralho Cigano custa 7 pontos.' }, { status: 403 })
        }

        // 3. Draw 5 Cards (Random Lenormand)
        const deck = [...cardsData.lenormand]
        const drawnCards = []
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * deck.length)
            drawnCards.push(deck[randomIndex])
            deck.splice(randomIndex, 1)
        }

        // 4. Generate AI Interpretation
        let readingContent = ''
        const cardsNames = drawnCards.map(c => c.name).join(', ')

        if (process.env.OPENAI_API_KEY) {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `Você é uma cartomante cigana tradicional (Gitana). Interprete este jogo de 5 cartas Lenormand.
                        Cartas: ${cardsNames}.
                        Estrutura: Visão Geral (Sintética) + Conselho Prático.
                        Estilo: Direto, assertivo, popular.
                        Formatação: HTML básico (p, strong).`
                    }
                ]
            })
            readingContent = completion.choices[0].message.content || 'Erro na leitura.'
        } else {
            readingContent = `<p>As cartas revelam: <strong>${cardsNames}</strong>. Momento de atenção aos detalhes e intuição.</p>`
        }

        // 5. Save Reading
        const readingsRef = adminDb.collection('users').doc(userId).collection('readings')
        const readingRef = await readingsRef.add({
            type: 'baralho-cigano',
            title: 'Leitura Cigana (5 Cartas)',
            cards: drawnCards.map(c => c.name),
            content: readingContent,
            createdAt: new Date(),
            pointsUsed: COST
        })

        // 6. Deduct Points
        await decrementUserPoints(userId, COST)

        return NextResponse.json({
            success: true,
            cards: drawnCards,
            content: readingContent,
            remainingPoints: (userData.cosmicPoints || 0) - COST
        })

    } catch (error) {
        console.error('Cigano Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
