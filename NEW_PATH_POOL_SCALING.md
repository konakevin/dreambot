# New-path pools — scale to production

**For the agent running the reseed program. Written 2026-09-23.**

Eighteen new bot content paths were built, QA'd and approved by Kevin. They are merged, they work,
and **none of them have ever posted publicly** — they sit at MVP seed depth in `shadowPaths[]`. This
doc says what they are, where they came from, exactly what state each pool is in, and what has to
happen to take them to production depth.

**This is a separate track from the pool-repair work in `RESEED_STATUS.md`.** That program fixes DEEP
pools that hold FEW distinct ideas. This one fills THIN pools that were never scaled. Same quality
bar, opposite starting condition. Read §5 before writing a single entry — scaling these with the old
generator is precisely how the fleet ended up with 200-entry pools holding 69 ideas.

---

## 1. Where these came from

A 35-path content expansion run (the "operation ~55 new bot paths" effort). Each path was built to the
`bot-paths` skill's process: design → seed to **MVP-25** → write the path builder → render 3 → view
every image → judge → root-cause → fix, capped at 3 rounds.

MVP-25 is deliberate. The skill says: _"Seed to 25 (MVP depth — scale to 200+ only after the whole
roster is signed off, never before)."_ The roster is now signed off. **This doc is that scale-up.**

All 35 were merged shadow-only and rendered into an HTML grading sheet. Kevin cut 17 and approved 18.
The 17 cut paths were deleted (151 files) and their 386 test renders plus 1,158 storage objects were
purged; 98 approved renders were folded into the bots' public histories. `snow-globe-world` was moved
from ToyBot to TinyBot at Kevin's request.

So: these 18 are the survivors of a taste cut. Their **content design is approved**. Nobody is asking
you to redesign them. You are filling pools that were only ever seeded deep enough to test the idea.

---

## 2. Current state

|                                         |                                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| paths approved                          | 18                                                                                                     |
| merged into their bot                   | 18                                                                                                     |
| in `paths[]` (live, dispatcher-visible) | **0**                                                                                                  |
| in `shadowPaths[]`                      | **18**                                                                                                 |
| total pools                             | 123                                                                                                    |
| pools under 100 entries                 | **109**                                                                                                |
| pools at exactly 24-25 (untouched MVP)  | ~107                                                                                                   |
| pools already at production depth       | 4 (all `cozy-farming-life-sim`)                                                                        |
| thinnest                                | `steambot_brass_glasshouse_keeper` **14**, `..._wet_air` **16**, `dinobot_undergrowth_resident` **23** |

**Shadow means invisible.** A path in `shadowPaths[]` is skipped by the dispatcher and its renders post
with `is_public=false` / `is_posted=false`. Going live is moving one string from `shadowPaths[]` to
`paths[]` in the bot's `index.js` — the "faithful xerox" rule. **That is Kevin's call, not yours.**
Do not promote anything as part of this task.

### The 4 shared pools — DO NOT SCALE

These are DinoBot's shared paleo pools. They already sit at 100-150 and are used by up to 15 paths
including live ones, so touching them is a fleet-wide change, not a path-local one.

| entries | pool                                       | used by  |
| ------- | ------------------------------------------ | -------- |
| 100     | `dinobot_paleo_landscape_phenomenon`       | 15 paths |
| 100     | `dinobot_paleo_landscape_sky`              | 3 paths  |
| 150     | `dinobot_paleo_landscape_megaflora`        | 2 paths  |
| 150     | `dinobot_paleo_landscape_surprise_element` | 3 paths  |

Every one of the other **113 pools is exclusive to its own approved path**, so it can be scaled
without affecting anything else. That is verified, not assumed.

---

## 3. Per-path inventory

Counts are live as of 2026-09-23. Pools marked SHARED are the §2 exclusions.

### brickbot / airfield-biplanes (9 pools)

