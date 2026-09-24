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
- **asia-landscape: DONE** (8 + 8 pairs reviewed, 16/16 carried); close-out commit next. EarthBot's
  Track A subject pools are now all done except national-parks and hidden-corner (runs in flight).
- **yumbot/japanese-festival `festival_scene_type`:** config
  `scripts/reseed/pools/yumbot.japanese_festival.scene_type.js` (same = perch FAMILY: the one festival
  object the five foods gather on; mats ×28, spread cloths ×24, shrine steps ×16, koi-pond stones ×9;
  unknown perches stay their own idea). Roster of ~55 real matsuri perch families. Smoke next.
- **epic-sunset: DONE** (8 + 8 pairs reviewed, 15/16 carried: one after-render's entry was dropped by
  Sonnet and rendered a grey overcast beach; the harness flagged it); close-out commit next.
- **national-parks: DONE** (8 + 8 pairs reviewed, 16/16 carried); close-out commit next.
- **hidden-corner: DONE on the second pass** (8 + 8 on the same slots, 16/16 carried: a sandstone
  alcove, a root-arch tunnel, a cave pool with flowers, a boreal bog pool, a fungi-strewn log nook, a
  sunlit glade and two mossy creeks; pairs https://claude.ai/artifact/2Z1qMdFwwnkHM5ZBNmxdMQ). The
  first pass below is kept as the record of why. Close-out commit next.
- _(first pass)_ **hidden-corner: FIRST PAIRS FAILED MY REVIEW (a regression in visible variety), fixing.** The
  pool was written (70 → 199 distinct, 130 rewrites) and 16/16 prompts carried the entry, but five of
  the eight "after" renders are the same mossy waterfall gorge while the "before" set had a mossy
  oak, a sunset creek, two tide pools with sea stars and a flower cove. Cause found in the config, not
  in Flux: I gave EVERY rewrite a water note (a seep, a pool, droplets) as flavour, so dry pockets
  (glades, coves, log nooks, root pockets) all read as wet gorges, and twelve rewrites put a pond or a
  grotto "inside a hollow log" because the log hosts were open to every type. Fixed (water note only
  on water pockets, a floor note on dry ones, a "water in a dry pocket" check, owned hosts). Next =
  restore the backup, regenerate the dry-type and mis-hosted rewrites via a filtered `--resume`,
  re-execute, re-render the same slots, and only then judge. DONE through re-execute: 71 sound water
  rewrites kept, 59 regenerated (0 water words in dry pockets), pool written again (backup
  `~/poolbackup-earthbot-hidden_corner-subject-1790231224039.json`), re-render running to `hc2/` on the
  same eight slots. Pairs of the failed pass:
  https://claude.ai/artifact/1TFknEsNuF5ZpNCMFgVhJS. Lesson for the skill: a flavour element added to
  every entry becomes the render; flavour must follow the entry's own kind.
- **BloomBot carpets:** shared factory `scripts/reseed/lib/carpetPool.js` (the pilot's species-set
  method). **flower-fantasy floor_carpet: DONE** (30 → 131 distinct line-ups, 27 → 78 species, 104
  rewrites, 30 originals kept; pairs 14/16 carried, two Sonnet drops flagged by the harness; the
  carpet is a supporting axis under a giant surreal hero bloom, so what shows is the carpet's colour
  family, blues least, and never the species: modest visible gain by design, pool text unique; pairs
  https://claude.ai/artifact/89gNTLrzJdJnFg7tAFsKWk). **desert-bloom bloom_explosion: DONE (text-unique;
  visible gain nil)** (51 → 196 distinct, 19 → 103 species, 145 rewrites, 2 unfilled kept as originals;
  backup `~/poolbackup-bloombot-desert_bloom-bloom_explosion-*`). Pairs 12/16 carried (two Sonnet drops
  on each side, flagged by the harness): the path paints pink whatever the entry names (a "blazing red
  crevice carpet" rendered a pink rose tree, a "yellow superbloom carpet" a pink canyon wall); one
  fiery-orange entry tilted its render orange. The before set was just as pink, so the pool's hue words
  never reached the picture either way; the species-set text is unique and of the same kind. Pairs
  https://claude.ai/artifact/RvUZxeKESPPm43GPWWPrCu.
- **yumbot festival: FIRST PAIRS WEAK ON MY REVIEW, second pass in progress.** Pool written (97 → 200
  distinct on perch family + arrangement), 8 + 8 rendered, 16/16 carried, but the perch is a weak
  lever on this path: the five foods dominate the frame, obscure perches (a kendama pile, a kokeshi
  row, a senbei tin) never rendered, and "half-hidden behind" hid the foods behind a snack bag. The
  "before" renders read as clean matsuri scenes because a plain board / cloth / mat lets the market
  backdrop carry the picture. Fix: roster trimmed to strong-prior perches (tubs, drums, lanterns,
  steps, stalls, mats, fans, koi ponds …), arrangements trimmed to the six that sit the foods ON or AT
  the perch; regenerating only the rewrites that used a dropped perch or arrangement, then re-render
  the same slots. Pairs of the weak pass https://claude.ai/artifact/6Q5sCHkcapP6iTWxmPn1Rv.
  If the second pass is still no better than the originals, the honest close is "pool text unique,
  visible gain nil" and the flag stays for Kevin.
- **FaeBot anchors:** all three pools WRITTEN (forest-fairy 71 → 260 distinct, 25 → 68 kinds;
  dryad-portrait 52 → 200, 17 → 66 kinds; enchanted-vista 59 → 200, 20 → 69 kinds; backups
  `~/poolbackup-faebot-*-foreground_anchor-*`). **enchanted-vista pairs reviewed: the anchor is
  invisible.** 16/16 prompts carried the entry, and the eight after-renders are the same painted
  enchanted forest as the eight before (glowing tree, arch of branches, mushrooms come from the vista's
  hero / biome / light axes; a wild-garlic clump or an owl feather at the frame edge never reads). The
  scaling doc's own rule applies: a repeated axis is invisible, a repeated subject is the complaint.
  Close for the anchor pools = "text unique, visible gain nil, harmless"; no dryad renders will be
  spent. Pairs https://claude.ai/artifact/UNCzN3UM8WLECQLLJ7Enoe. **Confirmed on the portrait path
  too:** forest-fairy-scene pairs (15/16 carried) are eight beautiful, varied fae portraits before and
  eight after, and in none of the sixteen can the anchor be picked out (a thistle head, wild garlic,
  bracket fungi, an owl feather never read at the frame edge). Pairs
  https://claude.ai/artifact/6biQPY43Bk1ED4G9p2P31q. All three anchor pools: **DONE as text-unique;
  the axis is invisible on both paths.**
- **FaeBot queen-of-the-forest biome: DONE (real visible gain)** (26 → 197 distinct on forest type +
  first texture; 11 → 35 forest types; 171 rewrites, 3 unfilled = kept originals; backup
  `~/poolbackup-faebot-queen_of_forest-biome-*`). Pairs on the same eight slots, 15/16 carried (one
  Sonnet drop): before, two of eight were the same cherry-blossom scene and a "fern grotto" and a
  "wildflower meadow" both rendered as ponds; after, the entries show as an autumn maple grove, a
  waterfall glade with mossy boulders, a golden larch glade, a violet bluebell wood and an oak-trunk
  throne. Streams and meadows still lose to the path's tree-throne prior about half the time (Flux,
  accepted). Pairs https://claude.ai/artifact/8Lm2f2DbqWvGGxiSKRtJRp. **posed_setting: DONE (real
  visible gain)** (29 → 192 distinct on natural spot + pose; spots 21 → 37, poses 10 → 12; 163
  rewrites, 8 unfilled kept as originals; backup `~/poolbackup-faebot-queen_of_forest-posed_setting-*`).
  Pairs on the same eight slots, 16/16 carried: every after-render shows its written spot AND pose (a
  heather bank at the forest edge, a hand on a pine trunk, seated in a beech's root buttress, wading
  under a willow curtain, a half-turn in a birch glade, a house-sized boulder, the rim of a plunge
  pool, stepping stones across a stream); the before set was already 7/8 faithful but drew from 29
  ideas. Pairs https://claude.ai/artifact/LdEmpUvD5fHjzDFFuKMh1y.
- **YumBot festival: DONE on the second pass** (pool 97 → 199 distinct; 45 rewrites regenerated onto
  strong-prior perches; backup `~/poolbackup-yumbot-japanese_festival-scene_type-1790231416555.json`).
  Same eight slots re-rendered, 16/16 carried: six of eight show the named candy-apple tray, mikoshi
  beam, shaved-ice counter, cotton-candy cart, ramune ice tub or tea-house tatami in a lantern-lit
  matsuri; the two misses are the bot-wide look register rolling a flat sticker sheet, not the pool.
  Pairs https://claude.ai/artifact/Y9Jq6SRRThX3ZLxH1gtmLb. Flag 3 stays (the arrangement axis).
