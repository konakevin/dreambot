# Nightly outfit variety: no more outfit lock (plan of record, 2026-09-30)

Kevin, 2026-09-30, after two of five test nightlies put him in the same navy brass-button jacket: "we absolutely do
not want outfit lock or freeze due to certain settings or biomes". Approved: "go ahead with that plan, plan it first so
you address all corner cases and have a clean architecture guidance going into it".

## The problem, measured

Eight nightly dry runs per place, Kevin's own character, text only (`~/.dreambot-qa/llm-tuning/outfit-probe-*.json`):

| Outfit source                    | Variety                                                                                                                                                                               | Fits the place                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Today (a rolled look, no colour) | Low. Key West 8/8 linen camp-collar shirt + shorts or trousers in sage / cream / sand; Myrtle Beach the navy brass-button jacket 3/8 and one camp-collar-plus-board-shorts outfit 4/8 | yes                                                               |
| Look roll off (the model picks)  | high                                                                                                                                                                                  | no: ~7/16 wool overcoats, gloves, a Victorian longcoat on a beach |
| Roll off + a climate rule        | low again: one tropical-print outfit 5/16 near-verbatim, one linen outfit 4/16                                                                                                        | yes                                                               |

Causes (the real outfit roll run 4,000× per case):

1. **Thin pools per place.** 23 men's looks in all, but only 3-4 fit a beach and 3 the outdoors; a city gets 11.
2. **The favoured-look rule.** A spot naming a look's theme takes that look 85% of the time (`AFFINITY_PCT`):
   a pier, harbour, lighthouse or boat → "nautical" 89% for men.
3. **No colour or cut on nightly.** The look is one outfit ("a double-breasted jacket with brass buttons") and the
   model paints it in the place's default palette. Create has a colour, cut and pattern roll (`planOutfits`);
   nightly never got it ("Nightly has no colour roll", nightly-dreams).
4. **No memory.** Places, looks of the render and vibes avoid the last 7 nightlies; outfit looks do not.

A model left to choose converges on its own default outfit per place (measured above), so the answer is authored
variety the model is told to use, not less of it.

## Done when

- Variety: at a fixed place, 8 dry runs give ≥ 7 different outfits (look + lead colour), and the wardrobe text names
  the rolled lead colour in ≥ 80% of people.
- Fit: 0 climate misfits in the probe (no wool / overcoats / gloves on a beach).
- No regression, measured on renders with the switch forced on: couple first-try face-swap hold within 2 points of
  today (5.5: 36/40), scenery score not lower (the round-1.1 lesson: longer outfit text made backdrops plainer).
- Kevin's eye on a 5-dream batch.

## Architecture

