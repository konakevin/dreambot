# V4 AI Generation Pipeline Hardening Plan

> Goal: take the AI generation pipeline from 3.5/5 to 4.5/5.
>
> **Dev context:** app is pre-launch, still in heavy development + testing.
> No production users to protect from regressions. Greenfield — OK to
> break things temporarily, OK to delete dead code wholesale, not required
> to preserve old architecture.
>
> Each phase is independently shippable and independently revertible.
> Pause points between phases so Kevin can inspect and greenlight.

---

## Architectural decisions (locked)

1. **Three pipelines, three Edge Functions** — no unified monolith.
   - `generate-dream/` → V4 user-initiated (text + optional photo reimagine with Flux Dev)
   - `nightly-dreams/` → full cron pipeline (currently a thin orchestrator; gets its full pipeline moved in)
   - `restyle-photo/` → photo-to-image transforms (Kontext Pro/Max + Flux-dev full-rebuilds like LEGO/Vinyl)
2. **`generate-dream` keeps its name** — zero client invoke-name changes.
3. **Photo reimagine stays in V4** (text-to-image with vision-describe). Photo restyle moves to `restyle-photo` (image-to-image).
4. **Shared post-processing in `_shared/`** — `sanitizePrompt`, `pickModel`, `generateImage`, `faceSwap`, `persistence`, `logging`. Pipeline-specific logic (Scene DNA, chaos layer, recipe engine) lives with its pipeline.
5. **Haiku for V4, Sonnet for nightly** — deliberate split, preserved.
6. **Legacy recipe path (Path 3 in current generate-dream) gets deleted** — pre-V4 dead code.
7. **Dead code removed wholesale** — `dream_templates` table, the broken `recentPhrases` in-memory cache in `sceneExpander`, any other vestigials the architecture dive flagged.
8. **No dual-write, no feature flags, no staging environment** — pre-launch solo-dev workflow.
9. **All testing uses Kevin's admin account** (`konakevin@gmail.com`) — lets him test onboarding + cast updates in the same loop. Test renders tagged with `smoke:` caption prefix for easy cleanup.

---

## Pipeline ground truth (captured 2026-04-16)

Current monolith: `supabase/functions/generate-dream/index.ts` (2060 lines) handles all three pipelines via branching on request body signals.

**Decision tree in current code:**
- Line 451: `isNightly` check → Path 1 (nightly via generate-dream)
- Line 964: `medium_key || vibe_key` → Path 2 (V2 engine: reimagine / restyle / text-path)
- Line 1280+: fallback → Path 3 (legacy recipe — slated for deletion)

**Pipeline-owned helpers (move INTO their pipeline):**
- `sceneEngine.ts` — nightly Scene DNA only → moves into `nightly-dreams/lib/`
- `sceneExpander.ts` — V4 only → moves into `generate-dream/lib/`
- `chaosLayer.ts` — V4 only → moves into `generate-dream/lib/`
- `recipeEngine.ts` — legacy Path 3 → **deleted entirely** with Phase 3
- `dreamAlgorithm.ts` — nightly only → moves into `nightly-dreams/lib/`
- `photoPrompts.ts` — photo restyle only → moves into `restyle-photo/lib/`
- `dreamTemplates.ts` — dead file (unused) → **deleted entirely** with Phase 1

**Truly shared (stay in `_shared/`):**
- `promptCompiler.ts` — used by V4 + nightly (both build Sonnet/Haiku briefs the same way)
- `castResolver.ts` — V4 + nightly (same cast resolution logic)
- `renderEntity.ts` — V4 + nightly (embodied trait extraction)
- `selfInsertDetector.ts` — V4 + nightly (self-reference detection)
- `dreamStyles.ts` — all three (DB lookup for medium + vibe)
- `vision.ts` — V4 + nightly + restyle-photo (Haiku vision wrapper)
- `vibeProfile.ts` — shared types
- Plus new shared post-processing modules (see Phase 3)

---

## Smoke test matrix

Run before and after every phase. All use Kevin's admin account. Renders tagged with `smoke:` caption prefix.

