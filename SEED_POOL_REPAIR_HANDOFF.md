# Seed pool repair — handoff

**Written 2026-09-23 by the agent that got this wrong, for the agent picking it up.**

Read this whole file before touching a pool. The objective is sound and the diagnosis is largely
sound. The *method* I built is wrong and was reverted. Most of the value here is in not repeating it.

**UPDATE 2026-09-23, later session: the pilot pool was repaired in place and committed (`e672068b`).
§9 at the bottom records what was done, the numbers with their basis, and what the renders showed.
§5 and §7 are updated to match; the rest of this file is left as written.**

---

## 1. The objective, in Kevin's words

> "I have witnessed myself that the bots start to feel repetitive after a few weeks, I'll see very
> similar posts or scenes I think I've seen before — so that's what I'm trying to fix … less
> repetition."

> "All seed pools should be at least 100 deep for 'scene' pools … I want deep, diverse pools so that
> bot posts are always unique and fresh across a time window."

> "We should not just throw out what's there outright, but instead just make them actually distinct
> in idea, then backfill any that lost too many after purification so that they are actually unique."

> "We need to be extremely careful doing this btw, dry-run before actually mutating the pools is
> necessary to validate what we think will happen. And then when we backfill, again, need to be
> careful so that the new seed pool entries are correct."

### Scope, which Kevin had to restate about ten times

**SUBJECT pools only.** The subject pool is the one whose entries state what the render is OF — the
place, scene, creature or object that is the point of the picture.

> "A seed pool is the collection of seeds that make up a scene for a given path. It's what drives the
> whole render scene and subject matter. We then pass axis to the render, and I think you're
> conflating axis seed pools with 'idea'/'setting' seed pools."

> "I've been stating this for about 10 tries now, I said I wanted to focus on the subject pools."

**Out of scope, do not touch:** axis pools (lighting, palette, camera/framing, weather, atmosphere,
composition, mood, look register, medium) and appearance pools (eyes, skin, hair, outfit, adornment,
regalia). A repeated camera angle is invisible to a viewer.

Also out of scope: dark/private bots (AlphaBot, MechBot, OutlawBot, RetroBot) — they post to nobody.

---

## 2. THE RULE I BROKE — read this twice

**A pool repair must not change what the pool IS.**

Keep its intent, its subject matter, its register, its format, its prompt prefix. The job is to read
the pool's own intent and add entries of exactly that kind which are genuinely distinct from each
other and from what is already there.

What I did instead: I invented a **category scheme** and generated entries to fit my scheme. For
`flower_focal_cluster` I authored 20 categories — peach/mint/taupe hues, spire/globe/frill/disc/
trumpet/umbel/climber forms, early-spring/late-autumn seasons, dew-laden/bud/seed-head states,
woodland/coastal/alpine/cottage habitats — and generated against them.

Kevin, verbatim:

> "Don't fucking change the fabric/essence of a pool while working to fix it … you're introducing
> variables that we can't then control or test because you're fucking with the prompt prefix and
> nature of the pool, then rewriting it to bend to that … I'm confused why you can't just keep the
> original intent of the pool and fucking try to fill it with unique entries, why did you rewrite it?"

**Why it is wrong beyond taste:** it makes the work untestable. If you change the pool's structure and
its contents at once, and the renders then look different, you cannot say whether the pool got more
diverse or you simply changed what the path renders. One variable at a time.

`scripts/reseed-subject-pool.js` is built entirely around the category method. **Do not run it as-is.**
Rewrite or delete it.

---

## 3. What is actually wrong with the pools

Two distinct defects produce the same symptom.

**a. Redundant** — the same idea written several ways. The clearest real example, from
`faebot_flower_fairy_scale_prover`, nine entries differing only by an adjective:

```
"A painted giant magnolia-bloom as her painted bedchamber, painted broad cream-and-pink petals dwarfing her painted form…"
"A painted giant magnolia-bloom as her painted bedchamber, painted large cream-and-rose petals dwarfing her painted form…"
"A painted giant magnolia-bloom as her painted bedchamber, painted large cream-and-blush petals dwarfing her painted form…"
```

**b. Shallow** — hundreds of pools still sit at exactly 24-25 entries, the MVP-25 signature: seeded to
test a path, signed off, never scaled.

