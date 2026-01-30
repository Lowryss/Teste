/**
 * Utilitários de Numerologia Pitagórica
 */

const LETTER_VALUES: Record<string, number> = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
};

const VOWELS = ['A', 'E', 'I', 'O', 'U', 'Y']; // Y pode ser vogal/consoante, mas na numerologia popular simplificamos como vogal para este MVP ou regra específica. Vamos tratar Y como vogal se não houver outra na sílaba? Para MVP: Y é vogal.

/**
 * Reduz um número para 1-9 ou Mestre (11, 22, 33)
 */
function reduceNumber(num: number): number {
    if (num === 11 || num === 22 || num === 33) return num;
    if (num < 10) return num;

    const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    return reduceNumber(sum);
}

function normalizeText(text: string): string {
    return text
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .toUpperCase()
        .replace(/[^A-Z]/g, ''); // Apenas letras
}

export interface NumerologyResult {
    soul: number;        // Alma (Vogais) - O que você sente/deseja
    personality: number; // Personalidade (Consoantes) - Como os outros te veem
    destiny: number;     // Destino/Expressão (Total) - Quem você é/Missão
}

export function calculateNumerology(fullName: string): NumerologyResult {
    const cleanName = normalizeText(fullName);

    let soulSum = 0;
    let personalitySum = 0;

    for (const char of cleanName) {
        const val = LETTER_VALUES[char] || 0;
        if (VOWELS.includes(char)) {
            soulSum += val;
        } else {
            personalitySum += val;
        }
    }

    const soul = reduceNumber(soulSum);
    const personality = reduceNumber(personalitySum);
    const destiny = reduceNumber(soulSum + personalitySum);

    return { soul, personality, destiny };
}
