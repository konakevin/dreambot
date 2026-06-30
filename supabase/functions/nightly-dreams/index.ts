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
import { sanitizeUserText } from '../_shared/sanitizeUserText.ts';
import {
  fetchChaosConfig,
  getChaosTier,
  rollNightlyDreamType,
  mapDreamTypeToInputs,
  extraModelsForTier,
  type NightlyDreamType,
} from '../_shared/chaosTier.ts';
import { assembleScene } from '../_shared/sceneEngine.ts';
// buildRenderEntity removed — full cast description now passes to Sonnet directly
import { getLocationCard } from '../_shared/essenceCards.ts';
import { isBannedLocationName } from '../_shared/locationFilters.ts';
import type { LocationCard } from '../_shared/essenceCards.ts';
import { callSonnet } from '../_shared/llm.ts';
import { distillStyle } from '../_shared/styleDistiller.ts';
import { getCostCents } from '../_shared/modelPricing.ts';
import { buildRecipe } from '../_shared/recipeBuilder.ts';
import { applyVibeGenderModifier } from '../_shared/promptCompiler.ts';
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { faceSwap } from '../_shared/faceSwap.ts';
import { dispatchDualFaceSwap } from '../_shared/dualSwapDispatch.ts';
import { hydrateCastSources } from '../_shared/castPhotoUrl.ts';
import { orderDualSides, shouldFlipDualSide } from '../_shared/dualSideOrder.ts';
import { genderSafeDualSwap } from '../_shared/dualSwapPipeline.ts';
import {
  aHashFromDecoded,
  hammingDistance,
  persistBufferToStorage,
  persistToStorage,
  buildDisplayVariant,
} from '../_shared/persistence.ts';
import { decodeImage, type DecodedImage } from '../_shared/imageCodec.ts';
import { computeThumbhash } from '../_shared/thumbhashGen.ts';
import { insertGenerationLog, asJsonbObject } from '../_shared/logging.ts';
import { markStage } from '../_shared/dreamQueueLifecycle.ts';
import { captureRenderError } from '../_shared/sentry.ts';
import { pickDualAction } from '../_shared/pools/dual_actions.ts';
import { pickSpecialLighting } from '../_shared/pools/dual_scenarios.ts';
import { loadDualScenarios, pickDualScenario } from '../_shared/pools/dualScenarioLoader.ts';
import { loadSingleScenarios, pickSingleScenario } from '../_shared/pools/singleScenarioLoader.ts';
import { pickDualCompositionPath } from '../_shared/pools/dual_composition.ts';
import { runCharacterSlotPipeline } from '../_shared/characterSlotPrompt.ts';
import { resolveCastGender } from '../_shared/genderLock.ts';
import { pickSingleAction } from '../_shared/pools/single_actions.ts';
import { pickSceneCluster } from '../_shared/pools/scene_clusters.ts';
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
  const isWorkerCall = Boolean(workerToken) && timingSafeEqual(authHeader, `Bearer ${workerToken}`);

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

    // L7: the user-JWT path is the onboarding first-dream (and QA). Every new
    // user is auto-enrolled in the trial at signup (migration 176 trigger), so a
    // legitimate first dream is always dream-eligible. Gate on the same nightly
    // eligibility so a lapsed/free user can't farm free (uncharged) renders by
    // invoking this render function directly.
    const { data: eligible } = await supabase.rpc('is_dream_eligible', { p_user_id: userId });
    if (eligible === false) {
      return new Response(JSON.stringify({ error: 'not_dream_eligible' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Preserve explicit null — caller passes null to mean "force scene-only,
  // no cast". `||` would coerce null → undefined and break the
  // forceCastRole === null branch downstream in rollDream.
  const force_cast_role: string | null | undefined =
    'force_cast_role' in body ? (body.force_cast_role as string | null) : undefined;
  const force_medium = (body.force_medium as string) || undefined;
  const force_vibe = (body.force_vibe as string) || undefined;
  const force_nightly_path = (body.force_nightly_path as string) || undefined;
  const force_model = (body.force_model as string) || undefined;
  // First-dream onboarding flag (set on every first-dream cascade tier). Used to
  // ban gpt-image-2 (too slow for the onboarding loading screen) — see the model
  // gate below. Nightlies never set this, so their lego/pixels gpt pins stand.
  const isFirstDream = body.first_dream === true;
  // First-dream onboarding mandates the SETTING be one of the user's just-picked
  // locations (passed in the queue payload at enqueue time). Bypasses the random
  // place roll below AND the user_recipes-load race (the recipe may not be
  // persisted yet when the first dream renders).
  const force_place = (body.force_place as string) || undefined;
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
  // QA: force a special scene path — goofy (force_playful) or dressed-up elegant
  // (force_elegant) — instead of the random 20%/20%/60% mix. The _single_ variants
  // force the SOLO special pools (single_scenarios) on a single-cast face swap.
  const force_playful = body.force_playful === true;
  const force_elegant = body.force_elegant === true;
  const force_single_playful = body.force_single_playful === true;
  const force_single_elegant = body.force_single_elegant === true;
  // First-dream cascade flag — set by RevealStep.tsx. When true:
  //   • face-swap exhaustion throws { error: 'face_swap_failed',
  //     swap_kind: 'dual' | 'single' } at 422 instead of soft-falling to the
  //     base render (the client cascades to single → scene-only).
  //   • NSFW-retry exhaustion + worker-limit errors come back as 422 with a
  //     non-shameful code so the client can swap to a safer tier without
  //     showing the user an NSFW label.
  // Nightly cron path leaves this false → existing soft-fallback behavior
  // (base render persists with `fallbackReasons` logged) is unchanged.
  const strict_face_swap = body.strict_face_swap === true;
  // QA / dry-run flag — when false, skip the uploads insert + budget upsert so
  // the Dream Generator Test screen can exercise the nightly pipeline without
  // polluting the user's album. Default true (normal nightly + first-dream).
  const persist = body.persist !== false;
  // dream_queue.id (forwarded by the worker's nightly dispatcher) — lets this
  // render stamp stage breadcrumbs that survive a hard isolate kill. null on
  // the direct/QA path (Dream Generator Test screen), where markStage no-ops.
  const queueJobId = (body.queue_job_id as string) || null;

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
  // Hoisted embodied-medium flag so the post-try GPT-image-2 prefix step
  // can skip its canvas-illustration prefix (which fights LEGO / pixels /
  // handcrafted directives — their own medium fragment is the CLIP anchor).
  let isEmbodiedMedium = false;
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
  // Hoisted so the post-try scene model gate can pass chaos-tier extras
  // (flux-2-pro at MID, flux-2-pro/flex/max at HIGH) to
  // fetchSceneEligibleModels. Resolved inside the try block from the user's
  // mood slider; defaults preserve pre-mig-239 behavior when missing.
  let chaosTierOuter: 'low' | 'mid' | 'high' = 'low';
  let chaosCfgOuter: Awaited<ReturnType<typeof fetchChaosConfig>> | null = null;

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

    // Cast photos live in the PRIVATE `cast-photos` bucket (migration 292).
    // Resolve each member's storage_path to a fresh signed URL up front so ALL
    // downstream face-swap + describe logic (which gates on
    // thumb_url.startsWith('http')) works unchanged. No-op for legacy members
    // that already carry a public thumb_url.
    if (Array.isArray(nightlyProfile.dream_cast) && nightlyProfile.dream_cast.length > 0) {
      nightlyProfile.dream_cast = await hydrateCastSources(nightlyProfile.dream_cast, supabase);
    }

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

    // ── Chaos-tier dream-type pre-roll (mig 239) ───────────────────────
    // Compute the user's chaos tier from their onboarding mood slider, then
    // roll the explicit dream type (face_swap_* / pure_scene / epic_tiny /
    // embodied) BEFORE picking the medium. Distribution is gated on tier:
    //   - low  (<0.4): 0% embodied, base scene models only
    //   - mid  (0.4..<0.7): 10% embodied (lego, pixels) + flux-2-pro
    //   - high (>=0.7): 15% embodied (lego, pixels, handcrafted) + flux-2-pro/flex/max
    // First-dream override (force_face_swap_eligible) forces the showcase
    // cascade: dual swap → self swap → pure_scene/epic_tiny (no embodied).
    // The pre-roll translates to (medium token, forceCastRole, forceComposition)
    // so the rest of the pipeline (rollDream, scene gate, model picker) honors
    // it deterministically instead of re-randomizing.
    const chaosCfg = await fetchChaosConfig(supabase);
    const chaosValue =
      typeof nightlyProfile.moods?.peaceful_chaotic === 'number'
        ? nightlyProfile.moods.peaceful_chaotic
        : 0.5;
    const chaosTier = getChaosTier(chaosValue, chaosCfg);
    chaosTierOuter = chaosTier;
    chaosCfgOuter = chaosCfg;
    const describedCastForRoll = (nightlyProfile.dream_cast ?? []).filter(
      (m: DreamCastMember) => m.description && m.thumb_url && m.thumb_url.startsWith('http')
    );
    const hasSelf = describedCastForRoll.some((m: DreamCastMember) => m.role === 'self');
    const hasPlusOne = describedCastForRoll.some((m: DreamCastMember) => m.role === 'plus_one');

    let preRolledType: NightlyDreamType | null = null;
    let preRolledMediumToken: string;
    let preRolledCastRole: string | null = null;
    let preRolledComposition: 'character' | 'epic_tiny' | 'pure_scene' = 'character';

    if (force_medium) {
      // Explicit force_medium short-circuits the chaos-tier flow — caller is
      // doing a forced render (QA / test). Honor it as-is.
      preRolledMediumToken = force_medium;
    } else if (
      force_face_swap_eligible ||
      (force_cast_role !== undefined && force_cast_role !== null)
    ) {
      // First-dream onboarding OR explicit force_cast_role (also onboarding /
      // QA): use the showcase cascade.
      preRolledType = rollNightlyDreamType({
        hasSelf,
        hasPlusOne,
        tier: chaosTier,
        cfg: chaosCfg,
        isFirstDream: true,
      });
      const inputs = mapDreamTypeToInputs(preRolledType, chaosTier, chaosCfg);
      preRolledMediumToken = inputs.mediumToken;
      preRolledCastRole = force_cast_role ?? inputs.forceCastRole;
      preRolledComposition = inputs.forceComposition;
    } else {
      preRolledType = rollNightlyDreamType({
        hasSelf,
        hasPlusOne,
        tier: chaosTier,
        cfg: chaosCfg,
        isFirstDream: false,
      });
      const inputs = mapDreamTypeToInputs(preRolledType, chaosTier, chaosCfg);
      preRolledMediumToken = inputs.mediumToken;
      preRolledCastRole = inputs.forceCastRole;
      preRolledComposition = inputs.forceComposition;
    }
    console.log(
      `[nightly-dreams] chaos pre-roll | chaosValue=${chaosValue.toFixed(2)} tier=${chaosTier} type=${preRolledType ?? 'force_medium'} mediumToken=${preRolledMediumToken} cast=${preRolledCastRole ?? 'random'} composition=${preRolledComposition}`
    );

    // Pick from the curated dream-eligible pool — NOT from the user's
    // stored art_styles/aesthetics. Migration 160 added is_dream_eligible
    // as the auto-gen quality gate. The user's create-screen options stay
    // broad; nightly is curated. recentMediums/recentVibes still apply for
    // rotation across the eligible pool.
    let nightlyMedium = await resolveMediumFromDb(preRolledMediumToken, recentMediums);
    if (force_medium) {
      nightlyMedium = await resolveMediumFromDb(force_medium);
    }
    let nightlyVibe = await resolveVibeFromDb('dream_eligible', recentVibes);
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

    // Roll the dream algorithm. force_medium short-circuits the chaos
    // pre-roll, so only thread forced cast/composition when we actually
    // pre-rolled a dream type.
    const effectiveCastRole =
      preRolledType != null && force_cast_role === undefined ? preRolledCastRole : force_cast_role;
    const effectiveComposition = preRolledType != null ? preRolledComposition : null;
    // Stage breadcrumb — pre-render (roll + cast describe + scene + Sonnet brief).
    markStage(supabase, queueJobId, 'resolve');
    const dreamRoll = rollDream(
      describedCastMembers,
      nightlyMedium,
      effectiveCastRole,
      force_nightly_path,
      effectiveComposition
    );
    const {
      nightlyPath,
      composition,
      compositionMode,
      castMembers: rolledCast,
      includeLocation,
    } = dreamRoll;
    // Randomize which dual-cast member lands on the LEFT vs RIGHT (~50%) so the
    // same person isn't always on the same side. selectedCast order drives BOTH
    // the brief (CHARACTER 1 = LEFT) and the swap dispatch, so flipping it once
    // here is consistent end-to-end. Safe: the gender-safe router (dualGenderRouting)
    // pastes each face onto its gender-matching body from the DETECTED render, so
    // it follows whichever side Sonnet actually placed each person. Single/pet
    // casts are untouched.
    const selectedCast =
      rolledCast.length === 2 && shouldFlipDualSide()
        ? orderDualSides(rolledCast[0], rolledCast[1], true)
        : rolledCast;
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
      nightlyMedium = await resolveMediumFromDb('dream_eligible_face_swap', recentMediums);
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
    //
    // Migration 234: pure_scene rolls from `dream_eligible_scene` (weighted
    // natural/embodied sub-roll — LEGO / pixels / handcrafted compete with
    // canvas / hyperreal / illustration). epic_tiny rolls from
    // `dream_eligible_scene_natural` (natural-only — embodied can't render a
    // recognizable cast at tiny-figure scale).
    const isSceneComposition = composition === 'pure_scene' || composition === 'epic_tiny';
    if (isSceneComposition && !force_medium && !nightlyMedium.isSceneEligible) {
      const oldKey = nightlyMedium.key;
      const sceneToken =
        composition === 'pure_scene' ? 'dream_eligible_scene' : 'dream_eligible_scene_natural';
      nightlyMedium = await resolveMediumFromDb(sceneToken, recentMediums);
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
    // Tell the post-try GPT-image-2 prefix step to skip when the medium is
    // embodied — its directive (LEGO bricks / pixel tiles / Sackboy felt) is
    // already the CLIP anchor; canvas-illustration prefix would fight it.
    isEmbodiedMedium = nightlyMedium.characterRenderMode === 'embodied';

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
    // Strip banned (fantasy/sci-fi/imagined) entries from the place pool
    // before any rolling logic touches it. See _shared/locationFilters.ts
    // for the rationale + the 3-layer cleanup it pairs with.
    // Sanitize every place at the source — places are normally DB-curated picker
    // keys (sanitize is identity for those), but a tampered client can write
    // arbitrary text into user_recipes.recipe.dream_seeds.places, and userPlace
    // flows into the Sonnet brief. Neutralizes injection / control / zero-width.
    let placePool: string[] = (seeds.places ?? [])
      .map((p: string) => sanitizeUserText(String(p), 'subject_description'))
      .filter((p: string) => p && !isBannedLocationName(p));
    if (placePool.length > 0 && recentPlaces.length > 0) {
      const excludeSet = new Set(recentPlaces);
      const filtered = placePool.filter((p: string) => !excludeSet.has(p));
      // Keep filtered pool only if it has something; otherwise full list
      if (filtered.length >= 1) placePool = filtered;
    }
    const userPlace = force_place
      ? // Mandated first-dream location — use the user's just-picked place
        // exactly (sanitized like any pool place), never the random roll.
        sanitizeUserText(String(force_place), 'subject_description')
      : includeLocation && placePool.length > 0
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
        // First dreams (strict_face_swap — set only by the onboarding first-dream
        // tiers) random between the two Flux pro models — the most reliable,
        // highest-quality face swap for the make-or-break showcase. Both render
        // dual couple swaps cleanly (verified: ultra dual swaps in nightly).
        // gemini + gpt-image-2 are banned here (they re-render/restyle and weaken
        // the "that's really me" moment).
        const FIRST_DREAM_MODELS = [
          'black-forest-labs/flux-1.1-pro',
          'black-forest-labs/flux-1.1-pro-ultra',
        ];
        const FACE_SWAP_MODELS = [
          'black-forest-labs/flux-dev',
          'black-forest-labs/flux-1.1-pro',
          'black-forest-labs/flux-1.1-pro-ultra',
          'google/gemini-2-image',
          'openai/gpt-image-2',
        ];
        const pool = strict_face_swap ? FIRST_DREAM_MODELS : FACE_SWAP_MODELS;
        faceSwapPrePickedModel = pool[Math.floor(Math.random() * pool.length)];
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
    // Default dual pose (used for LOCATION scenes). Special scenes re-pick a
    // scene-matched pose at the slot-pipeline call below.
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
        ? `\nNEVER INCLUDE: ${nightlyProfile.avoid
            .map((a: string) => sanitizeUserText(String(a), 'subject_description'))
            .filter(Boolean)
            .join(', ')}`
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
    let iconicAnchorScale: 'wide' | 'medium' | 'intimate' | null = null;
    let biomeKey: string | null = null;
    // Per-location bespoke biome (migration 170). When set, it OVERRIDES
    // the shared biomeAxes lookup so atmospheres feel recognizable to
    // travelers who have been to that specific place.
    let bespokeBiome: ReturnType<typeof getBiomeConfig> | null = null;
    if (userPlace) {
      // pure_scene quality filter (2026-06-04): the location_iconic_spots
      // pool was originally curated for "real recognizable landmark" — which
      // mixes Hollywood Sign with Anne Frank House with Los Angeles River
      // concrete channel. Cast paths (character / epic_tiny) tolerate mundane
      // locations because a person carries the scene. pure_scene has no
      // subject other than the landscape, so a "concrete ditch in LA" type
      // anchor reads as a random building photo, not a postcard.
      //
      // Three-phase fix landed 2026-06-04:
      //   1. Engine filter (originally quality_tier IN ('S','A'), now
      //      pure_scene_eligible = true).
      //   2. classify-pure-scene-eligible.js Sonnet pass — S auto-true,
      //      B auto-false, A judged per spot with a strict postcard rubric.
      //      Net pool kept: ~50% of the 4,897 original spots.
      //   3. gen-postcard-spots.js — added 960 fresh Sonnet-authored
      //      postcard anchors (20 per location × 48 live locations),
      //      pre-marked pure_scene_eligible=true.
      //
      // Cast paths used to get the full unfiltered pool, but ~50% of cast
      // rolls had quality issues: Phase 4 pure-landscape entries fight
      // cast injection (they were authored "no humans, no figures"), and
      // B-tier mundane backdrops (concrete ditches, gym equipment) read
      // as gritty-but-bad even with a person in frame. Migration 222 +
      // qa-character-pool.js added a parallel `character_eligible`
      // boolean: cast paths now roll from that filtered subset.
      let spotsQ = supabase
        .from('location_iconic_spots')
        .select('spot_text, spot_kind, quality_tier')
        .eq('location_key', userPlace)
        .eq('is_active', true);
      if (composition === 'pure_scene') {
        spotsQ = spotsQ.eq('pure_scene_eligible', true);
      } else {
        // character + epic_tiny composition paths
        spotsQ = spotsQ.eq('character_eligible', true);
      }
      // Embodied mediums (LEGO / pixels / handcrafted) render best as
      // set-piece dioramas of a place — wide vistas with multiple terrain
      // elements. Intimate close-ups ("single hibiscus blossom", "water-level
      // shot of lava channel") fight the medium because they're photoreal
      // moments LEGO/pixels can't build. Filter to wide-scale spots only
      // for embodied scene renders.
      if (nightlyMedium.characterRenderMode === 'embodied') {
        spotsQ = spotsQ.eq('spot_kind', 'wide');
      }
      const [{ data: spots }, { data: locCard }] = await Promise.all([
        spotsQ,
        supabase
          .from('location_cards')
          .select('biome, biome_config')
          .eq('name', userPlace)
          .maybeSingle(),
      ]);
      if (spots && spots.length > 0) {
        const picked = spots[Math.floor(Math.random() * spots.length)];
        iconicAnchor = picked.spot_text;
        // Spot scale = how the brief should frame this anchor. Classified
        // by Sonnet via scripts/classify-iconic-spots.js → 'wide' (vast
        // vistas) | 'medium' (single named landmark) | 'intimate' (close
        // detail / interior / under-canopy / grotto). Engine uses this
        // to choose framing language so an intimate spot doesn't get
        // rendered as a sweeping vista (the failure mode that produced
        // weird stretched renders before 2026-06-03). Null guard handles
        // any future un-classified rows.
        const k = String(picked.spot_kind || '').toLowerCase();
        if (k === 'wide' || k === 'medium' || k === 'intimate') {
          iconicAnchorScale = k;
        }
      }
      biomeKey = locCard?.biome ?? null;
      // Per-location biome_config override — validated by the single shared gate
      // (isValidBiomeConfig). Valid → used as the bespoke biome; malformed →
      // falls back to the shared class config (getBiomeConfig) below.
      const cfg = locCard?.biome_config;
      if (isValidBiomeConfig(cfg)) {
        bespokeBiome = cfg; // isValidBiomeConfig is a type guard → cfg is BiomeConfig here
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

    // ── Per-anchor framing rule ───────────────────────────────────────
    // Picks the SUBJECT_RULE for the brief based on the rolled spot's
    // scale (wide / medium / intimate). Without this, an intimate spot
    // like "Founders Grove with fallen Dyerville Giant" gets framed by
    // the biome-wide vista rule and the render comes back as a sweeping
    // forest panorama instead of an under-canopy close view. Falls back
    // to biomeConfig.SUBJECT_RULE when the spot is null / un-classified
    // (preserves existing behavior for any future un-tagged spots).
    const FRAMING_BY_SCALE: Record<'wide' | 'medium' | 'intimate', string> = {
      wide: 'EPIC vast composition. Sweeping vista — the landscape itself is the subject. Horizon visible, depth extending to the distance. Camera pulled back, wide-angle.',
      medium:
        'BALANCED single-subject composition. The named landmark IS the subject — frame it prominently (~50-60% of frame), with its immediate setting visible but secondary. No tiny-subject-in-vast-vista framing; no extreme close-up.',
      intimate:
        'CLOSE INTIMATE composition. Tight framing on the named feature — interior / under-canopy / close-detail / human-scale view. Subject fills 60-75% of frame. NO sweeping horizon. NO vast-vista language ("expanse", "endless", "panoramic"). The viewer is INSIDE or NEXT TO the subject, not looking at it from afar.',
    };
    const subjectRule = iconicAnchorScale
      ? FRAMING_BY_SCALE[iconicAnchorScale]
      : biomeConfig.SUBJECT_RULE;

    console.log(
      `[nightly-dreams] biome="${biomeKey || '(default)'}"${bespokeBiome ? ' [BESPOKE]' : ''} anchor="${iconicAnchor || '(none)'}" scale=${iconicAnchorScale || '(biome-default)'} composition=${composition} time="${timeAxis.split(' — ')[0]}"`
    );

    let nightlyBrief: string;
    let slotPipelineHandled = false;
    let slotPipelineFallbacks: string[] = [];

    // Nightly DUAL scene mix (Phase 2): 60% their saved location / 20% GOOFY /
    // 20% PRETTY. The two special pools swap the location for a curated scene:
    //  - goofy (DUAL_SCENARIOS_PLAYFUL): fun environment, NORMAL clothes (wardrobe null)
    //  - elegant (DUAL_SCENARIOS_ELEGANT): pretty scene, DRESSED-UP attire (wardrobe set)
    // A LIGHTING axis + the slot pipeline's fresh Sonnet scene/wardrobe/mood/props,
    // the random pose, the rotating model/medium/vibe, and the random Flux seed mean
    // the same scenario never renders the same twice. The slot pipeline keeps the
    // framing locked so the swap stays clean. Location for these = the scenario.
    // Applies to BOTH dual (couples) and single (solo) face-swap dreams: 60%
    // location / 20% goofy / 20% elegant. Single draws from the single_scenarios
    // pools by the cast's gender (any ∪ gender), so attire matches the locked body.
    let dualSpecialScene: string | null = null;
    let dualSpecialWardrobe: string | null = null; // the scene's attire (costume/formal/normal)
    // A MANDATED location (force_place) suppresses the goofy/elegant special-scene
    // roll entirely. force_place is set ONLY by the onboarding FIRST DREAM, which
    // must put the user in the place they JUST picked — the "here's you in YOUR
    // spot" showcase moment — never a random rodeo/ballroom from the pools.
    // Regular nightly dreams pass no force_place, so they keep the 60% location /
    // 20% goofy / 20% elegant variety mix below.
    if (!force_place) {
      if (isDualFaceSwap) {
        const pools = await loadDualScenarios(supabase);
        const roll = Math.random();
        if (force_playful || (!force_elegant && roll < 0.2)) {
          const s = pickDualScenario(pools.goofy);
          dualSpecialScene = s.scene;
          dualSpecialWardrobe = s.attire;
        } else if (force_elegant || roll < 0.4) {
          const s = pickDualScenario(pools.elegant);
          dualSpecialScene = s.scene;
          dualSpecialWardrobe = s.attire;
        }
      } else if (isSingleHumanFaceSwap) {
        const pools = await loadSingleScenarios(supabase);
        const g = castGender === 'male' || castGender === 'female' ? castGender : null;
        const roll = Math.random();
        if (force_single_playful || (!force_single_elegant && roll < 0.2)) {
          const s = pickSingleScenario(pools, 'goofy', g);
          if (s) {
            dualSpecialScene = s.scene;
            dualSpecialWardrobe = s.attire;
          }
        } else if (force_single_elegant || roll < 0.4) {
          const s = pickSingleScenario(pools, 'elegant', g);
          if (s) {
            dualSpecialScene = s.scene;
            dualSpecialWardrobe = s.attire;
          }
        }
      }
    }
    const dualSpecialLighting = dualSpecialScene ? pickSpecialLighting() : null;
    const effectiveUserPlace = dualSpecialScene ?? userPlace;

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
        // Match the pose to the scene: elegant/dressed-up → refined partner pose
        // (a thumbs-up clashes with formal wear); goofy → playful pose; location →
        // the already-rolled dualAction.
        const action =
          selectedCast.length === 2
            ? dualSpecialWardrobe
              ? pickDualAction(
                  selectedCast.find((c) => c.role === 'plus_one')?.relationship,
                  'partner'
                )
              : dualSpecialScene
                ? pickDualAction(undefined, 'playful')
                : dualAction
            : (singleAction ?? null);
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
            // Special scene (goofy/elegant) overrides the location + swaps the biome
            // axes for a LIGHTING-quality axis (varies the look; a goofy/indoor scene
            // shouldn't fight "blizzard at midnight"). wardrobeAnchor: goofy → null
            // (normal clothes); elegant → the dressed-up attire; location → biome.
            iconicAnchor: dualSpecialScene ?? iconicAnchor,
            userPlace: dualSpecialScene ?? userPlace ?? null,
            timeAxis: dualSpecialScene ? (dualSpecialLighting ?? '') : timeAxis,
            weatherAxis: dualSpecialScene ? '' : weatherAxis,
            phenomenaAxis: dualSpecialScene ? '' : phenomenaAxis,
            wardrobeAnchor: dualSpecialScene
              ? dualSpecialWardrobe
              : bespokeBiome &&
                  Array.isArray(bespokeBiome.WARDROBE) &&
                  bespokeBiome.WARDROBE.length > 0
                ? pickAxis(bespokeBiome.WARDROBE)
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
        composition,
        isDualFaceSwap,
        chaosTier: chaosTierOuter,
        dreamType: preRolledType,
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
        composition,
        chaosTier: chaosTierOuter,
        dreamType: preRolledType,
      };
    } else {
      // ── Pure scene — uses upstream iconicAnchor + biomeConfig + axes ──
      //
      // Phase 1 quality pass (2026-06-03): the previous brief was 70-100
      // words and let Sonnet roll PHENOMENON every time. That extra
      // creative budget + the "JAW-DROPPING" framing pulled Sonnet into
      // hallucinating extras: lone figures with staffs, hanging tapestry
      // frames, narrative dream-weirdness lines, secondary surprise
      // elements stacked alongside the iconic anchor. Result was
      // "anchor + 4 surprise axes" collages instead of clean postcards.
      //
      // The tighten:
      //   • 50-75 words (less room to ad-lib)
      //   • PHENOMENON rolled ~33% of the time, otherwise omitted
      //     (was always included). Time + weather + camera carry the
      //     variation reliably; phenomena adds noise more than help.
      //   • Explicit "NO ADDITIONS" rule block that bans figures,
      //     tapestries, narrative lines, and other competing elements
      //     by name.
      //   • Subject framing copy compressed.
      const banLines = biomeConfig.BANS.map((b) => `- ${b}`).join('\n');
      const includePhenomenon = Math.random() < 0.33;
      const phenomenonLine = includePhenomenon
        ? `\n- ATMOSPHERIC PHENOMENON: ${phenomenaAxis}`
        : '';
      nightlyBrief = `You are a cinematographer composing a POSTCARD of ${userPlace || 'the location'}. Write a Flux AI prompt (50-75 words, comma-separated).

━━━ THE SUBJECT (LOCKED — NON-NEGOTIABLE) ━━━
The render IS: ${iconicAnchor || userPlace || 'the location'}

This is the only subject. Do NOT substitute another landmark. Do NOT add multiple competing iconic features. Name this specific view explicitly in the prompt.

MEDIUM: ${baseMedium.fluxFragment}
${
  nightlyMedium.characterRenderMode === 'embodied'
    ? `
━━━ EMBODIED MEDIUM — TRANSLATE EVERYTHING (NON-NEGOTIABLE) ━━━
This medium REBUILDS the entire image — terrain, atmosphere, sky, water, weather, light, foliage — in its own physical/visual vocabulary. NO photoreal elements layered on top. NO realistic landscape language. Every noun in your prompt must be a medium-native object.

Translate every scene element into the medium:
- Terrain ("volcanic cliffs", "lava flows", "valley", "ridge", "caldera") → medium-built terrain (stepped/blocky brick formations for LEGO, blocky pixel-tile cliffs for pixels, cork/foam/sponge hills for handcrafted)
- Water/ocean ("deep Pacific waters", "underwater reef") → medium-built water (translucent blue LEGO tile/plate ocean for LEGO, wave-tile pixel patterns for pixels, knitted-yarn felt ocean with thread ripples for handcrafted)
- Sky/clouds → medium-built sky (solid brick backdrop with white cloud-brick puffs, pixel-band gradients with cluster cloud sprites, soft cotton-batting clouds on painted-canvas sky)
- Sun / lighting ("golden afternoon", "warm amber") → medium-translated lighting (warm amber tinting on plastic LEGO surfaces, warm orange pixel highlights, soft warm cozy tilt-shift studio lighting)
- Weather ("trade-wind shower", "rain") → medium-built weather (translucent blue raindrop tiles slanting across the build for LEGO, dithered pixel rain streaks for pixels, embroidered thread rain ripples for handcrafted)
- Foliage ("palm trees", "ferns") → medium-built foliage (green plate-piece fronds on brown cylindrical trunks for LEGO, tile-cluster pixel palm sprites for pixels, pipe-cleaner trunks with paper/felt fronds for handcrafted)

ZERO photoreal nouns. ZERO photoreal atmospheric language. EVERY element described in the medium's vocabulary, including the rolled TIME / WEATHER / CAMERA / PHENOMENON axes below — translate THEM too, do not paste them in verbatim.
`
    : ''
}
SUBJECT FRAMING: ${subjectRule}

VARIATION AXES (alter LIGHT, ATMOSPHERE, and CAMERA ONLY — never the subject):
- TIME: ${timeAxis}
- WEATHER: ${weatherAxis}
- CAMERA: ${cameraAxis}${phenomenonLine}

NO ADDITIONS (HARD BANS — these have polluted past renders):
- NO figures, people, characters, lone travelers, hooded silhouettes, animals — the landscape IS the subject, no actors inside it
- NO foreground frames or props (tapestries, banners, archways, hanging lanterns, curtains) unless they are physically part of the locked subject above
- NO narrative or dream-weirdness phrases ("the pattern repeats", "you remember this place", etc.)
- NO secondary iconic features stacked alongside the anchor — one subject, one image
- NO surreal additions (ringworld arcs, cable cars, floating islands, ash-as-snow) unless the rolled axes above explicitly call for them

ENHANCING LANGUAGE (mandatory):
- DEFINED LIGHT SOURCE — name it explicitly (direct sun, warm lamplight, golden rim, glittering reflections, god-rays) — fit to the rolled WEATHER + TIME
- LAYERED DEPTH — foreground / midground / distant background, all of the LOCKED SUBJECT
- SATURATED COLOR — pigments cranked, palette true to THIS specific place
- DENSE DETAIL — every surface, material, edge catching light

ATMOSPHERIC RULE — WEATHER is the SOLE source of truth for atmosphere. Render exactly what the rolled WEATHER specifies. Do not add fog/mist/haze/god-rays/particles unless WEATHER asks. Do not strip them if it does.

MOOD (tone only — do NOT let mood pull in new subjects):
${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

ABSOLUTELY BANNED:
${banLines}

Render the LOCKED SUBJECT, lit by TIME + WEATHER${includePhenomenon ? ' + PHENOMENON' : ''}, framed by CAMERA. NAME the locked subject explicitly.

End with: no text, no words, no letters, no watermarks, hyper detailed, masterwork composition.

Output ONLY the prompt.`;
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-pure-scene',
        biome: biomeKey || null,
        anchor: iconicAnchor || null,
        anchor_scale: iconicAnchorScale || null,
        time: timeAxis.split(' — ')[0],
        weather: weatherAxis.split(',')[0],
        phenomenon_included: includePhenomenon,
        composition,
        chaosTier: chaosTierOuter,
        dreamType: preRolledType,
        isEmbodied: isEmbodiedMedium,
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

    // Post-process: ensure location name appears in final prompt (Sonnet sometimes
    // drifts). Uses the effective place — for a playful scenario that's the scenario
    // (already in the prompt → no-op), so the real location is never injected onto it.
    if (
      includeLocation &&
      effectiveUserPlace &&
      !finalPrompt.toLowerCase().includes(effectiveUserPlace.toLowerCase())
    ) {
      finalPrompt = `set in ${effectiveUserPlace}, ` + finalPrompt;
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
    // Pass chaos-tier extras (flux-2-pro at MID, flux-2-pro/flex/max at HIGH)
    // so high-chaos users unlock weirder models in the scene gate. Migration 239.
    const tierExtras =
      chaosCfgOuter != null ? extraModelsForTier(chaosTierOuter, chaosCfgOuter) : [];
    const globalSceneModels = await fetchSceneEligibleModels(tierExtras);
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

  // ── Nightly model bans ────────────────────────────────────────────────
  // 2026-06-01 (Kevin): flux-2-dev produces too many low-quality renders for
  // nightlies. Banned across the board — scene AND character composition,
  // regardless of medium.allowed_models. Re-picks from the medium's
  // allowed_models excluding the banned list. force_model still wins (QA /
  // testing override). Centralized here so add/remove takes one edit.
  //
  // Per-medium bans layered on top (2026-06-06): LEGO renders look pasty +
  // over-smoothed under flux-2-max; banned for lego nightlies only (still
  // allowed for create-screen renders via medium.allowed_models).
  const NIGHTLY_BANNED_MODELS = new Set(['black-forest-labs/flux-2-dev']);
  const NIGHTLY_BANNED_MODELS_BY_MEDIUM: Record<string, Set<string>> = {};
  // Per-medium hard model pins: when set, that medium ALWAYS renders with
  // the pinned model for nightlies (force_model still wins for QA). LEGO +
  // pixels both pinned to gpt-image-2 — produces the cleanest physical-build /
  // 16-bit-screenshot read. Create-screen renders still use the medium's
  // full allowed_models pool.
  const NIGHTLY_PINNED_MODELS_BY_MEDIUM: Record<string, string> = {
    lego: 'openai/gpt-image-2',
    pixels: 'openai/gpt-image-2',
  };
  const perMediumBans =
    NIGHTLY_BANNED_MODELS_BY_MEDIUM[resolvedMediumKey || ''] || new Set<string>();
  const effectiveBans = new Set<string>([...NIGHTLY_BANNED_MODELS, ...perMediumBans]);
  if (!force_model && effectiveBans.has(pickedModel)) {
    const allowedMinusBanned = resolvedMediumAllowedModels.filter((m) => !effectiveBans.has(m));
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
  // Per-medium pin override — last word on which model renders this nightly.
  // Runs after the ban gate so the pin can override any default pick. Skips
  // when force_model is set (QA wins).
  if (!force_model) {
    const pin = NIGHTLY_PINNED_MODELS_BY_MEDIUM[resolvedMediumKey || ''];
    if (pin && pickedModel !== pin) {
      console.log(
        `[nightly-dreams] pin gate: medium '${resolvedMediumKey}' pinned -> '${pin}' (was '${pickedModel}')`
      );
      pickedModel = pin;
    }
  }

  // ── First-dream GPT-Image-2 ban (FIRST DREAMS ONLY) ───────────────────────
  // GPT Image 2 takes 60-120s — far too slow for the onboarding loading screen,
  // which risks a timeout/"failed" first dream. Ban it ENTIRELY for first dreams,
  // AFTER every other gate (pool pick, scene gate, per-medium pin) so it catches
  // gpt no matter how it was chosen (e.g. a scene-only first dream landing on the
  // lego/pixels pin). Re-pick a fast model from the medium's allowed_models minus
  // gpt, else a safe Flux default. force_model (QA) still wins. Nightlies never
  // hit this (isFirstDream is false), so their lego/pixels gpt pins are untouched.
  if (isFirstDream && !force_model && pickedModel === 'openai/gpt-image-2') {
    const nonGpt = resolvedMediumAllowedModels.filter((m) => m !== 'openai/gpt-image-2');
    const fallback =
      nonGpt.length > 0
        ? nonGpt[Math.floor(Math.random() * nonGpt.length)]
        : 'black-forest-labs/flux-1.1-pro';
    console.log(`[nightly-dreams] first_dream: GPT Image 2 banned (too slow) -> '${fallback}'`);
    pickedModel = fallback;
  }
  logAxes.model = pickedModel;

  // ── GPT-Image-2 cleanup ──────────────────────────────────────────────
  // GPT-Image-2 reads most of our personalized-dream prompts (medium
  // directives + vibe modifiers + sensory anchors stacked together) as
  // "go fully abstract / over-stylized" and lands on ornamental plates
  // that don't render the user's actual dream. Mirror the bot engine's
  // mediumByModel pattern (commits bf2d7096 + 2a3144e5): when the model
  // picker rolls gpt-image-2 for a nightly, prepend a strong clean
  // canvas-illustration directive so the render lands as a high-def
  // painted-canvas concept art piece with crisp readable subjects.
  // The scene / subject / vibe content downstream still drives WHAT is
  // rendered — only the style register is re-anchored.
  if (pickedModel === 'openai/gpt-image-2' && !isEmbodiedMedium) {
    const GPT_CLEAN_PREFIX =
      'Clean editorial illustration painted on canvas, high-definition concept-art render with crisp readable subjects, rich painterly depth, classical oil-on-canvas finish, gallery-tier production-art quality. ';
    finalPrompt = GPT_CLEAN_PREFIX + finalPrompt;
    console.log('[nightly-dreams] gpt-image-2 cleanup: prepended clean canvas prefix');
  } else if (pickedModel === 'openai/gpt-image-2' && isEmbodiedMedium) {
    console.log(
      '[nightly-dreams] gpt-image-2 + embodied medium: skipping canvas prefix (medium directive anchors render)'
    );
  }

  console.log(
    `[nightly-dreams] User ${userId}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // Stage breadcrumb — Flux render (records the model for hard kills).
  markStage(supabase, queueJobId, 'flux_render', pickedModel);

  try {
    console.log(`[nightly-dreams] Starting image generation (model: ${pickedModel})...`);
    // Capture for duplicate-bug observability
    const observability: Record<string, unknown> = {};

    // NOTE: the auto-generated "Place, Region" location geotag (uploads.description)
    // was ripped out 2026-06-15 — it was buggy on no-location / direct renders
    // ("No location identifiable", "Enchanted Forest, Unknown") and no longer
    // shown on cards. See generate-dream + DreamCard.

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

    // Stage breadcrumb — face swap (the memory-heaviest step; the 546 culprit).
    if (tempUrl && ((faceSwapSources && faceSwapSources.length === 2) || faceSwapSource)) {
      markStage(supabase, queueJobId, 'face_swap', pickedModel);
    }

    // Face swap: dual (two people) or single — retry up to 3 times with
    // backoff between attempts so a cold Replicate model has time to boot.
    const FACE_SWAP_MAX_RETRIES = 3;
    const FACE_SWAP_BACKOFF_MS = [2_000, 4_000];
    if (faceSwapSources && faceSwapSources.length === 2 && tempUrl) {
      // ── Gender-SAFE dual swap (see _shared/dualSwapPipeline.ts) ──
      // The Fly engine detects the two faces + their gender, splits at the gap
      // between them, and puts each cast member on their matching-gender face —
      // correct by construction (both-on-one / wrong-gender impossible). The
      // orchestrator just retries the COUPLE render until the engine reports a
      // clean 2-face split, then degrades (onboarding strict → solo-self cascade;
      // nightly cron → single self-swap).
      const s0 = faceSwapSources[0];
      const s1 = faceSwapSources[1];
      const selfSrc = faceSwapSources.find((s) => s.role === 'self')?.sourceUrl ?? s0.sourceUrl;
      const result = await genderSafeDualSwap(
        tempUrl,
        {
          dispatchDual: (target) =>
            dispatchDualFaceSwap(
              s0.sourceUrl,
              s1.sourceUrl,
              target,
              REPLICATE_TOKEN,
              supabase,
              userId,
              t0 + 140_000,
              false,
              { left: s0.gender, right: s1.gender },
              queueJobId
            ),
          singleSwap: (source, target) =>
            faceSwap(source, target, REPLICATE_TOKEN, supabase, userId, { retry: false }),
          rerender: async () => {
            const rr = await generateImage(
              'flux-dev',
              finalPrompt,
              undefined,
              {
                replicateToken: REPLICATE_TOKEN,
                openaiKey: Deno.env.get('OPENAI_API_KEY'),
                geminiKey: Deno.env.get('GEMINI_API_KEY'),
              },
              pickedModel,
              isDualFaceSwap ? 'jpg' : 'png'
            );
            observability.replicateRawUrl = rr.url;
            observability.replicatePredictionId = rr.predictionId;
            return { url: rr.url, predictionId: rr.predictionId };
          },
          selfSource: selfSrc,
          log: (m) => console.log(`[nightly-dreams] ${m}`),
        },
        { strict: strict_face_swap, deadlineMs: t0 + 140_000 }
      );
      tempUrl = result.url;
      if (result.predictionId) replicatePredictionId = result.predictionId;
      logAxes.dualFaceCount = result.faceCount;
      logAxes.faceSwapResult =
        result.outcome === 'dual'
          ? 'dual-success'
          : result.outcome === 'single'
            ? 'single-fallback-success'
            : 'dual-cascade';
      fallbackReasons.push(...result.reasons);
      lap('dual-face-swap');

      if (result.outcome === 'cascade') {
        if (strict_face_swap) {
          // Onboarding → hard-fail so the cascade re-renders a SOLO self scene.
          throw new Error('face_swap_failed:dual');
        }
        // Nightly cron → deliver the clean UNSWAPPED scene rather than a wrong face.
        console.warn('[nightly-dreams] ⚠ Dual unrecoverable — delivering unswapped scene');
      }
    } else if (faceSwapSource && tempUrl) {
      let swapSuccessSingle = false;
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
          swapSuccessSingle = true;
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
      // First-dream cascade — see comment in the dual branch above.
      if (!swapSuccessSingle && strict_face_swap) {
        throw new Error('face_swap_failed:single');
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
    // Past this elapsed budget, do NOT start another dup re-render — a re-render
    // is a full face-swap (~30-50s) + decode, and chasing the rare yan-ops
    // canned-output collision that late risks a 546 resource-limit kill that
    // loses the WHOLE dream. Ship the current output instead.
    const DUP_RERENDER_MAX_ELAPSED_MS = 80_000;
    let outBuf: ArrayBuffer | null = null;
    let outPhash: string | null = null;
    // The output decoded ONCE — reused for the perceptual hash here AND the
    // display variant below, so a face-swap render decodes the full image a
    // single time (decoding it twice was the 546 CPU hot-spot).
    let decodedOut: DecodedImage | null = null;
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
          // Decode ONCE; reuse for the hash now and the display variant later.
          decodedOut = await decodeImage(new Uint8Array(outBuf));
          outPhash = aHashFromDecoded(decodedOut);
        } catch (e) {
          console.warn(`[dup-detect] decode/aHash failed: ${(e as Error).message}`);
          decodedOut = null;
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
        // Deadline guard: a re-render is a full face-swap + decode. If we're
        // already late, skip it and ship the current output rather than risk a
        // 546 that loses the whole dream chasing a rare canned-output collision.
        if (Date.now() - t0 > DUP_RERENDER_MAX_ELAPSED_MS) {
          console.warn(
            `[dup-detect] HIT but past ${DUP_RERENDER_MAX_ELAPSED_MS}ms — skipping re-render, accepting output | phash=${outPhash}`
          );
          fallbackReasons.push(`dup_skipped_deadline:${outPhash}`);
          break;
        }
        console.warn(
          `[dup-detect] HIT attempt=${dupAttempt + 1}/${DUP_RETRY_MAX + 1} phash=${outPhash} match=${collision} dist=${hammingDistance(collision, outPhash)} — retrying face swap`
        );
        if (dupAttempt > 0) await new Promise((r) => setTimeout(r, 350));
        try {
          if (faceSwapSources && faceSwapSources.length === 2) {
            // skipPrimary: the dup is yan-ops's canned-output bug — escape to the
            // fallback models. The engine detects + gender-routes the swap on the
            // freshly regenerated render. If it finds no clean 2-face split
            // (swappedUrl null), keep the regenerated render (the next dup check
            // decides) rather than a bad crop.
            const r = await dispatchDualFaceSwap(
              faceSwapSources[0].sourceUrl,
              faceSwapSources[1].sourceUrl,
              genResult.url,
              REPLICATE_TOKEN,
              supabase,
              userId,
              t0 + 140_000,
              true,
              { left: faceSwapSources[0].gender, right: faceSwapSources[1].gender },
              queueJobId
            );
            tempUrl = r.swappedUrl ?? genResult.url;
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

    // Stage breadcrumb — storage upload + persist.
    markStage(supabase, queueJobId, 'upload', pickedModel);

    // Persist to Storage + log in parallel
    timings.total = Date.now() - t0;
    const persistPromise = outBuf
      ? persistBufferToStorage(outBuf, userId, supabase)
      : persistToStorage(tempUrl, userId, supabase);
    const [persistedUrl] = await Promise.all([
      persistPromise,
      insertGenerationLog(supabase, {
        user_id: userId,
        job_id: queueJobId,
        recipe_snapshot: asJsonbObject(vibe_profile),
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
    // Display variant: DEFER the heavy full-res JPEG encode out of this cramped
    // isolate — it was the last in-isolate 546 hot-spot. For the face-swap path
    // we already decoded the output for the dup-detect hash, so compute the CHEAP
    // thumbhash inline (instant blurry placeholder) but leave image_url_display
    // NULL; the backfill-display-variants cron builds the small JPEG out-of-process
    // (sharp) within minutes, and until then the card falls back to the full-res
    // original (image_url). Scene-only renders (no in-isolate decode, lighter,
    // never 546) keep the inline path so their variant is ready immediately.
    let displayUrl: string | null = null;
    let thumbhash: string | null = null;
    if (decodedOut) {
      try {
        thumbhash = computeThumbhash(decodedOut);
      } catch (_e) {
        thumbhash = null;
      }
    } else {
      const dv = await buildDisplayVariant(imageUrl, userId, supabase);
      displayUrl = dv.url;
      thumbhash = dv.thumbhash;
    }
    // Did a Dream-Cast face land in the final image? Drives the HD-upscale
    // block (migration 310). 'single-fallback-success' = dual degraded to self
    // only (partner dropped) but a cast face still landed → still block HD.
    // 'dual-cascade' / 'failed' delivered an UNswapped scene → NULL, HD allowed.
    const faceSwapMode =
      logAxes.faceSwapResult === 'dual-success'
        ? 'dual'
        : logAxes.faceSwapResult === 'single-fallback-success' ||
            logAxes.faceSwapResult === 'success'
          ? 'single'
          : null;
    const [uploadResult] = await Promise.all([
      supabase
        .from('uploads')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          image_url_display: displayUrl,
          thumbhash,
          caption,
          ai_prompt: finalPrompt,
          dream_medium: resolvedMediumKey ?? null,
          dream_vibe: resolvedVibeKey ?? null,
          // Which AI model rendered this — drives the model badge on
          // DreamCard (migration 211, 2026-05-30).
          model: pickedModel || null,
          face_swap_mode: faceSwapMode,
          is_ai_generated: true,
          is_public: false,
          width: 768,
          height: 1664,
          recipe: recipeForInsert,
          flux_seed: null,
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
          (e: unknown) => console.error('[nightly-dreams] ai_generation_budget upsert failed:', e)
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
      job_id: queueJobId,
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

    // Report to Sentry (no-op without SENTRY_EDGE_DSN; skip expected NSFW).
    if (!/nsfw|safety/i.test(errMsg)) {
      await captureRenderError(err, {
        fn: 'nightly-dreams',
        jobId: queueJobId,
        userId,
        stage: typeof logAxes.model === 'string' ? 'flux_render' : 'resolve',
        model: typeof logAxes.model === 'string' ? logAxes.model : force_model,
        source: strict_face_swap ? 'first_dream' : 'nightly',
        weight: 'heavy',
      });
    }

    // First-dream cascade — when strict_face_swap is set, classify the
    // failure into a structured 422 the client can act on. Face-swap and
    // NSFW exhaustions are CASCADEABLE — the client drops to a safer
    // tier (dual → single → scene-only) on a fresh call. NSFW is also
    // intentionally NOT surfaced to the user as "NSFW" — the user did
    // nothing wrong, the scene-engine roll happened to trip the model
    // safety classifier. Generic 500 stays for the nightly cron path.
    if (strict_face_swap) {
      let code: string | null = null;
      if (errMsg.startsWith('face_swap_failed:dual')) code = 'face_swap_failed_dual';
      else if (errMsg.startsWith('face_swap_failed:single')) code = 'face_swap_failed_single';
      else if (errMsg.includes('NSFW_CONTENT')) code = 'render_blocked';
      else if (errMsg.includes('WORKER_LIMIT') || errMsg.includes('worker_limit'))
        code = 'render_blocked';
      if (code) {
        return new Response(JSON.stringify({ error: code }), {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

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
