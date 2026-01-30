# 🚀 Plano de Implementação - Guia do Coração (STATUS ATUAL)

## 📅 Cronograma Realizado

### **Sprint 1: Fundação & Setup (CONCLUÍDO)**
- [x] Estrutura de monorepo
- [x] Next.js configurado (App Router)
- [x] Documentação inicial
- [x] Firebase project setup
- [x] Variáveis de ambiente
- [x] Design System inicial (CSS Variables)

### **Sprint 2: Autenticação + Design System (CONCLUÍDO)**
- [x] Firebase Authentication configuração
- [x] Componentes Base (Button, Input, Card)
- [x] Layout Base (Glassmorphism)
- [x] Página de Login
- [x] Página de Registro
- [x] Login com Google (AuthContext)
- [ ] Recuperação de senha (GUI pendente)
- [x] Proteção de rotas (OnboardingGuard)
- [x] Context/Provider de autenticação (Refatorado na Sprint 8)

### **Sprint 3: Onboarding & Perfil (CONCLUÍDO)**
- [x] **Fluxo de Onboarding Completo**
  - [x] Tela de boas-vindas
  - [x] Formulário de Perfil (Data, Hora, Local, Intenção)
  - [x] Salvamento no Firestore
- [x] **Sistema de Pontos Cósmicos**
  - [x] Crédito inicial (bônus de boas-vindas)
  - [x] Transaction segura via Backend
- [x] **Dashboard**
  - [x] Exibição de saldo em tempo real
  - [x] Hub de ferramentas

### **Sprint 4: Horóscopo IA (CONCLUÍDO)**
- [x] Interface de seleção de signo
- [x] Integração com Google Gemini (API Route)
- [x] Sistema de débito de pontos (Transaction)
- [x] Resposta personalizada com base no perfil

### **Sprint 5: Monetização (CONCLUÍDO)**
- [x] **Loja (/shop)**
- [x] **Stripe Integration**
  - [x] Configurar chaves (Test Mode)
  - [x] Checkout Session (One-time payment)
  - [x] Webhook `/api/webhooks/stripe` para crédito automático
- [x] Produtos dinâmicos (Inline Pricing)

### **Sprint 6: Tarot (CONCLUÍDO)**
- [x] Interface de Baralho 3D (CSS Animations)
- [x] Imagens Realistas (Unsplash integration)
- [x] Sorteio Server-Side (API Route)
- [x] Interpretação da carta com IA

### **Sprint 7: Numerologia (CONCLUÍDO)**
- [x] Lógica Pitagórica (Lib compartilhada)
- [x] Interface de Relatório
- [x] Integração IA para análise profunda

### **Sprint 8: Polimento & Sync (CONCLUÍDO)**
- [x] Sincronização Real-time (Firestore onSnapshot)
- [x] Tipagem TypeScript Forte
- [x] Preparação para Deploy (Firebase Hosting com Web Frameworks)

---

## 🔮 Pendências Prioritárias (Próximos Passos)

### Funcionalidades Essenciais Faltantes
1.  [ ] **Recuperação de Senha**: Página `/forgot-password` para resetar acesso.
2.  [ ] **Histórico de Leituras**: Página `/dashboard/history` para ver Tarots/Horóscopos passados.
3.  [ ] **Footer**: Navegação secundária e links legais.

### Melhoras Futuras (Pós-MVP)
- [ ] Assinaturas Recorrentes (Stripe Subscriptions)
- [ ] Mais Ferramentas: Sinastria, Mapa Astral Completo
- [ ] Blog / Conteúdo SEO

---

## 🛠️ Arquitetura Final (Adotada)

**Frontend & Backend Unificados**:
Optamos por **Next.js API Routes** em vez de Cloud Functions separadas para simplificar a gestão de estado e deploy.
- Frontend: `apps/web/app/*`
- Backend: `apps/web/app/api/*`
- Deploy: `firebase deploy` (detecta Next.js automaticamente).

