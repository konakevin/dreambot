# Nightly 2.0 Engine — plan

**Status: PROPOSAL, 2026-09-18 03:30 UTC. Nothing built, nothing changed. Written after the chain6 batch.**

Kevin, after 20 real nightlies on the current engine: "i feel like we literally need to rewrite our engine from
the ground up and pre-plan what directives an engine should follow … or is there a way to apply all of that to
our current engine? is it fixable?"

His directives, verbatim:

1. No close-ups of couples or singles. Every render has positive prompting for at least a 3/4 view of the body.
2. Every render shows a "cool" setting that is interesting to look at.
3. Every scene is full of lush, vivid details.
4. This is an AI app. The renders should all be imaginative and put the user in cool fantasy dreams.
5. Seed pools are all high quality. Nobody posts in front of a wall. The setting tells the story, so the pools
   must be well written and constructed.
6. A vast collection of seed pools and locations, so users can pick favourites and nothing gets repetitive.

Short answer: **it is fixable, and the rewrite he is describing is a rewrite of the composition layer, not of
the engine.** The plumbing built over the last three months (queue, Fly swap engine, image-ops, identity and
gender gates, stamps, the exact-path harness) is the part that works. What produces stupid renders is the layer
that decides WHAT to render and HOW to phrase it, plus two policy settings changed this week. Section 0 separates
this week's regression from the redesign, because the regression can be undone in an hour and the redesign
cannot be judged until it is.

---

## 0. Tonight, measured — the regression is separable from the redesign

Same harness, same account, real `dream_queue` nightlies (`scripts/qa-nightly-exact.js`), couple rolls only:

| round | date | couple rolls | delivered first try | delivered after retry | lost | faceless renders in the batch | model picked for couples | roll mode |
|---|---|---|---|---|---|---|---|---|
| r25 | 09-14 | 10 | 9 | 1 | 0 | 0 of 20 | flux 5 · gemini 4 · grok 1 | pool |
| post-looks-20 | 09-14 | 6 | 5 | 1 | 0 | 0 of 20 | flux 2 · gemini 2 · grok 2 | pool |
| bf50 | 09-18 | 8 | 6 | 0 | 2 | 3 of 20 | flux 7 · gemini 1 | weighted 85/15 |
| chain6 | 09-18 | 9 | 3 | 3 | 3 | 2 of 20 | flux 8 · gemini 1 | weighted 85/15 |

The solo share did not change: 11 of 20 rolled solo tonight, 14 of 20 on 09-14. "Every render is a single" is
the surface roll plus the three lost couples plus the fact that the couples that did land were bad.

Three causes, each visible in the stamps:

1. **The model policy went to 85/15 flux on 09-17** (ledger §6, set as part of the fallback-chain work). On
   09-14 the pool roll gave flux 2 to 5 of every 6 to 10 couples and 14 of 16 landed first try. Tonight flux
   rendered 15 of 17 couples and 9 of 17 landed first try. Every measurement in memory says the same thing:
   flux couples fail the dual swap on night vibes 1 in 10 where gemini and grok go 40 for 40, and flux ignores
   framing words. The policy did not create a new failure. It routed almost every couple to the model with the
   known one.
2. **Tonight's chain revision ("flux couple → flux couple again") burns the budget.** Render #19: flux render,
   no faces → flux again, a 0.64 giant face → solo on that render refused → `recover_budget_exhausted` at
   91 s → the gemini rungs never ran → `pure_scene_fallback` → `SHIPPED_FACELESS`. #20 identical. The frozen
   chain Kevin specified has gemini couple and gemini single before "nobody". As deployed, a second flux render
   eats the time those rungs needed, so the chain in practice is flux → flux → flux solo rebuild ×2 → nobody.
3. **`solo_rebuild_model` = flux-1.1-pro.** When the couple is lost, the solo rebuild retries the same model
   that just failed (multi-face, no face) twice, then ships faceless. Three of tonight's five faceless renders
   came from solo rolls, not couples.

Two more findings from the same batch that the redesign has to answer:

- **Race (#13, sunflowers, "it made me black").** The prompt carried "a White man … warm medium skin", but at
  character ~700, after the noir vibe ("hard slanted light, deep dramatic shadow") and a golden sunflower scene.
  The position-1 lock carries eye colour only ("BROWN-EYED MAN on the RIGHT"). Flux rendered a dark-skinned
  man; the swap keeps the target's skin. Memory says position 1 sets visual attributes reliably (eye colour
  proved it). The fix to test: skin tone in the position-1 lock, both people or neither.
