# 📊 Estrutura de Dados - Guia do Coração

## 🗄️ Collections do Firestore

### 1. **users**
Armazena informações dos usuários cadastrados.

```typescript
interface User {
  id: string                    // UID do Firebase Auth
  email: string
  name: string
  
  // Profile (para personalização de IA)
  profile: {
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
    ageRange?: '18-24' | '25-34' | '35-44' | '45+'
    relationshipStatus?: 'single' | 'dating' | 'in-relationship' | 'married' | 'complicated'
    goal?: 'find-love' | 'improve-relationship' | 'get-over-breakup' | 'reconciliation' | 'self-discovery'
    context?: string              // Campo texto curto (max 200 chars)
    preferences?: {
      tone?: 'direct' | 'romantic' | 'balanced'
      avoidDeterministic?: boolean
    }
  }
  profileVersion: number        // Incrementa quando profile é atualizado
  profileCompletedAt?: Timestamp
  
  cosmicPoints: number          // Saldo atual de pontos
  
  // Subscription (denormalizado para queries rápidas)
  subscription: {
    plan: 'monthly' | 'annual' | null  // null = sem assinatura
    status: 'active' | 'canceled' | 'past_due' | 'none'
    gateway: 'stripe' | 'efibank' | null
    subscriptionId?: string     // ID da assinatura no Stripe/EfíBank
    currentPeriodEnd?: Timestamp
  }
  
  stripeCustomerId?: string     // ID do cliente no Stripe
  onboardingCompleted: boolean
  initialPointsGranted: boolean // Se já recebeu os 10 pontos iniciais
  createdAt: Timestamp
  updatedAt: Timestamp
  
  // Controles de uso diário (MVP simplificado - uma única fonte de verdade)
  dailyUsage: {
    horoscope?: string          // YYYY-MM-DD da última vez que usou
    // Adicionar outras ferramentas com limite aqui se necessário
  }
  
  // Estatísticas
  totalPointsEarned: number
  totalPointsSpent: number
  toolsUsedCount: number
}
```

**Índices necessários**:
- `email` (único)
- `stripeCustomerId`
- `subscriptionStatus`

---

### 2. **transactions**
Registra todas as transações de pontos (débitos, créditos, reembolsos).

```typescript
interface Transaction {
  id: string
  userId: string
  type: 'debit' | 'credit' | 'refund' | 'purchase' | 'subscription_charge' | 'onboarding_bonus'
  amount: number                // Positivo para crédito, negativo para débito
  balanceBefore: number
  balanceAfter: number
  
  // Contexto
  toolName?: string             // Se foi uso de ferramenta
  description: string           // Ex: "Horóscopo do Amor", "Pacote Mini 20 pontos"
  
  // Payment Gateway (para rastreabilidade multi-gateway)
  paymentGateway?: 'stripe' | 'efibank' | 'manual'
  
  // Stripe (se aplicável)
  stripePaymentId?: string
  stripeInvoiceId?: string
  
  // EfíBank (se aplicável)
  efibankTxId?: string
  efibankEndToEndId?: string
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  
  // Metadata
  metadata?: Record<string, any>
  createdAt: Timestamp
}
```

**Índices necessários**:
- `userId` + `createdAt` (desc)
- `userId` + `type`
- `status`

---

### 3. **toolUsages**
Registra cada uso de ferramenta com input e output.

