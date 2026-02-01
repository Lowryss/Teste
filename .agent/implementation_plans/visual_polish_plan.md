# Implementation Plan: Visual Polish & Audio Fix

## Goal Description
Fix the missing background audio and significantly upgrade the visual quality of Horoscope, Compatibility, Dream Interpreter, and Tarot Cards to match the new "Cosmic Design" standard (Glows, Particles, Gradients).

## User Review Required
> [!NOTE]
> A new Global Audio Player will be added to the Dashboard Layout. It will autoplay (muted by default to respect browser policies) or require user interaction.

## Proposed Changes

### 1. Audio Restoration
#### [NEW] `components/BackgroundAmbience.tsx`
- Plays a loop of ethereal/space sound.
- Floating control (Mute/Unmute) in the bottom right corner.
- Persists across dashboard navigation.

#### [MODIFY] `app/(dashboard)/layout.tsx`
- Include `<BackgroundAmbience />`.

### 2. Visual Upgrades

#### [MODIFY] `app/(dashboard)/tools/horoscope/page.tsx`
- Replace simple text cards with `GlowCard`.
- Add `CosmicBackground`.
- Add zodiac sign icons (Lucide/Heroicons) with glowing borders.

#### [MODIFY] `app/(dashboard)/tools/compatibility/page.tsx`
- Use a "Fusion" animation for blending two signs.
- Result card with percentage rings.

#### [MODIFY] `app/(dashboard)/tools/dream-interpreter/page.tsx`
- "Mist" effect overlay.
- Text inputs with glassmorphism.

#### [NEW] `components/CosmicCard.tsx`
- A specialized Tarot Card component.
- CSS-based Card Back (Sacred Geometry pattern).
- Flip animation.
- Used in all Tarot pages to replace simple divs.

## Verification Plan

### Manual Verification
1. **Audio:** Verify sound plays (may need click) and persists between pages.
2. **Horoscope:** Check if UI looks "premium" and not just text blocks.
3. **Dreams:** Verify the "mist" atmosphere and glass inputs.
4. **Tarot:** Verify new `CosmicCard` in Tarot Daily/Hub. Flipping animation should work smoothly.
