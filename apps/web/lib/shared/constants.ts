export const PROFILE_OPTIONS = {
    gender: [
        { value: 'male', label: 'Masculino' },
        { value: 'female', label: 'Feminino' },
        { value: 'non-binary', label: 'Não-binário' },
        { value: 'prefer-not-to-say', label: 'Prefiro não dizer' },
    ],

    ageRange: [
        { value: '18-24', label: '18-24 anos' },
        { value: '25-34', label: '25-34 anos' },
        { value: '35-44', label: '35-44 anos' },
        { value: '45-54', label: '45-54 anos' },
        { value: '55+', label: '55+ anos' },
    ],

    relationshipStatus: [
        { value: 'single', label: 'Solteiro(a)' },
        { value: 'relationship', label: 'Em um relacionamento' },
        { value: 'married', label: 'Casado(a)' },
        { value: 'divorced', label: 'Divorciado(a)' },
        { value: 'widowed', label: 'Viúvo(a)' },
    ],

    goal: [
        { value: 'self-knowledge', label: 'Autoconhecimento', icon: '🧘' },
        { value: 'love', label: 'Amor e Relacionamentos', icon: '💕' },
        { value: 'career', label: 'Carreira e Sucesso', icon: '💼' },
        { value: 'health', label: 'Saúde e Bem-estar', icon: '🌿' },
        { value: 'spirituality', label: 'Espiritualidade', icon: '✨' },
    ],

    readingPreferences: [
        { value: 'direct', label: 'Direto ao ponto', description: 'Respostas objetivas e claras' },
        { value: 'detailed', label: 'Detalhado', description: 'Explicações completas e profundas' },
        { value: 'poetic', label: 'Poético', description: 'Linguagem metafórica e inspiradora' },
        { value: 'practical', label: 'Prático', description: 'Conselhos acionáveis e aplicáveis' },
    ],
} as const;

export const INITIAL_COSMIC_POINTS = 10;
export const PROFILE_CONTEXT_MAX_LENGTH = 500;
