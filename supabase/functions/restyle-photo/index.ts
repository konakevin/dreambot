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
import { pickModel } from '../_shared/modelPicker.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { persistToStorage } from '../_shared/persistence.ts';
import { callSonnet } from '../_shared/llm.ts';
import { applyVibeGenderModifier } from '../_shared/promptCompiler.ts';
import { insertGenerationLog } from '../_shared/logging.ts';

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

Deno.serve(async (req) => {
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

  // ── Auth ────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
    {
      global: { headers: { Authorization: authHeader } },
    }
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
  const userId = user.id;

  // Service role client for database operations (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // ── Parse request body ──────────────────────────────────────────────────
  let body: RestyleRequest;
  try {
    body = await req.json();
    console.log('[restyle-photo] BODY KEYS:', Object.keys(body), 'force_model:', body.force_model);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const {
    mode,
    input_image,
    medium_key,
    vibe_key,
    hint,
    force_model,
    job_id: jobId,
    vibe_profile: vibeProfile,
  } = body;

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
  if (jobId) {
    try {
      await supabase.from('dream_jobs').insert({
        id: jobId,
        user_id: userId,
        status: 'processing',
      });
    } catch {
      /* non-critical — job tracking is best-effort */
    }
  }

  // ── Observability (Phase 1) ─────────────────────────────────────────────
  let sonnetBrief: string | null = null;
  let sonnetRawResponse: string | null = null;
  let visionDescription: string | null = null;
  let replicatePredictionId: string | null = null;
  const fallbackReasons: string[] = [];

  // ── Resolve medium + vibe from DB ───────────────────────────────────────
  const medium = await resolveMediumFromDb(
    medium_key,
    vibeProfile && vibeProfile.art_styles ? vibeProfile.art_styles : undefined
  );
  const vibe = await resolveVibeFromDb(
    vibe_key,
    vibeProfile && vibeProfile.aesthetics ? vibeProfile.aesthetics : undefined
  );
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

  const config = getPhotoRestyleConfig(medium.key);
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
  const pickedModel = force_model || autoPicked.model;
  logAxes.model = pickedModel;

  console.log(
    `[restyle-photo] User ${userId}, mode=${effectiveMode}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // ── Generate image via Replicate ────────────────────────────────────────
  try {
    console.log(`[restyle-photo] ⏱ Starting image generation (model: ${pickedModel})...`);
    const genResult = await generateImage(
      effectiveMode,
      finalPrompt,
      effectiveInputImage,
      REPLICATE_TOKEN,
      pickedModel
    );
    replicatePredictionId = genResult.predictionId;
    lap('image-gen');
    console.log(
      `[restyle-photo] ⏱ Image generation complete (prediction: ${genResult.predictionId})`
    );

    // ── Persist to Storage + log in parallel ────────────────────────────
    timings.total = Date.now() - t0;
    const [persistedUrl] = await Promise.all([
      persistToStorage(genResult.url, userId, supabase),
      insertGenerationLog(supabase, {
        user_id: userId,
        recipe_snapshot: (vibeProfile as unknown as Record<string, unknown>) ?? {},
        rolled_axes: { ...logAxes, timings },
        enhanced_prompt: finalPrompt,
        model_used: pickedModel,
        cost_cents: 3,
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

    const [uploadResult] = await Promise.all([
      supabase
        .from('uploads')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          caption,
          ai_prompt: finalPrompt,
          ai_concept: null,
          dream_medium: resolvedMediumKey,
          dream_vibe: resolvedVibeKey,
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

    // ── Job update + notification in parallel ─────────────────────────
    const notifBody = hint
      ? `dream:Your dream is ready: ${hint.slice(0, 150)}`
      : `dream:Your dream is ready: ${resolvedMediumKey}/${resolvedVibeKey}`;

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
      uploadId && jobId
        ? supabase
            .from('notifications')
            .insert({
              recipient_id: userId,
              actor_id: userId,
              type: 'dream_generated',
              upload_id: uploadId,
              body: notifBody,
            })
            .then(
              () => {},
              () => {}
            )
        : Promise.resolve(),
    ]);

    lap('total');
    console.log(`[restyle-photo] ✅ Done in ${Date.now() - t0}ms for user ${userId}`);

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
      recipe_snapshot: (vibeProfile as unknown as Record<string, unknown>) ?? {},
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

    // Update dream job on failure
    if (jobId) {
      const isNsfw = errMsg.includes('NSFW') || errMsg.includes('safety');
      try {
        await supabase
          .from('dream_jobs')
          .update({
            status: isNsfw ? 'nsfw' : 'failed',
            error: errMsg,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);

        // Refund sparkle server-side for NSFW
        if (isNsfw) {
          await supabase.rpc('grant_sparkles', {
            p_user_id: userId,
            p_amount: 1,
            p_reason: 'nsfw_refund',
          });
        }
      } catch {
        /* non-critical */
      }
    }

    return new Response(JSON.stringify({ error: errMsg }), { status: 500 });
  }
});
