import { NextRequest, NextResponse } from 'next/server'
import { db as adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// Use a secret header key for admin security (or implement real admin auth role later)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('x-admin-key')
        if (authHeader !== ADMIN_API_KEY && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { userId, amount, reason } = await req.json()

        if (!userId || !amount) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Transação
        await adminDb.runTransaction(async (transaction) => {
            const userRef = adminDb.collection('users').doc(userId)
            const userDoc = await transaction.get(userRef)

            if (!userDoc.exists) throw new Error('User not found')

            // Credit Points (Refund)
            transaction.update(userRef, {
                cosmicPoints: FieldValue.increment(amount),
            })

            // Log Refund
            const transactionRef = adminDb.collection('transactions').doc()
            transaction.set(transactionRef, {
                userId,
                type: 'credit',
                amount,
                source: 'refund',
                reason: reason || 'Admin Refund',
                status: 'completed',
                createdAt: FieldValue.serverTimestamp()
            })
        })

        return NextResponse.json({ success: true, message: `Refunded ${amount} to ${userId}` })
    } catch (error: any) {
        console.error('Refund error:', error)
        return NextResponse.json({ error: error.message || 'Refund failed' }, { status: 500 })
    }
}
