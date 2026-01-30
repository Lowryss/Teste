# 🚀 SPRINT 2: Autenticação + Design System Básico

**Status**: 🟡 PRONTO PARA INICIAR  
**Duração Estimada**: 2-3 dias  
**Prioridade**: ALTA

---

## 🎯 OBJETIVOS DA SPRINT

Criar a base visual e o sistema de autenticação do **Guia do Coração**, seguindo os princípios de **mobile-first** e **design premium**.

---

## 📋 TAREFAS

### Parte 1: Design System Básico (Dia 1)

#### 1.1 Criar `apps/web/styles/design-system.css`
**Conteúdo**:
- **Tokens de Cor**:
  - Paleta principal (roxo/violeta místico)
  - Cores de suporte (dourado, azul noturno)
  - Estados (success, error, warning, info)
  - Modo escuro (padrão)
- **Tipografia**:
  - Google Fonts (Inter para UI, Playfair Display para títulos)
  - Escalas responsivas
  - Line heights e letter spacing
- **Espaçamento**:
  - Sistema de 4px base
  - Escalas (xs, sm, md, lg, xl, 2xl, etc.)
- **Bordas e Sombras**:
  - Border radius
  - Box shadows (glassmorphism)
- **Breakpoints**:
  - Mobile: 320px-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px+

#### 1.2 Criar Componentes Base
**Localização**: `apps/web/components/ui/`

**Componentes**:
1. **Button.tsx**
   - Variantes: primary, secondary, outline, ghost
   - Tamanhos: sm, md, lg
   - Estados: default, hover, active, disabled, loading
   - Acessibilidade: ARIA labels, keyboard navigation

2. **Input.tsx**
   - Tipos: text, email, password
   - Estados: default, focus, error, disabled
   - Ícones opcionais
   - Validação visual

3. **Card.tsx**
   - Glassmorphism effect
   - Variantes: default, elevated, outlined
   - Padding responsivo

4. **Logo.tsx**
   - SVG ou imagem gerada
   - Versões: full, icon-only
   - Responsivo

#### 1.3 Criar Layout Base
**Arquivo**: `apps/web/app/layout.tsx`

**Estrutura**:
```tsx
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    {/* Fonts */}
  </head>
  <body>
    <Header />
    {children}
    <Footer />
  </body>
</html>
```

---

### Parte 2: Autenticação (Dia 2)

#### 2.1 Criar Context de Autenticação
**Arquivo**: `apps/web/contexts/AuthContext.tsx`

**Funcionalidades**:
- `useAuth()` hook
- Estado do usuário
- Funções: `signIn()`, `signUp()`, `signOut()`, `resetPassword()`
- Loading states
- Error handling

#### 2.2 Criar Telas de Autenticação

**2.2.1 Login** (`apps/web/app/login/page.tsx`)
- Form com email + senha
- Botão "Entrar com Google"
- Link "Esqueci minha senha"
- Link "Criar conta"
- Validação client-side
- Feedback de erros

**2.2.2 Registro** (`apps/web/app/register/page.tsx`)
- Form com nome, email, senha, confirmar senha
- Termos de uso (checkbox)
- Botão "Criar conta"
- Botão "Entrar com Google"
- Link "Já tenho conta"
- Validação de senha forte

**2.2.3 Recuperação de Senha** (`apps/web/app/forgot-password/page.tsx`)
- Form com email
- Botão "Enviar link de recuperação"
- Mensagem de sucesso
- Link "Voltar para login"

#### 2.3 Integração com Firebase Auth
**Arquivo**: `apps/web/lib/auth.ts`

**Funções**:
```typescript
- signInWithEmail(email, password)
- signUpWithEmail(email, password, name)
- signInWithGoogle()
- signOut()
- sendPasswordResetEmail(email)
- onAuthStateChanged(callback)
```

#### 2.4 Proteção de Rotas
**Arquivo**: `apps/web/components/ProtectedRoute.tsx`

**Funcionalidade**:
- Verificar se usuário está autenticado
- Redirecionar para `/login` se não estiver
- Loading state durante verificação

---

### Parte 3: Navegação e Layout (Dia 3)

#### 3.1 Header/Navbar
**Arquivo**: `apps/web/components/Header.tsx`

**Conteúdo**:
- Logo (link para home)
- Menu de navegação (desktop)
- Botão de menu (mobile)
- Avatar do usuário (se logado)
- Saldo de Pontos Cósmicos (se logado)
- Botão "Entrar" (se não logado)

#### 3.2 Footer
**Arquivo**: `apps/web/components/Footer.tsx`

**Conteúdo**:
- Links: Sobre, Termos, Privacidade, Contato
- Redes sociais
- Copyright

