# Nightly Dream Seed Pool QA — Architecture & Reference

> **Status:** shipped 2026-06-04. Engine deployed, both DB columns populated,
> twice-curated pools live in production. This doc is the canonical reference
> for the per-composition-path anchor curation system — read this BEFORE
> touching `location_iconic_spots` or the nightly anchor selection in
> `nightly-dreams/index.ts`.

## The problem that triggered this work

A user-hearted (sarcastically) nightly render: `pure_scene` composition rolled
`Petersen Automotive Museum red ribbon facade` for an LA dream. Real LA
landmark, technically accurate render, but the result reads as *"wet street,
gray sky, a building exists in a city."* Not a postcard.

Audit found the cause was **structural, not random**: the
`location_iconic_spots` pool was curated for *"real recognizable landmark"* —
which mixes:

- Hollywood Sign + Griffith Observatory (S-tier postcard-grade)
- Petersen Auto Museum + Anne Frank House (real landmarks but niche / random-
  building without a person in frame)
- Los Angeles River concrete channel downtown + Muscle Beach gym equipment
  (real but mundane / "concrete ditch" class)

The engine rolled uniformly from this mixed pool whether the composition was
`pure_scene` (landscape only, no human) or a cast path (character +
epic_tiny, human in frame). But the bar differs:

- **`pure_scene`** has no subject except the landscape — a mundane backdrop
  reads as a *random building photo*. The location MUST postcard.
- **Cast paths** have a person as the subject — *Petersen with a person
  walking out reads great*. The bar is more permissive.

**Cast paths are ~70% of nightly composition rolls** (40% character + 30%
cast-in-random); `pure_scene` is ~30%. Both surfaces needed curation, but
with **different rubrics**.

## The architecture — two filtered pools, one source table

Two parallel `boolean` columns on `location_iconic_spots`:

| Column                   | Engine path that filters on it                         |
| ------------------------ | ------------------------------------------------------ |
| `pure_scene_eligible`    | `composition === 'pure_scene'`                         |
| `character_eligible`     | `composition === 'character' \|\| 'epic_tiny'`         |

The columns are **independent**. A spot can be eligible for one path, the
other, or both. Examples:

- Hollywood Sign on Mount Lee → both true (great as a pure-landscape; also a
  good backdrop for a person)
- *"moss-covered fallen giant spanning a dark jungle stream"* (a Phase 4
  generic landscape) → `pure_scene_eligible=true`, `character_eligible=false`
  (designed without a figure)
- Capitol Records Building → `pure_scene_eligible=true` only via Phase 2 +
  recovery (iconic for its biome); `character_eligible=true` (person at the
  building is iconic)
- *"Los Angeles River concrete channel downtown"* → both false (B-tier,
  mundane regardless of subject)

The engine filter (`nightly-dreams/index.ts`, around line 776 as of
2026-06-04):

```ts
let spotsQ = supabase
  .from('location_iconic_spots')
  .select('spot_text, spot_kind, quality_tier')
  .eq('location_key', userPlace)
  .eq('is_active', true);
if (composition === 'pure_scene') {
  spotsQ = spotsQ.eq('pure_scene_eligible', true);
} else {
  // character + epic_tiny
  spotsQ = spotsQ.eq('character_eligible', true);
}
```

## Build phases — what populated each column

The pool reached its current state across 4 generation phases + 3 QA passes.
All phases ran on **all 48 live locations** (`is_approved=true` +
`picker_category IS NOT NULL` on `location_cards`).

### Generation phases

| Phase | Output | What it does |
|-------|--------|--------------|
| **Phase 1** (engine filter) | engine code | `nightly-dreams` `pure_scene` path filters by `quality_tier IN ('S','A')` as immediate fix. **Superseded** by Phase 2's `pure_scene_eligible` filter after the column landed. |
| **Phase 2** (Sonnet classifier) | `pure_scene_eligible` for existing rows | S-tier auto-true / B-tier auto-false / A-tier judged by Sonnet ("would a tourist photograph this for Instagram?"). 2,462 of 4,897 original rows survived. |
| **Phase 3** (named postcards) | 960 fresh rows | Sonnet authored **20 named-landmark POVs per location** (e.g. *"Stahl House Case Study 22 cantilevered over glowing basin"*, *"Bradbury Building ornate iron atrium skylight interior"*). All inserted with `pure_scene_eligible=true`, `quality_tier='S'`. |
| **Phase 4** (biome landscapes) | 2,400 fresh rows | Sonnet authored **50 generic biome-matched pretty-landscape scenes per location** (e.g. *"burnt-orange coastal bluff edge dropping sheer to churning white surf at golden hour"*, *"moss-carpeted volcanic plateau under storm clouds"*). All inserted with `pure_scene_eligible=true`. Rubric: NO named landmarks, NO humans, NO buildings, **must read as the location's biome**. |

After Phase 4: 5,822 entries marked `pure_scene_eligible=true` across the
pool.

### QA passes for `pure_scene_eligible`

