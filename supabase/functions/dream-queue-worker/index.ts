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
 * Implemented dispatchers: first_dream (renders inline in this isolate) and
 * nightly (fans out — invokes the nightly-dreams render Edge Function per job,
 * each in its own isolate, then finalizes). create / dlt still pending.
 *
 * See QUEUE_WORKERS_REFACTOR.md.
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { processFirstDreamJob } from './dispatchers/firstDream.ts';
import { processNightlyJob } from './dispatchers/nightly.ts';

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

    // ── Batch claim + parallel dispatch ────────────────────────────────────
    const { data: claimedRows, error: claimErr } = await supabase.rpc('claim_dream_queue_jobs', {
      p_worker_id: workerId,
      p_limit: MAX_JOBS_PER_TICK,
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
          let uploadId: string;
          switch (job.source) {
            case 'first_dream':
              uploadId = await processFirstDreamJob({
                supabase,
                replicateToken: REPLICATE_TOKEN,
                anthropicKey: ANTHROPIC_KEY,
                userId: job.user_id,
                payload: job.payload,
              });
              break;
            case 'nightly':
              uploadId = await processNightlyJob({
                supabase,
                supabaseUrl,
                workerToken: expectedToken,
                anthropicKey: ANTHROPIC_KEY,
                userId: job.user_id,
                payload: job.payload,
              });
              break;
            case 'create':
            case 'dlt':
              throw new Error(`dispatcher_not_implemented:${job.source}`);
            default:
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
