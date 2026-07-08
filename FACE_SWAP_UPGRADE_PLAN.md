# Face-Swap Engine Upgrades — Zero-Disruption Implementation Plan

> 2026-07-08. Executes FACE_SWAP_ENGINE_AUDIT.md's findings while production users keep
> dreaming. Companion: CREATE_PIPELINE_ARCHITECTURE.md, NEW_SCENE_QUALITY_PLAN.md.

## The staged execution contract (isolation is the point)

Each stage flips **exactly one behavioral variable** in production, and no two stages'
flips overlap in time. Concretely:

- **One live experiment at a time.** Code for multiple stages may land dark in the same
  deploy, but only one flag flips per soak window. If dual dead-letters rise during
  Stage 2's window, the cause is Stage 2 — nothing else changed.
- **Every stage has the same lifecycle:** `land dark → offline bench (private cast
  renders, Kevin signs) → shadow (log-only, where the change alters a decision) → flip
  smallest blast radius (nightly before Create, % before 100%) → soak window vs the
  Stage-0 baseline → promote or roll back → record verdict in this doc.`
- **Fixed soak windows:** 48h for engine/infra flips (Stages 1-4), 72h+ for taste-level
  changes (Stage 5+), because quality regressions surface slower than error rates.
  **Amended 2026-07-08 (Kevin: "fail forward, friends and family beta"):** soaks may be
  compressed or skipped by owner call while in beta, PROVIDED the change is fail-open or
  instant-rollback and the one-variable-at-a-time rule still holds. Re-tighten at public
  scale.
- **A stage is DONE only when its verdict line below is filled in.** The next stage's
  flip waits for it. Benches for future stages may run during any soak (they're
  offline), so the calendar stays tight without contaminating measurements.
- **Rollback is always a config/secret change, never a deploy.** If any rollback would
  require a deploy, the stage isn't ready to flip.

Stage ledger (fill in as executed):

| Stage | Variable flipped | Flip date | Soak | Verdict |
|---|---|---|---|---|
| 0 | none (observability/hardening) | 2026-07-08 | — | ✅ DONE: baseline recorded; housekeeping landed (2 audit corrections); Fly auth mandatory+constant-time, deployed; success-path telemetry LIVE (verified: dual_engine:fly-dynamic, dual_attempts:1, dual_swap_ms:16445 on a real dual, 38s e2e) |
| 1 | ~~dynamic split flip~~ obsolete — already live (verified 2026-07-08 via Fly logs + telemetry) | — | — | ✅ CLOSED: engine confirmed dynamic on real duals; monitor engine mix via faceswap-baseline.js |
| 2 | post-swap restoration on | FULLY LIVE 2026-07-08 (nightly + Create same day — Kevin: fail-forward, friends-and-family beta) | skipped by owner call | ✅ CLOSED: CodeFormer f=0.9; verified live on a Create swap (face_restore:ok:9220ms, 54s e2e); fail-open + instant config rollback made the soak insurance, not requirement |
| 3 | solo probe: Haiku → Fly /detect | 2026-07-08 (`SOLO_PROBE_ENGINE=fly`, MEDIUM-GATED) | compressed (owner fail-forward posture) | ✅ LIVE: agreement bench 10/12 vs Haiku on 12 real swapped renders (Fly 262-712ms vs Haiku ~2-6s); BOTH misses were stylized mediums (canvas false-2-faces, illustration false-0-faces) = the plan's predicted YuNet weakness → shipped the contingency: Fly probe only on PHOTOREAL mediums (`photography`/`hyperreal`/`render`, the `PHOTOREAL_PROBE_MEDIUMS` set in singleSwapGuard.ts), Haiku keeps every stylized medium + remains the automatic in-request fallback on /detect transport errors. Note: nightly re-rolls those 3 mediums away for character dreams, so this effectively fires on Create solos only (+ force_medium paths). LIVE-VERIFIED 22:26 UTC on a real solo photography render: Fly `[detect] ok faces=1 genders=male 757ms`, forensics `solo_probes:1` with no fallback, 40s e2e. (First verification exposed a silent miss: `DUAL_SWAP_FLY_URL` carries a legacy `/face-swap-dual` path the swap route tolerates but /detect didn't — probe now targets the URL's ORIGIN.) Rollback: unset the secret |
| 4 | dual engine: Fly → easel (canary %) | | 48h per % step | bench IN FLIGHT 2026-07-08 (scripts/bench-dual-engines.js, combined with 5b: 4 safe + 6 contact poses, Fly vs easel-on-fal, both +CodeFormer) — first run lost to fal.run sync-gateway hangs; rerun uses the queue.fal.run API |
| 5a | dual retry prompt mutation | 2026-07-08 (deployed unconditionally, no flag — owner fail-forward call; mutation only engages on attempt ≥2 of an already-failing ladder, so attempt-1 behavior is byte-identical) | n/a | ✅ LIVE: dual rerender ladder prepends "two people side by side, both faces clearly visible and unobstructed, heads apart, " from attempt 2 (dualSwapPipeline `rerender(attempt)`, generate-dream + nightly). Verdict on effectiveness rides the weekly baseline's `dual_attempts:` distribution |
| 5b | contact poses (pct) | | 72h per % step | |
| 5c | expanded single compositions (pct) | | 72h | |
| 6 | stylized swap unify (per medium) | | 72h per medium | |
| 7 | solo hybrid pipeline (pct, photoreal only) | | 72h | |