| entries | pool                                 | note |
| ------- | ------------------------------------ | ---- |
| 25      | `brickbot_airfield_aircraft`         |      |
| 25      | `brickbot_airfield_build_technique`  |      |
| 25      | `brickbot_airfield_camera_framing`   |      |
| 25      | `brickbot_airfield_field_event`      |      |
| 25      | `brickbot_airfield_flight_moment`    |      |
| 25      | `brickbot_airfield_ground_crew_beat` |      |
| 25      | `brickbot_airfield_lighting`         |      |
| 25      | `brickbot_airfield_palette`          |      |
| 25      | `brickbot_airfield_setting`          |      |

### brickbot / balloon-festival (9 pools)

| entries | pool                              | note |
| ------- | --------------------------------- | ---- |
| 25      | `brickbot_balloon_build`          |      |
| 25      | `brickbot_balloon_camera_framing` |      |
| 25      | `brickbot_balloon_crowd`          |      |
| 25      | `brickbot_balloon_event`          |      |
| 25      | `brickbot_balloon_field`          |      |
| 25      | `brickbot_balloon_fleet`          |      |
| 25      | `brickbot_balloon_hero`           |      |
| 25      | `brickbot_balloon_light`          |      |
| 25      | `brickbot_balloon_moment`         |      |

### dinobot / amber-forest (6 pools)

| entries | pool                        | note |
| ------- | --------------------------- | ---- |
| 24      | `dinobot_amber_resident`    |      |
| 25      | `dinobot_amber_air`         |      |
| 25      | `dinobot_amber_grove`       |      |
| 25      | `dinobot_amber_optics`      |      |
| 25      | `dinobot_amber_resin_event` |      |
| 25      | `dinobot_amber_trapped`     |      |

### dinobot / courtship-display (5 pools)

| entries | pool                                 | note                                    |
| ------- | ------------------------------------ | --------------------------------------- |
| 25      | `dinobot_courtship_act`              |                                         |
| 25      | `dinobot_courtship_arena`            |                                         |
| 25      | `dinobot_courtship_audience`         |                                         |
| 25      | `dinobot_courtship_feature`          |                                         |
| 100     | `dinobot_paleo_landscape_phenomenon` | **SHARED** with 15 paths — out of scope |

### dinobot / den-and-burrow (4 pools)

| entries | pool                                 | note                                    |
| ------- | ------------------------------------ | --------------------------------------- |
| 25      | `dinobot_den_chamber`                |                                         |
| 25      | `dinobot_den_life`                   |                                         |
| 25      | `dinobot_den_surface`                |                                         |
| 100     | `dinobot_paleo_landscape_phenomenon` | **SHARED** with 15 paths — out of scope |

### dinobot / desert-dunes (5 pools)

| entries | pool                                       | note                                    |
| ------- | ------------------------------------------ | --------------------------------------- |
| 25      | `dinobot_desert_dunes_biome`               |                                         |
| 100     | `dinobot_paleo_landscape_phenomenon`       | **SHARED** with 15 paths — out of scope |
| 100     | `dinobot_paleo_landscape_sky`              | **SHARED** with 3 paths — out of scope  |
| 150     | `dinobot_paleo_landscape_megaflora`        | **SHARED** with 2 paths — out of scope  |
| 150     | `dinobot_paleo_landscape_surprise_element` | **SHARED** with 3 paths — out of scope  |

### dinobot / snowline-forest (5 pools)

| entries | pool                                       | note                                    |
| ------- | ------------------------------------------ | --------------------------------------- |
| 25      | `dinobot_snowline_forest_biome`            |                                         |
| 25      | `dinobot_snowline_forest_flora`            |                                         |
| 100     | `dinobot_paleo_landscape_phenomenon`       | **SHARED** with 15 paths — out of scope |
| 100     | `dinobot_paleo_landscape_sky`              | **SHARED** with 3 paths — out of scope  |
| 150     | `dinobot_paleo_landscape_surprise_element` | **SHARED** with 3 paths — out of scope  |

### dinobot / undergrowth-scale (4 pools)

