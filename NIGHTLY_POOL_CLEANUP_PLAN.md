# Nightly pool cleanup: distinct, high-quality seeds everywhere

Status of record. Kevin 2026-09-30: "run a quick audit on the location cards and see how commonplace duplication is
... i'd love to clean them up - all of them (huge task i know) and get the nightly pools in good, clean condition
with good variety and high quality seeds all around" → "can we plan that out and do it".

## What "clean" means

- **Distinct:** no two entries in a pool are the same idea. Judged by an LLM, never by word overlap alone
  (`SEED_DIVERSITY_CHARTER.md` §5b: the lexical measure in `scripts/lib/ideaSimilarity.js` misses adjective swaps and
  over-merges shared formats; it is the free prefilter and CI tripwire, not the judge). Kevin: "ensure actual
  uniqueness, and not a weak regex checker".
- **Rewrite, never delete** (Kevin, charter): a duplicate becomes a new idea in the pool's own voice, so no pool ends
  shallower than it started.
- **High quality:** every entry is specific, renderable from its words, and true to its pool (phase 4).

## The pools (live counts 2026-09-30)

| Pool                                                                           | Rows                                        | Unit judged                       | Tool                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------- | --------------------------------- | ------------------------------------------ |
| Location spots (`location_iconic_spots`)                                       | 26,210 active across 175 picker place cards | one card's whole pool (50-300)    | `scripts/clean-location-pools.js`          |
| Shared scenes (`dual_scenarios`, `single_scenarios`; goofy / elegant / active) | 13,168 live                                 | per card or category tag, chunked | phase 3 tool (to build)                    |
| Holiday scenes (holiday pool rows)                                             | ~5,840                                      | per holiday pool                  | phase 5, after the Fall / Halloween window |

## Method (location spots): `scripts/clean-location-pools.js`, four steps (Kevin, 2026-09-30)

A first version auto-culled "weak" and "off-card" spots and made wrong calls (St. Vitus Cathedral "weak", the Wanaka
lavender farms he added "off-card"). Kevin then agreed four steps; only DRAWABLE spots are considered (pure_scene or
cast eligible; ~1,677 unnamed landscapes already failed the 2026-08-23 "postcard of THIS place" re-audit and are
retired in practice: city cards lost all 50, nature cards kept most, the retired ones there are macro close-ups).

