/**
 * User Profile Interface
 * Dados coletados para personalização da IA
 */
export interface UserProfile {
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    ageRange: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
    relationshipStatus: 'single' | 'relationship' | 'married' | 'divorced' | 'widowed';
    goal: 'self-knowledge' | 'love' | 'career' | 'health' | 'spirituality';
    context?: string; // Texto livre sobre momento atual
    readingPreferences: ('direct' | 'detailed' | 'poetic' | 'practical')[];
}

/**
 * Onboarding Steps
 */
export type OnboardingStep = 'welcome' | 'profile' | 'success' | 'completed';

/**
 * User Interface (simplificada para o frontend)
 */
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    cosmicPoints: number;
    onboardingCompleted: boolean;
    profile?: UserProfile;
    profileVersion?: number;
    createdAt: Date;
}
