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
  /** Asymptotic overrun ceiling: past `estMs` the fill keeps creeping from `end`
   *  toward this (never reaching it) instead of freezing, so a slow stage never
   *  looks stuck. Kept < 1.0 so an active ring never reads "done". */
  ceil: number;
  /** Time constant (ms) of that overrun creep — bigger = slower. */
  tau: number;
}

// Each active stage fills across its [start,end] band over `estMs`, then — if it
// overruns — keeps creeping ASYMPTOTICALLY from `end` toward `ceil` (never
// reaching it) so the ring is never frozen (Kevin 2026-07-23: a slow face swap
// "stalls out there ... then just finishes suddenly"). Ceilings stay < 1.0 so an
// in-flight ring never looks done; only actual completion fills to 1.0 + the
// check. The long-tail `face_swap` (dual swaps run minutes) creeps slowly toward
// ~0.92, so on a long render the ring lands high and completion is a small,
// smooth final fill — not a jump from 80%.
const BANDS: Record<string, StageBand> = {
  queued: { start: 0.03, end: 0.08, estMs: 4000, ceil: 0.13, tau: 8000 },
  claimed: { start: 0.08, end: 0.15, estMs: 3000, ceil: 0.2, tau: 6000 },
  resolve: { start: 0.15, end: 0.28, estMs: 6000, ceil: 0.34, tau: 8000 },
  // The render itself — the main wait on non-swap dreams.
  flux_render: { start: 0.28, end: 0.55, estMs: 14000, ceil: 0.62, tau: 18000 },
  // The swap — the long tail on cast dreams. Long estimate + a slow creep toward
  // ~0.92 so a multi-minute dual swap keeps inching up instead of freezing.
  face_swap: { start: 0.55, end: 0.8, estMs: 30000, ceil: 0.92, tau: 45000 },
  upload: { start: 0.8, end: 0.88, estMs: 5000, ceil: 0.94, tau: 8000 },
};

/**
 * Live fill fraction (0..1) for a dream given its status, current stage, and
 * when that stage started. `completed` → 1. A known stage fills across its band
 * over `estMs`, then creeps asymptotically toward the band `ceil` if it overruns.
 * Unknown/absent stage falls back to a gentle floor.
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
  if (elapsed <= band.estMs) {
    // Linear across the band over its estimate.
    return band.start + (band.end - band.start) * (elapsed / band.estMs);
  }
  // Overrun: asymptotic creep from the band end toward its ceiling, so the ring
  // keeps moving (slowly) on a stage that runs long, never sitting frozen.
  const overrun = elapsed - band.estMs;
  return band.end + (band.ceil - band.end) * (1 - Math.exp(-overrun / band.tau));
}
