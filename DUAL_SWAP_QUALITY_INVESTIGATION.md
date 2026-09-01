# Dual Face-Swap Quality Investigation (2026-09-01)

Status of record for the dual-swap reliability effort. Opened after two failures surfaced:
(1) couple dreams degrading to a solo of self at ~16%, and (2) a render where the wife's
face landed on the male body and the husband's on the female body (the "tomb" render).

Root-caused via three parallel agents: a pipeline code-map + two production-forensics
passes over `ai_generation_log` (30-day retained window, Kevin's forced QA renders excluded).

**Headline: these are TWO distinct bugs with two different fixes.**

---

## Failure Mode 1 — Dual degrades to solo-of-self (~16%, VISIBLE)

**Data (171 production nightly duals): 27 degrades = 15.8%.**

### Root cause: the `photography` medium
| medium | attempts | degrades | rate |
|---|---|---|---|
| **photography** | 19 | 12 | **63.2%** |
| watercolor | 22 | 5 | 22.7% |
| film_noir | 14 | 3 | 21.4% |
| canvas | 18 | 3 | 16.7% |
| pencil | 19 | 2 | 10.5% |
| vintage_film | 18 | 1 | 5.6% |
| illustration / comics / glamour | 39 | 0 | 0% |

`photography` alone = **44% of all degrades** from just 19 renders. It is NOT a painterly-vs-photo
effect (illustration + glamour degrade 0%); it's specifically photography. **Project guidance
already says "no photography in nightly," but it is live on the nightly cast/dual path** — the ban
was applied to *scene* mediums, not cast mediums.

### The failure signature (decisive)
~All degrades = **ONE face collapses to near-zero identity (<0.1) while its partner sits at
0.6–0.7** (typical `L0.72/R0.068`). Zero cases of both-faces-borderline. So it is **one head
rendered too small / turned / occluded** (photographic depth-of-field, off-axis heads, sunglasses,
distance) dropping below the split/identity threshold — never a general low-fidelity problem.

### Why the current recovery is weak
The re-roll (`rerender_for_dual`, up to 2x) recovers only **27%** — once composition produces a
collapsed face, re-rendering rarely fixes it. Tuning the re-render path is low-leverage.

### Fix (P0 — quick, high impact)
Enforce the existing "no photography in nightly" rule on the **cast/dual** medium roll (make
`photography` dual-ineligible, or map it to a swap-friendly medium for cast renders). **Projected:
degrade rate 15.8% → ~9.6% in one move.** Then push the next-worst (watercolor/film_noir) toward
big, frontal, evenly-sized, clearly-gapped faces (medium two-shot framing, not environmental-wide).

---

## Failure Mode 2 — Wrong-gender-body swap (the "tomb" render, LARGELY INVISIBLE)

This is the more serious bug because **the identity gate cannot catch it, so it ships silently as
a "clean success" with no degrade marker.** The ~10–11% "stranger-side" rate the metrics show is
only the *caught* mis-crops; pure gender-flip body-swaps are not counted, so the true rate is higher.

### Mechanism (file:line)
Face → body assignment is **gender-READ-driven, with no fixed slot fallback on the live path**:
1. Sonnet renders the couple; `orderDualSides` flips L/R ~50% (`_shared/dualSideOrder.ts:22-32`) and
   Sonnet doesn't reliably obey the front-load, so there's **no fixed expectation** of which cast
   member is on which side.
2. `genderSafeDualSwap` does a **Haiku pre-read of the rendered faces' genders** each attempt
   (`_shared/dualSwapPipeline.ts:220-234`, `classifyDualGenders` in `_shared/vision.ts:155-223`),
   producing `genderOverride={left,right}`.
3. The Fly `face-swap-dual` engine routes **each source face onto the DETECTED face whose gender
   matches** (`services/face-swap-dual/src/faceSwap.ts:959-960`; dispatch
   `_shared/dualSwapDispatch.ts:59-67`).

**The break:** on a heavily-painted / androgynous figure (Frazetta long-haired man, strong-jawed
woman) the gender read **flips** — the rendered woman reads "male," the man reads "female." Routing
then sends the husband source to the "male"-read face (the wife's body) and the wife source to the
"female"-read face (the husband's body). **Each real face lands on the wrong-gender body.**

**Why the identity gate misses it:** the gate measures the *swapped face vs the source that was
pasted onto it* (`_shared/dualSwapPipeline.ts:271-289`, `faceSwap.ts:1098`). Husband's face on the
wife's body still matches the husband source → **high sim on both sides** → passes the 0.35
threshold → ships. The genderLock comment at `dualSwapPipeline.ts:213-219` even *asserts* a wrong
override "yields a low-identity swap → caught by the identity gate" — **that assumption is false for
the body-swap case, which is exactly this bug.** The gate only catches the *other* failure (a
cheek-to-cheek mis-crop where one side is a merged/stranger face, sim ~0.15 → 0.25 floor degrades it).

### Scope
Mixed-gender couples only (same-sex couples route positionally, `faceSwap.ts:961`). Overwhelmingly
on **painterly/illustrated mediums** — canvas by raw volume (the default nightly cast medium),
watercolor/glamour/pencil by rate. Kevin's cast (mixed-gender couple + painterly nightly mediums)
sits squarely in the failure zone.

### Fixes
- **P1a — Slot-based fallback on painterly mediums (highest leverage, moderate effort).** On mediums
  where the gender read is known-unreliable, DON'T trust the flip-prone read — align source→side
  with the front-load slot placement (`buildDualGenderFront`, `dualSideOrder.ts:40`). A positional
  assignment can't flip *both* faces the way a bad read can.
- **P1b — Post-swap gender-consistency check (closes the invisibility).** After the swap, re-read
  the two output figures' apparent gender and assert each matches the *cast gender of the source
  routed there*. A mismatch → re-render/degrade. This is the ONLY signal that distinguishes "right
  face, wrong body" from success — without it we can't even measure the true rate.
- **P1c — Cross-check the Haiku override vs cast composition before trusting it.** For a mixed
  cast, require the pre-read to agree with the intended side; disagreement → positional fallback.
- **P2 — Harden/restrict dual on the worst painterly mediums:** force a stronger frontal
  gender-lock render, or bias the medium roll away from dual on androgynous-prone styles.

The same bad read also drives the solo-degrade guard (`degrade_solo_multi_face(...read=X/Y)`,
~29 fires/6 days), so fixing the read/consistency check helps both paths.

---

## Prioritized plan
| Pri | Fix | Effort | Impact |
|---|---|---|---|
| **P0** | Make `photography` dual-ineligible on the nightly cast path (enforce existing ban) | Low | Degrade 15.8% → ~9.6% |
| **P1a** | Slot-based face→body assignment on painterly mediums (don't trust flip-prone read) | Med | Kills the silent gender-swap |
| **P1b** | Post-swap gender-consistency check (re-read output vs routed cast gender) | Med | Makes the bug catchable + measurable |
| **P2** | Bigger/frontal faces on watercolor/film_noir duals; medium-two-shot not enviro-wide | Med | Cuts the next tranche of degrades |

## What's NOT the cause (ruled out)
- **Not infrastructure** — 0 timeouts, 0 Fly 546/resource-limit hits across all degrades.
- **Not the female-hair-variation feature** — degrades are face geometry/gender-read; hair doesn't
  move which-face-goes-on-which-body or face size.
- **Not a "painterly is bad" rule** — illustration/comics/glamour degrade at 0%; the culprits are
  specific (`photography` for degrades; androgynous-figure mediums for the gender flip).

## Key file:line anchors for the fixer
- Assignment by detected gender: `services/face-swap-dual/src/faceSwap.ts:959-960` (strip) / `:911-912` (per-face)
- Gender read / override: `_shared/dualSwapPipeline.ts:220-234`; `_shared/vision.ts:155-223`
- Identity gate (the blind spot): `_shared/dualSwapPipeline.ts:119, 271-289`; `faceSwap.ts:1098`
- Degrade-to-solo + re-roll: `_shared/dualSwapPipeline.ts:192-352`
- L/R flip + front-load: `_shared/dualSideOrder.ts:22-40`
- Nightly wiring: `nightly-dreams/index.ts:2741-2744, 3039-3188`
