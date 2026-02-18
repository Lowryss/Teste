import { NextRequest, NextResponse } from 'next/server'
import { db as adminDb } from '@/lib/firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { generateAIResponse } from '@/lib/ai/provider'
import { getHoroscopePrompt, ZodiacSign } from '@/lib/ai/prompts/horoscope'

const COST_POINTS = 1
const TOOL_ID = 'horoscope'

export async function POST(req: NextRequest) {
    try {
        const { userId, sign, context } = await req.json()

        // 1. Validation
        if (!userId || !sign) {
            return NextResponse.json({ error: 'Missing userId or sign' }, { status: 400 })
        }

        // 2. Check Rate Limit (1x per day per sign)
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
        const readingId = `${userId}_${TOOL_ID}_${sign}_${today}`

        const existingReadingRef = adminDb.collection('readings').doc(readingId)
        const existingReading = await existingReadingRef.get()

        if (existingReading.exists) {
            return NextResponse.json({
                error: 'Você já leu seu horóscopo hoje!',
                cached: existingReading.data()
            }, { status: 429 })
        }

        // 3. Check Points
        const userRef = adminDb.collection('users').doc(userId)
        const userDoc = await userRef.get()

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if ((userDoc.data()?.cosmicPoints || 0) < COST_POINTS) {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })
        }

        // 4. Generate AI Response
        const prompt = getHoroscopePrompt(sign as ZodiacSign, context)
        const aiResponse = await generateAIResponse({ prompt, temperature: 0.8 })

        // 5. Transaction (Deduct + Save)
        await adminDb.runTransaction(async (transaction) => {
            const readingRef = adminDb.collection('readings').doc(readingId)
            const txRef = adminDb.collection('transactions').doc()

            // Re-check balance
            const tUserDoc = await transaction.get(userRef)
            if ((tUserDoc.data()?.cosmicPoints || 0) < COST_POINTS) {
                throw new Error('Insufficient points')
            }

            // Deduct Points
            transaction.update(userRef, {
                cosmicPoints: FieldValue.increment(-COST_POINTS),
                totalPointsSpent: FieldValue.increment(COST_POINTS),
                lastHoroscopeDate: Timestamp.now()
            })

            // Save Reading
            transaction.set(readingRef, {
                userId,
                tool: TOOL_ID,
                sign,
                content: aiResponse,
                createdAt: FieldValue.serverTimestamp(),
                date: today
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
            content: aiResponse,
            pointsSpent: COST_POINTS
        })

    } catch (error: any) {
        console.error('Horoscope API Error:', error)
        if (error.message === 'Insufficient points') {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })
        }
        return NextResponse.json({ error: 'Falha ao conectar com os astros' }, { status: 500 })
    }
}
