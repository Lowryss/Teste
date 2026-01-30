import { NextRequest, NextResponse } from 'next/server'
import { db as adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
    try {
        const { userId, amount, tool } = await req.json()

        // Validação
        if (!userId || !amount || !tool) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Transação atômica
        const result = await adminDb.runTransaction(async (transaction) => {
            const userRef = adminDb.collection('users').doc(userId)
            const userDoc = await transaction.get(userRef)

            if (!userDoc.exists) {
                throw new Error('User not found')
            }

            const userData = userDoc.data()
            const currentPoints = userData?.cosmicPoints || 0

            if (currentPoints < amount) {
                throw new Error('Insufficient points')
            }

            // Debitar pontos
            transaction.update(userRef, {
                cosmicPoints: FieldValue.increment(-amount),
                totalPointsSpent: FieldValue.increment(amount)
            })

            // Log transação
            const transactionRef = adminDb.collection('transactions').doc()
            transaction.set(transactionRef, {
                userId,
                type: 'debit',
                amount,
                tool,
                status: 'completed',
                createdAt: FieldValue.serverTimestamp()
            })

            return { success: true, newBalance: currentPoints - amount }
        })

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Debit error:', error)
        return NextResponse.json(
            { error: error.message || 'Debit failed' },
            { status: error.message === 'Insufficient points' ? 402 : 500 }
        )
    }
}
