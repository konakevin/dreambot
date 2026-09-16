# Couple swap reliability — architecture plan (opened 2026-09-16)

**The problem:** 1 in 5 couple dreams loses the +1. Measured on 105 real production couples since
2026-08-25 — 67% ship as a clean couple, 33% hit a gate, **21% degrade to a solo**.

**The ask (Kevin):** natural-looking scenes and poses, AND geometry reliable enough to render well.
"Or maybe we need to start over?"

**The answer to that last question: no, don't start over.** The five-layer defence is sound and each layer
was added for a real incident. The problem is that layer 1 is being asked to do something we have already
proven it cannot do.

---

## 1. The constraint that decides everything

**The prompt cannot enforce head geometry on flux-1.1-pro.** This is not a hypothesis — it was probed on
2026-09-14 (`project_position1_sets_attributes_not_relationships`): the prompt said *"a clear gap between
their heads"* and flux rendered them cheek-to-cheek anyway, across matched seeds.

Corollary, learned the hard way on 2026-09-16: **any plan whose mechanism is "add or strengthen a geometry
clause" is already known to fail.** A day was spent rediscovering this. Do not re-propose it.

## 2. What the swap actually needs

The dual swap can only place the +1 when the base render shows two faces that are **separated**, at
**comparable scale**, and reasonably **frontal**. Natural couple photography does the opposite — people
touch, lean, turn, and sit at different distances from the camera. **The render objective and the swap
objective are in direct conflict**, and no wording reconciles them.

## 3. Current architecture (five layers, still 21%)

1. prompt-side geometry clauses — *known weak on flux (§1)*
2. pose pools curated for swap safety (proximity scan, CLAUDE.md hard rule)
3. detect failure → re-render with STRICT geometry
4. detect again → degrade to a solo rebuild
5. identity gate → reject a wrong face rather than ship it

Layers 3-5 work: nothing ships with the wrong face on it. The 21% is the **cost** of layer 1 being weak,
not a bug in 4 and 5.

## 4. Options

| | approach | evidence | cost |
|---|---|---|---|
| **A** | **Route couples away from flux.** 86% of couples render on flux, which degrades 23%. | grok 0/8 and gemini-2 1/4 in production — too small to trust. A prior QA study reported gemini/grok couples 40/40 clean vs flux 1/10 on night vibes. **Most promising, least tested.** | a model-policy row; no code |
| **B** | **Mechanical compositions** — a small set of geometrically guaranteed framings (both seated at a table facing camera, both at a railing) instead of freely rolled poses. | would work, by construction | sacrifices exactly the natural variety this is meant to protect |
| **C** | **Accept the degrade, make it excellent.** Kevin's instinct: *"i'd rather let it fall back to single."* | verified 2026-09-16 that the solo rebuild KEEPS the look and drops the photography prior — a degraded couple is already a good solo | the +1 vanishes from 1 in 5 couple dreams |
| **D** | **Fix the swap engine, not the render** — teach the splitter to handle unequal face scales instead of rejecting `giant_face`. | untested; `giant_face` is only 3% of production failures, so the ceiling here is small | Fly-side engine work |

## 5. Recommended sequence

1. **Test A properly.** 30 couples on flux vs 30 on gemini-2 vs 30 on grok, same look/scene/cast, measure
   `dual_degrade_single`. This is the only lever with a plausible large effect and it is a config change
   if it wins. ~90 renders, one sitting.
2. **Keep C as the permanent floor** regardless of A's result. A failed couple should always land as a
   beautiful solo in the right look — that is already true and should stay true.
3. **Only consider B if A fails.** Trading natural variety for geometry is the last resort, not the first.
4. **Park D.** Its ceiling is 3% of failures.

## 6. Why this could not be planned before today

Every couple failure in history logged the WRONG PROMPT. `enhanced_prompt` holds one value and the solo
rebuild overwrites it, so a failed couple's row contains a SOLO prompt. An analysis on 2026-09-16 found a
"perfect" correlation between a missing geometry clause and failure — pure tautology, because the failures
were solo prompts.

Fixed in `6f4a1c2a`: the couple prompt is captured at assembly time and logged as
`rolled_axes.observability.couplePrompt`. **Any real diagnosis of couple failure starts from data collected
after that commit.** Do not analyse pre-6f4a1c2a rows for this question.

## 7. Open questions the new data can answer

- Do failed couples differ from successful ones in POSE, scene, or wardrobe — now measurable on real prompts?
- Is `side_haiku_unresolved` (4% of production, 7 of 9 in one QA batch) a real predictor or noise?
- Does look-neutral framing raise the couple degrade rate? A QA batch showed 5/9 vs a 21% production
  baseline, but the populations differ; the control arm is `qa_legacy_framing`.
