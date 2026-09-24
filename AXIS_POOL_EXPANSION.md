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
3. near-duplicates: content-word Jaccard ≥ 0.6 between ANY two entries → 0
4. same-opening clusters: 4+ entries opening with the same three content words → 0 (up to 3 may
   open alike; four is a template echo)

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
- [ ] **brickbot/balloon-festival** — 8 pools
- [ ] **brickbot/airfield-biplanes** — 8 pools
- [ ] **tinybot/snow-globe-world** — 3 pools
- [ ] **mangabot/game-center-arcade** — 6 pools
- [ ] **steambot/brass-glasshouse** — 7 pools
- [ ] **pixelbot/floating-market-canal** — 8 pools
- [ ] **pixelbot/volcano-forge** — 9 pools
- [ ] **faebot/mushroom-apothecary** — 7 pools
- [ ] **faebot/acorn-boat-regatta** — 7 pools
- [ ] **faebot/star-charting** — 7 pools
- [ ] **dinobot/amber-forest** — 5 pools
- [ ] **dinobot/courtship-display** — 3 pools
- [ ] **dinobot/den-and-burrow** — 2 pools
- [ ] **dinobot/desert-dunes** — 0 pools
- [ ] **dinobot/snowline-forest** — 1 pools
- [ ] **dinobot/undergrowth-scale** — 1 pools
<!-- CHECKLIST:END -->

### Per-pool table (before → after, gate result, originals intact)

