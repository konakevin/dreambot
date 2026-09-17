# Nightly pair roll — one mechanism for (model × look)

**Status:** SPEC, not built. Written 2026-09-17 after the batch that exposed the problem.
**Touches:** `_shared/nightlyStyle.ts` `resolveStyle` — the function every nightly dream goes through.
**Owner note (Kevin):** *"i hate spaghetti code, so the code structure and architecture matter here,
i'd rather do it right."*

---

## 1. The problem, measured

A 20-dream organic batch on 2026-09-17 was configured **flux 70 / gemini-2 15 / seedream-4.5 15** and
delivered **35 / 35 / 30**.

The weights were applied correctly on every single render — the `model_roll:weighted:…` stamps prove it
per render. The split still came out wrong, because **which models are eligible changes with the look**:

| pool actually rolled | renders | what happened |
|---|---|---|
| `70/15/15` (full pool) | 11 | configured split applied |
| `15/15` (**flux rejected on that look**) | 6 | gemini and seedream split 50/50 |
| `70/15` (seedream rejected) | 1 | flux 82 / gemini 18 |

Flux forfeits its 70 on any look it is rejected for, and the forfeit goes to whoever remains. An
**ungraded** model is never rejected, so it sits in every pool and collects the most:

```
              looks it can render (of 57 active)
              solo      couple
flux-1.1-pro    43        20
gemini-2-image  55        55
seedream-4.5    57        57     ← ungraded: absence of a rejection reads as approval
```

**This is a known trap, already documented in the code**, which is why it is worth fixing structurally
rather than patching: the same thing happened to `flux-1.1-pro-ultra` on the scene surface, "handing the
ungraded model 58% of scene renders instead of 25%."

### What is NOT broken

Flux never renders a look it is bad at. The rejection filter already guarantees that, and the rejections
are earned — Kevin graded every one in the 2026-09-12 looks matrix, with notes:

| why flux is rejected | looks |
|---|---|
| big / floating heads or caricature instead of a real face | 13 |
| couple turned to profiles facing each other, faces too small to swap | 10 |
| age drift — rendered as an older grey-bearded man, not Kevin | 9 |
| bookmarks during the parity loop | 7 |
| lost the +1, degraded to Kevin alone | 5 |
| collapsed to a faceless scene | 2 |

Three of those four big buckets are flux's documented weaknesses: the beard/age prior (12/12 on older
men), head geometry (it cannot be told where to put heads), and the dual-swap failure that follows from
it. **The exclusion list is real and must be preserved by any redesign.**

---

## 2. The design

Stop treating this as "roll a look then a model" or the reverse. It is **sampling one valid
`(model, look)` pair**, and everything else is a filter on that pair space.

```
pairs   = approval matrix                       (model × look, minus rejections)
        ∩ bans                                  (nightly bans, day-of bans)
        ∩ { look  = pinned }        if pinned   (day-of look set, holiday scene, scenario medium_key)
        ∩ { model = forced }        if QA       (force_model)
        ∩ { model ∈ restrictModels } if set     (the pinned medium's own allowed_models)

model   = weightedPick(models present in pairs, primary_weights)
look    = weightedPick(looks available for that model, family-first + recency)
```

### Why this removes the second path

A pin does **not** invert the roll order. It collapses the look dimension to a single value, which leaves
the model dimension to be sampled exactly as it always is — from whichever models can render that look.
Day-of becomes an *input* to the same function rather than a branch beside it.

This also folds two existing concepts into the intersection rather than leaving them as special cases:

- `restrictModels` (the pinned medium's `allowed_models`) is just another filter on the model dimension.
- `force_model` becomes a filter instead of the `??` short-circuit it is today.

### What it fixes

- **Weights renormalise over what is actually available, honestly.** If flux cannot render the pinned
  Halloween look, its 70 goes to the models that can — for that render only, and the stamp records the
  pool so it is visible rather than inferred.
- **Fail-open becomes a stated policy** instead of an accident of missing rows (see §3.1).
- **One place to reason about, one to stamp, one to test.**

### The tradeoff, stated plainly

Sampling the model first makes the model share exact but makes **look variety depend on each model's
eligible set**. On couples flux can render 20 of 57 looks, so at a 70% weight **70% of couple dreams would
draw from those 20 looks** (~3.5% each) while the other 37 share 30% (<1% each). The 57-look catalogue
would behave like a 20-look catalogue on most couple nights.

Solos are fine: 43 of 57 is dense enough that the narrowing is slight.

**So the roll order is not really the problem — flux's 20/57 couple approval rate is.** Model-first makes
that sparsity visible as reduced variety instead of hiding it as a skewed model split. Both are symptoms
of the same sparse matrix. Ship the redesign *with* one of the mitigations in §4 or couples get
repetitive.

---

## 3. Decisions to make before writing code

### 3.1 The ungraded-model rule — **fail CLOSED with an explicit starter set**

Today an ungraded model is eligible for everything, because eligibility is "not rejected". That is what
put seedream at 30% while rendering 37 looks nobody has ever checked it on.

Proposed: a model's eligible set is explicit. A new model declares a **starter set** (suggested default:
the looks every existing model is approved on — the safe intersection) and widens only as it is graded.

