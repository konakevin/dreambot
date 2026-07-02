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
 * render Edge Function per job, each in its own isolate, then finalizes);
 * create / dlt (fire-and-forget to generate-dream / restyle-photo, render owns
 * lifecycle); first_dream (fire-and-forget to first-dream-render, which renders
 * the onboarding cascade one tier per isolate and owns its lifecycle).
 *
 * See QUEUE_WORKERS_REFACTOR.md.
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { processNightlyJob } from './dispatchers/nightly.ts';
import { dispatchCreateJob } from './dispatchers/create.ts';
import { dispatchFirstDreamJob } from './dispatchers/first_dream.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';
import { dreamFailedNotification } from '../_shared/dreamQueueLifecycle.ts';
import { captureRenderError } from '../_shared/sentry.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';

const STALE_THRESHOLD_MIN = 5; // in_progress jobs older than this are reset
// Jobs claimed + processed per tick, IN PARALLEL. The nightly concurrency
// knob: nightly jobs invoke the render Edge Function (each its own isolate),
// so this worker isolate just holds N concurrent HTTP awaits. Raise to drain
// faster (bounded by provider rate limits + Supabase concurrent-isolate
// limits); overlapping ticks add more concurrency via SKIP LOCKED.
const MAX_JOBS_PER_TICK = 10;
// SYNC mode (x-worker-sync) caps one tick under the 150s request-idle ceiling —
// we must send a response before the gateway 504s + reaps the isolate. The GH
// backstop loops multiple short held calls; never one long hold.
const SYNC_TICK_BUDGET_MS = 120_000;
const MAX_ATTEMPTS_BEFORE_DEAD_LETTER = 5;
const BACKOFF_MS = [60_000, 300_000, 1_800_000, 7_200_000]; // 1m, 5m, 30m, 2h

