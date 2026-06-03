/**
 * Edge Function: nightly-dreams
 *
 * Per-user nightly dream generation. Batch orchestration stays in
 * scripts/nightly-dreams.js — this function handles the full Scene DNA
 * pipeline for a single authenticated user:
 *
 *   medium/vibe resolution → cast description → dream roll →
 *   scene assembly → Sonnet brief → image generation → face swap →
 *   persist → upload row → budget upsert → generation log
 *
 * POST /functions/v1/nightly-dreams
 * Authorization: Bearer <user JWT>
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import {
  resolveMediumFromDb,
  resolveVibeFromDb,
  fetchSceneEligibleModels,
} from '../_shared/dreamStyles.ts';
import { getBiomeConfig, resolveBiomeFromTags, isValidBiomeConfig } from '../_shared/biomeAxes.ts';
import { rollDream } from '../_shared/dreamAlgorithm.ts';
import { assembleScene } from '../_shared/sceneEngine.ts';
// buildRenderEntity removed — full cast description now passes to Sonnet directly
import { getLocationCard } from '../_shared/essenceCards.ts';
import type { LocationCard } from '../_shared/essenceCards.ts';
import { callSonnet } from '../_shared/llm.ts';
import { distillStyle } from '../_shared/styleDistiller.ts';
import { getCostCents } from '../_shared/modelPricing.ts';
import { buildRecipe } from '../_shared/recipeBuilder.ts';
import { applyVibeGenderModifier } from '../_shared/promptCompiler.ts';
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { faceSwap } from '../_shared/faceSwap.ts';
import { dispatchDualFaceSwap } from '../_shared/dualSwapDispatch.ts';
import { routeDualSwapByGender } from '../_shared/dualGenderRouting.ts';
import {
  aHashHex,
  hammingDistance,
  persistBufferToStorage,
  persistToStorage,
  buildDisplayVariant,
} from '../_shared/persistence.ts';
import { insertGenerationLog } from '../_shared/logging.ts';
import { pickDualAction } from '../_shared/pools/dual_actions.ts';
import { pickDualCompositionPath } from '../_shared/pools/dual_composition.ts';
import { runCharacterSlotPipeline } from '../_shared/characterSlotPrompt.ts';
import { resolveCastGender } from '../_shared/genderLock.ts';
import { pickSingleAction } from '../_shared/pools/single_actions.ts';
import { pickSceneCluster } from '../_shared/pools/scene_clusters.ts';
import { generateSceneDescription } from '../_shared/sceneDescription.ts';
import { applyFaceSwapOverride } from '../_shared/faceSwapFluxOverrides.ts';
import { pickFaceSwapModelOverride } from '../_shared/faceSwapModelOverrides.ts';

Deno.serve(async (req) => {
  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(JSON.stringify({ error: 'Missing REPLICATE_API_TOKEN' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  // Service role client for DB operations (bypasses RLS)
  const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);

  // ── Parse request body (needed by both auth paths) ──────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Auth — two paths ─────────────────────────────────────────────────────
  // 1. Worker token (server-to-server, from the dream-queue-worker fan-out
  //    dispatcher): user_id comes from the body and the recipe is loaded fresh
  //    from the DB so profile edits always land. No per-user JWT needed — this
  //    is what lets nightly fan out across worker-claimed jobs at scale.
  // 2. User JWT (app / QA direct calls): derive user_id from the token; recipe
  //    comes from body.vibe_profile.
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const workerToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN');
  const isWorkerCall = Boolean(workerToken) && authHeader === `Bearer ${workerToken}`;

  let userId: string;
  let vibe_profile: VibeProfile | undefined;

  if (isWorkerCall) {
    userId = (body.user_id as string) || '';
    if (!userId) {
      return new Response(JSON.stringify({ error: 'user_id is required for worker calls' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { data: recipeRow } = await supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', userId)
      .single();
    const recipe = (recipeRow as { recipe?: unknown } | null)?.recipe;
    vibe_profile = recipe && typeof recipe === 'object' ? (recipe as VibeProfile) : undefined;
  } else {
    const supabaseUser: SupabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const {
      data: { user },
    } = await supabaseUser.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    userId = user.id;
    vibe_profile = body.vibe_profile as VibeProfile | undefined;
  }

  const dream_wish = (body.dream_wish as string) || undefined;
  // Preserve explicit null — caller passes null to mean "force scene-only,
  // no cast". `||` would coerce null → undefined and break the
  // forceCastRole === null branch downstream in rollDream.
  const force_cast_role: string | null | undefined =
    'force_cast_role' in body ? (body.force_cast_role as string | null) : undefined;
  const force_medium = (body.force_medium as string) || undefined;
  const force_vibe = (body.force_vibe as string) || undefined;
  const force_nightly_path = (body.force_nightly_path as string) || undefined;
  const force_model = (body.force_model as string) || undefined;
  const force_dual_pool =
    (body.force_dual_pool as 'partner' | 'companion' | undefined) || undefined;
  const force_single_pool =
    (body.force_single_pool as 'portrait' | 'candid' | undefined) || undefined;
  // Force scene cluster picking from a specific sub-pool: 'activity' or
  // 'spot'. Default (undefined) blends both.
  const force_cluster_kind = (body.force_cluster_kind as 'activity' | 'spot' | null) || undefined;
  // First-dream onboarding render only: roll the DEFAULT medium from the
  // face-swap-eligible pool (instead of the broad dream_eligible pool) so the
  // user is reliably cast into the scene via face swap. Fully gated — the
  // normal nightly queue path never sets this, so its dream_eligible roll is
  // untouched. Ignored when force_medium is also set (explicit wins).
  const force_face_swap_eligible = body.force_face_swap_eligible === true;
  // QA / dry-run flag — when false, skip the uploads insert + budget upsert so
  // the Dream Generator Test screen can exercise the nightly pipeline without
  // polluting the user's album. Default true (normal nightly + first-dream).
  const persist = body.persist !== false;

  if (!vibe_profile) {
    return new Response(JSON.stringify({ error: 'vibe_profile is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Timing ─────────────────────────────────────────────────────────────
  const t0 = Date.now();
  const timings: Record<string, number> = {};
  let lastLap = t0;
  const lap = (label: string) => {
    const now = Date.now();
    const stepMs = now - lastLap;
    const totalMs = now - t0;
    timings[label] = stepMs;
    console.log(`[nightly-dreams] ${label}: ${stepMs}ms (total: ${totalMs}ms)`);
    lastLap = now;
  };

  // ── Observability state ────────────────────────────────────────────────
  let sonnetBrief: string | null = null;
  let sonnetRawResponse: string | null = null;
  let visionDescription: string | null = null;
  let replicatePredictionId: string | null = null;
  const fallbackReasons: string[] = [];
  let logAxes: Record<string, unknown> = {};
  let resolvedMediumKey: string | undefined;
  let resolvedVibeKey: string | undefined;
  // Hoisted for the post-try scene-composition model gate (mig 213). The
  // gate runs after pickModel — needs to know the composition rolled inside
  // the try block + the picked medium's allowed_models to intersect with
  // engine_config.scene_eligible_models.
  let resolvedComposition: 'character' | 'epic_tiny' | 'pure_scene' | undefined;
  let resolvedMediumAllowedModels: string[] = [];
  // Per-medium scene-eligible model override (mig 214). NULL → fall back to
  // engine_config.scene_eligible_models global. Captured for the post-try gate.
  let resolvedMediumSceneModels: string[] | null = null;
  let faceSwapSource: string | undefined;
  let faceSwapSources:
    | Array<{ role: string; sourceUrl: string; gender: 'male' | 'female' | null | undefined }>
    | undefined;
  let finalPrompt: string = '';
  // Hoisted face-swap-character flag so the post-try model picker can branch
  // on it. Set true for BOTH single and dual face-swap renders (humans only —
  // pets stay on the legacy freeform path). Inner block-scoped flags
  // (isDualFaceSwap, isSingleCharacter) are computed in the outer try.
  let isFaceSwapCharacterOuter = false;
  // Hoisted so the post-try image-gen step (line ~1289) can branch on it
  // when picking JPEG vs PNG for the dual-face-swap pipeline.
  let isDualFaceSwap = false;
  // Pre-decided model for the face-swap-character path (rolled inside the
  // try block so we can override the medium fragment for flux-1.1-pro before
  // the slot pipeline runs). Hoisted so the post-try image-gen step uses
  // the same model.
  let faceSwapPrePickedModel: string | null = null;

  // Budget tracking
  const today = new Date().toISOString().slice(0, 10);
  const { data: budgetRow } = await supabase
    .from('ai_generation_budget')
    .select('images_generated')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  const todayCount = budgetRow && budgetRow.images_generated ? budgetRow.images_generated : 0;

  try {
    // ══════════════════════════════════════════════════════════════════
    // ══ NIGHTLY DREAMBOT PATH — fully isolated, no shared templates ══
    // ══════════════════════════════════════════════════════════════════
    const nightlyProfile = vibe_profile as VibeProfile;

    // Recency: exclude the last 7 nightly mediums + vibes + locations from
    // the pool so the user doesn't see the same choices repeat in a row.
    // Falls back to the full pool if filtering would starve it (small
    // profiles). Locations are parsed from the enhanced_prompt since there's
    // no dedicated rolled_axes.location field.
    const { data: recentLogs } = await supabase
      .from('ai_generation_log')
      .select('rolled_axes, enhanced_prompt')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(7);
    const recentMediums = (recentLogs ?? [])
      .map((l) => (l.rolled_axes as Record<string, unknown>)?.medium)
      .filter((m): m is string => typeof m === 'string' && m.length > 0);
    const recentVibes = (recentLogs ?? [])
      .map((l) => (l.rolled_axes as Record<string, unknown>)?.vibe)
      .filter((v): v is string => typeof v === 'string' && v.length > 0);
    const profilePlaces = nightlyProfile.dream_seeds?.places ?? [];
    const recentPlaces = (recentLogs ?? [])
      .map((l) => {
        const prompt = (l.enhanced_prompt || '').toLowerCase();
        return profilePlaces.find((p) => prompt.includes(p.toLowerCase()));
      })
      .filter((p): p is string => !!p);
    console.log(
      '[nightly-dreams] recent mediums:',
      recentMediums.slice(0, 5).join(', '),
      '| recent vibes:',
      recentVibes.slice(0, 5).join(', '),
      '| recent places:',
      recentPlaces.slice(0, 5).join(', ')
    );

    // Filter out mediums marked nightly_skip in the DB (e.g., photography —
    // produces literal photoreal renders that read as "AI photoshop collage"
    // Pick from the curated dream-eligible pool — NOT from the user's
    // stored art_styles/aesthetics. Migration 160 added is_dream_eligible
    // as the auto-gen quality gate. The user's create-screen options stay
    // broad; nightly is curated. recentMediums/recentVibes still apply for
    // rotation across the eligible pool.
    let nightlyMedium = await resolveMediumFromDb(
      force_face_swap_eligible ? 'dream_eligible_face_swap' : 'dream_eligible',
      undefined,
      recentMediums
    );
    if (force_medium) {
      nightlyMedium = await resolveMediumFromDb(force_medium);
    }
    let nightlyVibe = await resolveVibeFromDb('dream_eligible', undefined, recentVibes);
    if (force_vibe) {
      nightlyVibe = await resolveVibeFromDb(force_vibe);
    }
    resolvedMediumKey = nightlyMedium.key;
    resolvedVibeKey = nightlyVibe.key;

    let baseMedium = nightlyMedium;

    console.log(
      '[nightly-dreams] NIGHTLY DREAMBOT | medium:',
      nightlyMedium.key,
      '| vibe:',
      nightlyVibe.key,
      '| force_cast_role:',
      force_cast_role,
      '| typeof:',
      typeof force_cast_role
    );

    // Step 1: Pick a mood-weighted scene template from 6,200+ Sonnet-generated DB templates
    const seeds = nightlyProfile.dream_seeds ?? { characters: [], places: [] };
    const moods = nightlyProfile.moods ?? {
      peaceful_chaotic: 0.5,
      cute_terrifying: 0.3,
      minimal_maximal: 0.5,
      realistic_surreal: 0.5,
    };
    let dreamSubject: string;

    // Check if we'll inject a cast member — decided before template selection
    // Describe any undescribed cast members server-side via Llama Vision (Replicate)
    const castMembers = nightlyProfile.dream_cast ?? [];
    const REPLICATE_KEY = Deno.env.get('REPLICATE_API_TOKEN');
    for (const member of castMembers) {
      if (
        !member.description &&
        member.thumb_url &&
        member.thumb_url.startsWith('http') &&
        REPLICATE_KEY
      ) {
        try {
          const descPrompt =
            member.role === 'pet'
              ? 'Describe this animal: species, breed, coat color/pattern, fur texture, eye color, ear shape, size, build, age, distinguishing features. 2-3 sentences.'
              : 'Describe this person for an AI artist creating a stylized character. Include: exact age estimate, face shape, eye color, hair (exact color, length, texture, style), facial hair if any, skin tone, build, clothing colors/style, distinguishing features (glasses, freckles, jewelry, tattoos). 3 sentences max. Be EXTREMELY specific.';
          const createRes = await fetch(
            'https://api.replicate.com/v1/models/meta/llama-3.2-90b-vision/predictions',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${REPLICATE_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                input: { image: member.thumb_url, prompt: descPrompt, max_tokens: 300 },
              }),
            }
          );
          if (!createRes.ok) throw new Error(`Replicate ${createRes.status}`);
          const pred = await createRes.json();
          for (let i = 0; i < 30; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
              headers: { Authorization: `Bearer ${REPLICATE_KEY}` },
            });
            const pData = await poll.json();
            if (pData.status === 'succeeded') {
              member.description = (
                Array.isArray(pData.output) ? pData.output.join('') : (pData.output ?? '')
              ).trim();
              console.log(
                `[nightly-dreams] Described cast ${member.role}:`,
                member.description.slice(0, 60)
              );
              // Capture for observability
              if (!visionDescription) {
                visionDescription = member.description;
              }
              break;
            }
            if (pData.status === 'failed') throw new Error(pData.error);
          }
        } catch (descErr) {
          console.warn(
            `[nightly-dreams] Failed to describe cast ${member.role}:`,
            (descErr as Error).message
          );
          fallbackReasons.push(`cast_describe_failed:${member.role}:${(descErr as Error).message}`);
        }
      }
    }
    const describedCastMembers = castMembers.filter(
      (m: DreamCastMember) => m.description && m.thumb_url && m.thumb_url.startsWith('http')
    );

    // Roll the dream algorithm (path selection + cast + personal elements)
    const dreamRoll = rollDream(
      describedCastMembers,
      nightlyMedium,
      force_cast_role,
      force_nightly_path
    );
    const {
      nightlyPath,
      composition,
      compositionMode,
      castMembers: selectedCast,
      includeLocation,
    } = dreamRoll;
    // Character renders MUST be stylized art mediums — realistic mediums
    // (hyperreal / render / photography) push Flux into "generic adult"
    // proportions (older + bulkier + wrong hair) that fight every face-swap
    // axis we set. The stylization is what lets face swap land cleanly on
    // top of a rendered character. Scene-only renders still allow realistic
    // mediums; this ban is character-path only.
    const REALISTIC_BANNED_FOR_CHARACTER = new Set(['hyperreal', 'render', 'photography']);
    if (
      composition === 'character' &&
      !force_medium &&
      REALISTIC_BANNED_FOR_CHARACTER.has(nightlyMedium.key)
    ) {
      const oldKey = nightlyMedium.key;
      nightlyMedium = await resolveMediumFromDb(
        'dream_eligible_face_swap',
        undefined,
        recentMediums
      );
      baseMedium = nightlyMedium;
      resolvedMediumKey = nightlyMedium.key;
      console.log(
        `[nightly-dreams] character path: re-rolled realistic medium '${oldKey}' -> stylized '${nightlyMedium.key}'`
      );
    }

    // Scene-composition medium gate (mig 213). When the dream rolls
    // pure_scene or epic_tiny, re-roll the medium from the curated
    // "lush layered" subset (canvas / photography / hyperreal / render /
    // illustration by default). Toggle membership via SQL — no code deploy
    // needed: UPDATE dream_mediums SET is_scene_eligible = true|false ... .
    // The model is also intersected with engine_config.scene_eligible_models
    // later in the flow (search 'sceneEligibleModels' below).
    const isSceneComposition = composition === 'pure_scene' || composition === 'epic_tiny';
    if (isSceneComposition && !force_medium && !nightlyMedium.isSceneEligible) {
      const oldKey = nightlyMedium.key;
      nightlyMedium = await resolveMediumFromDb('dream_eligible_scene', undefined, recentMediums);
      baseMedium = nightlyMedium;
      resolvedMediumKey = nightlyMedium.key;
      console.log(
        `[nightly-dreams] scene path (${composition}): re-rolled medium '${oldKey}' -> scene-eligible '${nightlyMedium.key}'`
      );
    }

    // Capture for the post-try scene-composition model gate.
    resolvedComposition = composition;
    resolvedMediumAllowedModels = nightlyMedium.allowedModels;
    resolvedMediumSceneModels = nightlyMedium.sceneEligibleModels;

    const castPick = selectedCast.length > 0 ? (selectedCast[0] as DreamCastMember) : null;
    console.log(
      '[nightly-dreams] Dream roll:',
      nightlyPath,
      composition,
      compositionMode,
      '| cast:',
      selectedCast.map((m) => m.role),
      '| location:',
      includeLocation
    );

    // Assemble scene from modular pools (Scene DNA engine)
    // Apply recency filter to location picks — forces rotation through
    // user's places instead of clustering on one. With 2 places + filter,
    // locations alternate; with many places, they rotate naturally.
    let placePool = seeds.places;
    if (placePool.length > 0 && recentPlaces.length > 0) {
      const excludeSet = new Set(recentPlaces);
      const filtered = placePool.filter((p: string) => !excludeSet.has(p));
      // Keep filtered pool only if it has something; otherwise full list
      if (filtered.length >= 1) placePool = filtered;
    }
    const userPlace =
      includeLocation && placePool.length > 0
        ? placePool[Math.floor(Math.random() * placePool.length)]
        : undefined;

    // Fetch location essence card (lazy-generates on first encounter)
    let locationCard: LocationCard | null = null;
    if (userPlace && ANTHROPIC_KEY) {
      try {
        locationCard = await getLocationCard(userPlace, ANTHROPIC_KEY);
      } catch (err) {
        console.warn('[nightly-dreams] Location card failed:', (err as Error).message);
        fallbackReasons.push(`location_card_failed:${(err as Error).message}`);
      }
    }

    // (Object roll + object-location compat filter removed 2026-06-02 with
    // the whole objects feature. See project_objects_removed_2026-06-02.)

    console.log(
      '[nightly-dreams] Essence cards | place:',
      userPlace ?? 'none',
      '| locationCard:',
      locationCard ? locationCard.cinematic_phrases.length + ' phrases' : 'null'
    );
    lap('essence-cards');

    // Gender for reinforcement — single source of truth (explicit field >
    // prose), shared with castResolver + the slot pipeline. Non-pet with no
    // signal defaults to male (preserves prior behavior).
    let castGender: 'male' | 'female' | undefined;
    if (castPick && castPick.role !== 'pet') {
      castGender = resolveCastGender(castPick as DreamCastMember) ?? 'male';
    }

    // Determine render mode and face swap eligibility
    const isCharacterDream =
      composition === 'character' && castPick != null && castPick.role !== 'pet';
    const renderMode: 'natural' | 'embodied' | 'none' =
      composition === 'pure_scene' ? 'none' : nightlyMedium.characterRenderMode;
    const faceSwapEligible =
      isCharacterDream && nightlyMedium.faceSwaps && renderMode === 'natural';
    isDualFaceSwap = faceSwapEligible && selectedCast.length === 2;
    // Single human face swap = single cast, face-swap-eligible medium, and the
    // cast member is a human (not a pet — pets stay on the legacy freeform
    // brief because the slot pipeline assumes human gender/age/build).
    const isSingleHumanFaceSwap =
      faceSwapEligible && selectedCast.length === 1 && selectedCast[0]?.role !== 'pet';
    // Both single human and dual humans run through the unified character
    // slot pipeline + share the model rotation + override library.
    const isFaceSwapCharacter = isDualFaceSwap || isSingleHumanFaceSwap;
    isFaceSwapCharacterOuter = isFaceSwapCharacter;

    // Override flux fragment + directive for stylized mediums during face
    // swap — front-loads "realistic human face" so cdingram's swap doesn't
    // fight cartoon-eye proportions. Override values live on dream_mediums
    // (face_swap_directive + face_swap_flux_fragment) — see migration 154
    // and _shared/faceSwapFluxOverrides.ts. No-op when the medium has no
    // override columns set.
    // Per-medium face-swap override: replaces flux_fragment with one that
    // has explicit "NOT cartoon eyes / NOT anime eyes / NOT Disney princess"
    // language for stylized mediums (anime, fairytale). Without this, Flux
    // pulls into chibi/oversized-eye proportions that face-swap can't
    // detect. Used for BOTH single and dual face swap.
    if (faceSwapEligible) {
      const overridden = applyFaceSwapOverride(baseMedium);
      if (overridden !== baseMedium) {
        baseMedium = overridden;
        console.log(`[nightly] face swap flux+directive override for ${baseMedium.key}`);
      }
    }

    // Pre-pick the base render model for face-swap character renders
    // (single human OR dual). Rotation, so we can conditionally swap the
    // medium fluxFragment BEFORE the slot pipeline assembles the prompt:
    //   - flux-dev               — honors the medium's face_swap fragment
    //   - flux-1.1-pro           — triggers curated Flux override library
    //   - flux-1.1-pro-ultra     — same as flux-1.1-pro for override; was
    //                              excluded until 2026-06-01 because dual
    //                              face-swap blew the 256 MB Supabase Edge
    //                              Function cap. Now safe: face-swap-dual
    //                              runs on Fly.io with 2 GB RAM.
    //   - gemini-2-image         — native Gemini provider; skips Flux
    //                              override library (no-op for non-Flux);
    //                              face swap verified working on the
    //                              output (matrix v2 + Fly verify).
    //   - gpt-image-2            — native OpenAI provider; same as above.
    // flux-2-dev removed 2026-06-01 — banned globally via the
    // NIGHTLY_BANNED_MODELS gate downstream; in-rotation would waste the
    // curated-override decision tree before the ban gate re-picked.
    // Same rotation + override library applies to single and dual so the
    // two paths stay in parity. For non-Flux models the override library
    // is a no-op (they don't use flux_fragment).
    if (isFaceSwapCharacter) {
      if (force_model) {
        faceSwapPrePickedModel = force_model;
      } else {
        const FACE_SWAP_MODELS = [
          'black-forest-labs/flux-dev',
          'black-forest-labs/flux-1.1-pro',
          'black-forest-labs/flux-1.1-pro-ultra',
          'google/gemini-2-image',
          'openai/gpt-image-2',
        ];
        faceSwapPrePickedModel =
          FACE_SWAP_MODELS[Math.floor(Math.random() * FACE_SWAP_MODELS.length)];
      }
      console.log(
        `[nightly] face-swap character model (${selectedCast.length === 2 ? 'dual' : 'single'}): ${faceSwapPrePickedModel}`
      );
      // Per-model curated medium-fragment override library. Same library
      // serves single and dual — fragments are subject-agnostic.
      const modelOverride = pickFaceSwapModelOverride(
        faceSwapPrePickedModel,
        nightlyVibe?.key ?? null
      );
      if (modelOverride) {
        baseMedium = { ...baseMedium, fluxFragment: modelOverride };
        console.log(
          `[nightly] face-swap ${faceSwapPrePickedModel}: applied curated medium override (${modelOverride.length} chars)`
        );
      }
    }

    const isDualCharacter = composition === 'character' && selectedCast.length === 2;
    const isSingleCharacter = composition === 'character' && selectedCast.length === 1;
    const dualAction =
      isDualFaceSwap || isDualCharacter
        ? pickDualAction(
            selectedCast.find((c) => c.role === 'plus_one')?.relationship,
            force_dual_pool
          )
        : null;
    const singleActionObj = isSingleCharacter ? pickSingleAction(force_single_pool) : null;
    const singleAction = singleActionObj?.pose ?? null;
    const needsEpicBackdrop = singleActionObj?.needsEpicBackdrop ?? false;
    console.log(
      `[nightly-dreams] DUAL DEBUG: composition=${composition} isChar=${isCharacterDream} castPick=${castPick?.role} selectedCast=${selectedCast.length} faceSwap=${faceSwapEligible} isDual=${isDualFaceSwap} medium=${nightlyMedium.key} renderMode=${renderMode}${dualAction ? ` action="${dualAction}"` : ''}`
    );

    // ── Resolve character descriptions: single source of truth per render mode ──
    // Natural -> raw cast description (face swap handles identity)
    // Embodied -> pre-transformed medium-native description (LEGO minifig, clay figure, etc.)
    // ALL downstream prompt construction uses resolvedCast.promptDesc exclusively.
    function resolveCharacterDesc(member: DreamCastMember): string {
      return member.description ?? (member.role === 'pet' ? 'a small creature' : 'a figure');
    }

    const resolvedCast = selectedCast.map((m) => ({
      role: m.role,
      rawDescription: (m as DreamCastMember).description ?? '',
      promptDesc: resolveCharacterDesc(m as DreamCastMember),
      gender: (m as DreamCastMember).gender,
    }));
    // Capture expected genders for post-pipeline validation gate
    if (resolvedCast.length > 0) {
      console.log(
        '[nightly-dreams] Resolved cast (' + renderMode + '):',
        resolvedCast.map((c) => c.role + ':' + c.promptDesc.slice(0, 60)).join(' | ')
      );
    }

    // ── Relationship tone for multi-cast scenes ─────────────────────────
    // When 2+ cast are in a scene, the TONE of their interaction should
    // match their real-life relationship. self+plus_one(significant_other)
    // = romantic; self+plus_one(friend/sibling) = playful; self+parent/
    // child/grandchild = family; self+pet = human-animal bond.
    const relationshipTone = buildRelationshipTone(selectedCast);
    if (relationshipTone) {
      console.log('[nightly-dreams] relationship tone:', relationshipTone.kind);
    }

    dreamSubject = assembleScene({
      renderMode,
      faceSwapEligible,
      compositionMode,
      includeLocation,
      userPlace,
      locationCard: locationCard ?? undefined,
      castGender,
      moodAxis: moods,
      // Biome CLASS drives scene-DNA scope filtering (Phase 2) — keeps the
      // assembler's foreground/midground/weather/signature coherent with the
      // location (no canals/driftwood/lightning-deer in a café).
      biome: locationCard?.biome ?? undefined,
    });

    if (dream_wish) {
      dreamSubject += `. DREAM WISH (make this the heart): "${dream_wish}"`;
    }

    console.log('[nightly-dreams] Scene DNA:', dreamSubject.slice(0, 200));
    lap('nightly-subject');

    // ── Scene cluster only — the other entropy axes (scene angle, mood
    // twist, narrator hint) were stripped 2026-04-30 because they piled
    // incompatible elements onto the prompt (mirror reflections, ornate
    // borders, ice storms in tropics) producing kitchen-sink AI collages.
    // Cohesion > entropy. The location-specific scene cluster is the one
    // signal worth keeping.
    const sceneCluster = pickSceneCluster(userPlace, force_cluster_kind);
    console.log(
      `[nightly-dreams] scene cluster (${force_cluster_kind ?? 'blended'}): "${sceneCluster?.slice(0, 80) ?? 'none'}"`
    );
    const entropyBlock = sceneCluster
      ? `\nSCENE FOCUS — the specific spot within ${userPlace} where this moment happens:\n${sceneCluster}\nUse this as the anchor for the scene. Build the moment around it.\n`
      : '';

    // Step 2: Shared context for both cast and non-cast paths
    const SHOT_DIRECTIONS = [
      'extreme low angle looking up, dramatic forced perspective, towering scale',
      'tilt-shift miniature effect, shallow depth of field, stacked depth layers',
      'silhouette against towering backlit sky, rim lighting, dramatic contrast',
      'macro lens extreme close-up, impossibly detailed textures, creamy bokeh background',
      'looking down from height into scene below, depth receding downward',
      'through rain-covered glass, soft distortion, reflections overlapping the scene',
      'dutch angle, dramatic tension, off-kilter framing',
      'tall environmental shot, subject small at base, towering environment stacked above',
      'looking upward through canopy or architecture, light filtering down from above',
      'symmetrical dead-center composition, Wes Anderson framing, obsessive balance',
      'long exposure motion blur, streaks of light, frozen and flowing simultaneously',
      'reflection in puddle or glass, scene doubled top and bottom',
      'extreme depth, foreground sharp, background stretching to infinity',
      'candid snapshot feeling, slightly off-center, caught mid-moment, deep perspective',
      'cascading depth, layers receding top to bottom through the frame',
    ];
    const shotDirection = SHOT_DIRECTIONS[Math.floor(Math.random() * SHOT_DIRECTIONS.length)];

    // Location is now the scene identity (baked into dreamSubject via assembleScene).
    // Objects flow through assembleScene() naturally — no enforcement in the brief.
    const avoidList =
      nightlyProfile.avoid && nightlyProfile.avoid.length > 0
        ? `\nNEVER INCLUDE: ${nightlyProfile.avoid.join(', ')}`
        : '';

    // ── DREAM COMPOSITION PATHS ──
    const mediumStyle = nightlyMedium.key.replace(/_/g, ' ');

    const castDescBlock =
      resolvedCast.length > 0
        ? resolvedCast
            .map((rc, i) => {
              if (resolvedCast.length === 1) {
                return renderMode === 'embodied'
                  ? `THE CHARACTER (already transformed into ${mediumStyle} style — place them in the scene as-is):\n${rc.promptDesc}`
                  : `THE MAIN CHARACTER (include these traits but STYLIZED — NOT photorealistic):\n${rc.promptDesc}`;
              }
              if (isDualFaceSwap) {
                const side = i === 0 ? 'LEFT SIDE OF FRAME' : 'RIGHT SIDE OF FRAME';
                return `${side} (${rc.role} — locked to this side, do NOT swap):\n${rc.promptDesc}`;
              }
              return `CHARACTER ${i + 1} (${rc.role}):\n${rc.promptDesc}`;
            })
            .join('\n\n')
        : '';
    const castInstruction =
      selectedCast.length > 1
        ? `Render ALL ${selectedCast.length} characters as ${mediumStyle} CHARACTERS — stylized, artistic. Show them TOGETHER interacting in the scene.`
        : selectedCast.length === 1
          ? `Render them as a ${mediumStyle} CHARACTER — stylized, illustrated, artistic. NOT a real photograph.`
          : '';

    const shortCastDesc = resolvedCast.length > 0 ? resolvedCast[0].promptDesc.split(',')[0] : null;

    // ── Biome-driven axes + curated iconic anchor ─────────────────────
    // ONE source of truth for: pillar (location identity) + axes (TIME /
    // WEATHER / CAMERA / PHENOMENON). Used by all three composition
    // branches: character, epic_tiny, pure_scene. For character path the
    // pillar is the BACKDROP; for pure_scene the pillar IS the subject.
    let iconicAnchor: string | null = null;
    let biomeKey: string | null = null;
    // Per-location bespoke biome (migration 170). When set, it OVERRIDES
    // the shared biomeAxes lookup so atmospheres feel recognizable to
    // travelers who have been to that specific place.
    let bespokeBiome: ReturnType<typeof getBiomeConfig> | null = null;
    if (userPlace) {
      const [{ data: spots }, { data: locCard }] = await Promise.all([
        supabase
          .from('location_iconic_spots')
          .select('spot_text')
          .eq('location_key', userPlace)
          .eq('is_active', true),
        supabase
          .from('location_cards')
          .select('biome, biome_config')
          .eq('name', userPlace)
          .maybeSingle(),
      ]);
      if (spots && spots.length > 0) {
        iconicAnchor = spots[Math.floor(Math.random() * spots.length)].spot_text;
      }
      biomeKey = locCard?.biome ?? null;
      // Per-location biome_config override — validated by the single shared gate
      // (isValidBiomeConfig). Valid → used as the bespoke biome; malformed →
      // falls back to the shared class config (getBiomeConfig) below.
      const cfg = locCard?.biome_config;
      if (isValidBiomeConfig(cfg)) {
        bespokeBiome = cfg as unknown as ReturnType<typeof getBiomeConfig>;
      }
    }
    // Backfill-at-runtime: no stored biome → derive a coherent biome from the
    // location's tags rather than silently defaulting to tropical_coastal (the
    // bug that gave ~89% of locations beach atmosphere). Skip when a bespoke
    // biome_config is present. Unmapped locations are logged, not silently
    // tropical-ized.
    if (!biomeKey && !bespokeBiome) {
      const tagBiome = resolveBiomeFromTags(locationCard?.tags ?? null);
      if (tagBiome) {
        biomeKey = tagBiome;
      } else {
        console.warn(
          `[nightly-dreams] biome UNMAPPED for "${userPlace ?? 'none'}" tags=${JSON.stringify(
            locationCard?.tags ?? []
          )} — using neutral default`
        );
        fallbackReasons.push(`biome_unmapped:${userPlace ?? 'none'}`);
      }
    }
    const biomeConfig = bespokeBiome ?? getBiomeConfig(biomeKey);
    // Scene scope (Phase 3) — intimate interiors must NOT be framed as "EPIC,
    // VAST" vistas. Drives the brief framing below so a café/garden reads
    // intimate, not as a vast landscape with a tiny figure.
    const INTIMATE_BIOMES = new Set(['interior_intimate', 'zen_garden']);
    const isIntimateScene = INTIMATE_BIOMES.has(biomeKey ?? '');
    const pickAxis = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const timeAxis = pickAxis(biomeConfig.TIME);
    const weatherAxis = pickAxis(biomeConfig.WEATHER);
    const cameraAxis = pickAxis(biomeConfig.CAMERA);
    const phenomenaAxis = pickAxis(biomeConfig.PHENOMENA);
    console.log(
      `[nightly-dreams] biome="${biomeKey || '(default)'}"${bespokeBiome ? ' [BESPOKE]' : ''} anchor="${iconicAnchor || '(none)'}" composition=${composition} time="${timeAxis.split(' — ')[0]}"`
    );

    let nightlyBrief: string;
    let slotPipelineHandled = false;
    let slotPipelineFallbacks: string[] = [];

    // ── Unified character face-swap slot pipeline ──
    // Handles BOTH single-human and dual-character face swap. Sonnet only
    // fills controlled slots; geometry/identity/gender/(side for dual) are
    // hard-baked downstream. Eliminates the freeform failure modes.
    // Pet single-character keeps using the legacy freeform brief below.
    if (composition === 'character' && isFaceSwapCharacter) {
      try {
        // Single-cast action comes from pickSingleAction (pose only — we drop
        // the legacy needsEpicBackdrop signal because the slot pipeline owns
        // its own framing). Dual-cast action comes from pickDualAction.
        const action = selectedCast.length === 2 ? dualAction : (singleAction ?? null);
        const slotResult = await runCharacterSlotPipeline(
          {
            cast: resolvedCast.map((rc, i) => ({
              role: rc.role,
              promptDesc: rc.promptDesc,
              age: (selectedCast[i] as DreamCastMember).age ?? null,
              physicalSummary: (selectedCast[i] as DreamCastMember).physical_summary ?? null,
              // Pass the explicit gender through so the slot pipeline locks the
              // body's sex to the cast photo (fixes male-face-on-female-body).
              gender: (selectedCast[i] as DreamCastMember).gender ?? null,
            })),
            iconicAnchor,
            userPlace: userPlace ?? null,
            timeAxis,
            weatherAxis,
            phenomenaAxis,
            wardrobeAnchor:
              bespokeBiome &&
              Array.isArray((bespokeBiome as unknown as { WARDROBE?: string[] }).WARDROBE) &&
              (bespokeBiome as unknown as { WARDROBE: string[] }).WARDROBE.length > 0
                ? pickAxis((bespokeBiome as unknown as { WARDROBE: string[] }).WARDROBE)
                : null,
            mediumFluxFragment: baseMedium.fluxFragment,
            vibeDirective: applyVibeGenderModifier(
              nightlyVibe.key,
              nightlyVibe.directive,
              castGender ?? null
            ),
            avoidList,
            action,
          },
          ANTHROPIC_KEY!
        );
        sonnetBrief = slotResult.briefUsed;
        sonnetRawResponse = slotResult.rawResponse;
        finalPrompt = slotResult.assembledPrompt;
        slotPipelineFallbacks = slotResult.fallbackReasons;
        slotPipelineHandled = true;
        console.log(
          `[nightly-dreams] character slot pipeline (${selectedCast.length}-cast): retries=${slotResult.retries} fallbacks=${slotResult.fallbackReasons.length}`
        );
      } catch (slotErr) {
        console.error(
          '[nightly-dreams] character slot pipeline threw — falling back to freeform brief:',
          (slotErr as Error).message
        );
        fallbackReasons.push(`character_slot_pipeline_threw:${(slotErr as Error).message}`);
      }
    }

    if (composition === 'character') {
      if (faceSwapEligible) {
        const faceLockPhrase = isDualFaceSwap
          ? 'two people, three-quarter view to camera, both faces visible to camera, person on left side, person on right side, clear gap between them, NEITHER facing away, NEITHER from behind, NO back view, NO back of head, both heads turned toward camera'
          : 'three-quarter view to camera, face visible to camera, eyes and nose visible, head turned toward camera, NO back view, NO back of head, NO silhouette, NOT facing away';
        const dualSepRule = isDualFaceSwap
          ? `\n- ━━━ ROLE-TO-SIDE LOCK (NON-NEGOTIABLE) ━━━\n- The FIRST cast member (${resolvedCast[0]?.role ?? 'self'}) MUST be on the LEFT half of the frame.\n- The SECOND cast member (${resolvedCast[1]?.role ?? 'plus_one'}) MUST be on the RIGHT half of the frame.\n- DO NOT swap their positions. Reversing breaks the face-swap pipeline (faces land on wrong bodies → gender swap disaster).\n- Clear ~2-3 ft gap between them. NO overlap across the midline.\n- BOTH at SAME VERTICAL HEIGHT — both standing OR both sitting OR both crouching. NEVER one tall + one short.\n- BOTH faces three-quarter to camera. NO back views. NO profiles. NO faces away.\n- Both heads at the SAME Y-axis line so the L/R crop captures each face cleanly.`
          : '';
        const stylizedMediums = new Set(['storybook', 'pencil', 'fairytale', 'anime']);
        const needsRealisticFaces = stylizedMediums.has(baseMedium.key) && faceSwapEligible;
        const faceRealismRule = needsRealisticFaces
          ? '\nFACE REALISM — CRITICAL: faces must have realistic human proportions with detailed eyes, nose, mouth, and jawline. Do NOT simplify faces into cartoon, chibi, or dot-eye proportions. Do NOT draw thick or prominent eyebrows — keep eyebrows subtle, thin, and natural. Scene and clothing can be fully stylized but FACES must look like real people with natural brow lines.'
          : '';
        const faceDescRule = isDualFaceSwap
          ? 'Do NOT over-describe faces. Push detail into clothing, pose, and environment.'
          : 'Do NOT over-describe the face. Just "natural human face" is enough. Push detail into clothing, pose, and environment.';

        const framingLine = isDualFaceSwap
          ? 'Medium shot — both characters waist-up, filling the frame. NOT a wide establishing shot. Characters must NOT be dwarfed by architecture or scenery.'
          : 'Character visible from waist up, filling at least 50% of frame height.';
        const faceAngleLine = isDualFaceSwap
          ? 'Three-quarter view on both faces — both angled slightly toward the VIEWER, like a candid movie still. Eyes and nose visible on both. NOT facing each other. NOT backs to camera. NEVER looking away from camera. NEVER gazing at scenery or horizon.'
          : 'Three-quarter view — eyes and nose visible but character is NOT looking at the camera.';
        const staticLine = isDualFaceSwap
          ? 'Characters are STATIONARY — standing, sitting, leaning. NO walking, NO movement through the scene.'
          : '';
        const cameraLine = isDualFaceSwap
          ? 'Eye-level camera angle. NEVER extreme low angle looking up. Warm atmospheric lighting — NEVER harsh overhead or flat institutional light.'
          : '';
        const connectionLine = isDualFaceSwap
          ? 'Both characters should feel CONNECTED — sharing the same moment, reacting to the same world. Not doing separate isolated activities.'
          : '';

        nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (70-100 words, comma-separated).

STRUCTURE:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (50% of words)
3. SUBJECT FRAMING (must be early in the prompt)
4. CHARACTER${isDualFaceSwap ? 'S' : ''} (20% of words)
5. CAMERA + MOOD (20% of words)
6. End with: no text, no words, no letters, no watermarks, ultra detailed

━━━ THE BACKDROP (NON-NEGOTIABLE) ━━━
The character${isDualFaceSwap ? 's are' : ' is'} placed at this specific location: ${iconicAnchor || userPlace || 'the location'}

This is the LOCKED BACKDROP. Do NOT substitute another feature of ${userPlace || 'the location'}. The backdrop must be RECOGNIZABLE as ${iconicAnchor || userPlace || 'the location'}.

ATMOSPHERIC CONDITIONS (axes — apply ALL — these alter LIGHT, WEATHER, FRAMING, never the backdrop or characters):
- TIME: ${timeAxis}
- WEATHER: ${weatherAxis}
- CAMERA: ${cameraAxis}
- ATMOSPHERIC PHENOMENON: ${phenomenaAxis}

MANDATORY — include this EXACT phrase unchanged somewhere in the prompt:
"${faceLockPhrase}"

COMPOSITION RULES:${dualSepRule}
- ${framingLine}
- ${faceAngleLine}
- ${staticLine}
- ${cameraLine}
- ${connectionLine}
- Characters grounded in the scene — environmental lighting, casting shadows. They exist IN this world.
- Describe BODY POSE and CLOTHING only. NEVER describe eye direction, gaze, or where they are looking.${faceRealismRule}
${dualAction ? `\nACTION IN SCENE (body language only):\n"${dualAction}"\nUse this for body pose. Do NOT describe eye direction.\n` : ''}${singleAction ? `\nACTION IN SCENE${needsEpicBackdrop ? ' (POSED PORTRAIT)' : ''}:\n"${singleAction}"\nUse this exact action. Adapt it to fit the medium and scene. Do NOT describe eye direction; the action describes what the body is doing.\n${needsEpicBackdrop ? '\nBACKDROP RULE — NON-NEGOTIABLE: This is a POSED PHOTO. The character is posing for the camera, so the SCENE/BACKDROP must be the reason this photo exists. Push the location HARD: pull the most striking elements from the scene DNA above (towering scale, dramatic sky, magical atmosphere, iconic landmark, sweeping vista, unusual color, theatrical light). Use AT LEAST 3 specific environmental details. Do NOT default to a generic backdrop — this scene is what makes the photo memorable.\n' : ''}` : ''}
CHARACTER${isDualFaceSwap ? 'S' : ''} IN THE SCENE:
${castDescBlock}
${faceDescRule}

${entropyBlock}
MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode === 'balanced' ? 'natural cinematic framing' : compositionMode.replace(/_/g, ' ')}
${compositionMode !== 'balanced' ? '- Obey this composition style in camera framing and scene layout' : ''}

RULES:
- SCENE FIRST, then the mandatory face phrase, then character details.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt. Compose with depth — stack layers top to bottom, not left to right.
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;
      } else {
        // Non-face-swap brief: scene + character description must come through accurately
        const isDualCast = resolvedCast.length === 2;
        const castWordsTarget = isDualCast ? '40-50 words' : '25-35 words';
        const sceneWordsTarget = isDualCast ? '40-50 words' : '50-60 words';
        nightlyBrief = `You are a cinematic ${mediumStyle} artist. Write a Flux AI prompt (90-130 words, comma-separated).

CRITICAL STRUCTURE — follow this order EXACTLY:
1. Start with: "${baseMedium.fluxFragment}"
2. SCENE/ENVIRONMENT (${sceneWordsTarget})
3. CHARACTER${isDualCast ? 'S' : ''} placed naturally in the scene (${castWordsTarget} — this MUST be detailed)
4. CAMERA + MOOD (15-20 words)
5. End with: no text, no words, no letters, no watermarks, ultra detailed

━━━ THE BACKDROP (NON-NEGOTIABLE) ━━━
The character${isDualCast ? 's are' : ' is'} placed at this specific location: ${iconicAnchor || userPlace || 'the location'}

This is the LOCKED BACKDROP. Do NOT substitute another feature of ${userPlace || 'the location'}. The backdrop must be RECOGNIZABLE as ${iconicAnchor || userPlace || 'the location'}.

ATMOSPHERIC CONDITIONS (axes — apply ALL):
- TIME: ${timeAxis}
- WEATHER: ${weatherAxis}
- CAMERA: ${cameraAxis}
- ATMOSPHERIC PHENOMENON: ${phenomenaAxis}

CHARACTER${isDualCast ? 'S' : ''} IN THE SCENE:
${castDescBlock}
${castInstruction}
${dualAction ? `\nACTION IN SCENE (both characters):\n"${dualAction}"\nUse this for body pose.\n` : ''}${singleAction ? `\nACTION IN SCENE${needsEpicBackdrop ? ' (POSED PORTRAIT)' : ''}:\n"${singleAction}"\nUse this exact action verbatim. Adapt it to fit the medium aesthetic but keep the verbs.\n${needsEpicBackdrop ? '\nBACKDROP RULE — NON-NEGOTIABLE: This is a POSED PHOTO. The character is posing for the camera, so the SCENE/BACKDROP is the reason this photo exists. Push the location HARD: pull the most striking elements from the scene DNA (towering scale, dramatic sky, magical atmosphere, iconic landmark, sweeping vista, unusual color, theatrical light). Use AT LEAST 3 specific environmental details.\n' : ''}` : ''}${relationshipTone ? `\n${relationshipTone.block}\n` : ''}
CAST DESCRIPTION RULES — NON-NEGOTIABLE:
- PRESERVE every identifying physical trait from the description above: age, gender, hair color and length, eye color, beard/no beard, build, complexion. These traits are how the user recognizes themselves and their loved ones — do NOT compress them away.
${
  isDualCast
    ? `- BOTH characters must be clearly visible and clearly distinguishable. Describe ${resolvedCast[0].role} (${resolvedCast[0].promptDesc.split(',')[0].slice(0, 60)}) AND ${resolvedCast[1].role} (${resolvedCast[1].promptDesc.split(',')[0].slice(0, 60)}) with their full identifying traits.
- Two complete people in the frame, both faces visible, neither hidden, neither merged with the other.`
    : '- The character must be clearly visible with their identifying traits showing.'
}
- Do NOT generalize ("a man" / "a woman") — be SPECIFIC ("mid-30s man with sandy brown hair and full medium beard" / "mid-40s woman with shoulder-length wavy brown hair with highlights").

${entropyBlock}
MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

COMPOSITION: ${compositionMode === 'balanced' ? 'natural cinematic framing' : compositionMode.replace(/_/g, ' ')}

RULES:
- SCENE FIRST in the prompt. The environment must be rich, detailed, layered.
- Include "foreground midground background stacked top to bottom, layered depth" in the prompt.
- The character${isDualCast ? 's are' : ' is'} actively DOING something interesting in the world. Dynamic action, not standing still.
- Character${isDualCast ? 's' : ''} visible from front or three-quarter angle — never back-turned or rear-view.
- ${
          isDualCast
            ? 'BOTH characters MUST be present in the scene. Wide and far shots are welcome — be creative with framing — but two distinct people must be visible somewhere in the frame. NOT one person alone. NOT empty scenery. The cast description above is non-negotiable: both individuals must appear.'
            : 'The character MUST be present and visible in the scene. Wide and far shots are welcome.'
        }
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;
      }
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-cast-character',
        nightlyPath,
        castRoles: selectedCast.map((m) => m.role),
      };
    } else if (composition === 'epic_tiny') {
      const tinyDesc =
        resolvedCast.length > 1
          ? `tiny ${mediumStyle}-style figures: ${resolvedCast.map((rc) => rc.promptDesc.split(',')[0]).join(' and ')}`
          : `a tiny ${mediumStyle}-style ${shortCastDesc}`;
      nightlyBrief = `You are a cinematographer composing an ${isIntimateScene ? 'intimate, richly detailed' : 'EPIC, VAST'} scene. Write a Flux AI prompt (60-90 words, comma-separated).

MEDIUM: ${baseMedium.fluxFragment}

STYLE GUIDE (follow this closely):
${nightlyMedium.directive}

DREAM SCENE${includeLocation && userPlace ? ` (set in ${userPlace} — this is the location, honor it)` : ''} — use as inspiration, SELECT and SUBORDINATE:
${dreamSubject}

SELECT AND SUBORDINATE (critical):
- The DREAM SCENE contains many raw elements. Pick ONE dominant environmental anchor. Pick 2-3 supporting details that harmonize with it. Discard anything that competes or clashes.
- A strong single landscape with harmonious supporting details beats a busy one with everything crammed in.
- If the scene lists icicles AND desert dunes AND cable cars — pick the ONE that fits the vibe and location, skip the others.

${
  isIntimateScene
    ? `Within the scene, present but unobtrusive: ${tinyDesc}. The intimate setting itself is the focus.`
    : `Somewhere in this vast scene, barely visible: ${tinyDesc}. They occupy less than 5% of the image. The scene is EVERYTHING.`
}
${relationshipTone && selectedCast.length >= 2 ? `\n${relationshipTone.block}\n` : ''}
CAMERA: ${shotDirection}
${entropyBlock}
MOOD: ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

Write the prompt:
1. Start with the art medium
2. Spend 90% of words on the ENVIRONMENT — architecture, physics, materials, light, weather
3. Mention the tiny ${selectedCast.length > 1 ? 'figures' : 'character'} in ONE short phrase at the very end
4. End with: no text, no words, no letters, no watermarks, hyper detailed
Output ONLY the prompt.`;
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-cast-epic',
        nightlyPath,
        castRoles: selectedCast.map((m) => m.role),
      };
    } else {
      // ── Pure scene — uses upstream iconicAnchor + biomeConfig + axes ──
      const banLines = biomeConfig.BANS.map((b) => `- ${b}`).join('\n');
      nightlyBrief = `You are a cinematographer composing a JAW-DROPPING postcard of ${userPlace || 'the location'}. Write a Flux AI prompt (70-100 words, comma-separated).

━━━ THE SUBJECT (NON-NEGOTIABLE) ━━━
The render MUST depict: ${iconicAnchor || userPlace || 'the location'}

This is the LOCKED SUBJECT of the image. Do NOT substitute another feature of ${userPlace || 'the location'} (no swapping in different cliffs, valleys, beaches, or landmarks). Do NOT add multiple competing iconic features. The image IS this specific view — render this view, enhanced and dramatized.

MEDIUM: ${baseMedium.fluxFragment}

SUBJECT FRAMING: ${biomeConfig.SUBJECT_RULE}

VARIATION AXES (these layer ONTO the locked subject above — they alter LIGHT, ATMOSPHERE, and CAMERA ONLY, never the subject):
- TIME: ${timeAxis}
- WEATHER: ${weatherAxis}
- CAMERA: ${cameraAxis}
- ATMOSPHERIC PHENOMENON: ${phenomenaAxis}

ENHANCING LANGUAGE (mandatory):
- DEFINED LIGHT SOURCE — name the light explicitly (direct sun, warm lamplight, neon glow, golden rim, sharp shadow play, glittering reflections, god-rays, etc.) — pick what fits the rolled WEATHER + TIME, not a default
- LAYERED DEPTH — rich foreground anchor + dense midground + distant background
- SATURATED COLOR — pigments cranked, palette vivid and true to THIS specific place (do not invent foliage/water that isn't there)
- DENSE DETAIL — every surface, material, texture, edge and highlight catching light, true to this location

ATMOSPHERIC RULE — WEATHER axis is the SOLE source of truth for atmosphere. Render exactly the conditions specified by the rolled WEATHER. Do NOT add fog, mist, haze, god-rays, or atmospheric particles unless the WEATHER axis asks for them. Do NOT strip them if it does. WEATHER decides — full stop.

MOOD (tone only — do NOT let mood words pull in new subjects/scenes):
${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

ABSOLUTELY BANNED:
${banLines}

Render the LOCKED SUBJECT above, lit by the rolled TIME + WEATHER + PHENOMENON, framed by the rolled CAMERA. The image must NAME the locked subject explicitly in the prompt (e.g., "Nā Pali Coast emerald cliffs and Pacific surf, ..." not "Hawaiian rainforest canyon, ...").

End with: no text, no words, no letters, no watermarks, hyper detailed, masterwork composition.

Output ONLY the prompt.`;
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-pure-scene',
        biome: biomeKey || null,
        anchor: iconicAnchor || null,
        time: timeAxis.split(' — ')[0],
        weather: weatherAxis.split(',')[0],
      };
    }

    if (slotPipelineHandled) {
      // Slot pipeline already populated finalPrompt — register its fallbacks
      // and skip the freeform Sonnet call so we don't overwrite the prompt.
      if (slotPipelineFallbacks.length > 0) fallbackReasons.push(...slotPipelineFallbacks);
    } else {
      try {
        const sonnet = await callSonnet(nightlyBrief, ANTHROPIC_KEY, isDualFaceSwap ? 350 : 300);
        sonnetBrief = sonnet.brief;
        sonnetRawResponse = sonnet.rawResponse;
        if (sonnet.text.length < 20) throw new Error('too short');
        finalPrompt = sonnet.text;
      } catch (err) {
        fallbackReasons.push(`nightly_sonnet_failed:${(err as Error).message}`);
        finalPrompt = `${baseMedium.fluxFragment}, ${dreamSubject}, ${nightlyVibe.directive && nightlyVibe.directive.length > 0 ? nightlyVibe.directive.split('.')[0] : 'dramatic atmosphere'}, no text, hyper detailed`;
      }
    }

    // Post-process: ensure location name appears in final prompt (Sonnet sometimes drifts)
    if (
      includeLocation &&
      userPlace &&
      !finalPrompt.toLowerCase().includes(userPlace.toLowerCase())
    ) {
      finalPrompt = `set in ${userPlace}, ` + finalPrompt;
    }

    // Post-process: strip contemplative/directional/interaction language for dual face swap.
    // Skipped when slot pipeline ran — assembled prompt is clean already.
    if (isDualFaceSwap && !slotPipelineHandled) {
      finalPrompt = finalPrompt
        .replace(/looking (out )?(at|toward|into|across|over|up at) [^,]+/gi, '')
        .replace(/gazing (at|toward|into|across|over) [^,]+/gi, '')
        .replace(/overlooking [^,]+/gi, '')
        .replace(/staring (at|into|toward) [^,]+/gi, '')
        .replace(/watching [^,]+/gi, '')
        .replace(/from behind/gi, '')
        .replace(/rear view/gi, '')
        .replace(/back view/gi, '')
        .replace(/backs? to (the )?(camera|viewer)/gi, '')
        .replace(/sharing [^,]+ with /gi, '')
        .replace(/murmuring [^,]*/gi, '')
        .replace(/whispering [^,]*/gi, '')
        .replace(/turned toward (each other|the other|one another)/gi, '')
        .replace(/facing (each other|one another)/gi, '')
        .replace(/looking at (each other|one another)/gi, '')
        .replace(/leaning (in )?(toward|into|close to) (each other|the other|one another)/gi, '')
        .replace(/eye contact/gi, '')
        .replace(/locked eyes/gi, '')
        .replace(/eyes locked/gi, '')
        .replace(/standing opposite/gi, '')
        .replace(/face[- ]to[- ]face/gi, '')
        .replace(/about to kiss/gi, '')
        .replace(/leaning in for/gi, '')
        .replace(/noses (almost )?touching/gi, '')
        .replace(/,\s*,/g, ',')
        .replace(/,\s*$/g, '');
    }

    // Post-process: brute force face lock for face-swap-eligible dreams.
    // SKIPPED entirely when the slot pipeline ran — it already owns framing
    // and face visibility. Only the legacy freeform paths (pet single, or
    // dual fallback when slot threw) get these post-processing tags.
    if (faceSwapEligible && !slotPipelineHandled) {
      const realisticFaceTag = '';
      if (isDualFaceSwap) {
        // Only prepend the dual composition path for the LEGACY freeform
        // dual brief (slot pipeline threw / fell back).
        const dualPath = pickDualCompositionPath();
        const prepend = dualPath.prepend.replace('{realisticFaceTag}', realisticFaceTag);
        console.log(`[nightly] dual composition path: ${dualPath.name}`);
        finalPrompt = prepend + ' ' + finalPrompt;
      } else {
        // Single (pet, or single human falling back). Append face-visibility.
        finalPrompt += `, ${realisticFaceTag}face visible, eyes and nose visible, no back view, no silhouette`;
      }
    } else if (
      !faceSwapEligible &&
      composition === 'character' &&
      resolvedCast.length === 2 &&
      renderMode !== 'embodied'
    ) {
      // Non-face-swap dual cast (NATURAL mediums where face_swap_flux_fragment
      // is missing / faceSwaps=false): bake the SPECIFIC cast descriptions
      // into the prepend so Flux locks gender + identifying traits at the
      // front of the prompt. Without this Flux invents random pairs (two
      // girls, two boys, generic strangers). NOT applied to face-swap dual
      // (slot pipeline owns those prompts).
      //
      // SKIPPED for embodied mediums (LEGO/claymation/vinyl/pixels/animation):
      // raw natural-prose descriptions ("a friendly man in his mid-30s with
      // hazel-brown eyes...") at the front of the prompt force Flux to render
      // photoreal humans, defeating the embodied medium directive. Sonnet's
      // prompt body + the medium directive carry character identity for these.
      const shortDesc = (full: string): string => {
        // Pull the first ~16 words to get age + gender + 1-2 traits.
        const words = full.split(/\s+/).slice(0, 16).join(' ');
        return words.replace(/[.,;]+$/, '').replace(/^A\s+/i, 'a ');
      };
      const cast1 = shortDesc(resolvedCast[0].rawDescription || resolvedCast[0].promptDesc);
      const cast2 = shortDesc(resolvedCast[1].rawDescription || resolvedCast[1].promptDesc);
      finalPrompt = `${cast1} and ${cast2}, both visible in the scene, ` + finalPrompt;
    }

    // Face swap source assignment
    if (isDualFaceSwap) {
      const s = selectedCast[0] as DreamCastMember;
      const p = selectedCast[1] as DreamCastMember;
      if (
        s.thumb_url &&
        s.thumb_url.startsWith('http') &&
        p.thumb_url &&
        p.thumb_url.startsWith('http')
      ) {
        faceSwapSources = [
          { role: s.role, sourceUrl: s.thumb_url, gender: s.gender },
          { role: p.role, sourceUrl: p.thumb_url, gender: p.gender },
        ];
        console.log(`[nightly-dreams] Dual face swap: ${s.role}+${p.role} -> ${nightlyMedium.key}`);
      }
    } else if (
      faceSwapEligible &&
      castPick &&
      castPick.thumb_url &&
      castPick.thumb_url.startsWith('http') &&
      selectedCast.length === 1
    ) {
      faceSwapSource = castPick.thumb_url;
      console.log(`[nightly-dreams] Nightly face swap: ${castPick.role} -> ${nightlyMedium.key}`);
    }

    console.log(
      `[nightly-dreams] Nightly ${nightlyPath}/${composition}:`,
      finalPrompt.slice(0, 200)
    );
    lap('nightly-done');
  } catch (nightlyErr) {
    console.error(
      '[nightly-dreams] NIGHTLY PATH CRASHED:',
      (nightlyErr as Error).message,
      (nightlyErr as Error).stack
    );
    return new Response(
      JSON.stringify({ error: `Nightly path error: ${(nightlyErr as Error).message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Post-pipeline: sanitize, generate, face swap, persist ──────────────
  finalPrompt = sanitizePrompt(finalPrompt);

  // Force any bare "cave" reference to "lava cave" — generic caves drift
  // toward dungeon/temple aesthetics. Lava caves anchor back to volcanic
  // landscape (Hawaii lava tubes etc.). Negative lookbehind skips matches
  // already prefixed with "lava ".
  finalPrompt = finalPrompt.replace(/(?<!\blava\s)\bcaves?\b/gi, (m) =>
    m.toLowerCase().endsWith('s') ? 'lava caves' : 'lava cave'
  );

  const autoPicked = await pickModel('flux-dev', finalPrompt, resolvedMediumKey, resolvedVibeKey);
  // Face-swap character paths (single human OR dual) use the pre-picked
  // model rolled earlier so the medium fragment could be overridden before
  // the slot pipeline assembled the prompt. 3-way rotation: flux-dev /
  // flux-2-dev / flux-1.1-pro. Scene-only + pet single use the per-medium
  // model resolver as before.
  let pickedModel = force_model ? force_model : faceSwapPrePickedModel || autoPicked.model;

  // Scene-composition model gate (mig 213). For pure_scene + epic_tiny, the
  // pickedModel is intersected with engine_config.scene_eligible_models.
  // The medium was already re-rolled to a scene-eligible one above, so its
  // allowed_models is the second constraint. If the intersection is empty
  // (shouldn't happen in normal config; safety net), fall through to the
  // original pickedModel. Skip when force_model is set so QA / testing
  // overrides still work.
  if (
    !force_model &&
    (resolvedComposition === 'pure_scene' || resolvedComposition === 'epic_tiny')
  ) {
    // Per-medium override (mig 214) wins over engine_config global (mig 213).
    // NULL or empty → fall back to the global list. Either way the result is
    // then intersected with the medium's own allowed_models as a safety net.
    const globalSceneModels = await fetchSceneEligibleModels();
    const sceneEligibleModels =
      resolvedMediumSceneModels && resolvedMediumSceneModels.length > 0
        ? resolvedMediumSceneModels
        : globalSceneModels;
    const sceneSrcLabel =
      resolvedMediumSceneModels && resolvedMediumSceneModels.length > 0
        ? 'medium-override'
        : 'global';
    if (sceneEligibleModels.length > 0) {
      const mediumAllowed = new Set(resolvedMediumAllowedModels);
      const intersection = sceneEligibleModels.filter((m) => mediumAllowed.has(m));
      if (intersection.length > 0 && !intersection.includes(pickedModel)) {
        const oldModel = pickedModel;
        pickedModel = intersection[Math.floor(Math.random() * intersection.length)];
        console.log(
          `[nightly-dreams] scene path (${resolvedComposition}): re-picked model '${oldModel}' -> scene-eligible '${pickedModel}' (intersection of ${intersection.length}, source=${sceneSrcLabel})`
        );
      } else if (intersection.length === 0) {
        console.warn(
          `[nightly-dreams] scene gate: NO intersection between scene_eligible_models (${sceneSrcLabel}) and medium '${resolvedMediumKey}' allowed_models. Falling through to picker default '${pickedModel}'.`
        );
      }
    }
  }

  // ── Nightly-wide hard model ban ───────────────────────────────────────
  // 2026-06-01 (Kevin): flux-2-dev produces too many low-quality renders for
  // nightlies. Banned across the board — scene AND character composition,
  // regardless of medium.allowed_models. Re-picks from the medium's
  // allowed_models excluding the banned list. force_model still wins (QA /
  // testing override). Centralized here so add/remove takes one edit.
  const NIGHTLY_BANNED_MODELS = new Set(['black-forest-labs/flux-2-dev']);
  if (!force_model && NIGHTLY_BANNED_MODELS.has(pickedModel)) {
    const allowedMinusBanned = resolvedMediumAllowedModels.filter(
      (m) => !NIGHTLY_BANNED_MODELS.has(m)
    );
    if (allowedMinusBanned.length > 0) {
      const oldModel = pickedModel;
      pickedModel = allowedMinusBanned[Math.floor(Math.random() * allowedMinusBanned.length)];
      console.log(
        `[nightly-dreams] ban gate: re-picked '${oldModel}' -> '${pickedModel}' (from medium '${resolvedMediumKey}' allowed_models minus banned)`
      );
    } else {
      // No alternatives in medium's pool — last-resort safe fallback. flux-
      // 1.1-pro is a reasonable universal default (same role flux-2-dev
      // would have filled).
      const fallback = 'black-forest-labs/flux-1.1-pro';
      console.warn(
        `[nightly-dreams] ban gate: medium '${resolvedMediumKey}' has no non-banned models; forcing safe default '${fallback}' (was '${pickedModel}')`
      );
      pickedModel = fallback;
    }
  }
  logAxes.model = pickedModel;
  console.log(
    `[nightly-dreams] User ${userId}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  try {
    console.log(`[nightly-dreams] Starting image generation (model: ${pickedModel})...`);
    // Capture for duplicate-bug observability
    const observability: Record<string, unknown> = {};

    // ── Scene description (parallel with image gen) ──────────────────────
    // Frank Instagram-style caption paraphrased from finalPrompt.
    // Runs concurrent with image gen; latency-free.
    const descPromise: Promise<string | null> = ANTHROPIC_KEY
      ? generateSceneDescription(finalPrompt, ANTHROPIC_KEY).catch((err) => {
          console.warn(`[nightly-dreams] description gen failed: ${(err as Error).message}`);
          return null;
        })
      : Promise.resolve(null);

    const genResult = await generateImage(
      'flux-dev',
      finalPrompt,
      undefined,
      {
        replicateToken: REPLICATE_TOKEN,
        openaiKey: Deno.env.get('OPENAI_API_KEY'),
        geminiKey: Deno.env.get('GEMINI_API_KEY'),
      },
      pickedModel,
      // Force JPEG when this dream will go through the dual-face-swap
      // pipeline — preserves the 2026-05-09 HTTP 546 fix. Otherwise PNG.
      isDualFaceSwap ? 'jpg' : 'png'
    );

    let tempUrl = genResult.url;
    replicatePredictionId = genResult.predictionId;
    observability.replicateRawUrl = genResult.url;
    observability.replicatePredictionId = genResult.predictionId;
    if (genResult.nsfwRetries && genResult.nsfwRetries > 0) {
      logAxes.nsfwRetries = genResult.nsfwRetries;
      console.log(
        `[nightly-dreams] Generation passed after ${genResult.nsfwRetries} NSFW retry/retries`
      );
    }
    lap('image-gen');
    console.log(
      `[nightly-dreams] Image generation complete (prediction: ${genResult.predictionId})`
    );

    // Face swap: dual (two people) or single — retry up to 3 times with
    // backoff between attempts so a cold Replicate model has time to boot.
    const FACE_SWAP_MAX_RETRIES = 3;
    const FACE_SWAP_BACKOFF_MS = [2_000, 4_000];
    if (faceSwapSources && faceSwapSources.length === 2 && tempUrl) {
      // Gender-aware source routing — see _shared/dualGenderRouting.ts. Prevents
      // a Flux L/R flip from turning a mixed-gender couple into a gender swap.
      const { leftSource, rightSource, routing } = await routeDualSwapByGender(
        { sourceUrl: faceSwapSources[0].sourceUrl, gender: faceSwapSources[0].gender },
        { sourceUrl: faceSwapSources[1].sourceUrl, gender: faceSwapSources[1].gender },
        tempUrl,
        REPLICATE_TOKEN
      );
      logAxes.dualGenderRouting = routing;
      console.log(`[nightly-dreams] Dual gender routing: ${routing}`);

      let swapSuccess = false;
      for (let attempt = 1; attempt <= FACE_SWAP_MAX_RETRIES; attempt++) {
        try {
          if (attempt > 1) {
            const delay = FACE_SWAP_BACKOFF_MS[attempt - 2] ?? 4_000;
            console.log(`[nightly-dreams] Backoff ${delay}ms before retry ${attempt}`);
            await new Promise((r) => setTimeout(r, delay));
          }
          console.log(
            `[nightly-dreams] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES}...`
          );
          tempUrl = await dispatchDualFaceSwap(
            leftSource,
            rightSource,
            tempUrl,
            REPLICATE_TOKEN,
            supabase,
            userId,
            t0 + 140_000
          );
          lap('dual-face-swap');
          console.log('[nightly-dreams] Dual face swap complete');
          logAxes.faceSwapResult = 'dual-success';
          logAxes.faceSwapAttempts = attempt;
          swapSuccess = true;
          break;
        } catch (err) {
          console.warn(
            `[nightly-dreams] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES} failed:`,
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
    } else if (faceSwapSource && tempUrl) {
      for (let attempt = 1; attempt <= FACE_SWAP_MAX_RETRIES; attempt++) {
        try {
          if (attempt > 1) {
            const delay = FACE_SWAP_BACKOFF_MS[attempt - 2] ?? 4_000;
            console.log(`[nightly-dreams] Backoff ${delay}ms before retry ${attempt}`);
            await new Promise((r) => setTimeout(r, delay));
          }
          const sourceUrl = faceSwapSource;
          console.log(`[nightly-dreams] Face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES}...`);
          tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN, supabase, userId, {
            retry: false,
          });
          lap('face-swap-model');
          console.log('[nightly-dreams] Face swap complete');
          logAxes.faceSwapResult = 'success';
          logAxes.faceSwapAttempts = attempt;
          break;
        } catch (err) {
          console.warn(
            `[nightly-dreams] Face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES} failed:`,
            (err as Error).message
          );
          if (attempt === FACE_SWAP_MAX_RETRIES) {
            fallbackReasons.push(`face_swap_failed_${attempt}x:${(err as Error).message}`);
            logAxes.faceSwapResult = 'failed';
            logAxes.faceSwapError = (err as Error).message;
            logAxes.faceSwapAttempts = attempt;
          }
        }
      }
    }

    let imageUrl = tempUrl;
    observability.preStoragetUrl = tempUrl;

    // ── Duplicate detect + retry (yan-ops face_swap canned-output bug) ──
    // The model occasionally returns a hardcoded scene with our face swapped
    // onto it instead of using our target_image. Bytes vary slightly (JPEG
    // re-encoding) so SHA-256 misses it; we use perceptual aHash + Hamming
    // distance to match by visual similarity.
    const DUP_RETRY_MAX = 2;
    const HAMMING_THRESHOLD = 6;
    let outBuf: ArrayBuffer | null = null;
    let outPhash: string | null = null;
    if (faceSwapSource || faceSwapSources) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recent } = await supabase
        .from('uploads')
        .select('output_phash')
        .eq('user_id', userId)
        .gte('created_at', since)
        .not('output_phash', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);
      const recentPhashes = ((recent ?? []) as { output_phash: string }[])
        .map((r) => r.output_phash)
        .filter((h): h is string => !!h);
      for (let dupAttempt = 0; dupAttempt <= DUP_RETRY_MAX; dupAttempt++) {
        const fetchResp = await fetch(tempUrl);
        if (!fetchResp.ok) {
          console.warn(`[dup-detect] fetch failed, skipping: ${fetchResp.status}`);
          break;
        }
        outBuf = await fetchResp.arrayBuffer();
        try {
          outPhash = await aHashHex(outBuf);
        } catch (e) {
          console.warn(`[dup-detect] aHash failed: ${(e as Error).message}`);
          break;
        }
        const collision = recentPhashes.find(
          (h) => hammingDistance(h, outPhash!) <= HAMMING_THRESHOLD
        );
        if (!collision) {
          if (dupAttempt > 0) console.log(`[dup-detect] cleared after ${dupAttempt} retry/retries`);
          break;
        }
        if (dupAttempt === DUP_RETRY_MAX) {
          console.warn(
            `[dup-detect] DUPLICATE PERSISTS after ${dupAttempt} retries — accepting | phash=${outPhash} dist=${hammingDistance(collision, outPhash)} pred=${replicatePredictionId}`
          );
          fallbackReasons.push(`dup_unresolved:${outPhash}`);
          break;
        }
        console.warn(
          `[dup-detect] HIT attempt=${dupAttempt + 1}/${DUP_RETRY_MAX + 1} phash=${outPhash} match=${collision} dist=${hammingDistance(collision, outPhash)} — retrying face swap`
        );
        if (dupAttempt > 0) await new Promise((r) => setTimeout(r, 350));
        try {
          if (faceSwapSources && faceSwapSources.length === 2) {
            // Re-route by gender on the freshly regenerated render (it may flip
            // L/R independently). See _shared/dualGenderRouting.ts.
            const routed = await routeDualSwapByGender(
              { sourceUrl: faceSwapSources[0].sourceUrl, gender: faceSwapSources[0].gender },
              { sourceUrl: faceSwapSources[1].sourceUrl, gender: faceSwapSources[1].gender },
              genResult.url,
              REPLICATE_TOKEN
            );
            // skipPrimary: the dup is yan-ops's canned-output bug — retrying
            // yan-ops returns the same canned scene, so escape to the fallback
            // models (cdingram → pikachupichu25). Gender routing above already
            // assigned each source to the correct-gender crop.
            tempUrl = await dispatchDualFaceSwap(
              routed.leftSource,
              routed.rightSource,
              genResult.url,
              REPLICATE_TOKEN,
              supabase,
              userId,
              t0 + 140_000,
              true
            );
          } else if (faceSwapSource) {
            // skipPrimary: escape yan-ops's canned output via the fallback chain.
            tempUrl = await faceSwap(
              faceSwapSource,
              genResult.url,
              REPLICATE_TOKEN,
              supabase,
              userId,
              {
                skipPrimary: true,
              }
            );
          }
        } catch (err) {
          console.warn(`[dup-detect] retry face swap failed:`, (err as Error).message);
          break;
        }
      }
      observability.outputPhash = outPhash;
      observability.preStoragetUrl = tempUrl;
    }

    // Persist to Storage + log in parallel
    timings.total = Date.now() - t0;
    const persistPromise = outBuf
      ? persistBufferToStorage(outBuf, userId, supabase)
      : persistToStorage(tempUrl, userId, supabase);
    const [persistedUrl] = await Promise.all([
      persistPromise,
      insertGenerationLog(supabase, {
        user_id: userId,
        recipe_snapshot: (vibe_profile as unknown as Record<string, unknown>) ?? {},
        rolled_axes: { ...logAxes, timings, observability },
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
    imageUrl = persistedUrl;
    lap('persist-done');

    // QA dry-run (Dream Generator Test screen) — skip the uploads insert,
    // budget upsert, recipe build, distillation and ai_generation_log so test
    // runs don't pollute the user's album or burn budget. Returns the rendered
    // image + final prompt so the test UI can display + show the prompt.
    if (!persist) {
      lap('total');
      console.log(
        `[nightly-dreams] Done (persist:false) in ${Date.now() - t0}ms for user ${userId}`
      );
      return new Response(
        JSON.stringify({
          image_url: imageUrl,
          upload_id: null,
          prompt_used: finalPrompt,
          resolved_medium: resolvedMediumKey ?? null,
          resolved_vibe: resolvedVibeKey ?? null,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Wait for the parallel description gen now that image is persisted
    const description = await descPromise;
    if (description) {
      console.log(`[nightly-dreams] description: "${description}"`);
    }

    // Build the DLT recipe — frozen LOOK anchors captured at insert time.
    // Phase 2.2a: nightly path is sparse vs. bot-side; sufficient for DLT
    // replay because medium_key + vibe_key + ai_prompt is the load-bearing
    // identity. See docs/DLT_RECIPE_PLAN.md.
    let recipeForInsert = null as ReturnType<typeof buildRecipe> | null;
    if (resolvedMediumKey && resolvedVibeKey) {
      try {
        recipeForInsert = buildRecipe({
          model: pickedModel,
          mediumKey: resolvedMediumKey,
          vibeKey: resolvedVibeKey,
          aiPrompt: finalPrompt,
          fluxSeed: null,
        });
      } catch (err) {
        console.warn(`[nightly-dreams] recipe build failed: ${(err as Error).message}`);
      }
    }

    // Draft upload + budget upsert in parallel
    let uploadId: string | undefined;
    const caption = finalPrompt.length > 200 ? finalPrompt.slice(0, 197) + '...' : finalPrompt;
    const displayUrl = await buildDisplayVariant(imageUrl, userId, supabase);
    const [uploadResult] = await Promise.all([
      supabase
        .from('uploads')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          image_url_display: displayUrl,
          caption,
          ai_prompt: finalPrompt,
          dream_medium: resolvedMediumKey ?? null,
          dream_vibe: resolvedVibeKey ?? null,
          // Which AI model rendered this — drives the model badge on
          // DreamCard (migration 211, 2026-05-30).
          model: pickedModel || null,
          is_ai_generated: true,
          is_public: false,
          width: 768,
          height: 1664,
          recipe: recipeForInsert,
          flux_seed: null,
          ...(description ? { description } : {}),
          ...(outPhash ? { output_phash: outPhash } : {}),
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
      console.error('[nightly-dreams] Failed to create draft upload:', uploadResult.error.message);
    }

    // Plan C — fire-and-forget unified Haiku style distillation. Synthesizes
    // medium + vibe + ai_prompt into a subject-stripped style fingerprint
    // for DLT. Failure → NULL → DLT falls back to ai_prompt.
    if (uploadId) {
      const targetUploadId = uploadId;
      distillStyle(
        {
          rawPrompt: finalPrompt,
          mediumKey: resolvedMediumKey ?? null,
          vibeKey: resolvedVibeKey ?? null,
        },
        ANTHROPIC_KEY,
        supabase
      )
        .then((summary) => {
          if (!summary) return;
          return supabase
            .from('uploads')
            .update({ style_summary: summary })
            .eq('id', targetUploadId);
        })
        .catch(() => {
          /* swallow — graceful fallback */
        });

      // NO auto-upscale (2026-05-25) — HD upscale is on-demand only via
      // request-upscale, cached on first download. See UPSCALE_QUEUE_PLAN.md.
    }

    lap('total');
    console.log(`[nightly-dreams] Done in ${Date.now() - t0}ms for user ${userId}`);

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        upload_id: uploadId ?? null,
        prompt_used: finalPrompt,
        resolved_medium: resolvedMediumKey ?? null,
        resolved_vibe: resolvedVibeKey ?? null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const errMsg = (err as Error).message;
    console.error(`[nightly-dreams] Error for user ${userId}:`, errMsg);

    // Record the failure so a silent cohort-wide outage is queryable. The
    // success path logs to ai_generation_log; without this, failures left no
    // DB trace at all (nightly audit 2026-05-26). engine='nightly-failed' +
    // status='failed' so the cron's idempotency guard (completed-only) keeps
    // this user retryable. insertGenerationLog never throws.
    await insertGenerationLog(supabase, {
      user_id: userId,
      recipe_snapshot: {},
      rolled_axes: { engine: 'nightly-failed' },
      enhanced_prompt: '',
      model_used: '',
      cost_cents: 0,
      status: 'failed',
      sonnet_brief: null,
      sonnet_raw_response: null,
      vision_description: null,
      fallback_reasons: [`nightly_error:${errMsg.slice(0, 200)}`],
      replicate_prediction_id: null,
    });

    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// ─── Relationship tone ──────────────────────────────────────────────────
// Determines the interaction tone between 2+ cast members in the same scene.
// Solo scenes return null (no tone directive needed).
type RelationshipTone = {
  kind: 'romantic' | 'family' | 'petBond' | 'playful';
  block: string;
};

function buildRelationshipTone(
  selectedCast: { role: string; relationship?: string }[]
): RelationshipTone | null {
  if (selectedCast.length < 2) return null;
  const roles = new Set(selectedCast.map((c) => c.role));
  const plusOne = selectedCast.find((c) => c.role === 'plus_one');
  const rel = plusOne?.relationship;

  if (
    roles.has('self') &&
    roles.has('plus_one') &&
    (rel === 'partner' || rel === 'significant_other')
  ) {
    return {
      kind: 'romantic',
      block: `RELATIONSHIP TONE — apply throughout the scene:
The two characters are life partners — deeply close in every way. The scene can lean into ANY part of that relationship: the intimate side (holding hands, stealing glances, tender moments, slow dances, sunset walks, shared meals, warm looks, quiet conversations, reading side by side) OR the playful side (laughing together, adventuring, partners in crime, matching mischievous grins, goofy shared moments, road-trip energy, high-fives, doing something silly). Whatever the moment, the emotional truth is "we're each other's person." Absolutely never sexual — always sweet, warm, genuine. Only this bucket gets to use intimate language; every other relationship stays platonic.`,
    };
  }

  if (
    roles.has('self') &&
    roles.has('plus_one') &&
    (rel === 'family' || rel === 'parent' || rel === 'child' || rel === 'grandchild')
  ) {
    return {
      kind: 'family',
      block: `RELATIONSHIP TONE — apply throughout the scene:
The two characters share a warm familial bond — intergenerational closeness, care and protection, shared moments of teaching or wonder. Walking side by side, a hand on a shoulder, shared laughter, quiet comfort. Not romantic. Just the genuine affection that comes from family.`,
    };
  }

  if (roles.has('self') && roles.has('pet') && !roles.has('plus_one')) {
    return {
      kind: 'petBond',
      block: `RELATIONSHIP TONE — apply throughout the scene:
The person and their animal companion share a close bond — walking together, playing, reading with the animal nearby, sharing a quiet moment or a shared adventure. Warm human-animal connection. The animal behaves like a real animal, not anthropomorphic.`,
    };
  }

  // Default: friends, siblings, unknown relationship, or 3+ mixed cast
  return {
    kind: 'playful',
    block: `RELATIONSHIP TONE — apply throughout the scene:
The characters are close companions sharing an experience — laughing, discovering, adventuring together, high-fiving, pointing out something cool, mid-motion through a shared moment. Camaraderie and genuine warmth. NOT romantic — no hand-holding, no intimate gestures, no lovey energy. Think "friends sharing a great moment."`,
  };
}
