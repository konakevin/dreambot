/**
 * Edge Function: first-dream-render
 *
 * The onboarding first-dream ORCHESTRATOR. Dispatched FIRE-AND-FORGET by the
 * dream-queue-worker (source='first_dream'): it acks 202 immediately and renders
 * in EdgeRuntime.waitUntil, then owns the dream_queue terminal state itself
 * (same render-owns-lifecycle contract as generate-dream's x-dream-queue path).
 *
 * Why a separate orchestrator instead of looping inside one render:
 *   A single isolate has a ~150s wall-clock limit; a dual face-swap render alone
 *   can eat 60-120s. Running dual → single → scene SEQUENTIALLY in one isolate
 *   would blow the limit and die mid-cascade (orphaning uploads). So each tier
 *   renders in its OWN isolate, chained through the queue: this function renders
 *   ONE tier, and on a cascadeable failure advances `tier_index` in the payload
 *   and RE-QUEUES — the worker then re-dispatches the next tier fresh.
 *
 * The cascade itself (dual → single-self → single-plus_one/pet → scene-only)
 * lives in _shared/firstDreamTiers.ts and is built at enqueue time. nightly-dreams
 * is UNTOUCHED: it still returns its structured `422 face_swap_failed_*` per tier;
 * this orchestrator interprets that and decides advance-tier vs retry vs fail.
 *
 * Auth: worker token (Authorization: Bearer <DREAM_QUEUE_WORKER_TOKEN>).
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { completeQueueJob } from '../_shared/dreamQueueLifecycle.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';
import type { FirstDreamTier } from '../_shared/firstDreamTiers.ts';

// Per-tier infra retries before giving up on a tier and falling to the next one.
// A genuine face-swap/NSFW 422 advances IMMEDIATELY (no same-tier retry — it
// won't pass on re-run); only transient infra/5xx errors get one fast re-try on
// the same (better) tier so a blip doesn't needlessly downgrade dual → single.
const MAX_TIER_INFRA_RETRIES = 1;
// Hard backstop against a pathological re-queue loop (tier advances are already
// monotonic, but guard total dispatches anyway).
const MAX_TOTAL_DISPATCHES = 10;

interface FirstDreamPayload {
  tiers: FirstDreamTier[];
  tier_index?: number;
  tier_attempt?: number;
  total_dispatches?: number;
}

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const workerToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN');

  if (!workerToken) {
    return json({ error: 'misconfigured: DREAM_QUEUE_WORKER_TOKEN not set' }, 500);
  }
  const authHeader = req.headers.get('Authorization') ?? '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!timingSafeEqual(bearer, workerToken)) {
    return json({ error: 'unauthorized' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  const jobId = typeof body.job_id === 'string' ? body.job_id : '';
  if (!jobId) return json({ error: 'job_id required' }, 400);

  const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);

  // Render SYNCHRONOUSLY — the worker holds the connection open (it awaits this
  // dispatch), which keeps the isolate alive for the full render. We used to ack
  // 202 + render in EdgeRuntime.waitUntil, but the platform stopped honoring
  // waitUntil for background work (2026-06-17): the detached render was silently
  // dropped after the 202, so the onboarding first dream never rendered.
  // renderFirstDream still owns the dream_queue terminal state (complete /
  // re-queue the next cascade tier / dead_letter).
  await renderFirstDream(supabase, supabaseUrl, workerToken, jobId);
  return json({ done: true, job_id: jobId }, 200);
});

async function renderFirstDream(
  supabase: SupabaseClient,
  supabaseUrl: string,
  workerToken: string,
  jobId: string
): Promise<void> {
  // Load the job. Bail if it's already terminal (duplicate dispatch / race).
  const { data: job } = await supabase
    .from('dream_queue')
    .select('user_id, payload, status')
    .eq('id', jobId)
    .maybeSingle();
  if (!job) {
    console.error(`[first-dream] job ${jobId} not found`);
    return;
  }
  if (job.status === 'completed' || job.status === 'dead_letter') {
    console.log(`[first-dream] job ${jobId} already ${job.status} — no-op`);
    return;
  }

  const userId = job.user_id as string;
  const payload = (job.payload ?? {}) as FirstDreamPayload;
  const tiers = Array.isArray(payload.tiers) ? payload.tiers : [];
  const tierIndex = payload.tier_index ?? 0;
  const tierAttempt = payload.tier_attempt ?? 0;
  const totalDispatches = (payload.total_dispatches ?? 0) + 1;

  if (tiers.length === 0) {
    console.error(`[first-dream] job ${jobId} has no tiers — dead-lettering`);
    await terminalFail(supabase, jobId, 'no_tiers');
    return;
  }
  if (totalDispatches > MAX_TOTAL_DISPATCHES || tierIndex >= tiers.length) {
    console.error(
      `[first-dream] job ${jobId} exhausted (dispatch ${totalDispatches}) — dead-letter`
    );
    await terminalFail(supabase, jobId, 'cascade_exhausted');
    return;
  }

  const tier = tiers[tierIndex];
  console.log(
    `[first-dream] job ${jobId} rendering tier '${tier.name}' (index ${tierIndex}/${tiers.length - 1}, attempt ${tierAttempt + 1})`
  );

  // Render ONE tier via the nightly-dreams worker path. user_id drives the
  // recipe load (saved at enqueue time); tier.body carries the force_cast_role /
  // force_face_swap_eligible / strict_face_swap that select the cascade tier.
  let status = 0;
  let data: Record<string, unknown> = {};
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
      body: JSON.stringify({ user_id: userId, persist: true, ...tier.body }),
    });
    status = res.status;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
  } catch (err) {
    status = 0; // network-level failure → treat as transient infra error
    data = { error: (err as Error).message };
  }

  // ── Success ──
  const uploadId = typeof data.upload_id === 'string' ? data.upload_id : null;
  if (status >= 200 && status < 300 && uploadId) {
    console.log(`[first-dream] job ${jobId} tier '${tier.name}' SUCCEEDED → upload ${uploadId}`);
    await completeQueueJob(supabase, jobId, uploadId);
    await supabase
      .from('dream_jobs')
      .update({
        status: 'done',
        result_image_url: (data.image_url as string) ?? null,
        result_prompt: (data.prompt_used as string) ?? null,
        result_medium: (data.resolved_medium as string) ?? null,
        result_vibe: (data.resolved_vibe as string) ?? null,
        upload_id: uploadId,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .then(
        () => {},
        () => {}
      );
    return;
  }

  // ── Failure — decide advance-tier vs same-tier retry vs terminal ──
  const errCode = (data.error as string) || (data.code as string) || `http_${status}`;
  // A 422 from nightly-dreams is a CASCADEABLE classification (face_swap_failed_*
  // / render_blocked) — re-running the same tier won't help, so advance now.
  const isCascadeable = status === 422;
  const isLastTier = tierIndex + 1 >= tiers.length;

  if (isCascadeable) {
    if (isLastTier) {
      console.error(
        `[first-dream] job ${jobId} last tier '${tier.name}' 422 (${errCode}) — dead-letter`
      );
      await terminalFail(supabase, jobId, errCode);
    } else {
      console.log(
        `[first-dream] job ${jobId} tier '${tier.name}' 422 (${errCode}) → advance to tier ${tierIndex + 1}`
      );
      await advanceTier(
        supabase,
        supabaseUrl,
        workerToken,
        jobId,
        payload,
        tierIndex + 1,
        0,
        totalDispatches,
        errCode
      );
    }
    return;
  }

  // Transient infra/5xx/network error: give the SAME (better) tier one fast
  // retry before downgrading, so a blip doesn't needlessly drop dual → single.
  if (tierAttempt < MAX_TIER_INFRA_RETRIES) {
    console.log(
      `[first-dream] job ${jobId} tier '${tier.name}' infra error (${errCode}) → same-tier retry`
    );
    await advanceTier(
      supabase,
      supabaseUrl,
      workerToken,
      jobId,
      payload,
      tierIndex,
      tierAttempt + 1,
      totalDispatches,
      errCode
    );
    return;
  }

  if (isLastTier) {
    console.error(
      `[first-dream] job ${jobId} last tier '${tier.name}' infra error (${errCode}) — dead-letter`
    );
    await terminalFail(supabase, jobId, errCode);
  } else {
    console.log(
      `[first-dream] job ${jobId} tier '${tier.name}' infra error (${errCode}) → advance to tier ${tierIndex + 1}`
    );
    await advanceTier(
      supabase,
      supabaseUrl,
      workerToken,
      jobId,
      payload,
      tierIndex + 1,
      0,
      totalDispatches,
      errCode
    );
  }
}

/** Re-queue the job at a (possibly new) tier — no backoff, no attempt burn. */
async function advanceTier(
  supabase: SupabaseClient,
  supabaseUrl: string,
  workerToken: string,
  jobId: string,
  payload: FirstDreamPayload,
  nextTierIndex: number,
  nextTierAttempt: number,
  totalDispatches: number,
  lastError: string
): Promise<void> {
  const nextPayload: FirstDreamPayload = {
    ...payload,
    tier_index: nextTierIndex,
    tier_attempt: nextTierAttempt,
    total_dispatches: totalDispatches,
  };
  await supabase
    .from('dream_queue')
    .update({
      status: 'queued',
      payload: nextPayload,
      started_at: null,
      worker_id: null,
      last_error: lastError.slice(0, 1000),
    })
    .eq('id', jobId);

  // Kick the worker for fast pickup (~1-3s) — the user is actively waiting.
  await fetch(`${supabaseUrl}/functions/v1/dream-queue-worker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
    body: '{}',
  }).then(
    () => {},
    () => {}
  );
}

/**
 * Terminal failure: all tiers exhausted. The first dream is FREE, so there's no
 * sparkle to refund (unlike failQueueJob). Mark dead_letter + dream_jobs failed
 * so the onboarding client sees it and shows the retry UI. No dream_failed
 * notification — the user is on the reveal screen, not relying on the inbox.
 */
async function terminalFail(
  supabase: SupabaseClient,
  jobId: string,
  errMsg: string
): Promise<void> {
  const message = (errMsg || 'unknown').slice(0, 1000);
  await supabase
    .from('dream_queue')
    .update({ status: 'dead_letter', last_error: message, completed_at: new Date().toISOString() })
    .eq('id', jobId);
  await supabase
    .from('dream_jobs')
    .update({ status: 'failed', error: message, completed_at: new Date().toISOString() })
    .eq('id', jobId)
    .then(
      () => {},
      () => {}
    );
}
