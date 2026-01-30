import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        } catch (error) {
            console.error('Erro ao parsear FIREBASE_SERVICE_ACCOUNT_KEY:', error);
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
    } else {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    }
}

export const adminDb = admin.firestore();
export const db = adminDb; // Alias for backwards compatibility
export const auth = admin.auth();
