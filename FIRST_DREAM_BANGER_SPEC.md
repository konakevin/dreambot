# First-Dream Banger Engine — Spec

**Status:** building (2026-05-09)
**Branch:** `first-dream-banger`

The first dream a user sees at the end of onboarding is the single biggest hook moment in the app. This engine is tuned to deliver a maximum-wow first impression by removing randomness from the nightly engine's most variance-heavy axes (medium, vibe, composition) and replacing them with curated rankings + persona-specific overrides.

## Locked decisions

### 1. 3 Templates (Personas)

Persona is derived from cast composition only:

| Persona | When | Composition |
|---|---|---|
| `no_cast` | User uploaded no self/plus_one photo (or only a pet) | `pure_scene` |
| `solo_male` | Self only, male; OR plus_one only, male | `character` (single face swap) |
| `solo_female` | Self only, female; OR plus_one only, female | `character` (single face swap) |
| `duo` | Both self and plus_one uploaded | `character` (dual face swap, "friends" tone — relationship-agnostic) |

Pet-only users → `no_cast` (pets aren't face-swapped, won't render reliably from text alone for first impression).

### 2. Medium Ranking (Global)

Face-swap eligible (1–12) → embodied (13–18):

```
 1. canvas
 2. render
 3. illustration
 4. anime
 5. watercolor
 6. fairytale
 7. pencil
 8. comics
 9. storybook
10. pop art
11. vaporwave
12. photography
13. lego
14. animation
15. pixels
16. claymation
17. vinyl
18. handcrafted
```

For face-swap personas (solo_*, duo), only positions 1–12 apply; if user picked zero from this set, fall to highest-ranked embodied medium and engine renders embodied.

### 3. Vibe Ranking (Global)

```
 1. cinematic
 2. epic
 3. enchanted
 4. shimmer
 5. whimsical
 6. nostalgic
 7. peaceful
 8. cozy
 9. ethereal
10. arcane
11. ancient
12. surreal
13. psychedelic
14. coquette
15. voltage
16. minimal
17. fierce
18. dark
19. nightshade
20. macabre
```

### 4. Persona Overrides

```typescript
const PERSONA_OVERRIDES = {
  no_cast: {
    // Use global rankings.
  },
  solo_male: {
    vibeRanking: [
      'epic', 'cinematic', 'fierce', 'ancient', 'voltage', 'enchanted', 'peaceful',
      'nostalgic', 'arcane', 'surreal', 'shimmer', 'whimsical', 'ethereal',
      'nightshade', 'psychedelic', 'minimal', 'cozy', 'dark', 'macabre',
    ],
    bannedVibes: ['coquette'],
    // Medium: use global ranking.
  },
  solo_female: {
    forceVibe: 'coquette',
    mediumRanking: ['fairytale', 'anime', 'canvas', 'storybook', 'watercolor'],
  },
  duo: {
    // Use global rankings. "Friends" tone applied via brief.
  },
}
```

### 5. Pick Logic

```
function pickMedium(userPicks, persona):
  override = PERSONA_OVERRIDES[persona]
  if (override.forceMedium) return override.forceMedium
  if (override.mediumRanking):
    overlap = userPicks ∩ override.mediumRanking
    if (overlap.length > 0):
      return sort(overlap) by override.mediumRanking position [0]
  return sort(userPicks) by GLOBAL_MEDIUM_RANKING position [0]

function pickVibe(userPicks, persona):
  override = PERSONA_OVERRIDES[persona]
  filtered = userPicks − (override.bannedVibes ?? [])
  if (override.forceVibe) return override.forceVibe
  if (filtered.length === 0 && override.vibeRanking):
    return override.vibeRanking[0]   // fall to persona's top
  if (override.vibeRanking):
    overlap = filtered ∩ override.vibeRanking
    if (overlap.length > 0):
      return sort(overlap) by override.vibeRanking position [0]
  return sort(filtered) by GLOBAL_VIBE_RANKING position [0]
```

### 6. Composition Knobs (Locked Per Template)

Replaces nightly's `rollDream()` random rolls with deterministic picks per persona:

| Persona | composition | composition_mode (weighted) | object_include_pct | action_pool |
|---|---|---|---|---|
| no_cast | `pure_scene` | open_vista 60 / layered_depth 40 | 70% | n/a |
| solo_male | `character` | low_angle_hero 50 / intimate_close 30 / balanced 20 | 50% | `single_actions` (`needsEpicBackdrop=true` bias) |
| solo_female | `character` | balanced 40 / intimate_close 40 / low_angle_hero 20 | 50% | `single_actions` (`needsEpicBackdrop=true` bias) |
| duo | `character` | balanced 60 / intimate_close 40 | 30% | `dual_actions` (`companion`/`friends` pool tilt) |

