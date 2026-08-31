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

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import type { VibeProfile, DreamCastMember, MoodAxes } from '../_shared/vibeProfile.ts';
import {
  resolveMediumFromDb,
  resolveVibeFromDb,
  fetchSceneEligibleModels,
  fetchMediums,
} from '../_shared/dreamStyles.ts';
import { firstDreamMediumMode, firstDreamAllowedMediums } from '../_shared/firstDreamMediums.ts';
import { getBiomeConfig, resolveBiomeFromTags, isValidBiomeConfig } from '../_shared/biomeAxes.ts';
import { rollDream } from '../_shared/dreamAlgorithm.ts';
import { sanitizeUserText } from '../_shared/sanitizeUserText.ts';
import { restoreFace } from '../_shared/faceRestore.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';
import { sceneTypeCuts, adaptiveScenePcts } from '../_shared/sceneTypeRoll.ts';
import {
  resolveActiveHolidays,
  combineHolidayPct,
  pickWeightedHoliday,
  mapHolidayCatalogRow,
  localDateInTz,
  type ActiveHoliday,
} from '../_shared/holidayWindow.ts';
import {
  loadHolidayDual,
  loadHolidaySingle,
  holidaySingleCandidates,
  loadHolidayScenes,
  pickHoliday,
  type HolidayScene,
} from '../_shared/pools/holidayScenarioLoader.ts';
import { buildSceneFallbackPrompt } from '../_shared/sceneFallbackPrompt.ts';
import { analyzeCastPhoto } from '../_shared/analyzeCastPhoto.ts';
import {
  planCastPhotoNotify,
  castPhotoDedupId,
  type CastCandidate,
} from '../_shared/castPhotoNotify.ts';
import { pickActiveDualAction } from '../_shared/pools/dual_actions_active.ts';
import { pickActiveSingleAction } from '../_shared/pools/single_actions_active.ts';
import {
  loadActionPoses,
  eligibleActionPoses,
  loadClassicPools,
} from '../_shared/pools/actionPoseLoader.ts';
import { loadLocationSpots } from '../_shared/pools/locationSpotsLoader.ts';
import { filterUnseen, recordPick } from '../_shared/poolPickHistory.ts';
import {
  fetchChaosConfig,
  getChaosTier,
  rollNightlyDreamType,
  mapDreamTypeToInputs,
  type NightlyDreamType,
} from '../_shared/chaosTier.ts';
import { assembleScene } from '../_shared/sceneEngine.ts';
// buildRenderEntity removed — full cast description now passes to Sonnet directly
import { getLocationCard } from '../_shared/essenceCards.ts';
import { isBannedLocationName } from '../_shared/locationFilters.ts';
import type { LocationCard } from '../_shared/essenceCards.ts';
import { callSonnet } from '../_shared/llm.ts';
import { generateLocationActionBeat } from '../_shared/locationActionBeat.ts';
import { distillStyle } from '../_shared/styleDistiller.ts';
import { getCostCents, getSparkleCost, loadModelCosts } from '../_shared/modelPricing.ts';
import { nightlyModelPool, pickFromPool } from '../_shared/nightlyModelPool.ts';
import { buildRecipe } from '../_shared/recipeBuilder.ts';
import { applyVibeGenderModifier, moodAtmosphere } from '../_shared/promptCompiler.ts';
import { rollSceneAweBeat } from '../_shared/sceneAweBeat.ts';
import { sceneSeasonSignal, seasonForMonth } from '../_shared/sceneSeason.ts';
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { faceSwap } from '../_shared/faceSwap.ts';
import {
  ensureSoloSwapTarget,
  verifySoloIdentity,
  soloIdentityThreshold,
} from '../_shared/singleSwapGuard.ts';
import { dispatchDualFaceSwap } from '../_shared/dualSwapDispatch.ts';
import { classifyDualGenders } from '../_shared/vision.ts';
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
import { markStage, shouldForceSafeScene } from '../_shared/dreamQueueLifecycle.ts';
import { captureRenderError } from '../_shared/sentry.ts';
import { pickDualAction } from '../_shared/pools/dual_actions.ts';
import { pickSpecialLighting } from '../_shared/pools/dual_scenarios.ts';
import { loadDualScenarios, pickDualScenario } from '../_shared/pools/dualScenarioLoader.ts';
import {
  loadSingleScenarios,
  pickSingleScenario,
  singleScenarioCandidates,
} from '../_shared/pools/singleScenarioLoader.ts';
import { pickDualCompositionPath } from '../_shared/pools/dual_composition.ts';
import {
  runCharacterSlotPipeline,
  assembleSoloFallbackFromDual,
  type CharacterSlotPipelineInput,
  type DualSlots,
} from '../_shared/characterSlotPrompt.ts';
import { resolveCastGender } from '../_shared/genderLock.ts';
import { pickSingleAction } from '../_shared/pools/single_actions.ts';
import { pickSceneCluster } from '../_shared/pools/scene_clusters.ts';
import { applyFaceSwapOverride } from '../_shared/faceSwapFluxOverrides.ts';
import { pickFaceSwapModelOverride } from '../_shared/faceSwapModelOverrides.ts';

// Models nightly must never render. flux-2-dev over-smooths under the nightly
// slot pipeline (banned 2026-06-01). Module-scoped so BOTH the DreamSmart pool
// pick (face-swap + scene) and the downstream ban-gate backstop share one list.
const NIGHTLY_BANNED_MODELS: ReadonlySet<string> = new Set([
  'black-forest-labs/flux-2-dev',
  // TEMPORARILY DISABLED from nightly (Kevin, 2026-08-25): gpt-image-2 renders
  // WIDE images that don't fit the app's portrait dimensions (seen on solos AND
  // couple/dual dreams across mediums), and it's slow (150s IDLE_TIMEOUTs). Global
  // ban covers the general rotation; the lego/pixels pins below are also unpinned.
  // Re-enable when the wide-aspect behavior is resolved.
  'openai/gpt-image-2',
  // BANNED from nightly (Kevin, 2026-08-26): flux-2-pro renders read cheesy /
  // AI-slop on cast dreams (over-impasto on painterly mediums, plasticky on
  // others). Rip it fully out of the rotation.
  'black-forest-labs/flux-2-pro',
  // BANNED from nightly (Kevin, 2026-08-26): gemini-2-image, same call.
  'google/gemini-2-image',
  // BANNED from nightly (Kevin, 2026-08-28): flux-1.1-pro-ultra. Its 4MP output
  // defeats the dual face-swap detector ~50% of the time (8/16 faceless Aug 27-28
  // vs 10% on flux-1.1-pro) AND starves the solo-degrade budget → scene-only cast
  // dreams (Kevin's "Faanui Bay in noir" nightly). It's 0% faceless on non-swap
  // nightlies, but the quality edge over 1.1-pro is marginal and it keeps breaking
  // the "is Ultra safe here" assumption, so it's out of nightly wholesale. (The
  // downstream single/dual Ultra→pro clamp remains a backstop if this is ever
  // re-enabled for non-swap.)
  'black-forest-labs/flux-1.1-pro-ultra',
  // BANNED from nightly (Kevin, 2026-08-31): xai/grok-imagine-image.
  'xai/grok-imagine-image',
]);