**Banco de Dados**:
Structured `users/{uid}` collection com sub-coleção `toolUsages` para histórico.

**IA**:
Google Gemini Pro via SDK `@google/generative-ai`.

---

## ✅ Checklist de Verificação

- [x] Onboarding flui corretamente? SIM
- [x] Pontos são debitados? SIM
- [x] Pontos são creditados via Loja? SIM
- [x] Ferramentas (Horóscopo, Tarot, Numerologia) funcionam? SIM
- [x] Design é responsivo? SIM
- [ ] Senha pode ser resetada? NÃO (Fazer agora)
- [ ] Histórico é visível? NÃO (Fazer agora)


## 📅 Cronograma Sugerido

### **Sprint 1: Fundação & Setup (2-3 dias)**
- [x] Estrutura de monorepo
- [x] Next.js configurado
- [x] Documentação inicial
- [ ] Firebase project setup
- [ ] Variáveis de ambiente
- [ ] Design System inicial

### **Sprint 2: Autenticação + Design System Básico (4-5 dias)**
- [ ] Firebase Authentication configuração
- [ ] **3 Componentes Base** (Button, Input, Card)
- [ ] **Layout mínimo** (Header básico)
- [ ] **Paleta de cores definida**
- [ ] Página de Login
- [ ] Página de Registro
- [ ] Login com Google
- [ ] Recuperação de senha
- [ ] Proteção de rotas
- [ ] Context/Provider de autenticação

### **Sprint 3: Onboarding Expandido & Sistema de Pontos (3-4 dias)**
- [ ] **Fluxo de Onboarding Completo**
  - [ ] Tela de boas-vindas
  - [ ] **Formulário de Perfil** (novo - crítico para personalização)
    - [ ] Gênero (obrigatório)
    - [ ] Faixa etária (opcional)
    - [ ] Status amoroso (opcional)
    - [ ] Objetivo/Meta (opcional)
    - [ ] Contexto do momento (campo texto, opcional, max 200 chars)
    - [ ] Preferências de leitura (opcional)
  - [ ] Validação e salvamento do profile
  - [ ] Incremento de profileVersion no backend
- [ ] **Sistema de Pontos Cósmicos**
  - [ ] Crédito de 10 pontos iniciais (após completar profile)
  - [ ] Transaction de onboarding_bonus
  - [ ] Flag initialPointsGranted
- [ ] **Dashboard Básico**
  - [ ] Exibição de saldo de pontos
  - [ ] Navegação para ferramentas
  - [ ] Botão para editar perfil

### **Sprint 4: Design System Completo & UI (2-3 dias)**
- [ ] Componentes avançados (Modal, Dropdown, etc)
- [ ] Sidebar/Navegação completa
- [ ] Footer
- [ ] Animações e transições
- [ ] Tema dark/light (opcional)
- [ ] Responsividade completa

### **Sprint 5: Primeira Ferramenta - Horóscopo (3-4 dias)**
- [ ] Interface de seleção de signo
- [ ] Integração com IA (OpenAI/Gemini)
- [ ] Sistema de débito de pontos
- [ ] Controle de uso diário
- [ ] Exibição de resultado
- [ ] Histórico de leituras

### **Sprint 6: Ferramentas Simples (4-5 dias)**
- [ ] Conselhos Personalizados (questionário + IA)
- [ ] Leitura de Tarot (3 cartas)
- [ ] Calculadora de Alma Gêmea
- [ ] Sistema de reembolso automático

### **Sprint 7: Ferramentas Avançadas (5-6 dias)**
- [ ] Diário dos Sonhos
- [ ] Mapa Astral do Amor
- [ ] Análise de Compatibilidade
- [ ] Validações complexas de input

### **Sprint 8: Monetização - Stripe + Arquitetura Multi-Gateway (5-6 dias)**
- [ ] **Engine Unificada de Pontos**
  - [ ] Cloud Function `creditPoints()` (core)
  - [ ] Validação e transações atômicas
  - [ ] Logging e auditoria