| entries | pool                                 | note                                    |
| ------- | ------------------------------------ | --------------------------------------- |
| 23      | `dinobot_undergrowth_resident`       |                                         |
| 25      | `dinobot_undergrowth_floor`          |                                         |
| 25      | `dinobot_undergrowth_giant`          |                                         |
| 100     | `dinobot_paleo_landscape_phenomenon` | **SHARED** with 15 paths — out of scope |

### faebot / acorn-boat-regatta (8 pools)

| entries | pool                              | note |
| ------- | --------------------------------- | ---- |
| 25      | `faebot_regatta_bankside`         |      |
| 25      | `faebot_regatta_boat_fleet`       |      |
| 25      | `faebot_regatta_course_furniture` |      |
| 25      | `faebot_regatta_race_moment`      |      |
| 25      | `faebot_regatta_racers`           |      |
| 25      | `faebot_regatta_shore`            |      |
| 25      | `faebot_regatta_stream_course`    |      |
| 25      | `faebot_regatta_water_light`      |      |

### faebot / mushroom-apothecary (8 pools)

| entries | pool                                       | note |
| ------- | ------------------------------------------ | ---- |
| 25      | `faebot_mushroom_apothecary_air`           |      |
| 25      | `faebot_mushroom_apothecary_hanging_stock` |      |
| 25      | `faebot_mushroom_apothecary_inhabitant`    |      |
| 25      | `faebot_mushroom_apothecary_light_event`   |      |
| 25      | `faebot_mushroom_apothecary_remedy_work`   |      |
| 25      | `faebot_mushroom_apothecary_room`          |      |
| 25      | `faebot_mushroom_apothecary_wares`         |      |
| 25      | `faebot_mushroom_apothecary_window_view`   |      |

### faebot / star-charting (8 pools)

| entries | pool                             | note |
| ------- | -------------------------------- | ---- |
| 25      | `faebot_starchart_air`           |      |
| 25      | `faebot_starchart_astronomer`    |      |
| 25      | `faebot_starchart_company`       |      |
| 25      | `faebot_starchart_reading_tool`  |      |
| 25      | `faebot_starchart_sighting_pose` |      |
| 25      | `faebot_starchart_sky_event`     |      |
| 25      | `faebot_starchart_vantage`       |      |
| 25      | `faebot_starchart_warm_light`    |      |

### mangabot / game-center-arcade (7 pools)

| entries | pool                             | note |
| ------- | -------------------------------- | ---- |
| 25      | `game_center_arcade_camera`      |      |
| 25      | `game_center_arcade_extra_life`  |      |
| 25      | `game_center_arcade_machine`     |      |
| 25      | `game_center_arcade_neon_light`  |      |
| 25      | `game_center_arcade_play_moment` |      |
| 25      | `game_center_arcade_prize_life`  |      |
| 25      | `game_center_arcade_room`        |      |

### pixelbot / castle-town-gate (10 pools)

| entries | pool                                       | note |
| ------- | ------------------------------------------ | ---- |
| 25      | `pixelbot_castle_town_gate_air`            |      |
| 25      | `pixelbot_castle_town_gate_arrival_moment` |      |
| 25      | `pixelbot_castle_town_gate_camera`         |      |
| 25      | `pixelbot_castle_town_gate_gate_life`      |      |
| 25      | `pixelbot_castle_town_gate_gate_light`     |      |
| 25      | `pixelbot_castle_town_gate_gatehouse`      |      |
| 25      | `pixelbot_castle_town_gate_palette`        |      |
| 25      | `pixelbot_castle_town_gate_town_above`     |      |
| 25      | `pixelbot_castle_town_gate_travellers`     |      |
| 25      | `pixelbot_castle_town_gate_wall_life`      |      |

### pixelbot / cozy-farming-life-sim (4 pools)

| entries | pool                                         | note |
| ------- | -------------------------------------------- | ---- |
| 195     | `pixelbot_cozy_farming_farm_locale`          |      |
| 200     | `pixelbot_cozy_farming_cozy_phenomenon`      |      |
| 200     | `pixelbot_cozy_farming_farm_biome`           |      |
| 200     | `pixelbot_cozy_farming_farmer_villager_life` |      |

