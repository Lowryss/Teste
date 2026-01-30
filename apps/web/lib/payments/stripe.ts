import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
    if (!stripeInstance) {
        const key = process.env.STRIPE_SECRET_KEY
        if (!key) {
            throw new Error('STRIPE_SECRET_KEY is missing from environment variables')
        }
        stripeInstance = new Stripe(key)
    }
    return stripeInstance
}

// For backwards compatibility
export const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : (null as unknown as Stripe)


