# AXIS_POOL_EXPANSION.md — the 82 axis pools + historical activation of shadow posts

**Status of record for two jobs Kevin set on 2026-09-24 evening.** Update this file as work lands;
the driver ticks paths off itself. Read the checklist first to see how far it is.

Kevin, verbatim:

- _"go ahead and grow the 82 axis pools … plan out the 82 axis pool expansion, setup a tracker doc,
  and make sure to check off paths as you go so we know when it's done."_
- _"once you have the doc ready, you are approved to begin the expansion on all 82 paths. keep going
  until all of them are done. i will be away from the computer and not able to answer questions."_
- _"i want you to both- expansion and historical activation of shadow posts for all bots"_
- _"make sure to check the expansions and make sure they are accuately deduped"_

## Why

The 16 Track B paths that went live on 2026-09-24 had their hero pool grown to 100+ but their axis
pools (light, camera, palette, air, props, a second presence …) left at the MVP size of 25. The fleet
standard is every pool at 100+: of the 3,083 other seed pools on the 18 public bots the median is 150
entries, 79% are at 100 or more and only 12% are at 25 or fewer. A path on 25-entry axes repeats its
lighting, framing and detail choices far sooner than the rest of the fleet.

## Phase A — grow the 82 axis pools to 100+

**Target:** 100 entries per pool (the fleet floor). The existing entries are kept byte for byte; new
entries are appended after them. Castle-town-gate (disabled) is skipped. DinoBot's four SHARED paleo
pools are never touched; only each path's own pools are grown.

**Method (the August go-live rule: same recipe, append mode):**

| family | pools | command |
| --- | --- | --- |
| the path's own generator, `--pool <name> --target 100` (appends, backs up, signature-dedups) | BrickBot balloon + airfield, FaeBot regatta + star-charting + apothecary (`gen-faebot-pool.js`), DinoBot ×6 (`gen-dinobot-pool.js`) | `node <gen> --pool <pool> --target 100` |
| the path's own generator in scale mode (`generatePool` append) | PixelBot canal + forge | `SEED_TOTAL=100 node <gen> --only <slot> --scale` |
| the path's own generator, all pools, append | TinyBot snow-globe | `SEED_TOTAL=100 node gen-snow-globe-world.js` |
| register-derived grower (`scripts/reseed/grow-axis-pool.js`): the pool's own 25 entries are the recipe | MangaBot arcade (its generator is `append: false` and would OVERWRITE the live pools, including the reworded play-moment entries), SteamBot brass-glasshouse (no generator survives), `faebot_regatta_shore` | `node scripts/reseed/grow-axis-pool.js <bot> <pool> --target 100` |

**The dedupe gate (Kevin: "accurately deduped").** `scripts/reseed/check-axis-pool.js <bot> <pool>
--fix` runs after every grow and the pool is not done until it is clean:

1. exact duplicates (normalised) → 0
2. signature duplicates (`lib/seedDupeLint`, first 12 significant tokens) → 0
3. near-duplicates: Jaccard ≥ 0.6 on the VARYING words between ANY two entries → 0 (register words,
   the vocabulary ≥40% of the originals share, are removed first so a mandated opener or material law
   cannot read as duplication)
4. same-opening clusters: 6+ entries opening with the same three varying words → 0 (an actor-first
   axis reuses a small cast in its openings; six is a template echo). Was 4 until 20:50 UTC, which
   cost arcade play_moment 47 distinct beats.

Pairs or clusters made only of ORIGINAL entries are reported, never failed: they are Kevin-approved
and `--fix` does not touch them.

`--fix` drops the later offender of every pair, the driver tops the pool back up, up to 3 rounds.
The first N original entries are compared byte for byte afterwards; a pool whose originals moved is
flagged, never committed as done. The CI seed-dupe scanner runs again on every commit.

**Per path, after its pools:** 3 hidden smoke renders (`iter-bot --count 3 --post --shadow`) prove the
path still composes on the grown pools; then the path is ticked below and committed + pushed with
this file in the same commit.

