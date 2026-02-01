"use strict";
/**
 * Auth Triggers
 * Triggers de autenticação do Firebase
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
exports.onUserDeleted = exports.onUserCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * On User Created
 * Cria documento do usuário no Firestore quando um novo usuário se registra
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
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
    }
    catch (error) {
        console.error('Error creating user document:', error);
        // Não lançar erro para não bloquear o registro
    }
});
/**
 * On User Deleted
 * Limpa dados do usuário quando a conta é deletada
 */
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
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
    }
    catch (error) {
        console.error('Error deleting user data:', error);
    }
});
//# sourceMappingURL=auth.js.map