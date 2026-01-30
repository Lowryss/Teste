export interface UserProfile {
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
    ageRange: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
    relationshipStatus: 'single' | 'relationship' | 'married' | 'divorced' | 'widowed';
    goal: 'self-knowledge' | 'love' | 'career' | 'health' | 'spirituality';
    context?: string;
    readingPreferences: ('direct' | 'detailed' | 'poetic' | 'practical')[];
}

export type OnboardingStep = 'welcome' | 'profile' | 'success' | 'completed';

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