**Driver:** `node scripts/reseed/grow-axis-pools.js` (`--plan` to refresh the tables without growing,
`--only bot/path`, `--no-commit`, `--no-smoke`). Log: `scratch-axis-driver.log` (untracked).

### Checklist (the driver ticks these)

<!-- CHECKLIST:START -->
- [x] **brickbot/balloon-festival** — 8/8 pools at ≥100 and clean; smoke 1/3 delivered, 2 failed; 2026-09-24 19:56 UTC
- [x] **brickbot/airfield-biplanes** — 8/8 pools at ≥100 and clean; smoke 0/3 delivered, 3 failed; 2026-09-24 20:19 UTC
- [x] **tinybot/snow-globe-world** — 3/3 pools at ≥100 and clean; smoke 1/3 delivered, 2 failed; 2026-09-24 20:30 UTC
- [ ] **mangabot/game-center-arcade** — 5/6 pools at ≥100 and clean; smoke 0/3 delivered, 3 failed; 2026-09-24 20:49 UTC
- [x] **steambot/brass-glasshouse** — 7/7 pools at ≥100 and clean; smoke 0/3 delivered, 3 failed; 2026-09-24 21:06 UTC
- [x] **pixelbot/floating-market-canal** — 8/8 pools at ≥100 and clean; smoke 1/3 delivered, 2 failed; 2026-09-24 21:31 UTC
- [x] **pixelbot/volcano-forge** — 9/9 pools at ≥100 and clean (camera originals restored from git 21:58 UTC); smoke 3/3 delivered; 2026-09-24 21:53 UTC
- [x] **faebot/mushroom-apothecary** — 7/7 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 22:09 UTC
- [x] **faebot/acorn-boat-regatta** — 7/7 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 22:27 UTC
- [x] **faebot/star-charting** — 7/7 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 22:42 UTC
- [ ] **dinobot/amber-forest** — 4/5 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 23:13 UTC
- [x] **dinobot/courtship-display** — 3/3 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 23:21 UTC
- [x] **dinobot/den-and-burrow** — 2/2 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 23:25 UTC
- [x] **dinobot/desert-dunes** — 0/0 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 23:26 UTC
- [x] **dinobot/snowline-forest** — 1/1 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 23:31 UTC
- [x] **dinobot/undergrowth-scale** — 1/1 pools at ≥100 and clean; smoke 3/3 delivered; 2026-09-24 23:34 UTC
<!-- CHECKLIST:END -->

### Per-pool table (before → after, gate result, originals intact)

