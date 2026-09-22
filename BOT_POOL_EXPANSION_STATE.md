# BOT_POOL_EXPANSION_STATE.md

**Status of record for the 2026-09 bot pool expansion.** Both the plan and the progress tracker.
Nothing in here has been executed yet. Created 2026-09-22.

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

## 1. Why this exists (what was measured, 2026-09-22)

| Measurement | Value |
| --- | --- |
| Live public bots | 18 (MechBot + RetroBot are `active = false` since June; OutlawBot is private with all 22 seed files missing) |
| Pool files, live bots | 3,027 (whole tree incl. dark bots + AlphaBot: 3,511) |
| Entries, live bots | 440,120 (whole tree: 501,759) |
| Median pool size | 126 entries; 1,390 pools are already at 200+ |
| Near-duplicate rate | 2% to 11% per bot (MangaBot 11% is the worst, and the largest at 57,936 entries) |
| Real posting rate | 6 to 20 renders per path per 90 days |
| Pools loaded but never referenced by a live path | ~330 symbols, ~55,000 entries, plus 48 dead files |

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

| # | Task | New entries | Test renders | Est. cost | Wall clock | Needs Kevin |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Safety net: 3 audit scripts | 0 | 0 | **$0** | DONE 2026-09-22 | no |
| 1a | Purge 5,168 exact duplicate entries from wired pools | 0 | 0 | **$0** | ~1 h | no |
| 1b | Top up the 177 clean wired content pools under 120 entries | 17,333 | ~45 | **~$211** | ~5 h | no |
| 2a | Expand look registers (4 thinnest bots, hand-authored) | ~24 (by hand) | ~24 | **~$2** | ~half a day | approve looks |
| 2b | New buckets, MVP at 25 each (~85 approved of 128 candidates) | 2,125 | ~200 | **~$38** | review-gated | yes, per bucket |
| 2c | Scale approved buckets to ~120 each | ~8,075 | ~50 | **~$100** | ~3 h | no |
| 3 | Tail sweep: rewrite the ~2,500 validated defect entries | ~2,500 rewrites | ~50 | **~$33** | ~4 h | no |
| | **Everything** | **~30,000** | **~370** | **~$385** | | |

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

**Duplicates (the biggest free win).** The wired pools contain **5,168 EXACT duplicate entries** across
227 pools, plus 10,367 signature near-dupes. Worst offenders: `gothbot/hair_colors` 100 of 200,
`yumbot/chef_lighting` 89 of 200, `mangabot/festival_nights_outfit` 83 of 200, and eleven more MangaBot
pools at 55-85 each. Several pools that look like 200 are effectively 100-140. Purging costs nothing
and recovers real variety, so it goes FIRST.

**Saturation.** 335 pools (>=50 entries) are already >=20% same-idea, so a +100 there under-delivers.
Only 9 of them are also expansion targets; those get +50 at most, or a recipe split.

**Defects.** 4,835 raw flags, of which ~2,500 validated as true positives after sampling. The
`dullness` and `grim_on_cute_bot` families are too noisy to act on as-is (they flag a rotting log, a
blood-moon, a line of dewdrops) and need narrowing before use. Validated, actionable:

