import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { auth } from '@/lib/firebase-admin'
import { headers } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { decrementUserPoints } from '@/lib/points'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

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

        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY missing')
            }

            const prompt = `Você é um tarólogo místico experiente. Faça uma previsão semanal detalhada baseada nas cartas sorteadas para cada dia.

Cartas: ${cardsWithDays.join(', ')}.

Estrutura obrigatória:
- Visão Geral da Semana (1 parágrafo curto)
- Previsão dia a dia (Segunda a Domingo). Para cada dia, escreva 2 frases explicando a influência da carta.
- Conselho Final (1 frase impactante)

Tom de voz: Místico, inspirador, acolhedor e direto.
Use formatação HTML simples (p, strong, ul, li) para estruturar a resposta. Não use markdown, use HTML tags diretamente (ex: <strong>Segunda:</strong> ...).`

            const result = await model.generateContent(prompt)
            const response = await result.response
            readingContent = response.text()

        } catch (aiError) {
            console.error('AI Generation Error:', aiError)
            // Fallback melhorado com mensagens aleatórias para não ficar duplicado
            const fallbackMessages = [
                "Energia de renovação e crescimento.",
                "Momento de olhar para dentro e refletir.",
                "Cuidado com ilusões, busque a verdade.",
                "Ação e movimento trarão resultados.",
                "Equilíbrio é a chave para hoje.",
                "Conexão espiritual fortalecida.",
                "Dia propício para novos começos."
            ]

            readingContent = WEEKLY_CARDS.map((card, i) => {
                const randomMsg = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
                return `<p><strong>${days[i]} (${card}):</strong> ${randomMsg}</p>`
            }).join('')
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
