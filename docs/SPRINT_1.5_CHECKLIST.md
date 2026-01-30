# 🚀 Sprint 1.5: Firebase Setup - Checklist Completo

**Objetivo**: Configurar toda a infraestrutura Firebase antes de começar o desenvolvimento.

**Duração Estimada**: 2-3 horas

---

## ✅ PRÉ-REQUISITOS

Antes de começar, você precisa ter:

- [ ] Conta Google (para Firebase e Gemini)
- [ ] Conta Stripe (pode criar durante o processo)
- [ ] Node.js instalado (já tem ✅)
- [ ] Git configurado (já tem ✅)
- [ ] Editor de código (VS Code recomendado)

---

## 📋 CHECKLIST PASSO A PASSO

### **Parte 1: Criar Projeto Firebase** (15 min)

- [ ] **1.1** Acessar [Firebase Console](https://console.firebase.google.com)
- [ ] **1.2** Clicar em "Adicionar projeto" / "Add project"
- [ ] **1.3** Nome do projeto: `guia-do-coracao` (ou similar)
- [ ] **1.4** Desabilitar Google Analytics (não precisa no MVP)
- [ ] **1.5** Aguardar criação do projeto
- [ ] **1.6** Anotar o **Project ID** (vai precisar depois)

---

### **Parte 2: Configurar Firebase Authentication** (10 min)

- [ ] **2.1** No menu lateral, clicar em "Authentication"
- [ ] **2.2** Clicar em "Get started" / "Começar"
- [ ] **2.3** Ativar método: **Email/Password**
  - [ ] Habilitar "Email/Password"
  - [ ] NÃO habilitar "Email link" (sem senha)
- [ ] **2.4** Ativar método: **Google**
  - [ ] Clicar em "Google"
  - [ ] Habilitar
  - [ ] Nome público do projeto: "Guia do Coração"
  - [ ] Email de suporte: seu email
  - [ ] Salvar
- [ ] **2.5** Pronto! Authentication configurado ✅

---

### **Parte 3: Configurar Firestore Database** (10 min)

- [ ] **3.1** No menu lateral, clicar em "Firestore Database"
- [ ] **3.2** Clicar em "Create database"
- [ ] **3.3** Modo de segurança: **Production mode** (rules estritas)
- [ ] **3.4** Localização: **southamerica-east1** (São Paulo, Brasil)
- [ ] **3.5** Aguardar criação do banco
- [ ] **3.6** Clicar na aba "Rules"
- [ ] **3.7** Copiar as Security Rules de `docs/DATA_STRUCTURE.md`
- [ ] **3.8** Colar e clicar em "Publish"
- [ ] **3.9** Pronto! Firestore configurado ✅

---

### **Parte 4: Obter Credenciais Firebase** (10 min)

- [ ] **4.1** No menu lateral, clicar no ícone de engrenagem ⚙️ → "Project settings"
- [ ] **4.2** Rolar até "Your apps" / "Seus apps"
- [ ] **4.3** Clicar no ícone `</>` (Web)
- [ ] **4.4** Nome do app: "Guia do Coração Web"
- [ ] **4.5** NÃO marcar "Firebase Hosting"
- [ ] **4.6** Clicar em "Register app"
- [ ] **4.7** Copiar o objeto `firebaseConfig`:
  ```javascript
  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  };
  ```
- [ ] **4.8** Salvar essas credenciais (vai usar no passo 7)
- [ ] **4.9** Clicar em "Continue to console"

---

### **Parte 5: Configurar Firebase Functions** (15 min)

- [ ] **5.1** Instalar Firebase CLI globalmente:
  ```bash
  npm install -g firebase-tools
  ```
- [ ] **5.2** Fazer login no Firebase:
  ```bash
  firebase login
  ```
- [ ] **5.3** Navegar para a pasta do projeto:
  ```bash
  cd "c:\dev\Projeto teste"
  ```
- [ ] **5.4** Inicializar Firebase:
  ```bash
  firebase init
  ```
- [ ] **5.5** Selecionar (usar espaço para marcar):
  - [ ] `Functions: Configure a Cloud Functions directory`
  - [ ] `Firestore: Configure security rules`
- [ ] **5.6** Use an existing project: selecionar o projeto criado
- [ ] **5.7** Firestore rules file: `firestore.rules` (padrão)
- [ ] **5.8** Firestore indexes file: `firestore.indexes.json` (padrão)
- [ ] **5.9** Language: **TypeScript**
- [ ] **5.10** ESLint: **Yes**
- [ ] **5.11** Install dependencies: **Yes**
- [ ] **5.12** Aguardar instalação
- [ ] **5.13** Mover conteúdo de `functions/` para `apps/functions/`:
  ```bash
  # PowerShell
  Move-Item -Path functions/* -Destination apps/functions/ -Force
  Remove-Item -Path functions -Recurse
  ```
- [ ] **5.14** Atualizar `firebase.json`:
  ```json
  {
    "functions": {
      "source": "apps/functions"
    },
    "firestore": {
      "rules": "firestore.rules",
      "indexes": "firestore.indexes.json"
    }
  }
  ```

---

### **Parte 6: Obter API Key do Gemini** (10 min)

- [ ] **6.1** Acessar [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] **6.2** Fazer login com a mesma conta Google
- [ ] **6.3** Clicar em "Get API Key" / "Obter chave de API"
- [ ] **6.4** Clicar em "Create API key in new project"
- [ ] **6.5** Copiar a API key gerada
- [ ] **6.6** Salvar em local seguro (vai usar no passo 7)
- [ ] **6.7** Pronto! Gemini configurado ✅

---

### **Parte 7: Criar Arquivos de Variáveis de Ambiente** (10 min)

#### **Frontend: `apps/web/.env.local`**

- [ ] **7.1** Criar arquivo `apps/web/.env.local`
- [ ] **7.2** Colar o conteúdo (substituir valores):
  ```env
  # Firebase Client Config
  NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
  NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

  # Stripe Publishable Key (vai obter no passo 8)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

  # App Config
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

#### **Backend: `apps/functions/.env`**

- [ ] **7.3** Criar arquivo `apps/functions/.env`
- [ ] **7.4** Colar o conteúdo:
  ```env
  # Gemini API Key
  GOOGLE_GEMINI_API_KEY=sua_gemini_api_key_aqui

  # Stripe Server Keys (vai obter no passo 8)
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

---

### **Parte 8: Criar Conta Stripe (Modo Teste)** (15 min)

- [ ] **8.1** Acessar [Stripe](https://stripe.com)
- [ ] **8.2** Clicar em "Sign up" / "Criar conta"
- [ ] **8.3** Preencher dados:
  - Email
  - Nome completo
  - País: Brasil
  - Senha
- [ ] **8.4** Verificar email
- [ ] **8.5** Fazer login no [Dashboard](https://dashboard.stripe.com)
- [ ] **8.6** **IMPORTANTE**: Ativar "Test mode" (toggle no canto superior direito)
- [ ] **8.7** Obter Publishable Key:
  - [ ] Clicar em "Developers" → "API keys"
  - [ ] Copiar "Publishable key" (começa com `pk_test_`)
  - [ ] Colar em `apps/web/.env.local` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] **8.8** Obter Secret Key:
  - [ ] Copiar "Secret key" (começa com `sk_test_`)
  - [ ] Colar em `apps/functions/.env` → `STRIPE_SECRET_KEY`
- [ ] **8.9** Webhook Secret (fazer depois, quando criar webhook)
- [ ] **8.10** Pronto! Stripe configurado ✅

---

### **Parte 9: Configurar Firebase no Next.js** (10 min)

- [ ] **9.1** Criar arquivo `apps/web/lib/firebase.ts`:
  ```typescript
  import { initializeApp, getApps } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Initialize Firebase (singleton)
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export default app;
  ```
- [ ] **9.2** Salvar arquivo

---

### **Parte 10: Testar Conexão** (10 min)

- [ ] **10.1** Parar o servidor Next.js (Ctrl+C no terminal)
- [ ] **10.2** Reiniciar o servidor:
  ```bash
  cd apps/web
  npm run dev
  ```
- [ ] **10.3** Verificar se não há erros de variáveis de ambiente
- [ ] **10.4** Abrir [http://localhost:3000](http://localhost:3000)
- [ ] **10.5** Abrir DevTools (F12) → Console
- [ ] **10.6** Não deve ter erros do Firebase
- [ ] **10.7** Pronto! Tudo conectado ✅

---

### **Parte 11: Commitar Configurações** (5 min)

- [ ] **11.1** Adicionar `.env.local` e `.env` ao `.gitignore`:
  ```bash
  echo .env.local >> .gitignore
  echo .env >> .gitignore
  ```
- [ ] **11.2** Commitar arquivos de configuração:
  ```bash
  git add .
  git commit -m "chore: configure Firebase and Stripe for MVP"
  ```
- [ ] **11.3** Push (se tiver remote):
  ```bash
  git push
  ```

---

## ✅ CHECKLIST FINAL

Após completar todos os passos, você deve ter:

- [x] ✅ Projeto Firebase criado
- [x] ✅ Authentication configurado (Email/Password + Google)
- [x] ✅ Firestore Database criado com Security Rules
- [x] ✅ Firebase Functions configurado em `apps/functions`
- [x] ✅ API Key do Gemini obtida
- [x] ✅ Conta Stripe criada (modo teste)
- [x] ✅ Variáveis de ambiente configuradas
- [x] ✅ Firebase conectado ao Next.js
- [x] ✅ Tudo testado e funcionando

---

## 🎯 PRÓXIMO PASSO

**Sprint 2: Autenticação + Design System Básico**

Agora você está pronto para começar o desenvolvimento! 🚀

---

## 🆘 TROUBLESHOOTING

### Erro: "Firebase config missing"
- Verificar se `.env.local` está na pasta `apps/web`
- Verificar se todas as variáveis começam com `NEXT_PUBLIC_`
- Reiniciar o servidor Next.js

### Erro: "Firebase Admin SDK"
- Não precisa configurar Service Account no MVP
- Firebase Functions usa Application Default Credentials automaticamente

### Erro: "Stripe keys not found"
- Verificar se está em **Test mode** no Stripe
- Copiar as keys corretas (test, não live)

---

**Tempo Total Estimado**: 2-3 horas

**Dificuldade**: ⭐⭐ (Fácil/Médio)

Boa sorte! 🍀
