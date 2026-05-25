/**
 * First-Dream dispatcher — runs the heavy generation work for one queued
 * first-dream job. Called from dream-queue-worker.
 *
 * Receives the pre-built payload (persona, medium, vibe, sonnet_brief,
 * cast metadata, location, etc.) and runs:
 *   Sonnet polish → Flux render → face swap (single OR dual) → persist
 *
 * Returns the upload_id of the created uploads row.
 *
 * The dispatcher does NOT update dream_queue.status — the worker handles
 * that based on whether this throws.
 *
 * Why payload is pre-built at enqueue time: brief construction is cheap
 * (no API calls except the one-time location card lookup). Doing it at
 * enqueue keeps the worker focused on the heavy stuff and makes retries
 * deterministic — same brief every retry, no risk of Sonnet drift between
 * attempts.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { resolveMediumFromDb, resolveVibeFromDb } from '../../_shared/dreamStyles.ts';
import { applyFaceSwapOverride } from '../../_shared/faceSwapFluxOverrides.ts';
import { callSonnet } from '../../_shared/llm.ts';
import { sanitizePrompt } from '../../_shared/sanitize.ts';
import { pickModel } from '../../_shared/modelPicker.ts';
import { generateImage } from '../../_shared/generateImage.ts';
import { faceSwap } from '../../_shared/faceSwap.ts';
import { dispatchDualFaceSwap } from '../../_shared/dualSwapDispatch.ts';
import { persistToStorage } from '../../_shared/persistence.ts';
import { insertGenerationLog } from '../../_shared/logging.ts';
import { FIRST_DREAM_BANNED_PHRASES, FirstDreamPersona } from '../../_shared/firstDream.ts';
import { getCostCents } from '../../_shared/modelPricing.ts';

interface FirstDreamPayload {
  persona: FirstDreamPersona;
  medium_key: string;
  vibe_key: string;
  composition: 'character' | 'epic_tiny' | 'pure_scene';
  composition_mode: string;
  sonnet_brief: string;
  is_dual_face_swap: boolean;
  face_swap_eligible: boolean;
  user_place: string | null;
  user_thing: string | null;
  cast: Array<{
    role: 'self' | 'plus_one' | 'pet';
    thumb_url: string;
    description: string;
    gender?: string;
  }>;
  // Carried forward for logging / observability only.
  medium_pick_reason: string;
  vibe_pick_reason: string;
  recipe_snapshot: Record<string, unknown>;
}

export interface FirstDreamDispatcherArgs {
  supabase: SupabaseClient;
  replicateToken: string;
  anthropicKey: string;
  userId: string;
  payload: Record<string, unknown>;
}

export async function processFirstDreamJob(args: FirstDreamDispatcherArgs): Promise<string> {
  const { supabase, replicateToken, anthropicKey, userId } = args;
  const payload = args.payload as unknown as FirstDreamPayload;

  // Resolve medium + vibe rows for full metadata (face_swaps, fluxFragment, etc).
  const medium = await resolveMediumFromDb(payload.medium_key);
  if (!medium) throw new Error(`medium_not_found:${payload.medium_key}`);
  const vibe = await resolveVibeFromDb(payload.vibe_key);
  if (!vibe) throw new Error(`vibe_not_found:${payload.vibe_key}`);

  let baseMedium = medium;
  if (payload.face_swap_eligible) {
    baseMedium = applyFaceSwapOverride(baseMedium);
  }

  // ── Sonnet → Flux prompt ──────────────────────────────────────────────
  let finalPrompt: string;
  let sonnetBriefOut: string | null = null;
  let sonnetRawResponse: string | null = null;
  const fallbackReasons: string[] = [];

  try {
    const sonnet = await callSonnet(
      payload.sonnet_brief,
      anthropicKey,
      payload.is_dual_face_swap ? 350 : 300
    );
    sonnetBriefOut = sonnet.brief;
    sonnetRawResponse = sonnet.rawResponse;
    if (sonnet.text.length < 20) throw new Error('sonnet_too_short');
    finalPrompt = sonnet.text;
  } catch (err) {
    fallbackReasons.push(`sonnet_failed:${(err as Error).message}`);
    finalPrompt = `${baseMedium.fluxFragment}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, no text, hyper detailed`;
  }

  // Force location to appear in final prompt.
  if (payload.user_place && !finalPrompt.toLowerCase().includes(payload.user_place.toLowerCase())) {
    finalPrompt = `set in ${payload.user_place}, ${finalPrompt}`;
  }

  // Banned-phrase scrub.
  for (const bad of FIRST_DREAM_BANNED_PHRASES) {
    finalPrompt = finalPrompt.replace(new RegExp(`\\b${bad}\\b`, 'gi'), '');
  }
  finalPrompt = sanitizePrompt(finalPrompt);

  // ── Flux render ────────────────────────────────────────────────────────
  const picked = await pickModel('flux-dev', finalPrompt, baseMedium.key, vibe.key);
  const renderModel = picked.model;
  let imageUrl: string;
  let replicatePredictionId: string | null = null;

  const genResult = await generateImage(
    'flux-dev',
    finalPrompt,
    undefined,
    {
      replicateToken,
      openaiKey: Deno.env.get('OPENAI_API_KEY'),
      geminiKey: Deno.env.get('GEMINI_API_KEY'),
    },
    renderModel
  );
  imageUrl = genResult.url;
  replicatePredictionId = genResult.predictionId ?? null;

  // ── Face swap (graceful fallback on failure — keep pre-swap render) ──
  let tempUrl = imageUrl;
  let faceSwapResult: 'none' | 'single-success' | 'dual-success' | 'failed' = 'none';
  const selectedCast = payload.cast ?? [];

  // Hard rule: NEVER persist a render with characters that aren't actually
  // face-swapped to be the user. The pre-swap Flux output looks like the
  // user (Sonnet describes them), but it's a "look-alike" — wrong identity.
  // Better to fail loudly + retry than ship a look-alike. After the worker
  // exhausts retries, Phase 4 will re-enqueue as a solo persona (drop
  // plus_one) so the user always gets a render of their actual face.
  if (payload.is_dual_face_swap && selectedCast.length === 2) {
    const left = selectedCast[0].thumb_url;
    const right = selectedCast[1].thumb_url;
    if (!left || !right) {
      throw new Error('dual_swap_missing_source_urls');
    }
    tempUrl = await dispatchDualFaceSwap(left, right, tempUrl, replicateToken, supabase, userId);
    faceSwapResult = 'dual-success';
  } else if (payload.face_swap_eligible && selectedCast.length === 1 && selectedCast[0].thumb_url) {
    tempUrl = await faceSwap(selectedCast[0].thumb_url, tempUrl, replicateToken, supabase, userId);
    faceSwapResult = 'single-success';
  }

  // ── Persist + write upload row + first_dream_completed_at ─────────────
  const persistedUrl = await persistToStorage(tempUrl, userId, supabase);
  const { data: uploadRow, error: uploadErr } = await supabase
    .from('uploads')
    .insert({
      user_id: userId,
      image_url: persistedUrl,
      ai_prompt: finalPrompt,
      dream_medium: medium.key,
      dream_vibe: vibe.key,
      is_ai_generated: true,
      is_approved: true,
      is_posted: true,
      first_dream: true,
    })
    .select('id')
    .single();
  if (uploadErr || !uploadRow) {
    throw new Error(`upload_insert_failed:${uploadErr?.message ?? 'no row returned'}`);
  }

  await supabase
    .from('users')
    .update({ first_dream_completed_at: new Date().toISOString() })
    .eq('id', userId);

  await insertGenerationLog(supabase, {
    user_id: userId,
    recipe_snapshot: payload.recipe_snapshot ?? {},
    enhanced_prompt: finalPrompt,
    rolled_axes: {
      engine: 'first-dream-banger',
      via: 'queue-worker',
      persona: payload.persona,
      medium: medium.key,
      vibe: vibe.key,
      compositionMode: payload.composition_mode,
      composition: payload.composition,
      userPlace: payload.user_place,
      userThing: payload.user_thing,
      faceSwapResult,
      mediumPickReason: payload.medium_pick_reason,
      vibePickReason: payload.vibe_pick_reason,
      uploadId: uploadRow.id,
    },
    sonnet_brief: sonnetBriefOut,
    sonnet_raw_response: sonnetRawResponse,
    vision_description: null,
    fallback_reasons: fallbackReasons,
    replicate_prediction_id: replicatePredictionId,
    model_used: renderModel,
    cost_cents: getCostCents(renderModel),
    status: 'completed',
  });

  // NO auto-upscale (2026-05-25) — HD upscale is on-demand only via
  // request-upscale, cached on first download. See UPSCALE_QUEUE_PLAN.md.

  return uploadRow.id;
}
