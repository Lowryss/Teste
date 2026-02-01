---
description: Enhance Shop, History, and Profile pages with the new Cosmic Design system.
status: in-progress
---

# Cosmic Design Expansion Plan

The goal is to unify the application's aesthetic by applying the newly created `CosmicEffects` components to the remaining main pages.

## 1. Shop Page (`/shop`)
- [ ] Replace standard cards with `GlowCard`.
- [ ] Use `GradientButton` for purchase actions.
- [ ] Add `GradientText` to the main specific headers.
- [ ] Add `FloatingParticles` (optional, or rely on layout).
- [ ] Enhance the "Pix Payment" and "Stripe" modals with glassmorphism styles.

## 2. History Page (`/history`)
- [ ] Wrap reading history items in `GlowCard` (or a list variant).
- [ ] Use `motion` for staggered entry of history items.
- [ ] Add a visual "empty state" with cosmic animations if no history exists.

## 3. Profile Page (`/profile`)
- [ ] Updates Stats section to match Dashboard's `GlowCard` stats.
- [ ] Style the Profile form with glassmorphism inputs.
- [ ] Add slight animations to the avatar/user initals section.

## 4. Components to Reuse
- `CosmicBackground` (already in layout)
- `GlowCard`
- `GradientButton`
- `GradientText`
- `GlowRing`
