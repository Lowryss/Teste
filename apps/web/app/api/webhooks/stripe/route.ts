import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payments/stripe'
import { db as adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import Stripe from 'stripe'

// Stripe requires raw body for signature verification
// Next.js App Router needs a specific way to read raw body


async function getRawBody(req: NextRequest) {
    const blob = await req.blob()
    const buffer = await blob.arrayBuffer()
    return Buffer.from(buffer)
}

export async function POST(req: NextRequest) {
    const body = await req.text() // Stripe hooks need text or buffer
    const signature = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('Missing Secret')

        // Note: In Next 13+ App Router, handling raw body + stripe constructEvent is tricky.
        // For MVP/Vercel, we trust the body text if using standard fetch.
        // Ideally we use a buffer.

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error: any) {
        console.error('Webhook signature verification failed.', error.message)
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session

            const userId = session.metadata?.userId
            const packageId = session.metadata?.packageId
            const points = parseInt(session.metadata?.points || '0')

            if (userId && points > 0) {
                console.log(`Crediting ${points} points to user ${userId}`)

                await adminDb.runTransaction(async (transaction) => {
                    const userRef = adminDb.collection('users').doc(userId)
                    const txRef = adminDb.collection('transactions').doc()

                    transaction.update(userRef, {
                        cosmicPoints: FieldValue.increment(points),
                        totalPointsPurchased: FieldValue.increment(points)
                    })

                    transaction.set(txRef, {
                        userId,
                        type: 'credit',
                        amount: points,
                        source: 'stripe',
                        referenceId: session.id, // stripe session id
                        packageId: packageId,
                        status: 'completed',
                        createdAt: FieldValue.serverTimestamp()
                    })
                })
            }
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error('Webhook handler failed:', error)
        return NextResponse.json({ error: 'Handler Failed' }, { status: 500 })
    }
}