### 7. Forced Personalization

- **Always include user's first chosen location** (skip nightly's recency filter — no history yet)
- **Object include** rolls from above pcts, against location-compatible objects only (uses nightly's existing compat filter)
- **Skip random shot direction** — the locked `composition_mode` carries framing direction
- **Skip the 50/50 includeCharacter roll** — template chosen by cast composition forces it
- **Single render** (no best-of-3) — latency wins, banger rate driven by curation
- **One-shot, non-replayable** — `users.first_dream_completed_at` flips on success

### 8. Sonnet Brief Templates

Three brief flavors, each a tighter version of the nightly equivalents:

- **`pure_scene`** — 60-90 words, no people, "pick ONE dominant anchor" rule, location card phrases load as primary scene identity
- **`solo_character`** — 70-100 words, mandatory face-lock phrase, three-quarter angle, balanced lighting on face, `needsEpicBackdrop` directive enforced (the location is the reason this photo exists), single_action injection
- **`duo_character`** — 70-100 words, dual face-lock phrase, L/R separation enforced, "friends sharing a wonder moment" tone block, dual_action from `companion`/`friends` pool

All briefs include the existing nightly guardrails:
- "Select and subordinate" rule (pick ONE dominant anchor + 2-3 supporting details)
- Layered foreground/midground/background depth
- "Every word must be something a camera can see"
- No metaphors, no feelings

### 9. Pipeline (Edge Function: `generate-first-dream`)

```
1. Auth (user JWT)
2. Load profile (vibe_profile, dream_seeds, dream_cast)
3. Guard: if users.first_dream_completed_at IS NOT NULL → 409 Conflict
4. derivePersona(cast)
5. pickMedium + pickVibe (with persona overrides)
6. Describe undescribed cast photos (Llama Vision) — same as nightly
7. Lock composition + compositionMode + includeObject (per template)
8. assembleScene() with locked params + always-on location + curated object
9. Build Sonnet brief (one of 3 templates)
10. Sonnet → 70-100 word Flux prompt
11. Flux render (NSFW retry)
12. Face swap (single or dual via dispatchDualFaceSwap)
13. Persist (uploads + ai_generation_log + first_dream flag)
14. Mark users.first_dream_completed_at = now()
```

### 10. Failure Floor

- Sonnet failure → fall through to a hand-tuned static prompt template per persona (good enough to ship)
- Face swap fails 3× → re-render same brief with `forceNoCast=true`, render no-cast variant (epic-tiny figure or pure scene)
- Never hard-fail. Never block onboarding completion on render failure.

### 11. Hard Guardrails

1. Skip nightly-skip mediums (e.g., photography paired with surreal scene = "AI photoshop collage")
2. Force `chaos<0.3` — first impression favors wonder over weirdness
3. Block phrases: no horror, demon, vampire, Halloween, gore, blood, skull (even if user's picks lean dark — soften via wonder modifier)
4. Skip random shot-direction array (nightly has 15 — too much variance for first dream)
5. NEVER use a bot-only medium

### 12. Out of Scope (For Now)

- Photo reimagine on first dream (text-only first dream)
- Re-trigger flow (one-shot, non-replayable)
- Per-cell QA tuning (3 templates only — universal not per-location)
- Onboarding UX changes outside RevealStep

## Architecture Files

```
types/firstDream.ts                                        Pure types + ranking constants
supabase/functions/_shared/firstDream.ts                   Deno mirror of types
lib/firstDreamPicker.ts                                    Pure pick logic (derivePersona, pickMedium, pickVibe)
supabase/functions/_shared/firstDreamPicker.ts             Deno mirror of picker
supabase/functions/generate-first-dream/index.ts           Edge Function entrypoint
supabase/migrations/<NNN>_first_dream_completed_at.sql     One-shot guard column
__tests__/lib/firstDreamPicker.test.ts                     Unit tests for picker
components/onboarding/RevealStep.tsx                       Wire to new Edge Function (flag-gated)
```

## Phases

- **Phase 1** (this session) — types + picker + tests + Edge Function shell + spec
- **Phase 2** — wire RevealStep + smoke test 5 dreams across personas
- **Phase 3** — iterate Sonnet briefs based on smoke results
- **Phase 4** — feature flag flip + measure
