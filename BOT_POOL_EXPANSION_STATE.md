# BOT_POOL_EXPANSION_STATE.md

**Status of record for the 2026-09 bot pool expansion.** Both the plan and the progress tracker.
Created 2026-09-22. Step 0 (audit tooling) and step 1a (duplicate purge) are DONE; everything else is
still unexecuted.

**To resume after a context roll-over or a killed run:** read this file top to bottom, find the first
unchecked box, continue there. The checkboxes plus live pool counts are the source of truth, not
anything in a transcript.

**Regenerate every measurement in this file** (all three read `scripts/bots/*/seeds/*.json` as data,
none of them ever writes a seed file):

```sh
node scripts/audit-bot-pool-wiring.js --json /tmp/wiring.json      # wired vs dormant vs orphan
node scripts/scan-bot-seed-dupes.js  --wired /tmp/wiring.json      # exact + near dupes, saturation
node scripts/sweep-bot-seed-defects.js --wired /tmp/wiring.json    # known bad-render phrase families
```

---

## 0. AGENT HANDOFF — read this section first

You are picking up a multi-stage bot content expansion. Nothing here assumes you were in the session
that planned it. Work through this section top to bottom, then execute section 2's stages in order.

### 0.1 Before you touch anything

1. **Read `CLAUDE.md`** (repo root). It is the governing file.
2. **Read `BOT_SCENE_QUALITY_PLAYBOOK.md` IN FULL.** This is a standing repo rule, not optional, and it
   applies before ANY bot work including merely answering how a bot works. It is ~4,000 lines and every
   hard rule in it was paid for with a broken batch. Do not skim it and do not substitute this file.
3. **Read this whole file.**
4. Do NOT start the dev environment. Do NOT run `git checkout`, `git restore`, `git clean` or
   `git stash` at any point: an agent once reverted uncommitted pool edits that way.

### 0.2 The mission in one paragraph

Kevin asked to "inflate every seed pool for every bot by 100 entries" to make the bots more diverse and
fun. Measurement showed a flat +100 would be ~303,000 new entries that nobody would ever see: the fleet
holds 440,120 entries, the near-duplicate rate is only 2-11%, and each live path posts just 6-20 times
per 90 days, so a given entry resurfaces about once every five years. Kevin agreed to a **targeted**
plan instead: purge what is broken, deepen only the genuinely thin pools, and add new _registers_ rather
than more of the same. The full reasoning is in section 1.

### 0.3 What is already DONE (do not redo)

| Commit     | What                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `7b834ac4` | Phase 0 audit tooling (3 scripts), this tracker, ToyBot `wooden-toy-land` deactivation, BrickBot IP reversal |
| `990d1d86` | The duplicate purge: 5,164 entries removed from 225 pools                                                    |
| `effef784` | Stage A: `lib/seedDupeLint.js` + the CI gate in `npm run check` + 13 jest tests                              |
| `ed4597dc` | Stage B: narrowed six over-broad defect families (they were flagging correct entries)                        |
| `bd1b71aa` | Stage B: rewrote 911 known-bad seed entries                                                                  |
| `78ab6900` | Stage B2 PILOT (Kevin approved): TinyBot `pastel-village` mandatory verb-led cast + wiring-audit bugfix      |

- **Step 0 is DONE.** All four audit scripts exist, the dupe scanner is wired into `npm run check`, and
  `__tests__/lib/seedDupeLint.test.ts` locks the load-bearing rule (same description + different tags is
  NOT a duplicate).
- **Step 1a (duplicate purge) is DONE.** 7,909 entries total. Recurrence is now impossible: the gate
  fails the commit.
- **Stage B (defect sweep) is DONE** except the `text_prior` family, which is mid-run.
- **Stage B2 (TinyBot story-beat rework) — the lever is PROVEN and approved.** Kevin graded the
  `pastel-village` batch: *"these are much better and more interesting, so keep going"* (2026-09-22).
  Rolled to the three remaining paths the same day. See section 2c.
- **Stage B3 (low-variety pools) is DONE, and 2 of the 4 shortlisted pools needed NOTHING.** See 2d.
- **Steps 1b, 2a, 2b and 2c are NOT started.**

### 0.4 Decisions Kevin has already made (treat as settled)

- **Targeted plan, not a flat +100.** Confirmed 2026-09-22.
- **Buckets only, no new paths** ("option 1"), with ONE sanctioned exception: StarBot and DragonBot get
  new CHARACTER paths (section 6c). A _bucket_ is a named sub-theme inside an existing pool; a _path_ is
  a whole show with its own archetype, template, wiring and QA. Candidates that fit no existing pool are
  "homeless": list them with a price per path and hand them to Kevin, build nothing.
- **Tasteful-adult is the line** on the new character paths: glam, alluring, stylized, skin allowed,
  never explicit and never pin-up-posed. Do not de-glam (the SteamBot over-correction), and do not cross
  into cheesecake (flux NSFW-fails it, and these post to a public feed).
- **BrickBot may render Star Wars and other pop-culture worlds.** The old "NEVER LEGO Star Wars" rule is
  DEAD (Kevin: "the fair use laws for lego and those properties is fine for now"). Do not strip those
  entries and do not re-add the ban. Hard-SF realism (Mass Effect / Expanse / Star Citizen) is still out,
  but for photoreal drift, not IP.
- **ToyBot `wooden-toy-land` is deactivated** and stays that way ("i don't like those renders").
- **MechBot and RetroBot are dark** (`active = false` since June) and are not expansion targets.

### 0.5 The tooling (all four scripts are committed)

```sh
# 1. Which pools does a LIVE path actually read? Three tiers: wired / dormant / orphan.
node scripts/audit-bot-pool-wiring.js --json /tmp/wiring.json
node scripts/audit-bot-pool-wiring.js --bot starbot          # one bot, lists its orphans

# 2. Duplicates + near-dupes + per-pool saturation. Exits 1 on exact dupes.
node scripts/scan-bot-seed-dupes.js --wired /tmp/wiring.json --json /tmp/dupes.json
node scripts/scan-bot-seed-dupes.js --bot gothbot -v         # per-pool detail + samples

# 3. Known bad-render phrase families. DIAGNOSTIC ONLY, never rewrites.
node scripts/sweep-bot-seed-defects.js --wired /tmp/wiring.json --json /tmp/defects.json
node scripts/sweep-bot-seed-defects.js --family text_prior -v

# 4. Removes exact duplicates. Dry run by default; --apply writes + backs up.
node scripts/purge-bot-seed-dupes.js --wired /tmp/wiring.json          # dry run
```

Regenerate the JSON artifacts yourself. The ones from the planning session lived in a session scratchpad
and are gone.

### 0.6 Hard-won gotchas that will bite you

- **New entries get FRONT-LOADED into the public feed.** The picker is a persisted shuffle bag keyed by
  entry TEXT (`bot_dedup`, migration 123). If an axis is 90 of 100 used and you add 100, the next ~110
  picks draw ONLY from the new entries. A weak batch does not trickle out, it dominates that axis for
  weeks. This is why the post-scale sweep is mandatory rather than nice-to-have.
- **Append, never regen.** `--count 100` on a `gen-<bot>-pool.js` means exactly +100. A regen discards
  approved entries AND orphans that pool's rotation history (the dedup rows key on text, so rewriting an
  entry frees it to reappear immediately).
