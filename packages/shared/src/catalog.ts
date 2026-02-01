/**
 * 📦 Catálogo Centralizado - Guia do Coração
 * 
 * FONTE DE VERDADE para preços, custos e configurações.
 * Backend e Frontend DEVEM usar este catálogo.
 * 
 * ⚠️ NÃO duplicar valores - sempre importar daqui!
 */

// ============================================
// ONBOARDING
// ============================================

export const ONBOARDING = {
  INITIAL_POINTS: 10,
} as const;

// ============================================
// TOOLS (Ferramentas)
// ============================================

export type ToolName =
  | 'horoscope'
  | 'advice'
  | 'tarot'
  | 'soulmate'
  | 'dreams'
  | 'birthchart'
  | 'compatibility';

export const TOOL_COSTS: Record<ToolName, number> = {
  horoscope: 1,
  advice: 3,
  tarot: 5,
  soulmate: 8,
  dreams: 10,
  birthchart: 15,
  compatibility: 20,
} as const;

export const TOOL_DAILY_LIMITS: Partial<Record<ToolName, number>> = {
  horoscope: 1, // Apenas horóscopo tem limite diário
} as const;

export const TOOL_METADATA: Record<ToolName, {
  name: string;
  description: string;
  icon: string;
}> = {
  horoscope: {
    name: 'Horóscopo do Amor',
    description: 'Previsão diária por signo',
    icon: '♈',
  },
  advice: {
    name: 'Conselhos Personalizados',
    description: 'Orientação da IA sobre sua vida amorosa',
    icon: '💭',
  },
  tarot: {
    name: 'Leitura de Tarot',
    description: '3 cartas: Passado, Presente e Futuro',
    icon: '🔮',
  },
  soulmate: {
    name: 'Calculadora de Alma Gêmea',
    description: 'Compatibilidade + poema personalizado',
    icon: '💕',
  },
  dreams: {
    name: 'Diário dos Sonhos',
    description: 'Interpretação de sonhos com foco amoroso',
    icon: '🌙',
  },
  birthchart: {
    name: 'Mapa Astral do Amor',
    description: 'Análise astrológica completa',
    icon: '⭐',
  },
  compatibility: {
    name: 'Análise de Compatibilidade',
    description: 'Relatório detalhado para casais',
    icon: '💑',
  },
} as const;

// ============================================
// PACKAGES (Pacotes de Pontos)
// ============================================

export type PackageType = 'mini' | 'basic' | 'medium' | 'premium';

export interface Package {
  id: PackageType;
  name: string;
  points: number;
  bonus: number;
  total: number;
  price: number; // Em centavos (BRL)
  popular?: boolean;
}

export const PACKAGES: Record<PackageType, Package> = {
  mini: {
    id: 'mini',
    name: 'Mini',
    points: 20,
    bonus: 0,
    total: 20,
    price: 500, // R$ 5,00
  },
  basic: {
    id: 'basic',
    name: 'Básico',
    points: 40,
    bonus: 0,
    total: 40,
    price: 990, // R$ 9,90
    popular: true,
  },
  medium: {
    id: 'medium',
    name: 'Médio',
    points: 120,
    bonus: 12, // +10%
    total: 132,
    price: 2490, // R$ 24,90
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    points: 400,
    bonus: 40, // +10%
    total: 440,
    price: 6990, // R$ 69,90
  },
} as const;

// ============================================
// SUBSCRIPTIONS (Assinaturas)
// ============================================

export type SubscriptionPlan = 'monthly' | 'annual';

export interface Subscription {
  id: SubscriptionPlan;
  name: string;
  price: number; // Em centavos (BRL)
  interval: 'month' | 'year';
  points: number; // Pontos creditados
  creditType: 'recurring' | 'upfront';
  features: string[];
}

export const SUBSCRIPTIONS: Record<Exclude<SubscriptionPlan, 'free'>, Subscription> = {
  monthly: {
    id: 'monthly',
    name: 'Mensal',
    price: 2990, // R$ 29,90/mês
    interval: 'month',
    points: 200, // Credita 200 pontos a cada invoice.paid
    creditType: 'recurring',
    features: [
      '200 pontos todo mês',
      'Pontos acumulam (não expiram)',
      'Cancele quando quiser',
      'Suporte prioritário',
    ],
  },
  annual: {
    id: 'annual',
    name: 'Anual',
    price: 11900, // R$ 119,00/ano
    interval: 'year',
    points: 2400, // Credita 2400 pontos de uma vez (200×12)
    creditType: 'upfront',
    features: [
      '2400 pontos de uma vez',
      'Pontos acumulam (não expiram)',
      'Economia de 67% vs mensal',
      'Cancele quando quiser',
      'Suporte prioritário',
    ],
  },
} as const;

// ============================================
// PAYMENT GATEWAYS
// ============================================

export type PaymentGateway = 'stripe' | 'efibank' | 'manual';

// ============================================
// TRANSACTION TYPES
// ============================================

export type TransactionType =
  | 'debit'
  | 'credit'
  | 'refund'
  | 'purchase'
  | 'subscription_charge'
  | 'onboarding_bonus';

// ============================================
// AI PROVIDERS
// ============================================

export type AIProvider = 'gemini' | 'openai';

export const AI_CONFIG = {
  DEFAULT_PROVIDER: 'gemini' as AIProvider,
  MODELS: {
    gemini: 'gemini-pro',
    openai: 'gpt-4',
  },
  MAX_TOKENS: {
    gemini: 2048,
    openai: 2048,
  },
  TEMPERATURE: 0.7,
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getToolCost(toolName: ToolName): number {
  return TOOL_COSTS[toolName];
}

export function getPackage(packageType: PackageType): Package {
  return PACKAGES[packageType];
}

export function getSubscription(plan: Exclude<SubscriptionPlan, 'free'>): Subscription {
  return SUBSCRIPTIONS[plan];
}

export function hasToolDailyLimit(toolName: ToolName): boolean {
  return toolName in TOOL_DAILY_LIMITS;
}

export function getToolDailyLimit(toolName: ToolName): number | null {
  return TOOL_DAILY_LIMITS[toolName] ?? null;
}

// ============================================
// CATALOG EXPORT (para Cloud Function)
// ============================================

export interface CatalogResponse {
  tools: typeof TOOL_METADATA;
  toolCosts: typeof TOOL_COSTS;
  packages: typeof PACKAGES;
  subscriptions: typeof SUBSCRIPTIONS;
  onboarding: typeof ONBOARDING;
}

export function getCatalog(): CatalogResponse {
  return {
    tools: TOOL_METADATA,
    toolCosts: TOOL_COSTS,
    packages: PACKAGES,
    subscriptions: SUBSCRIPTIONS,
    onboarding: ONBOARDING,
  };
}