```typescript
interface ToolUsage {
  id: string
  userId: string
  toolName: 'horoscope' | 'advice' | 'tarot' | 'soulmate' | 'dreams' | 'birthchart' | 'compatibility'
  
  // Input do usuário
  input: {
    // Varia por ferramenta
    sign?: string               // Horóscopo
    question?: string           // Tarot, Conselhos
    birthDate?: string          // Mapa Astral
    birthTime?: string
    birthPlace?: string
    partnerData?: object        // Compatibilidade
    dreamDescription?: string   // Sonhos
    // ... outros campos
  }
  
  // Profile usado (para personalização)
  profileVersion: number        // Versão do profile do usuário no momento do uso
  userProfile?: {               // Snapshot do profile (sem dados sensíveis)
    gender: string
    ageRange?: string
    relationshipStatus?: string
    goal?: string
    // NÃO incluir context ou preferences (privacidade)
  }
  
  // Output da IA
  output: {
    result: string              // Texto principal da resposta
    cards?: string[]            // Tarot: cartas sorteadas
    score?: number              // Alma Gêmea: pontuação
    poem?: string               // Alma Gêmea: poema
    // ... outros campos
  }
  
  // Custos e status
  pointsSpent: number
  transactionId: string         // Referência à transaction
  status: 'success' | 'failed' | 'refunded'
  
  // IA metadata
  aiProvider: 'gemini' | 'openai'
  aiModel: string               // Ex: "gemini-pro", "gpt-4"
  tokensUsed?: number
  
  // Timestamps
  createdAt: Timestamp
  processingTime?: number       // Milissegundos
}
```

**Índices necessários**:
- `userId` + `createdAt` (desc)
- `userId` + `toolName`
- `status`

---

### 4. **subscriptions**
Detalhes das assinaturas ativas e históricas.

```typescript
interface Subscription {
  id: string
  userId: string
  
  // Payment Gateway
  paymentGateway: 'stripe' | 'efibank'
  
  // Stripe (se aplicável)
  stripeSubscriptionId?: string
  stripePriceId?: string
  stripeCustomerId?: string
  
  // EfíBank (se aplicável)
  efibankSubscriptionId?: string
  
  // Plano
  plan: 'monthly' | 'annual'
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete'
  
  // Recarga de pontos
  pointsGranted: number         // Pontos já creditados nesta assinatura
  // monthly: 200 pontos por período
  // annual: 2400 pontos no início (upfront)
  
  lastRechargeDate?: Timestamp  // Última vez que pontos foram creditados
  nextRechargeDate?: Timestamp  // Próxima recarga (apenas monthly)
  
  // Datas
  currentPeriodStart: Timestamp
  currentPeriodEnd: Timestamp
  cancelAt?: Timestamp
  canceledAt?: Timestamp
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Índices necessários**:
- `userId` + `status`
- `stripeSubscriptionId` (único)
- `status`

---

### 5. **purchases**
Compras avulsas de pacotes de pontos.

```typescript
interface Purchase {
  id: string
  userId: string
  
  // Payment Gateway
  paymentGateway: 'stripe' | 'efibank'
  
  // Stripe (se aplicável)
  stripePaymentIntentId?: string
  stripeInvoiceId?: string
  
  // EfíBank (se aplicável)
  efibankTxId?: string
  efibankEndToEndId?: string
  efibankQrCode?: string        // QR Code PIX gerado
  
  // Produto
  packageType: 'mini' | 'basic' | 'medium' | 'premium'
  pointsAmount: number          // Pontos base do pacote
  bonusPoints: number           // Pontos extras (bônus de 10%)
  totalPoints: number           // pointsAmount + bonusPoints
  
  // Pagamento
  amount: number                // Em centavos (ex: 500 = R$ 5,00)
  currency: string              // 'BRL'
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'expired'
  
  // Entrega
  pointsDelivered: boolean
  deliveredAt?: Timestamp
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  expiresAt?: Timestamp         // Para PIX que expira
}
```

**Índices necessários**:
- `userId` + `createdAt` (desc)
- `stripePaymentIntentId` (único)
- `status`

---

### 6. **aiPrompts**
Templates de prompts para cada ferramenta (configurável).

```typescript
interface AIPrompt {
  id: string
  toolName: string
  version: number
  
  systemPrompt: string          // Contexto geral
  userPromptTemplate: string    // Template com variáveis {{variable}}
  
  // Configurações
  temperature: number           // 0.0 - 1.0
  maxTokens: number
  
