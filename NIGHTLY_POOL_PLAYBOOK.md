# Nightly Pool Playbook: how seeds become pictures, and how to fix a pool safely

The canonical brain for nightly **seed pools**: holiday scenarios, year-round scenarios (goofy / elegant / active), and
the location spots behind cast dreams. Read it IN FULL before you write, rewrite, seed or audit any of them.

**Keep it alive.** Every new lesson goes in the right section as ONE bullet, editing (not contradicting) the older
bullet it refines. Status of record for a single program stays in that program's doc (index at the bottom). The
bots have their own brain, `BOT_SCENE_QUALITY_PLAYBOOK.md`; this one is nightly only.

Born 2026-10-02 from the "everyone gets a woman walking down a path" fix (migs 656-664), where most of these lessons
were learned the hard way.

---

## 1. The pools

| Pool | Table / filter | Notes |
|---|---|---|
| Holiday solo | `single_scenarios` `pool='holiday'`, `category` = the holiday (fall, halloween...), `sub_theme` | `pickHoliday` draws a main pool at equal odds, then a row |
| Holiday couple | `dual_scenarios` `pool='holiday'` | Same shape. Couple rows face the dual-swap rules (section 3c) |
| Year-round solo / couple | `single_scenarios` / `dual_scenarios` `pool IN ('goofy','elegant','active')`, `category` | Each seed carries its own voice ("Person at ...", "On a ...", "A man stands ...") and often the action |
| Location spots | `location_iconic_spots`, `character_eligible` (cast dreams) / `pure_scene_eligible` (scene-only postcards) | One row can serve both. Authoring rules: `LOCATION_SEED_PLAYBOOK.md` |
| Fun / fantasy buckets, Option B actions | see `NIGHTLY_FUN_SCENARIOS_PLAN.md` | Seed per bucket sequentially; proximity scan after |

Share of real nightlies (30-day audit, 2026-10-02, people in frame): solo 43% / couple 57%. Solo: location 42%,
holiday 25%, elegant 13%, goofy 12%, active 8%. Couple: holiday 48%, location 29%, elegant 9%, active 7%, goofy 7%.
Holiday shares are seasonal. Re-measure before you lean on them.

## 2. How a seed becomes a picture (get this right or nothing else matters)

- **The "set at" line is what flux stages the person ON.** Scenario seeds: the first comma-clause of the first
  sentence, cut to 12 words (`settingClauseOf`, `_shared/sceneHook.ts`). Location dreams: the WHOLE spot text is the
  location line (`characterSlotPrompt.ts`: `setAtOverride || iconicAnchor || userPlace`). Couples on special scenes:
  `setAtOverride = settingClauseOf(scene)`. Whatever noun leads that line becomes the stage.
- **A route in the set-at line produces one picture every time:** the person centred on it, the route receding behind,
  trees or facades on both sides. Measured on 2,346 delivered nightlies: route word in the first clause, route-staged
  solo 41% vs 11% without, couple 50% vs 13%, scene-only 14% vs 6%.
- **Not only route nouns.** A feature described running away does the same: "a still tannic creek WINDING through the
  grove", a tunnel of branches, torii tunnels, canals receding. A route mid-seed can too ("jack-o-lanterns creating a
  luminous PATH" rendered the corridor).
- **The action lands only near the setting.** Since mig 659 (`engine_config.nightly_solo_action_early`, QA override
  `force_solo_action_early`) the solo action sits right after "set at". Before that, scene-object actions landed 0/12;
  after, 12/12. Couples are composed by the couple engine (09-18 restore point) and are not affected.
- **Couples barely react to location spot text.** The couple composer frames the pair; 661 was effectively a solo fix.
  Couple scenario seeds DO matter (660, 664).
- **The face-swap ordering is fixed** (CLAUDE.md hard rule): the scene stays AFTER the framing block; never front-load
  or amplify the scene on a face-swap prompt.

## 3. Writing rules

### 3a. Staging
- Open on a SPOT a person would be at, never on a route: a bench, a gate, a doorway, a railing, a fountain rim, porch
  steps, a lamp post, a boulder, a footbridge's side rail, a cafe table. "Boutique doorway on Rodeo Drive", not "Rodeo
  Drive shopping street".
- No running-away words anywhere: winding, snaking, meandering, stretching away, receding, vanishing, leading to,
  curving away, tunnel of.
