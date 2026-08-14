# Operation Sweet Dreams

**Mission:** make nightly dreams a "what the hell, this is amazing" experience people come back
for. Put users in truly out-there, fun, gorgeous scenarios they'd never dream up themselves.
Big expansion into fantasy / sci-fi / fun / absurd, cast into the scene via face-swap.

Owner: Kevin. Status of record for the nightly scene-pool expansion. Playbook sibling:
`NIGHTLY_FUN_SCENARIOS_PLAN.md` (the active/fun bucket machinery this builds on).

---

## How nightly scene selection works today (the audit)

A cast user's nightly rolls ONE scene **type**, weighted by live `engine_config` percentages,
then picks a random unseen row from that type's pool. Same split for **dual** (you + your +1)
and **solo** (you alone):

| Type | Live % | What it is |
|---|---|---|
| goofy | 15 | absurd / funny / oddball |
| elegant | 15 | dressed-up, pretty, period + modern glamour |
| **active** | 30 | cool / epic / adventure / fantasy / sci-fi (the "out there" bucket) |
| plain-location | **40** | cast into one of YOUR chosen places (75% get a fitting action beat) |

Pools today (`dual_scenarios` / `single_scenarios`, active rows):

- **active** 1,426 each: 9 named categories x100 (swashbuckler, artifact_hunter, fantasy_hero,
  space_scifi, cyberpunk, superhero, expedition, champion, giant_critter) + 526 uncategorized
  "recreational" rows.
- **goofy** ~830: absurd_everyday, animal_mayhem, decade_eras, fantastical_silly, fun_activities,
  giant_scale, glamour_shot_retro, out_and_about, party_carnival, surreal_absurd, time_travel.
- **elegant** ~500-560: victorian, gatsby_1920s, renaissance_baroque, regency, old_hollywood,
  modern_blacktie, romantic_gardens, evening_city.

Plus `nightly_seeds` (6,665 rows, 31 surreal-art categories) = the NO-cast artistic dreamscapes,
and 105 `location_cards` feeding the plain-location spread.

### The gaps
1. **40% of cast nights are still "you standing in your park"** — the biggest slice is the least
   surprising outcome.
2. The wild bucket is only 30%, and its themes lean archetype-heavy (hero / soldier / explorer).
3. Kevin's specific fun ideas (dragon pet, riding a giant corgi, giant weapon, baby-animal swarm,
   chic-cool, tropical, underwater, celestial) are only partially covered.

---

## Architecture decision: new CATEGORIES, not new roll-types

The roll has two layers: a **type** layer (goofy/elegant/active/plain) weighted by config, and a
**within-type** pick that is uniform-random across rows. `category` is just a descriptive tag; the
loaders fetch `WHERE pool=<type>` with no category allow-list (verified in
`dualScenarioLoader.ts` / `singleScenarioLoader.ts`). So:

- A new `category` **works the instant rows are inserted** — no code, no config, no deploy.
- **Category share = row-count share.** Seed 100 rows of a theme into active (~1,426 today) and it
  hits ~7% of active nights. Row count IS the per-theme dial.
- **We do NOT add a 5th top-level type** (that needs new config pcts + code branches + filterUnseen
  keys + a full re-balance). All 13 new themes fold in as categories inside the existing type pools.
- The **type-level reweight** (below) is the coarse "more wild overall" lever.

### Prerequisite (DONE, deployed 2026-08-13)
The active pool passed 1,000 rows, so the loaders' single un-paginated PostgREST query was silently
truncating it at the 1000-row cap — ~426 active scenarios (30%) were dark, selection undefined.
Fixed: `dualScenarioLoader.ts` + `singleScenarioLoader.ts` now page every column-ladder rung with
`.range()`. `nightly-dreams` redeployed. Without this, everything we seed below would have landed in
the unreachable zone.

### Proposed reweight (apply AFTER the look is graded — one `engine_config` row, no build)
| Type | Now | Target |
|---|---|---|
| active | 30 | **50** |
| goofy | 15 | 15 |
| elegant | 15 | 15 |
| plain-location | 40 | **20** |

Keeps some real-place casting (a beloved "that's MY beach" moment) but makes the wild stuff the
plurality. Tunable live.

