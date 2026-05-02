# DLT Recipe Architecture — Implementation Plan

**Status: IN PROGRESS** — Phase 1 starting

**Last updated:** 2026-05-02 by Claude (during dual-Claude session with Kevin)

> If you (Claude) are reading this after a context compaction, this is your
> source of truth. Read it fully before continuing. Update STATUS section as
> you complete phases.

---

## Goal (one sentence)

DLT captures only the source post's medium + look-and-feel anchors (medium directive, vibe directive, palette, lighting, atmosphere, camera, model) into a frozen recipe at posting time, and at DLT time the user creates a brand-new dream through the normal create flow — their own subject, their own cast, their own photo — with that recipe's medium and look locked in place of the user's medium/vibe pickers.

---

## Why this architecture (the core insight)

Current DLT (Plan C / style_summary) has these failure modes:
1. **Medium mismatch** — user-selected medium overrides source-medium → catastrophically wrong look
2. **Style_summary signal loss** — Haiku interpretation drops style language during distillation
3. **Camera/lighting drift** — those are rolled per-render, never captured
4. **Engine-version drift** — re-running path-builder against an evolved engine produces different results than source

The recipe captures ROLLED VALUES VERBATIM at posting time, so DLT can replay the exact look without invoking the path-builder, Sonnet, or Haiku at DLT time.

**Cast/subject is NOT in scope.** DLT is purely "render my new dream in this post's medium and visual look." User's subject, cast, photo all go through the normal create flow.

---

## Recipe schema (final)

```typescript
interface Recipe {
  version: 1;

  // LOOK ANCHORS — the only thing replayed at DLT time
  model: string;                    // 'black-forest-labs/flux-1.1-pro'
  flux_seed: number | null;         // captured if Replicate exposes it
  medium_key: string;               // 'plush_fabric'
  vibe_key: string;                 // 'cozy'
  prompt_prefix: string;            // bot.promptPrefix or per-medium override
  medium_style_override: string;    // bot.mediumStyles[medium] verbatim
  prompt_suffix: string;            // bot.promptSuffix or per-medium override
  camera: string | null;            // rolled camera_angles entry (null if path doesn't roll camera)
  lighting: string;                 // path-specific lighting + atmosphere combined entry
  scene_palette: string;            // sharedDNA.scenePalette
  color_palette: string;            // sharedDNA.colorPalette (vibe-color)
  chaos_block: string | null;       // injected chaos brief block if rolled
  sensory_block: string | null;     // injected sensory brief block if rolled
  blow_it_up_block: string | null;  // BLOW_IT_UP block text if path uses it

  // PROVENANCE (debug/fallback only — never used to drive DLT)
  bot_username: string | null;      // null for user-generated posts
  path: string | null;              // bot path name
  ai_prompt: string;                // full original Flux prompt (for fallback if recipe is corrupt)
}
```

**What's NOT in the recipe:** scene_text, cast_text, source_cast_role, face data, user_id (it's already on the upload row), uploaded photo URL, anything subject-related.

---

## DLT-time prompt assembly (when source has recipe)

```
[recipe.prompt_prefix]
[recipe.medium_style_override]
[USER'S NEW SUBJECT — verbatim or via normal create-flow Sonnet brief]
[recipe.camera if non-null]
[recipe.lighting]
[recipe.scene_palette]
[recipe.color_palette]
[recipe.chaos_block if non-null]
[recipe.sensory_block if non-null]
[recipe.blow_it_up_block if non-null]
[recipe.prompt_suffix]
```

Render via `recipe.model` with `recipe.flux_seed` if available.

**Cast/photo:** the user's normal create flow handles this. DLT just substitutes `medium_key`/`vibe_key`/style anchors into wherever the create flow uses user-selected medium/vibe.

---

## Implementation phases

### PHASE 1 — Recipe Capture (in progress)

Goal: every NEW post (bot or user) gets a recipe stored at posting time.

#### Files to create
1. **`supabase/migrations/143_uploads_recipe_jsonb.sql`** — adds `uploads.recipe JSONB` + `uploads.flux_seed BIGINT` columns
2. **`scripts/lib/recipeBuilder.js`** — pure Node function `buildRecipe(renderContext) → Recipe`
3. **`supabase/functions/_shared/recipeBuilder.ts`** — pure Deno/TS twin (verbatim port)

#### Files to modify
4. **`scripts/lib/botEngine.js`** — call `buildRecipe(...)` after all rolls are done, pass recipe to `postAsBot`, insert as part of upload row, capture seed from Replicate response if available
5. **`supabase/functions/generate-dream/index.ts`** — call `buildRecipe(...)` before upload insert, pass to insert
6. **`supabase/functions/nightly-dreams/index.ts`** — same as #5

#### Render context fields recipeBuilder needs
- `model` (from pickModel/modelByPath/etc.)
- `flux_seed` (from Replicate response, may be null)
- `medium_key` (resolved medium)
- `vibe_key` (resolved vibe)
- `prompt_prefix` (resolved per-medium or bot-level)
- `medium_style_override` (bot.mediumStyles[medium] or null)
- `prompt_suffix` (resolved per-medium or bot-level)
- `camera` (rolled value, may be null)
- `lighting` (rolled — includes atmosphere if combined into one entry)
- `scene_palette` (sharedDNA.scenePalette)
- `color_palette` (sharedDNA.colorPalette)
- `chaos_block` (from chaos layer if applied — already exists in render context)
- `sensory_block` (from sensory anchors layer if applied)
- `blow_it_up_block` (the block text if path used it — may not be in context; store as null if uncertain)
- `bot_username` (bot.username for bot renders, null otherwise)
- `path` (resolved path key)
- `ai_prompt` (final Flux prompt that was rendered)

