/**
 * dream_queue lifecycle — terminal-state transitions for a queued render.
 *
 * Moved out of dream-queue-worker so the RENDER functions (generate-dream /
 * restyle-photo, x-dream-queue path) can own their own outcome. The worker
 * dispatches create/dlt jobs FIRE-AND-FORGET (the render acks 202 + finishes in
 * EdgeRuntime.waitUntil), then the render calls completeQueueJob / failQueueJob
 * itself. This eliminates the worker synchronously awaiting a long render and
 * gateway-timing-out (HTTP 504) on a render that actually SUCCEEDED — which was
 * re-queueing completed dreams under dual-face-swap load.
 *
 * The stale-recovery sweep in the worker still catches a render isolate that
 * dies before reaching either of these (in_progress > 5 min → re-queue).
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { captureServer } from './posthogCapture.ts';

const MAX_ATTEMPTS_BEFORE_DEAD_LETTER = 5;
// Nightly gets a HIGHER cap AND never honors `terminal` (NIGHTLY_DREAM_GUARANTEE_PLAN.md
// L3): unlike a Create dream (fixed user prompt → same failure every time), a nightly
// brief is RE-ROLLED from scratch on every attempt (empty payload → fresh rollDream), so
// an NSFW flag / bad scene / missing cast source is recoverable by simply retrying — the
// next roll is a different place/scene/pose and almost never re-trips. A paying customer
// must never miss a nightly, so we retry hard before ever dead-lettering.
const MAX_ATTEMPTS_NIGHTLY = 8;
const BACKOFF_MS = [60_000, 300_000, 1_800_000, 7_200_000]; // 1m, 5m, 30m, 2h

// After this many prior nightly failures, force a people-free pure_scene of the
// user's place (inherently SFW) instead of another character roll — the L4 floor
// for a user whose character rolls RELIABLY trip the filter (L3's re-rolls all
// fail). Renders successfully → completes → the user still gets a dream, not a loop.
export const SAFE_SCENE_AFTER_ATTEMPTS = 3;

/**
 * Terminal-failure decision (L3). Nightly re-rolls a fresh dream every attempt, so
 * `terminal` (NSFW / bad scene) is recoverable by a plain retry — nightly NEVER
 * dead-letters early, only after the raised cap. Create honors `terminal` (a fixed
 * prompt re-fails). Pure + exported so the invariant is unit-tested.
 */
export function computeNightlyIsDead(
  source: string | null | undefined,
  nextAttempt: number,
  terminal: boolean
): boolean {
  const isNightly = source === 'nightly';
  const maxAttempts = isNightly ? MAX_ATTEMPTS_NIGHTLY : MAX_ATTEMPTS_BEFORE_DEAD_LETTER;
  return (terminal && !isNightly) || nextAttempt >= maxAttempts;
}

/** L4: a nightly that's already failed >= SAFE_SCENE_AFTER_ATTEMPTS times degrades
 *  to a guaranteed-SFW pure scene. Pure + exported for the render + tests. */
export function shouldForceSafeScene(attemptCount: number | null | undefined): boolean {
  return (attemptCount ?? 0) >= SAFE_SCENE_AFTER_ATTEMPTS;
}

// ── dream_failed notification — shared shape across every fail site ──
// Keep the copy LIGHT and non-judgey, and consistent across push + in-app
// toast + inbox. Two outcomes, two behaviors in the client:
//   • content/NSFW rejection → subtype 'rejected' (NOT retryable — re-running
//     the same prompt just re-fails; the client routes to Create to tweak it).
//   • render/infra failure   → subtype 'failed'   (retryable — the client
//     re-enqueues the stored payload as a fresh job).
// `reference_id = jobId` lets the failure toast/inbox retry the EXACT dream.
const NSFW_REJECT_BODY =
  "That one leaned a little too spicy for our filters. Sparkle's back, tweak the prompt and try again.";