- **Track B started: BrickBot balloon-festival `fleet` (the path's subject: the sky full of
  balloons).** Config `scripts/reseed/pools/brickbot.balloon_festival.fleet.js` (same = launch
  situation + nearest balloon's pattern + the shaped balloon; 30 situations × 12 patterns × 40 shaped
  balloons; LEGO-register checks: a stated count ≥ two dozen, a height spread, an element word, no
  massing nouns). Grow run done (72 of 75 filled; 25 originals byte-identical; new entries 60-84 words
  in the originals' LEGO register), pool WRITTEN to 97 entries (backup
  `~/poolbackup-brickbot-balloon_festival-fleet-*`). Forced shadow renders of 8 NEW entries + 4
  originals (`bf/`, 12/12 carried; the path is function-form, so the harness takes `--slot
  balloon_fleet --pool balloon_fleet=<seeds json>`): the new fleets render as distinct LEGO scenes in
  the originals' register (an orchard-blossom launch, a canyon-rim rise, a clifftop fleet over the
  sea, a giant striped balloon over hedgerows, a lantern-lit downs launch), shaped balloons and
  minifigure crews present, nothing massed into one object. **Track B fleet: DONE** after a `--grow
  10` top-up past 100 (in flight). The other eight balloon pools are axis pools (build, camera, crowd,
  event, field, hero, light, moment); per the scaling doc's open question 1 (subject only, or axes
  too?) they wait for Kevin. Path stays in `shadowPaths[]`; the shadow renders are on BrickBot's
  profile for Kevin.
- **Last five Track A runs** (mangabot isekai, flower-fantasy carpet, desert bloom, starbot
  phenomenon, dragonbot castle biome) chained in `<pool>/full`; marker `last-five.done`.
- **MangaBot isekai-fantasy `scene_type`: DONE (text-unique; visible gain modest, path flag 4)**
  (127 → 195 distinct on category + motif, 11 categories, 68 rewrites, 5 unfilled kept as originals;
  backup `~/poolbackup-mangabot-isekai_fantasy-scene_type-*`). Pairs on the same eight slots: carried
  4/8 before and 7/8 after, and even a carried entry shows only partly, because the path's template
  composites eight axes (demon lord, goblin trio, healing vial, floating island, mana shimmer …) into
  one Sonnet prompt and the polish mashes them: a "magic-cast palms to the ground" read, an academy
  glasshouse read, a guild desk read; a harpy encounter came out a moonlit river, a chain-whip duel
  came out a cauldron scene. The before set behaved the same (three guild halls read, the rest were
  mashups). Pairs https://claude.ai/artifact/2vVJ8ED3EfKYAXnMNKxAMA.
- **StarBot space-femme `phenomenon`: DONE (text-unique; visible gain nil)** (40 → 196 distinct on
  phenomenon + placement, 21 → 46 phenomena, 160 rewrites after two resumes, 0 unfilled; backup
  `~/poolbackup-starbot-cosmic_vista-space_femme_phenomenon-1790233624567.json`). Pairs on the same
  eight slots (`sf/`), carried 6/8 before and 8/8 after: the phenomenon axis is invisible on this
  path. The femme fills ~80% of every frame and the backdrop is generic neon energy (lightning, a
  halo, lava seams, a sun) whatever the entry names; one after-render's spiral disc could pass for its
  ice-crystal halo, and none of the fog / three moons / solar-wind veil / ash-column lightning /
  binary eclipse / hyperspace streaks appear, exactly as none of the before set's nebula ring / falling
  stars / conflagration / supernova / rift / black hole did. Same finding as the FaeBot anchors: a
  background axis under a character hero. Pairs https://claude.ai/artifact/M2YACVZhXK7tCMLxeutw1B.
  NOTE the queue mislabelled this pool's path as cosmic-vista; the pool belongs to `space-femme` (the
  config keeps its file name, `starbot.cosmic_vista.space_femme_phenomenon.js`).
- **DragonBot castle `castle_biome`: DONE (text-unique; visible gain modest)** (50 → 168 distinct
  on biome + first hero feature after the parser fix, 118 rewrites, 0 unfilled; backup
  `~/poolbackup-dragonbot-iconic_landscape-castle_biome-1790233787532.json`). Pairs on the same
  eight slots (`dc/`), 7/8 → 8/8 carried: the castle axis fills the frame and the biome shows only as
  a foreground strip, about 3 of 8 either way. Before: golden barley fields, golden birch leaves, a
  plunge-pool with twin falls read; after: rose banks + pink blossom trees + lavender, wild daisies,
  a lavender field read, and the yew forest gave dark red-leaved woods. Larch valley, cedar forest,
  oak-island lake and chalk downs did not survive the castle. Nothing regressed; the pool no longer
  says "vast emerald mountain valley" 23 times. Pairs https://claude.ai/artifact/S2CudVACt69TRxq818Uoer.
  The path is `castle`, not iconic-landscape (the config keeps its file name).
- **FaeBot dryad-portrait `forest_backdrop`: DONE (text-unique; visible gain modest)** (26 → 196
  distinct on forest type + first texture; 15 → 34 forest types, 8 → 30 textures; 170 rewrites, 4
  unfilled kept as originals; backup `~/poolbackup-faebot-dryad_portrait-forest_backdrop-1790234225599.json`).
  Pairs on the same eight slots (`fd/`), 8/8 → 7/8 carried: the backdrop is soft-focus by design
  behind the portrait hero and reads about half the time either way. Before: oak trunks ×2, wisteria
  ×2, willow fronds read; a fern grotto and a bioluminescent glen did not. After: toadstools, aspen
  trunks, a waterfall and a mossy trunk read; rowan berries, a cedar grove and a beech cathedral did
  not. What reads after is new to the path (the old 15 types had none of those). Pairs
  https://claude.ai/artifact/Bxa2xLsVi2cQdnyF5yyC1T.
- **TRACK B WENT LIVE 2026-09-24 (later).** On Kevin's word, 15 of the 18 shadow paths are in
  `paths[]` (plus balloon-festival earlier in the day = 16 live); game-center-arcade and
  castle-town-gate are DISABLED (builders commented out) because their prompts trip Replicate's
  safety checker on every Flux model; star-charting went live on flux-1.1-pro after a bisection showed
  its flux-2-pro E005 wall was the medium's named-artist clause. Full accounting in Flags 5 and 6.
- **PROGRAM COMPLETE 2026-09-24 late.** Track A (every subject pool in the queue) and Track B (all 18
  shadow paths, 20 subject pools grown from MVP-25 to 100+ distinct, originals byte-identical, nothing
  promoted) are DONE and committed, each with reviewed forced shadow renders and a sheet link in the
  log. Open items are only the Flags for Kevin (1–5) and the scaling doc's §9 questions (the axis
  pools of the Track B paths). Nothing is in flight.
- **Track B state 2026-09-24 (read the Track B table for per-path status).** DONE and committed:
  balloon fleet, snow-globe worlds, arcade room, airfield aircraft, glasshouse house. WRITTEN, renders
  in flight: PixelBot gatehouse (`pg/`), canal_town (`pc/`), forge (`pf/`). Grow runs in flight or
  chained: regatta fleet, starchart astronomer, apothecary room, undergrowth floor, then den chamber,
  courtship act, amber grove. Smokes running: desert biome, snowline biome, undergrowth resident.
  Per pool close-out = review the grow report (sameness + voice), `--grow N --execute --from`, verify
  the originals byte-identical, 12 forced shadow renders (8 new + 4 originals) via
  `render-forced-entries.js --slot <axis key> --pool <axis key>=<seeds json>`, `sheet-page.js`,
  review, tracker row + log, commit the pool. Scene-path axis keys: PixelBot `ctg_gatehouse` /
  `fmc_canal_town` / `forge_forge`; FaeBot `regatta_boat_fleet` / `apothecary_room` /
  `starchart_astronomer`; DinoBot `amber_grove` / `display_act` / `den_chamber` / `biome` (desert-dunes
  and snowline-forest both, archetype slot maps) / `undergrowth_floor` / `undergrowth_resident`.
