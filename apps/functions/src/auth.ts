/**
 * Auth Triggers
 * Triggers de autenticação do Firebase
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * On User Created
 * Cria documento do usuário no Firestore quando um novo usuário se registra
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
    const userId = user.uid;
    const email = user.email || '';
    const displayName = user.displayName || null;
    const photoURL = user.photoURL || null;

    try {
        const now = admin.firestore.Timestamp.now();

        // Criar documento do usuário
        await db.collection('users').doc(userId).set({
            uid: userId,
            email,
            displayName,
            photoURL,

            // Pontos e monetização
            cosmicPoints: 0,
            totalPointsEarned: 0,
            totalPointsSpent: 0,
            initialPointsGranted: false,

            // Onboarding
            onboardingCompleted: false,
            profileVersion: 0,

            // Subscription
            subscription: {
                plan: null,
                status: null,
                gateway: null,
            },

            // Timestamps
            createdAt: now,
            updatedAt: now,
        });

        console.log(`User document created for ${userId}`);
    } catch (error) {
        console.error('Error creating user document:', error);
        // Não lançar erro para não bloquear o registro
    }
});

/**
 * On User Deleted
 * Limpa dados do usuário quando a conta é deletada
 */
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
    const userId = user.uid;

    try {
        // Deletar documento do usuário
        await db.collection('users').doc(userId).delete();

        // Deletar subcollections (transactions, toolUsages, etc.)
        // Nota: Em produção, usar uma função de limpeza batch
        const batch = db.batch();

        const transactionsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('transactions')
            .get();

        transactionsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        console.log(`User data deleted for ${userId}`);
    } catch (error) {
        console.error('Error deleting user data:', error);
    }
});
