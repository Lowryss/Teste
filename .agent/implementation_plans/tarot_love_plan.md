# Implementation Plan: Tarot do Amor

## Goal Description
Implement the "Tarot do Amor" (Love Tarot) feature. This reading uses a 3-card spread (The Querent, The Partner/Potential, The Relationship Future) to provide insights into romantic situations.

## User Review Required
> [!NOTE]
> This feature will cost 15 Cosmic Points per reading.

## Proposed Changes

### Backend / API
#### [NEW] [route.ts](file:///c:/dev/Projeto%20teste/apps/web/app/api/ai/tarot-love/route.ts)
- Validates User Auth and Points (15 pts).
- Draws 3 unique cards from `cards-database.json` (Tarot Major Arcana).
- Uses OpenAI w/ specific prompts for Relationship analysis.
- Saves result to Firestore `users/{uid}/readings`.
- Deducts points.

### Frontend Components
#### [NEW] [page.tsx](file:///c:/dev/Projeto%20teste/apps/web/app/(dashboard)/tools/tarot/love/page.tsx)
- "Rose" themed UI (pinks, reds, soft glows).
- 3-Card selection interaction.
- Result display showing the 3 positions clearly.

#### [MODIFY] [TarotHubPage](file:///c:/dev/Projeto%20teste/apps/web/app/(dashboard)/tools/tarot-hub/page.tsx)
- Remove "Em Breve" badge.
- Enable link.

## Verification Plan

### Automated Tests
- N/A (Manual UI verification preferred for visual features)

### Manual Verification
1. Go to `/tools/tarot-hub`.
2. Click "Tarot do Amor".
3. Verify UI theme (Rose/Pink).
4. Attempt reading with insufficient points (expect error).
5. Attempt reading with sufficient points.
6. Verify 3 cards are drawn and AI interpretation makes sense for the positions.
7. Verify points deduction (-15).