interface QueueRow {
  id: string;
  user_id: string;
  // 'first_dream' is the onboarding first-dream cascade (re-activated
  // 2026-06-15) — dispatched fire-and-forget to first-dream-render.
  source: 'first_dream' | 'nightly' | 'create' | 'dlt';
  weight: 'light' | 'heavy';
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
  // Accept the worker token (pg_cron / enqueue kick) OR the service-role key
  // (the GitHub Actions sync backstop + enqueue kick use it — it's strictly
  // higher-privilege + already a repo secret, so no separate GH secret needed).
  const authHeader = req.headers.get('Authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!timingSafeEqual(bearer, expectedToken) && !timingSafeEqual(bearer, serviceRoleKey)) {
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
      // Pull the migration-272 breadcrumbs so we can report WHERE the dead
      // isolate died — current_stage/model survived the kill on this row.
      .select('id, current_stage, model, source, user_id, attempt_count');
    if (staleRows && staleRows.length > 0) {
      console.log(`[worker:${workerId}] Reset ${staleRows.length} stale in_progress jobs`);
      // The dead isolate couldn't report itself (a 546/OOM kill skips every
      // catch). WE report on its behalf — this is the ONLY path that gets hard
      // kills into Sentry, tagged with the exact stage that killed it.
      for (const row of staleRows) {
        await captureRenderError(
          new Error(
            `render isolate died at stage=${row.current_stage ?? 'unknown'} (in_progress > ${STALE_THRESHOLD_MIN}min) — re-queued`
          ),
          {
            fn: 'dream-queue-worker:stale-recovery',
            jobId: row.id,
            userId: row.user_id,
            stage: row.current_stage,
            model: row.model,
            source: row.source,
            weight: undefined,
          }
        );
      }
    }

    // ── Per-WEIGHT concurrency caps (the anti-546 lever) ───────────────────
    // LIGHT (text, no-swap) dreams are fast + have no Fly.io dependency, so they
    // run on a wide cap; HEAVY (face-swap / dual) dreams hit the Fly.io swap
    // service and stay bounded. Each pool claims only up to (its cap − its
    // in_progress); a saturated pool claims 0 and those jobs wait. Both caps are
    // live-tunable via engine_config (no deploy). Splitting the cap means a flood
    // of heavy dual dreams can never throttle light text dreams (and vice versa).
    // Per-weight concurrency caps are now enforced ATOMICALLY inside
    // claim_dream_queue_jobs_by_weight (migration 275): it reads the cap from
    // engine_config, counts in_progress, and claims LEAST(limit, cap−inflight)
    // under a per-weight advisory lock. So we just ask for maxPerTick per weight
    // and trust the RPC — no racy worker-side pre-count (which under overlapping
    // invokers, e.g. the GH sync backstop + pg_cron + the kick, could overshoot
    // the heavy cap → Fly.io exhaustion). A saturated pool returns 0; jobs wait.
    const cfg = await fetchEngineConfig(supabase).catch(() => null);
    const maxPerTick = cfg?.dreamQueueMaxJobsPerTick ?? MAX_JOBS_PER_TICK;

    const claimWeight = async (weight: 'light' | 'heavy'): Promise<QueueRow[]> => {
      const { data, error } = await supabase.rpc('claim_dream_queue_jobs_by_weight', {
        p_worker_id: workerId,
        p_weight: weight,
        p_limit: maxPerTick,
      });
      if (error) {
        console.error(`[worker:${workerId}] ${weight} claim error:`, error.message);
        return [];
      }
      return (data ?? []) as QueueRow[];
    };
    const jobs = [...(await claimWeight('light')), ...(await claimWeight('heavy'))];
    if (jobs.length === 0) return 0;

    const results = await Promise.all(
      jobs.map(async (job) => {
        const jobT0 = Date.now();
        console.log(
          `[worker:${workerId}] Processing job ${job.id} source=${job.source} attempt=${job.attempt_count + 1}`
        );
        try {
          let uploadId: string | null = null;
          // create/dlt are FIRE-AND-FORGET: the render owns the dream_queue
          // terminal state. Only nightly is awaited + marked completed here.
          let ownedByRender = false;
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
                queueJobId: job.id,
              });
              break;
            }
            case 'create':
            case 'dlt': {
              // User-initiated dream (paid). SYNCHRONOUS: generate-dream/
              // restyle-photo render with the connection held open (so the
              // isolate stays alive — the platform stopped honoring waitUntil for
              // background work, 2026-06-17). The render owns dream_queue terminal
              // state (completeQueueJob/failQueueJob) on success AND its own
              // failures. dispatchCreateJob returns on any HTTP response (render
              // owns it) and throws only on an unreachable dispatch / pre-render
              // 4xx → the catch re-queues, status-guarded so a dropped connection
              // on a success can't re-render. Holding the connection also keeps
              // the in_progress concurrency count accurate for the per-weight cap.
              await dispatchCreateJob({ supabaseUrl, serviceRoleKey, payload: job.payload });
              ownedByRender = true;
              break;
            }
            case 'first_dream': {
              // Onboarding first dream (free). FIRE-AND-FORGET to the
              // first-dream-render orchestrator: it acks 202, renders ONE
              // cascade tier in waitUntil, then owns the dream_queue terminal
              // state (complete / advance-tier-and-re-queue / dead_letter). Same
              // render-owns-lifecycle reasoning as create/dlt — the worker never
              // awaits the multi-second render.
              await dispatchFirstDreamJob({
                supabaseUrl,
                workerToken: expectedToken,
                jobId: job.id,
              });
              ownedByRender = true;
              break;
            }
            default:
              throw new Error(`unknown_source:${job.source}`);
          }

          if (ownedByRender) {
            // The render owns the terminal state; nothing more to do.
            return { id: job.id, status: 'dispatched', ms: Date.now() - jobT0 };
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
          // Render-owns-lifecycle guard: create/dlt/first_dream render
          // SYNCHRONOUSLY and own their own dream_queue terminal state
          // (completeQueueJob/failQueueJob / cascade re-queue). If the dispatch
          // threw on a dropped connection (timeout/network) but the render had
          // already reached a terminal state, DON'T re-handle — that would
          // re-render a success or double dead-letter. Re-check the live status
          // first; only proceed to re-queue if it's still non-terminal.
          if (job.source === 'create' || job.source === 'dlt' || job.source === 'first_dream') {
            const { data: cur } = await supabase
              .from('dream_queue')
              .select('status')
              .eq('id', job.id)
              .single();
            if (cur && (cur.status === 'completed' || cur.status === 'dead_letter')) {
              console.log(
                `[worker:${workerId}] job ${job.id} dispatch threw but render already ${cur.status} — leaving it (render-owned)`
              );
              return { id: job.id, status: cur.status, ms: Date.now() - jobT0 };
            }
          }
          // NSFW/safety rejections are terminal — a retry re-runs a doomed (and
          // costly) render. Dead-letter immediately.
          const isNsfw = message.startsWith('nsfw:');
          // A missing/unreachable cast source photo is permanent too (e.g. the
          // user re-uploaded their cast after enqueue, deleting the old file).
          // Retrying re-fails on the same dead URL → dead-letter immediately
          // instead of burning the full backoff. isNsfw still drives copy/refund.
          const isPermanent =
            isNsfw ||
            /source unreachable|source fetch failed|source not an image|invalid source url|object not found/i.test(
              message
            );
          const nextAttempt = job.attempt_count + 1;
          const isDead = isPermanent || nextAttempt >= MAX_ATTEMPTS_BEFORE_DEAD_LETTER;

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
                  // Non-fatal, but NEVER silent: a dropped dream_jobs flip
                  // strands the client's polling fallback on "processing…"
                  // forever (CLAUDE.md no-silent-catch rule).
                  (e: unknown) =>
                    console.error(
                      `[worker:${workerId}] dream_jobs terminal flip FAILED for job ${job.id}:`,
                      (e as Error)?.message
                    )
                );
              await supabase
                .from('notifications')
                .insert(dreamFailedNotification(job.id, job.user_id, isNsfw))
                .then(
                  () => {},
                  // Non-fatal, but NEVER silent: a dropped notification means
                  // the user never learns the dream failed (or that they were
                  // refunded) and can't hit retry.
                  (e: unknown) =>
                    console.error(
                      `[worker:${workerId}] dream_failed notification insert FAILED for job ${job.id}:`,
                      (e as Error)?.message
                    )
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
    return results.length;
  };

  // ── SYNC mode (x-worker-sync:1) — the waitUntil-FREE reliable drain ────────
  // The caller (GitHub Actions curl, .github/workflows/dream-queue-sync.yml)
  // HOLDS the connection until we respond, so the isolate stays alive on an
  // actively-awaited inbound request — NOT on waitUntil (which the platform
  // dropped on 2026-06-17, stalling the whole queue). We run ONE tick inline and
  // return its processed count so the GH bash loop can break when the queue
  // drains. Cap the tick under the 150s request-idle ceiling (we must send a
  // response before then or the gateway 504s + reaps us); the GH loop does the
  // multi-tick looping across short held calls, never one long hold.
  if (req.headers.get('x-worker-sync') === '1') {
    let processed = 0;
    try {
      processed = await Promise.race([
        runTick(),
        new Promise<number>((resolve) => setTimeout(() => resolve(-1), SYNC_TICK_BUDGET_MS)),
      ]);
    } catch (e) {
      console.error(`[worker:${workerId}] sync tick error:`, (e as Error).message);
      return new Response(JSON.stringify({ error: (e as Error).message, worker_id: workerId }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ processed, worker_id: workerId, mode: 'sync' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── FAST path (pg_cron / enqueue kick) — ack 202, run the tick in background ─
  // pg_net is fire-and-forget (can't hold a connection), so we ack immediately
  // and run the tick in waitUntil. This is low-latency WHEN waitUntil is healthy.
  // If waitUntil is degraded, the sync backstop above (every ~5 min) is what
  // actually guarantees the queue drains. Per-job marking + stale-recovery make
  // a reaped mid-batch isolate safe.
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
