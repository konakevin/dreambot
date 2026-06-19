/**
 * Edge Function: restyle-photo — V4 Phase 3.4.
 *
 * Dedicated function for photo restyle (Kontext transform). Extracted from
 * generate-dream to keep that function focused on text/self-insert/reimagine.
 *
 * Three restyle paths:
 *   1. flux-dev medium (e.g., LEGO): vision describe → Sonnet rewrite → Flux Dev
 *   2. Kontext medium (most mediums): build prompt directly → Kontext generation
 *   3. No config (fallback): generic Kontext prompt → Kontext generation
 *
 * POST /functions/v1/restyle-photo
 * Authorization: Bearer <user JWT>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { VibeProfile } from '../_shared/vibeProfile.ts';
import { getPhotoRestyleConfig } from '../_shared/photoPrompts.ts';
import { describeWithVision, VISION_PROMPTS } from '../_shared/vision.ts';
import { resolveMediumFromDb, resolveVibeFromDb } from '../_shared/dreamStyles.ts';
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { shouldSendCompletionNotification } from '../_shared/notify.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { persistToStorage, buildDisplayVariant } from '../_shared/persistence.ts';
import {
  completeQueueJob,
  failQueueJob,
  dreamFailedNotification,
  markStage,
} from '../_shared/dreamQueueLifecycle.ts';
import { captureRenderError } from '../_shared/sentry.ts';
import { callSonnet } from '../_shared/llm.ts';
import {
  getCostCents,
  getSparkleCost,
  loadModelCosts,
  isKnownModel,
} from '../_shared/modelPricing.ts';
import { applyVibeGenderModifier } from '../_shared/promptCompiler.ts';
import { insertGenerationLog, asJsonbObject } from '../_shared/logging.ts';
import { sanitizeUserText } from '../_shared/sanitizeUserText.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';

interface RestyleRequest {
  mode: 'flux-dev' | 'flux-kontext';
  input_image: string;
  medium_key: string;
  vibe_key: string;
  hint?: string;
  force_model?: string;
  job_id?: string;
  vibe_profile?: VibeProfile;
}

// The full request handler. Wrapped (below) with EdgeRuntime.waitUntil so the
// render survives the client disconnecting — a user who taps "Queue This" and
// then backgrounds/kills the app must still get their photo restyled,
// persisted, and notified.
async function handleRequest(req: Request): Promise<Response> {
  // ── CORS preflight ──────────────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // ── Environment ─────────────────────────────────────────────────────────
  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing REPLICATE_API_TOKEN' }),
      { status: 500 }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Service role client for database operations (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // ── Parse request body (before auth — the queue path needs job_id) ────────
  let body: RestyleRequest;
  try {
    body = await req.json();
    console.log('[restyle-photo] BODY KEYS:', Object.keys(body), 'force_model:', body.force_model);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  // Sanitize user text up front (hint) before it reaches the Sonnet rewrite /
  // Kontext prompt. enqueue-dream forwards the body unsanitized → gate here.
  // Strips prompt-injection / control / zero-width, NFKC-normalizes, caps length.
  if (typeof body.hint === 'string') body.hint = sanitizeUserText(body.hint, 'hint');

  // ── Auth ────────────────────────────────────────────────────────────────
  // Normal path: the user's JWT. Queue path: dream-queue-worker dispatches this
  // server-side (x-dream-queue:1 + service-role) and AWAITS the result; resolve
  // the user from the dream_jobs row by job_id, render synchronously, and let
  // the WORKER own retry/dead-letter/refund (skip the in-function refund).
  const authHeader = req.headers.get('authorization') ?? '';
  const isQueue = req.headers.get('x-dream-queue') === '1';
  let userId: string;
  if (isQueue) {
    if (!timingSafeEqual(authHeader, `Bearer ${serviceRoleKey}`)) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    const qJobId = typeof body.job_id === 'string' ? body.job_id : null;
    if (!qJobId) {
      return new Response(JSON.stringify({ error: 'queue requires job_id' }), { status: 400 });
    }
    const { data: jobRow } = await supabase
      .from('dream_jobs')
      .select('user_id')
      .eq('id', qJobId)
      .single();
    if (!jobRow) {
      return new Response(JSON.stringify({ error: 'job not found' }), { status: 404 });
    }
    userId = jobRow.user_id as string;
    console.log(`[restyle-photo] QUEUE render for job ${qJobId} (user ${userId})`);
  } else {
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
      console.error(
        '[restyle-photo] Auth failed:',
        authError && authError.message ? authError.message : 'no user',
        'header:',
        authHeader.slice(0, 30)
      );
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    userId = user.id;
  }

  const { mode, input_image, medium_key, vibe_key, hint, vibe_profile: vibeProfile } = body;
  // Validated below against the model catalog (after loadModelCosts) — an unknown
  // force_model is ignored so a client can't force an arbitrary/unpriced model.
  let force_model: string | undefined =
    typeof body.force_model === 'string' ? body.force_model : undefined;

  // Every user-initiated restyle MUST carry a job_id so the sparkle charge below
  // has an idempotency key. Without one the charge block was skipped entirely —
  // a tampered client could omit job_id for a FREE render. Synthesize one for
  // direct callers; the queue path already requires it (validated above).
  let jobId: string | undefined =
    typeof body.job_id === 'string' && body.job_id.length > 0 ? body.job_id : undefined;
  if (!jobId && !isQueue) {
    jobId = crypto.randomUUID();
  }

  // Per-user rate limit on the DIRECT user path (the queue path is bounded by
  // enqueue-dream's in-flight cap + the worker's concurrency caps). Reuses
  // migration 228's edge_function_invocations trigger (10 expensive edge
  // calls/min/user). Fail-open on a logging error; the charge below is the gate.
  if (!isQueue) {
    const { error: rlErr } = await supabase
      .from('edge_function_invocations')
      .insert({ user_id: userId, function_name: 'restyle-photo' });
    if (rlErr) {
      const isRl =
        rlErr.message?.includes('rate_limited') ||
        (rlErr as { hint?: string }).hint === 'rate_limited';
      if (isRl) {
        return new Response(JSON.stringify({ error: 'rate_limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      console.error('[restyle-photo] rate-limit log INSERT failed:', rlErr.message);
    }
  }

  // ── Validate ────────────────────────────────────────────────────────────
  if (!mode || (mode !== 'flux-dev' && mode !== 'flux-kontext')) {
    return new Response(
      JSON.stringify({ error: 'Invalid mode. Must be "flux-dev" or "flux-kontext"' }),
      { status: 400 }
    );
  }

  if (!input_image) {
    return new Response(JSON.stringify({ error: 'input_image is required' }), { status: 400 });
  }

  if (!medium_key || !vibe_key) {
    return new Response(JSON.stringify({ error: 'Both medium_key and vibe_key are required' }), {
      status: 400,
    });
  }

  // ── Timing ──────────────────────────────────────────────────────────────
  const t0 = Date.now();
  const timings: Record<string, number> = {};
  let lastLap = t0;
  const lap = (label: string) => {
    const now = Date.now();
    const stepMs = now - lastLap;
    const totalMs = now - t0;
    timings[label] = stepMs;
    console.log(`[restyle-photo] ⏱ ${label}: ${stepMs}ms (total: ${totalMs}ms)`);
    lastLap = now;
  };

  // ── Budget tracking (analytics only — sparkles are the sole limiter) ───
  const today = new Date().toISOString().slice(0, 10);
  const { data: budgetRow } = await supabase
    .from('ai_generation_budget')
    .select('images_generated')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  const todayCount = budgetRow && budgetRow.images_generated ? budgetRow.images_generated : 0;

  // ── Dream job tracking (best-effort) ────────────────────────────────────
  // Upsert (ignoreDuplicates), NOT insert: "Queue This" can pre-create this row
  // via request_dream_notification (migration 195) with notify_on_complete=true
  // before we get here. A plain insert would PK-conflict and could reset that
  // flag; ignoreDuplicates keeps the queued dream's notify flag intact.
  if (jobId) {
    try {
      await supabase
        .from('dream_jobs')
        .upsert(
          { id: jobId, user_id: userId, status: 'processing' },
          { onConflict: 'id', ignoreDuplicates: true }
        );
    } catch {
      /* non-critical — job tracking is best-effort */
    }
  }

  // ── Server-side sparkle charge (idempotent on jobId) ──────────────────────
  // Mirrors generate-dream: the charge is server-side so prices are DB-driven
  // and the client no longer debits. Idempotent on jobId — an old client that
  // already charged makes this a no-op (no double charge). Restyle has no
  // force_model in practice → 1 sparkle; getSparkleCost handles either.
  if (jobId) {
    await loadModelCosts(supabase);
    // Ignore an unknown force_model (catalog-bound cost + render).
    if (force_model && !isKnownModel(force_model)) {
      console.warn(`[restyle-photo] ignoring unknown force_model: ${force_model}`);
      force_model = undefined;
    }
    const dreamCost = getSparkleCost(force_model || '');
    try {
      const { data: chargeStatus } = await supabase.rpc('charge_sparkles', {
        p_user_id: userId,
        p_amount: dreamCost,
        p_reason: 'dream',
        p_reference_id: jobId,
      });
      if (chargeStatus === 'insufficient') {
        return new Response(JSON.stringify({ error: 'insufficient_sparkles', needed: dreamCost }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (err) {
      console.warn('[restyle-photo] charge_sparkles failed:', (err as Error).message);
      // Fail CLOSED on the direct user path — THIS is the only charge, so a
      // charge error must not yield a free render. The queue path was already
      // charged at enqueue, so it fails OPEN (idempotent no-op re-charge).
      if (!isQueue) {
        return new Response(JSON.stringify({ error: 'charge_failed' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  // ── Observability (Phase 1) ─────────────────────────────────────────────
  let sonnetBrief: string | null = null;
  let sonnetRawResponse: string | null = null;
  let visionDescription: string | null = null;
  let replicatePredictionId: string | null = null;
  const fallbackReasons: string[] = [];

  // Stage breadcrumb — pre-render (medium/vibe resolve + vision + Sonnet brief).
  markStage(supabase, jobId, 'resolve');

  // ── Resolve medium + vibe from DB ───────────────────────────────────────
  // 2026-06-02 — art_styles / aesthetics favorites removed from VibeProfile
  // + the resolver branches that consumed them. Client always passes a
  // concrete key here.
  const medium = await resolveMediumFromDb(medium_key);
  const vibe = await resolveVibeFromDb(vibe_key);
  lap('resolve-styles');

  const resolvedMediumKey = medium.key;
  const resolvedVibeKey = vibe.key;

  console.log(
    '[restyle-photo] medium:',
    medium.key,
    '| vibe:',
    vibe.key,
    '| hint:',
    hint ? hint.slice(0, 50) : '(none)'
  );

  // ── Build restyle prompt ────────────────────────────────────────────────
  let finalPrompt: string;
  let photoOverrideMode: string | null = null;
  let logAxes: Record<string, unknown> = {};

  const config = getPhotoRestyleConfig(medium.key, medium);
  // Apply gender modifier (coquette routing) — null gender = female default for restyle
  const rawVibeDirective = vibe.directive ? vibe.directive.slice(0, 200) : '';
  const vibeDirective = applyVibeGenderModifier(vibe.key, rawVibeDirective, null);

  if (config && config.model === 'flux-dev') {
    // ── PATH 1: Vision describe → Sonnet rewrite → Flux Dev ──
    // (e.g., LEGO — minifigures are non-human, needs full artistic rebuild)
    try {
      const photoDescription = await describeWithVision(
        input_image,
        VISION_PROMPTS.photoSubject,
        REPLICATE_TOKEN,
        100
      );
      visionDescription = photoDescription;
      lap('vision-describe');
      console.log('[restyle-photo] flux-dev photo description:', photoDescription.slice(0, 120));

      const restyleBrief = config.buildPrompt(photoDescription, vibeDirective, hint ?? '');

      const sonnetResult = await callSonnet(restyleBrief, ANTHROPIC_KEY, 150);
      sonnetBrief = sonnetResult.brief;
      sonnetRawResponse = sonnetResult.rawResponse;
      finalPrompt = sonnetResult.text;
      lap('sonnet-rewrite');
      console.log('[restyle-photo] Sonnet rewrite:', finalPrompt.slice(0, 150));
    } catch (err) {
      console.error('[restyle-photo] flux-dev path failed:', (err as Error).message);
      fallbackReasons.push(`fluxdev_restyle_failed:${(err as Error).message}`);
      // Fallback: use hint + medium styling as a raw prompt
      finalPrompt = `${medium.fluxFragment}, ${hint ?? 'a creative scene'}, ${vibeDirective.split('.')[0] || 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
    }
    photoOverrideMode = 'flux-dev';
    logAxes = {
      medium: medium.key,
      vibe: vibe.key,
      engine: 'v2-restyle-fluxdev',
    };
  } else if (config) {
    // ── PATH 2: Kontext medium — direct prompt, no LLM rewrite ──
    finalPrompt = config.buildPrompt('', vibeDirective, hint ?? '');
    finalPrompt +=
      '\nIMPORTANT: The person must be RECOGNIZABLE — keep their face, features, and likeness. Render them in the art style but they must still look like the same person.';
    logAxes = {
      medium: medium.key,
      vibe: vibe.key,
      engine: 'v2-restyle-kontext',
    };
    console.log('[restyle-photo] Kontext prompt:', finalPrompt.slice(0, 150));
  } else {
    // ── PATH 3: No config — generic Kontext prompt ──
    finalPrompt = `Transform this photo into ${medium.fluxFragment ? medium.fluxFragment : medium.key} style. Keep the same person, same pose, same expression, facing the camera. ${vibeDirective} Portrait 9:16.${hint ? ` ${hint}` : ''}`;
    fallbackReasons.push('no_medium_config');
    logAxes = {
      medium: medium.key,
      vibe: vibe.key,
      engine: 'v2-restyle-kontext-generic',
    };
    console.log('[restyle-photo] Generic restyle prompt:', finalPrompt.slice(0, 150));
  }
  lap('prompt-build');

  // ── Sanitize + pick model ───────────────────────────────────────────────
  const effectiveMode = photoOverrideMode ?? mode;
  const effectiveInputImage = photoOverrideMode ? undefined : input_image;

  finalPrompt = sanitizePrompt(finalPrompt);

  const autoPicked = await pickModel(
    effectiveMode,
    finalPrompt,
    resolvedMediumKey,
    resolvedVibeKey
  );
  // Per-medium restyle model selection:
  //   • restyleModels (POOL) → pick one at random. LEGO/Vinyl peg restyle to
  //     flux-1.1-pro / -ultra here (migration 301), instead of the random
  //     allowed_models pool, WITHOUT touching the shared allowed_models (which
  //     nightly + new-scene also use).
  //   • restyleModel (single) → the 6 Real Face mediums (Nano Banana, mig 294).
  //   • else → the resolved default (Kontext / Flux-Dev medium pool).
  // A client force_model still wins (advanced override).
  const restylePool = medium.restyleModels;
  const restyleChoice =
    restylePool && restylePool.length > 0
      ? restylePool[Math.floor(Math.random() * restylePool.length)]
      : medium.restyleModel;
  const pickedModel = force_model || restyleChoice || autoPicked.model;
  logAxes.model = pickedModel;

  console.log(
    `[restyle-photo] User ${userId}, mode=${effectiveMode}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // Stage breadcrumb — Flux/Kontext render (records the model for hard kills).
  markStage(supabase, jobId, 'flux_render', pickedModel);

  // ── Generate image via Replicate ────────────────────────────────────────
  try {
    console.log(`[restyle-photo] ⏱ Starting image generation (model: ${pickedModel})...`);
    const genResult = await generateImage(
      effectiveMode,
      finalPrompt,
      effectiveInputImage,
      {
        replicateToken: REPLICATE_TOKEN,
        openaiKey: Deno.env.get('OPENAI_API_KEY'),
        geminiKey: Deno.env.get('GEMINI_API_KEY'),
      },
      pickedModel
    );
    replicatePredictionId = genResult.predictionId;
    if (genResult.nsfwRetries && genResult.nsfwRetries > 0) {
      logAxes.nsfwRetries = genResult.nsfwRetries;
      console.log(
        `[restyle-photo] Generation passed after ${genResult.nsfwRetries} NSFW retry/retries`
      );
    }
    lap('image-gen');
    console.log(
      `[restyle-photo] ⏱ Image generation complete (prediction: ${genResult.predictionId})`
    );

    // Stage breadcrumb — storage upload + persist.
    markStage(supabase, jobId, 'upload', pickedModel);

    // ── Persist to Storage + log in parallel ────────────────────────────
    timings.total = Date.now() - t0;
    const [persistedUrl] = await Promise.all([
      persistToStorage(genResult.url, userId, supabase),
      insertGenerationLog(supabase, {
        user_id: userId,
        job_id: jobId ?? null,
        recipe_snapshot: asJsonbObject(vibeProfile),
        rolled_axes: { ...logAxes, timings },
        enhanced_prompt: finalPrompt,
        model_used: pickedModel,
        cost_cents: getCostCents(pickedModel),
        status: 'completed',
        sonnet_brief: sonnetBrief,
        sonnet_raw_response: sonnetRawResponse,
        vision_description: visionDescription,
        fallback_reasons: fallbackReasons,
        replicate_prediction_id: replicatePredictionId,
      }),
    ]);
    const imageUrl = persistedUrl;
    lap('persist-done');

    // ── Draft upload + budget upsert in parallel ──────────────────────
    const caption = finalPrompt.length > 200 ? finalPrompt.slice(0, 197) + '...' : finalPrompt;
    let uploadId: string | undefined;

    // Insert immediately with a NULL display variant; build it in the
    // background (off the render's 2s/150MB budget — the 546 fix). The feed
    // falls back to image_url until the variant is patched in a moment later.
    const [uploadResult] = await Promise.all([
      supabase
        .from('uploads')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          image_url_display: null,
          thumbhash: null,
          caption,
          ai_prompt: finalPrompt,
          ai_concept: null,
          dream_medium: resolvedMediumKey,
          dream_vibe: resolvedVibeKey,
          // Which AI model rendered this — drives the model badge on the
          // DreamCard fullscreen view (migration 211, 2026-05-30).
          model: pickedModel || null,
          is_public: false,
          is_ai_generated: true,
          width: 768,
          height: 1664,
        })
        .select('id')
        .single(),
      supabase
        .from('ai_generation_budget')
        .upsert(
          {
            user_id: userId,
            date: today,
            images_generated: todayCount + 1,
            total_cost_cents: (todayCount + 1) * 3,
          },
          { onConflict: 'user_id,date' }
        )
        .then(
          () => {},
          () => {}
        ),
    ]);
    uploadId = uploadResult.data && uploadResult.data.id ? uploadResult.data.id : undefined;
    if (uploadResult.error) {
      console.error('[restyle-photo] Failed to create draft upload:', uploadResult.error.message);
    }

    // Background: build the display variant + thumbhash off the render's
    // critical budget, then patch the row. (The 546 fix.)
    if (uploadId) {
      const displayUploadId = uploadId;
      scheduleBackground(
        buildDisplayVariant(imageUrl, userId, supabase).then(({ url, thumbhash }) => {
          if (!url && !thumbhash) return undefined;
          return supabase
            .from('uploads')
            .update({ image_url_display: url, thumbhash })
            .eq('id', displayUploadId);
        })
      );
    }

    // NO auto-upscale (2026-05-25) — HD upscale is on-demand only via
    // request-upscale, cached on first download. See UPSCALE_QUEUE_PLAN.md.

    // ── Job update + notification in parallel ─────────────────────────
    // Inbox subtext only (push copy is generated in send-push from
    // subtype='manual'). Clean descriptor — no legacy 'dream:' prefix.
    const notifBody = hint ? hint.slice(0, 150) : `${resolvedMediumKey} · ${resolvedVibeKey}`;

    // Notify ONLY if the user queued/left (loading screen "Queue This" sets
    // notify_on_complete); a foreground wait gets no ping. See migration 191.
    let notifyOnComplete = false;
    if (jobId) {
      const { data: jobRow } = await supabase
        .from('dream_jobs')
        .select('notify_on_complete')
        .eq('id', jobId)
        .maybeSingle();
      notifyOnComplete = !!(jobRow && jobRow.notify_on_complete);
    }

    await Promise.all([
      jobId
        ? supabase
            .from('dream_jobs')
            .update({
              status: 'done',
              result_image_url: imageUrl,
              result_prompt: finalPrompt,
              result_medium: resolvedMediumKey,
              result_vibe: resolvedVibeKey,
              upload_id: uploadId ?? null,
              completed_at: new Date().toISOString(),
            })
            .eq('id', jobId)
            .then(
              () => {},
              () => {}
            )
        : Promise.resolve(),
      // Only notify if the user queued/left — a foreground wait gets no ping.
      shouldSendCompletionNotification({ uploadId, jobId, notifyOnComplete })
        ? supabase
            .from('notifications')
            .insert({
              recipient_id: userId,
              actor_id: userId,
              type: 'dream_generated',
              subtype: 'manual',
              upload_id: uploadId,
              body: notifBody,
            })
            .then(
              () => {},
              // No longer swallowed: the inbox row is the guaranteed delivery
              // backstop (push rides on it via migration 196), so a failed
              // insert is a real silent-notification failure worth surfacing.
              (e: unknown) =>
                console.error(
                  '[restyle-photo] completion notification insert FAILED:',
                  (e as Error).message
                )
            )
        : Promise.resolve(),
    ]);

    lap('total');
    console.log(`[restyle-photo] ✅ Done in ${Date.now() - t0}ms for user ${userId}`);

    // QUEUE path: fire-and-forget dispatch, so WE mark dream_queue completed.
    if (isQueue && jobId && uploadId) {
      await completeQueueJob(supabase, jobId, uploadId);
    }

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        upload_id: uploadId ?? null,
        enhanced_prompt: finalPrompt,
        resolved_medium: resolvedMediumKey,
        resolved_vibe: resolvedVibeKey,
        job_id: jobId ?? null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const errMsg = (err as Error).message;
    console.error(`[restyle-photo] Error for user ${userId}:`, errMsg);

    // Log the failure
    insertGenerationLog(supabase, {
      user_id: userId,
      job_id: jobId ?? null,
      recipe_snapshot: asJsonbObject(vibeProfile),
      rolled_axes: { ...logAxes, timings, error: errMsg },
      enhanced_prompt: finalPrompt,
      model_used: pickedModel,
      cost_cents: 0,
      status: 'failed',
      sonnet_brief: sonnetBrief,
      sonnet_raw_response: sonnetRawResponse,
      vision_description: visionDescription,
      fallback_reasons: [...fallbackReasons, `generation_failed:${errMsg}`],
      replicate_prediction_id: replicatePredictionId,
    }).then(
      () => {},
      () => {}
    );

    // ── Classify the failure for refund + UI messaging ──
    const refundClass = classifyFailure(errMsg);
    const isNsfw = refundClass === 'nsfw';

    // Report to Sentry (no-op without SENTRY_EDGE_DSN; skip expected NSFW).
    if (!isNsfw) {
      await captureRenderError(err, {
        fn: 'restyle-photo',
        jobId,
        userId,
        stage: 'flux_render',
        model: typeof logAxes.model === 'string' ? logAxes.model : pickedModel,
        source: isQueue ? 'dlt' : 'sync',
        weight: 'light',
      });
    }

    // QUEUE path: WE own the dream_queue terminal state (retry/backoff or
    // dead-letter + refund + notify). The worker is fire-and-forget.
    if (isQueue && jobId) {
      await failQueueJob(supabase, jobId, userId, errMsg, isNsfw);
      return new Response(JSON.stringify({ error: errMsg, queued: true }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Server-side refund — only fires when we have a jobId. Without a jobId,
    // refund_sparkles can't enforce idempotency, so fall back to legacy NSFW path.
    // QUEUE path: do NOT refund here — the worker owns retry/dead-letter and
    // refunds once exhausted (refunding on a transient fail it will retry hands
    // the user a free dream).
    let sparkleRefunded = false;
    if (jobId && !isQueue) {
      try {
        const { data: refunded } = await supabase.rpc('refund_sparkles', {
          p_user_id: userId,
          p_amount: 1,
          p_reason: `refund:hard_fail:${refundClass}`,
          p_reference_id: jobId,
        });
        sparkleRefunded = true;
        console.log(
          `[restyle-photo] Refund applied (class=${refundClass}, prior=${refunded === false})`
        );
      } catch (refundErr) {
        console.error('[restyle-photo] Refund FAILED:', (refundErr as Error).message);
      }
    } else if (isNsfw && !isQueue) {
      try {
        await supabase.rpc('grant_sparkles', {
          p_user_id: userId,
          p_amount: 1,
          p_reason: 'nsfw_refund',
        });
        sparkleRefunded = true;
      } catch (refundErr) {
        console.error('[restyle-photo] Legacy NSFW refund FAILED:', (refundErr as Error).message);
      }
    }

    // Update dream_jobs status (best-effort). Skip for the QUEUE path — a
    // transient attempt the worker will retry shouldn't fail the client or
    // spam the inbox; the worker owns the final dead-letter state + notify.
    if (jobId && !isQueue) {
      try {
        await supabase
          .from('dream_jobs')
          .update({
            status: isNsfw ? 'nsfw' : 'failed',
            error: errMsg,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);
      } catch {
        /* non-critical */
      }

      // Phase 4: write a `dream_failed` notification
      try {
        await supabase.from('notifications').insert(dreamFailedNotification(jobId, userId, isNsfw));
      } catch (notifyErr) {
        // No longer silent: the user's only signal their dream failed + was
        // refunded if they left the loading screen.
        console.error(
          '[restyle-photo] dream_failed notification insert FAILED:',
          (notifyErr as Error).message
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: errMsg,
        hard_fail: true,
        nsfw: isNsfw,
        sparkle_refunded: sparkleRefunded,
        refund_reason: refundClass,
        job_id: jobId ?? null,
      }),
      { status: 500 }
    );
  }
}

// Run a best-effort task in the background without blocking the response, off
// the render's critical 2s/150MB budget (the 546 fix — used to defer the
// CPU-heavy display-variant build). The top-level wrapper only keeps the
// isolate alive for handleRequest itself, so re-register the detached promise.
function scheduleBackground(p: Promise<unknown>): void {
  const er = (globalThis as { EdgeRuntime?: { waitUntil?: (q: Promise<unknown>) => void } })
    .EdgeRuntime;
  if (er && er.waitUntil) er.waitUntil(p.catch(() => {}));
}

// Durability wrapper: register the in-flight request with EdgeRuntime.waitUntil
// so the isolate keeps running the render→persist→notify work even if the
// client disconnects (app backgrounded/killed after "Queue This"). Connected
// client gets the response via `return task`; disconnected one's response is
// discarded while the work finishes and fires the completion notification.
// Same promise for waitUntil + return — no double-run. handleRequest never
// rejects (outer try/catch always returns a Response).
Deno.serve((req) => {
  const task = handleRequest(req);
  const edgeRuntime = (
    globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }
  ).EdgeRuntime;
  if (edgeRuntime && edgeRuntime.waitUntil) {
    edgeRuntime.waitUntil(task.catch(() => {}));
  }
  // x-dream-queue NO LONGER detaches (2026-06-17): the platform stopped honoring
  // EdgeRuntime.waitUntil for background work, so a detached render was silently
  // dropped after the 202 → the job dead-lettered + false-refunded. Render
  // SYNCHRONOUSLY (the worker holds the connection, keeping the isolate alive,
  // like the nightly dispatch); handleRequest still owns dream_queue terminal
  // state. See generate-dream's wrapper + _shared/dualSwapDispatch's create.ts.
  return task;
});

function classifyFailure(errMsg: string): string {
  const m = errMsg.toLowerCase();
  if (m.startsWith('nsfw_content') || m.includes('nsfw') || m.includes('safety')) return 'nsfw';
  if (m.includes('flux') && (m.includes('failed') || m.includes('timed out'))) return 'flux_gen';
  if (m.includes('replicate') && (m.includes('failed') || m.includes('5'))) return 'flux_gen';
  if (m.includes('persiststorage') || m.includes('storage upload')) return 'storage_upload';
  if (m.includes('upload') && m.includes('failed')) return 'storage_upload';
  if (m.includes('uploads insert') || m.includes('db insert')) return 'db_insert';
  if (m.includes('face swap') || m.includes('face_swap')) return 'face_swap';
  if (m.includes('rate limit') || m.includes('rate-limit')) return 'rate_limit';
  if (m.includes('timed out') || m.includes('deadline')) return 'timeout';
  return 'unknown';
}
