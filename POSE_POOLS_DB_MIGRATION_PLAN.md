# Classic Pose Pools + Scene Clusters → DB — Zero-Breakage Migration Plan

> 2026-07-09. Owner: move the recommended code-only pools to the DB "but be very
> careful — we can't fuck up dreams." These pools serve EVERY character dream: the
> classic pose pools feed ~75% of location dreams plus the Create (PAID) path; scene
> clusters garnish every enumerated-location nightly. This plan is written so that at
> every single step, production behavior is either BYTE-IDENTICAL to today or one
> scoped `UPDATE` away from it.

## What moves (and what absolutely does not)

MOVES (content only — plain strings):
1. `dual_actions.ts` arrays: `DUAL_ACTIONS_COMPANION` (~91) / `PARTNER` (~135) /
   `PLAYFUL` (~25)
2. `single_actions.ts` arrays: `CANDID_ACTIONS` (~190) / `PORTRAIT_ACTIONS` (~160)
3. `scene_clusters.ts` records: `SCENE_CLUSTERS_SPOTS` + `SCENE_CLUSTERS_ACTIVITIES`
   (10 location keys, ~1000 entries)

DOES NOT MOVE (structure — stays in code, tested, untouched):
- Every PICKER and its distribution logic: `pickDualAction`'s 18% playful roll and
  30/70 partner/companion split, `pickSingleAction`'s 50/50 candid/portrait,
  `pickSceneCluster`'s exact-lowercase-key match and blended default. Only the ARRAYS
  they draw from become loadable.
- `needsEpicBackdrop` semantics: it is a property of the PORTRAIT pool, not of rows —
  derived from pool membership in code, exactly as today. It never becomes a column
  (a per-row flag could drift and silently change the epic-backdrop prompt block).
- The code arrays themselves: they stay in the repo PERMANENTLY as the fallback (the
  three-times-proven scenario-loader pattern). This migration adds a source, it never
  removes one.

## The invariants (each one is a way dreams break; each gets a mechanism)

