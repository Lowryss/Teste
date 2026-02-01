"use strict";
/**
 * Onboarding Cloud Functions
 * Gerencia o fluxo de onboarding e crédito de pontos iniciais
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOnboarding = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const INITIAL_COSMIC_POINTS = 10;
const db = admin.firestore();
/**
 * Complete Onboarding
 * Salva perfil do usuário e credita pontos iniciais
 */
exports.completeOnboarding = functions.https.onCall(async (data, context) => {
    // Verificar autenticação
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
    }
    const userId = context.auth.uid;
    const profile = data.profile;
    // Validar dados do perfil
    if (!profile || !profile.gender || !profile.ageRange || !profile.relationshipStatus || !profile.goal) {
        throw new functions.https.HttpsError('invalid-argument', 'Dados do perfil incompletos');
    }
    // Validar preferências de leitura
    if (!profile.readingPreferences || profile.readingPreferences.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Selecione pelo menos uma preferência de leitura');
    }
    // Validar contexto (se fornecido)
    if (profile.context && profile.context.length > 500) {
        throw new functions.https.HttpsError('invalid-argument', 'Contexto muito longo (máximo 500 caracteres)');
    }
    try {
        const userRef = db.collection('users').doc(userId);
        // Executar em transação para garantir atomicidade
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Usuário não encontrado');
            }
            const userData = userDoc.data();
            // Verificar se já completou onboarding
            if (userData.onboardingCompleted) {
                throw new functions.https.HttpsError('already-exists', 'Onboarding já foi completado');
            }
            // Verificar se já recebeu pontos iniciais
            if (userData.initialPointsGranted) {
                throw new functions.https.HttpsError('already-exists', 'Pontos iniciais já foram creditados');
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
    }
    catch (error) {
        console.error('Error completing onboarding:', error);
        // Re-throw HttpsErrors
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Erro ao completar onboarding. Tente novamente.');
    }
});
//# sourceMappingURL=onboarding.js.map