## Ground rules (apply to every stage)

1. **Everything ships dark.** Each behavior change lands behind an `engine_config` field
   or env flag, default = current behavior. Deploys are therefore always safe; behavior
   flips are dashboard/secret operations with instant rollback.
2. **Shadow before flip.** Where a change alters a decision (detection, probes, engine
   choice), run the new path in log-only mode alongside the old one first, then compare.
3. **Nightly before Create.** Nightly is non-strict (degrades gracefully, no refunds);
   Create is strict (failures refund paying users). Every risky flip proves on nightly
   for 48h before Create adopts it.
4. **First-dream last.** The onboarding cascade is the highest-stakes moment in the app;
   it stays pinned to the proven configuration until a change has run clean on nightly +
   Create for a week.
5. **Bench with the real cast.** Quality judgments use Kevin+Steph's cast on private
   renders (`persist:false` or `is_public:false`), judged from the feed like AlphaBot
   candidates. No user's photos are ever used for benching.
6. **Gates between stages.** Do not start stage N+1 until stage N's monitoring window
   passes: dual dead-letter rate ≤ baseline, refund rate ≤ baseline, p95 render time
   under the 140s deadline with ≥20s headroom, no new Sentry signatures. Baseline =
   trailing 14 days (capture before Stage 0).

## Stage 0 — Observability + hardening (no behavior change, ~1 day)

Everything here is invisible to users and makes later stages measurable.

- **Engine-variant telemetry.** Fly `/healthz` returns `{variant: 'dynamic'|'legacy',
  authRequired: bool}`; the dual dispatcher logs which engine served each job into
  `fallback_reasons` (e.g. `dual_engine:legacy`) or `rolled_axes.swap` — this makes the
  dormant-flag failure class permanently visible. (services/face-swap-dual/src/index.ts,
  _shared/dualSwapDispatch.ts)
- **Swap-cost accounting.** Extend the render's `rolled_axes.timings`-style logging with
  `swap: {engine, calls, rerenders, probe_calls, restore_calls, est_cents}` — additive
  JSON, no migration. (generate-dream, nightly-dreams, dualSwapPipeline, singleSwapGuard)
- **Fly auth hardening — ordered:** (1) `fly secrets set FLY_AUTH_TOKEN=<new>` +
  matching Supabase secret `DUAL_SWAP_FLY_TOKEN` (already exists — verify they match);
  (2) deploy Fly code that REQUIRES the token + `timingSafeEqual`; (3) verify a
  production dual completes. Rollback: redeploy prior image (fly releases).
