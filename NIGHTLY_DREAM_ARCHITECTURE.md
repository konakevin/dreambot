# Nightly Dream Engine — "Ultimate" Coherence Architecture

**Status:** Design / plan (2026-05-29). Written after a deep audit of the nightly engine + a side-by-side study of the bot axis engine. Goal: **every nightly user dream is a coherent, quality, bespoke render — every single time.** No more deer-in-a-café collages.

This is the canonical plan for the nightly-dreams coherence overhaul. Build phases are at the bottom. The bot system is the proven reference — its coherence mechanisms (`scripts/lib/brief-composer.js`, EarthBot/ChibiBot/BloomBot) are what we port over.

---

## 0. What triggered this

sunnysteph's nightly (medium `pencil`, vibe `cozy`, place `paris cafe`) rendered as a Paris café that was _also_ a vast volcanic beach with Venice canals, a lightning-antlered deer, draped horse-riding gear, and a tiny archer. Every incongruous element traced to a real pool entry that the engine stacked onto the café with no coherence gating. This is not a one-off — it's the default behavior of the current assembler for any location that isn't a generic outdoor vista.

---

## 1. How nightly works today

`supabase/functions/nightly-dreams/index.ts` (orchestrator) →

1. Resolve medium + vibe (`dream_eligible` pools, recency-filtered).
2. `rollDream()` (`_shared/dreamAlgorithm.ts`) → composition (`character` / `epic_tiny` / `pure_scene`), `compositionMode`, cast, includeLocation/Object. No-cast rolls **70% pure_scene / 30% epic_tiny**.
3. Pick `userPlace` from `recipe.dream_seeds.places`; fetch its **location card** (`location_cards`: tags, cinematic_phrases, atmosphere, fusion_settings) + **iconic spot** (`location_iconic_spots`) + **biome** (`location_cards.biome` → `getBiomeConfig`).
4. `assembleScene()` (`_shared/sceneEngine.ts`) → builds `dreamSubject` (the "Scene DNA") by rolling ONE entry each from independent global pools: SCALE, TIME, WEATHER, LIGHTING, foreground, midground, background, signature_detail, action, + camera/style.
5. Build a Sonnet brief in one of 3 branches:
   - `character` + face-swap → controlled slot pipeline (`runCharacterSlotPipeline`).
   - `epic_tiny` → "compose an **EPIC, VAST scene**… the scene is EVERYTHING," fed `dreamSubject`.
   - `pure_scene` → "JAW-DROPPING postcard, LOCKED SUBJECT," fed `iconicAnchor` + biome axes (TIME/WEATHER/PHENOMENA/CAMERA/SUBJECT_RULE/BANS) + nature-coded enhancing language. Does **not** use `dreamSubject`.
6. Sonnet writes the Flux prompt → sanitize → Flux render → (face swap) → persist.

Two separate axis layers feed Sonnet: **`assembleScene`'s pools** (epic_tiny + character) and **`biomeConfig`'s axes** (pure_scene + character/faceswap).

---

## 2. Audit findings — the systemic issues

| #     | Issue                                      | Evidence                                                                                                                                                                                                | Impact                                                                                                                                                                                                                                                                                                                                                                                            |
| ----- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **Biome mis-default**                      | `getBiomeConfig(null)` → `tropical_coastal`. **93 of 105** location cards have `biome = null`.                                                                                                          | ~89% of locations get tropical-beach WEATHER/PHENOMENA/SUBJECT_RULE/BANS. The tropical `SUBJECT_RULE` = "OUTDOOR LANDSCAPE, massive natural features" and `BANS` = "**NO INTERIORS, NO PEOPLE, NO FANTASY, NO SCI-FI**" — so paris cafe is told to render as an outdoor landscape with no interior; cyberpunk gets "no sci-fi"; arctic gets palm fronds. **Dominant cause of incoherent dreams.** |
| **2** | **Biome taxonomy incomplete**              | Only 6 biomes: tropical_coastal, arctic_polar, ancient_ruins, scifi_cosmic, fantasy_imagined, gothic_historic.                                                                                          | No desert, urban, temperate-forest, interior, mountain, aquatic, grassland biome → even a correct tag→biome map has no good target for huge swaths of locations.                                                                                                                                                                                                                                  |
| **3** | **Two incompatible tag schemes**           | Some cards: `["desert","interior"]`; others: `["biome:desert","mood:cozy","theme:epic"]`.                                                                                                               | Every coherence filter that keys off bare tags **silently no-ops** on prefixed cards — `applyLocationFilter` (`locationTags.has('tropical')`), the `COMPAT_CONFLICTS` object filter.                                                                                                                                                                                                              |
| **4** | **Globally-random, biome-blind assembler** | `assembleScene` stacks SCALE+WEATHER+fg+mg+bg+signature+action from global pools; only fg/mg/bg get the (already-broken) `applyLocationFilter`; SCALE/WEATHER/signature/action get **none**.            | The deer-café collage. Any location can pull any element.                                                                                                                                                                                                                                                                                                                                         |
| **5** | **Branch roulette**                        | Same location renders coherently or not by composition roll: `epic_tiny` uses the incoherent pile + "EPIC VAST"; `pure_scene` uses biome (wrong 89% of the time) + nature-coded language; they diverge. | Inconsistent quality; intimate/urban/interior locations have no good branch.                                                                                                                                                                                                                                                                                                                      |
| **6** | **Forced lone figure + double weather**    | `assembleScene` always appends `"a lone figure " + action` for non-faceswap (the café archer); `assembleScene` WEATHER **and** biome WEATHER both inject → conflicting atmosphere.                      | Adds incongruity + over-stacks.                                                                                                                                                                                                                                                                                                                                                                   |

