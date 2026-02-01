"use strict";
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
exports.helloWorld = exports.onUserDeleted = exports.onUserCreated = exports.completeOnboarding = exports.auth = exports.db = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
// Export Firestore and Auth for use in other files
exports.db = admin.firestore();
exports.auth = admin.auth();
// Import and export functions
const onboarding_1 = require("./onboarding");
Object.defineProperty(exports, "completeOnboarding", { enumerable: true, get: function () { return onboarding_1.completeOnboarding; } });
const auth_1 = require("./auth");
Object.defineProperty(exports, "onUserCreated", { enumerable: true, get: function () { return auth_1.onUserCreated; } });
Object.defineProperty(exports, "onUserDeleted", { enumerable: true, get: function () { return auth_1.onUserDeleted; } });
// Example HTTP Function (pode remover depois)
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.json({ message: 'Hello from Guia do Coração!' });
});
// TODO: Add more functions here as we build the app
// - useTool (Sprint 4)
// - stripeWebhook (Sprint 5)
// - efibankWebhook (Sprint 5)
// - getCatalog (Sprint 5)
//# sourceMappingURL=index.js.map