# 🌟 GUIA DO CORAÇÃO - RELATÓRIO DO PROJETO

**Versão**: 1.0 (MVP Completo)
**Tecnologias**: Next.js, Firebase, Stripe, Gemini AI.

---

## ✅ FUNCIONALIDADES ENTREGUES

### 1. Autenticação & Onboarding
- Login/Registro com Email.
- Fluxo de Onboarding para coletar: Data de Nascimento, Hora, Local, Contexto de Vida e Objetivo.
- Dados salvos no Firestore em `users/{uid}`.

### 2. Ferramentas Místicas (AI Powered)
Todas as ferramentas consomem "Pontos Cósmicos" e usam o Google Gemini para gerar conteúdo personalizado.

| Ferramenta | Rota | Custo | Descrição |
| :--- | :--- | :--- | :--- |
| **Horóscopo** | `/tools/horoscope` | 1 Ponto | Previsão diária baseada no Signo e Perfil. |
| **Tarot** | `/tools/tarot` | 5 Pontos | Sorteio de carta com visual realista e interpretação profunda. |
| **Numerologia** | `/tools/numerology` | 10 Pontos | Cálculo de Alma/Personalidade/Destino e relatório completo. |

### 3. Economia & Monetização
- Sistema de Saldo (Cosmic Points).
- Loja (`/shop`) integrada com **Stripe Checkout**.
- Webhook para crédito automático de pontos após pagamento.

### 4. Interface (UI/UX)
- Design System "Glassmorphism" (Efeito de vidro, gradientes, dourado).
- Responsivo (Mobile First).
- Animações suaves (Framer Motion / CSS Transitions).

---

## 🛠️ ARQUITETURA TÉCNICA

### Backend (Next.js API Routes)
Migramos das Cloud Functions tradicionais para API Routes do Next.js para simplificar o deploy e manter tudo no mesmo repositório.

- `/api/onboarding/complete`: Salva perfil inicial.
- `/api/ai/*`: Rotas protegidas que chamam a IA.
- `/api/checkout`: Cria sessão do Stripe.
- `/api/webhooks/stripe`: Ouve eventos de pagamento.

### Dados (Firestore)
Estrutura do documento `users/{uid}`:
```json
{
  "email": "user@example.com",
  "cosmicPoints": 50,
  "onboardingCompleted": true,
  "profile": { ... },
  "createdAt": "Timestamp"
}
```

---

## 🚀 COMO RODAR E DEPLOYAR

### Desenvolvimento Local
1.  **Instalar dependências**: `npm install` (na raiz e em `apps/web`).
2.  **Rodar**: `npm run dev` (em `apps/web` ou raiz).
3.  Acesse `http://localhost:3001`.

### Stripe (Pagamentos Locais)
Para testar o recebimento de pontos localmente:
```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

### Deploy para Produção
O projeto está configurado para Firebase Hosting com suporte a Web Frameworks.
```bash
firebase deploy
```
Isso fará o build do Next.js e subirá tanto o estático quanto as funções serverless.

---

**Status Final**: O projeto está pronto para voar! 🦅✨
