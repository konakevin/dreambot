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
| 4   | Quality pass: weak and drifted seeds, case by case (never auto-culled); and the 42 snow-word spots on warm cards reworded so snow is not the subject ("Mount Kenya above the savanna", Kevin 2026-09-30)         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | after 2-3; also scans the ORIGINAL spots for drift and non-settings (Kevin: "may need to scan the pools again") |
| 5   | Holiday pools: same method, after the Fall / Halloween window closes                                                                                                                                             | later                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Safety

- LLM work only until apply; DB writes are small guarded migrations. No render load except the QA sample (headroom
  checked, concurrency 3).
- Every batch keeps its before-state (JSON) so a card can be restored; the daily off-site backup holds it too.
- `scripts/check-location-health.ts` must pass (no new ERRORs) after each batch.
- The nightly engine is not changed by this work: only pool text.

## Results

(Filled in per phase.)
