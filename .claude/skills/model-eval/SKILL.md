---
name: model-eval
description: Vet a NEW image model for DreamBot end to end by running `node scripts/eval-model.js "<model>"` — a phased harness measuring aspect ratio, resolution, latency, real cost, medium fidelity, prompt adherence, hard priors, head-geometry compliance, face scale, swap survival and identity, then reporting a verdict. Encodes the full 2026-09-16 GPT Image 2.5 investigation, where four wrong verdicts in a row all came from testing the wrong thing. Use whenever Kevin asks "can we use <model>", "is <model> any good", "is <model> a good fit", "should we add <model> to the rotation", "vet/test <model>", "run a matrix on <model>", or a new model appears on Replicate/OpenAI/Gemini/xAI.
---

# Model Evaluation — is this model safe to put in DreamBot?

> **Read this whole file before rendering anything.** It exists because evaluating GPT Image 2.5 on
> 2026-09-16 produced **four confidently-stated verdicts that were all wrong**, over a full day, and every
> one of them was a testing mistake rather than a model fact. The traps below are the entire point.

---

## Run it

```sh
node scripts/eval-model.js "<model id or fuzzy name>"     # full pass
node scripts/eval-model.js <id> --estimate                # cost it without spending anything
node scripts/eval-model.js <id> --phase 2                 # one phase
node scripts/eval-model.js <id> --n 9 --no-album          # sample size; skip the album push
```

**It costs real money — every dimension needs real renders.** A full pass at the default n=9 is **~100
renders, about $4** at flux-1.1-pro pricing. `--estimate` prints the per-phase breakdown and the cost at
each price point we have measured, and renders nothing. Quote that before starting a run, do not guess.

Phase 2 is 81 of those 100, which is where it belongs: medium fidelity, scene range and vibes are what
actually decide whether a model is usable, and they are the dimensions that need n≥9. **A bad model costs
pennies** — 1 render if it cannot be called, 4 if the aspect ratio or latency disqualifies it, because both
are unfixable and the run stops there.

Kevin will ask for this in his own words: *"is flux 3 any good"*, *"should we add X to the rotation"*,
*"vet this model"*. That is the command. **Do not hand-roll probes when a phase already covers it** — the
whole point is that the traps below are already designed out of the runner.

**What it does.** Phases run cheapest-first and a fatal failure stops the run, so a model that cannot hit
9:16 costs about five renders instead of seventy.

| phase | what it settles | judged by |
|---|---|---|
| 0 | Can the engine call it at all | automatic |
| 1 | Aspect, resolution, latency, measured cost | automatic, **fatal gates** |
| 2 | Medium fidelity, prompt adherence, hard priors, **scene range**, **vibe fidelity** | **you** — renders land in Kevin's private Dreams album |
| 3 | Geometry compliance and face scale, **sampled across lighting** | automatic, via the swap's own detector |
| 4 | **Face swap once per look family**, identity, refusals | automatic measurement, your eyes on the pairs |

**It exercises the whole job, not one lucky cell.** Nightly does not hand a model a single kind of work,
so neither does this:

- **Scene range** (phase 2): eight cells spanning interior vs exterior, landscape vs couples, and six
  lighting types — warm directional, flat diffuse overcast, harsh midday contrast, artificial interior
  lamplight, night with reflections, and dappled canopy. Judge each for **lushness, not just
  correctness**: a right-but-empty frame fails the product.
- **Vibe fidelity** (phase 2): each vibe rendered **with its `flux_fragment` and without it**, everything
  else identical. Judge the PAIR. A single render that "looks cozy" proves nothing — that is exactly how
  the fragment reached 0 of 50 nightlies while every render looked plausible.
- **Geometry across lighting** (phase 3): day, night and dim interior scored *separately*, because
  averaging hides the failure flux actually has.