Rationale: an ungraded model over-renders *and* renders the least-vetted looks, which is the worst of
both. Fail-closed makes adding a model a deliberate act with a visible blast radius.

### 3.2 Look recency stays GLOBAL

Recency currently excludes the user's recent look keys regardless of model. Keep it global: a dreamer
should not see the same look two nights running just because the model changed. Recency filters the look
dimension *after* the model is chosen, and must fail open if it would empty the set.

### 3.3 Empty pair space must never fail a render

Pin + bans + restrictModels can intersect to nothing. Defined fallback ladder, each step stamped:

1. drop recency
2. drop the model-dimension filters (`restrictModels`, bans) — keep the pin
3. drop the pin, keep the surface's default pool
4. last resort: the surface's first primary + its highest-weight approved look

Step 3 is the only one that abandons the product promise (a Halloween dream that is not Halloween), so it
must be loud in the stamps. **A day-of render must never fail to render** — that rule already exists and
survives unchanged.

### 3.4 The retry ladder re-samples the MODEL dimension only

`forAttempt(n)` currently moves to another model the same look is approved on, and `lockLook` keeps the
look stable so the stamps describe what actually rendered. Under pair sampling that is naturally "hold the
look, re-sample the model from the pairs that remain". Behaviour unchanged, expressed once.

### 3.5 Migration safety — reproduce today, then change deliberately

Same discipline that worked for the weighted roll and the scenario ceiling:

1. Land the mechanism so the CURRENT distribution is reproduced.
2. Prove it with a seeded distribution test over the real roll (≥60k samples), not by inspection.
3. Only then move numbers, one at a time, with a batch to look at.

---

## 4. Mitigations for the couple narrowing — pick at least one

1. **Lower flux's couple weight.** If flux can only do 20 looks, 70% of couples drawing from them is a
   lot. 40-50% is comfortable and still makes flux the primary.
2. **Re-grade flux on couples.** Many of the 37 rejections are *geometry* failures — profiles, floating
   heads, losing the +1 — graded 2026-09-12, before the couple work landed. Some may now pass. This is
   the highest-value option because it widens the matrix rather than working around it.
3. **Grade seedream-4.5 properly.** It is currently rendering the 37 looks flux failed, ungraded, and
   those looks are hard precisely because they provoke big heads, profile framing and age drift. A focused
   matrix on just those looks would settle whether its 0/8 dual-swap record holds where flux breaks.

---

## 5. Test plan

| what | how |
|---|---|
| model share IS the configured weight, given a dense matrix | seeded ≥60k-sample distribution test over the real roll (extends `modelWeightDeterminism.test.ts`) |
| a pin yields the pinned look on EVERY sample, model varying | pinned-look property test |
| a pin no model can render still renders, with a loud stamp | fallback-ladder test per §3.3 |
| an ungraded model gets the starter set, not the catalogue | eligibility test |
| recency never empties the look set | fail-open test |
| look variety under the shipped weights | report observed look distribution; assert no look is starved below a floor |
| **the current distribution is reproduced on day one** | the §3.5 gate, run before any number moves |

---

## 6. Why this is worth doing rather than patching

The immediate symptom could be papered over by setting seedream's weight to 7 so it lands near 15%
marginal. That is a correction factor derived from today's approval matrix — it silently goes wrong the
moment any look is graded, any model is added, or any ban changes. The number would be right and
unexplainable.

The pair-roll makes the relationship explicit: weights are over models, eligibility is over pairs, and
where the two disagree the stamp says so.

**Related:** `NIGHTLY_LOOKS_REFACTOR_PLAN.md` (the looks catalogue), `REAL_FACE_LOOKS_REGISTRY.md` (the
look × model × surface grading), `COUPLE_SWAP_RELIABILITY_PLAN.md` (why flux fails couples),
`NIGHTLY_PARITY_QA_LOOP.md` (where the 2026-09-12 grading came from).