Some of these (chaos_block, sensory_block, blow_it_up_block) require the engine to expose them after the brief assembly step. May need small refactor in botEngine.js to surface them.

#### Acceptance for Phase 1
- All new bot posts have populated `recipe` JSONB
- All new user-facing posts via generate-dream have populated `recipe`
- All nightly dreams have populated `recipe`
- Schema validation passes (Phase 1 tests)
- No regression in existing render pipeline

---

### PHASE 2 — DLT Recipe-Replay Mode (after Phase 1 stable)

Goal: when user does DLT on a recipe-tagged post, render uses recipe's look + normal create flow's subject/cast/photo handling.

#### Files to create
1. **`supabase/functions/_shared/recipeReplay.ts`** — pure function `assembleRecipeAnchors(recipe) → { mediumKey, vibeKey, mediumStyleOverride, lighting, paletteAnchors, ... }`
   - Returns the look anchors as separate fields (not pre-assembled prompt) so the create flow can integrate them with user's subject/cast naturally

#### Files to modify
2. **DLT entry point in app** — when user taps DLT on a post, fetch source's recipe; if present, use recipe-anchor mode; if null, fall back to existing style_summary mode
3. **`generate-dream/index.ts`** — accept optional `dlt_recipe` field in request; when present, lock medium/vibe/style anchors from recipe instead of using user-picker values
4. **Sonnet brief in create flow** — substitute recipe's medium directive instead of fetching from `dream_mediums`, substitute recipe's lighting/palette instead of rolling fresh, etc.
5. **Existing face-swap pipeline** — unchanged. Just runs against DLT-user's cast as in normal create.

#### Acceptance for Phase 2
- DLT on a recipe-tagged post: result visibly matches source's medium + look
- DLT on a non-recipe-tagged post (old): falls back to style_summary path (zero regression)
- DLT with self-ref: applies DLT-user's face via existing face-swap pipeline
- DLT with photo upload: routes through existing photo restyle pipeline with recipe's medium directive substituted

---

### PHASE 3 — Tests (parallel with Phase 1 + 2)

#### Phase 1 tests (recipe capture)
- `__tests__/lib/recipeBuilder.test.js` — 8-10 unit cases covering full context, missing optional fields, bot vs user, seed null/present
- `__tests__/lib/recipeSchema.test.js` — load 50 sample/production recipes, validate against schema
- 1 snapshot test for recipe shape (one representative bot path)

#### Phase 2 tests (recipe replay)
- `__tests__/lib/recipeReplay.test.js` — anchor extraction returns expected fields, handles null optional blocks
- 1 snapshot for full DLT-time prompt assembly (one representative path)
- `__tests__/lib/dltAdversarial.test.js` — empty subject, long subject, prompt-injection-style subject, non-English

#### Manual verification
- Render DLT on 5 different bot posts (toybot mech, cuddlebot plush, starbot cyborg, etc.) with various subjects
- Eyeball look fidelity vs source

---

### PHASE 4 — Cleanup + Docs (after Phase 2 ships)

- Document the recipe schema in `BOTS.md`
- Document the DLT pipeline in `DREAM_LIKE_THIS.md` (new) or extend existing
- Mark `style_summary` as legacy fallback for old posts (still useful, just not authoritative)

---

## Resume protocol (if Claude context auto-compacts)

If you're reading this after a compaction, here's what to check:

1. **Branch state**: `cd /Users/kevinmchenry/Development/apps/dreambot-toybot && git status && git log --oneline -10`
2. **Phase 1 progress markers**:
   - `ls supabase/migrations/143*` — does the migration file exist?
   - `ls scripts/lib/recipeBuilder.js` — does the Node module exist?
   - `ls supabase/functions/_shared/recipeBuilder.ts` — does the TS twin exist?
   - `grep "buildRecipe" scripts/lib/botEngine.js` — is botEngine wired?
   - `grep "buildRecipe" supabase/functions/generate-dream/index.ts` — is Edge wired?
3. **DB state**:
   ```sql
   -- Check column exists
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'uploads' AND column_name IN ('recipe', 'flux_seed');
   -- Check recent posts have recipes
   SELECT count(*), count(recipe) FROM uploads 
   WHERE created_at >= NOW() - INTERVAL '1 hour';
   ```
4. **Current STATUS section at top of this file** — should reflect actual progress

If anything is partially done, complete that file before moving on. Don't redo committed work; resume from where committed history shows.

---

## Status tracker (updated as we go)

- [x] **Phase 1.1** — Migration 143 written (PENDING APPLY in SQL editor)
- [x] **Phase 1.2** — `scripts/lib/recipeBuilder.js` created
- [x] **Phase 1.3** — `supabase/functions/_shared/recipeBuilder.ts` created (TS twin)
- [x] **Phase 1.4** — `botEngine.js` wired (recipe captured + inserted)
- [ ] **Phase 1.5** — Replicate seed capture for botEngine (deferred — null in Phase 1)
- [x] **Phase 1.6** — Phase 1 unit tests written (36 tests passing)
- [ ] **Phase 1.7** — Test render verifies recipe populated end-to-end (BLOCKED on migration apply)
- [ ] **Phase 1.8** — Commit Phase 1
- [ ] **Phase 2.1** — `recipeReplay.ts` shared module
- [ ] **Phase 2.2** — Edge Functions wired (`generate-dream`, `nightly-dreams`)
- [ ] **Phase 2.3** — App DLT entry point uses recipe path when available
- [ ] **Phase 2.4** — Phase 2 unit tests
- [ ] **Phase 2.5** — Manual verification: DLT 5 bot posts, eyeball look fidelity
- [ ] **Phase 2.6** — Commit Phase 2
- [ ] **Phase 3** — Cleanup, docs, deprecate paths
