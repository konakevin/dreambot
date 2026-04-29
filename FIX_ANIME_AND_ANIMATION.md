# FIX_ANIME_AND_ANIMATION

**Goal:** Enable face_swaps on `anime` and `animation` mediums via FACE_SWAP_FLUX_OVERRIDES, using the same iterative QA loop that fixed `fairytale`. End state: both mediums render with real faces (cast/dual paths) while preserving their full stylized aesthetic for generic (non-cast) renders.

**This document is your continuity anchor.** If you compact mid-run, read this top to bottom and you can resume without losing context.

---

## Background — what was done before this

### The fairytale fix (2026-04-29, committed 393ab84)

Fairytale had massive Disney big-eye artifacts on every face swap render. We ran 11 rounds of QA iteration (R19-R29) and converged on a working override. Key insight: **separate the WORLD aesthetic from the CHARACTER DESIGN**. "Fairy tale animation style" tells Flux to draw Disney-style characters; "illustration set in a fairy tale world" tells Flux to draw realistic people in a fairy-tale environment.

The fix lives in `FACE_SWAP_FLUX_OVERRIDES` (Record in `supabase/functions/nightly-dreams/index.ts` ~line 492). It's a runtime-only override — when `faceSwapEligible` is true AND the medium key matches, we replace `baseMedium.fluxFragment` and optionally `baseMedium.directive` with face-realism-first language. The DB `dream_mediums` row is **never touched** — generic renders keep their original style.

Read `memory/project_dual_character_faceswap_system.md` for the full 7-layer architecture and `memory/project_fairytale_faceswap_qa.md` for the round-by-round history.

### Why anime + animation are next

- Both currently have `face_swaps=false` because no one tuned them
- Anime has the exact same problem fairytale did but worse — "anime eyes" is THE trope
- Animation is ambiguous (Pixar? Cartoon Network? Disney?) and likely needs a sub-style anchor
- The blueprint from fairytale is proven, so we expect 5-10 rounds per medium not 11+

---

## The 7-Layer System (must understand before iterating)

Every dual-character render passes through 7 layers, all of which can fight each other if misaligned. Listed in execution order:

1. **Composition path** (`_shared/pools/dual_composition.ts`) — 6 cinematography presets, prepended to Flux prompt
2. **Action pool** (`_shared/pools/dual_actions.ts`) — 200+ companion + 17 partner poses, injected to Sonnet brief
3. **Flux fragment override** (`FACE_SWAP_FLUX_OVERRIDES`) — runtime override of art style prefix
4. **Directive override** (same Record) — runtime override of style guide Sonnet reads
5. **Sonnet brief** (`nightly-dreams/index.ts` ~line 657) — face lock, separation rules, face realism rule
6. **Post-process regex** (~line 836) — strips gaze/interaction/back-view language Sonnet slips in
7. **Face swap execution** (`dualFaceSwap()` from `_shared/faceSwap.ts`) — crop→swap→stitch with 3x retry

**The override entry is what we tune.** Layers 5/6/7 are already battle-tested from fairytale work and apply uniformly. Layers 1/2 don't change between mediums.

---

## What stays UNTOUCHED (this is critical)

The plan must not regress generic anime/animation renders. Specifically:

- `dream_mediums` DB rows for anime/animation: `directive` and `flux_fragment` columns **stay the same**
- Sort order, allowed_models, character_render_mode: stay the same
- Generic renders (no cast member in scene) skip the override entirely because `faceSwapEligible` requires `isCharacterDream`
- The `_shared/photoPrompts.ts` MEDIUM_CONFIGS for these mediums (Kontext restyle path): unaffected

**The only DB schema change** is flipping `face_swaps=true` on the two rows. That toggle gates whether the override branch can fire — it doesn't change what the medium produces in non-cast paths.

---

## All 8 Render Paths (every one must be considered)

When toggling `face_swaps=true`, every path needs a verdict:

| # | Path | Effect |
|---|------|--------|
| 1 | Generic anime, no cast | UNTOUCHED — full anime eyes preserved |
| 2 | Anime + text prompt, no cast | UNTOUCHED |
| 3 | Anime + self-reference text ("put me in...") single | OVERRIDE FIRES — realistic face on self |
| 4 | Anime + dual reference text ("me and my wife...") | OVERRIDE FIRES — both faces realistic (PRIMARY QA TARGET) |
| 5 | Anime nightly cast roll → single | OVERRIDE FIRES — realistic face on rolled cast |
| 6 | Anime nightly cast roll → dual (25% when both self+plus_one exist) | OVERRIDE FIRES (SECONDARY QA TARGET) |
| 7 | Anime + photo upload (Kontext restyle) | UNAFFECTED — separate photoPrompts.ts config |
| 8 | Anime + photo + prompt | UNAFFECTED — same as #7 |

