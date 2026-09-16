---
name: model-eval
description: Evaluate a NEW image model for use in DreamBot before adopting it — aspect ratio, measured cost, speed, medium fidelity, face-swap survival, couple viability and framing behaviour. Encodes the full 2026-09-16 GPT Image 2.5 investigation, where four wrong verdicts in a row came from testing the wrong thing. Use whenever Kevin asks "can we use <model>", "is <model> any good", "should we add <model> to the rotation", "run a matrix on <model>", or a new model appears on Replicate/OpenAI/Gemini/xAI.
---

# Model Evaluation — is this model safe to put in DreamBot?

> **Read this whole file before rendering anything.** It exists because evaluating GPT Image 2.5 on
> 2026-09-16 produced **four confidently-stated verdicts that were all wrong**, over a full day, and every
> one of them was a testing mistake rather than a model fact. The traps below are the entire point.

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

- Wide/full-length → the pasted region is small, surrounding texture dominates, the medium survives
- Tight/waist-up → the faces ARE the image, and the whole render reads photoreal

This is true of **every** model. It is not a property of the model under test. Always render at least one
arm with `force_face_swap_eligible: false` (or a scene-only composition) to see what the model actually
drew.

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

## 5. The checklist

Run in order. Stop early if a hard gate fails.

**A. API shape — HARD GATE.** Does it render true 9:16? `gpt-image-1/2` accept `size` only from a fixed
enum, so the closest portrait is 1024x1536 = 2:3 against our 9:16 cards — that is why gpt-image-2 is
permanently banned, and it is unfixable. Probe the real API for accepted sizes; do not trust docs.

**B. Cost — MEASURE, don't estimate.** OpenAI returns `usage.output_tokens`; multiply by the published
rate. This corrected gpt-image-2 from a 6c estimate to 4c actual. Compare against flux-1.1-pro (~$0.040)
and gemini-2-image (~$0.039), both sparkle tier 1.

**C. Speed — HARD GATE.** 150s IDLE_TIMEOUTs killed gpt-image-2 in nightly. First dreams need well under
60s or onboarding shows a failure. Time every render.

**D. Clean-room medium fidelity** (§3). 6 mediums, 1 subject.

**E. Base-render look fidelity in-engine, swap OFF.** n ≥ 9, one pinned look, `qa_pin_look`.

**F. Post-swap look fidelity + identity.** Same n. Compare against E — the DELTA is the swap's cost, not
the model's failure. Identity floor is 0.35 (measured, 100 pairs, zero errors); a normal identity score
does NOT mean the render looks like the person — ArcFace is hair-invariant.

**G. Couple viability.** Couples are the hard case. Watch `no_dual_split`, `giant_face`,
`side_haiku_unresolved`, `dual_degrade_single`. Production baseline over 105 couples: 67% clean, 21%
degrade. A candidate materially worse than that is not couple-safe.

**H. Framing behaviour.** Does it compose tight or wide on the same instruction? This decides how visible
the swap will be (§1), and it is the most under-appreciated axis.

## 6. Model temperaments — what we know

- **flux-1.1-pro.** Renders nouns and adjectives reliably, COUNTS REPETITIONS, and **cannot be told about
  geometry** — "a clear gap between their heads" was ignored across matched seeds. Also has hard priors
  that beat instructions: 12/12 bearded older men against every phrasing of clean-shaven.
- **Instruction-followers** (GPT Image, Gemini, Seedream, Kontext) obey literally — including our
  contradictions. `newSceneDirective.ts` already records that they want PROSE, not CLIP token soup.
- **Our own prompts contain contradictions.** The framing boilerplate says "photograph" three times after
  naming the look; 56 of 57 look fragments carry "lifelike / realistic / true-to-life". A model that
  obeys us precisely will paint a photograph, and that is not its fault.

## 7. Wiring a model in, once it passes

1. `supabase/functions/_shared/providers/<provider>.ts` — model id map + per-model size/quality defaults
2. `modelPricing.ts` — `MODEL_SPARKLE_COST` + `MODEL_COST_CENTS`, measured
3. `image_models` row (migration)
4. `nightly_model_policy` primaries/fallbacks — note `primary_weights` is NOT read on the minimal path;
   the split lives in `PRIMARY_DIRECT_SHARE`
5. `NIGHTLY_BANNED_MODELS` if cast-unsafe. **Listing a model as a policy PRIMARY lifts its legacy ban**
   (`looksPathBans`) — so removing it from primaries is how you actually ban it.

## 8. Report like this

State what was **measured** vs **inferred**, every n, and every hypothesis tested AND REJECTED so nobody
re-runs it. If a conclusion rests on your eye, say so and show the sheet. Ledgers:
`NIGHTLY_LOOK_FIDELITY_INVESTIGATION.md`, `COUPLE_SWAP_RELIABILITY_PLAN.md`,
`REAL_FACE_LOOKS_REGISTRY.md`.