| # | Pipeline | Prompt | Medium | Vibe | What it exercises |
|---|---|---|---|---|---|
| 1 | V4 self-insert (natural) | "put me in a foggy forest at dawn" | photography | cinematic | Face-swap, Haiku, natural render mode |
| 2 | V4 self-insert (embodied) | "put me in a foggy forest at dawn" | lego | cinematic | buildRenderEntity trait fill, no face swap |
| 3 | V4 text directive | "a fox in a forest at sunset" | watercolor | peaceful | No cast, pure scene |
| 4 | V4 DLT style transfer | hint + style_prompt | pencil | dreamy | Style reference brief |
| 5 | V4 photo reimagine | upload selfie + "on a cliff at sunset" | canvas | epic | Vision describe + Haiku + Flux Dev |
| 6 | Nightly full pipeline | simulated via test mode | forced medium | forced vibe | Scene DNA + Sonnet + face swap |

Pass criteria: Each produces `enhanced_prompt` within 5 words of pre-phase baseline (non-determinism OK; semantic change not). Visual inspection: Kevin confirms images equivalent.

Post-phase cleanup: `DELETE FROM uploads WHERE user_id = kevin_id AND caption LIKE 'smoke:%'`

---

## Phase 1 — Observability + schema cleanup (2-3h)

**Scope:** expand `ai_generation_log` to capture the full LLM conversation + fallback audit trail. Drop dead schema.

**Migration (`supabase/migrations/NNN_ai_log_full_brief.sql`):**
```sql
-- Observability columns
ALTER TABLE ai_generation_log
  ADD COLUMN sonnet_brief TEXT,
  ADD COLUMN sonnet_raw_response TEXT,
  ADD COLUMN haiku_brief TEXT,
  ADD COLUMN haiku_raw_response TEXT,
  ADD COLUMN vision_description TEXT,
  ADD COLUMN fallback_reasons TEXT[],
  ADD COLUMN replicate_prediction_id TEXT;

-- Dead schema
DROP TABLE IF EXISTS dream_templates;
-- transform_quality column: leave for now, revisit in Phase 3 if unused
```

**Code changes in `generate-dream/index.ts`:**
- Every `nightlySonnet`, `enhanceViaHaiku`, `haikuJson` call site → capture brief (input) + raw response (output) into locals.
- Every `describeWithVision` call → capture description into locals.
- Every silent fallback site (see architecture dive inventory) → `fallbackReasons.push('name_of_fallback_reason')`.
- `generateImage` → capture and return Replicate `prediction_id`.
- Final `ai_generation_log` insert → include the new fields.

**Helper signature change (`_shared/vision.ts`):** return description directly (some callers already do; confirm all).

**Helper signature change (`_shared` LLM callers):** `nightlySonnet`/`enhanceViaHaiku`/`haikuJson` return `{ text, brief, rawResponse }` instead of just `text`. Callers update accordingly.

**Behavior preservation:**
- No existing column modified. Only additive schema changes.
- No prompt construction changes.
- No model calls change.
- Smoke-test matrix: identical `enhanced_prompt` + `image_url` across all 6 renders.

**Rollback:** revert the commit; new columns can stay (additive is safe).

