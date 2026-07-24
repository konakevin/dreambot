/**
 * dreamStageProgress — time-based fill for the render progress rings / bar.
 *
 * The stage breadcrumbs are coarse and one stage (`face_swap`, especially dual)
 * can sit for many seconds with no intermediate signal — so a fixed per-stage
 * checkpoint makes the ring jump then freeze at ~95% ("stuck at 99%"). Instead,
 * each stage has a [start,end] band AND an estimated duration: the fill advances
 * linearly across the band over that estimate from `stage_updated_at`, HOLDS at
 * the band end if the stage overruns, and snaps to 1.0 the moment the job
 * actually completes. So it keeps moving during the long swap, only sits near
 * the top when it genuinely overruns, and finishes cleanly. (Kevin 2026-07-23.)
 *
 * Estimates are deliberately rough — the goal is smooth motion, not accuracy.
 * `face_swap` is a blend of single + dual (the client can't yet tell them apart;
 * a future refinement could split them). Tune here or promote to engine_config.
 */

interface StageBand {
  start: number;
  end: number;
  /** Rough typical duration of this stage, ms — the fill crosses the band over it. */
  estMs: number;
}

// Band ceilings are deliberately kept well BELOW 1.0 for every active stage, so
// an in-flight ring NEVER looks "done" (a ~0.95 arc reads as a full circle at
// dock size — it looked complete while the dream was still rendering). Only
// actual completion (status='completed') fills to 1.0 + the check. The long-tail
// `face_swap` (dual swaps are slow) gets a LOW ceiling + a LONG estimate, so a
// slow swap keeps creeping and then holds at ~0.80 — clearly "still working,"
// not "stuck at 100%." Completion snaps the rest of the way. (Kevin 2026-07-23.)
const BANDS: Record<string, StageBand> = {
  queued: { start: 0.03, end: 0.08, estMs: 4000 },
  claimed: { start: 0.08, end: 0.15, estMs: 3000 },
  resolve: { start: 0.15, end: 0.28, estMs: 6000 },
  // The render itself — the main wait on non-swap dreams.
  flux_render: { start: 0.28, end: 0.55, estMs: 14000 },
  // The swap — the long tail on cast dreams. Low ceiling + long estimate so a
  // slow dual swap holds at ~0.80 (clearly in-progress), never near-full.
  face_swap: { start: 0.55, end: 0.8, estMs: 30000 },
  upload: { start: 0.8, end: 0.88, estMs: 5000 },
};

/**
 * Live fill fraction (0..1) for a dream given its status, current stage, and
 * when that stage started. `completed` → 1. A known stage fills across its band
 * over `estMs` and holds at the band end past that. Unknown/absent stage falls
 * back to a gentle floor.
 */
export function dreamProgressTarget(
  status: string | null | undefined,
  currentStage: string | null | undefined,
  stageUpdatedAt: string | null | undefined,
  nowMs: number
): number {
  if (status === 'completed') return 1;

  const band = currentStage ? BANDS[currentStage] : undefined;
  if (!band) {
    // Enqueued but no stage stamped yet, or an unrecognized stage.
    return status === 'queued' ? BANDS.queued.end : 0.1;
  }

  const startedMs = stageUpdatedAt ? Date.parse(stageUpdatedAt) : NaN;
  if (!Number.isFinite(startedMs)) return band.start;

  const elapsed = Math.max(0, nowMs - startedMs);
  const frac = Math.min(elapsed / band.estMs, 1);
  return band.start + (band.end - band.start) * frac;
}