QA loop primarily hits path #4 (dual via `force_cast_role: 'dual'`). Path #6 is identical pipeline at runtime. Path #3/#5 use single face swap — same override, simpler pipeline. Pets are not officially supported and intentionally skipped.

---

## Phase Plan

### Phase 1: Baseline (1 round per medium, 5 renders each)

Goal: see exactly what fails before any changes.

1. Temporarily flip `face_swaps=true` on anime + animation in DB
2. Render 5 dual face swap batches per medium via inline node script (see "How to run batches" below)
3. Save to `/tmp/dual-qa/anime-baseline/` and `/tmp/dual-qa/animation-baseline/`
4. Document failure modes per medium: eye size, eyebrow artifacts, gender preservation, body proportions, face swap detection success, scene aesthetic preservation

This tells us anime-specific vs animation-specific vs shared artifacts.

### Phase 2: Initial overrides

Add candidate entries to `FACE_SWAP_FLUX_OVERRIDES` in `nightly-dreams/index.ts`. Hypothesis-only — these will be iterated:

**Anime hypothesis:**
```typescript
anime: {
  fluxFragment:
    'realistic human face with normal sized eyes and natural proportions, thin subtle eyebrows, NOT anime eyes, NOT manga eyes, NOT chibi, illustrated scene set in an anime world, cel-shaded environments, vibrant Japanese color palette, clean linework, painted backgrounds, strictly 2D not 3D CGI',
  directive:
    'Create images set in an anime world. Strictly 2D, never 3D CGI. Visual qualities: cel-shaded backgrounds, painted environments, vibrant Japanese color palettes, clean confident linework. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size. Do NOT use anime/manga character design for faces. Thin natural eyebrows only. The WORLD is anime but the FACES are realistic.',
},
```

**Animation hypothesis:**
```typescript
animation: {
  fluxFragment:
    'realistic human face with normal sized eyes and natural proportions, thin subtle eyebrows, NOT cartoon eyes, NOT exaggerated features, illustrated scene set in an animated world, painted backgrounds, smooth Western 2D animation aesthetic, vibrant color palette, strictly 2D not 3D CGI',
  directive:
    'Create images set in a hand-drawn animated world. Strictly 2D, never 3D CGI. Visual qualities: painted backgrounds, smooth animation aesthetic, vibrant color palettes, confident linework. CRITICAL FACE RULE — NON-NEGOTIABLE: ALL characters MUST have photorealistic adult human face proportions. Eyes MUST be normal human size. Do NOT use cartoon character design for faces. The WORLD is animated but the FACES are realistic.',
},
```

These are starting points only. Expect to revise multiple times during QA.

### Phase 3: QA loop per medium (independent)

Run anime and animation as separate iteration cycles. Anime first (more predictable artifact, faster convergence).

**Per-round procedure:**

1. Run 5 dual face swap renders (see "How to run batches")
2. Grade every image on these axes:
   - Eye proportions (normal human vs enlarged)
   - Eyebrow artifacts (thin natural vs thick/double-brow bleed-through)
   - Gender preservation (man stays male, woman stays female)
   - Face integration (naturally drawn into scene vs floating swap-paste)
   - Face swap detection (did the swap apply at all)
   - Medium aesthetic preservation (still recognizably anime/animation, not generic illustration)
3. Identify which LAYER failed (mostly Layer 3 — flux fragment — or Layer 4 — directive)
4. Make ONE targeted change
5. Deploy: `supabase functions deploy nightly-dreams --no-verify-jwt`
6. Repeat

**Stopping criteria:** 3 consecutive 5/5 perfect rounds, OR 20 rounds (whichever comes first).

### Phase 4: Non-face-swap regression check

Critical: confirm overrides didn't leak into generic renders.

1. Render 5 anime dreams with NO cast → confirm full anime aesthetic preserved (big eyes intact)
2. Render 5 animation dreams with NO cast → confirm full animation aesthetic preserved
3. If either is degraded, the override is leaking. Check: is `faceSwapEligible` correctly gated? Did anyone modify the DB row by mistake?

### Phase 5: Single character validation

Confirm the override works for single-cast paths too (not just dual).

