# 🌟 SPRINT 3: ONBOARDING + PERFIL DO USUÁRIO

**Status**: 🟡 EM ANDAMENTO  
**Duração Estimada**: 2-3 horas  
**Prioridade**: ALTA

---

## 🎯 OBJETIVOS

Implementar o fluxo completo de onboarding com coleta de perfil do usuário para personalização da IA e crédito automático de 10 Pontos Cósmicos.

---

## 📋 TAREFAS

### Parte 1: Schema e Types (20%)

#### 1.1 Atualizar Types TypeScript
**Arquivo**: `packages/shared/src/types.ts`
- [ ] Interface `UserProfile`
- [ ] Interface `User` com campo `profile`
- [ ] Enum `OnboardingStep`

#### 1.2 Criar Constantes de Perfil
**Arquivo**: `packages/shared/src/constants.ts`
- [ ] Opções de gênero
- [ ] Faixas etárias
- [ ] Status de relacionamento
- [ ] Objetivos
- [ ] Preferências de leitura

---

### Parte 2: Cloud Functions (30%)

#### 2.1 Function de Onboarding
**Arquivo**: `apps/functions/src/onboarding.ts`
- [ ] `completeOnboarding(userId, profile)`
- [ ] Validar dados do perfil
- [ ] Salvar perfil no Firestore
- [ ] Creditar 10 pontos iniciais
- [ ] Criar transaction de boas-vindas
- [ ] Marcar `onboardingCompleted = true`

#### 2.2 Trigger de Novo Usuário
**Arquivo**: `apps/functions/src/auth.ts`
- [ ] Trigger `onCreate` do Firebase Auth
- [ ] Criar documento do usuário no Firestore
- [ ] Inicializar campos padrão
- [ ] `onboardingCompleted = false`

---

### Parte 3: Formulário de Perfil (30%)

#### 3.1 Componente de Formulário
**Arquivo**: `apps/web/app/onboarding/profile/page.tsx`
- [ ] Form multi-step (opcional)
- [ ] Campos:
  - Nome (já preenchido do Auth)
  - Gênero (select)
  - Faixa etária (select)
  - Status de relacionamento (select)
  - Objetivo principal (select)
  - Contexto do momento (textarea)
  - Preferências de leitura (checkboxes)
- [ ] Validação client-side
- [ ] Loading states
- [ ] Botão "Continuar"

#### 3.2 Estilos do Formulário
**Arquivo**: `apps/web/app/onboarding/profile/profile.css`
- [ ] Layout responsivo
- [ ] Animações de transição
- [ ] Feedback visual

---

### Parte 4: Fluxo de Onboarding (20%)

#### 4.1 Página de Welcome
**Arquivo**: `apps/web/app/onboarding/welcome/page.tsx`
- [ ] Mensagem de boas-vindas
- [ ] Explicação do que vem a seguir
- [ ] Botão "Começar"
- [ ] Animações de entrada

#### 4.2 Página de Sucesso
**Arquivo**: `apps/web/app/onboarding/success/page.tsx`
- [ ] Mensagem de parabéns
- [ ] Mostrar 10 pontos creditados
- [ ] Animação de confete/estrelas
- [ ] Botão "Ir para Dashboard"
- [ ] Auto-redirect após 3 segundos

#### 4.3 Lógica de Redirecionamento
**Arquivo**: `apps/web/components/OnboardingGuard.tsx`
- [ ] Verificar se usuário completou onboarding
- [ ] Redirecionar para `/onboarding/welcome` se não
- [ ] Permitir acesso ao dashboard se sim

---

## 🗂️ ESTRUTURA DE ARQUIVOS