### pixelbot / floating-market-canal (9 pools)

| entries | pool                                           | note |
| ------- | ---------------------------------------------- | ---- |
| 25      | `pixelbot_floating_market_canal_air`           |      |
| 25      | `pixelbot_floating_market_canal_camera`        |      |
| 25      | `pixelbot_floating_market_canal_canal_life`    |      |
| 25      | `pixelbot_floating_market_canal_canal_town`    |      |
| 25      | `pixelbot_floating_market_canal_market_boats`  |      |
| 25      | `pixelbot_floating_market_canal_market_moment` |      |
| 25      | `pixelbot_floating_market_canal_palette`       |      |
| 25      | `pixelbot_floating_market_canal_town_light`    |      |
| 25      | `pixelbot_floating_market_canal_upper_town`    |      |

### pixelbot / volcano-forge (10 pools)

| entries | pool                                | note |
| ------- | ----------------------------------- | ---- |
| 25      | `pixelbot_volcano_forge_air`        |      |
| 25      | `pixelbot_volcano_forge_camera`     |      |
| 25      | `pixelbot_volcano_forge_fire_event` |      |
| 25      | `pixelbot_volcano_forge_forge`      |      |
| 25      | `pixelbot_volcano_forge_life`       |      |
| 25      | `pixelbot_volcano_forge_light`      |      |
| 25      | `pixelbot_volcano_forge_machinery`  |      |
| 25      | `pixelbot_volcano_forge_moment`     |      |
| 25      | `pixelbot_volcano_forge_palette`    |      |
| 25      | `pixelbot_volcano_forge_vault`      |      |

### steambot / brass-glasshouse (8 pools)

| entries | pool                                  | note |
| ------- | ------------------------------------- | ---- |
| 14      | `steambot_brass_glasshouse_keeper`    |      |
| 16      | `steambot_brass_glasshouse_wet_air`   |      |
| 22      | `steambot_brass_glasshouse_light`     |      |
| 25      | `steambot_brass_glasshouse_charm`     |      |
| 25      | `steambot_brass_glasshouse_house`     |      |
| 25      | `steambot_brass_glasshouse_machinery` |      |
| 25      | `steambot_brass_glasshouse_planting`  |      |
| 25      | `steambot_brass_glasshouse_specimen`  |      |

### tinybot / snow-globe-world (4 pools)

| entries | pool                         | note |
| ------- | ---------------------------- | ---- |
| 25      | `tinybot_snow_globe_moments` |      |
| 25      | `tinybot_snow_globe_vessel`  |      |
| 25      | `tinybot_snow_globe_weather` |      |
| 25      | `tinybot_snow_globe_worlds`  |      |

---

## 4. What "production depth" means here

Kevin's standard:

> "All seed pools should be at least 100 deep for 'scene' pools … I want deep, diverse pools so that
> bot posts are always unique and fresh across a time window."

And the thing that makes the number meaningless on its own:

> "We should not just throw out what's there outright, but instead just make them actually distinct
> in idea."

**The bar is 100 distinct IDEAS, not 100 entries.** A 200-entry pool holding 69 ideas delivers 69
distinguishable renders. Pool picks are a true shuffle-bag (`botEngine.pickWithRecency` — every entry
drawn once before any repeat), so nobody sees the same _entry_ twice in a cycle; they see a different
entry describing the same thing. That is the repetition Kevin reported.

**Priority: subject pools first.** The subject pool states what the render is OF. Everything else
(lighting, palette, camera/framing, weather, atmosphere, composition, build technique) modifies it.
A repeated camera angle is invisible; a repeated subject is the complaint.

⚠️ **None of these 18 paths are in `SUBJECT_POOL_MAP.json`** — that map was built from `paths[]` only
and these are all shadow. You will need to identify each path's subject pool yourself.
`scripts/identify-subject-pools.js` does this with an LLM read of the path file; point it at these.
**Do not classify by slot name** — there is no convention across the fleet, and a regex approach
covered 8 of 18 bots and silently missed the rest.