  // Metadata
  isActive: boolean
  createdAt: Timestamp
  createdBy: string             // Admin user ID
}
```

---

## 🔐 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Campos que NUNCA podem ser alterados pelo client
    function isSensitiveField(field) {
      return field in ['cosmicPoints', 'subscription', 'stripeCustomerId', 
                       'totalPointsEarned', 'totalPointsSpent', 
                       'dailyUsage', 'initialPointsGranted', 'profileVersion'];
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      // Apenas campos permitidos na criação
                      request.resource.data.keys().hasOnly(['id', 'email', 'name', 'createdAt']);
      
      allow update: if isOwner(userId) && 
                      // Bloqueia atualização de campos sensíveis
                      !request.resource.data.diff(resource.data).affectedKeys()
                        .hasAny(['cosmicPoints', 'subscription', 'stripeCustomerId', 
                                'totalPointsEarned', 'totalPointsSpent', 
                                'dailyUsage', 'initialPointsGranted', 'profileVersion']) &&
                      // Permite atualizar: name, profile, onboardingCompleted
                      request.resource.data.diff(resource.data).affectedKeys()
                        .hasOnly(['name', 'profile', 'profileCompletedAt', 'onboardingCompleted', 'updatedAt']);
    }
    
    // Transactions - read only para usuário
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow write: if false; // Apenas backend via Admin SDK
    }
    
    // Tool Usages - read only para usuário
    match /toolUsages/{usageId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow write: if false; // Apenas backend via Admin SDK
    }
    
    // Subscriptions - read only
    match /subscriptions/{subscriptionId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow write: if false; // Apenas backend via Admin SDK
    }
    
    // Purchases - read only
    match /purchases/{purchaseId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow write: if false; // Apenas backend via Admin SDK
    }
    
    // AI Prompts - read only para usuários autenticados
    match /aiPrompts/{promptId} {
      allow read: if isAuthenticated() && resource.data.isActive == true;
      allow write: if false; // Apenas admin via backend
    }
  }
}
```

**⚠️ Notas de Segurança**:
- Campos sensíveis (`cosmicPoints`, `subscription`, `profileVersion`, `initialPointsGranted`, etc) **só podem ser alterados pelo backend** via Admin SDK
- Client pode atualizar: `name`, `profile` (campos do perfil), `profileCompletedAt`, `onboardingCompleted`
- `profileVersion` é incrementado automaticamente pelo backend quando profile é atualizado
- Todas as collections de transações/histórico são **read-only** para o client
- `aiPrompts` só mostra prompts ativos para usuários

---

## 🔄 Fluxos de Dados Críticos

### Helper Functions Úteis

```typescript
// Checar se usuário tem assinatura ativa
function isSubscriber(user: User): boolean {
  return user.subscription.status === 'active' && user.subscription.plan !== null;
}

// Checar se usuário tem pontos suficientes
function hasEnoughPoints(user: User, toolName: ToolName): boolean {
  return user.cosmicPoints >= getToolCost(toolName);
}

// Inicializar subscription para novo usuário
function getDefaultSubscription() {
  return {
    plan: null,
    status: 'none' as const,
    gateway: null,
  };
}
```

---

## 🎯 Preços e Configurações

### Pontos Iniciais
```typescript
const ONBOARDING_BONUS = 10; // Pontos concedidos uma única vez no onboarding
```

### Pacotes de Pontos (Compra Única)
```typescript
const POINT_PACKAGES = {
  mini: {
    points: 20,
    bonus: 0,
    total: 20,
    price: 500,         // R$ 5,00 (em centavos)
  },
  basic: {
    points: 40,
    bonus: 0,
    total: 40,
    price: 990,         // R$ 9,90
  },
  medium: {
    points: 120,
    bonus: 12,          // +10%
    total: 132,
    price: 2490,        // R$ 24,90
  },
  premium: {
    points: 400,
    bonus: 40,          // +10%
    total: 440,
    price: 6990,        // R$ 69,90
  }
}
```

### Assinaturas (Recarga Mensal)
```typescript
const SUBSCRIPTIONS = {
  monthly: {
    pointsPerPeriod: 200,
    price: 2990,        // R$ 29,90/mês
    interval: 'month',
    creditType: 'recurring',  // Credita todo mês
    features: [
      '200 pontos todo mês',
      'Pontos acumulam (não expiram)',
      'Cancele quando quiser',
      'Suporte prioritário'
    ]
  },
  annual: {
    pointsTotal: 2400,    // Crédito único de 2400 pontos
    price: 11900,         // R$ 119,00/ano
    interval: 'year',
    creditType: 'upfront',  // Credita tudo de uma vez
    features: [
      '2400 pontos de uma vez',
      'Pontos acumulam (não expiram)',
      'Economia de 67% vs mensal',
      'Cancele quando quiser',
      'Suporte prioritário'
    ]
  }
}
```

