/**
 * Edge Function: dream-queue-worker
 *
 * Cron-triggered worker that processes the async dream_queue. Atomically
 * claims one queued job via SELECT ... FOR UPDATE SKIP LOCKED, dispatches
 * to the per-source handler, retries on failure with exponential backoff,
 * lands in dead_letter after 5 attempts.
 *
 * Trigger: Supabase cron every 15 seconds.
 * Auth: service role only (cron sends service role JWT). Reject anything else.
 *
 * Phase 1 (this commit): infrastructure + first_dream dispatcher.
 *   nightly / create / dlt dispatchers come in Phase 3.
 *
 * See QUEUE_WORKERS_REFACTOR.md.
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { processFirstDreamJob } from './dispatchers/firstDream.ts';

const STALE_THRESHOLD_MIN = 5; // in_progress jobs older than this are reset
const MAX_JOBS_PER_TICK = 3;
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

  // ── Claim + process loop ──────────────────────────────────────────────
  const results: Array<{ id: string; status: string; ms: number; error?: string }> = [];

  for (let i = 0; i < MAX_JOBS_PER_TICK; i++) {
    // Atomic claim via RPC (FOR UPDATE SKIP LOCKED needs a stored proc since
    // the JS client can't express it directly).
    const { data: claimed, error: claimErr } = await supabase
      .rpc('claim_dream_queue_job', { p_worker_id: workerId })
      .maybeSingle();

    if (claimErr) {
      console.error(`[worker:${workerId}] Claim error:`, claimErr.message);
      break;
    }
    if (!claimed) {
      // No more queued jobs.
      break;
    }

    const job = claimed as QueueRow;
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
        case 'create':
        case 'dlt':
          throw new Error(`dispatcher_not_implemented:${job.source}`);
        default:
          throw new Error(`unknown_source:${job.source}`);
      }

      // Mark complete.
      await supabase
        .from('dream_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          upload_id: uploadId,
          last_error: null,
        })
        .eq('id', job.id);

      results.push({ id: job.id, status: 'completed', ms: Date.now() - jobT0 });
    } catch (err) {
      const message = (err as Error).message ?? 'unknown';
      const truncated = message.slice(0, 1000);
      const nextAttempt = job.attempt_count + 1;
      const isDead = nextAttempt >= MAX_ATTEMPTS_BEFORE_DEAD_LETTER;

      console.error(
        `[worker:${workerId}] Job ${job.id} failed (attempt ${nextAttempt}/${MAX_ATTEMPTS_BEFORE_DEAD_LETTER}):`,
        truncated.slice(0, 200)
      );

      if (isDead) {
        await supabase
          .from('dream_queue')
          .update({
            status: 'dead_letter',
            attempt_count: nextAttempt,
            last_error: truncated,
            completed_at: new Date().toISOString(),
          })
          .eq('id', job.id);
        results.push({
          id: job.id,
          status: 'dead_letter',
          ms: Date.now() - jobT0,
          error: truncated,
        });
      } else {
        // Exponential backoff: push the job back to the queue but bump
        // created_at into the future so the partial index ordering naturally
        // gates re-processing until the backoff elapses.
        const backoffMs = BACKOFF_MS[Math.min(nextAttempt - 1, BACKOFF_MS.length - 1)];
        const retryAt = new Date(Date.now() + backoffMs).toISOString();
        await supabase
          .from('dream_queue')
          .update({
            status: 'queued',
            attempt_count: nextAttempt,
            last_error: truncated,
            started_at: null,
            worker_id: null,
            // Push created_at forward so this job sorts after any newer ones
            // until the backoff has elapsed.
            created_at: retryAt,
          })
          .eq('id', job.id);
        results.push({
          id: job.id,
          status: `retry_in_${Math.round(backoffMs / 1000)}s`,
          ms: Date.now() - jobT0,
          error: truncated,
        });
      }
    }
  }

  const elapsed = Date.now() - t0;
  console.log(
    `[worker:${workerId}] Tick complete in ${elapsed}ms — processed ${results.length} jobs`
  );

  return new Response(
    JSON.stringify({
      worker_id: workerId,
      elapsed_ms: elapsed,
      processed: results,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