**Why redundancy is the symptom and not cycling.** Pool picks are a **true shuffle-bag**
(`botEngine.pickWithRecency`: every entry is drawn once before any repeat, reset on exhaustion). Nobody
sees the same *entry* twice inside a cycle. They see a *different entry describing the same thing*. A
200-entry pool holding 69 distinct ideas delivers 69 distinguishable renders, and at 2 posts/day that
exhausts in about five weeks — which matches "after a few weeks."

I previously ranked pools by shuffle-bag cycle length and proposed "+551 steampunk atmospheres" off
it. That was rejected and is wrong: a shuffle-bag cycling is **even coverage, not repetition.**

**Where to find the current worst offenders:** `npm run scan:bot-seed-dupes` already prints a per-bot
`idea_dup%` column and a NEAR-CEILING list (300 pools at ≥20% same-idea). Top of that list today:

```
74%  bloombot/bloombot_flower_humming_birds_hummingbird_cast (153)
66%  yumbot/kawaii_night_augment (200)
64%  pixelbot/pixelbot_epic_vista_sky_or_backdrop (200)
62%  earthbot/hawaii_flowers_subject (200)
61%  yumbot/festival_scene_type (200)
57%  faebot/faebot_queen_of_forest_biome (200)
56%  earthbot/coastal_vista_subject (200)
```

Note that list is not filtered to subject pools — check each one before working it.

---

## 4. ⚠️ The measurement is not trustworthy. This is the biggest technical finding.

`scripts/lib/ideaSimilarity.js` (Jaccard overlap on significant tokens) is **wrong in both
directions** on labelled real data. Locked in `__tests__/lib/ideaSimilarity.test.ts` — that test file
is good, keep it, it encodes the evidence.

- **Unstripped:** a rigid shared pool skeleton makes unrelated entries look duplicated.
  `faebot_flower_fairy_scale_prover` reads **28** distinct ideas raw vs **90** stripped. Same file,
  same threshold.
- **Stripped** (`formatTokens`, which removes tokens appearing in ≥ *share* of entries): near-duplicates
  score as maximally **different**. Near-duplicates share nearly all their text, so nearly all of it
  is classed as "format" and stripped, leaving only the words where they *differ* — which are disjoint.
  **The nine labelled magnolia duplicates never merge into one idea at any threshold down to 0.10.**

No choice of {threshold, stripping basis} gets both labelled cases right.

**Consequences you must carry forward:**

1. A `distinct` count is an **upper bound on diversity** = a **lower bound on redundancy.** The
   charter's fleet figures ("31,355 redundant", "154 subject pools under 100 distinct ideas") are
   **floors. Reality is worse.** Do not report progress as a delta between two of these numbers.
2. **Never quote a distinct/redundant figure without stating threshold AND stripping basis.** Those two
   choices moved one pool between 8 and 137 distinct ideas. I reported three different numbers for a
   single change because of this (see §6).
3. **The lexical measure cannot be the acceptance gate.** Use it as a free deterministic prefilter and
   CI tripwire. Kevin already approved LLM spend for judging uniqueness: *"if we need to use AI as a
   massive pass to go through and figure out what's unique and what isn't, we could do that too …
   worth the expense to get the pools cleaned up and topped off with actually unique ideas."*
4. **Threshold mismatch, unfixed:** `reseed-subject-pool.js` clusters and validates at **0.48**;
   `ideaSimilarity.SAME_IDEA` is **0.60**; `audit-seed-redundancy.js` uses the constant. The repair
   tool and the fleet audit have been grading pools on different scales. Unify before rollout.

---

## 5. Current state of the tree

