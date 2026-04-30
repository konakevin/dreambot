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
import { generateSceneDescription } from '../_shared/sceneDescription.ts';
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
import { faceSwap, dualFaceSwap } from '../_shared/faceSwap.ts';
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
  /** Photo style:
   *   - 'reimagine' — re-render the photo in the medium, preserving pose/composition. Face-swap applied.
   *   - 'new_scene' — invent a fresh scene, put the person in it with real face preserved via swap.
   *   - 'restyle' (default) — legacy value that falls through to an error (client should use restyle-photo endpoint for Kontext restyle).
   */
  photo_style?: 'reimagine' | 'new_scene' | 'restyle';
  /** Vibe Profile v2 — provides dream_cast for self-insert detection */
  vibe_profile?: VibeProfile;
  /** V4 engine — curated medium key (e.g., 'watercolor', 'pixels') */
  medium_key?: string;
  /** V4 engine — curated vibe key (e.g., 'cinematic', 'epic') */
  vibe_key?: string;
  /** Test mode: override the picked Replicate model */
  force_model?: string;
  /** Test mode: override which cast member to use for self-insert ('self', 'plus_one', 'pet') */
  force_cast_role?: string;
  /** Client-generated job ID for queue tracking */
  job_id?: string;
  /** Style transfer: original post's ai_prompt used as style template for DLT */
  style_prompt?: string;
  /** Pre-classified photo subject description (from classify-photo endpoint).
   * When provided alongside subject_type, skips the internal vision call. */
  subject_description?: string;
  /** Pre-classified photo subject type. Determines routing:
   *   - 'person'  → face-swap path (ephemeral cast from description, face from photo)
   *   - 'group'   → description path: Flux renders the described people in scene, no face-swap
   *   - 'animal'  → description path: creature literally in the scene, no face-swap
   *   - 'object'  → description path: object literally in the scene, no face-swap
   *   - 'scenery' → description path: scene built inspired by the place, no face-swap
   */
  subject_type?: 'person' | 'group' | 'animal' | 'object' | 'scenery';
  /** Optional user-supplied scene description. If absent, Haiku auto-generates from the final prompt. */
  description?: string;
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
    force_cast_role,
    job_id: jobId,
    style_prompt,
    subject_description,
    subject_type,
  } = body;

  // Optional user-supplied description for this dream. If absent, a Haiku
  // call generates one from finalPrompt before insert.
  const userDescription =
    typeof body.description === 'string' ? body.description.trim() || null : null;

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
  let faceSwapSources: Array<{ role: string; sourceUrl: string }> | undefined;

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

    if (isPhoto && photo_style === 'new_scene' && subject_type && subject_type !== 'person') {
      // ── DESCRIPTION ROUTE: animal / object / scenery photo subjects.
      // The uploaded subject is literally included in the invented scene.
      // No face-swap, no character block — subject is the scene's focal element.
      console.log(`[generate-dream] ⏱ NEW SCENE (${subject_type}): description route`);
      try {
        const subjectDesc = subject_description ?? hint ?? '';
        visionDescription = subjectDesc;
        // Compose subject into the user prompt so Sonnet treats it as a directive.
        // Example: "A fluffy golden retriever with floppy ears sitting on grass"
        const userSubject = subjectDesc;

        const expanded = expandScene({
          userPrompt: userSubject,
          userId,
          mediumKey: medium.key,
          vibeKey: vibe.key,
          hasCharacter: false,
        });
        const chaosProfile = rollChaos(
          Array.from(userId + userSubject).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: userSubject,
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: false,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);

        const compiled = compilePrompt({
          inputType: 'text_directive',
          medium: {
            key: medium.key,
            directive: medium.directive ?? '',
            fluxFragment: medium.fluxFragment ?? medium.key,
            characterRenderMode: medium.characterRenderMode,
            faceSwaps: medium.faceSwaps,
          },
          vibe: { key: vibe.key, directive: vibe.directive ?? '' },
          scene: {
            userPrompt: userSubject || undefined,
            sceneExpansion: finalExpansion || undefined,
            styleReference: style_prompt || undefined,
          },
          cast: [],
          composition: {
            type: 'pure_scene',
            faceSwapEligible: false,
            shotDirection: expanded.suggestedCamera,
            focalAnchor: userSubject.slice(0, 80),
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
          console.error(
            '[generate-dream] DESCRIPTION ROUTE Sonnet failed:',
            (err as Error).message
          );
          fallbackReasons.push(`description_route_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
        }

        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-description',
          subjectType: subject_type,
          faceSwap: false,
        };
        console.log('[generate-dream] Description route prompt:', finalPrompt.slice(0, 150));
      } catch (err) {
        console.error('[generate-dream] DESCRIPTION ROUTE FAILED:', (err as Error).message);
        fallbackReasons.push(`description_route_failed:${(err as Error).message}`);
        finalPrompt = `${medium.fluxFragment}, ${subject_description ?? 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-description-fallback',
          error: (err as Error).message,
        };
      }
      lap('description-route-done');
    } else if (isPhoto && photo_style === 'new_scene') {
      // ── NEW SCENE (person): vision describes person → ephemeral cast →
      // compilePrompt self-insert path → Flux invents scene → face-swap pastes
      // the real face on. Same high-quality pipeline as the self-insert branch
      // for stored cast. Skips vision when classify-photo already provided the
      // description.
      console.log('[generate-dream] ⏱ NEW SCENE: starting...');
      try {
        const photoDescription =
          subject_description ??
          (await describeWithVision(
            input_image!,
            VISION_PROMPTS.photoSubject,
            REPLICATE_TOKEN,
            200
          ));
        visionDescription = photoDescription;
        lap('new-scene-vision');
        console.log(
          `[generate-dream] ⏱ Vision ${subject_description ? 'provided' : 'done'}: ${photoDescription.slice(0, 120)}`
        );

        // Synthesize an ephemeral cast from the photo. thumb_url is the user's
        // uploaded photo (face-swap block handles base64 → temp URL upload).
        const ephemeralCast: DreamCastMember = {
          role: 'self',
          thumb_url: input_image!,
          description: photoDescription,
        };
        const resolvedCast = resolveCastForPrompt([ephemeralCast], {
          characterRenderMode: medium.characterRenderMode,
          key: medium.key,
        });
        const isFaceSwapEligible = medium.faceSwaps && medium.characterRenderMode === 'natural';

        // Scene expansion + chaos (same as self-insert)
        const expanded = expandScene({
          userPrompt: hint ?? '',
          userId,
          mediumKey: medium.key,
          vibeKey: vibe.key,
          hasCharacter: true,
        });
        const chaosProfile = rollChaos(
          Array.from(userId + (hint ?? '')).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: hint ?? '',
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: isFaceSwapEligible,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);
        const focalAnchor = deriveFocalAnchor(resolvedCast, { userPrompt: hint ?? '' });

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
            userPrompt: hint || undefined,
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
        } catch (err) {
          console.error('[generate-dream] NEW SCENE Sonnet failed:', (err as Error).message);
          fallbackReasons.push(`new_scene_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
        }

        // Photo is the face-swap source (face-swap block handles upload).
        if (isFaceSwapEligible) {
          faceSwapSource = input_image!;
        }

        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-photo',
          faceSwap: isFaceSwapEligible,
          chaosIntensity: chaosProfile.intensity,
        };
        console.log('[generate-dream] New scene prompt:', finalPrompt.slice(0, 150));
      } catch (err) {
        console.error('[generate-dream] NEW SCENE FAILED:', (err as Error).message);
        fallbackReasons.push(`new_scene_failed:${(err as Error).message}`);
        finalPrompt = `${medium.fluxFragment}, ${hint ?? 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-photo-fallback',
          error: (err as Error).message,
        };
      }
      lap('new-scene-done');
    } else if (isPhoto && photo_style === 'reimagine') {
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
- Mood: ${vibe.directive}${styleRef}
- Framing: waist-up to three-quarter body. The person's face must be clearly visible and well-lit. Show the person IN the scene, interacting with elements around them. The environment should be visible — don't crop it out.
- DO NOT invent your own scenario — use the user's request EXACTLY
Output ONLY the prompt.`;
          finalPrompt = await enhanceViaHaiku(genericBrief, genericBrief, ANTHROPIC_KEY, 150);
        }

        photoOverrideMode = 'flux-dev';
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

      // Ship 2: face-swap the original photo onto the generated scene when the
      // medium supports it. Reimagine used to be caricature-only; now if the
      // medium is face-swap eligible, we get real face preservation + new scene.
      if (medium.faceSwaps && medium.characterRenderMode === 'natural') {
        faceSwapSource = input_image!;
        logAxes.faceSwap = true;
        console.log('[generate-dream] Reimagine + face-swap enabled for this medium');
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

      // ── V2 SELF-INSERT / CAST DETECTION ──
      const selfInsertResult = userSubject
        ? detectSelfInsert(userSubject)
        : { isSelfInsert: false, cleanedPrompt: '', referencedRoles: new Set<string>() };

      const dreamCast: DreamCastMember[] = vibeProfile?.dream_cast ?? [];
      const describedCast = dreamCast.filter((m: DreamCastMember) => m.thumb_url && m.description);

      let castMembers: DreamCastMember[] = [];

      if (force_cast_role) {
        const forced = describedCast.find((m: DreamCastMember) => m.role === force_cast_role);
        if (forced) castMembers = [forced];
      } else if (selfInsertResult.isSelfInsert && !isPhoto) {
        castMembers = describedCast.filter((m: DreamCastMember) =>
          selfInsertResult.referencedRoles.has(m.role as 'self' | 'plus_one' | 'pet')
        );
      }

      const isFaceSwapEligible = medium.faceSwaps && medium.characterRenderMode === 'natural';

      if (isFaceSwapEligible && castMembers.length > 2) {
        const self = castMembers.find((m: DreamCastMember) => m.role === 'self');
        const plusOne = castMembers.find((m: DreamCastMember) => m.role === 'plus_one');
        castMembers = self && plusOne ? [self, plusOne] : [self ?? castMembers[0]];
      }

      const hasCastInjection =
        castMembers.length > 0 || (force_cast_role && describedCast.length > 0);

      if (hasCastInjection) {
        // ── CAST INJECTION: one or more cast members + scene expansion + chaos + compiler ──
        const cleanedPrompt = sanitizeUserPrompt(selfInsertResult.cleanedPrompt);
        const resolvedCast = resolveCastForPrompt(castMembers, {
          characterRenderMode: medium.characterRenderMode,
          key: medium.key,
        });

        const castRoles = castMembers.map((m: DreamCastMember) => m.role).join('+');
        console.log(
          `[generate-dream] 🎭 CAST-INJECT: roles=${castRoles} / ${medium.characterRenderMode} / faceSwap=${isFaceSwapEligible}`
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
          if (compiled.faceSwapSources) {
            faceSwapSources = compiled.faceSwapSources;
          }
          logAxes = {
            medium: medium.key,
            vibe: vibe.key,
            engine: 'v2-compiler-self-insert',
            faceSwap: isFaceSwapEligible,
            dualFaceSwap: !!faceSwapSources,
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

  const autoPicked = await pickModel(
    effectiveMode,
    finalPrompt,
    resolvedMediumKey,
    resolvedVibeKey
  );
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
    if (genResult.nsfwRetries && genResult.nsfwRetries > 0) {
      logAxes.nsfwRetries = genResult.nsfwRetries;
      console.log(
        `[generate-dream] Generation passed after ${genResult.nsfwRetries} NSFW retry/retries`
      );
    }
    lap('image-gen');
    console.log(
      `[generate-dream] ⏱ Image generation complete (prediction: ${genResult.predictionId})`
    );

    // Face swap: dual (two people) or single — retry up to 3x on transient
    // timeouts (Replicate cold start). Same retry behavior as nightly.
    if (faceSwapSources && faceSwapSources.length === 2 && tempUrl) {
      const FACE_SWAP_MAX_RETRIES = 3;
      let swapSuccess = false;
      for (let attempt = 1; attempt <= FACE_SWAP_MAX_RETRIES; attempt++) {
        try {
          console.log(
            `[generate-dream] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES}...`
          );
          tempUrl = await dualFaceSwap(
            faceSwapSources[0].sourceUrl,
            faceSwapSources[1].sourceUrl,
            tempUrl,
            REPLICATE_TOKEN,
            supabase,
            userId,
            t0 + 140_000
          );
          lap('dual-face-swap');
          console.log('[generate-dream] Dual face swap complete');
          logAxes.faceSwapResult = 'dual-success';
          logAxes.faceSwapAttempts = attempt;
          swapSuccess = true;
          break;
        } catch (err) {
          console.warn(
            `[generate-dream] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES} failed:`,
            (err as Error).message
          );
          if (attempt === FACE_SWAP_MAX_RETRIES) {
            fallbackReasons.push(`dual_face_swap_failed_${attempt}x:${(err as Error).message}`);
            logAxes.faceSwapResult = 'dual-failed';
            logAxes.faceSwapError = (err as Error).message;
            logAxes.faceSwapAttempts = attempt;
          }
        }
      }
      void swapSuccess;
    } else if (faceSwapSource && tempUrl) {
      try {
        let sourceUrl: string;
        let swapFileName: string | null = null;
        if (faceSwapSource.startsWith('http')) {
          sourceUrl = faceSwapSource;
          lap('face-swap-upload');
        } else {
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

    // Scene description: user-supplied wins; otherwise generate via Haiku.
    let description: string | null = userDescription;
    if (!description && ANTHROPIC_KEY) {
      try {
        description = await generateSceneDescription(finalPrompt, ANTHROPIC_KEY);
      } catch (err) {
        console.warn(`[generate-dream] description gen failed: ${(err as Error).message}`);
      }
    }
    if (description) console.log(`[generate-dream] description: "${description}"`);

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
          ...(description ? { description } : {}),
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
    const isNsfw =
      errMsg.startsWith('NSFW_CONTENT') || errMsg.includes('NSFW') || errMsg.includes('safety');
    console.error(`[generate-dream] Error for user ${userId}:`, errMsg);

    // Ship 2.5: NSFW sparkle refund — unconditional on NSFW (not gated by jobId).
    // Server owns the refund; client should NOT double-refund.
    if (isNsfw) {
      try {
        await supabase.rpc('grant_sparkles', {
          p_user_id: userId,
          p_amount: 1,
          p_reason: 'nsfw_refund',
        });
        console.log('[generate-dream] NSFW sparkle refunded');
      } catch (refundErr) {
        console.error('[generate-dream] NSFW refund FAILED:', (refundErr as Error).message);
      }
    }

    // Update dream job on failure (best-effort)
    if (jobId) {
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
    }

    return new Response(
      JSON.stringify({
        error: errMsg,
        nsfw: isNsfw, // explicit flag — clients should branch on this
        sparkle_refunded: isNsfw, // tells client to refresh balance
      }),
      { status: 500 }
    );
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────────

// haikuJson deleted Phase 3.2 — was only used by legacy recipe path.

// Retries Haiku on transient errors before falling back to the template prompt.
// Mirrors the retry logic in _shared/llm.ts (without model fallback — Haiku
// IS the fallback in this path).
const HAIKU_RETRY_DELAYS_MS = [1000, 3000, 10000, 30000];
const HAIKU_RETRYABLE = new Set([429, 500, 502, 503, 504, 529]);

async function enhanceViaHaiku(
  brief: string,
  fallback: string,
  anthropicKey: string | undefined,
  maxTokens: number = 150
): Promise<string> {
  if (!anthropicKey) return fallback;
  let lastErr = '';
  for (let attempt = 0; attempt <= HAIKU_RETRY_DELAYS_MS.length; attempt++) {
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
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text?.trim() ?? '';
        return text.length >= 10 ? text : fallback;
      }
      lastErr = `Haiku ${res.status}`;
      if (!HAIKU_RETRYABLE.has(res.status)) {
        console.warn(`[generate-dream] ${lastErr} non-retryable — using template fallback`);
        return fallback;
      }
      if (attempt < HAIKU_RETRY_DELAYS_MS.length) {
        console.warn(
          `[generate-dream] ${lastErr} on ${attempt + 1}/${HAIKU_RETRY_DELAYS_MS.length + 1}, retrying in ${
            HAIKU_RETRY_DELAYS_MS[attempt] / 1000
          }s`
        );
        await new Promise((r) => setTimeout(r, HAIKU_RETRY_DELAYS_MS[attempt]));
      }
    } catch (err) {
      lastErr = (err as Error).message;
      if (attempt < HAIKU_RETRY_DELAYS_MS.length) {
        await new Promise((r) => setTimeout(r, HAIKU_RETRY_DELAYS_MS[attempt]));
      }
    }
  }
  console.warn(`[generate-dream] Haiku exhausted retries (${lastErr}) — using template fallback`);
  return fallback;
}

// Sonnet, pickModel, generateImage, persistToStorage, sanitizePrompt,
// faceSwap — all moved to _shared/ in Phase 3.1. Imports at the top of
// this file.

// CompanionMatch + detectCompanionRequest deleted Phase 3.2 — unused in V4 paths.
