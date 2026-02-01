# Arquitetura do Sistema - Guia do Coração

> Documentação técnica da plataforma de horóscopo e tarot com IA.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TailwindCSS v4
- **Language**: TypeScript (Strict Mode)
- **State**: React Context (Auth, Toast)
- **Backend**: Next.js API Routes (Serverless) + Firebase Admin SDK
- **Database**: Firestore (NoSQL)
- **Auth**: Firebase Authentication (Email/Password, Google)
- **AI**: Gemini Pro (via `@google/generative-ai`)
- **Payments**: Stripe (Checkout + Webhooks)

---

## 📂 Estrutura de Diretórios

```plaintext
apps/web/
├── app/
│   ├── (auth)/                 # Rotas de Autenticação (login, register)
│   ├── (dashboard)/            # Área logada (ferramentas, loja)
│   ├── (marketing)/            # Landing page pública
│   ├── api/                    # Backend Endpoints
│   │   ├── ai/                 # Rotas de Geração (horoscope, tarot, etc)
│   │   ├── payments/           # Integração Stripe
│   │   └── webhooks/           # Listeners (Stripe)
│   └── layout.tsx              # Root Layout (Providers)
├── components/
│   ├── ui/                     # Design System (Button, Card, Modal)
│   └── features/               # Componentes de negócio (PointsDisplay)
├── lib/
│   ├── ai/                     # Abstração de LLM (Provider + Prompts)
│   ├── payments/               # Configuração Stripe
│   └── firebase.ts             # Cliente Firebase
└── contexts/                   # Global State (AuthContext, ToastContext)
```

---

## 🧠 Modelagem de Dados (Firestore)

### `users/{userId}`
- `uid`: string
- `email`: string
- `displayName`: string
- `cosmicPoints`: number (Saldo)
- `totalPointsPurchased`: number
- `onboardingCompleted`: boolean
- `metadata`: { lastLogin, createdAt }

### `readings/{readingId}`
- `userId`: string
- `tool`: 'horoscope' | 'tarot' | 'numerology' | ...
- `content`: string (Markdown/AI response)
- `context`: string (User input)
- `createdAt`: Timestamp

### `transactions/{txId}`
- `userId`: string
- `type`: 'credit' | 'debit'
- `amount`: number
- `tool`: string (se debit)
- `source`: 'stripe' (se credit)
- `status`: 'completed' | 'failed'

---

## 🔮 Ferramentas de IA Implementadas

| Ferramenta | Endpoint | Custo | Prompt Template |
|------------|----------|-------|-----------------|
| **Horóscopo** | `/api/ai/horoscope` | 1 pt | `prompts/horoscope.ts` |
| **Conselhos** | `/api/ai/advice` | 3 pts | `prompts/advice.ts` |
| **Tarot** | `/api/ai/tarot` | 5 pts | `prompts/tarot.ts` |
| **Alma Gêmea** | `/api/ai/soulmate` | 8 pts | `prompts/soulmate.ts` |
| **Sonhos** | `/api/ai/dreams` | 10 pts | `prompts/dreams.ts` |
| **Mapa Astral** | `/api/ai/astrology` | 15 pts | `prompts/astrology.ts` |
| **Numerologia** | `/api/ai/numerology` | 20 pts | `prompts/numerology.ts` |

---

## 💸 Fluxo de Pagamento

1. Usuário seleciona pacote em `/shop`
2. `POST /api/payments/stripe/checkout` cria sessão
3. Redirect para Stripe Hosted Checkout
4. Sucesso -> Redirect para `/dashboard`
5. Webhook `checkout.session.completed` -> Adiciona pontos no Firestore (Server-side trust)

---

## 🛡️ Segurança

- **API Routes**: Validação de `userId` e saldo (Atomic Transactions)
- **Frontend**: `OnboardingGuard` protege rotas privadas
- **Env Vars**: Chaves sensíveis (Stripe Secret, Firebase Service Account) apenas no Server-side.
