/**
 * Edge Function: enqueue-dream
 *
 * Thin enqueue endpoint for user-initiated "Create" / "DLT" dreams. Replaces
 * the client AWAITING the ~24s synchronous generate-dream render — instead the
 * client calls this, gets a `dream_id` in <500ms, and waits on the dream_queue
 * realtime channel for completion. The dream-queue-worker drains the queue at a
 * GLOBALLY-CAPPED concurrency (escaping Supabase 546 WORKER_RESOURCE_LIMIT +
 * worker-pool exhaustion under burst), with retry/backoff/dead-letter.
 *
 * This function: auth (JWT) → charge sparkles (idempotent on job_id) → seed a
 * dream_jobs row (so the client's existing dream_jobs polling/realtime fallback
 * keeps working) → INSERT the dream_queue row → kick the worker for fast pickup.
 *
 * One UUID is job_id == dream_queue.id == dream_jobs.id == sparkle ledger
 * reference_id, so the renderer/worker charge/refund/notify all key off it.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSparkleCost, loadModelCosts } from '../_shared/modelPricing.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // The body is the full generate-dream RequestBody the renderer expects.
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Auth — the gateway validated the JWT; trust it to identify the user.
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return json({ error: 'Not authenticated' }, 401);
  }
  const userId = user.id;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // One UUID across dream_queue / dream_jobs / sparkle ledger. Prefer the
  // client's job_id (it already set it as activeJobId for the loading screen +
  // recovery polling), so dream_queue.id == activeJobId and the client can
  // subscribe to its own row. Fall back to a server UUID for direct callers.
  const jobId =
    typeof body.job_id === 'string' && body.job_id.length > 0 ? body.job_id : crypto.randomUUID();
  const forceModel = typeof body.force_model === 'string' ? body.force_model : null;
  const isDlt = body.dlt_recipe != null;

  // Charge up front (idempotent on jobId), same cost rule as generate-dream so
  // the price stays server-driven. The render's own charge is then a no-op.
  await loadModelCosts(supabase);
  const cfg = await fetchEngineConfig(supabase);
  const dreamCost = forceModel ? getSparkleCost(forceModel) : cfg.baseSparkleCost;
  const { data: chargeStatus } = await supabase.rpc('charge_sparkles', {
    p_user_id: userId,
    p_amount: dreamCost,
    p_reason: 'dream',
    p_reference_id: jobId,
  });
  if (chargeStatus === 'insufficient') {
    // Mirror generate-dream's 402 contract so the client's existing
    // insufficient_sparkles handling routes back to the paywall.
    return json({ error: 'insufficient_sparkles', needed: dreamCost }, 402);
  }

  // The payload IS the render's RequestBody, with job_id stamped so the
  // x-dream-queue render path resolves the user + reuses the idempotency key.
  const payload = { ...body, job_id: jobId };

  // Seed dream_jobs (renderer resolves the user from here; also keeps the
  // client's dream_jobs polling/realtime fallback working).
  await supabase
    .from('dream_jobs')
    .upsert(
      { id: jobId, user_id: userId, status: 'processing', payload },
      { onConflict: 'id', ignoreDuplicates: true }
    );

  // Enqueue. dedup_key gives insert-time double-tap idempotency (UNIQUE index).
  const { error: enqErr } = await supabase.from('dream_queue').insert({
    id: jobId,
    user_id: userId,
    source: isDlt ? 'dlt' : 'create',
    payload,
    status: 'queued',
    dedup_key: `create:${jobId}`,
  });
  if (enqErr) {
    // Enqueue failed after charging — refund so the user isn't out a sparkle.
    await supabase
      .rpc('refund_sparkles', {
        p_user_id: userId,
        p_amount: dreamCost,
        p_reason: 'refund:enqueue_failed',
        p_reference_id: jobId,
      })
      .then(
        () => {},
        () => {}
      );
    return json({ error: `enqueue_failed: ${enqErr.message}` }, 500);
  }

  // Kick the worker for fast pickup (~1-3s); the 1-min cron is the backstop.
  // The worker acks 202 immediately (runs its tick in the background), so this
  // await is fast.
  const workerToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN');
  if (workerToken) {
    await fetch(`${supabaseUrl}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
      body: '{}',
    }).then(
      () => {},
      () => {}
    );
  }

  return json({ dream_id: jobId, status: 'queued' }, 200);
});
