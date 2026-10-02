# Nightly composition audit: find and fix pools whose dreams look alike

Status: **run 2026-10-02; two fixes applied (migs 660, 661), see Results.** Kevin: "we should do an entire audit of all
nightly seed pools to diagnose and fix similar issues with other pools?", then "go with your judgement, try to fix any
problem pools you find" and "don't make blanket changes unless tested and confirmed with render tests".

## Why

The fall / Halloween fix (migs 656-659, `NIGHTLY_POOL_CLEANUP_PLAN.md` open item 8) found one way a pool makes every
dream the same picture: a route in the seed's first clause stages the person centred on it, walking toward camera.
It was found because three users got the same shot on one night. Other pools may converge in ways nobody has noticed
yet, and the corridor is only one shape: the 2026-10-02 render test also showed plain "standing centred, facing camera,
arms down" shots on year-round seeds, a different sameness.

Text exposure to the corridor cause today (route word anywhere in the row): year-round solo pools 8-13%,
character-eligible location spots 11% of 14,365, holiday couples 20%. The fall / Halloween solo pools were 25-30%
before the fix.

## Method: measure delivered renders first, fix second

Measuring what was picked has misled us before (`feedback_measure_delivered_not_picked_one_variable`). So the audit
starts from the images.

1. **Tag every production nightly from the last 30 days** (3,416 rows on 2026-10-02: 381 solo, 1,676 couple, the rest
   scene-only; split out Kevin's parity rounds, which are not marked `is_qa`). A vision read per image, one fixed
   rubric:
   - staging: centred on a receding route / at a spot or prop / seated / doing something with an object / standing
     with nothing to do
   - pose: walking toward camera / standing arms down / hands in pockets / leaning / seated / active
   - framing: head-and-shoulders / waist / knees / full figure; background: detailed / plain / vignette
   Join each tag to `rolled_axes` (pool, sub-theme, location key, look, model, vibe, cast type).
2. **Rank clusters against the base rate**, the way `/mine-posts` normalises: a pool is flagged when one tag is
   over-represented in it (e.g. 40% "walking toward camera" where the base is 10%), with a minimum count so a 3-render
   pool cannot flag.
3. **Diagnose each flagged pool from its seeds**: route-staged first clauses, seeds with nothing for the hands, pose
   words in the seed, a template mandate that overrides the pool.
4. **Fix the same way as 657**: judge read, rewrite that keeps each row's place and theme, every row read, 25 first
   with a render test on Kevin's account, then the rest as guarded migrations with a rollback.
5. **Re-measure** the flagged pools on the next two weeks of production renders.

## Kevin's calls before any write

- **Couples** are the 2026-09-18 restore point. No couple pool is rewritten without Kevin's word, and the dual-swap
  proximity scan (`scripts/scan-dual-faceswap-proximity.js`, CLAUDE.md hard rule) runs after any couple change.
- **Location spots where the street IS the place** (the Champs-Elysees, a canal promenade): keep the street and give
  it a spot ("a cafe table on the Champs-Elysees"), or leave those alone.
- The vision model for step 1 (Haiku refuses some vision probes, `project_haiku_refuses_justified_vision_probes`).

## Cost and safety

Step 1 is read-only: about 3,400 vision reads. Writes are guarded migrations, before-state kept. Render tests on
Kevin's account only, headroom-gated, concurrency 3, never on another user's account.

## Results (2026-10-02)

Tool: `scripts/audit-nightly-composition.js` (`pull` / `calibrate` / `tag` / `report`). 2,346 natural nightlies from the
last 30 days (real users + Kevin's unforced), tagged by Sonnet 4.6 (`script` job) on the fixed rubric after a
calibration set. Cast type comes from `castRoles` / `isDual` (`rolled_axes.dreamType` is unreliable: the first pull
used it and mis-sorted ~540 solos as scene-only).

**One cause stands out everywhere: a route word in the seed's set-at text.** Route-staged share, route word in the
first clause vs none: solo 41% vs 11% (n 135 / 751), couple 50% vs 13% (192 / 925), scene-only 14% vs 6% (35 / 178).
No other pool / look / vibe cluster survived a minimum count: the flagged look and vibe sub-pools were n 8-22 with
0-5 distinct users each, i.e. noise; nothing was changed for them.

**Fixed, each render-tested on Kevin's account first** (real nightly-dreams, `force_slot_input` replay of the same
template with the original vs reworded seed, tagged with the same rubric; `scratchpad` harness `replay.js`):

| Pool | Test before any write | Applied | Post-apply check |
|---|---|---|---|
| Fall + Halloween couple seeds (`dual_scenarios`) | route-staged 11/40 -> 3/40, swap health equal | mig 660, 352 rows (docks, corn maze, switchbacks excluded: no gain or a loss) | 12/12 swaps, route 1/12 |
| Cast location spots (`location_iconic_spots`) | round 1: 12/20 -> 4/20; round 2: 18/24 -> 0/24 by tag (2-3 by eye), swaps 44/44 both arms | mig 661, 923 spots (race-track-garage card excluded: rewrites collapsed into one "pit wall" opening) | 6 live renders (`force_place` on 6 repaired cards, Kevin): 6/6 swapped, identity 0.60-0.76; the 1 that drew a new spot (Roppongi bench) put him at the bench, the street still running beside him |

Location spots shared with postcards were split (original row stays postcard-only, a new cast-only row carries the
rewrite) so scene-only postcards are untouched. `scripts/check-location-health.ts` after 661: no errors, no new
warnings. Couples barely react to spot text (the couple composer frames the pair, not the place), so 661 is a solo fix.

**Seen, NOT changed (the couple engine is Kevin's 2026-09-18 restore point):** couples standing arms-down 28%
(location couples 36%); "active" couple dreams show an activity in only 18%; couples close/touching 39%. These are
composer behaviour, not pool text. Raise with Kevin before any work.

**Follow-ups:**
- The route judge passed some Western "main street" spots it flagged elsewhere (Bodie / Eureka / Silverton Main
  Street, Deadwood main street): 37 judge-passed spots name a main/front street, most of them a building ON it (fine),
  ~10-15 the street itself. Same tool, same method, a small batch with its own render test.
- 357 judge-passed cast spots still name a generic route noun after the spot (fine by the tests so far); re-measure
  location solos on two weeks of production before touching them.
- DONE (mig 662): corridors with no route word. The post-661 live check drew "a redwood stand reflected in a still
  tannic creek winding through the grove" and came out centred on the creek. `fix-location-route-spots.js --linear`
  prefilters on the running-away words (104 cast spots), judge flagged 58, 3 tunnels added by hand; render test 12
  spots x 2: route-staged 18/24 -> 4/24, swaps 24/24 both arms, identity mean 0.70 vs 0.67. 59 applied (48 split, 11
  in place); Times Square "canyon of LED billboards" excluded (2/2 route-staged both arms: the place is the canyon).
- Re-measure all three repaired pools on production nightlies ~2026-10-16 (`audit-nightly-composition.js pull` +
  `tag` + `report`, same rubric).
