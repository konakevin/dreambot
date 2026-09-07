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

## 8. RESULTS (2026-09-07 evening, 40 pairs on flux-1.1-pro + Phase B)

Mechanism shipped as planned (§2: `force_slot_input` + `force_dual_slots`, commit 0b1dbcb6). Every pair
below is the SAME slot input and the SAME Sonnet slots rendered twice; only the prompt order differs.
Blind paired Sonnet judge, deltas = subject_first − legacy, pass band = within −0.25 (framing must be higher).

**Batches 1-2 = subject_first v2 (scene AFTER the identity blocks) — FAILED parity, 19 pairs:**
scene −1.63 (won 0 / lost 17), brief fidelity −1.42, mood −0.84, wardrobe +0.63, medium 0.00, framing
+1.32; judge preferred legacy 13:6. v2 fixed the couple and lost the set (lessons 12-17).

**Batches 3-4 = subject_first v3 (people line → FULL scene → identity blocks) — PASSED, 20 pairs:**
| axis | legacy | v3 | Δ | pairs won / lost | verdict |
|---|---|---|---|---|---|
| scene richness | 3.20 | 3.30 | +0.10 | 8 / 9 | pass |
| brief fidelity | 2.35 | 2.55 | +0.20 | 7 / 6 | pass |
| wardrobe fidelity | 1.55 | 1.75 | +0.20 | 9 / 4 | pass |
| medium fidelity | 3.15 | 3.05 | −0.10 | 7 / 10 | pass |
| mood | 3.40 | 3.40 | 0.00 | 7 / 7 | pass |
| framing | 3.00 | 3.85 | +0.85 | 11 / 2 | pass (higher) |
Judge preference subject_first 13 : legacy 7. Stamps (20 renders per style): first-try swap 16 vs 9,
degraded to solo 1 vs 6, **faceless (`pure_scene_fallback`) 0 vs 2**, shipped below the 0.35 identity
floor 0 vs 1, quality gate 20/20 vs 18/18, mean min-side identity 0.62 vs 0.47. Sheets:
`scratchpad/parity/sheet-A3.jpg`, `sheet-A4.jpg`; full size in Kevin's Dreams album (captions `⚖️v3 P<n>`).
Kevin's blind grading page (db-backed votes): https://claude.ai/code/artifact/f8802bec-8db8-4a44-aa65-75d9e796ec34

**Verdict:** v3 is at parity on every quality axis and materially better on the couple itself. The knob
`engine_config.couple_prompt_style` stays `legacy` until Kevin's blind votes are in (§5.3) and Phase B is
recorded below; then Phase C (one live night).

## 9. FOLLOW-UP PLAN — issues found and improvements worth making (ranked)

Kevin: "let's have a plan after the renders to address any issues, or anything you find that might make an
improvement." Each item is handoff-ready; the lesson numbers point at `COUPLE_PROMPT_PARITY_LESSONS.md`.

| # | item | evidence | what to build | size |
|---|---|---|---|---|
| 1 | **Flip `couple_prompt_style = subject_first` (v3)** after Kevin's blind votes ≥ 40 % and Phase B clean; Phase C = one live night + morning audit vs the last 7 nights (first-try, degrade, faceless, gate) | §8 | one row; rollback = `legacy` | trivial |
| 2 | **A cast dream must never ship faceless.** `pure_scene_fallback` shipped 2 of 39 legacy couples with no people and no quality-gate run | L19 | (a) stamp it loud (`SHIPPED_FACELESS`) + count it in `dream-queue-monitor` / the nightly audit; (b) before falling to a pure scene, retry the solo rebuild ONCE on flux-1.1-pro with the subject_first single line (Kevin: rebuild stays 1.1-pro); (c) log `observability.soloRebuildPrompt` so the two-faces cause (L22-23) can be root-caused on real degrades | S |
| 3 | **Quality gate must read the identity stamps.** A couple shipped with the partner at 0.27 (< 0.35) and the gate said PASS | L20 | gate = fail (route to the solo rebuild) when `identity_shipped_best` < floor; add the case to the gate's test | S |
| 4 | **Wardrobe fidelity is 1.6-1.9 / 5 in BOTH orders** — the weakest axis of the whole render | L14, §8 | (a) Sonnet brief: wardrobe as ≤ 8 words, material + colour + one silhouette, no accessories list; (b) in subject_first move "wearing …" to the front of each identity block (before the ~40-word physical description); measure with the same paired judge (10 pairs) | M |
| 5 | **Solo rebuild renders two people (flux-2-flex)** → gender refuse → faceless | L19, L22-23 | needs #2c first; then either 1.1-pro rebuild (Kevin's call already) or a one-line solo scene from Sonnet at rebuild time | S after #2 |
| 6 | **Hero couple's photography pin is silently replaced** by one of 5 curated 1.1-pro art fragments (`faceSwapModelOverrides.ts`, keyed by model only) | L2 | decide: exempt `holiday_hero` rows from the override (true photography day-of look) OR retitle the hero row's medium to what it actually renders; either way the `scene_medium:` stamp should name the fragment actually used | S |
| 7 | **Hero solo fallback renders two people** because the hero `attire` axis names both ("she in …, he in …") | L4 | rebuild attire = self's half only (split on "he in" / "she in") | S |
| 8 | **Female hair variation (75 %) is a hidden variable in every couple test** | L8 | document in the QA-flag doc + `qa-round.mjs`/`batch.mjs` default `force_female_hair_pct: 0` for A/B work only (never in prod) | trivial |
| 9 | **Judge protocol for couples:** report the shipped SHAPE (couple / solo / faceless) next to axis means; paired + blind only; holiday overlays declared to the judge | L5, L7, L25 | fold into `judge-pair.mjs` (done for overlay) + the QA log template | trivial |
| 10 | **Observability gaps found:** the slot input was never logged (fixed 0b1dbcb6); the solo rebuild prompt still isn't; `gate=null` on the pure-scene path | L9, L19 | #2c + stamp `quality_gate:skipped:<why>` instead of nothing | S |
| 11 | **1.1-pro's first ~60 words rule** (L1, L13) is now a design constraint for every 1.1-pro prompt, not just couples: audit the SINGLE order (scene at word ~100 of ~300 after the identity block) with the same paired method before touching it — it may be leaving set-dressing on the table too | L13 | 10 paired solo renders, same slots, scene-before-identity vs current | M |

Not doing: widening the dual framing text (2026-09 lesson: costs identity), re-adding the environmental
two-shot paragraph (27 clauses proven to be landscape-steering, L11), any change to Create / DLT.
