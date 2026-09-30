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
| Location spots (`location_iconic_spots`)                                       | 26,210 active across 175 picker place cards | one card's whole pool (50-300)    | `scripts/dedupe-location-spots.js`         |
| Shared scenes (`dual_scenarios`, `single_scenarios`; goofy / elegant / active) | 13,168 live                                 | per card or category tag, chunked | phase 3 tool (to build)                    |
| Holiday scenes (holiday pool rows)                                             | ~5,840                                      | per holiday pool                  | phase 5, after the Fall / Halloween window |

## Method (location spots)

1. **Judge.** Sonnet (job `reseed`) reads a card's whole active pool and groups spots a render would show as the same
   picture. Per-card basis sentence: real places treat different features or views of one landmark as different ideas;
   imagined worlds treat "same main subject, same arrangement" as the same idea, and sharing the world's signature
   element is not sameness. Conservative by instruction (the judge can over-call on single-format pools, charter #21).
2. **Rewrite.** Every duplicate after the kept one becomes a new spot at the same scale (so cast / scene eligibility is
   unchanged): real cards = a different specific named place in the card's sub-regions; imagined worlds = a new
   look-based idea (no scale, physics or text). A rewrite that lexically matches any other entry is rejected.
3. **Verify.** Re-judge; any group the judge still names (a rewrite that landed on another idea, or originals it only
   noticed on a second read) is rewritten again; 3 rounds max, then a clean read is the acceptance check.
4. **Apply.** One guarded migration per batch (`UPDATE ... WHERE id = ... AND spot_text = <old>`), a JSON backup of
   the batch's pools first, then `scripts/check-location-health.ts`, and a few QA renders on the most-changed cards.

Pilot (Celestial, 53 spots): the first read found 3 groups / 6 duplicates (ringed planet mirrored in a lake; ringed
planet low over a terrace or gazebo; Jupiter's storm eye from an observatory); a second read found 2 more (the orrery vs
the cabinet of glass planets) and one rewrite that landed next to an existing idea. Hence the rounds.

## Phases

| #   | Phase                                                                                                               | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Audit location spots, every picker place card (read-only): duplicates per card                                      | **done**: 174 of 175 cards (Tahiti's judge reply failed to parse; redone in phase 2), 24,085 spots, **3,695 duplicates (15.3%)**, a floor (a second read finds more). Median card 15.2%; 59 cards over 20%, 64 at 10-20%, 51 under 10%, none at 0. Worst: Catacombs 44%, Ancient Rome 42%, Haleiwa 40%, Sahara Dunes 37%, Newport 36%, Victorian London 36%, Renaissance Venice 35%. Spot-checked: real duplicates ("Arch of Titus carved relief passageway on Via Sacra" vs "Arch of Titus relief-carved passage on Sacred Way"; five Port-Mahon reliefs in Catacombs), not over-calls |
| 2   | Clean location spots: batches by duplication rate, highest first; migrations + health check + QA sample             | batch 1 (20 worst cards) running                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 3   | Shared scene pools: lexical prefilter shortlists within each pool, LLM judge inside the shortlists, rewrite, verify | to build                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 4   | Quality pass: grade entries (S / A / B) against their pool, rewrite the B's with the same rules                     | after 2-3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 5   | Holiday pools: same method, after the Fall / Halloween window closes                                                | later                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Safety

- LLM work only until apply; DB writes are small guarded migrations. No render load except the QA sample (headroom
  checked, concurrency 3).
- Every batch keeps its before-state (JSON) so a card can be restored; the daily off-site backup holds it too.
- `scripts/check-location-health.ts` must pass (no new ERRORs) after each batch.
- The nightly engine is not changed by this work: only pool text.

## Results

(Filled in per phase.)
