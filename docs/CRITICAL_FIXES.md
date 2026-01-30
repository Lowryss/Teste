# ⚠️ Correções Críticas Aplicadas - Sprint 1.5

## 📋 Resumo das Correções

Este documento lista todas as correções críticas aplicadas ao projeto **Guia do Coração** antes de iniciar o desenvolvimento, baseadas em review de segurança e boas práticas.

---

## ✅ 1. Separação de Dependências (Frontend vs Backend)

### ❌ Problema Original
```bash
# ERRADO - firebase-admin no frontend!
npm install firebase firebase-admin
```

### ✅ Correção Aplicada

**Frontend (apps/web)**
```bash
npm install firebase                    # Client SDK apenas
npm install @stripe/stripe-js          # Client SDK apenas
```

**Backend (apps/functions)**
```bash
npm install firebase-functions firebase-admin  # Server SDK
npm install stripe                              # Server SDK
npm install openai                              # API de IA
```

**Motivo**: `firebase-admin` no frontend causa:
- Risco de segurança (expõe credenciais)
- Bloat desnecessário no bundle
- Possíveis erros de build

---

## ✅ 2. Variáveis de Ambiente Separadas

### ❌ Problema Original
Todas as secrets no mesmo arquivo `.env.local`, incluindo:
```env
OPENAI_API_KEY=           # SECRET!
STRIPE_SECRET_KEY=        # SECRET!
STRIPE_WEBHOOK_SECRET=    # SECRET!
```

### ✅ Correção Aplicada

**apps/web/.env.local** (client-safe)
```env
# Apenas NEXT_PUBLIC_* (exposto ao browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**apps/functions/.env** (server-only)
```env
# SECRETS - nunca expor!
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Regra de Ouro**: 🔐 **Qualquer SECRET nunca vai no `NEXT_PUBLIC_` nem no frontend!**

---

## ✅ 3. Ordem dos Sprints Otimizada

### ❌ Problema Original
```
Sprint 2: Autenticação
Sprint 3: Onboarding
Sprint 4: Design System completo
```
Resultado: Implementar telas → Refazer tudo quando design system ficar pronto

### ✅ Correção Aplicada
```
Sprint 2: Autenticação + Design System Básico (3 componentes base)
Sprint 3: Onboarding & Pontos
Sprint 4: Design System Completo
```

**Benefícios**:
- Menos retrabalho
- Componentes base prontos para usar em auth
- Identidade visual desde o início

---

## ✅ 4. Limite Diário Simplificado (Sem Duplicação)

### ❌ Problema Original
Duas fontes de verdade:
```typescript
// No user
lastHoroscopeDate?: Timestamp

// Collection separada
collection dailyLimits {
  userId, toolName, date, usageCount...
}
```

### ✅ Correção Aplicada
Uma única fonte de verdade no `user`:
```typescript
interface User {
  // ...
  dailyUsage: {
    horoscope?: string  // "YYYY-MM-DD"
    // Outras ferramentas com limite aqui
  }
}
```

**Benefícios**:
- Menos complexidade
- Menos custo (menos reads/writes)
- Menos chance de inconsistência
- Perfeito para MVP

---

## ✅ 5. Transaction Pattern Correto (Não Segurar Durante I/O)

### ❌ Problema Original
```javascript
// ERRADO - segurar transaction durante chamada externa
transaction.start()
  debitPoints()
  callOpenAI()  // ❌ I/O externo dentro!
  saveResult()
transaction.commit()
```

**Problemas**:
- Timeout de transaction
- Conflitos e retries
- Lock prolongado

### ✅ Correção Aplicada
```javascript
// CORRETO - transaction curta
// 1. Transaction curta
transaction.start()
  debitPoints()
  createTransaction(status='pending')
  updateDailyUsage()
transaction.commit()

// 2. Chamada externa (fora)
result = callOpenAI()

// 3. Atualizar resultado
if (success) {
  saveToolUsage(status='success')
  updateTransaction(status='completed')
} else {
  // Nova transaction para reembolso
  refundPoints()
  createRefundTransaction()
  updateTransaction(status='refunded')
}
```