| thing | state |
| --- | --- |
| `scripts/bots/bloombot/seeds/bloombot_flower_friends_flower_focal_cluster.json` | **repaired in place, commit `e672068b`** (see §9): 125 entries, 44 originals kept verbatim, 81 near-copies rewritten. Before that it was reverted to its original 125 (`8886dd88`, byte-identical to `740eb03c`). |
| Backup of that pool | original 125: `~/poolbackup-bloombot-flower_focal_cluster-1790213976305.json` (taken by the repair tool right before the write; the older `~/poolbackup-bloombot-BLOOMBOT_FLOWER_FRIENDS_FLOWER_FOCAL_CLUSTER-1790203792485.json` is the same 125) |
| `scripts/repair-flower-focal-cluster.js` | **the tool that did the repair.** Dry run by default, `--execute --from <proposal.json>` writes after a backup. §9 describes it. |
| `a0d1b387` | the bad work: 74 category-generated entries, plus the charter rewrite and the new test. Pool part reverted; charter and test still in tree. |
| `scripts/lib/ideaSimilarity.js` | keep. Header now documents both failure modes honestly. Has a new `clusterPool(…, {formatFrom})` option for fixed-basis comparison. |
| `__tests__/lib/ideaSimilarity.test.ts` | **keep.** 12 tests, all pass, locks both failure modes. |
| `scripts/reseed-subject-pool.js` | **deleted 2026-09-23** (it was built on the category method). `scripts/repair-flower-focal-cluster.js` replaces it. |
| `scripts/identify-subject-pools.js` + `SUBJECT_POOL_MAP.json` | useful. An LLM reads each path file and names its subject pool. 715 subject pools resolved, ~66 unresolved (mostly ChibiBot `creature*` slots). Classifying by filename or slot name does NOT work — no naming convention exists, and FarmBot's 34 paths and TinyBot's 18 are function-form with no slot map at all. |
| `scripts/audit-seed-redundancy.js`, `SEED_REDUNDANCY_AUDIT.md` | numbers are floors per §4. |
| `scripts/audit-pool-repeat-risk.js`, `POOL_BACKFILL_AUDIT.md` | **RETRACTED** as a work list (the cycle-length error). Both carry the retraction in-file. |
| `SEED_DIVERSITY_CHARTER.md` | mixed. §1-§3 objective/diagnosis good. §4 targets carry a warning banner. §6e documents the first pilot; its "Method being proved" section is struck and §6f records the resumed pilot's in-place method. |
| 6 shadow renders | in `uploads`, `recipe->>path = 'flower-friends'`, `is_public=false`/`is_posted=false`. HTML sheet at `~/Desktop/flower-friends-pilot-renders.html`. Only **1 of 6** drew a new seed, so they tested the old pool. |
| `scripts/_tmp-ff-forced-newseeds.js` | **deleted 2026-09-23.** The interception it used (a picker proxy on `pickWithRecency` for the subject slot) was verified separately: the forced entry reaches the brief, and `runBot`'s dry-run return simply omits the brief text. The verified forced-render harness lived in the session scratchpad; §9 gives the recipe. |

Untracked `scripts/_tmp-*.js` files in the tree belong to other efforts. Leave them alone.

---

## 6. Everything I got wrong, so you don't repeat it

1. **Invented a category scheme instead of filling the pool** (§2). The core error. Reverted.
2. **Reported three different distinct-idea numbers for one change** — "8 ideas / 94% redundant", then
   "63 → 130 ideas, 50% → 5%", then a "correction" that was itself wrong. All three were real outputs
   of the same tool at different threshold/basis settings, quoted without naming the settings.
3. **Fabricated a causal mechanism.** I probed the repaired pool with my *first-draft* category list
   (which had bold/tropical/dark/night in it), forgot I had replaced that list, found zero matches, and
   told Kevin my design-conformance gate "suppressed exactly the boldest categories." It hadn't — those
   categories were never generated. The run log was right there and said the real rejection reason was
   131× "same as another new entry". **Verify a mechanism before asserting it.**
4. **Over-generalised one path's data into a fleet law.** Claimed emitted prompt length predicts render
   grade, from 15 renders, and put it atop Kevin's grading sheet. Tested across all 25 graded paths:
   r = -0.18 pooled, **-0.05 bot-centred**. Retracted.
5. **Ranked pools by shuffle-bag cycle length** and proposed "+551 steampunk atmospheres" (§3).
6. **Conflated axis and subject pools repeatedly**, after being corrected many times.
7. **Over-produced per category** — 10 entries per category meant 131 of 200 were rejected as "same as
   another new entry", and about a third of what survived was recombination within its own category
   (the alpine entries all naming edelweiss + saxifrage + stonecrop). If a rewrite ever does use
   batches, keep them small.
8. **Let an invented colour through** — "pale-turquoise scabiosa", "pale lime-green zinnia". No such
   cultivars. Same class as the FarmBot literal-hue-word bug.
9. **Talked far too much.** Kevin, twice: *"would you fucking talk simple, you spam out too much
   fucking text"* and *"stop talking so god damn much and just state things simply."*

---

## 7. One real, unresolved question about `flower_focal_cluster`

