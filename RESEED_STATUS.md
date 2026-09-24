# Reseed program — status of record

**What this is.** The one place that says which subject pools have been repaired, which are in
progress, which are next, and what each one measured. Every agent working a pool updates THIS file
in the same commit as the work. The runbook is the `reseed` skill (`.claude/skills/reseed/SKILL.md`,
invoke with `/reseed`); the reasoning and the decision log are `SEED_DIVERSITY_CHARTER.md` and
`SEED_POOL_REPAIR_HANDOFF.md`.

**The goal, in Kevin's words.** _"I have witnessed myself that the bots start to feel repetitive after
a few weeks, I'll see very similar posts or scenes I think I've seen before … less repetition."_
_"We should not just throw out what's there outright, but instead just make them actually distinct
in idea, then backfill any that lost too many after purification so that they are actually unique."_
_"Our goal here still, is to prove out if we can go back and fix seed pools to be unique with
actually varying scenes."_ (2026-09-23, proven on the pilot below.)

**Definition of DONE for one pool.** All of:

1. Every entry is a genuinely different idea of the SAME kind (same format, register, setting words,
   prefix, entry count; originals kept, near-copies rewritten in place). Measured on the pool's own
   varying element, with the basis stated.
2. The path lets the entry through: a forced render of an entry shows THAT entry's subject, colour
   and composition (the path's own prefix / hero mandate / template were audited and fixed if not).
3. Forced shadow renders of NEW entries, paired before/after on the same entries, reviewed by Kevin
   in the app, and he said they are good.
4. This file updated, the pool + path fix committed, the playbook updated with any new lesson.

**Operating mode since 2026-09-23 (Kevin):** _"iterate through all the paths … do your own QA gating,
maintain a report of which paths are done, and flag any that give you problems … i won't interrupt you
anymore."_ So the agent reviews every proposal and every render itself, commits + pushes per path, and
records the review-page and pairs-page links in the row. Anything uncertain goes under **Flags for
Kevin** below and the row is marked `flagged`; nothing uncertain is decided silently. Path fixes stay
fidelity-only (a second subject source, a hard-coded shape that overrides the entry); composition and
taste are never changed on the agent's own judgement.

## Resume here (the agent updates this at every stage; read it first after a context reset)

Kevin 2026-09-23: _"collect any problem paths or questions and make a note of them so we can revisit …
without blocking you from getting through all the paths. go now, don't stop until you get all the way
through."_ Work Track A worst-first (EarthBot `*_subject` pools next, then FaeBot, then the rest of the
queue), then Track B. Per pool: config in `scripts/reseed/pools/`, dry run to the session scratch dir,
self-review, `--execute`, forced paired renders (8 before + 8 after on the same slots), self-review,
commit + push, row + log here.

- **hawaii-flowers + coastal-vista: DONE.** Re-rendered on the same slots with the fixed harness
  (5e2590c1; entry reached the prompt 16/16 each); both pass on review, verdicts in the log. Pairs:
  hawaii https://claude.ai/artifact/WUTDVdZ782GuJuz41nVk4q, coastal
  https://claude.ai/artifact/4vvHDN7jpPkf3KMNLy7y3Y.
- **andes-patagonia:** pool WRITTEN (backup `~/poolbackup-earthbot-andes_patagonia-subject-*.json`),
  8 + 8 paired renders self-reviewed (16/16 prompts carried the entry; the after set spreads across
  crater lake / salt-flat mirror / sea headland / cloud-sea spires / mesas instead of mostly snow
  peaks). Next = commit (tooling commit first, then the pool + docs), push, row DONE.
  Review page https://claude.ai/artifact/Tpb2sATDR5Tw4TQXQZpTDn, pairs
  https://claude.ai/artifact/Q6F8zu3wUfjrKyZQwXkcuT.
- **australian-outback:** full dry run done (`australian_outback/full`: 64 → 200 distinct, 40 → 91
  places, 136 rewrites, 0 rejected after the word-count + light-case fixes). Next = self-review
  samples, execute, before/after renders (8 slots via `--indices`), pairs, commit + push.
- **iceland-raw:** full dry run running (`iceland_raw/full`); then **european-wilderness** (queued in
  the same chain; marker `landmark-full.done`). Same close-out per pool.