---

## 3. What the bot engine does that nightly doesn't (the coherence stack)

The bots fill the public feed 2×/day and are reliably coherent. Their engine (`scripts/lib/botEngine.js` + `brief-composer.js` + per-bot pools) is built around coherence primitives nightly lacks. Studied: the composer, ChibiBot village paths, BrickBot, BloomBot, EarthBot epic-vista (the closest analog — real-Earth biome-matched landscapes).

| Bot mechanism                                                                                             | Where                                                                               | What it does                                                                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Roll the organizing context FIRST, tag-filter the rest**                                                | `brief-composer.js` tagged pools + `matchTagsFromSlot` (lines 178–249)              | A path's `creature: { tags: ['MARINE','ANY'] }` only rolls sea creatures. `matchTagsFromSlot:'subject'` filters a later slot by an _earlier-rolled_ slot's tags — "no palm trees in arctic, no Joshua trees in fjords." **This is the exact lever nightly is missing.** |
| **Per-context curated pools**                                                                             | ChibiBot `AQUATIC_VILLAGE_PHENOMENA` (bubbles/currents, never "wind through trees") | Each biome/path has its own pools, hand-curated so every entry is biome-coherent.                                                                                                                                                                                       |
| **Axis-clean / stacked-density**                                                                          | EarthBot Lesson 1 & 4                                                               | Each axis is rich _within_ its lane but pure _between_ lanes (lighting has no fog; weather no light). Combinations create variance without contamination.                                                                                                               |
| **Cross-axis compatibility clauses**                                                                      | EarthBot Lesson 5                                                                   | Template clause: "if A=X AND B=Y, DROP the lesser; [physical reason]; restrained truth beats forced impossibility" (e.g. stars + sunset can't co-exist).                                                                                                                |
| **Probability-gated drama**                                                                               | playbook "Conditional axis layers" (60% gate)                                       | Optional layers (phenomena/drama) fire ~40–60%, so renders aren't over-stacked.                                                                                                                                                                                         |
| **Tone lock before Sonnet**                                                                               | `promptPrefixByPath` (ChibiBot aquatic: "COOL TEAL/CYAN, NOT warm amber")           | Locks palette/tone in the first tokens (Flux early-token weighting) to counter Flux's biome bias.                                                                                                                                                                       |
| **Theme-first orchestrator**                                                                              | BloomBot `flowerEngine.js`                                                          | Roll a theme → filter the pool to theme colors + biome → spread across cast roles → emit _exact composed_ instruction. Sonnet never guesses; it's pre-composed.                                                                                                         |
| **Unified scale roll (no scene/char split)**                                                              | playbook "Unified architecture"                                                     | Every render has an anchor entity at a SCALE (TINY→LARGE). Face-swap = anchor override, scale forced MEDIUM/LARGE. One pipeline, one template.                                                                                                                          |
| **Scene-as-hero for landscapes**                                                                          | EarthBot Lesson 3                                                                   | Subject fills 60–70%, scale prover stays tiny, **no competing foreground prop, no forced figure.**                                                                                                                                                                      |
| **ZERO HUMANS standalone block**                                                                          | EarthBot Lesson 6                                                                   | For no-cast scenes, hoist the no-figure rule to a top-level block (buried bans don't override Flux's stock-photo bias).                                                                                                                                                 |
| Recency dedup, rollSharedDNA, axis-clean two-pass-polish skip, fine-art photographer refs (not "Nat Geo") | various                                                                             | Variety + scene-wide palette coherence + setting-language preservation + aesthetic encoding.                                                                                                                                                                            |

**The core difference:** a bot render is organized around a tightly-scoped _context_ (the path/biome) that tag-filters every sub-element. A nightly render is an arbitrary user _location_ combined with global pools that don't know about that location. **Fix = make the location's biome the organizing context and tag-filter everything by it — exactly like a bot path.**

---

## 4. The Ultimate Architecture — 7 pillars

> **Reframe:** A nightly dream = ONE coherent scene organized around the user's **location → resolved biome** (the context), with the user's **cast** as an optional anchor-entity override. Built like a bot path, but the "path" is the user's location resolved to a biome class at runtime.

### Pillar 1 — Real biome taxonomy + deterministic resolution

- Expand `biomeAxes.ts` to a **complete biome set** (~14): `coastal_tropical`, `arctic_polar`, `desert_arid`, `temperate_forest`, `alpine_mountain`, `grassland_savanna`, `wetland_jungle`, `urban_city`, `interior_intimate`, `aquatic_underwater`, `fantasy_imagined`, `scifi_cosmic`, `gothic_historic`, `ancient_ruins`. Each is **axis-clean + biome-coherent**: its own TIME/WEATHER/PHENOMENA/LIGHTING/CAMERA/SUBJECT_RULE/BANS. (Interior biome: interior-appropriate everything; NO "outdoor landscape" subject rule, NO "NO INTERIORS" ban.)
- **Resolve every location to a biome deterministically** via a normalized tag→biome map. **Backfill `location_cards.biome` for all 105** so resolution is data-driven + auditable. **Kill the `tropical_coastal` default** — fall back to a neutral biome only when truly unknown, and log it (so unmapped locations are queryable, never silent).

### Pillar 2 — Tag normalization

- One `normalizeTags()` that strips `biome:`/`mood:`/`theme:` prefixes → a canonical tag set, used by biome resolution AND every coherence filter. Fixes the silent filter failures (issue #3). (Or backfill consistent tags + freeze the scheme.)

### Pillar 3 — Biome-tag-filtered scene assembly (port `matchTagsFromSlot`)

- Rework `assembleScene` to roll the **biome first**, derive its tag set, then **filter every sub-pool (scale, weather, lighting, foreground, midground, background, signature, action, phenomena) to biome-compatible entries** (static-tag filter + `'ANY'` wildcard), mirroring `brief-composer.js`.
- **Tag the ~480 scene-DNA pool entries** with biome tags (one-time Haiku tagging pass + spot-check, like the bot pools). Untagged → `'ANY'`.
- **Axis-clean the pools** (strip cross-lane vocabulary — no "golden hour through fog" in lighting).
- **One weather source**: the biome owns WEATHER/atmosphere (axis-clean); remove/merge `assembleScene`'s WEATHER pool. Eliminates issue #6's double-weather.

### Pillar 4 — Unified composition (kill branch roulette)

- Replace the 3 divergent branches with **one composition model**:
  - **Anchor:** cast present → anchor = cast (face-swap), scale MEDIUM/LARGE. No cast → scene-as-hero (location dominates 60–70%), optional TINY scale-prover only — **no forced "lone figure with bowstring."**
  - **Scope** from biome: `open_vista` / `urban` / `intimate_interior` → drives camera + composition + whether scene-as-hero. (Subsumes the interior fix.)
- **One adaptive brief** that reads the biome's SUBJECT_RULE + scope (no contradictory EPIC-VAST vs nature-postcard). Includes a **ZERO-HUMANS-or-anchor-only** block and **cross-axis compatibility clauses** (EarthBot Lesson 5).

### Pillar 5 — Theme/mood orchestration + per-biome tone lock (BloomBot + ChibiBot pattern)

- Roll a **mood/palette theme** from the user's mood sliders + vibe + biome (in `rollSharedDNA`-style), **pre-compose** the palette + lighting register, and **lock it via a per-biome prompt prefix** in the first tokens (counter Flux's biome bias). Replaces "random atmosphere clashing with location."

### Pillar 6 — Restraint + gated enrichment

- **Probability-gate** the optional layers (phenomena/drama/signature ~30–50%), not always-on (issue #4/#6 over-stacking). **Stacked-density within an axis, pure between axes** (EarthBot Lesson 1).

### Pillar 7 — Guardrails + observability

- A post-assembly **coherence guard**: per-biome banned-keyword sweep (generalized interior blocklist) that zero-weights/strips leaks before Sonnet.
- **Log the resolved biome + rolled axes** to `ai_generation_log`; add a `scripts/qa-nightly-coherence.js` that regenerates N dreams across a location spread and flags cross-biome leakage. Makes misfires queryable instead of discovered by users.

---

## 5. Phased build plan

> **Progress (2026-05-29):** Phases 1, 1.5, 2, 3, 4 ✅ — all deployed. 20-biome taxonomy; all 105 locations on bespoke `biome_config`; assembler biome-scope-filtered + keyword-guarded; brief framing scope-aware (no EPIC-VAST on interiors, no forced foliage); `isValidBiomeConfig` is the single override gate; `scripts/qa-nightly-coherence.ts` sweeps all locations and is **green (0% cross-biome leakage, 568 runs)**.
>
> **Deferred (low value):** Phase 4 mood→palette pre-compose (the per-location `biome_config` + vibe already drive palette). Lazy-gen-on-encounter — **not needed**: nightly locations come from curated cards (never free-text), so new locations are added by Kevin and get their `biome_config` via `node scripts/gen-location-biome-configs.js --only "<name>" --apply`; any ungenerated card falls back gracefully to its shared-class biome (`resolveBiomeFromTags` → `getBiomeConfig`), logged as `biome_unmapped`. No Sonnet call belongs in the render hot path.

**New location workflow:** add the `location_cards` row, then `node scripts/backfill-location-biomes.js --apply` (sets its `biome` class) + `node scripts/gen-location-biome-configs.js --only "<name>" --apply` (generates its bespoke `biome_config`), then `deno run --allow-read --allow-net --allow-env scripts/qa-nightly-coherence.ts` to confirm coherence.

**Phase 1 ✅ — Biome resolution + taxonomy + backfill (highest impact, contained).**
Expand `biomeAxes.ts` to ~14 axis-clean biomes; add `normalizeTags()` + tag→biome mapper; backfill `location_cards.biome` for all 105; remove the tropical default (+ log unknowns). _Fixes ~89% of locations' atmosphere/subject/bans in one change._ Verify: regenerate `pure_scene` prompts across a location spread (egypt/arctic/cyberpunk/paris cafe/redwood/london) — confirm coherent atmosphere + correct bans.

**Phase 1.5 — Per-location bespoke `biome_config` for ALL locations (DECIDED 2026-05-29).**
Standardize on ONE mechanism + maximum richness: every location card runs on its own location-tuned `biome_config` (TIME/WEATHER/CAMERA/PHENOMENA/SUBJECT*RULE/BANS), Sonnet-generated from its biome **class** (the axis-clean structural anchor in `biomeAxes.ts`) + its real identity (name, `visual_palette`, `atmosphere`, `cinematic_phrases`, iconic spots). The shared `biomeAxes.ts` (14 biomes) is no longer a competing runtime system — it's the **class taxonomy** (what Phase-2 tag-filtering keys off) + the **generation template** + the **runtime fallback** for not-yet-generated cards. Generator: `scripts/gen-location-biome-configs.js`. Backfill only fills cards lacking a config (preserves the curated 53). One resolver: `biome_config ?? getBiomeConfig(biome)`. Lazy-gen on first encounter (mirror `getLocationCard`) makes it self-sustaining. \_This supersedes the "code vs DB" open decision below — answer: per-location DB config generated from code templates.*

**Phase 2 — Biome-tag-filter the assembler.**
Tag the scene-DNA pools; filter all sub-pools by resolved biome tags; axis-clean; dedupe the weather source; add per-biome prompt prefix (tone lock). Verify: regenerate `epic_tiny`/character prompts for the same spread — no cross-biome leakage (the café gets no canals/deer/driftwood).

**Phase 3 — Unify composition.**
Collapse the 3 branches into the scale-roll/anchor model + scope-driven brief; scene-as-hero for no-cast; ZERO-HUMANS block; cross-axis compatibility clauses. Verify: same location renders consistently across many rolls.

**Phase 4 — Theme orchestration + guardrails + QA.**
Mood→palette pre-compose; conditional-layer gating; coherence guard; `ai_generation_log` biome logging + `qa-nightly-coherence.js`.

**Recommended:** build **Phase 1 first** — biggest coherence win, contained, immediately verifiable — then proceed.

---

## 6. Open decisions (for Kevin)

1. **Biome configs in code (`biomeAxes.ts`) or DB (`location_cards.biome_config`)?** Code is simpler/versioned; DB allows per-location bespoke (migration 170 already supports `biome_config`). Recommend: code for the ~14 shared biomes + keep DB `biome_config` override for special locations.
2. **Tag scheme:** normalize at read-time (non-destructive, fast) vs backfill canonical tags into the table (cleaner long-term). Recommend: normalize now + backfill opportunistically.
3. **Pool tagging effort:** Haiku auto-tag the ~480 scene-DNA entries (fast, needs spot-check) vs hand-tag. Recommend: Haiku pass + review, mirroring the bot pool workflow.
4. **Scope of Phase 1 vs all-at-once.** Recommend phased.
