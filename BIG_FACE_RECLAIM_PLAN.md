# Big-face reclaim — stop throwing away couples whose faces are "too big" (2026-09-17)

**Kevin:** "it's really unfortunate we have to throw away base renders and fail couples just because our face
swap isn't very durable." The paired pro-vs-ultra test (NIGHTLY_FALLBACK_CHAIN_LEDGER.md) showed `giant_face` is
the largest reclaimable failure class: pro 4 of 18 couple renders, ultra 7 of 16 — two frontal faces present,
rejected only by the 0.40×H guard.

## Phase 0 — the experiment (DONE 2026-09-17, ~$2, harness in the session scratchpad)

The 11 giant renders from batch `PAIR2` (faces 42-85% of frame height), Kevin's real cast, the Fly engine's own
`perFaceCompositeSwap` driven locally under Deno with the guard lifted, CodeFormer at 0.9 / 0.7 / 0.5, identity by
the engine's ArcFace against the cast photos. Five iterations, each teaching one thing:

| v | change | result |
|---|---|---|
| 1 | guard lifted, engine as-is | one face swaps (0.68), the other is untouched (0.08): `faceCropBox` pads 2.4× and clamps to the frame width, so a giant face's crop contains BOTH faces and the swap model picks its own |
| 2 | crop clipped at the midline between the faces | both swap (0.51 / 0.63) but a visible seam through one face: giant faces overlap horizontally (95 px here), so any vertical cut lands inside a face |
| 3 | uncut 1.6× crop + neighbour painted out | 7 of 11 "no face found": a SQUARE crop clamped to the frame width cuts any face taller than the frame is wide (> ~57% of H in 9:16); and a 15% expansion of our own box let the neighbour's half-face stay detectable |
| 4 | no crop — full-frame swap, neighbour painted out (outside our unexpanded box), pixels restored after | right face 0.61-0.73 on 8 of 9, left face 0.08-0.34 on all: the PASTE was the bug — each face's mask is its box +30% + a 0.6×w feather, so a giant right face's mask covers the left face and the second paste overwrites the first with the original |
| **5** | **paste masks bounded at the neighbour (box edge, or the midline of the overlap)** | **both faces swap on 9 of 11**: min identity raw 0.59-0.73 on 8, 0.38 on one (turned face); the same band as normal couples (0.64-0.75). The two at 68% and 85% of H: every swap model reports "no face found" → the practical ceiling is ~0.60. |

**Restore is not the lever.** CodeFormer 0.9 ≈ raw with a touch of sharpening (identity −0.03 to −0.10); 0.7 and
0.5 go waxy and cost −0.1 to −0.2 identity, and re-draw the unswapped face too. Ship raw or 0.9, never lower.

**Quality at 42-60% of frame height:** on realistic / painterly-realistic mediums the swaps read as ordinary swaps
(no smear, no seams — full frames checked). On flat / stylized mediums (vector, watercolor, neon) the pasted face
shows the grainy photo-on-paint texture any swap shows there, amplified by size: the existing medium bans are the
right filter, not the size guard.

**Verdict: GO.** The 2026-09-02 "pixelated smear" was a crop/paste path defect on big faces, not a resolution
ceiling. Review rows: Kevin's private Dreams album, captions `BIGFACE <pair> · <model> · raw|f0.9 · h% · L/R sims`.

## Phase 1 — SHIPPED 2026-09-17; ceiling set to **0.50** (Kevin, same evening: "i actually don't like renders that
close up … .5 sounds more reasonable" — a 0.53 couple, `AB-BF 20`, was the example he didn't want)

Measured on batch `BF` (20 forced couples, ceiling 0.60): **the tier reclaimed 4 of 20 couples and all 4 held**
(faces at 0.42 / 0.49 / 0.51 / 0.53 of frame height; identity min 0.63-0.73, mean 0.68 vs 0.70 for the other held
couples). Every one of those was a `giant_face` re-render the day before. Delivered couples 10 of 20; the rest were
5 faces above the ceiling and 5 with too few detected faces. No engine errors, no identity failures. Stamps:
`big_face:<frac>` on a reclaimed swap, `giant_face_hfrac:<frac>` on a giant rejection (for tuning the ceiling).
Rollback = `UPDATE engine_config SET dual_big_face_max_hfrac = 0.40`. Review rows: Kevin's album, captions `AB-BF n`
(3, 5, 17, 20 are the reclaimed ones).

### What shipped (the design below, as built)

**Fly engine (`services/face-swap-dual/src`):**
1. `faceDetectMath.ts`: a `bigFace` tier between `GIANT_FACE_MAX_HFRAC` (0.40, unchanged default) and a request
   parameter `bigFaceMaxHFrac` (from the isolate; default = 0.40, i.e. today's behaviour → ships dark). In the
   tier, `planDualSplit` returns `bigFace: true` + `maxFaceHFrac` instead of `giant_face`. Above the parameter: still
   `giant_face`. New pure helpers: `occlusionMask(frame, ours, other)` (other's box +15% minus our box, unexpanded)
   and `compositeFaceMaskedBounded(...)` (mask bounded at the neighbour's box edge / overlap midline).
2. `faceSwap.ts`: big faces take the per-face path with NO crop: paint the neighbour out, swap the full frame, restore
   the painted pixels, paste with the bounded mask. The existing IoU > 0.35 guard stays. Response carries
   `bigFace` + `maxFaceHFrac` so the isolate can stamp `big_face:<frac>`.
3. Tests: `planDualSplit` tiers (0.40 default keeps `giant_face`; a raised parameter yields `bigFace`), the occlusion
   mask never touches our own box, the bounded paste never crosses the neighbour, the fixture couple still swaps.

**Isolate (`_shared/dualSwapDispatch.ts`, `dualSwapPipeline.ts`, `nightly-dreams`, one migration):**
- `engine_config.dual_big_face_max_hfrac` (numeric, default 0.40) passed in the dispatch body; raise to 0.60 from the
  dashboard to enable, lower to 0.40 to roll back — no deploy.
- stamps `big_face:<frac>`; restore profile unchanged (0.9); identity gate unchanged (0.35).
- dbspec: the column exists with its default; jest: the dispatcher forwards the value and defaults it.

**Measure:** a 20-couple batch with the ceiling at 0.60 — reclaimed share (expected ~20% of couple nights on pro),
identity sims from stamps, and Kevin's grades on the reclaimed ones. Roll back = one config value.

**Kevin's decisions:** the ceiling (0.55 conservative / 0.60 measured); whether stylized mediums should keep a lower
ceiling (or rely on the medium bans); taste on the review rows — a 50-60% two-face composition is a portrait couple.