- **Close-ups (#17 at 28 %, #18 at 39 % of frame height).** Under every guard. Both prompts said "from
  mid-thigh up". Flux does not obey framing text (probed 09-14, re-proved on all 20 prompts tonight). The
  0.35 composition gate went live at 02:59 with the batch already in flight; it treats a symptom (giant faces)
  and cannot make the setting the star.

**Restore point** for users while 2.0 is built: the 09-14 state, snapshot `nightly-states/v1.2.0-looks.json`,
policy roll = pool, chain = the 09-14 chain, `solo_rebuild_model` ≠ flux. Expected: couples ≥ 90 % delivered,
zero faceless (22 of 22 over three rounds on 09-14).

---

## 1. Kevin's directives, mapped to what each actually needs

| # | directive | what it really requires | what exists | what is missing |
|---|---|---|---|---|
| 1 | no close-ups, ≥ 3/4 body | a MEASURABLE definition and a gate: tallest face ≤ 0.20 of frame height, body visible to mid-thigh; a model that obeys framing; a swap that holds at 10–20 % faces | Fly `/detect` gives face boxes; the gate machinery (mig 525) exists; gemini/grok obey framing; the swap DID hold tonight at 10–15 % faces (solos #10 #12 #14 #15 identity 0.70–0.73, gemini couple #11 at 12 % identity 0.74/0.74) | a person-box measure for "3/4 body"; the gate set at 0.20 not 0.35; couples routed to framing-obedient models; the face-size floor measured per look |
| 2 | cool setting, the star | the place is the SUBJECT of the prompt: position 1 names the place and its two iconic details; the cast comes after the scene; the look after the place | 61 location pools, themed worlds with real landmarks, iconic-spot generator | the couple prompt is subject-first BY DESIGN for the swap (hard rule of 06-19). 2.0 inverts it and relies on the gate + obedient models instead of big frontal faces |
| 3 | lush detail | set dresser, costume, light, weather in every brief, the vibe fragment early, and PROOF each fragment reaches the prompt | all of it exists | under LOOKS_MINIMAL three of these reached 0 renders (the fix graveyard). 2.0 has one composer, no modes, and a harness test that fails when any fragment reaches < 100 % of prompts |
| 4 | imaginative fantasy dreams | a scene mix weighted to imagined worlds + one authored "dream-logic" beat per scene (an impossible element), never LLM-invented | fantasy/scifi/themed-world pools; Option B location actions | the weighting (tunable, ≥ 60 % imagined for cast renders) and the dream-logic pool |
| 5 | seed quality | a written seed spec (the 8 components), every enabled seed rewritten to it with a QA render, proximity scan, quarantine loop | playbook, proximity scan, red-X quarantine, 25-seed QA protocol | the spec as a CI-checked schema; `qa_render_id` on every enabled seed; the 453 water/submerged seeds reworded (option 4, list pending Kevin) |
| 6 | breadth + favourites | many worlds, user-pickable, and a no-repeat window | 61 pools + themed worlds; VibeProfile favourites (mig 218) | per-user no-repeat by scene family for N nights (extend `dedup_key`); "dream worlds" pickable in the Vibe Profile |

The structural conflict behind 1 and 2: **the dual swap was built to need big, frontal, separated faces, and the
prompt was bent to feed it.** Tonight's data says the Fly engine no longer needs that at 10–20 % faces when the
model obeys the framing. That is the single fact that makes 2.0 possible without a new swap.

---

## 2. Rewrite or fix? Keep the plumbing, replace the composition layer

**Keep** (works, measured this week): `dream_queue` + worker + lifecycle, Fly `face-swap-dual` (dynamic split,
big-face tier, 546-free), Fly `image-ops`, identity gate 0.35, gender + side checks, stamps + forensics, the
exact-path harness + `report.json`, `engine_config` tunables, the looks catalogue, the location pools.

**Replace**: the composition layer — `rollDream → recipeBuilder/sceneEngine → brief → prompt composer` with its
three modes (legacy / looks / LOOKS_MINIMAL) and the ~40 switches that let seven shipped fixes land on dead
paths. One new module, `supabase/functions/_shared/nightly2/`, behind `engine_config.nightly_engine = 'v1' | 'v2'`
with a per-user allowlist first (the mig-515 pattern), producing the SAME contract the render/swap/persist path
already consumes: `{ prompt, model, castRole, framingMeta, stamps }`. v1 stays frozen at the 09-14 snapshot for
users the whole time. Promotion is a flag flip, rollback the same flip, no deploy.

Why not a literal from-scratch rewrite: every failure tonight is policy or composition. The infrastructure took
three months to make reliable (546s, `waitUntil`, pool saturation, the isolate cache) and a rewrite re-learns all
of it. The composition layer is ~2k lines of pure functions with a harness that stores every emitted prompt; it
can be replaced in days and judged the same evening.

---

## 3. The 2.0 contract — every render must satisfy these, each with a measurement

| directive | rule | measured by | on failure |
|---|---|---|---|
| D1 framing | cast renders: tallest face ≤ 0.20 frame height; person box ≥ 0.60 frame height (mid-thigh or lower visible) | Fly `/detect` face box + a person box (add a person detector to the Fly engine, or estimate from the face box until it exists) | re-render down the chain; the smallest face ships at exhaustion; a close-up never ships silently |
| D2 setting as subject | prompt position 1 = the place + its two iconic details; scene sentence before the cast block; look after the place | a composer unit test on prompt ORDER, stamped `order:place_first` | build fails |
| D3 lush | set dresser + costume + light + weather + one dream-logic beat in every brief; each stamped | harness asserts every fragment reaches 100 % of a batch's prompts | batch fails, not shipped |
| D4 imaginative | ≥ 60 % of cast renders draw from imagined/themed/fantasy worlds (tunable) | stamp `world:<family>` counted per batch | tune weights |
| D5 seeds | a seed cannot be enabled without `qa_render_id`; proximity scan exit 0; no water above the waist for cast seeds | schema + CI | seed stays disabled |
| D6 breadth | no scene family repeats for a user within N nights; favourites bias the roll | `dedup_key` extended; stamp `repeat_guard:` | roll again |

**Model policy for v2.** Couples default to gemini-2-image and grok-imagine-image (obey framing, 40/40 on night
vibes, 100 % delivered in every 09-12 geometry round); flux-1.1-pro only where the LOOK requires it and only
through the D1 gate. Solos: flux allowed through the gate. `solo_rebuild_model` is never the model that just
failed.

**Fallback chain for v2** (Kevin's frozen form, but no rung repeats a model — tonight proved a repeated flux rung
burns the budget the later rungs need): couple gemini → couple grok → single gemini → single flux → nobody.

**Prompt order for v2 couples**: place + iconic details → scene action (the couple doing the place-specific thing,
small in a wide frame, mid-thigh visible) → look → vibe fragment → cast block (with skin tone in the position-1
lock, both people or neither) → the swap geometry line. The swap gets faces from the gate + the model, not from
prompt dominance.

---

## 4. Build plan — one variable per batch, every phase measured on the harness

**Phase 0 — freeze and restore (today).** Put users back on the 09-14 state: policy roll = pool, the 09-14
chain, `solo_rebuild_model` ≠ flux. Verify with 20 nightlies: ≥ 90 % couples delivered, 0 faceless. Measure the
swap's face-size floor from the report data we already have (identity vs delivered face fraction, all rounds)
so D1's number is measured, not guessed. Test the skin-tone position-1 lock on fixed seeds (10 renders).

**Phase 1 — v2 composer skeleton (2–3 days).** `nightly2/` behind the flag on Kevin's account only: place-first
order, D1 gate at 0.20, v2 model policy, v2 chain, every fragment stamped. 20-night batch → the HTML matrix →
Kevin grades. Success: 0 close-ups shipped, ≥ 90 % couples, median grade ≥ v1's 09-13 baseline (4.0–4.25).

**Phase 2 — seed spec and pool rebuild (3–5 days).** Write the spec; rebuild the three most-rolled pools first
(25-seed QA each, sign-off, then scale); reword the water/submerged seeds; proximity scan exit 0; `qa_render_id`
required. Batch after each pool.

**Phase 3 — lush + dream logic.** Authored dream-logic pool; D3 harness assertion; vibe fragment early. One batch.

**Phase 4 — breadth.** No-repeat window, favourites bias, more worlds via the location playbook. One batch.

**Phase 5 — promote.** Flag to `v2` for all users. v1 kept as rollback for 30 days, then deleted with its modes.

---

## 5. Decisions only Kevin can make

- **Demote flux-1.1-pro for couples.** Aesthetics vs obedience. Every number says gemini/grok deliver; his eye
  has preferred flux's finish. v2 keeps flux where a look needs it, behind the gate.
- **D1's number.** 0.20 is the "setting is the star" value; if some looks cannot hold identity there, they get
  0.25, measured in Phase 0, not argued.
- **Cast placement without a swap** (research spike, optional). Nano Banana can place two photographed people
  into a wide scene in one pass; it would end the big-face constraint entirely. It sends cast photos to Google
  (today's single-swap fallback already sends them to Replicate). Not in the plan until he says so.
- **The 0.35 gate shipped tonight.** Under v2 it becomes D1 at 0.20; until then it stays as approved.

---

## 6. Not done without confirmation

Nothing beyond what Kevin approved tonight (tier off, gate 0.35) has changed. The second 20-night batch is on
hold: another batch on the regressed policy and chain would only reproduce section 0.