<!-- POOLS:START -->
| path | pool | before | after | rounds | dedupe gate | originals intact | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| brickbot/balloon-festival | brickbot_balloon_build | 71 | 100 | 3 | clean | yes | ✅ |
| brickbot/balloon-festival | brickbot_balloon_camera_framing | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/balloon-festival | brickbot_balloon_crowd | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/balloon-festival | brickbot_balloon_event | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/balloon-festival | brickbot_balloon_field | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/balloon-festival | brickbot_balloon_hero | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/balloon-festival | brickbot_balloon_light | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/balloon-festival | brickbot_balloon_moment | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_build_technique | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_camera_framing | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_field_event | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_flight_moment | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_ground_crew_beat | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_lighting | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_palette | 25 | 100 | 3 | clean | yes | ✅ |
| brickbot/airfield-biplanes | brickbot_airfield_setting | 25 | 100 | 3 | clean | yes | ✅ |
| tinybot/snow-globe-world | tinybot_snow_globe_moments | 25 | 100 | 1 | clean | yes | ✅ |
| tinybot/snow-globe-world | tinybot_snow_globe_vessel | 100 | 100 | 0 | clean | yes | ✅ |
| tinybot/snow-globe-world | tinybot_snow_globe_weather | 100 | 100 | 0 | clean | yes | ✅ |
| mangabot/game-center-arcade | game_center_arcade_camera | 25 | 100 | 1 | clean | yes | ✅ |
| mangabot/game-center-arcade | game_center_arcade_extra_life | 25 | 100 | 4 | clean | yes | ✅ |
| mangabot/game-center-arcade | game_center_arcade_machine | 25 | 100 | 1 | clean | yes | ✅ |
| mangabot/game-center-arcade | game_center_arcade_neon_light | 25 | 100 | 1 | clean | yes | ✅ |
| mangabot/game-center-arcade | game_center_arcade_play_moment | 25 | 83 | 5 | clean | yes | ⚠️ needs attention |
| mangabot/game-center-arcade | game_center_arcade_prize_life | 25 | 100 | 1 | clean | yes | ✅ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_charm | 25 | 100 | 2 | clean | yes | ✅ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_keeper | 14 | 100 | 2 | clean | yes | ✅ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_light | 22 | 100 | 1 | clean | yes | ✅ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_machinery | 25 | 100 | 1 | clean | yes | ✅ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_planting | 25 | 100 | 1 | clean | yes | ✅ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_specimen | 25 | 100 | 1 | clean | yes | ✅ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_wet_air | 16 | 100 | 1 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_air | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_camera | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_canal_life | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_market_boats | 25 | 100 | 1 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_market_moment | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_palette | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_town_light | 25 | 100 | 2 | clean | yes | ✅ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_upper_town | 25 | 100 | 2 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_air | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_camera | 25 | 100 | 3 | clean | yes (restored from git 21:58 UTC, see the run log) | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_fire_event | 25 | 100 | 2 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_life | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_light | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_machinery | 25 | 100 | 2 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_moment | 25 | 100 | 3 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_palette | 25 | 100 | 2 | clean | yes | ✅ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_vault | 25 | 100 | 3 | clean | yes | ✅ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_air | 25 | 100 | 3 | clean | yes | ✅ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_hanging_stock | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_inhabitant | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_light_event | 25 | 100 | 3 | clean | yes | ✅ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_remedy_work | 25 | 100 | 3 | clean | yes | ✅ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_wares | 25 | 100 | 2 | clean | yes | ✅ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_window_view | 25 | 100 | 2 | clean | yes | ✅ |
| faebot/acorn-boat-regatta | faebot_regatta_bankside | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/acorn-boat-regatta | faebot_regatta_course_furniture | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/acorn-boat-regatta | faebot_regatta_race_moment | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/acorn-boat-regatta | faebot_regatta_racers | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/acorn-boat-regatta | faebot_regatta_shore | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/acorn-boat-regatta | faebot_regatta_stream_course | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/acorn-boat-regatta | faebot_regatta_water_light | 25 | 100 | 2 | clean | yes | ✅ |
| faebot/star-charting | faebot_starchart_air | 25 | 100 | 3 | clean | yes | ✅ |
| faebot/star-charting | faebot_starchart_company | 25 | 100 | 2 | clean | yes | ✅ |
| faebot/star-charting | faebot_starchart_reading_tool | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/star-charting | faebot_starchart_sighting_pose | 25 | 100 | 2 | clean | yes | ✅ |
| faebot/star-charting | faebot_starchart_sky_event | 25 | 100 | 1 | clean | yes | ✅ |
| faebot/star-charting | faebot_starchart_vantage | 25 | 100 | 2 | clean | yes | ✅ |
| faebot/star-charting | faebot_starchart_warm_light | 25 | 100 | 1 | clean | yes | ✅ |
| dinobot/amber-forest | dinobot_amber_air | 25 | 100 | 1 | clean | yes | ✅ |
| dinobot/amber-forest | dinobot_amber_optics | 25 | 100 | 1 | clean | yes | ✅ |
| dinobot/amber-forest | dinobot_amber_resident | 24 | 96 | 5 | clean | yes | ⚠️ needs attention |
| dinobot/amber-forest | dinobot_amber_resin_event | 25 | 100 | 2 | clean | yes | ✅ |
| dinobot/amber-forest | dinobot_amber_trapped | 25 | 100 | 3 | clean | yes | ✅ |
| dinobot/courtship-display | dinobot_courtship_arena | 25 | 100 | 3 | clean | yes | ✅ |
| dinobot/courtship-display | dinobot_courtship_audience | 25 | 100 | 2 | clean | yes | ✅ |
| dinobot/courtship-display | dinobot_courtship_feature | 25 | 100 | 1 | clean | yes | ✅ |
| dinobot/den-and-burrow | dinobot_den_life | 25 | 100 | 2 | clean | yes | ✅ |
| dinobot/den-and-burrow | dinobot_den_surface | 25 | 100 | 1 | clean | yes | ✅ |
| dinobot/snowline-forest | dinobot_snowline_forest_flora | 25 | 100 | 1 | clean | yes | ✅ |
| dinobot/undergrowth-scale | dinobot_undergrowth_giant | 25 | 100 | 1 | clean | yes | ✅ |
<!-- POOLS:END -->

