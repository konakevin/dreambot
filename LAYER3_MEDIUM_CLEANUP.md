# Layer-3 / Face-Swap Medium Override Cleanup

> **Status: design doc, not yet implemented.** Any agent picking this up should read this in full
> AND re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` before touching medium/face-swap code, and confirm the
> "Open decisions" with Kevin first. Authored 2026-06-15 after a DinoBot-style "the eyes got all
> fucked up" render was traced to the override stack below.

## Context & background

DreamBot renders "character dreams" — the user (+ optional +1) appear in a generated scene in a
chosen visual MEDIUM (storybook, watercolor, lego…). Mediums live in the `dream_mediums` Postgres
table with style copy + flags. Two render strategies:

- **natural** (`character_render_mode='natural'`, `face_swaps=true`): Flux renders a realistic
  person, then the user's REAL face is composited via the face-swap pipeline
  (`dualFaceSwap` / `face-swap-dual`).
- **embodied** (`character_render_mode='embodied'`, `face_swaps=false`): the cast is rendered AS a
  medium-native look-alike (LEGO minifig of you, clay figure, storybook character) — NO real-face
  swap. Sonnet + the medium's `directive` do the stylization.

Over time, **three stacked style layers** accreted for face-swap renders, plus a 4th model-pool and
a parallel Create-side system. A single render's style can be silently overwritten twice.

## The layers (what controls a face-swap render's style)

- **Layer 1 — `dream_mediums.flux_fragment`** (DB): the medium's normal style string. Every non-swap
  render.
- **Layer 2 — `dream_mediums.face_swap_flux_fragment` + `face_swap_directive`** (DB), applied by
  `_shared/faceSwapFluxOverrides.ts::applyFaceSwapOverride(medium)`. Per-medium swap-tuned rewrite,
  used by BOTH nightly + Create face-swap briefs. **Only 3 mediums have it filled in: storybook,
  fairytale, pencil.** The other ~39 `face_swaps=true` mediums leave it NULL → fall back to Layer 1.
  Call sites: `nightly-dreams/index.ts:648`, `dualBriefBuilder.ts:36`, `singleBriefBuilder.ts`.
- **Layer 3 — `_shared/faceSwapModelOverrides.ts::pickFaceSwapModelOverride(model, vibe)`** (CODE).
  A hardcoded 4-fragment RANDOM rotation that exists ONLY for `black-forest-labs/flux-1.1-pro`.
  Called ONLY in `nightly-dreams/index.ts:703`. When it fires it **DISCARDS the rolled medium's
  `fluxFragment`** and substitutes one of 4 fixed fragments at random:
  `FRAG_WATERCOLOR_INK_STORYBOOK`, `FRAG_CRISP_ORNATE_ILLUSTRATION`, `FRAG_POLISHED_DIGITAL_RENDER`,
  **`FRAG_ADULT_CARTOON`** (comic/2D — breaks swapped eyes; only `bannedVibes:['epic']`).
  Stated rationale in-file: *"flux-1.1-pro ignores stylized fragments and defaults to photoreal — so
  we lock it to a curated 'art' style it renders well."*
- **Layer 4 — nightly render-model pool**: `nightly-dreams/index.ts:688` local
  `FACE_SWAP_MODELS = [flux-dev, flux-1.1-pro, flux-1.1-pro-ultra, gemini-2-image, gpt-image-2]`,
  random-picked as the Flux RENDER model. `flux-1.1-pro` triggers Layer 3. `flux-1.1-pro-ultra` is
  in the pool but its dual swaps 546-fail (Layer 3 excludes it; generate-dream clamps ultra→pro for
  dual at `:1207`).
- **Parallel Create system**: the CREATE path does NOT use Layer 3. It uses
  `_shared/createFaceSwapOverrides.ts::pickCreateFaceSwapOverride()`, a DB-driven per-(model×medium)
  override table `face_swap_model_overrides` (migration 266). So there are TWO independent
  "model-level style override" systems for one concept (nightly hardcoded vs Create DB table).
- **NOT related**: `_shared/faceSwap.ts` has its own `FACE_SWAP_MODELS` (cdingram/yan-ops/
  pikachupichu25) — that's the Replicate SWAP-service chain. Do NOT touch.

`faceSwapEligible` gate (the AND-gate that turns swap on): `nightly-dreams/index.ts:631` →
`isCharacterDream && medium.faceSwaps && characterRenderMode==='natural'`. Create mirror:
`generate-dream/index.ts:659/:883` → `characterRenderMode==='natural'`.

## The problem

1. On **nightly + flux-1.1-pro**, the medium's own fragment is thrown away — `storybook` /
   `watercolor` / `canvas` / `illustration` all render as a random pick of the same 4 generic styles.
   **The medium label is cosmetic on that path** (~20% of nightly face-swaps, since flux-1.1-pro is
   1 of 5 pool models).
2. `FRAG_ADULT_CARTOON` renders **2D comic faces**; compositing a real face onto a cartoon face →
   **warped/uncanny eyes** (the reported "eyes got fucked up"). Banned only for `epic`; fires on
   every other vibe (~1-in-4 of flux-1.1-pro nightly face-swaps).
3. Layer 2 is half-finished (3 of 42 mediums) → inconsistent.
4. Two parallel model-override systems (nightly hardcoded vs Create DB) for one concept = drift-prone.
5. Root design error: **fragment hot-swapping to compensate for a MODEL being bad at a medium.** The
   right lever is model SELECTION (`allowed_models`), never replacing the medium's style.

## Audit / pervasiveness (`dream_mediums`, 2026-06-15)

- 112 medium rows; **42 `face_swaps=true`**; ~12 active user-facing FACE mediums.
- Active face-swap mediums that allow flux-1.1-pro (→ exposed to Layer 3): `canvas, comics,
  fairytale, illustration, pencil, render, storybook, watercolor`.
- Only `storybook, fairytale, pencil` have a Layer-2 `face_swap_flux_fragment`.

## The solution

**Principle: the medium's fragment is the single source of truth for style. Model fitness is handled
by `allowed_models`, never by replacing the medium's style.**

### Phase A — Rip out Layer 3 (nightly hardcoded rotation)
- Delete `supabase/functions/_shared/faceSwapModelOverrides.ts`.
- Remove the import at `nightly-dreams/index.ts:65` and the `if (modelOverride)` block at `:703–712`.
- Update the stale comments at `nightly-dreams/index.ts:667–668`.
- Update `__tests__/lib/faceSwapOverrides.test.ts` (it asserts the Layer-2 wiring; add an assertion
  that `pickFaceSwapModelOverride` / `faceSwapModelOverrides` is gone).

### Phase B — Fix the real lever: nightly render-model selection
- Layer 3 existed because flux-1.1-pro renders stylized swap fragments as photoreal. So REMOVE
  `flux-1.1-pro` and `flux-1.1-pro-ultra` (which 546-fails dual) from nightly `FACE_SWAP_MODELS`
  (`:688`). Pool → `[flux-dev, gemini-2-image, gpt-image-2]` (file notes flux-dev/2-dev "follow
  stylized mediums faithfully").
- DECISION: flux-1.1-pro may be fine for REALISTIC swap mediums (photography/canvas/hyperreal) where
  photoreal is desired. Recommended end-state: drive the nightly face-swap render model from the
  medium's DB `allowed_models` / `preferred_model` (already present) instead of a hardcoded global
  list — unifies with how Create picks models and respects per-medium fitness.

### Phase C — Per-medium face-swap-vs-embodied pass (the real quality fix)
Illustrated/2D mediums should be EMBODIED look-alikes, not real-face swaps (a real face never lands
on 2D art); realistic/painterly mediums keep face-swap.
- Flip to embodied (`character_render_mode='embodied', face_swaps=false`): **storybook** (now), then
  audit `comics, illustration, pencil, fairytale, pop_art, vaporwave`, anime-ish.
- Keep natural face-swap: `photography, canvas, hyperreal, render`, and verify `watercolor`.
- Mostly a DB change (no code) BECAUSE the embodied transform is **directive-driven** — Sonnet
  stylizes from the medium `directive`; `_shared/renderEntity.ts::buildRenderEntity` exists but is
  LEGACY/UNUSED (`castResolver.ts` passes the raw description through). When flipping, REWRITE the
  medium's base `directive` + `flux_fragment` to lean FULLY into the aesthetic and strip the
  swap-era cruft ("naturalistic adult faces", "naturally-sized human features"). Storybook's existing
  rich base `directive` (Eric Carle / Beatrix Potter / Sendak) is the model to emulate.
- ⚠ BIGGEST RISK — VERIFY FIRST: embodied mediums are filtered OUT of the broad nightly CHARACTER
  pool (`dreamStyles.ts:276` excludes `characterRenderMode==='embodied'`) and enter via scene /
  `scene_embodied_rate` paths. CONFIRM an embodied medium still renders the CAST as characters in
  nightly (trace how `lego`/`claymation` do it) so flipping storybook doesn't make it vanish from
  character dreams or drop the user. Validate before flipping.

### Phase D — Unify the Create-side parallel system + trim Layer 2
- Audit the `face_swap_model_overrides` DB table (Create path, `createFaceSwapOverrides.ts`) for the
  same cartoon/style-replacement problem; decide keep-DB-driven vs collapse to "medium fragment is
  truth."
- Collapse Layer 2 where unneeded: once swap is reserved for realistic mediums, most won't need a
  separate `face_swap_flux_fragment` (their base fragment already renders realistic faces).

## Critical files

- `supabase/functions/_shared/faceSwapModelOverrides.ts` — **DELETE** (Layer 3).
- `supabase/functions/nightly-dreams/index.ts` — import+call removal (`:65`, `:703–712`), trim
  `FACE_SWAP_MODELS` (`:688`), comments (`:667`); `faceSwapEligible` gate (`:631`); embodied flags
  (`:563`, `:900` wide-spot filter).
- `supabase/functions/generate-dream/index.ts` — `faceSwapEligible` (`:659/:883`), ultra→pro dual
  clamp (`:1207`), Create override via `createFaceSwapOverrides`.
- `supabase/functions/_shared/faceSwapFluxOverrides.ts` — Layer 2 (keep; maybe trim usage).
- `supabase/functions/_shared/createFaceSwapOverrides.ts` + migration 266 `face_swap_model_overrides`
  — Create parallel system to audit.
- `supabase/functions/_shared/dreamStyles.ts` — `characterRenderMode` read (`:92`), embodied pool
  filtering (`:276`, `:316`).
- `supabase/functions/_shared/castResolver.ts` — `resolveCastForPrompt`; embodied is directive-driven
  (buildRenderEntity unused).
- `supabase/functions/_shared/renderEntity.ts` — LEGACY/unused embodied templates (decide delete vs
  revive).
- `__tests__/lib/faceSwapOverrides.test.ts` — update wiring assertions.
- DB `dream_mediums` rows (`character_render_mode`, `face_swaps`, `directive`, `flux_fragment`,
  `face_swap_*`) — changed via Supabase SQL editor (data only, no schema → no type regen).

## Deploy / sequencing
- Code edits → `supabase functions deploy nightly-dreams --no-verify-jwt` +
  `supabase functions deploy generate-dream --no-verify-jwt`.
- DB medium flips → run in Supabase SQL editor (values only).
- Re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` before medium/prompt work (mandatory per CLAUDE.md) and add
  any new lessons.