- **Two generator pipelines exist.** 16 monolithic `scripts/gen-<bot>-pool.js` (flags: `--pool`,
  `--count`, `--target`, `--dry-run`), and ~1,740 per-pool scripts under `scripts/gen-seeds/<bot>/` that
  call `scripts/lib/seedGenHelper.js` and take no flags except the `SEED_TOTAL` env var. There is NO
  monolithic generator for alphabot, farmbot, mangabot, retrobot, tinybot or yumbot.
- **A stale memory says "NEVER use seedGenHelper".** That memory predates the 2026-06-05 patch that fixed
  the anti-prompt bloat. `seedGenHelper` is fine now; 1,140 of those scripts already pass `append: true`.
- **Dormant pools are a money trap.** ~460 pools (~67,500 entries) are still `load()`ed but no live path
  picks them, left behind by each axis migration. Growing one changes nothing. Always filter through
  `--wired`.
- **Symbol name does not always equal file name.** e.g. brickbot `BRICKBOT_CRAZY_ISLANDS_*` →
  `brickbot_islands_*`, gothbot `FEMALE_ACCESSORIES` → `goth_woman_accessories`. The wiring audit
  resolves these; do not hand-map them.
- **Two non-standard loaders** the wiring audit special-cases: pixelbot scene paths via
  `scene.loadScenePools('<prefix>', SLOTS)`, and brickbot's generated legacy triplets.
- **Never purge an entry that shares a description but differs in tags.** On a tag-filtered pool that is
  legitimate (chibibot has an egret tagged `["ARCTIC"]` and `["ARCTIC","BIRD"]`). Both the purge and the
  scanner compare full objects key-sorted. Four such entries exist and are reported as warnings.
- **Respect the documented ceilings.** race 50, class 36-50, hairstyle 44-50, accessory 49-98, gated
  drama 50, eyes/skin/hair_color 100. Padding an atomic axis to 200 manufactures near-duplicates.
- **335 pools are already >=20% same-idea.** A +100 there under-delivers; cap at +50 or split the recipe.
- **Structural pools are NOT expansion targets**: palette, lighting, camera, framing, atmosphere, sky,
  eyes, hair, wardrobe, makeup, and the 273 sensory-fragment files.
- **Sonnet re-derives every banned noun at production scale.** PixelBot's scale-up reintroduced 101
  already-fixed defects with hardened recipes. Budget a sweep after EVERY scale-up.
- **The format-drift scan is mandatory after scaling**: compare the share of entries carrying the
  recipe's format marker in the tested entries vs the new ones. If tested is >=80% and new is <80%, that
  pool drifted: tighten the recipe, truncate back to the clean entries, regen.
- **Equal share per sub-theme.** One focused Sonnet call per bucket, never one big call with a
  distribution mandate, then tally per bucket. This is a Kevin hard rule.

### 0.7 How to work with Kevin

- **Test renders go up as SHADOW posts and he reviews them in the app.** Never build a `/tmp` HTML
  contact sheet and never narrate your own verdict from reading a JPEG. You may look at renders for
  mechanical checks (did it error, which model, did the prompt carry the intended tokens, did a known
  failure mode recur); the LOOK is his call.
- **Seed 25 to test, scale only after he signs off.** "These look good" is NOT "scale it": wait for a
  separate scale instruction.
- **One variable per round, cap at 3 rounds**, then restructure rather than fixing one more thing.
- **Throttle**: renders ≤3 concurrent and gated on DB connection headroom
  (`const { waitForHeadroom } = require('./lib/poolHeadroom'); await waitForHeadroom({ min: 25, label })`).
  Avoid the top of the hour and the 08:00 UTC nightly window. Generation is API-bound: ~6 parallel
  workers max, and re-verify every pool count afterwards because stragglers are documented.
- **Commits**: explicit paths only, never `git add -A`. Check `git diff --cached --name-only` as its own
  step before committing, and read the staged diff: this is a shared working tree and other agents' WIP
  lives in it. Work on `main`, no feature branches.
- **Narrate as you go**: what you found, what you are changing, the proof, what is next.
- In user-facing copy and prose, do not use em dashes.

### 0.8 Resolve these three unknowns BEFORE spending money

1. **Generator-recipe coverage.** Do all 178 Stage 1b target pools still have a working recipe? Some may
   be hand-authored or have had their gen script deleted. This is a static check and it could move Stage
   1b's cost. Report coverage before generating.
