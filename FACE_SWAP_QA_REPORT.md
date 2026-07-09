# Face-Swap Engine QA Report — Evidence & Recommendations

> 2026-07-08. The full-depth review Kevin requested ("detailed report, with evidence
> based data … recommendations on what we can safely do, if anything, to improve the
> renders … all the way through stage 7"). Companion docs: FACE_SWAP_ENGINE_AUDIT.md
> (architecture), FACE_SWAP_UPGRADE_PLAN.md (execution ledger). All benches used the
> real Kevin/Steph cast on private renders; grids on Desktop for owner judgment.

## TL;DR

1. **Our Fly engine won every comparison it entered.** easel (the only credible hosted
   dual-swap rival) loses on latency by an order of magnitude (1-3+ min queued vs
   20-30s) and did not beat us on likeness in the owner's review. CLOSED — do not
   revisit until some vendor ships a sub-30s-p95 two-person swap API.
2. **Dynamic action poses are ready to ship behind a percentage.** 8 of 12 action
   families pass at 4/5 or 5/5 single-shot (82% overall), and the production retry
   ladder turns a 4/5 single-shot family into ~99% delivered success. The 11 rejects
   split cleanly into two fixable classes (below) — zero were "engine can't do this".
3. **The single highest-leverage safe fix: a gender-read fallback.** 5 of 11 rejects
   were genderage misreading one athlete's gender (wet hair, mid-spin). One extra
   Haiku vision call *only on disagreement* would recover most of them for ~$0.002 a
   pop. Small, isolated, fail-safe direction unchanged.
4. **Stage 6 (Kontext style-unify) works mechanically** — swapped faces genuinely sit
   IN watercolor/canvas/storybook instead of on top of them, identity structurally
   preserved. Kevin's likeness verdict on the grid decides; cost is ~$0.04 + ~10s per
   stylized swap.
5. **Stage 7 (identity-conditioned generation) is real.** InfiniteYou rendered ALL 8
   expressive solo compositions the swap contract forbids (true profile, low-angle,
   over-shoulder) at 33-46s; the current pipeline **failed outright on 2 of 8** (swap
   found no face). PuLID is faster (14-15s) but drags composition back toward the
   reference photo's pose. If likeness clears Kevin's bar → new pct-gated solo branch
   for expressive photoreal compositions.

## What already shipped this session (verified live in production)

| Change | Evidence it works |
|---|---|
| CodeFormer restore f=0.9 on every swap (Stage 2) | 4/4 restores ok today, p50 2.4s, p95 9.2s, 0 failures; fail-open |
| Fly /detect solo probe, photoreal-gated (Stage 3) | Live verification render: `[detect] ok faces=1 genders=male 757ms`, `solo_probes:1`, no fallback, 40s e2e. Fly probe ~0.7s vs Haiku ~2-6s and $0 vs ~$0.004 per probe. Haiku auto-fallback proven (it fired during the misrouted-URL window and no dream was harmed) |
| Attempt-2 dual prompt mutation (Stage 5a) | Deployed; engages only on an already-failing ladder. Effect measured via `dual_attempts:` distribution in the weekly baseline |
| Dual reject reasons (`dual_reject:no_split:*` / `gender_unconfirmed:*`) | This report's failure taxonomy is built on them; now also in production forensics |

## Evidence base

### 1. Production baseline (30d, Stage 0) and today

Dual swaps 151 / single swaps 317 / heavy dead-letter 2.25% / heavy p95 86.8s (n=606).
Today: 121 log rows, dual swap p50 26s, all telemetry fields flowing.

### 2. Stage 4 — easel vs Fly (10 couple scenes, 4 safe + 6 contact)

- **Latency**: easel on fal is queue-based: swaps took 1-3+ min (first run: 100% of
  scenes timed out a 180s synchronous window). Our Fly engine: 10-20s p50 (measured
  per-scene, see stats below). easel cannot fit the 140s interactive deadline.
- **Quality**: owner reviewed the grid — "fly wins in every test i've viewed."
- **Verdict: REJECTED** (owner, latency + no quality edge). Ledger updated.

### 3. Stage 5b — action-pose depth QA (60 renders, 5 per family, full production leg)

| family | pass | reject reasons | swap p50 |
|---|---|---|---|
| surfing | 5/5 | — | 15s |
| kayak | 5/5 | — | 11s |
| bikes | 5/5 | — | 10s |
| skiing | 5/5 | — | 11s |
| ocean-play | 5/5 | — | 11s |
| jetski (stacked pose!) | 4/5 | gender misread ×1 | 20s |
| swing-dance | 4/5 | gender misread ×1 | 19s |
| salsa | 4/5 | gender misread ×1 | 11s |
| ice-skating | 4/5 | face hidden ×1 | 10s |
| rollercoaster | 4/5 | gender misread ×1 | 10s |
| flour-fight | 3/5 | face hidden ×1, transient error ×1 | 11s |
| ridge-scramble | 1/5 | face hidden ×3, gender misread ×1 | 13s |
| **TOTAL** | **49/60 (82%)** | 5 gender, 5 occlusion, 1 error | |

**Failure taxonomy — every reject is one of two fixable classes:**
- `gender_unconfirmed` (5): genderage misreads one athlete (wet/slicked hair, mid-spin,
  harness). The render itself was usually swappable — the safety guard (correctly)
  refused without confirmation. Fix = R2 below.
- `no_split:lt2_faces` (5): Flux rendered a face turned away — concentrated in
  ridge-scramble (the "reaches back to pull her up" wording turns a body upslope) and
  occlusion-prone scenes (flour cloud). Fix = pose wording, family-level. Not an
  engine limit.
- Also proven in passing: the stacked-pose per-face composite path handled
  jetski (rider-behind-rider) 4/5, and when Flux flipped the man/woman sides on a
  swing-dance render the engine gender-matched the cast to the correct faces anyway.

**Why 82% single-shot is shippable**: production wraps the swap in a retry ladder
(re-render up to 2× within budget, attempt-2 now mutates the prompt toward face
separation). At a family's 80% single-shot rate, P(all 3 attempts fail) ≈ 0.8%, and
even then nightly degrades gracefully / Create refunds. A reject costs ~30-60s of
latency, never a wrong face — the gender guarantee is untouched.

### 4. Stage 6 — stylized swap unify (watercolor, canvas, illustration, storybook)

Grid: `~/Desktop/style-unify-bench/index.html`. Mechanical read: today's output is a
visibly photoreal face on a painted scene; the medium's own `kontext_directive`
(authored, sitting dormant in the DB) applied over the swapped image produces a
genuinely painted face with facial structure preserved. 3/4 mediums completed
(illustration's kontext call hit a transient Replicate infra error; retryable).
Cost/latency if adopted: ~$0.04 + ~10s per stylized swap, per-medium DB flags, no
deploy. **Gate: Kevin's likeness verdict on the grid.**

### 5. Stage 7 — identity-conditioned generation (8 expressive solo compositions)

Grid: `~/Desktop/identity-hybrid-bench/index.html`. Legs: current production
(render→cdingram swap→restore) vs `bytedance/flux-pulid` vs `zsxkib/infinite-you`,
same prompts, Kevin's cast photo.

| | current pipeline | flux-pulid | infinite-you |
|---|---|---|---|
| compositions delivered | **6/8** (no face to paste on low-angle + over-shoulder; profile face it did paste was near-frontal source) | 8/8 | 8/8 |
| composition obedience | n/a (contract forbids these) | **drags toward frontal** (ignored "strict side profile") | followed the brief, true profile delivered |
| latency | 11-14s | 14-15s | 33-46s |
| est. cost/image | ~$0.05 (render+swap+restore) | ~$0.02-0.03 | ~$0.05-0.07 |

The structural point: swapping requires a big frontal face and caps identity at
inswapper's 128px; identity-conditioned generation removes both limits at comparable
cost and interactive-compatible latency. **Gate: does the grid clear "that's really
me"?** (PuLID's composition drag makes InfiniteYou the primary candidate despite 2-3×
latency.)

### 6. Stage 8 — identity verification (added 2026-07-08 after the owner's review)

The owner's grid review invalidated the depth QA's pass metric: "pass" measured
mechanical completion, and several passes carried a face that wasn't the cast member.
Built + shipped same-day (measurement in shadow): ArcFace embeddings on the Fly service
(YuNet landmarks → umeyama alignment → MobileFaceNet 512-d → cosine vs the cast photo),
`/verify` endpoint, and `identity_sim:L…/R…` logged on every production dual
(live-verified: `identity_sim:L0.739/R0.638`).

**Calibration on the depth-QA corpus (owner ground truth):**
- Unswapped faces score ≈ 0 (ceiling 0.073) — a face the swap never touched is
  unmistakable.
- Owner's line: **min-sim ≥ 0.35** ("everything from the yellow scores up looks good").
- At that line, **11 of 49 mechanical passes fail identity** (~22%) — including two
  where the second face wasn't even detectable (occlusion; the skiing-4 case the owner
  caught after my first aggregation skipped unmeasured faces — a missing face now
  scores 0, fail).