- A street named AFTER the spot is fine ("doorway on Bozeman's Main Street") but a trailing "beside a lantern-lit Gion
  street" still staged on the street 2/2. Put the place, not the street.
- A spot must not sit ON or ACROSS the route: a torii gate across the approach, the entrance of a covered bridge, a
  spot inside a covered bridge, a dock's planks. Side rail, not deck.
- "On a wall / on a fence rail" puts the person ON TOP of it, small in frame (a face swap failed on exactly that).
  Write "at a wall".
- **When the route IS the dream, leave the seed alone:** wild rides (horse through a market, Vespa down the Amalfi
  coast), races, chases, a duel step into the street, a procession, and gags whose joke is being in the road (chess on
  the highway centre stripe, a grill in the middle of an intersection, a cart racing down an aisle).
- **When the place IS the corridor, rewording does not help:** Times Square's billboard canyon (2/2 route-staged either
  way), a covered passage, the corn maze. Couple docks and piers got no gain in 660. Leave them or retire them.

### 3b. Wording traps (each one measured)
- **Rain plus open ground floods the scene.** An alley rewritten to "a rain-soaked neon courtyard" rendered the person
  waist-deep in water 2/2, one drifting into swimwear. Never pair soaked / slick / drenched / flooded with an open
  courtyard, plaza, forecourt or square. Keep rain as puddles on a wall or doorway.
- **Seats make people sit.** A rewrite that opens on a bench, wall, rim, ledge or steps raised sitting by 18-33 points
  per row (solo), 25 (year-round couples). The couple composer turns a named bench into "Both seated on a long stone
  bench". Mix standing spots (railing, doorway, gate, lamp post, stall front) with seats on purpose.
- **Invented props repeat.** The rewriter reaches for "fountain rim" everywhere, including places that have none
  (a cinema foyer, a galleria). Read each card's openings for repeats.
- **Old-template baggage is not a pool problem.** "Both mid-laugh at something between them" turns a couple toward each
  other (side view); a photographic look ("three-strip Technicolor film photograph", now `nightly_enabled=false`)
  makes a generic photo. Both came from a replay template's slot input, not from the pool.

### 3c. Couples
- Spots where two people stand side by side at the same height: a long bench, a wide gate, a balustrade, a fountain rim,
  a fence rail, a long table. Never narrow ones that squeeze them (a doorway, a window seat, a single chair, a ladder,
  a staircase) or put one above the other.
- No proximity words (cheek to cheek, leaning into each other, close together...). After ANY couple pool change run
  `node scripts/scan-dual-faceswap-proximity.js` (must exit 0) and lint each new row with
  `scripts/lib/posePoolLint.js` (`lintClassicPoseEntry`; active-pool rows also `lintActivePoseEntry`).
- Keep "side by side" / "a clear gap between their heads" if the original seed had it.

### 3d. Voice and variety
- Holiday seeds: comma-separated scene phrases; the first clause is a NOUN PHRASE (no pose, no preposition, no person:
  the engine adds those). Year-round seeds: keep the seed's OWN opening form ("Person at ..." stays "Person at ...").
