/**
 * dockItems — the PURE derivation behind the render dock's ring list.
 *
 * Extracted from RenderDock so its corner cases are unit-testable, and hardened
 * against the one failure that matters most: a dock that sits forever on a
 * phantom "still rendering" ring for a job that died without ever reaching a
 * terminal state (worker crash, a terminal write that never landed, a realtime
 * event the client missed while backgrounded). The user can't dismiss an active
 * ring, so if `useInFlightDreams` keeps returning a zombie row the dock is stuck.
 *
 * The backstop: an in-flight job with NO activity (no stage advance, or never
 * started) for longer than STALE_INFLIGHT_MS is treated as dead and dropped, so
 * the dock always self-heals. "Activity" = the most recent of created_at /
 * stage_updated_at that isn't in the future — so an actively-progressing render
 * (stages ticking) or a legitimately long single stage stays visible, while a
 * frozen one ages out. See RenderDock.tsx + __tests__/lib/dockItems.test.ts.
 */

/** An in-flight dream row (subset of useInFlightDreams' InFlightDream). */
export interface InFlightJob {
  id: string;
  /** ISO — enqueue time. */
  createdAt: string;
  /** ISO — last stage breadcrumb, or null before the first mark / while queued. */
  stageUpdatedAt?: string | null;
}

/** A finished ring recorded in the renderDock store (subset of FinishedRing). */
export interface FinishedRingLike {
  jobId: string;
  kind: 'ready' | 'failed';
  createdAt: string;
  /** ms epoch when the terminal event was recorded (drives the ring's TTL). */
  at: number;
}

export interface DockItem<D> {
  jobId: string;
  createdAt: string;
  /** The in-flight row for an active ring; null for a finished ring. */
  dream: D | null;
  finishedKind: 'ready' | 'failed' | null;
}

/**
 * How long an in-flight job may go with no activity before the dock stops
 * showing its ring. Generous on purpose: it must exceed the worst LEGIT case (a
 * single render attempt caps at the ~120s render timeout, plus retries + queue
 * wait ≈ a few minutes) AND the server's own stuck-job cleanup window
 * (refund-stuck-jobs runs every 5 min), so it never hides a real render — it only
 * catches a job the whole pipeline (server cleanup included) failed to terminate.
 */
export const STALE_INFLIGHT_MS = 10 * 60_000;

/** Default finished-ring lifetime (mirrors store/renderDock FINISHED_RING_TTL_MS;
 *  RenderDock passes the real value — this is only for standalone/test calls). */
export const DEFAULT_FINISHED_TTL_MS = 1700;

/**
 * ms since the job's most recent VALID activity timestamp (created_at or
 * stage_updated_at, whichever is later and not in the future). 0 when neither is
 * usable — an unjudgeable row is kept, never hidden on bad data alone.
 */
export function inFlightIdleMs(job: InFlightJob, nowMs: number): number {
  const created = Date.parse(job.createdAt);
  const staged = job.stageUpdatedAt ? Date.parse(job.stageUpdatedAt) : NaN;
  // Only trust timestamps at or before "now" — a future stamp (clock skew / bad
  // data) must not make a job look infinitely fresh and pin the ring forever.
  const valid = [created, staged].filter((t) => Number.isFinite(t) && t <= nowMs);
  if (valid.length === 0) return 0;
  return nowMs - Math.max(...valid);
}

/** True when the job has been idle past `staleMs` — treated as dead by the dock. */
export function isStaleInFlight(
  job: InFlightJob,
  nowMs: number,
  staleMs: number = STALE_INFLIGHT_MS
): boolean {
  return inFlightIdleMs(job, nowMs) > staleMs;
}

/**
 * The dock's ring list: fresh in-flight jobs (as active rings) + finished rings
 * still within their TTL, deduped by jobId (finished wins — a job mid-transition
 * is briefly in both sets) and ordered oldest-first.
 *
 * Guarantees, given a monotonic clock:
 *  - a zombie in-flight job (no activity past staleMs) is DROPPED → the dock
 *    can't sit on a phantom active ring forever;
 *  - a finished ring older than its TTL is DROPPED → no lingering "done" ring;
 *  - a job present in BOTH sets never renders twice.
 */
export function deriveDockItems<D extends InFlightJob>(
  inFlight: D[],
  finished: FinishedRingLike[],
  nowMs: number,
  opts?: { staleMs?: number; finishedTtlMs?: number }
): DockItem<D>[] {
  const staleMs = opts?.staleMs ?? STALE_INFLIGHT_MS;
  const finishedTtlMs = opts?.finishedTtlMs ?? DEFAULT_FINISHED_TTL_MS;
  const finishedIds = new Set(finished.map((f) => f.jobId));

  const active: DockItem<D>[] = inFlight
    .filter((d) => !finishedIds.has(d.id) && !isStaleInFlight(d, nowMs, staleMs))
    .map((d) => ({ jobId: d.id, createdAt: d.createdAt, dream: d, finishedKind: null }));

  const done: DockItem<D>[] = finished
    .filter((f) => nowMs - f.at < finishedTtlMs)
    .map((f) => ({
      jobId: f.jobId,
      createdAt: f.createdAt,
      dream: null,
      finishedKind: f.kind,
    }));

  return [...active, ...done].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