- **Housekeeping (pure deletes/fixes):** delete `dualGenderRouting.ts` + its test; fix
  the stale "primary is yan-ops" comment; bilinear resize on swap-output mismatch (both
  copies); port the 1.2MB perturb guard to the Fly copy; extend
  `scan-dual-faceswap-proximity.js` to also scan `dualBriefBuilder.ts` literals (with an
  allowlist for its deliberate reframe bullets); grep-confirm `sceneEngine`'s
  `*_FACESWAP` branch is unreachable and delete it. `kontextPass.ts`: keep on disk,
  decision in Stage 6.
- **Baseline capture:** `scripts/faceswap-baseline.js` (run before any flip + weekly).
  **BASELINE RECORDED 2026-07-08 (30d):** dual swaps 151, single swaps 317, heavy jobs
  621, heavy dead-letter 2.25%, dead-letter refunds 13, heavy duration p50 36.2s / p95
  86.8s (n=606, ≥53s headroom under the 140s deadline), swap fallback reasons: NONE
  (later disproven as a dormancy signal — the dynamic engine is live and silent on success;
  see Stage 1), swap-accounting rows: 0 (pre-telemetry).

## Stage 1 — Wake the dynamic split — **OBSOLETE, ALREADY LIVE (verified 2026-07-08)**

Fly logs prove `dynamicSplit=true` has been serving since June 17 (release v6): real
YuNet detections + genderage routing on every dual, zero rejections in the visible
window. The audit's dormancy finding was a telemetry mirage (success paths log nothing).
Stage 1 therefore reduces to: land the Stage-0 success-path telemetry, then run
`scripts/faceswap-baseline.js` after 48h and confirm the engine mix reads `dynamic` on
100% of duals. No flag work. The original shadow-mode design is retained below for
reference only.

ORIGINAL (pre-verification) TEXT — the Fly detection engine appears dormant. Do NOT just
set the flag — shadow it first, because its rejection behavior changes cost and latency.

1. **Shadow mode.** Add `DUAL_SWAP_DYNAMIC_SPLIT=shadow`: run detection + plan the split,
   LOG the outcome (`would_split_at`, `faces`, `gap`, `would_reject:reason`,
   `gender_match`), then execute the legacy 55/55 exactly as today. Zero user impact.
   Deploy, run 48h (~10-15 duals at current volume — thin, so ALSO drive ~20 private
   dual test renders with the Kevin/Steph cast across the pose pools to fatten the
   sample).
2. **Read the shadow data.** Key numbers: % of duals where the dynamic plan diverges
   from 55/55; % it would have rejected (these are today's silent both-on-one/flip
   failures); % where genderage disagrees with prompt sides.
3. **Flip:** `fly secrets set DUAL_SWAP_DYNAMIC_SPLIT=true`. Nightly first is not
   separable here (one Fly service serves both) — acceptable because strict-Create
   failures refund cleanly and the rerender ladder catches rejects. Monitor 48h:
   `no_dual_split` rate (NEW signal — expect nonzero), dual dead-letter/refund rate vs
   baseline, p95 duration (each reject adds a rerender ≈ +30-60s; the 85s recovery
   budget bounds it).
4. **Rollback:** set flag back to `shadow` (instant, no deploy).

## Stage 2 — Post-swap face restoration (bench → nightly → Create, ~3-4 days)

1. **Bench offline.** `scripts/bench-face-restore.js`: take ~15 recent swapped renders
   (Kevin/Steph cast, regenerate privately), run GFPGAN (Replicate `tencentarc/gfpgan`)
   and CodeFormer at blend/fidelity {0.6, 0.8, 0.9}, output an HTML compare grid
   (qa-matrix pattern). Kevin picks the winner. Cost: ~$0.002/image.
2. **Integrate dark.** `_shared/faceRestore.ts` — restore(url) → url, called immediately
   after every successful swap (single, dual, degrade-single), gated on engine_config
   `face_restore_enabled` (default false) + `face_restore_blend`. Timeout 20s,
   fail-open (restore error → ship the unrestored swap + `restore_failed` reason —
   restoration must never break a dream). Budget check: runs inside the existing 140s
   deadline; log its duration in the Stage-0 accounting.