- **iceland-raw: DONE** (pool written, 8 + 8 pairs reviewed, 16/16 carried); close-out commit next.
- **australian-outback: DONE** (8 valid pairs after 3 extra slots replaced the kept-original ones;
  16/16 carried; pairs https://claude.ai/artifact/9UN8W8kkn492WnDUEAU8Da); close-out commit next.
- **european-wilderness: DONE** (8 + 8 pairs reviewed, 16/16 carried; pairs
  https://claude.ai/artifact/Xc9F5zcFabvFXuPqhCAt6o); close-out commit next.
- **african-landscape: DONE** (8 + 8 pairs reviewed, 16/16 carried); close-out commit next.
- **asia-landscape:** pool WRITTEN (72 → 200 distinct, 45 → 115 places, 128 rewrites; backup
  `~/poolbackup-earthbot-asia_landscape-subject-*`); chain rendering slots 115,104,190,80,33,102,195,54
  to `as/` (`as/done`). Next = pairs, self-review, commit + push.
- **epic-sunset: DONE** (8 + 8 pairs reviewed, 15/16 carried: one after-render's entry was dropped by
  Sonnet and rendered a grey overcast beach; the harness flagged it); close-out commit next.
- **national-parks:** full run (third start) running to `national_parks/full3` at ~60% acceptance
  (remaining rejections are two formations named in one candidate; retries fill them).
- **hidden-corner:** smoke passed after three parser fixes (type + host read from the opening clause,
  cloud-forest lookbehind, moss/fern check only on forest habitats); full run running to
  `hidden_corner/full`.
- **national-parks:** config `scripts/reseed/pools/earthbot.national_parks.subject.js` (object entries,
  189; same = geological province + formation + POV; 75 kept / 114 to rewrite; no park / landmark /
  vantage names, no weather / light / sky / wildlife). Smoke exposed brittle ordered-keyword feature
  checks (fixed: any-order keywords, hyphen-or-space; the checks test the ASSIGNED province and
  formation directly). Full run running to `national_parks/full`.
- **hidden-corner:** config `scripts/reseed/pools/earthbot.hidden_corner.subject.js` (string entries,
  200, "A <pocket> <where> — <lush details>"; same = pocket type + habitat + host feature; 70 kept / 130
  to rewrite; each type only in habitats where it is real). 10-slot smoke running.
- **Sampler rule (learned the hard way):** `report.changes[].index` is 1-BASED; pass it to
  `--indices` as is. Trailing-period normalization now lives in the config (`normalize`), so never
  post-process a proposal by hand again.
- **After that:** EarthBot `andes_patagonia_subject` (55%), `australian_outback_subject` (53%),
  `iceland_raw_subject` (52%), `european_wilderness_subject` (50%), `epic_sunset_subject` (48%),
  `national_parks_subject` (40%), `hidden_corner_subject` (38%), `african_landscape_subject` (36%),
  `asia_landscape_subject` (34%); same shape (object entries, a region/feature roster each), so clone
  the coastal config. Then FaeBot `enchanted-vista` anchors, then the rest of `queue.js`, then Track B.

## Flags for Kevin

1. **BrickBot `balloon-festival` is NOT in the live rotation** (Kevin asked 2026-09-23 to make sure it
   is). It is registered as SHADOW only (`scripts/bots/brickbot/index.js` `shadowPaths`); `pools.PATHS`
   does not list it. The file's own GO-LIVE TRAP note: it must be added to `PATHS` **and**
   `SKIP_LEGACY_PER_PATH` in the SAME edit or `pools.js` throws at require time and takes the whole bot
   down. Its 9 pools are 25 deep (MVP). Not flipped by me: a public bot posting from 25-deep pools is
   what Track B exists to prevent. It is Track B row 5; I will move it to the FRONT of Track B and scale
   it first. Say the word and I add it to `PATHS` + `SKIP_LEGACY_PER_PATH` (one edit) right after.
2. _(resolved 2026-09-23)_ hawaii-flowers verdict was withdrawn (harness bug) and re-measured: the
   beach entry does show through (sand colour reliably, shore form partly); see the log.

**Accepted Flux limits (Kevin 2026-09-23, do not chase):** species render in their own prior colour
(a green-titled flower line-up renders pink/white); a rich register only reads on strong-colour
families. "You can't force Flux out of its trained data, the existing behaviours are fine."

---

## Status table

| bot      | path                 | pool (seed file)                                | entries | distinct before → after (basis)                              | path fix                                                              | renders                                              | status   | commits                                          | date       |
| -------- | -------------------- | ----------------------------------------------- | ------- | ------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------- | -------- | ------------------------------------------------ | ---------- |
| bloombot | flower-friends       | `bloombot_flower_friends_flower_focal_cluster`  | 125     | 44 → 125 line-ups (same = 4+ shared species of 5-6, greedy)  | template defers to entry; own hero mandate + prefix + suffix + order  | 3 + 8 + 8 forced; paired 8: "absolutely beautiful"   | **DONE** | e672068b, 2ff1223d, 21c5222a, e99f8147           | 2026-09-23 |
| bloombot | flower-humming-birds | `bloombot_flower_humming_birds_hummingbird_cast` | 153    | 47 → 153 casts (same = focal species + behaviour + flower); 17 → 40 species, 5 → 13 behaviours, 11 → 40 flowers | template: no STRICT roster/palette, entry is the only flower source, own hero mandate + prefix + suffix | 8 before + 8 after, paired, shadow; Kevin OK'd | **DONE** | 95bb465a, 0cbf3280 + the path-fix commit | 2026-09-23 |
| earthbot | hawaii-flowers       | `hawaii_flowers_subject` (object entries)        | 200     | 17 → 200 distinct beaches (same = sand type + shore form + water state); 5 → 9 sand types, 3 → 10 shore forms, 4 → 8 water states; beach-only by design | template: 2 lines that hard-coded "sand crescent + calm surf" now defer to the entry | first 8 + 8 invalid (harness bug), re-rendered 8 + 8 valid (16/16 carried), self-reviewed | **DONE** | 60c41e57, 5d7bbf9d, 5e2590c1 | 2026-09-23 |
| earthbot | coastal-vista        | `coastal_vista_subject` (object entries)         | 200     | 200/200 distinct coasts (same = region + feature + POV opener); recipe-weighted regions | none needed (EPIC_VISTA archetype hands the entry through as the vista subject) | first 8 + 8 invalid (same bug), re-rendered 8 + 8 valid (16/16 carried), self-reviewed | **DONE** | abb7e7fe, 5e2590c1 | 2026-09-23 |
| earthbot | andes-patagonia      | `andes_patagonia_subject` (string entries)       | 200     | 42 → 200 distinct (same = place + light moment); 22 → 91 places, 11 light moments; 42 originals kept | none needed | 8 + 8 paired, shadow; 16/16 prompts carried the entry; self-reviewed | **DONE** | 5e2590c1 (tool), db591a44 | 2026-09-23 |
| earthbot | iceland-raw          | `iceland_raw_subject` (string entries)           | 200     | 38 → 200 distinct (same = place + light moment); 26 → 71 places, 8 → 9 light moments; 38 originals kept | none needed | 8 + 8 paired, shadow; 16/16 carried; self-reviewed | **DONE** | (close-out) | 2026-09-23 |
| earthbot | australian-outback   | `australian_outback_subject` (string entries)    | 200     | 64 → 200 distinct (same = place + light moment); 40 → 91 places, 9 → 10 light moments; 64 originals kept | none needed | 8 valid pairs (5 + 3 extra), shadow; 16/16 carried; self-reviewed | **DONE** | (close-out) | 2026-09-23 |
| earthbot | european-wilderness  | `european_wilderness_subject` (string entries)   | 200     | 77 → 200 distinct (same = place + light moment); 53 → 127 places, 9 → 10 light moments; 77 originals kept | none needed | 8 + 8 paired, shadow; 16/16 carried; self-reviewed | **DONE** | 7dc553bd | 2026-09-23 |
| earthbot | african-landscape    | `african_landscape_subject` (string entries)     | 200     | 69 → 200 distinct (same = habitat + light moment); 52 → 111 habitats, 10 → 12 light moments; 69 originals kept | none needed | 8 + 8 paired, shadow; 16/16 carried; self-reviewed | **DONE** | (close-out) | 2026-09-23 |
| earthbot | asia-landscape       | `asia_landscape_subject` (string entries)        | 200     | 72 → 200 distinct (same = habitat + light moment); 45 → 115 places, 12 light moments; 72 originals kept | none needed | 8 + 8 rendering | `pool written` | | 2026-09-23 |
| earthbot | epic-sunset          | `epic_sunset_subject` (object entries)           | 200     | 80 → 200 distinct (same = sky family + palm arrangement + sand); skies 7 → 10, palms 8 → 9, sands 3 → 7; 80 originals kept | none needed (EPIC_VISTA archetype hands the entry through) | 8 + 8 paired, shadow; 15/16 carried (one Sonnet drop, flagged); self-reviewed | **DONE** | (close-out) | 2026-09-23 |
| bloombot | flower-humming-birds | `bloombot_flower_humming_birds_flower_focal_cluster` | 120 | 33 → 120 line-ups (same = 4+ shared species, 3 when only 3); 26 → 70 species; red 35 → 20 | same fix                                                              | same batch                                         | **DONE** | 95bb465a, 0cbf3280 + the path-fix commit | 2026-09-23 |

Status values: `queued` · `analysing` · `proposal ready` (dry run done, waiting on Kevin's OK) ·
`pool written` · `path fixed` · `renders posted` (waiting on Kevin's verdict) · **DONE** · `skipped`
(say why: e.g. pool is fine on a read, or the path is being retired).

---

## Queue (worst first)

Generated by `node scripts/reseed/queue.js` (2026-09-23): subject pools of public bots, ≥50 entries,
≥20% same-idea by the lexical scan. **The percentage is a floor and the subject match is by slot-name
suffix, so read the path file and the pool before starting one** (some rows below are one pool matched
to several paths because the slot is just called `subject`). 90 candidates in all; the top of the list:

| same% | n   | bot      | pool                                              | path(s)                                   |
| ----- | --- | -------- | ------------------------------------------------- | ----------------------------------------- |
| 74    | 153 | bloombot | `bloombot_flower_humming_birds_hummingbird_cast`  | flower-humming-birds                      |
| 62    | 200 | earthbot | `hawaii_flowers_subject`                          | hawaii-flowers                            |
| 61    | 200 | yumbot   | `festival_scene_type`                             | japanese-festival (+3 sharing the slot)   |
| 57    | 200 | faebot   | `faebot_queen_of_forest_biome`                    | forest-fairy-scene, enchanted-vista       |
| 56    | 200 | earthbot | `coastal_vista_subject`                           | coastal vista path                        |
| 56    | 260 | faebot   | `faebot_forest_fairy_scene_foreground_anchor`     | enchanted-vista                           |
| 55    | 200 | earthbot | `andes_patagonia_subject`                         | andes-patagonia                           |
| 55    | 200 | faebot   | `faebot_dryad_portrait_foreground_anchor`         | enchanted-vista                           |
| 53    | 200 | earthbot | `australian_outback_subject`                      | australian-outback                        |
| 52    | 200 | earthbot | `iceland_raw_subject`                             | iceland-raw                               |
| 51    | 200 | faebot   | `faebot_enchanted_vista_foreground_anchor`        | enchanted-vista                           |
| 51    | 200 | faebot   | `faebot_queen_of_forest_posed_setting`            | queen-of-the-forest, fae-castle-village   |
| 50    | 200 | earthbot | `european_wilderness_subject`                     | european-wilderness                       |
| 49    | 200 | faebot   | `faebot_dryad_portrait_forest_backdrop`           | dryad-portrait, female-druid, male-druid  |
| 48    | 200 | earthbot | `epic_sunset_subject`                             | epic-sunset                               |
| 48    | 200 | mangabot | `isekai_scene_type`                               | isekai-fantasy                            |
| 46    | 120 | bloombot | `bloombot_flower_humming_birds_flower_focal_cluster` | flower-humming-birds                   |
| 43    | 200 | starbot  | `space_femme_phenomenon`                          | cosmic-vista                              |
| 38    | 198 | bloombot | `bloombot_desert_bloom_bloom_explosion`           | desert-bloom                              |
| 35    | 134 | bloombot | `bloombot_flower_fantasy_floor_carpet`            | flower-fantasy                            |
| 33    | 168 | dragonbot| `castle_biome`                                    | iconic-landscape                          |

Recommended order: finish BloomBot first (`flower-humming-birds`: both of its pools, sister template
to flower-friends, same bot-wide prefix already understood), then EarthBot's `*_subject` pools (one
motif each, e.g. `epic_sunset_subject` is 96% "tropical beach sunset with palms"), then FaeBot's
enchanted-vista anchors.

---

## Track B: new shadow paths to SCALE from MVP-25 to production depth

Kevin 2026-09-23: _"these are new ones that are still sitting at QA levels, so we need to scale them up
to production size, and we should use our new dedupe method that actually makes sure the scenes are
varied."_ Source of truth for what they are and how to treat them: **`NEW_PATH_POOL_SCALING.md`**
(read it in full before starting one). Opposite starting condition from Track A (thin pools that were
never scaled, not deep pools of one idea), same bar: the SUBJECT pool reaches 100+ genuinely distinct
ideas, every original kept, intent/format/prefix unchanged, forced shadow renders on NEW entries
reviewed by Kevin. **Do not promote any of them to `paths[]`** (Kevin's call) and **do not touch the 4
shared DinoBot paleo pools** (`_phenomenon`, `_sky`, `_megaflora`, `_surprise_element`).

None of these 18 are in `SUBJECT_POOL_MAP.json` (it was built from `paths[]`); identify each path's
subject pool by reading the path file (or `scripts/identify-subject-pools.js` pointed at it), never by
slot name. Tool: the same core with `--grow N` (append N new entries; the pool only grows).

| # | bot      | path                    | pools | subject pool (verify)                    | status | commits | date |
| - | -------- | ----------------------- | ----- | ---------------------------------------- | ------ | ------- | ---- |
| 0 | brickbot | balloon-festival        | 9     | `…_fleet`? (verify)                      | queued, **FIRST** (Kevin 2026-09-23 wants it live; scale, then he says go: Flags #1) |         |      |
| 1 | tinybot  | snow-globe-world        | 4     | `…_worlds`                               | queued |         |      |
| 2 | mangabot | game-center-arcade      | 7     | ?                                        | queued |         |      |
| 3 | steambot | brass-glasshouse        | 8     | ? (thinnest: `_keeper` 14, `_wet_air` 16) | queued |         |      |
| 4 | brickbot | airfield-biplanes       | 9     | `brickbot_airfield_aircraft`?            | queued |         |      |
| 6 | pixelbot | castle-town-gate        | 10    | ? (seeds load lazily via `scenePaths.js`) | queued |         |      |
| 7 | pixelbot | floating-market-canal   | 9     | ?                                        | queued |         |      |
| 8 | pixelbot | volcano-forge           | 10    | ?                                        | queued |         |      |
| 9 | pixelbot | cozy-farming-life-sim   | 4     | already at production depth: verify only | queued |         |      |
| 10 | faebot  | acorn-boat-regatta      | 8     | `faebot_regatta_boat_fleet`?             | queued |         |      |
| 11 | faebot  | mushroom-apothecary     | 8     | ?                                        | queued |         |      |
| 12 | faebot  | star-charting           | 8     | ?                                        | queued |         |      |
| 13 | dinobot | amber-forest            | 6     | `dinobot_amber_resident`?                | queued |         |      |
| 14 | dinobot | courtship-display       | 5     | ?                                        | queued |         |      |
| 15 | dinobot | den-and-burrow          | 4     | ?                                        | queued |         |      |
| 16 | dinobot | desert-dunes            | 5     | ?                                        | queued |         |      |
| 17 | dinobot | snowline-forest         | 5     | ?                                        | queued |         |      |
| 18 | dinobot | undergrowth-scale       | 4     | `dinobot_undergrowth_resident`? (23)     | queued |         |      |

Order is the doc's suggested order (bespoke and unambiguous first, DinoBot last because of the shared
pools). Open questions for Kevin are in that doc §9 (axis pools too or subject only; is 100 the floor
for a shadow path; go live before or after scaling).

---

## Log

- **2026-09-23 · earthbot/epic-sunset `epic_sunset_subject` · DONE (self-reviewed).** Object entries;
  the recipe (R4) makes every entry a flat tropical beach sunset on purpose, so the varying element is
  the sunset PICTURE: sky family + palm arrangement + sand. 80 → 200 distinct; sky families 7 → 10
  (mackerel sky, crepuscular rays and an indigo-to-orange band added from the recipe's own vocabulary),
  palm arrangements 8 → 9, sands 3 → 7 (golden, ivory, pink, grey added where real), 60 real tropical
  places each paired only with sands that exist there; 80 originals kept. Pairs (8 + 8, 15/16 carried):
  before had the same "translucent shorebreak wave-face glowing molten amber" barrel three times of
  eight and two lenticular clouds; after is a mackerel sky over golden sand, an indigo band over dark
  St Lucian sand, crepuscular rays, a rainbow gradient, a pastel pre-sunset, a saturated peak sunset,
  cotton-candy pink over ivory sand, and one miss: Sonnet dropped the "lavender afterglow over grey
  volcanic sand" entry and wrote a grey overcast beach (the harness flagged it; not a pool defect).
  Pairs https://claude.ai/artifact/7GjGrVff4bdnqhqk1EX2Vy.
- **2026-09-23 · earthbot/african-landscape `african_landscape_subject` · DONE (self-reviewed).**
  Landmark factory with the recipe's rules baked in (Africa is FLAT or CANOPY: every mountain trigger
  banned; wildlife tiny; Africa-coded materials). 69 → 200 distinct (same = habitat + light moment),
  52 → 111 real habitats across savanna / salt pans / delta and rivers / Congo forest / Sahara / Namib
  / Madagascar / fynbos, 12 light moments (electric storm, monsoon rainbow, haboob, Milky Way added
  from the recipe's own list), 69 originals kept. Pairs (8 + 8, 16/16 carried): before was three
  watering holes and three salt pans of eight; after is the Avenue of the Baobabs under the Milky Way,
  Lake Magadi's pink soda crust, Kruger lowveld, Erg Admer under lightning, the NamibRand dune belt,
  the Rufiji delta at pre-dawn, plus two Flux priors worth knowing: "Kogelberg fynbos … protea" rendered
  a macro protea bloom with the storm behind it (the flower ate the habitat), and "Budongo forest
  interior, ground-level POV" rendered a canopy vista under a rainbow. The pool decides the place; the
  path's hero / phenomenon axes still add their own drama. Pairs
  https://claude.ai/artifact/G8VRssxjv5tStU3mr2eJjN, proposal https://claude.ai/artifact/TDw8RFuToMHgak34vsZgyL.
- **2026-09-23 · earthbot/european-wilderness `european_wilderness_subject` · DONE (self-reviewed).**
  Landmark factory. 77 → 200 distinct (same = place + light moment), 53 → 127 real inland places
  (alpine peaks, cirque tarns, gorges, waterfalls, old forests, sandstone towers, highland moor,
  glaciers), 10 light moments, 77 originals kept. One tool slip: I normalized trailing periods on the
  proposal by hand and touched 4 kept originals, so the first `--execute` refused (the check works);
  restored and written. Pairs (8 + 8, 16/16 carried): before had Glen Coe ×2, Besseggen ×2 and heather
  moor ×2 of eight; after is Cheddar Gorge in mist, the Rhône Glacier, the Pravčická brána arch,
  Biogradska Gora's old beeches, the Burren (rendered as cliffs: a Flux prior on "limestone pavement",
  accepted), Vøringsfossen, Durmitor's Black Lake and the Grossglockner in storm light. Pairs
  https://claude.ai/artifact/Xc9F5zcFabvFXuPqhCAt6o.
- **2026-09-23 · earthbot/australian-outback `australian_outback_subject` · DONE (self-reviewed).**
  Landmark factory. 64 → 200 distinct (same = place + light moment), 40 → 91 real places across the
  recipe's 11 regions (red centre, Kimberley, Flinders, salt lakes, deserts, tropical north, rainforest,
  coast, Tasmania, eastern ranges, the west), 10 light moments, 64 originals kept. Factory fixes found
  here: the format regex rejected a proper-noun light moment ("Milky Way night") and left 2 slots
  unfilled; Sonnet drops the trailing period about half the time (now `normalize` in the config). Pairs
  (8 valid, 16/16 carried; my first sample hit 3 kept originals because the report's indices are
  already 1-based): Wilpena Pound → Yardie Creek gorge, Bungle Bungle → the Pinnacles at misty dawn and
  Mitchell Falls under the Milky Way, Karijini → Geikie Gorge at dawn, Twelve Apostles → Rainbow Valley
  at blood-red sunset, Kata Tjuta → Wallaman Falls, Uluru → Wollemi canyon under stars, Ormiston →
  Cradle Mountain over Dove Lake. Every after render is the place its entry names.
  Pairs https://claude.ai/artifact/9UN8W8kkn492WnDUEAU8Da, proposal
  https://claude.ai/artifact/VpGjTxnfvtD3XzdY8LsdVy.
- **2026-09-23 · earthbot/iceland-raw `iceland_raw_subject` · DONE (self-reviewed).** Landmark factory.
  38 → 200 distinct (same = place + light moment), 26 → 71 real places (glacier tongues and ice caves,
  waterfalls, basalt canyons, rhyolite highlands, volcanic fields, the lagoons, a little coast), 9 light
  moments, 38 originals kept. Format fix on the factory: the light moment may carry a proper noun
  ("Milky Way night"); the brief now asks for 38-50 words (Sonnet overshot 60 on ~half the first
  candidates). Pairs (8 + 8, 16/16 carried): before was three Vatnajökull tongues and two big waterfalls
  of eight; after is a rift waterfall under the Milky Way, a glacier lagoon under aurora, Kvíárjökull
  between its moraines, Landmannalaugar's rust rhyolite, Glymur's ribbon, Svínafellsjökull's crevasses,
  Gljúfrabúi's slot, Fjallsárlón at sunset. Pairs https://claude.ai/artifact/NvffwfhA7ZPpiiABqJkpWt,
  proposal https://claude.ai/artifact/VCPJ36FDsCzeZX4jcpJtN4.
- **2026-09-23 · earthbot/coastal-vista + hawaii-flowers · DONE (valid re-render, self-reviewed).** Same
  8 slots each, "before" from the pool backup, fixed harness, entry reached the prompt 16/16 per path.
  Coastal: with the bug, 0 of 16 renders were even a coast (savanna, lava field, glacier, jungle
  waterfall); now every render is the coast its entry names: Faroese stacks, an English chalk wall,
  Svalbard pack-ice cliffs, a Madeira volcanic stack, Australian yellow limestone stacks, two Icelandic
  black basalt arches, a Fiordland inlet, Big Sur, a Hawaiian sea cliff. The pool decides the picture;
  no path change was needed (EPIC_VISTA hands the entry through as the vista subject). Pairs
  https://claude.ai/artifact/4vvHDN7jpPkf3KMNLy7y3Y. Hawaii: the beach entry shows through, sand colour
  reliably (black / white / golden as written), shore form partly (a straight strand, a motu islet, a
  low-tide flat, a stream mouth all read); the scattered petals and the sky drama come from the path's
  flower / sky axes, unchanged. The earlier "modest gain" line was wrong for the reason above. Pairs
  https://claude.ai/artifact/WUTDVdZ782GuJuz41nVk4q.
- **2026-09-23 · earthbot/andes-patagonia `andes_patagonia_subject` · DONE (self-reviewed).** First pool
  on the shared `landmarkPool` factory (string entries, "<Place> <feature> at <light>, …, foreground …,
  midground …, distant …, <sky>"). 42 → 200 distinct (same = place + light moment), 22 → 91 real places
  across the recipe's coverage groups, 11 light moments, 42 originals kept verbatim. No path change
  needed. Paired renders (8 + 8, same slots, shadow): 16/16 final prompts carried their place; the
  before set was five snow-peak/glacier frames of eight, the after set is a crater lake, a salt-flat
  mirror, a storm-lit sea headland, spires in a cloud sea, flat-topped mesas, a high-desert volcano,
  a wind-chopped lake and a glacier. Lenticular clouds recur in both sets: that is the path's
  phenomenon axis, untouched.
- **2026-09-23 · TOOL BUG · forced-render harness fed "[object Object]" for tagged pools.** brief-composer
  maps `{ tags, description }` entries to strings before picking; the harness proxy returned the raw
  object, so the archetype template received "[object Object]" as the subject and Sonnet invented the
  scene. All 16 hawaii-flowers and 16 coastal-vista renders were produced that way (checked: 0 of 16
  coastal prompts carried the entry; the hawaii "carried" check was a false positive because the
  template itself says beach / palm / sand). The hawaii verdict below is therefore WITHDRAWN and both
  paths are being re-rendered on the same slots. Fix: the proxy hands back the entry text; every render
  now records `carried` per slot, prints a warning when the entry did not reach the prompt, and the batch
  summary says so. Lesson for the skill: a paired render proves nothing until the final prompt is shown
  to carry the forced entry; check one by eye on every new path.
- **2026-09-23 · earthbot/coastal-vista `coastal_vista_subject` · pool written (abb7e7fe).** 200/200
  distinct coasts (same = region + feature + POV opener), regions weighted to the recipe, scale anchors
  and features drawn independently, 52 originals kept. Render verdict pending the re-render above.
- **2026-09-23 · earthbot/hawaii-flowers `hawaii_flowers_subject` · pool written; render verdict WITHDRAWN
  (see the tool bug above); the entry below stands as the pool record only.** First object-
  entry pool ({ tags, description }). 17 → 200 distinct beaches (same = sand type + shore form + water
  state); 9 real sand types, 10 shore forms, 8 water states; each rewrite keeps its original's camera
  opener; geography checked (a first pass produced 29 impossible combos such as "Big Island motu", fixed
  by coherence rules in `assign` and a filtered `--resume`). Template: 2 lines that hard-coded "sand
  crescent + calm surf" now defer to the entry. Renders (8 paired, shadow): honest read is that this
  path's visible variety comes mostly from its lighting / sky / flower axes, which already varied
  before; the beach entry shows through partly (sand colour, shore shape) and Flux draws black / white
  / golden / pink sand reliably, green and red rarely. Nothing broke; the pool is unique; the visible
  gain is modest. One render (#6) shows cliffs and a lava fall that the beach entry never named, from
  the path's hero / phenomenon axes, not from this work. Tool lesson: the three axes of an assignment
  must be drawn independently (a shared attempt index locked them in step and left 31 slots unfilled).
- **2026-09-23 · bloombot/flower-humming-birds, both pools · renders posted.** Tool factored into
  `scripts/reseed/` (core + a config per pool). Cast pool: 153 entries were 17 focal species × two
  behaviours (hover 101, sip 51) × ~12 flowers; now 153 distinct casts from 40 real species with their
  real plumage, 13 in-flight behaviours, 40 hummingbird flowers (47 originals kept). Flower pool: 33 →
  120 distinct line-ups, 26 → 70 species, both entry shapes kept 60/60 (33 originals kept). Path fix
  (same family as flower-friends): the template injected its own STRICT species roster + palette and a
  species list in three places; the bot-wide prefix packed the frame. Before: 8 of 8 forced renders were
  a wall of pink peonies behind one bird whatever the flower entry said. After: each render shows its own
  bird (species, plumage, pose), open air, and the entry's colour family; flower species recognizability
  stays partial (Flux priors, accepted). Parser lessons: split bird clauses on ";" first (commas inside a
  plumage list are not clause breaks); a colour word that is also a flower name ("fuchsia") and a bare
  word that is also a species ("vines" → trumpet vine) must not be aliases; the length band must widen
  when the roster's names are longer than the originals'.
- **2026-09-23 · pilot DONE · bloombot/flower-friends `flower_focal_cluster`.** First attempt (category
  method) reverted: it changed what the pool is. Resumed in place: 44 → 125 distinct line-ups, 39 → 154
  species, 9 colour families, 40 rich-register entries. Then two path fixes were needed before any of
  it showed in a picture: the template's own STRICT palette/roster + pastel mandate (removed), and the
  bot-wide frame-packing prefix + hero mandate (path-only hero branch, prefix, suffix, focal insect
  first). Same 8 entries before/after: insects 1/11 → 8/8, compositions vary per entry, colour and
  register follow the entry. Full ledger: `SEED_POOL_REPAIR_HANDOFF.md` §9.