---

## The 13 new themes

Each is a new `category` in the pool whose generator-DNA renders it best. Fantastical themes
(dragons, magic, creatures, gods, sci-fi) set `mediumBan: 'photography'` — photoreal reads as creepy
CGI, not whimsical (matches existing fantasy_hero / giant_critter / superhero). All descs authored
swap-safe: the two people stay foreground with big clear camera-facing faces, a clear gap between
heads, creatures/scale/weapons kept low or in the background, never over a face.

### Into ACTIVE (10)

1. **mounts_and_riding** (ban photo) — riding side by side on wondrous steeds across a sweeping
   vista: a giant fluffy corgi, horses through an enchanted valley, a gentle unicorn, a great elk, a
   feathered raptor. Reins in hand; rolling hills / misty peaks / blossom fields behind. Mounts calm
   and side by side so both faces stay clear. *(Kevin: "riding a big corgi," "riding a horse in a
   fantasy setting." Distinct from giant_critter, which keeps the animal in the background.)*
2. **companion_creatures** (ban photo) — the couple with their own wondrous PET at their side: a
   small dragon on a forearm, a glowing fox familiar, a baby griffin, a tiny phoenix. Cozy-adventurer
   clothes; magical glade / cliff overlook / rune-lit study. Creature small and beside them, never
   covering a face. *(Kevin: "them with their dragon pet.")*
3. **epic_arsenal** (ban photo) — wielding a colossal glowing weapon between/beside them: a massive
   rune-etched greatsword planted in the ground, twin plasma blades, an enormous warhammer, a glowing
   bow, a sci-fi cannon at rest. Fantasy/sci-fi armor; battlefield ridge / shattered temple / neon
   hangar. Weapons at chest level or lower, never over a face. *(Kevin: "wielding a giant weapon in
   some sci/fantasy scene." Deepens fantasy_hero/champion into weapon-hero territory.)*
4. **tropical_adventure** — mid-adventure in a lush paradise: clinging to a leaning coconut palm,
   wading a turquoise lagoon toward a waterfall, paddling an outrigger, on a rope bridge over a jungle
   gorge. Bright island/explorer clothes; a step apart. *(Kevin: "climbing a coconut tree in some
   tropical destination.")*
5. **underwater_wonders** (ban photo) — as merfolk or free-divers gliding a sunlit reef, alongside a
   gentle whale, above a sunken temple of glowing coral, in a light-streaked kelp forest. Flowing
   merfolk tails or sleek dive suits (NO scuba masks over the face). Clear gap; light rays + fish
   behind. Serene and dazzling.
6. **celestial_dream** (ban photo) — among the stars: perched on a glowing crescent moon, on a
   floating sky-island under the aurora, catching falling stars in a lantern, on a cloud terrace among
   constellations. Dreamy celestial clothes; galaxies + comets around them. Awe-inspiring, gorgeous.
7. **sports_glory** — the peak of an epic athletic feat: cresting a giant surf wave, mid slam-dunk
   under stadium lights, breaking a marathon tape, hoisting a trophy in a roaring arena, carving a
   powder run. Jerseys / athletic gear; a stride apart; crowds + spray behind. *(Complements champion:
   champion = podium/medal moment, sports_glory = the peak-action feat.)*
8. **cozy_magic** (ban photo) — gentle spellweavers: stirring a glowing cauldron in a candlelit
   apothecary, reading a floating storybook in an enchanted library, tending luminous plants in a
   witch's greenhouse, brewing potions among drifting sparks. Soft robes / charmed cardigans; warm
   glow + floating motes. *(Non-combat magic, distinct from fantasy_hero's sword-and-sorcery.)*
9. **mythic_legend** (ban photo) — figures of ancient myth: on marble Olympus among clouds and
   laurel, in a Norse hall of runes and firelight, on an Egyptian throne dais of gold, before a temple
   of a jade dragon. Draped godly robes, laurels, golden regalia; columns + divine light behind.
10. **winter_wonder** (ban photo) — a magical frozen world: a sleigh pulled by a great white bear, a
    glittering ice palace, skating a frozen aurora lake, a snow-globe village aglow. Fur-trimmed cloaks
    and mittens; northern lights + snow crystals around them. *(Magical winter, distinct from
    expedition's rugged-realist arctic.)*

### Into ELEGANT (2) — broadens elegant from "formal" to "styled & striking"

11. **street_cool** — effortlessly cool modern street style, striking standout fashion: a neon-lit
    crosswalk at night, a graffiti-art alley, a rooftop at golden hour, a chic café strip, a sleek
    subway platform. Bold streetwear / designer jackets / statement looks, sunglasses up (never over
    the eyes). Confident, editorial. *(Kevin: "super chic urban setting with them in a cool outfit.")*
12. **stage_and_fame** — living-the-dream stardom: a red carpet under flashing bulbs, a magazine
    cover shoot, a stadium stage under spotlights with a crowd beyond, a glossy talk-show set, a movie
    premiere. Glamorous gowns / sharp suits / statement looks. Dazzling, aspirational.

### Into GOOFY (1)

13. **adorable_swarm** — joyfully mobbed by adorable baby animals, normal clothes: knee-deep in
    tumbling golden puppies, under a pile of ducklings and chicks, in a meadow of piglets, kittens
    spilling from a basket, bunnies hopping all around. Cuteness is the whole point; animals stay low,
    never covering faces. *(Kevin: "running around with a bunch of cute baby pigs/chicks/puppies."
    Sibling of animal_mayhem, wholesome-cute rather than a gag.)*

---

## Medium bans (photo-real-adjacent) — DONE 2026-08-13

Fantastical scenes render badly in photo-real and photo-adjacent mediums. The scene face-swap roll
draws from 8 scene-eligible mediums; the 6 photo-adjacent ones are now banned from fantastical pools:
**photography, film_noir (Noir), vintage_film (Vintage), double_exposure (Overlay), heirloom
(Heirloom), glamour (Glamour)**. Left for fantasy: canvas + illustration on the direct roll, and the
re-roll reaches the wider painterly set (comics, pencil, pop_art, watercolor).

- **Engine change (deployed):** `medium_ban` now accepts a COMMA-SEPARATED list. `nightly-dreams`
  parses it and re-rolls out of the whole list (`bannedMediums.includes(...)`); a legacy single key
  still parses to a 1-element array (backward compatible). Fail-open preserved. The face-swap pool has
  ~12 mediums, so excluding 6 still leaves a healthy painterly set (above filterRecent's floor).
- **Generators:** shared `PHOTO_ADJACENT_BAN` constant; fantastical buckets carry it.
- **Which themes ban:** fantastical (mounts, companion, epic_arsenal, underwater, celestial, cozy_magic,
  mythic_legend, winter_wonder, magical_girl_f, warrior_soldier_m) + the 5 existing (fantasy_hero,
  superhero, giant_critter, fantastical_silly/fantastical, giant_scale/absurd_giant). Real-world themes
  keep photography: tropical_adventure, sports_glory, street_cool, stage_and_fame, adorable_swarm,
  hunting_m, fishing_m, extreme_sports_m, combat_sports_m, princess_f, ballerina_f, girly_cute_f.
- Existing DB rows for the 5 old fantasy categories get a scoped UPDATE to the full CSV.

## Gendered solo pools (single dreams only)

The solo roll already routes by cast gender (`nightly-dreams:1337-1349` →
`singleScenarioCandidates(pools, pool, g)` unions `any ∪ own-gender`), and `single_scenarios` has a
`gender` column. So gendered pools are pure seeding, ZERO engine change. The 13 shared themes stay
`gender='any'` (both genders get them); gendered categories layer on top.

| Gender | Category | Type | Flavor |
|---|---|---|---|
| female | princess_f | elegant | fairytale princess, gowns, tiaras |
| female | ballerina_f | elegant | ballet stage, tutu, spotlight |
| female | girly_cute_f | goofy | pink/pastel/fluffy/kawaii |
| female | magical_girl_f | active | sparkly magical-girl heroine (bans photo) |
| male | extreme_sports_m | active | motocross, big-wave, downhill MTB |
| male | combat_sports_m | active | boxing, MMA, muay thai |
| male | warrior_soldier_m | active | spartan, gladiator, knight, soldier (bans photo) |
| male | hunting_m | active | camo, duck blind, bow (keeps photo) |
| male | fishing_m | active | deep-sea, fly fishing, the big catch (keeps photo) |

Dual dreams (two people) don't gender-route, so they keep only the 13 `any` themes.

## Seeding process (per-theme)

Uses the canonical generators, which set `pool` + `category` (scoped-deletable per the hard rule)
and bake swap-safety into every Sonnet prompt:

1. **Author the bucket** `{ key, label, desc, mediumBan? }` in `ACTIVE_BUCKETS`
   (`scripts/generate-dual-scenarios.js`) and the solo equivalent in
   `scripts/generate-single-scenarios.js`.
2. **Generate MVP-25**: `node scripts/generate-dual-scenarios.js --pool active --buckets <key> --per 25`
   and `--pool active` on the single script (solo, gender='any'). Insert is scoped by category with
   cross-run append dedup.
3. **POST-SEED HOOK (mandatory for dual):** `node scripts/scan-dual-faceswap-proximity.js`, reword
   every flagged entry (couple too close = swap degrades to self-only). Must exit 0.
4. **Render a sample cast on Kevin**, grade the look (face-swap graded on FACE only). Fix the specific
   failing layer.
5. **Scale to ~100/theme ONLY after sign-off.** Production backfill = equal share per sub-theme.

Reweight (`active` 30 -> 50, `plain` 40 -> 20) is applied last, once the new content is graded good.

---

## Open decisions / notes
- Placement calls to validate via renders: adorable_swarm -> goofy (vs active); street_cool +
  stage_and_fame -> elegant (stretches "formal" to "styled"); sports_glory scoped to peak-action so it
  complements (not duplicates) champion.
- Overlaps to keep distinct in the descs: mounts_and_riding vs giant_critter (riding-on vs
  background), companion_creatures vs giant_critter (small pet vs giant backdrop), winter_wonder vs
  expedition (magical vs rugged), sports_glory vs champion (feat vs podium).
- Wave order: 6 launch themes first (mounts, companion, epic_arsenal, tropical, adorable_swarm,
  street_cool), then wave two (underwater, celestial, stage_and_fame, sports_glory, cozy_magic,
  mythic_legend, winter_wonder). All 13 approved by Kevin 2026-08-13.

## Iteration log
- **2026-08-13** — Program opened. Audited the roll + pools. Fixed the loader 1000-row truncation
  (prereq) and redeployed nightly-dreams. Drafted all 13 theme specs + reweight proposal.
- **2026-08-13** — Kevin approved all 13 + added: (a) multi-medium photo-adjacent bans on fantastical
  pools, (b) gendered solo pools. Shipped the multi-ban engine change (deployed). Authored all buckets
  into both generators (13 dual themes + 13 solo `any` + 9 gendered solo), validated via dry-run
  (quality excellent, swap-safe).
- **2026-08-13** — MVP-25 GENERATED: 875 rows across 35 buckets (dual 300, single 550), all correct
  pool/gender/ban. Active pools now 1,676 dual / 1,826 single (over the old 1000 cap — loader fix
  load-bearing). Dual proximity scan: 0 violations. Upgraded 885 existing fantasy rows to the full ban.
  Fired 12 sample renders cast on Kevin (6 dual, 3 self/male, 3 +1/female). RESULTS: medium ban 0/6
  violations (fantastical → illustration/pencil/watercolor/canvas; real-world kept photo); gender
  routing correct (female bucket → +1 female face, male → self male face); dual swaps clean, faces on
  correct bodies. Two minor tuning nits: underwater picked up a dive mask (desc says none); epic_arsenal
  weapons rendered normal-scale not "colossal." Awaiting Kevin's grade before scaling 25 → ~100/theme +
  the active 30 → 50 reweight.
- **2026-08-13** — Kevin hearted the dual adorable_swarm render (pop_art / grok-imagine-image): a
  cast-less generic woman, not his wife. Root-caused via `ai_generation_log.fallback_reasons`: the
  `pop_art` medium's Ben-Day-dot stylization broke the face-swap identity match — self reached 0.712 on
  rerender but the +1 stuck at 0.116 (needs 0.35, floor 0.15) → dual_degrade_single_refused_gender →
  dual_degrade_cascade → pure_scene_fallback (both cast dropped). NOT a seed/proximity issue (the other
  5 duals in painterly mediums nailed both faces). FIX: set `pop_art.face_swaps=false` (DB, no deploy) so
  cast dreams never roll it — it was leaking in via the face-swap pool despite `is_scene_eligible=false`.
  Re-ran adorable_swarm dual x2 → both clean (film_noir + heirloom mediums, both faces correct). Watch
  `comics` (halftone) but it passed solo (0.577). Face-swap pool now 11 mediums.
- **2026-08-13** — GIRLY-GLAM wing (Kevin hearted the magical_girl render, wanted a whole world): 12
  female-cast categories (magical_girl, princess, fairy_enchantress, ice_queen, star_princess, mermaid,
  flower_fairy, angel, unicorn, coquette, ballroom, pop_princess), each anchored on the hearted recipe
  (wand/prop + effect-burst + lavish gown). LOCKED to the magic medium set illustration/canvas/watercolor
  (`GLAM_MEDIUM_BAN` — natural mediums keep her real face + the glow; embodied anime/fairytale/kawaii
  would lose her likeness). MVP-25 → showcase on wife's +1 face: 10/10 locked to magic set, Kevin loves
  them. Scaling all 12 → 100.
- **2026-08-13** — MALE "cool" wing: 12 male-cast categories (secret_agent, race_driver, rockstar,
  fighter_pilot, gunslinger, dragon_rider, mech_pilot, king_emperor, samurai_ninja, street_racer,
  detective_noir, survivalist). Medium lock = NON-PHOTOREAL (`COOL_MEDIUM_BAN = PHOTO_ADJACENT_BAN`;
  Kevin: "painterly = anything non photo-real", so illustration/canvas/watercolor + comics + pencil, ban
  only the 6 photoreal). MVP-25 generating → render on self for grading.
- **2026-08-13** — `extreme_sports` (gender=any, single + dual): shared adrenaline pool both genders pull
  (surf, snowboard, climb, motox, ski, skydive, bungee...), non-photoreal lock. Overlaps the older
  `extreme_sports_m` (candidate to retire).
- **2026-08-13** — Gendered-solo LEAN wired + deployed: `single_gendered_boost_pct` (default 15) widens
  the elegant+active windows (half each) for KNOWN-gender solos → female skews glam, male skews cool,
  plain-location shrinks. Modest ("a bit, not too much"). engineConfig.ts + nightly-dreams roll.
- **2026-08-13** — Scaling the original 13 shared themes (dual+single) + old gendered to 100. Dedup
  audit at MVP-25: 0 exact dups, 1 near-dup across the glam pools — generator's cross-run `seen`-set
  dedup works. Re-audit due at 100.
- **2026-08-13** — PROP FIX + EPIC RESEED. The active-scenario DNA mandated a handheld prop every
  frame ("object after object" in renders) — separate from the location-beat fix. Freed it up: model now
  places/embellishes objects only when the scene calls for one, prop-free dynamic poses otherwise; the
  ONLY ban is a forced RANDOM object. LEFT the 526 legacy recreational alone (never had the mandate;
  already prop-light — verified in data). Scoped-deleted 2,400 single + 1,175 dual epic rows, reseeding
  all 65 epic/fantasy categories at 100 through the freedom prompt. Reseed job hit a ~30-min background
  kill limit TWICE (deletes-then-inserts-at-end, so epic pools went empty mid-run; /tmp backups were
  stale) → recovered by running in short parallel sub-jobs, each < kill limit, idempotent-resume by
  querying which categories were < 100. FINAL: single 45/45 at 100, dual 19/20 (winter_wonder topping
  60→100). Composition set 40/30/30. Gendered lean deployed (15).
- **STILL PARKED:** the reweight — final value **40/30** (active 40, plain-location 30; goofy/elegant
  stay 15). Kevin revised 45/25 → 40/30. Dual + single `*_scene_active_pct` = 40. The master exposure
  switch. Flip LAST, after the QA render pass + grading + dedup re-audit (so we never amplify ungraded
  content). Gendered lean (15) then further skews solos toward glam/cool.
