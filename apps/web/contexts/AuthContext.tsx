'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Tipo estendido do Usuário com dados do Firestore
export interface UserProfile extends User {
    cosmicPoints?: number;
    totalPointsSpent?: number;
    totalPointsPurchased?: number;
    onboardingCompleted?: boolean;
    dailyStreak?: number;
    lastLoginDate?: string;
    profile?: {
        name: string;
        birthDate: string;
        birthTime: string;
        birthPlace: string;
        context: string;
        goal: string;
    };
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeFirestore: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Usuário logado: Sincronizar com Firestore em Tempo Real
                const userRef = doc(db, 'users', firebaseUser.uid);

                unsubscribeFirestore = onSnapshot(userRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const firestoreData = docSnapshot.data();

                        // CRITICAL FIX: 
                        // Ao usar spread operator (...firebaseUser), perdemos os métodos do protótipo (como getIdToken).
                        // A solução é criar um objeto que preserva os métodos essenciais ou copiá-los manualmente.
                        // Aqui, vamos copiar manualmente os métodos mais usados para garantir compatibilidade.

                        const mergedUser: any = {
                            ...firebaseUser,
                            ...firestoreData,
                            // Re-anexar métodos vitais do Firebase User
                            getIdToken: async (forceRefresh?: boolean) => firebaseUser.getIdToken(forceRefresh),
                            getIdTokenResult: async (forceRefresh?: boolean) => firebaseUser.getIdTokenResult(forceRefresh),
                            reload: async () => firebaseUser.reload(),
                            toJSON: () => firebaseUser.toJSON(),
                            delete: async () => firebaseUser.delete(),
                        };
                        setUser(mergedUser as UserProfile);
                    } else {
                        // Se não tem doc no Firestore ainda (recém criado), usa só o Auth
                        setUser(firebaseUser as UserProfile);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Erro ao sincronizar Firestore:", error);
                    setLoading(false);
                });

            } else {
                // Usuário deslogado
                setUser(null);
                setLoading(false);
                if (unsubscribeFirestore) {
                    unsubscribeFirestore();
                    unsubscribeFirestore = null;
                }
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeFirestore) unsubscribeFirestore();
        };
    }, []);

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            if (userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: name,
                });
                // Note: O listener do useEffect vai pegar a criação do doc se ele for criado logo em seguida
            }
        } catch (error: any) {
            console.error('Error signing up:', error);
            throw new Error(getErrorMessage(error.code));
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error('Error signing in:', error);
            throw new Error(getErrorMessage(error.code));
        }
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error('Error signing in with Google:', error);
            throw new Error(getErrorMessage(error.code));
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            console.error('Error signing out:', error);
            throw new Error('Erro ao sair. Tente novamente.');
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            console.error('Error resetting password:', error);
            throw new Error(getErrorMessage(error.code));
        }
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso. Tente fazer login.';
        case 'auth/invalid-email':
            return 'E-mail inválido.';
        case 'auth/operation-not-allowed':
            return 'Operação não permitida.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/user-disabled':
            return 'Esta conta foi desabilitada.';
        case 'auth/user-not-found':
            return 'Usuário não encontrado. Verifique o e-mail.';
        case 'auth/wrong-password':
            return 'Senha incorreta.';
        case 'auth/invalid-credential':
            return 'Credenciais inválidas. Verifique e-mail e senha.';
        case 'auth/too-many-requests':
            return 'Muitas tentativas. Tente novamente mais tarde.';
        case 'auth/network-request-failed':
            return 'Erro de conexão. Verifique sua internet.';
        case 'auth/popup-closed-by-user':
            return 'Login cancelado.';
        default:
            return 'Ocorreu um erro. Tente novamente.';
    }
}