3. **Flip for nightly** (config row, no deploy). 48h: eyeball nightly cast renders,
   watch duration p95 + `restore_failed` rate.
4. **Flip for Create.** Same config, now global.
5. **Follow-up experiment (separate flag):** `hd_upscale_swapped_enabled` — with
   restored faces, re-test Clarity upscale on 5 swapped renders; if the uncanny-valley
   objection is gone, lift the migration-310 block (client + server together).
6. **Rollback:** config off; no deploy.

## Stage 3 — Solo probe on Fly /detect (shadow → flip, ~2 days)

> **EXECUTED 2026-07-08** — see ledger. Implementation deviated from the sketch below in
> two ways: (a) the selector is the Supabase secret `SOLO_PROBE_ENGINE` (not engine_config)
> since it's a server-only routing choice; (b) instead of a multi-day shadow, a one-shot
> offline agreement bench on 12 real swapped renders (10/12, misses both stylized) went
> straight to the predicted contingency: medium-gate to photoreal (`PHOTOREAL_PROBE_MEDIUMS`
> in singleSwapGuard.ts), Haiku everywhere else + as transport fallback.

1. Add `GET/POST /detect` to the Fly service (YuNet + genderage already in-process;
   return `{faces:[{box,gender,score}]}`). Deploy — additive endpoint, no consumer yet.
2. `singleSwapGuard` gains a detector dependency: engine_config `solo_probe_engine`:
   `haiku` (default) | `shadow` (call both, log agreement, decide by Haiku) | `fly`.
3. Shadow 3-4 days (solo volume is decent), compare verdict agreement. YuNet+genderage
   disagreeing with Haiku on >5% → investigate before flipping (Haiku reads stylized
   faces better; genderage may need the medium gate: only trust it on photoreal-ish
   mediums, keep Haiku for anime/painterly).
4. Flip to `fly` where agreement holds; keep Haiku as automatic fallback when /detect
   errors. Saves $0.002-0.006/solo and ~2-6s latency.

## Stage 4 — easel/advanced-face-swap as dual engine candidate (bench → % rollout, ~1 week)

1. **Offline bench first** (no integration): `scripts/bench-easel-dual.js` — reuse ~15
   dual base renders (pre-swap targets from Stage 1 shadow captures), run (a) current
   Fly dynamic path, (b) easel with the same cast sources + gender hints, (c) both +
   Stage-2 restore. HTML grid; judge likeness, gender correctness, seam artifacts,
   contact-pose handling. Also measure latency (their p50/p95) and refusal behavior.
2. If easel ≥ Fly: integrate as `dual_swap_engine` engine_config: `fly` (default) |
   `easel_canary` (N% of duals via `dual_easel_pct`) | `easel`. Easel failure/timeout →
   automatic fallback to the Fly path in-request (the orchestrator already has the
   rerender ladder; easel becomes attempt-0 engine). Keep a post-swap genderage verify
   on easel output for the canary period (one /detect call) to catch silent wrong-face.
3. Canary 10% → 50% → 100% over a week, gated on: gender-verify pass rate ≥ Fly's,
   dead-letter/refund ≤ baseline, cost-per-dual from Stage-0 accounting (expect
   +$0.014 raw, offset by fewer rerenders).
4. **Rollback:** config back to `fly` (instant).

## Stage 5 — Free the poses (incremental, ~1 week, requires Stages 1+2, ideally 4)

1. **Prompt-mutating dual retry** (tiny, independent): retry 2 of the dual ladder
   appends "both faces clearly visible, heads apart, no occlusion" instead of re-rolling
   the identical prompt. Flag `dual_retry_mutation_enabled`. Ship for nightly → Create.
2. **Contact pose pool.** New `DUAL_ACTIONS_CONTACT` (~25 entries: arm around shoulders,
   slow dance, cheek-close, piggyback, dip — authored to keep BOTH FACES VISIBLE, which
   is the new invariant replacing "heads on separate sides"). Gated by engine_config
   `dual_contact_pose_pct` (default 0) mixed into `pickDualAction` for partner casts.
   Update the proximity scanner: contact pool lives in its own file with a header the
   scanner recognizes (`// scanner:contact-exempt`) + its own stricter lint (must contain
   "face"/"visible" phrasing).
