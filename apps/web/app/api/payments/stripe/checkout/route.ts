import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payments/stripe'
import { PACKAGES } from '@/lib/shared/packages'

export async function POST(req: NextRequest) {
    try {
        // Check if stripe is properly initialized
        if (!stripe) {
            console.error('Stripe is not initialized. Check STRIPE_SECRET_KEY in env')
            return NextResponse.json({ error: 'Pagamento não configurado' }, { status: 500 })
        }

        const { userId, packageId } = await req.json()

        const pkg = PACKAGES[packageId as keyof typeof PACKAGES]
        if (!pkg) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
        }

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: pkg.name,
                            description: pkg.description,
                            metadata: {
                                points: pkg.points.toString()
                            }
                        },
                        unit_amount: pkg.price
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId,
                packageId,
                points: pkg.points.toString()
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&points=${pkg.points}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop?payment=cancelled`
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Checkout error:', error)
        console.error('Error message:', error.message)
        console.error('Error type:', error.type)
        console.error('Error code:', error.code)
        return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 })
    }
}