- Never add a pose, an action, a person or a pronoun in a rewrite ("the two seated along a low wall", "they lean
  against", "beside her" all crept in).
- Same place, same theme, same props and creatures; only the route's geometry goes (`feedback_never_change_a_pools_essence_when_fixing_it`).
- Per card / sub-theme, the rewrites must not collapse onto one opening (race-track-garage all became "pit wall": the
  card was excluded). Count the first nouns before you apply.

### 3e. The rewriting LLM's habits (check for every one)
- Copies the prompt's example phrases verbatim, several times. Use varied examples and grep for them.
- Writes poses into seeds unless told the first clause is a noun phrase.
- Echoes the batch label (`[category / pool]`) into the text.
- Reads a camera word as a name ("Wide's long timber bar-end stool" from "Wide interior ...").
- Breaks JSON with a stray quote: the tools fall back to a line parser (`safeAsk`).
- Passes things it should flag (Western "main street" spots, sottoportego tunnels). A pass is not proof.

## 4. The fix loop (follow in order)

1. **Measure delivered renders first, never the picked text** (`feedback_measure_delivered_not_picked_one_variable`).
   `node scripts/audit-nightly-composition.js pull --days 30 --out <dir>`, then `tag`, then `report`. Calibrate the
   vision model on hand labels first (`calibrate`). Cast type comes from `castRoles` / `isDual`;
   `rolled_axes.dreamType` is unreliable (it mis-sorted ~540 solos as scene-only).
2. **Find the cause in the seed text**, then check it per seed against the base rate (route-first vs none), not per
   pool. A pool whose overall rate looks normal can still carry the defect in a slice of its rows (the year-round
   pools were skipped once for exactly this).
3. **Judge + rewrite** with the pool's tool (section 7). Prefilter broad, let the judge decide, rewrite in batches
   sorted by sub-theme so spots vary.
4. **Read EVERY rewrite.** Hand-fix the misses, exclude what section 3a says to leave, re-run the code checks
   (`--recheck`), and record why each exclusion was made (`apply: false`, `why_excluded`).
5. **Render-test each KIND of fix before any row changes** (section 5). Not every row: one test per new rewrite mode or
   new pool type, because the same idea fails in new places (docks, Times Square, flooded courtyards).
6. **Apply as a guarded migration** (section 6), verify the counts, run the health / proximity checks.
7. **Commit by explicit path** (`git commit -- <paths>`), docs and this playbook in the same commit.
8. **Re-measure on production** about two weeks later with the same rubric.

## 5. Render test protocol

- **Harness:** `node scripts/replay-nightly-seed.js <items.json> <outdir>`. It replays one of Kevin's nightlies through
  the real `nightly-dreams` with its exact slot input (`force_slot_input`), same model and cast role, seed swapped in.
  Renders land in Kevin's account as QA. Never another user's account. Never delete them (Kevin keeps the good ones).
- **Design:** 10-12 seeds x 2 reps x 2 arms (original text vs rewrite), the SAME template for both arms of a seed.
  Location tests also pass `place`. Match the cast to the seed (a `_f` / female seed on the +1 template, `_m` on
  Kevin's own).
- **Templates:** recent nightlies (after 2026-09-18) whose look is still `nightly_enabled`. A template carries its own
  look text and action into every render (the harness warns on a switched-off look or an old template).
- **Throttle:** one stream renders serially; at most 3 streams at once; every render waits for pool headroom. To split
  a long stream, stop it right after a `✅` line and restart the remainder in a NEW out dir (two processes must never
  share one `rows.json`).
- **Read the result three ways:**
  1. Tag both arms: `node scripts/audit-nightly-composition.js tag --out <outdir>`; compare route-staged (and seated).
  2. Swap health and identity per seed: count `dual-success` / `success`, compare identity per seed, not just the mean.
     An infra failure ("Signal timed out", a Fly hiccup) is not the seed's fault: set it aside and say so.
  3. LOOK at the new arm (a contact sheet; `magick montage` needs `-font /System/Library/Fonts/Supplemental/Arial.ttf`).
     The tag missed the flood and the swimwear; the eye did not.
- **Pass bar:** clearly fewer route-staged, swaps no worse, identity no worse once one-off seeds are explained. A seed
  that fails where its original held (the bunny bench, 2/2 swap failures) is excluded, not argued away.

## 6. Applying

- One migration per table per batch. Every statement guarded on the text that was read:
  `UPDATE ... SET scene = <new> WHERE id = <id> AND pool = <pool> AND scene = <old>;`. A re-run changes nothing; the
  tool's `--rollback` writes the reverse. `--dry-run` first, then `node scripts/apply-migration.mjs NNN`.
- **Location spots shared with postcards are SPLIT, not edited:** the original row gets `character_eligible = false`
  (postcards keep the street), and a new cast-only row carries the rewrite (`NOT EXISTS` guarded). Cast-only spots are
  rewritten in place. Pool sizes per card stay the same. Nothing references spots by id (picks go by flag and text).
- **Before applying:** confirm every row still holds the old text and no new text already exists on that card.
- **After applying:** verify counts with a read-only query; `deno run --allow-read --allow-net --allow-env
  scripts/check-location-health.ts` (no new errors) for location batches; the dual proximity scan for couple batches.
- Write the header like 660-664: why, the measured numbers, what was excluded and why, rollback.

## 7. Tools

| Tool | What it does |
|---|---|
| `scripts/audit-nightly-composition.js` | `pull` delivered nightlies, `tag` them with a vision rubric (staging / pose / framing / background), `calibrate`, `report` clusters vs base rate |
| `scripts/fix-holiday-corridor-seeds.js` | Judge + rewrite route-staged scenario seeds. `--holidays fall,halloween` (default), `--table dual` (couples), `--pools goofy,elegant,active` (year-round), `--light` (route mid-seed), `--recheck`, `--from x --sql y [--rollback]` |
| `scripts/fix-location-route-spots.js` | Same for location spots, with the postcard split. `--linear` for features that run away without a route word |
| `scripts/replay-nightly-seed.js` | The render test harness (section 5) |
| `scripts/sql-readonly.mjs` | Read-only production query through the Management API (`begin read only`). Use it for jsonb-heavy reads |
| `scripts/check-location-health.ts` | Live location data vs the engine's rules |
| `scripts/scan-dual-faceswap-proximity.js`, `scripts/lib/posePoolLint.js` | Couple proximity |

**Gotchas:** PostgREST caps reads at 1000 rows and times out on jsonb filters over `ai_generation_log` (select the
JSON paths you need, one day per query, or use `sql-readonly.mjs`). The vision tagger uses the neutral
render-analysis system prompt with no justification (Haiku refuses justified vision probes). The harness deletes
Kevin's `ai_generation_budget` row for today before each render.

**Estimating a pose share without rendering** (how "seated 11.5% -> 13-14%" was produced): measure p(pose | the
opening names X) on the audit's tagged renders and on the render tests' before / after arms, take each pool's pick
share from the audit and the share of its rows that changed from the migrations' own old / new pairs, and sum
share x changed fraction x per-row effect. State the inputs and the range; confirm on production later.

## 8. Ledger (measured, 2026-10-02)

| Fix | Mig | Rows | Render test (route-staged, orig -> new) | Swaps / identity |
|---|---|---|---|---|
| Holiday solo seeds | 657/658 | 505 | e2e 16/24 -> 5/24 (with the switch) | not compared per arm; 10/10 swapped after go-live |
| Solo action next to "set at" | 656/659 | switch | corridor-like ~5/12 -> ~1/12 (year-round A/B) | 12/12 both, identity 0.689 vs 0.688 |
| Holiday couple seeds | 660 | 352 | 11/40 -> 3/40 | equal |
| Cast location spots | 661 | 923 | 12/20 -> 4/20, then 18/24 -> 0/24 | 44/44 both arms |
| Running-away features (creek, tunnel) | 662 | 59 | 18/24 -> 4/24 | 24/24 both, identity 0.70 vs 0.67 |
| Year-round solo | 663 | 406 | 16/24 -> 3/24 | 21/24 -> 24/24 |
| Year-round couple | 664 | 238 | 14/24 -> 3/24 | identity equal without one excluded seed |

Expected seated share of nightlies with a person: 11.5% before, 13-14% after (solo 14-15%, couple ~12%), smaller after
Halloween. Re-measure all of it on production around 2026-10-16.

## 9. Open items
- ~10-15 Western "main street" spots the judge passed (Bodie, Eureka, Silverton, Deadwood).
- Couple pose sameness (arms down 28%, "active" couples active 18%) is composer behaviour: Kevin's call (restore point).
- Year-round biome action registers still carry route entries (temperate_forest, red_rock_canyon...).
- The 2026-10-16 re-measure.

## 10. Related docs
`NIGHTLY_COMPOSITION_AUDIT_PLAN.md` (the audit + results) · `NIGHTLY_POOL_CLEANUP_PLAN.md` (duplicates, drift, depth) ·
`LOCATION_SEED_PLAYBOOK.md` (authoring location cards and spots) · `NIGHTLY_FUN_SCENARIOS_PLAN.md` (fun buckets,
Option B) · `CHRISTMAS_2026_PLAN.md` (holiday pool-building method; rule 11 = open on a spot) ·
`SEED_DIVERSITY_CHARTER.md` (same-idea redundancy) · `NIGHTLY_SEED_POOL_QA.md` (eligibility columns, older
architecture) · `REAL_FACE_LOOKS_REGISTRY.md` (looks) · `COUPLE_SWAP_RELIABILITY_PLAN.md` (why couples lose the +1).