| Finding | Count | Note |
| --- | --- | --- |
| ~~Star Wars / Disney IP in BrickBot pools~~ | **0 (dropped)** | **NOT a defect.** Kevin reversed the ban 2026-09-22: *"it's ok if it shows star wars or any other worlds from pop culture - the fair use laws for lego and those properties is fine for now."* The 176 flagged entries stay. The playbook's BrickBot CRITICAL LESSON 2 + hard-rules list, and both BrickBot IP memories, were rewritten the same day, and `sweep-bot-seed-defects.js` now exempts brickbot from the `ip_lookalike` family. |
| Other IP-lookalike (ToyBot/YumBot/ChibiBot) | 769 | Mostly ToyBot pools named for the IP itself (`vinyl_funko_cast` 202, `barbie_storytelling` 154). Matches Kevin's quarantine note about "a mouse-ear vinyl figure". Needs a product decision, not a sweep. |
| Firearms in high fantasy | 305 | DragonBot / GothBot / MangaBot / StarBot |
| Weathervane / compass rose (renders readable text) | 329 | Fleet-wide |
| Viewer-posture verbs in vantage/camera pools | 323 | The PixelBot "girl face-down in the water" defect class |
| Pirate-era tropes on strict-fantasy bots | 160 | DragonBot `artsy_girl_outfit` still has "PIRATE CORSAIR / Swashbuckler", the frozen path flagged-not-touched in the June purge |
| Human roles on a no-human bot | 182 | ChibiBot / TinyBot / YumBot "vendor", "shopkeeper", "villagers" |
| Light or sky described as a solid object | 132 | Fleet-wide |
| CJK characters | 90 | Fleet-wide |
| Greek-myth creatures on high-fantasy bots | 24 | pegasus / cerberus / cyclops / sphinx |

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

## 3. Step 0: safety net (do this first, always)

- [ ] `scripts/scan-bot-seed-dupes.js`: walk every `seeds/*.json`, report exact duplicates, signature
      near-duplicates, and single-theme concentration per pool. Exit non-zero on findings.
- [ ] Wire it as `scan:bot-seed-dupes` into `package.json` `check` (so pre-commit and CI both run it).
- [ ] Jest test for the checker's logic, modelled on `__tests__/lib/holidayPoolLint.test.ts`.
- [ ] `scripts/audit-bot-pool-wiring.js`: for each pool file, is it referenced by a live path. Output the
      authoritative Step 1 target list (this is what replaces the estimate in section 4).
- [ ] `scripts/sweep-bot-seed-defects.js`: the known regex families, printing the matched token not the
      whole entry (weathervane/compass, halo ring, light-as-column/pillar/bar, masonry in geology pools,
      posture verbs in camera pools, off-genre tropes, CJK characters, `as a [jewel/gem]` similes).

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

| Bot | Pools | Entries to add | Bot | Pools | Entries to add |
| --- | --- | --- | --- | --- | --- |
| yumbot | 31 | 3,097 | farmbot | 8 | 690 |
| starbot | 26 | 2,591 | faebot | 7 | 700 |
| gothbot | 24 | 2,400 | toybot | 4 | 400 |
| pixelbot | 18 | 1,800 | dreambot | 3 | 300 |
| steambot | 16 | 1,516 | dragonbot | 2 | 174 |
| bloombot | 14 | 1,304 | earthbot | 2 | 200 |
| brickbot | 10 | 966 | tinybot | 2 | 200 |
| chibibot | 10 | 995 | | | |