- [ ] **Stripe Integration**
  - [ ] Configurar Stripe account (modo teste)
  - [ ] Criar produtos e preços no Stripe
  - [ ] Página de pacotes (Mini, Básico, Médio, Premium)
  - [ ] Página de assinaturas (Mensal, Anual)
  - [ ] Checkout Session (cartão)
  - [ ] Webhook `/api/webhooks/stripe`
  - [ ] Validação de signature
  - [ ] Handlers para eventos:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `invoice.paid`
    - `customer.subscription.deleted`
- [ ] **Preparação EfíBank** (estrutura apenas)
  - [ ] Webhook `/api/webhooks/efibank` (placeholder)
  - [ ] Campos no schema preparados (efibankTxId, etc)
  - [ ] Documentação de integração futura
- [ ] **Portal de Gerenciamento**
  - [ ] Stripe Customer Portal
  - [ ] Página de histórico de compras
  - [ ] Página de histórico de transações
- [ ] **Testes**
  - [ ] Testar compra de pacotes (cartão teste)
  - [ ] Testar assinatura mensal
  - [ ] Testar cancelamento
  - [ ] Testar webhooks

### **Sprint 9: Polimento & Testes (3-4 dias)**
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E (Playwright/Cypress)
- [ ] Correção de bugs
- [ ] Otimização de performance
- [ ] Acessibilidade (a11y)

### **Sprint 10: Deploy & Lançamento (2-3 dias)**
- [ ] Configurar domínio guiadocoracao.online
- [ ] SSL/HTTPS
- [ ] Firebase Hosting ou Vercel
- [ ] Analytics (Google Analytics/Plausible)
- [ ] SEO (meta tags, sitemap, robots.txt)
- [ ] Monitoramento de erros (Sentry)
- [ ] Lançamento MVP! 🎉

---

## 🎯 Próximos Passos Imediatos

### 1. **Configurar Firebase** (AGORA)
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto
firebase init
```

### 2. **Criar arquivos de variáveis de ambiente**

#### **Frontend: apps/web/.env.local** (client-safe, exposto ao navegador)
```env
# Firebase Client Config (NEXT_PUBLIC_ é exposto ao browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe Publishable Key (client-safe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **Backend: apps/functions/.env** (server-only, NUNCA expor!)
```env
# IA API Keys (SECRETS - nunca no frontend!)
OPENAI_API_KEY=
# ou
GOOGLE_GEMINI_API_KEY=

# Stripe Server Keys (SECRETS!)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Firebase Admin (geralmente não precisa, usa Application Default Credentials)
# FIREBASE_SERVICE_ACCOUNT_KEY=...
```

**⚠️ REGRA DE OURO**: Qualquer SECRET (API keys, tokens, webhooks) NUNCA vai no `NEXT_PUBLIC_` nem no frontend!

### 3. **Instalar dependências necessárias**

#### **Frontend (apps/web)**
```bash
cd apps/web

# Firebase CLIENT SDK (nunca firebase-admin aqui!)
npm install firebase

# Stripe CLIENT
npm install @stripe/stripe-js

# Forms
npm install react-hook-form @hookform/resolvers zod

# State Management
npm install zustand

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react # ícones

# Animações
npm install framer-motion
```

#### **Backend (apps/functions)**
```bash
cd apps/functions

# Firebase Functions + Admin SDK
npm install firebase-functions firebase-admin

# Stripe SERVER SDK
npm install stripe

# IA
npm install openai
# ou
npm install @google/generative-ai

# Utilities
npm install zod # validação
```

