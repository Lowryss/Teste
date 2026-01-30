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
        const readingId = `${userId}_${TOOL_ID}_${today}`

        // Check if reading already exists (optional optimization: check before transaction to save reads)
        // But for strict consistency we check inside, or we relay on transactions.
        // Here we'll do a simple check first to avoid point deduction if already done.
        const existingReadingRef = adminDb.collection('readings').doc(readingId)
        const existingReading = await existingReadingRef.get()

        if (existingReading.exists) {
            return NextResponse.json({
                error: 'Você já leu seu horóscopo hoje!',
                cached: existingReading.data()
            }, { status: 429 })
        }

        // 3. Atomic Transaction (Deduct Points + Create Reading)
        const result = await adminDb.runTransaction(async (transaction) => {
            // User Check
            const userRef = adminDb.collection('users').doc(userId)
            const userDoc = await transaction.get(userRef)

            if (!userDoc.exists) throw new Error('User not found')

            const userData = userDoc.data()
            if ((userData?.cosmicPoints || 0) < COST_POINTS) {
                throw new Error('Insufficient points')
            }

            // Generate AI Content (we do this BEFORE writing to DB to ensure success)
            // Note: Calling external API inside transaction is bad practice (locks DB).
            // We should generate first, then write. BUT if generation fails, we shouldn't charge.
            // So we'll do generation outside transaction? No, user might lose points if we deduct first.
            // Strategy: Check points -> Generate -> Deduct & Save.
            // Risk: Race condition on points if user spams.
            // Better Strategy: Generation is fast enough? No.
            // Chosen Strategy: Check balance (optimistic) -> Generate -> Transaction(Deduct + Save)

            return { userRef, userData }
        })

        // 4. Generate AI Response (Outside Transaction)
        const prompt = getHoroscopePrompt(sign as ZodiacSign, context)
        const aiResponse = await generateAIResponse({ prompt })

        // 5. Final Transaction (Deduct + Save)
        await adminDb.runTransaction(async (transaction) => {
            const userRef = adminDb.collection('users').doc(userId)
            const readingRef = adminDb.collection('readings').doc(readingId)
            const txRef = adminDb.collection('transactions').doc()

            // Re-check balance just in case
            const userDoc = await transaction.get(userRef)
            if (!userDoc.exists) throw new Error('User not found')
            if ((userDoc.data()?.cosmicPoints || 0) < COST_POINTS) throw new Error('Insufficient points')

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