// Render-budget split (Kevin 2026-08-28): a failed DUAL swap must ALWAYS leave
// room for the solo fallback to finish — a cast dream never cascades to a faceless
// pure-scene on budget. Total 140s (under the 150s gateway idle ceiling). The DUAL
// phase is capped at 140 − RESERVE so the degrade (solo render + swap) has a
// guaranteed window; the per-phase re-render reserves fit each phase in its slice.
// Root cause: Kevin's "Faanui Bay in noir" nightly — a 67s dual swap pushed the
// solo guard past its (then-shared) 75s cutoff → recover_budget_exhausted → scene.
const RENDER_DEADLINE_MS = 140_000;
const SOLO_FALLBACK_RESERVE_MS = 50_000;
const DUAL_RECOVER_MS = 40_000; // dual re-render reserve (within the dual phase)
const SOLO_RECOVER_MS = 40_000; // solo-fallback re-render reserve (fits the 50s window)

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

  // Warm the model-cost cache so the DreamSmart ≤2✦ pool filter uses the live
  // image_models.sparkle_cost (static map is the fallback). Per-isolate, 60s TTL.
  await loadModelCosts(supabase);

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
  // Per-user holiday opt-outs (HOLIDAY_DREAMS_PLAN.md §3.6) — array of disabled
  // holiday keys; absent/empty = all holidays on. Only the worker/nightly path
  // rolls holidays (first-dream sets force_place → Roll B is skipped).
  let holidayOptouts: string[] = [];

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
      .select('recipe, holiday_optouts')
      .eq('user_id', userId)
      .single();
    const recipe = (recipeRow as { recipe?: unknown } | null)?.recipe;
    vibe_profile = recipe && typeof recipe === 'object' ? (recipe as VibeProfile) : undefined;
    const optRaw = (recipeRow as { holiday_optouts?: unknown } | null)?.holiday_optouts;
    if (Array.isArray(optRaw)) {
      holidayOptouts = optRaw.filter((x): x is string => typeof x === 'string');
    }
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
  // QA-only (worker-token gated): override the dreamer's mood sliders to test
  // the mood → scene-atmosphere mapping without mutating a real profile.
  const force_moods =
    body.force_moods && typeof body.force_moods === 'object'
      ? (body.force_moods as MoodAxes)
      : undefined;
  // QA-only (worker-token gated): force the pure-scene awe/moment beat — a
  // string forces that exact beat, `true` forces the roll on.
  const force_awe_beat: string | boolean | undefined =
    typeof body.force_awe_beat === 'string'
      ? (body.force_awe_beat as string)
      : body.force_awe_beat === true
        ? true
        : undefined;
  // QA-only (worker-token gated): override the month (1-12) used for the
  // pure-scene season signal so we can test all four seasons off-date.
  const force_season_month =
    typeof body.force_season_month === 'number' &&
    body.force_season_month >= 1 &&
    body.force_season_month <= 12
      ? Math.floor(body.force_season_month)
      : undefined;
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
    (body.force_dual_pool as 'partner' | 'companion' | 'playful' | 'dynamic' | undefined) ||
    undefined;
  const force_single_pool =
    (body.force_single_pool as 'portrait' | 'candid' | 'dynamic' | undefined) || undefined;
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
  const force_active = body.force_active === true;
  const force_single_active = body.force_single_active === true;
  // Test hook: force a Stage-5c solo composition preset ('three_quarter' | 'enviro_wide').
  const force_solo_comp =
    body.force_solo_comp === 'three_quarter' || body.force_solo_comp === 'enviro_wide'
      ? (body.force_solo_comp as 'three_quarter' | 'enviro_wide')
      : null;
  // Test hook: force the ACTIVE pose pool regardless of dual_action_pose_pct
  // (production-prompt benching — the pencil lesson).
  const force_active_pose = body.force_active_pose === true;
  // Test hook: force the generative LOCATION-fit action beat (Option B) on a
  // plain-location dream regardless of location_action_pct.
  const force_location_action = body.force_location_action === true;
  // Test hook: force an EXACT action/pose text (semantic-grounding QA — replay
  // a specific historical pose against the action-grounded brief).
  const force_action = typeof body.force_action === 'string' ? body.force_action : null;
  const force_single_playful = body.force_single_playful === true;
  const force_single_elegant = body.force_single_elegant === true;
  // Test hook: force a special scene from a specific goofy CATEGORY (bucket) —
  // QA for newly seeded scenario buckets (funny audit 2026-07-09). Queries the
  // scenario table by category directly; applies to dual or solo per cast.
  const force_scene_category =
    typeof body.force_scene_category === 'string' ? body.force_scene_category : null;
  // Holiday Dreams QA: force a holiday season regardless of the date. On the
  // cast paths it draws that holiday's pool='holiday' rows; on the pure-scene
  // path it draws its holiday_scenes rows. Test-only.
  const force_holiday_scene =
    typeof body.force_holiday_scene === 'string' ? body.force_holiday_scene : null;
  // QA: force the pure-scene (no-cast) composition even for a user who HAS a cast
  // photo — the only way to exercise Path 2 (scene-only holiday) on such an account.
  const force_pure_scene = body.force_pure_scene === true;
  // DRY RUN: exercise the full roll → recipe → Sonnet brief → prompt-assembly
  // pipeline for a location and RETURN the assembled prompt WITHOUT rendering
  // (no Flux, no face swap, no upload, no log). Used to smoke-test every location
  // pre-go-live so a broken card can never produce a "dead dream" in production.
  const dry_run = body.dry_run === true;
  // QA: restrict the holiday draw to a single archetype (sub_theme) so we can grade
  // one archetype in isolation (vampire / witch / corn_maze / …). Null = mixed.
  const force_holiday_sub_theme =
    typeof body.force_holiday_sub_theme === 'string' ? body.force_holiday_sub_theme : null;
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
  // Pure-scene fallback (DREAM_CAST_HARDENING_PLAN.md) — declared handler-wide so
  // the prompt is BUILT at brief-time (scene context is live) and CONSUMED at the
  // swap-result point (that context is out of scope by then). CAPTURE, not reach.
  let sceneFallbackPrompt: string | null = null;
  let sceneFallbackApplied = false;
  let swapUnusable = false;
  let soloSimBest: number | null = null;
  let resolvedMediumKey: string | undefined;
  let resolvedVibeKey: string | undefined;
  // Hoisted for the post-try scene-composition model gate (mig 213). The
  // gate runs after pickModel — needs to know the composition rolled inside
  // the try block + the picked medium's allowed_models to intersect with
  // engine_config.scene_eligible_models.
  let resolvedComposition: 'character' | 'epic_tiny' | 'pure_scene' | undefined;
  // The holiday season this dream belongs to (Path 1 cast OR Path 2 scene-only),
  // or null. Declared at handler scope so it reaches the uploads insert (§5 marker).
  let holidayCategory: string | null = null;
  // Durable seed-source provenance (migration 450). Declared at handler scope so it
  // reaches BOTH the rolled_axes logAxes AND the uploads insert. Assigned once the
  // scene/pool is resolved (before the composition branch).
  let seedSource: {
    kind: string;
    scene: string | null;
    posePool: string | null;
    location: string | null;
    biome: string | null;
  } | null = null;
  let resolvedMediumAllowedModels: string[] = [];
  // Per-medium scene-eligible model override (mig 214). NULL → fall back to
  // engine_config.scene_eligible_models global. Captured for the post-try gate.
  let resolvedMediumSceneModels: string[] | null = null;
  // The FINAL medium's DreamSmart set — the source for the nightly ≤2✦ model
  // pick (2026-07-22). Captured out here (the medium object is try-scoped) and
  // re-synced after every medium re-roll so the pick reflects the real style.
  let resolvedMediumSmartModels: string[] = [];
  let faceSwapSource: string | undefined;
  // Cast gender for the SOLO swap guard (singleSwapGuard.ts) — set where
  // faceSwapSource is set. null = unknown → the guard checks face count only.
  let faceSwapGender: 'male' | 'female' | null = null;
  let faceSwapSources:
    | Array<{ role: string; sourceUrl: string; gender: 'male' | 'female' | null | undefined }>
    | undefined;
  // Cast members (with role + relationship + storage_path) captured at source-
  // assignment time for the cast-photo auto-notify — selectedCast/castPick are
  // block-scoped and out of scope by the swap-result point (CAPTURE, not reach).
  let castNotifyMembers: DreamCastMember[] = [];
  let finalPrompt: string = '';
  // Hoisted DUAL solo-fallback context. When a dual face-swap fails every retry,
  // the recovery re-renders self ALONE using assembleSoloFallbackFromDual (a
  // genuine single-character prompt built from self's already-computed
  // wardrobe + the shared scene) instead of the old couple-prompt-with-prefix
  // that kept rendering two people → faceless. Captured after the slot pipeline
  // builds the dual; null on the freeform-brief path (falls back to the legacy
  // prefix). See _shared/characterSlotPrompt.ts (root-caused 2026-08-27).
  let soloFallbackCtx: {
    dualSlots: DualSlots;
    input: CharacterSlotPipelineInput;
    selfIndex: 0 | 1;
  } | null = null;
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
    // L6 variety: the specific pure-scene anchor (spot_text) the user last got,
    // so the picker doesn't roll the same view two nights running (the biggest
    // "same-y" driver, especially for users with only a place or two).
    const recentAnchors = (recentLogs ?? [])
      .map((l) => (l.rolled_axes as Record<string, unknown>)?.anchor)
      .filter((a): a is string => typeof a === 'string' && a.length > 0);
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

    // ── L4 safe-scene floor (NIGHTLY_DREAM_GUARANTEE_PLAN.md) ──
    // A nightly that has already failed several times is most likely a character
    // roll that RELIABLY trips the NSFW filter (L3's re-rolls keep failing). On a
    // late retry, force a people-free pure_scene of the user's own place — inherently
    // SFW — so they ALWAYS get a beautiful dream instead of looping to dead-letter.
    if (queueJobId) {
      const { data: qj } = await supabase
        .from('dream_queue')
        .select('attempt_count')
        .eq('id', queueJobId)
        .single();
      if (shouldForceSafeScene(qj ? qj.attempt_count : null)) {
        preRolledComposition = 'pure_scene';
        preRolledCastRole = null;
        console.log(
          `[nightly-dreams] L4 safe-scene floor: attempt_count=${qj?.attempt_count} → force pure_scene (guaranteed-SFW)`
        );
      }
    }

    // Pick from the curated dream-eligible pool — NOT from the user's
    // stored art_styles/aesthetics. Migration 160 added is_dream_eligible
    // as the auto-gen quality gate. The user's create-screen options stay
    // broad; nightly is curated. recentMediums/recentVibes still apply for
    // rotation across the eligible pool.
    // First-dream medium curation (2026-07-18): restrict the STARTER dream a new
    // user sees to an approved style set — CAST tiers → List A (face-swap styles),
    // the scene FALLBACK tier → List A + active Dream Art. First-dream ONLY: the
    // gate returns null for a normal nightly / create / QA force_medium, so those
    // pass `undefined` (no restriction, unchanged behavior). The allow-list is
    // threaded into EVERY medium resolution below (initial + char-ban + scene +
    // scenario re-rolls) so no re-roll can reintroduce a non-approved style.
    // See _shared/firstDreamMediums.ts.
    const fdMode = firstDreamMediumMode({
      forceFaceSwapEligible: force_face_swap_eligible,
      forceCastRole: force_cast_role,
      forceMedium: force_medium,
    });
    const firstDreamAllow = fdMode
      ? firstDreamAllowedMediums(fdMode, await fetchMediums())
      : undefined;

    let nightlyMedium = await resolveMediumFromDb(
      preRolledMediumToken,
      recentMediums,
      undefined,
      firstDreamAllow
    );
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
    const moods = force_moods ??
      nightlyProfile.moods ?? {
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
    const effectiveCastRole = force_pure_scene
      ? null // QA: no cast → forces the pure-scene path
      : preRolledType != null && force_cast_role === undefined
        ? preRolledCastRole
        : force_cast_role;
    const effectiveComposition = force_pure_scene
      ? 'pure_scene' // QA: rollDream honors an explicit forceComposition
      : preRolledType != null
        ? preRolledComposition
        : null;
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
      nightlyMedium = await resolveMediumFromDb(
        'dream_eligible_face_swap',
        recentMediums,
        undefined,
        firstDreamAllow
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
      nightlyMedium = await resolveMediumFromDb(
        sceneToken,
        recentMediums,
        undefined,
        firstDreamAllow
      );
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
    resolvedMediumSmartModels = nightlyMedium.smartDreamModels;
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
    // ORPHAN GUARD (2026-08-31): only keep saved places that still resolve to a real
    // picker card. Legacy freeform strings ("a tropical beach at sunset") and cards
    // pulled from the picker (picker_category=null, e.g. robot city) would otherwise
    // be rolled as a `userPlace`, fail the card lookup, and degrade to a place-less
    // render. Backstops the client-side selection migration for any not-yet-migrated
    // user. Cheap (~160-row set, cast/scene rolls hit the DB anyway).
    const { data: validCardRows } = await supabase
      .from('location_cards')
      .select('name')
      .not('picker_category', 'is', null);
    const validCardNames = new Set((validCardRows ?? []).map((c: { name: string }) => c.name));
    let placePool: string[] = (seeds.places ?? [])
      .map((p: string) => sanitizeUserText(String(p), 'subject_description'))
      .filter((p: string) => p && !isBannedLocationName(p) && validCardNames.has(p));
    // BACKUP (2026-08-25): onboarding still requires ≥1 place, so the only way to
    // reach zero is deliberately unselecting all in Settings. When that happens,
    // fall back to the FULL live location catalog so the dreamer still gets varied
    // place dreams from everywhere instead of a place-less backdrop. pickedCount
    // then reads as "many", so adaptiveScenePcts gives them the full location share.
    if (placePool.length === 0 && includeLocation && !force_place) {
      const { data: allCards } = await supabase
        .from('location_cards')
        .select('name')
        .not('picker_category', 'is', null)
        .eq('admin_only', false);
      placePool = (allCards ?? [])
        .map((c: { name: string }) => c.name)
        .filter((n: string) => n && !isBannedLocationName(n));
    }
    // Effective pool size the dreamer draws from (post-backup, pre recent-exclusion)
    // → drives adaptiveScenePcts: more places picked = more location dreams.
    const pickedCount = placePool.length;
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
    // (Re-)pick the face-swap render model from a medium's DreamSmart ≤2✦ pool
    // + apply the single-swap Ultra clamp. A closure so a scenario medium
    // re-roll (below) can re-pick from the FINAL medium's smart set — the pool
    // is now medium-dependent (unlike the old fixed FACE_SWAP_MODELS rotation).
    const pickFaceSwapModelFor = (medium: typeof baseMedium): string => {
      const pool = nightlyModelPool({
        smartDreamModels: medium.smartDreamModels,
        allowedModels: medium.allowedModels,
        costOf: getSparkleCost,
        bans: NIGHTLY_BANNED_MODELS,
      });
      let m = pickFromPool(pool);
      // Ultra clamp (single AND dual): Ultra renders at 4MP. Single-swap providers
      // downscale it until the face is undetectable; and the DUAL detector fails to
      // split its oversized faces ~50% of the time (8/16 faceless Aug 27-28 vs 10%
      // on flux-1.1-pro), while Ultra's slow multi-attempt render starves the
      // solo-degrade budget → pure-scene-fallback (Kevin's 2026-08-28 "Faanui Bay in
      // noir" nightly went scene-only this way). The 2026-06-01 "dual is safe on
      // Fly's 2GB" assumption held for MEMORY but NOT for split reliability, so clamp
      // both paths to the reliable 1.1-pro sibling.
      if (
        (isSingleHumanFaceSwap || isDualFaceSwap) &&
        m === 'black-forest-labs/flux-1.1-pro-ultra'
      ) {
        m = 'black-forest-labs/flux-1.1-pro';
        fallbackReasons.push(
          isDualFaceSwap ? 'dual_ultra_clamped_to_pro' : 'single_ultra_clamped_to_pro'
        );
      }
      // Dual-swap flex clamp: flux-2-flex fails the dual split ~25% of the time
      // (2× the pool average) → clamp to flux-1.1-pro, a reliable dual sibling
      // (~14%). (flux-2-pro was the original clamp target but is now nightly-banned
      // for cheesy cast output, so we retarget to 1.1-pro. 2026-08-26, Kevin.)
      if (isDualFaceSwap && m === 'black-forest-labs/flux-2-flex') {
        m = 'black-forest-labs/flux-1.1-pro';
        fallbackReasons.push('dual_flex_clamped_to_1.1pro');
      }
      return m;
    };
    if (isFaceSwapCharacter) {
      // DreamSmart pool (2026-07-22): a model proven to render THIS style, ≤2✦,
      // minus nightly bans. Replaces the old hardcoded FACE_SWAP_MODELS /
      // FIRST_DREAM_MODELS rotations. First-dream uses the same pool (per Kevin);
      // the too-slow gpt-image-2 is still dropped for first dreams downstream.
      faceSwapPrePickedModel = force_model ? force_model : pickFaceSwapModelFor(baseMedium);
      console.log(
        `[nightly] face-swap character model (${selectedCast.length === 2 ? 'dual' : 'single'}) for '${baseMedium.key}': ${faceSwapPrePickedModel}`
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
            force_dual_pool,
            (await loadClassicPools(supabase)).dual
          )
        : null;
    const singleActionObj = isSingleCharacter
      ? pickSingleAction(force_single_pool, (await loadClassicPools(supabase)).single)
      : null;
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
    const sceneCluster = pickSceneCluster(
      userPlace,
      force_cluster_kind,
      await loadLocationSpots(supabase)
    );
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
    // Medium affinity: imagined worlds (biome_config.imagined=true, set on the
    // fantasy/sci-fi/gothic-fantasy/aquatic-fantasy cards) ban photo-adjacent
    // mediums (see the ban block below). Real locations — even those sharing a
    // biome like gothic_historic (Prague/London) — are NOT marked and keep photography.
    let imaginedLocation = false;
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
        // L6 variety: prefer an anchor the user hasn't gotten recently. Fall
        // back to the full pool if de-duping would starve it (mirrors
        // filterRecent's >=2 rule — small/thin location pools).
        const recentAnchorSet = new Set(recentAnchors);
        const freshSpots = spots.filter((s) => !recentAnchorSet.has(s.spot_text));
        const anchorPool = freshSpots.length >= 2 ? freshSpots : spots;
        const picked = anchorPool[Math.floor(Math.random() * anchorPool.length)];
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
      // Imagined-world marker (biome_config.imagined) → medium affinity ban below.
      // Fallback: the three unambiguously-imagined biomes (no real location uses
      // them) also count, so a new imagined card is covered even before it's marked.
      if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) {
        imaginedLocation = (cfg as Record<string, unknown>).imagined === true;
      }
      imaginedLocation =
        imaginedLocation ||
        biomeKey === 'fantasy_imagined' ||
        biomeKey === 'scifi_cosmic' ||
        biomeKey === 'aquatic_underwater';
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
    // Which special pool the scene came from — the pose pick branches on THIS,
    // not on wardrobe truthiness (goofy rows carry a literal 'normal…clothes'
    // attire string, so `dualSpecialWardrobe ?` mis-routed all goofy scenes to
    // the partner pose pool; found while wiring pose_pool, 2026-07-09).
    let dualSceneKind: 'goofy' | 'elegant' | null = null;
    // Bespoke pose pool named by the picked scenario row (migration 353) —
    // e.g. 'glamour'. Null = default pose behavior for the scene kind.
    let dualScenePosePool: string | null = null;
    // Forced medium named by the picked scenario row (migration 354) — e.g.
    // 'photography' for the photo-genre parody seeds. Null = rolled medium.
    let dualSceneMediumKey: string | null = null;
    // Banned medium named by the picked scenario row (migration 355) — if the
    // roll landed on it, re-roll from the face-swap pool minus this key.
    let dualSceneMediumBan: string | null = null;
    // ACTIVE scenario (ACTION_POSE_EXPANSION_PLAN.md): the scene text embeds
    // the body action, so the pose slot gets a fixed face-mandate string
    // instead of a rolled pose (a playful thumbs-up would fight the go-kart).
    let dualActiveScene = false;
    let soloActiveScene = false;
    // ── Holiday Dreams (HOLIDAY_DREAMS_PLAN.md) — the season(s) active for THIS
    // user's LOCAL date (H2), gated by the master switch + per-user opt-out.
    // Several can be active at once (Fall + Halloween overlap in early Oct); the
    // roll below sums their pcts and picks one weighted by pct. `holidayCategory`
    // is set on a holiday hit for the uploads marker + bot message.
    let activeHolidays: ActiveHoliday[] = [];
    try {
      if (force_holiday_scene) {
        // QA: force one season at full strength, ignoring date + is_active + opt-out.
        const { data: fr } = await supabase
          .from('holidays')
          .select('*')
          .eq('key', force_holiday_scene)
          .single();
        if (fr) {
          const c = mapHolidayCatalogRow(fr as Record<string, unknown>);
          activeHolidays = [
            {
              key: c.key,
              displayName: c.displayName,
              emoji: c.emoji,
              holidayPct: 100,
              daysUntilPeak: 0,
            },
          ];
        }
      } else {
        const holCfg = await fetchEngineConfig(supabase);
        if (holCfg.holidaysEnabled) {
          const { data: tzRow } = await supabase
            .from('users')
            .select('timezone')
            .eq('id', userId)
            .single();
          const userTz = (tzRow as { timezone?: string | null } | null)?.timezone ?? null;
          const localDate = localDateInTz(new Date(), userTz);
          const { data: catRows } = await supabase
            .from('holidays')
            .select('*')
            .eq('is_active', true);
          if (catRows && catRows.length) {
            const catalog = catRows.map((r) => mapHolidayCatalogRow(r as Record<string, unknown>));
            const optouts = new Set(holidayOptouts);
            activeHolidays = resolveActiveHolidays(localDate, catalog).filter(
              (h) => !optouts.has(h.key)
            );
          }
        }
      }
    } catch (_holErr) {
      activeHolidays = []; // fail to a normal nightly, never a broken render (N2)
    }
    // Holiday Path 2 (HOLIDAY_DREAMS_PLAN.md §3.4): a PURE-SCENE nightly can become
    // a scene-only holiday (no-cast users + the sprinkle). Roll among the active
    // seasons' holiday_scenes pools (N2: only non-empty ones contribute); on a hit
    // this render is a festive standalone scene with its own pinned medium.
    let holidayScene: HolidayScene | null = null;
    let holidaySceneMediumFragment: string | null = null;
    if (composition === 'pure_scene' && activeHolidays.length > 0) {
      try {
        const holScenePools = await Promise.all(
          activeHolidays.map(async (h) => ({
            h,
            rows: await loadHolidayScenes(supabase, h.key, force_holiday_sub_theme),
          }))
        );
        const usable = holScenePools.filter((x) => x.rows.length > 0).map((x) => x.h);
        const pct = combineHolidayPct(usable);
        if (usable.length > 0 && Math.random() * 100 < pct) {
          const chosen = pickWeightedHoliday(usable, Math.random());
          holidayScene = pickHoliday(holScenePools.find((x) => x.h.key === chosen.key)!.rows);
          holidayCategory = chosen.key;
          fallbackReasons.push(`holiday_scene:${chosen.key}`);
          if (holidayScene.mediumKey) {
            try {
              const m = await resolveMediumFromDb(holidayScene.mediumKey);
              if (m?.fluxFragment) holidaySceneMediumFragment = m.fluxFragment;
            } catch (_mErr) {
              /* unknown medium key → fall to the rolled medium */
            }
          }
        }
      } catch (_p2Err) {
        holidayScene = null; // N2: fall through to a normal postcard
      }
    }
    // A MANDATED location (force_place) suppresses the goofy/elegant special-scene
    // roll entirely. force_place is set ONLY by the onboarding FIRST DREAM, which
    // must put the user in the place they JUST picked — the "here's you in YOUR
    // spot" showcase moment — never a random rodeo/ballroom from the pools.
    // Regular nightly dreams pass no force_place, so they keep the special-
    // scene variety mix below (engine_config-tunable since migration 347;
    // defaults 20 goofy / 20 elegant / 0 active — remainder = the location).
    if (!force_place) {
      // QA hook: pull a random scenario from an exact bucket (category column) in
      // ANY pool (goofy/elegant/active), bypassing the roll + shuffle-bag AND the
      // isolate scenario cache (this is a live DB query). Test-only path — lets us
      // QA a freshly-seeded bucket without a redeploy or enabling its pool %.
      if (force_scene_category && (isDualFaceSwap || isSingleHumanFaceSwap)) {
        const table = isDualFaceSwap ? 'dual_scenarios' : 'single_scenarios';
        const { data: catRows } = await supabase
          .from(table)
          .select('scene,attire,pool,pose_pool,medium_key,medium_ban')
          .eq('category', force_scene_category)
          .eq('disabled', false);
        if (catRows && catRows.length > 0) {
          const s = catRows[Math.floor(Math.random() * catRows.length)];
          dualSpecialScene = s.scene as string;
          dualSpecialWardrobe = s.attire as string;
          dualScenePosePool = (s.pose_pool as string | null) ?? null;
          dualSceneMediumKey = (s.medium_key as string | null) ?? null;
          dualSceneMediumBan = (s.medium_ban as string | null) ?? null;
          // Mirror the production per-pool pose behavior so QA reflects the real
          // render: ACTIVE-pool scenes embed the action in the scene text (the
          // pose follows the scene, "caught mid-action"); goofy/elegant draw the
          // pose from their kind's pool.
          if ((s.pool as string) === 'active') {
            if (isDualFaceSwap) dualActiveScene = true;
            else soloActiveScene = true;
          } else {
            dualSceneKind = (s.pool as string) === 'elegant' ? 'elegant' : 'goofy';
          }
          fallbackReasons.push(`forced_scene_category:${force_scene_category}:${s.pool}`);
        }
      }
      if (dualSpecialScene) {
        // forced above — skip the roll
      } else if (isDualFaceSwap) {
        const pools = await loadDualScenarios(supabase);
        const splitCfg = await fetchEngineConfig(supabase);
        // Holiday (HOLIDAY_DREAMS_PLAN.md §3.4 Path 1): load each active season's
        // dual pool; only seasons with >=1 usable row contribute (N2 empty-pool
        // fall-through). The combined pct feeds the renormalized cut (§3.3a).
        const holDualPools = await Promise.all(
          activeHolidays.map(async (h) => ({
            h,
            rows: await loadHolidayDual(supabase, h.key, force_holiday_sub_theme),
          }))
        );
        const usableHol = holDualPools.filter((x) => x.rows.length > 0).map((x) => x.h);
        const holidayPct = combineHolidayPct(usableHol);
        const { holidayCut, goofyCut, elegantCut, activeCut } = sceneTypeCuts(
          adaptiveScenePcts(
            {
              goofy: splitCfg.dualSceneGoofyPct,
              elegant: splitCfg.dualSceneElegantPct,
              active: splitCfg.dualSceneActivePct,
            },
            pickedCount
          ),
          { activeEnabled: pools.active.length >= 10, holidayPct }
        );
        const roll = Math.random();
        // Shuffle-bag (mig 349): filter each pool to this user's UNSEEN
        // entries before picking; record what was served. Fail-open.
        if (
          usableHol.length > 0 &&
          !force_playful &&
          !force_elegant &&
          !force_active &&
          roll < holidayCut
        ) {
          // Holiday won: pick one active season weighted by pct, draw its costume+scene.
          const chosen = pickWeightedHoliday(usableHol, Math.random());
          const rows = holDualPools.find((x) => x.h.key === chosen.key)!.rows;
          const s = pickDualScenario(
            await filterUnseen(supabase, userId, `holiday:${chosen.key}`, rows, (x) => x.scene)
          );
          dualSpecialScene = s.scene;
          dualSpecialWardrobe = s.attire;
          dualSceneKind = 'elegant'; // refined partner pose — NO playful thumbs-up/props on holiday
          // Couples use the refined 'partner' pool (via elegant+wardrobe fall-through),
          // NOT the shared 'glamour' pool — glamour is intentionally campy soap-opera
          // (mirrored prayer-hands / game-show smiles) and reads twee on holiday couples.
          dualScenePosePool = s.posePool ?? null;
          dualSceneMediumKey = s.mediumKey ?? null;
          dualSceneMediumBan = s.mediumBan ?? null;
          holidayCategory = chosen.key;
          fallbackReasons.push(`holiday:${chosen.key}`);
          recordPick(supabase, userId, `holiday:${chosen.key}`, s.scene);
        } else if (force_playful || (!force_elegant && !force_active && roll < goofyCut)) {
          const s = pickDualScenario(
            await filterUnseen(supabase, userId, 'dual_scn_goofy', pools.goofy, (x) => x.scene)
          );
          dualSpecialScene = s.scene;
          dualSpecialWardrobe = s.attire;
          dualSceneKind = 'goofy';
          dualScenePosePool = s.posePool ?? null;
          dualSceneMediumKey = s.mediumKey ?? null;
          dualSceneMediumBan = s.mediumBan ?? null;
          recordPick(supabase, userId, 'dual_scn_goofy', s.scene);
        } else if (force_elegant || (!force_active && roll < elegantCut)) {
          const s = pickDualScenario(
            await filterUnseen(supabase, userId, 'dual_scn_elegant', pools.elegant, (x) => x.scene)
          );
          dualSpecialScene = s.scene;
          dualSpecialWardrobe = s.attire;
          dualSceneKind = 'elegant';
          dualScenePosePool = s.posePool ?? null;
          dualSceneMediumKey = s.mediumKey ?? null;
          dualSceneMediumBan = s.mediumBan ?? null;
          recordPick(supabase, userId, 'dual_scn_elegant', s.scene);
        } else if ((force_active && pools.active.length > 0) || roll < activeCut) {
          const s = pickDualScenario(
            await filterUnseen(supabase, userId, 'dual_scn_active', pools.active, (x) => x.scene)
          );
          dualSpecialScene = s.scene;
          dualSpecialWardrobe = s.attire;
          // Apply the row's medium ban/key (goofy/elegant branches above do this;
          // the active branch must too, or fantasy_hero/superhero/giant_critter
          // render photoreal-creepy instead of painterly). Downstream force/reroll
          // at ~1358-1441 reads these two vars.
          dualSceneMediumKey = s.mediumKey ?? null;
          dualSceneMediumBan = s.mediumBan ?? null;
          dualActiveScene = true;
          fallbackReasons.push('active_scenario');
          recordPick(supabase, userId, 'dual_scn_active', s.scene);
        }
      } else if (isSingleHumanFaceSwap) {
        const pools = await loadSingleScenarios(supabase);
        const g = castGender === 'male' || castGender === 'female' ? castGender : null;
        const splitCfg = await fetchEngineConfig(supabase);
        // Gendered-solo lean (Operation Sweet Dreams): when > 0, a solo dream of
        // a KNOWN gender widens elegant + active (half the boost each) at the
        // expense of plain. Currently 0 (Kevin, 2026-08-13) → solos roll the SAME
        // split as dual. Tunable via single_gendered_boost_pct.
        // Holiday (Path 1, solo): candidates = each active season's single pool for
        // this gender (any ∪ gender). Only seasons with >=1 candidate contribute (N2).
        const holSinglePools = await Promise.all(
          activeHolidays.map(async (h) => ({
            h,
            rows: holidaySingleCandidates(
              await loadHolidaySingle(supabase, h.key, force_holiday_sub_theme),
              g ?? 'any'
            ),
          }))
        );
        const usableHolSolo = holSinglePools.filter((x) => x.rows.length > 0).map((x) => x.h);
        const holidayPct = combineHolidayPct(usableHolSolo);
        const { holidayCut, goofyCut, elegantCut, activeCut } = sceneTypeCuts(
          adaptiveScenePcts(
            {
              goofy: splitCfg.singleSceneGoofyPct,
              elegant: splitCfg.singleSceneElegantPct,
              active: splitCfg.singleSceneActivePct,
            },
            pickedCount
          ),
          {
            genderedBoostPct: g ? splitCfg.singleGenderedBoostPct : 0,
            activeEnabled: pools.active.any.length >= 10,
            holidayPct,
          }
        );
        const roll = Math.random();
        const pickSolo = async (pool: 'goofy' | 'elegant' | 'active') => {
          const candidates = await filterUnseen(
            supabase,
            userId,
            `solo_scn_${pool}`,
            singleScenarioCandidates(pools, pool, g),
            (x) => x.scene
          );
          if (candidates.length === 0) return null;
          const s = candidates[Math.floor(Math.random() * candidates.length)];
          recordPick(supabase, userId, `solo_scn_${pool}`, s.scene);
          return s;
        };
        if (
          usableHolSolo.length > 0 &&
          !force_single_playful &&
          !force_single_elegant &&
          !force_single_active &&
          roll < holidayCut
        ) {
          const chosen = pickWeightedHoliday(usableHolSolo, Math.random());
          const rows = holSinglePools.find((x) => x.h.key === chosen.key)!.rows;
          const unseen = await filterUnseen(
            supabase,
            userId,
            `holiday:${chosen.key}`,
            rows,
            (x) => x.scene
          );
          const pool = unseen.length ? unseen : rows; // fail-open if all seen
          const s = pool[Math.floor(Math.random() * pool.length)];
          dualSpecialScene = s.scene;
          dualSpecialWardrobe = s.attire;
          dualSceneKind = 'elegant'; // refined solo pose — NO playful/active props on holiday
          dualScenePosePool = s.posePool ?? 'glamour'; // refined glamour poses, never peace-signs/gestures
          dualSceneMediumKey = s.mediumKey ?? null;
          dualSceneMediumBan = s.mediumBan ?? null;
          holidayCategory = chosen.key;
          fallbackReasons.push(`holiday:${chosen.key}`);
          recordPick(supabase, userId, `holiday:${chosen.key}`, s.scene);
        } else if (
          force_single_playful ||
          (!force_single_elegant && !force_single_active && roll < goofyCut)
        ) {
          const s = await pickSolo('goofy');
          if (s) {
            dualSpecialScene = s.scene;
            dualSpecialWardrobe = s.attire;
            dualSceneKind = 'goofy';
            dualScenePosePool = s.posePool ?? null;
            dualSceneMediumKey = s.mediumKey ?? null;
            dualSceneMediumBan = s.mediumBan ?? null;
          }
        } else if (force_single_elegant || (!force_single_active && roll < elegantCut)) {
          const s = await pickSolo('elegant');
          if (s) {
            dualSpecialScene = s.scene;
            dualSpecialWardrobe = s.attire;
            dualSceneKind = 'elegant';
            dualScenePosePool = s.posePool ?? null;
            dualSceneMediumKey = s.mediumKey ?? null;
            dualSceneMediumBan = s.mediumBan ?? null;
          }
        } else if (force_single_active || roll < activeCut) {
          const s = await pickSolo('active');
          if (s) {
            dualSpecialScene = s.scene;
            dualSpecialWardrobe = s.attire;
            // Apply the row's medium ban/key (see the dual-active branch note).
            dualSceneMediumKey = s.mediumKey ?? null;
            dualSceneMediumBan = s.mediumBan ?? null;
            soloActiveScene = true;
            fallbackReasons.push('active_scenario_solo');
          }
        }
      }
    }
    // Scenario-forced medium (migration 354): photo-genre parody seeds (80s
    // glamour shots, decade eras) force 'photography' so the joke reads as an
    // actual photo instead of the rolled art medium. Re-resolve the medium the
    // same way the earlier face-swap block built it: base row → face-swap
    // override (no-op for photography) → curated per-model fragment override
    // for the ALREADY-picked model (all rotation models are in photography's
    // allowed_models). Explicit force_medium wins; any resolution problem
    // keeps the rolled medium (fail-open — a bad medium_key can't break a
    // dream). Safe to swap post-roll: scenario rolls only happen on face-swap
    // renders and only face-swap-capable natural mediums are honored, so the
    // eligibility flags computed earlier stay truthful.
    // medium_ban may hold a COMMA-SEPARATED list (Operation Sweet Dreams —
    // fantastical scenes ban EVERY photo-real-adjacent medium, not just
    // photography). Parse once; a legacy single key parses to a 1-element array.
    // Medium affinity by setting (Kevin 2026-08-24): IMAGINED biomes (fantasy /
    // sci-fi) render as "bad photoshop / AI slop" under photo-real mediums — a
    // photoreal person in a dwarven hall reads composited onto a plain set. Ban the
    // photo-adjacent set for those biomes so the roll lands on a PAINTERLY medium
    // (canvas etc.) that renders subject + scene as ONE coherent image. REAL biomes
    // keep photography — it coheres for plausible settings (Kevin's hearted forest
    // shots were photography). Reuses the Operation Sweet Dreams ban list + re-roll.
    // Scoped to face-swap renders (scene-only cinematic stays untouched).
    const IMAGINED_BIOME_MEDIUM_BAN =
      'photography,film_noir,vintage_film,double_exposure,heirloom,glamour';
    const imaginedBiome = imaginedLocation;
    const bannedMediums = [
      ...(dualSceneMediumBan ? dualSceneMediumBan.split(',') : []),
      ...(imaginedBiome && preRolledComposition !== 'pure_scene'
        ? IMAGINED_BIOME_MEDIUM_BAN.split(',')
        : []),
    ]
      .map((k) => k.trim())
      .filter(Boolean);
    if (dualSceneMediumKey && !force_medium && dualSceneMediumKey !== nightlyMedium.key) {
      try {
        const forced = await resolveMediumFromDb(
          dualSceneMediumKey,
          undefined,
          undefined,
          firstDreamAllow
        );
        if (
          forced &&
          forced.key === dualSceneMediumKey && // unknown keys fall back — reject
          forced.faceSwaps &&
          forced.characterRenderMode === 'natural'
        ) {
          nightlyMedium = forced;
          resolvedMediumKey = forced.key; // feeds the model ban/scene gates + persist
          baseMedium = applyFaceSwapOverride(forced);
          // Re-sync the captured medium metadata so the model pick + gates use
          // the NEW medium (was a pre-existing staleness hazard).
          resolvedMediumAllowedModels = nightlyMedium.allowedModels;
          resolvedMediumSceneModels = nightlyMedium.sceneEligibleModels;
          resolvedMediumSmartModels = nightlyMedium.smartDreamModels;
          if (faceSwapPrePickedModel && !force_model) {
            // Medium changed → re-pick from the NEW medium's DreamSmart ≤2✦ pool
            // so the model still matches the style we're actually rendering.
            faceSwapPrePickedModel = pickFaceSwapModelFor(nightlyMedium);
          }
          if (faceSwapPrePickedModel) {
            const modelOverride = pickFaceSwapModelOverride(
              faceSwapPrePickedModel,
              nightlyVibe?.key ?? null
            );
            if (modelOverride) baseMedium = { ...baseMedium, fluxFragment: modelOverride };
          }
          fallbackReasons.push(`scene_medium:${dualSceneMediumKey}`);
          console.log(`[nightly] scenario forced medium: ${dualSceneMediumKey}`);
        }
      } catch (_e) {
        // keep the rolled medium
      }
    } else if (bannedMediums.length && !force_medium && bannedMediums.includes(nightlyMedium.key)) {
      // Scenario-banned medium (migration 355 + Operation Sweet Dreams): the
      // roll landed on a medium this scenario reads badly in (e.g. fantastical
      // buckets + any photo-real-adjacent medium → creepy photoreal
      // dragons/giant props). Re-roll from the face-swap pool minus ALL the
      // banned keys; any problem keeps the rolled medium (fail-open — a bad
      // medium_ban can't break a dream).
      // Exclude ONLY the banned keys — adding recentMediums could shrink the
      // pool under filterRecent's ≥2 floor, which falls back to the FULL pool
      // and could re-serve a banned medium. A possible recency repeat beats
      // shipping a banned medium. (The face-swap pool has ~12 mediums, so
      // excluding the 6 photo-adjacent still leaves a healthy painterly set.)
      try {
        const rerolled = await resolveMediumFromDb(
          'dream_eligible_face_swap',
          bannedMediums,
          undefined,
          firstDreamAllow
        );
        if (
          rerolled &&
          !bannedMediums.includes(rerolled.key) &&
          rerolled.faceSwaps &&
          rerolled.characterRenderMode === 'natural'
        ) {
          nightlyMedium = rerolled;
          resolvedMediumKey = rerolled.key;
          baseMedium = applyFaceSwapOverride(rerolled);
          resolvedMediumAllowedModels = nightlyMedium.allowedModels;
          resolvedMediumSceneModels = nightlyMedium.sceneEligibleModels;
          resolvedMediumSmartModels = nightlyMedium.smartDreamModels;
          if (faceSwapPrePickedModel && !force_model) {
            // Medium changed → re-pick from the NEW medium's DreamSmart ≤2✦ pool
            // so the model still matches the style we're actually rendering.
            faceSwapPrePickedModel = pickFaceSwapModelFor(nightlyMedium);
          }
          if (faceSwapPrePickedModel) {
            const modelOverride = pickFaceSwapModelOverride(
              faceSwapPrePickedModel,
              nightlyVibe?.key ?? null
            );
            if (modelOverride) baseMedium = { ...baseMedium, fluxFragment: modelOverride };
          }
          fallbackReasons.push(`scene_medium_ban:${dualSceneMediumBan}->${rerolled.key}`);
          console.log(
            `[nightly] scenario banned medium ${dualSceneMediumBan}; re-rolled ${rerolled.key}`
          );
        }
      } catch (_e) {
        // keep the rolled medium
      }
    }
    const dualSpecialLighting = dualSpecialScene ? pickSpecialLighting() : null;
    const effectiveUserPlace = dualSpecialScene ?? userPlace;

    // CAPTURE the pure-scene fallback prompt NOW, while the scene context (medium
    // + location + time/weather/phenomena axes) is in scope — it's gone by the
    // swap-result point. Consumed only if the swap turns out unusable, so we ship
    // this dream's real place, empty + atmospheric, never strangers.
    sceneFallbackPrompt = buildSceneFallbackPrompt({
      mediumFragment: baseMedium.fluxFragment,
      // NOT dualSpecialScene — a scenario's scene text describes PEOPLE ("the
      // couple as pirates"), which would put people back in a people-free scene.
      // Use the real place; for pure-scenario dreams (no place) fall to a dreamscape.
      location: iconicAnchor ?? userPlace ?? 'a vast, empty dreamlike landscape',
      timeAxis,
      weatherAxis,
      phenomenaAxis,
    });

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
        // Phase A (ACTION_POSE_EXPANSION_PLAN.md): plain-location duals roll the
        // biome-tagged ACTIVE pose pool with dual_action_pose_pct probability —
        // jetski only where the resolved biome is coastal, skiing only alpine,
        // untagged entries anywhere. Miss/off → classic pools, byte-identical.
        let activeSinglePose: string | null = null;
        if (selectedCast.length === 1 && !dualSpecialScene && !dualSpecialWardrobe) {
          const poseCfg = await fetchEngineConfig(supabase);
          const rollActive =
            force_active_pose ||
            (poseCfg.singleActionPosePct > 0 && Math.random() * 100 < poseCfg.singleActionPosePct);
          if (rollActive) {
            const poseDb = await loadActionPoses(supabase);
            const cands = await filterUnseen(
              supabase,
              userId,
              'solo_pose_active',
              eligibleActionPoses(poseDb.solo, biomeKey),
              (x) => x.text
            );
            activeSinglePose = pickActiveSingleAction(biomeKey, cands);
            if (activeSinglePose) {
              fallbackReasons.push(`active_pose_solo:${biomeKey ?? 'universal'}`);
              recordPick(supabase, userId, 'solo_pose_active', activeSinglePose);
            }
          }
        }
        let activePose: string | null = null;
        if (selectedCast.length === 2 && !dualSpecialScene && !dualSpecialWardrobe) {
          const poseCfg = await fetchEngineConfig(supabase);
          const rollActive =
            force_active_pose ||
            (poseCfg.dualActionPosePct > 0 && Math.random() * 100 < poseCfg.dualActionPosePct);
          if (rollActive) {
            const poseDb = await loadActionPoses(supabase);
            const cands = await filterUnseen(
              supabase,
              userId,
              'dual_pose_active',
              eligibleActionPoses(poseDb.dual, biomeKey),
              (x) => x.text
            );
            activePose = pickActiveDualAction(biomeKey, cands);
            if (activePose) {
              fallbackReasons.push(`active_pose:${biomeKey ?? 'universal'}`);
              recordPick(supabase, userId, 'dual_pose_active', activePose);
            }
          }
        }
        // Option B (2026-08-10): generative LOCATION-fit action beat for plain-
        // location dreams. Covers EVERY place (not just the biome-tagged poses,
        // whose coverage is thin → most biomes fell back to standing). Rolls only
        // when the biome ACTIVE pose above did NOT fire; swap-safe by the
        // authoring envelope in locationActionBeat.ts. Behind location_action_pct
        // (0 = off) + the force_location_action QA flag.
        let locationAction: string | null = null;
        const plainLocation = !dualSpecialScene && !dualSpecialWardrobe;
        if (plainLocation && !force_active_pose && !activePose && !activeSinglePose) {
          const locCfg = await fetchEngineConfig(supabase);
          const rollLoc =
            force_location_action ||
            (locCfg.locationActionPct > 0 && Math.random() * 100 < locCfg.locationActionPct);
          if (rollLoc) {
            locationAction = await generateLocationActionBeat(
              iconicAnchor || userPlace || '',
              selectedCast.length === 2 ? 2 : 1,
              ANTHROPIC_KEY!
            );
            if (locationAction) fallbackReasons.push('location_action');
          }
        }
        // Scene-matched pose. Precedence per cast size:
        //   active scene → the fixed mid-action framing text
        //   scenario names a bespoke pose pool (migration 353) → pick from it
        //   goofy scenario → playful pool (branch on the scene KIND — goofy
        //     rows carry a literal 'normal…clothes' attire string, so the old
        //     `dualSpecialWardrobe ?` check mis-routed all goofy to partner)
        //   elegant scenario → refined partner pool
        //   plain location → the pre-rolled active/classic pose
        const classicPools = await loadClassicPools(supabase);
        const bespokePoses = dualScenePosePool
          ? ((selectedCast.length === 2
              ? classicPools.bespoke.dual[dualScenePosePool]
              : classicPools.bespoke.solo[dualScenePosePool]) ?? [])
          : [];
        let action: string | null;
        if (force_action) {
          action = force_action;
        } else if (selectedCast.length === 2) {
          if (dualActiveScene) {
            action =
              'caught mid-action exactly as the scene describes, with a clear gap between them, both faces toward the camera';
          } else if (bespokePoses.length > 0) {
            action = bespokePoses[Math.floor(Math.random() * bespokePoses.length)];
            fallbackReasons.push(`bespoke_pose:${dualScenePosePool}`);
          } else if (dualSceneKind === 'goofy') {
            action = pickDualAction(undefined, 'playful', classicPools.dual);
          } else if (dualSpecialWardrobe) {
            action = pickDualAction(
              selectedCast.find((c) => c.role === 'plus_one')?.relationship,
              'partner',
              classicPools.dual
            );
          } else if (dualSpecialScene) {
            action = pickDualAction(undefined, 'playful', classicPools.dual);
          } else {
            action = activePose ?? locationAction ?? dualAction;
          }
        } else if (soloActiveScene) {
          action = 'caught mid-action exactly as the scene describes, face toward the camera';
        } else if (bespokePoses.length > 0) {
          action = bespokePoses[Math.floor(Math.random() * bespokePoses.length)];
          fallbackReasons.push(`bespoke_pose_solo:${dualScenePosePool}`);
        } else {
          action = activeSinglePose ?? locationAction ?? singleAction ?? null;
        }
        // Captured into a named var (not passed inline) so a later dual-swap
        // failure can rebuild a SOLO prompt for self from the very same input.
        const slotInput: CharacterSlotPipelineInput = {
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
          // Prefer the vibe's FACE-SWAP directive on the swap path (realistic
          // human face despite a stylized scene — the kawaii big-eyes fix);
          // matches dualBriefBuilder + the create path. Falls back to normal.
          vibeDirective: applyVibeGenderModifier(
            nightlyVibe.key,
            nightlyVibe.faceSwapDirective ?? nightlyVibe.directive,
            castGender ?? null
          ),
          avoidList,
          action,
          // Stage 5c: expanded solo compositions (three-quarter / enviro-wide)
          // with singleCompositionExpandedPct probability; classic waist-up
          // otherwise. Identity gates (restore + post-swap verify) backstop
          // the smaller faces.
          soloComposition:
            selectedCast.length === 1
              ? (force_solo_comp ??
                (await (async () => {
                  const cfg = await fetchEngineConfig(supabase);
                  if (
                    cfg.singleCompositionExpandedPct > 0 &&
                    Math.random() * 100 < cfg.singleCompositionExpandedPct
                  ) {
                    // enviro_wide reliably shrinks the face below the swap's
                    // identity floor (observed identity_sim ~0.13 < 0.15 → tiny
                    // faces / multi_face → pure_scene_fallback: the cast render
                    // silently becomes scene-only). three_quarter keeps the
                    // expanded-composition variety while holding a swap-safe
                    // face size (identity ~0.7). enviro_wide stays reachable via
                    // the explicit force_solo_comp test hook only. (2026-08-24)
                    const preset = 'three_quarter';
                    fallbackReasons.push(`solo_comp:${preset}`);
                    return preset as 'three_quarter' | 'enviro_wide';
                  }
                  return null;
                })()))
              : null,
        };
        const slotResult = await runCharacterSlotPipeline(slotInput, ANTHROPIC_KEY!);
        sonnetBrief = slotResult.briefUsed;
        sonnetRawResponse = slotResult.rawResponse;
        finalPrompt = slotResult.assembledPrompt;
        slotPipelineFallbacks = slotResult.fallbackReasons;
        slotPipelineHandled = true;
        // For a DUAL cast, capture self's side + the built dual slots so that if
        // the dual face-swap later fails every retry, the recovery re-renders
        // self ALONE (a real single-character prompt) instead of the couple
        // prompt — guaranteeing a cast dream never ships faceless. Only when the
        // slots are genuinely dual ('left_wardrobe' present); the freeform-brief
        // path leaves soloFallbackCtx null and uses the legacy prefix.
        if (isDualFaceSwap && 'left_wardrobe' in slotResult.slots) {
          const selfIdx = resolvedCast.findIndex((rc) => rc.role === 'self');
          soloFallbackCtx = {
            dualSlots: slotResult.slots as DualSlots,
            input: slotInput,
            selfIndex: selfIdx === 1 ? 1 : 0,
          };
        }
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

    // Seed-source stamp (2026-08-30): capture WHICH scene pool / scenario / pose
    // pool / location produced this render, so a quarantined "bad render"
    // (migration 449) can be grouped by its origin — surfacing a seed pool or a
    // specific scenario that repeatedly renders junk. Spread into every logAxes
    // path below. All vars are in scope here (declared before this branch).
    seedSource = {
      // Which scene bucket/pool: holiday:<season> / active / goofy / elegant /
      // scenario (other special) / location (plain location, no scenario).
      kind: holidayCategory
        ? `holiday:${holidayCategory}`
        : dualActiveScene
          ? 'active'
          : (dualSceneKind ?? (dualSpecialScene ? 'scenario' : 'location')),
      // The scenario seed text (truncated) — the per-seed identifier for grouping.
      scene: dualSpecialScene ? dualSpecialScene.slice(0, 160) : null,
      // The pose pool (the seed-pool-level pose identifier); the exact pose text
      // stays recoverable from enhanced_prompt + fallback_reasons.
      posePool: dualScenePosePool,
      location: iconicAnchor ?? userPlace ?? null,
      biome: biomeKey,
    };

    if (composition === 'character') {
      if (faceSwapEligible) {
        const faceLockPhrase = isDualFaceSwap
          ? 'two people, three-quarter view to camera, both faces visible to camera, person on left side, person on right side, clear gap between them, NEITHER facing away, NEITHER from behind, NO back view, NO back of head, both heads turned toward camera'
          : 'three-quarter view to camera, face visible to camera, eyes and nose visible, head turned toward camera, NO back view, NO back of head, NO silhouette, NOT facing away';
        const dualSepRule = isDualFaceSwap
          ? `\n- ━━━ ROLE-TO-SIDE LOCK (NON-NEGOTIABLE) ━━━\n- The FIRST cast member (${resolvedCast[0]?.role ?? 'self'}) MUST be on the LEFT half of the frame.\n- The SECOND cast member (${resolvedCast[1]?.role ?? 'plus_one'}) MUST be on the RIGHT half of the frame.\n- DO NOT swap their positions. Reversing breaks the face-swap pipeline (faces land on wrong bodies → gender swap disaster).\n- Clear ~2-3 ft gap between them. NO overlap across the midline.\n- BOTH at SAME VERTICAL HEIGHT — both standing OR both sitting OR both crouching. NEVER one tall + one short.\n- BOTH faces three-quarter to camera. NO back views. NO profiles. NO faces away.\n- Both heads at the SAME Y-axis line so the L/R crop captures each face cleanly.`
          : '';
        // Stylized FACE-SWAP mediums that need an explicit "keep faces realistic"
        // rule so Flux doesn't cartoon-ify the swapped face. Only 'pencil' remains
        // here: storybook/fairytale/anime moved to embodied (drawn-as-character,
        // never face-swapped), so they can never reach this face-swap branch.
        const stylizedMediums = new Set(['pencil']);
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
      } else if (isEmbodiedMedium) {
        // ━━━ EMBODIED "you AS a character" brief — CHARACTER-DOMINANT ━━━
        // Dream Art mediums (kawaii, fairytale, …): the user is DRAWN as the cute
        // hero — large, front and center, face clearly visible — with the setting as
        // only a soft backdrop. This deliberately does NOT use the scene-first /
        // "wide and far shots welcome" / epic-backdrop structure in the else branch
        // below. That scene-dominance shrinks or DROPS the embodied person: unlike a
        // face swap (where the real face is pasted in afterward regardless of scale),
        // an embodied hero only exists if Flux actually renders them big — a sweeping
        // vista leaves no hero at all. Root-caused 2026-07-10 (fairytale + kawaii
        // scene-only / tiny-back-turned-figure dropout, ~40-50% of single casts).
        const isDualCast = resolvedCast.length === 2;
        nightlyBrief = `You are a ${mediumStyle} artist drawing ${isDualCast ? 'two people' : 'a person'} AS ${isDualCast ? 'adorable characters' : 'an adorable character'}. Write a Flux AI prompt (75-110 words, comma-separated).

THE GOAL: the DESCRIBED PERSON${isDualCast ? 'S' : ''} below, drawn as the HERO of the image — large, front and center, face${isDualCast ? 's' : ''} clearly visible. This is a CHARACTER PORTRAIT, not a landscape. The person is the subject; the setting is only a soft, cozy backdrop behind them.

STRUCTURE — follow this order EXACTLY:
1. Start with: "${baseMedium.fluxFragment}"
2. THE CHARACTER${isDualCast ? 'S' : ''} — the MAJORITY of the prompt (${isDualCast ? '45-55' : '40-50'} words): render the cast below with EVERY identifying trait, a warm expressive face, and a natural pose. ${isDualCast ? 'BOTH people together, side by side, a clear gap between their heads, both faces LARGE and clearly visible.' : 'One person, filling much of the frame, face LARGE and clearly visible.'}
3. A SIMPLE BACKDROP (20-25 words MAX): a soft, cozy, gently-suggested setting behind them inspired by ${iconicAnchor || userPlace || 'a warm cozy place'} — just enough to set the mood, kept subordinate to the character${isDualCast ? 's' : ''}.
4. End with: no text, no words, no letters, no watermarks, ultra detailed

CHARACTER${isDualCast ? 'S' : ''} TO DRAW:
${castDescBlock}
${castInstruction}
${singleAction ? `\nBODY POSE (use the verbs, keep it a close/medium shot):\n"${singleAction}"\n` : ''}${dualAction ? `\nBODY POSE (both characters):\n"${dualAction}"\n` : ''}
CAST RULES — NON-NEGOTIABLE:
- PRESERVE every identifying trait: age, gender, hair color and length, beard/no beard, glasses, build, complexion. This is how the user recognizes ${isDualCast ? 'themselves and their loved one' : 'themselves'}.
- Be SPECIFIC, never "a man" / "a woman".
${isDualCast ? '- BOTH people fully visible, both faces clear, neither cropped, neither merged, a clear gap between their heads.' : ''}

MOOD (light + palette only): ${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}
${avoidList}

FRAMING LOCK — NON-NEGOTIABLE:
- CLOSE-UP or MEDIUM shot. The character${isDualCast ? 's' : ''} fill${isDualCast ? '' : 's'} at least 60% of the frame. Face${isDualCast ? 's' : ''} large and clearly visible, front or three-quarter angle, NEVER back-turned, NEVER a silhouette.
- The person is ALWAYS present and dominant. This is NOT an empty landscape, NOT a wide establishing shot, NOT a tiny distant figure, NOT a sweeping vista. Do NOT use "monumentally vast", "enormous", "sweeping", "stretching away", or any scale-dominant scenery language.
- The setting stays a soft, simple backdrop — always subordinate to the character${isDualCast ? 's' : ''}.
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
            ? 'BOTH characters MUST be FULLY visible as COMPLETE figures, positioned TOGETHER within the frame, NEITHER cropped, cut off, or pushed off the edge. Both stand near the center of the composition, side by side, both fully inside the frame — do NOT place one at the far edge. NOT one person alone. NOT empty scenery. The cast description above is non-negotiable: both individuals must appear fully.'
            : 'The character MUST be present and clearly visible in the scene, fully within the frame (not cropped at the edge). Wide and far shots are welcome.'
        }
- Every word must be something a camera can see. No feelings, no metaphors.
Output ONLY the prompt.`;
      }
      logAxes = {
        medium: nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-cast-character',
        seedSource,
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
        seedSource,
        nightlyPath,
        castRoles: selectedCast.map((m) => m.role),
        composition,
        chaosTier: chaosTierOuter,
        dreamType: preRolledType,
      };
    } else if (holidayScene) {
      // ── Holiday scene-only (Path 2) — the holiday_scenes row IS the locked
      // subject; its own light/time carry the atmosphere; its pinned medium wins. ──
      const holMediumFragment = holidaySceneMediumFragment ?? baseMedium.fluxFragment;
      nightlyBrief = `You are composing a dreamlike, festive POSTCARD scene. Write a Flux AI prompt (55-80 words, comma-separated).

━━━ THE SCENE (LOCKED — NON-NEGOTIABLE) ━━━
${holidayScene.scene}

Render EXACTLY this scene, richly and immersively — it fills the frame. Its OWN light, time of day, and weather are the truth: do not override them, do not swap in a different place, do not add competing subjects.

MEDIUM: ${holMediumFragment}

MOOD (tone only — do NOT let mood pull in new subjects):
${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}

ENHANCING LANGUAGE (mandatory): a DEFINED light source named explicitly, LAYERED depth (foreground / midground / background), SATURATED color, DENSE detail on every surface.

HARD BANS: NO people as the subject (tiny distant silhouettes at most), NO text, NO words, NO letters, NO watermarks, NO real brand or place names.

End with: no text, no words, no letters, no watermarks, hyper detailed, masterwork composition.
Output ONLY the prompt.`;
      logAxes = {
        medium: holidaySceneMediumFragment
          ? `holiday:${holidayScene.mediumKey}`
          : nightlyMedium.key,
        vibe: nightlyVibe.key,
        engine: 'nightly-holiday-scene',
        seedSource,
        holiday: holidayCategory,
        tone: holidayScene.tone ?? null,
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
      // L4 awe/moment beat — a rare "the scene is HAPPENING" spectacle. Shares
      // the single-extra budget with PHENOMENON (never both, so the scene never
      // stacks into a collage — the 2026-06-03 failure above), skipped for
      // intimate scenes, and rendered as a BACKGROUND accent so the locked
      // subject stays the hero.
      let aweBeat: string | null = null;
      if (typeof force_awe_beat === 'string') {
        aweBeat = force_awe_beat;
      } else {
        const wantAwe =
          force_awe_beat === true ||
          (!includePhenomenon && !isIntimateScene && Math.random() < 0.3);
        if (wantAwe)
          aweBeat = rollSceneAweBeat(timeAxis, weatherAxis, isIntimateScene, Math.random);
      }
      const aweBeatLine = aweBeat
        ? `\n- AWE MOMENT (one transient spectacle rendered as a BACKGROUND accent in the sky or distance — heightens the moment, but the LOCKED SUBJECT stays dominant; integrate with the established TIME + WEATHER, never override them; NO people, NO animals, NO narrative): ${aweBeat}`
        : '';
      // L5 season signal — the dreamer's place in its CURRENT season (climate-
      // gated by biome; northern-hemisphere month mapping). Always-on for a
      // seasonal biome (not rolled). Holidays take their own brief branch above,
      // so this only colors an ordinary postcard. force_season_month is QA-only.
      const seasonMonth = force_season_month ?? parseInt(today.slice(5, 7), 10);
      const seasonSignal = sceneSeasonSignal(biomeKey, seasonMonth);
      const seasonLine = seasonSignal
        ? `\n\nSEASON — render the LOCKED SUBJECT in this season; foliage, ground cover, and seasonal color reflect it, while WEATHER stays the source of sky and precipitation: ${seasonSignal}`
        : '';
      nightlyBrief = `You are a cinematographer capturing the most beautiful, wallpaper-worthy view of ${userPlace || 'the location'} — an aspirational moment from a dream trip, the kind of image that makes someone long to be there. Compose the SAME locked subject below at its most inviting; do NOT add anything to the scene. Write a Flux AI prompt (50-75 words, comma-separated).

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
SUBJECT FRAMING: ${subjectRule}${seasonLine}

VARIATION AXES (alter LIGHT, ATMOSPHERE, and CAMERA ONLY — never the subject):
- TIME: ${timeAxis}
- WEATHER: ${weatherAxis}
- CAMERA: ${cameraAxis}${phenomenonLine}${aweBeatLine}

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
${applyVibeGenderModifier(nightlyVibe.key, nightlyVibe.directive, castGender ?? null)}${
        moodAtmosphere(moods)
          ? `\nDREAMER'S MOOD (shape LIGHT, COLOR, and ATMOSPHERE to this feeling — never add new subjects): ${moodAtmosphere(moods)}`
          : ''
      }
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
        seedSource,
        biome: biomeKey || null,
        anchor: iconicAnchor || null,
        anchor_scale: iconicAnchorScale || null,
        time: timeAxis.split(' — ')[0],
        weather: weatherAxis.split(',')[0],
        phenomenon_included: includePhenomenon,
        awe_beat: aweBeat || null,
        season: seasonSignal ? `${seasonForMonth(seasonMonth)}:${biomeKey}` : null,
        dreamer_mood: moodAtmosphere(moods) || null,
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
    // NOTE: embodied Dream Art renders are CHARACTER-DOMINANT — never front-load the
    // location. Leading with "set in <place>," gives the place noun CLIP's first-noun
    // dominance → Flux renders the landscape and shrinks/drops the drawn hero (the
    // person isn't pasted in afterward). The embodied brief already carries the place
    // as a subordinate backdrop clause, so skip the prepend entirely here.
    if (
      includeLocation &&
      effectiveUserPlace &&
      !isEmbodiedMedium &&
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
        castNotifyMembers = [s, p];
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
      faceSwapGender = resolveCastGender(castPick as DreamCastMember);
      castNotifyMembers = [castPick as DreamCastMember];
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

  // DRY RUN short-circuit: the full prompt is assembled + sanitized. Return it
  // (plus any degradation breadcrumbs) WITHOUT rendering — the pre-go-live
  // "dead dream" smoke test asserts every location yields a real, non-empty
  // prompt here. No side effects past this point (render/swap/upload/log).
  if (dry_run) {
    return new Response(
      JSON.stringify({
        dry_run: true,
        finalPrompt,
        promptLength: finalPrompt ? finalPrompt.length : 0,
        fallbackReasons: fallbackReasons ?? [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Force any bare "cave" reference to "lava cave" — generic caves drift
  // toward dungeon/temple aesthetics. Lava caves anchor back to volcanic
  // landscape (Hawaii lava tubes etc.). Negative lookbehind skips matches
  // already prefixed with "lava ".
  finalPrompt = finalPrompt.replace(/(?<!\blava\s)\bcaves?\b/gi, (m) =>
    m.toLowerCase().endsWith('s') ? 'lava caves' : 'lava cave'
  );

  // Scene / pet (non-face-swap) base pick: from the FINAL rolled medium's
  // DreamSmart set, ≤2✦, minus nightly bans (2026-07-22 — replaces the legacy
  // pickModel/allowed_models resolver). Face-swap dreams already picked their
  // model above (faceSwapPrePickedModel); the scene-composition gate below
  // narrows this further to scene-eligible models.
  const sceneBaseModel = pickFromPool(
    nightlyModelPool({
      smartDreamModels: resolvedMediumSmartModels,
      allowedModels: resolvedMediumAllowedModels,
      costOf: getSparkleCost,
      bans: NIGHTLY_BANNED_MODELS,
    })
  );
  let pickedModel = force_model ? force_model : faceSwapPrePickedModel || sceneBaseModel;

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
    // NULL or empty → fall back to the global list. HARD ≤2✦ cap for nightly:
    // no chaos-tier model expansion (dropped 2026-07-22). We narrow the
    // DreamSmart ≤2✦ pool to models that are ALSO scene-eligible; if that
    // intersection is empty, nightlyModelPool falls back to the ≤2✦ smart set
    // (never scene-inappropriate-empty).
    const globalSceneModels = await fetchSceneEligibleModels([]);
    const sceneEligibleModels =
      resolvedMediumSceneModels && resolvedMediumSceneModels.length > 0
        ? resolvedMediumSceneModels
        : globalSceneModels;
    const sceneSrcLabel =
      resolvedMediumSceneModels && resolvedMediumSceneModels.length > 0
        ? 'medium-override'
        : 'global';
    if (sceneEligibleModels.length > 0) {
      const scenePool = nightlyModelPool({
        smartDreamModels: resolvedMediumSmartModels,
        allowedModels: resolvedMediumAllowedModels,
        costOf: getSparkleCost,
        bans: NIGHTLY_BANNED_MODELS,
        intersectWith: sceneEligibleModels,
      });
      if (!scenePool.includes(pickedModel)) {
        const oldModel = pickedModel;
        pickedModel = pickFromPool(scenePool);
        console.log(
          `[nightly-dreams] scene path (${resolvedComposition}): re-picked model '${oldModel}' -> scene-eligible DreamSmart '${pickedModel}' (pool ${scenePool.length}, source=${sceneSrcLabel})`
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
  // NIGHTLY_BANNED_MODELS is module-scoped (also folded into the DreamSmart
  // pool pick upstream); this gate is the backstop.
  const NIGHTLY_BANNED_MODELS_BY_MEDIUM: Record<string, Set<string>> = {};
  // Per-medium hard model pins: when set, that medium ALWAYS renders with
  // the pinned model for nightlies (force_model still wins for QA). LEGO +
  // pixels both pinned to gpt-image-2 — produces the cleanest physical-build /
  // 16-bit-screenshot read. Create-screen renders still use the medium's
  // full allowed_models pool.
  const NIGHTLY_PINNED_MODELS_BY_MEDIUM: Record<string, string> = {
    // TEMPORARILY UNPINNED (Kevin, 2026-08-25): gpt-image-2 disabled from nightly
    // (wide-aspect + slow) — see NIGHTLY_BANNED_MODELS. lego/pixels fall back to
    // their normal allowed_models pool minus the ban. Restore these pins when
    // gpt-image-2 is re-enabled.
    // lego: 'openai/gpt-image-2',
    // pixels: 'openai/gpt-image-2',
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
  // that don't render the user's actual dream. So we prepend an
  // anti-abstraction anchor (crisp, readable, detailed, high-def).
  // STYLE-NEUTRAL: the old prefix hard-coded "oil-on-canvas illustration",
  // which fought the newer scene mediums (watercolor rendered "oil-on-canvas",
  // cinematic rendered as illustration). The medium's own flux_fragment
  // downstream defines the LOOK; this prefix only anchors quality/legibility.
  if (pickedModel === 'openai/gpt-image-2' && !isEmbodiedMedium) {
    const GPT_CLEAN_PREFIX =
      'High-definition render, crisp and clearly readable subjects, richly detailed, clean well-composed image, gallery quality. ';
    finalPrompt = GPT_CLEAN_PREFIX + finalPrompt;
    console.log('[nightly-dreams] gpt-image-2 cleanup: prepended style-neutral quality prefix');
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
        xaiKey: Deno.env.get('XAI_API_KEY'),
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
      const selfGender = faceSwapSources.find((s) => s.role === 'self')?.gender ?? null;
      // Reserve a solo-fallback window: the DUAL phase (swap + re-renders) must
      // finish by dualDeadlineMs, so the degrade solo render+swap always has
      // SOLO_FALLBACK_RESERVE_MS left to run to completion (never scene-only).
      const renderDeadlineMs = t0 + RENDER_DEADLINE_MS;
      const dualDeadlineMs = renderDeadlineMs - SOLO_FALLBACK_RESERVE_MS;
      const result = await genderSafeDualSwap(
        tempUrl,
        {
          dispatchDual: (target, genderOverride) =>
            dispatchDualFaceSwap(
              s0.sourceUrl,
              s1.sourceUrl,
              target,
              REPLICATE_TOKEN,
              supabase,
              userId,
              dualDeadlineMs,
              false,
              { left: s0.gender, right: s1.gender },
              queueJobId,
              genderOverride ?? null
            ),
          confirmGenders: async (target) => {
            const r = await classifyDualGenders(target, REPLICATE_TOKEN);
            return { left: r.left, right: r.right };
          },
          singleSwap: async (source, target) => {
            // GENDER-SAFE degrade + SOLO re-render (#1 + #3 — sunnysteph 2026-08-05
            // "face on the man"): the single-swap models are FACE-BLIND — they paste
            // self onto the most-prominent face, which on a couple render is the
            // partner (wrong gender). Guard it: probe the render (Haiku for stylized
            // mediums, where genderage misreads painted faces — this dream was
            // oil-on-canvas) and paste self ONLY on a gender-safe render.
            // #3: on the couple `target` the guard REFUSES (the partner is a
            // wrong-gender face) — so instead of cascading straight to an unswapped
            // scene, we give the guard a real SOLO re-render (one gender-matching
            // person alone) and let it place self on THAT clean body. Self lands on
            // a matching-gender figure rather than "whichever couple-face scored
            // higher." If budget's gone (guard's 75s recover floor) or the re-render
            // still isn't safe, it returns null → cascade to the clean scene.
            const soloNoun =
              selfGender === 'female' ? 'woman' : selfGender === 'male' ? 'man' : 'person';
            const guard = await ensureSoloSwapTarget(
              target,
              {
                castGender: selfGender,
                replicateToken: REPLICATE_TOKEN,
                rerender: async () => {
                  // Rebuild a GENUINE solo prompt for self (partner dropped) from
                  // the dual's own slots. This replaces the old couple-prompt +
                  // "exactly one person" prefix, which kept rendering two people
                  // (the prefix can't override a couple prompt's L/R body) → the
                  // guard saw a wrong-gender partner face and refused → faceless.
                  // Falls back to the legacy prefix only on the freeform-brief
                  // path (soloFallbackCtx null). (root-caused 2026-08-27)
                  const soloPrompt = soloFallbackCtx
                    ? assembleSoloFallbackFromDual(
                        soloFallbackCtx.dualSlots,
                        soloFallbackCtx.input,
                        soloFallbackCtx.selfIndex
                      )
                    : `exactly one person, a solo portrait of a single ${soloNoun} alone, ${finalPrompt}`;
                  fallbackReasons.push(
                    soloFallbackCtx ? 'solo_fallback:rebuilt_solo' : 'solo_fallback:legacy_prefix'
                  );
                  const rr = await generateImage(
                    'flux-dev',
                    soloPrompt,
                    undefined,
                    {
                      replicateToken: REPLICATE_TOKEN,
                      openaiKey: Deno.env.get('OPENAI_API_KEY'),
                      geminiKey: Deno.env.get('GEMINI_API_KEY'),
                      xaiKey: Deno.env.get('XAI_API_KEY'),
                    },
                    pickedModel,
                    'png'
                  );
                  observability.replicateRawUrl = rr.url;
                  observability.replicatePredictionId = rr.predictionId;
                  return { url: rr.url, predictionId: rr.predictionId };
                },
                log: (m) => console.log(`[nightly-dreams] degrade-guard: ${m}`),
              },
              {
                maxRerenders: 1,
                mediumKey: resolvedMediumKey,
                // FULL render deadline + a SHORT reserve: this is the last-resort
                // solo fallback, guaranteed its reserved window by the shortened
                // dual phase above — it must fire, not settle to a scene.
                deadlineMs: renderDeadlineMs,
                recoverBudgetMs: SOLO_RECOVER_MS,
              }
            );
            fallbackReasons.push(...guard.reasons.map((r) => `degrade_${r}`));
            if (!guard.safe) return null;
            const swapped = await faceSwap(source, guard.url, REPLICATE_TOKEN, supabase, userId, {
              retry: false,
            });
            // predictionId of the SOLO re-render (#3) rides back so the pipeline
            // returns it as result.predictionId → the caller stamps the persisted
            // render, not the abandoned couple render.
            return { url: swapped, predictionId: guard.predictionId };
          },
          rerender: async (attempt: number) => {
            const rr = await generateImage(
              'flux-dev',
              // Stage 5a: final retry mutates — see generate-dream twin.
              attempt >= 2
                ? `two people side by side, both faces clearly visible and unobstructed, heads apart, ${finalPrompt}`
                : finalPrompt,
              undefined,
              {
                replicateToken: REPLICATE_TOKEN,
                openaiKey: Deno.env.get('OPENAI_API_KEY'),
                geminiKey: Deno.env.get('GEMINI_API_KEY'),
                xaiKey: Deno.env.get('XAI_API_KEY'),
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
        {
          strict: strict_face_swap,
          deadlineMs: dualDeadlineMs,
          recoverBudgetMs: DUAL_RECOVER_MS,
        }
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
        console.warn('[nightly-dreams] ⚠ Dual unrecoverable — pure-scene fallback');
        swapUnusable = true;
      }
    } else if (faceSwapSource && tempUrl) {
      // ── Solo-swap safety guard (see _shared/singleSwapGuard.ts) ──
      // The single-swap models are face-blind: if the render invented a second
      // person, the cast face can land on the WRONG person (the 2026-07-05
      // "wife's face on the man" failure). Probe face count + gender;
      // re-render while unsafe; never paste unconfirmed.
      const soloGuard = await ensureSoloSwapTarget(
        tempUrl,
        {
          castGender: faceSwapGender,
          replicateToken: REPLICATE_TOKEN,
          rerender: async () => {
            // Front-load the person count on the retry — re-rolling the identical
            // prompt mostly re-renders the same invented couple (see the
            // generate-dream twin). Subject-count only, never the scene.
            const soloNoun =
              faceSwapGender === 'female' ? 'woman' : faceSwapGender === 'male' ? 'man' : 'person';
            const rr = await generateImage(
              'flux-dev',
              `exactly one person, a solo portrait of a single ${soloNoun} alone, ${finalPrompt}`,
              undefined,
              {
                replicateToken: REPLICATE_TOKEN,
                openaiKey: Deno.env.get('OPENAI_API_KEY'),
                geminiKey: Deno.env.get('GEMINI_API_KEY'),
                xaiKey: Deno.env.get('XAI_API_KEY'),
              },
              pickedModel,
              'png'
            );
            observability.replicateRawUrl = rr.url;
            observability.replicatePredictionId = rr.predictionId;
            return { url: rr.url, predictionId: rr.predictionId };
          },
          log: (m) => console.log(`[nightly-dreams] ${m}`),
        },
        { deadlineMs: t0 + 140_000, mediumKey: resolvedMediumKey }
      );
      fallbackReasons.push(...soloGuard.reasons);
      logAxes.soloFaceCount = soloGuard.faceCount;
      if (!soloGuard.safe) {
        if (strict_face_swap) {
          // Onboarding first-dream → hard-fail so the cascade re-renders solo-self.
          throw new Error('face_swap_failed:single');
        }
        // Nightly cron → deliver the clean UNSWAPPED scene rather than risk
        // pasting the face onto an invented second person.
        console.warn('[nightly-dreams] ⚠ Solo swap unconfirmed — pure-scene fallback');
        logAxes.faceSwapResult = 'solo-unsafe-unswapped';
        swapUnusable = true;
      } else {
        tempUrl = soloGuard.url;
        if (soloGuard.predictionId) replicatePredictionId = soloGuard.predictionId;
        const preSwapTarget = tempUrl;
        let swapSuccessSingle = false;
        for (let attempt = 1; attempt <= FACE_SWAP_MAX_RETRIES; attempt++) {
          try {
            if (attempt > 1) {
              const delay = FACE_SWAP_BACKOFF_MS[attempt - 2] ?? 4_000;
              console.log(`[nightly-dreams] Backoff ${delay}ms before retry ${attempt}`);
              await new Promise((r) => setTimeout(r, delay));
            }
            const sourceUrl = faceSwapSource;
            console.log(
              `[nightly-dreams] Face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES}...`
            );
            tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN, supabase, userId, {
              retry: false,
            });
            lap('face-swap-model');
            console.log('[nightly-dreams] Face swap complete');
            logAxes.faceSwapResult = 'success';
            logAxes.faceSwapAttempts = attempt;
            swapSuccessSingle = true;
            break;
            // (Stage 8d identity gate runs after this loop.)
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
        // Stage 8d: post-swap identity gate for SOLOS — same 0.35 secret as
        // the dual gate. Below threshold → ONE re-swap via the fallback model
        // chain, ship the better take. Measurement absent → fail-open.
        if (swapSuccessSingle) {
          const soloThr = soloIdentityThreshold();
          if (soloThr !== null) {
            const v1 = await verifySoloIdentity(tempUrl, faceSwapSource);
            if (v1) {
              fallbackReasons.push(`identity_sim_solo:${v1.sim}`);
              soloSimBest = v1.sim;
              if (v1.sim < soloThr) {
                fallbackReasons.push(`identity_below_threshold_solo:${v1.sim}<${soloThr}`);
                try {
                  const reswap = await faceSwap(
                    faceSwapSource,
                    preSwapTarget,
                    REPLICATE_TOKEN,
                    supabase,
                    userId,
                    { retry: false, skipPrimary: true }
                  );
                  const v2 = await verifySoloIdentity(reswap, faceSwapSource);
                  if (v2 && v2.sim > v1.sim) {
                    tempUrl = reswap;
                    fallbackReasons.push(`identity_solo_reswap:${v2.sim}`);
                    soloSimBest = v2.sim;
                  }
                } catch (e) {
                  fallbackReasons.push('identity_solo_reswap_failed');
                  console.warn('[nightly-dreams] identity re-swap failed:', (e as Error).message);
                }
              }
            }
          }
        }
        // First-dream cascade — see comment in the dual branch above.
        if (!swapSuccessSingle && strict_face_swap) {
          throw new Error('face_swap_failed:single');
        }
        // Nightly: solo swap failed, or the swapped face is WAY below the identity
        // floor (0.15 — a stranger, e.g. the 0.024 "tiffany" partner) → pure-scene.
        if (!swapSuccessSingle && !strict_face_swap) swapUnusable = true;
        if (swapSuccessSingle && soloSimBest !== null && soloSimBest < 0.15) {
          swapUnusable = true;
          fallbackReasons.push(`identity_floor_solo:${soloSimBest}<0.15`);
        }
      }
    }

    // ── Pure-scene fallback (DREAM_CAST_HARDENING_PLAN.md) ──
    // The swap is UNUSABLE (no usable face / a stranger). Rather than ship a
    // render full of random people posing as the user, re-render the SAME place +
    // medium as a beautiful EMPTY scene. Live kill-switch: pure_scene_on_swap_fail.
    // strict (onboarding first-dream) already hard-fails to its own cascade above.
    if (swapUnusable && !strict_face_swap && sceneFallbackPrompt) {
      const scfg = await fetchEngineConfig(supabase);
      if (scfg.pureSceneOnSwapFail) {
        try {
          const scene = await generateImage(
            'flux-dev',
            sceneFallbackPrompt,
            undefined,
            {
              replicateToken: REPLICATE_TOKEN,
              openaiKey: Deno.env.get('OPENAI_API_KEY'),
              geminiKey: Deno.env.get('GEMINI_API_KEY'),
              xaiKey: Deno.env.get('XAI_API_KEY'),
            },
            undefined,
            'jpg'
          );
          tempUrl = scene.url;
          if (scene.predictionId) replicatePredictionId = scene.predictionId;
          sceneFallbackApplied = true;
          logAxes.faceSwapResult = 'pure-scene-fallback'; // → face_swap_mode = null
          fallbackReasons.push('pure_scene_fallback');
          console.log('[nightly-dreams] swap unusable → shipped pure-scene fallback');
        } catch (e) {
          // Re-render failed → fall through to the old ship-the-unswapped behavior.
          fallbackReasons.push(`pure_scene_fallback_failed:${(e as Error).message}`);
          console.warn('[nightly-dreams] scene fallback render failed:', (e as Error).message);
        }
      }
    }

    // ── Auto-notify: a cast photo couldn't be read (DREAM_CAST_HARDENING_PLAN.md) ──
    // The swap was unusable. Re-probe the actual cast SOURCE photos with the swap's
    // OWN /analyze detector: whichever is CONFIRMED bad gets a one-time "your dream
    // face needs a new photo" nudge (deduped per photo via a stable reference_id).
    // If both probe fine — a transient/compositional miss, not a bad photo — stay
    // quiet; never nag a good photo. Best-effort: wrapped so it can never break the
    // render. strict (onboarding first-dream) is left alone by design.
    if (swapUnusable && !strict_face_swap) {
      try {
        const candidates: CastCandidate[] = [];
        for (const m of castNotifyMembers) {
          if (m.role === 'pet') continue;
          const url = m.thumb_url;
          if (!url || !url.startsWith('http')) continue;
          const q = await analyzeCastPhoto(url);
          candidates.push({
            role: m.role,
            relationship: m.relationship ?? null,
            storagePath: m.storage_path ?? null,
            suitable: q ? q.suitable : null, // null (Fly outage) → not a culprit
          });
        }
        const plan = planCastPhotoNotify(candidates);
        if (plan) {
          const ref = plan.storagePath ? await castPhotoDedupId(plan.storagePath) : null;
          let already = false;
          if (ref) {
            const { data: dupe } = await supabase
              .from('notifications')
              .select('id')
              .eq('recipient_id', userId)
              .eq('type', 'cast_photo')
              .eq('reference_id', ref)
              .limit(1);
            already = !!(dupe && dupe.length > 0);
          }
          if (already) {
            console.log('[nightly-dreams] cast-photo already nudged for this photo — skip');
          } else {
            const { error: notifyErr } = await supabase.from('notifications').insert({
              recipient_id: userId,
              actor_id: userId, // system notification → self (DreamBot mascot avatar)
              type: 'cast_photo',
              subtype: plan.subtype,
              body: plan.body,
              reference_id: ref,
            });
            if (notifyErr) {
              console.warn('[nightly-dreams] cast-photo notify insert failed:', notifyErr.message);
            } else {
              console.log(`[nightly-dreams] cast-photo nudge → ${plan.subtype}`);
            }
          }
        }
      } catch (e) {
        console.warn('[nightly-dreams] cast-photo notify skipped:', (e as Error).message);
      }
    }

    // ── Stage 2: post-swap face restoration (CodeFormer f=0.9, bench-picked
    // 2026-07-08). Any successful swap outcome; fail-open; dark until
    // engine_config.face_restore_enabled flips. Runs BEFORE dup-detect so the
    // perceptual hash + display variant see the final pixels.
    const swappedOk =
      logAxes.faceSwapResult === 'dual-success' ||
      logAxes.faceSwapResult === 'single-fallback-success' ||
      logAxes.faceSwapResult === 'success';
    if (swappedOk && tempUrl) {
      const restoreCfg = await fetchEngineConfig(supabase);
      if (restoreCfg.faceRestoreEnabled) {
        const restored = await restoreFace(tempUrl, {
          replicateToken: REPLICATE_TOKEN!,
          fidelity: restoreCfg.faceRestoreFidelity,
          deadlineMs: t0 + 140_000,
        });
        if (restored.restored) {
          tempUrl = restored.url;
          fallbackReasons.push(`face_restore:ok:${restored.ms}ms`);
          lap('face-restore');
        } else if (restored.reason) {
          fallbackReasons.push(restored.reason);
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
    // The pure-scene fallback is a fresh scene, NOT a face-swap output — skip the
    // yan-ops canned-output dup-detect (which would re-swap the character render
    // and clobber the scene). It still gets a display variant + phash below.
    if ((faceSwapSource || faceSwapSources) && !sceneFallbackApplied) {
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
          // Surfaced for QA of the DreamSmart nightly model pick (dry-run only).
          model_used: pickedModel,
          fallback_reasons: fallbackReasons,
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
    // Caption must NOT be the raw Flux prompt (2026-08-25 fix). The card displays
    // `description`; the dreamer-facing dream text is `bot_message` (set by the
    // dispatcher). caption only pre-fills the post-to-feed sheet — the raw prompt
    // there was the bug. Leave it null so the sheet pre-fills clean.
    const caption: string | null = null;
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
          ai_prompt: sceneFallbackApplied ? sceneFallbackPrompt : finalPrompt,
          dream_medium: resolvedMediumKey ?? null,
          dream_vibe: resolvedVibeKey ?? null,
          holiday: holidayCategory, // 🎃 marker (§5) — the season this dream belongs to, or null

          // Which AI model rendered this — drives the model badge on
          // DreamCard (migration 211, 2026-05-30).
          model: pickedModel || null,
          face_swap_mode: faceSwapMode,
          // Durable render-provenance (migration 450): which seed pool / scenario /
          // location produced this dream, so a quarantined bad render (mig 449)
          // stays analyzable forever — independent of the 30-day ai_generation_log
          // prune. dream_medium + model are already columns, not duplicated here.
          seed_source: seedSource ? { source: 'nightly', ...seedSource } : null,
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
        .catch((e: unknown) => {
          // Graceful fallback (style_summary stays NULL), but log it — a spike
          // signals Anthropic degradation dropping DLT fidelity fleet-wide.
          console.error(
            '[nightly-dreams] style_summary distillation failed:',
            e instanceof Error ? e.message : String(e)
          );
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
      // Carry the granular face-swap reasons accumulated BEFORE the throw
      // (no_dual_split / faces=1 / gender / identity_sim / *_clamped_to_pro). The
      // strict first-dream hard-fail throws `face_swap_failed:dual|single`, which
      // used to DISCARD these — leaving only the terse top-level error, so a
      // dropped dual/single was undiagnosable in the DB. This row is the failure's
      // only DB trace, so record both. (Kevin 2026-08-30.)
      fallback_reasons: [...fallbackReasons, `nightly_error:${errMsg.slice(0, 200)}`],
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
