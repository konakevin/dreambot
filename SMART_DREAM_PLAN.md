# Smart Dream — Model × Medium Optimization Plan

**Status:** Plan for review. Implementation gated on Kevin's go/no-go after reviewing the
model×medium gallery (`~/dreambot-model-matrix/index.html`).

**Goal:** Never let a customer pick a style and get the wrong look. If someone chooses watercolor,
they get a watercolor (or a close/semi-stylized render), *never* a photographic one. "Smart Dream"
is the compatibility layer that only ever surfaces — and only ever renders — model×medium
combinations that deliver on the promise.

---

## 1. The core problem (root-caused)

Style fidelity is a function of **the model**, not the prompt. The matrix (12 models × 7 real-face
mediums × 3 cast configs = 252 renders, graded) proved it:

- **Style-faithful models:** `flux-2-max / flux-2-flex / flux-2-pro / flux-2-dev`, `gpt-image-2 /
  gpt-image-1`, `gemini-2-image` (Nano Banana), `gemini-3-image-preview` (Nano Banana Pro).
- **Photoreal-drift models:** `flux-1.1-pro`, `flux-1.1-pro-ultra`, `flux-dev` — they render
  painterly styles (watercolor, pencil, canvas-oil) as glossy photos, and graphic styles
  (pop-art, comics, illustration) as semi-real. **Correct only for `photography`.**
- **Exclude:** `flux-schnell` (crude + face-swap quality risk), `flux-krea-dev` (times out).

Two independent defects let the wrong model reach a stylized render today:

1. **The create path ignores the medium's model pool.** `pickModel()` respects
   `dream_mediums.allowed_models`, but the create path overrides its result with `force_model`
   (`generate-dream/index.ts:1566` — `pickedModel = newSceneRefModel || force_model ||
   autoPicked.model`). The client **always** sends `force_model` (`create.tsx:583-589`), so
   `allowed_models` has near-zero effect on create renders.
2. **The live pools themselves include photoreal models on stylized mediums.** Live values (edited
   by hand) currently list `flux-1.1-pro` / `flux-1.1-pro-ultra` on watercolor & canvas, and
   `flux-1.1-pro` / `flux-dev` / ultra on comics — so even the auto-picker can roll a photo.

Kevin's own bug was the sharpest version: his account's `pro_mode_flux_model = flux-1.1-pro-ultra`
→ clamped to `flux-1.1-pro` on face-swaps → `force_model` = a photoreal model → every stylized
dream came out photographic, `allowed_models` never consulted.

**Conclusion: Smart Dream needs BOTH (a) correct per-medium model data AND (b) code that actually
enforces it on the create/charge path.** Editing the data alone does nothing while `force_model`
bypasses it.

---

## 2. How the pipeline works today (4-subsystem synthesis)

### Client (Create screen)
- `components/ModelPicker.tsx:66-67` builds the visible model list filtered **only** by DreamBot
  mode (`dreamBotEnabled`), never by medium. The picker is passed **no medium** (`create.tsx:1169`).
  "No per-medium steering" is an explicit current design note.
- The client does **not** know each medium's model pool: `get_dream_mediums` RPC does not return
  `allowed_models`. It **does** return `client_meta` (jsonb), already used for `restyle_models` /
  `recommended_models` — a zero-migration channel to hand the client a per-medium allow-list.
- Model pick → `selectedModelId` (local `create.tsx:206`) → `force_model` via the routing effect
  (`create.tsx:583-589`) → dream request (`useDreamCreate.ts:314/342/372`). Surprise-Me already
  does client-side medium-pool logic (`useDreamCreate.ts:140-179`).
- `ModelPicker.handleSelect` also **persists the pick to `users.pro_mode_flux_model`**
  (`ModelPicker.tsx:105-123`) — this is how that column gets set.
- Displayed sparkle price is computed from `selectedModelId` (`create.tsx:564-577`).

### Server (model routing)
- `pickModel(mode, prompt, medium, vibe)` precedence (`modelPicker.ts:106-143`): kontext → SDXL
  (empty) → **`model_overrides[medium|vibe]`** → **`dream_mediums.allowed_models[medium]`** →
  `DEFAULT_MODEL = flux-1.1-pro`. It **never leaves the pool** except the default fallback.
- `generate-dream/index.ts:1566`: `pickedModel = newSceneRefModel || force_model ||
  autoPicked.model` — **`force_model` overrides the pool.** `pro_mode_flux_model` is injected into
  `force_model` only on the Direct pass-through path when `force_model` is absent (`:1413-1422`).
- Ultra→Pro face-swap clamp (`:1585-1591`) is narrow (only `flux-1.1-pro-ultra`, only on swaps),
  and does not consult the medium.

