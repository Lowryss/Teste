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
        const headerStore = await headers()
        const authHeader = headerStore.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split('Bearer ')[1]
        const decodedToken = await auth.verifyIdToken(token)
        const userId = decodedToken.uid

        // 2. Points Check (1 pt cost)
        const COST = 1
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        const userData = userDoc.data()

        if (!userData || (userData.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Pontos insuficientes.' }, { status: 403 })
        }

        // 3. Draw 1 Card (Major Arcana)
        const deck = [...cardsData.tarot_major]
        const randomIndex = Math.floor(Math.random() * deck.length)
        const card = deck[randomIndex]

        // 4. Generate AI Interpretation (Yes/No focus)
        let readingContent = ''
        let answer = 'Talvez'

        if (process.env.OPENAI_API_KEY) {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um oráculo objetivo. Responda SIM, NÃO ou TALVEZ com base na carta: ${card.name}.
                        Em seguida, explique brevemente (1 frase) o motivo.
                        
                        Formato JSON obrigatório:
                        {
                            "answer": "SIM" | "NÃO" | "TALVEZ",
                            "explanation": "Explicação curta."
                        }`
                    }
                ],
                response_format: { type: "json_object" }
            })
            const result = JSON.parse(completion.choices[0].message.content || '{}')
            readingContent = `<p>${result.explanation}</p>`
            answer = result.answer
        } else {
            // Mock Logic
            const yesCards = ['O Sol', 'O Mundo', 'A Estrela', 'O Mago', 'A Imperatriz', 'O Carro', 'A Força']
            const noCards = ['A Torre', 'O Diabo', 'A Morte', 'A Lua', 'O Enforcado', 'A Espada (se houver)']

            if (yesCards.includes(card.name)) answer = 'SIM'
            else if (noCards.includes(card.name)) answer = 'NÃO'
            else answer = 'TALVEZ'

            readingContent = `<p>A carta ${card.name} sugere uma energia de ${answer.toLowerCase()}.</p>`
        }

        // 5. Save Reading
        const readingRef = await adminDb.collection('users').doc(userId).collection('readings').add({
            type: 'tarot-yesno',
            title: `Tarot Sim/Não (${answer})`,
            cards: [card.name],
            content: readingContent,
            createdAt: new Date(),
            pointsUsed: COST
        })

        // 6. Deduct Points
        await decrementUserPoints(userId, COST)

        return NextResponse.json({
            success: true,
            card: card,
            answer: answer,
            content: readingContent,
            remainingPoints: (userData.cosmicPoints || 0) - COST
        })

    } catch (error) {
        console.error('YesNo Tarot Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
