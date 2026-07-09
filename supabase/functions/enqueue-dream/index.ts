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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { getSparkleCost, loadModelCosts } from '../_shared/modelPricing.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';
import { classifyDreamWeight } from '../_shared/dreamQueueWeight.ts';
import { routeNewSceneSubject } from '../_shared/newSceneDirective.ts';
import { buildFirstDreamTiers, type CastMemberLike } from '../_shared/firstDreamTiers.ts';

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

  // ── First-dream branch (onboarding reveal) ──
  // The first dream is FREE (no sparkle charge) and routes through the
  // first_dream cascade: dual → single → scene, each tier its own isolate via
  // first-dream-render. We build the tier LIST here from the cast and stash it
  // in the payload; the orchestrator advances tier_index + re-queues per tier.
  // nightly-dreams loads the recipe from user_recipes by user_id at render time
  // (saved just before this call in RevealStep), so the payload carries only the
  // cascade state — not the whole vibe_profile.
  if (body.first_dream === true) {
    // Guard against farming the FREE first dream (the most expensive path —
    // forced cast face-swap via the Fly dual-swap service). One per account:
    // block once the user already has a first_dream queue row that isn't a
    // terminal failure (queued / in_progress / completed). This also stops the
    // parallel-spam race (the first insert blocks the rest) while still letting
    // a user re-attempt if their only prior first dream actually FAILED. The
    // orchestrator re-queues tiers via first-dream-render (service path), not
    // this endpoint, so it isn't affected. NOTE: cross-account farming (N fresh
    // accounts → N free dreams) is bounded by email-confirm + app attestation,
    // not this per-account check.
    const { count: priorFirst } = await supabase
      .from('dream_queue')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('source', 'first_dream')
      .not('status', 'in', '(failed,dead_letter)');
    if ((priorFirst ?? 0) > 0) {
      return json({ error: 'first_dream_already_claimed' }, 409);
    }

    // Per-IP cap on the FREE first dream (migration 332) — the anti-farming
    // lever the per-account check above CAN'T provide: N fresh accounts from one
    // machine each pass the per-account guard, so a per-IP limit bounds the
    // "N free heavy dual-swap renders on our bill" abuse. Fail-open on an
    // unknown IP (proxy stripped the header) — the RPC handles that. Take the
    // FIRST hop of x-forwarded-for (the client; later hops are our proxies).
    const clientIp = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
    const { data: ipOk } = await supabase.rpc('claim_first_dream_ip', { p_ip: clientIp });
    if (ipOk === false) {
      return json({ error: 'first_dream_ip_rate_limited' }, 429);
    }

    const fdJobId = crypto.randomUUID();
    const vp = body.vibe_profile as
      | { dream_cast?: CastMemberLike[]; dream_seeds?: { places?: string[] } }
      | undefined;
    // Mandate the first dream's setting to one of the locations the user JUST
    // picked in onboarding (carried in the request vibe_profile), not the random
    // seed pool. Pick one here and bake it into every tier; bypasses the
    // user_recipes-load race at render time. Falls back to the pool only if the
    // user selected zero locations (firstDreamTiers leaves force_place unset).
    const userPlaces = (vp?.dream_seeds?.places ?? []).filter(
      (p): p is string => typeof p === 'string' && p.trim().length > 0
    );
    const firstPlace = userPlaces.length
      ? userPlaces[Math.floor(Math.random() * userPlaces.length)]
      : undefined;
    const tiers = buildFirstDreamTiers(vp?.dream_cast ?? [], firstPlace);
    const fdPayload = { tiers, tier_index: 0 };

    await supabase
      .from('dream_jobs')
      .upsert(
        { id: fdJobId, user_id: userId, status: 'processing', payload: fdPayload },
        { onConflict: 'id', ignoreDuplicates: true }
      );

    const { error: fdEnqErr } = await supabase.from('dream_queue').insert({
      id: fdJobId,
      user_id: userId,
      source: 'first_dream',
      weight: 'heavy', // forced cast face swap → Fly swap service → heavy cap
      payload: fdPayload,
      status: 'queued',
      dedup_key: `first_dream:${fdJobId}`,
    });
    if (fdEnqErr) {
      // The partial unique index ux_dream_queue_active_first_dream (migration 281)
      // makes one-free-first-dream-per-account ATOMIC — a racing duplicate insert
      // raises 23505 instead of slipping past the check-then-insert guard above.
      if (fdEnqErr.code === '23505') {
        return json({ error: 'first_dream_already_claimed' }, 409);
      }
      return json({ error: `enqueue_failed: ${fdEnqErr.message}` }, 500);
    }

    const fdWorkerToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN');
    if (fdWorkerToken) {
      await fetch(`${supabaseUrl}/functions/v1/dream-queue-worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${fdWorkerToken}` },
        body: '{}',
      }).then(
        () => {},
        () => {}
      );
    }

    return json({ dream_id: fdJobId, status: 'queued' }, 200);
  }

  // ── Retry branch ──
  // Re-run a previously FAILED dream by re-enqueuing its stored payload (the
  // exact RequestBody → reproduces prompt/model/medium/vibe/photo verbatim).
  // Charged fresh (the failure already refunded). Guards: must belong to the
  // caller, must be a terminal failure, and must NOT be a content/NSFW
  // rejection (re-running the same prompt just re-fails — the client routes
  // those to Create instead, but defend server-side too).
  const retryJobId = typeof body.retry_job_id === 'string' ? body.retry_job_id : null;
  if (retryJobId) {
    const { data: prior } = await supabase
      .from('dream_queue')
      .select('payload, user_id, status')
      .eq('id', retryJobId)
      .maybeSingle();
    if (!prior || prior.user_id !== userId || !prior.payload) {
      return json({ error: 'retry_not_found' }, 404);
    }
    if (prior.status !== 'dead_letter' && prior.status !== 'failed') {
      return json({ error: 'retry_not_failed' }, 409);
    }
    const { data: priorJob } = await supabase
      .from('dream_jobs')
      .select('status')
      .eq('id', retryJobId)
      .maybeSingle();
    if (priorJob?.status === 'nsfw') {
      return json({ error: 'retry_not_allowed_nsfw' }, 409);
    }
    // Reproduce from the stored payload with a FRESH job id (strip the old one).
    body = { ...(prior.payload as Record<string, unknown>) };
    delete body.job_id;
  }

  // One UUID across dream_queue / dream_jobs / sparkle ledger. Prefer the
  // client's job_id (it already set it as activeJobId for the loading screen +
  // recovery polling), so dream_queue.id == activeJobId and the client can
  // subscribe to its own row. Fall back to a server UUID for direct callers.
  const jobId =
    typeof body.job_id === 'string' && body.job_id.length > 0 ? body.job_id : crypto.randomUUID();
  const forceModel = typeof body.force_model === 'string' ? body.force_model : null;
  const isDlt = body.dlt_recipe != null;

  // Per-user in-flight cap — sparkles are otherwise the only throttle, so bound
  // how many dreams one user can have queued/rendering at once (accidental
  // double-taps or abuse). Beyond this, reject 429 BEFORE charging; the user's
  // existing dreams keep draining. Cheap single COUNT; checked here so the
  // first-dream + retry branches above (onboarding / re-run a failure) bypass it.
  const MAX_INFLIGHT_PER_USER = 5;
  const { count: inflight } = await supabase
    .from('dream_queue')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['queued', 'in_progress']);
  if ((inflight ?? 0) >= MAX_INFLIGHT_PER_USER) {
    return json({ error: 'too_many_inflight', limit: MAX_INFLIGHT_PER_USER }, 429);
  }

  // Charge up front (idempotent on jobId), same cost rule as generate-dream so
  // the price stays server-driven. The render's own charge is then a no-op.
  await loadModelCosts(supabase);
  const cfg = await fetchEngineConfig(supabase);
  // New Scene tier pricing (mirrors generate-dream): a new_scene photo from a
  // tier-aware client charges the flat Standard/Best price by a server-validated
  // enum (never force_model). Old clients (no new_scene_tier) → legacy cost.
  const isNewScenePhoto = !!body.input_image && body.photo_style === 'new_scene';
  const newSceneTierReq =
    body.new_scene_tier === 'best'
      ? 'best'
      : body.new_scene_tier === 'standard'
        ? 'standard'
        : null;
  // Edge backstop for the group-size cap (the client blocks pre-charge; reject
  // here too so a hostile client can't skip it). Before charging.
  if (
    isNewScenePhoto &&
    newSceneTierReq &&
    typeof body.num_people === 'number' &&
    body.num_people > cfg.newSceneMaxPeople
  ) {
    return json({ error: 'new_scene_too_many_people', max: cfg.newSceneMaxPeople }, 400);
  }
  // Price backstop: a solo-swap photo renders the exact-face swap identically
  // on BOTH tiers (the tier only picks the reference model, which solo swap
  // never uses) — never charge the Ultra price for it, whatever the client
  // sent. Same routing fork the render itself uses (routeNewSceneSubject).
  const newSceneSoloSwap =
    isNewScenePhoto && newSceneTierReq
      ? routeNewSceneSubject({
          type: typeof body.subject_type === 'string' ? body.subject_type : '',
          num_people: typeof body.num_people === 'number' ? body.num_people : 0,
          num_animals: typeof body.num_animals === 'number' ? body.num_animals : 0,
          face: typeof body.face === 'string' ? body.face : '',
        }).mode === 'solo_swap'
      : false;
  const dreamCost =
    isNewScenePhoto && newSceneTierReq
      ? newSceneTierReq === 'best' && !newSceneSoloSwap
        ? cfg.newScenePriceBest
        : cfg.newScenePriceStandard
      : forceModel
        ? getSparkleCost(forceModel)
        : cfg.baseSparkleCost;
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

  // Classify render WEIGHT for the per-weight concurrency cap (extracted to a
  // pure, unit-tested helper). HEAVY = face-swap-likely (Fly.io swap service);
  // LIGHT = plain text + restyle.
  const weight = classifyDreamWeight(body, {
    relationshipWords: cfg.relationshipWords,
    petWords: cfg.petWords,
    selfRefRegex: cfg.selfRefRegex,
  });

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
    weight,
    payload,
    status: 'queued',
    dedup_key: `create:${jobId}`,
  });
  if (enqErr) {
    // Idempotent retry: a dedup_key (create:${jobId}) collision means this exact
    // dream is ALREADY queued/rendering (e.g. the first enqueue succeeded but its
    // response was lost and the client resent the same job_id). It will complete +
    // post — so return it as success and DO NOT refund (the charge is idempotent;
    // refunding here would hand the user a free, already-rendering dream).
    if (enqErr.code === '23505') {
      return json({ dream_id: jobId, status: 'queued' }, 200);
    }
    // Genuine enqueue failure after charging — refund so the user isn't out a sparkle.
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