**Benefícios**:
- Sem timeouts
- Rastreabilidade completa
- Reembolso automático robusto

---

## ✅ 6. Security Rules Melhoradas

### ❌ Problemas Originais
1. `dailyLimits` permitia read para qualquer autenticado
2. Validação de campos sensíveis usando `.diff()` (pode dar problema)

### ✅ Correção Aplicada

```javascript
// Users - bloqueio explícito de campos sensíveis
match /users/{userId} {
  allow update: if isOwner(userId) && 
    // Bloqueia campos sensíveis
    !request.resource.data.diff(resource.data).affectedKeys()
      .hasAny(['cosmicPoints', 'subscriptionStatus', 'stripeCustomerId', 
               'totalPointsEarned', 'totalPointsSpent', 'dailyUsage']) &&
    // Permite apenas: name, gender, onboardingCompleted
    request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(['name', 'gender', 'onboardingCompleted', 'updatedAt']);
}

// Todas as outras collections - read only
match /transactions/{transactionId} {
  allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
  allow write: if false; // Apenas backend via Admin SDK
}
```

**Campos protegidos** (só backend pode alterar):
- `cosmicPoints`
- `subscriptionStatus`
- `subscriptionId`
- `stripeCustomerId`
- `totalPointsEarned`
- `totalPointsSpent`
- `dailyUsage`

**Campos que client pode alterar**:
- `name`
- `gender`
- `onboardingCompleted`

---

## ✅ 7. Simplificação de Collections (MVP)

### Removido para MVP
- ❌ Collection `dailyLimits` (movido para `user.dailyUsage`)

### Mantido (essencial)
- ✅ `users`
- ✅ `transactions`
- ✅ `toolUsages`
- ✅ `subscriptions`
- ✅ `purchases`
- ✅ `aiPrompts`

**Nota**: Collections `subscriptions` e `purchases` podem ser simplificadas depois se necessário, mas mantidas por enquanto para rastreabilidade completa.

---

## 🎯 Próximos Passos (Sprint 1.5)

Agora que as correções foram aplicadas, podemos prosseguir com segurança:

### Checklist Sprint 1.5
- [ ] Criar projeto no Firebase Console
- [ ] Configurar Firebase Authentication (Email/Password + Google)
- [ ] Configurar Firestore Database
- [ ] Aplicar Security Rules corrigidas
- [ ] Configurar `apps/web` com Firebase Client SDK
- [ ] Configurar `apps/functions` com Firebase Admin SDK
- [ ] Criar arquivos `.env.local` e `.env` com variáveis corretas
- [ ] Testar conexão básica

### Após Sprint 1.5
➡️ **Sprint 2**: Autenticação + Design System Básico

---

## 📚 Documentos Atualizados
- ✅ `IMPLEMENTATION_PLAN.md` - Sprints reordenados, dependências corrigidas
- ✅ `DATA_STRUCTURE.md` - Limite diário simplificado, security rules melhoradas, fluxo de transaction corrigido

---

## 🔒 Princípios de Segurança Estabelecidos

1. **Separação Client/Server**: Nunca misturar SDKs
2. **Secrets no Backend**: Nunca expor API keys no frontend
3. **Backend como Fonte de Verdade**: Campos sensíveis só via Admin SDK
4. **Transactions Curtas**: Nunca segurar durante I/O externo
5. **Read-Only Collections**: Histórico/logs nunca editáveis pelo client
6. **Validação Explícita**: Bloquear campos sensíveis explicitamente

---

**Status**: ✅ Correções aplicadas e documentadas  
**Próximo**: 🚀 Sprint 1.5 - Firebase Setup

---

*Documento criado em: 22/01/2026*  
*Última atualização: 22/01/2026*