From a read of the inventory, the subject pool is usually the obvious noun slot — `..._aircraft`,
`..._fleet`, `..._chamber`, `..._arena`, `..._resident`, `..._locale`, `..._worlds`. Slots like
`_camera_framing`, `_lighting`, `_palette`, `_build_technique`, `_air`, `_optics` are axes. Confirm per
path rather than trusting that pattern.

---

## 5. ⚠️ How to scale WITHOUT recreating the fleet's problem

This is the part that matters. Read `SEED_POOL_REPAIR_HANDOFF.md` §2 and §4 in full first.

### 5a. Never change what a pool IS

Kevin, after I did exactly this on the pilot:

> "Don't fucking change the fabric/essence of a pool while working to fix it … you're introducing
> variables that we can't then control or test because you're fucking with the prompt prefix and
> nature of the pool, then rewriting it to bend to that … I'm confused why you can't just keep the
> original intent of the pool and fucking try to fill it with unique entries, why did you rewrite it?"

Read the 25 existing entries, derive the pool's intent from them plus the path header plus the
archetype template, then **add entries of exactly that kind**. No invented category scheme, no new
axes, no shifted register, no prompt-prefix edits. If a pool's documented intent is ambiguous or
self-contradictory, that is a call for Kevin — ask, don't infer.

`scripts/reseed-subject-pool.js` is built on the rejected category method. **Do not run it as-is.**

### 5b. The measurement cannot be your gate

`scripts/lib/ideaSimilarity.js` is wrong in both directions on labelled real data, locked in
`__tests__/lib/ideaSimilarity.test.ts`:

- unstripped, a rigid shared skeleton makes unrelated entries look duplicated;
- stripped, near-duplicates lose their shared text and score as maximally _different_ — the nine
  labelled magnolia duplicates never merge at any threshold down to 0.10.

So a `distinct` count is an **upper bound on diversity** = a **lower bound on redundancy**. Use it as a
free prefilter and CI tripwire only. **An LLM judges sameness** — Kevin approved that spend:
_"worth the expense to get the pools cleaned up and topped off with actually unique ideas."_

Never quote a distinct/redundant figure without stating its threshold AND stripping basis. Those two
choices moved one pool between 8 and 137 distinct ideas.

Also unfixed: `reseed-subject-pool.js` validates at **0.48** while `ideaSimilarity.SAME_IDEA` is
**0.60** and `audit-seed-redundancy.js` uses the constant. Unify before you rely on any of them.

### 5c. Generate in small batches

Ten entries per concept produced ~1/3 recombination of the same vocabulary and 131 of 200 rejected as
"same as another new entry". Small batches, more concepts.

### 5d. Known content traps (all cost real renders to discover)

- **Negation leaks.** Flux has no "not". Naming a banned noun renders it. Write positive-only.
- **Literal hue words.** "green undertone" renders literally green skin. Use warm/neutral language.
- **Invented cultivars.** The pilot emitted "pale-turquoise scabiosa" and "pale lime-green zinnia".
  No such flowers. Name real species and real colours.
- **Prompt position.** Flux attends to what comes FIRST. Content at >35% of the prompt is largely
  invisible — measured repeatedly. Do not bury the subject.
- **Prompt length.** A ~600-word prompt renders roughly its first third. Fleet median is ~250.
- **Accepted Flux limits (Kevin, do not chase):** species render in their own trained colour; a rich
  register only reads on strong-colour families. _"You can't force Flux out of its trained data."_

---

## 6. Procedure per path

1. **Pick one path.** Do not batch across paths.
2. **Identify its subject pool(s)** (§4). Record which pools are subject and which are axis.
3. **Read every existing entry** in the pool you are scaling. Write its intent down in one paragraph
   and confirm with Kevin before generating.
