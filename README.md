# 💖 Guia do Coração

> Plataforma de autoajuda esotérica com IA para insights sobre vida amorosa

**Domínio**: [guiadocoracao.online](https://guiadocoracao.online)

## 📋 Visão Geral

O **Guia do Coração** é uma aplicação web que oferece ferramentas esotéricas personalizadas usando inteligência artificial para fornecer insights sobre relacionamentos e vida amorosa. Os usuários utilizam uma moeda interna (Pontos Cósmicos) para acessar diversas ferramentas de análise.

## 🎯 Funcionalidades Principais

### 🔐 Autenticação
- Cadastro com nome, e-mail e senha
- Login com Google (OAuth)
- Recuperação de senha via e-mail
- Sistema de sessão seguro

### 🌟 Sistema de Pontos Cósmicos
- Moeda interna da aplicação
- Pontos iniciais gratuitos após onboarding
- Débito automático ao usar ferramentas
- Reembolso automático em caso de falha
- Saldo sempre visível no dashboard

### 🔮 Ferramentas de IA

| Ferramenta | Custo | Descrição |
|------------|-------|-----------|
| **Horóscopo do Amor** | 1 ponto | Previsão diária por signo (limite: 1x/dia) |
| **Conselhos Personalizados** | 3 pontos | Questionário + conselho da IA |
| **Leitura de Tarot** | 5 pontos | 3 cartas (Passado, Presente, Futuro) |
| **Calculadora de Alma Gêmea** | 8 pontos | Compatibilidade + poema personalizado |
| **Diário dos Sonhos** | 10 pontos | Interpretação de sonhos com foco amoroso |
| **Mapa Astral do Amor** | 15 pontos | Análise astrológica completa |
| **Análise de Compatibilidade** | 20 pontos | Relatório detalhado para casais |

### � Monetização

**Modelo**: 100% baseado em consumo de Pontos Cósmicos (sem planos "ilimitados")

#### 💳 Pacotes Avulsos (Compra Única)
| Pacote | Pontos | Bônus | Total | Preço |
|--------|--------|-------|-------|-------|
| **Mini** | 20 | - | 20 | R$ 5,00 |
| **Básico** | 40 | - | 40 | R$ 9,90 |
| **Médio** | 120 | +10% | 132 | R$ 24,90 |
| **Premium** | 400 | +10% | 440 | R$ 69,90 |

#### 🔄 Assinaturas (Recarga Automática)
| Plano | Pontos | Tipo | Preço |
|-------|--------|------|-------|
| **Mensal** | 200/mês | Recorrente | R$ 29,90/mês |
| **Anual** | 2400 | Upfront (uma vez) | R$ 119,00/ano |

**Regras**:
- ✅ Pontos **acumulam** (não expiram)
- ✅ Plano mensal: recebe 200 pontos todo mês
- ✅ Plano anual: recebe 2400 pontos de uma vez no início
- ✅ Cancelamento apenas **interrompe novas recargas**
- ✅ Pontos já creditados permanecem na conta

#### 💳 Gateways de Pagamento
- **Principal**: Stripe (cartão de crédito/débito)
- **Futuro**: EfíBank (PIX / QR Code)
- Arquitetura preparada para múltiplos gateways

### 🎨 Onboarding
1. Tela de boas-vindas personalizada
2. Seleção de gênero
3. **Recebimento de 10 Pontos Cósmicos iniciais** (uma única vez)
4. Redirecionamento para o Dashboard

## 🏗️ Arquitetura

```
guia-do-coracao/
├── apps/
│   ├── web/              # Next.js - Frontend
│   └── functions/        # Firebase Functions - Backend
├── packages/
│   └── shared/           # Código compartilhado
└── docs/                 # Documentação
```

### Stack Tecnológica

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Zustand (state management)

**Backend**
- Firebase Authentication
- Firebase Firestore
- Firebase Functions
- Stripe API

**IA**
- OpenAI API / Google Gemini
- Prompts personalizados por ferramenta

## 🚀 Roadmap MVP

### ✅ Fase 1: Fundação
- [x] Estrutura de monorepo
- [x] Next.js configurado
- [x] Git inicializado

### 🔄 Fase 2: Autenticação & Onboarding
- [ ] Firebase Authentication setup
- [ ] Páginas de Login/Registro
- [ ] Login com Google
- [ ] Recuperação de senha
- [ ] Fluxo de onboarding
- [ ] Sistema de Pontos Cósmicos

### 🔄 Fase 3: Dashboard & UI
- [ ] Design System (cores, tipografia, componentes)
- [ ] Layout principal
- [ ] Dashboard com saldo de pontos
- [ ] Navegação entre ferramentas

### 🔄 Fase 4: Ferramentas de IA
- [ ] Horóscopo do Amor
- [ ] Conselhos Personalizados
- [ ] Leitura de Tarot
- [ ] Calculadora de Alma Gêmea
- [ ] Diário dos Sonhos
- [ ] Mapa Astral do Amor
- [ ] Análise de Compatibilidade

### 🔄 Fase 5: Monetização
- [ ] Integração com Stripe
- [ ] Página de assinaturas
- [ ] Pacotes de pontos
- [ ] Webhooks para pagamentos
- [ ] Portal de gerenciamento
- [ ] Sistema de acesso premium

### 🔄 Fase 6: Deploy & Produção
- [ ] Configurar domínio customizado
- [ ] SSL/HTTPS
- [ ] Analytics
- [ ] SEO otimizado
- [ ] Testes E2E
- [ ] Deploy em produção

## 📊 Modelo de Dados

### User
```typescript
{
  id: string
  email: string
  name: string
  gender: 'male' | 'female' | 'other'
  cosmicPoints: number
  subscriptionStatus: 'free' | 'monthly' | 'annual'
  stripeCustomerId?: string
  createdAt: timestamp
  lastHoroscopeDate?: timestamp
}
```

### Transaction
```typescript
{
  id: string
  userId: string
  type: 'debit' | 'credit' | 'refund'
  amount: number
  tool: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: timestamp
}
```

### ToolUsage
```typescript
{
  id: string
  userId: string
  toolName: string
  input: object
  output: object
  pointsSpent: number
  timestamp: timestamp
}
```

## 🎨 Design Guidelines

- **Tema**: Místico, acolhedor, romântico
- **Cores**: Roxos, rosas, dourados (cosmos + amor)
- **Tipografia**: Elegante mas legível
- **Animações**: Suaves, mágicas (partículas, brilhos)
- **Responsivo**: Mobile-first

## 🔒 Segurança

- Autenticação via Firebase
- Validação de pontos no backend
- Proteção contra uso excessivo (rate limiting)
- Transações atômicas no Firestore
- Webhooks assinados do Stripe

## 📝 Licença

Proprietary - Todos os direitos reservados

---

**Status do Projeto**: 🚧 Em Desenvolvimento  
**Última Atualização**: Janeiro 2026