### Custo das Ferramentas
```typescript
const TOOL_COSTS = {
  horoscope: 1,        // Limite: 1x/dia
  advice: 3,
  tarot: 5,
  soulmate: 8,
  dreams: 10,
  birthchart: 15,
  compatibility: 20
}

const TOOL_DAILY_LIMITS = {
  horoscope: 1,        // Apenas horóscopo tem limite diário
  // Outras ferramentas: sem limite (apenas custo em pontos)
}
```

---

## 🔄 Fluxos de Dados Críticos

### 1. Uso de Ferramenta (Padrão Robusto - Transaction Curta)
```
1. Frontend: Usuário clica em ferramenta
2. Frontend: Verifica saldo local (UI feedback rápido)
3. Frontend: Chama Cloud Function `useTool`
4. Backend: Valida autenticação
5. Backend: Verifica saldo real no Firestore
6. Backend: Verifica limite diário (se aplicável) via user.dailyUsage
7. Backend: ⚡ TRANSACTION CURTA (não segurar durante chamada externa!)
   a. Debita pontos do usuário
   b. Cria registro em transactions com status='pending'
   c. Atualiza user.dailyUsage (se aplicável)
   d. Commit imediato
8. Backend: 🤖 Chama API da IA (FORA da transaction)
9. Backend: Se sucesso da IA:
   a. Salva resultado em toolUsages com status='success'
   b. Atualiza transaction para status='completed'
10. Backend: Se falha da IA:
   a. Inicia NOVA transaction para reembolso:
      - Adiciona pontos de volta ao usuário
      - Cria nova transaction com type='refund'
      - Atualiza transaction original para status='refunded'
   b. Salva em toolUsages com status='failed' (para auditoria)
11. Backend: Retorna resultado (ou erro) para frontend
12. Frontend: Exibe resultado ao usuário

⚠️ IMPORTANTE: Nunca segurar transaction durante I/O externo (API calls)!
Isso evita:
- Timeouts de transaction
- Conflitos e retries desnecessários
- Lock prolongado de documentos
```

### 2. Compra de Pacote
```
1. Frontend: Usuário seleciona pacote
2. Frontend: Redireciona para Stripe Checkout
3. Stripe: Processa pagamento
4. Stripe: Envia webhook para backend
5. Backend: Valida webhook signature
6. Backend: Verifica status do pagamento
7. Backend: Se succeeded:
   a. Cria registro em purchases
   b. Adiciona pontos ao usuário
   c. Cria transaction de crédito
8. Backend: Retorna 200 OK para Stripe
9. Frontend: Redireciona usuário de volta
10. Frontend: Mostra confirmação e novo saldo
```

### 3. Assinatura (Recarga Mensal ou Upfront)
```
1. Frontend: Usuário seleciona plano (monthly ou annual)
2. Frontend: Chama Cloud Function `createCheckoutSession`
3. Backend: Cria Stripe Checkout Session com metadata
4. Frontend: Redireciona para Stripe Checkout
5. Stripe: Processa pagamento
6. Stripe: Cria assinatura
7. Stripe: Envia webhook 'customer.subscription.created'
8. Backend (Firebase Function): Webhook handler recebe evento
9. Backend: Valida signature do Stripe
10. Backend: Identifica plano (monthly ou annual)
11. Backend: Se monthly:
    - Credita 200 pontos (primeira recarga)
    - Atualiza user.subscription = { plan: 'monthly', status: 'active', subscriptionId }
12. Backend: Se annual:
    - Credita 2400 pontos de uma vez (upfront)
    - Atualiza user.subscription = { plan: 'annual', status: 'active', subscriptionId }
13. Backend: Cria registro em subscriptions
14. Stripe: Mensalmente (apenas monthly) envia webhook 'invoice.paid'
15. Backend: Credita mais 200 pontos (renovação mensal)
```

