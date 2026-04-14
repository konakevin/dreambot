# Mediums FAQ — The Complete Guide

## What Is a Medium?

A medium is an art style (anime, photography, gothic, lego, etc.). The `dream_mediums` Postgres table is the single source of truth. Every medium has a `key` (e.g., "lego"), a `directive` (style guide for Sonnet), a `flux_fragment` (opening tokens for Flux), and classification flags.

## Classification Flags

| Flag | Meaning | Examples |
|------|---------|----------|
| `is_scene_only` | Pure environment, no people | canvas, watercolor, vaporwave, pixels |
| `is_character_only` | Always forces character composition | claymation, lego, vinyl |
| `face_swaps` | Face-swap composite works on this style | photography, anime, pencil, neon, shimmer, twilight, surreal, comics |
| `character_render_mode` | How characters are represented | `natural` (real human) or `embodied` (medium-native avatar) |
| `nightly_skip` | Re-rolled if picked for nightly dreams | watercolor |
| `is_public` | Shown in user-facing UI | Most mediums; some are bot-only |

## Where Medium Keys Are Referenced (THE DEPENDENCY MAP)

**Changing a medium key is a cascading operation.** These files ALL reference medium keys and MUST be updated:

### Critical (will break visibly)

| File | What It Does | What Breaks |
|------|-------------|-------------|
| `dream_mediums` DB table | Source of truth | Everything |
| `uploads.dream_medium` column | Every existing post stores its medium key | Old posts show wrong/missing medium |
| `user_recipes.recipe.art_styles` | Every user's saved medium preferences (JSONB array) | User's nightly dreams pick from dead keys → random fallback |
| `photoPrompts.ts` → `MEDIUM_CONFIGS` | Per-medium photo restyle prompts (19 entries) | Photo restyle falls to generic 1-liner, gender identity lost |
| `renderEntity.ts` → `CHARACTER_TEMPLATES` | Per-medium character templates for embodied rendering | Nightly cast renders as generic "stylized figure" |
| `dreamAlgorithm.ts` → 3 hardcoded Sets | `SCENE_ONLY_MEDIUMS`, `CHARACTER_MEDIUMS`, `NIGHTLY_SKIP_MEDIUMS` | Wrong composition (character rendered as pure scene or vice versa) |
| `generate-bot-dreams.js` → `BOTS` | Hardcoded medium lists per bot | Bot posts fail silently |

### Also Referenced (auto-adapts from DB)

| File | What It Does | Impact |
|------|-------------|--------|
| `dreamStyles.ts` → `resolveMediumFromDb()` | Resolves key to full medium object | Auto-adapts (reads from DB) |
| `hooks/useDreamStyles.ts` | Client fetches mediums for UI picker | Auto-adapts (reads from DB) |
| `nightly-dreams.js` | Nightly cron fetches mediums from DB | Auto-adapts (reads from DB) |

## The Three Hardcoded Sets (TECH DEBT)

These Sets in `dreamAlgorithm.ts` MUST mirror the DB columns but are maintained separately:

```typescript
SCENE_ONLY_MEDIUMS = Set(['canvas', 'watercolor', 'vaporwave', 'pixels'])
CHARACTER_MEDIUMS = Set(['claymation', 'lego', 'vinyl'])
NIGHTLY_SKIP_MEDIUMS = Set(['watercolor'])
```

They exist in **TWO locations** that must stay in sync:
1. `supabase/functions/_shared/dreamAlgorithm.ts` (Edge Function)
2. `lib/dreamAlgorithm.ts` (client copy)

**If you add a scene-only medium to the DB but forget these Sets, nightly dreams will render characters in a scene-only medium.**

## How to Add a New Medium

Follow the checklist in `CLAUDE.md` under "Adding New Mediums/Styles". Summary:

1. **Insert DB row** in `dream_mediums` with all flags set correctly
2. **Add `MEDIUM_CONFIGS` entry** in `photoPrompts.ts` — THIS IS THE MOST-FORGOTTEN STEP. Without it, photo restyle produces garbage with no gender preservation.
3. **If `character_render_mode = 'embodied'`**: add a `CHARACTER_TEMPLATES` entry in `renderEntity.ts`
4. **If `is_scene_only` or `is_character_only`**: update the hardcoded Sets in BOTH copies of `dreamAlgorithm.ts`
5. **If a bot should use it**: add to that bot's `mediums` array in `generate-bot-dreams.js`
6. **Deploy**: `supabase functions deploy generate-dream --no-verify-jwt`
7. **Smoke test all 5 user paths** (create, photo restyle, self-insert, DLT, nightly)

