# Seed diversity — the charter

**Status of record for the seed pool depth + diversity program. Created 2026-09-23.**

This is the document the work gets measured against. It states the problem, what we are solving,
and the outcome we expect, with numbers, so that when the work is done we can check actual against
expected rather than argue about it. No implementation detail lives here — that goes in a separate
plan once this is agreed.

---

## 1. The problem, in Kevin's words

> "I have witnessed myself that the bots start to feel repetitive after a few weeks, I'll see very
> similar posts or scenes I think I've seen before — so that's what I'm trying to fix … less
> repetition."

And the standard he set:

> "All seed pools should be at least 100 deep for scene pools … I want deep, diverse pools so that
> bot posts are always unique and fresh across a time window."

## 2. What is actually wrong, measured

Two separate defects produce the same symptom. Both are measured; neither is an estimate.

### 2a. Pools are redundant — the same idea written several ways

**31,355 of 497,895 entries (6% of the fleet) restate an idea already present in their own pool.**

The clearest case, `faebot_flower_fairy_scale_prover` — **200 entries, 69 distinct ideas** — includes
a cluster of nine that differ only by an adjective:

```
"A painted giant magnolia-bloom as her painted bedchamber, painted broad cream-and-pink petals dwarfing her painted form"
"A painted giant magnolia-bloom as her painted bedchamber, painted large cream-and-rose petals dwarfing her painted form"
"A painted giant magnolia-bloom as her painted bedchamber, painted large cream-and-blush petals dwarfing her painted form"
```

Fleet distribution:

| band                                  | pools |
| ------------------------------------- | ----- |
| ≥50% of entries restate another entry | 16    |
| ≥40%                                  | 46    |
| ≥25%                                  | 159   |

Worst bots by redundant entries: FaeBot 5,351 · MangaBot 4,548 · EarthBot 3,171 · DragonBot 2,403 ·
OceanBot 1,915.

**Why this is the symptom.** Pool picks are a true shuffle-bag (`botEngine.pickWithRecency`: every
entry is drawn once before any repeat, reset on exhaustion). So nobody is seeing the same _entry_
twice inside a cycle. They are seeing a different entry that describes the same thing. A pool of 200
entries with 69 distinct ideas delivers 69 distinguishable renders, and at two posts a day a bot
exhausts that in about five weeks — which is the "few weeks" in the report.

### 2b. Scene pools are shallow — never scaled past their QA size

**222 non-axis pools on live public bots sit at exactly 24-25 entries.** 195 at exactly 25, 27 at
exactly 24. That round-number clustering is the MVP-25 signature: seeded to test a path, signed off,
never scaled.

Separately, **116 pools across the 18 paths approved on 2026-09-23 are under 120 entries**, nearly all
at exactly 25. Only `cozy-farming-life-sim` is at production depth. Thinnest are
`steambot_brass_glasshouse_keeper` (14), `_wet_air` (16) and `_light` (22).

### 2c. Why no existing gate caught either

`scan-bot-seed-dupes.js` computes three measures and enforces exactly one:

| measure   | definition                                     | enforced                                                            | fleet result          |
| --------- | ---------------------------------------------- | ------------------------------------------------------------------- | --------------------- |
| EXACT     | identical text                                 | **yes, fails CI**                                                   | **0**                 |
| SIGNATURE | first 12 significant tokens, order-independent | warn only                                                           | 6,315 (1.3%)          |
| COARSE    | first 6 significant tokens                     | **no** — its own comment reads "a saturation signal, NOT a failure" | not enforced anywhere |

The gate was built to stop a generator emitting literal duplicates and it does that perfectly: the
fleet has zero exact duplicates. Nothing has ever measured whether the _ideas_ are distinct. A pool
can be 80% one idea and pass every check in CI.

---

## 3. What we are solving

1. **Every scene pool holds at least 100 DISTINCT ideas.** Not 100 entries — 100 distinct. A pool of
   150 entries with 70 ideas has not met this.
2. **No scene pool is meaningfully redundant.** Existing restatements get rewritten into genuinely
   different ideas, not deleted.
3. **It cannot regrow.** The diversity measure is enforced in CI, so the next generator run cannot
   reintroduce clustering.

### Explicitly NOT in scope

- **Axis pools** (lighting, camera, framing, palette, vibe, look register, expression, skin). A
  repeated camera angle is invisible to a viewer. Roughly 350 pools, deliberately left alone.
- **Dark and private bots** (AlphaBot, MechBot, OutlawBot, RetroBot). They post to nobody.
- **Deleting entries to raise the percentage.** Purification is a rewrite. A pool must not come out
  of this shallower than it went in.
- **Inflating pools that are already diverse.** Depth for its own sake was measured as waste earlier
  in this program (a flat +100 fleet-wide would have been ~303,000 entries nobody would ever see).

---

## 4. The outcome we expect

> ⚠️ **EVERY NUMBER IN THIS SECTION COMES FROM A MEASURE NOW KNOWN TO BE UNRELIABLE.**
> Added 2026-09-23 after the pilot. `scripts/lib/ideaSimilarity.js` is wrong in both directions on
> labelled real data (proof in `__tests__/lib/ideaSimilarity.test.ts`, and §6e): unstripped it calls
> unrelated entries duplicates, stripped it calls near-duplicates unrelated. The nine labelled magnolia
> duplicates never merge into one idea at any threshold. Consequently a `distinct` count is an **upper
> bound on diversity** — so "31,355 redundant" and "154 pools under 100 ideas" are **floors, and the real
> figures are worse.** Treat the table below as direction-of-travel, not as a scoreboard, until an LLM
> judge has re-measured a sample. Do not report progress as a delta between two of these numbers.

