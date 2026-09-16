# Nightly look + vibe fidelity — investigation ledger (2026-09-16)

**The question that started it:** do nightly dreams actually render in the look and vibe we assign them?

**The answer:** no, and for two separate reasons, both of them ours. Both fixes already existed in the
repo, were correct, and had been switched off by the same flag.

> **Read this before re-investigating anything in here.** Five hypotheses were tested and three were
> rejected with real renders. They are written down so nobody spends another day on them.

---

## 1. What was measured

Every number below came from production logs or from renders that were generated and viewed one by one.
Nothing here is inferred.

| measurement | result | n |
|---|---|---|
| nightlies containing their vibe's authored `flux_fragment` | **0** | 50 |
| pinned `nightly_classical_oil` rendering as an oil painting (production) | **2 (22%)** | 9 |
| same, with `lookNeutralFraming` on | **7 (78%)** | 9 |
| flux couples needing a retry or degrade | **26%** | 97 |
| active `dream_vibes` rows carrying a fragment + position | 163 of 231 | — |
| nightly looks whose face-swap fragment contains a realism word | **56 of 57 (98%)** | — |

---

## 2. Root cause A — the vibe fragment never reached a render

One conditional:

```js
const looksPath   = looksMode === 'on' && !LOOKS_MINIMAL;   // → false
const looksFields = looksPath ? looksSlotInputFields(…) : null;
...(looksFields ?? {}),                                      // → {}
```

`vibeFragment` / `vibeFragmentPosition` were absent from the slot input, so `assembleCharacterPrompt` had
nothing to place. The vibe still rolled, stamped and gated model choice — it just never reached pixels.
"The 1.2.0 engine with the new looks AND vibes" was half true: the look survives because it is pinned as
the MEDIUM; the vibe was spent through 1.2.0's three-mood-words-at-the-tail route.

**The directive is NOT a substitute for the fragment.** In-family control — `aurora__bold` vs
`aurora__subtle`, identical directive, same look/place/model/cast:

- fragment present → dramatic aurora
- fragment absent → **sunny day, no aurora at all**

In the `subtle` render Sonnet had even written *"aurora curtains of green, teal and violet rippling
overhead"* into the prompt from the directive. The render ignored it. **Vibe words Sonnet writes do
nothing; the authored fragment at a real position does everything.**

Fixed in `369c3635`. Carries only the two vibe fields across; deliberately does not call
`looksSlotInputFields`, whose bundle also brings blank axes, look-neutral framing, the rich brief and the
frame roll. Stamp: `vibe_fragment:minimal:<position>`.

---

## 3. Root cause B — we ask for a photograph 3:1

The prompt names the look ONCE, then contradicts it three times in the framing boilerplate:

```
…classical oil painting, smooth refined brushwork, …          ← char 151, once
…the clear subject of a CANDID CINEMATIC PHOTOGRAPH …
…a relaxed warm EDITORIAL PHOTOGRAPH …
…PHOTOGRAPHIC REALISM, filmic colour …
```

**The prompt is byte-identical between the hits and the misses** — the look sits at char 151 in all nine
renders, same length, same position. So this is not model unreliability. Flux is counting instructions and
obeying the majority, which is exactly what it should do.

`lookNeutralFraming` drops that prior and already existed, with a comment describing this precise symptom
("pulled painted looks back toward a photo on every solo cast render"). It is set in exactly ONE place —
inside `looksSlotInputFields` — so `LOOKS_MINIMAL = true` disabled it.

Shipped for **SOLOS ONLY** in `87f9dd2b`. Verified live: a solo render now carries 0 of the three phrases,
a dual still carries all 3.

---

## 4. Hypotheses tested and REJECTED — do not re-run these

