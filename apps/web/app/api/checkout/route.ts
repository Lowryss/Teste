import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';

export async function POST(request: Request) {
    try {
        const { packageId, packageName, amount, points, userId } = await request.json();

        if (!userId || !amount || !points) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Criar Sessão do Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Pacote: ${packageName}`,
                            description: `${points} Pontos Cósmicos`,
                            images: ['https://placehold.co/400x400/png?text=✨'], // Placeholder
                        },
                        unit_amount: amount, // em centavos
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${appUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/shop`,
            metadata: {
                userId,
                points: points.toString(),
                packageId
            },
            client_reference_id: userId,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Erro ao criar sessão checkout:', error);
        return NextResponse.json(
            { error: 'Erro interno ao processar pagamento' },
            { status: 500 }
        );
    }
}
