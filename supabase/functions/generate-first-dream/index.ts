/**
 * generate-first-dream — dedicated pipeline for the very first dream a
 * user sees at the end of onboarding. Single-shot, curated, banger-rate.
 *
 * Spec: memory/project_first_dream_engine_spec.md
 *
 * Why a separate function (instead of weaving into generate-dream):
 *   - Lower risk: cannot regress V4 / Create / DLT pipelines
 *   - Clean code path: this function does ONE thing well
 *   - Independent deploy: can be tuned/redeployed without touching the
 *     main engine
 *
 * Flow:
 *   1. Auth user, check users.first_dream_completed_at (one-shot guard)
 *   2. Load user's vibe_profile + dream_seeds + selected location/object cards
 *   3. routeArchetype + fetch first_dream_cells row → FirstDreamBrief
 *   4. compilePrompt with cell's composition/lighting/camera/sensory anchors
 *   5. callSonnet for the polished Flux prompt
 *   6. Flux render via flux-dev
 *   7. If face-swap eligible: faceSwap or dualFaceSwap with up to 3 retries
 *   8. On retry exhaustion: rebuild brief with forceNoCast=true, re-render once
 *   9. Persist to storage + uploads + set users.first_dream_completed_at
 *   10. Return image URL + caption + metadata
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { callSonnet } from '../_shared/llm.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { persistToStorage } from '../_shared/persistence.ts';
import { faceSwap, dualFaceSwap } from '../_shared/faceSwap.ts';
import { fetchMediums, fetchVibes } from '../_shared/dreamStyles.ts';
import {
  buildFirstDreamBrief,
  type ResolvedLocationCard,
  type ResolvedObjectCard,
} from '../_shared/firstDreamPipeline.ts';
import { FIRST_DREAM_GUARDRAILS } from '../_shared/firstDream.ts';

interface RequestBody {
  /** Optional override (test mode) — normally read from user_recipes */
  vibe_profile?: unknown;
  /** Optional override (test mode) — normally read from dream_seeds */
  selected_locations?: ResolvedLocationCard[];
  selected_objects?: ResolvedObjectCard[];
  /** Test mode — bypass the one-shot guard so QA can re-run this for the same user */
  bypass_one_shot?: boolean;
  /** Test mode — set userId from body (only honored when bearer = service role) */
  test_user_id?: string;
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

  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')!;
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  if (!REPLICATE_TOKEN || !ANTHROPIC_KEY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    body = {};
  }

  // Service-role client (for first_dream_cells RLS bypass + writes)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Auth — production path uses end-user JWT. Test path: when bearer
  // matches the service role and body provides test_user_id, skip the
  // user-JWT check (used by scripts/iter-first-dream.js for QA loops).
  const authHeader = req.headers.get('authorization') ?? '';
  const bearer = authHeader.replace(/^Bearer\s+/i, '').trim();
  const isServiceRoleCall = !!bearer && bearer === SERVICE_ROLE;

  let userId: string;
  if (isServiceRoleCall && body.test_user_id) {
    userId = body.test_user_id;
  } else {
    const userClient = createClient(
      SUPABASE_URL,
      Deno.env.get('SUPABASE_ANON_KEY') ?? SERVICE_ROLE,
      {
        global: { headers: { Authorization: authHeader } },
      }
    );
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    userId = user.id;
  }

  // ── One-shot guard ──
  const { data: userRow } = await supabase
    .from('users')
    .select('first_dream_completed_at')
    .eq('id', userId)
    .single();
  if (userRow?.first_dream_completed_at && !body.bypass_one_shot) {
    return new Response(
      JSON.stringify({
        error: 'first_dream_already_completed',
        completed_at: userRow.first_dream_completed_at,
      }),
      { status: 409 }
    );
  }

  // ── Load profile + seeds ──
  let vibeProfile = body.vibe_profile as
    | {
        dream_cast?: {
          role: 'self' | 'plus_one' | 'pet';
          thumb_url?: string;
          description?: string;
        }[];
      }
    | undefined;
  if (!vibeProfile) {
    const { data: row } = await supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', userId)
      .single();
    vibeProfile = row?.recipe as typeof vibeProfile;
  }
  if (!vibeProfile) {
    return new Response(JSON.stringify({ error: 'No vibe profile found' }), { status: 400 });
  }

  // Selected locations / objects: fetch via dream_seeds + classification join
  let selectedLocations: ResolvedLocationCard[] = body.selected_locations ?? [];
  let selectedObjects: ResolvedObjectCard[] = body.selected_objects ?? [];
  if (selectedLocations.length === 0 || selectedObjects.length === 0) {
    const { data: seedRow } = await supabase
      .from('dream_seeds')
      .select('places,things')
      .eq('user_id', userId)
      .single();
    if (seedRow) {
      if (
        selectedLocations.length === 0 &&
        Array.isArray(seedRow.places) &&
        seedRow.places.length > 0
      ) {
        const { data: locs } = await supabase
          .from('location_cards')
          .select('name,location_class')
          .in('name', seedRow.places);
        selectedLocations = (locs ?? []) as ResolvedLocationCard[];
      }
      if (
        selectedObjects.length === 0 &&
        Array.isArray(seedRow.things) &&
        seedRow.things.length > 0
      ) {
        const { data: objs } = await supabase
          .from('object_cards')
          .select('name,object_class')
          .in('name', seedRow.things);
        selectedObjects = (objs ?? []) as ResolvedObjectCard[];
      }
    }
  }

  // ── Build the first-dream brief ──
  const brief = await buildFirstDreamBrief(
    {
      profile: vibeProfile,
      selectedLocations,
      selectedObjects,
      forceNoCast: false,
    },
    supabase
  );

  console.log(
    `[first-dream] persona=${brief.roll.persona} location=${brief.roll.locationClass} ` +
      `medium=${brief.resolvedMediumKey} vibe=${brief.resolvedVibeKey} ` +
      `cast=${brief.castMembers.map((c) => c.role).join('+') || 'none'} ` +
      `fallbacks=${brief.fallbackReasons.join(',') || 'none'}`
  );

  // ── Resolve medium + vibe rows (for the directive text) ──
  const mediums = await fetchMediums();
  const vibes = await fetchVibes();
  const medium = mediums.find((m) => m.key === brief.resolvedMediumKey) ?? mediums[0];
  const vibe = vibes.find((v) => v.key === brief.resolvedVibeKey) ?? vibes[0];

  // ── Compose Sonnet brief — purpose-built, no compilePrompt complexity ──
  const sonnetBrief = `You are writing a Flux AI image-generation prompt for the very first dream this user will ever see. This is the most important render they will ever generate — it must be a banger.

═══ THE CELL RECIPE (FOLLOW EXACTLY) ═══
${brief.sceneInstructions}

═══ STYLE ═══
Medium: ${medium.label}. ${medium.directive}

═══ MOOD ═══
Vibe: ${vibe.label}. ${vibe.directive}

═══ OUTPUT ═══
Write a single dense Flux prompt of 65-90 words, comma-separated phrases, starting with the medium's signature look and ending with quality terms (NOT photorealistic if the medium is painted, etc.). Bake every layer of the cell recipe into the prompt naturally — composition, lighting, camera, sensory anchors. The subject (described above) MUST be the visual focus. Output ONLY the prompt, no preamble.`;

  let finalPrompt: string;
  try {
    const sonnet = await callSonnet(sonnetBrief, ANTHROPIC_KEY, 250);
    finalPrompt = sonnet.text.trim();
    if (finalPrompt.length < 30) throw new Error('sonnet returned too-short prompt');
  } catch (err) {
    console.error('[first-dream] Sonnet failed:', (err as Error).message);
    // Mechanical fallback — concatenate cell + medium fragments
    finalPrompt = `${medium.fluxFragment}, ${brief.cell.compositionBrief.slice(0, 200)}, ${brief.cell.lightingRecipe.slice(0, 100)}, ${vibe.directive.split('.')[0]}, hyper detailed masterpiece quality`;
  }

  // ── Generate the image ──
  let renderedUrl: string;
  try {
    const result = await generateImage(
      'flux-dev',
      finalPrompt,
      undefined,
      REPLICATE_TOKEN,
      'black-forest-labs/flux-dev'
    );
    renderedUrl = result.url;
  } catch (err) {
    console.error('[first-dream] Flux render failed:', (err as Error).message);
    return new Response(
      JSON.stringify({ error: 'render_failed', detail: (err as Error).message }),
      { status: 500 }
    );
  }

  // ── Face-swap with retry (cast-bearing personas only) ──
  let finalImageUrl = renderedUrl;
  let faceSwapAttempts = 0;
  let faceSwapApplied = false;

  const isFaceSwapEligible =
    !brief.isNoCast &&
    medium.characterRenderMode === 'natural' &&
    brief.castMembers.length > 0 &&
    brief.castMembers.every((c) => !!c.thumb_url);

  if (isFaceSwapEligible) {
    const isDual = brief.castMembers.length === 2;
    for (let attempt = 1; attempt <= FIRST_DREAM_GUARDRAILS.FACE_SWAP_MAX_RETRIES; attempt++) {
      faceSwapAttempts = attempt;
      try {
        if (isDual) {
          const left = brief.castMembers[0].thumb_url!;
          const right = brief.castMembers[1].thumb_url!;
          finalImageUrl = await dualFaceSwap(
            left,
            right,
            renderedUrl,
            REPLICATE_TOKEN,
            supabase,
            userId
          );
        } else {
          const src = brief.castMembers[0].thumb_url!;
          finalImageUrl = await faceSwap(src, renderedUrl, REPLICATE_TOKEN, supabase, userId);
        }
        faceSwapApplied = true;
        console.log(`[first-dream] face-swap success on attempt ${attempt}`);
        break;
      } catch (err) {
        console.error(`[first-dream] face-swap attempt ${attempt} failed:`, (err as Error).message);
        if (attempt === FIRST_DREAM_GUARDRAILS.FACE_SWAP_MAX_RETRIES) {
          console.warn(
            '[first-dream] all face-swap retries exhausted, falling back to no-cast variant'
          );
        }
      }
    }
  }

  // ── No-cast fallback render if face-swap exhausted ──
  if (isFaceSwapEligible && !faceSwapApplied) {
    const noCastBrief = await buildFirstDreamBrief(
      {
        profile: vibeProfile,
        selectedLocations,
        selectedObjects,
        forceNoCast: true,
      },
      supabase
    );
    const noCastSonnet = `You are writing a Flux AI prompt for a pure-environment first-dream render (no characters at all). Vast atmospheric scene that ties to the user's location.

═══ CELL RECIPE ═══
${noCastBrief.sceneInstructions}

═══ STYLE ═══
Medium: ${medium.label}. ${medium.directive}

═══ MOOD ═══
Vibe: ${vibe.label}. ${vibe.directive}

═══ OUTPUT ═══
65-90 word Flux prompt, comma-separated, no characters. Output ONLY the prompt.`;
    try {
      const sonnet = await callSonnet(noCastSonnet, ANTHROPIC_KEY, 200);
      const noCastPrompt = sonnet.text.trim();
      const result = await generateImage(
        'flux-dev',
        noCastPrompt,
        undefined,
        REPLICATE_TOKEN,
        'black-forest-labs/flux-dev'
      );
      finalImageUrl = result.url;
      finalPrompt = noCastPrompt;
      console.log('[first-dream] no-cast fallback render succeeded');
    } catch (err) {
      console.error('[first-dream] no-cast fallback also failed:', (err as Error).message);
      // Last resort — keep the original render with no face-swap
    }
  }

  // ── Persist to storage ──
  let storedUrl: string;
  try {
    storedUrl = await persistToStorage(finalImageUrl, userId, supabase);
  } catch (err) {
    console.error('[first-dream] persist failed:', (err as Error).message);
    storedUrl = finalImageUrl;
  }

  // ── Insert upload row + flip first_dream_completed_at ──
  // Build the insert payload. fallback_reasons + first_dream are added
  // conditionally — they require migrations 140 (first_dream_completed_at)
  // and 141 (uploads.first_dream). When 141 hasn't run yet, the insert
  // would fail; we omit those fields and rely on the caption tag for
  // post-launch telemetry.
  const insertPayload: Record<string, unknown> = {
    user_id: userId,
    image_url: storedUrl,
    ai_prompt: finalPrompt,
    bot_message: brief.bannerCaption,
    dream_medium: brief.resolvedMediumKey,
    dream_vibe: brief.resolvedVibeKey,
    caption: `[first-dream] ${brief.roll.persona}/${brief.roll.locationClass}`,
    is_ai_generated: true,
    is_posted: true,
    is_approved: true,
  };

  // Try-with-first_dream first, fall back to without if column missing.
  // This keeps the function working before/after migration 141 lands.
  let upload: { id: string } | null = null;
  let insertErr: { message: string } | null = null;
  {
    const tryWithFlag = await supabase
      .from('uploads')
      .insert({ ...insertPayload, first_dream: true })
      .select('id')
      .single();
    if (tryWithFlag.error && /'first_dream'|first_dream/i.test(tryWithFlag.error.message)) {
      const tryWithout = await supabase.from('uploads').insert(insertPayload).select('id').single();
      upload = tryWithout.data as { id: string } | null;
      insertErr = tryWithout.error;
    } else {
      upload = tryWithFlag.data as { id: string } | null;
      insertErr = tryWithFlag.error;
    }
  }

  if (insertErr) {
    console.error('[first-dream] insert failed:', insertErr.message);
    return new Response(JSON.stringify({ error: 'persist_failed', detail: insertErr.message }), {
      status: 500,
    });
  }

  // Flip the one-shot guard
  await supabase
    .from('users')
    .update({ first_dream_completed_at: new Date().toISOString() })
    .eq('id', userId);

  return new Response(
    JSON.stringify({
      image_url: storedUrl,
      prompt_used: finalPrompt,
      bot_message: brief.bannerCaption,
      resolved_medium: brief.resolvedMediumKey,
      resolved_vibe: brief.resolvedVibeKey,
      upload_id: upload?.id,
      archetype: {
        persona: brief.roll.persona,
        location_class: brief.roll.locationClass,
        primary_location: brief.roll.primaryLocation,
        primary_object: brief.roll.primaryObject,
      },
      face_swap_attempts: faceSwapAttempts,
      face_swap_applied: faceSwapApplied,
      no_cast_variant: brief.isNoCast || (isFaceSwapEligible && !faceSwapApplied),
      fallback_reasons: brief.fallbackReasons,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
});
