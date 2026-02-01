# Implementation Plan: Tarot Semestral Feature

## Goal Description
Implement a premium "Tarot Semestral" reading feature. Users will be able to draw 6 cards (one for each upcoming month or key life area) to get a comprehensive forecast. This feature will be a paid/premium option.

## User Review Required
> [!IMPORTANT]
> This feature requires defining the exact "spread" logic. I will implement a 6-card spread: 1 Card per Month for the next 6 months.

## Proposed Changes

### Frontend Components
#### [NEW] [TarotSemestralPage](file:///c:/dev/Projeto%20teste/apps/web/app/(dashboard)/tools/tarot-semestral/page.tsx)
- Introduction screen with "Cosmic" visuals.
- 6-Card selection drag-and-drop or click interaction.
- "Reveal" animation.
- Paywall/Premium lock if user doesn't have credits.

### Backend / API
#### [NEW] [TarotSemestralRoute](file:///c:/dev/Projeto%20teste/apps/web/app/api/readings/tarot-semestral/route.ts)
- API to generate the reading using AI (OpenAI/Gemini).
- Prompt engineering to handle 6 distinct monthly predictions in one go.
- Deduction of User Points (higher cost than daily tarot).

### Database
- No schema changes needed, just a new `type: 'tarot-semestral'` in the existing `readings` collection.

## Verification Plan

### Automated Tests
- None existing for UI interactions.

### Manual Verification
1. Navigate to `/dashboard`.
2. Click new "Tarot Semestral" tool card.
3. Verify intro screen renders.
4. Execute a reading (mocked/free for dev).
5. Verify 6 cards are drawn.
6. Verify the AI response generates 6 distinct monthly forecasts.
