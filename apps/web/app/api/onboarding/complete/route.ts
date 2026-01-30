import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { INITIAL_COSMIC_POINTS, PROFILE_CONTEXT_MAX_LENGTH } from '@/lib/shared/constants';

// API Route para completar onboarding
export async function POST(request: Request) {
    try {
        const { userId, profile } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        if (!profile) {
            return NextResponse.json({ error: 'Profile data is required' }, { status: 400 });
        }

        // Validação simples
        if (profile.context && profile.context.length > PROFILE_CONTEXT_MAX_LENGTH) {
            return NextResponse.json({ error: 'Context too long' }, { status: 400 });
        }

        const userRef = db.collection('users').doc(userId);

        // Executar transação de onboarding
        await db.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);

            // Se o usuário não existir no Firestore, criamos agora (Upsert)
            const userData = userDoc.exists ? userDoc.data() : {};

            if (userData?.onboardingCompleted) {
                return;
            }

            // Atualizar ou Criar perfil e pontos
            // Usamos set com merge: true para permitir criar se não existir
            t.set(userRef, {
                profile: profile,
                onboardingCompleted: true,
                // Se já tiver pontos, incrementa. Se for novo, define inicial.
                cosmicPoints: FieldValue.increment(INITIAL_COSMIC_POINTS),
                updatedAt: FieldValue.serverTimestamp(),
                createdAt: userData?.createdAt || FieldValue.serverTimestamp() // Mantém original ou define agora
            }, { merge: true });

            // Criar transação de extrato
            const transactionRef = userRef.collection('transactions').doc();
            t.set(transactionRef, {
                amount: INITIAL_COSMIC_POINTS,
                type: 'gift',
                description: 'Bônus de Boas-vindas',
                createdAt: FieldValue.serverTimestamp()
            });
        });

        return NextResponse.json({ success: true, message: 'Onboarding completed' });

    } catch (error: any) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
