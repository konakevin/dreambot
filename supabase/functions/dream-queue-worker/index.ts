/**
 * Edge Function: dream-queue-worker
 *
 * Cron-triggered worker that drains the async dream_queue. Batch-claims up to
 * MAX_JOBS_PER_TICK due jobs (SELECT ... FOR UPDATE SKIP LOCKED) and processes
 * them IN PARALLEL, dispatching each to its per-source handler; retries on
 * failure with exponential backoff, dead-letters after 5 attempts (or
 * immediately on an NSFW/safety rejection).
 *
 * Trigger: Supabase cron (configured in the dashboard).
 * Auth: worker token (Authorization: Bearer <DREAM_QUEUE_WORKER_TOKEN>).
 *
 * Implemented dispatchers: nightly (fans out — invokes the nightly-dreams
 * render Edge Function per job, each in its own isolate, then finalizes).
 * create / dlt still pending. The first_dream dispatcher was removed
 * 2026-06-02 with the rip-out of the experimental generate-first-dream
 * engine — onboarding now uses the production nightly engine with forced
 * cast face swap (see RevealStep.tsx + memory:
 * project_first_dream_via_nightly_engine).
 *
 * See QUEUE_WORKERS_REFACTOR.md.
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { processNightlyJob } from './dispatchers/nightly.ts';
import { processCreateJob } from './dispatchers/create.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';

const STALE_THRESHOLD_MIN = 5; // in_progress jobs older than this are reset
// Jobs claimed + processed per tick, IN PARALLEL. The nightly concurrency
// knob: nightly jobs invoke the render Edge Function (each its own isolate),
// so this worker isolate just holds N concurrent HTTP awaits. Raise to drain
// faster (bounded by provider rate limits + Supabase concurrent-isolate
// limits); overlapping ticks add more concurrency via SKIP LOCKED.
const MAX_JOBS_PER_TICK = 10;
const MAX_ATTEMPTS_BEFORE_DEAD_LETTER = 5;
const BACKOFF_MS = [60_000, 300_000, 1_800_000, 7_200_000]; // 1m, 5m, 30m, 2h

interface QueueRow {
  id: string;
  user_id: string;
  // 'first_dream' value kept for back-compat with pre-2026-06-02 dead-
  // letter rows in dream_queue (the DB CHECK constraint still allows it).
  // The switch below treats it as unknown_source so any sneak-in retries
  // dead-letter cleanly.
  source: 'first_dream' | 'nightly' | 'create' | 'dlt';
  payload: Record<string, unknown>;
  status: string;
  attempt_count: number;
  created_at: string;
  started_at: string | null;
}

Deno.serve(async (req) => {
  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  if (!REPLICATE_TOKEN || !ANTHROPIC_KEY) {
    return new Response(JSON.stringify({ error: 'missing_env' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Worker-token auth — cron sends `Authorization: Bearer <DREAM_QUEUE_WORKER_TOKEN>`.
  // Custom secret (not the service role key) so this URL is safe to leak in
  // cron config / logs. The worker still uses service role internally for
  // its DB ops via the `serviceRoleKey` env var.
  const expectedToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN');
  if (!expectedToken) {
    return new Response(
      JSON.stringify({ error: 'misconfigured: DREAM_QUEUE_WORKER_TOKEN not set' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const authHeader = req.headers.get('Authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (bearer !== expectedToken) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);
  const workerId = crypto.randomUUID().slice(0, 12);
  const t0 = Date.now();

  const runTick = async () => {
    // ── Stale-job recovery ─────────────────────────────────────────────────
    // Reset in_progress jobs whose started_at is more than 5 min ago. Worker
    // isolate likely died mid-job (Supabase 150 s wall-clock timeout).
    const staleCutoff = new Date(Date.now() - STALE_THRESHOLD_MIN * 60 * 1000).toISOString();
    const { data: staleRows } = await supabase
      .from('dream_queue')
      .update({ status: 'queued', started_at: null, worker_id: null })
      .eq('status', 'in_progress')
      .lt('started_at', staleCutoff)
      .select('id');
    if (staleRows && staleRows.length > 0) {
      console.log(`[worker:${workerId}] Reset ${staleRows.length} stale in_progress jobs`);
    }

    // ── Global concurrency cap (the anti-546 lever) ────────────────────────
    // Bound the number of SIMULTANEOUSLY-rendering jobs across all workers, so
    // a 500-user burst drains at a controlled rate instead of all at once
    // (which exhausts Supabase's isolate pool + busts per-render budgets).
    // Claim only up to (cap − in_progress); a saturated cap claims 0 and the
    // jobs wait. Both knobs are live-tunable via engine_config (no deploy).
    const cfg = await fetchEngineConfig(supabase).catch(() => null);
    const maxConcurrent = cfg?.dreamQueueMaxConcurrent ?? 40;
    const maxPerTick = cfg?.dreamQueueMaxJobsPerTick ?? MAX_JOBS_PER_TICK;
    const { count: inProgress } = await supabase
      .from('dream_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'in_progress');
    const headroom = Math.max(0, maxConcurrent - (inProgress ?? 0));
    const claimLimit = Math.min(maxPerTick, headroom);
    if (claimLimit <= 0) {
      console.log(
        `[worker:${workerId}] concurrency cap saturated (in_progress=${inProgress ?? 0}/${maxConcurrent}) — skipping claim`
      );
      return;
    }

    // ── Batch claim + parallel dispatch ────────────────────────────────────
    const { data: claimedRows, error: claimErr } = await supabase.rpc('claim_dream_queue_jobs', {
      p_worker_id: workerId,
      p_limit: claimLimit,
    });
    if (claimErr) {
      console.error(`[worker:${workerId}] Batch claim error:`, claimErr.message);
      return;
    }
    const jobs = (claimedRows ?? []) as QueueRow[];

    const results = await Promise.all(
      jobs.map(async (job) => {
        const jobT0 = Date.now();
        console.log(
          `[worker:${workerId}] Processing job ${job.id} source=${job.source} attempt=${job.attempt_count + 1}`
        );
        try {
          let uploadId: string | null;
          switch (job.source) {
            case 'nightly': {
              // Re-validate entitlement at render time. Eligibility was checked
              // at enqueue (08:00 UTC), but a job can be claimed minutes-to-hours
              // later (and retried for up to 2h on backoff), during which a trial
              // can lapse or a subscription be cancelled/refunded. Don't burn a
              // render on a user who is no longer Pro/Basic/in-trial. A null
              // uploadId marks the job completed (no render, no retry).
              const { data: stillEligible, error: eligErr } = await supabase.rpc(
                'is_dream_eligible',
                { p_user_id: job.user_id }
              );
              if (eligErr) {
                console.error(
                  `[worker:${workerId}] job ${job.id}: is_dream_eligible check failed:`,
                  eligErr.message
                );
              }
              if (stillEligible === false) {
                console.log(
                  `[worker:${workerId}] job ${job.id}: user ${job.user_id} no longer dream-eligible at render time — skipping`
                );
                uploadId = null;
                break;
              }
              uploadId = await processNightlyJob({
                supabase,
                supabaseUrl,
                workerToken: expectedToken,
                anthropicKey: ANTHROPIC_KEY,
                userId: job.user_id,
                payload: job.payload,
              });
              break;
            }
            case 'create':
            case 'dlt': {
              // User-initiated dream (paid). Render in its own isolate via
              // generate-dream's x-dream-queue path; the payload IS the full
              // RequestBody the client built (with job_id = this row's id).
              uploadId = await processCreateJob({
                supabaseUrl,
                serviceRoleKey,
                payload: job.payload,
              });
              break;
            }
            default:
              // Also catches the vestigial 'first_dream' source value
              // (dispatcher removed 2026-06-02).
              throw new Error(`unknown_source:${job.source}`);
          }

          await supabase
            .from('dream_queue')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              upload_id: uploadId,
              last_error: null,
            })
            .eq('id', job.id);
          return { id: job.id, status: 'completed', ms: Date.now() - jobT0 };
        } catch (err) {
          const message = ((err as Error).message ?? 'unknown').slice(0, 1000);
          // NSFW/safety rejections are terminal — a retry re-runs a doomed (and
          // costly) render. Dead-letter immediately.
          const isNsfw = message.startsWith('nsfw:');
          const nextAttempt = job.attempt_count + 1;
          const isDead = isNsfw || nextAttempt >= MAX_ATTEMPTS_BEFORE_DEAD_LETTER;

          console.error(
            `[worker:${workerId}] Job ${job.id} failed (attempt ${nextAttempt}/${MAX_ATTEMPTS_BEFORE_DEAD_LETTER}${isNsfw ? ', terminal:nsfw' : ''}):`,
            message.slice(0, 200)
          );

          if (isDead) {
            await supabase
              .from('dream_queue')
              .update({
                status: 'dead_letter',
                attempt_count: nextAttempt,
                last_error: message,
                completed_at: new Date().toISOString(),
              })
              .eq('id', job.id);
            // Nightly dream exhausted all retries. It's free (membership-included),
            // so there's no sparkle to refund — instead CREDIT a goodwill sparkle
            // for the trouble, and say so. Idempotent on the job id so a re-run
            // can't double-grant. Stay silent on NSFW dead-letters (no point
            // flagging a safety block on an auto-generated dream).
            if (job.source === 'nightly' && !isNsfw) {
              const { error: grantErr } = await supabase.rpc('grant_sparkles', {
                p_user_id: job.user_id,
                p_amount: 1,
                p_reason: `nightly_fail_credit:${job.id}`,
              });
              if (grantErr) {
                console.error(
                  `[worker:${workerId}] nightly fail sparkle credit failed:`,
                  grantErr.message
                );
              }
              const { error: notifErr } = await supabase.from('notifications').insert({
                recipient_id: job.user_id,
                type: 'dream_failed',
                subtype: 'nightly_failed',
                body: "Your nightly dream couldn't render tonight — we've added a sparkle to your balance to make up for it.",
              });
              if (notifErr) {
                console.error(
                  `[worker:${workerId}] nightly dream_failed notify insert failed:`,
                  notifErr.message
                );
              }
            } else if (job.source === 'create' || job.source === 'dlt') {
              // Paid user dream is dead (retries exhausted OR a safety block).
              // The render did NOT refund in-function for queued jobs (the
              // worker owns it), so refund now — idempotent on the job id, and
              // refund_sparkles returns the ACTUAL amount debited (1/2/3/5 by
              // model), not the fallback. Then mark dream_jobs failed (resolves
              // the client's polling fallback) + inbox notification.
              const { error: refundErr } = await supabase.rpc('refund_sparkles', {
                p_user_id: job.user_id,
                p_amount: 1,
                p_reason: `refund:queue_dead_letter:${isNsfw ? 'nsfw' : 'exhausted'}`,
                p_reference_id: job.id,
              });
              if (refundErr) {
                console.error(
                  `[worker:${workerId}] create dead-letter refund failed:`,
                  refundErr.message
                );
              }
              await supabase
                .from('dream_jobs')
                .update({
                  status: isNsfw ? 'nsfw' : 'failed',
                  error: message,
                  completed_at: new Date().toISOString(),
                })
                .eq('id', job.id)
                .then(
                  () => {},
                  () => {}
                );
              await supabase
                .from('notifications')
                .insert({
                  recipient_id: job.user_id,
                  actor_id: job.user_id,
                  type: 'dream_failed',
                  subtype: 'failed',
                  body: isNsfw
                    ? "Your dream couldn't be created — sparkle refunded"
                    : "Your dream couldn't render — sparkle refunded",
                })
                .then(
                  () => {},
                  () => {}
                );
            }
            return { id: job.id, status: 'dead_letter', ms: Date.now() - jobT0, error: message };
          }

          // Exponential backoff: push created_at into the future so the claim
          // RPC's `created_at <= now()` gate holds the job until the delay elapses.
          const backoffMs = BACKOFF_MS[Math.min(nextAttempt - 1, BACKOFF_MS.length - 1)];
          const retryAt = new Date(Date.now() + backoffMs).toISOString();
          await supabase
            .from('dream_queue')
            .update({
              status: 'queued',
              attempt_count: nextAttempt,
              last_error: message,
              started_at: null,
              worker_id: null,
              created_at: retryAt,
            })
            .eq('id', job.id);
          return {
            id: job.id,
            status: `retry_in_${Math.round(backoffMs / 1000)}s`,
            ms: Date.now() - jobT0,
            error: message,
          };
        }
      })
    );

    const elapsed = Date.now() - t0;
    console.log(
      `[worker:${workerId}] Tick complete in ${elapsed}ms — processed ${results.length} jobs`
    );
  };

  // Run the tick as a BACKGROUND task so we ack the trigger (pg_cron's pg_net)
  // immediately. Otherwise the worker holds the request open for the whole
  // batch; pg_net's short timeout disconnects and the isolate is reaped at the
  // 150s idle limit (IDLE_TIMEOUT), killing in-flight renders. waitUntil keeps
  // the isolate alive (up to wall-clock) to finish the batch after responding.
  // Per-job marking + stale-recovery make a reaped mid-batch isolate safe.
  const edgeRuntime = (
    globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }
  ).EdgeRuntime;
  if (edgeRuntime?.waitUntil) {
    edgeRuntime.waitUntil(runTick());
  } else {
    // No background-task API (e.g. local/test invoking and holding the
    // connection) — run inline.
    await runTick();
  }

  return new Response(JSON.stringify({ accepted: true, worker_id: workerId }), {
    status: 202,
    headers: { 'Content-Type': 'application/json' },
  });
});
