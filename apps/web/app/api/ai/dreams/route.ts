import { NextRequest, NextResponse } from 'next/server'
import { db as adminDb } from '@/lib/firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { generateAIResponse } from '@/lib/ai/provider'
import { getDreamPrompt } from '@/lib/ai/prompts/dreams'

const COST_POINTS = 10
const TOOL_ID = 'dreams'

export async function POST(req: NextRequest) {
    try {
        const { userId, dream, context } = await req.json()

        if (!userId || !dream) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
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
        const prompt = getDreamPrompt(dream, context)
        const aiResponse = await generateAIResponse({ prompt, temperature: 0.8 }) // High temp for creative interpretation

        // 3. Transaction
        await adminDb.runTransaction(async (transaction) => {
            const readingId = adminDb.collection('readings').doc().id
            const readingRef = adminDb.collection('readings').doc(readingId)
            const txRef = adminDb.collection('transactions').doc()

            // Re-check
            const tUserDoc = await transaction.get(userRef)
            if ((tUserDoc.data()?.cosmicPoints || 0) < COST_POINTS) {
                throw new Error('Insufficient points')
            }

            // Deduct
            transaction.update(userRef, {
                cosmicPoints: FieldValue.increment(-COST_POINTS),
                totalPointsSpent: FieldValue.increment(COST_POINTS),
                lastDreamDate: Timestamp.now()
            })

            // Save
            transaction.set(readingRef, {
                userId,
                tool: TOOL_ID,
                dream,
                context,
                content: aiResponse,
                createdAt: FieldValue.serverTimestamp()
            })

            // Log
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
        console.error('Dreams API Error:', error)
        if (error.message === 'Insufficient points') {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })
        }
        return NextResponse.json({ error: 'Falha ao interpretar sonho' }, { status: 500 })
    }
}
