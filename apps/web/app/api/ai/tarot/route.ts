import { NextRequest, NextResponse } from 'next/server'
import { db as adminDb } from '@/lib/firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { generateAIResponse } from '@/lib/ai/provider'
import { getTarotPrompt, MAJOR_ARCANA } from '@/lib/ai/prompts/tarot'

const COST_POINTS = 5
const TOOL_ID = 'tarot'

export async function POST(req: NextRequest) {
    try {
        const { userId, question } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }

        // 1. Check Points (Optimistic)
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if ((userDoc.data()?.cosmicPoints || 0) < COST_POINTS) {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })
        }

        // 2. Draw Cards (Random logic server-side for fairness)
        // Select 3 unique cards
        const shuffled = [...MAJOR_ARCANA].sort(() => 0.5 - Math.random())
        const drawnCards = shuffled.slice(0, 3)

        // 3. Generate AI Interpretation
        const prompt = getTarotPrompt(drawnCards, question)
        const aiResponse = await generateAIResponse({ prompt, temperature: 0.8 })

        // 4. Transaction (Deduct + Save)
        await adminDb.runTransaction(async (transaction) => {
            const readingId = adminDb.collection('readings').doc().id
            const readingRef = adminDb.collection('readings').doc(readingId)
            const txRef = adminDb.collection('transactions').doc()

            // Re-verify points
            const tUserDoc = await transaction.get(userRef)
            if ((tUserDoc.data()?.cosmicPoints || 0) < COST_POINTS) {
                throw new Error('Insufficient points')
            }

            // Deduct
            transaction.update(userRef, {
                cosmicPoints: FieldValue.increment(-COST_POINTS),
                totalPointsSpent: FieldValue.increment(COST_POINTS),
                lastTarotDate: Timestamp.now()
            })

            // Save Reading
            transaction.set(readingRef, {
                userId,
                tool: TOOL_ID,
                cards: drawnCards,
                question: question || 'Leitura Geral',
                content: aiResponse,
                createdAt: FieldValue.serverTimestamp()
            })

            // Log Transaction
            transaction.set(txRef, {
                userId,
                type: 'debit',
                amount: COST_POINTS,
                tool: TOOL_ID,
                referenceId: readingId,
                status: 'completed',
                createdAt: FieldValue.serverTimestamp()
            })
        })

        return NextResponse.json({
            success: true,
            cards: drawnCards,
            content: aiResponse,
            pointsSpent: COST_POINTS
        })

    } catch (error: any) {
        console.error('Tarot API Error:', error)
        console.error('Error Message:', error.message)
        console.error('Error Stack:', error.stack)
        if (error.message === 'Insufficient points') {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })
        }
        return NextResponse.json({ error: error.message || 'Falha na leitura das cartas' }, { status: 500 })
    }
}
