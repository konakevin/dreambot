# Nightly Dream Engine — Architecture & Expansion Guide

## Overview

The nightly dream engine generates one personalized dream per user per night. It runs through three implementations that all share the same pipeline:

1. **`supabase/functions/generate-dream/index.ts`** — the Edge Function called by the app (onboarding reveal + "My Mediums"/"My Vibes" on Create screen)
2. **`supabase/functions/nightly-dreams/index.ts`** — the Edge Function triggered by pg_cron at 3am UTC
3. **`scripts/nightly-dreams.js`** — the Node.js script triggered by GitHub Actions cron at 1am MST

**This path is intentionally isolated from the Create/DLT dream paths.** Changes here do not affect the V2 text, restyle, or reimagine paths, and vice versa.

---

## Pipeline (all three implementations)

```
User's VibeProfile
       │
       ├─ art_styles[] ──→ resolveMedium('my_mediums') ──→ random pick from user's styles ──→ DreamMedium (fluxFragment + directive)
       ├─ aesthetics[] ──→ resolveVibe('my_vibes') ──→ random pick from user's aesthetics ──→ DreamVibe (directive)
       ├─ moods{} ──→ pickWeightedCategory(moods) ──→ biased random from 31 template categories
       ├─ dream_seeds{} ──→ fill ${character}/${place}/${thing} slots in template + extra seeds to Sonnet
       ├─ dream_cast[] ──→ 30% chance to inject a cast member description
       ├─ avoid[] ──→ "NEVER INCLUDE" line in Sonnet brief
       │
       ▼
  ┌─────────────────────────────────────┐
  │  Step 1: Pick template from DB      │
  │  dream_templates table (5,910 rows) │
  │  31 categories, ~190 each           │
  │  Category chosen by mood weighting  │
  └───────────────┬─────────────────────┘
                  │
  ┌───────────────▼─────────────────────┐
  │  Step 2: Fill template slots        │
  │  ${character} ← dream_seeds.chars   │
  │  ${place} ← dream_seeds.places      │
  │  ${thing} ← dream_seeds.things      │
  └───────────────┬─────────────────────┘
                  │
  ┌───────────────▼─────────────────────┐
  │  Step 3: Maybe inject dream cast    │
  │  30% chance, append description     │
  └───────────────┬─────────────────────┘
                  │
  ┌───────────────▼─────────────────────┐
  │  Step 4: Pick random shot direction │
  │  15 camera/composition options      │
  └───────────────┬─────────────────────┘
                  │
  ┌───────────────▼─────────────────────┐
  │  Step 5: Build Sonnet brief         │
  │  MEDIUM: fluxFragment               │
  │  DREAM SCENE: filled template       │
  │  CAMERA: shot direction             │
  │  MOOD: vibe directive               │
  │  FLAVOR: user's aesthetics          │
  │  INGREDIENTS: extra dream seeds     │
  │  NEVER INCLUDE: avoid list          │
  └───────────────┬─────────────────────┘
                  │
  ┌───────────────▼─────────────────────┐
  │  Step 6: Sonnet writes Flux prompt  │
  │  claude-sonnet-4-20250514           │
  │  60-90 words, comma-separated       │
  └───────────────┬─────────────────────┘
                  │
  ┌───────────────▼─────────────────────┐
  │  Step 7: Flux Dev generates image   │
  │  9:16 portrait, jpg                 │
  └───────────────┬─────────────────────┘
                  │
  ┌───────────────▼─────────────────────┐
  │  Step 8: Haiku writes bot message   │
  │  8-15 words, playful reaction       │
  └─────────────────────────────────────┘
```

---

## Source of Truth — Where Things Live