| hypothesis | how it was tested | verdict |
|---|---|---|
| The flux-couple album skeleton (`coupleSceneAfterAction`) nulls the vibe and breaks looks | read the code path | **inert under `LOOKS_MINIMAL`** — cannot be the cause |
| The atmospheric time/weather/phenomena axes carry camera language that overrides the look | `qa_blank_axes`, 2–3 renders per arm | **not supported** — within-arm variance exceeded the between-arm difference; camera-language count identical (3) in both arms |
| The face-realism clause inside the fragment ("lifelike adult faces, realistic human facial proportions, true-to-life eyes") breaks the look on flux | arm C, geometry-only fragment | **0 of 3** — not the cause on flux |
| The face swap pastes photoreal faces and ruins a painted base | rendered with the swap OFF | base render was **also photographic** — not the cause |
| Our realism clause breaks looks across all instruction-following models | 6-model × 3-look × 3-arm audit | **model-specific** — `gemini-3-image-preview` renders a true chromolithograph with the clause still in |

**Bonus finding from the rejected arm C:** on flux-1.1-pro, removing the realism clause did not hurt
identity — mean 0.63 with it vs **0.70** without, zero degrades across 9 cells. The clause is not buying
what it was added for, at least on flux. Not acted on; noted for whoever revisits it.

---

## 5. The pattern worth remembering

**Both root causes were fixes that already existed, were correct, and were switched off by the same flag.**
`LOOKS_MINIMAL = true` makes `looksPath` false, which silently disables roughly ten behaviours documented
only in a comment on the constant — scene mix, location-action share, scene-first action, pose pool mixes,
the framing axis, the frame roll, prompt order, the flux couple work, the identity floors, and both fixes
above.

**When a nightly axis seems inert, check whether its code is already written and gated behind `looksPath`
BEFORE theorising about models or prompts.** That check would have saved most of this day.

---

## 6. Method lessons

- **Judge look fidelity at n ≥ 9.** Flux looked like a coin flip at n=2 and measured 2/9 at n=9. Two
  separate wrong conclusions in this investigation came from n=1–3.
- **`force_look` cannot be used to pin a look for an A/B.** It aliases to `force_medium`, and
  `if (looksMinimal && modelPolicy && !force_medium)` skips the minimal contract build entirely — so the
  test silently runs against a disabled looks engine. Use `qa_pin_look`, which feeds the contract's own
  `pinnedLook` on both paths.
- **Automated style grading does not work here.** Two vision graders were built and both failed their
  control: the first called all 53 renders ARTWORK including the photographic control; the second was
  order-dependent on 8 of 17 pairs. Grade looks by eye, which is what the looks registry already decided.
- **Always include a within-arm control.** The `aurora__subtle` row (same directive, no fragment) is what
  proved the fragment does the work. A/B alone could not have shown it.
- **Check a distinctive token, not the first comma-clause.** An early inspector split fragments on the
  first comma, got `"green"`, and reported false negatives.

---

## 7. QA flags added (all QA-only, inert in production)

| flag | what it does |
|---|---|
| `qa_pin_look` | pins the CONTRACT's look on BOTH the minimal and full looks path, without `force_look`'s side effects |
| `qa_blank_axes` | blanks time/weather/phenomena on the minimal path |
| `qa_fragment_mode` | `default` \| `plain` \| `geometry` — swaps the look's fragment variant |
| `qa_look_neutral_framing` | forces look-neutral framing on regardless of surface |

---

## 8. Open

- **Couples.** The `lookNeutralFraming` fix is solos-only. Couples carry the parity-loop framing work and
  are untested. Run the same 9-render protocol with `force_cast_role: 'dual'` before extending it.
- **GPT Image 2.5 re-test.** The "renders one look regardless" verdict rests on n=1 per cell. Full
  write-up and protocol in `NIGHTLY_LOOKS_REFACTOR_PLAN.md`.
- **The realism clause on flux.** Rejected as the cause of look loss, but arm C also showed it costs
  nothing in identity. Whether to remove it anyway is an open call.
- **Dead code.** If `LOOKS_MINIMAL = true` is the shipping state, the full looks path is dead code that
  reads as a live feature — and it misled this investigation directly. Subtraction is the cheapest
  durable fix.
