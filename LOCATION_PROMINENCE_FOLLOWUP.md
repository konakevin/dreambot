# Location Prominence — Follow-ups (parked 2026-08-25)

Context: "Operation Honor The Choice." We made the user's picked locations more prominent in
nightly cast dreams. #1 (rebalance) and #2 (adaptive weighting) SHIPPED. This doc parks the two
bigger ideas so we can resume cold.

## What shipped (2026-08-25)
- **#1 Rebalance** (live, `engine_config`): `dual_scene_active_pct` + `single_scene_active_pct`
  40 → **20**, so the plain-location scene-type share went 30% → **50%** at full weight. Live-tunable.
- **#2 Adaptive weighting** (`_shared/sceneTypeRoll.ts` `adaptiveScenePcts`, wired at BOTH scene-roll
  sites in `nightly-dreams/index.ts`): plain-location share scales with how many places the dreamer
  PICKED. 0 picks → 0% plain (all scenario dreams); ramps to the base (50%) at **4+** picks (`rampPlaces`
  const, currently hardcoded 4). Locked by `__tests__/lib/sceneTypeRoll.test.ts`.
- **Zero-pick backup** (`nightly-dreams`, ~L862): onboarding still requires ≥1; the only way to reach
  zero is Settings → unselect-all. When that happens, `placePool` falls back to the FULL live catalog
  (`location_cards` where `picker_category IS NOT NULL AND admin_only=false`), so `pickedCount` reads
  "many" → full location share from everywhere. No place-less backdrops.

## Verified behavior (measured via dry_run distribution, 2026-08-25)
- plain-location scene-type roll scales correctly with pickedCount (1 place ≈ 12.5%, 4+ ≈ 50%).
- BUT the **user-VISIBLE** location rate is only ~66% of that, because a SEPARATE pre-existing gate,
  **`includeLocation`** (from `rollDream`/dreamAlgorithm), is false on ~1/3 of dreams — so even a plain
  scene-type roll shows no location then. Net: a fully-invested dreamer SEES their location ~33% of the
  time, not 50%.

---

## FOLLOW-UP A (medium) — raise `includeLocation`, or make plain rolls always show a location
**Very-nice-to-have.** If we want the *visible* location rate to match the 50% plain roll, the lever is
the `includeLocation` gate. Two options:
1. When the scene-type roll lands on **plain** and the user has places, force `includeLocation=true`
   (a plain-location dream should, by definition, show a location).
2. Or raise the base `includeLocation` probability in `rollDream`.
**Where to start:** grep `includeLocation` in `nightly-dreams/index.ts` (it's threaded from `rollDream`
in `_shared/dreamAlgorithm.ts`). Decide whether plain-scene-type should hard-imply a location. Cheap,
lower-risk than Follow-up B.

## FOLLOW-UP B (big, VERY nice to have) — scenarios AT the user's location
**The ambitious one.** Today a special scene (goofy/elegant/active) REPLACES the location:
`iconicAnchor: dualSpecialScene ?? iconicAnchor` and `userPlace: dualSpecialScene ?? userPlace`
(nightly-dreams, ~L1966 dual + the single equivalent). So 50–70% of cast dreams ignore the picked
location entirely. The dream: set the SCENARIO (activity) AT the user's chosen location (a superhero
scene in *their* Tokyo, an adventure at *their* Petra) so even fun dreams honor the pick — huge
location prominence without losing scenario variety.

**Why it's parked (the hard part):** merging extra scene intent INTO a face-swap prompt is the unsolved
problem — scene dominance + couple proximity can break the swap (see
[[project_dream_off_cast_spin_faceswap_merge]], the dual proximity scan, `characterSlotPrompt.ts`, and
the Hard Rule "NEVER front-load/amplify the scene on a FACE-SWAP prompt"). Two people + a busy scenario
+ a specific location = crowded frame → the dual detector can't split two clean faces → wrong-face swaps.

**Where to start (cold-resume plan):**
1. Read `characterSlotPrompt.ts` (the dual/single slot prompt) + [[project_faceswap_program_complete]]
   + [[project_dual_faceswap_gender_guarantee]] to re-load the swap-safety constraints.
2. Prototype on **SINGLE** dreams first (far lower swap risk than dual). Pick a subset of location-
   compatible active scenarios (e.g., "explore ancient ruins" → set at Petra/Angkor Wat).
3. Instead of `userPlace = dualSpecialScene ?? userPlace`, pass BOTH: scenario as the ACTION/pose and the
   location as the SETTING, keeping `scene_description` AFTER the framing block (never amplified).
4. QA hard: render dozens, run `scan-dual-faceswap-proximity.js` for any dual pools, watch
   `ai_generation_log.fallback_reasons` for `no_dual_split` / `dual_degrade_single`.
5. Only extend to DUAL after single is proven swap-safe.

Config knobs in play: `engine_config` `dual/single_scene_{goofy,elegant,active}_pct`,
`adaptiveScenePcts` `rampPlaces` (could become a config field), the `includeLocation` gate.