1. **One outfit roller for both surfaces.** Nightly calls `planOutfits` (outfitPlan.ts, Create's) with an empty user
   spec, instead of `rollFashion` alone. The slot pipeline already consumes `outfitPlan` end to end: people matched by
   role (left/right flip-safe), the scene-fit brief, the never-basics rule, wide-leg slimming on a rolled garment.
2. **Two knobs on the look roll** (`FashionRollOptions` → threaded through `OutfitRollConfig`):
   - `favouredPct` replaces the constant `AFFINITY_PCT` (0.85). Default 30 from config. Applies to Create too (the
     same lock).
   - `recentLooks`: role → look keys to skip. Filtered out of the fitting pool, **never emptying it** (an all-recent
     pool falls back to the full fitting pool). Nightly only.
3. **Config** (`engine_config`, one migration, all live-tunable, no deploy):
   - `nightly_outfit_plan boolean default false`: the switch (QA: `force_outfit_plan`).
   - `outfit_favoured_look_pct int default 30` (both surfaces; 85 = the old behaviour).
   - `nightly_outfit_recent_looks int default 5` (how many recent nightlies' looks to skip; 0 = off).
   - Colour / cut / pattern rates reuse `create_outfit_independent_pct`, `create_outfit_separate_cut_pct`,
     `create_outfit_pattern_pct` (one tuning for both surfaces).
4. **Recent looks cost no query.** The nightly already reads the user's last 7 logs for places / mediums / vibes;
   add `fallback_reasons` to that select and parse `garment_roll:<role>:<family>:<look>`.
5. **Stamps.** Keep `garment_roll:<role>:<family>:<look>` in the same format (the memory and reports read it), and add
   `outfit_plan:nightly`, `outfit_colour:<role>:<lead>[/<accent>]`, `outfit_cut:<role>`, `outfit_pattern:<role>:<…>`,
   and `look_recent_skip:<role>:<n>` when the memory removed looks.

## Corner cases

| Case                                                          | Behaviour                                                                                                                                                 |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Holiday scenario row (Halloween / Fall couples)               | **Unchanged** (today's looks path): the row's attire is the colour + texture anchor; a rolled palette would fight the festive palette                     |
| Day-of costume lock                                           | Unchanged: the costume decides (not rollable today)                                                                                                       |
| Imagined world with its own wardrobe (bespoke biome WARDROBE) | Unchanged: not rollable                                                                                                                                   |
| Elegant / active scenario rows with authored attire           | Unchanged: not rollable                                                                                                                                   |
| Scenario row with generic attire ("everyday clothes")         | Plan applies                                                                                                                                              |
| Kit settings (sport, snow)                                    | No look (existing rule); colour + cut still roll (a snow shell in a rolled colour)                                                                        |
| Unknown gender                                                | Colour + cut roll; no look                                                                                                                                |
| Couples                                                       | Colours coordinated (one pair split between them) or independent 50/50; a shared themed look 50% (existing); the partner never mirrors the other's colour |
| Solo                                                          | Lead + accent colour, a cut, maybe a pattern                                                                                                              |
| Couple swap fails → solo rebuild                              | Uses the wardrobe already written for self; the plan is not re-read (verified: `assembleSoloFallbackFromDual`)                                            |
| Pets, pure scenes, embodied Dream Art                         | No slot outfit → untouched                                                                                                                                |
| Redream, capacity retry                                       | A fresh roll per render (fine)                                                                                                                            |
| Parallel batch (a 5-dream test)                               | The memory can't see siblings in flight; the colour roll still separates them                                                                             |
| Pool starvation                                               | The memory never empties a pool (falls back to the full fitting pool)                                                                                     |
| 5.5 outfit-length fix (~12 words per outfit, mig 584)         | Colours + cut must fit in ~12 words: measure "lead colour named"; if low, adjust that 5.5 overlay's wording, never the length                             |
| Scenery                                                       | Outfit text length made backdrops plainer in round 1.1: the render check measures scenery                                                                 |
| Create                                                        | Only the favoured rate changes (30%); Create has no memory (the user drives it)                                                                           |
| Switch off                                                    | Nightly slot prompts byte-identical to today (slot golden test)                                                                                           |

## Tests (fast lane)

- outfitPlan: `favouredPct` 0 never forces the favoured look, 100 always does, default = config; `recentLooks` skips,
  never empties the pool, both genders.
- Nightly wiring (source guard): with the switch on, the slot input carries `outfitPlan`, not `fashionLooks`, except on
  holiday rows; the stamps are emitted; recent looks parsed from `garment_roll:`.
- engineConfig parses the three fields with their defaults.
- Existing: slot golden unchanged with the switch off; the kept-overlay guard.

## Rollout

1. Build + tests + deploy with the switch off (nothing live changes except the favoured rate, 85 → 30).
2. Dry-run probe with `force_outfit_plan` at the same places: variety, colour named, misfits.
3. Render check with the switch forced on, Kevin's account: 12 couples + 6 solos → first-try hold, scenery.
4. Switch on (`nightly_outfit_plan = true`), then Kevin's 5-dream batch through the queue.

Rollback: `UPDATE engine_config SET nightly_outfit_plan = false` (and `outfit_favoured_look_pct = 85` for the old
favoured rate), no deploy.

## Phase 2: more looks where the pools are thin (2026-09-30)

Kevin, after the switch-on batch: "look into any other wardrobe pools that might also benefit from expansion similar to
beach and outdoor looks. we want dreams to look really good, with lots of cool outfits".

**Where nightlies happen** (21 days of nightly renders): unclassified places 32% (they take the city looks), outdoors
25%, beach 19%, city 11%, evening 5%, indoor 4%, snow 3%, imagined worlds 1%.

**Looks that fit each place today** (not counting looks a named place unlocks, like nautical or western):

| Place    | Men                                                             | Women                                                                               |
| -------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| city     | 11                                                              | 15                                                                                  |
| beach    | **3** (resort, coastal, surf: two of them camp-collar + shorts) | 6, but only dresses, skirts and shorts roll (trousers and jumpsuits have < 2 looks) |
| outdoors | **3** (safari, coastal, explorer)                               | **5**, jumpsuits never roll                                                         |
| evening  | 5                                                               | 7                                                                                   |
| indoor   | 7                                                               | 12                                                                                  |
| imagined | **3**                                                           | 7                                                                                   |
| snow     | **0** (kit rule: no look at all)                                | **0**                                                                               |

The beach and outdoors cells cover 44% of nightlies with 3 men's looks each, which is why men at the beach kept coming
back in a camp-collar shirt and shorts.

**New looks** (authored, same rules as every look: signature pieces only, no colour words, no basics, no face
coverings, nothing traditional or ethnic; all `sceneFitOnly`, so the scene-fit-off pool is unchanged). A shared key
lets a couple match (the existing 50% themed roll):

| Place    | Men (new)                                                                                                                      | Women (new)                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| beach    | riviera (knitted polo, rolled trousers), poolside (1970s terry-cloth shirt), barefoot tailoring (linen suit), co-ord set, boho | riviera (halter), co-ord set, tropicana (knotted waist, shell earrings) → trousers + jumpsuits roll |
| outdoors | boho, equestrian, country estate, desert wanderer, cottagecore                                                                 | equestrian, field explorer, prairie, utility boiler suit, desert wanderer, country estate           |
| evening  | film noir, velvet evening, runway couture, barefoot tailoring                                                                  | film-noir glamour, velvet evening                                                                   |
| imagined | cottagecore, runway couture, woodland fae, ocean-myth shimmer                                                                  | (7 already)                                                                                         |
| snow     | après-ski, 1970s ski, ski-lodge cosy, alpine mountaineer                                                                       | après-ski glamour, 1970s ski chic, chalet chic, ski-lodge cosy, winter romance                      |

After: men's beach 8, outdoors 8, evening 9, imagined 7, snow 4; women's beach 9 (all but coats roll), outdoors 11
(jumpsuits roll), snow 5.

**Snow stops being a kit setting.** Today a snowy place gets no look and the model writes its one default (a fitted
ski suit or shell, a beanie). Snow now rolls snow-only looks, which are all real snow wear made stylish, and the
brief's "gear the activity needs wins" line still covers someone mid-run on the slopes. Garment nudges in snow: no
shorts, no bare dress, more jumpsuits (ski suits), trousers and coats over dresses. **Sport stays kit** (a golf course
dresses golfers).

**Corner cases**

- Hot vs cold outdoors: the brief already says "dress for the place first … leave out any part of the look that would
  look out of place here", and the outdoors pool keeps warm-weather looks in the majority. The probe checks a desert
  and a jungle for a jacket misfit.
- Create uses the same catalog with scene fit on, so Create gets the new looks too (checked in the dry run).
- A look with its own pattern (stripes, Fair Isle) would clash with the pattern roll: left out on purpose.
- Nothing that hides the hair (headscarves): cast hair is part of the likeness.

**Tests:** the existing catalog guards (colour-free, basics-free, occluder-free, families real, ≥ 2 looks per rolled
family, every look setting has a choice) cover the new entries; new tests: men ≥ 6 looks at beach and outdoors, snow
rolls only snow looks and never shorts or a bare dress, sport still rolls nothing, shared-key couples can match at a
beach, and a scene-fit-off roll never returns a new look.

**Rollout:** unit tests → nightly dry-run probe with the plan forced (Key West, Myrtle Beach, Zion, a jungle, a ski
village, an evening city; 8 each: distinct men's garment types, misfits) → render check (8 couples at beach, outdoors
and snow places, first-try hold) → deploy (no switch: the catalog is code; rollback = revert the commit).

## Ledger

| Date       | Step                                                                                                                                                                                                                                                                                                          | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-09-30 | Probe (above)                                                                                                                                                                                                                                                                                                 | today: low variety; roll off: misfits; roll off + climate rule: low variety again                                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-09-30 | Built (switch off): `planOutfits` on nightly, `favouredPct` + `recentLooks` in the look roll, `recentLooksFromStamps`, config mig 585, QA `force_outfit_plan`, Create gets the favoured rate; tests `outfitAntiLock` (+ flag); 255 suites green; 6 functions deployed                                         | live change now: the favoured rate 85 → 30 on both surfaces                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2026-09-30 | Probe, plan forced on (Key West + Myrtle Beach × 8)                                                                                                                                                                                                                                                           | 16/16 different outfits (look + colour), rolled lead colour named 16/16, nautical 0/16, misfits 0/16. Still one garment type for men at a beach (camp-collar shirt + shorts: the pool has 2-4 looks there) → the "later" pool item                                                                                                                                                                                                                                             |
| 2026-09-30 | Render check, mixed scenes (12 couples + 6 solos, plan forced)                                                                                                                                                                                                                                                | the plan applied to 3/18: Fall / Halloween rows and authored-attire scenes keep their own outfits by design; the 3 were clean first try; couples overall 10/12 (the 2 misses were non-plan renders: a giant face, a weak likeness)                                                                                                                                                                                                                                             |
| 2026-09-30 | Render check, plain places (8 couples, plan forced)                                                                                                                                                                                                                                                           | 8/8 first-try clean; plan applied 4/8; all 7 plan renders across both checks clean                                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-09-30 | **Switched ON** (mig 586, `nightly_outfit_plan = true`) + Kevin's 5-dream batch through the queue                                                                                                                                                                                                             | 5/5 clean; 5 different outfits (lilac linen at the surf, varsity + leather in autumn, burgundy dress by a hearth, navy blazer + roll-neck, cornflower shirt at a neon harbour); 2 rolled a colour plan, 3 were Fall / holiday rows on the tuned looks path                                                                                                                                                                                                                     |
| 2026-09-30 | **Phase 2 built + deployed** (62825be4): 31 new looks (men beach 3 → 8, outdoors 3 → 8, evening 5 → 9, imagined 3 → 7, snow 0 → 4; women's beach rolls trousers + jumpsuits, outdoors jumpsuits, snow 5), snow off the kit list, setting dress text broadened                                                 | 259 suites green                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 2026-09-30 | Probe (6 places × 6 couples, dry run)                                                                                                                                                                                                                                                                         | beach: men in 5 different looks (crochet boho, Riviera polo + rolled trousers, co-ord set, linen suit, camp-collar) instead of one; snow: chalet coat, après-ski, 1970s one-piece, lodge knit, mountaineer parka. **Misfits found**: a place with no card read as "unknown" → city looks (a metallic mini dress on a Zion canyon trail, riding breeches at a rooftop bar)                                                                                                      |
| 2026-09-30 | Place-type fixes (deployed 07:31)                                                                                                                                                                                                                                                                             | riding (equestrian), field-jacket (country estate) and shorts-set (co-ord) looks off the city list; a wild landmark name (canyon, jungle, gorge, pyramid, ruins, grove) now overrides a beach or unknown card too, not only a city card (Cobá's jungle pyramid had rolled 1970s poolside swim shorts); new indoor / street / outdoor words take Halloween rows from 881 → 518 unclassified and Fall 469 → 404 (firehouses, hotel lobbies, cul-de-sacs, corn mazes, graveyards) |
| 2026-09-30 | Autumn looks (deployed 07:39): 4 per gender (autumn knits, cosy layers, 1970s suede, harvest romance), unlocked only when the scene names autumn (pumpkins, orchards, cider, hayrides, foliage; never the bare "falls"), so the Fall rows that make up most of this season's nightlies get their own wardrobe | in an orchard a woman rolls one ~50% of the time at the production favoured rate                                                                                                                                                                                                                                                                                                                                                                                               |
