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

        // 2. Points Check (15 pts cost)
        const COST = 15
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        const userData = userDoc.data()

        if (!userData || (userData.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Pontos insuficientes. Tarot do Amor custa 15 pontos.' }, { status: 403 })
        }

        // 3. Draw 3 Cards (Random Major Arcana)
        const deck = [...cardsData.tarot_major]
        const drawnCards = []
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * deck.length)
            drawnCards.push(deck[randomIndex])
            deck.splice(randomIndex, 1)
        }

        const positions = ['Você', 'A Pessoa/Interesse', 'Futuro da Relação']

        // 4. Generate AI Interpretation
        let readingContent = ''
        const cardsContext = drawnCards.map((c, i) => `${positions[i]}: ${c.name} (${c.keywords.join(', ')})`).join('\n')

        if (process.env.OPENAI_API_KEY) {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um especialista em relacionamentos e tarot. Interprete este jogo de 3 cartas (Amor).
                        Contexto das cartas:\n${cardsContext}
                        
                        Estrutura:
                        1. Análise de cada posição (curta).
                        2. Síntese do relacionamento.
                        3. Conselho final.
                        
                        Tom: Empático, romântico, mas realista.
                        Formatação: HTML (h3, p, strong, ul).`
                    }
                ]
            })
            readingContent = completion.choices[0].message.content || 'Erro na leitura.'
        } else {
            readingContent = `<h3>Leitura do Amor</h3><ul>${drawnCards.map((c, i) => `<li><strong>${positions[i]}:</strong> ${c.name}</li>`).join('')}</ul><p>Interpretação simulada: As energias indicam um momento de reflexão.</p>`
        }

        // 5. Save Reading
        const readingRef = await adminDb.collection('users').doc(userId).collection('readings').add({
            type: 'tarot-love',
            title: 'Tarot do Amor (3 Cartas)',
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
            positions: positions,
            content: readingContent,
            remainingPoints: (userData.cosmicPoints || 0) - COST
        })

    } catch (error) {
        console.error('Love Tarot Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
