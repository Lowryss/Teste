# 🎯 CONSOLIDAÇÃO FINAL - Guia do Coração

**Data**: 22/01/2026  
**Status**: ✅ APROVADO E CONGELADO

Este documento consolida TODAS as decisões finais do projeto. Estas decisões são **LEI** e devem ser seguidas rigorosamente durante o desenvolvimento.

---

## 📋 DECISÕES FINAIS APROVADAS

### 1️⃣ **Arquitetura: Backend Único em Firebase Functions**

**REGRA**: Todo processamento server-side DEVE estar em Firebase Functions.

✅ **Firebase Functions concentra**:
- IA (Gemini/OpenAI)
- Engine de pontos (`creditPoints`)
- Webhooks (Stripe, EfíBank)
- Lógica de ferramentas (`useTool`)
- Validações e segurança

✅ **Next.js (Frontend)**:
- APENAS UI/UX
- Chamadas HTTPS para Functions
- SEM lógica de negócio
- SEM acesso direto ao Firestore para operações sensíveis

❌ **PROIBIDO**:
- Webhooks em `app/api` do Next.js
- Lógica de pontos no frontend
- Cálculos de preços no frontend

---

### 2️⃣ **Regra de Crédito de Assinaturas (INEQUÍVOCA)**

**Plano Mensal (R$ 29,90/mês)**:
- ✅ Credita 200 pontos a CADA `invoice.paid`
- ✅ Primeira cobrança: 200 pontos
- ✅ Renovações mensais: 200 pontos cada
- Evento Stripe: `invoice.paid`

**Plano Anual (R$ 119,00/ano)**:
- ✅ Credita 2400 pontos (200×12) de UMA VEZ no primeiro pagamento
- ✅ Evento Stripe: `checkout.session.completed` ou primeiro `invoice.paid`
- ❌ Renovações anuais: NÃO creditam pontos (apenas renovam assinatura)

**Sem Scheduler/Cron no MVP**:
- ❌ Não usar Cloud Scheduler
- ✅ Crédito via webhooks do Stripe apenas

---

### 3️⃣ **Identificadores Canônicos (CONGELADOS)**

**Tools** (7 ferramentas):
```typescript
'horoscope' | 'advice' | 'tarot' | 'soulmate' | 'dreams' | 'birthchart' | 'compatibility'
```

**Packages** (4 pacotes):
```typescript
'mini' | 'basic' | 'medium' | 'premium'
```

**Payment Gateways** (3 gateways):
```typescript
'stripe' | 'efibank' | 'manual'
```

**Transaction Types** (6 tipos):
```typescript
'debit' | 'credit' | 'refund' | 'purchase' | 'subscription_charge' | 'onboarding_bonus'
```

❌ **NÃO alterar estes identificadores** sem atualizar catálogo e documentação.

---

### 4️⃣ **Catálogo Centralizado (Fonte de Verdade Única)**

**Localização**: `packages/shared/src/catalog.ts`

**REGRA**: Backend e Frontend DEVEM usar este catálogo.

✅ **Contém**:
- Pontos iniciais (10)
- Custos das tools (1-20 pontos)
- Pacotes (mini, basic, medium, premium) + bônus
- Assinaturas (monthly, annual) + pontos
- Metadados (nomes, descrições, ícones)

✅ **Uso**:
```typescript
// Backend
import { getToolCost, TOOL_COSTS } from '@/shared/catalog';

// Frontend (via Cloud Function)
const catalog = await getCatalog(); // Chama Function
```

❌ **PROIBIDO**:
- Hardcoded prices no frontend
- Duplicar valores em múltiplos arquivos
- Calcular preços manualmente

---

### 5️⃣ **IA Provider: Gemini no MVP**

**Decisão Final**: Google Gemini

✅ **Implementação**:
- Começar com Gemini (gratuito até 15 req/min)
- Abstrair via interface `AIProvider`
- Preparar para migração futura para GPT-4

**Arquitetura**:
```typescript
interface AIProvider {
  generateResponse(prompt: string, options?: AIOptions): Promise<AIResponse>
}

class GeminiProvider implements AIProvider { ... }
class OpenAIProvider implements AIProvider { ... }

// Fácil trocar depois
const aiProvider: AIProvider = new GeminiProvider();
```

**Migração futura**: Trocar para GPT-4 quando tiver receita recorrente.

---

### 6️⃣ **Mobile-First OBRIGATÓRIO (Prioridade Alta)**

**REGRA**: ~80% dos acessos serão por celular.

✅ **Diretrizes Obrigatórias**:

**Layout**:
- Começar design pelo mobile (320px-375px)
- Expandir para tablet e desktop
- Usar Tailwind breakpoints

**Tipografia**:
- Tamanho mínimo: 16px (evita zoom iOS)
- Line-height: 1.5-1.7
- Contraste: mínimo WCAG AA (4.5:1)

**Touch Targets**:
- Botões: mínimo 44x44px
- Espaçamento: mínimo 8px
- Inputs: altura mínima 48px

**Thumb Zone**:
- Elementos importantes na parte inferior/centro
- Navegação acessível com polegar
- Evitar ações críticas nos cantos superiores

**Checklist por Sprint**:
- [ ] Desenhada mobile-first
- [ ] Funciona perfeitamente em 375px
- [ ] Touch targets adequados
- [ ] Testada em mobile ANTES de aprovar