<!-- POOLS:START -->
| path | pool | before | after | rounds | dedupe gate | originals intact | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| brickbot/balloon-festival | brickbot_balloon_build | 25 |  |  |  |  | ⬜ |
| brickbot/balloon-festival | brickbot_balloon_camera_framing | 25 |  |  |  |  | ⬜ |
| brickbot/balloon-festival | brickbot_balloon_crowd | 25 |  |  |  |  | ⬜ |
| brickbot/balloon-festival | brickbot_balloon_event | 25 |  |  |  |  | ⬜ |
| brickbot/balloon-festival | brickbot_balloon_field | 25 |  |  |  |  | ⬜ |
| brickbot/balloon-festival | brickbot_balloon_hero | 25 |  |  |  |  | ⬜ |
| brickbot/balloon-festival | brickbot_balloon_light | 25 |  |  |  |  | ⬜ |
| brickbot/balloon-festival | brickbot_balloon_moment | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_build_technique | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_camera_framing | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_field_event | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_flight_moment | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_ground_crew_beat | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_lighting | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_palette | 25 |  |  |  |  | ⬜ |
| brickbot/airfield-biplanes | brickbot_airfield_setting | 25 |  |  |  |  | ⬜ |
| tinybot/snow-globe-world | tinybot_snow_globe_moments | 25 |  |  |  |  | ⬜ |
| tinybot/snow-globe-world | tinybot_snow_globe_vessel | 25 |  |  |  |  | ⬜ |
| tinybot/snow-globe-world | tinybot_snow_globe_weather | 25 |  |  |  |  | ⬜ |
| mangabot/game-center-arcade | game_center_arcade_camera | 25 |  |  |  |  | ⬜ |
| mangabot/game-center-arcade | game_center_arcade_extra_life | 25 |  |  |  |  | ⬜ |
| mangabot/game-center-arcade | game_center_arcade_machine | 25 |  |  |  |  | ⬜ |
| mangabot/game-center-arcade | game_center_arcade_neon_light | 25 |  |  |  |  | ⬜ |
| mangabot/game-center-arcade | game_center_arcade_play_moment | 25 |  |  |  |  | ⬜ |
| mangabot/game-center-arcade | game_center_arcade_prize_life | 25 |  |  |  |  | ⬜ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_charm | 25 |  |  |  |  | ⬜ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_keeper | 14 |  |  |  |  | ⬜ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_light | 22 |  |  |  |  | ⬜ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_machinery | 25 |  |  |  |  | ⬜ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_planting | 25 |  |  |  |  | ⬜ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_specimen | 25 |  |  |  |  | ⬜ |
| steambot/brass-glasshouse | steambot_brass_glasshouse_wet_air | 16 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_air | 25 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_camera | 25 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_canal_life | 25 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_market_boats | 25 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_market_moment | 25 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_palette | 25 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_town_light | 25 |  |  |  |  | ⬜ |
| pixelbot/floating-market-canal | pixelbot_floating_market_canal_upper_town | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_air | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_camera | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_fire_event | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_life | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_light | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_machinery | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_moment | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_palette | 25 |  |  |  |  | ⬜ |
| pixelbot/volcano-forge | pixelbot_volcano_forge_vault | 25 |  |  |  |  | ⬜ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_air | 25 |  |  |  |  | ⬜ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_hanging_stock | 25 |  |  |  |  | ⬜ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_inhabitant | 25 |  |  |  |  | ⬜ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_light_event | 25 |  |  |  |  | ⬜ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_remedy_work | 25 |  |  |  |  | ⬜ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_wares | 25 |  |  |  |  | ⬜ |
| faebot/mushroom-apothecary | faebot_mushroom_apothecary_window_view | 25 |  |  |  |  | ⬜ |
| faebot/acorn-boat-regatta | faebot_regatta_bankside | 25 |  |  |  |  | ⬜ |
| faebot/acorn-boat-regatta | faebot_regatta_course_furniture | 25 |  |  |  |  | ⬜ |
| faebot/acorn-boat-regatta | faebot_regatta_race_moment | 25 |  |  |  |  | ⬜ |
| faebot/acorn-boat-regatta | faebot_regatta_racers | 25 |  |  |  |  | ⬜ |
| faebot/acorn-boat-regatta | faebot_regatta_shore | 25 |  |  |  |  | ⬜ |
| faebot/acorn-boat-regatta | faebot_regatta_stream_course | 25 |  |  |  |  | ⬜ |
| faebot/acorn-boat-regatta | faebot_regatta_water_light | 25 |  |  |  |  | ⬜ |
| faebot/star-charting | faebot_starchart_air | 25 |  |  |  |  | ⬜ |
| faebot/star-charting | faebot_starchart_company | 25 |  |  |  |  | ⬜ |
| faebot/star-charting | faebot_starchart_reading_tool | 25 |  |  |  |  | ⬜ |
| faebot/star-charting | faebot_starchart_sighting_pose | 25 |  |  |  |  | ⬜ |
| faebot/star-charting | faebot_starchart_sky_event | 25 |  |  |  |  | ⬜ |
| faebot/star-charting | faebot_starchart_vantage | 25 |  |  |  |  | ⬜ |
| faebot/star-charting | faebot_starchart_warm_light | 25 |  |  |  |  | ⬜ |
| dinobot/amber-forest | dinobot_amber_air | 25 |  |  |  |  | ⬜ |
| dinobot/amber-forest | dinobot_amber_optics | 25 |  |  |  |  | ⬜ |
| dinobot/amber-forest | dinobot_amber_resident | 24 |  |  |  |  | ⬜ |
| dinobot/amber-forest | dinobot_amber_resin_event | 25 |  |  |  |  | ⬜ |
| dinobot/amber-forest | dinobot_amber_trapped | 25 |  |  |  |  | ⬜ |
| dinobot/courtship-display | dinobot_courtship_arena | 25 |  |  |  |  | ⬜ |
| dinobot/courtship-display | dinobot_courtship_audience | 25 |  |  |  |  | ⬜ |
| dinobot/courtship-display | dinobot_courtship_feature | 25 |  |  |  |  | ⬜ |
| dinobot/den-and-burrow | dinobot_den_life | 25 |  |  |  |  | ⬜ |
| dinobot/den-and-burrow | dinobot_den_surface | 25 |  |  |  |  | ⬜ |
| dinobot/snowline-forest | dinobot_snowline_forest_flora | 25 |  |  |  |  | ⬜ |
| dinobot/undergrowth-scale | dinobot_undergrowth_giant | 25 |  |  |  |  | ⬜ |
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
<!-- ACTIVATION:END -->

## Run log

- 2026-09-24 evening — tracker created; Phase A driver started on all 16 paths.
