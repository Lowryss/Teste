import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export Firestore and Auth for use in other files
export const db = admin.firestore();
export const auth = admin.auth();

// Import and export functions
import { completeOnboarding } from './onboarding';
import { onUserCreated, onUserDeleted } from './auth';

// Onboarding
export { completeOnboarding };

// Auth Triggers
export { onUserCreated, onUserDeleted };

// Example HTTP Function (pode remover depois)
export const helloWorld = functions.https.onRequest((request, response) => {
    response.json({ message: 'Hello from Guia do Coração!' });
});

// TODO: Add more functions here as we build the app
// - useTool (Sprint 4)
// - stripeWebhook (Sprint 5)
// - efibankWebhook (Sprint 5)
// - getCatalog (Sprint 5)