| What | File | Notes |
|---|---|---|
| Medium definitions (key, label, directive, fluxFragment) | `constants/dreamEngine.ts` → `DREAM_MEDIUMS` | 21 curated + 2 meta (My Mediums, Surprise Me) |
| Vibe definitions (key, label, directive) | `constants/dreamEngine.ts` → `DREAM_VIBES` | 11 curated + 2 meta |
| Key arrays for TypeScript types | `constants/dreamEngine.ts` → `MEDIUM_KEYS`, `VIBE_KEYS` | `as const` arrays |
| `ArtStyle` / `Aesthetic` union types | `types/vibeProfile.ts` | Derived from `MEDIUM_KEYS` / `VIBE_KEYS` |
| Onboarding tile lists | `constants/onboarding.ts` | Derived from `CURATED_MEDIUMS` / `CURATED_VIBES` |
| Edge Function type copies | `supabase/functions/_shared/vibeProfile.ts` | Manual sync — must match |
| Node script medium/vibe subsets | `scripts/nightly-dreams.js` | Manual sync — compact subset |
| Dream scene templates | `dream_templates` DB table | 5,910 templates across 31 categories |
| Template generation script | `scripts/generate-dream-templates.js` | One-time backfill, 31 categories × 200 |

---

## How to Add a New Medium

### 1. Define it in `constants/dreamEngine.ts`

Add to `DREAM_MEDIUMS` array (anywhere after `surprise_me`):

```ts
{
  key: 'your_key',
  label: 'Display Name',
  directive: 'Long creative brief for Sonnet — describe how a master of this medium thinks, what makes it unique...',
  fluxFragment: 'Technical Flux prompt prefix — comma-separated style descriptors',
},
```

**Directive** = what Sonnet reads to understand the artistic intent. Write it like you're briefing a world-class artist. 3-5 sentences.

**fluxFragment** = what gets prepended to the final Flux prompt. Be specific with materials, textures, named references. This is what Flux actually sees.

### 2. Add the key to `MEDIUM_KEYS`

```ts
export const MEDIUM_KEYS = [
  // ... existing keys
  'your_key',
] as const;
```

This automatically updates the `ArtStyle` TypeScript union type.

### 3. Sync `_shared/vibeProfile.ts`

Add `'your_key'` to the `ArtStyle` union type in `supabase/functions/_shared/vibeProfile.ts`.

### 4. Sync `scripts/nightly-dreams.js`

Add the key + fluxFragment to the `CURATED_MEDIUMS` array in the Node script.

### 5. Add photo restyle config (if applicable)

If the medium needs special handling for photo-to-image, add a config in `supabase/functions/_shared/photoPrompts.ts`.

### 6. Add text dream prompt (if applicable)

If the medium benefits from a custom text dream template, add it in `supabase/functions/_shared/textPrompts.ts`.

### 7. Check SDXL routing

In `generate-dream/index.ts`, the `pickModel()` function routes certain mediums to SDXL instead of Flux. If your medium looks better on SDXL (e.g., anime styles), add it to `SDXL_PREFERRED_MEDIUMS`.

### 8. Check face swap exclusion

In `generate-dream/index.ts`, `NON_SWAP_MEDIUMS` controls which mediums skip face swapping for photo reimagine. Stylized mediums (LEGO, pixel art, etc.) should be in this set.

### 9. Deploy

```bash
supabase functions deploy generate-dream --no-verify-jwt
supabase functions deploy nightly-dreams --no-verify-jwt
```

### What happens automatically:
- Onboarding shows the new medium as a pill option (derived from `CURATED_MEDIUMS`)
- Create screen shows it in the medium selector (reads `DREAM_MEDIUMS`)
- Nightly engine can resolve it when a user selects it in their profile
- TypeScript enforces the key everywhere

---

## How to Add a New Vibe

Same pattern but simpler (no fluxFragment, no photo config, no SDXL routing):

### 1. Define in `DREAM_VIBES`

```ts
{
  key: 'your_key',
  label: 'Display Name',
  directive: 'Describe the mood, lighting, color palette, composition rules, emotional tone...',
},
```

### 2. Add to `VIBE_KEYS`

### 3. Sync `_shared/vibeProfile.ts` and `scripts/nightly-dreams.js`

### 4. Deploy

---

## Mood Slider → Category Weighting

The user's 4 mood sliders (0.0–1.0) bias which template categories are picked:

| Slider | Low (0.0) | High (1.0) |
|---|---|---|
| `peaceful_chaotic` | peaceful_absurdity, beautiful_melancholy, eerie_stillness, bioluminescence | joyful_chaos, broken_gravity, machines |
| `cute_terrifying` | peaceful_absurdity, childhood, bioluminescence, joyful_chaos | cosmic_horror, eerie_stillness, decay_beauty |
| `minimal_maximal` | microscopic, beautiful_melancholy, reflections, transparency | giant_objects, impossible_architecture, collections, dreams_within_dreams, machines |
| `realistic_surreal` | (base weight 1.0 for all) | cosmic, wrong_materials, time_distortion, dreams_within_dreams, memory_distortion, broken_gravity, doors_portals |

