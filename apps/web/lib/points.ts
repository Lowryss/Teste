import { adminDb } from '@/lib/firebase-admin'
import * as admin from 'firebase-admin'

export async function decrementUserPoints(userId: string, amount: number) {
    if (amount <= 0) return

    const userRef = adminDb.collection('users').doc(userId)

    await adminDb.runTransaction(async (transaction) => {
        const doc = await transaction.get(userRef)
        if (!doc.exists) {
            throw new Error('User does not exist!')
        }

        const currentPoints = doc.data()?.cosmicPoints || 0
        if (currentPoints < amount) {
            throw new Error('Insufficient points')
        }

        transaction.update(userRef, {
            cosmicPoints: admin.firestore.FieldValue.increment(-amount)
        })
    })
}