3. **Rollout:** bench 10 renders per contact pose privately (the composite path from
   Stage 1 must be live — it's what makes stacked poses swappable) → `pct=10` on nightly
   → watch `no_dual_split` rate (expect a bump; acceptable while ≤ the rerender budget)
   → raise to 25-30% and enable for Create.
4. **Single-path loosening (after contact poses prove):** add 2 new
   `SINGLE_COMPOSITION_PATHS` presets (three-quarter-body, environmental-wide-with-
   face-priority) behind `single_composition_expanded_pct`, same bench-then-percentage
   pattern. This is deliberately AFTER restore ships — bigger scenes mean smaller faces,
   and restored 128px identities tolerate that better.

## Stage 6 — Stylized-medium unify (kontextPass revival, ~3 days, optional)

Only if Stage 2's restored-but-photoreal faces still look pasted on
watercolor/painterly mediums: wire `maybeKontextPass` (or a Seedream edit — cheaper,
$0.03) after restore, gated per-medium via the existing `render_base` +
`kontext_directive` columns + engine_config `swap_style_unify_enabled`. Bench per medium
on the private cast; enable medium-by-medium (DB rows, no deploy). This is the +$0.03-04
item — consider tying it to 2✦ mediums.

## Stage 7 — Identity-conditioned hybrid (PuLID/InfiniteYou) — MVP spike (~1-2 weeks, parallel-safe)

Fully additive new pipeline; touches no existing path until proven.

1. Spike script (not the app): render 20 solo scenes via PuLID-FLUX and InfiniteYou with
   the Kevin cast across EXPRESSIVE compositions (profile, low-angle, full-body,
   subject-in-vista) → optional inswapper touch-up → restore. HTML grid vs the current
   solo pipeline on the same scene briefs.
2. Decision gate with Kevin: does hybrid likeness clear the "that's really me" bar on
   expressive poses? If no → archive findings, revisit when hosted models improve. If
   yes → integrate as a new render branch (`solo_hybrid_pct`, photoreal mediums only,
   expressive presets only routed here), nightly-first as always.
3. ID-Patch/dual spike only after solo hybrid wins.

## Sequencing + effort

| Stage | Calendar | Depends on | User risk |
|---|---|---|---|
| 0 Observability/hardening | 1 day | — | none |
| 1 Dynamic split | 2-3 days | 0 | low (shadow-first, instant rollback) |
| 2 Restore | 3-4 days | 0 (bench can start day 1) | low (fail-open) |
| 3 Fly /detect probes | 2 days | 1 | none (shadow-first) |
| 4 easel dual | ~1 week | 1, 2 | low (canary %, in-request fallback) |
| 5 Pose freedom | ~1 week | 1, 2 (4 ideal) | medium (quality taste) — pct-gated |
| 6 Style unify | 3 days | 2 | low (per-medium flags) |
| 7 Hybrid spike | 1-2 weeks | none (parallel) | none until gate passes |

Total: ~3-4 weeks of focused work; Stages 0-3 fit in the first week. Config fields to
add to `engine_config` (one migration, all defaults = current behavior):
`face_restore_enabled`, `face_restore_blend`, `solo_probe_engine`, `dual_swap_engine`,
`dual_easel_pct`, `dual_retry_mutation_enabled`, `dual_contact_pose_pct`,
`single_composition_expanded_pct`, `swap_style_unify_enabled`,
`hd_upscale_swapped_enabled` (+ extend `get_engine_config()` — remember the explicit
field list, migration-335 pattern).

## Standing monitors during the whole program

- `dream-queue-monitor` + `queue-smoke-monitor` already alert on stuck/dead-letter.
- Add a weekly `scripts/faceswap-health.js` report vs the Stage-0 baseline: dual volume,
  engine mix, no_dual_split rate, rerender count, refund rate, cost/dual, restore
  failure rate. One number per line, diffable.
- Sentry: new error signatures from the Fly service tagged `variant` after Stage 0.