```
packages/shared/src/
├── types.ts                    # Interfaces User, UserProfile
└── constants.ts                # Opções de perfil

apps/functions/src/
├── onboarding.ts              # Cloud Function de onboarding
├── auth.ts                    # Trigger de novo usuário
└── index.ts                   # Exports

apps/web/app/
├── onboarding/
│   ├── welcome/
│   │   └── page.tsx          # Tela de boas-vindas
│   ├── profile/
│   │   ├── page.tsx          # Formulário de perfil
│   │   └── profile.css       # Estilos
│   └── success/
│       └── page.tsx          # Tela de sucesso
└── dashboard/
    └── page.tsx              # Atualizar para mostrar pontos

apps/web/components/
└── OnboardingGuard.tsx        # Guard de onboarding
```

---

## 📊 DADOS DO PERFIL (MVP)

### Campos Obrigatórios
1. **Gênero**: Masculino, Feminino, Não-binário, Prefiro não dizer
2. **Faixa Etária**: 18-24, 25-34, 35-44, 45-54, 55+
3. **Status de Relacionamento**: Solteiro(a), Relacionamento, Casado(a), Divorciado(a), Viúvo(a)
4. **Objetivo Principal**: Autoconhecimento, Amor, Carreira, Saúde, Espiritualidade

### Campos Opcionais
5. **Contexto do Momento**: Texto livre (max 500 caracteres)
6. **Preferências de Leitura**: Direto, Detalhado, Poético, Prático

---

## 🔄 FLUXO COMPLETO

```
1. Usuário cria conta (email ou Google)
   ↓
2. Auth Trigger cria documento no Firestore
   - onboardingCompleted: false
   - cosmicPoints: 0
   ↓
3. OnboardingGuard redireciona para /onboarding/welcome
   ↓
4. Usuário clica "Começar"
   ↓
5. Redireciona para /onboarding/profile
   ↓
6. Usuário preenche formulário
   ↓
7. Clica "Continuar"
   ↓
8. Cloud Function completeOnboarding():
   - Salva profile no Firestore
   - Credita 10 pontos
   - Marca onboardingCompleted = true
   - Cria transaction de boas-vindas
   ↓
9. Redireciona para /onboarding/success
   ↓
10. Mostra "Parabéns! +10 Pontos Cósmicos"
   ↓
11. Auto-redirect para /dashboard (3s)
   ↓
12. Dashboard mostra 10 pontos no badge
```

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### Schema
- [ ] Types TypeScript criados
- [ ] Constantes de perfil definidas
- [ ] Interfaces exportadas

### Cloud Functions
- [ ] Trigger de novo usuário funcional
- [ ] Function de onboarding funcional
- [ ] 10 pontos creditados automaticamente
- [ ] Transaction registrada
- [ ] Erros tratados

### Formulário
- [ ] Todos os campos renderizados
- [ ] Validação client-side
- [ ] Loading states
- [ ] Feedback de erros
- [ ] Responsivo mobile

### Fluxo
- [ ] Welcome page funcional
- [ ] Profile page funcional
- [ ] Success page funcional
- [ ] OnboardingGuard funcional
- [ ] Redirecionamentos corretos
- [ ] Pontos aparecem no Header

### Qualidade
- [ ] Sem erros no console
- [ ] TypeScript strict
- [ ] Animações suaves
- [ ] Mobile-first
- [ ] Acessibilidade

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO

1. **Types e Constantes** (15 min)
2. **Cloud Functions** (45 min)
3. **Formulário de Perfil** (30 min)
4. **Welcome e Success** (20 min)
5. **OnboardingGuard** (15 min)
6. **Integração e Testes** (20 min)

**Total**: ~2h 30min

---

## 📝 NOTAS IMPORTANTES

### Personalização da IA
- Todos os campos do perfil serão usados nos prompts
- `profileVersion` rastreia mudanças
- Snapshot do perfil salvo em cada `toolUsage`

### Pontos Iniciais
- Creditados UMA VEZ por usuário
- Campo `initialPointsGranted` previne duplicação
- Transaction type: `'initial_grant'`

### Progressive Profiling
- MVP: Coletar tudo no onboarding
- Futuro: Permitir edição do perfil
- Futuro: Coletar mais dados ao longo do tempo

---

*Criado em: 23/01/2026 04:08*  
*Sprint anterior: Sprint 2 (100% completa)*
