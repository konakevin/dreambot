# Couple prompt order — PARITY test plan (subject_first vs legacy)

**Question (Kevin, 2026-09-07):** with `couple_prompt_style = subject_first` applied, are nightly couple renders
at parity with legacy on everything EXCEPT the defect it fixes (tiny / profile / back-turned couples)?
The six QA rounds in `NIGHTLY_MODEL_POLICY_PLAN.md` §8 proved the fix (44/48 first-try swaps vs 0/7) and
were visually inspected on contact sheets, but nothing was measured head to head on the same inputs.
This plan measures it. The knob stays `legacy` until §5 passes.

## 1. What "parity" means here (the bar)

Per shipped image (what the user would actually see, so a legacy render that degraded to a solo counts
as shipped), scored on six axes, 1-5:

| axis | what a 5 is | parity rule |
|---|---|---|
| scene richness | the place is dressed: 3+ specific props / textures / light sources from the brief visible | subject_first mean ≥ legacy mean − 0.25 |
| brief fidelity | scene_description elements present (not generic filler) | ≥ legacy − 0.25 |
| wardrobe fidelity | both wardrobes match `left_wardrobe` / `right_wardrobe` | ≥ legacy − 0.25 |
| medium fidelity | the render is in the rolled medium's technique (paper, ink, canvas…) | ≥ legacy − 0.25 |
| mood / atmosphere | light + palette carry the `mood` field | ≥ legacy − 0.25 |
| couple framing | two large frontal faces, clear gap, natural side-by-side | must be HIGHER (this is the fix) |

Plus the hard numbers from the stamps: first-try swap rate, mean identity L/R, `quality_gate` pass rate,
degrade rate, and the judge's `tight` / `nonsense` / `bad` flags. And Kevin's blind preference on the pairs.

**Pass = every non-framing axis inside −0.25, framing higher, quality-gate pass rate not lower, Kevin's
blind preference for subject_first ≥ 40 % (i.e. not worse), zero new failure modes in the flag tally.**
Any axis outside the band → fix the prompt (the axis tells us which clause to restore) and re-run §3.

## 2. Mechanism — true PAIRS (only the order differs)

Every render already persists `ai_generation_log.sonnet_brief` + `sonnet_raw_response` (the six slots
Sonnet wrote). So a pair is: render A on one order, read A's slots back, render B on the other order from
the SAME slots via a new QA-only flag `force_dual_slots` (JSON `DualSlots`, nightly QA path only, parsed by
`nightlyQaFlags.ts`, applied in `runCharacterSlotPipeline` in place of the Sonnet call). Same cast, sub,
medium, action, model, moods, place → the prompt text differs ONLY in order. Order of A/B is randomised
per pair so neither style always gets the "fresh Sonnet" seat. ~40 lines + a jest test that the flag
round-trips and that a forced slot set produces byte-identical prompts on both styles minus order.

Also locks (jest, no renders): solo prompts are byte-identical with the style set (the branch is dual-only);
the Create / DLT / first-dream paths never pass `promptStyle` (grep test).

## 3. Phase A — 40 paired renders on flux-1.1-pro (the target), Kevin's cast

Surface mix, chosen to cover every couple path nightly can roll:
| surface | pairs | how forced |
|---|---|---|
| plain location + Option B action | 8 | `force_plain_location` + `force_place` (4 real places, 4 QA pools) |
| Fall holiday subs | 6 | `force_holiday_scene: fall` + 6 different pools |
| Halloween subs | 4 | `force_holiday_scene: halloween` |
| goofy / playful | 4 | `force_playful` |
| elegant | 4 | `force_elegant` |
| active / fun buckets | 4 | `force_active` |
| Halloween hero cozy / eerie | 2 | `force_day_of` + `force_hero_register` |
| seated / closer variants | 4 | `force_dual_closer`, seated pools |
| mediums | rotated | `force_medium` so each of the 12 face-swap mediums appears ≥ 3 times across the 40 |

= 80 renders. Two in flight (pool-headroom gated, machine is memory-tight: no chained waiters, batches of
10 pairs). ~45 min. Cost ≈ 80 × ~6¢ ≈ $5.

## 4. Phase B — the same pairs on the fallback models (10 pairs)

2 pairs each on gemini-2-image, flux-2-pro, seedream-4, grok-imagine-image, flux-dev (Kevin's final backup
set) reusing 10 of the Phase A slot sets, so the backup path is measured, not assumed. 20 renders, ~12 min.

## 5. Scoring — three independent reads, then the verdict

1. **Stamps** (`ai_generation_log`): first-try, identity L/R, quality gate, degrade, per style.
2. **Sonnet vision judge, PAIRED and blind**: sees A and B in random order with the slots text, scores the
   six axes for each and picks a preference. Rubric in `scratchpad/parity/judge-pair.mjs`, N=50 pairs.
   (The judge's grades skew harsh and drift; only the DIFFERENCE within a pair is used.)
3. **Kevin, blind**: an artifact page showing each pair side by side in random L/R order with the brief,
   a "prefer left / right / same" button per pair, reveal after submit. Also posted to the private Dreams
   album with captions `⚖️ P<n>` so he can zoom at full size.

Verdict table in `NIGHTLY_MODEL_POLICY_PLAN.md` §9: per-axis means and deltas, stamp rates, judge
preference %, Kevin preference %, pass/fail per §1. If pass → flip the knob (one row) → **Phase C**.

## 6. Phase C — one live soak night, then hold

Flip `couple_prompt_style = subject_first` for one 08:00 UTC nightly. Morning audit
(`scripts/check-forensics.js` + a stamp tally over real users vs the previous 7 nights): first-try rate,
degrade rate, quality-gate pass, and a 20-render judge sample. Rollback = the same row set to `legacy`.
Hold at `subject_first` if the real-user numbers match Phase A.

## 7. Not in scope

Create / DLT / first-dream couple prompts (they do not pass `promptStyle`); the hero's photography pin vs
the 1.1-pro override library (separate decision, §8 of the policy plan); the model-policy Phase 3/4.