Measured by re-running `scripts/audit-seed-redundancy.js`. Baseline is today.

| #   | metric                                           | baseline (2026-09-23)                                                       | target                                      | how verified                                                   |
| --- | ------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| 1   | live scene pools with <100 distinct ideas        | **222 at 24-25 entries, plus every pool whose distinct count is under 100** | **0**                                       | audit report, `distinct` column                                |
| 2   | redundant entries fleet-wide                     | **31,355 (6%)**                                                             | **under 5,000 (<1%)**                       | audit report total                                             |
| 3   | scene pools ≥40% same-idea                       | **46**                                                                      | **0**                                       | audit report band table                                        |
| 4   | scene pools ≥25% same-idea                       | **159**                                                                     | **under 20**                                | audit report band table                                        |
| 5   | pools under 120 on the 18 approved paths         | **116**                                                                     | **0**                                       | per-path depth check                                           |
| 6   | exact duplicates                                 | 0                                                                           | **still 0**                                 | existing CI gate                                               |
| 7   | CI blocks a new pool above the same-idea ceiling | **no gate exists**                                                          | **gate live, with a test proving it fails** | new jest test, verified red against current code               |
| 8   | total entry count                                | 497,895                                                                     | **rises only where depth was required**     | audit report; a large rise elsewhere means the work went wrong |

**The honest success test:** `distinct` rises on every worked pool while `%same` falls, and entry count
rises only on pools that were under 100. If entry count balloons and `%same` stays flat, the work
produced volume instead of variety and has failed regardless of the totals.

---

## 5. Method, in outline

Two stages per pool, in this order, because the order matters:

1. **Purify.** Rewrite each redundant entry into a genuinely different idea. Keep the pool's voice and
   its established register. Do not delete. This is the step that raises `distinct` without touching
   entry count.
2. **Backfill.** Any pool still under 100 distinct ideas after purification gets new entries generated
   to reach 100, each checked against every existing idea key so it cannot land on an idea the pool
   already has.

Then, once, fleet-wide:

3. **Enforce.** Add the same-idea ceiling to `npm run check` for pools a commit touches, with a test
   that proves the gate fails on a known-bad pool.

Detailed procedure, batching, cost and agent briefs go in the implementation plan, not here.

---

## 5b. How "the same idea" is judged — settled 2026-09-23

**An LLM judges sameness. Lexical overlap is only a prefilter.** Kevin approved the spend: "if we need
to use AI as a massive pass to go through and figure out what's unique and what isn't, we could do
that too ... worth the expense."

That is the right call because the lexical measure was calibrated and found insufficient in one
direction and unreliable in the other:

- **It misses adjective-swap duplicates.** `scripts/lib/ideaSimilarity.js` (Jaccard on significant
  tokens) never collapses the magnolia nine below 2 clusters at ANY threshold, including 0.40. The
  distinguishing words are `broad` vs `large` vs `blush`, and no lexical measure knows those mean the
  same thing here. Pairwise similarity of two of them is 0.54.
- **It does catch blatant shared-prefix duplicates.** `game_center_arcade_room` came back 76%
  redundant, and inspection confirmed it: 12 entries share an identical 125-character opening. Not an
  over-merge — a real defect.
- Known-distinct entries score 0.00-0.13, so the separation from real duplicates (0.54-0.75) is wide.
  That wide gap is what makes it a good _prefilter_ and a bad _judge_.

So the pipeline is:

| step | who                 | what                                                                                          | est. cost |
| ---- | ------------------- | --------------------------------------------------------------------------------------------- | --------- |
| 1    | `ideaSimilarity.js` | cluster each pool to shortlist candidate duplicates, so the LLM never compares every pair     | $0        |
| 2    | Haiku               | judge which shortlisted entries are genuinely the same idea                                   | ~$30      |
| 3    | Sonnet              | rewrite each redundant entry into a new idea in the pool's own voice, keeping one per cluster | ~$70      |
| 4    | Sonnet              | backfill any pool still under 100 distinct ideas                                              | ~$40      |
| 5    | Haiku               | re-judge to verify the target was hit                                                         | included  |
|      |                     | **total**                                                                                     | **~$140** |

