/**
 * Sentry for Edge Functions — render-failure reporting.
 *
 * No-op when SENTRY_EDGE_DSN is unset (local/dev + the fallback-never-breaks
 * rule), so importing this is always safe. Errors-only (tracesSampleRate 0) to
 * avoid performance-trace cost. Initialised lazily + exactly once.
 *
 * BOOT_ERROR rule: no `?.` in TOP-LEVEL module expressions (the Deno edge
 * runtime crashes on it). All optional access here lives inside functions.
 *
 * IMPORTANT — a HARD isolate kill (546 WORKER_RESOURCE_LIMIT / OOM) terminates
 * the isolate before any catch runs, so captureRenderError-in-catch can't see
 * it. Those are reported instead by the dream-queue-worker stale-recovery sweep,
 * which reads dream_queue.current_stage (migration 272) and captures on behalf
 * of the dead isolate. This module covers the GRACEFUL failure class + alerting.
 */
import * as Sentry from 'https://deno.land/x/sentry@8.55.0/index.mjs';

let initialised = false;

export interface RenderErrorContext {
  /** Which edge function is reporting (e.g. 'generate-dream'). */
  fn: string;
  /** dream_queue.id / dream_jobs.id — the forensics + trace key. */
  jobId?: string | null;
  userId?: string | null;
  /** Pipeline stage that was running (dream_queue.current_stage). */
  stage?: string | null;
  model?: string | null;
  /** create | dlt | nightly | first_dream */
  source?: string | null;
  /** light | heavy */
  weight?: string | null;
}

/** Initialise Sentry once. Returns false (no-op) when no DSN is configured. */
export function initSentry(): boolean {
  if (initialised) return true;
  const dsn = Deno.env.get('SENTRY_EDGE_DSN');
  if (!dsn) return false;
  Sentry.init({
    dsn,
    environment: Deno.env.get('ENVIRONMENT') || 'production',
    tracesSampleRate: 0, // errors only — no perf-tracing cost
    defaultIntegrations: false,
  });
  const region = Deno.env.get('SB_REGION');
  if (region) Sentry.setTag('region', region);
  const execId = Deno.env.get('SB_EXECUTION_ID');
  if (execId) Sentry.setTag('execution_id', execId);
  initialised = true;
  return true;
}

/**
 * Capture a render failure with full breadcrumb context, then flush (the isolate
 * may close right after). Safe no-op when Sentry isn't configured. NEVER throws —
 * observability must never break a render.
 */
export async function captureRenderError(err: unknown, ctx: RenderErrorContext): Promise<void> {
  try {
    if (!initSentry()) return;
    Sentry.captureException(err, {
      tags: {
        fn: ctx.fn,
        stage: ctx.stage || 'unknown',
        model: ctx.model || 'unknown',
        source: ctx.source || 'unknown',
        weight: ctx.weight || 'unknown',
      },
      extra: {
        jobId: ctx.jobId || null,
        userId: ctx.userId || null,
      },
    });
    await Sentry.flush(2000);
  } catch (e) {
    console.warn('[sentry] capture failed:', (e as Error)?.message);
  }
}