2. **Bucket-to-pool assignment + the homeless list.** The 128 candidates in section 6 have NOT been
   assigned to target pools. Only ChibiBot's `creature_adventures_scenes` and YumBot's
   `meal_types_scenes` are already tag-bucketed, so those drop straight in. For the other 14 bots, assign
   each candidate to a specific existing pool. Any candidate with no natural home (BloomBot's "alpine
   wildflower meadow" is the likely case, since none of its 24 paths owns mountain meadows) goes on the
   homeless list with a per-path price, roughly $11-14 of API plus a build and 1-3 review rounds. Hand
   that list to Kevin and build nothing from it.
3. **Narrow the two noisy defect families.** `dullness` and `grim_on_cute_bot` currently flag a rotting
   log, a blood-moon and a line of dewdrops on a petal. Add allowlists and re-validate by sampling
   before any rewrite pass uses them.

### 0.9 Rollback

Every stage is independently revertable, and nothing here touches the production nightly engine, the
dream queue, or any app code.

- Seed edits: plain git revert of that stage's commit. The purge also wrote `.bak-<ts>` files before
  writing, though those were removed after verification since the commit is the real backup.
- `wooden-toy-land`: uncomment one line in `scripts/bots/toybot/index.js`.
- A bot that will not load after an edit: `node -e "require('./scripts/bots/<bot>')"` names the bad pool.
- Stop a bot posting entirely while you investigate: `bot_schedules.active = false` for that bot.

### 0.10 Definition of done

Section 2's stages all executed, plus: the dupe scanner wired into CI with a jest test; the sweep
reporting zero across every family it covers; the 84 orphan files deleted; 178 pools at ~200 real unique
entries; TinyBot's four worst paths reworked; 24 new look-register entries live on 4 bots; the approved
buckets seeded, shadow-reviewed and scaled; and this file's checkboxes and decision log updated so the
next agent inherits measured state rather than a story.

---

## 1. Why this exists (what was measured, 2026-09-22)

| Measurement                                      | Value                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Live public bots                                 | 18 (MechBot + RetroBot are `active = false` since June; OutlawBot is private with all 22 seed files missing) |
| Pool files, live bots                            | 3,027 (whole tree incl. dark bots + AlphaBot: 3,511)                                                         |
| Entries, live bots                               | 440,120 (whole tree: 501,759)                                                                                |
| Median pool size                                 | 126 entries; 1,390 pools are already at 200+                                                                 |
| Near-duplicate rate                              | 2% to 11% per bot (MangaBot 11% is the worst, and the largest at 57,936 entries)                             |
| Real posting rate                                | 6 to 20 renders per path per 90 days                                                                         |
| Pools loaded but never referenced by a live path | ~330 symbols, ~55,000 entries, plus 48 dead files                                                            |

**The conclusion that shaped this plan.** A flat "+100 entries on every pool" would be ~303,000 new
entries, and by the posting math nobody would ever see the difference: with 5+ axes at 200 entries, a
given entry resurfaces on its path roughly once every five years. The fleet is not idea-exhausted. The
work that pays is (a) deepening the genuinely shallow pools, (b) adding new registers rather than more of
the same, and (c) deleting the worst entries, which is what actually drives the "quality drops over time"
complaint (see the playbook: a path is only as good as its worst entry times its roll probability).

**One mechanic to respect throughout.** The picker is a persisted shuffle bag keyed by entry TEXT
(`bot_dedup`, migration 123). New entries need no migration and are eligible immediately, but if an axis
is 90 of 100 used and you add 100, the next ~110 picks draw ONLY from the new entries. A weak batch does
not trickle out, it dominates that axis for weeks. Hence: append only, never regen, and always sweep
after a scale-up.

---

## 2. The four steps, with cost

Seed-generation cost basis: ~$0.30 per 25 entries (playbook MVP-25 figure; a 200-entry pool regen runs
$3.50 to $6). Render cost basis: `image_models.cost_cents`, 3 to 7 cents per render depending on model,
plus ~1 cent of Sonnet per brief. Planning number: **1.2 cents per seed entry, 5 to 6 cents per render.**

**REVISED after Phase 0 ran (see section 2b). The estimates below are the measured ones.**

| #   | Task                                                               | New entries     | Test renders | Est. cost | Wall clock      | Needs Kevin     |
| --- | ------------------------------------------------------------------ | --------------- | ------------ | --------- | --------------- | --------------- |
| 0   | Safety net: 3 audit scripts                                        | 0               | 0            | **$0**    | DONE 2026-09-22 | no              |
| 1a  | ~~Purge exact duplicates~~ **DONE** (5,164 removed from 225 pools) | 0               | 0            | **$0**    | done            | no              |
| 1b  | Top up the 178 clean wired content pools under 120 entries         | 17,433          | ~45          | **~$212** | ~5 h            | no              |
| 2a  | Expand look registers (4 thinnest bots, hand-authored)             | ~24 (by hand)   | ~24          | **~$2**   | ~half a day     | approve looks   |
| 2b  | New buckets, MVP at 25 each (75 approved, section 6)               | 1,875           | ~150         | **~$32**  | review-gated    | yes, per bucket |
| 2c  | Scale approved buckets to ~120 each                                | ~7,125          | ~50          | **~$89**  | ~3 h            | no              |
| 3   | Tail sweep: rewrite the ~2,500 validated defect entries            | ~2,500 rewrites | ~50          | **~$33**  | ~4 h            | no              |
| 4   | StarBot + DragonBot character paths (section 6c) — 14 new paths    | ~9,800          | ~150         | **~$130** | review-gated    | yes, per path   |
|     | **Everything**                                                     | **~38,000**     | **~465**     | **~$500** |                 |                 |

Add roughly 25% contingency for failed batches, stragglers and re-rounds: **plan on $475 to $500 for the
full run.** Renders are capped at 3 concurrent and gated on DB connection headroom, so ~370 renders is
about 70 minutes of actual render time.

### 2b. Phase 0 RESULTS (measured 2026-09-22, supersedes every estimate above it)

Tooling built and run: `scripts/audit-bot-pool-wiring.js`, `scripts/scan-bot-seed-dupes.js`,
`scripts/sweep-bot-seed-defects.js`. All three are diagnostics that never rewrite.

**Wiring.** Live public bots hold **2,432 wired pools / 366,014 entries**. Beyond that, ~460 pools
(~67,500 entries) are DORMANT (still `load()`ed, but no live path picks them: the pre-axis "one big
scene pool" left behind by each migration), and **84 files / 8,059 entries are true orphans** with no
literal reference anywhere, safe to delete. The earlier "217 expansion targets" estimate was inflated
because it counted dormant pools: the real figure is **177**.

**Duplicates: FOUND AND PURGED 2026-09-22.** The wired pools contained **5,168 exact duplicate
entries** (byte-identical copies within the same file) across 227 pools, from append-mode generation
that ran more than once: the x3 and x4 multiplicities are the tell. Same condition FLEET_POOL_BACKFILL.md
hit in June ("castle_hero had 158 unique of 200 … quietly polluting renders for months").

`purge-bot-seed-dupes.js --apply` removed **5,164 entries from 225 pools**, keeping the first copy of
each. Wired entries on live bots went 366,014 → 360,891. Biggest corrections: `gothbot/hair_colors`
200 → 100, `yumbot/chef_lighting` 200 → 111, `mangabot/kawaii_archetype` 200 → 129,
`chibibot/cute_creatures_unified` 400 → 341. All 12 touched bot modules still load; every file was
backed up, prettier-formatted to repo style, then the backups removed (git is the real backup).

Four entries were deliberately NOT removed, and the scanner now reports them as a warning rather than an
error: same description, different tags, which is legitimate on a tag-filtered pool (chibibot has an
egret tagged `["ARCTIC"]` and `["ARCTIC","BIRD"]`; earthbot has a fjord serving both `arctic-polar` and
`coastal-temperate`). They are still served twice to any path whose filter matches both, so they are
worth a human look. Both the scanner and the purge now compare full objects, key-sorted.

- [ ] Optional follow-on: refill the 127 shrunk CONTENT pools back to their prior nominal size,
      **1,892 entries, ~$23**. Do NOT blanket-refill the 97 shrunk structural pools (~$21): most have
      documented ceilings far below 200, and padding them just manufactures near-duplicates.
- [ ] Wire `scan-bot-seed-dupes.js` into `package.json` `check` as `scan:bot-seed-dupes`. It exits 0
      now, so the gate is safe to add (it was not before the purge).

10,367 signature near-dupes remain and are deliberately untouched: those need human judgement, and a
fleet-wide auto-thinner was already built once and demoted to a flagger for gutting good pools.

**Saturation.** 335 pools (>=50 entries) are already >=20% same-idea, so a +100 there under-delivers.
Only 9 of them are also expansion targets; those get +50 at most, or a recipe split.

**Defects.** 4,835 raw flags, of which ~2,500 validated as true positives after sampling. The
`dullness` and `grim_on_cute_bot` families are too noisy to act on as-is (they flag a rotting log, a
blood-moon, a line of dewdrops) and need narrowing before use. Validated, actionable:

| Finding                                            | Count           | Note                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ~~Star Wars / Disney IP in BrickBot pools~~        | **0 (dropped)** | **NOT a defect.** Kevin reversed the ban 2026-09-22: _"it's ok if it shows star wars or any other worlds from pop culture - the fair use laws for lego and those properties is fine for now."_ The 176 flagged entries stay. The playbook's BrickBot CRITICAL LESSON 2 + hard-rules list, and both BrickBot IP memories, were rewritten the same day, and `sweep-bot-seed-defects.js` now exempts brickbot from the `ip_lookalike` family. |
| Other IP-lookalike (ToyBot/YumBot/ChibiBot)        | 769             | Mostly ToyBot pools named for the IP itself (`vinyl_funko_cast` 202, `barbie_storytelling` 154). Matches Kevin's quarantine note about "a mouse-ear vinyl figure". Needs a product decision, not a sweep.                                                                                                                                                                                                                                  |
| Firearms in high fantasy                           | 305             | DragonBot / GothBot / MangaBot / StarBot                                                                                                                                                                                                                                                                                                                                                                                                   |
| Weathervane / compass rose (renders readable text) | 329             | Fleet-wide                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Viewer-posture verbs in vantage/camera pools       | 323             | The PixelBot "girl face-down in the water" defect class                                                                                                                                                                                                                                                                                                                                                                                    |
| Pirate-era tropes on strict-fantasy bots           | 160             | DragonBot `artsy_girl_outfit` still has "PIRATE CORSAIR / Swashbuckler", the frozen path flagged-not-touched in the June purge                                                                                                                                                                                                                                                                                                             |
| Human roles on a no-human bot                      | 182             | ChibiBot / TinyBot / YumBot "vendor", "shopkeeper", "villagers"                                                                                                                                                                                                                                                                                                                                                                            |
| Light or sky described as a solid object           | 132             | Fleet-wide                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| CJK characters                                     | 90              | Fleet-wide                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Greek-myth creatures on high-fantasy bots          | 24              | pegasus / cerberus / cyclops / sphinx                                                                                                                                                                                                                                                                                                                                                                                                      |

**Quarantine reality check (180 days, joined to path).** Kevin's own audit counts were exactly right
(TinyBot 12, ToyBot 9) but the "/48" denominators were his review sample, not total posts. Per post:

- **TinyBot 12 of 546 (2.2%), spread across 9 paths over the whole month.** The only genuinely
  ongoing, bot-wide problem, and it matches the playbook's still-open TinyBot diagnosis: the always-on
  "extreme macro lens, extreme shallow depth of field" wrapper crops the world and drops small
  subjects, the `render` medium pushes glossy product shots, and many seeds are "figure + ONE object on
  a bare surface". Fix is the `tiny-vehicles` treatment (journey-beat axis + layered-world axis +
  verb-led critter cast), not a pool top-up.
- **ToyBot 9 of 1,508 (0.6%)**, concentrated in the low-volume material paths: `wooden-toy-land` 2 of 11
  (18%, **deactivated 2026-09-22 on Kevin's word**), `board-game-world` 1 of 10, `tin-toy-parade` 1 of
  10, plus `miniature-dungeon` 2 of 56 (the dark/gritty register) and one each on `vinyl`, `sackboy`,
  `claymation`.
- **FarmBot 40 of 434 (9.2%) is NOT ongoing rot.** Almost every flag is from one day, 2026-09-09, and
  17 of the 40 are `sugarcane-field` (13) and `first-snowfall` (4), the two paths already deactivated.
  Treat as a closed one-time cull.
- **OceanBot `sea-caves` 2 of 11** is the other high-rate path.
- ChibiBot, EarthBot, DreamBot, MechBot, RetroBot: zero flags.

**Scale-down options, cheapest first:**

- **$0, the duplicate purge (step 1a) alone.** 5,168 junk entries out of 227 wired pools. No generation,
  no renders, and several pools go back to being the size they claim to be.
- **~$33, add step 3.** Removes the entries that produce the renders Kevin keeps flagging.
- **~$35, add step 2a.** Look registers. Two dollars of renders changes the visual treatment of every
  render on 4 bots, because they are hand-authored rather than generated.
- **~$246, add step 1b.** Tops the 177 clean wired pools up toward 200.
- **~$385, add steps 2b and 2c.** The actual creative expansion, gated on Kevin's review rounds.

---

## 2c. Stage B2 RESULT: the empty-room defect, and the lever that fixes it (2026-09-22)

**Kevin's grade on the pilot:** *"these are much better and more interesting, so keep going."*

Four TinyBot paths rendered beautiful, well-dressed, EMPTY frames. The cause was not the scene pools --
it was written into the paths themselves:

| Path                 | What the path said                                                                           | Cast before        |
| -------------------- | -------------------------------------------------------------------------------------------- | ------------------ |
| `pastel-village`     | "the architecture is the hero; the world dissolves into pink-pastel bokeh around it", plus a FAILURE CONDITION enforcing the blur | optional, 55%      |
| `tiny-cozy`          | "Lived-in quality. Viewer wants to shrink down and live there"                                | NONE               |
| `miniature-industry` | "The workspace feels ACTIVE -- mid-project, not museum-clean"                                 | NONE               |
| `contained-worlds`   | header read "OPTIONAL TINY CREATURE INHABITANT"                                              | always, but STATIC |

Two of them stated the goal ("lived-in", "ACTIVE, not museum-clean") and then put nobody in the frame,
so they rendered the exact museum shot they were trying to avoid. `contained-worlds` was the subtler
case: it always had an inhabitant, but `TINY_CREATURES` holds static poses ("perched on a rose petal",
"dozing on a sunflower"), so the frame had a creature and still had nothing happening in it.

**THE LEVER (this is the reusable part).** One mandatory, verb-led, path-bespoke cast:

1. A new pool per path -- never shared (`TINY_VILLAGE_FOLK`, `TINY_COZY_DWELLERS`,
   `TINY_INDUSTRY_CREW`, `TINY_TERRARIUM_DWELLERS`). Village folk hang laundry, crew run machines,
   dwellers live in a jar. The proven original is `TINY_CREW` on `tiny-vehicles`.
2. Every entry OPENS WITH THE CRITTER then an ACTIVE VERB. Static poses are banned in the recipe.
3. Every entry names the piece of the SET it is touching -- the bakery window, the chalk line, the cork,
   the armchair. This is what anchors the cast INTO the scene instead of floating in front of it.
4. Mandatory, never a probability. A second one rolls at 40-45%, and when two roll the prompt tells them
   to share the moment rather than stand in separate corners.
5. The cast stays SMALL and explicitly not the hero. The building / room / workshop / container is still
   the hero. Say so, or Flux promotes the critter to a foreground mascot.

**One variable per round.** The pastel/bokeh identity was left completely alone even though it reads as
the cause -- the only concession was exempting the villagers from the blur, which the lever needs to work
at all. Do not bundle a palette change with a cast change.

**Known residue, not caused by the lever:** `miniature-industry` scene rolls do not always read as
industrial (one came back as a snowbank, vibe=ancient + medium=claymation). That is the SCENE pool and the
variety axes, a separate axis from the cast. `pastel-village` is the only one of the four with an explicit
"the palette OVERRIDES the variety axes" guard; the other three have none.

**Open taste question for Kevin:** gnomes and pixies are in these cast pools (inherited from the proven
`TINY_CREW`, which lists "Fairy / gnome / pixie"), and flux renders them human-faced, which brushes the
path's own `NO_HUMANS_BLOCK`. Left as-is because it is house-consistent and pre-existing, but it is worth
a yes/no.

---

## 2d. Stage B3 RESULT: 2 of the 4 "low-variety" pools needed nothing (2026-09-22)

The saturation scanner flags 301 pools at >=20% same-idea. `audit-seed-variety.js` shortlisted 4 as
REVIEW. **Two of those four were fine, and finding that out cost nothing while fixing them would have
cost money and damaged good content.** This is the third time in this project that an automated
"sameness" signal over-called; the scanner's own header already warns about it.

| Pool                                          | Verdict      | Why                                                                                                                    |
| --------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `bloombot_..._hummingbird_cast` (153)         | **FINE**     | 100% name a midground bird, 64% have 3+ birds at named depths, 97% mid-flight, 79% wing motion-blur. Delivers its declared contract. |
| `yumbot/kawaii_night_augment` (200)           | **FINE**     | 112 distinct sky openings and 20 distinct worlds. Real variety under a repeated sentence frame.                          |
| `faebot_flower_fairy_weather` (200)           | BACKFILLED   | A weather axis with **0% sun-shafts, 0% storm, 0% rainbow**, and 64% drifting petals (which are not weather).           |
| `faebot_forest_fairy_scene_foreground_anchor` (200) | BACKFILLED | Good botanical spread (19-28% each) but **0% fae-made, 1% water, 1% creature**. All plants and rocks, nothing built, wet or alive. |

**The measurement trap that produced the wrong answer first.** My initial histogram used exclusive
buckets with a `break` on first match, so anything hitting an early bucket was never tested against the
rest -- "front-and-center" matched 100% of the hummingbird entries and the loop never checked whether
those same entries also said "hovering" (99%) or "mid-flight" (97%). **Count registers INDEPENDENTLY.**
An entry can and should hit several.

**The fix shape: ADD, do not delete.** Both FaeBot pools grew 200 -> 260 with the missing registers
named explicitly in the recipe. Nothing was deleted, so no working entry was put at risk, petals fall
from 64% to ~49% by dilution alone, and revert is dropping the tail.

**Deliberately NOT done, flagged for its own round:** every entry in both pools says "painted" -- an
average of **4.2 times per 23-word entry** in the weather pool (max 8), 2.3 in the anchor pool. The path
prefix already establishes painted-fantasy, so this is textbook stacked-intensifier cruft. But
de-stuffing changes how every live FaeBot render looks, which is a SECOND variable and needs its own
shadow round. New entries use "painted" once or twice, naturally.

---

## 2e. Step 2b IMPLEMENTATION: how a bucket actually lands (2026-09-22)

**A bucket needs NO path code change.** This was the open question and it is settled. YumBot's
`places` path declares `scene: 'YUMBOT_PLACES_SCENES'` and picks one entry; it never reads the
tags. So a 7th bucket is 34 more entries appended to that one file. The tags are bookkeeping that
keeps the buckets even in size.

**The exception, and the whole reason for the guard.** Some pools ARE tag-filtered per path:

```js
pool.filter((e) => e.tags.includes('ANY') || e.tags.some((t) => allowed.has(t)))
```

There, a bucket whose tag is missing from the path's allowed list is SILENTLY DROPPED — no error,
zero renders, healthy-looking seed file. Check before writing, never after:

```sh
node scripts/scan-bucket-eligibility.js --will-roll <bot>:<POOL_SYMBOL>:<tag>
```

### The tooling

| Tool | Job |
| --- | --- |
| `scripts/lib/bucketEligibility.js` | the five checks, locked by `__tests__/lib/bucketEligibility.test.ts` (29 tests) |
| `scripts/scan-bucket-eligibility.js` | fleet scan + `--will-roll` pre-flight; `npm run scan:buckets` |
| `scripts/add-bucket.js` | appends a bucket in the destination pool's own shape and voice |
| `scripts/bucket-specs/wave-1.json` | the 29 shipped specs, one creative brief each |

`add-bucket.js` exists as ONE tool rather than 25 hand-written generators because every bot's pools
have a distinct house voice, and a bucket in the wrong voice is worse than no bucket:

```
bloombot  "DARK LOTUS POND — a broad still pond of near-black water, glass-calm and ..."
mangabot  "Konbini late-night with magazine-rack close foreground, fluorescent shelves ..."
farmbot   "A potter's wheel crouches low at the center of the workshop, a thick lump of ..."
```

So it READS the destination pool, samples four entries spread across it as voice exemplars, detects
whether the pool holds plain strings or `{tags, description}` objects, and asks for the same. It
always passes `append: true` (generatePool defaults to OVERWRITE) and refuses any bucket the
eligibility pre-flight says could never roll.

### Where the 75 actually went

| | count | cost | note |
| --- | --- | --- | --- |
| Appended to an existing pool | **29** | ~$9 | no code change; shipped in wave 1 |
| **Already covered — SKIPPED** | **2** | $0 | see below |
| Homeless: need a whole new path | **33** | not priced yet | the real decision still owed to Kevin |
| TinyBot, sequenced after the cast rework | 5 | — | the rework is done and approved, so these are unblocked |
| Flagged / undecided | 6 | — | flags 1-4 in section 6 |

**The two skipped, found by probing the destination pool before spending:**
- `mangabot` "convenience store at night" — `slice_of_life_setting` already holds **12** konbini
  entries, e.g. *"Konbini late-night with magazine-rack close foreground, fluorescent shelves
  receding, cold-case glow midground"*. Fully covered.
- `chibibot` "hot-spring soak" — `bath_time_scenes` already holds **9**, including a proper onsen
  with a shoji screen onto a snowy maple. Fully covered.

**Probe the destination pool for the bucket's distinctive element before writing it.** Four more
looked covered on a loose keyword probe and were NOT, so use the specific idea, not the setting:
`gothbot_sanctum_interior` has 43 entries matching catacomb-or-library but **zero** with books IN a
catacomb; `farmbot_barn_interior_place` has 24 matching "horse" but they are all horse BRUSHES on a
tool wall, never the animal as subject; `gothbot_frostgarden_garden` has 24 glasshouses and zero
glasshouse roses; `bloombot_water_garden_water_body` has 15 canals and zero barges.

### Still to do on wave 1
1. `node scripts/scan-bot-seed-dupes.js && npm run scan:buckets` (both must pass).
2. Shadow-render a batch per affected bot and have Kevin grade it. **25 entries is the trial size —
   do not scale to 200 before sign-off** (`feedback_always_seed_25_to_test_then_scale`).
3. On sign-off, re-run `add-bucket.js` with `--count 200`; it is grow-to-N and idempotent.

---

## 3. Step 0: safety net (do this first, always)

- [x] `scripts/scan-bot-seed-dupes.js` — BUILT + RUN 2026-09-22. Reports exact dupes, signature
      near-dupes, same-description-different-tags collisions, and per-pool saturation. Exits non-zero on
      exact dupes only; currently exits 0 (post-purge).
- [ ] **STILL OPEN.** Wire it as `scan:bot-seed-dupes` into `package.json` `check` (pre-commit + CI).
      Was unsafe before the purge (it failed on 5,168 dupes); safe now.
- [ ] **STILL OPEN.** Jest test for the checker's logic, modelled on
      `__tests__/lib/holidayPoolLint.test.ts`, so the identity rules cannot silently drift.
- [x] `scripts/audit-bot-pool-wiring.js` — BUILT + RUN 2026-09-22. Three tiers (wired / dormant /
      orphan), resolves pixelbot's templated loader, brickbot's generated triplets, seasonal requires and
      alphabot's cross-bot path requires. Produced the authoritative target list in section 4.
- [x] `scripts/sweep-bot-seed-defects.js` — BUILT + RUN 2026-09-22. 14 scoped families. Diagnostic
      only, never rewrites. 4,835 raw flags, ~2,500 validated by sampling; `dullness` and
      `grim_on_cute_bot` still need narrowing before anyone acts on them.

Why first: today the only duplicate protection is inside whichever script writes the entries. A hand
edit, a different script, or two agents growing one pool would all go uncaught.

---

## 4. Step 1: deepen the shallow content pools

Rules: **append only** (`--count 100` on a `gen-<bot>-pool.js` means exactly +100; the 1,140
`gen-seeds/**` scripts take `SEED_TOTAL=<current+100>` with no file edit). Never regen. Recipes unchanged
so new entries match the approved register. Six pools generating at a time (API bound). Re-count every
pool afterward, because a parallel batch reliably leaves stragglers. Then run the Step 0 sweep.

**Do not expand:** structural and atomic pools (palette, lighting, camera, atmosphere, sky, eyes, hair,
wardrobe, makeup, and the 273 sensory-fragment files), anything at a documented ceiling (race 50, class
36-50, hairstyle 44-50, accessory 49-98, gated drama 50, eyes/skin/hair_color 100), retired-path pools,
and the two dark bots.

**MEASURED targets** (`audit-bot-pool-wiring.js` + `scan-bot-seed-dupes.js`): of 1,188 wired content
pools on live bots, 186 are under 120 entries; 177 of those are clean enough to expand and 9 are
already >=20% same-idea (cap those at +50 or split the recipe). Topping the 177 up to ~200 is
**17,333 entries, about $208**.

| Bot      | Pools | Entries to add | Bot       | Pools | Entries to add |
| -------- | ----- | -------------- | --------- | ----- | -------------- |
| yumbot   | 31    | 3,097          | farmbot   | 8     | 690            |
| starbot  | 26    | 2,591          | faebot    | 7     | 700            |
| gothbot  | 24    | 2,400          | toybot    | 4     | 400            |
| pixelbot | 18    | 1,800          | dreambot  | 3     | 300            |
| steambot | 16    | 1,516          | dragonbot | 2     | 174            |
| bloombot | 14    | 1,304          | earthbot  | 2     | 200            |
| brickbot | 10    | 966            | tinybot   | 2     | 200            |
| chibibot | 10    | 995            |           |       |                |

- [x] 1a: purge the exact duplicates — DONE 2026-09-22, 5,164 entries out of 225 pools, $0
- [ ] 1b: top up the clean wired pools toward 200. **Generator coverage audited 2026-09-22**
      (`node scripts/audit-seed-recipe-coverage.js --wired /tmp/wiring.json --max 120`). Of 254 thin
      wired content pools, excluding the private/broken bots: - **107 grow safely today** via a monolithic recipe: `node scripts/gen-<bot>-pool.js --pool X
      --count 100` means exactly +100. Biggest holders: mechbot 32, gothbot 20, bloombot 14,
      starbot 11, brickbot 10. - **24 grow safely** via a `gen-seeds/**` script that already passes `append: true`:
      `SEED_TOTAL=<current+100> node <script>`. - **51 are `gen-seeds/**`scripts that default to`append: false`, i.e. OVERWRITE.** Running
      one naively DESTROYS its proven entries. Each needs `append: true`set first. yumbot (33)
      and farmbot (12) hold most of these.
    - **43 have NO committed generator at all** and cannot be batch-grown: 17 are PixelBot scene
      pools (verified: nothing in`scripts/`references`pixelbot_pixel_vista_landform`and
      friends, so the 2026-09-19 scale-up was done with uncommitted in-session scripts), plus
      small satellites like`faebot_druid_companion`(12) and`faebot_forest_elder_story_beat`
      (22). These need a recipe authored before they can grow, which is real work rather than a
      batch, so they are the last thing to do in Stage C, not the first.
- [ ] Re-count all touched pools, re-run stragglers
- [ ] Step 0 dedupe + defect sweep, fix findings
- [ ] 3 verification renders per touched bot (shadow posts, reviewed in the app)

---

## 5. Step 2a: look registers (cheapest real variety in the fleet)

A look register entry is a rendering style. One new entry changes the treatment of every render on every
look-enabled path of that bot. Hand-authored, never generated (curated beats generated here: 12 curated
anime looks beat 25 generated ones). Each entry must be pure rendering technique (linework, shading,
palette, finish, studio reference) with **zero** time-of-day, weather, season or lighting words, and zero
subject anatomy. Verify one render per new look before it ships.

| Bot      | Current size | Bot      | Current size |
| -------- | ------------ | -------- | ------------ |
| yumbot   | 24           | chibibot | 12           |
| bloombot | 12           | mangabot | 12           |
| gothbot  | 8            | farmbot  | 6            |
| pixelbot | 6            | steambot | 6            |

- [ ] farmbot 6 → 12
- [ ] pixelbot 6 → 12 (era sub-styles per Kevin's 2026-09-19 steer, incl. the early-high-def look)
- [ ] steambot 6 → 12
- [ ] gothbot 8 → 14
- [ ] bloombot / chibibot / mangabot / yumbot: only if the first four land well

---

## 6. Step 2b: the FINAL bucket list (approved by Kevin 2026-09-22)

These are Kevin's cuts, verbatim. 75 buckets across 15 bots. A bucket is a named sub-theme seeded into
an EXISTING pool by one focused Sonnet call at an equal share, 25 entries first, shadow-rendered for
Kevin, then scaled to ~120 on his sign-off. `→` marks the path whose pool it extends.

EarthBot and OceanBot were dropped entirely: both are at their pool ceilings.

### BloomBot (4)

- [ ] alpine wildflower meadow → new biome, no alpine coverage exists
- [ ] coastal cliff bloom over surf → new
- [ ] orchid cloud-forest, epiphytes on mossy branches → new
- [ ] floating flower barges on a canal → `water-garden`

### BrickBot (4)

- [ ] airfield with biplanes → new
- [ ] hot air balloon festival and skies (launch parties, scenic) → new, Kevin's addition
- [ ] circus big top → `theme-park` ⚠ see flag 1
- [ ] desert archaeology dig → new

### ChibiBot (8) — SPREAD ACROSS 8 DIFFERENT PATHS (Kevin, 2026-09-22)

Do NOT stack these in `creature-adventures`. That path airs ~25 times a year, and a topic's share of
renders equals its share of entries, so eight more topics in one pool would drop every existing topic
from ~3.6 renders a year to ~1.2 and give each new one only ~2. One per path instead.

- [ ] train ride → `creature-adventures`
- [ ] ferry crossing → `aquatic-village`
- [ ] rainy afternoon in a bookshop → `rainy-interior`
- [ ] farmers market → `cottagecore-village`
- [ ] kite festival → `cozy-landscape`
- [ ] bake sale → `sunny-village`
- [ ] hot-spring soak → `bath-time`
- [ ] stargazing at an observatory → `night-meadow`

### DinoBot (7)

- [ ] courtship display (crests, fans, feather display) → new
- [ ] den and burrow life → new
- [ ] undergrowth small-dino scale → new scale register
- [ ] tidal flat with tracks → new
- [ ] amber forest (resin, conifers) → new
- [ ] high desert dunes → `paleo-landscape`
- [ ] mountain forest at the snowline → `paleo-landscape`

### FaeBot (6)

- [ ] autumn seed gathering → new
- [ ] acorn boat regatta → new
- [ ] mushroom apothecary interior → new, FaeBot has no interior register
- [ ] star-charting on a hill → new
- [ ] honey harvest → new
- [ ] mossy bridge crossing → `enchanted-vista`

### FarmBot (8)

- [ ] apiary and beekeeping → new
- [ ] lambing season → new
- [ ] sheep-shearing day → new
- [ ] hay baling in summer → new
- [ ] dairy and cheesemaking → `artisan-workshop`
- [ ] stable morning with horses → `barn-animal-shelter-interior`
- [ ] greenhouse seedlings → `spring-planting-day`
- [ ] herb-drying loft → `artisan-workshop`

### GothBot (3)

- [ ] catacomb library → `the-sanctum`
- [ ] moonlit lake boat → `twilight-gothic`
- [ ] glasshouse of black roses → `the-frost-garden` ⚠ see flag 2

### MangaBot (4)

- [ ] onsen evening (yukata, exterior) → new
- [ ] convenience store at night → `slice-of-life`
- [ ] game-center arcade → new
- [ ] cicada summer on shrine steps → `slice-of-life`

### PixelBot (9)

Tests for every PixelBot entry: does it duplicate an existing path, does it read whimsical/magical
rather than realistic geography (that is EarthBot's lane), and does every axis carry a feature (the
anti-dullness rule). Built furniture is NOT required: `pixel-vista`'s passing references are a dune sea,
a slot canyon and an alpenglow peak.

- [ ] castle town gate → new
- [ ] desert oasis caravan → `pixel-vista`, with the caravan as the life accent
- [ ] ice cavern → new, interiors are not covered by any vista path; needs a magical feature (a glowing heart) so it does not read as geology
- [ ] volcano forge interior → new
- [ ] observatory tower → new
- [ ] moonlit lake → ⚠ see flag 3
- [ ] floating market canal → new
- [ ] balloon festival sky → `pixel-skyward`
- [ ] Pan Am / Hawaiian retro airline travel-poster ads for tropical destinations, in pixels → ⚠ see flag 4

### SteamBot (5)

- [ ] apothecary and chemist → `cozy-steampunk`
- [ ] rooftop telegraph skyline → new
- [ ] brass glasshouse botanicals → new
- [ ] steam tram street → `steam-transport`
- [ ] dirigible repair scaffold → `skydock-harbor`

### TinyBot (5) — ⚠ see flag 5, sequence these AFTER the story-beat rework

- [ ] tiny library
- [ ] tiny train station
- [ ] tiny observatory
- [ ] tiny greenhouse
- [ ] tiny lighthouse

### ToyBot (4)

- [ ] bath toy flotilla → new
- [ ] sand toy beachworks → new
- [ ] puppet theatre stage → new
- [ ] snow globe world → new

### YumBot (8)

- [ ] bakery at dawn → `meal-types`
- [ ] diner booth → `meal-types`
- [ ] ice cream parlor → `meal-types`
- [ ] brunch patio → `meal-types`
- [ ] bento lunchbox → `meal-types`
- [ ] ramen counter at night → `cuisine` (global cuisines, not meal occasions)
- [ ] hot pot table → `cuisine`
- [ ] sushi counter → `cuisine`

### Five flags to resolve before seeding

1. **BrickBot circus big top** overlaps `theme-park`, which already owns amusement-park and carnival.
   Seed it as a bucket there and check the existing entries first, or it duplicates.
2. **GothBot glasshouse of black roses** overlaps `the-frost-garden`, described as "a CURSED FROZEN
   gothic GARDEN / CONSERVATORY — black-rose courts". Check that pool before seeding; it may already
   be covered.
3. **PixelBot moonlit lake** overlaps `pixel-harbor`'s moon-on-water reflections. Either seed it there
   with a distinguishing feature, or cut.
4. **PixelBot retro airline poster ads: two known traps.** (a) The pulp-femme lesson is that saying
   "poster" or "cover" makes Flux render garbled title text, and PixelBot has its own version of this
   (naming "LEGO Architecture Skylines" made it print SKYLINES on a building). A travel poster's charm
   IS its lettering, which Flux cannot spell. (b) "Pan Am" is a live trademark; the BrickBot IP reversal
   was explicitly BrickBot-scoped. Recommended approach: render the SCENE a travel poster would depict,
   in poster-like composition and palette, with signage explicitly blank or pictorial, and no brand name
   in the prompt. Needs Kevin's OK on that reframing.
5. **TinyBot's five are sequenced AFTER the story-beat rework** (section 2b, Stage B2). TinyBot's live
   defect is the always-on "extreme macro, extreme shallow depth" wrapper plus thin one-object seeds,
   which is what produced the bare blurred renders Kevin flagged. Seeding five more places first would
   inherit that defect.

---

## 6c. Step 4: StarBot + DragonBot CHARACTER paths (Kevin's explicit exception to "buckets only")

Kevin, 2026-09-22: _"i am particularly interested in adding some more exciting character paths to each
that add some spice and variety - drastic and very stylized looks are ok, so is 'sex appeal', i'm looking
to add some flash, and more 'beauty' both in terms of characters and environments to both bots - lush,
inspiring visuals, with really interesting, cool looking characters that are interesting/sexy/tough/etc.
... i want to see the actual characters who inhabit both worlds."_

These are **new paths**, not buckets, and they are the one sanctioned exception to the buckets-only rule.

### Why the gap is real

DragonBot's 7 character paths are all one register: adventurer / explorer / action-scenes, each split
male and female, plus the frozen `artsy-girl`. Every one is "a capable person in sleek gear out in the
wild". There is no court, no performer, no champion, no one who lives in that world rather than travels
through it. StarBot's are suited explorers plus three cyborg paths, with `space-femme` the only glam
path on either bot.

### The reference: AlphaBot `pulp-femme`

Kevin pointed at this path as the target for how maxed-out the styling should be. Clone its FIVE levers,
not just its look:

1. **An era/style-locked medium fragment**, code-only, per path. `pulp-femme`'s is _"Vintage 1960s-70s
   pulp sci-fi ILLUSTRATION, retro-futurist airbrush painting: bold saturated atomic-age palette, glossy
   space-age glamour, clean confident linework, campy and cinematic with a wink."_ Note it says
   ILLUSTRATION / painting and deliberately NOT cover/poster, which makes Flux render garbled title text.
2. **An explicit permission block** in the template (`CRANK THE IMAGINATION — GO BIG`): _"maximalist and
   a little UNHINGED … gloriously, gorgeously bananas"_, immediately fenced by a taste guard: _"never
   gross, never crude, never lazy or cheap-looking."_ The freedom and the guardrail always travel
   together.
3. **The character decomposed into atomic, gender-locked trait axes** (being, hair colour, hairstyle,
   outfit, pose) so the figure varies without drifting androgynous.
4. **A persona line, not just a description**: _"confident pin-up glamour: flirty, self-assured, a
   twinkle of mischief."_ This is what gives the renders attitude.
5. **The environment gets its own mandate to be a dense SET built around the character**, plus separate
   sky, lighting and shot axes. Kevin asked these to "highly lean into their environments", so this block
   gets MORE weight here than it has on `pulp-femme`.

Seeds are written maximalist too: _"a dusty retro space-saloon with swinging chrome doors, a robot
piano-player, and ray-gun-toting patrons at the bar"_, with a ~70%-gated wild-prop / sight-gag pool.

### The taste line

**Tasteful-adult**, the same standard already set on Wild West. Gorgeous, alluring, stylized, skin
allowed, never explicit and never pin-up-posed. This is a practical line as much as an editorial one:
flux-1.1 NSFW-fails dense cheesecake renders, and these post to a public feed on an App Store app. The
existing hard bans stay (no chainmail bikini, no cleavage-as-the-focus, no sultry/seductive language, no
bare-thigh pin-up seated pose), but do NOT de-glam: the SteamBot lesson was that Kevin wants the women
GLAM, and over-correcting produced lifeless renders.

### Architecture per path

- **Reuse the existing atomic appearance pools read-only** (DragonBot `WARRIOR_SKIN` 100, `WARRIOR_EYES`
  100, `WARRIOR_HAIR_COLOR` 89, `FANTASY_RACE` 50). Do NOT edit or expand them: they are shared with the
  FROZEN `artsy-girl` path, and the playbook flagged rather than touched them for exactly this reason.
  Reuse cuts each new path to roughly 5 bespoke pools instead of 12.
- **Bespoke per path**: persona/role, outfit, pose-or-action, setting (the lush environment), a
  **render-style axis** (the `space-femme` mechanism — this is what makes the stylization vary per render
  rather than baking one look), and a ~40-70% gated wildcard layer.
- `promptPrefixByPath` stays **EMPTY**. This is the #1 character-path lesson: a stuffed wrapper gridlocks
  diversity and every render comes back the same pale heroine.
- **Gender-locked template per path**, never one neutral template serving both.
- Two-pass polish OFF, chaos OFF (curated composition).
- Watch the homogenization triad: the template must not inject a fixed adjective, the action axis must
  never dictate a garment, and the persona pool must carry role and demeanour only, never clothing.
- No `[age] man/woman` framing (race or species leads) and no real-world ethnicity labels.

### The approved paths

**DragonBot (6):**

- [ ] Sorceress Ascendant — one sorceress at the peak of her power, the magic IS the couture and the
      light source. Distinct from `arcane-halls`, which is any caster mid-spell.
- [ ] Blade Dancer — an elegant lethal duelist mid-flourish in silk and steel, moonlit courtyard.
- [ ] Drake-Bonded — a ceremonial priestess or priest with their dragon in frame as co-star.
- [ ] Monster Hunter — the Witcher register: scarred, oiled leather, trophies, lantern-lit square.
- [ ] Shadow Court Assassin — a dark-elf assassin in silks and blades on a rooftop, faerie-fire glow.
- [ ] The Muse — a charismatic bard or dancer performing, warm tavern or festival light, crowd reacting.

**StarBot (8):**

- [ ] Orbital Court — ring-habitat aristocracy in couture with holographic fabrics, glass promenade.
- [ ] Bounty Hunter — armored, scarred, trophies on the belt, neon dock behind.
- [ ] Smuggler Captain — a charismatic rogue on a landing ramp, alien port beyond.
- [ ] Star Navigator — an augmented navigator wired into the ship, glowing implants, a cocoon of light.
- [ ] Xeno Monarch — genuinely non-human royalty in regalia, which also breaks Flux's humanoid default.
- [ ] Crew Poster — an ensemble of 3-4 distinct characters posed like a movie one-sheet.
- [ ] Neon Dock — street-level station life, spacers and vendors, rain-slick neon.
- [ ] Out of the Suit — a pilot with the helmet off in the cockpit glow, sweat and hair.

### Build order and cost

Start with **three per bot** to prove the register before committing to all 14: DragonBot's Sorceress
Ascendant, Blade Dancer and The Muse; StarBot's Orbital Court, Bounty Hunter and Crew Poster. Each path:
5 bespoke pools at MVP-25 (~$1.50), 6 shadow renders per round with up to 3 rounds, then on Kevin's
sign-off scale to production (~700 entries, ~$7). About **$10 per path plus renders**, so roughly $60 for
the first six and **~$130 for all fourteen**.

StarBot-specific trap: its vocabulary literalizes. `rail`, `canyon`, `surface` and `tower` all render
their terrestrial prior. Scan every new StarBot seed noun for its strongest training prior before
shipping.

---

## 7. Step 3: tail sweep (fastest visible win)

- [ ] Camera-framing-as-law audit across every bot. This was only ever purged on OceanBot (128 entries
      across 7 pools); the playbook says the same rot is almost certainly in the other bots' framing
      pools. Zero entries may subordinate the hero to a body part, object macro, face portrait or pure
      texture. Audit as a SET, not a sample: this slop is invisible at MVP size and only bites under
      automation.
- [ ] Dullness sweep (the PixelBot defect class): no blank / clear-dome / overcast-sheet skies, no
      bleached flat light, no rows of identical objects as the hero, one charm detail per hero entry.
- [ ] Literalization sweep: halo rings, light as a column/pillar/bar, reflections as ribbons, animal
      similes on clouds and headlands, weathervanes and compasses (they render readable text), masonry
      vocabulary in geology pools, posture verbs in camera pools.
- [ ] Mark or clear the ~330 unreferenced pools and 48 dead files so nothing is grown by mistake.
- [ ] Fix `CLAUDE.md`'s bot list: it names mechbot and retrobot (both dark) and omits dreambot and
      farmbot (both live).

Method: regex classifier plus a Sonnet rewrite of ONLY the flagged entries, re-validated against the
classifier, retried once then dropped. The proven harnesses are `scripts/fix-earthbot-clouds.js` and
`scripts/fix-dragonbot-human-language.js`. Never a blind mass rewrite: a fleet-wide auto-thinner was
already built once and removed for gutting good pools.

---

## 8. Standing rules this run must not break

- Bot test renders go up as SHADOW posts, reviewed in the app. Never a `/tmp` HTML contact sheet.
- 25 entries to test, scale only after sign-off. "These look good" is not "scale it".
- One variable per round, cap at 3 rounds, then restructure rather than fix one more thing.
- Equal share per sub-theme: one focused Sonnet call per bucket, never one big call with a distribution
  mandate, then tally.
- Append, never regen: a regen orphans the pool's shuffle-bag history and resets its cycle.
- Renders capped at 3 concurrent and gated on connection headroom
  (`waitForHeadroom({ min: 25 })`). Avoid the top of the hour and the 08:00 UTC nightly window.
- Explicit-path commits only, no `git add -A`. If agents fan out, one bot directory per agent.
- I author the candidate buckets, Kevin approves them. Sonnet never invents the varying element.

---

## 9. Decision log

| Date       | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-22 | Kevin chose the targeted expansion over a flat +100 on every pool, after the measurement showed 440k existing entries, a 2-11% duplicate rate, and a posting rate too low for extra depth to be visible.                                                                                                                                                                                                                                |
| 2026-09-22 | Bucket candidate list drafted (128 candidates across 16 bots) and written here for Kevin's cuts.                                                                                                                                                                                                                                                                                                                                        |
| 2026-09-22 | ToyBot `wooden-toy-land` DEACTIVATED (Kevin: "i don't like those renders"). It was the fleet's worst flag rate at 2 of 11 posts. Commented out of `paths[]`; builder, pools, seeds and skip-list entries preserved.                                                                                                                                                                                                                     |
| 2026-09-22 | BrickBot IP ban REVERSED (Kevin: pop-culture worlds are fine, LEGO fair use is acceptable for now). Playbook CRITICAL LESSON 2 + BrickBot hard-rules list + failure-mode table rewritten; `feedback_no_star_wars_brickbot.md` and `feedback_brickbot_licensed_ip_scope.md` updated; brickbot exempted from the sweeper's IP family. Hard-SF realism stays OUT (render quality, not IP).                                                 |
| 2026-09-22 | Kevin delivered his FINAL bucket list: 75 buckets across 15 bots (section 6). EarthBot and OceanBot dropped entirely. Five items flagged for a decision before seeding.                                                                                                                                                                                                                                                                 |
| 2026-09-22 | StarBot + DragonBot CHARACTER PATHS approved as an explicit exception to buckets-only (Kevin: "i want to see the actual characters who inhabit both worlds", flash, beauty, stylization and sex appeal welcome). 6 DragonBot + 8 StarBot paths listed in section 6c, built on the AlphaBot `pulp-femme` formula Kevin pointed at. Taste line set at tasteful-adult.                                                                     |
| 2026-09-22 | Phase 0 run. Three audit scripts built. Key results: 5,168 exact duplicate entries in wired pools (free purge), real expansion target is 177 pools not 217, Star Wars / Disney IP found live in BrickBot pools against a playbook hard rule, TinyBot confirmed as the only ongoing bot-wide flag problem, FarmBot's 9.2% flag rate closed out as a one-time cull of already-deactivated paths. Full-run estimate revised down to ~$385. |