| # | Invariant | Mechanism |
|---|---|---|
| I1 | A loader failure can never change a dream | Loader falls back to the code arrays on ANY error/timeout AND whenever a pool loads below its floor (≥ 80% of the code array's count — a half-loaded pool is treated as no pool) |
| I2 | Cutover content is byte-identical | Seeding script inserts FROM the code arrays themselves (no retyping); a parity script proves DB set == code set (normalized text equality, per pool) and the cutover is not "done" until it exits 0 |
| I3 | Distribution is unchanged | Pickers keep their logic; loaders return arrays in seeded order; fast jest tests pin the pick distribution against injected pools BEFORE any loader work lands |
| I4 | The paid path cannot get slower than one cached read | Per-isolate cache (one fetch per warm isolate, like scenario pools); the Create call site keeps a hard fallback to code arrays on any loader miss; worst case cost ≈ one 50-100ms query per cold isolate |
| I5 | DB edits cannot introduce swap-breaking poses | Classic rows get a CLASSIC lint at insert: the proximity rule ONLY (couple-too-close without mitigation). NOT the active-pool lint — classic poses are scene-neutral body poses and must not be forced into face-phrase wording (that would change their register). New lint mode in `posePoolLint.js`: `lintClassicPoseEntry` = VIOLATION/MITIGATED check only. The scanner keeps scanning the code arrays (they remain the fallback), so both sources stay covered |
| I6 | PostgREST's silent 1000-row cap can't truncate a pool | One query PER pool (largest is ~190) — never a whole-table select. Cluster loader queries per (location, kind) map rebuild via one ≤1000 query per kind with explicit `.limit(2000)` + row-count assertion against the floor |
| I7 | Rollback is a dashboard operation, never a deploy | `UPDATE ... SET disabled=true WHERE pool='<x>'` drops the pool below its floor → the loader reverts to the code array on the next isolate. Documented per pool in the migration header |
| I8 | Edits propagate predictably | Per-isolate cache means a dashboard edit lands on the next cold isolate (minutes, not instant) — same as scenario pools; documented so nobody "fixes" it with a cache-buster mid-render |

## Schema (migration 351 — one migration, applies dark)

Reuse `action_poses` (proven loader/seeder/lint path) with a `pool` column:

```sql
ALTER TABLE public.action_poses
  ADD COLUMN IF NOT EXISTS pool text NOT NULL DEFAULT 'active';
-- widen the check: cast_type stays dual|solo; pool ∈
--   active | companion | partner | playful   (dual)
--   active | candid | portrait                (solo)
-- (CHECK constraint enumerating valid (cast_type, pool) pairs)

CREATE TABLE IF NOT EXISTS public.location_spots (
  id bigserial PRIMARY KEY,
  location_key text NOT NULL,          -- exact lowercase key (matcher unchanged)
  kind text NOT NULL CHECK (kind IN ('spot','activity')),
  text text NOT NULL,
  disabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- index (location_key, kind) WHERE NOT disabled; RLS on, no policies (server-only)
```

Backfill `pool='active'` is the DEFAULT so existing rows are untouched. Applying the
migration changes nothing (I1: loaders don't exist yet / floors not met).

## Sequencing — lowest blast radius first, one pool per step, verify between

**Step 0 — pin current behavior in tests (before any migration).**
Fast jest: `pickDualAction` distribution (playful ≈ 18%, partner 30/70) and
`pickSingleAction` (50/50 + needsEpicBackdrop=true iff portrait) against injected
pools; `pickSceneCluster` exact-key + blended behavior. These tests are the tripwire
for accidental logic drift during the refactor.

**Step 1 — scene clusters (lowest risk: nightly-only, absence-tolerant).**
`pickSceneCluster` returning null already just skips the "specific spot" line — a
degraded load degrades to a slightly plainer dream, never a broken one.
1. Migration 351 (Kevin, dashboard).
2. `locationSpotsLoader.ts` (cache + floor + fallback to the code records) and route
   `pickSceneCluster`'s array lookup through it. Deploy — table empty → code arrays,
   byte-identical.
3. Seed from code (`seed-location-spots.js`, insert-from-import, no retyping) →
   parity script green.
4. Canary: 3 production nightlies at an enumerated location (`force_place: 'hawaii'`)
   → forensics show a cluster line in the prompt, exactly as before.
5. 24h forensics watch (any `nightly_error` regression, cluster-line presence rate).

**Step 2 — solo classic poses (nightly-only).**
Same 5 sub-steps: loader (`classic` pools in `actionPoseLoader.ts`, floors: candid
≥ 152, portrait ≥ 128 = 80%), route `pickSingleAction`'s arrays through it (picker
signature and semantics unchanged — it receives the arrays instead of importing
them), seed, parity, canary (3 solo nightlies: 50/50 + epic-backdrop block present
on a portrait roll), 24h watch.

**Step 3 — dual classic poses (LAST: touches Create, the paid path).**
Same sub-steps, plus:
- Create canary AFTER nightly canary: 3 real Create-path dreams (queue smoke pattern,
  self-refunding) proving pose text present + latency delta < 200ms vs the week's p50.
- The Create call site wraps the loader in try/catch with a DIRECT code-array
  fallback (belt on top of the loader's own suspenders) — a paid dream must render
  even if the loader module itself throws.

**Step 4 — optional, after a clean week: extend the shuffle-bag to classic poses
(nightly only).** New pools `dual_pose_classic` / `solo_pose_classic` in
`pool_pick_history` filtering. Deliberately NOT part of the migration itself — one
variable at a time; the move must prove itself before behavior on top changes.
Create never gets pose history (latency + user-driven repeats are acceptable there).

## Verification artifacts (each step produces evidence, not vibes)

- `scripts/verify-pool-parity.js` — for each pool: code-array set vs DB set
  (normalized), counts, and exits non-zero on ANY diff. Run at seed time and by hand
  any time afterward; also usable as a drift detector once dashboard edits begin.
- Canary renders land in Kevin's account with forensics (`fallback_reasons` +
  `enhanced_prompt` grep) proving the pose/cluster text came through.
- The existing monitors (`dream-queue-monitor`, `queue-smoke-monitor` hourly canary,
  `ai-failure-monitor`) are the standing net — any loader-induced failure class
  surfaces within the hour.

## Explicit non-goals

- No entry text changes of any kind during the move (improvements come AFTER, via
  dashboard, one pool at a time, linted).
- No picker/distribution changes; no shuffle-bag on Create; no removal of code
  arrays, ever (they are the fallback and the parity reference).
- Bot pools, biome axes, composition presets, scene-engine internals: not in scope.

## Effort + order of operations for Kevin

One migration to apply (351). Everything else is mine: ~1 day total across the three
steps, with a canary + forensics gate between each. Each step is independently
shippable and independently rollbackable (I7); if anything looks off at any gate, that
step reverts to code arrays with one UPDATE and the plan pauses there.