### Pricing (the invariant to protect)
- Sparkle cost is **model-driven**: `getSparkleCost(force_model)` at charge time
  (`enqueue-dream/index.ts:264-271`, `generate-dream/index.ts:526-533`). Costs: `gemini-3` = 5✦;
  `flux-2-max` / `gpt-image-1` = 3✦; `flux-1.1-pro-ultra` / `flux-2-flex` / `gpt-image-2` = 2✦;
  everything else = 1✦.
- **Charge == rendered model is a live invariant** because `force_model` sets both. On the queue
  path the **charge happens in `enqueue-dream` before `generate-dream` renders**, so any server
  coercion done in `generate-dream` would silently diverge charge from render. New Scene is the one
  flat-priced exception (tier enum, never `force_model`).

### DB config
- **`dream_mediums.allowed_models`** is the single field `pickModel` honors for the create/
  face-swap path, for every medium regardless of vibe. Editable by plain SQL, cached 60s, not
  exposed via RPC. **Primary lever.**
- `model_overrides(medium_key, vibe_key, allowed_models)` = higher-precedence, vibe-specific
  subset (1 row today: `photography|coquette → flux-dev, flux-1.1-pro`).
- `scene_eligible_models` = **nightly-only**, not read by the create picker. Wrong lever.
- **`allowed_models` is shared with BOTS and NIGHTLY** — bots' separate picker
  (`scripts/lib/modelPicker.js`) reads the same column and intersects a per-bot whitelist; nightly
  layers pins/bans on it. Shrinking it affects them.

---

## 3. Cross-path blast radius (what a naive restriction breaks)

| Risk | Detail | Mitigation |
|---|---|---|
| **Charge ≠ render** | Coercing `force_model` server-side after the charge (charge is in `enqueue`) makes the user pay for A, render B | Coerce **before** the charge block in **both** `enqueue-dream` and `generate-dream`, and recompute `getSparkleCost` from the coerced model |
| **Displayed price lies** | Dream-button price is from `selectedModelId` (`create.tsx:564-577`); if the picker shows a model the server will override, the shown price is wrong | Filter the picker by medium so an invalid model is never shown/selected |
| **`pro_mode_flux_model` sticky** | A pinned photoreal model is invalid on stylized mediums (client picker + Direct-mode server fallback both assume it's valid) | Same clamp client + server; existing `savedHidden` fallback (`ModelPicker.tsx:137-143`) handles only `dreamBotEnabled` — extend to per-medium |
| **Nightly / first-dream** | Re-pick freely (free), but shrinking `allowed_models` can empty their pin/ban intersections → silent fall to `flux-1.1-pro` | Verify each medium's post-cleanup pool keeps ≥1 model through nightly's gates |
| **Bots share the column** | `scripts/lib/modelPicker.js` reads `dream_mediums.allowed_models` (and `client_meta` **zero** times), and references user-facing medium keys in hundreds of files | **RESOLVED by construction** (§5): Smart Dream lives in `client_meta.smart_dream_models` and never edits `allowed_models`, so bots read identical data + run a separate picker → provably unchanged |
| **DLT replay** | Freezes the source post's model as `force_model` (`generate-dream:360`); the "reproduce this exact look" contract | **Skip coercion for DLT** (its model already rendered the look the user is replaying) |
| **Restyle** | Uses a **separate** pool (`client_meta.restyle_models`), not `allowed_models` | Smart Dream targets the text/self-insert create path; restyle is out of scope (its own pool) |
| **Global `force_model` validation** | `isKnownModel` validates against the full catalog, not per-medium, in both `enqueue` + `generate` | Add the per-medium check in **both** (they charge independently) |
| **Tests** | `modelPicker*`, `modelPricing`, `imageModels`, `securityHardening281` lock current shapes | Update + add a Smart-Dream coercion test and a content-lock on the per-medium sets |

---

## 4. Smart Dream — recommended design (three layers)

**Scope: DreamBot mode only (`use_exact_prompt === false`).** Direct mode is exempt on both client
and server — it applies no medium/style directive and runs no face swap (photo-gated off at
`create.tsx:442`; cast/self-insert gated on `!use_exact_prompt` at `generate-dream:1164`), so there
is no style promise to protect and the user's explicit model choice stands. Photo paths (New Scene,
Restyle) and DLT replay are also exempt (own model selectors / frozen-model contract). Smart Dream
governs exactly the DreamBot text/self-insert render path where "pick a style → get that style" lives.

