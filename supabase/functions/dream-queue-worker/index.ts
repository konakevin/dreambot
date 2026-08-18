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
import { jitter } from '../_shared/jitter.ts';
import { decideStaleRecovery } from '../_shared/staleRecovery.ts';

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

/**
 * After a job's dream_queue row is flipped to `dead_letter`, run the
 * source-appropriate aftermath: nightly → goodwill sparkle credit + notify;
 * create/dlt → refund the paid sparkle (idempotent on jobId) + flip dream_jobs +
 * notify; first_dream → nothing (it's free). Shared by BOTH the catch path
 * (dispatch threw) and the stale-recovery path (isolate hard-died) so a
 * hard-killed dream refunds identically to a caught failure. Every write is
 * non-fatal but NEVER silent (a dropped refund/notify/flip is logged for the
 * monitors — CLAUDE.md no-silent-catch rule). `isNsfw` drives the copy + reason.
 */
async function deadLetterAftermath(
  supabase: SupabaseClient,
  workerId: string,
  job: { id: string; source: QueueRow['source']; user_id: string },
  message: string,
  isNsfw: boolean
): Promise<void> {
  if (job.source === 'nightly' && !isNsfw) {
    // Nightly is free (membership-included) — no sparkle to refund. CREDIT a
    // goodwill sparkle for the trouble instead. Idempotent on the job id so a
    // re-run can't double-grant. Stay silent on NSFW (no point flagging a safety
    // block on an auto-generated dream).
    const { error: grantErr } = await supabase.rpc('grant_sparkles', {
      p_user_id: job.user_id,
      p_amount: 1,
      p_reason: `nightly_fail_credit:${job.id}`,
    });
    if (grantErr) {
      console.error(`[worker:${workerId}] nightly fail sparkle credit failed:`, grantErr.message);
    }
    const { error: notifErr } = await supabase.from('notifications').insert({
      recipient_id: job.user_id,
      type: 'dream_failed',
      subtype: 'nightly_failed',
      body: "Your nightly dream slipped away tonight, so we've added a sparkle to your balance to make up for it.",
    });
    if (notifErr) {
      console.error(
        `[worker:${workerId}] nightly dream_failed notify insert failed:`,
        notifErr.message
      );
    }
  } else if (job.source === 'create' || job.source === 'dlt') {
    // Paid user dream. The render did NOT refund in-function for queued jobs
    // (the worker owns it), so refund now — idempotent on the job id, and
    // refund_sparkles returns the ACTUAL amount debited (1/2/3/5 by model), not
    // the p_amount fallback. Then mark dream_jobs failed (resolves the client's
    // polling fallback) + inbox notification.
    const { error: refundErr } = await supabase.rpc('refund_sparkles', {
      p_user_id: job.user_id,
      p_amount: 1,
      p_reason: `refund:queue_dead_letter:${isNsfw ? 'nsfw' : 'exhausted'}`,
      p_reference_id: job.id,
    });
    if (refundErr) {
      console.error(`[worker:${workerId}] create dead-letter refund failed:`, refundErr.message);
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
        // Non-fatal, but NEVER silent: a dropped dream_jobs flip strands the
        // client's polling fallback on "processing…" forever.
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
        // Non-fatal, but NEVER silent: a dropped notification means the user
        // never learns the dream failed (or that they were refunded).
        (e: unknown) =>
          console.error(
            `[worker:${workerId}] dream_failed notification insert FAILED for job ${job.id}:`,
            (e as Error)?.message
          )
      );
  }
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
    // in_progress jobs whose started_at is older than the stale threshold — the
    // render isolate almost certainly HARD-died mid-job (546/OOM/150s wall-clock
    // kill SKIPS every catch, so neither the render nor the worker recorded a
    // terminal state). Recover each: a hard-kill IS a real attempt, so BUMP
    // attempt_count and dead-letter (refund + notify) once attempts are
    // exhausted — otherwise a job that reliably kills its isolate loops here
    // forever, never dead-letters, never refunds, and rotates through a
    // concurrency slot every sweep. (The old bulk reset re-queued with NO bump.)
    const staleCutoff = new Date(Date.now() - STALE_THRESHOLD_MIN * 60 * 1000).toISOString();
    // Pull the migration-272 breadcrumbs so we can report WHERE the dead isolate
    // died — current_stage/model survived the kill on this row.
    // Bounded + ordered: in_progress is held to ~50 by the per-weight caps, so
    // staleRows is realistically tiny — but pin an explicit oldest-first bound
    // (index-backed by idx_dream_queue_stale) so the read can never silently hit
    // PostgREST's implicit 1000-row cap in a compound-failure pileup, and any
    // overflow drains deterministically (oldest first) over subsequent ticks.
    const { data: staleRows } = await supabase
      .from('dream_queue')
      .select('id, current_stage, model, source, user_id, attempt_count')
      .eq('status', 'in_progress')
      .lt('started_at', staleCutoff)
      .order('started_at', { ascending: true })
      .limit(500);
    for (const row of staleRows ?? []) {
      const { nextAttempt, dead } = decideStaleRecovery(
        row.attempt_count,
        MAX_ATTEMPTS_BEFORE_DEAD_LETTER
      );
      const staleMsg = `render isolate died at stage=${row.current_stage ?? 'unknown'} (in_progress > ${STALE_THRESHOLD_MIN}min)`;
      const patch = dead
        ? {
            status: 'dead_letter',
            attempt_count: nextAttempt,
            last_error: `${staleMsg} — dead-lettered (attempts exhausted)`,
            completed_at: new Date().toISOString(),
            worker_id: null,
          }
        : {
            status: 'queued',
            attempt_count: nextAttempt,
            last_error: `${staleMsg} — re-queued`,
            started_at: null,
            worker_id: null,
            // Backoff: hold the re-queued job off the claimable set (created_at
            // in the future) so a job that reliably kills its isolate doesn't
            // re-claim instantly + thrash a slot.
            created_at: new Date(
              Date.now() + jitter(BACKOFF_MS[Math.min(nextAttempt - 1, BACKOFF_MS.length - 1)])
            ).toISOString(),
          };
      // Guarded atomic transition: the `.eq('status','in_progress')` guard means
      // only ONE invoker wins the move out of in_progress — an overlapping tick's
      // sweep, or a late render write, is a no-op for the losers. So we never
      // double-refund or double-requeue the same stale row.
      const { data: claimed } = await supabase
        .from('dream_queue')
        .update(patch)
        .eq('id', row.id)
        .eq('status', 'in_progress')
        .select('id');
      if (!claimed || claimed.length === 0) continue;

      console.log(
        `[worker:${workerId}] Stale job ${row.id} (attempt ${nextAttempt}/${MAX_ATTEMPTS_BEFORE_DEAD_LETTER}) — ${dead ? 'dead-lettered' : 're-queued'}`
      );
      // The dead isolate couldn't report itself (a hard kill skips every catch).
      // WE report on its behalf — this is the ONLY path that gets hard kills into
      // Sentry, tagged with the exact stage that killed it.
      await captureRenderError(new Error(`${staleMsg} — ${dead ? 'dead-lettered' : 're-queued'}`), {
        fn: 'dream-queue-worker:stale-recovery',
        jobId: row.id,
        userId: row.user_id,
        stage: row.current_stage,
        model: row.model,
        source: row.source,
        weight: undefined,
      });
      // Exhausted → the user still owes a refund (their dream died with no
      // terminal state). isNsfw=false: a dead isolate isn't a safety rejection.
      if (dead) {
        await deadLetterAftermath(supabase, workerId, row, staleMsg, false);
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
            // Source-appropriate aftermath (nightly goodwill credit / create-dlt
            // refund + dream_jobs flip + notify) — shared with the stale-recovery
            // path so a hard-killed dream refunds identically to a caught failure.
            await deadLetterAftermath(supabase, workerId, job, message, isNsfw);
            return { id: job.id, status: 'dead_letter', ms: Date.now() - jobT0, error: message };
          }

          // Exponential backoff: push created_at into the future so the claim
          // RPC's `created_at <= now()` gate holds the job until the delay elapses.
          // Jitter the backoff so a wave of jobs that all failed at the same
          // instant (a provider brownout) don't re-queue to the SAME retry time
          // and thundering-herd the provider again when they drain together.
          const backoffMs = jitter(BACKOFF_MS[Math.min(nextAttempt - 1, BACKOFF_MS.length - 1)]);
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
