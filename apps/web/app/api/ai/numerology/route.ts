import { NextRequest, NextResponse } from 'next/server'
import { db as adminDb } from '@/lib/firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { generateAIResponse } from '@/lib/ai/provider'
import { getNumerologyPrompt } from '@/lib/ai/prompts/numerology'

const COST_POINTS = 20
const TOOL_ID = 'numerology'

export async function POST(req: NextRequest) {
    try {
        const { userId, compatData, context } = await req.json()

        if (!userId || !compatData?.name1 || !compatData?.birth1) {
            return NextResponse.json({ error: 'Missing user data' }, { status: 400 })
        }

        // 1. Check Points
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if ((userDoc.data()?.cosmicPoints || 0) < COST_POINTS) {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })
        }

        // 2. Generate AI Response
        const prompt = getNumerologyPrompt(compatData, context)
        const aiResponse = await generateAIResponse({ prompt, temperature: 0.6 }) // Lower temp for precision

        // 3. Transaction
        await adminDb.runTransaction(async (transaction) => {
            const readingId = adminDb.collection('readings').doc().id
            const readingRef = adminDb.collection('readings').doc(readingId)
            const txRef = adminDb.collection('transactions').doc()

            const tUserDoc = await transaction.get(userRef)
            if ((tUserDoc.data()?.cosmicPoints || 0) < COST_POINTS) {
                throw new Error('Insufficient points')
            }

            transaction.update(userRef, {
                cosmicPoints: FieldValue.increment(-COST_POINTS),
                totalPointsSpent: FieldValue.increment(COST_POINTS),
                lastNumerologyDate: Timestamp.now()
            })

            transaction.set(readingRef, {
                userId,
                tool: TOOL_ID,
                compatData,
                content: aiResponse,
                createdAt: FieldValue.serverTimestamp()
            })

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
            content: aiResponse,
            pointsSpent: COST_POINTS
        })

    } catch (error: any) {
        console.error('Numerology API Error:', error)
        if (error.message === 'Insufficient points') {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })
        }
        return NextResponse.json({ error: 'Falha no cálculo numerológico' }, { status: 500 })
    }
}