### Layer 1 — Data: per-medium approved model set (the go/no-go surface)
The matrix verdicts become a per-medium allow-list. This is exactly what Kevin approves from the
gallery. Proposed sets (photography stays wide because realistic *is* the goal there):

| Medium | Approved models (Smart Dream) | Recommended default |
|---|---|---|
| **photography** | all quality models incl. `flux-1.1-pro`, `flux-1.1-pro-ultra`, `flux-dev`, flux-2 family, gpt, gemini | `flux-1.1-pro` |
| **watercolor** | `flux-2-max/flex/pro/dev`, `gpt-image-2/1`, `gemini-2-image`, `gemini-3-image-preview` | `gpt-image-2` |
| **pencil** | same 8 (no flux-1 family) | `flux-2-max` |
| **canvas** | same 8 | `flux-2-max` |
| **pop_art** | same 8 | `flux-2-max` |
| **comics** | same 8 | `flux-2-max` |
| **illustration** | same 8 | `gemini-2-image` |

Excluded everywhere (quality): `flux-schnell`, `flux-krea-dev`. The same principle extends to the
~30 secondary FACE styles (art_deco, neon, vaporwave, ukiyo_e, steampunk, etc.) — all stylized →
same 8-model set.

### Layer 2 — Client UX (the visible "Smart Dream")
- Thread the selected medium's approved set into `ModelPicker` (from `create.tsx:1167`), filter
  `visibleModels` (`ModelPicker.tsx:66-67`), and reuse the sticky-fallback pattern
  (`ModelPicker.tsx:137-143`) so a pinned/disallowed model silently drops to the medium's
  recommended default **without overwriting the saved `pro_mode_flux_model`**.
- Because the picker only shows valid models, the **displayed price is always correct** and the
  submitted `force_model` is always valid → charge==render holds with no server surprise.
- Handle Surprise-Me (`useDreamCreate.ts:140-179`) to roll only from the approved set.
- **Award-winning polish:** auto-select the medium's recommended model on medium-change; a subtle
  "✨ Smart Dream — optimized for {style}" hint; optionally collapse the model picker entirely for
  most users (Smart Dream auto-picks the best) and expose it only under an "advanced" toggle.

### Layer 3 — Server guarantee (before the charge)
- In **`enqueue-dream`** (before its charge block) and **`generate-dream`** (Direct/non-queue,
  before its charge block): if `force_model ∉ approvedSet(medium)`, coerce to the medium's default
  and **recompute `getSparkleCost` from the coerced model**.
- **Skip coercion** for: **Direct mode (`use_exact_prompt`)**, New Scene (tier-priced), DLT replay
  (frozen-model contract), restyle (separate pool), and when the approved set is empty/absent
  (fail-open, never block a dream).
- This closes the `pro_mode` / hostile-client / stale-client vectors while preserving charge==render.

---

## 5. Key architecture decision: where the approved set lives — LOCKED

**Decision: store the approved set in `client_meta.smart_dream_models` and NEVER edit
`allowed_models`.** This makes "bots unchanged" a guarantee by construction, not by caution.

Why this is airtight for bots:
- The bot picker (`scripts/lib/modelPicker.js`) reads `dream_mediums.allowed_models` +
  `model_overrides` and reads **`client_meta` zero times** (verified: `grep -c client_meta` = 0).
- Bots reference the user-facing medium keys (watercolor/comics/canvas/…) in **hundreds** of files,
  so we cannot assume they avoid them — which is exactly why we leave `allowed_models` untouched.
- Bots also run a **separate picker/code path**; the create-path enforcement (create edge fns +
  client) never executes for a bot. Two layers of isolation: different field **and** different code.

Consequences of not touching `allowed_models`:
- The create **auto-picker** (rare — only fires when `force_model` is null, e.g. pool-managed
  restyle) and **nightly** still read the old `allowed_models`. To keep the create path fully
  Smart-Dream regardless of how the model was chosen, the server coercion (Layer 3) coerces the
  **final `pickedModel`** — `force_model`, pinned `pro_mode`, *or* auto-picked — into
  `client_meta.smart_dream_models`. So create is 100% governed without shrinking the shared column.
- **Nightly** is handled as a separate, later decision (its own scene-gate/pins/bans). It is not
  required for the create fix and does not affect bots.
- `client_meta` is already returned by `get_dream_mediums` (used today for `restyle_models`), so the
  client gets the set with **zero RPC change**.

---

## 6. Implementation plan (phased)

**Phase 0 — Approve the sets (go/no-go).** Kevin reviews the gallery, signs off on the §4 table.
That table is the entire approval surface.

**Phase 1 — Data (SQL, by hand; no deploy).**
- Set each medium's **`client_meta.smart_dream_models`** to the approved set + a `recommended_model`.
- **Do NOT edit `allowed_models`** (bots read it — §5). No bot/nightly intersection can change.

