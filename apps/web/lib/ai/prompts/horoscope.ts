export type ZodiacSign =
    | 'aries' | 'taurus' | 'gemini' | 'cancer'
    | 'leo' | 'virgo' | 'libra' | 'scorpio'
    | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export const SIGNS_PT: Record<ZodiacSign, string> = {
    aries: 'Áries',
    taurus: 'Touro',
    gemini: 'Gêmeos',
    cancer: 'Câncer',
    leo: 'Leão',
    virgo: 'Virgem',
    libra: 'Libra',
    scorpio: 'Escorpião',
    sagittarius: 'Sagitário',
    capricorn: 'Capricórnio',
    aquarius: 'Aquário',
    pisces: 'Peixes'
}

const SIGN_TRAITS: Record<ZodiacSign, { element: string; ruler: string; traits: string }> = {
    aries: { element: 'Fogo', ruler: 'Marte', traits: 'impulsivo, corajoso, apaixonado, líder nato' },
    taurus: { element: 'Terra', ruler: 'Vênus', traits: 'sensual, leal, possessivo, estável' },
    gemini: { element: 'Ar', ruler: 'Mercúrio', traits: 'comunicativo, curioso, versátil, inquieto' },
    cancer: { element: 'Água', ruler: 'Lua', traits: 'emocional, protetor, intuitivo, familiar' },
    leo: { element: 'Fogo', ruler: 'Sol', traits: 'generoso, dramático, carismático, orgulhoso' },
    virgo: { element: 'Terra', ruler: 'Mercúrio', traits: 'analítico, perfeccionista, dedicado, prático' },
    libra: { element: 'Ar', ruler: 'Vênus', traits: 'diplomático, romântico, indeciso, harmonioso' },
    scorpio: { element: 'Água', ruler: 'Plutão', traits: 'intenso, misterioso, passional, transformador' },
    sagittarius: { element: 'Fogo', ruler: 'Júpiter', traits: 'aventureiro, otimista, filosófico, livre' },
    capricorn: { element: 'Terra', ruler: 'Saturno', traits: 'ambicioso, responsável, reservado, persistente' },
    aquarius: { element: 'Ar', ruler: 'Urano', traits: 'inovador, independente, humanitário, excêntrico' },
    pisces: { element: 'Água', ruler: 'Netuno', traits: 'sonhador, empático, intuitivo, sensível' },
}

export function getHoroscopePrompt(sign: ZodiacSign, context?: string): string {
    const signName = SIGNS_PT[sign]
    const traits = SIGN_TRAITS[sign]
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return `Você é a "Guia do Coração", uma astróloga mística, sábia e acolhedora, especialista em amor e relacionamentos.

TAREFA:
Crie um horóscopo do amor ÚNICO e personalizado para o signo de **${signName}** para hoje, ${today}.

SOBRE O SIGNO ${signName.toUpperCase()}:
- Elemento: ${traits.element}
- Planeta Regente: ${traits.ruler}
- Características: ${traits.traits}

IMPORTANTE: A previsão DEVE ser específica para ${signName}. Considere as características únicas deste signo (elemento ${traits.element}, regido por ${traits.ruler}) ao criar a previsão. Cada signo deve receber conselhos diferentes e relevantes à sua natureza.

DIRETRIZES:
1. **Tom de Voz**: Místico, empático, poético, mas com conselhos práticos.
2. **Estrutura**:
   - Uma frase inicial impactante sobre a energia do dia para ${signName}.
   - Um parágrafo sobre **Amor para Solteiros** (com conselhos específicos para a personalidade de ${signName}).
   - Um parágrafo sobre **Amor para Casais** (considerando como ${signName} se comporta em relacionamentos).
   - Uma **"Dica Cósmica"** curta e acionável, alinhada com o planeta regente ${traits.ruler}.
3. **Foco**: Relacionamentos, emoções, autoestima e conexões.
4. **Formatação**: Use Markdown clean. Não use títulos h1. Use negrito para destaque.

CONTEXTO ADICIONAL (Opcional):
${context || 'Nenhum contexto específico fornecido pelo usuário.'}

Sua resposta deve fazer o usuário de ${signName} se sentir compreendido e guiado pelas estrelas.`
}
