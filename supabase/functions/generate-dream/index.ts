/**
 * Edge Function: generate-dream — V4 pipeline only.
 *
 * Handles user-initiated dream generation via medium + vibe directives:
 *   - Self-insert (cast + scene expansion + chaos + V4 compiler)
 *   - Text directive / surprise (scene expansion + chaos + V4 compiler)
 *   - Style transfer / DLT (source style + user prompt + compiler)
 *   - Photo reimagine (vision describe + Sonnet rewrite + Flux Dev)
 *   - Photo restyle (Kontext transform — moves to restyle-photo in Phase 3.4)
 *
 * Nightly pipeline moved to nightly-dreams Edge Function (Phase 3.3).
 * Legacy recipe/vibe-profile/haiku-brief paths deleted (Phase 3.2).
 *
 * POST /functions/v1/generate-dream
 * Authorization: Bearer <user JWT>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import { buildReimaginePrompt } from '../_shared/photoPrompts.ts';
import { describeWithVision, VISION_PROMPTS } from '../_shared/vision.ts';
import { resolveMediumFromDb, resolveVibeFromDb } from '../_shared/dreamStyles.ts';
import { detectSelfInsert } from '../_shared/selfInsertDetector.ts';
import { resolveCastForPrompt } from '../_shared/castResolver.ts';
import { expandScene } from '../_shared/sceneExpander.ts';
import { rollChaos, applyChaos } from '../_shared/chaosLayer.ts';
import {
  compilePrompt,
  postProcessPrompt,
  sanitizeUserPrompt,
  deriveFocalAnchor,
} from '../_shared/promptCompiler.ts';
// Shared post-processing (extracted Phase 3.1)
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { faceSwap } from '../_shared/faceSwap.ts';
import { persistToStorage } from '../_shared/persistence.ts';
import { callSonnet } from '../_shared/llm.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { insertGenerationLog } from '../_shared/logging.ts';

interface RequestBody {
  /** Which Flux model to use */
  mode: 'flux-dev' | 'flux-kontext';
  /** Pre-built prompt (raw, no LLM enhancement) */
  prompt?: string;
  /** Optional user hint to weave into the dream */
  hint?: string;
  /** Base64 data URL for flux-kontext (photo-to-image) */
  input_image?: string;
  /** Photo style: restyle (keep likeness) or reimagine (new scene) */
  photo_style?: 'restyle' | 'reimagine';
  /** Vibe Profile v2 — provides dream_cast for self-insert detection */
  vibe_profile?: VibeProfile;
  /** V4 engine — curated medium key (e.g., 'watercolor', 'pixels') */
  medium_key?: string;
  /** V4 engine — curated vibe key (e.g., 'cinematic', 'epic') */
  vibe_key?: string;
  /** Test mode: override the picked Replicate model */
  force_model?: string;
  /** Client-generated job ID for queue tracking */
  job_id?: string;
  /** Style transfer: original post's ai_prompt used as style template for DLT */
  style_prompt?: string;
}

