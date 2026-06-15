/**
 * Edge Function: refund-stuck-jobs — sweeper for orphaned dream jobs.
 *
 * The generate-dream and restyle-photo functions catch most errors and
 * refund inline. But when the Edge Function itself dies mid-execution
 * (HTTP 546 worker-limit, 504 timeout, OOM, deploy mid-flight), no catch
 * block runs, no refund happens, and the user is silently out a sparkle.
 *
 * This sweeper runs on a schedule (every 5 min via GitHub Actions cron).
 * For each `dream_jobs` row with status='processing' older than 5 minutes,
 * it calls refund_sparkles (idempotent on jobId) and marks the row
 * status='timeout'. Subsequent sweeps see status='timeout' and skip.
 *
 * Idempotency: refund_sparkles checks for a prior 'refund:%' transaction
 * tied to this jobId. If the inline catch already refunded, this sweeper's
 * refund is a no-op. Safe to run as often as we want.
 *
 * POST /functions/v1/refund-stuck-jobs
 * Body: optional { older_than_min?: number } — defaults to 5
 * Auth: requires service-role JWT (don't deploy with --no-verify-jwt)
 *
 * Response: { swept: number, refunded: number, errors: number }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { dreamFailedNotification } from '../_shared/dreamQueueLifecycle.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DreamJob {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  error: string | null;
  payload: Record<string, unknown> | null;
  attempt_count: number | null;
}

// Re-dispatch a dead user-dream render up to this many times before refunding —
// matches the nightly queue's resilience. Each retry waits one sweep interval
// (~5 min) by resetting the job's created_at.
const MAX_RETRIES = 3;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let olderThanMin = 5;
  try {
    const body = await req.json();
    if (typeof body?.older_than_min === 'number' && body.older_than_min >= 1) {
      olderThanMin = body.older_than_min;
    }
  } catch {
    // No body — use default
  }

  const cutoff = new Date(Date.now() - olderThanMin * 60_000).toISOString();
  console.log(`[refund-stuck-jobs] Sweeping jobs older than ${cutoff} (status=processing)`);

  // Find stuck jobs
  const { data: stuck, error: queryErr } = await supabase
    .from('dream_jobs')
    .select('id, user_id, status, created_at, error, payload, attempt_count')
    .eq('status', 'processing')
    .lt('created_at', cutoff)
    .limit(200);

  if (queryErr) {
    console.error('[refund-stuck-jobs] Query failed:', queryErr.message);
    return new Response(JSON.stringify({ error: queryErr.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const jobs = (stuck ?? []) as DreamJob[];
  let refunded = 0;
  let redispatched = 0;
  let errors = 0;

  for (const job of jobs) {
    try {
      // RETRY before refunding: if we still have the request payload + retries
      // left, replay the render via generate-dream (it acks fast + finishes in
      // the background). Count the attempt + reset the sweep timer FIRST, so a
      // re-dispatch that fails to send still counts — never an infinite loop.
      if (job.payload && (job.attempt_count ?? 0) < MAX_RETRIES) {
        const nextAttempt = (job.attempt_count ?? 0) + 1;
        await supabase
          .from('dream_jobs')
          .update({
            attempt_count: nextAttempt,
            created_at: new Date().toISOString(),
            error: `retry ${nextAttempt}/${MAX_RETRIES} (prev render died)`,
          })
          .eq('id', job.id);
        try {
          const resp = await fetch(`${supabaseUrl}/functions/v1/generate-dream`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${serviceRoleKey}`,
              'x-dream-retry': '1',
            },
            body: JSON.stringify(job.payload),
          });
          console.log(
            `[refund-stuck-jobs] re-dispatched ${job.id} (attempt ${nextAttempt}/${MAX_RETRIES}, http ${resp.status})`
          );
        } catch (e) {
          console.error(
            `[refund-stuck-jobs] re-dispatch fetch failed for ${job.id}:`,
            (e as Error).message
          );
        }
        redispatched++;
        continue;
      }

      // Out of retries (or no payload to replay) — refund + mark timeout + notify.
      // Idempotent refund — returns false if a prior refund exists
      const { data: didRefund, error: refundErr } = await supabase.rpc('refund_sparkles', {
        p_user_id: job.user_id,
        p_amount: 1,
        p_reason: 'refund:hard_fail:timeout',
        p_reference_id: job.id,
      });
      if (refundErr) throw refundErr;
      if (didRefund) refunded++;

      // Mark the job timeout so we don't sweep it again
      await supabase
        .from('dream_jobs')
        .update({
          status: 'timeout',
          error: job.error
            ? `${job.error}; swept-by-refund-stuck-jobs`
            : 'Edge Function died before refund could land — swept by refund-stuck-jobs',
          completed_at: new Date().toISOString(),
        })
        .eq('id', job.id);

      // Phase 4: also notify the user. Failure notifications are kind of
      // gentle — the loading screen probably already showed transport
      // error if the client was watching, but if they backgrounded we want
      // them to see it on next inbox visit. actor_id = recipient (self-actor
      // pattern, mirrors dream_generated notifications).
      try {
        // Timeout sweep = infra failure → always retryable (isNsfw = false).
        await supabase
          .from('notifications')
          .insert(dreamFailedNotification(job.id, job.user_id, false));
      } catch {
        // Non-critical — refund already landed
      }
    } catch (err) {
      console.error(`[refund-stuck-jobs] Failed to sweep job ${job.id}:`, (err as Error).message);
      errors++;
    }
  }

  console.log(
    `[refund-stuck-jobs] Done: ${jobs.length} stuck, ${redispatched} re-dispatched, ${refunded} refunded, ${errors} errors`
  );

  return new Response(
    JSON.stringify({
      swept: jobs.length,
      redispatched,
      refunded,
      errors,
    }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
  );
});