const RENDER_FAIL_BODY =
  "Oops, that dream got away from us. Sparkle's back in your pocket, take another swing.";

/**
 * Stage breadcrumb — stamp the render's progress into dream_queue BEFORE each
 * risky step. This row is created at enqueue and OUTLIVES a hard isolate kill
 * (546 WORKER_RESOURCE_LIMIT / OOM), so when the catch never runs, current_stage
 * still tells us exactly where the render died. The worker's stale-recovery
 * reads it to report the dead isolate to Sentry. Migration 272 owns the columns.
 *
 * Fire-and-forget + never throws (matches insertGenerationLog discipline).
 * No-op when there's no jobId (the pure-synchronous, non-queue render path).
 * Optional `model` is recorded as soon as it's picked (coalesced — a later
 * stage without a model never clears it).
 */
export type RenderStage =
  | 'claimed'
  | 'resolve'
  | 'sonnet_brief'
  | 'flux_render'
  | 'face_swap'
  | 'upload'
  | 'persist';

export function markStage(
  sb: SupabaseClient,
  jobId: string | null | undefined,
  stage: RenderStage,
  model?: string | null
): void {
  if (!jobId) return;
  const patch: Record<string, unknown> = {
    current_stage: stage,
    stage_updated_at: new Date().toISOString(),
  };
  if (model) patch.model = model;
  void sb
    .from('dream_queue')
    .update(patch)
    .eq('id', jobId)
    .then(
      () => {},
      (err: unknown) => {
        console.warn('[markStage] update failed:', (err as Error)?.message);
      }
    );
}

/** Build the dream_failed notification row (consistent everywhere). */
export function dreamFailedNotification(jobId: string, userId: string, isNsfw: boolean) {
  return {
    recipient_id: userId,
    actor_id: userId,
    type: 'dream_failed',
    subtype: isNsfw ? 'rejected' : 'failed',
    reference_id: jobId,
    body: isNsfw ? NSFW_REJECT_BODY : RENDER_FAIL_BODY,
  };
}

/** Mark a queued job completed + attach its upload. */
export async function completeQueueJob(
  sb: SupabaseClient,
  jobId: string,
  uploadId: string
): Promise<void> {
  await sb
    .from('dream_queue')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      upload_id: uploadId,
      last_error: null,
    })
    .eq('id', jobId);

  // AUTHORITATIVE dream_created — every completed create/dlt/first_dream/restyle
  // render flows through here, so this fires regardless of whether the user is
  // still on the loading screen (the client-side event missed ~83%). `source`
  // (create/dlt/first_dream) comes off the queue row; medium/vibe/model off the
  // upload. Best-effort; captureServer never throws. `insertId` dedups a retry.
  // (Nightly does NOT route through here — it's emitted from the nightly worker.)
  try {
    const { data: job } = await sb
      .from('dream_queue')
      .select('user_id, source')
      .eq('id', jobId)
      .single();
    const { data: up } = await sb
      .from('uploads')
      .select('dream_medium, dream_vibe, model')
      .eq('id', uploadId)
      .single();
    if (job?.user_id) {
      await captureServer(
        job.user_id,
        'dream_created',
        {
          source: job.source ?? null,
          medium: up?.dream_medium ?? null,
          vibe: up?.dream_vibe ?? null,
          model: up?.model ?? null,
        },
        { dedupKey: `dream_created:${jobId}` }
      );
    }
  } catch (e) {
    console.warn(`[completeQueueJob] dream_created emit skipped: ${(e as Error).message}`);
  }
}

/**
 * Handle a failed queued render: retry with backoff, or dead-letter (refund +
 * notify) once retries are exhausted / on a terminal NSFW rejection. Idempotent
 * refund keyed on jobId. `userId` is needed for the refund + notification.
 */
