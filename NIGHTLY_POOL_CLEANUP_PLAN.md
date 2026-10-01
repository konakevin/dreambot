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

## Method (location spots): two passes, `scripts/clean-location-pools.js`

Kevin 2026-09-30, after batch 1's rewrites drifted: "scan originals first, deactivate dupes in packed pools, but also
we should backfill any pools that are severely culled ... first deactivate, 2nd analyze pool size and quality and
backfill as necessary"; "do not let weak seeds or drift". The rewrite-in-place method (and its tool) is retired.

1. **Cull (`--pass cull`).** Sonnet (job `reseed`) grades every active spot against the CARD's concept (name,
   sub-regions, must-include, architecture as examples), never against the pool, which can have drifted itself:
   `off_card` (a different destination or theme than someone who picked the card wants; neighbouring quarters of the
   same place and every real example of a themed card are ON it), `not_setting` (a close-up of an object, carving,
   plaque or inscription, or text), `weak` (generic, garbled, unrenderable, or a camera direction instead of a place).
   Then the judge groups same-idea spots among the survivors; "naming a different place doesn't make a different idea
   when the renders look the same". Every failure and every group member but the best is DEACTIVATED
   (`is_active = false`; reversible).
2. **Backfill (`--pass backfill`).** Only a severely culled pool (under 60, or under half its on-card size) is refilled,
   to 70% of its on-card size (at least 60), at the scales it lost, spread across subjects (at most two per landmark).
   Every candidate passes the same grade (S/A only) and a duplicate read against the kept pool; a pool stays short
   rather than take a weak spot.
3. **Apply.** One migration per batch carries both passes (guarded deactivations + inserts, flags cast = non-wide,
   scene-only = non-intimate), so a pool is never live culled without its backfill; then
   `scripts/check-location-health.ts` and QA renders on the most-changed cards.

Calibration (3 test cards, 2026-09-30): the first grader read names literally (culled Monaco's own gardens from Monte
Carlo, every named circuit's garage from Race Track Garage); after the traveller rule: Monte Carlo 90 → 36 kept + 24
added, Race Track Garage 303 → 159 kept, no backfill (it was only near-copies), Gladiator Arena 222 → 10 kept (204 were
general Rome, not arenas) + 48 arena spots across El Djem, Pompeii, Arles, Capua, Pula, Verona, Nîmes and the Colosseum.

**Open (Kevin's call):** ~2,500 active spots are the June generic biome landscapes (`gen-landscape-spots.js`, ~50 per
card on 48 real cards, unnamed by design, for scene-only variety). The grader culls them as weak; deactivating them is
the recommendation (a Prague dream should show Prague), pending Kevin.

Pilot (Celestial, 53 spots): the first read found 3 groups / 6 duplicates (ringed planet mirrored in a lake; ringed
planet low over a terrace or gazebo; Jupiter's storm eye from an observatory); a second read found 2 more (the orrery vs
the cabinet of glass planets) and one rewrite that landed next to an existing idea. Hence the rounds.

## Phases

| #   | Phase                                                                                                               | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Audit location spots, every picker place card (read-only): duplicates per card                                      | **done**: 174 of 175 cards (Tahiti's judge reply failed to parse; redone in phase 2), 24,085 spots, **3,695 duplicates (15.3%)**, a floor (a second read finds more). Median card 15.2%; 59 cards over 20%, 64 at 10-20%, 51 under 10%, none at 0. Worst: Catacombs 44%, Ancient Rome 42%, Haleiwa 40%, Sahara Dunes 37%, Newport 36%, Victorian London 36%, Renaissance Venice 35%. Spot-checked: real duplicates ("Arch of Titus carved relief passageway on Via Sacra" vs "Arch of Titus relief-carved passage on Sacred Way"; five Port-Mahon reliefs in Catacombs), not over-calls |
| 2   | Clean location spots: batches by duplication rate, highest first; migrations + health check + QA sample             | batch 1 (20 worst cards) generated, **NOT applied**: 19 cards, 861 rewrites, but the sample showed drift (Gladiator Arena got Rome's city gates, Monte Carlo got Nice's Baie des Anges) and 52 rewrites that zoomed into a detail or inscription. Tool fixed (step 3b + scope rules + a parser that survives prose brackets, which failed Race Track Garage); batch 1 is re-run with it before anything is applied                                                                                                                                                                      |
| 3   | Shared scene pools: lexical prefilter shortlists within each pool, LLM judge inside the shortlists, rewrite, verify | to build                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 4   | Quality pass: grade entries (S / A / B) against their pool, rewrite the B's with the same rules                     | after 2-3; also scans the ORIGINAL spots for drift and non-settings (Kevin: "may need to scan the pools again")                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 5   | Holiday pools: same method, after the Fall / Halloween window closes                                                | later                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Safety

- LLM work only until apply; DB writes are small guarded migrations. No render load except the QA sample (headroom
  checked, concurrency 3).
- Every batch keeps its before-state (JSON) so a card can be restored; the daily off-site backup holds it too.
- `scripts/check-location-health.ts` must pass (no new ERRORs) after each batch.
- The nightly engine is not changed by this work: only pool text.

## Results

(Filled in per phase.)