### 4. **Estrutura de pastas sugerida**
```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── tools/
│   │   │   ├── horoscope/
│   │   │   ├── tarot/
│   │   │   ├── soulmate/
│   │   │   └── ...
│   │   ├── subscription/
│   │   └── history/
│   └── onboarding/
├── components/
│   ├── ui/              # Componentes base
│   ├── auth/            # Componentes de auth
│   ├── tools/           # Componentes de ferramentas
│   └── layout/          # Header, Footer, etc
├── lib/
│   ├── firebase.ts      # Config do Firebase
│   ├── stripe.ts        # Config do Stripe (client)
│   ├── utils.ts         # Utilidades
│   └── constants.ts     # Constantes (preços, custos)
├── hooks/
│   ├── useAuth.ts
│   ├── usePoints.ts
│   └── useSubscription.ts
├── store/
│   └── authStore.ts     # Zustand store
└── types/
    └── index.ts         # TypeScript types

apps/functions/
├── src/
│   ├── index.ts         # Export de todas as functions
│   ├── webhooks/
│   │   ├── stripe.ts    # Stripe webhook handler
│   │   └── efibank.ts   # EfíBank webhook (futuro)
│   ├── payments/
│   │   ├── creditPoints.ts      # Engine unificada
│   │   └── createCheckout.ts    # Criar checkout session
│   ├── tools/
│   │   ├── useTool.ts           # Usar ferramenta (débito + IA)
│   │   └── refundPoints.ts      # Reembolso
│   └── utils/
│       ├── firestore.ts
│       └── validation.ts
├── package.json
└── tsconfig.json
```

---

## 📱 **Mobile-First (PRIORIDADE ALTA)**

### Princípio Fundamental
**~80% dos acessos serão por celular** - O design DEVE ser mobile-first desde o início.

### Diretrizes Obrigatórias

**1. Layout Responsivo**
- Começar design pelo mobile (320px-375px)
- Expandir para tablet (768px) e desktop (1024px+)
- Usar Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`

**2. Tipografia Legível**
- Tamanho mínimo de fonte: 16px (evita zoom automático no iOS)
- Line-height adequado para leitura em tela pequena (1.5-1.7)
- Contraste mínimo WCAG AA (4.5:1)

**3. Área de Toque (Touch Targets)**
- Botões: mínimo 44x44px (recomendação Apple/Google)
- Espaçamento entre elementos clicáveis: mínimo 8px
- Inputs: altura mínima 48px

**4. Thumb Zone**
- Elementos importantes na parte inferior/centro da tela
- Navegação principal acessível com polegar
- Evitar ações críticas nos cantos superiores

**5. Performance Mobile**
- Imagens otimizadas (WebP, lazy loading)
- Minimizar JavaScript
- First Contentful Paint < 2s

**6. Testes Obrigatórios**
- Testar em viewport mobile ANTES de desktop
- Usar Chrome DevTools (Device Mode)
- Testar em dispositivo real (iOS e Android)

### Checklist por Sprint

Toda tela/componente DEVE:
- [ ] Ser desenhada mobile-first
- [ ] Funcionar perfeitamente em 375px
- [ ] Ter touch targets adequados
- [ ] Ser testada em mobile antes de aprovar

---

## 🎨 Design System - Cores Sugeridas

```css
/* Tema Cósmico Romântico */
--cosmic-purple: #8B5CF6    /* Roxo principal */
--cosmic-pink: #EC4899      /* Rosa vibrante */
--cosmic-gold: #F59E0B      /* Dourado */
--cosmic-dark: #1E1B4B      /* Roxo escuro (fundo) */
--cosmic-light: #F3E8FF     /* Lavanda claro */

--heart-red: #EF4444        /* Vermelho amor */
--star-yellow: #FCD34D      /* Amarelo estrela */

/* Neutros */
--gray-50: #F9FAFB
--gray-900: #111827
```

---

## 🔑 Decisões Técnicas Importantes

### IA Provider
**Decisão Final: Google Gemini para MVP**

**Implementação**:
- ✅ Começar com Gemini (gratuito até 15 req/min)
- ✅ Abstrair via interface `AIProvider`
- ✅ Preparar para migração futura para GPT-4 sem refatoração

**Arquitetura**:
```typescript
// packages/shared/src/ai/provider.ts
interface AIProvider {
  generateResponse(prompt: string, options?: AIOptions): Promise<AIResponse>
}