- **Swap per look family** (phase 4): one render in each of the live families — photographic,
  painted_realism, watercolor, comic_print, covers_posters, legacy. One per family rather than per look,
  since the 57 looks collapse into families that behave alike under a swap. What varies is how far a
  pasted photographic face has to travel: nowhere in `photographic`, furthest in `watercolor` and
  `comic_print`.

**What it will not do: grade style.** Phase 2 renders and stops. That is a deliberate property, not a gap
— see the automated-grader trap in §4. When a phase returns `REVIEW`, the answer is your eyes on the
images, at n≥9, on the BASE render.

**Where "good" is defined.** `scripts/lib/modelEval/dimensions.js` holds all seventeen dimensions with the
bar for each and the incident behind it. Read it before arguing with a verdict, and add to it whenever a
new failure mode is found — that file is the actual brain, this one is the operating manual.

**One safety property worth knowing:** the runner refuses to guess which model you meant. A fuzzy name
that matches several models prints the shortlist and exits without rendering, because Replicate's search
returns an object detector as the top hit for "flux 2", and a plausible report about the wrong model is
worse than no report.

---

## 0. The four wrong verdicts, and what actually caused each

| verdict stated | why it was wrong |
|---|---|
| "It renders one look regardless of what you ask" | n=1 per cell. Two single renders were compared and called identical. |
| "It obeys our realism clause and paints a photograph" | Half true — that clause was only in one arm. |
| "It won't commit to a medium even with the clause gone" | Still judging POST-SWAP images. |
| "Our engine's framing boilerplate breaks it" | Plausible but wrong for this model. |

**The actual answer:** the model rendered every medium perfectly. A clean-room call with the *exact*
production prompt produced a flawless Victorian chromolithograph. What made the engine's render look
"glossy realism" was **the face swap pasting photographic faces onto a correctly-styled base.**

**So the first rule of this skill: you are almost certainly looking at a post-swap image and blaming the
model for the swap.**

---

## 1. Judge the BASE render, never the swapped one

A DreamBot cast render is two stages: the model draws the scene, then a real person's face is composited
in. The pasted face is photographic **by definition**, at whatever scale the base render drew it.

**MEASURED 2026-09-16** (gpt-image-2.5-sunburst, look `nightly_chromolithograph`, identical scene, cast
and prompt, only the framing clause differing — base and swapped captured for both arms):

| framing | face height in a 2048px frame | base render | after swap |
|---|---|---|---|
| WIDE, full length | ~70px | painted, consistent | painted — **swap invisible** |
| TIGHT, waist up | ~350px | **painted, consistent** | photographic skin — **seam obvious** |

The TIGHT *base* was a perfectly good chromolithograph: both faces carried painterly modelling matching
the foliage and mosaic around them. The look survived right up until the swap touched it. So:

> **Face scale, not the model, decides whether a swap is visible.** A look that "blends nicely" on comic
> or oil renders is usually just drawing faces small. Never grade a model on how well the swap hid in it.

The corollary that matters when a model is on trial: a model that *composes tighter* will look like it
"flattens mediums", when all it did was frame closer. Measure composition separately from medium fidelity.

**Get the base for free — do not re-render.** Every render already stores its raw pre-swap output:

```js
// ai_generation_log.rolled_axes.observability
replicateRawUrl   // the RAW model output (data: URI for OpenAI/Gemini, URL for Replicate) = THE BASE
preStoragetUrl    // post-pipeline
```