- [ ] 1a: purge the 5,168 exact duplicates first (free, and it changes several pools' real size)
- [ ] 1b: top up the 177 clean wired pools toward 200
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

| Bot | Current size | Bot | Current size |
| --- | --- | --- | --- |
| yumbot | 24 | chibibot | 12 |
| bloombot | 12 | mangabot | 12 |
| gothbot | 8 | farmbot | 6 |
| pixelbot | 6 | steambot | 6 |

- [ ] farmbot 6 → 12
- [ ] pixelbot 6 → 12 (era sub-styles per Kevin's 2026-09-19 steer, incl. the early-high-def look)
- [ ] steambot 6 → 12
- [ ] gothbot 8 → 14
- [ ] bloombot / chibibot / mangabot / yumbot: only if the first four land well

---

## 6. Step 2b: candidate buckets (Kevin strikes what he does not want)

A bucket is a named sub-theme inside one pool. Already how several pools are built: ChibiBot's
`creature_adventures_scenes` is 7 buckets at 15 each (water-park, park-playground, pool-party,
backyard-cookout, arcade, movie-theater, aquarium); YumBot's `meal_types_scenes` is 6 at 34 each
(breakfast, high-tea, picnic, coffee-shop, food-truck, midnight-snack). Each bucket is seeded by its own
focused Sonnet call at an equal share, per the standing rule. Every candidate below was checked against
that bot's live paths and existing tags, so none duplicate current coverage.

Process per survivor: 25 entries, shadow posts reviewed in the app, sign-off, then scale to ~120.

### BloomBot
- [ ] alpine wildflower meadow
- [ ] coastal cliff bloom over surf
- [ ] orchid cloud-forest (epiphytes on mossy branches)
- [ ] carnivorous bog (pitchers, sundew)
- [ ] tundra bloom (short arctic season)
- [ ] blossoming fruit orchard with petal drift
- [ ] lavender or tulip terrace rows
- [ ] floating flower barges on a canal

### BrickBot
- [ ] airfield with biplanes
- [ ] construction site (cranes, diggers)
- [ ] harbor docks and container cranes
- [ ] race day pit lane
- [ ] circus big top
- [ ] volcano research base
- [ ] desert archaeology dig
- [ ] stadium match day
- Deliberately omitted: LEGO farm (FarmBot's lane by Kevin's call) and LEGO dino island (DinoBot's).

### ChibiBot
- [ ] train ride
- [ ] ferry crossing
- [ ] rainy afternoon in a bookshop
- [ ] farmers market
- [ ] kite festival
- [ ] bake sale
- [ ] hot-spring soak
- [ ] stargazing at an observatory

### DinoBot
- [ ] courtship display (crests, fans, feather display)
- [ ] juvenile play
- [ ] den and burrow life
- [ ] undergrowth small-dino scale
- [ ] tidal flat with tracks
- [ ] amber forest (resin, conifers)
- [ ] high desert dunes
- [ ] mountain forest at the snowline

### DragonBot
- [ ] market day in a fantasy city
- [ ] merchant caravan on a mountain road
- [ ] cliff monastery
- [ ] siege camp at night
- [ ] tourney grounds
- [ ] fjord fishing village
- [ ] watchtower on a pass
- [ ] battlefield aftermath (quiet, not gore)

### DreamBot (buckets go in the dream-world axis)
- [ ] origami paper world
- [ ] music-box world
- [ ] clockwork garden
- [ ] mirror lake
- [ ] balloon festival sky
- [ ] bookshelf canyon
- [ ] teacup archipelago
- [ ] jellybean tide pools

### FaeBot
- [ ] autumn seed gathering
- [ ] acorn boat regatta
- [ ] mushroom apothecary interior
- [ ] star-charting on a hill
- [ ] honey harvest
- [ ] mossy bridge crossing
- [ ] sheltering from rainfall under leaves
- [ ] first frost morning

### FarmBot
- [ ] apiary and beekeeping
- [ ] lambing season
- [ ] sheep-shearing day
- [ ] hay baling in summer
- [ ] dairy and cheesemaking
- [ ] stable morning with horses
- [ ] greenhouse seedlings
- [ ] herb-drying loft
- Deliberately omitted: snow (first-snowfall was deactivated on purpose) and weddings (the noun drags
  modern bridal imagery into any render).

### GothBot
- [ ] opera house box
- [ ] bell tower vigil
- [ ] séance parlour
- [ ] catacomb library
- [ ] moonlit lake boat
- [ ] mourning portrait atelier
- [ ] rain on a carriage window
- [ ] glasshouse of black roses

### MangaBot
- [ ] onsen evening (yukata, exterior)
- [ ] convenience store at night
- [ ] game-center arcade
- [ ] ramen counter at midnight
- [ ] cicada summer on shrine steps
- [ ] sports club practice
- [ ] new year shrine visit
- [ ] karaoke box at night

### PixelBot
- [ ] castle town gate
- [ ] desert oasis caravan
- [ ] ice cavern
- [ ] volcano forge interior
- [ ] observatory tower
- [ ] moonlit lake
- [ ] floating market canal
- [ ] misty bamboo path

### StarBot
- [ ] space elevator base
- [ ] solar sail regatta
- [ ] terminator line world (the day and night boundary)
- [ ] pulsar observatory
- [ ] Dyson swarm under construction
- [ ] ocean moon under the ice
- [ ] ringed shepherd moons
- [ ] first landing on a colony world
- Do NOT add buckets to `spacewalk`: its 60 entries are two deliberately locked registers (poised awe,
  gliding momentum) after the chore-and-contortion purge.

### SteamBot
- [ ] pneumatic post office
- [ ] printing press workshop
- [ ] apothecary and chemist
- [ ] rooftop telegraph skyline
- [ ] brass glasshouse botanicals
- [ ] steam tram street
- [ ] watchmaker arcade
- [ ] dirigible repair scaffold
- Deliberately omitted: boiler room (the crisis-busywork register Kevin rejected).

### TinyBot (no humans; each role must be cast affirmatively as a critter)
- [ ] tiny library
- [ ] tiny train station
- [ ] tiny bakery
- [ ] tiny bathhouse
- [ ] tiny observatory
- [ ] tiny greenhouse
- [ ] tiny lighthouse
- [ ] tiny teahouse

### ToyBot
- [ ] paper-craft diorama
- [ ] marble run contraption
- [ ] pop-up book scene
- [ ] bath toy flotilla
- [ ] sand toy beachworks
- [ ] kite and paper plane sky
- [ ] puppet theatre stage
- [ ] snow globe world

### YumBot
- [ ] ramen counter at night
- [ ] bakery at dawn
- [ ] diner booth
- [ ] ice cream parlor
- [ ] hot pot table
- [ ] sushi counter
- [ ] brunch patio
- [ ] bento lunchbox

### EarthBot and OceanBot (optional, buckets are the wrong instrument here)
Both are essentially at their pool ceilings (EarthBot has 2 content pools under 120, OceanBot 6). The
honest gaps are regional or habitat rather than thematic.
- [ ] EarthBot: Arabian desert / Himalayan high altitude / Madagascar or Socotra endemic flora
- [ ] OceanBot: mangrove nursery / hydrothermal vents / sardine run / seagrass meadow / estuary river
      mouth / tide-pool macro

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

| Date | Decision |
| --- | --- |
| 2026-09-22 | Kevin chose the targeted expansion over a flat +100 on every pool, after the measurement showed 440k existing entries, a 2-11% duplicate rate, and a posting rate too low for extra depth to be visible. |
| 2026-09-22 | Bucket candidate list drafted (128 candidates across 16 bots) and written here for Kevin's cuts. |
| 2026-09-22 | ToyBot `wooden-toy-land` DEACTIVATED (Kevin: "i don't like those renders"). It was the fleet's worst flag rate at 2 of 11 posts. Commented out of `paths[]`; builder, pools, seeds and skip-list entries preserved. |
| 2026-09-22 | BrickBot IP ban REVERSED (Kevin: pop-culture worlds are fine, LEGO fair use is acceptable for now). Playbook CRITICAL LESSON 2 + BrickBot hard-rules list + failure-mode table rewritten; `feedback_no_star_wars_brickbot.md` and `feedback_brickbot_licensed_ip_scope.md` updated; brickbot exempted from the sweeper's IP family. Hard-SF realism stays OUT (render quality, not IP). |
| 2026-09-22 | Phase 0 run. Three audit scripts built. Key results: 5,168 exact duplicate entries in wired pools (free purge), real expansion target is 177 pools not 217, Star Wars / Disney IP found live in BrickBot pools against a playbook hard rule, TinyBot confirmed as the only ongoing bot-wide flag problem, FarmBot's 9.2% flag rate closed out as a one-time cull of already-deactivated paths. Full-run estimate revised down to ~$385. |