**Nota**: Plano anual NÃO recebe recargas mensais, apenas crédito inicial de 2400 pontos.

---

## 🏗️ Arquitetura Multi-Gateway

### Princípios de Design

**1. Engine Unificada de Entrega de Pontos**
- Uma única função `creditPoints(userId, amount, metadata)` para todas as fontes
- Garante consistência independente do gateway
- Facilita auditoria e debugging

**2. Webhooks em Firebase Functions (não Next.js)**
- Firebase Functions HTTP endpoints para webhooks
- `/stripeWebhook` - Processa eventos do Stripe
- `/efibankWebhook` - Processa eventos do EfíBank (futuro)
- Cada webhook valida signature do respectivo gateway
- Ambos chamam a mesma engine de crédito
- **Vantagem**: Não depende do Next.js, pode escalar independentemente

**3. Rastreabilidade Completa**
- Campo `paymentGateway` em todas as transactions
- IDs específicos de cada gateway preservados
- Metadata completo para reconciliação

### Estrutura de Cloud Functions

```typescript
// apps/functions/src/index.ts

// ============================================
// CORE: Engine Unificada de Pontos
// ============================================

export const creditPoints = async (
  userId: string,
  amount: number,
  metadata: {
    type: 'purchase' | 'subscription_renewal' | 'onboarding_bonus'
    description: string
    paymentGateway?: 'stripe' | 'efibank' | 'manual'
    gatewayTransactionId?: string
    packageType?: string
  }
) => {
  const db = admin.firestore();
  
  // Transaction atômica
  await db.runTransaction(async (transaction) => {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await transaction.get(userRef);
    const userData = userDoc.data();
    
    const balanceBefore = userData.cosmicPoints;
    const balanceAfter = balanceBefore + amount;
    
    // Atualiza saldo do usuário
    transaction.update(userRef, {
      cosmicPoints: balanceAfter,
      totalPointsEarned: admin.firestore.FieldValue.increment(amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Cria registro de transação
    const transactionRef = db.collection('transactions').doc();
    transaction.set(transactionRef, {
      userId,
      type: metadata.type,
      amount,
      balanceBefore,
      balanceAfter,
      description: metadata.description,
      paymentGateway: metadata.paymentGateway,
      stripePaymentId: metadata.gatewayTransactionId?.startsWith('pi_') 
        ? metadata.gatewayTransactionId : null,
      efibankTxId: metadata.paymentGateway === 'efibank' 
        ? metadata.gatewayTransactionId : null,
      status: 'completed',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  return { success: true, newBalance: balanceAfter };
};

// ============================================
// STRIPE: Webhook Handler
// ============================================

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  try {
    // Valida signature
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const packageType = session.metadata.packageType;
        
        if (session.mode === 'payment') {
          // Compra avulsa
          const pkg = POINT_PACKAGES[packageType];
          await creditPoints(userId, pkg.total, {
            type: 'purchase',
            description: `Pacote ${packageType} - ${pkg.total} pontos`,
            paymentGateway: 'stripe',
            gatewayTransactionId: session.payment_intent,
            packageType
          });
          
          // Salva registro de purchase
          await db.collection('purchases').add({
            userId,
            paymentGateway: 'stripe',
            stripePaymentIntentId: session.payment_intent,
            packageType,
            pointsAmount: pkg.points,
            bonusPoints: pkg.bonus,
            totalPoints: pkg.total,
            amount: session.amount_total,
            currency: 'BRL',
            status: 'succeeded',
            pointsDelivered: true,
            deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
        break;
      }
      
      case 'customer.subscription.created':
      case 'invoice.paid': {
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const userId = subscription.metadata.userId;
        const plan = subscription.metadata.plan; // 'monthly' ou 'annual'
        
        // Verifica se é primeira cobrança ou renovação
        const isFirstCharge = event.type === 'customer.subscription.created';
        
        if (plan === 'monthly') {
          // MENSAL: Credita 200 pontos a cada invoice.paid (primeira + renovações)
          await creditPoints(userId, 200, {
            type: 'subscription_charge',
            description: isFirstCharge ? 'Assinatura Mensal - Primeira cobrança' : 'Assinatura Mensal - Renovação',
            paymentGateway: 'stripe',
            gatewayTransactionId: invoice.id
          });
        } else if (plan === 'annual' && isFirstCharge) {
          // ANUAL: Credita 2400 pontos APENAS no primeiro pagamento
          await creditPoints(userId, 2400, {
            type: 'subscription_charge',
            description: 'Assinatura Anual - Crédito único de 2400 pontos',
            paymentGateway: 'stripe',
            gatewayTransactionId: invoice.id
          });
        }
        // ANUAL renovação: NÃO credita pontos, apenas renova assinatura
        
        // Atualiza/cria subscription
        await db.collection('subscriptions').doc(subscription.id).set({
          userId,
          paymentGateway: 'stripe',
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCustomerId: subscription.customer,
          plan,
          status: subscription.status,
          pointsGranted: plan === 'monthly' ? 200 : 2400,
          lastRechargeDate: admin.firestore.FieldValue.serverTimestamp(),
          nextRechargeDate: plan === 'monthly' 
            ? new Date(subscription.current_period_end * 1000) 
            : null,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        // Atualiza user
        await db.collection('users').doc(userId).update({
          'subscription.plan': plan,
          'subscription.status': 'active',
          'subscription.gateway': 'stripe',
          'subscription.subscriptionId': subscription.id,
          'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000)
        });
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;
        
        await db.collection('users').doc(userId).update({
          'subscription.status': 'canceled'
        });
        
        await db.collection('subscriptions').doc(subscription.id).update({
          status: 'canceled',
          canceledAt: admin.firestore.FieldValue.serverTimestamp()
        });
        break;
      }
    }
    
    res.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// ============================================
// EFIBANK: Webhook Handler (Preparado)
// ============================================

export const efibankWebhook = functions.https.onRequest(async (req, res) => {
  // TODO: Implementar quando EfíBank for ativado
  
  try {
    // Valida signature do EfíBank
    // const isValid = validateEfiBankSignature(req);
    // if (!isValid) throw new Error('Invalid signature');
    
    const event = req.body;
    
    switch (event.tipo) {
      case 'PIX_RECEBIDO': {
        // Busca purchase pelo txId
        const purchaseDoc = await db.collection('purchases')
          .where('efibankTxId', '==', event.txid)
          .limit(1)
          .get();
        
        if (purchaseDoc.empty) {
          throw new Error('Purchase not found');
        }
        
        const purchase = purchaseDoc.docs[0].data();
        const pkg = POINT_PACKAGES[purchase.packageType];
        
        // Credita pontos usando a mesma engine
        await creditPoints(purchase.userId, pkg.total, {
          type: 'purchase',
          description: `Pacote ${purchase.packageType} - ${pkg.total} pontos (PIX)`,
          paymentGateway: 'efibank',
          gatewayTransactionId: event.txid,
          packageType: purchase.packageType
        });
        
        // Atualiza purchase
        await purchaseDoc.docs[0].ref.update({
          status: 'succeeded',
          efibankEndToEndId: event.endToEndId,
          pointsDelivered: true,
          deliveredAt: admin.firestore.FieldValue.serverTimestamp()
        });
        break;
      }
    }
    
    res.json({ received: true });
  } catch (err) {
    console.error('EfíBank webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

### Benefícios da Arquitetura

✅ **Sem Refatoração Futura**
- Adicionar EfíBank não requer mudanças na engine de pontos
- Apenas novo webhook handler

✅ **Consistência Garantida**
- Mesma lógica de crédito independente da fonte
- Transações atômicas em todos os casos

✅ **Rastreabilidade Total**
- Cada transaction sabe de qual gateway veio
- IDs específicos preservados para reconciliação

✅ **Fácil Debugging**
- Logs centralizados na função `creditPoints()`
- Webhook handlers simples e focados

---

**Próximo passo**: Implementar as Cloud Functions para gerenciar essas operações! 🚀