**Success criteria:**
- Every new generation populates new columns (nulls where path doesn't use that LLM).
- `fallback_reasons` is a non-null array; empty array if no fallbacks fired.
- Kevin can query any generation and see the full brief chain.

---

## Phase 2 — Edge Function type checking (1-2h)

**Scope:** close the gap where `tsconfig` excludes Supabase functions. The `chaosInjections` → `chaosTags` rename bug slipped to runtime because of this.

**CI change (`.github/workflows/ci.yml`):**
- Add a step that installs Deno and runs `deno check supabase/functions/*/index.ts`.
- All three functions (`generate-dream`, `nightly-dreams`, later `restyle-photo`) checked.

**Fix errors that surface:** small type mismatches, unused imports. Each is a small commit; none should change runtime behavior.

**Behavior preservation:**
- Type-only fixes. Runtime unchanged.
- Smoke-test matrix after each type fix cluster.

**Rollback:** revert the CI step. Type errors persist, no runtime impact.

**Success criteria:**
- `deno check` green on all Edge Functions
- CI catches future rename-drift bugs before deploy

---

## Phase 3 — The big split (4-6h)

**Scope:** rewrite `generate-dream` as V4-only, move nightly pipeline fully into `nightly-dreams`, create new `restyle-photo` Edge Function.

### Sub-step 3.1 — Extract shared post-processing to `_shared/`

New modules:
- `_shared/sanitize.ts` — `sanitizePrompt` (moved from generate-dream)
- `_shared/modelPicker.ts` — `pickModel`, `force_model` override logic
- `_shared/generateImage.ts` — Replicate submit + poll, NSFW handling
- `_shared/faceSwap.ts` — codeplugtech/face-swap wrapper
- `_shared/persistence.ts` — image upload to Storage, upload row creation
- `_shared/logging.ts` — `ai_generation_log` insert with Phase 1 fields

Each is a pure module that existing Edge Function code imports. No behavior change during extraction.

### Sub-step 3.2 — Rewrite `generate-dream` as V4-only

Structure:
```
supabase/functions/generate-dream/
  index.ts                  # router: 200 lines max
  lib/
    sceneExpander.ts        # moved from _shared
    chaosLayer.ts           # moved from _shared
  handlers/
    selfInsert.ts           # self-insert path
    textDirective.ts        # text directive + surprise
    styleTransfer.ts        # DLT
    photoReimagine.ts       # photo reimagine (Flux Dev with vision-describe)
```

**Deletions during rewrite:**
- Path 3 legacy recipe code (lines 1280+)
- `recipeEngine.ts` entirely (unused once Path 3 is gone)
- Broken `recentPhrases` cache in `sceneExpander.ts` (was a no-op anyway)

Router (`index.ts`) detects inputType from request body, dispatches to handler, handler returns final prompt → router runs shared post-processing (sanitize → pickModel → generateImage → faceSwap → persist → log).

### Sub-step 3.3 — Move nightly pipeline into `nightly-dreams`

Currently `nightly-dreams/index.ts` is a thin orchestrator that calls `generate-dream`. Post-refactor, it owns the full pipeline.

Structure:
```
supabase/functions/nightly-dreams/
  index.ts                  # cron entry point + batch loop + full pipeline
  lib/
    sceneEngine.ts          # moved from _shared
    dreamAlgorithm.ts       # moved from _shared
```

The cron orchestrator loop stays the same (eligible users → batch 5 at a time). Each iteration builds the prompt locally and calls shared post-processing directly.

Remove the nightly path from `generate-dream` (Line 451-964 block deleted).

### Sub-step 3.4 — Create `restyle-photo` Edge Function

New function:
```
supabase/functions/restyle-photo/
  index.ts                  # ~300 lines
  lib/
    photoPrompts.ts         # moved from _shared
```

Handles:
- Kontext restyle (no prompt) — Kontext Pro/Max transforms photo in place
- Kontext restyle with hint (user uploads photo + types prompt, Kontext transforms)
- Flux-dev full rebuild (LEGO, Vinyl mediums)

Shared with generate-dream: `_shared/vision.ts`, `_shared/dreamStyles.ts`, `_shared/persistence.ts`, `_shared/logging.ts`.

Remove photo restyle code from `generate-dream` (Line 1054-1094 block deleted).

### Sub-step 3.5 — Update client code

`lib/dreamApi.ts`:
- New `restylePhoto()` function that invokes `restyle-photo` for photo restyle
- Existing `generateFromVibeProfile()` continues to invoke `generate-dream` for V4 (including photo reimagine)

Client call-site audit: anywhere that calls `generate-dream` with photo restyle shape → point to `restyle-photo` instead.

### Sub-step 3.6 — Smoke test matrix + deploy

Run all 6 smoke tests. Visual inspection on each. Commit per sub-step, deploy all at once (all three Edge Functions redeployed together).

**Behavior preservation:**
- Prompt construction logic is re-homed, not rewritten. Same builders.
- Shared post-processing moves to `_shared/`, called identically.
- Smoke tests verify semantic equivalence.

**Rollback:** per-commit revert. Each sub-step is its own commit.

**Success criteria:**
- `generate-dream/index.ts` is <300 lines
- Nightly pipeline fully in `nightly-dreams` (no delegation to generate-dream)
- Photo restyle in its own function
- All 6 smoke tests pass
- Legacy recipe path deleted
- `_shared/` contains only truly shared code

---

## Phase 4 — Fallbacks + per-medium routing + polish (2-3h)

### Sub-step 4.1 — Replace silent fallbacks with explicit handling

Walk the architecture dive inventory (~20 fallbacks). For each:
- If defensive + genuine degradation: keep, push reason to `fallback_reasons` array
- If masking a bug: throw with descriptive error, let caller handle
- If unreachable in practice: delete

Specific ones to handle:
- `castResolver.ts` empty description → throw if cast member role != 'pet' and no description
- `generate-dream` Sonnet too-short response → log + use fallback (defensive; real failure mode)
- `renderEntity.ts` trait extraction defaults → log which defaults fired (e.g. `trait_defaults: ['hairColor', 'age']`)
- `sceneExpander` pool exhaustion → throw (shouldn't ever happen)

### Sub-step 4.2 — Per-medium model routing

Schema:
```sql
ALTER TABLE dream_mediums ADD COLUMN preferred_model TEXT;

-- Seed with current production defaults
UPDATE dream_mediums SET preferred_model = 'black-forest-labs/flux-dev'
  WHERE key = 'photography';
UPDATE dream_mediums SET preferred_model = 'black-forest-labs/flux-2-dev'
  WHERE preferred_model IS NULL;
```

Code change in `_shared/modelPicker.ts`:
```typescript
export async function pickModel(
  mode: string,
  prompt: string,
  mediumKey?: string,
  forceModel?: string
): Promise<{ model: string; inputOverrides: Record<string, unknown> }> {
  if (forceModel) return { model: forceModel, inputOverrides: {} };
  if (mode === 'flux-kontext') return { model: 'flux-kontext-pro', ... };

  if (mediumKey) {
    const preferred = await getPreferredModelForMedium(mediumKey);
    if (preferred) return { model: preferred, inputOverrides: {} };
  }

  // Fallback heuristics (anime/pixels → SDXL)
  if (mediumKey && SDXL_ALWAYS.has(mediumKey)) return { model: 'sdxl', ... };

  return { model: 'black-forest-labs/flux-2-dev', inputOverrides: {} };
}
```

DB cache in memory (1-min TTL) so we don't hit DB on every generation.

### Sub-step 4.3 — Unit tests for key helpers (lightweight)

Write tests for the helpers that aren't trivially verified by smoke tests:
- `selfInsertDetector` — false positives + true positives across 20+ prompts
- `renderEntity` — trait extraction across real cast descriptions, each embodied template
- `promptCompiler` — snapshot tests per inputType
- `modelPicker` — per-medium preference routing

Focused, not exhaustive. ~30 tests total across these files.

### Sub-step 4.4 — Cleanup

- Drop any unused columns that surfaced (e.g. `transform_quality` if confirmed unused)
- Remove any lingering dead imports
- Update memory notes: mark `project_v4_brittleness_audit.md` as resolved; add new notes for any open architectural questions

**Behavior preservation:**
- Per-medium routing seeded to match current defaults exactly
- Fallback changes: "silent" → "logged" is not a behavior change at the output layer
- Smoke test matrix after each sub-step

**Rollback:** per-sub-step revert. Migration rollback available for schema changes.

**Success criteria:**
- Every fallback in architecture dive inventory is either logged, thrown, or deleted
- Each medium has an explicit `preferred_model`
- Unit tests catch future regressions in shared helpers
- No dead columns or unused imports remain

---

## Open questions — parking lot

- **Kontext-max Haiku-rewrite indirection** (currently at `generate-dream/index.ts:1060`): does sending the brief to Haiku first and then to Kontext actually improve output, or is direct Kontext equal/better? A/B test one medium in Phase 3 before deleting the rewrite step. If Haiku rewrite proves useful, swap it to Sonnet to consolidate on one prompt-writing LLM.

---

## Sign-off requested

Three questions:

1. **Phase ordering correct?** 1 (observability) → 2 (typecheck) → 3 (big split) → 4 (fallbacks + routing + polish).
2. **Phase 3 sub-steps OK?** Extract shared → rewrite generate-dream → move nightly → create restyle-photo → update client → smoke test. One per commit.
3. **OK to delete the legacy recipe path + `recipeEngine.ts` outright in Phase 3?** (Already agreed in principle; confirming for the record.)

Say go and I'll start Phase 1 now.