4. **Dry-run first.** Kevin: _"dry-run before actually mutating the pools is necessary to validate what
   we think will happen."_ Show him a sample of proposed entries before anything is written.
5. **Back up the pool file** before any write. Keep every original entry. A pool must never come out
   shallower than it went in.
6. **Scale the SUBJECT pool to 100+ distinct ideas first.** Axis pools after, and only if Kevin wants
   them; they are lower value.
7. **Prove it with forced shadow renders.** An unforced batch is worthless — with 74 of 137 entries
   new, 6 unforced renders drew 1 new seed. Force the picker so every render exercises a NEW entry:
   intercept `picker.pickWithRecency(pool, axis)` on the subject slot; `brief-composer.js` passes the
   slot name straight through, so matching on the slot name works.
8. **Kevin reviews the renders in the app** (they are shadow, so he sees them and nobody else does).
   HTML sheets are also fine.
9. **Update `RESEED_STATUS.md` in the same commit** as the work, and add any new lesson to
   `BOT_SCENE_QUALITY_PLAYBOOK.md`.
10. **Do not promote the path to `paths[]`.** Going live is Kevin's decision, separate from this work.

### Suggested order

Start with a path whose pools are all bespoke and whose subject slot is unambiguous, so the method is
proven before it meets a hard case:

1. `tinybot/snow-globe-world` — only 4 pools, all 25, subject slot obvious (`_worlds`), self-contained
2. `mangabot/game-center-arcade` — 7 pools, all bespoke
3. `steambot/brass-glasshouse` — 8 pools and the thinnest in the set (14, 16, 22)
4. `brickbot/airfield-biplanes` and `balloon-festival` — 9 each, same bot, shared conventions
5. PixelBot's three (`castle-town-gate`, `floating-market-canal`, `volcano-forge`) — 10 pools each, and
   they load seeds lazily by naming convention via `scenePaths.js`, so read that first
6. FaeBot's three, then DinoBot's six last — DinoBot's are entangled with the shared paleo pools you
   must not touch

---

## 7. Hard rules that apply

- **Render batches: concurrency ≤3**, gate on `node scripts/check-pool-headroom.js` first (exit 1 =
  too tight), avoid the top-of-hour and ~08:00 UTC windows. Each edge-fn render holds a Postgres
  connection for 20-150s; saturating the pool takes the whole app down. This is a recurring incident.
- **Never an unscoped delete on `bot_seeds` / `nightly_seeds`.** Scope by category prefix and
  `SELECT category, count(*) GROUP BY category` first.
- **Never `git add -A` / `git add .`** — explicit paths only, shared working tree with other agents.
  Read the staged diff before committing.
- **Never `--no-verify`.** `npm run check` must pass; it includes `scan:bot-seed-dupes`, which must
  stay at 0 exact duplicates fleet-wide.
- **Re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` in full before any bot work** (CLAUDE.md hard rule) and
  update it with every new lesson.
- **Do not touch another agent's WIP files.** Untracked `scripts/_tmp-*.js` belong to other efforts.

---

## 8. Definition of done, per path

1. Subject pool holds **100+ genuinely distinct ideas**, judged by an LLM, not by the lexical score.
2. Every original entry is still present; the pool only grew.
3. The pool's intent, register, format and prefix are unchanged.
4. Forced shadow renders across NEW entries, reviewed by Kevin, and he said they are good.
5. `RESEED_STATUS.md` updated in the same commit; playbook updated with any lesson.
6. Path still in `shadowPaths[]` — promotion is a separate, explicit decision.

---

## 9. Open questions for Kevin

1. **Axis pools too, or subject only?** 123 pools at 100+ each is a large amount of generated content.
   Subject-only is roughly 18-25 pools and captures nearly all the visible variety.
2. **Is 100 the right floor for a shadow path that may post rarely?** A path sharing a bot's rotation
   with 20 others is consumed far slower than a bot's only path.
3. **Should any of the 18 go live before or after scaling?** They have never posted. Scaling first
   means they debut at full depth; going live first means real feedback sooner on thin pools.