#### 3.3 Mobile Menu
**Arquivo**: `apps/web/components/MobileMenu.tsx`

**Funcionalidade**:
- Slide-in menu
- Animação suave
- Overlay com backdrop
- Navegação completa
- Fechar ao clicar fora

---

## 🎨 DIRETRIZES DE DESIGN

### Paleta de Cores (Sugestão)
```css
--primary: hsl(270, 60%, 50%);        /* Roxo místico */
--primary-light: hsl(270, 60%, 70%);
--primary-dark: hsl(270, 60%, 30%);

--secondary: hsl(45, 80%, 60%);       /* Dourado */
--accent: hsl(220, 40%, 20%);         /* Azul noturno */

--background: hsl(240, 20%, 10%);     /* Quase preto */
--surface: hsl(240, 15%, 15%);        /* Card background */
--surface-elevated: hsl(240, 15%, 20%);

--text-primary: hsl(0, 0%, 95%);
--text-secondary: hsl(0, 0%, 70%);
--text-muted: hsl(0, 0%, 50%);
```

### Tipografia
```css
--font-display: 'Playfair Display', serif;  /* Títulos */
--font-body: 'Inter', sans-serif;           /* Corpo */

--text-xs: clamp(0.75rem, 2vw, 0.875rem);
--text-sm: clamp(0.875rem, 2.5vw, 1rem);
--text-base: clamp(1rem, 3vw, 1.125rem);
--text-lg: clamp(1.125rem, 3.5vw, 1.25rem);
--text-xl: clamp(1.25rem, 4vw, 1.5rem);
--text-2xl: clamp(1.5rem, 5vw, 2rem);
--text-3xl: clamp(2rem, 6vw, 3rem);
```

### Espaçamento
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
```

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

---

## 📱 MOBILE-FIRST CHECKLIST

- [ ] Todos os componentes testados em 320px (iPhone SE)
- [ ] Touch targets mínimo de 44x44px
- [ ] Tipografia responsiva (clamp)
- [ ] Navegação otimizada para polegar
- [ ] Formulários com teclado mobile-friendly
- [ ] Loading states visíveis
- [ ] Feedback tátil (animações)
- [ ] Performance otimizada (lazy loading)

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### Design System
- [ ] `design-system.css` criado com todos os tokens
- [ ] Componentes Button, Input, Card funcionando
- [ ] Tipografia responsiva implementada
- [ ] Paleta de cores aplicada
- [ ] Modo escuro como padrão

### Autenticação
- [ ] Login com email/senha funcional
- [ ] Login com Google funcional
- [ ] Registro de novo usuário funcional
- [ ] Recuperação de senha funcional
- [ ] Validação de formulários implementada
- [ ] Feedback de erros claro
- [ ] Proteção de rotas implementada

### Layout
- [ ] Header responsivo
- [ ] Footer responsivo
- [ ] Mobile menu funcional
- [ ] Navegação fluida
- [ ] Logo implementado

### Qualidade
- [ ] Sem erros no console
- [ ] Performance aceitável (Lighthouse > 80)
- [ ] Acessibilidade básica (ARIA labels)
- [ ] Testado em mobile (320px-767px)
- [ ] Testado em desktop (1024px+)

---

## 🚀 COMO COMEÇAR

1. **Criar branch**:
   ```bash
   git checkout -b sprint-2-auth-design
   ```

2. **Instalar fontes** (se necessário):
   ```bash
   # Adicionar no layout.tsx ou via CDN
   ```

3. **Criar estrutura de pastas**:
   ```
   apps/web/
   ├── components/
   │   ├── ui/
   │   │   ├── Button.tsx
   │   │   ├── Input.tsx
   │   │   └── Card.tsx
   │   ├── Header.tsx
   │   ├── Footer.tsx
   │   └── MobileMenu.tsx
   ├── contexts/
   │   └── AuthContext.tsx
   ├── lib/
   │   └── auth.ts
   └── styles/
       └── design-system.css
   ```

4. **Começar pelo Design System**:
   - Criar `design-system.css` primeiro
   - Depois componentes base
   - Por último, telas de autenticação

---

## 📚 RECURSOS

### Inspiração de Design
- Dribbble: "mystical app dark mode"
- Behance: "astrology app ui"
- Awwwards: "spiritual wellness"

### Bibliotecas Úteis (Opcional)
- `framer-motion` - Animações
- `react-hook-form` - Formulários
- `zod` - Validação de schemas

### Documentação
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Next.js App Router](https://nextjs.org/docs/app)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

*Criado em: 23/01/2026*  
*Sprint anterior: Sprint 1.5 (100% completa)*
