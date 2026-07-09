# Action Pose Expansion — Biome-Affinity Plan

> 2026-07-09. Owner directive: expand ALL pose pools with more fluid, natural action
> poses ("show us both surfing, on a jetski, dancing together"), aligned to location —
> "jetskis would apply to hawaii, but not paris." **Strictly additive: no existing pose
> is removed or modified.** Quality gate: the Stage-8 identity verification program
> (FACE_SWAP_UPGRADE_PLAN.md) + the depth-QA ladder ("QA heavily as we go").
>
> Grounding: engine map 2026-07-09 (pose pools are location-independent today;
> `pickDualAction(relationship, forcePool)` never sees a place — the pose and location
> are just adjacent comma-strings in the prompt, `characterSlotPrompt.ts:565-580`).

## The design in one paragraph

Don't copy poses into location pools — tag each new action pose with **biome
affinities** and filter at roll time against the biome the engine has *already
resolved* for the rolled location (`location_cards.biome` → `biomeKey`,
`nightly-dreams/index.ts:1015-1046`, 20 biomes in `biomeAxes.ts`). One source of truth,
no drift, works for ANY user location (not just ones we've enumerated), and
jetski-in-paris is impossible by construction: `paris → urban_city`, and jetski's tags
say coastal-only. Untagged entries are universal — which is also why the change is
additive-safe: every existing pose stays untagged and behaves exactly as today.

## Why not "drop entries into location pools"?

The per-location pools (`scene_clusters.ts` — spots/activities keyed by location NAME)
only cover locations we've hand-enumerated; a user whose place is "lake tahoe" or
"amalfi coast" gets nothing. Biome affinity covers every location because every
location card already gets a biome (with `resolveBiomeFromTags` runtime backfill).
`SCENE_CLUSTERS_ACTIVITIES` still gets a Phase-C garnish (below) for marquee locations,
but the engine is the biome layer.

## Phase A — dual action pose pool (builds on the QA'd Stage-5b families)

1. **New pool `_shared/pools/dual_actions_active.ts`** — entry shape follows the
   existing tagged precedent (`actions_faceswap.ts`'s `{text, weight, tags}`):
   ```ts
   interface ActiveDualAction {
     text: string;            // authored to the face-visibility contract
     biomes?: BiomeKey[];     // omit = universal (any location)
     weight?: number;         // default 1
   }
   ```
   Seed at MVP scale (~25 entries, 2-3 per family) from the depth-QA-passed families:
   | family (depth QA) | biome affinity |
   |---|---|
   | surfing 5/5 | tropical_coastal, temperate_coastal, mediterranean_coastal |
   | jetski 4/5 | tropical_coastal, temperate_coastal, mediterranean_coastal, fjord_coastal |
   | ocean-play 5/5 | the 4 coastal biomes |
   | kayak 5/5 | fjord_coastal, wetland_jungle, temperate_forest, alpine_mountain |
   | skiing 5/5 | alpine_mountain, arctic_polar |
   | ice-skating 4/5 | alpine_mountain, arctic_polar, urban_city |
   | bikes 5/5 | urban_city, coastal biomes, grassland_savanna, mediterranean_coastal |
   | swing/salsa dance 4/5 | urban_city, interior_intimate, mediterranean_coastal + universal-leaning |
   | rollercoaster 4/5 | urban_city |
   | flour-fight 3/5 | interior_intimate ONLY, reworded (faces clear of the flour cloud) |
   | ridge-scramble 1/5 | EXCLUDED until reworded + re-benched (5-rep gate) |
   Banned biomes never match anything (locationFilters already bans
   fantasy_imagined/scifi_cosmic/aquatic_underwater locations upstream).

2. **Selection wire.** New `pickActiveDualAction(relationship, biomeKey)` in
   `dual_actions.ts`: filter the active pool to entries whose `biomes` include
   `biomeKey` (or are universal), weighted roll; return null if the pool has no match.
   Call site: the existing pose re-pick in `nightly-dreams/index.ts:1148-1158` — which
   runs AFTER biome resolution, so `biomeKey` is in scope. Gate:
   `engine_config.dual_action_pose_pct` (new column, default 0): with pct probability
   on a plain-location dual (NOT goofy/elegant specials — those keep their pools),
   try the active pool; no biome match or roll miss → today's exact behavior.
   Rollback = set pct 0.

3. **QA ladder before pct > 0** (the standing owner directive):
   a. Every entry passes the contact-pool lint (R3: both faces toward camera named
      explicitly; no reach-back/pull-up; no particle clouds at face height).
   b. `scripts/scan-dual-faceswap-proximity.js` green (POST-SEED HOOK hard rule).
   c. 5-rep production-prompt bench per NEW wording (reuse `bench-action-depth.js`
      pointed at the pool entries — production prompts only; the 2026-07-08 pencil
      lesson: generic bench prompts manufacture failures that don't exist).
   d. Identity enforcement (Stage 8c, threshold 0.35) live BEFORE the pct leaves 0 —
      the runtime guarantee that a weak take re-renders instead of shipping.
   e. pct=10 nightly → watch `dual_reject:*` + `identity_sim` distribution vs
      baseline → 25 → enable for Create.

## Phase B — solo action poses (same machinery, after A proves)

`single_actions.ts` gets the same treatment: `pools/single_actions_active.ts` with
biome-tagged expressive solo actions (trail-running a ridge, paddleboarding, snowball
throw, market-stroll...), `single_action_pose_pct` gate, identical QA ladder. Solo
compositions stay inside the current framing contract until Stage 5c's expanded
compositions pass their own bench.

## Phase C — location-pool garnish (marquee locations)

Additive entries to `SCENE_CLUSTERS_ACTIVITIES` for enumerated locations whose biome
families passed QA (hawaii: reef-line jetski run, waikiki longboard session; aspen:
powder-day run...). These enrich the SCENE text; the POSE still comes from the biome
layer, so cluster text and pose reinforce rather than duplicate. Low priority — pure
flavor.

## Phase D — DB promotion (when the pool earns scale)

The scenario pools already model this: `dual_scenarios` table + loader with in-code
fallback (`dualScenarioLoader.ts`). When the active pose pool outgrows MVP, promote to
a `dual_action_poses` table (`text, biomes text[], weight, disabled`) with the same
loader-cache-fallback pattern → seeding/tuning/disabling from the dashboard with no
deploy. Not part of the MVP.

## Explicitly additive — invariants

- No entry in `DUAL_ACTIONS_COMPANION/PARTNER/PLAYFUL` or
  `CANDID_ACTIONS/PORTRAIT_ACTIONS` is touched, ever, under this plan.
- pct=0 default → byte-identical behavior until flipped.
- Goofy/elegant special scenes keep their existing pose pools unchanged.
- The Create path keeps its neutral relationship poses until nightly proves the pool
  (nightly-before-Create, per the staged contract).

## Execution status (2026-07-09)

BUILT + PRODUCTION-VERIFIED, awaiting owner pct verdicts:
- Identity enforcement LIVE at 0.35 (IDENTITY_MIN_SIM secret) — caught 2 dead
  first-takes in the 20-render pose bench and re-rendered both to passing
  (0.056→0.764, 0→0.608). 19/19 delivered duals ≥ 0.35, median 0.647.
- Gender-confirm fallback + active-pool lint live.
- Phase A pose pool: 27 entries wired behind dual_action_pose_pct (0). Bench:
  20 production renders across hawaii/aspen/nyc/yosemite — biome matching
  correct wherever a card biome exists; no-biome places (aspen) correctly fall
  back to universal poses; 1/20 exhausted→degraded (baseline-consistent).
- Active scenario pool: 26 rows seeded (lint-green), roll split config-tunable
  (20/20/0), 3/3 verification renders through force_active passed the gate.
- Known granularity limit: biome-right ≠ spot-right (a rollercoaster can roll
  at a library-steps anchor — dream-logic surreal; owner judgment whether a
  spot-congruence filter is ever needed).
- Rollout proposal: dual_action_pose_pct=10 + dual_scene_active_pct=10 on
  owner verdict, watch dual_reject:* + identity_sim + active_pose reasons vs
  baseline, then 25.

## Dependencies / order

Stage 8c enforcement (identity gate) → R2 gender fallback (recovers ~half the action
rejects) → R3 lint → Phase A seed (MVP-25, owner feed review) → pct rollout → B → C/D.