**RESOLVED 2026-09-23.** Kevin: same pool, resume it; all colours are welcome, it does not have to be
only pastel; stay within the motif but increase variety within it. So the rewrites span 9 colour
families (adding red and green) and about a third carry a "rich clear watercolor register" alongside
the pastel majority. The archetype's pastel-only mandate was then loosened in a separate second pass so
the entry's own register decides (§9). The original reasoning is kept below.

Do not act on this without Kevin. It is a pool-intent call, not an inference.

The path header says:

```
pink-purple-cream-coral palette in the refs, but ALL flower colors welcome here.
```

The archetype (`scripts/bots/bloombot/archetype-templates.js:108,115-117`) says:

```
SOFT PASTEL color register (varied across the FULL color spectrum, not biased
toward pinks/purples/reds)
━━━ COLOR REGISTER — SOFT WATERCOLOR PASTEL (MANDATORY) ━━━
Every visible flower is rendered in a SOFT PASTEL color register — soft
watercolor hues, NOT vivid saturated jewel-tones.
```

So the mandate is on **saturation** (pastel, never jewel-tone — line 248 says saturated jewel-tone is
`flower-humming-birds`' territory, not this path's), while **hue** is explicitly supposed to span the
full spectrum and explicitly should *not* be biased to pinks/purples.

**The existing 125 entries are biased** — dominated by powder-blue, pale-violet, lilac and blush.
So by its own archetype the pool has a real hue gap.

But widening hue is still a change to the pool's character, and Kevin's instruction is to fill the pool
without changing it. **Ask him** whether "fill it with unique entries" includes pastel hues the pool
currently lacks (pale yellow, pale gold, pale apricot, ivory/white, pale green), or strictly means more
entries within the blues-violets-blush range it already occupies. I guessed at this once already and
guessed wrong in the other direction.

---

## 8. Recommended approach for whoever picks this up

1. **Pick one pool. Read all of it.** Determine its intent from its own entries plus the path header
   plus the archetype template. Write that intent down in one paragraph and confirm it with Kevin
   before generating anything.
2. **Generate more of exactly that kind.** No new axes, no category scheme, no register change, no
   prompt-prefix change.
3. **Enforce uniqueness with an LLM judge**, pairwise against existing entries and against the other
   new entries. Lexical similarity is a prefilter only (§4).
4. **Dry-run and show Kevin a sample before writing.** He asked for this explicitly.
5. **Back up the pool file before any write**, keep every original entry, and never let a pool come out
   shallower than it went in.
6. **Judge on renders, forced across the NEW entries.** An unforced batch is worthless: with 74 of 137
   entries new, 6 unforced renders drew 1 new seed. Force the picker (intercept
   `picker.pickWithRecency(pool, axis)` on the subject slot — `brief-composer.js` passes the slot name
   straight through) so every render exercises a new entry.
7. **One variable per round.** Measure delivered, not intended.

### Hard rules that apply to this work

- Render batches: **concurrency ≤3**, gate on `node scripts/check-pool-headroom.js` first, avoid the
  top-of-hour and ~08:00 UTC windows. Each edge-fn render holds a Postgres connection for 20-150s and
  saturating the pool takes the whole app down.
- **Never an unscoped delete on `bot_seeds` / `nightly_seeds`.** Scope by category prefix.
- Test renders post as **shadow** (`is_public=false`, `is_posted=false`) so Kevin can see them in the
  app. HTML sheets are also fine.
- **Never `git add -A`.** Explicit paths only; read the staged diff before committing. Shared tree.
- Re-read `BOT_SCENE_QUALITY_PLAYBOOK.md` in full before any bot work, and update it with new lessons.

### Do NOT

- invent categories, axes, or a structure for a pool
- change any pool's prompt prefix, register, format or subject matter
- delete original entries to improve a percentage
- quote a distinct-ideas or redundancy figure without its threshold and basis
- touch axis or appearance pools
- chase the `flower-friends` pollinator bug as part of this task — it is real (the co-hero insect is
  named at 52-59% of every prompt, past the attention region, so it is invisible in 5 of 6 renders; the
  fix is prompt ORDER, and "co-hero" is in all 125 original entries so it predates this work) but it is
  a separate job

---

## 9. What was done 2026-09-23 (resumed pilot), by the agent that picked this up

**Kevin's answers** to §7 and to the open scope questions: same pool, resume it; all colours welcome,
not only pastel; stay within the motif but increase variety within it.