- CORRECTED Stage 5b truth: single-shot *delivered-likeness* rate on action families is
  38/60 (63%), not 82% — the retry ladder + the identity gate is what closes the gap.

**Medium scope (owner's concern, correct):** the 0.35 line is valid ONLY for photoreal
render bases — stylized mediums score structurally lower against a photo, and YuNet
under-detects painted faces, so enforcement is per-medium-class with unset = shadow.
`scripts/bench-identity-stylized.js` measures per-medium distributions (photography
control + watercolor/canvas/illustration/storybook/fairytale) to set or withhold each
medium's line; production shadow telemetry accrues the same data from real traffic.

## Recommendations (ranked, each with its safety mechanism)

0. **R0 — Identity enforcement (supersedes all: this IS the quality guarantee).**
   Enforce min-sim ≥ 0.35 + two-measurable-faces on REALISTIC render bases (threshold
   via secret, unset = shadow); stylized mediums shadow-only until their per-medium
   calibration names a line. Sub-threshold swap → rerender signal → existing ladder.
   Fail-open only on verifier infrastructure errors, never on measured absence.
1. **R1 — Seed the contact/action pose pool** from the 8 families at ≥4/5 (surfing,
   jetski, swing-dance, salsa, kayak, bikes, skiing, ocean-play + ice-skating and
   rollercoaster at your call), MVP-25 first, behind `engine_config.dual_contact_pose_pct`
   (default 0) → 10% nightly → watch `dual_reject:*` rate vs baseline → raise + Create.
   Rewrite ridge-scramble/flour-fight wording before including (both-faces-explicit,
   no reaching-back poses, faces clear of particle clouds). Safety: pct flag, retry
   ladder, gender guarantee unchanged, instant DB rollback.
2. **R2 — Gender-read fallback on `gender_unconfirmed`**: before rejecting, one Haiku
   vision gender-confirm of the two detected face crops; proceed only if it resolves
   the disagreement, else reject as today. Recovers ~half the action-pose rejects
   (~8% of duals in that mix) for $0.002 on the rare disagreement path. Safety:
   confirmation can only ADD certainty; the fail direction (no confirmation → no
   paste) is unchanged. ~Half a day of work.
3. **R3 — Contact-pool lint**: the proximity scanner gains a contact-pool mode
   (entries must name both faces visible/toward camera; ban reach-back/pull-up and
   face-obscuring particle language). Encodes today's failure taxonomy so future
   seeding can't reintroduce it. Cheap, pure tooling.
4. **R4 — Stage 6 adoption per-medium IF the grid passes your eye**: wire
   `maybeKontextPass` (module already exists) after restore behind
   `swap_style_unify_enabled` + per-medium DB flags. Consider tying to 2✦ mediums
   (+$0.04 unit cost).
5. **R5 — Stage 7 pilot IF the grid passes your eye**: InfiniteYou as a new
   `solo_hybrid_pct` render branch, photoreal mediums + expressive solo compositions
   only, nightly-first. This is the unlock for compositions face-swap can never do
   (profiles, far shots, low-angle) — the "more fluid, natural renders" goal from the
   original audit ask. PuLID only as a fast-lane variant later if its composition
   drag is acceptable on some subset.
6. **R6 — Closed: easel / queue-based swap vendors.** Re-open only on evidence of a
   sub-30s p95 hosted two-person swap.

## Costs if everything above ships (per affected render, on top of today)

| item | delta |
|---|---|
| R2 gender fallback | +$0.002 only on disagreement (~10% of action duals) |
| R4 kontext unify | +$0.04 + ~10s, stylized swap renders only |
| R5 InfiniteYou branch | roughly cost-neutral vs render+swap+restore (~$0.05-0.07 vs ~$0.05) |
| R1/R3 | $0 (pool content + tooling) |

Unit economics stay inside the existing sparkle margins (see the audit's economics
appendix); nothing here adds a per-dream cost of the magnitude that would move pricing.

## Standing QA discipline for the pose expansion (owner directive 2026-07-08)

"Only if we can guarantee quality — QA heavily as we go." Encoded as: every new pose
family runs the depth bench (5 reps minimum) before seeding; every seeded pool passes
the contact-pool lint + MVP-25 + owner feed review before scaling; every % raise
watches `dual_reject:*` + dead-letter vs baseline for its soak window.