---

### 7️⃣ **Personalização com Profile (NOVO)**

**REGRA**: Respostas da IA DEVEM ser coerentes com dados do usuário.

✅ **Fluxo de Onboarding Expandido**:
1. Welcome
2. **Formulário de Perfil** (novo)
3. Crédito de 10 pontos
4. Dashboard

✅ **Campos do Profile (MVP)**:
```typescript
profile: {
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'  // Obrigatório
  ageRange?: '18-24' | '25-34' | '35-44' | '45+'
  relationshipStatus?: 'single' | 'dating' | 'in-relationship' | 'married' | 'complicated'
  goal?: 'find-love' | 'improve-relationship' | 'get-over-breakup' | 'reconciliation' | 'self-discovery'
  context?: string  // Campo texto curto (max 200 chars)
  preferences?: {
    tone?: 'direct' | 'romantic' | 'balanced'
    avoidDeterministic?: boolean
  }
}
profileVersion: number  // Incrementado pelo backend
```

✅ **Uso nos Prompts**:
- Todas as Cloud Functions de tools DEVEM carregar `user.profile`
- Injetar dados no prompt para personalização
- Registrar `profileVersion` em `toolUsages`
- Snapshot do profile (sem dados sensíveis)

✅ **Progressive Profiling**:
- MVP: coletar o suficiente para personalizar
- Futuro: adicionar campos incrementalmente

❌ **NÃO**:
- Coletar dados excessivos
- Expor `context` ou `preferences` em snapshots públicos

---

## 📊 SCHEMA ATUALIZADO

### User
```typescript
interface User {
  id: string
  email: string
  name: string
  
  profile: {
    gender: string
    ageRange?: string
    relationshipStatus?: string
    goal?: string
    context?: string
    preferences?: { tone?: string, avoidDeterministic?: boolean }
  }
  profileVersion: number
  profileCompletedAt?: Timestamp
  
  cosmicPoints: number
  subscription: {
    plan: 'free' | 'monthly' | 'annual'
    status: 'active' | 'canceled' | 'past_due' | 'none'
    subscriptionId?: string
  }
  
  stripeCustomerId?: string
  onboardingCompleted: boolean
  initialPointsGranted: boolean
  dailyUsage: { horoscope?: string }
  
  totalPointsEarned: number
  totalPointsSpent: number
  toolsUsedCount: number
  
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Security Rules
```javascript
// Client PODE editar:
['name', 'profile', 'profileCompletedAt', 'onboardingCompleted', 'updatedAt']

// Client NÃO PODE editar (apenas backend):
['cosmicPoints', 'subscription', 'stripeCustomerId', 'totalPointsEarned', 
 'totalPointsSpent', 'dailyUsage', 'initialPointsGranted', 'profileVersion']
```

---

## 🚀 SPRINTS ATUALIZADOS

### Sprint 3: Onboarding Expandido (3-4 dias)
- Tela de boas-vindas
- **Formulário de Perfil completo**
  - Gênero (obrigatório)
  - Faixa etária (opcional)
  - Status amoroso (opcional)
  - Objetivo (opcional)
  - Contexto (opcional, max 200 chars)
  - Preferências (opcional)
- Validação e salvamento
- Incremento de profileVersion (backend)
- Crédito de 10 pontos (onboarding_bonus)
- Dashboard com saldo

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Antes de Começar Sprint 1.5
- [ ] Criar conta Firebase
- [ ] Criar projeto Firebase
- [ ] Obter API key do Gemini
- [ ] Criar conta Stripe (modo teste)
- [ ] Configurar variáveis de ambiente

### Durante Desenvolvimento
- [ ] Sempre usar `packages/shared/src/catalog.ts`
- [ ] Sempre testar mobile-first
- [ ] Sempre carregar profile nas tools
- [ ] Sempre incrementar profileVersion ao atualizar profile
- [ ] Sempre usar identificadores canônicos
- [ ] Sempre validar no backend

### Antes de Deploy
- [ ] Testar webhooks Stripe
- [ ] Testar crédito mensal (200 pontos)
- [ ] Testar crédito anual (2400 pontos upfront)
- [ ] Testar personalização de IA
- [ ] Testar em mobile real
- [ ] Verificar security rules

---

## 🎯 PRÓXIMO PASSO

**Sprint 1.5: Firebase Setup**

1. Criar projeto Firebase
2. Configurar Authentication
3. Configurar Firestore
4. Aplicar Security Rules
5. Conectar Next.js ao Firebase
6. Inicializar Firebase Functions
7. Obter API key do Gemini
8. Configurar Stripe (modo teste)

**Depois**: Sprint 2 - Autenticação + Design System Básico

---

## 📚 DOCUMENTOS ATUALIZADOS

✅ `packages/shared/src/catalog.ts` - Catálogo centralizado  
✅ `docs/DATA_STRUCTURE.md` - Schema completo com profile  
✅ `docs/IMPLEMENTATION_PLAN.md` - Sprints e mobile-first  
✅ `docs/CONSOLIDACAO_FINAL.md` - Este documento  

---

**🔒 ESTE DOCUMENTO É LEI DO PROJETO**

Qualquer desvio destas decisões deve ser documentado e aprovado explicitamente.

---

*Última atualização: 22/01/2026 23:10*