**Phase 2 — Client filter (ships in a build).**
- `ModelPicker.tsx:66-67` filter by the medium's approved set; `:137-143` fallback extended
  per-medium; thread the set from `create.tsx:1167`; auto-select recommended on medium change;
  Surprise-Me + the `create.tsx:583-589` force_model routing respect the set.

**Phase 3 — Server enforcement (edge deploy: `enqueue-dream` + `generate-dream`).**
- Coerce `force_model` → approved set **before** the charge in both fns; recompute cost; skip
  New Scene / DLT / restyle / empty-set. Load `client_meta.smart_dream_models` (or reuse
  `allowed_models`) on the medium in the shared loader.

**Phase 4 — Guardrails.**
- Update the model tests; add a coercion test (pinned photoreal model + stylized medium →
  coerced + repriced) and a content-lock test on the approved sets so a future edit can't silently
  regress them.

**Sequencing:** Phase 1 is safe to apply anytime (it only tightens the auto-picker). Phases 2+3
must ship together (client filter + server guarantee) so the displayed price, the submitted model,
and the charge stay consistent.

---

## 7b. Expansion — user DreamSmart on/off toggle (planned)

An inline checkbox lets the user turn DreamSmart **off** to get the full model list
regardless of style; **on** (default) keeps the curated list. The subtlety: "off" must
disable the **server coercion too**, or the picker would show every model but the server
would still swap the pick. So the client signals the opt-out and the server honors it.

**Control & UX**
- A small inline checkbox directly under the AI Model pill: `☑ ✨ DreamSmart` with a one-line
  caption ("models tuned for your style"). Checked = on.
- Shown **only when it can do something** — i.e. DreamBot mode AND the chosen style has a
  curated set. Hidden for Surprise Me, Direct mode, New Scene, Restyle (DreamSmart is already
  inert there, so a toggle would be meaningless).
- **On** → curated list + the ✨ DreamSmart badge + blurb (current behavior).
  **Off** → full list, badge/blurb hidden, a quiet "Showing all models" caption. The user's real
  sticky pick (`pro_mode_flux_model`) is honored again (the on-state fallback was display-only, so
  it reverts naturally).

**State & persistence**
- `config.dreamSmart: boolean`, default **true**, persisted per-device via AsyncStorage
  (`create.dreamSmart.v1`) — mirrors the existing `useExactPrompt` toggle pattern. One global
  preference, not per-style.

**Client changes**
- `store/dream.ts`: add `dreamSmart` to `DreamConfig` (+ `setDreamSmart`), default true.
- `create.tsx`: own the toggle; gate `smartActive` on `config.dreamSmart`; render the checkbox
  under the ModelPicker (only when a curated set exists for the style).
- `ModelPicker.tsx`: accept an `enabled` prop (or read the gated `smartModels` = `[]` when off) so
  the filter/badge/blurb switch off cleanly.
- `useDreamCreate.ts`: include `dream_smart: config.dreamSmart` in the request opts.

**Server changes (the load-bearing part)**
- Add the opt-out to the existing gate: `smartDreamApplies(body)` returns `false` when
  `body.dream_smart === false`. That single line makes **both** `enqueue-dream` (coerce-before-charge)
  and `generate-dream` (backstop) skip coercion when the user opted out — so they render exactly the
  model they picked, and **charge == render holds naturally** (no coercion, no reprice).
- Backward-compatible: old clients never send `dream_smart`, so it's `undefined` → treated as ON →
  current behavior. Not a security control (a user is allowed to opt out), so no hardening needed.

**Analytics (optional):** a `dream_smart_toggled { on: boolean }` event to see how many users opt out.

**Net:** ~1 server line (the gate), a store flag, a checkbox, and prop plumbing. The coercion, pricing
invariant, and bot isolation are all unchanged.

## 7. Open decisions for Kevin

1. **Approve the §4 per-medium model table** (the go/no-go, from the gallery). Any medium you want
   to keep wider/narrower?
2. **Model-first UX?** Default is **medium-first** (pick a style → we constrain models). Do you also
   want the reverse (pick a model → we constrain styles) for the advanced picker, or is medium-first
   the only mode?
3. **Hide the model picker for most users?** Smart Dream can auto-pick the best model per medium and
   tuck the picker under "advanced" — cleaner UX, fewer ways to get a bad result. Or keep it visible
   but filtered.
4. **Coercion vs. block on the server** for a stale/hostile client: silently coerce + reprice
   (recommended, invisible) vs. reject. Recommend coerce.