**Method: rewrite the near-copies in place.** `scripts/repair-flower-focal-cluster.js`.

- A "line-up" is an entry's set of flower species (parsed from the "X + Y + Z blooming together" list,
  with aliases so alchemilla and lady's-mantle count once). Two entries are the same line-up when they
  share 4 or more species (greedy, pool order). The first of each line-up is kept verbatim.
- Every other entry is rewritten in place. Its species are assigned BEFORE Sonnet writes, from a roster
  of ~150 real flowers with their real hue letters, least-used first, per-species cap 6, and a pairwise
  rule: ≤2 species shared with every other entry. Sonnet only words the assignment in the pool's exact
  format and is checked against it (missing or extra species = reject). A second Sonnet call checks
  each colour is one the flower really grows in (hue family only, "when in doubt, true"; Haiku rejected
  real colours). The Haiku same-idea judge is advisory on this pool (it reads same colour family as
  same idea); its notes are stored on the change.
- Colour families filled evenly over 9 (adds red and green); registers alternate, ~1/3 "rich clear
  watercolor register", the rest "soft pastel watercolor register".
- Dry run wrote a proposal + report; Kevin reviewed every before/after pair on a page
  (https://claude.ai/artifact/KrvnYYwyTod7xBLufC6Tbn) and approved; `--execute` backed the pool up to
  `~/poolbackup-bloombot-flower_focal_cluster-1790213976305.json` and wrote it. Commit `e672068b`.

**Numbers, basis as above:** 125 → 125 entries; 44 → 125 distinct line-ups; max species shared by any
two entries 5 → 3; 39 → 154 species; daisies in 100 → 30 entries; 7 → 9 colour families (13-16 each);
rich-register entries 0 → 40. Two kept originals still carry an invented colour ("pale-turquoise
scabiosa", #4 and #25); Kevin was told and left them.

**Second pass, the template.** Forced renders of the new entries under the old `BLOOMBOT_FLOWER_FRIENDS`
template showed the pool alone changes little: the entry's register words reached 0 of 3 Flux prompts,
the template's own "soft pastel magical light" reached all 3, and on 1 of 3 Sonnet replaced the
entry's flowers with the template's STRICT species roster (the template injected BloomBot's rolled
florist palette and roster AFTER the entry). The template now defers to the entry: the pastel-only
block and the pool-of-25 colour distribution mandate are gone, the colour register is "set by the
flower entry" with one line per register, the light and background wash tie to it, the STRICT palette
and roster blocks are removed, and the STRUCTURE block asks for the entry's flowers with their colours
first and the register phrase ("soft pastel colours throughout" / "rich clear saturated colours
throughout") in the prompt. After: entry flowers led 8 of 8 forced renders, register phrase in 8 of 8.

**Renders, 11 forced shadow posts (3 before the template change, 8 after), reviewed in the app.** Rich
lands where the family is a strong Flux colour (pink, red, multi). Blue/white rich read mildly stronger
than pastel. Green never rendered green (3 of 3): companion species' priors win. One tiny butterfly in
11: the pollinator defect above, untouched.

**Forced-render recipe** (the harness lived in the session scratchpad; rebuild in five lines): wrap
`bot.buildBrief` so that for `path === 'flower-friends'` it passes a picker proxy
`{ ...picker, pickWithRecency: (pool, axis) => axis === 'flower_focal_cluster' ? forcedText : picker.pickWithRecency(pool, axis) }`,
then `runBot({ bot, path: 'flower-friends', vibe: 'random', dryRun: false, post: true, shadow: true, source: 'iter-bot', label, idx })`
one entry at a time behind `waitForHeadroom({ min: 25 })`. Verified: the forced entry reaches the brief
(`brief-composer` passes the slot name straight through).

**Known imbalance, not fixed.** Register alternated by slot parity while family rotated by slot index,
so they came out coupled: orange and yellow rewrites all pastel; blue and white all rich; green 12 rich
/ 1 pastel; red 12 pastel / 1 rich. Next pool: roll the register per family. Here: a small follow-up
pass if Kevin wants it.

**What transfers to the next pool, and what does not.** The method (parse the varying element, define
"same" for that pool, keep the first of each group, pre-assign from a real roster, LLM words + LLM
reality check, dry run + review page + backup + execute, forced renders on NEW entries) transfers. The
parser, the roster and the "same" rule are pool-specific and must be written per pool.