| Pass | Effect | Why it was needed |
|------|--------|-------------------|
| **Strict QA** (`scripts/qa-pure-scene-pool.js`) | 5,583 evaluated → 3,224 dropped (58%) | "PAID FEATURE bar" rubric. Found that Sonnet had let through generic-feeling Phase 4 entries and weak A-tier survivors. |
| **Recovery pass** (`scripts/qa-recover-drops.js`) | 3,894 non-B drops reviewed → 2,493 restored (64%) | Strict QA was over-aggressive — wrongly dropped iconic architecture (*Capitol Records*, *Queen Mary*) and biome-coded landscapes (*aurora over Icelandic geothermal pool*). Recovery used a softer rubric specifically targeting the over-aggression patterns. |

**Final `pure_scene_eligible=true`: 5,091 across 48 locations.** Net 731
entries permanently dropped from Phase 1-4 as truly weak — vague *"X views"*,
generic-anywhere scenes, kitsch, mediocre.

### QA pass for `character_eligible`

| Pass | Effect | Why it was needed |
|------|--------|-------------------|
| **Character QA** (`scripts/qa-character-pool.js`) — 2-pass | Pass 1 auto-flagged 293 lowercase-prefix Phase 4 entries to `false` (they fight cast injection). Pass 2 Sonnet-classified the remaining 7,964 entries with a **cast-appropriate rubric** (more permissive than `pure_scene`): KEEP for named landmarks / urban scenes / dramatic landscapes that host a figure / cultural settings; DROP for pure-landscape-with-no-anchor, vague, concrete-ditch class, biome confusion. | Cast paths were getting the unfiltered pool → ~50% of cast rolls had quality risk (29% Phase 4 landscapes designed without a figure + 21% B-tier mundane backdrops). Different bar than `pure_scene` so a separate pass was needed. |

**Final `character_eligible=true`: 5,682 across 48 locations.** Average 118
per location.

## Current state (snapshot, 2026-06-04)

```
Total active spots in live locations: 8,257
pure_scene_eligible = true:  5,091  (62% of active)
character_eligible  = true:  5,682  (69% of active)
both true (most common):    ~4,500
```

Per-location distribution (full table lives in the QA-pass run output):

- **Largest pools (200+ both columns):** Ancient Wonders, China, India,
  Mexico, Australia, Turkey
- **Strong (100-200):** Iceland, Hawaii, Morocco, Thailand, New Zealand,
  Caribbean Islands, Swiss Alps, African Safari, Yellowstone, Canadian
  Rockies, Costa Rica, Grand Canyon, LA, Bali, Patagonia, Yosemite, Norwegian
  Fjords, Santorini, Redwood Forest, NYC, Tokyo, Paris, San Francisco, London,
  Rome, Bora Bora, Rio, Maldives
- **Watch-list (<60 in `pure_scene_eligible`):** Big Sur (46), Amsterdam
  (47), Singapore (52), Prague (53), Venice (55), Seoul (56), Hong Kong (57),
  Moab Arches (59). Single-location users will hit pure_scene repeats within
  4-10 months on these.

## Scripts inventory

All under `scripts/` and documented in their headers:

| Script | Purpose |
|--------|---------|
| `classify-iconic-spots.js` | Earlier pass (not part of this work) — classifies each spot's `spot_kind` as wide / medium / intimate for per-spot framing. |
| `classify-pure-scene-eligible.js` | Phase 2 — populates `pure_scene_eligible` (S auto-true, B auto-false, A Sonnet-judged). |
| `gen-postcard-spots.js` | Phase 3 — adds 20 named-landmark POVs per location. |
| `gen-landscape-spots.js` | Phase 4 — adds 50 biome-matched pretty-landscape scenes per location. |
| `qa-pure-scene-pool.js` | Strict QA pass on `pure_scene_eligible` entries. |
| `qa-recover-drops.js` | Recovery pass — restores wrongly-dropped iconic / biome-coded entries. |
| `qa-character-pool.js` | 2-pass QA for `character_eligible` (auto-flag Phase 4 + Sonnet cast-rubric review). |

All scripts are **idempotent on re-run** (only touch rows in the relevant
state). Cost numbers are inside the scripts' header comments.

## Migration trail

| Migration | What it added |
|-----------|---------------|
| `221_location_iconic_spots_pure_scene_eligible.sql` | `pure_scene_eligible boolean` column + partial index (where true + active). |
| `222_location_iconic_spots_character_eligible.sql`  | `character_eligible boolean` column + partial index. |

Both columns are nullable by design — `NULL` means *"hasn't been classified
yet"*. The engine treats `NULL` the same as `false` (the `.eq('...', true)`
filter excludes both). Re-running the classifier scripts is idempotent on
NULL rows.

## Cost reference (full QA cycle, one-shot 2026-06-04)

