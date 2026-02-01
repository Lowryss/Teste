/**
 * Onboarding Cloud Functions
 * Gerencia o fluxo de onboarding e crédito de pontos iniciais
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Nota: Em produção, o pacote shared seria publicado no npm
// Por enquanto, vamos definir os types inline
interface UserProfile {
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    ageRange: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
    relationshipStatus: 'single' | 'relationship' | 'married' | 'divorced' | 'widowed';
    goal: 'self-knowledge' | 'love' | 'career' | 'health' | 'spirituality';
    context?: string;
    readingPreferences: ('direct' | 'detailed' | 'poetic' | 'practical')[];
}

const INITIAL_COSMIC_POINTS = 10;

const db = admin.firestore();

/**
 * Complete Onboarding
 * Salva perfil do usuário e credita pontos iniciais
 */
export const completeOnboarding = functions.https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Usuário não autenticado'
        );
    }

    const userId = context.auth.uid;
    const profile: UserProfile = data.profile;

    // Validar dados do perfil
    if (!profile || !profile.gender || !profile.ageRange || !profile.relationshipStatus || !profile.goal) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Dados do perfil incompletos'
        );
    }

    // Validar preferências de leitura
    if (!profile.readingPreferences || profile.readingPreferences.length === 0) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Selecione pelo menos uma preferência de leitura'
        );
    }

    // Validar contexto (se fornecido)
    if (profile.context && profile.context.length > 500) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Contexto muito longo (máximo 500 caracteres)'
        );
    }

    try {
        const userRef = db.collection('users').doc(userId);

        // Executar em transação para garantir atomicidade
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);

            if (!userDoc.exists) {
                throw new functions.https.HttpsError(
                    'not-found',
                    'Usuário não encontrado'
                );
            }

            const userData = userDoc.data()!;

            // Verificar se já completou onboarding
            if (userData.onboardingCompleted) {
                throw new functions.https.HttpsError(
                    'already-exists',
                    'Onboarding já foi completado'
                );
            }

            // Verificar se já recebeu pontos iniciais
            if (userData.initialPointsGranted) {
                throw new functions.https.HttpsError(
                    'already-exists',
                    'Pontos iniciais já foram creditados'
                );
            }

            const now = admin.firestore.Timestamp.now();

            // Atualizar usuário
            transaction.update(userRef, {
                profile,
                profileVersion: 1,
                profileCompletedAt: now,
                onboardingCompleted: true,
                cosmicPoints: admin.firestore.FieldValue.increment(INITIAL_COSMIC_POINTS),
                totalPointsEarned: admin.firestore.FieldValue.increment(INITIAL_COSMIC_POINTS),
                initialPointsGranted: true,
                updatedAt: now,
            });

            // Criar transaction de boas-vindas
            const transactionRef = db.collection('users').doc(userId).collection('transactions').doc();
            transaction.set(transactionRef, {
                type: 'initial_grant',
                amount: INITIAL_COSMIC_POINTS,
                description: 'Boas-vindas ao Guia do Coração! 🌟',
                createdAt: now,
            });
        });

        return {
            success: true,
            pointsGranted: INITIAL_COSMIC_POINTS,
            message: `Parabéns! Você recebeu ${INITIAL_COSMIC_POINTS} Pontos Cósmicos! ✨`,
        };
    } catch (error: any) {
        console.error('Error completing onboarding:', error);

        // Re-throw HttpsErrors
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        throw new functions.https.HttpsError(
            'internal',
            'Erro ao completar onboarding. Tente novamente.'
        );
    }
});