1. Render 5 self-only (`force_cast_role: 'self'`) anime renders → realistic self face
2. Render 5 plus_one-only (`force_cast_role: 'plus_one'`) anime renders → realistic +1 face
3. Same for animation

If single passes but dual was the focus of iteration, the single path benefits automatically because the override applies before pipeline branching.

### Phase 6: Database commit

Once all paths pass:

1. Write migration `131_enable_anime_animation_face_swap.sql`:
   ```sql
   UPDATE public.dream_mediums SET face_swaps = true WHERE key IN ('anime', 'animation');
   ```
2. Run migration in Supabase SQL editor (DDL doesn't go through JS client)
3. Commit code (FACE_SWAP_FLUX_OVERRIDES additions) + migration
4. Push
5. Deploy nightly-dreams was already done during iteration

### Phase 7: Final report

Document for each medium:
- Round count to convergence
- Final flux fragment + directive (the working version)
- Specific failure modes seen and which fix addressed each
- Any anime/animation-specific findings
- Any surprises that should inform the next medium

Save the report inline at the bottom of this file under "## Run History" so future-you has the artifacts.

---

## How to run batches (CRITICAL — easy to get wrong)

The existing `scripts/test-dual-faceswap-v4.js` does NOT support `--medium` or `--count` flags. **Don't try to use them.** Instead, write an inline node script that calls the nightly-dreams endpoint directly with `force_medium` and `force_cast_role: 'dual'`.

**Auth pattern (use this exact sequence — service role key as Bearer does NOT work):**

1. `supabase.auth.admin.generateLink({ type: 'magiclink', email: KEVIN_EMAIL })` → get hashed_token
2. `userClient.auth.verifyOtp({ token_hash, type: 'magiclink' })` → get session.access_token
3. POST to `${SUPABASE_URL}/functions/v1/nightly-dreams` with headers:
   - `Authorization: Bearer ${access_token}`
   - `apikey: ${ANON_KEY}`
   - `Content-Type: application/json`

**Body:**
```json
{
  "vibe_profile": <Kevin's recipe from user_recipes>,
  "force_cast_role": "dual",
  "force_medium": "anime",
  "force_vibe": "<varying vibe>"
}
```

**For each round:**
- Use 5 different vibes (e.g., whimsical, dreamy, epic, cinematic, dramatic)
- Save images to `/tmp/dual-qa/anime-rN/r{N}_{i}.jpg`
- Save prompts to `/tmp/dual-qa/anime-rN/r{N}_{i}_prompt.txt`
- Update upload caption + set is_public=true so Kevin sees them in feed for phone QA

**Reference:** the inline scripts in the round-27, round-28, round-29 fairytale runs (saved in conversation history) are the template. Copy that structure.

**Kevin reviews on phone.** Always post to feed (`is_public: true` on the upload). Renders that only land in `/tmp` are useless for QA.

---

## Layer-Specific Tuning Tips (from fairytale experience)

### Layer 3 (flux fragment) — most-edited layer

- **Front-load face realism.** Flux gives early tokens more weight. "Realistic human face..." goes BEFORE style language.
- **Style phrases are atomic.** "Anime style" is a single concept to Flux — you can't partially override with negatives. You must REPLACE it.
- **Negative prompts are weak.** "NOT anime eyes" alone won't work. Use them as reinforcement after positive realism language, not as the main control.
- **World-vs-character split is the structural fix.** Apply style to the WORLD ("scene set in an anime world"), realism to CHARACTERS.
- **Remove medium-specific character-design triggers.** For fairytale this was "traditional cel animation" and "classic Disney." For anime it's likely "anime character design" or specific subgenre triggers (shounen, shoujo, chibi). For animation it's likely Pixar/Disney named studios.
- **Eyebrow language matters.** "thin subtle eyebrows" prevents double-brow artifacts where the rendered character's drawn brows bleed through the face swap.

### Layer 4 (directive)

- Sonnet reads this as STYLE GUIDE. If it says "expressive faces" but flux fragment says "realistic faces", Sonnet writes prompts that oscillate.
- Open with WORLD framing not CHARACTER framing: "Create images set in an X world" not "Create images in X style."
- End with the CRITICAL FACE RULE block — Sonnet attends strongly to imperative blocks at the end of briefs.

### Layer 5 (Sonnet brief)

The face-swap-eligible branch in `nightly-dreams/index.ts` ~line 641 has:
- `faceLockPhrase` — mandatory phrase Sonnet must include verbatim
- `dualSepRule` — Character 1 LEFT, Character 2 RIGHT
- `faceRealismRule` — fires for stylized mediums (currently `['storybook', 'pencil', 'fairytale']`)
- **Important:** add 'anime' and 'animation' to the `stylizedMediums` Set when starting iteration so the realism rule fires. Without this, the brief won't enforce face realism even with the override.

```typescript
const stylizedMediums = new Set(['storybook', 'pencil', 'fairytale', 'anime', 'animation']);
```

### Layer 6 (regex stripping)

Already extensive (~lines 836-864). Strips gaze, back views, interaction language. **Probably doesn't need changes** for anime/animation. Watch for new patterns Sonnet slips in for anime specifically (e.g., "shojo manga style", "kawaii expression") — add new regex if needed.

### Layer 7 (face swap execution)

3x retry already in place from R28+ work. No changes needed.

---

## Risks / Watch Items

- **"Anime" is more atomic than "fairy tale".** Flux may resist the world/character split. If front-loading + world-split + negatives don't converge in 10 rounds, consider rewriting the fragment more aggressively (e.g., "Japanese illustrated scene" instead of "anime world", or invoke specific anime sub-aesthetics like Studio Ghibli — but Kevin rejected Ghibli pivot for fairytale, ask before invoking).
- **Animation is genuinely vague.** Flux's interpretation of "animation" without anchors varies wildly (Pixar, anime, Disney, Cartoon Network). The override may need a Western 2D anchor or another sub-style specifier to converge.
- **Subgenre regressions.** Some anime renders may benefit from preserving the subgenre (e.g., shounen action vs slice-of-life). The override flattens to "anime world" — if Kevin loses something specific, may need to add subgenre flavor while keeping face realism.
- **Watch for max_tokens truncation again.** Dual prompts use 300 tokens. If anime descriptions are longer than fairytale, may need to bump higher and watch for woman-character truncation (causes both-male renders).
- **Composition mode banned list.** `dreamAlgorithm.ts` already restricts dual face swap to `['balanced', 'intimate_close', 'layered_depth']`. Don't change this — it's tuned to keep faces visible.

---

## File Map (where to make changes)

| File | What to edit |
|---|---|
| `supabase/functions/nightly-dreams/index.ts` | Add anime + animation entries to FACE_SWAP_FLUX_OVERRIDES (~line 492). Add 'anime' + 'animation' to `stylizedMediums` Set (~line 648). |
| `supabase/migrations/131_enable_anime_animation_face_swap.sql` | New migration — flip face_swaps to true |
| `/tmp/dual-qa/anime-rN/` | Output directory for each round |
| `/tmp/dual-qa/animation-rN/` | Output directory for each round |

**Do NOT edit:**
- `dream_mediums` rows for anime/animation (directive/flux_fragment columns)
- `_shared/photoPrompts.ts` configs (separate path)
- Any composition path or action pool files (already tuned)
- `_shared/faceSwap.ts` (3x retry already in place)

---

## Convergence Checklist (per medium)

Before declaring a medium done:

- [ ] 3 consecutive 5/5 perfect dual face swap rounds
- [ ] 5/5 generic (no-cast) renders confirm anime/animation aesthetic preserved
- [ ] 5/5 single self renders pass face quality
- [ ] 5/5 single plus_one renders pass face quality
- [ ] Final flux_fragment + directive saved to "Run History" section below
- [ ] Migration written + applied
- [ ] Commit + push

---

## How to resume after compaction

If you see this file referenced and don't remember the context:

1. Read this entire file top to bottom
2. Read `memory/project_dual_character_faceswap_system.md` for the 7-layer architecture
3. Read `memory/project_fairytale_faceswap_qa.md` for the proven iteration pattern
4. Check the "Run History" section below to see where iteration stopped
5. Look at the latest round images in `/tmp/dual-qa/anime-rN/` or `/tmp/dual-qa/animation-rN/` to see where we left off visually
6. Check git log for any partial commits — was the migration written? Were FACE_SWAP_FLUX_OVERRIDES entries added?
7. Resume from the appropriate phase

---

## Run History

(To be filled in during execution)

### Anime

- **Phase 1 baseline:** _not started_
- **Round count:** _0_
- **Final flux_fragment:** _TBD_
- **Final directive:** _TBD_
- **Notes:** _TBD_

### Animation

- **Phase 1 baseline:** _not started_
- **Round count:** _0_
- **Final flux_fragment:** _TBD_
- **Final directive:** _TBD_
- **Notes:** _TBD_

### Convergence Date

_Not yet converged._