export async function failQueueJob(
  sb: SupabaseClient,
  jobId: string,
  userId: string,
  errMsg: string,
  isNsfw: boolean,
  // PERMANENT failures (NSFW, or a missing/unreachable cast source photo) skip
  // the retry cycle and dead-letter immediately — retrying re-fails identically
  // and only delays the refund + spams "failed" pushes over the backoff window.
  // Defaults to isNsfw so existing callers keep their behavior. `isNsfw` still
  // drives the notification COPY (rejected vs failed); `terminal` drives the
  // no-retry decision, so a non-NSFW permanent error gets the plain refund copy.
  terminal: boolean = isNsfw
): Promise<void> {
  const message = (errMsg || 'unknown').slice(0, 1000);
  const { data: job } = await sb
    .from('dream_queue')
    .select('attempt_count, source, payload')
    .eq('id', jobId)
    .single();
  const nextAttempt = (job?.attempt_count ?? 0) + 1;
  // L3 (NIGHTLY_DREAM_GUARANTEE_PLAN.md): nightly retries (re-rolls) instead of
  // dead-lettering; Create honors terminal. Decision extracted + unit-tested.
  const isDead = computeNightlyIsDead(job?.source, nextAttempt, terminal);

  if (!isDead) {
    // Exponential backoff: created_at into the future so the claim RPC's
    // `created_at <= now()` gate holds the job until the delay elapses.
    const backoffMs = BACKOFF_MS[Math.min(nextAttempt - 1, BACKOFF_MS.length - 1)];
    await sb
      .from('dream_queue')
      .update({
        status: 'queued',
        attempt_count: nextAttempt,
        last_error: message,
        started_at: null,
        worker_id: null,
        created_at: new Date(Date.now() + backoffMs).toISOString(),
      })
      .eq('id', jobId);
    return;
  }

  // Dead-letter: terminal. Refund the paid sparkle (idempotent on jobId;
  // refund_sparkles returns the ACTUAL debited amount) + mark dream_jobs failed
  // (resolves the client's polling fallback) + inbox notification.
  await sb
    .from('dream_queue')
    .update({
      status: 'dead_letter',
      attempt_count: nextAttempt,
      last_error: message,
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId);

  // These terminal writes are intentionally non-fatal (we never throw out of
  // dead-lettering), but a SILENT failure here is dangerous: a dropped refund is
  // lost revenue, a dropped dream_jobs flip strands the client on the loading
  // screen, a dropped notification means the user never learns the dream failed.
  // Log every failure so the monitors / Sentry breadcrumbs can catch a pattern.
  //
  const { error: refundErr } = await sb.rpc('refund_sparkles', {
    p_user_id: userId,
    p_amount: 1,
    p_reason: `refund:queue_dead_letter:${isNsfw ? 'nsfw' : 'exhausted'}`,
    p_reference_id: jobId,
  });
  if (refundErr) {
    console.error(`[failQueueJob] refund_sparkles FAILED for job ${jobId}:`, refundErr.message);
  }
  const { error: jobsErr } = await sb
    .from('dream_jobs')
    .update({
      status: isNsfw ? 'nsfw' : 'failed',
      error: message,
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId);
  if (jobsErr) {
    console.error(
      `[failQueueJob] dream_jobs status flip FAILED for job ${jobId}:`,
      jobsErr.message
    );
  }
  const { error: notifyErr } = await sb
    .from('notifications')
    .insert(dreamFailedNotification(jobId, userId, isNsfw));
  if (notifyErr) {
    console.error(
      `[failQueueJob] failure notification FAILED for job ${jobId}:`,
      notifyErr.message
    );
  }

  // AUTHORITATIVE dream_failed — fires only on the terminal (dead-letter) failure,
  // server-side, so a queue-path failure is visible in analytics (the client
  // sync-path catch never runs when queued). reason distinguishes nsfw vs
  // render-infra; `source` off the queue row. Best-effort; never throws.
  await captureServer(
    userId,
    'dream_failed',
    { reason: isNsfw ? 'nsfw' : 'render_failed', source: job?.source ?? null },
    { dedupKey: `dream_failed:${jobId}` }
  );
}