- **Track B, Track A closed.** Every Track A queue pool is DONE (see the status table). Track B now:
  **snow-globe `worlds` DONE** (25 → 104; 12/12 shadow renders reviewed, sheet
  https://claude.ai/artifact/8oc82ziUopkUgYPtJrhVP4; the pool never names the glass, and two of the
  twelve renders still drew the whole globe on a base, which is the path's own known failure mode,
  not the pool's). **arcade `room` WRITTEN** (25 → 104; renders `ar/` in flight). **glasshouse
  `house` grow** and **airfield `aircraft` grow** in flight. Next configs: PixelBot castle-town-gate
  `gatehouse` (same = gatehouse type + the one made thing), floating-market-canal `canal_town`,
  volcano-forge `forge`; then FaeBot ×3, DinoBot ×6 (subject pools only, never the four shared
  paleo pools). Render sheets for grow runs: `node scripts/reseed/sheet-page.js <dir> <out.html>`.
- **FaeBot (queen biome + three foreground-anchor pools):** shared factory
  `scripts/reseed/lib/faeAnchorPool.js` (same = anchor kind + position in frame; ~65 real forest
  anchors × 8 positions; nothing glowing per the playbook) + `faebot.queen_of_forest.biome.js` (same =
  forest type + first signature texture; 37 types). First smoke burned 80 calls on a format regex that
  rejected the originals' trailing period (fixed); smoke2 running.
- **Tool lesson (in the skill next):** before any full run, simulate `assign()` over every rewrite slot
  offline and confirm every slot is assignable; an assignment space smaller than the pool wastes the
  whole run.
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

1. _(resolved 2026-09-24)_ **BrickBot `balloon-festival` is LIVE** on Kevin's word: added to
   `pools.PATHS` (it was already in `SKIP_LEGACY_PER_PATH`, `chaos.skipPaths` and
   `twoPassPolish.skipPaths`, so it renders exactly as its graded shadow renders) and removed from
   `shadowPaths`. It joins BrickBot's flat shuffle-bag rotation (18 live paths) from the next
   dispatcher tick. Its fleet pool is 106 deep; its eight axis pools are still 25 (doc §9 q1).
2. _(resolved 2026-09-23)_ hawaii-flowers verdict was withdrawn (harness bug) and re-measured: the
   beach entry does show through (sand colour reliably, shore form partly); see the log.
3. **YumBot `festival_scene_type`: "same" had to include the cluster's arrangement.** The pool's
   varying element (the festival perch the five foods gather on) has only ~55 real families, so 200
   entries cannot all differ on it. I count "same" as perch family + arrangement (in a ring around /
   on top of / at the base of / peeking over the rim / along the edge / behind / leaning against / up
   the levels), which the entries already state ("around a goldfish tank", "on a mat", "at the foot of
   a torii"). If you would rather the pool shrink to ~120 truly distinct perches, say so; nothing else
   in the entries changed.

4. **MangaBot `isekai-fantasy`: the path's template composites ~8 axes into one Sonnet prompt**
   (scene type + demon lord + goblin trio + healing vial + floating island + mana shimmer + …), so
   the scene-type entry reaches the picture only partly, before and after the reseed (carried 4/8
   before, 7/8 after; readable in ~3/8 either way). The pool is now unique (127 → 195); the lever
   for visible variety is the path (fewer axes per render, or the scene type as the hero line the
   others defer to, as the pilot did for flower-friends). I did not touch a public bot's path
   without your word. Pairs https://claude.ai/artifact/2vVJ8ED3EfKYAXnMNKxAMA.

5. _(resolved 2026-09-24 — the earlier wording of this flag was WRONG in both directions)_ **The
   safety-filter failures were three different things, and none was "the scene models".** Kevin
   challenged the claim that a model had ever made a path fail, so it was measured properly: the exact
   flagged prompt text replayed across models (one attempt, no retry), then a clause-by-clause
   bisection per path (`scratchpad e005/replay.js`, `bisect.js`; 95 calls).
   - **faebot/star-charting = a MODEL fact.** The same prompts pass flux-1.1-pro 13/13 and ultra 13/13
     and fail flux-2-pro 14/15 (E005) at safety_tolerance 2 and 5 alike. Culprit = the medium's
     named-artist clause ("Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud painted-fantasy
     lineage"): alone 3/3 flagged, full prompt without it 0/3. The flux-2 checker rejects named
     artists; 1.1 does not. **Pin rolled back to flux-1.1-pro** (the batch Kevin graded as very good:
     23/23 then, 47/47 since, zero flags) and the path is LIVE.
   - **mangabot/game-center-arcade = a CONTENT fact, FIXED and LIVE.** Flagged on every Flux model,
     1.1-pro included (3 of 6 pipeline renders failed after the engine's full retry ladder). Culprit =
     one pool line, "a schoolgirl in a navy blazer occupying half the picture's height"
     (`seeds/game_center_arcade_play_moment.json`, 2 entries): alone 3/3, without 0/3. Disabled for a
     few hours, then on Kevin's word "schoolgirl" → "student" (the role the pool already uses):
     the reworded clauses pass 11/12 standalone (old wording 0/6), and a 12-render hidden pipeline
     batch on the path's own pins (7 flux-2-max, 5 flux-2-pro) delivered 12/12 with zero safety
     flags and zero retries. Promoted to `paths[]` the same evening.
   - **pixelbot/castle-town-gate = a CONTENT fact, combination trigger.** Flagged on every Flux model
     (5 of 5 pipeline renders on flux-1.1-pro failed). Removing "a small figure on the wall walkway
     hauling a heavy basket up on a rope hand over hand …" un-flags 3/3, but that clause alone does
     not flag, so it is that clause plus something else; not chased. **DISABLED** on Kevin's word.
   - **Why the run log looked clean on the 1.1 family:** `botEngine.flux()` retries a flag 2× on the
     same prompt and the render loop then re-rolls all pool picks up to 3×, so one logged failure is
     up to 9 flagged calls. The last 60 dispatcher runs show 23 flags across 330 prompt builds on
     flux-1.1-pro/ultra, every one recovered. Kevin's evidence (paths never fail on his models) and
     the log agree; the flags were simply invisible. Measure per ATTEMPT, not per logged render.
6. _(resolved 2026-09-24)_ **Track B go-live (Kevin: "get all the other working paths seeded and
   pushed live").** 15 paths moved from `shadowPaths[]` to `paths[]` (faithful xerox, nothing else
   about how they render changed except star-charting's pin above): tinybot snow-globe-world; steambot
   brass-glasshouse; brickbot airfield-biplanes (pools.PATHS, already in SKIP_LEGACY_PER_PATH and both
   skip lists); pixelbot volcano-forge + floating-market-canal; faebot mushroom-apothecary +
   acorn-boat-regatta + star-charting; dinobot amber-forest, courtship-display, den-and-burrow,
   desert-dunes, snowline-forest, undergrowth-scale. Every one delivered 100% of its shadow renders on
   its pinned models over the previous two days (bot_run_log). The persisted path shuffle-bag (mig 283)
   is roster-change-robust, so they enter each bot's rotation from the next dispatcher tick. Not run:
   `scripts/promote-shadow-path.js` (the historical blend of graded keepers into each bot's past feed)
   — it needs Kevin's keeper IDs, and the cron will fill history at cadence anyway. **Later the same
   evening: mangabot game-center-arcade joined them (Flag 5), so 17 of the 18 Track B paths are live
   and only pixelbot castle-town-gate stays disabled.**
7. _(policy, Kevin 2026-09-24)_ **Model default for new paths: 50/50 flux-1.1-pro / ultra.** The
   fleet inventory (480 live paths, 20 scheduled bots) found 197 paths already coin-flipping, 127
   ultra-only, 95 rolling pro+ultra+a third model, 57 with no pro, and only 4 pro-only — all four this
   week's Track B pins (regatta, star-charting, brass-glasshouse, snow-globe-world), each with a
   measured reason. Recorded in CLAUDE.md, the playbook and ALPHABOT.md; locked by
   `__tests__/lib/proOnlyPinGuard.test.ts` (an undocumented pro-only pin fails CI). The four existing
   pins were each probed with 12 hidden ultra renders the same evening: regatta ultra signed 1 of 12,
   star-charting 8 of 12 (both stay pro-only); brass-glasshouse delivered 12/12 with the vault readable
   but ultra tripped the safety filter on 8 attempts (pro: 0 in 30) so it stays pro-only;
   snow-globe-world delivered 12/12 clean with the glass arc in ~10 of 12, so its ToyBot-era reason did
   not reproduce; Kevin looked at the 12 ultra renders beside 12 pro renders ("ultra looks fine to me")
   and the pin was flipped to the 50/50 roll the same evening. Three pro-only pins remain (regatta,
   star-charting, brass-glasshouse). Study page (renders + the 480-path inventory) linked in chat.

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
| earthbot | asia-landscape       | `asia_landscape_subject` (string entries)        | 200     | 72 → 200 distinct (same = habitat + light moment); 45 → 115 places, 12 light moments; 72 originals kept | none needed | 8 + 8 paired, shadow; 16/16 carried; self-reviewed | **DONE** | (close-out) | 2026-09-23 |
| earthbot | national-parks       | `national_parks_subject` (object entries)        | 189     | 76 → 189 distinct (same = geological province + formation + POV); 17 provinces, ~95 formations with explicit key regexes; 76 originals kept | none needed (EPIC_VISTA archetype hands the entry through) | 8 + 8 paired, shadow; 16/16 carried; self-reviewed (5 clear, 3 partial) | **DONE** | (close-out) | 2026-09-23 |
| earthbot | hidden-corner        | `hidden_corner_subject` (string entries)         | 200     | 70 → 199 distinct (same = pocket type + habitat + host feature); 12 types × 12 habitats, hosts owned per type; 70 originals kept | none needed | first 8 + 8 failed review (one waterfall gorge), second 8 + 8 pass; 16/16 carried | **DONE** | (close-out) | 2026-09-24 |
| faebot   | forest-fairy-scene / dryad-portrait / enchanted-vista | `faebot_*_foreground_anchor` (string entries) | 260 / 200 / 200 | 71 → 260, 52 → 200, 59 → 200 distinct (same = anchor kind + position); kinds 25 → 68, 17 → 66, 20 → 69 | none | 8 + 8 on two paths: the anchor axis is invisible in all 32 renders | **DONE (text-unique; visible gain nil)** | (close-out) | 2026-09-24 |
| yumbot   | japanese-festival    | `festival_scene_type` (string entries)           | 200     | 97 → 199 distinct (same = perch family + arrangement); 82 → 100 perch families; 97 originals kept | none | first 8 + 8 weak (obscure perches), second 8 + 8 pass; 16/16 carried | **DONE** (flag 3) | (close-out) | 2026-09-24 |
| bloombot | flower-fantasy       | `bloombot_flower_fantasy_floor_carpet` (string) | 134     | 30 → 131 line-ups (same = 4+ shared species); 27 → 78 species; 30 originals kept | none | 8 + 8 paired, shadow; 14/16 carried; carpet colour shows, species never (supporting axis) | **DONE (modest visible gain by design)** | (close-out) | 2026-09-24 |
| bloombot | desert-bloom         | `bloombot_desert_bloom_bloom_explosion` (string) | 198    | 51 → 196 line-ups (same = 4+ shared species); 19 → 103 desert species; 51 originals kept | none | 8 + 8 paired, shadow; 12/16 carried (Sonnet drops flagged); the path paints pink whatever the entry names, before and after | **DONE (text-unique; visible gain nil)** | 61629837 | 2026-09-24 |
| faebot   | queen-of-the-forest  | `faebot_queen_of_forest_biome` (string)          | 200     | 26 → 197 distinct (same = forest type + first texture); 11 → 35 forest types; 26 originals kept | none | 8 + 8 paired, shadow; 15/16 carried; autumn maples, waterfall glade, golden larch, bluebell wood now show where two cherry-blossom scenes did | **DONE (real visible gain)** | 61629837 | 2026-09-24 |
| faebot   | queen-of-the-forest  | `faebot_queen_of_forest_posed_setting` (string)  | 200     | 29 → 192 distinct (same = natural spot + pose); spots 21 → 37, poses 10 → 12; 37 originals kept (8 unfilled) | none | 8 + 8 paired, shadow; 16/16 carried; every after-render shows its written spot and pose | **DONE (real visible gain)** | 71a0adef | 2026-09-24 |
| mangabot | isekai-fantasy       | `isekai_scene_type` (string)                     | 200     | 127 → 195 distinct (same = category + scene motif); 11 categories; 132 originals kept (5 unfilled) | none (flag 4: the template composites ~8 axes) | 8 + 8 paired, shadow; carried 4/8 → 7/8; readable ~3/8 either way | **DONE (text-unique; visible gain modest)** | 2d7390c9 | 2026-09-24 |
| starbot  | space-femme          | `space_femme_phenomenon` (string)                | 200     | 40 → 196 distinct (same = phenomenon + placement); 21 → 46 phenomena; 40 originals kept | none | 8 + 8 paired, shadow; 6/8 → 8/8 carried; the phenomenon never reads under the femme hero, before or after | **DONE (text-unique; visible gain nil)** | e91cbcf6 | 2026-09-24 |
| dragonbot| castle               | `castle_biome` (string)                          | 168     | 50 → 168 distinct (same = biome + first hero feature); 45 → 67 keys; 50 originals kept | none | 8 + 8 paired, shadow; 7/8 → 8/8 carried; biome reads as a foreground strip ~3/8 either way under the castle | **DONE (text-unique; visible gain modest)** | 39ce32b2 | 2026-09-24 |
| faebot   | dryad-portrait       | `faebot_dryad_portrait_forest_backdrop` (string) | 200     | 26 → 196 distinct (same = forest type + first texture); 15 → 34 types, 8 → 30 textures; 26 originals kept (4 unfilled) | none | 8 + 8 paired, shadow; 8/8 → 7/8 carried; the soft-focus backdrop reads ~half the time either way, new kinds read after | **DONE (text-unique; visible gain modest)** | (close-out) | 2026-09-24 |
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
reviewed by Kevin. **Do not promote any of them to `paths[]`** (Kevin's call — lifted 2026-09-24: 16
are LIVE, 2 DISABLED, see Flags 5-6) and **do not touch the 4 shared DinoBot paleo pools**
(`_phenomenon`, `_sky`, `_megaflora`, `_surprise_element`).

None of these 18 are in `SUBJECT_POOL_MAP.json` (it was built from `paths[]`); identify each path's
subject pool by reading the path file (or `scripts/identify-subject-pools.js` pointed at it), never by
slot name. Tool: the same core with `--grow N` (append N new entries; the pool only grows).

| # | bot      | path                    | pools | subject pool (verify)                    | status | commits | date |
| - | -------- | ----------------------- | ----- | ---------------------------------------- | ------ | ------- | ---- |
| 0 | brickbot | balloon-festival        | 9     | `brickbot_balloon_fleet` (verified: the path header calls the fleet the subject) | **subject DONE**: 25 → 106 entries, 106 distinct (situation + nearest pattern + shaped balloon), originals byte-identical; 8 new + 4 originals shadow-rendered (12/12 carried) and reviewed; 8 axis pools untouched pending Kevin (doc §9 q1); **LIVE 2026-09-24** (Flag 1 resolved) | a9aee0f0 + go-live | 2026-09-24 |
| 1 | tinybot  | snow-globe-world        | 4     | `tinybot_snow_globe_worlds` (verified: the path calls the WORLD the hero, it opens the prompt) | **subject DONE**: 25 → 104 entries, 104 distinct world types (roster of 93 real places with their own drifting particle), originals byte-identical; 8 new + 4 originals shadow-rendered (12/12 carried) and reviewed: a subway platform, an oil platform in a storm sea, a sluice camp, an abbey on a tidal causeway, a clock-tower square, houseboats on a canal, an aqueduct and a bee yard in wildflowers each read as their own world; still shadow | (close-out) | 2026-09-24 |
| 2 | mangabot | game-center-arcade      | 7     | `game_center_arcade_room` (verified: "the room is the hero subject") | **subject DONE**: 25 → 104 entries, 103 distinct room features (the composition lock is prepended by the config; Sonnet writes only the tail), originals byte-identical; 12 forced shadow renders, 7 rendered (5 failed on Replicate's safety filter, flux-2-pro E005, originals and new alike, see Flag 5); of the 7, the room feature reads in the originals' way (a stair rail, a prize shelf, a capsule landing; a stool with a coat, a glass door, a capsule pile) and the machines and glass wall carry every frame; still shadow | (close-out) | 2026-09-24 |
| 3 | steambot | brass-glasshouse        | 8     | `steambot_brass_glasshouse_house` (verified: "HERO, first in order") | **subject DONE (visible gain modest)**: 25 → 104 entries, 104 distinct house FORMS (viaduct, orangery, tufa fernery, ravine barrel, courtyard, turntable floor …), originals byte-identical; 8 new + 4 originals shadow-rendered (10/12 carried, two Sonnet drops flagged): the structure reads in about half (a roofed courtyard with its stone windows and pool, a great dome, a lower level seen through a glass floor, a wave-roofed hall); the rest are "a Victorian glasshouse" with the planting and machinery axes carrying the picture. The thin `_keeper` 14 / `_wet_air` 16 are axis pools, left for Kevin's call (doc §9 q1); still shadow | (close-out) | 2026-09-24 |
| 4 | brickbot | airfield-biplanes       | 9     | `brickbot_airfield_aircraft` (verified: "THE HERO") | **subject DONE**: 25 → 105 entries, 105 distinct civil roles (each with its own LEGO gadget; silhouette, colour, engine, marking and emblem spread as flavour), originals byte-identical; 8 new + 4 originals shadow-rendered (12/12 carried): every new aircraft is a brick biplane in its written colour (a scarlet floatplane, an olive island-hopper with crates, a sand crop-sprayer mid-spray, a hot-pink biplane over a tropical town, a cream-and-crimson estate plane with a kite); one ORIGINAL (the single-wing racer) rendered as a car, the path's own known drift; still shadow | (close-out) | 2026-09-24 |
| 6 | pixelbot | castle-town-gate        | 10    | `pixelbot_castle_town_gate_gatehouse` (verified: "the hero is THE GATEHOUSE MASS") | **subject DONE (real visible gain)**: 25 → 104 entries, 104 distinct (same = gate type + the one made thing; 20 types × 59 charms), originals byte-identical; 12 forced shadow renders, 9 rendered (3 failed on Replicate's safety filter, see Flag 5, PixelBot too), 9/9 carried: every new gatehouse reads as written (a terrace gate with a hanging garden on its top and a rain barrel, a market-arch gate with awnings and clay jars, a twin-tower gate with a dovecote and drying fish, a market arch under a carved green-man head with its bell); still shadow | (close-out) | 2026-09-24 |
| 7 | pixelbot | floating-market-canal   | 9     | `pixelbot_floating_market_canal_canal_town` (verified: "the hero is the CANAL MARKET ITSELF: the town's defining built mass") | **subject DONE (real visible gain)**: 25 → 104 entries, 102 distinct (same = built mass + the one thing; 14 new masses, 37 new things), originals byte-identical; 12 forced shadow renders, 12/12 carried: every new town reads as written (a balcony cliff with a reed boat, a boathouse row with a kite line, a sea-wall town with a bread boat, floating gardens with a bamboo pipe, temple steps with tea-drying mats, stacked bridges with painted shutters); the crosswise canal law held in all twelve; still shadow | (close-out) | 2026-09-24 |
| 8 | pixelbot | volcano-forge           | 10    | `pixelbot_volcano_forge_forge` (verified: "the hero is the FORGE'S HEART") | **subject DONE (real visible gain)**: 25 → 105 entries, 105 distinct (same = hall type + the one magical charm; 12 new halls, 37 new charms), originals byte-identical; 12 forced shadow renders, 10/12 carried (two Sonnet drops flagged): the hall reads in every carried one (a waterfall forge behind falling water, a sunken forge with its lava channel, a root-hall gripped by vines, a dome forge under its light shaft, a stair-well forge) and the charm in about six (the stone tortoise carrying the trough, the ember hourglass, the coal garden, the hearth cat, floating coals); still shadow | (close-out) | 2026-09-24 |
| 9 | pixelbot | cozy-farming-life-sim   | 4     | already at production depth: verify only | **verified by count** (195 / 200 / 200 / 200); not reseeded, it is a public-depth path already and was never MVP-25 | | 2026-09-24 |
| 10 | faebot  | acorn-boat-regatta      | 8     | `faebot_regatta_boat_fleet` (verified: "HERO, leads") | **subject DONE (text-unique; visible gain modest)**: 25 → 103 entries, 103 distinct (same = the odd thing + the lead hull; 61 new odd things, 14 new hull kinds), originals byte-identical; 12 forced shadow renders, 12/12 carried: the fleet of little boats on a woodland stream holds in every frame, but the hull KINDS (a thimble tub, a pine-cone galleon, a cherry-stone dinghy, a teasel barge) all render as generic round nutshell boats with a fae aboard, before and after (Flux prior; the originals' acorn caps and walnut shells do the same), and the odd thing reads in about three (a bridge over the course, a flower-laden hull, a lily-strewn finish); still shadow | (close-out) | 2026-09-24 |
| 11 | faebot  | mushroom-apothecary     | 8     | `faebot_mushroom_apothecary_room` (verified: "The ROOM is the hero") | **subject DONE (real visible gain)**: 25 → 100 entries in two grows, 98 distinct (same = room shape + the one odd feature; 16 new shapes, 30 new features), originals byte-identical; 12 forced shadow renders, 12/12 carried: the new room SHAPES read (a gill-tunnel of pleated walls curving away, a lantern room with its whole cap glowing overhead, a nest room woven of root, an attic under the cap's crown, a round chamber with birch-bark shelves); the odd feature reads in about half; still shadow | (close-out) | 2026-09-24 |
| 12 | faebot  | star-charting           | 8     | `faebot_starchart_astronomer` (verified: "THE FAE (painted large and near — the hero)") | **subject DONE (text-unique; 2 of 12 rendered)**: 25 → 104 entries, 101 distinct (same = wing kind + outer garment + build; 4 new wing kinds, 10 new garments, 6 new builds), originals byte-identical; 12 forced shadow renders, 12/12 carried but only 2 delivered (10 failed on Replicate E005 after every retry, originals and new alike): the path file already documents this residual of its flux-2-pro pin ("delivery collapsed to 3 of 13 attempts … shadow-safe, not cron-safe"), so it is the path's known state, not the pool's. The two that rendered read exactly (a compact fae in an oiled leaf-cloth coat over a still pool; a lean bearded fae in a cloak of overlapping fern fronds with braided hair); still shadow | (close-out) | 2026-09-24 |
| 13 | dinobot | amber-forest            | 6     | `dinobot_amber_grove` (verified: the path's hero is "a MATERIAL and its OPTICS", the resident is gated) | **subject DONE (real visible gain)**: 25 → 102 in two grows, 96 distinct (same = grove form + the resin feature; 20 new forms, 21 new features), originals byte-identical; 12 forced shadow renders, 12/12 carried: the resin FEATURE is the picture every time and the new ones read (a dragonfly held mid-flow in a swamp-margin sheet, stalactite drips with trapped insects on a stream bank, fused twin trunks with a resin egg holding a raptor, a spider in a bead on a nursery floor, a fallen-trunk bridge with a resin boulder full of beetles, a ridge-line kauri with a lizard sealed in a flank sheet, a cracked amber boulder with a cone inside dripping into pools); the grove form reads in about half (the giant resident axis often shares the frame); still shadow | (close-out) | 2026-09-24 |
| 14 | dinobot | courtship-display       | 5     | `dinobot_courtship_act` (verified: "the hero behaviour") | **subject DONE (real visible gain)**: 25 → 100 entries, 100 distinct (same = body plan + the act; 12 new body plans, 31 new acts), originals byte-identical; 12 forced shadow renders, 12/12 carried: every new act reads as its own documentary moment (a spinosaur slapping the shallows, a pachycephalosaur stacking pebbles, an iguanodont nudging an egg-shaped stone with a partner watching, a protoceratops dragging a flowering branch inside its scraped ring under storm light, a raptor with one arm-fan raised like a flag) and the new body plans render as dinosaurs; two anatomy misses (a protoceratops given a raptor's tail club; a therizinosaur with a theropod head) are Flux, the originals' sail-backs do the same; still shadow | (close-out) | 2026-09-24 |
| 15 | dinobot | den-and-burrow          | 4     | `dinobot_den_chamber` (verified: "the hero") | **subject DONE (real visible gain)**: 25 → 105 in two grows, 94 distinct (same = chamber type + the light source; 15 new types, 15 new lights; the originals themselves held only 14 distinct pairs), originals byte-identical; 12 forced shadow renders, 12/12 carried: every new chamber reads as its own space with its own light (a hollow-log den with a storm flickering white through the mouth, a lava-tube den with glow-worm starlight, a cave behind a waterfall, a sun-cracked-mud chamber with twin light shafts, a reed-bed tunnel, an ice-bank den with a diffuse blue glow, a boulder-gap den on shed feathers); one render (the boulder gap) drew stone faces in the roof, Flux's own invention; still shadow | (close-out) | 2026-09-24 |
| 16 | dinobot | desert-dunes            | 5     | `dinobot_desert_dunes_biome` (the path's own pool; the other four are the SHARED paleo pools, untouched) | **subject DONE (real visible gain)**: 25 → 101 in three grows, 98 distinct (same = landform + the paleo marker; 20 new landforms, 15 new markers), originals byte-identical; 12 forced shadow renders, 12/12 carried: the new landforms read (a white salt flat with ammonites in its crust, a yardang field with a fossil skull, a banded mesa above the dunes, a sand-buried dead forest under a storm, a cracked clay pan cupped in dune arms); the paleo marker reads in about half; the shared megaflora / phenomenon axes still add their own objects (a mushroom stand, ring clouds), which is the path, not the pool; still shadow | (close-out) | 2026-09-24 |
| 17 | dinobot | snowline-forest         | 5     | `dinobot_snowline_forest_biome` (the path's own pool; `_flora` is its second bespoke pool, the other three are SHARED, untouched) | **subject DONE (real visible gain)**: 25 → 108 in two grows, 106 distinct (same = landform + the one detail, the five skyline refrains kept; 19 new landforms, 15 new details), originals byte-identical; 12 forced shadow renders, 12/12 carried: the new landforms read (a glacier tongue with a sauropod fording its meltwater, a burned stand of black snags on a frozen river, a rime-fogged stand with ice-shattered slabs, a moraine below a glacier snout, a snow bridge arching over a melt-stream, a cirque under an ochre horizon); the refrain's bare ridgelines hold; still shadow | (close-out) | 2026-09-24 |
| 18 | dinobot | undergrowth-scale       | 4     | `dinobot_undergrowth_floor` AND `dinobot_undergrowth_resident` (the floor-as-landscape is the path's identity, the resident is what the picture is of; both grown) | **floor DONE (real visible gain where the feature is a strong noun)**: 25 → 104 in two grows, 103 distinct (same = floor feature + the small detail; 24 new features, 20 new details), originals byte-identical; 12 forced shadow renders, 10/12 carried (two Sonnet drops flagged): a split seed pod as a canyon, a hollow rotten log as an amber-fibred cave, and an undercut bank's root-hair veil (with a snail and the giant's legs above) read outright; a liverwort marsh reads partly; a flake of stone standing as a cliff did not read in either of its two renders (the resident takes the frame). **resident DONE (real visible gain)**: 23 → 108 in two grows, 101 distinct (same = body plan + the action; 12 new plans, 27 new actions), originals byte-identical; 12 forced shadow renders, 12/12 carried: the new residents read as their own animals in their own moments (a hadrosaur hatchling mid-leap over a puddle, a four-winged glider balancing on a mushroom cap, another with its tail ribbons in a bird-like pose, a juvenile theropod under a leaf with an arriving beetle, a pair sunning under a stump, a spined armoured juvenile at a puddle under the giant's legs); two of the new plans rendered as plain birds (the ground-nesting bird-like plan reads as a bird, expected); still shadow | (close-out) | 2026-09-24 |

Order is the doc's suggested order (bespoke and unambiguous first, DinoBot last because of the shared
pools). Open questions for Kevin are in that doc §9 (axis pools too or subject only; is 100 the floor
for a shadow path; go live before or after scaling).

---

## Log

- **2026-09-24 · Track B · dinobot/snowline-forest `biome` · subject DONE (25 → 108; real visible
  gain).** The high conifer forest at the snowline: "<Mesozoic landform> <light>, <what wind and rime
  do to the araucaria>, <snow against bare rock>, <one detail>, <the skyline refrain>", no full stop.
  Same = landform + detail; 19 new landforms (frozen waterfall, wind-scoured plateau, moraine ridge,
  glacier tongue, rime-fog stand, hot-spring clearing, cornice edge, scree slope, krummholz mat,
  ice-crusted lake, snow arch, sun-cupped snowfield, rock spire, burned snowline, wind gap, tarn
  outflow, frost-heave meadow, ice cave mouth, ridge shoulder) and 15 new details (spindrift, blue
  ice glaze, hoar-frost feathers, a crevasse line, alpenglow, frost-cracked rock …); the detail is
  parsed as the LAST one named because rime, melt and cloud are landform flavour in the originals; 83
  appended in two grows, originals byte-identical. 12 forced shadow renders, 12/12 carried, every
  new landform reads. Sheet https://claude.ai/artifact/Eu3meQLSGmwqfwCKLzvnDW. **Track B is closed: all 18
  shadow paths have their subject pool at 100+ distinct entries** (20 pools including undergrowth's
  two and the fleet), every original byte-identical, every path still shadow.
- **2026-09-24 · Track B · dinobot/desert-dunes `biome` · subject DONE (25 → 101; real visible gain).**
  The paleo desert vista: "<landform> <light>, <height in feet>, <texture>, <paleo marker>, <far
  distance in haze>", no full stop. Same = landform + marker; 20 new landforms (yardang field, salt
  flat, rock arch, mesa remnant, playa mirage, seif dune, inselberg, dune lake, blowout bowl, gravel
  reg, dune slack, fossil log-jam, wind-scoured pavement, cinder cone, oasis fringe, canyon mouth,
  ripple sea, sand-buried forest, escarpment foot, dune saddle) and 15 new markers (fossil footprints,
  ammonite bed, petrified stump, rib cage, fossil fern slab, skull in the bank, eggshell, gastroliths,
  trackway …); 76 appended in three grows (the marker parse had to take the LAST match because a
  landform's own words can name a marker), originals byte-identical. 12 forced shadow renders, 12/12
  carried, the new landforms read and the marker about half. Sheet
  https://claude.ai/artifact/5HQEKM1kywhdpzZYp4w3qw.
- **2026-09-24 · Track B · dinobot/den-and-burrow `den_chamber` · subject DONE (25 → 105; real
  visible gain).** The underground space and its one light: "<chamber type>, <walls and ceiling>,
  <the light source and what it does>, <one charm detail>". Same = type + light; 15 new types
  (lava-tube den, cliff-ledge cave, hollow log, sand-scoop pit, sea-cave den, termite-mound chamber,
  ice-bank den, stump-root den, boulder-gap den, reed-bed tunnel, mud-crack chamber, scree chamber,
  waterfall-back cave, clay bowl den, hot-spring den) and 15 new lights (glow-worm ceiling, fungus
  glow, ember light, moonlight shaft, dawn slit, lightning flicker, water-lens light, crack lattice,
  ice glow, firefly drift, waterfall shimmer, steam-lit glow, twin shafts …); 80 appended in two
  grows, originals byte-identical. 12 forced shadow renders, 12/12 carried, every new chamber reads
  with its light. Sheet https://claude.ai/artifact/Xzb4iByXUw2Ab8wrZZBpBL.
- **2026-09-24 · Track B · dinobot/amber-forest `amber_grove` · subject DONE (25 → 102; real visible
  gain).** The living resin forest as a place: "<grove FORM> of <Mesozoic conifer>, <what the resin is
  doing>, <the understory>, seen from <vantage>", no full stop. Same = form + resin feature; 20 new
  forms (ridge line, swamp margin, twin giants, lightning-split trunk, root cathedral, hillside stand,
  fallen bridge trunk, mist hollow, boulder grove, stream-bank giants, sapling nursery, burned
  clearing, cliff-edge stand, ash-dusted grove, lake-shore ring, wind-thrown row, canopy gap,
  cone-fall floor, termite-mound grove, stump field) and 21 new resin features (stalactite drips, an
  insect held mid-flow, sun-through amber, resin icicles, a cracked nodule's crystal interior, a
  resin puddle mirror, a resin-filled hollow like a window, an ant column sticking one by one …);
  77 appended in two grows, originals byte-identical. 12 forced shadow renders, 12/12 carried: the
  resin feature carries every frame and every new one reads; the grove form about half. Sheet
  https://claude.ai/artifact/VSGFXxB3su2qFhiye2q4eQ.
- **2026-09-24 · Track B · dinobot/undergrowth-scale `undergrowth_resident` · subject DONE (23 → 108;
  real visible gain).** The chicken-sized dinosaur of the floor: "A <size> <body plan>, <plumage>,
  bipedal or four-legged, <tail or crest>, <the action mid-motion>, <the attitude>." Same = body plan
  + action; 12 new plans (crested hopper, hadrosaur hatchling, four-winged glider, beaked ornithopod,
  tiny sickle-claw, shrew-sized mammal, needle-snouted theropod, dome-headed juvenile, oviraptorid,
  scansor, iguanodont hatchling, bird-like theropod) and 27 new actions (leaping a puddle, dust
  bathing, stalking a dragonfly, balancing on a mushroom, yawning, chick-following, wading …); 85
  appended in two grows, originals byte-identical. 12 forced shadow renders, 12/12 carried: the new
  residents read as their own animals mid-moment; the bird-like plan renders as a bird, as named.
  Sheet https://claude.ai/artifact/QkBPmPY6yGKH4xnMbKcbbp. undergrowth-scale is closed on both pools.
- **2026-09-24 · Track B · dinobot/undergrowth-scale `undergrowth_floor` · subject DONE (25 → 104;
  real visible gain where the feature is a strong noun).** The forest floor at ankle height as a
  LANDSCAPE: "<floor feature scaled up>, <the light>, <one small crisp detail>". Same = feature +
  detail; 24 new features (pebble desert, bark-chip scree, seed-pod canyon, spider-web bridge, lichen
  plateau, ant highway, rotten-wood cave, sap-drip lake, footprint crater, snail-shell dome, stone-flake
  cliff, leaf-vein delta, grass-stem forest, feather roof, eggshell ruin, root-hair veil …) and 20 new
  details; 79 appended in two grows, originals byte-identical. 12 forced shadow renders, 10/12
  carried: the seed-pod canyon, the rotten-log cave and the root-hair veil read outright, the
  liverwort marsh partly, the stone flake twice lost to the resident. Sheet
  https://claude.ai/artifact/WL8Qn1oCBV8SFUbZhebTaZ.
- **2026-09-24 · Track B · faebot/star-charting `astronomer` · subject DONE (25 → 104; text-unique, 2
  of 12 rendered).** The hero fae: "A <build> grown fae, <face>, <skin>, <hair>, pointed ears, <wings>;
  wearing <outer garment> over <underlayer>, <hands or feet>, <one carried detail>." Same = wing kind
  + outer garment + build; 4 new wing kinds (beetle-shell, lacewing, bee-gauze, seed-wing), 10 new
  garments (feather-down mantle, cobweb-lace overcoat, bramble-leather jacket, fern-frond cloak,
  thistledown jumper …), 6 new builds; 79 appended, one unfilled, originals byte-identical. 12 forced
  shadow renders, 12/12 carried, 2 delivered: the path's flux-2-pro pin trips Replicate E005 on ten
  of twelve after every retry, which the path file itself records as its known residual ("shadow-safe,
  not cron-safe"); both delivered renders read exactly. Sheet
  https://claude.ai/artifact/5EdKR8oWVQSZ9jJsbJiw6s.
- **2026-09-24 · Track B · faebot/mushroom-apothecary `room` · subject DONE (25 → 100; real visible
  gain).** The apothecary room: shape, shelving, counter, ONE odd built feature, way up, opening,
  vantage. Same = shape + odd feature; 16 new shapes (ring gallery, double cap, stair-well, gill-tunnel,
  hollow bulb, attic cap, window bay, cellar, twin-stalk, lantern room, crooked tower, nest room, shell
  spiral, balcony room, sunken pit, dome and drum) and 30 new features (dumb-waiter basket, snail-shell
  steps, seed drawers, acorn-cup lamps, firefly-jar chandelier, root well, sap lantern …); 75 appended
  in two grows, originals byte-identical. 12 forced shadow renders, 12/12 carried: the room shapes
  read, the odd feature about half. Sheet https://claude.ai/artifact/L3btyjU974qYEv7phC7ksU. FaeBot's three
  Track B paths are closed.
- **2026-09-24 · Track B · dinobot/courtship-display `display_act` · subject DONE (25 → 100; real
  visible gain).** The hero behaviour: "<body plan> <verb-ing the act>, <what the anatomy does>,
  <one physical trace>", lower-case, no full stop. Same = body plan + act; 12 new body plans named so
  Flux renders a dinosaur (pachycephalosaur, stegosaur, ankylosaur, ornithomimid, raptor, spinosaur,
  iguanodont, compsognathid, protoceratops, oviraptorid, therizinosaur, ouranosaur) and 31 new acts
  (plate flush, tail-club drum, hop and spin, frill flare, pebble stack, water splash, branch gift,
  feather-flag wave …); 75 appended, five unfilled, originals byte-identical. 12 forced shadow renders,
  12/12 carried, every new act reads as its own moment. Sheet
  https://claude.ai/artifact/GAfZCdLmXhCmsj4aKLfWr7.
- **2026-09-24 · Track B · faebot/acorn-boat-regatta `boat_fleet` · subject DONE (25 → 103;
  text-unique, visible gain modest).** Five or six hulls abreast, each a found thing, then a dash and
  one odd thing. Same = odd thing + lead hull; 61 new odd things (a frog on the poling stone, a
  water-boatman escort, a pollen cloud, tadpole traffic, a newt referee, a stag beetle tug …) and 14
  new hull kinds; 78 appended, two unfilled, originals byte-identical. 12 forced shadow renders,
  12/12 carried: the regatta holds in every frame, the hull kinds render as generic nutshell boats
  before and after (Flux prior, accepted), the odd thing reads in about three. Sheet
  https://claude.ai/artifact/HrsPKB2GHVkKhkZrfts2gV.
- **2026-09-24 · Track B · pixelbot/volcano-forge `forge` · subject DONE (25 → 105; real visible
  gain).** The forge's heart in its hall: "<HALL> WITH THE <CHARM>: <the hall cut into the mountain>,
  <one arched furnace>, <a broad anvil on a stone dais off-centre>, <the hall's structure at uneven
  heights>, <the one magical charm>". Same = hall + charm; 12 new halls (crystal cavern, waterfall,
  bridge, stair-well, root-hall, terrace, dome, twin-furnace, cliff-mouth, pillared undercroft,
  geyser, sunken) and 37 new charms, all warm and wondrous per the path's tone law; 80 appended,
  originals byte-identical. 12 forced shadow renders, 10/12 carried: every hall reads, about six
  charms read outright. Sheet https://claude.ai/artifact/WjkrtpNSjPiyqHDnkajs9o. PixelBot's three
  Track B paths are closed.
- **2026-09-24 · Track B · pixelbot/floating-market-canal `canal_town` · subject DONE (25 → 104; real
  visible gain).** The far-bank built mass: "THE <MASS> AND THE <ONE THING>: <mass as a band across the
  top>, <the crosswise canal law>, <the one thing>, the wall faces between the stalls <dressing>". Same
  = mass + thing; 14 new masses (warehouse row, temple steps, bell tower, boathouse row, mill wheel
  house, balcony cliff, floating gardens, sea-wall town, pagoda quay, timber lock, lantern bridge
  house, crane quay, terrace of stairs, twin towers gate) and 37 new things (all cargo or made things,
  never a sign); 79 appended, one unfilled, originals byte-identical. 12 forced shadow renders, 12/12
  carried, every new one reads and the canal crosses the frame in all twelve. Sheet
  https://claude.ai/artifact/VnxG6qn3WNYHeyf7xjAa9S.
- **2026-09-24 · Track B · pixelbot/castle-town-gate `gatehouse` · subject DONE (25 → 104; real visible
  gain).** The hero mass: "THE <TYPE> AND THE <MADE THING>: <mass turned three-quarters>, <the wall out
  of frame both ways>, <the ground band>, <a dressing>, and <the made thing>", pixel register, the
  path's own laws kept (no heraldry, no jargon, a carved animal only as a head above the arch). Same
  = type + made thing; 12 new types (twin-tower, brick gable, bridge-tower, rock tunnel, stair, roofed,
  lantern tower, market arch, terrace, covered bridge, chapel, mill) and 41 new made things; 79
  appended, one unfilled, originals byte-identical. 12 forced shadow renders, 9 rendered (3 on the
  safety filter), 9/9 carried and every new one reads. Sheet https://claude.ai/artifact/VP6rTZnMhLpm8wMVCgvMeH.
- **2026-09-24 · Track B · steambot/brass-glasshouse `house` · subject DONE (25 → 104; visible gain
  modest).** The glasshouse STRUCTURE: form, the enclosing glass named where the frame crops it, the
  way up, the vantage last. Same = the house form; roster of 80 (twin naves, viaduct house, rotunda,
  pineapple stove, orangery, tufa fernery, railway-cutting span, lake pier, abbey nave, cruciform
  lantern, glass cloister, ravine barrel, moated dome, retractable roof …); 79 appended (one
  unfilled), originals byte-identical. 12 forced shadow renders (10/12 carried): the structural form
  reads in about half; the planting, machinery and light axes carry the rest, as they do for the
  originals. Sheet https://claude.ai/artifact/2679qs4iUo7MwwqhDh6ZYD.
- **2026-09-24 · Track B · brickbot/airfield-biplanes `aircraft` · subject DONE (25 → 105).** The hero
  biplane: silhouette + colour + civil ROLE + engine + cockpits + "smooth unmarked flanks with one
  painted <shape> and a round emblem of <pictorial>" + one LEGO gadget + stacked-plate wings. Same =
  the role; roster of 81 civil roles each with its signature gadget (air ambulance stretcher tray,
  skywriter smoke canister, bee-keeper hive crates, lamp-lighter lantern rack …); 80 appended in one
  run with 0 rejections, originals byte-identical. 12 forced shadow renders (12/12 carried): eleven
  brick biplanes in their written colours doing their written jobs; the one miss is an original
  (the single-wing racer rendered as a car). Sheet https://claude.ai/artifact/271hKR38p4mn3166Bw2Lxu.
- **2026-09-24 · Track B · mangabot/game-center-arcade `room` · subject DONE (25 → 104).** The arcade
  floor as its own place: a fixed composition LOCK ("Two or three tall machines stand SO CLOSE …")
  that the config prepends, then Sonnet's tail: the machine dressing, ONE spatial feature with a
  low-ceiling clause, the dark polished floor doubling it, one placed detail. Same = the room feature;
  roster of 87 (escalator, photo-booth row, medal pushers, mirror ceiling, sprinkler pipes, shoe
  lockers, DJ booth, four-sided crane island …); 79 appended, one unfilled, originals byte-identical.
  12 forced shadow renders: 5 failed on Replicate's safety filter (Flag 5, the path's own issue, hits
  originals too); the 7 that rendered carry the machines and glass in every frame and the room
  feature in the originals' partial way. Sheet https://claude.ai/artifact/5o2LDwbqRnrvLYDTUfjQKr.
- **2026-09-24 · Track B · tinybot/snow-globe-world `worlds` · subject DONE (25 → 104).** The world
  inside the globe, "A/An <place> <verb> …; …; … <one thing caught mid-act>", 50-80 words, the place's
  own drifting particle where it is not snow. Same = the world TYPE; roster of 93 real places
  (lighthouse headland, polder windmills, tea terraces, fjord ferry, subway platform, oil platform,
  sluice camp, tidal causeway abbey, clock-tower square, houseboat row, aqueduct, bee yard …); 79
  appended in one `--grow 80` (one unfilled), originals byte-identical; six of the originals carry a
  stray de-lettering clause that the examples strip and new entries ban. 12 forced shadow renders (8
  new + 4 originals, 12/12 carried): every new world reads as its own place in the originals'
  register; two renders drew the whole globe on a base (the path's own failure mode, the pool never
  names the glass). Sheet https://claude.ai/artifact/8oc82ziUopkUgYPtJrhVP4.
- **2026-09-24 · faebot/dryad-portrait `forest_backdrop` · DONE (text-unique; visible gain modest).**
  String entries "<Forest type> behind her with painted <texture> softly out-of-focus, painted …,
  tactile <foreground> anchoring her". 26 → 196 distinct (same = forest type + first texture via the
  queen biome's rules, meadows and edges removed), 15 → 34 forest types, 8 → 30 textures, 170
  rewrites, 26 originals kept, 4 unfilled. Pairs on the same eight slots, 8/8 → 7/8 carried: the
  backdrop is a soft-focus axis behind the portrait hero and reads about half the time either way;
  what reads after (toadstools, aspen trunks, a waterfall) is new to the path. Pairs
  https://claude.ai/artifact/Bxa2xLsVi2cQdnyF5yyC1T. Track A's FaeBot pools are all closed.
- **2026-09-24 · dragonbot/castle `castle_biome` · DONE (text-unique; visible gain modest).** String
  entries "<Biome words>, <first hero feature>, <second feature>, <light> …" (the castle is another
  axis, never named). 50 → 168 distinct (same = biome + first hero feature), 36 biomes × 30 hero
  features, 118 rewrites, 50 originals kept, 0 unfilled. The first full run rejected half its
  candidates on a parser that read the moor's own heather as the hero and "hidden glade of ancient
  cedars" as the cedar forest (fixed: owned words, earliest match, hero spans skipped, the biome's
  own "walls" exempt from the castle ban). Pairs on the same eight slots, 7/8 → 8/8 carried: the
  castle fills the frame and the biome shows as a foreground strip in ~3 of 8 either way (barley,
  golden birches, a plunge-pool before; rose banks with blossom and lavender, daisies, a lavender
  field, dark red-leaved yews after). Pairs https://claude.ai/artifact/S2CudVACt69TRxq818Uoer.
- **2026-09-24 · starbot/space-femme `phenomenon` · DONE (text-unique; visible gain nil).** String
  entries "<Phenomenon> <verb> <placement in frame>, <trans-colour detail>, <impact>". 40 → 196
  distinct (same = phenomenon + placement), 21 → 46 phenomena from a roster of 48 real or canon
  sky events, 160 rewrites, 40 originals kept. Two parser lessons cost a resume each (rule order vs
  the leading axis; the phenomenon's own words parsed as the placement) and a homogeneous retry batch
  came back reordered until `RESEED_BATCH=1`. Pairs on the same eight slots, 6/8 → 8/8 carried: the
  phenomenon axis is invisible on space-femme, before and after; the femme is the hero and the
  backdrop is generic neon energy whatever the entry names (one spiral disc could pass for the
  ice-crystal halo). Pairs https://claude.ai/artifact/M2YACVZhXK7tCMLxeutw1B.
- **2026-09-24 · mangabot/isekai-fantasy `scene_type` · DONE (text-unique; visible gain modest; flag 4).**
  String entries "<Category> composition, <anime scene with a canon motif>, <energy note>". 127 → 195
  distinct (same = category + scene motif), 11 categories kept at their weights, 68 rewrites, 5
  unfilled left as originals; the brief forbids adding other canon motifs (a first pass put a rune
  circle in every magic-cast entry). Pairs on the same eight slots: the entry reached the final prompt
  4/8 before and 7/8 after, and read in the picture ~3/8 either way (a palms-to-the-ground earth
  spell, an academy glasshouse, a guild desk; guild halls in the before set), because the path's
  template composites ~8 axes into one prompt and the polish mashes them (a harpy encounter came out
  a moonlit river, a chain-whip duel a cauldron). Nothing regressed; the lever is the path (flag 4).
  Pairs https://claude.ai/artifact/2vVJ8ED3EfKYAXnMNKxAMA.
- **2026-09-24 · faebot/queen-of-the-forest `posed_setting` · DONE (real visible gain, self-reviewed).**
  String entries "<Posed/Standing/Seated …> <natural spot>, <body>, <hands>, <gown> …". 29 → 192
  distinct (same = natural spot + pose), spots 21 → 37 (heather bank, pine-needle floor, root
  buttress, willow pool, birch glade, house-sized boulder, plunge-pool rim, stepping stones …), poses
  10 → 12, 163 rewrites, 8 unfilled slots kept as originals. Pairs on the same eight slots, 16/16
  carried: all eight after-renders show their written spot and pose; the before set was 7/8 faithful
  but drew from 29 ideas (a tree-archway, a grotto mouth, a lily pond, a mossy boulder recur). Pairs
  https://claude.ai/artifact/LdEmpUvD5fHjzDFFuKMh1y.
- **2026-09-24 · faebot/queen-of-the-forest `forest_biome` · DONE (real visible gain, self-reviewed).**
  String entries "<forest type> with <signature texture>, <mid-tier>, <floor>, <light>". 26 → 197
  distinct (same = forest type + first texture), 11 → 35 forest types, 26 originals kept, 3 unfilled
  slots left as originals. Pairs on the same eight slots, 15/16 carried: before, two renders were the
  same cherry-blossom tree and a fern grotto and a wildflower meadow both came out as lily ponds;
  after, an autumn maple grove, a waterfall glade, a golden larch glade in autumn, a violet bluebell
  wood and an oak-trunk throne each read as written. Streams and meadows still lose to the path's
  tree-throne prior about half the time (accepted Flux behaviour). Pairs
  https://claude.ai/artifact/8Lm2f2DbqWvGGxiSKRtJRp.
- **2026-09-24 · bloombot/desert-bloom `bloom_explosion` · DONE (text-unique; visible gain nil).** Carpet
  factory: 51 → 196 distinct line-ups, 19 → 103 real desert species (cactus and agave blooms
  included), 51 originals kept, 2 unfilled kept as originals. Pairs 12/16 carried (two Sonnet drops on
  each side, flagged by the harness): the path paints pink whatever the entry names, before and after
  (a "blazing red crevice carpet" rendered a pink rose tree, a "yellow superbloom carpet" a pink
  canyon wall; one fiery-orange entry tilted orange). The hue and species words of this pool were not
  reaching the picture before this work either, so nothing regressed; the text is unique and of the
  same kind. Not chased (accepted Flux limit, and the carpet is an axis under the path's hero bloom).
  Pairs https://claude.ai/artifact/RvUZxeKESPPm43GPWWPrCu.
- **2026-09-24 · yumbot/japanese-festival `festival_scene_type` · DONE on the second pass (self-reviewed).**
  "Five kawaii foods <verb> <arrangement> <perch> — five poses". ~55 real perch families cannot make
  200 distinct entries, so "same" = perch family + how the cluster sits on it (Flag 3). 97 → 199
  distinct, 82 → 100 families, 97 originals kept. First pairs were weak: obscure perches (a kendama
  pile, a kokeshi row, a senbei tin) never rendered and "half-hidden behind" hid the foods; second
  pass regenerated 45 rewrites onto strong-prior perches with six ON/AT arrangements. Second pairs:
  candy-apple tray, mikoshi beam, kakigori counter, cotton-candy cart, ramune ice tub, tea-house
  tatami all read in lantern-lit matsuri scenes; two renders came out as flat sticker sheets, which
  is the bot-wide look register, not this pool. Pairs: first
  https://claude.ai/artifact/6Q5sCHkcapP6iTWxmPn1Rv, second https://claude.ai/artifact/Y9Jq6SRRThX3ZLxH1gtmLb.
- **2026-09-24 · bloombot/flower-fantasy `floor_carpet` · DONE (modest visible gain by design).** Carpet
  factory (species-set method): 30 → 131 distinct line-ups, 27 → 78 real pastel meadow species, 30
  originals kept. Pairs 14/16 carried (two Sonnet drops flagged): the carpet lies under a giant surreal
  hero bloom, so only its colour family shows (yellows and pinks clearly, blues faintly), never the
  species. Pairs https://claude.ai/artifact/89gNTLrzJdJnFg7tAFsKWk.
- **2026-09-24 · earthbot/hidden-corner `hidden_corner_subject` · DONE on the second pass (self-reviewed).**
  String entries "A <pocket> <where it hides> — <lush details>". 70 → 199 distinct (same = pocket type +
  habitat + host feature), 12 pocket types across 12 habitats with hosts owned per type, 70 originals
  kept. Five runs: the first three left slots unfilled (the type × habitat × host space was smaller
  than the pool for tide pools and log nooks; the host parser read "root pocket" as a root plate); the
  fourth filled everything and FAILED my render review, because I had given every rewrite a water note
  (a seep, a pool, droplets) as flavour and five of eight after-renders came back as the same mossy
  waterfall gorge, a visible regression against the originals' oak, sunset creek, tide pools and flower
  cove. Fifth run: water notes only on water pockets, a floor note on dry ones, "water in a dry
  pocket" rejected, log hosts kept to log nooks and root pockets; 71 sound rewrites kept, 59
  regenerated. Second pairs on the same slots: a sandstone alcove under a ledge, a creek under bank
  roots, a root-arch tunnel, a cave pool with white flowers, a fungi-strewn log nook, a mossy hollow,
  a boreal bog pool with spruce, a sunlit glade. Water still appears in most (the path's own axes add
  it; half the pocket types are water), but no two look alike. Lesson in the skill: flavour follows
  the entry's own kind; review the after-set for sameness, not just fidelity. Pairs: first pass
  https://claude.ai/artifact/1TFknEsNuF5ZpNCMFgVhJS, second https://claude.ai/artifact/2Z1qMdFwwnkHM5ZBNmxdMQ,
  proposal https://claude.ai/artifact/TKWfBQBcgxbL1LUrdXzph2.
- **2026-09-24 · faebot foreground_anchor ×3 · DONE as text-unique; the axis is invisible.** Shared
  factory (same = anchor kind + position in frame, ~65 real forest anchors, nothing glowing). All three
  pools rewritten (kinds 25 → 68, 17 → 66, 20 → 69), 16 + 16 paired renders on enchanted-vista and
  forest-fairy-scene with the entry in the prompt 31 of 32 times, and the anchor cannot be picked out
  in any of them: the vista's hero / biome / light and the fairy portrait fill the frame; a thistle
  head or an owl feather at the edge never reads. The scaling doc's rule held: a repeated axis is
  invisible, a repeated subject is the complaint. No dryad renders spent. Pairs
  https://claude.ai/artifact/UNCzN3UM8WLECQLLJ7Enoe, https://claude.ai/artifact/6biQPY43Bk1ED4G9p2P31q.
- **2026-09-23 · earthbot/national-parks `national_parks_subject` · DONE (self-reviewed).** Object
  entries, no park / landmark / vantage names by recipe (the geology carries the identity). 76 → 189
  distinct (same = geological province + formation + POV), 17 provinces × ~95 formations each with an
  explicit key regex (ordered-keyword checks were too brittle: Sonnet reorders adjectives), 76
  originals kept. Three starts: the first two burned ~50 calls each on parse mismatches (a Mojave
  badlands entry also says "badlands", which the Plains rule claimed) and a 52-word cap the originals
  themselves exceed. Pairs (8 + 8, 16/16 carried): before was two Cascade caldera rims, two glaciers
  and a Colorado gorge of eight; after is an Arctic headwall, Badlands clay spires, an Alaskan spire
  wall and a sawgrass river, clearly, plus three partials where Flux's prior won (the fan-palm oasis
  became a canyon, the Atlantic granite coast a peak over a cloud sea, the Great Basin dune crest a snow
  ridge). Pairs https://claude.ai/artifact/BGvFHLFXsVsgXUB8bs3X6V, proposal
  https://claude.ai/artifact/SoMhJHNKPCHZdv5t9QFYE6.
- **2026-09-23 · earthbot/asia-landscape `asia_landscape_subject` · DONE (self-reviewed).** Landmark
  factory with the recipe's cultural bans (no temples / torii / pagodas / stupas / statues / prayer
  flags / lanterns / monks; no rice terraces or agriculture). 72 → 200 distinct (same = habitat + light
  moment), 45 → 115 real places across the recipe's 14 composition groups (Fuji lakes, Huangshan cloud
  seas, karst rivers and bays, pillar forests, cedar and bamboo forests, sakura, Hokkaido and Jilin
  winter, travertine lakes, the Tibetan plateau, Gobi and Taklamakan, volcanoes, gorges), 12 light
  moments, 72 originals kept. Pairs (8 + 8, 16/16 carried): before had Halong Bay twice, Yakushima,
  Arashiyama, Zhangjiajie, Huangshan, Yoshino and Ijen; after is Fuji over Ashinoko, the Kali Gandaki
  gorge, the Hoh Xil plateau, Fuji with sakura at Kawaguchiko, Sanqingshan's pillars in a cloud sea,
  Batur's caldera, and two Flux drifts (Kushiro's frozen marsh came back as a marsh stream under a
  rainbow; Hokkaido's boreal forest as a mountain river with autumn trees). Pairs
  https://claude.ai/artifact/74QwkBtVbteW4ScQ7rK8UZ, proposal https://claude.ai/artifact/EGc1otpKFWWKoGLCnpnszc.
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