Deno.serve(async (req) => {
  // CORS preflight
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

  // Create a user-scoped client from the request's Authorization header.
  // The Supabase gateway already validates the JWT before invoking the function,
  // so we can trust the token and use it to identify the user.
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
      '[generate-dream] Auth failed:',
      authError?.message,
      'header:',
      authHeader.slice(0, 30)
    );
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const userId = user.id;

  // Service role client for database operations (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Parse request body
  let body: RequestBody;
  try {
    body = await req.json();
    console.log('[generate-dream] BODY KEYS:', Object.keys(body), 'force_model:', body.force_model);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const {
    mode,
    vibe_profile,
    medium_key,
    vibe_key,
    prompt: rawPrompt,
    hint,
    input_image,
    photo_style = 'restyle',
    force_model,
    job_id: jobId,
    style_prompt,
  } = body;

  if (!mode || !['flux-dev', 'flux-kontext'].includes(mode)) {
    return new Response(
      JSON.stringify({ error: 'Invalid mode. Must be "flux-dev" or "flux-kontext"' }),
      { status: 400 }
    );
  }

  if (mode === 'flux-kontext' && !input_image) {
    return new Response(JSON.stringify({ error: 'flux-kontext mode requires input_image' }), {
      status: 400,
    });
  }

  if (!medium_key && !vibe_key) {
    return new Response(JSON.stringify({ error: 'Must provide medium_key or vibe_key' }), {
      status: 400,
    });
  }

  // ── Timing ─────────────────────────────────────────────────────────────────
  const t0 = Date.now();
  const timings: Record<string, number> = {};
  let lastLap = t0;
  const lap = (label: string) => {
    const now = Date.now();
    const stepMs = now - lastLap;
    const totalMs = now - t0;
    timings[label] = stepMs;
    console.log(`[generate-dream] ⏱ ${label}: ${stepMs}ms (total: ${totalMs}ms)`);
    lastLap = now;
  };

  // Daily generation cap removed 2026-04-16 — sparkles are the sole limiter.
  // Bit us many times (test batches, QA flows, debugging loops). We still
  // read the budget row to keep `images_generated` counting correctly for
  // analytics, but nothing gates on it anymore.
  const today = new Date().toISOString().slice(0, 10);
  const { data: budgetRow } = await supabase
    .from('ai_generation_budget')
    .select('images_generated')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  lap('rate-limit-check');
  const todayCount = budgetRow?.images_generated ?? 0;

  // ── Create dream job (queue tracking) ──────────────────────────────────
  if (jobId) {
    try {
      await supabase.from('dream_jobs').insert({
        id: jobId,
        user_id: userId,
        status: 'processing',
      });
    } catch (err) {
      console.warn('[generate-dream] Job insert failed (non-critical):', (err as Error).message);
    }
  }

  // ── Build prompt ──────────────────────────────────────────────────────────
  let finalPrompt: string;

  let logAxes: Record<string, unknown> = {};
  let conceptJson: Record<string, unknown> | null = null;
  let photoOverrideMode: string | null = null;
  let resolvedMediumKey: string | undefined;
  let resolvedVibeKey: string | undefined;
  let faceSwapSource: string | undefined; // original photo for face swap after generation

  // ── Observability (Phase 1 of V4 hardening) ─────────────────────────────────
  // Capture the full LLM exchange + fallback audit trail so every generation
  // can be replayed from ai_generation_log without guesswork. Every call site
  // that invokes Sonnet, Haiku vision, or triggers a fallback pushes here.
  let sonnetBrief: string | null = null;
  let sonnetRawResponse: string | null = null;
  let visionDescription: string | null = null;
  let replicatePredictionId: string | null = null;
  const fallbackReasons: string[] = [];

  console.log(
    '[generate-dream] RAW BODY:',
    JSON.stringify({
      medium_key,
      vibe_key,
      photo_style,
      has_input_image: !!input_image,
      hint: hint?.slice(0, 50),
      mode,
    })
  );

  // ── V4 ENGINE: Medium + Vibe directive-based generation ──
  // Nightly path moved to nightly-dreams Edge Function (Phase 3.3).
  // Legacy recipe/vibe-profile paths deleted (Phase 3.2).
  if (medium_key || vibe_key) {
    // ── V2 ENGINE: Medium + Vibe directive-based generation ──────────
    const vibeProfile = vibe_profile as VibeProfile | undefined;

    // Resolve medium and vibe to real curated entries — never store placeholders
    const medium = await resolveMediumFromDb(medium_key, vibeProfile?.art_styles);
    const vibe = await resolveVibeFromDb(vibe_key, vibeProfile?.aesthetics);

    resolvedMediumKey = medium.key;
    resolvedVibeKey = vibe.key;

    const isPhoto = !!input_image;
    console.log(
      '[generate-dream] V2 ENGINE | medium:',
      medium.key,
      '| vibe:',
      vibe.key,
      '| isPhoto:',
      isPhoto,
      '| photo_style:',
      photo_style,
      '| has_input_image:',
      !!input_image
    );

    if (isPhoto && photo_style === 'reimagine') {
      // ── REIMAGINE (solo): vision describe → medium template or generic brief → flux-dev ──
      console.log('[generate-dream] ⏱ REIMAGINE: starting vision...');
      try {
        const photoDescription = await describeWithVision(
          input_image!,
          VISION_PROMPTS.photoSubject,
          REPLICATE_TOKEN,
          100
        );
        visionDescription = photoDescription;
        lap('reimagine-vision');
        console.log('[generate-dream] ⏱ Vision done:', photoDescription.slice(0, 120));

        const userHint = hint ?? '';
        const reimagineTemplate = buildReimaginePrompt(
          medium.key,
          photoDescription,
          userHint,
          vibe.directive!
        );

        if (reimagineTemplate) {
          finalPrompt = await enhanceViaHaiku(
            reimagineTemplate,
            reimagineTemplate,
            ANTHROPIC_KEY,
            150
          );
        } else {
          const styleRef = style_prompt
            ? `\n- Reference style (match this aesthetic): ${style_prompt.slice(0, 300)}`
            : '';
          const genericBrief = `Write a Flux AI prompt (50-70 words, comma-separated phrases) for an image:
- Start with: "${medium.fluxFragment}"
- Subject from photo: ${photoDescription}
- The user wants: ${userHint || 'a creative reimagining'}
- Render in ${medium.key} style
- Mood: ${vibe.directive!.slice(0, 200)}${styleRef}
- Framing: waist-up to three-quarter body. The person's face must be clearly visible and well-lit. Show the person IN the scene, interacting with elements around them. The environment should be visible — don't crop it out.
- DO NOT invent your own scenario — use the user's request EXACTLY
Output ONLY the prompt.`;
          finalPrompt = await enhanceViaHaiku(genericBrief, genericBrief, ANTHROPIC_KEY, 150);
        }

        photoOverrideMode = 'flux-dev';
        // No face swap — reimagine produces a likeness-based caricature, not an exact photo
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-reimagine',
        };
        console.log('[generate-dream] Reimagine prompt:', finalPrompt.slice(0, 150));
      } catch (err) {
        console.error('[generate-dream] REIMAGINE FAILED:', (err as Error).message);
        fallbackReasons.push(`reimagine_failed:${(err as Error).message}`);
        // Fallback: use the hint as a raw prompt with medium styling
        finalPrompt = `${medium.fluxFragment}, ${hint ?? 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-reimagine-fallback',
          error: (err as Error).message,
        };
      }
      lap('reimagine-done');
    } else if (isPhoto) {
      // Photo restyle moved to restyle-photo Edge Function (Phase 3.4).
      // Client should call restyle-photo directly for photo + medium transforms.
      return new Response(
        JSON.stringify({
          error:
            'Photo restyle moved to restyle-photo endpoint. Use restyle-photo for photo transforms.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // ── TEXT PATH ──
      const userSubject = rawPrompt ?? hint ?? '';

      // ── V2 SELF-INSERT DETECTION (using new detector) ──
      const selfCast = !isPhoto
        ? vibeProfile?.dream_cast?.find(
            (m: DreamCastMember) => m.role === 'self' && m.thumb_url && m.description
          )
        : undefined;
      const selfInsertResult = userSubject
        ? detectSelfInsert(userSubject)
        : { isSelfInsert: false, cleanedPrompt: '' };
      const mentionsSelf = selfInsertResult.isSelfInsert && selfCast;

      if (mentionsSelf && userSubject) {
        // ── SELF-INSERT: cast + scene expansion + chaos + compiler ──
        const cleanedPrompt = sanitizeUserPrompt(selfInsertResult.cleanedPrompt);
        const resolvedCast = resolveCastForPrompt([selfCast as DreamCastMember], {
          characterRenderMode: medium.characterRenderMode,
          key: medium.key,
        });
        const isFaceSwapEligible = medium.faceSwaps && medium.characterRenderMode === 'natural';

        console.log(
          `[generate-dream] 🎭 SELF-INSERT: ${medium.characterRenderMode} / faceSwap=${isFaceSwapEligible}`
        );

        // Scene expansion + chaos
        const expanded = expandScene({
          userPrompt: cleanedPrompt,
          userId,
          mediumKey: medium.key,
          vibeKey: vibe.key,
          hasCharacter: true,
        });
        const chaosProfile = rollChaos(
          Array.from(userId + cleanedPrompt).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: cleanedPrompt,
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: isFaceSwapEligible,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);
        const focalAnchor = deriveFocalAnchor(resolvedCast, { userPrompt: cleanedPrompt });

        const compiled = compilePrompt({
          inputType: 'self_insert',
          medium: {
            key: medium.key,
            directive: medium.directive ?? '',
            fluxFragment: medium.fluxFragment ?? medium.key,
            characterRenderMode: medium.characterRenderMode,
            faceSwaps: medium.faceSwaps,
          },
          vibe: { key: vibe.key, directive: vibe.directive ?? '' },
          scene: {
            userPrompt: cleanedPrompt || undefined,
            sceneExpansion: finalExpansion || undefined,
            styleReference: style_prompt || undefined,
          },
          cast: resolvedCast,
          composition: {
            type: 'character',
            faceSwapEligible: isFaceSwapEligible,
            shotDirection: expanded.suggestedCamera,
            focalAnchor,
          },
          profile: { avoid: vibeProfile?.avoid },
        });

        try {
          const sonnet = await callSonnet(compiled.sonnetBrief, ANTHROPIC_KEY, compiled.maxTokens);
          sonnetBrief = sonnet.brief;
          sonnetRawResponse = sonnet.rawResponse;
          if (sonnet.text.length < 10) throw new Error('too short');
          finalPrompt = postProcessPrompt(sonnet.text, compiled.postProcess);

          if (compiled.faceSwapSource) {
            faceSwapSource = compiled.faceSwapSource;
          }
          logAxes = {
            medium: medium.key,
            vibe: vibe.key,
            engine: 'v2-compiler-self-insert',
            faceSwap: isFaceSwapEligible,
            chaosIntensity: chaosProfile.intensity,
          };
          console.log('[generate-dream] V2 compiler (self-insert):', finalPrompt.slice(0, 150));
          lap('self-insert-done');
        } catch (err) {
          console.error('[generate-dream] SELF-INSERT FAILED:', (err as Error).message);
          fallbackReasons.push(`self_insert_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
          logAxes = {
            medium: medium.key,
            vibe: vibe.key,
            engine: 'v2-compiler-self-insert-fallback',
            error: (err as Error).message,
          };
          lap('self-insert-done');
        }
      } else {
        // ── V2 COMPILER PATHS: style transfer, text directive, surprise ──
        const sanitizedPrompt = userSubject ? sanitizeUserPrompt(userSubject) : '';
        const inputType = style_prompt
          ? 'style_transfer'
          : sanitizedPrompt
            ? 'text_directive'
            : 'text_directive'; // surprise = text_directive with no prompt

        // Scene expansion (fills gaps in thin user prompts with cinematic detail)
        const expanded = sanitizedPrompt
          ? expandScene({
              userPrompt: sanitizedPrompt,
              userId,
              mediumKey: medium.key,
              vibeKey: vibe.key,
              hasCharacter: false, // no cast in these paths
            })
          : {
              expansion: '',
              suggestedCamera: 'environmental portrait, eye-level, 50mm lens, deep perspective',
              usedPhrases: [],
            };

        // Chaos layer (perception distortion)
        const chaosProfile = rollChaos(
          Array.from(userId + (sanitizedPrompt || medium.key)).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: sanitizedPrompt,
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: false,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);

        // Focal anchor
        const focalAnchor = deriveFocalAnchor([], {
          userPrompt: sanitizedPrompt,
          styleReference: style_prompt,
          objectDirective: undefined,
        });

        // Compile prompt
        const compiled = compilePrompt({
          inputType: inputType as 'text_directive' | 'style_transfer',
          medium: {
            key: medium.key,
            directive: medium.directive ?? '',
            fluxFragment: medium.fluxFragment ?? medium.key,
            characterRenderMode: medium.characterRenderMode,
            faceSwaps: medium.faceSwaps,
          },
          vibe: { key: vibe.key, directive: vibe.directive ?? '' },
          scene: {
            userPrompt: sanitizedPrompt || undefined,
            sceneExpansion: finalExpansion || undefined,
            styleReference: style_prompt || undefined,
          },
          cast: [],
          composition: {
            type: 'pure_scene',
            faceSwapEligible: false,
            shotDirection: expanded.suggestedCamera,
            focalAnchor,
          },
          profile: { avoid: vibeProfile?.avoid },
        });

        try {
          const sonnet = await callSonnet(compiled.sonnetBrief, ANTHROPIC_KEY, compiled.maxTokens);
          sonnetBrief = sonnet.brief;
          sonnetRawResponse = sonnet.rawResponse;
          if (sonnet.text.length < 10) throw new Error('too short');
          finalPrompt = postProcessPrompt(sonnet.text, compiled.postProcess);
        } catch (err) {
          fallbackReasons.push(`${inputType}_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
        }

        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: `v2-compiler-${inputType}`,
          chaosIntensity: chaosProfile.intensity,
          chaosInjections: chaosProfile.injections.length,
        };
        console.log(`[generate-dream] V2 compiler (${inputType}):`, finalPrompt.slice(0, 150));
        lap('v2-compiler-done');
      }
    }
    lap('v2-engine-done');
  } else {
    return new Response(JSON.stringify({ error: 'Must provide medium_key or vibe_key' }), {
      status: 400,
    });
  }

  // Legacy branches (rawPrompt, haiku_brief, vibe_profile, recipe) deleted Phase 3.2.
  // Nightly path moved to nightly-dreams Edge Function Phase 3.3.

  const effectiveMode = photoOverrideMode ?? mode;
  const effectiveInputImage = photoOverrideMode ? undefined : input_image;

  finalPrompt = sanitizePrompt(finalPrompt);

  const autoPicked = await pickModel(effectiveMode, finalPrompt, resolvedMediumKey);
  const pickedModel = force_model || autoPicked.model;
  logAxes.model = pickedModel;
  console.log(
    `[generate-dream] User ${userId}, mode=${effectiveMode}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // ── Generate image via Replicate ──────────────────────────────────────────
  try {
    console.log(`[generate-dream] ⏱ Starting image generation (model: ${pickedModel})...`);
    const genResult = await generateImage(
      effectiveMode,
      finalPrompt,
      effectiveInputImage,
      REPLICATE_TOKEN,
      pickedModel
    );
    let tempUrl = genResult.url;
    replicatePredictionId = genResult.predictionId;
    lap('image-gen');
    console.log(
      `[generate-dream] ⏱ Image generation complete (prediction: ${genResult.predictionId})`
    );

    // Face swap: paste original face onto generated image
    if (faceSwapSource && tempUrl) {
      try {
        let sourceUrl: string;
        let swapFileName: string | null = null;
        if (faceSwapSource.startsWith('http')) {
          // Already a public URL (e.g., cast thumb_url)
          sourceUrl = faceSwapSource;
          lap('face-swap-upload');
        } else {
          // Base64 data URL — upload to temp storage first
          console.log('[generate-dream] ⏱ Starting face swap upload...');
          const base64Data = faceSwapSource.replace(/^data:image\/\w+;base64,/, '');
          const swapBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          swapFileName = `temp/${userId}/faceswap-${Date.now()}.jpg`;
          await supabase.storage
            .from('uploads')
            .upload(swapFileName, swapBytes, { contentType: 'image/jpeg', upsert: true });
          const { data: swapUrlData } = supabase.storage.from('uploads').getPublicUrl(swapFileName);
          sourceUrl = swapUrlData.publicUrl;
          lap('face-swap-upload');
        }
        console.log('[generate-dream] ⏱ Face swap upload done, starting swap...');

        tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN);

        if (swapFileName) {
          supabase.storage
            .from('uploads')
            .remove([swapFileName])
            .catch(() => {});
        }
        lap('face-swap-model');
        console.log('[generate-dream] ⏱ Face swap complete');
        logAxes.faceSwapResult = 'success';
      } catch (err) {
        console.warn(
          '[generate-dream] Face swap failed, using unswapped image:',
          (err as Error).message
        );
        fallbackReasons.push(`face_swap_failed:${(err as Error).message}`);
        logAxes.faceSwapResult = 'failed';
        logAxes.faceSwapError = (err as Error).message;
      }
    }

    let imageUrl = tempUrl;

    // Persist to Storage + log in parallel (log doesn't need the permanent URL)
    timings.total = Date.now() - t0;
    const [persistedUrl] = await Promise.all([
      persistToStorage(tempUrl, userId, supabase),
      insertGenerationLog(supabase, {
        user_id: userId,
        recipe_snapshot: (vibe_profile as unknown as Record<string, unknown>) ?? {},
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
    imageUrl = persistedUrl;
    lap('persist-done');

    // Draft upload + budget upsert in parallel (both need imageUrl but not each other)
    let uploadId: string | undefined;
    const caption = finalPrompt.length > 200 ? finalPrompt.slice(0, 197) + '...' : finalPrompt;
    const [uploadResult] = await Promise.all([
      supabase
        .from('uploads')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          caption,
          ai_prompt: finalPrompt,
          ai_concept: conceptJson,
          dream_medium: resolvedMediumKey ?? null,
          dream_vibe: resolvedVibeKey ?? null,
          is_public: false,
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
    uploadId = uploadResult.data?.id;
    if (uploadResult.error) {
      console.error('[generate-dream] Failed to create draft upload:', uploadResult.error.message);
    }

    // Job update + notification in parallel (both need uploadId but not each other)
    const notifBody = hint
      ? `dream:Your dream is ready: ${hint.slice(0, 150)}`
      : `dream:Your dream is ready: ${resolvedMediumKey ?? 'surprise'}/${resolvedVibeKey ?? 'surprise'}`;

    await Promise.all([
      jobId
        ? supabase
            .from('dream_jobs')
            .update({
              status: 'done',
              result_image_url: imageUrl,
              result_prompt: finalPrompt,
              result_medium: resolvedMediumKey ?? null,
              result_vibe: resolvedVibeKey ?? null,
              upload_id: uploadId ?? null,
              completed_at: new Date().toISOString(),
            })
            .eq('id', jobId)
            .then(
              () => {},
              () => {}
            )
        : Promise.resolve(),
      // Only notify if queued (jobId present) — inline generation doesn't need a notification
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
    console.log(`[generate-dream] ✅ Done in ${Date.now() - t0}ms for user ${userId}`);

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        prompt_used: finalPrompt,
        ai_concept: conceptJson,
        dream_mode: logAxes.dreamMode ?? mode,
        archetype: logAxes.archetype ?? null,
        model: logAxes.model ?? null,
        resolved_medium: resolvedMediumKey ?? null,
        resolved_vibe: resolvedVibeKey ?? null,
        job_id: jobId ?? null,
        upload_id: uploadId ?? null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const errMsg = (err as Error).message;
    console.error(`[generate-dream] Error for user ${userId}:`, errMsg);

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

        // Refund sparkle server-side for NSFW (client may not receive the error)
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

// ── Helpers ──────────────────────────────────────────────────────────────────

// haikuJson deleted Phase 3.2 — was only used by legacy recipe path.

async function enhanceViaHaiku(
  brief: string,
  fallback: string,
  anthropicKey: string | undefined,
  maxTokens: number = 150
): Promise<string> {
  if (!anthropicKey) return fallback;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: brief }],
      }),
    });
    if (!res.ok) throw new Error(`Haiku ${res.status}`);
    const data = await res.json();
    const text = data.content?.[0]?.text?.trim() ?? '';
    return text.length >= 10 ? text : fallback;
  } catch (err) {
    console.warn('[generate-dream] Haiku fallback:', (err as Error).message);
    return fallback;
  }
}

// Sonnet, pickModel, generateImage, persistToStorage, sanitizePrompt,
// faceSwap — all moved to _shared/ in Phase 3.1. Imports at the top of
// this file.

// CompanionMatch + detectCompanionRequest deleted Phase 3.2 — unused in V4 paths.
