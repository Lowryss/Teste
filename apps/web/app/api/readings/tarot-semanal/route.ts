import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import OpenAI from 'openai'
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

        // 2. Points Check (50 pts cost)
        const COST = 50
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()
        const userData = userDoc.data()

        if (!userData || (userData.cosmicPoints || 0) < COST) {
            return NextResponse.json({ error: 'Insuficient points' }, { status: 403 })
        }

        // 3. Generate Reading Logic
        // Simulate a spread of 7 Major Arcana cards (Monday to Sunday)
        const MAJOR_ARCANA = [
            'O Louco', 'O Mago', 'A Papisa', 'A Imperatriz', 'O Imperador', 'O Hierofante',
            'Os Enamorados', 'O Carro', 'A Justiça', 'O Eremita', 'A Roda da Fortuna',
            'A Força', 'O Enforcado', 'A Morte', 'A Temperança', 'O Diabo', 'A Torre',
            'A Estrela', 'A Lua', 'O Sol', 'O Julgamento', 'O Mundo'
        ]

        // Shuffle and pick 7
        const shuffled = MAJOR_ARCANA.sort(() => 0.5 - Math.random())
        const WEEKLY_CARDS = shuffled.slice(0, 7)

        const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
        const cardsWithDays = WEEKLY_CARDS.map((card, i) => `${days[i]}: ${card}`)

        let readingContent = ''

        if (process.env.OPENAI_API_KEY) {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `Você é um tarólogo místico experiente. Faça uma previsão semanal detalhada baseada nas cartas sorteadas para cada dia.
                        
                        Cartas: ${cardsWithDays.join(', ')}.
                        
                        Estrutura obrigatória:
                        - Visão Geral da Semana (1 parágrafo)
                        - Previsão dia a dia (Segunda a Domingo)
                        - Conselho Final
                        
                        Tom de voz: Místico, inspirador, acolhedor e direto.
                        Use formatação HTML simples (p, strong, ul, li) para estruturar a resposta.`
                    }
                ]
            })
            readingContent = completion.choices[0].message.content || 'Erro ao gerar leitura.'
        } else {
            readingContent = WEEKLY_CARDS.map((card, i) =>
                `<p><strong>${days[i]} (${card}):</strong> Energia do dia foca em renovação e autoconhecimento.</p>`
            ).join('')
        }

        // 4. Save to Database
        const readingRef = await adminDb.collection('users').doc(userId).collection('readings').add({
            type: 'tarot-semanal',
            title: 'Previsão Semanal',
            cards: WEEKLY_CARDS,
            content: readingContent,
            createdAt: new Date(),
            pointsUsed: COST
        })

        // 5. Deduct Points
        await decrementUserPoints(userId, COST)

        return NextResponse.json({
            success: true,
            readingId: readingRef.id,
            content: readingContent,
            cards: WEEKLY_CARDS,
            remainingPoints: (userData.cosmicPoints || 0) - COST
        })

    } catch (error) {
        console.error('Tarot Semestral Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