Every category has a base weight of 1.0 plus bonuses from 0.0–0.8 based on slider values. No category is ever excluded — just more or less likely.

The weighting function `pickWeightedCategory(moods)` lives in:
- `generate-dream/index.ts` (inline)
- `nightly-dreams/index.ts` (standalone function)
- `scripts/nightly-dreams.js` (standalone function)

---

## Template Categories (31)

| Category | Key | Theme |
|---|---|---|
| Cosmic/Astronomical | `cosmic` | Stars, planets, galaxies, nebulae |
| Microscopic/Tiny | `microscopic` | Worlds in dewdrops, cities on coins |
| Impossible Architecture | `impossible_architecture` | Physics-defying buildings |
| Giant Objects | `giant_objects` | Everyday things at mountain scale |
| Peaceful Absurdity | `peaceful_absurdity` | Calm scenes that make no sense |
| Beautiful Melancholy | `beautiful_melancholy` | Gorgeous sadness, bittersweet |
| Cosmic Horror (lite) | `cosmic_horror` | Vast unknowable things, awe + dread |
| Joyful Chaos | `joyful_chaos` | Explosive color, celebration |
| Eerie Stillness | `eerie_stillness` | Frozen moments, quiet wrongness |
| Broken Gravity | `broken_gravity` | Falling sideways, floating worlds |
| Wrong Materials | `wrong_materials` | Oceans of glass, clouds of fabric |
| Time Distortion | `time_distortion` | Multiple seasons, clocks melting |
| Merged Worlds | `merged_worlds` | Two realities overlapping |
| Living Objects | `living_objects` | Furniture with feelings |
| Impossible Weather | `impossible_weather` | Raining objects, snow made of light |
| Overgrown/Reclaimed | `overgrown` | Nature eating civilization |
| Bioluminescence & Light | `bioluminescence` | Everything glows from inside |
| Dreams Within Dreams | `dreams_within_dreams` | Recursive worlds, mise en abyme |
| Memory Distortion | `memory_distortion` | Familiar places remembered wrong |
| Abandoned & Running | `abandoned_running` | Empty places still operating |
| Transformation | `transformation` | Things becoming other things |
| Reflections & Doubles | `reflections` | Mirror worlds that don't match |
| Machines & Mechanisms | `machines` | Clockwork landscapes |
| Music & Sound | `music_sound` | Visible sound waves |
| Underwater & Deep | `underwater` | Sunken civilizations |
| Doors & Portals | `doors_portals` | Doors to nowhere, thresholds |
| Collections & Multitudes | `collections` | Thousands of the same thing |
| Decay & Beauty | `decay_beauty` | Rust that is gorgeous |
| Childhood & Scale Shift | `childhood` | Adult world from child's height |
| Transparency & Layers | `transparency` | See-through everything |
| Cinematic Moments | `cinematic` | Frame from a film that doesn't exist |

---

## Files That Must Stay in Sync

When editing the nightly dream pipeline, these files must all reflect the same logic:

1. `supabase/functions/generate-dream/index.ts` (lines ~388–483) — the nightly path block
2. `supabase/functions/nightly-dreams/index.ts` — entire file
3. `scripts/nightly-dreams.js` — entire file
4. `supabase/functions/_shared/vibeProfile.ts` — type definitions
5. `supabase/functions/_shared/dreamEngine.ts` — Edge Function copy of dreamEngine

The Edge Function copies in `_shared/` are NOT auto-synced from `constants/` or `types/`. They must be manually updated when the source changes.

---

## Cost Per Dream

| API Call | Model | Cost |
|---|---|---|
| Sonnet prompt writer | claude-sonnet-4 | ~$0.003 |
| Flux image generation | flux-dev | ~$0.025 |
| Haiku bot message | claude-haiku-4.5 | ~$0.001 |
| **Total per dream** | | **~$0.029** |