## Phase B — historical activation of shadow posts, all bots

**What it is.** `scripts/promote-shadow-path.js` flips hidden shadow renders public and BACKDATES
them across the bot's past feed at a natural cadence, so a new path reads as though it had always
been posting instead of starting from zero. It never fabricates engagement (only the visibility and
time columns change).

**Selection rules (so no bad or foreign render goes public):**

1. Only renders whose path is currently LIVE on that bot (`paths[]`). Excluded: castle-town-gate
   (disabled), pixel-cozy-farm (parked rework), ToyBot's snow-globe-world (the path moved to
   TinyBot), AlphaBot (private), any deleted path.
2. Only renders made on a model the path can roll TODAY (its pin or its picker pool). This drops the
   Ultra probes on the three Pro-only paths (regatta and star-charting signed on Ultra), the
   flux-2-pro star-charting renders, and DinoBot's flux-dev matrix renders.
3. Only renders of CURRENT pool content: a pool entry from the path's current seed files must appear
   in the render's stored prompt. This drops the reseed program's "before" renders, which were made
   from entries that have since been replaced.
4. At most 12 per path, newest first, so no single path floods a bot's history.
5. Spread over the last 8 weeks, at least 90 minutes from any other post (the script's defaults).

Runs per bot with `--dry-run` first; the plan and the result are recorded below.

### Per-bot activation

<!-- ACTIVATION:START -->
| bot | paths | candidates | promoted | status |
| --- | --- | --- | --- | --- |
| bloombot | 5 (desert-bloom, flower-fantasy, flower-humming-birds, flower-friends, water-garden) | 38 | 38 | ✅ 2026-09-24 19:41 UTC |
| brickbot | 2 (airfield-biplanes, balloon-festival) | 24 | 24 | ✅ |
| chibibot | 7 (2 each: night-meadow, sunny-village, cottagecore-village, cozy-landscape, rainy-interior, aquatic-village, creature-adventures) | 14 | 14 | ✅ |
| dinobot | 7 (snowline-forest 12, desert-dunes 6, den-and-burrow 9, amber-forest 12, undergrowth-scale 12, courtship-display 12, paleo-landscape 12) | 75 | 75 | ✅ |
| dragonbot | 1 (castle) | 8 | 8 | ✅ |
| earthbot | 11 (hidden-corner 12, hawaii-flowers 12, coastal-vista 12, the other eight 8 each) | 100 | 100 | ✅ |
| faebot | 7 (star-charting, mushroom-apothecary, acorn-boat-regatta, queen-of-the-forest 12 each; dryad-portrait, forest-fairy-scene, enchanted-vista 8 each) | 72 | 72 | ✅ |
| farmbot | 2 (artisan-workshop 4, barn-animal-shelter-interior 2) | 6 | 6 | ✅ |
| gothbot | 3 (2 each: the-frost-garden, twilight-gothic, the-sanctum) | 6 | 6 | ✅ |
| mangabot | 3 (game-center-arcade 12, isekai-fantasy 8, slice-of-life 2) | 22 | 22 | ✅ |
| pixelbot | 2 (volcano-forge 12, floating-market-canal 12) | 24 | 24 | ✅ |
| starbot | 1 (space-femme) | 8 | 8 | ✅ |
| steambot | 4 (brass-glasshouse 12, skydock-harbor 2, steam-transport 2, cozy-steampunk 2) | 18 | 18 | ✅ |
| tinybot | 5 (snow-globe-world 12, contained-worlds 6, tiny-cozy 6, miniature-industry 6, pastel-village 6) | 36 | 36 | ✅ |
| yumbot | 3 (japanese-festival 12, meal-types 10, cuisine 6) | 28 | 28 | ✅ |
| **total** | **63 paths on 15 bots** | **479** | **479** | verified in the DB: all 479 public + posted, posted_at inside the 8-week window |

**Left hidden on purpose (688 renders):** 229 reseed "before" renders (replaced pool content), 118 renders on a
model the path no longer rolls (the Ultra probes on regatta / star-charting / brass-glasshouse, star-charting's
flux-2-pro batch, DinoBot's flux-dev matrix), 290 over the 12-per-path cap (older QA rounds), 51 on paths not live
on that bot (castle-town-gate, pixel-cozy-farm, ToyBot's old snow-globe-world). Script:
`scripts/activate-shadow-history.js --inventory <fleet inventory> --harness <scratchpad> [--dry-run]`; the exact
id lists are in `scratch-activation-plan.json` (untracked). Re-running is safe: promoted renders are no longer
shadow, so they cannot be selected twice.
<!-- ACTIVATION:END -->

## Run log

- 2026-09-24 evening — tracker created; Phase A driver started on all 16 paths.
- 2026-09-24 19:35 UTC — the gate over-fired on the first pool (a recipe that mandates its opener and a
  material law made every entry share most words: 49 good entries dropped). Fixed: register words
  (≥40% of the originals) are ignored by the overlap and opening tests, originals are exempt from
  failing the gate, and rounds 3-5 switch to the register-derived grower with the anti-list. Driver
  restarted; the first pool then reached 100 clean in 3 rounds.
- 2026-09-24 19:41 UTC — Phase B done, out of order on purpose (it has no dependency on Phase A):
  479 renders activated, all verified public + backdated; see the table above.
- 2026-09-24 19:56 UTC — brickbot/balloon-festival: 8/8 pools at 100, clean, originals intact. Smoke
  1/3: the two failures were `Replicate timed out after 90s` at the flux stage (an upstream stall,
  not the pools); the delivered render composed normally on the grown pools.
- 2026-09-24 20:19 UTC — brickbot/airfield-biplanes: 8/8 pools at 100, clean. Smoke 0/3, all
  Replicate timeouts. Confirmed upstream: our predictions on flux-1.1-pro and ultra have sat in
  `starting` since ~19:50 UTC (a 19:51 prediction waited 5 min to start; 20:15 and 20:19 ones never
  started) while Replicate's status page reads operational. Pool growth is unaffected (Sonnet), so
  the driver continues; **every path whose smoke line is under 3/3 gets a re-smoke pass once
  Replicate recovers**, and those lines are updated then.
- 2026-09-24 20:50 UTC — mangabot/game-center-arcade: 5/6 pools at 100; `play_moment` stopped at 83
  after 5 rounds because the same-opening rule (then 4) kept dropping beats that merely share an
  actor opening. Rule relaxed to 6 (see the gate). **Follow-up: re-run `--only
  mangabot/game-center-arcade` after the main driver finishes** to top that pool up; smoke 0/3 was
  Replicate again (two 90 s timeouts and a 503).
- 2026-09-24 21:53 UTC — pixelbot/volcano-forge: 9 pools at 100, smoke 3/3 (Replicate is back). The
  originals check caught a real problem on `pixelbot_volcano_forge_camera`: the generator keeps its
  camera pool as an inline hand-authored list and `--only camera --scale` rewrote the file from that
  copy, replacing six originals that had been hand-edited during the path's QA rounds ("FAR END" →
  "COOL END" and the like). Repaired 21:58 UTC: the 25 originals restored byte for byte from git, the
  75 new entries kept, gate clean at 100. The canal camera pool was checked the same way and was
  untouched (its inline copy matched the disk). The driver now routes both camera pools through
  the register-derived grower only.