1. **Duplicates, automatic.** The judge groups same-idea spots ("naming a different place doesn't make a different
   idea when the renders look the same"), then a SECOND pair-by-pair check must agree before a spot goes; the group read
   alone was wrong about 1 in 10 (it paired the Arch of Constantine with the Arch of Janus). Conservative by design:
   pairs the second check doesn't confirm stay. Audit: 40 of 40 random confirmed pairs were real repeats.
2. **Object spots, reviewed.** Only a thing or surface instead of a place is flagged (a texture macro, a single object,
   text); every place stays however small (alcoves, grottoes, graves, corridors), and a monument big enough to stand
   beside is a landmark. Kevin: "let's be careful on this one, i don't want to just blindly deactivate all closeup
   seeds". Every flag is reviewed by hand; the rescued ones go in a `--keep` file. Test (7 cards): 33 flags, 27 culled,
   6 kept (Trajan's Column, two graves, a garden well, an armillary sphere, a sinter shelf).
3. **Drift, never automatic.** Each card gets an off-card share; cards over 40% (Gladiator Arena: 60%, general Rome)
   are fixed case by case with Kevin.
4. **Backfill** only pools that end up under 60, with new spots that grade S/A against the card and pass a duplicate
   read; a pool stays short rather than take a weak spot.

Apply: one migration per batch (guarded deactivations + inserts, flags cast = non-wide, scene-only = non-intimate),
then `scripts/check-location-health.ts`. Deactivated = `is_active = false`, reversible.

Follow-up found on the way: the romance top-up (mig 614) added Tihany, Wanaka, Sequim and Furano lavender spots without
adding them to Lavender Fields' `sub_regions`, so the card's own definition lags its pool.

Pilot (Celestial, 53 spots): the first read found 3 groups / 6 duplicates (ringed planet mirrored in a lake; ringed
planet low over a terrace or gazebo; Jupiter's storm eye from an observatory); a second read found 2 more (the orrery vs
the cabinet of glass planets) and one rewrite that landed next to an existing idea. Hence the rounds.

## Phases

| #   | Phase                                                                                                                                                                                                            | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Audit location spots, every picker place card (read-only): duplicates per card                                                                                                                                   | **done**: 174 of 175 cards (Tahiti's judge reply failed to parse; redone in phase 2), 24,085 spots, **3,695 duplicates (15.3%)**, a floor (a second read finds more). Median card 15.2%; 59 cards over 20%, 64 at 10-20%, 51 under 10%, none at 0. Worst: Catacombs 44%, Ancient Rome 42%, Haleiwa 40%, Sahara Dunes 37%, Newport 36%, Victorian London 36%, Renaissance Venice 35%. Spot-checked: real duplicates ("Arch of Titus carved relief passageway on Via Sacra" vs "Arch of Titus relief-carved passage on Sacred Way"; five Port-Mahon reliefs in Catacombs), not over-calls |
| 2   | Clean location spots: batches by duplication rate, highest first; migrations + health check + QA sample                                                                                                          | **done 2026-09-30, mig 633**: 175 cards, 2,343 duplicates (pair-checked) + 250 object spots deactivated (578 flagged, 328 kept on review; Kevin found the first cut too severe, "faebot for example only had 5-6 survive", the softer line keeps whole objects that belong to the card), 120 S/A spots added to 26 pools under 60 (14 weak additions dropped by hand). Drawable on the 175 cards 20,921 → 18,448; health check: no new errors. Drift cards: concepts mig 632, repair next                                                                                               |
| 3   | Shared scene pools (dual / single scenarios; goofy, elegant, active): duplicates judged per pool and category, pair-checked, disabled; plus the 15 unreachable rows (no card or category tag) tagged or disabled | **done 2026-09-30, mig 639**: 171 groups, 13,168 scenarios; 1,035 confirmed duplicates disabled (7.9%; the judge proposed 2,279 more the pair check did not confirm, so they stay). Audit: 40 of 40 random confirmed pairs were the same dream. The 14 untagged couple mounts tagged by setting (the 15th was a duplicate). Health check: no errors, only the snow-word warning (phase 4)                                                                                                                                                                                               |
| 4   | Quality pass: weak and drifted seeds, case by case (never auto-culled); and the 42 snow-word spots on warm cards reworded so snow is not the subject ("Mount Kenya above the savanna", Kevin 2026-09-30)         | **snow words done 2026-09-30, mig 640**: 22 warm-card spots reworded (snow was scenery or a name: Mount Kenya behind the savanna, Berchtesgaden's chalets, the toy shop's snow globes); the 20 left on the warning are real snow places, kept on purpose. **Card definitions done 2026-09-30, mig 641**: the 100 picker place cards with empty `sub_regions` / `must_include` defined from each card's own SUBJECT_RULE (never its pool), reviewed card by card (people and clothing lines dropped, wrong facts fixed, Wild West held to 1860s-1890s); 0 place cards left empty (`scripts/gen-card-concepts.js`). **Drift (step 2) done 2026-10-01, migs 642/643/645**: all 175 cards checked against their definitions; a first read flagged 5,714, a keep-by-default second read confirmed 2,203, every one reviewed by hand; 2,145 off (neighbour towns on beach cards, Civil War memorials on Epic Battlefield, Swiss landmarks on Alpine Chalet, red-rock parks on Cattle Ranch, LA sightseeing on Red Carpet, Stone Age monuments on Prehistoric, a toy town on the interior-only Toy Shop); five definitions widened where the card's rule invited what they shut out (mig 642: Cancun + Tulum/Isla Mujeres, Haleiwa's surf breaks, Hanalei's north shore, Feudal Japan's ukiyo-e landscapes, Tahiti's islands); 752 new spots on 48 cards (genre/era cards with `--themed` kinds of places), each read, ~110 cut. Render test: 8 repaired cards self + scene, 13 of 16 on brand; the 2 misses traced to spots and fixed (mig 645), re-render on brand. **Camera lines (step 3) done, mig 644**: 218 reworded into place phrasing (4 more were switched off by 643); 5 camera openers remain. Left for later: Alpine Chalet 48, Private Jet 34 (the writer ran out of new ideas rather than pad); Robot City 23 and Haunted Cathedral 46 are outside this sweep. Franchise spots on High Fantasy left as they are (Kevin)                                                                                                                                                                                                                                                                                                  | after 2-3; also scans the ORIGINAL spots for drift and non-settings (Kevin: "may need to scan the pools again") |
| 5   | Holiday pools: same method (Kevin 2026-10-01: run it on fall + Halloween now, Christmas next) | **fall + Halloween done 2026-10-01, migs 653-655**: 7,714 live rows in 397 sub-themes (couples, solos, scene-only). Duplicates (`scripts/clean-scenario-pools.js --holidays fall,halloween`, per sub-theme, pair-checked): 1,051 off, 40/40 sample right. Fit (`scripts/check-holiday-fit.js`, two reads + hand review): 3 off (winter solstice snow / northern lights on Halloween), 2 reworded (candy canes, a gingerbread house). Outfits: every holiday solo row was gender 'any', so a man drew "a shredded ivory wedding dress"; all 6,151 'any' solo rows read, 947 tagged female, 50 male (mig 653, `scripts/tag-scenario-gender.js`); 39 couple lines that named a gown or dress without saying who wears it rewritten "She in ..., he in ..." (`scripts/fix-couple-attire.js`); 25 mad-scientist goggles pushed up off the eyes (mig 654). Refill (`scripts/fill-holiday-themes.js`): 25 sub-themes left under 8 back to 8-10, 96 new rows, each read (14 Día de Muertos rows written onto other themes dropped; one theme redone after its rows lost the lake) (mig 655). Every fall / Halloween sub-theme now has 8 or more live rows. Draws pick a main pool at equal odds, then a row (pickHoliday), so the depth that matters is the main pool's: every couple / solo main pool still has 50+ rows (largest drop 29%), the Oct 31 day-of pool 160 -> 149 couple / 145 solo / 178 scenes. Render test (`qa-holiday-renders.js --sub-theme`, Kevin's account, 6 renders: 4 couples, 2 solos): 6/6 swaps held, every man in menswear, 3 drew new rows; harvest-moon lake, ghost manor and mad-scientist lab on theme; bayou and monster-hotel couples rendered on a plain backdrop (the accepted couple limit, §12 of NIGHTLY_NO_PLAIN_RENDERS_PLAN.md), the witch's cottage read as a workshop. In-window couples wear the outfit roll (autumn styles), not costumes: by design since the garment axis (mig 563), costumes are the Oct 31 day-of |

## Open items (tracker, 2026-10-01; resume here)

Done first: **gendered card wardrobes**, LIVE 2026-10-01 (`CARD_WARDROBE_GENDER_PLAN.md`, migs 646-649). Then:

1. ~~Pool leftovers~~ done 2026-10-01: Alpine Chalet 48 -> 55 and Private Jet 34 -> 42 (mig 650; both single small
   spaces, kept short rather than padded with props); the last 7 camera-direction spots reworded (mig 651).
2. ~~Cattle Ranch rule~~ done 2026-10-01 (mig 652): its SUBJECT_RULE named a modern ranch (steel squeeze chutes,
   caliche roads), and Monument Valley's said "Navajo Tribal Park"; both rewritten to the 1880s frontier, renders checked.
3. ~~Phase 5, fall + Halloween~~ done 2026-10-01 (migs 653-655). Next: Christmas (and the other holidays) with the
   same tools, after talking it through with Kevin.
4. ~~Couple plain-backdrop follow-up~~ closed 2026-10-01: ~1 in 10 production couples, all in watercolour / ink looks;
   seed luck in a paper-vignette style, not the engine; accepted per Kevin (`NIGHTLY_NO_PLAIN_RENDERS_PLAN.md` §12).
5. 1.11.0 go-live steps (`SCENARIO_LOCATION_SCOPE.md` runbook) once Kevin says the build is live.
6. Selfie skip-rate re-measure around 2026-10-14.
7. Latent, only if `engine_config.nightly_garment_roll` is ever switched off: a holiday COUPLE drawn by the scene-type
   roll would then get the row's attire as its wardrobe anchor for any couple, so a same-gender couple on a "She in ...,
   he in ..." row would put one person in the other's outfit. With the roll on (live) the row's attire is only colour /
   texture inspiration ("never its garments", seen in the 2026-10-01 QA brief) and the embodied path already passes it
   to a woman + man couple only (nightly-dreams ~2965), so nothing to do now.

## Safety

- LLM work only until apply; DB writes are small guarded migrations. No render load except the QA sample (headroom
  checked, concurrency 3).
- Every batch keeps its before-state (JSON) so a card can be restored; the daily off-site backup holds it too.
- `scripts/check-location-health.ts` must pass (no new ERRORs) after each batch.
- The nightly engine is not changed by this work: only pool text.

## Results

(Filled in per phase.)