`ideaSimilarity.js` stays in the codebase as the prefilter AND as the CI gate (outcome #7), because a
gate has to be free and deterministic to run on every commit. It is not the arbiter of truth; the
recorded LLM judgement is.

**Rewrite, never delete.** Kevin: "we should not just throw out what's there outright, but instead just
make them actually distinct in idea, then backfill any that lost too many after purification so that
they are actually unique." So step 3 changes entries in place and step 4 only tops up what is still
short. No pool comes out of this shallower than it went in.

## 6. Known risk that must be fixed before any work starts

**The idea-key definition is load-bearing and the version currently in the generator is wrong.**

I added `ideaKeyOf` to `scripts/lib/seedGenHelper.js` (first 6 significant tokens, sorted) to reject
same-idea entries at generation time. It reuses that file's existing `STOPWORDS` list, which already
contains `painted` and `large`. On the magnolia cluster above, those words are stripped and the
surviving six tokens differ (`broad` vs `petals`), so the two restatements produce **different** keys
and would both be accepted. The audit script that found the problem uses its own, narrower stopword
list and does catch them.

So there are currently two different definitions of "same idea" in the repo and the one wired into
generation is the weaker one. Before any pool is touched:

- settle on ONE definition, in one shared module, used by the audit, the generator and the CI gate;
- validate it against a labelled set of known duplicates (the magnolia nine, the sunflower nine) AND
  known-distinct entries, so it neither misses real duplicates nor rejects legitimate variety;
- re-run the baseline audit with the settled definition, because every number in section 4 moves if
  the definition moves.

A measure that is wrong in either direction is worse than none: too loose and the work does nothing,
too strict and it rejects genuine variety and flattens the pools.

**RESOLVED 2026-09-23.** Settled on the stricter definition and validated it, which is what produced
section 5b: the single shared module is `scripts/lib/ideaSimilarity.js`, its stopword list is
grammatical only (the old one stripped `painted` and `large`, which is why it let the magnolia
duplicates through), and calibration against labelled real clusters showed lexical overlap cannot be
the final judge. The weaker `ideaKeyOf` added to `seedGenHelper.js` earlier that day must be replaced
by this module before any generation runs, or the generator will keep accepting same-idea entries.

---

## 6b. Safety rules — non-negotiable, Kevin 2026-09-23

> "we need to be extremely careful doing this btw, dry-run before actually mutating the pools is
> necessary to validate what we think will happen. and then when we backfill, again, need to be
> careful so that the new seed pool entries are correct"

This is riskier than the render cleanup earlier the same day, and in a worse way. A bad delete fails
loudly and is caught by a count. A bad _rewrite_ silently degrades what 18 live bots post twice a day,
and nothing in CI would notice, because the entry count and the JSON shape stay valid.

### Every mutation script obeys these

1. **DRY RUN IS THE DEFAULT.** `--execute` required. The dry run prints, per pool: entries before,
   distinct before, which clusters were judged redundant, the exact old → new text of every proposed
   rewrite, and entries/distinct after. Nothing is accepted until that output has been read.
2. **Back up the pool file before the first write**, to a timestamped path outside the repo, same as
   the render cleanup did. Plus git, which already tracks these files.
3. **NEVER DELETE.** Rewrite in place. A post-write assertion fails the run if the entry count dropped
   by even one.
4. **One pool at a time, verified, then the next.** No fleet-wide blind run. A batch that touches 40
   pools before anyone looks at the first is how this goes wrong.
5. **Prove on ONE pool, show Kevin, stop.** `faebot_flower_fairy_scale_prover` is the natural
   candidate: worst in the fleet, 200 entries, 69 distinct. Nothing else gets touched until he has seen
   that pool's before/after.

### Every rewritten or backfilled entry must pass, before it is written

| check                                                                 | why                                                                                                                                    |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| distinct from every existing entry, LLM-judged **and** lexically      | the entire point; a rewrite that lands on another existing idea is a no-op                                                             |
| matches the pool's register — length band, sentence shape, vocabulary | these pools feed a specific bot's voice; an off-register entry renders wrong even if it is unique                                      |
| passes the bot's own `bannedPhrases`                                  | a human noun in a no-humans bot's pool kills the render at `banned-phrase-check`                                                       |
| passes `scripts/sweep-bot-seed-defects.js`                            | the known bad-render phrase families: negation leaks, metaphorical light-as-object, per-object personification, off-limits size rulers |
| no text-prior nouns (signs, labels, banners)                          | the fleet's most persistent render defect                                                                                              |
| JSON re-parses and the array length is >= the original                | catches a malformed write before it reaches a bot                                                                                      |

### The real proof is a render, not a number

An audit passing only proves the text changed. After a pool is repaired, its path gets a **6-render
shadow batch**, reviewed in the app, before the pool is trusted. A repaired pool that renders worse has
failed regardless of what `distinct` says — the same standard every path in the 35-path push was held
to, and the same reason `acorn-boat-regatta` got four rounds instead of one.

### Order of operations, fixed

```
prove one pool  ->  Kevin reviews  ->  one bot end to end  ->  render batch  ->  Kevin reviews
    ->  remaining bots worst-first  ->  CI gate last
```

The CI gate lands **last**, not first: turning it on while 46 pools are still over the ceiling would
block every unrelated commit that happens to touch a seed file.

## 6c. DECISION LOG — read this before proposing anything

Every row is something already tried and settled. The point of this table is that nobody re-proposes
a rejected approach, including me. Five of these are my own wrong turns in a single session.

| #   | proposed                                                                   | verdict                                        | why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Flat +100 entries to every pool fleet-wide                                 | **REJECTED** (2026-09-22)                      | ~303,000 entries nobody would see. Fleet near-dup was 2-11% and each entry resurfaces about once every five years                                                                                                                                                                                                                                                                                                                                                                              |
| 2   | "Top up the 178 wired pools under 120 entries" (stage 1b)                  | **REJECTED**                                   | Never had support in the data. Depth is not the lever — see #4                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 3   | Rank pools by shuffle-bag cycle length ("effective_days")                  | **REJECTED**                                   | Measures how fast a pool cycles, not whether it repeats ideas. Its top 10 came back full of pools with ZERO redundancy that simply get drawn often. A shuffle-bag cycling is EVEN COVERAGE, not repetition                                                                                                                                                                                                                                                                                     |
| 4   | Deepen pools to 100+ entries                                               | **SUPERSEDED**                                 | The pools with a real problem are already at 200. Adding entries to a pool that is 80% one idea produces more of that idea. The bar is 100 DISTINCT IDEAS, not 100 entries                                                                                                                                                                                                                                                                                                                     |
| 5   | Judge sameness with a token hash (first 6 or 12 tokens, sorted)            | **REJECTED as the judge, KEPT as a prefilter** | Misses adjective-swap duplicates entirely: the magnolia nine never collapse below 2 clusters at ANY threshold including 0.40, because the difference is broad/large/blush. Kept because a CI gate must be free and deterministic                                                                                                                                                                                                                                                               |
| 6   | Classify subject vs axis pools by **filename**                             | **REJECTED**                                   | Picks up template boilerplate, not motifs. `faebot_*` pools all score "painted 100%, register 100%" because the generator skeleton is in every entry                                                                                                                                                                                                                                                                                                                                           |
| 7   | Classify subject vs axis pools by **slot name** in the `pools:` map        | **REJECTED**                                   | There is no naming convention. OceanBot names its subject slot per path (`wreck_class`, `ghost_ship`, `kraken_scene`); FarmBot's 34 paths and TinyBot's 18 are function-form with no slot map at all. The regex covered 8 of 18 live bots and silently omitted the rest                                                                                                                                                                                                                        |
| 8   | Have an LLM read each path file and name its subject pool                  | **ACCEPTED, IN PROGRESS**                      | The only approach that works across naming schemes and function-form paths. `scripts/identify-subject-pools.js` → `SUBJECT_POOL_MAP.json`                                                                                                                                                                                                                                                                                                                                                      |
| 9   | Purify duplicates inside a pool, then backfill                             | **PARTLY SUPERSEDED**                          | Correct mechanically, but see #10 — most bad pools are not duplicated, they are single-motif                                                                                                                                                                                                                                                                                                                                                                                                   |
| 10  | Expand each pool's CONCEPT SPACE, not just deduplicate                     | **ACCEPTED**                                   | 34 of 35 bad pools are one motif at ≥70%. `earthbot/epic_sunset_subject` is 96% "tropical beach sunset with silhouetted palms" — 200 entries, 33 real ideas, and no storm, sunrise or underwater sunset anywhere. Purifying within the motif would move the audit numbers and change nothing a viewer sees                                                                                                                                                                                     |
| 11  | Compare entries with `similarity()` raw, no boilerplate stripping          | **REJECTED** (pilot)                           | Measures the pool's FORMAT, not its ideas. With `flower_focal_cluster`'s twelve always-present tokens included, median pairwise similarity is 0.46 — above a 0.48 threshold's shoulder — so the validator rejected 72 of 100 generated entries whose real match against the closest existing entry was only 16-32%. **Audit and validator must use the SAME stripped comparison.** This also invalidated the pool's own published "8 ideas / 94%" baseline                                     |
| 12  | Generate 10 entries per category                                           | **REJECTED** (pilot)                           | Over-production inside one category breeds recombination: ~1/3 of the pilot's new entries reshuffle their own category's vocabulary (the alpine block all name edelweiss + saxifrage + stonecrop). Use **~3 per category, more categories** — better spread and cheaper                                                                                                                                                                                                                        |
| 13  | Sign a pool off on 6 shuffle-bag renders                                   | **REJECTED** (pilot)                           | With 74 of 137 entries new, only 1 of 6 renders drew a new seed. The batch tested the OLD pool. A render batch must draw a **stratified sample of NEW entries** to say anything about variety; 6 unforced renders prove only that nothing broke                                                                                                                                                                                                                                                |
| 14  | Let the generator name a flower's colour freely                            | **REJECTED** (pilot)                           | Produced "pale-turquoise scabiosa" and "pale lime-green zinnia" — no such cultivars. Same class as the FarmBot literal-hue-word bug. The category prompt must name the species' real colour range, or the validator must check it                                                                                                                                                                                                                                                              |
| 15  | Compare a pool's before/after using each version's OWN boilerplate profile | **REJECTED** (pilot)                           | The profile is derived from the entries being measured, so adding diverse entries lowers every token's document frequency, fewer tokens clear `share`, less is stripped, and the two sides are scored on different yardsticks. Use `clusterPool(after, t, {formatFrom: before})`. **And never quote a distinct/redundant figure without stating threshold AND basis** — the pilot's two files read 28 to 137 distinct ideas across those choices, which is how I came to report a wrong number |
| 16  | Use the lexical same-idea measure as the ACCEPTANCE gate                   | **REJECTED** (pilot, confirming §5b)           | It reports **0% redundant** on the repaired pilot pool, which a manual read found ~1/3 recombinant. The 7-entry alpine cluster survives as 7 clusters at the calibrated 0.60 and only merges to 3 at 0.30 — below calibration. Lexical = free CI tripwire and prefilter. LLM judge = acceptance                                                                                                                                                                                                |
| 17  | Let each tool pick its own same-idea threshold                             | **MUST FIX before rollout** (pilot)            | `reseed-subject-pool.js` clusters and validates at **0.48**; `ideaSimilarity.SAME_IDEA` is **0.60**; `audit-seed-redundancy.js` uses the constant. The repair tool and the fleet audit have therefore been grading pools on different scales, which is half of how the wrong numbers got reported. One constant, referenced everywhere, no literals                                                                                                                                            |
| 18  | Report a distinct/redundant figure without naming its settings             | **BANNED** (pilot)                             | Threshold × stripping basis moved the pilot pool between 8 and 137 distinct ideas. Three different numbers were reported to Kevin for one change because of this. Every figure states threshold AND basis, or it is not quoted                                                                                                                                                                                                                                                                 |
| 19  | Rewrite each near-copy IN PLACE into a new line-up of the same kind        | **ACCEPTED** (resumed pilot, 2026-09-23)       | Kevin: same pool, all colours welcome, vary within the motif. Keeps format, settings, count and the first original of every line-up; only the restatements change. For this pool a "line-up" is the set of flower species, and two entries are the same line-up when they share 4+ of their 5-6 flowers. That is a pool-specific basis and is stated with every figure. See §6f                                                                                                              |
| 20  | Let Sonnet choose the flowers of a rewrite                                 | **REJECTED** (resumed pilot)                   | It converges: batch after batch reused the same dozen species. The tool now assigns each slot's species BEFORE Sonnet writes, from a roster of real flowers in their real hues, least-used first, under a per-species cap, and Sonnet only words them. Same lesson as "never let the LLM invent the varying element"                                                                                                                                                                             |
| 21  | Use the LLM same-idea judge as the acceptance gate for THIS pool           | **DEMOTED to advisory** (resumed pilot)        | On a pool whose entries all share one format, the judge reads "same colour family" as "same idea" and blocked 9 of 12 green/red/orange slots. Mechanical overlap (≤2 shared species with every other entry) is the gate here; the judge's opinion is recorded on the change as `judgeNote` (10 of 81), not used to reject                                                                                                                                                                       |
| 22  | Leave the template's own colour/species blocks alone when repairing a pool | **REJECTED** (resumed pilot)                   | `BLOOMBOT_FLOWER_FRIENDS` injected a STRICT florist palette and a STRICT species roster AFTER the entry, so Sonnet swapped the entry's flowers for the roster on 1 of 3 forced renders, and the entry's register words reached 0 of 3 Flux prompts. A subject-pool repair is invisible while the template carries a second subject source. Fixed in a separate second pass on that template only (§6f)                                                                                          |

### Scope, corrected

**SUBJECT pools only.** Kevin, after I drifted onto axis pools repeatedly: _"I said I wanted to focus on
the subject pools, why is that so hard to understand."_ The subject pool is the one whose entries state
what the render is OF. Proven by reading a real emitted brief:

```
━━━ THE VISTA SUBJECT (the location + its core geology — the hero of the frame, fills it) ━━━
Wide flat white-sand crescent beach with tall coconut palms silhouetted on the inland fringe...
```

Within a path, the subject pool is the ONLY thing that changes what you are looking at. Everything else
modifies it. Axis pools (lighting, palette, camera, weather, atmosphere, composition) and appearance
pools (eyes, skin, hair, outfit, regalia, adornment) are **out of scope** and must not be touched.

Also note: the PATH bounds what its subject pool may say. `epic-sunset` can never produce a spaceship —
its brief mandates a real-Earth sunset vista. So a pool's legitimate range is set by its path, and the
defect is a pool using one corner of that range. Cross-path variety is a separate question (does a bot
have enough paths?) and is not this task.

## 6d. PROGRESS TRACKER — update as we go

| step                                                    | state                                        | evidence                                                                                                                                                                                                   |
| ------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Baseline audit, all pools, likeness-based               | **done**                                     | `scripts/audit-seed-redundancy.js`, 31,355 redundant fleet-wide (includes axis pools, superseded as a work list)                                                                                           |
| Settle the "same idea" definition                       | **done**                                     | `scripts/lib/ideaSimilarity.js`, calibrated against labelled clusters                                                                                                                                      |
| Identify every path's SUBJECT pool                      | **done**                                     | `SUBJECT_POOL_MAP.json`, all 18 live bots, 715 subject pools resolved, 66 names unresolved (mostly ChibiBot `creature*` slots)                                                                             |
| Audit idea-count for subject pools only                 | **done**                                     | **154 subject pools under 100 distinct ideas, ~4,930 entries to author.** YumBot 24, EarthBot 21, MangaBot 18, BloomBot 14, FaeBot 12, StarBot 11, ChibiBot 11, OceanBot 9, TinyBot 7, PixelBot 7, rest 20 |
| Agree the broadened concept range, per pool, with Kevin | **pilot range set**                          | 15 categories, inside the path's documented bounds                                                                                                                                                         |
| Re-seed ONE pool, render 6, Kevin reviews               | **first attempt REVERTED; resumed and DONE** | First attempt (category method) reverted, §6e. Resumed 2026-09-23 with the in-place method, §6f: 125 → 125 entries, **44 → 125 distinct line-ups** (basis: same line-up = 4+ shared species of 5-6, greedy in pool order), 39 → 154 species, daisies in 100 → 30. Commit `e672068b`. Forced shadow renders on the NEW entries, 3 + 8, reviewed in the app. |
| Roll out to remaining pools                             | not started                                  | the in-place tool is pool-specific (a flower roster, a species parser); the next pool needs its own notion of "line-up" and its own roster before the method transfers                                    |
| CI gate                                                 | not started                                  | lands LAST, per §6b                                                                                                                                                                                        |

### PILOT — `bloombot/flower-friends`, COMPLETE 2026-09-23

Kevin: _"take one of the paths and work on getting it properly cleaned up and backfilled, then run some
test renders ... this is the case study. once we figure out and prove out a repeatable strategy on the
pilot path, we can then move to a system wide iterative task."_

**Why this path.** Its subject pool is the most extreme case in the fleet, the path is live so renders
are meaningful, and — decisively — the path's own header already says the pool should be broader:
_"pink-purple-cream-coral palette in the refs, but ALL flower colors welcome here."_ So broadening
restores the documented intent instead of changing the brand.

| pool                   | entries       | distinct ideas | redundant    | verdict             |
| ---------------------- | ------------- | -------------- | ------------ | ------------------- |
| `flower_focal_cluster` | 125 → **137** | 63 → **130**   | 50% → **5%** | the work, DONE      |
| `hero_pollinator`      | 196           | 194            | 1%           | healthy, left alone |
| `magical_particles`    | —             | —              | —            | axis, out of scope  |

⚠️ **The "8 ideas / 94% redundant" figure this table used to carry is not wrong, it is one setting** —
the unstripped measure, which counts a rigid shared skeleton as duplication. Every entry opens
"SOFT/PALE ‹colour› + flower names" and ends with the same pastel-register and background-layer clauses;
twelve tokens appear in 100% of entries. With that boilerplate in the comparison the median pairwise
similarity is 0.46, so almost everything looks like a duplicate. Stripped, it is 0.08 and the same file
reads 63 ideas / 50%. **Both are real readings of one pool** — see the full matrix in §6e, which is the
authoritative record. `hero_pollinator` moves the same way: 129 ideas / 34% unstripped, 194 / 1%
stripped.

Whichever row you take, the defect was narrowness more than restatement: the ideas were one _kind_ of
idea in a handful of colourways, dominated by powder-blue / pale-violet / lilac pastel wildflower
clusters. That is why every flower-friends render is a pastel bouquet, and it is the part no
deduplication-only approach would have fixed.

~~**Method being proved** (`scripts/reseed-subject-pool.js`, dry-run by default): cluster, keep one
representative per idea, operator-supplied CATEGORIES, generate per category, validate, 6 shadow
renders. 15 categories were authored (bold colourways, single dramatic bloom, tropical, dark and moody,
spiky, seed heads, herbs, climbers, water-adjacent, wild meadow, night bloomers, post-rain, autumn,
early spring, grasses).~~ **STRUCK 2026-09-23.** The category method changed what the pool is (§6c row
10 is superseded for repairs; see SEED_POOL_REPAIR_HANDOFF.md §2) and the script was deleted. The
method that actually repaired this pool is in §6f.

**What the pilot had to establish before anything else is touched:** that expanding categories measurably
raises distinct ideas, that the generated entries survive validation at an acceptable rate, that the
renders actually look more varied, and what it really costs per pool. Three of those four are answered
below. The fourth — renders actually look more varied — is NOT.

## 6e. PILOT OUTCOME — what was proved, and what was not

### Proved

**Composition of the change:** 125 originals in, 63 kept verbatim as cluster representatives, 62
restatements not carried forward, **74 newly authored** → 137 entries. Nothing was discarded blind, every
original idea kept a representative, and the original is backed up at
`~/poolbackup-bloombot-BLOOMBOT_FLOWER_FRIENDS_FLOWER_FOCAL_CLUSTER-1790203792485.json`.

**The pool improved on every way of measuring it. That is the only quantitative claim this pilot
supports.** Here is the complete matrix, so nobody has to guess which setting produced a number — this
table is the authoritative record and supersedes every earlier figure in this document:

| setting                             | before (125) | after (137) | ideas gained |
| ----------------------------------- | ------------ | ----------- | ------------ |
| thresh 0.48, each side on OWN basis | 63 / 50%     | 130 / 5%    | +67          |
| thresh 0.48, both on BEFORE basis   | 63 / 50%     | 137 / 0%    | +74          |
| thresh 0.48, no stripping           | 8 / 94%      | 22 / 84%    | +14          |
| thresh 0.60, each side on OWN basis | 90 / 28%     | 137 / 0%    | +47          |
| thresh 0.60, both on BEFORE basis   | 90 / 28%     | 137 / 0%    | +47          |
| thresh 0.60, no stripping           | 28 / 78%     | 63 / 54%    | +35          |

**Where my earlier wrong numbers came from, so the confusion is not repeated.** Every figure I quoted
this session was a real output of this table, reported without saying which row it came from:

- "**8 ideas / 94% redundant**" (this document's original baseline) = row 3, before. Real, but it is the
  unstripped measure, which counts a rigid shared skeleton as duplication.
- "**63 → 130, 50% → 5%**" = row 1. Real — it is exactly what `reseed-subject-pool.js` printed. The flaw
  is that the two sides are scored on their own separate bases, so the delta is not clean.
- I then "corrected" that to claim 63 was the new pool's raw count. **That correction was itself wrong.**
  63 is the before-pool at 0.48. Third time stating this number, so: the table above, or nothing.

⚠️ **And even the matrix is direction-of-travel, not magnitude.** Two independent settings choices —
threshold, and stripping basis — move the same two files between 8 and 137 distinct ideas. `+14` and
`+74` are both defensible readings of one change. **Also note `formatFrom` is not a clean fix:** on the
fixed basis the repaired pool reads 137/0%, _less_ credible than the 130/5% it reads on its own basis,
because the before-pool's skeleton is aggressive and stripping it flatters the after-pool. Neither basis
is right. **The trustworthy evidence that this pool got better is the manual read below.**

⚠️ **The tool and the module disagree on threshold.** `reseed-subject-pool.js` clusters and validates at
**0.48**; `ideaSimilarity.SAME_IDEA` is **0.60**; `audit-seed-redundancy.js` uses the constant. So the
repair tool and the fleet audit have been scoring pools differently all along. Pick one before rollout.

**The entries hold up to a manual read.** All 74 new entries were read one by one. No truncation, valid
JSON, every one carrying the pool's full format. Botanically real, with species the pool never had
(bells-of-Ireland, craspedia, echinops, ammi majus, brugmansia, cerinthe, aubrieta, moss campion,
teasel, honesty, nigella), and genuinely new territory: herb gardens, early spring, autumn, post-rain,
buds, seed heads, woodland, coastal dunes, alpine rockery, cottage garden.

**Design conformance is measurable and was enforced.** New entries must carry ≥70% of the tokens that
appear in ≥80% of the original pool — its skeleton. Measured min 75%, median 90%. This is what stops a
backfill from drifting off the pool's own shape.

### Two defects in the method, both to fix before rollout

1. **Over-production inside a category breeds recombination, AND the lexical measure cannot see it.**
   Asking for 10 entries per category made roughly a third of the new entries recombinations of their
   own category's vocabulary — the alpine block (entries 127-133) all name edelweiss + saxifrage +
   stonecrop in different orders. **Rollout uses ~3 per category and more categories**, which is also
   cheaper.

   The measurement half of this is the more important finding. Those 7 hand-spotted duplicates collapse
   to 7 separate clusters at the calibrated 0.60, to 7 at 0.50, to 5 at 0.40, and only to 3 at 0.30 —
   a threshold far below calibration that would collapse genuinely distinct entries elsewhere. So:

   > **The lexical measure reports 0% redundant on a pool that a manual read found ~1/3 recombinant.
   > It cannot be the acceptance gate.** This independently confirms §5b from the other direction: §5b
   > rejected lexical-only because it MISSES adjective-swap duplicates (the magnolia nine); the pilot
   > shows it also misses same-vocabulary recombination. Lexical stays a free deterministic prefilter
   > and a CI tripwire. The LLM judge is required for acceptance, and the manual read is currently the
   > only trustworthy verdict on generated entries.

2. **A few invented colours slipped through** — "pale-turquoise scabiosa", "pale lime-green zinnia".
   Botanically wrong, and the same class of bug as the FarmBot literal-hue-word defect. The validator
   needs a real-cultivar check, or the category prompt must name the species' actual colour range.

### NOT proved: the renders

6 shadow renders, all 6 succeeded, all 6 beautiful and on-register. But **only 1 of the 6 drew a new
seed** (#100). With 74 of 137 entries new the expectation was ~3; getting 1 is ordinary luck at n=6, but
it means the batch tested the OLD pool, not the new one.

**So 6 renders cannot validate a 137-entry pool, and no future pool should be signed off on 6.** What
the batch does prove is that nothing broke: the pool loads, the path builds, the pastel register is
present in all 6 prompts, and the one new seed rendered as a legible on-register scene. For a real
variety verdict the render batch has to be forced across the new entries rather than left to the
shuffle-bag — the rollout harness should draw a stratified sample of NEW entries specifically.

### Two PRE-EXISTING path defects the pilot surfaced (not caused by the re-seed)

Recorded here so they are not misattributed to this work, and because they are the more interesting
finding. Both belong to `flower-friends`, not to the seed-diversity task.

1. **The co-hero pollinator is invisible.** The path header says _"the INSECT is co-hero with the
   flower."_ In all 6 renders the insect is named in the prompt — bumblebee, ladybug, ladybug, lacewing,
   lacewing, moth — and lands at **52-59% of the prompt**, past the attention region. Result: 5 of 6
   renders have no insect at all, and the 6th has tiny background specks. This is the position law from
   the 35-path run (playbook lessons 60/65/77), not a pool problem. The `hero_pollinator` pool is
   healthy (194 ideas / 1% redundant) and its content never reaches the picture. **The fix is prompt
   ORDER, not seeds.** Also note "co-hero" appears in all 125 ORIGINAL entries, so the wording predates
   this work.
2. **Palette drift on 2 of 6** despite pastel/watercolor words being present in every prompt: one
   render came back saturated dahlia-pink, one yellow-dominant. Same family as the look-vs-framing
   conflict measured in `NIGHTLY_LOOK_FIDELITY_INVESTIGATION.md`.

### Cost

Four runs were needed, and each failure was a real bug worth finding (format-vs-idea similarity, audit
and validator disagreeing, archetype violation, design conformance). The _method_ now converges in one
run. Per-pool cost is dominated by generation, and with the 10→3 per-category change it drops
materially; re-estimate on the first rollout batch rather than projecting from the pilot's four runs.

### What is NOT yet known, and must not be guessed

- **The true count of subject pools needing work.** The 52-pool figure came from the rejected slot-name
  method and covers 8 of 18 bots. Do not quote it.
- **Whether each pool's motif should be broadened or preserved.** For `epic_sunset_subject`, is
  EarthBot's intent specifically tropical-beach-sunset (pool is correct, bot needs more paths) or
  "epic sunsets" broadly (pool is too narrow)? That is a brand call per pool, and Kevin's.
- **Two of my own audit bugs, fixed, recorded so the numbers are not re-quoted wrong.** (1)
  `entryText` only read `description`/`text`, so BrickBot's `{location, scene, tier}` pool returned
  empty for all 1,601 entries and was reported as "0 distinct ideas, worst in the fleet". It is
  actually 1,601 entries → 1,531 ideas, 4% redundant, perfectly healthy. (2) The LLM listed appearance
  pools (`bot_body`, `bot_eyes`, `bot_pose`) as subject because the bot IS the subject; those are now
  filtered, since by Kevin's definition appearance is not the scene.
- **Real cost.** The earlier ~$140 estimate assumed purify-and-backfill. Expanding concept space on ~50
  pools is closer to authoring new pools and will cost more. Re-estimate after the one-pool trial.

## 6f. RESUMED PILOT 2026-09-23 — the in-place repair that landed

Kevin's answers that set the scope: same pool, resume it; all colours welcome, not only pastel; stay
within the motif and increase variety within it. Tool: `scripts/repair-flower-focal-cluster.js`.
Commit `e672068b`. Full ledger: `SEED_POOL_REPAIR_HANDOFF.md` §9.

**What "the same" means for this pool, stated once.** An entry is a flower line-up (its 5-6 species).
Two entries are the same line-up when they share 4 or more species; the first of each line-up in pool
order is the kept original. Every figure below uses that basis. It is pool-specific: the next pool needs
its own definition before any number is quoted.

| measure (basis above)               | before  | after   |
| ----------------------------------- | ------- | ------- |
| entries                             | 125     | 125     |
| distinct line-ups                   | 44      | 125     |
| max species shared by any two       | 5       | 3       |
| flower species                      | 39      | 154     |
| entries with daisies                | 100     | 30      |
| colour families                     | 7       | 9       |
| rich-colour entries (rest pastel)   | 0       | 40      |

**Method (what transfers to the next pool).**

1. Parse every entry into its varying element (here: species keys, with aliases so alchemilla and
   lady's-mantle are one flower). Group by the pool-specific "same" rule. Keep the first of each group.
2. Plan the rewrites: fill the families the pool is short of, evenly; alternate registers.
3. **Assign the varying element before the LLM writes** (row 20): a roster of real items with real
   attributes, least-used first, per-item cap, and a pairwise rule (≤2 shared with every other entry).
   The LLM only words the assignment in the pool's exact format and gets the assignment back as a check.
4. Check reality with a second LLM call (here: does that flower grow in that colour, hue family only,
   "when in doubt, true"). The first attempt with Haiku rejected real colours; Sonnet with a hue-family
   question is right.
5. Dry run writes a proposal + report; a review page shows every before/after pair; only then
   `--execute`, which backs up outside the repo and asserts count and format.
6. Force renders across the NEW entries (picker proxy on the subject slot), shadow-posted, reviewed in
   the app. Unforced renders test the old pool (§6e).

**What the renders showed.** Batch 1 (3 forced, old template): the entry's flowers reached the prompt
on 2 of 3, the entry's register words on 0 of 3, and the third render's flowers were replaced by the
template's own STRICT species roster. Batch 2 (8 forced, after the template's second pass, row 22): the
entry's flowers led the scene on 8 of 8 and the register phrase reached the Flux prompt on 8 of 8. On
the picture: the rich register visibly lands where the family is a strong Flux colour (pink, red,
multi: saturated and family-dominant); blue and white "rich" read only mildly stronger than pastel; and
**green did not render green in any of its 3 renders** (both registers, both templates): the companion
species' own colours win, the flower×colour render-prior lesson of the playbook. Pollinators: one tiny
butterfly in 11 renders, the pre-existing prompt-order defect of §6e (unchanged by this work, still a
separate job).

**Known imbalance, not fixed.** The register alternated by slot parity and the family rotated by slot
index, so register and family came out coupled: orange and yellow rewrites are all pastel, blue and
white rewrites all rich, green 12 rich / 1 pastel, red 12 pastel / 1 rich. Decouple them on the next
pool (roll register per family) or fix here with a small follow-up pass.

## 7. Open questions for Kevin

1. **Is 100 distinct ideas the bar for every scene pool, or should hot pools go deeper?** A pool drawn
   by 11 paths is consumed far faster than one drawn by a single path. 100 may be right for the latter
   and thin for the former.
2. **Purify the 46 worst pools first, or do one bot end-to-end?** Worst-first fixes the most visible
   repetition soonest; bot-first means a whole bot is verifiably clean and can be spot-checked in the
   app.
3. **Rewrites change live content.** These pools feed bots posting twice a day right now. Do you want
   to review a sample of rewritten entries per bot before they ship, or is the audit passing enough?