So you can pull the true base of any render that already happened, retroactively, at zero cost and with
**zero seed variance** — unlike a re-render, which is a different sample and cannot prove what *this*
image looked like before the swap. Decode and compare the two directly. (`model_used` is the column, not
`model`; a `.select()` naming `model` errors and PostgREST returns an empty result that looks like "no
rows" rather than a failure.)

Only when no such row exists, render an arm with `force_face_swap_eligible: false` (or a scene-only
composition) to see what the model actually drew.

## 2. n ≥ 9 or say nothing

Render-to-render variance dominates below that. Measured on 2026-09-16: a pinned look on flux-1.1-pro
looked like a coin flip at n=2 and measured **2/9**. Two separate wrong conclusions that day came from
n=1–3. Use `node scripts/qa-look-reliability.js <look_key> <n>`.

## 3. Clean room BEFORE the engine

Call the provider API directly with a bare prompt — no look fragment, no vibe, no framing block, no
Sonnet, no slots. Same subject, one medium word changing:

```
"A photograph of <subject>"          "A watercolour painting of <subject>"
"A classical oil painting of …"      "A Victorian chromolithograph print of …"
"A 1940s pulp adventure cover of …"  "A charcoal drawing of …"
```

If these come back distinct, the model can hold a medium and **anything that goes wrong later is ours**.
If they come back identical, the model genuinely cannot, and that is a real disqualifier.

Then escalate: our verbatim `flux_fragment` → fragment behind the gender lock → the full production
prompt replayed verbatim. Each step tells you which layer breaks it. (In the 2.5 case, none did.)

## 4. Traps that will waste your day

- **`force_look` aliases to `force_medium`**, and `if (looksMinimal && modelPolicy && !force_medium)`
  skips the minimal contract build — so pinning a look with it silently tests a DISABLED looks engine.
  **Use `qa_pin_look`.**
- **A degraded couple logs the SOLO prompt.** `enhanced_prompt` holds one value and the rebuild
  overwrites it. Comparing logged prompts of passed vs failed couples produces a *perfect* correlation
  that is pure tautology. Use `rolled_axes.observability.couplePrompt` (exists after `6f4a1c2a`).
- **Automated style grading does not work.** Two vision graders were built on 2026-09-16 and both failed
  their own control: one called all 53 renders ARTWORK including the photographic control, the other was
  order-dependent on 8 of 17 pairs. Grade by eye, and put a contact sheet in front of Kevin.
- **Always include a within-arm control** — a variant with the thing under test REMOVED, everything else
  identical. The `aurora__bold` vs `aurora__subtle` control (same directive, fragment vs none) is what
  proved vibes were dead. A/B alone could not have shown it.
- **QA samples are not production.** A 9-render QA batch showed `giant_face` at 44%; production over 105
  couples showed 3%.

## 5. The seventeen dimensions, and which phase settles each

Full text with the incident behind every bar: `scripts/lib/modelEval/dimensions.js`.

| dimension | bar | phase |
|---|---|---|
| Engine can call it | one bare render returns an image | 0 |
| **True 9:16** | 0.5625 ± 0.02 — **fatal**, unfixable | 1 |
| Resolution | ≤~2.5MP; ultra was banned for defeating the detector at 4MP | 1 |
| **Latency** | p95 < 140s — **fatal**, it FAILS rather than renders slowly | 1 |
| Cost | ≤~1.2× flux-1.1-pro, measured from usage tokens never quoted | 1 |
| **Medium fidelity** | ≥7/9 per family — **fatal** | 2 |
| Prompt adherence | ≥80% of the named facts | 2 |
| Hard priors | no verdict: discover and record, they are permanent | 2 |
| **Scene range** | every cell renders, none plain or muddy; per-cell not averaged | 2 |
| **Vibe fidelity** | fragment visibly moves the render, ≥7/9 **pairs** | 2 |
| **Geometry** | ≥7/9 two separable faces, **in every lighting condition** | 3 |
| Composition | report median `bboxFrac`; explains the swap result | 3 |
| Swap technical | `dual_degrade_single` ≤10% across the look families | 4 |
| Identity | mean ≥0.5, zero below the 0.35 floor | 4 |
| Swap naturalness | seam not obvious at that model's own face scale, **per family** | 4 |
| Scene-only | medium fidelity holds on people-free scenes | 4 |
| Refusals | <5% on ordinary romance/swimwear/family prompts | 4 |

Two of these decide most adoptions:

**Geometry is the reason to switch.** flux-1.1-pro cannot be told where to put heads, and that is what
costs 21% of production couples their +1. A model that passes phase 3 fixes something we currently cannot
fix at all. Scored by `/analyze`, the same YuNet detector that gates the real swap, so the number predicts
production rather than approximating it.

**Failing the cast dimensions is not the end.** `scene_eligible_models` is its own config list, so a model
that renders gorgeous places but cannot hold a swap still belongs in pure-scene nightlies and bots. Always
score scene-only separately before rejecting.

## 6. Phase 4 — the swap, across the look families

Automatic now. It routes through `nightly-dreams` with `force_model`, which dispatches any model id the
provider layer can reach with no DB row needed, and for each live look family renders one dual face swap
against a real cast lifted from one of Kevin's own recent dual renders.

What it does for you: pins with `qa_pin_look` (never `force_look`, §4), forces a dual cast, reads
`fallback_reasons` for `dual_degrade_single` / `no_dual_split` / `giant_face` / `side_haiku_unresolved`,
pulls `identity_sim`, saves the **base** from `rolled_axes.observability.replicateRawUrl` next to the
final, and holds concurrency at 3 behind `waitForHeadroom({ min: 25 })` because each edge render pins a
Postgres connection for 20-150s and the pool is shared with the live app.

**What still needs your eyes — compare WITHIN a family, never across.** The question is never "is there a
seam" but "does the pasted face sit in *this* style at *this* model's face scale". A photographic look
hides a swap by definition and tells you nothing; `watercolor` and `comic_print` are where a photoreal
face has the furthest to travel and where a model earns or loses the catalogue.

**Baselines to judge against:** production over 105 couples is 67% clean / 21% degrade on flux, so
materially worse than that is not couple-safe. Identity floor is 0.35, measured over 100 pairs with zero
errors — and remember ArcFace is hair-invariant, so a passing score is a floor, not proof it looks like
the person.

**If couples degrade, check the lighting split from phase 3 before blaming the model's swap.** Losing head
separation in the `night` and `interior_low` conditions is the same shape as the flux night-vibe failure,
and it is a geometry problem surfacing at the swap, not a swap problem.

## 7. Model temperaments — what we know

- **flux-1.1-pro.** Renders nouns and adjectives reliably, COUNTS REPETITIONS, and **cannot be told about
  geometry** — "a clear gap between their heads" was ignored across matched seeds. Also has hard priors
  that beat instructions: 12/12 bearded older men against every phrasing of clean-shaven.
- **Instruction-followers** (GPT Image, Gemini, Seedream, Kontext) obey literally — including our
  contradictions. `newSceneDirective.ts` already records that they want PROSE, not CLIP token soup.
- **Our own prompts contain contradictions.** The framing boilerplate says "photograph" three times after
  naming the look; 56 of 57 look fragments carry "lifelike / realistic / true-to-life". A model that
  obeys us precisely will paint a photograph, and that is not its fault.

## 8. Wiring a model in, once it passes

1. `supabase/functions/_shared/providers/<provider>.ts` — model id map + per-model size/quality defaults
2. `modelPricing.ts` — `MODEL_SPARKLE_COST` + `MODEL_COST_CENTS`, measured
3. `image_models` row (migration)
4. `nightly_model_policy` primaries/fallbacks — note `primary_weights` is NOT read on the minimal path;
   the split lives in `PRIMARY_DIRECT_SHARE`
5. `NIGHTLY_BANNED_MODELS` if cast-unsafe. **Listing a model as a policy PRIMARY lifts its legacy ban**
   (`looksPathBans`) — so removing it from primaries is how you actually ban it.

## 9. Report like this

State what was **measured** vs **inferred**, every n, and every hypothesis tested AND REJECTED so nobody
re-runs it. If a conclusion rests on your eye, say so and show the sheet. Ledgers:
`NIGHTLY_LOOK_FIDELITY_INVESTIGATION.md`, `COUPLE_SWAP_RELIABILITY_PLAN.md`,
`REAL_FACE_LOOKS_REGISTRY.md`.
