# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Guia do Coração** is a Brazilian esoteric AI web platform at [guiadocoracao.online](https://guiadocoracao.online). Users spend "Pontos Cósmicos" (Cosmic Points) to access AI-powered tools: horoscope, tarot, numerology, dream interpretation, astral maps, etc. Points are purchased via Stripe (BRL) or EfíBank (PIX).

## Commands

All web commands run from `apps/web/`:

```bash
# Development
npm run dev          # Start Next.js dev server (port 3000 or 3001)

# Or from repo root:
npm run dev          # Delegates to apps/web

# Build & Lint
npm run build
npm run lint         # ESLint via eslint.config.mjs

# Firebase emulators (from repo root, requires Java JDK 11+)
npm run emulators    # Starts Firestore :8080, Functions :5001, Auth :9099

# Firebase Functions (from apps/functions/)
npm run build        # tsc compile → lib/
npm run deploy       # firebase deploy --only functions
npm run serve        # build + emulators start (functions only)
```

## Architecture

### Monorepo Structure

```
apps/web/            # Next.js 16 App Router — frontend + API routes
apps/functions/      # Firebase Cloud Functions (TypeScript → lib/)
packages/shared/     # Shared types, constants, tool catalog
```

### Next.js Route Groups (`apps/web/app/`)

- `(auth)/` — login, register, forgot-password (unauthenticated)
- `(marketing)/` — public landing page
- `(dashboard)/` — all protected pages: tools, shop, history, profile
- `onboarding/` — welcome → profile → success flow
- `api/` — all backend logic runs here as Next.js API routes (serverless)

### Backend API Routes (`apps/web/app/api/`)

All point-sensitive operations run server-side using the Firebase Admin SDK:

| Path | Purpose |
|------|---------|
| `api/ai/*` | AI tool endpoints (each deducts points atomically) |
| `api/readings/*` | Complex reading endpoints (tarot-semanal, astral-map, etc.) |
| `api/checkout/` | Stripe Checkout session creation |
| `api/webhooks/stripe/` | Stripe webhook → credits points on `checkout.session.completed` |
| `api/webhooks/efi/` | EfíBank PIX webhook |
| `api/points/credit|debit|refund` | Direct point mutation endpoints |
| `api/onboarding/complete/` | Marks onboarding done + grants 10 initial points |

### AI Layer (`apps/web/lib/ai/`)

- `provider.ts` — `generateAIResponse()` abstraction supporting `'gemini' | 'openai' | 'claude'`. Currently only Gemini is implemented (`gemini-2.0-flash-lite`).
- `prompts/` — one file per tool with typed prompt builders (e.g., `horoscope.ts` exports `getHoroscopePrompt(sign, context)`).

### Points System

Points (`cosmicPoints`) live in Firestore `users/{uid}`. **All mutations use Firestore atomic transactions via the Admin SDK** — the client cannot write `cosmicPoints` directly (enforced by `firestore.rules`). The pattern every AI route follows:

1. Validate input
2. Check rate limit (deterministic `readingId` like `{userId}_{tool}_{date}`)
3. Verify balance
4. Generate AI response
5. `runTransaction`: re-check balance → deduct → save reading → log transaction

### Authentication (`contexts/AuthContext.tsx`)

`AuthContext` merges Firebase Auth's `User` object with real-time Firestore data via `onSnapshot`. The merged `UserProfile` re-attaches Firebase prototype methods (`getIdToken`, `reload`, etc.) manually — this is intentional to avoid losing them during object spread.

`ProtectedRoute` handles redirect to `/login`; `OnboardingGuard` enforces the onboarding flow before dashboard access.

### Firebase Setup

- **Client SDK**: `lib/firebase.ts` — exports `auth` and `db` for client-side use
- **Admin SDK**: `lib/firebase-admin.ts` — exports `adminDb` and `auth`. Initialized from `FIREBASE_SERVICE_ACCOUNT_KEY` env var (JSON string); falls back to `applicationDefault()`

### Shared Package (`packages/shared/src/`)

- `types.ts` — `UserProfile`, `User`, `OnboardingStep`
- `constants.ts` — `INITIAL_COSMIC_POINTS = 10`, `PROFILE_OPTIONS` (gender, ageRange, etc.)
- `catalog.ts` — tool definitions

## Design System

Theme: **Cosmic Mystique** — dark background with magenta, teal, and gold accents.

**No purple/violet** — this is an explicit design constraint. Use magenta (`--color-magenta-*`), teal (`--color-teal-*`), and gold (`--color-gold-*`) instead.

Tokens live in `styles/design-tokens.css`; component styles in `styles/design-system.css`. Typography: `Playfair Display` (display/headings) + `Inter` (body).

## Key Environment Variables

Server-side only (never expose to client):
- `FIREBASE_SERVICE_ACCOUNT_KEY` — JSON string of Firebase service account
- `GEMINI_API_KEY` — Google Gemini API key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `EFI_CLIENT_ID` / `EFI_CLIENT_SECRET` / `EFI_CERTIFICATE` — EfíBank PIX credentials

Client-side (`NEXT_PUBLIC_*`):
- `NEXT_PUBLIC_FIREBASE_*` — Firebase config (apiKey, authDomain, projectId, etc.)
- `NEXT_PUBLIC_APP_URL` — Base URL for Stripe redirect

## Firestore Collections

| Collection | Write access |
|-----------|-------------|
| `users/{uid}` | Client can write own doc except `stripeCustomerId` and `subscription`; `cosmicPoints` must be modified via Admin SDK |
| `readings/{readingId}` | Server only |
| `transactions/{txId}` | Server only |

Reading IDs are deterministic: `{userId}_{tool}_{sign}_{YYYY-MM-DD}` — used for idempotency and daily rate limiting.

## Firebase Functions (`apps/functions/src/`)

- `auth.ts` — `onUserCreated` trigger: creates Firestore user document on Firebase Auth registration
- `onboarding.ts` — callable function for completing onboarding

Functions compile to `lib/` via `tsc`. Deploy with `firebase deploy --only functions` from repo root.