## How to Rename a Medium Key

**This is expensive. Avoid if possible.**

1. Write a SQL migration that:
   - Changes the key in `dream_mediums`
   - Rewrites ALL `uploads.dream_medium` values for existing posts
   - Rewrites ALL `user_recipes.recipe` JSONB to update art_styles arrays
2. Update `MEDIUM_CONFIGS` key in `photoPrompts.ts`
3. Update `CHARACTER_TEMPLATES` key in `renderEntity.ts` (if embodied)
4. Update hardcoded Sets in both `dreamAlgorithm.ts` copies (if classified)
5. Update bot configs in `generate-bot-dreams.js`
6. Deploy Edge Functions
7. Regenerate types: `supabase gen types typescript --linked > types/database.ts`

See `supabase/migrations/106_medium_key_rename.sql` for how the April 2026 rename of 12 mediums was done.

## How to Remove a Medium

1. Set `is_active = false` in `dream_mediums` — DO NOT DELETE the row
2. Remove from bot configs if applicable
3. The medium will stop appearing in the UI picker and nightly rolls
4. Old posts with that medium will still display correctly
5. Users with it in their art_styles will have it ignored (falls to other valid styles)

## Key Rule

**`key` MUST equal `label.toLowerCase().replace(/ /g, '_')`**

Legacy mismatches caused the big rename of April 2026. Never create a medium where key doesn't match the snake_case label.

## Common Pitfalls

### 1. Missing photoPrompts.ts entry
The photo restyle path falls through to a generic 1-liner that ignores the directive. Gender identity is NOT preserved — Flux defaults to "young woman in dress" regardless of subject. The Twilight bug of April 2026 went unnoticed for weeks.

### 2. Stale user art_styles
When mediums are renamed, ALL user profiles must have their `art_styles` JSONB arrays updated. If not, 50%+ of nightly dreams may fall back to random medium selection because the saved keys no longer match active mediums.

### 3. Hardcoded Sets out of sync
Adding `is_scene_only=true` in the DB but forgetting `SCENE_ONLY_MEDIUMS` in dreamAlgorithm.ts means the nightly dream algorithm will try to render characters in a scene-only medium.

### 4. Edge Function caching
After deploying, the Edge Function may serve stale code. Always `supabase functions delete generate-dream` THEN `supabase functions deploy generate-dream --no-verify-jwt`.

### 5. Duplicate MEDIUM_CONFIGS keys
Duplicate keys in a TypeScript Record silently let the LATER definition win. This caused Claymation to render as Sack Boy and Neon to render as cyberpunk in April 2026. Always grep the file for the key after adding.

## Two Render Modes

### Natural (`character_render_mode = 'natural'`)
- Character is rendered as a real human
- Full character description sent to Sonnet
- Face-lock system active (if `face_swaps = true`)
- Face swap composite fires after rendering
- Examples: photography, anime, pencil, comics, neon, shimmer, twilight, surreal

### Embodied (`character_render_mode = 'embodied'`)
- Character is pre-transformed into a medium-native avatar by `buildRenderEntity()`
- Sonnet receives the transformed entity (e.g., "LEGO minifigure with sandy brown hair") and just places it
- NO face lock, NO face swap, full creative freedom
- Uses ACTIONS_WIDE pool (any composition)
- Examples: lego, claymation, vinyl, animation, storybook, pixels, vaporwave, handcrafted

## File Quick Reference

| File | What to update |
|------|---------------|
| `dream_mediums` table | Key, directive, flux_fragment, all flags |
| `supabase/functions/_shared/photoPrompts.ts` | `MEDIUM_CONFIGS` entry for photo restyle |
| `supabase/functions/_shared/renderEntity.ts` | `CHARACTER_TEMPLATES` for embodied mediums |
| `supabase/functions/_shared/dreamAlgorithm.ts` | Hardcoded classification Sets |
| `lib/dreamAlgorithm.ts` | Mirror of above (must match) |
| `scripts/generate-bot-dreams.js` | Bot medium arrays |
| `CLAUDE.md` | Documentation if adding new flags/steps |