| Step | Sonnet cost |
|------|-------------|
| Phase 2 classifier | ~$0.60 |
| Phase 3 postcards | ~$0.50 |
| Phase 4 landscapes | ~$1.00 |
| Strict pure_scene QA | ~$1.20 |
| Recovery pass | ~$0.80 |
| Character QA (2-pass) | ~$1.50 |
| **Total** | **~$5.60** |

Re-running any single step on a single location is sub-cent.

## What this doesn't fix (sources of duds going forward)

Honest assessment — the **floor is way up**, but several failure modes remain
because they're not in the anchor pool:

1. **Flux variance.** Even with a perfect prompt + perfect anchor, the model
   has bad rolls. Some renders just come out mid.
2. **Axis clashes.** The brief still rolls time + weather + camera + (33%
   phenomena). Conflicting axes (e.g. *golden hour* + *foggy morning* +
   *aurora*) sometimes muddle the render.
3. **Vibe directive overpower.** Strong vibe (e.g. `nostalgic`) can pull the
   render away from the location identity.
4. **Cast-side issues.** Dual face swap especially has rough edges (see
   `CLAUDE.md` → Scaling Initiative).
5. **Sonnet hallucination.** Strict bans catch ~95%, not 100%.
6. **Repetition risk in the watch-list pools** (8 locations <60
   `pure_scene_eligible`).

Realistic expectation post-curation: ~75-85% bangers, ~10-15% mid (Flux
variance, axis clash), ~5-10% genuinely off (cast artifact, hallucination
escape, edge case).

## How to iterate / re-touch a specific location

If a location's renders feel weak after a few weeks of nightlies, the
playbook:

1. **Pull recent renders for that location** filtered by composition:
   ```sql
   SELECT u.id, u.image_url, l.rolled_axes
   FROM uploads u
   JOIN ai_generation_log l ON l.user_id = u.user_id
                            AND l.created_at BETWEEN u.created_at - INTERVAL '1 min'
                                                  AND u.created_at + INTERVAL '1 min'
   WHERE l.rolled_axes->>'engine' = 'nightly-pure-scene'
     AND l.rolled_axes->>'anchor' ILIKE '%<location>%'
   ORDER BY u.created_at DESC LIMIT 20;
   ```
2. **Identify weak anchors** from the failing renders. Are they specific
   anchors that always render mid? Or scattered random rolls?
3. **If specific weak anchors:** flip `pure_scene_eligible=false` or
   `character_eligible=false` directly via SQL on those entries. Document the
   reason in a comment.
4. **If the pool is thin** (watch-list locations): re-run
   `gen-postcard-spots.js` or `gen-landscape-spots.js` with
   `--limit-locations 1` and the location filter to bulk up. Then re-run the
   relevant QA pass.
5. **If a whole biome family feels off** (e.g. all desert_arid renders
   underwhelming): inspect the biome_config in `_shared/biomeAxes.ts` and the
   medium directives in `dream_mediums`. The anchor itself may be fine; the
   surrounding axes are the issue.

## Engine code references

| File | Section | Purpose |
|------|---------|---------|
| `supabase/functions/nightly-dreams/index.ts` | "pure_scene quality filter (2026-06-04)" block | The 2-column filter logic for anchor selection. |
| `supabase/functions/nightly-dreams/index.ts` | "Per-anchor framing rule" block | Uses the rolled spot's `spot_kind` (wide/medium/intimate) to choose framing language in the brief. |
| `supabase/functions/nightly-dreams/index.ts` | "Pure scene Phase 1 quality pass (2026-06-03)" block | The pure_scene brief's tightening (50-75 word cap, phenomena axis rolled 33%, explicit NO ADDITIONS rule block). |

## Hard rules

- **NEVER unscoped UPDATEs on `location_iconic_spots`.** This table holds
  the curated S/A/B + spot_kind + both eligibility columns. A blanket
  `UPDATE … SET pure_scene_eligible=true` wipes the QA pass work. Scope by
  `WHERE` clause aggressively. Always `SELECT COUNT(*) WHERE …` before any
  multi-row update.
- **NEVER drop the partial indexes.** Without them the engine's filtered
  spot query goes from <1ms to 50ms+ per render (4-7 location-level lookups
  per scene roll, on a 8k-row table — full scans add up).
- **NEVER trust a single QA pass.** The pure_scene QA over-dropped 64% of
  what it removed (the recovery pass restored those). When running a new
  rubric, always sample-validate against the dropped list before applying at
  scale.
- **Re-classifier runs are idempotent only on NULL rows.** Adding
  `--reclassify` to a script forces re-evaluation of already-classified
  rows. Use sparingly; you can over-write good prior judgments.

## Don't confuse with

- `bot_seeds` — the bots' seed table. Completely separate from
  `location_iconic_spots`. The pool work in this doc is for **nightly user
  dreams**, not bot posts.
- `nightly_seeds` — the 8-pool slotted-template table used by an older
  engine iteration. Vestigial; nightly engine reads from
  `user_recipes.recipe` + `location_iconic_spots` now, not `nightly_seeds`.
- `dream_templates` — LEGACY, dropped. Don't reference.