- Per CLAUDE.md medium checklist: re-check `_shared/photoPrompts.ts` MEDIUM_CONFIGS +
  `__tests__/lib/photoPrompts.test.ts` (photo-restyle path; render-mode flips shouldn't affect it,
  but confirm).

## Verification
1. CI: `npm run check` green; update `faceSwapOverrides.test.ts`.
2. Nightly: render a batch of face-swap nightly dreams (`scripts/nightly-dreams.js` locally / qa
   harness) on the kept models (flux-dev/gemini/gpt) and confirm the rolled MEDIUM's actual style
   appears (not the 4-way rotation) and eyes land cleanly. No flux-1.1-pro on face-swap.
3. Storybook-as-embodied: trigger nightly storybook character dreams — user renders as a storybook
   look-alike (no real-face swap, clean illustrated faces), still appears as a character (not
   vanished), full storybook aesthetic.
4. Create: generate dual-cast dreams on the formerly-cartoon mediums; confirm clean faces; audit
   `face_swap_model_overrides` DB table for cartoon entries.
5. Cross-reference Kevin's hearts.

## Open decisions for the implementer (confirm with Kevin)
- Exact list of mediums to flip to embodied vs keep face-swap (Phase C).
- Drive nightly face-swap render model from per-medium `allowed_models` (recommended) vs a trimmed
  global pool.
- Rip/standardize the Create-side `face_swap_model_overrides` table, or leave it.
- Fate of legacy `renderEntity.ts` (delete vs revive for deterministic embodied transforms).