class GeminiProvider implements AIProvider { ... }
class OpenAIProvider implements AIProvider { ... }

// Fácil trocar depois
const aiProvider: AIProvider = new GeminiProvider();
```

**Personalização com Profile**:
- ✅ Todas as Cloud Functions de tools DEVEM carregar `user.profile`
- ✅ Injetar dados do profile no prompt para aumentar coerência
- ✅ Registrar `profileVersion` e snapshot do profile em `toolUsages`
- ✅ NÃO expor dados sensíveis (context, preferences) no snapshot

**Exemplo de Prompt Personalizado**:
```typescript
const userProfile = await getUser Profile(userId);

const prompt = `
Você é um astrólogo especializado em relacionamentos.

Contexto do usuário:
- Gênero: ${userProfile.gender}
- Faixa etária: ${userProfile.ageRange}
- Status: ${userProfile.relationshipStatus}
- Objetivo: ${userProfile.goal}

[Prompt específico da ferramenta...]
`;
```

**Recomendação**: Começar com Gemini, migrar para GPT-4 quando tiver receita recorrente.

### Hosting
**Opção 1: Vercel**
- ✅ Otimizado para Next.js
- ✅ Deploy automático
- ✅ Fácil configuração de domínio
- ✅ Plano gratuito generoso

**Opção 2: Firebase Hosting**
- ✅ Integração nativa com Firebase
- ✅ CDN global
- ⚠️ Menos otimizado para Next.js

**Recomendação**: Vercel para frontend, Firebase Functions para backend.

### Payment Gateways
**Modelo de Monetização**: 100% baseado em consumo de Pontos Cósmicos
- ❌ **SEM** planos "ilimitados" ou "premium"
- ✅ Pacotes avulsos: Mini (R$ 5), Básico (R$ 9,90), Médio (R$ 24,90), Premium (R$ 69,90)
- ✅ Assinaturas: Recarga mensal de 200 pontos (R$ 29,90/mês ou R$ 119/ano)
- ✅ Pontos acumulam e não expiram

**Gateway Principal: Stripe**
- ✅ Cartão de crédito/débito
- ✅ Assinaturas recorrentes nativas
- ✅ Webhooks robustos
- ✅ Documentação excelente
- ✅ Modo teste completo

**Gateway Futuro: EfíBank**
- ✅ PIX (QR Code)
- ✅ Popular no Brasil
- ⚠️ Implementar depois do MVP
- ✅ Arquitetura já preparada (campos no schema, webhook placeholder)

**Arquitetura Multi-Gateway**:
- Engine unificada `creditPoints()` para todas as fontes
- Webhooks separados por gateway (`/api/webhooks/stripe`, `/api/webhooks/efibank`)
- Rastreabilidade completa com campo `paymentGateway` em transactions
- **Benefício**: Adicionar EfíBank não requer refatoração, apenas novo webhook handler

---

## 📊 Estimativa de Custos Mensais (MVP)

| Serviço | Custo Estimado |
|---------|----------------|
| Firebase (Firestore + Auth) | $0-25 |
| OpenAI/Gemini API | $50-200 |
| Stripe (taxa de transação) | 2.9% + $0.30 |
| Vercel Hosting | $0 (plano gratuito) |
| Domínio | ~$12/ano |
| **Total Mensal** | **~$50-250** |

---

## ✅ Checklist Pré-Desenvolvimento

- [ ] Conta Firebase criada
- [ ] Conta Stripe criada (modo teste)
- [ ] API key OpenAI ou Gemini obtida
- [ ] Domínio guiadocoracao.online configurado
- [ ] Repositório Git configurado
- [ ] Ambiente de desenvolvimento funcionando

---

**Pronto para começar?** 🚀

Sugiro começarmos pela **Sprint 2: Autenticação** agora que temos a base pronta!
