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
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import {
  resolveMediumFromDb,
  resolveVibeFromDb,
  fetchSceneEligibleModels,
  fetchMediums,
  fetchVibes,
} from '../_shared/dreamStyles.ts';
import { loadNightlyLooks } from '../_shared/pools/nightlyLooksLoader.ts';
import { buildStyleContract, type StyleContract } from '../_shared/nightlyStyle.ts';
import { expandMediumBans } from '../_shared/legacyMediumBans.ts';
import {
  afterScenePrompt,
  applyStyleContract,
  assertStyleHonesty,
  looksModeFor,
  looksPathBans,
  looksSlotInputFields,
  strictRetryPrompt,
  LOOKS_SCENE_ACTION_PCT,
  LOOKS_SCENE_ACTION_PCT_COUPLE,
  LOOKS_FRAMING_PCT,
  LOOKS_MINIMAL,
  LOOKS_SCENE_PCTS,
  LOOKS_SOLO_IDENTITY_MIN,
  LOOKS_DUAL_IDENTITY_MIN,
  LOOKS_PHOTO_PRIORS,
  LOOKS_LOCATION_ACTION_PCT_COUPLE,
  LOOKS_LOCATION_ACTION_PCT_SOLO,
  looksCouplePromptStyle,
  reassembleForModel,
  isFluxCoupleAlbum,
  LOOKS_FLUX_WIDE_STANCES,
  LOOKS_FLUX_STANCE_POOL_SHARE,
  LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY,
  LOOKS_SOLO_POOL_MIX,
  LOOKS_SOLO_FRAMING_IN_ANCHOR,
  LOOKS_DUAL_POOL_MIX,
  provisionalLooksMedium,
  retryPromptFor,
  shadowStamp,
  surfaceFor,
  toVibeRows,
  type ActiveStyle,
} from '../_shared/nightlyLooksPath.ts';
import { firstDreamMediumMode, firstDreamAllowedMediums } from '../_shared/firstDreamMediums.ts';
import { getBiomeConfig, resolveBiomeFromTags, isValidBiomeConfig } from '../_shared/biomeAxes.ts';
import { rollDream } from '../_shared/dreamAlgorithm.ts';
import { sanitizeUserText } from '../_shared/sanitizeUserText.ts';
import { restoreFace } from '../_shared/faceRestore.ts';
import { imageOpsEnabled, persistViaFly } from '../_shared/imageOps.ts';
import { composeExperimentalCouple, isCoupleVariant } from '../_shared/coupleComposerX.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';
import { sceneTypeCuts, adaptiveScenePcts } from '../_shared/sceneTypeRoll.ts';
import {
  resolveActiveHolidays,
  combineHolidayPct,
  pickWeightedHoliday,
  mapHolidayCatalogRow,
  localDateInTz,
  dayOfCalendarDate,
  type ActiveHoliday,
} from '../_shared/holidayWindow.ts';
import { dispatchHolidayPostcard } from '../_shared/holidayPostcardDispatch.ts';
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
import { classifyDualGenders, classifyWardrobeSides } from '../_shared/vision.ts';
import { asGender, sidesToGenders, sideCheckModeOf } from '../_shared/wardrobeSides.ts';
import { hydrateCastSources } from '../_shared/castPhotoUrl.ts';
import { orderDualSides, shouldFlipDualSide } from '../_shared/dualSideOrder.ts';
import { genderSafeDualSwap, identityThreshold } from '../_shared/dualSwapPipeline.ts';
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
import { isQaRequest } from '../_shared/qaRequest.ts';
import { markStage, shouldForceSafeScene } from '../_shared/dreamQueueLifecycle.ts';
import { captureRenderError } from '../_shared/sentry.ts';
import { pickDualAction } from '../_shared/pools/dual_actions.ts';
import { pickSpecialLighting } from '../_shared/pools/dual_scenarios.ts';
import {
  loadDualScenarios,
  pickDualScenario,
  scenariosForRelationship,
} from '../_shared/pools/dualScenarioLoader.ts';
import {
  loadSingleScenarios,
  pickSingleScenario,
  singleScenarioCandidates,
} from '../_shared/pools/singleScenarioLoader.ts';
import { pickDualCompositionPath } from '../_shared/pools/dual_composition.ts';
import {
  runCharacterSlotPipeline,
  assembleSoloFallbackFromDual,
  soloRebuildInput,
  type CharacterSlotPipelineInput,
  type DualSlots,
  type CharacterSlots,
} from '../_shared/characterSlotPrompt.ts';
import { holidayPoolOf, selectDayOfRows } from '../_shared/holidayPools.ts';
import { steerDualModel } from '../_shared/dualModelSteer.ts';
import {
  candidateModels,
  resolveModel,
  shadowStampSet,
  type NightlyModelPolicy,
} from '../_shared/nightlyModelPolicy.ts';
import { soloRebuildModelFor } from '../_shared/soloRebuildModel.ts';
import { rollHolidayCostumes, costumeStamp } from '../_shared/holidayCostumes.ts';
import { pickDayOfLook, parseMediumBan, mergeDayOfBans } from '../_shared/dayOfLook.ts';
import { loadNightlyModelPolicy } from '../_shared/pools/nightlyModelPolicyLoader.ts';
import { decideSceneFirst, sceneFirstRegister } from '../_shared/sceneFirstEligibility.ts';
import { parseQaFlags } from '../_shared/nightlyQaFlags.ts';
import { applyRedreamPins, parseRedreamPins } from '../_shared/redream.ts';
import { resolveCastAction } from '../_shared/castActionResolver.ts';
import { settingClauseOf } from '../_shared/sceneHook.ts';
import { assessRenderQuality, assessSceneFallbackPeople } from '../_shared/qualityGate.ts';
import { resolveCastGender } from '../_shared/genderLock.ts';
import { pickSingleAction } from '../_shared/pools/single_actions.ts';
import { pickSceneCluster } from '../_shared/pools/scene_clusters.ts';
import { applyFaceSwapOverride } from '../_shared/faceSwapFluxOverrides.ts';
import { pickFaceSwapModelOverride } from '../_shared/faceSwapModelOverrides.ts';
import { isMonumentalFaceSpot } from '../_shared/monumentalFaceSpot.ts';
import { enabledPartners, rollPartner, mirrorPartnerIntoCast } from '../_shared/partnerRoll.ts';

// Models nightly must never render. flux-2-dev over-smooths under the nightly
// slot pipeline (banned 2026-06-01). Module-scoped so BOTH the DreamSmart pool
// pick (face-swap + scene) and the downstream ban-gate backstop share one list.
const NIGHTLY_BANNED_MODELS: ReadonlySet<string> = new Set([
  'black-forest-labs/flux-2-dev',
  // PERMANENTLY banned from nightly. Disabled 2026-08-25 (Kevin) because gpt-image-2 renders WIDE images
  // that don't fit the app's portrait dimensions — seen on solos AND couples, across mediums — and because
  // it is slow (150s IDLE_TIMEOUTs). That note said "re-enable when the wide-aspect behavior is resolved".
  //
  // IT CANNOT BE RESOLVED (root-caused 2026-09-16). It is not the model misbehaving, it is the OpenAI
  // Images API: gpt-image-1/2 accept `size` only from a fixed enum — 1024x1024 / 1024x1536 / 1536x1024.
  // The closest portrait is 1024x1536 = 2:3 = 0.667, and the app's cards are 9:16 = 0.563. So EVERY
  // gpt-image-2 render is genuinely wider than the frame; we pick the least-wrong option and display
  // crops or letterboxes it. No parameter changes this. Do not spend time trying.
  //
  // gpt-image-2.5 is the version that clears this: its API takes ARBITRARY WIDTHxHEIGHT (probed — '9:16'
  // as a string is rejected, but 1152x2048 and 2160x3840 return 200), so it renders true 9:16 natively.
  // See providers/openai.ts for the per-model size default. Its SPEED is unmeasured, and 150s timeouts
  // would be just as fatal here, so measure that before adopting it. Look-catalogue re-test is queued in
  // NIGHTLY_LOOKS_REFACTOR_PLAN.md.
  //
  // (The first-dream ban further down is SEPARATE and about latency only — 60-120s vs the onboarding
  // loading screen — so it would still apply to any slow model, 2.5 included.)
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

// Render-budget split — shared with generate-dream via _shared/renderBudgets.ts
// so the two pipelines can never drift (audit 2026-09-03 M3). Root cause of the
// contract: Kevin's "Faanui Bay in noir" nightly — a 67s dual swap pushed the
// solo guard past its (then-shared) 75s cutoff → recover_budget_exhausted → scene.
import {
  RENDER_DEADLINE_MS,
  SOLO_FALLBACK_RESERVE_MS,
  DUAL_RECOVER_MS,
  SOLO_RECOVER_MS,
} from '../_shared/renderBudgets.ts';

Deno.serve(async (req) => {
  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(JSON.stringify({ error: 'Missing REPLICATE_API_TOKEN' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Required on every render path (Sonnet briefs). Fail LOUD up front instead of a
  // mid-render `ANTHROPIC_KEY` crash (audit 2026-09-03 M6).
  if (!ANTHROPIC_KEY) {
    return new Response(JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }), {
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

  // Is this one of OURS? Computed from the RAW body (which force_*/qa_* keys were
  // actually sent) before anything destructures it, and stamped on every log row so
  // testing spend can be separated from user spend. See _shared/qaRequest.ts.
  const isQa = isQaRequest(body);

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

  // Request flags — ONE typed parser (SCENE_FIRST_ACTION_PLAN.md §11.1, behaviour-neutral extraction of
  // the former inline block; every coercion is test-locked in _shared/nightlyQaFlags.ts). Destructured
  // under the original local names so the rest of this handler is untouched.
  const {
    force_cast_role,
    force_medium: force_medium_raw,
    force_look,
    // QA ONLY (2026-09-16, A/B of LOOKS_MINIMAL). Pins the CONTRACT's look on BOTH the minimal and the full looks
    // path, without the side effects of `force_look` — which aliases to `force_medium` and therefore SKIPS the
    // minimal contract build entirely (`if (looksMinimal && modelPolicy && !force_medium)`), silently turning the
    // looks engine off and comparing the wrong thing. Feeds the SAME `pinnedLook` input both paths already accept,
    // so it changes nothing about how a render is assembled — it only removes the roll.
    qa_pin_look,
    qa_blank_axes,
    qa_fragment_mode,
    qa_legacy_framing,
    force_moods,
    force_awe_beat,
    force_season_month,
    force_vibe,
    force_looks_path,
    force_plain_brief,
    force_swap_geometry,
    force_framing,
    force_photo_priors,
    force_nightly_path,
    force_model,
    force_female_hair_pct,
    isFirstDream,
    force_place,
    force_dual_pool,
    force_single_pool,
    force_cluster_kind,
    force_face_swap_eligible_raw,
    force_playful,
    force_elegant,
    force_active,
    force_single_active,
    force_solo_comp,
    force_active_pose,
    force_location_action,
    force_scene_action,
    force_dual_closer,
    force_action_registers,
    force_plain_location,
    force_action,
    force_single_playful,
    force_single_elegant,
    force_scene_category,
    force_face_swap_eligible,
    force_holiday_scene,
    force_pure_scene,
    dry_run,
    force_holiday_sub_theme,
    force_day_of,
    force_final_prompt,
    force_prompt_style,
    force_eye_lock,
    force_override_library,
    force_couple_engine,
    force_couple_variant,
    force_honest_looks,
    qa_big_face_max_hfrac,
    qa_max_face_hfrac,
    force_costume_keys,
    force_costume_pct,
    force_day_of_look,
    force_dual_slots,
    force_single_slots,
    force_slot_input,
    strict_face_swap,
    persist,
    queueJobId,
  } = parseQaFlags(
    // "Redream in a new setting" (mig 531): a redream's pins (contract look, vibe, cast role) ride the same pin inputs, merged
    // AFTER isQa was read from the raw body — a paid user render, not QA spend.
    applyRedreamPins(body)
  );
  const redreamPins = parseRedreamPins(body);
  // force_look = force_medium + the override-library exemption + honest stamps (Phase A2). Every
  // downstream `force_medium` read sees the pinned look key.
  const force_medium: string | undefined = force_look ?? force_medium_raw;

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
  /** The exact character-slot pipeline input used (logged to rolled_axes.observability.slotInput so a
   *  render can be replayed byte-for-byte via force_slot_input — forensics + parity pairs). */
  let slotInputLogged: CharacterSlotPipelineInput | null = null;
  let visionDescription: string | null = null;
  let replicatePredictionId: string | null = null;
  const fallbackReasons: string[] = [];
  if (redreamPins) fallbackReasons.push(`redream:${redreamPins.sourceUploadId}`);
  // Nightly model policy (mig 468, NIGHTLY_MODEL_POLICY_PLAN.md): resolved ONCE per render. 'off' =
  // the legacy picker everywhere below; 'shadow' = legacy still renders, the policy resolver runs beside
  // it at every pick site and stamps policy_shadow:<site>:match|diff; 'on' = the policy table decides.
  const engineCfg0 = await fetchEngineConfig(supabase);
  const policyMode = engineCfg0.modelPolicyMode;
  // LOOKS PATH (NIGHTLY_LOOKS_REFACTOR_PLAN.md Phase 2, _shared/nightlyLooksPath.ts): 'on' = the style contract
  // decides model + look + vibe; 'shadow' = legacy renders, the contract is stamped; 'off' = legacy. QA:
  // force_looks_path. The contract needs the model policy even when policy mode is off.
  const looksMode = looksModeFor(
    force_looks_path,
    engineCfg0.nightlyLooksMode,
    engineCfg0.nightlyLooksAllowlist.includes(userId)
  );
  if (looksMode === 'on' && !force_looks_path && engineCfg0.nightlyLooksMode !== 'on')
    fallbackReasons.push('looks_path:allowlist');
  // MINIMAL STATE (Kevin, 2026-09-13): "i want literally the old 1.2.0 engine with just the new looks and vibes
  // determining the medium". So `looksPath` — which gates ~25 substitutions for scene mix, location-action share,
  // pose pools, framing, prompt order, retry ladder and identity floors — goes FALSE, and the new catalog reaches
  // the render the way 1.2.0 already accepts one: the rolled look is pinned as the MEDIUM (the force_look
  // mechanism) and its own approvals pick the model. Everything downstream is the 1.2.0 engine, untouched.
  /**
   * THE COUPLE PROMPT, KEPT (2026-09-16). `ai_generation_log.enhanced_prompt` holds ONE prompt and every
   * degrade path overwrites it — "honesty: persist what rendered". Correct, but it means a failed couple
   * leaves NO record of the prompt that failed: the row ends up holding the SOLO REBUILD's prompt, which
   * is singular and carries no couple head-geometry at all.
   *
   * That destroyed a day of analysis. Comparing logged prompts of passed vs degraded couples showed the
   * geometry clause "missing" from every failure and present in every success — a perfect correlation that
   * was pure tautology, because the failures were solo prompts. Any future diagnosis of couple failure
   * would hit the same trap, so the original is captured at assembly time and logged alongside.
   */
  let couplePromptOriginal: string | null = null;
  const looksMinimal = looksMode === 'on' && LOOKS_MINIMAL;
  const looksPath = looksMode === 'on' && !LOOKS_MINIMAL;
  /** The model the rolled look is graded on — overrides the medium's inherited flux pin in the minimal state. */
  let minimalModel: string | null = null;
  const modelPolicy: NightlyModelPolicy | null =
    policyMode === 'off' && looksMode === 'off' ? null : await loadNightlyModelPolicy(supabase);
  let styleContract: StyleContract | null = null;
  let activeStyle: ActiveStyle | null = null;
  let looksVibeFragment: string | null = null;
  let looksVibePosition: 'early' | 'after_scene' | null = null;
  let looksModel: string | null = null;
  let looksSceneModel: string | null = null;
  /** The cast slots + input of this render, kept for the after-scene vibe retry (nightlyLooksPath.afterScenePrompt). */
  let castSlotsCtx: { slots: CharacterSlots; input: CharacterSlotPipelineInput } | null = null;
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
  // Holiday seasons active for this user's LOCAL date. Hoisted to handler scope and
  // computed ABOVE the chaos pre-roll (2026-09-04) so the day-of HERO can force a
  // cast render; the scenario roll + Path 2 read it later.
  let activeHolidays: ActiveHoliday[] = [];
  // Day-of HERO (HOLIDAY_DREAMS_PLAN.md §13, mig 457): the holiday peaking TODAY (or
  // force_day_of), its authored recipes, the user's local year (hero seed), and whether
  // this render became a hero (reaches the response + the postcard step).
  let dayOfHoliday: ActiveHoliday | null = null;
  // The nightly model-ban set for THIS render (global + a day-of holiday's own, mig 480) — assigned once
  // the day-of holiday is resolved; every model pick site below reads it.
  let nightlyBans: ReadonlySet<string> = NIGHTLY_BANNED_MODELS;
  /** HOLIDAY_DAY_OF_PLAN.md: a day-of pool row (or its window fallback) was applied → the postcard
   *  overlay composites (scope day_of) and the response reports day_of: true. */
  let dayOfApplied = false;
  // Durable seed-source provenance (migration 450). Declared at handler scope so it
  // reaches BOTH the rolled_axes logAxes AND the uploads insert. Assigned once the
  // scene/pool is resolved (before the composition branch).
  let seedSource: {
    kind: string;
    scene: string | null;
    posePool: string | null;
    /** Scene-first authored action beat that shipped (null = pool pose / not rolled). */
    sceneAction?: string | null;
    location: string | null;
    biome: string | null;
    /** The scenario row's category (goofy / elegant / active pools) — the sequel's world (redream.ts). */
    category?: string | null;
    /** The holiday scene's sub-theme, when one was rolled. */
    subTheme?: string | null;
    /** The location card the place came from (`force_place` target) — `location` holds the spot text. */
    placeKey?: string | null;
    /** Who was in it: 'dual' | 'self' | 'plus_one' | null (no cast). The log that also carries this prunes at
     *  30 days; the upload keeps it forever so a sequel of an old dream keeps its cast. */
    castRole?: string | null;
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
    /** The medium's real face-swap fragment (pre-override) for the rebuild. */
    realMediumFragment: string;
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
  // Which roster member was rolled as tonight's +1 (multi-cast). Stamped into
  // rolled_axes so the NEXT render's recency window can avoid repeating them —
  // and so forensics shows exactly who was cast.
  let rolledPartnerId: string | null = null;

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

    // ── Multi-cast +1 roll (MULTI_CAST_PLUS_ONE_PLAN.md) ───────────────────
    // The user's roster can mark SEVERAL loved ones eligible (Settings → Dream
    // Cast). Pick one for tonight and mirror it into the `plus_one` slot, so
    // every downstream reader — castResolver, dualBriefBuilder, the swap
    // pipeline, the relationship gate — is unchanged. Recency-avoiding: nobody
    // repeats until everyone eligible has had a turn, matching how mediums /
    // vibes / locations above already de-dupe.
    //
    // ORDER MATTERS: this rewrites dream_cast, so it MUST run BEFORE
    // hydrateCastSources — otherwise the rolled member's private storage_path
    // never becomes a signed URL and the face swap silently drops them. Locked
    // by __tests__/lib/partnerRoll.test.ts.
    const recentPartnerIds = (recentLogs ?? [])
      .map((l) => (l.rolled_axes as Record<string, unknown>)?.partnerId)
      .filter((p): p is string => typeof p === 'string' && p.length > 0);
    const eligiblePartners = enabledPartners(
      nightlyProfile.partner_library,
      nightlyProfile.active_partner_id
    );
    if ((nightlyProfile.partner_library?.length ?? 0) > 0) {
      const roll = rollPartner(eligiblePartners, recentPartnerIds, Math.random);
      nightlyProfile.dream_cast = mirrorPartnerIntoCast(
        nightlyProfile.dream_cast,
        roll.partner
      ) as DreamCastMember[];
      rolledPartnerId = roll.partner?.id ?? null;
      console.log(
        `[nightly-dreams] +1 roll: ${roll.reason} pool=${roll.poolSize} picked=${
          roll.partner ? `${roll.partner.id.slice(0, 8)}/${roll.partner.relationship}` : 'none'
        } recent=${
          recentPartnerIds
            .slice(0, 3)
            .map((r) => r.slice(0, 8))
            .join(',') || '-'
        }`
      );
    }

    // Cast photos live in the PRIVATE `cast-photos` bucket (migration 292).
    // Resolve each member's storage_path to a fresh signed URL up front so ALL
    // downstream face-swap + describe logic (which gates on
    // thumb_url.startsWith('http')) works unchanged. No-op for legacy members
    // that already carry a public thumb_url.
    if (Array.isArray(nightlyProfile.dream_cast) && nightlyProfile.dream_cast.length > 0) {
      nightlyProfile.dream_cast = await hydrateCastSources(nightlyProfile.dream_cast, supabase);
    }

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

    // ── Holiday Dreams (HOLIDAY_DREAMS_PLAN.md) — the season(s) active for THIS user's
    // LOCAL date (H2), gated by the master switch + per-user opt-out. Several can be
    // active at once (Fall × Halloween × Thanksgiving overlap by design); the scenario
    // roll sums their pcts and picks one weighted by pct. `holidayCategory` is set on a
    // holiday hit for the uploads marker. Computed here, above the chaos pre-roll, so
    // the day-of HERO below can force a cast render.
    try {
      const forcedKey = force_day_of ?? force_holiday_scene;
      if (forcedKey) {
        // QA: force one season at full strength, ignoring date + is_active + opt-out.
        const { data: fr } = await supabase
          .from('holidays')
          .select('*')
          .eq('key', forcedKey)
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
              dayOfEnabled: true, // QA force: the day-of takeover is always on
              dayOfLookKeys: c.dayOfLookKeys ?? [],
              dayOfMediumBan: c.dayOfMediumBan ?? null,
              dayOfModelBan: c.dayOfModelBan ?? [],
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
          // The date the render is FOR (HOLIDAY_DAY_OF_PLAN.md §4): local date, shifted to the next
          // day past the evening cutoff so a Hawaii user gets the holiday dream they wake up to.
          const localDate = dayOfCalendarDate(new Date(), userTz, holCfg.dayOfEveningCutoffHour);
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
    // DAY-OF (HOLIDAY_DAY_OF_PLAN.md §3.3): the holiday whose peak is the date this render is FOR and
    // whose catalog row has day_of_enabled. Never via force_holiday_scene (it fakes daysUntilPeak=0 too).
    // On the day every eligible nightly draws 100% from the holiday's reserved <key>_day_of pool
    // (fallback: its window pool → normal roll — never a broken render).
    dayOfHoliday = force_day_of
      ? (activeHolidays.find((h) => h.key === force_day_of) ?? null)
      : force_holiday_scene
        ? null
        : (activeHolidays.find((h) => h.daysUntilPeak === 0 && h.dayOfEnabled) ?? null);
    // DAY-OF MODEL BAN (mig 480, Kevin 2026-09-08 "disable seedream-4 from the day-of models"): the ban
    // set every model pick below uses — the global list plus the day-of holiday's own. Stamped once.
    nightlyBans = mergeDayOfBans(NIGHTLY_BANNED_MODELS, dayOfHoliday);
    if (dayOfHoliday && dayOfHoliday.dayOfModelBan.length > 0) {
      fallbackReasons.push(
        `day_of_model_ban:${dayOfHoliday.dayOfModelBan.map((m) => m.split('/').pop()).join('+')}`
      );
    }

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
    // DAY-OF: force a CAST render — the couple if they have a +1, else themselves — on a
    // face-swap medium (kept from the hero era, Kevin 2026-09-04: the day's dream is personal).
    // Explicit QA forces (force_medium / force_cast_role) still win; a user with no self photo
    // keeps their roll and gets the scene-only day-of draw instead.
    // R2 (HOLIDAY_DAY_OF_PLAN.md): EVERY eligible nightly takes the day-of. A user with no self photo
    // (or a QA explicit force_cast_role: null = no cast) is pre-rolled to a PURE SCENE so the scene-only
    // day-of branch is guaranteed to run — otherwise an embodied/character roll would skip every
    // day-of branch and the user would get a plain nightly on the holiday.
    const dayOfNoCast = force_cast_role === null || !hasSelf;
    if (dayOfHoliday && !force_medium && dayOfNoCast) {
      preRolledComposition = 'pure_scene';
      preRolledCastRole = null;
      fallbackReasons.push(`holiday_day_of_preroll:${dayOfHoliday.key}:pure_scene`);
    }
    if (dayOfHoliday && hasSelf && !force_medium && !dayOfNoCast) {
      // A QA-supplied force_cast_role picks WHO is cast; the day-of still pins the face-swap
      // medium + character composition (the cascade could otherwise roll an embodied type).
      const wanted = force_cast_role ?? (hasPlusOne ? 'dual' : 'self');
      preRolledType =
        wanted === 'dual'
          ? 'face_swap_dual'
          : wanted === 'plus_one'
            ? 'face_swap_plus_one'
            : 'face_swap_self';
      const inputs = mapDreamTypeToInputs(preRolledType, chaosTier, chaosCfg);
      preRolledMediumToken = inputs.mediumToken;
      preRolledCastRole = inputs.forceCastRole;
      preRolledComposition = inputs.forceComposition;
      fallbackReasons.push(`holiday_day_of_preroll:${dayOfHoliday.key}:${preRolledType}`);
    }
    // QA `force_pure_scene` applies at the PRE-ROLL as well as downstream (2026-09-14). It used to take effect
    // only at effectiveComposition (~line 1100), which is AFTER the minimal style contract is built — so a batch
    // passing the flag still built a couple/solo contract and could never exercise the scene surface. Same class
    // of trap as force_look implying force_medium: the flag looked like it worked and silently tested the wrong
    // path. Production is unaffected (nothing sets this flag); it only makes the QA flag honest.
    if (force_pure_scene) {
      preRolledComposition = 'pure_scene';
      preRolledCastRole = null;
    }
    // A forced scenario bucket must render as a CHARACTER composition — a rolled
    // pure_scene would skip the bucket block downstream (gated on
    // isDualFaceSwap/isSingleHumanFaceSwap) and emit an unpopulated scene.
    if (force_scene_category && preRolledComposition === 'pure_scene') {
      preRolledComposition = 'character';
      preRolledCastRole = force_cast_role ?? preRolledCastRole ?? 'self';
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
    if (force_look) {
      fallbackReasons.push(`look:${force_look}`, 'look_source:force');
      if (nightlyMedium.key !== force_look) fallbackReasons.push(`look_pin_unknown:${force_look}`);
    }
    let nightlyVibe = await resolveVibeFromDb('dream_eligible', recentVibes);
    if (force_vibe) {
      nightlyVibe = await resolveVibeFromDb(force_vibe);
    }
    if (looksPath) {
      // Keep the legacy branching on the face-swap track until the contract replaces the medium (see the hook
      // before dualSpecialLighting).
      nightlyMedium = provisionalLooksMedium(nightlyMedium);
      fallbackReasons.push('looks_path:provisional_medium');
    }
    // MINIMAL surface: the cast role was pre-rolled above, so the look is graded for the surface that renders.
    // SCENE IS ITS OWN SURFACE (Kevin, 2026-09-14). A personless nightly used to build a SOLO contract and take the
    // solo policy row's model, which left `nightly_model_policy.scene` dead — every scene render stamped
    // `policy:solo:1:...`. It now builds a real scene contract, so the scene row decides the model. The LOOK roll is
    // unchanged: buildStyleContract maps surface 'scene' to lookSurface 'solo', so scene renders keep drawing from
    // the same solo-graded approvals they always did. Only `pure_scene` qualifies — epic_tiny still carries a cast
    // and can face-swap, so it stays on the cast surfaces.
    const minimalSurface: 'couple' | 'solo' | 'scene' =
      preRolledComposition === 'pure_scene'
        ? 'scene'
        : preRolledCastRole === 'dual' || preRolledCastRole === 'face_swap_dual'
          ? 'couple'
          : 'solo';
    /**
     * The ban set the contract rolls against. `NIGHTLY_BANNED_MODELS` is a CAST-render list: flux-1.1-pro-ultra is
     * on it because its 4MP output defeats the dual face-swap detector ~50% of the time and starves the
     * solo-degrade budget (Kevin, 2026-08-28). That reasoning is entirely about the SWAP — the same note records
     * 0% faceless on non-swap nightlies — so a personless scene render has nothing to break and ultra is allowed
     * there (Kevin, 2026-09-14: "just enable for scene only renders"). Stamped, so a scene render says so.
     */
    const SCENE_ONLY_UNBANNED: ReadonlySet<string> = new Set([
      'black-forest-labs/flux-1.1-pro-ultra',
    ]);
    const contractBans = (policy: NightlyModelPolicy): ReadonlySet<string> => {
      const base = looksPathBans(
        nightlyBans,
        policy,
        dayOfHoliday ? dayOfHoliday.dayOfModelBan : []
      );
      if (minimalSurface !== 'scene') return base;
      const lifted = new Set(base);
      let any = false;
      for (const m of SCENE_ONLY_UNBANNED) {
        if (lifted.delete(m)) any = true;
      }
      if (any) fallbackReasons.push('scene_model_unban:ultra');
      return lifted;
    };
    /**
     * ONE way to build the minimal contract, so the two later re-runs (a scenario/day-of LOOK PIN that carries its
     * own allowed_models, and a scenario MEDIUM BAN that rules the rolled look out) go through exactly the same
     * roll as the first build instead of a second, drifting copy of it.
     *  - `excludeLookKeys` drops looks from the catalog BEFORE the roll (the ban route).
     *  - `pinnedLook` + `restrictModels` pin a curated holiday look and clip the model pool to that row's own
     *    `allowed_models` (the day-of route).
     *  - `withVibes: false` makes NO vibe decision — a re-run must never re-roll an axis it was not asked about.
     */
    const buildMinimalContract = async (opts?: {
      excludeLookKeys?: ReadonlySet<string>;
      pinnedLook?: string | null;
      restrictModels?: readonly string[] | null;
      withVibes?: boolean;
    }): Promise<StyleContract | null> => {
      if (!modelPolicy) return null;
      const catalog = await loadNightlyLooks(supabase);
      const exclude = opts && opts.excludeLookKeys ? opts.excludeLookKeys : null;
      const looks = exclude ? catalog.looks.filter((l) => !exclude.has(l.key)) : catalog.looks;
      const wantVibes = !opts || opts.withVibes !== false;
      const vibeRowsAll = wantVibes ? await fetchVibes() : null;
      return buildStyleContract({
        surface: minimalSurface,
        policy: modelPolicy,
        modelFromLook: true,
        // MINIMAL re-renders WITHOUT re-assembling the prompt, so the look cannot change between attempts; lock it
        // so the stamps and ai_generation_log describe the look that is actually in the pixels.
        lockLook: true,
        bans: contractBans(modelPolicy),
        evenModelSplit: minimalSurface === 'scene',
        forceModel: force_model ?? null,
        looks,
        approvals: catalog.approvals,
        recentLookKeys: recentMediums,
        recencyWindow: engineCfg0.nightlyLookRecency,
        legacyPct: engineCfg0.nightlyLegacyLookPct,
        forcedLook: force_look ?? null,
        pinnedLook: opts ? (opts.pinnedLook ?? null) : null,
        restrictModels: opts ? (opts.restrictModels ?? null) : null,
        vibes: vibeRowsAll ? toVibeRows(vibeRowsAll) : undefined,
        recentVibeKeys: recentVibes,
        forcedVibe: force_vibe ?? null,
      });
    };
    /** Apply a minimal contract's MEDIUM pin (and optionally its vibe pin) to the 1.2.0 engine's variables. */
    const applyMinimalLook = async (
      contract: StyleContract,
      withVibe: boolean
    ): Promise<boolean> => {
      const pinned = await resolveMediumFromDb(contract.look.key);
      if (pinned.key !== contract.look.key) {
        fallbackReasons.push(`looks_minimal_medium_miss:${contract.look.key}`);
        return false;
      }
      nightlyMedium = pinned;
      // qa_fragment_mode: swap the look's face-swap fragment for a variant. The shipped fragment wedges
      // "…with lifelike adult faces, realistic human facial proportions with true-to-life eyes at natural size
      // and spacing…" BETWEEN the style noun and the style's own description, so flux reads "classical oil
      // painting", then 110 characters of make-it-photoreal, then the brushwork. Measured 2026-09-16: a pinned
      // classical_oil rendered as a photograph in 7 of 9 production renders.
      if (qa_fragment_mode !== 'default') {
        const plain = pinned.fluxFragment;
        const swapped =
          qa_fragment_mode === 'geometry'
            ? `${plain}, adult facial proportions, eyes at natural size and spacing`
            : plain;
        nightlyMedium = { ...pinned, faceSwapFluxFragment: swapped };
        fallbackReasons.push(`qa_fragment_mode:${qa_fragment_mode}`);
      }
      if (withVibe && contract.vibe) {
        const pinnedVibe = await resolveVibeFromDb(contract.vibe.vibe.key);
        if (pinnedVibe) nightlyVibe = pinnedVibe;
      }
      return true;
    };
    if (looksMinimal && modelPolicy && !force_medium) {
      // Roll the look and the vibe from the new catalogue, then hand BOTH to the 1.2.0 engine as a pinned medium
      // and a pinned vibe. The surface comes from the cast role that was pre-rolled above, so the look is graded
      // for the right surface. Look-first: the look's own approvals pick the model (modelFromLook), never the
      // policy weights — 1.2.0's rule that the medium decides, with Kevin's grades replacing the inherited pin.
      const contract = await buildMinimalContract(
        qa_pin_look ? { pinnedLook: String(qa_pin_look) } : undefined
      );
      if (contract) {
        styleContract = contract;
        minimalModel = contract.model;
        fallbackReasons.push('looks_minimal:on', ...contract.stamps);
        await applyMinimalLook(contract, true);
        // THE VIBE'S OWN TEXT. Minimal hands the 1.2.0 engine a pinned look and a pinned vibe ROW, and 1.2.0's
        // only vibe route is three mood words at the very tail of the prompt — the weakest position there is. The
        // authored `dream_vibes.flux_fragment` + `fragment_position` mechanism (231 active rows, 163 with a
        // position) lives on the FULL looks path, which minimal switches off, so it reached zero renders: measured
        // 0 of 50 real nightlies across every surface and model, couples and solos alike (2026-09-16).
        //
        // That made "the old engine with the new looks AND VIBES" only half true — the look was pinned as the
        // medium and survived; the vibe was rolled, stamped and gated on, then spent through a channel that barely
        // moves the render. Carrying these two fields is the whole fix. Deliberately NOT calling
        // looksSlotInputFields here: that bundle also brings blank axes, look-neutral framing, the rich brief and
        // the frame roll, which are exactly the looks-path substitutions minimal exists to keep OFF.
        if (contract.vibe) {
          looksVibeFragment = contract.vibe.fragment;
          looksVibePosition = contract.vibe.position;
          fallbackReasons.push(
            looksVibeFragment
              ? `vibe_fragment:minimal:${looksVibePosition ?? 'after_scene'}`
              : 'vibe_fragment:none'
          );
        }
      } else {
        fallbackReasons.push('looks_minimal:no_contract');
      }
    }
    resolvedMediumKey = nightlyMedium.key;
    resolvedVibeKey = nightlyVibe.key;

    let baseMedium = nightlyMedium;
    // The medium's REAL face-swap fragment, captured before any flux-1.1-pro override replaces it —
    // the couple-degrade solo rebuild renders with this (NIGHTLY_NO_PLAIN_RENDERS_PLAN.md F2).
    let realMediumFragment: string = nightlyMedium.fluxFragment;

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
    // SCENE-ONLY NIGHTLIES USE THE LOOKS CATALOGUE (Kevin, 2026-09-14: "i want the nightly scene only dreams to
    // use the new looks"). Every nightly look is `is_scene_eligible = false` BY CONSTRAINT (mig 495's
    // dream_mediums_nightly_look_isolated keeps looks out of the Create picker and the generic pools), and this
    // re-roll tested exactly that flag — so a pure_scene nightly threw the rolled look away and replaced it with
    // a legacy medium (illustration / canvas). The DB cannot be the fix: flipping the flag violates the
    // constraint. So the render keeps a look the looks engine already chose, and only an UNPINNED medium
    // re-rolls. (The full looks path never had this bug — it sets isSceneEligible: true on its provisional
    // medium; the minimal path inherited 1.2.0's re-roll unchanged.)
    const looksPinnedMedium = looksMinimal && !!minimalModel;
    if (isSceneComposition && looksPinnedMedium) {
      fallbackReasons.push(`scene_look_kept:${nightlyMedium.key}`);
    }
    if (
      isSceneComposition &&
      !force_medium &&
      !looksPinnedMedium &&
      !nightlyMedium.isSceneEligible
    ) {
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
    // DAY-OF medium ban on SCENE-ONLY renders (HOLIDAY_DAY_OF_PLAN.md §5d, mig 478): the looks apply to
    // cast renders (their fragments carry the face clause); a scene-only day-of simply never rolls a
    // banned medium (photography by default). Cast renders get the ban through dualSceneMediumBan below.
    if (dayOfHoliday && !force_medium && isSceneComposition) {
      const banned = parseMediumBan(dayOfHoliday.dayOfMediumBan);
      if (banned.has(nightlyMedium.key)) {
        const oldKey = nightlyMedium.key;
        const sceneToken =
          composition === 'pure_scene' ? 'dream_eligible_scene' : 'dream_eligible_scene_natural';
        for (let i = 0; i < 6 && banned.has(nightlyMedium.key); i++) {
          nightlyMedium = await resolveMediumFromDb(
            sceneToken,
            recentMediums,
            undefined,
            firstDreamAllow
          );
        }
        baseMedium = nightlyMedium;
        resolvedMediumKey = nightlyMedium.key;
        realMediumFragment = nightlyMedium.fluxFragment;
        fallbackReasons.push(`day_of_medium_ban:${oldKey}->${nightlyMedium.key}`);
      }
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
    if (faceSwapEligible && !looksPath) {
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
    const dualSteerEnabled = (await fetchEngineConfig(supabase)).dualAvoidFlux11pro;
    const legacyPickFaceSwapModelFor = (medium: typeof baseMedium): string => {
      const pool = nightlyModelPool({
        smartDreamModels: medium.smartDreamModels,
        allowedModels: medium.allowedModels,
        costOf: getSparkleCost,
        bans: nightlyBans,
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
      // Couple model steer (2026-09-05, dualModelSteer.ts) — when ON it supersedes the flex
      // clamp below: on the same seeds flux-2-flex went 8/8 clean first-try (the ~25% figure
      // behind the Aug-26 clamp never reproduced), while 1.1-pro degraded 23-40% and forced
      // every couple through the four override fragments. Off → exactly the old behavior.
      if (isDualFaceSwap && dualSteerEnabled) {
        const steered = steerDualModel(m, medium.allowedModels, nightlyBans, true);
        if (steered.stamp) fallbackReasons.push(steered.stamp);
        return steered.model;
      }
      if (isDualFaceSwap && m === 'black-forest-labs/flux-2-flex') {
        m = 'black-forest-labs/flux-1.1-pro';
        fallbackReasons.push('dual_flex_clamped_to_1.1pro');
      }
      return m;
    };
    // Policy site: face-swap attempt 1 (couple / solo). Shadow compares; 'on' decides.
    const pickFaceSwapModelFor = (medium: typeof baseMedium): string => {
      // MINIMAL: the look already chose its model from Kevin's approvals; the medium's inherited flux pin loses.
      if (minimalModel) return minimalModel;
      const legacy = legacyPickFaceSwapModelFor(medium);
      if (!modelPolicy) return legacy;
      const pick = resolveModel({
        surface: isDualFaceSwap ? 'couple' : 'solo',
        attempt: 1,
        policy: modelPolicy,
        bans: nightlyBans,
      });
      fallbackReasons.push(
        shadowStampSet(
          'faceswap_pick',
          legacy,
          candidateModels(modelPolicy, isDualFaceSwap ? 'couple' : 'solo', 1)
        )
      );
      if (policyMode !== 'on') return legacy;
      fallbackReasons.push(pick.stamp);
      if (nightlyBans.has(pick.model)) {
        // A day-of model ban outranks the policy row (mig 480).
        fallbackReasons.push(
          `day_of_model_ban_hit:${pick.model.split('/').pop()}->${legacy.split('/').pop()}`
        );
        return legacy;
      }
      return pick.model;
    };
    /**
     * THE LOOK'S FRAGMENT *IS* THE LOOK (Kevin, 2026-09-14: "no more flags like this silently overriding it").
     *
     * The 1.2.0 override library (`faceSwapModelOverrides.ts`) exists because flux-1.1-pro ignored the ~12 legacy
     * medium fragments and rendered photoreal regardless, so it was pinned to 4 curated art styles. THE LOOKS
     * CATALOGUE IS THAT CURATED SET NOW — 54 looks, graded per model x surface — so the library stopped being a
     * substitute for a missing style and became an OVERWRITE of a chosen one.
     *
     * Measured on production 2026-09-14: it repainted 45 of 100 looks-engine renders (85% of flux-1.1-pro),
     * rendering `nightly_kodachrome` and `nightly_vintage_film` (photographic looks) as ink illustrations while
     * `uploads.dream_medium` still recorded the look the user never actually got. It fired with NO stamp — only a
     * console.log — which is why it survived a week of QA and a full parity grading loop. Michele's 2026-09-14
     * dream is the case that surfaced it: `nightly_hand_drawn_illustration` shipped as FRAG_CRISP_ORNATE_ILLUSTRATION.
     *
     * Looks-engine renders are now EXEMPT, and EVERY outcome is stamped — a silent substitution is the actual bug.
     */
    const lookFragmentOverrideFor = (model: string | null): string | null => {
      if (force_look) {
        fallbackReasons.push('look_override_library:exempt:force_look');
        return null;
      }
      // FLUX COUPLES GET THE ALBUM FRAGMENTS (Kevin 2026-09-18, priority one — project_flux_framing_is_the_look_fragment):
      // on flux-1.1-pro the look fragment decides the framing. The catalogue's own looks in legacy order held
      // couples at a median 23% face (two giant faces in 20); the four 1.2.0 override fragments held at 16%
      // (9-22%, none giant) — the public-album numbers. Solos and every other model stay exempt (their looks
      // render honestly); a flux couple's rendered fragment is stamped below, so the log never lies about it.
      const fluxCouple = isDualFaceSwap && model === 'black-forest-labs/flux-1.1-pro';
      // HONEST LOOKS (Kevin 2026-09-18, mig 529): the per-look probe (FLUX_COUPLE_LAB.md, 120 renders) showed the
      // catalogue's own fragments hold flux couples as well as the album fragments under the narrative composer
      // (20 approved looks: 93% first try, 98% delivered as a couple, mig 528), so the album substitution became a
      // switch. true = the flux couple renders its rolled look honestly like every other surface; false = the four
      // 1.2.0 fragments (the promotion state). Stamped, so a batch can prove which one it got.
      const honestLooks = force_honest_looks ?? engineCfg0.nightlyFluxCoupleHonestLooks;
      if (looksMinimal && minimalModel && !force_override_library && fluxCouple && honestLooks) {
        fallbackReasons.push('look_override_library:off:honest_looks');
        return null;
      }
      if (looksMinimal && minimalModel && !force_override_library && !fluxCouple) {
        fallbackReasons.push('look_override_library:off:looks_engine');
        return null;
      }
      if (!model) return null;
      const frag = pickFaceSwapModelOverride(model, nightlyVibe?.key ?? null);
      fallbackReasons.push(
        frag
          ? `look_override_library:applied:${model.split('/').pop()}${fluxCouple && looksMinimal ? ':couple' : ''}`
          : 'look_override_library:no_entry'
      );
      return frag;
    };
    if (isFaceSwapCharacter && !looksPath) {
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
      // force_look (Phase A2): the pinned look IS the curated fragment — the library must not repaint it.
      const modelOverride = lookFragmentOverrideFor(faceSwapPrePickedModel);
      if (modelOverride) {
        realMediumFragment = baseMedium.fluxFragment;
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
            (await loadClassicPools(supabase)).dual,
            // Parity loop round 5: candid / partner-leaning pool mix on the looks path.
            looksPath ? LOOKS_DUAL_POOL_MIX : undefined
          )
        : null;
    const singleActionObj = isSingleCharacter
      ? pickSingleAction(
          force_single_pool,
          (await loadClassicPools(supabase)).single,
          looksPath ? LOOKS_SOLO_POOL_MIX : undefined
        )
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
        // CAST FACE-SWAP SAFETY: drop spots that depict a MONUMENTAL human/deity
        // FACE (giant Buddha, Sphinx, moai, Christ the Redeemer, cliff-carved
        // face…). Flux renders the colossal face, the face-swap detector grabs
        // the STATUE'S face, and the cast gets pasted onto the monument (root-
        // caused 2026-09-01 on Longmen Grottoes' "giant Vairocana Buddha carved
        // … face"; RACE_FIDELITY_PLAN.md). These stay eligible for pure_scene
        // (no face to protect); only cast paths filter them. Fall back to the
        // full pool if the filter would starve it (thin location).
        let castSpots = spots;
        if (composition !== 'pure_scene') {
          const safe = spots.filter((s) => !isMonumentalFaceSpot(s.spot_text));
          if (safe.length >= 1) {
            if (safe.length < spots.length) {
              fallbackReasons.push(`monument_face_spots_filtered:${spots.length - safe.length}`);
            }
            castSpots = safe;
          } else {
            fallbackReasons.push('monument_face_spot_pool_starved');
          }
        }
        // L6 variety: prefer an anchor the user hasn't gotten recently. Fall
        // back to the full pool if de-duping would starve it (mirrors
        // filterRecent's >=2 rule — small/thin location pools).
        const recentAnchorSet = new Set(recentAnchors);
        const freshSpots = castSpots.filter((s) => !recentAnchorSet.has(s.spot_text));
        const anchorPool = freshSpots.length >= 2 ? freshSpots : castSpots;
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
    let dualSpecialScene: string | null = null as string | null; // assigned inside applySceneRow (closure) — keep the declared type
    /** The ACTIVE scenario's own people clause (mig 516), fed to the action slot. */
    let dualScenarioAction: string | null = null;
    let dualSpecialWardrobe: string | null = null as string | null; // assigned inside applySceneRow (closure) — keep the declared type // the scene's attire (costume/formal/normal)
    // Which special pool the scene came from — the pose pick branches on THIS,
    // not on wardrobe truthiness (goofy rows carry a literal 'normal…clothes'
    // attire string, so `dualSpecialWardrobe ?` mis-routed all goofy scenes to
    // the partner pose pool; found while wiring pose_pool, 2026-07-09).
    let dualSceneKind: 'goofy' | 'elegant' | null = null;
    // Holiday row sub-theme → its MAIN pool names the scene-first action register.
    let holidaySubTheme: string | null = null;
    // Seed category of the picked scenario row (swashbuckler / victorian / …) → genre action register.
    let dualSceneCategory: string | null = null;
    // The scene-first authored action that shipped (forensics: rolled_axes.seedSource).
    let sceneActionText: string | null = null;
    // ONE place assigns a picked scenario row into the render state (SCENE_FIRST_ACTION_PLAN.md §11.2 —
    // replaced six copy-pasted blocks). 'active' = the seed carries the verb: no kind / pose pool /
    // category (the caller sets dualActiveScene / soloActiveScene). A holiday key also records the
    // season + sub-theme for the register + forensics.
    // TS cannot see assignments made inside applySceneRow, so it over-narrows `dualSceneKind` at later
    // comparison sites; read it through this wide-typed accessor there.
    const sceneKindNow = (): 'goofy' | 'elegant' | null => dualSceneKind;
    const applySceneRow = (
      s: {
        scene: string;
        attire: string;
        posePool?: string | null;
        category?: string | null;
        mediumKey?: string | null;
        mediumBan?: string | null;
        subTheme?: string | null;
      },
      kind: 'goofy' | 'elegant' | 'active',
      holidayKey: string | null = null
    ) => {
      // mig 516: the row's people clause rides its own column. The engine spends `scene` as the PLACE, so any
      // action left inside it is read as scenery — strip it here and hand it to the action slot instead. `action`
      // is a verbatim slice of `scene`, so this is an exact cut with no pattern matching.
      const rowAction = (s as { action?: string | null }).action ?? null;
      const cut = rowAction && s.scene.includes(rowAction) ? s.scene.indexOf(rowAction) : -1;
      dualSpecialScene =
        cut > 0
          ? s.scene
              .slice(0, cut)
              .replace(/[,;]\s*$/, '')
              .trim()
          : s.scene;
      // Kevin 2026-09-13: a SINGLE scenario is written as one gerund-led sentence ("Pumping hard through a concrete
      // skate bowl banking the wall at full speed") — the action IS the sentence, with no subject clause to cut at,
      // so 5,483 of them never split. Rather than rewrite his seeds, hand the sentence itself to the action slot:
      // his vision goes through exactly as authored, into the slot the model actually reads for people. Couples
      // keep the split, because there the trailing clause is separable and the place half matters.
      dualScenarioAction = rowAction ?? (kind === 'active' && !isDualFaceSwap ? s.scene : null);
      dualSpecialWardrobe = s.attire;
      dualSceneMediumKey = s.mediumKey ?? null;
      dualSceneMediumBan = s.mediumBan ?? null;
      if (kind !== 'active') {
        dualSceneKind = kind;
        dualScenePosePool = s.posePool ?? null;
        dualSceneCategory = s.category ?? null;
      }
      if (holidayKey) {
        holidayCategory = holidayKey;
        holidaySubTheme = s.subTheme ?? null;
      }
    };
    // Bespoke pose pool named by the picked scenario row (migration 353) —
    // e.g. 'glamour'. Null = default pose behavior for the scene kind.
    let dualScenePosePool: string | null = null as string | null; // assigned inside applySceneRow (closure) — keep the declared type
    // Forced medium named by the picked scenario row (migration 354) — e.g.
    // 'photography' for the photo-genre parody seeds. Null = rolled medium.
    let dualSceneMediumKey: string | null = null as string | null; // assigned inside applySceneRow (closure) — keep the declared type
    // Banned medium named by the picked scenario row (migration 355) — if the
    // roll landed on it, re-roll from the face-swap pool minus this key.
    let dualSceneMediumBan: string | null = null as string | null; // assigned inside applySceneRow (closure) — keep the declared type
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
    // activeHolidays was computed ABOVE the chaos pre-roll (hoisted 2026-09-04 for the
    // day-of HERO); nothing to do here.
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
        // DAY-OF (HOLIDAY_DAY_OF_PLAN.md §3.3): a no-cast user's holiday dream is guaranteed (100%)
        // from the reserved day-of pool; empty → the holiday's window rows; both empty → normal.
        const dayOfKey = dayOfHoliday ? dayOfHoliday.key : null;
        const dayOfSel = dayOfKey
          ? selectDayOfRows(
              await loadHolidayScenes(supabase, dayOfKey, force_holiday_sub_theme, 'only'),
              holScenePools.find((x) => x.h.key === dayOfKey)?.rows ?? []
            )
          : null;
        const stackCap = (await fetchEngineConfig(supabase)).holidayStackCapPct;
        const pct =
          dayOfSel && dayOfSel.rows.length > 0 ? 100 : combineHolidayPct(usable, stackCap);
        if (dayOfSel && dayOfSel.rows.length > 0) {
          holidayScene = pickHoliday(dayOfSel.rows);
          holidayCategory = dayOfKey as string;
          dayOfApplied = true;
          fallbackReasons.push(
            `holiday_day_of:${dayOfKey}:${dayOfSel.source}:${holidayScene.subTheme ?? 'unsorted'}`
          );
        } else if (usable.length > 0 && Math.random() * 100 < pct) {
          const chosen = pickWeightedHoliday(usable, Math.random());
          holidayScene = pickHoliday(holScenePools.find((x) => x.h.key === chosen.key)!.rows);
          holidayCategory = chosen.key;
          fallbackReasons.push(`holiday_scene:${chosen.key}`);
        }
        if (holidayScene) {
          if (holidayScene.mediumKey) {
            try {
              const m = await resolveMediumFromDb(holidayScene.mediumKey);
              if (m?.fluxFragment && m.key === holidayScene.mediumKey) {
                holidaySceneMediumFragment = m.fluxFragment;
                // The pinned look IS this dream's medium (§5e stylized scene-only worlds): record it as
                // uploads.dream_medium so the card label, Dream Again and DLT name the look, not the roll.
                resolvedMediumKey = m.key;
                fallbackReasons.push(`holiday_scene_medium:${m.key}`);
              }
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
          .select('scene,attire,pool,pose_pool,medium_key,medium_ban,category')
          .eq('category', force_scene_category)
          .eq('disabled', false);
        if (catRows && catRows.length > 0) {
          // A kind pin alongside the category (the sequel: same kind AND same world) narrows to that pool;
          // a category with no rows in that pool keeps every row rather than failing the render.
          const wantPool =
            force_active || force_single_active
              ? 'active'
              : force_playful || force_single_playful
                ? 'goofy'
                : force_elegant || force_single_elegant
                  ? 'elegant'
                  : null;
          const kindRows = wantPool ? catRows.filter((r) => r.pool === wantPool) : catRows;
          const pickFrom = kindRows.length > 0 ? kindRows : catRows;
          const s = pickFrom[Math.floor(Math.random() * pickFrom.length)];
          const sPool = s.pool as string;
          // Mirror the production per-pool pose behavior so QA reflects the real render: ACTIVE-pool
          // scenes embed the action in the scene text; goofy/elegant draw the pose from their kind.
          applySceneRow(
            {
              scene: s.scene as string,
              attire: s.attire as string,
              posePool: (s.pose_pool as string | null) ?? null,
              category: (s.category as string | null | undefined) ?? force_scene_category,
              mediumKey: (s.medium_key as string | null) ?? null,
              mediumBan: (s.medium_ban as string | null) ?? null,
            },
            sPool === 'active' ? 'active' : sPool === 'elegant' ? 'elegant' : 'goofy'
          );
          if (sPool === 'active') {
            if (isDualFaceSwap) dualActiveScene = true;
            else soloActiveScene = true;
          }
          fallbackReasons.push(`forced_scene_category:${force_scene_category}:${s.pool}`);
        }
      }
      // DAY-OF (HOLIDAY_DAY_OF_PLAN.md §3.3): every eligible cast nightly draws 100% from the
      // holiday's reserved <key>_day_of pool and is applied by the SAME applySceneRow path as a window
      // holiday row (one pipeline). Empty day-of pool → the holiday's window rows; both empty → the
      // normal roll below. 'elegant' = refined poses (couples → 'partner'), as on every holiday row.
      if (!dualSpecialScene && dayOfHoliday && (isDualFaceSwap || isSingleHumanFaceSwap)) {
        const key = dayOfHoliday.key;
        try {
          if (isDualFaceSwap) {
            const sel = selectDayOfRows(
              await loadHolidayDual(supabase, key, force_holiday_sub_theme, 'only'),
              force_holiday_sub_theme ? [] : await loadHolidayDual(supabase, key, null, 'exclude')
            );
            if (sel.rows.length > 0) {
              const unseen = await filterUnseen(
                supabase,
                userId,
                `holiday:${key}`,
                sel.rows,
                (x) => x.scene
              );
              const s = pickHoliday(unseen.length ? unseen : sel.rows);
              applySceneRow(s, 'elegant', key);
              dayOfApplied = true;
              fallbackReasons.push(
                `holiday_day_of:${key}:${sel.source}:${s.subTheme ?? 'unsorted'}`
              );
              recordPick(supabase, userId, `holiday:${key}`, s.scene);
            } else fallbackReasons.push(`holiday_day_of_empty:${key}`);
          } else {
            const g = castGender === 'male' || castGender === 'female' ? castGender : 'any';
            const sel = selectDayOfRows(
              holidaySingleCandidates(
                await loadHolidaySingle(supabase, key, force_holiday_sub_theme, 'only'),
                g
              ),
              force_holiday_sub_theme
                ? []
                : holidaySingleCandidates(
                    await loadHolidaySingle(supabase, key, null, 'exclude'),
                    g
                  )
            );
            if (sel.rows.length > 0) {
              const unseen = await filterUnseen(
                supabase,
                userId,
                `holiday:${key}`,
                sel.rows,
                (x) => x.scene
              );
              const s = pickHoliday(unseen.length ? unseen : sel.rows);
              applySceneRow(s, 'elegant', key);
              dayOfApplied = true;
              fallbackReasons.push(
                `holiday_day_of:${key}:${sel.source}:${s.subTheme ?? 'unsorted'}`
              );
              recordPick(supabase, userId, `holiday:${key}`, s.scene);
            } else fallbackReasons.push(`holiday_day_of_empty:${key}`);
          }
        } catch (e) {
          // Never a broken render: fall through to the normal roll.
          fallbackReasons.push(`holiday_day_of_error:${(e as Error).message.slice(0, 60)}`);
        }
      }
      if (dualSpecialScene) {
        // forced above — skip the roll
      } else if (isDualFaceSwap) {
        const loadedPools = await loadDualScenarios(supabase);
        // RELATIONSHIP GATE (mig 518). A FRIEND +1 never draws a scenario whose CONTENT is romance between the
        // pair — wedding attire, "two disco-era lovers", a kissing bough over them. Asymmetric by design (Kevin,
        // 2026-09-14): a PARTNER keeps the whole pool and still draws plenty of platonic scenes, so partners get
        // both registers and friends only lose the romantic slice. Poses are gated separately, and correctly
        // already, by pickDualAction. This is the layer no prompt wording can cover — the prefix probe that same
        // day rendered "TWO FRIENDS" and "PARTNERS" identically.
        const plusOneRel = selectedCast.find((c) => c.role === 'plus_one')?.relationship ?? null;
        const pools = {
          goofy: scenariosForRelationship(loadedPools.goofy, plusOneRel),
          elegant: scenariosForRelationship(loadedPools.elegant, plusOneRel),
          active: scenariosForRelationship(loadedPools.active, plusOneRel),
        };
        const gatedOut =
          loadedPools.goofy.length +
          loadedPools.elegant.length +
          loadedPools.active.length -
          (pools.goofy.length + pools.elegant.length + pools.active.length);
        if (gatedOut > 0)
          fallbackReasons.push(`relationship_gate:${plusOneRel ?? 'unknown'}:${gatedOut}`);
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
        const holidayPct = combineHolidayPct(usableHol, splitCfg.holidayStackCapPct);
        const { holidayCut, goofyCut, elegantCut, activeCut } = sceneTypeCuts(
          adaptiveScenePcts(
            looksPath
              ? LOOKS_SCENE_PCTS
              : {
                  goofy: splitCfg.dualSceneGoofyPct,
                  elegant: splitCfg.dualSceneElegantPct,
                  active: splitCfg.dualSceneActivePct,
                },
            pickedCount
          ),
          { activeEnabled: pools.active.length >= 10, holidayPct }
        );
        const roll = force_plain_location ? 2 : Math.random(); // 2 > every cut → location
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
          // Equal-airtime draw across the holiday's MAIN pools (Kevin 2026-09-05).
          const s = pickHoliday(
            await filterUnseen(supabase, userId, `holiday:${chosen.key}`, rows, (x) => x.scene)
          );
          // 'elegant' = refined partner pose — NO playful thumbs-up/props on holiday. Couples use the
          // refined 'partner' pool, NOT the campy 'glamour' pool (reads twee on holiday couples).
          applySceneRow(s, 'elegant', chosen.key);
          fallbackReasons.push(`holiday:${chosen.key}`);
          recordPick(supabase, userId, `holiday:${chosen.key}`, s.scene);
        } else if (force_playful || (!force_elegant && !force_active && roll < goofyCut)) {
          const s = pickDualScenario(
            await filterUnseen(supabase, userId, 'dual_scn_goofy', pools.goofy, (x) => x.scene)
          );
          applySceneRow(s, 'goofy');
          recordPick(supabase, userId, 'dual_scn_goofy', s.scene);
        } else if (force_elegant || (!force_active && roll < elegantCut)) {
          const s = pickDualScenario(
            await filterUnseen(supabase, userId, 'dual_scn_elegant', pools.elegant, (x) => x.scene)
          );
          applySceneRow(s, 'elegant');
          recordPick(supabase, userId, 'dual_scn_elegant', s.scene);
        } else if ((force_active && pools.active.length > 0) || roll < activeCut) {
          const s = pickDualScenario(
            await filterUnseen(supabase, userId, 'dual_scn_active', pools.active, (x) => x.scene)
          );
          // Medium ban/key applied here too, or fantasy_hero/superhero/giant_critter render
          // photoreal-creepy instead of painterly (downstream force/reroll reads them).
          applySceneRow(s, 'active');
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
        const holidayPct = combineHolidayPct(usableHolSolo, splitCfg.holidayStackCapPct);
        const { holidayCut, goofyCut, elegantCut, activeCut } = sceneTypeCuts(
          adaptiveScenePcts(
            looksPath
              ? LOOKS_SCENE_PCTS
              : {
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
        const roll = force_plain_location ? 2 : Math.random(); // 2 > every cut → location
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
          const s = pickHoliday(pool); // equal-airtime across MAIN pools (Kevin 2026-09-05)
          // 'elegant' = refined solo pose — NO playful/active props on holiday, and NO forced glamour
          // pool (Kevin 2026-09-04: it produced person-first portraits). A row can still opt into a pool.
          applySceneRow(s, 'elegant', chosen.key);
          fallbackReasons.push(`holiday:${chosen.key}`);
          recordPick(supabase, userId, `holiday:${chosen.key}`, s.scene);
        } else if (
          force_single_playful ||
          (!force_single_elegant && !force_single_active && roll < goofyCut)
        ) {
          const s = await pickSolo('goofy');
          if (s) applySceneRow(s, 'goofy');
        } else if (force_single_elegant || (!force_single_active && roll < elegantCut)) {
          const s = await pickSolo('elegant');
          if (s) applySceneRow(s, 'elegant');
        } else if (force_single_active || roll < activeCut) {
          const s = await pickSolo('active');
          if (s) {
            applySceneRow(s, 'active');
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
    // DAY-OF LOOK (HOLIDAY_DAY_OF_PLAN.md §5d, mig 478): a day-of CAST render pins its medium to one of
    // the holiday's curated looks (dream_mediums rows the app never lists). The pin rides the scenario
    // medium-pin route just below (resolve by key → re-sync the model lists → re-pick the model from the
    // LOOK's smart_dream_models = per-look model membership) and the 1.1-pro override library is exempted
    // (the look IS the curated fragment). No look → the holiday's medium ban joins the ban list.
    let dayOfLookKey: string | null = null;
    if (dayOfApplied && dayOfHoliday && dualSpecialScene && !force_medium) {
      const look = pickDayOfLook(dayOfHoliday.dayOfLookKeys, force_day_of_look);
      if (look) {
        dayOfLookKey = look;
        dualSceneMediumKey = look;
        fallbackReasons.push(`day_of_look:${look}`);
      } else {
        fallbackReasons.push('day_of_look:none');
        if (dayOfHoliday.dayOfMediumBan) {
          dualSceneMediumBan = [dualSceneMediumBan, dayOfHoliday.dayOfMediumBan]
            .filter((x): x is string => !!x)
            .join(',');
        }
      }
    }
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
    if (
      dualSceneMediumKey &&
      !force_medium &&
      !looksPath &&
      dualSceneMediumKey !== nightlyMedium.key
    ) {
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
          // The pinned medium's REAL fragment — the couple-degrade solo rebuild renders with this
          // (it used to keep the ORIGINAL roll's fragment when the override below did not fire).
          realMediumFragment = baseMedium.fluxFragment;
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
          // ── DAY-OF / PIN MODEL FIT (2026-09-13) ────────────────────────────────────────────────
          // Under MINIMAL the line above is a no-op: pickFaceSwapModelFor short-circuits on `minimalModel`, which
          // was chosen for the look the contract ROLLED, not the one just pinned over it. A curated holiday look
          // carries its own allowed_models — `halloween_digital_painting` names three models and flux-1.1-pro is
          // NOT one of them, while the other five halloween looks do include it — so on Oct 31 a cast render could
          // ship the pinned look on a model that look's own row forbids. Re-build the contract AROUND the pin with
          // the pool clipped to that row, which fixes the first pick AND every rung of the retry chain. The vibe is
          // deliberately left alone (withVibes: false) — this is a model decision, not a restyle.
          if (looksMinimal && minimalModel && !force_model) {
            const pinAllowed = nightlyMedium.allowedModels ?? [];
            if (pinAllowed.length > 0 && !pinAllowed.includes(minimalModel)) {
              const refit = await buildMinimalContract({
                pinnedLook: dualSceneMediumKey,
                restrictModels: pinAllowed,
                withVibes: false,
              });
              if (refit && refit.look.key === dualSceneMediumKey) {
                fallbackReasons.push(
                  `pin_model_fit:${minimalModel.split('/').pop()}->${refit.model.split('/').pop()}`,
                  ...refit.stamps.filter((st) => st.startsWith('model_restrict:'))
                );
                minimalModel = refit.model;
                faceSwapPrePickedModel = refit.model;
                styleContract = refit;
              } else {
                // Fail OPEN, loudly: a day-of render must ship even when the pin is not a catalog look.
                fallbackReasons.push(`pin_model_fit_miss:${dualSceneMediumKey}`);
              }
            } else {
              fallbackReasons.push('pin_model_fit:ok');
            }
          }
          if (faceSwapPrePickedModel && !dayOfLookKey) {
            const modelOverride = lookFragmentOverrideFor(faceSwapPrePickedModel);
            if (modelOverride) {
              realMediumFragment = baseMedium.fluxFragment;
              baseMedium = { ...baseMedium, fluxFragment: modelOverride };
            }
          } else if (dayOfLookKey) {
            // The day-of look is the curated fragment — the per-model override library stays out.
            fallbackReasons.push(`day_of_look_fragment:${faceSwapPrePickedModel ?? 'none'}`);
          }
          fallbackReasons.push(`scene_medium:${dualSceneMediumKey}`);
          console.log(`[nightly] scenario forced medium: ${dualSceneMediumKey}`);
        } else {
          // The pin did NOT take. Fail-open is right (never break a dream), but SILENT fail-open is not:
          // resolveMediumFromDb falls back to canvas for a key it cannot see, so a mistyped / de-activated /
          // pool-restricted day-of look would drop the holiday style with no trace in the log at all.
          fallbackReasons.push(
            `scene_medium_unresolved:${dualSceneMediumKey}:${forced ? forced.key : 'none'}`
          );
        }
      } catch (_e) {
        fallbackReasons.push(`scene_medium_threw:${dualSceneMediumKey}`);
      }
    } else if (looksMinimal && minimalModel && bannedMediums.length > 0 && !force_medium) {
      // ── SCENARIO MEDIUM BAN, TRANSLATED (2026-09-13) ───────────────────────────────────────────
      // 6,175 enabled scenario rows carry a `medium_ban` written in the 1.2.0 MEDIUM vocabulary
      // ('photography', 'film_noir', 'heirloom', …). They are the guard that keeps a PHOTO-REAL person out of a
      // fantastical scene — a photoreal couple in a dwarven hall reads as bad compositing (Kevin, 2026-08-24).
      // Under the looks engine the rolled style is always a `nightly_*` look, so the legacy branch below
      // ('is the rolled key in the ban list?') can never be true and the guard has been silently OFF since the
      // engine went live. (Verified 2026-09-13: the rows carrying bans are the fantastical categories —
      // giant_critter, underwater_wonders, winter_wonder, cozy_magic, mermaid_f … — NOT halloween or fall,
      // whose 4,383 rows carry no medium_ban at all.) Translate the tokens to look keys, and when the
      // rolled look is one of them, RE-ROLL THE LOOK from the same contract minus the banned set — never the
      // legacy re-roll below, which would throw the whole style contract away for a random face-swap medium.
      const catalog = await loadNightlyLooks(supabase);
      const bannedLooks = expandMediumBans(bannedMediums, catalog.looks);
      if (bannedLooks.has(nightlyMedium.key)) {
        const was = nightlyMedium.key;
        // KEEP THE ROLLED MODEL (2026-09-17). A medium ban is a judgement about the LOOK, not the model — yet
        // this refit used to re-roll the model along with the look: a second, UNSTAMPED 85/15 roll, or a
        // one-model pool if the replacement look rejects flux. So a render that stamped
        // `policy:solo:1:flux-1.1-pro` could ship on gemini with nothing in the stamps to say why (AB-CHAIN 2,
        // technicolor -> painted_fantasy under the fall holiday). Measured: 19 of 430 renders in 7 days took this
        // path; 4 rolled flux and delivered gemini silently. restrictModels pins the re-roll to the model already
        // chosen; if no unbanned look is graded for it the refit is null and the nofit branch below keeps the
        // original look, which is the lesser evil — a render on the rolled model in a debatable look beats a
        // silent model swap. Any model change that does still happen is stamped.
        const refit = await buildMinimalContract({
          excludeLookKeys: bannedLooks,
          withVibes: false,
          restrictModels: minimalModel ? [minimalModel] : null,
        });
        if (refit && !bannedLooks.has(refit.look.key) && (await applyMinimalLook(refit, false))) {
          styleContract = refit;
          if (refit.model !== minimalModel)
            fallbackReasons.push(
              `look_medium_ban_model:${minimalModel.split('/').pop()}->${refit.model.split('/').pop()}`
            );
          fallbackReasons.push(...refit.stamps.filter((st) => st.startsWith('model_restrict:')));
          minimalModel = refit.model;
          if (faceSwapPrePickedModel) faceSwapPrePickedModel = refit.model;
          resolvedMediumKey = nightlyMedium.key;
          baseMedium = applyFaceSwapOverride(nightlyMedium);
          realMediumFragment = baseMedium.fluxFragment;
          resolvedMediumAllowedModels = nightlyMedium.allowedModels;
          resolvedMediumSceneModels = nightlyMedium.sceneEligibleModels;
          resolvedMediumSmartModels = nightlyMedium.smartDreamModels;
          // Re-apply the per-model curated fragment for the NEW look + model, exactly as the pin and legacy-ban
          // routes do. On a looks-engine render the guard returns null, so the re-rolled LOOK keeps its own fragment.
          const banOverride = lookFragmentOverrideFor(refit.model);
          if (banOverride) {
            realMediumFragment = baseMedium.fluxFragment;
            baseMedium = { ...baseMedium, fluxFragment: banOverride };
          }
          fallbackReasons.push(`look_medium_ban:${was}->${refit.look.key}`);
          console.log(`[nightly] scenario banned look ${was}; re-rolled ${refit.look.key}`);
        } else {
          // Fail OPEN (the 1.2.0 contract): a bad ban can never break a dream.
          fallbackReasons.push(`look_medium_ban_nofit:${was}`);
        }
      }
    } else if (
      bannedMediums.length &&
      !force_medium &&
      !looksPath &&
      bannedMediums.includes(nightlyMedium.key)
    ) {
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
          const rerollOverride = lookFragmentOverrideFor(faceSwapPrePickedModel);
          if (rerollOverride) {
            realMediumFragment = baseMedium.fluxFragment;
            baseMedium = { ...baseMedium, fluxFragment: rerollOverride };
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
    // ── LOOKS PATH: the style contract (model → look → vibe), applied once, here, after every pin is known ──
    if (looksMode !== 'off' && modelPolicy) {
      const surface = surfaceFor({ isDualFaceSwap, isSingleHumanFaceSwap });
      const catalog = await loadNightlyLooks(supabase);
      const vibeRowsAll = await fetchVibes();
      const contract = buildStyleContract({
        surface,
        policy: modelPolicy,
        bans: looksPathBans(
          nightlyBans,
          modelPolicy,
          dayOfHoliday ? dayOfHoliday.dayOfModelBan : []
        ),
        forceModel: force_model ?? null,
        looks: catalog.looks,
        approvals: catalog.approvals,
        recentLookKeys: recentMediums,
        recencyWindow: engineCfg0.nightlyLookRecency,
        legacyPct: engineCfg0.nightlyLegacyLookPct,
        forcedLook: force_look ?? null,
        pinnedLook:
          (qa_pin_look ? String(qa_pin_look) : null) ??
          dayOfLookKey ??
          (holidayScene ? holidayScene.mediumKey : null) ??
          dualSceneMediumKey,
        vibes: toVibeRows(vibeRowsAll),
        recentVibeKeys: recentVibes,
        forcedVibe: force_vibe ?? null,
      });
      if (!contract) {
        fallbackReasons.push(`looks_path_no_contract:${surface}`);
      } else if (!looksPath) {
        fallbackReasons.push(shadowStamp(contract));
      } else {
        const o = applyStyleContract(
          contract,
          nightlyMedium,
          new Map(vibeRowsAll.map((v) => [v.key, v]))
        );
        nightlyMedium = o.nightlyMedium;
        baseMedium = o.baseMedium;
        realMediumFragment = o.realMediumFragment;
        resolvedMediumKey = o.resolvedMediumKey;
        resolvedMediumAllowedModels = o.allowedModels;
        resolvedMediumSceneModels = o.allowedModels;
        resolvedMediumSmartModels = o.allowedModels;
        holidaySceneMediumFragment = null; // the holiday pin went into the contract
        if (surface === 'scene') looksSceneModel = o.model;
        else faceSwapPrePickedModel = o.model;
        if (o.vibe) {
          nightlyVibe = o.vibe;
          resolvedVibeKey = o.vibe.key;
        }
        looksVibeFragment = o.vibeFragment;
        looksVibePosition = o.vibePosition;
        looksModel = o.model;
        styleContract = contract;
        activeStyle = o.active;
        fallbackReasons.push(...o.stamps);
        console.log(
          `[nightly-dreams] LOOKS PATH ${surface}: model ${o.model} · look ${o.resolvedMediumKey} · vibe ${o.vibe ? o.vibe.key : 'none'}`
        );
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
      // 2026-09-05: a HOLIDAY scene is people-free by lint, so the fallback
      // re-renders THAT scene (a Halloween solo whose swap failed used to ship
      // the user's real place — a sunny Greek alley with no Halloween in it).
      // Other scenario seeds describe PEOPLE ("the couple as pirates"), so for
      // them only the people-free SETTING clause is used; a plain location dream
      // keeps the real place; no place at all → a dreamscape.
      location:
        holidayCategory && dualSpecialScene
          ? dualSpecialScene
          : dualSpecialScene
            ? `an empty scene: ${settingClauseOf(dualSpecialScene)}`
            : (iconicAnchor ?? userPlace ?? 'a vast, empty dreamlike landscape'),
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
        // ── Scene-first action roll (SCENE_FIRST_ACTION_PLAN.md) — decided HERE, before Option B, so a
        // render never pays for two Sonnet beats. Kevin 2026-09-06: "apply this fix globally to nightly" →
        // eligible for seeded scenario rows (goofy / elegant / holiday / hero) AND plain-location dreams.
        // Not for: active rows (the seed carries the verb), a biome ACTIVE pose that fired, a row naming a
        // bespoke pose_pool, or an explicit force_action.
        const sfaCfg = await fetchEngineConfig(supabase);
        const sfaKind =
          dualActiveScene || soloActiveScene
            ? 'active'
            : dualSpecialScene
              ? 'scenario'
              : 'location';
        const sfaDecision = decideSceneFirst({
          kind: sfaKind,
          activePoseFired: force_active_pose || !!activePose || !!activeSinglePose,
          bespokePool: !!dualScenePosePool,
          forceAction: !!force_action,
          forceSceneAction: force_scene_action,
          // 1.2.0-parity (2026-09-12): on the looks path scene-first beats are a MINORITY so the authored pool
          // poses (the album's poses) lead again; the legacy path keeps its config.
          pctScenario: looksPath
            ? selectedCast.length === 2
              ? LOOKS_SCENE_ACTION_PCT_COUPLE
              : LOOKS_SCENE_ACTION_PCT
            : sfaCfg.sceneActionPct,
          pctLocation: looksPath
            ? selectedCast.length === 2
              ? LOOKS_SCENE_ACTION_PCT_COUPLE
              : LOOKS_SCENE_ACTION_PCT
            : sfaCfg.sceneActionLocationPct,
          castCount: selectedCast.length === 2 ? 2 : 1,
          // Parity loop round 4 (2026-09-12): on the looks path, LOCATION couples may take a scene-first beat
          // (and so a rolled stance: seated, leaning, wide) — the September 5 dark-launch hold kept them on
          // the standing side-by-side pool poses, the one class still grading 3 in rounds 1-3.
          allowLocationCouples: looksPath ? true : sfaCfg.sceneActionLocationCouples,
        });
        const sfaRoll = sfaDecision.roll;
        // Forensics (parity loop): why scene-first did or did not roll (rounds 3-4 rolled 0/28 with no trace).
        fallbackReasons.push(`sfa:${sfaDecision.reason}`);
        let locationAction: string | null = null;
        const plainLocation = !dualSpecialScene && !dualSpecialWardrobe;
        if (plainLocation && !sfaRoll && !force_active_pose && !activePose && !activeSinglePose) {
          const locCfg = await fetchEngineConfig(supabase);
          const locPct = looksPath
            ? selectedCast.length === 2
              ? LOOKS_LOCATION_ACTION_PCT_COUPLE
              : LOOKS_LOCATION_ACTION_PCT_SOLO
            : locCfg.locationActionPct;
          const rollLoc = force_location_action || (locPct > 0 && Math.random() * 100 < locPct);
          if (rollLoc) {
            locationAction = await generateLocationActionBeat(
              iconicAnchor || userPlace || '',
              selectedCast.length === 2 ? 2 : 1,
              ANTHROPIC_KEY
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
        // SWAP GEOMETRY (looks path, 2026-09-12): 'natural' lets the couple touch / move and relaxes the hands
        // rule; a failed dual split re-renders with the STRICT geometry (see the dual rerender below) before the
        // pipeline ever degrades to a solo. Default strict until the A/B (QA force_swap_geometry) settles it —
        // then an engine_config field. Legacy path: always strict (byte-identical).
        const swapGeometry: 'strict' | 'natural' = looksPath
          ? (force_swap_geometry ?? 'strict')
          : 'strict';
        if (swapGeometry === 'natural') fallbackReasons.push('swap_geometry:natural');
        // The precedence table lives in _shared/castActionResolver.ts (SCENE_FIRST_ACTION_PLAN.md §11.3,
        // test-locked). This handler only loads the inputs and applies the result.
        // NO ACTION AT ALL → generate one that fits THIS scene (Kevin 2026-09-13). 260 couple rows are pure scene
        // descriptions with no action ever written ("Courtyard with stone columns wrapped in amber lights"), and
        // without this they fall to DUAL_ACTIVE_ANCHOR, which only points at the scene and leaves the cast posed by
        // the face-swap framing block — two people standing at attention. The generic pose pools would not mismatch
        // the scene, but they only ever say "standing", which is the plainness we are trying to kill. The
        // location-beat generator already writes a place-fitting beat for 75% of plain-location dreams, so point it
        // at the scenario's place text and let it do the same job here. Fail-open: null keeps the old anchor.
        if ((dualActiveScene || soloActiveScene) && !dualScenarioAction && dualSpecialScene) {
          const beatKey = Deno.env.get('ANTHROPIC_API_KEY');
          if (beatKey) {
            const generated = await generateLocationActionBeat(
              dualSpecialScene,
              selectedCast.length === 2 ? 2 : 1,
              beatKey
            );
            if (generated) {
              dualScenarioAction = generated;
              fallbackReasons.push('scenario_action:generated');
            } else {
              fallbackReasons.push('scenario_action:generate_failed');
            }
          }
        }
        const resolved = resolveCastAction({
          castCount: selectedCast.length === 2 ? 2 : 1,
          forceAction: force_action,
          scenarioAction: dualScenarioAction,
          dualActiveScene,
          soloActiveScene,
          bespokePoolName: dualScenePosePool,
          bespokePoses: dualScenePosePool
            ? ((selectedCast.length === 2
                ? classicPools.bespoke.dual[dualScenePosePool]
                : classicPools.bespoke.solo[dualScenePosePool]) ?? [])
            : [],
          sceneKind: sceneKindNow(),
          hasSpecialScene: !!dualSpecialScene,
          hasSpecialWardrobe: !!dualSpecialWardrobe,
          plusOneRelationship: selectedCast.find((c) => c.role === 'plus_one')?.relationship,
          activePose,
          activeSinglePose,
          locationAction,
          dualAction,
          singleAction,
          classicDualPools: classicPools.dual,
          classicSoloCandid: classicPools.single.candid,
          // Parity loop round 7: elegant-row solos lean on the portrait pool (looks path only).
          classicSoloPortrait: looksPath ? classicPools.single.portrait : undefined,
          sfaRoll,
          sfaKind,
          // Flux couples on the album skeleton roll the GENERIC stances only: the wide, geometry-changing ones broke
          // the flux split (arm E, 2026-09-13 — the 2026-09-06 finding again).
          wideStances:
            looksPath &&
            !isFluxCoupleAlbum(selectedCast.length === 2 ? 'couple' : 'solo', looksModel),
          fluxWideStances:
            looksPath &&
            LOOKS_FLUX_WIDE_STANCES &&
            isFluxCoupleAlbum(selectedCast.length === 2 ? 'couple' : 'solo', looksModel),
          fluxStanceShare:
            looksPath &&
            LOOKS_FLUX_WIDE_STANCES &&
            isFluxCoupleAlbum(selectedCast.length === 2 ? 'couple' : 'solo', looksModel)
              ? LOOKS_FLUX_STANCE_POOL_SHARE
              : 0,
          naturalStances: looksPath && swapGeometry === 'natural',
          holidayCategory: holidayCategory ?? null,
          holidayPool: holidaySubTheme ? holidayPoolOf(holidaySubTheme) : null,
          registerKey: holidayCategory
            ? holidaySubTheme
              ? holidayPoolOf(holidaySubTheme)
              : null
            : sfaKind === 'location'
              ? (biomeKey ?? 'location')
              : (dualSceneCategory ?? sceneKindNow()),
          rollRegisters:
            force_action_registers ||
            (sfaCfg.actionRegistersPct > 0 && Math.random() * 100 < sfaCfg.actionRegistersPct),
        });
        const action = resolved.action;
        const authorAction = resolved.authorAction;
        const dualStance = resolved.dualStance;
        fallbackReasons.push(...resolved.stamps);
        // Female-hairstyle variation (2026-08-31): re-style a FEMALE cast
        // member's hair per engine_config.female_hair_variation_pct, biased to
        // the scene register — elegant scenes → updos/glam, active → ponytails/
        // braids, everything else → relaxed. Nightly-only (Create never sets it).
        const hairCfg = await fetchEngineConfig(supabase);
        const sfaCfgCloser = hairCfg;
        const sceneRegister: 'elegant' | 'active' | 'casual' =
          dualSceneKind === 'elegant'
            ? 'elegant'
            : soloActiveScene || !!activePose || !!activeSinglePose
              ? 'active'
              : 'casual';
        // HOLIDAY COSTUME LOCK (holidayCostumes.ts, HOLIDAY_DAY_OF_PLAN.md §5b): on a day-of cast render
        // each cast member is dressed in a rolled character costume, locked into the prompt verbatim.
        // engine_config.day_of_costume_pct (default 100); QA: force_costume_keys / force_costume_pct.
        const costumePct = force_costume_pct ?? hairCfg.dayOfCostumePct;
        const costumePicks =
          dayOfApplied &&
          dayOfHoliday &&
          (force_costume_keys !== null || Math.random() * 100 < costumePct)
            ? rollHolidayCostumes(
                dayOfHoliday.key,
                selectedCast.map((m) => ({
                  role: m.role,
                  gender: (m as DreamCastMember).gender ?? null,
                })),
                Math.random,
                force_costume_keys
              )
            : null;
        if (costumePicks) fallbackReasons.push(costumeStamp(costumePicks));
        // Captured into a named var (not passed inline) so a later dual-swap
        // failure can rebuild a SOLO prompt for self from the very same input.
        // Looks path: the vibe fragment, blank axes, look-neutral framing, the rich brief and the FRAME ROLL
        // (frame:<surface>:<key> stamped). Null on the legacy path.
        const looksFields = looksPath
          ? looksSlotInputFields(
              { vibeFragment: looksVibeFragment, vibePosition: looksVibePosition },
              dualSpecialScene ? (dualSpecialLighting ?? null) : null,
              !force_plain_brief,
              selectedCast.length === 2 ? 'couple' : 'solo',
              Math.random,
              { timeAxis, weatherAxis, phenomenaAxis },
              swapGeometry,
              force_framing,
              force_photo_priors || LOOKS_PHOTO_PRIORS,
              {
                pct: LOOKS_FRAMING_PCT,
                model: looksModel,
                albumCouple: isFluxCoupleAlbum(
                  selectedCast.length === 2 ? 'couple' : 'solo',
                  looksModel
                ),
              }
            )
          : null;
        if (looksFields) fallbackReasons.push(looksFields.frameStamp, looksFields.framingStamp);
        if (looksFields && looksFields.anchorStanceKey)
          fallbackReasons.push(`anchor_stance:${looksFields.anchorStanceKey}`);
        if (looksFields && looksFields.coupleSceneAfterAction) {
          // The album skeleton carries no vibe fragment: the contract's honesty check and the retry ladder must
          // agree with the prompt (the vibe still shaped the brief through its directive).
          looksVibeFragment = null;
          looksVibePosition = null;
          if (activeStyle) activeStyle = { ...activeStyle, vibeFragment: null, vibePosition: null };
        }
        const slotInput: CharacterSlotPipelineInput = {
          cast: resolvedCast.map((rc, i) => ({
            role: rc.role,
            promptDesc: rc.promptDesc,
            age: (selectedCast[i] as DreamCastMember).age ?? null,
            physicalSummary: (selectedCast[i] as DreamCastMember).physical_summary ?? null,
            // Pass the explicit gender through so the slot pipeline locks the
            // body's sex to the cast photo (fixes male-face-on-female-body).
            gender: (selectedCast[i] as DreamCastMember).gender ?? null,
            // Broad race bucket → the slot pipeline's race anchor, so a location
            // prior ("set in china") can't override the cast's real race.
            ethnicity: (selectedCast[i] as DreamCastMember).ethnicity ?? null,
          })),
          // Special scene (goofy/elegant) overrides the location + swaps the biome
          // axes for a LIGHTING-quality axis (varies the look; a goofy/indoor scene
          // shouldn't fight "blizzard at midnight"). wardrobeAnchor: goofy → null
          // (normal clothes); elegant → the dressed-up attire; location → biome.
          iconicAnchor: dualSpecialScene ?? iconicAnchor,
          userPlace: dualSpecialScene ?? userPlace ?? null,
          // Scenario "set at" diet: full seed → Sonnet brief; only the SETTING
          // clause → the assembled prompt's early slot (camel-render fix).
          setAtOverride: dualSpecialScene ? settingClauseOf(dualSpecialScene) : null,
          // qa_blank_axes: the full looks path blanks these by design and lets the vibe own the atmosphere; on the
          // minimal path they survive, so a render can carry BOTH (e.g. "Rialto Bridge sunset — low sun
          // backlighting" AND an aurora fragment). This flag isolates which of the two is steering the render.
          timeAxis: qa_blank_axes ? '' : dualSpecialScene ? (dualSpecialLighting ?? '') : timeAxis,
          weatherAxis: qa_blank_axes || dualSpecialScene ? '' : weatherAxis,
          phenomenaAxis: qa_blank_axes || dualSpecialScene ? '' : phenomenaAxis,
          // On a REAL-WORLD location the biome's WARDROBE anchor is often the
          // traditional/national dress of that culture (China → hanfu/mandarin
          // jacket, Japan → kimono) — feeding it to Sonnet as "on-location attire"
          // dressed a white cast in ethnic dress so they READ as that ethnicity
          // (the race-swap bug). SUPPRESS the anchor on real-world locations
          // (imaginedLocation === false) so the generic contemporary-travel
          // guidance + traveler rule take over; KEEP it only for fantasy/imagined
          // dream worlds (elf robes, spacesuits belong there). The special-scene
          // wardrobe (goofy/elegant register) is location-independent → unaffected.
          wardrobeAnchor: dualSpecialScene
            ? dualSpecialWardrobe
            : imaginedLocation &&
                bespokeBiome &&
                Array.isArray(bespokeBiome.WARDROBE) &&
                bespokeBiome.WARDROBE.length > 0
              ? pickAxis(bespokeBiome.WARDROBE)
              : null,
          // Real-world → traveler wardrobe rule ON (no ethnic dress); fantasy/
          // imagined dream world → OFF (keep in-world attire). A SPECIAL SCENE
          // (goofy/elegant/active/holiday) replaces the location with an authored
          // scene + attire, so the rule must be OFF there too — with it on, Sonnet
          // was told "contemporary travel clothes" AND handed the seed's Victorian
          // bustle gown as mere "inspiration", and shipped a modern blazer
          // (2026-09-04 QA: victorian_f/victorian_m solos rendered modern; the
          // dual path keeps attire verbatim and was unaffected).
          realWorldLocation: dualSpecialScene ? false : !imaginedLocation,
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
          authorAction,
          dualStance: dualStance
            ? { seated: !!dualStance.seated, heightContrast: !!dualStance.heightContrast }
            : null,
          // Couple framing variance (2026-09-06): the closer waist-up two-shot at dual_closer_pct.
          dualComposition:
            selectedCast.length === 2 &&
            (force_dual_closer ||
              (sfaCfgCloser.dualCloserPct > 0 && Math.random() * 100 < sfaCfgCloser.dualCloserPct))
              ? (fallbackReasons.push('dual_comp:waist_up'), 'waist_up' as const)
              : null,
          femaleHairVariationPct: force_female_hair_pct ?? hairCfg.femaleHairVariationPct,
          // Couple prompt order (mig 470): QA flag wins, else engine_config.couple_prompt_style.
          //
          // DO NOT route flux couples to the LEGACY order here. It was tried on 2026-09-17 (looksCouplePromptStyle
          // applied under minimal) to give couples the album's environmental composition, and it was REVERTED the
          // same night on this measurement of flux-1.1-pro first-swap success:
          //     subject_first, previous 7 days   174 couples   56% first try   0 moved to gemini
          //     legacy, that night                24 couples    4% first try  19 moved to gemini
          // The wider framing shrinks the faces below what the dual split can separate, so nearly every couple
          // degraded — first to a gemini couple, and once the solo rung was fixed, to a single. Kevin, watching:
          // "now i'm just getting a bunch of single renders of myself". The composition ask is real; the lever for
          // it is the POSE pools (dual_stances / scenario actions), not the prompt order. See
          // memory: dual-framing-width-costs-identity, and __tests__/lib/looksMinimalInertFixGuard.test.ts.
          promptStyle:
            force_prompt_style ??
            (looksPath ? looksCouplePromptStyle(looksModel) : sfaCfgCloser.couplePromptStyle),
          // ALBUM RECIPE probe (2026-09-18): the album couples carried no eye colour at position 1.
          eyeLock: force_eye_lock ?? (isDualFaceSwap ? hairCfg.nightlyCoupleEyeLock : true),
          costumeLock: costumePicks ? costumePicks.map((p) => p.attire) : null,
          sceneRegister,
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
          ...(looksFields ?? {}),
          // Minimal carries the vibe fragment even though `looksFields` is null (that bundle is the full looks
          // path). Placed AFTER the spread so the looks path keeps owning these when it is the one running.
          ...(looksFields
            ? {}
            : {
                vibeFragment: looksVibeFragment,
                vibeFragmentPosition: looksVibePosition,
                // LOOK-NEUTRAL FRAMING ON SOLOS (2026-09-16). The legacy integration line says
                // "photograph" three times AFTER the look — "the clear subject of a candid cinematic
                // photograph", "a relaxed warm editorial photograph", "photographic realism, filmic
                // colour" — so a painted look is outnumbered 3:1 in its own prompt and flux obeys the
                // majority. `lookNeutralFraming` drops that prior and lets the look's own fragment own
                // the finish; it is set today only inside looksSlotInputFields, i.e. only on the FULL
                // looks path, which LOOKS_MINIMAL switches off. So the fix existed, was correct, and
                // shipped disabled — the same shape as the vibe fragment above.
                //
                // MEASURED on a pinned nightly_classical_oil, flux-1.1-pro, solo, 9 renders per arm:
                //   off (production today) → 2/9 rendered as an oil painting
                //   on                     → 7/9
                // Three other hypotheses were tested and rejected first: the flux-couple album skeleton
                // (inert under minimal), the atmospheric axes (within-arm variance exceeded the effect),
                // and the face-realism clause in the fragment (0/3 with it removed).
                //
                // ALL SURFACES, including couples — Kevin's call 2026-09-16 after seeing the couple run.
                // The couple data is real and it is a deliberate trade, not an oversight: with this on,
                // 5 of 9 couples degraded (vs a 26% production baseline over 97 couples) and two showed an
                // identity COLLAPSE on one side (0.006 and 0.04), because a painterly render is exactly what
                // the dual-swap detector cannot split. The photography prior was protecting the swap.
                //
                // He chose the look anyway: "i'd rather let it fall back to single. i hate that
                // pseudo-realistic oil painting look." That trade only works because the degrade is clean —
                // verified on all four degraded renders that the solo_rebuild KEEPS the look ("oil painting"
                // present) and carries ZERO photography-prior phrases. So a failed couple becomes a solo in
                // the right medium, not a photograph of one person.
                //
                // If couple degrades become a problem, this is the line to revert (back to
                // `selectedCast.length === 1`), NOT the vibe fix above.
                ...(qa_legacy_framing ? {} : { lookNeutralFraming: true }),
                // SOLO DISTANCE LINE IN THE ANCHOR (2026-09-17). The sixth fix found dead behind the dormant
                // path. Every solo prompt already carries its distance ("shown from the knees up in a
                // three-quarter length composition") — in the TAIL framing block, ~1,400 characters in, where
                // flux-1.1-pro ignores it: the round-16 fixed-seed probe found the same clause anywhere after
                // the identity block left every seed a waist-up portrait, and the SAME clause riding the anchor
                // before the face clause opened all three seeds to knees-up shots with the scene visible.
                // `framingInAnchor` is that move. It was set only in looksSlotInputFields, so the live path never
                // sent it and every solo — including every single rebuilt from a failed couple — shipped as a
                // headshot. Kevin, on three of them in a row: "another huge face from this batch, completely
                // boring, can't see any background". Solos only: solo identity held 0.6+ with wider framing in
                // every measured round, while on couples every widening lever breaks the dual split.
                ...(selectedCast.length === 1 && LOOKS_SOLO_FRAMING_IN_ANCHOR
                  ? { framingInAnchor: true }
                  : {}),
              }),
        };
        // Flux parity arm G: flux couples on the album skeleton render with the 1.2.0 flux override fragment.
        if (
          looksFields &&
          looksFields.coupleSceneAfterAction &&
          LOOKS_FLUX_COUPLE_OVERRIDE_LIBRARY &&
          !(force_honest_looks ?? engineCfg0.nightlyFluxCoupleHonestLooks) &&
          looksModel
        ) {
          const ov = pickFaceSwapModelOverride(looksModel, resolvedVibeKey ?? null);
          if (ov) {
            slotInput.mediumFluxFragment = ov;
            if (activeStyle) activeStyle = { ...activeStyle, fragment: ov };
            fallbackReasons.push('look_override_library:flux_couple');
          }
        }
        // Parity QA (COUPLE_PROMPT_PARITY_PLAN.md §2): a forced slot INPUT + forced Sonnet SLOTS make
        // the prompt a pure function of (input, slots, promptStyle) — the paired A/B differs only in order.
        // Phase A2: solos accept the same forced input + forced slots (force_single_slots), so a look
        // matrix renders the IDENTICAL scene for couple and solo — only the look fragment differs.
        const slotInputUsed: CharacterSlotPipelineInput =
          force_slot_input && (isDualFaceSwap || isSingleHumanFaceSwap)
            ? {
                ...force_slot_input,
                promptStyle:
                  force_prompt_style ??
                  (looksPath ? looksCouplePromptStyle(looksModel) : sfaCfgCloser.couplePromptStyle),
                eyeLock: force_eye_lock ?? (isDualFaceSwap ? hairCfg.nightlyCoupleEyeLock : true),
              }
            : slotInput;
        if (slotInputUsed !== slotInput) fallbackReasons.push('qa:force_slot_input');
        slotInputLogged = slotInputUsed;
        // Forensics: which couple prompt ORDER rendered this dream (COUPLE_PROMPT_PARITY_PLAN.md Phase C).
        if (isDualFaceSwap) {
          fallbackReasons.push(`couple_prompt_style:${slotInputUsed.promptStyle ?? 'legacy'}`);
        }
        const slotResult = await runCharacterSlotPipeline(
          slotInputUsed,
          ANTHROPIC_KEY,
          isDualFaceSwap ? force_dual_slots : (force_single_slots ?? null)
        );
        sonnetBrief = slotResult.briefUsed;
        sonnetRawResponse = slotResult.rawResponse;
        finalPrompt = slotResult.assembledPrompt;
        // Captured BEFORE any retry or degrade can overwrite finalPrompt (see the declaration).
        if (selectedCast.length === 2) couplePromptOriginal = slotResult.assembledPrompt;
        // FLUX COUPLE LAB (2026-09-18): the experimental couple composer replaces the assembled prompt when the
        // couple engine is 'experimental' (engine_config.nightly_couple_engine, or force_couple_engine in QA).
        // Production is the branch above, untouched.
        if (isDualFaceSwap && 'left_wardrobe' in slotResult.slots) {
          const coupleEngine = force_couple_engine ?? hairCfg.nightlyCoupleEngine;
          if (coupleEngine === 'experimental') {
            // Default = the lab's winner (R7/R8: 17/20 first-try holds on flux-1.1-pro, 20/20 on flux-2-flex).
            const variant = isCoupleVariant(force_couple_variant)
              ? force_couple_variant
              : 'narrative_fg';
            finalPrompt = composeExperimentalCouple({
              slots: slotResult.slots,
              input: slotInputUsed,
              variant,
            });
            couplePromptOriginal = finalPrompt;
            fallbackReasons.push(`couple_engine:experimental:${variant}`);
          } else {
            fallbackReasons.push('couple_engine:production');
          }
        }
        slotPipelineFallbacks = slotResult.fallbackReasons;
        slotPipelineHandled = true;
        castSlotsCtx = { slots: slotResult.slots, input: slotInputUsed };
        sceneActionText = slotResult.slots.action ?? null;
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
            input: slotInputUsed,
            selfIndex: selfIdx === 1 ? 1 : 0,
            realMediumFragment,
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
        : dualActiveScene || soloActiveScene
          ? 'active'
          : (dualSceneKind ?? (dualSpecialScene ? 'scenario' : 'location')),
      // The scenario seed text (truncated) — the per-seed identifier for grouping.
      scene: dualSpecialScene ? dualSpecialScene.slice(0, 160) : null,
      // The pose pool (the seed-pool-level pose identifier); the exact pose text
      // stays recoverable from enhanced_prompt + fallback_reasons.
      posePool: dualScenePosePool,
      sceneAction: sceneActionText,
      location: iconicAnchor ?? userPlace ?? null,
      biome: biomeKey,
      category: dualSceneCategory,
      subTheme: holidaySubTheme,
      placeKey: userPlace ?? null,
      castRole:
        selectedCast.length === 2
          ? 'dual'
          : selectedCast.length === 1
            ? selectedCast[0].role === 'plus_one'
              ? 'plus_one'
              : 'self'
            : null,
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
    //
    // RACE FIX (2026-09-01, RACE_FIDELITY_PLAN.md #2): ALL character renders (cast
    // face-swap, dual + single) skip the front-load too. Leading with a COUNTRY noun
    // ("set in china / japan / jamaica,") is a dominant first-noun ETHNICITY prior —
    // it renders the cast as LOCALS (Chinese/Japanese/etc.) regardless of their actual
    // race, and the swap then inherits the wrong-race body (sunnysteph's white +1
    // rendered East Asian in a China scene). The slot prompt already carries the
    // SPECIFIC spot ("Tianzifang shikumen alleyway art district") for scene fidelity —
    // a place name, far weaker as a race prior than the bare country noun.
    if (
      includeLocation &&
      effectiveUserPlace &&
      !isEmbodiedMedium &&
      resolvedComposition !== 'character' &&
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
  // QA (2026-09-07, model comparison): render an exact, pre-assembled prompt so every model sees
  // byte-identical input; everything downstream (sanitize, swap, identity gate) runs as normal.
  if (force_final_prompt) {
    finalPrompt = force_final_prompt;
    fallbackReasons.push('qa:force_final_prompt');
  }
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
      bans: nightlyBans,
    })
  );
  // Policy site: scene / pet base pick (surface 'scene').
  let sceneBaseModelResolved = sceneBaseModel;
  if (modelPolicy && !faceSwapPrePickedModel && !force_model) {
    const pick = resolveModel({
      surface: 'scene',
      attempt: 1,
      policy: modelPolicy,
      bans: nightlyBans,
    });
    if (policyMode === 'on') {
      fallbackReasons.push(pick.stamp);
      sceneBaseModelResolved = pick.model;
    }
  }
  if (looksPath && looksSceneModel && !force_model) sceneBaseModelResolved = looksSceneModel;
  let pickedModel = force_model
    ? force_model
    : faceSwapPrePickedModel || minimalModel || sceneBaseModelResolved;
  // Set when the couple-degrade solo rebuild renders on a different model (F2): the
  // shipped pixels came from THIS model, so ai_generation_log.model_used must say so.
  let modelUsedOverride: string | null = null;

  // Scene-composition model gate (mig 213). For pure_scene + epic_tiny, the
  // pickedModel is intersected with engine_config.scene_eligible_models.
  // The medium was already re-rolled to a scene-eligible one above, so its
  // allowed_models is the second constraint. If the intersection is empty
  // (shouldn't happen in normal config; safety net), fall through to the
  // original pickedModel. Skip when force_model is set so QA / testing
  // overrides still work.
  if (
    !force_model &&
    !minimalModel && // the looks contract already chose, from the SCENE policy row — do not re-pick over it
    policyMode !== 'on' && // policy 'on': the scene row IS the list (mig 468)
    !looksPath &&
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
        bans: nightlyBans,
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
  // MINIMAL (Kevin 2026-09-13): "if the looks system enables a model, then it should be enabled for this test."
  // The legacy nightly list bans gemini-2-image and grok (August, on cast-dream quality); the looks matrix then
  // graded 37 and 39 looks on them in September and he hearted those renders, and the looks path already lifts the
  // ban for its primaries. So the model the look was GRADED on wins here and the legacy ban gate stands aside.
  // Stamped, never silent. Without this every look falls back to the medium's inherited flux pin.
  if (minimalModel && effectiveBans.has(minimalModel))
    fallbackReasons.push(`minimal_model_unban:${minimalModel.split('/').pop()}`);
  if (
    !force_model &&
    !minimalModel &&
    policyMode !== 'on' &&
    !looksPath &&
    effectiveBans.has(pickedModel)
  ) {
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
  // Policy shadow: the scene / pet surface compared AFTER the scene gate + ban gate (the legacy model
  // that actually renders), against everything the scene row could draw.
  if (modelPolicy && !faceSwapPrePickedModel && !force_model) {
    fallbackReasons.push(
      shadowStampSet('scene_final', pickedModel, candidateModels(modelPolicy, 'scene', 1))
    );
  }
  // Per-medium pin override — last word on which model renders this nightly.
  // Runs after the ban gate so the pin can override any default pick. Skips
  // when force_model is set (QA wins).
  if (!force_model && !minimalModel && policyMode !== 'on' && !looksPath) {
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
  // NOTE: partnerId is deliberately NOT stamped here. It is the rotation's memory, so it must record
  // whether the +1 actually REACHED THE PIXELS — which is not known until after the swap. Stamped just
  // before the log insert instead. See there.

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
    if (slotInputLogged) observability.slotInput = slotInputLogged;
    // Only differs from enhanced_prompt when the couple failed and a rebuild replaced it — which is
    // exactly the case worth investigating.
    if (couplePromptOriginal) observability.couplePrompt = couplePromptOriginal;

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
    /** Which SOLO re-render attempt switches MODEL instead of re-rolling the same one.
     *  2 = the original render, one retry on the rolled model, then the OTHER model — the "try gemini before
     *  giving up on a face" rung (Kevin 2026-09-17). See the solo guard's rerender callback. */
    const SOLO_MODEL_MOVE_ATTEMPT = 2;

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
      // SECOND SIGNAL for the dual swap (2026-09-12, _shared/wardrobeSides.ts): which side wears the LEFT-locked
      // outfit, mapped through the cast genders — offered only when the slots and both genders are known (the
      // pipeline stamps side_check:none otherwise and keeps the single read). Mode: engine_config (mig 514).
      const sideWardrobes =
        castSlotsCtx && 'left_wardrobe' in castSlotsCtx.slots
          ? { a: castSlotsCtx.slots.left_wardrobe, b: castSlotsCtx.slots.right_wardrobe }
          : null;
      const sideG0 = asGender(s0.gender);
      const sideG1 = asGender(s1.gender);
      const sideGenders =
        sideG0 && sideG1 && sideG0 !== sideG1 ? { left: sideG0, right: sideG1 } : null;
      const confirmSides =
        sideWardrobes && sideGenders
          ? async (target: string) => {
              const r = await classifyWardrobeSides(
                target,
                sideWardrobes.a,
                sideWardrobes.b,
                REPLICATE_TOKEN
              );
              return r.aSide ? sidesToGenders(r.aSide, sideGenders.left, sideGenders.right) : null;
            }
          : undefined;
      const result = await genderSafeDualSwap(
        tempUrl,
        {
          dispatchDual: async (target, genderOverride) =>
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
              genderOverride ?? null,
              qa_big_face_max_hfrac ?? (await fetchEngineConfig(supabase)).dualBigFaceMaxHFrac
            ),
          confirmGenders: async (target) => {
            const r = await classifyDualGenders(target, REPLICATE_TOKEN);
            return { left: r.left, right: r.right, faceCount: r.faceCount };
          },
          ...(confirmSides ? { confirmSides } : {}),
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
            // NEVER FACELESS (HOLIDAY_DAY_OF_PLAN.md §3.4, 2026-09-07): the guard may re-render the
            // solo rebuild TWICE — attempt 1 on the configured rebuild model, attempt 2 on a DIFFERENT
            // model (soloRebuildModelFor) — before the cascade is allowed to fall to a pure scene.
            // 2 of 6 hero QA renders shipped with no people when a single flex rebuild drew two faces.
            let rebuildAttempt = 0;
            const guard = await ensureSoloSwapTarget(
              target,
              {
                castGender: selfGender,
                replicateToken: REPLICATE_TOKEN,
                rerender: async () => {
                  rebuildAttempt += 1;
                  // Rebuild a GENUINE solo prompt for self (partner dropped) from
                  // the dual's own slots. This replaces the old couple-prompt +
                  // "exactly one person" prefix, which kept rendering two people
                  // (the prefix can't override a couple prompt's L/R body) → the
                  // guard saw a wrong-gender partner face and refused → faceless.
                  // Falls back to the legacy prefix only on the freeform-brief
                  // path (soloFallbackCtx null). (root-caused 2026-08-27)
                  // F2 (NIGHTLY_NO_PLAIN_RENDERS_PLAN.md, 2026-09-06): the rebuild used to carry the
                  // flux-1.1-pro OVERRIDE fragment ("painterly realism") and render on the couple's
                  // model — the audit's tightest combination (63% tight crops, 3 of the 4 true
                  // headshots in 520 renders). It now renders the REAL medium fragment on the solo
                  // rebuild model (engine_config.solo_rebuild_model, default flux-2-flex: 0% tight
                  // in the same audit, faithful to real fragments). '' → the couple's model.
                  const rebuildCfg = await fetchEngineConfig(supabase);
                  let rebuildModel = rebuildCfg.soloRebuildModel || pickedModel;
                  // Policy site: solo rebuild (mig 468).
                  if (modelPolicy) {
                    const pick = resolveModel({
                      surface: 'solo_rebuild',
                      attempt: 1,
                      policy: modelPolicy,
                      bans: nightlyBans,
                    });
                    fallbackReasons.push(
                      shadowStampSet(
                        'solo_rebuild',
                        rebuildModel,
                        candidateModels(modelPolicy, 'solo_rebuild', 1)
                      )
                    );
                    if (policyMode === 'on') {
                      fallbackReasons.push(pick.stamp);
                      rebuildModel = pick.model;
                    }
                  }
                  // Attempt 2+ switches to a model that differs from attempt 1 (never faceless).
                  let rebuildFragment = soloFallbackCtx ? soloFallbackCtx.realMediumFragment : '';
                  // THE REBUILD MODEL (fixed 2026-09-17). This was gated on `styleContract && activeStyle`,
                  // and `activeStyle` is assigned ONLY inside the full-looks branch that LOOKS_MINIMAL switches
                  // off — while `styleContract` IS set under minimal. So in production the block never ran,
                  // forRebuild() never got a say, and the rebuild fell back to engine_config.solo_rebuild_model.
                  // That is how a failed FLUX couple came back as a flux-2-flex single: Kevin, watching a batch,
                  // "it should still use flux 1.1pro on the single re-try after the couple fails".
                  //
                  // forRebuild() prefers the SOLO primary and drops any model the look is rejected on for solo,
                  // which is the rule that was wanted all along — a config default cannot express "unless the
                  // look is rejected there". Fourth fix found inert behind the dormant path; see
                  // __tests__/lib/looksMinimalInertFixGuard.test.ts.
                  //
                  // The MODEL is taken on both paths. The LOOK is not: minimal builds its contract with
                  // lockLook: true so the stamps and the pixels agree, so only the full path may re-pick it.
                  if (styleContract) {
                    const pick = styleContract.forRebuild();
                    rebuildModel = pick.model;
                    if (activeStyle) {
                      rebuildFragment = pick.fragment;
                      activeStyle = {
                        ...activeStyle,
                        model: pick.model,
                        lookKey: pick.look.key,
                        fragment: pick.fragment,
                      };
                      if (pick.look.key !== resolvedMediumKey) resolvedMediumKey = pick.look.key;
                      fallbackReasons.push(...pick.stamps);
                    } else {
                      fallbackReasons.push(`solo_rebuild_model:${rebuildModel.split('/').pop()}`);
                    }
                  }
                  if (rebuildAttempt >= 2) {
                    const retryModel = soloRebuildModelFor({
                      attempt: rebuildAttempt,
                      configuredModel: rebuildModel,
                      coupleModel: pickedModel,
                      fallbacks: modelPolicy
                        ? candidateModels(modelPolicy, 'solo_rebuild', 2, rebuildModel)
                        : null,
                    });
                    fallbackReasons.push(
                      `solo_rebuild_retry:${rebuildAttempt}:${retryModel.replace(/^.*\//, '')}`
                    );
                    rebuildModel = retryModel;
                  }
                  if (soloFallbackCtx && rebuildModel !== pickedModel)
                    modelUsedOverride = rebuildModel;
                  const soloPrompt = soloFallbackCtx
                    ? assembleSoloFallbackFromDual(
                        soloFallbackCtx.dualSlots,
                        soloRebuildInput(soloFallbackCtx.input, rebuildFragment),
                        soloFallbackCtx.selfIndex
                      )
                    : `exactly one person, a solo portrait of a single ${soloNoun} alone, ${finalPrompt}`;
                  fallbackReasons.push(
                    soloFallbackCtx
                      ? `solo_fallback:rebuilt_solo:${rebuildModel.replace(/^.*\//, '')}`
                      : 'solo_fallback:legacy_prefix'
                  );
                  if (styleContract && soloFallbackCtx) finalPrompt = soloPrompt; // honesty: persist what rendered
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
                    soloFallbackCtx ? rebuildModel : pickedModel,
                    'png'
                  );
                  observability.replicateRawUrl = rr.url;
                  observability.replicatePredictionId = rr.predictionId;
                  return { url: rr.url, predictionId: rr.predictionId };
                },
                log: (m) => console.log(`[nightly-dreams] degrade-guard: ${m}`),
              },
              {
                /**
                 * A FAILED COUPLE GOES STRAIGHT TO A SOLO (Kevin, 2026-09-16: "shift the fallback from a
                 * failed couples render directly to a single, not a couple on a different model").
                 *
                 * This was 2 — attempt 1 on the configured model, attempt 2 on a DIFFERENT one, because on
                 * 2026-09-13 the call was "allow the move" rather than degrade. Reversed: each re-render
                 * calls styleContract.forAttempt(), which walks the model chain, so a couple that failed on
                 * its rolled model was being re-rendered on another one — two extra renders of latency and
                 * cost to ship a couple in a model the look was not chosen for.
                 *
                 * 1 = probe the failed couple, then RE-RENDER A GENUINE SOLO and probe that.
                 *
                 * IT WAS 0, AND THAT MADE THE WHOLE SOLO RUNG DEAD CODE (found 2026-09-17, Kevin watching a
                 * batch live: "it's supposed to fail back to a single on flux"). With 0 the loop in
                 * ensureSoloSwapTarget runs exactly once, on attempt 0 — and attempt 0 probes the COUPLE
                 * render that just failed. That image still has two people in it, so the probe reads
                 * `solo_multi_face(faces=2)`, the guard returns safe:false, and the `rerender` callback
                 * directly above — the one that calls assembleSoloFallbackFromDual to build a real single
                 * from the cast — is NEVER INVOKED. It cannot succeed by construction.
                 *
                 * Measured on 5 consecutive organic couples: every one stamped
                 *   dual_degrade_single:attempt1 → degrade_solo_multi_face(faces=2) → degrade_solo_swap_unsafe
                 *   → dual_degrade_single:attempt1_refused_gender → policy:couple:2:gemini-2-image:chain_2of2
                 * i.e. the ladder read "couple on flux → a solo attempt that always refuses → couple on
                 * gemini". The comment block below claimed the opposite and had done since 2026-09-16.
                 *
                 * The +1 is still dropped deliberately; this only makes the drop actually happen on the
                 * rebuilt single instead of falling through to a couple on another model.
                 */
                maxRerenders: 1,
                mediumKey: resolvedMediumKey,
                // FULL render deadline + a SHORT reserve: this is the last-resort
                // solo fallback, guaranteed its reserved window by the shortened
                // dual phase above — it must fire, not settle to a scene.
                deadlineMs: renderDeadlineMs,
                recoverBudgetMs: SOLO_RECOVER_MS,
                maxFaceHFrac: (await fetchEngineConfig(supabase)).nightlyMaxFaceHFrac,
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
            // Policy site: couple attempt ≥ 2 (mig 468) — a random FALLBACK when the row has one, else
            // the same model again (legacy). NOTE: model_used attribution for a retry that shipped on a
            // different model lands with the fallback rows (Phase 4, NIGHTLY_MODEL_POLICY_PLAN.md).
            let rerenderModel = pickedModel;
            // CHAIN (Kevin 2026-09-18, NIGHTLY_CHAIN_V2_DESIGN.md): a failed couple moves to the NEXT model at
            // once, never the model that just failed. The 09-17 "flux couple again" rung re-rendered the same
            // scene on the model that had just failed and burned the budget the later rungs needed: 2 faceless
            // dreams in 20 (chain6 #19/#20). The pipeline counts re-renders from 1 while the contract counts
            // RENDERS from 1, so the first re-render asks the contract for render 2.
            const chainAttempt = attempt + 1;
            if (styleContract && activeStyle) {
              const pick = styleContract.forAttempt(chainAttempt);
              // Round 19: a model move across the flux ↔ others order boundary re-assembles the slots in the new
              // model's order (r18 #5/#7 rendered grok in the legacy order and both needed a re-render).
              const experimental = fallbackReasons.some((r) =>
                /^couple_engine:experimental:/.test(String(r))
              );
              const reordered =
                looksPath && castSlotsCtx && !experimental
                  ? reassembleForModel(castSlotsCtx.slots, castSlotsCtx.input, pick)
                  : null;
              if (reordered && castSlotsCtx) {
                finalPrompt = reordered.prompt;
                castSlotsCtx = { slots: castSlotsCtx.slots, input: reordered.input };
                activeStyle = {
                  ...activeStyle,
                  model: pick.model,
                  lookKey: pick.look.key,
                  fragment: pick.fragment,
                };
                fallbackReasons.push(...pick.stamps, ...reordered.stamps);
              } else {
                const r = retryPromptFor(finalPrompt, activeStyle, pick);
                finalPrompt = r.prompt;
                activeStyle = r.active;
                fallbackReasons.push(...r.stamps);
              }
              rerenderModel = pick.model;
              if (pick.model !== pickedModel) modelUsedOverride = pick.model;
              if (pick.look.key !== resolvedMediumKey) resolvedMediumKey = pick.look.key;
              if (attempt >= 2 && castSlotsCtx) {
                const soft = afterScenePrompt(castSlotsCtx.slots, {
                  ...castSlotsCtx.input,
                  mediumFluxFragment: activeStyle.fragment,
                });
                if (soft) {
                  finalPrompt = soft;
                  activeStyle = { ...activeStyle, vibePosition: 'after_scene' };
                  fallbackReasons.push('vibe_retry:after_scene');
                }
              }
            } else if (looksMinimal && styleContract) {
              // Kevin 2026-09-13 "allow the move": keep the look, re-render on another model IT is graded on
              // rather than letting 1.2.0 drop the +1 to a generic figure. The look is unchanged, so the legacy
              // prompt still describes the right medium and needs no surgery.
              const pick = styleContract.forAttempt(chainAttempt);
              rerenderModel = pick.model;
              if (pick.model !== pickedModel) modelUsedOverride = pick.model;
              fallbackReasons.push(...pick.stamps);
            } else if (modelPolicy) {
              const pick = resolveModel({
                surface: 'couple',
                attempt: chainAttempt,
                policy: modelPolicy,
                bans: nightlyBans,
                previousModel: pickedModel,
              });
              fallbackReasons.push(
                shadowStampSet(
                  'couple_retry',
                  pickedModel,
                  candidateModels(modelPolicy, 'couple', chainAttempt, pickedModel)
                )
              );
              if (policyMode === 'on') {
                fallbackReasons.push(pick.stamp);
                rerenderModel = pick.model;
              }
            }
            // NATURAL → STRICT geometry on the re-render (2026-09-12): a natural first render that broke the
            // split is retried with the proven strict anchor + the pool pose (same scene / wardrobe / props), so
            // the relaxed language costs one retry, never the partner. The strict ctx is carried forward so the
            // attempt-2 after-scene re-assembly above stays strict too.
            if (castSlotsCtx && castSlotsCtx.input.swapGeometry === 'natural') {
              const strict = strictRetryPrompt(castSlotsCtx.slots, {
                ...castSlotsCtx.input,
                mediumFluxFragment: activeStyle
                  ? activeStyle.fragment
                  : castSlotsCtx.input.mediumFluxFragment,
              });
              if (strict) {
                finalPrompt = strict.prompt;
                castSlotsCtx = { slots: strict.slots, input: strict.input };
                fallbackReasons.push(`swap_geometry_retry:strict:${attempt}`);
              }
            }
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
              rerenderModel,
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
          // ONE re-render (NIGHTLY_CHAIN_V2_DESIGN.md): couple on the rolled model → couple on the next model
          // → the single → a pure scene. No reuse-single between attempts: every rung is a fresh render.
          maxRerenders: 1,
          // COMPOSITION GATE (engine_config.nightly_max_face_hfrac): no couple ships with a face taller than this.
          maxFaceHFrac:
            qa_max_face_hfrac ?? (await fetchEngineConfig(supabase)).nightlyMaxFaceHFrac,
          deadlineMs: dualDeadlineMs,
          recoverBudgetMs: DUAL_RECOVER_MS,
          // Live-tunable wrong-person floor (engine_config, audit L3; cached fetch).
          identityDegradeFloor: (await fetchEngineConfig(supabase)).identityDegradeFloor,
          sideCheckMode: sideCheckModeOf((await fetchEngineConfig(supabase)).dualSideCheckMode),
          // Parity loop round 7: the looks path never ships a couple below 0.5 likeness without a re-render try.
          ...(looksPath ? { identityMinSim: LOOKS_DUAL_IDENTITY_MIN } : {}),
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
          rerender: async (attempt: number) => {
            /**
             * THE GEMINI RUNG FOR SOLOS (Kevin 2026-09-17): a solo that the guard cannot make safe used to
             * go straight to a faceless pure scene — it never tried another model at all. Now the FINAL
             * re-render moves to the next model in the style contract's chain:
             *
             *   solo on the rolled model → re-render on it → re-render on the NEXT model → pure scene
             *
             * Same shape as the couple ladder, one rung shorter because a solo has no couple stage.
             */
            let soloModel = pickedModel;
            if (attempt >= SOLO_MODEL_MOVE_ATTEMPT && styleContract) {
              const pick = styleContract.forAttempt(2);
              if (pick.model && pick.model !== pickedModel) {
                soloModel = pick.model;
                modelUsedOverride = pick.model;
                fallbackReasons.push(`solo_model_move:${pick.model.replace(/^.*\//, '')}`);
              }
            }
            // Front-load the person count on the retry — re-rolling the identical
            // prompt mostly re-renders the same invented couple (see the
            // generate-dream twin). Subject-count only, never the scene.
            const soloNoun =
              faceSwapGender === 'female' ? 'woman' : faceSwapGender === 'male' ? 'man' : 'person';
            if (styleContract && activeStyle && castSlotsCtx) {
              const soft = afterScenePrompt(castSlotsCtx.slots, {
                ...castSlotsCtx.input,
                mediumFluxFragment: activeStyle.fragment,
              });
              if (soft) {
                finalPrompt = soft;
                activeStyle = { ...activeStyle, vibePosition: 'after_scene' };
                fallbackReasons.push('vibe_retry:after_scene');
              }
            }
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
        {
          deadlineMs: t0 + 140_000,
          mediumKey: resolvedMediumKey,
          maxFaceHFrac: (await fetchEngineConfig(supabase)).nightlyMaxFaceHFrac,
        }
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
          // Looks path (parity loop round 3): a higher solo likeness bar — the same one-shot re-swap, just
          // triggered earlier, so a 0.48 chromolithograph likeness gets a second try before it ships.
          const soloThr = looksPath
            ? Math.max(soloIdentityThreshold() ?? 0, LOOKS_SOLO_IDENTITY_MIN)
            : soloIdentityThreshold();
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
    // THE "FLUX SINGLE AGAIN → GEMINI SINGLE" RUNGS FOR A BELOW-FLOOR SOLO (Kevin's frozen chain, 2026-09-17):
    //     flux single → flux single again → gemini single → nobody
    // A solo whose swap scored below the identity floor gets a FRESH render — a re-swap on the same render
    // cannot help when flux drew the person as a statue (bf50 #2: a tower with carved stone heads, identity
    // -0.03) — first on the rolled model, then on the next model in the style contract's chain, each through
    // the gender-safe guard + swap + identity read, before the pure-scene fallback. This block existed since
    // parity round 10 but was gated on the looks-path flag, which is always false under LOOKS_MINIMAL: the seventh fix
    // found dead in that graveyard (__tests__/lib/looksMinimalInertFixGuard.test.ts locks the un-gating).
    if (
      swapUnusable &&
      !strict_face_swap &&
      faceSwapSource &&
      !(faceSwapSources && faceSwapSources.length === 2)
    ) {
      const soloNoun =
        faceSwapGender === 'female' ? 'woman' : faceSwapGender === 'male' ? 'man' : 'person';
      for (let rung = 1; rung <= 2 && swapUnusable; rung++) {
        if (Date.now() - t0 > (rung === 1 ? 80_000 : 100_000)) {
          fallbackReasons.push(`solo_floor_rerender_skipped_deadline:${rung}`);
          break;
        }
        let model = pickedModel;
        if (rung === 2) {
          const pick = styleContract ? styleContract.forAttempt(2) : null;
          if (!pick || !pick.model || pick.model === pickedModel) {
            fallbackReasons.push('solo_floor_rerender_no_next_model');
            break;
          }
          model = pick.model;
        }
        try {
          fallbackReasons.push(`solo_floor_rerender:${rung}:${model.replace(/^.*\//, '')}`);
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
            model,
            'png'
          );
          const guard2 = await ensureSoloSwapTarget(
            rr.url,
            {
              castGender: faceSwapGender,
              replicateToken: REPLICATE_TOKEN,
              rerender: async () => ({ url: rr.url, predictionId: rr.predictionId }),
              log: (m) => console.log(`[nightly-dreams] ${m}`),
            },
            {
              maxRerenders: 0,
              deadlineMs: t0 + 140_000,
              mediumKey: resolvedMediumKey,
              maxFaceHFrac: (await fetchEngineConfig(supabase)).nightlyMaxFaceHFrac,
            }
          );
          if (!guard2.safe) {
            fallbackReasons.push(`solo_floor_rerender_unsafe:${rung}`);
            continue;
          }
          const swapped = await faceSwap(
            faceSwapSource,
            guard2.url,
            REPLICATE_TOKEN,
            supabase,
            userId,
            {
              retry: false,
            }
          );
          const v = await verifySoloIdentity(swapped, faceSwapSource);
          if (v && v.sim >= 0.35) {
            tempUrl = swapped;
            replicatePredictionId = rr.predictionId;
            observability.replicateRawUrl = rr.url;
            observability.replicatePredictionId = rr.predictionId;
            if (model !== pickedModel) {
              modelUsedOverride = model;
              fallbackReasons.push(`solo_model_move:${model.replace(/^.*\//, '')}`);
            }
            swapUnusable = false;
            logAxes.faceSwapResult = 'single-fallback-success';
            fallbackReasons.push(`solo_floor_rerender_ok:${rung}:${v.sim}`);
          } else fallbackReasons.push(`solo_floor_rerender_low:${rung}:${v ? v.sim : 'null'}`);
        } catch (e) {
          fallbackReasons.push(
            `solo_floor_rerender_failed:${rung}:${(e as Error).message.slice(0, 60)}`
          );
        }
      }
    }

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
          let sceneUrl = scene.url;
          let scenePred = scene.predictionId;
          // 2026-09-05: the fallback skips the cast gate (nothing to swap), so it
          // gets its own ONE-question check — an "empty" scene that renders
          // people is exactly the "strangers shipped" failure (two women in
          // profile, 2026-09-04). One people-free re-render, then ship the best.
          const pv = await assessSceneFallbackPeople(sceneUrl);
          if (pv && !pv.pass) {
            fallbackReasons.push('pure_scene_fallback:people');
            if (Date.now() - t0 < 110_000) {
              try {
                const scene2 = await generateImage(
                  'flux-dev',
                  `${sceneFallbackPrompt}, completely empty of people, not a single human figure anywhere`,
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
                const pv2 = await assessSceneFallbackPeople(scene2.url);
                if (!pv2 || pv2.pass) {
                  sceneUrl = scene2.url;
                  scenePred = scene2.predictionId;
                  fallbackReasons.push('pure_scene_fallback:people_cleared');
                } else fallbackReasons.push('pure_scene_fallback:people_unresolved');
              } catch (e2) {
                fallbackReasons.push(
                  `pure_scene_fallback:people_rerender_failed:${(e2 as Error).message.slice(0, 60)}`
                );
              }
            } else fallbackReasons.push('pure_scene_fallback:people_skipped_deadline');
          }
          tempUrl = sceneUrl;
          if (scenePred) replicatePredictionId = scenePred;
          sceneFallbackApplied = true;
          logAxes.faceSwapResult = 'pure-scene-fallback'; // → face_swap_mode = null
          fallbackReasons.push('pure_scene_fallback');
          // Loud, counted by the day-of monitor (HOLIDAY_DAY_OF_PLAN.md R7): a CAST dream shipped
          // with nobody in it. Never silent.
          fallbackReasons.push('SHIPPED_FACELESS');
          console.warn('[nightly-dreams] SHIPPED_FACELESS — cast dream shipped as a pure scene');
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
        // NO PIXELS IN THE ISOLATE (NO_PIXELS_IN_ISOLATE_PLAN.md, phase 1). The perceptual hash comes from
        // the Fly image-ops service in hash mode — nothing written, ~1 s — so this isolate never decodes the
        // render: that decode (up to three times on dup retries) was the isolate's CPU on this path.
        // FAIL-OPEN: any failure runs the in-isolate decode below and stamps why, so a dream never fails
        // because a faster way to hash it was added.
        let hashedOnFly = false;
        if (imageOpsEnabled()) {
          const h = await persistViaFly({
            sourceUrl: tempUrl,
            userId,
            mode: 'hash',
            traceId: queueJobId ?? undefined,
          });
          fallbackReasons.push(h.stamp.replace('image_ops:', 'image_ops_hash:'));
          if (h.ok && h.result.ahash) {
            outPhash = h.result.ahash;
            outBuf = null;
            decodedOut = null;
            hashedOnFly = true;
          }
        }
        if (!hashedOnFly) {
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
        }
        // No hash from either path → nothing to compare; ship as-is (the old decode-failure behaviour).
        if (!outPhash) break;
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
              queueJobId,
              null,
              qa_big_face_max_hfrac ?? (await fetchEngineConfig(supabase)).dualBigFaceMaxHFrac
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

    // ── Render QUALITY GATE (NIGHTLY_IMPRESS_PLAN §1 — LIVE 2026-09-03) ──
    // BROKEN-only Sonnet vision check of the final output (pixel-corrupted
    // face, accessory fused across person+animal, extra/duplicated anatomy —
    // NOTHING else; taste is out of scope by contract, giant creatures
    // whitelisted; calibrated 0/30 false positives on the labeled corpus, see
    // _shared/qualityGate.ts + scripts/eval-quality-gate.ts). Modes via
    // engine_config.quality_gate_mode: off | shadow (telemetry only) |
    // enforce (fail → deadline-guarded retries, re-gate, ship first pass;
    // exhausted → ship the ORIGINAL output + 'unresolved' telemetry — a flagged
    // dream beats no dream). Retry KIND follows the flag: 'broken' → re-SWAP on
    // the same base render (yan-ops canned-output escape, reuses the dup-detect
    // machinery); 'profile' (2026-09-04, Kevin: "no side profiles") → a fresh
    // RENDER + swap, because the base image itself is side-on and no swap can
    // fix that.
    // FAIL-OPEN on judge errors. Cast renders only (pure scenes can't have
    // the defect class).
    if ((faceSwapSource || faceSwapSources) && !sceneFallbackApplied) {
      try {
        const gateCfg = await fetchEngineConfig(supabase);
        const gateMode = gateCfg.qualityGateMode;
        if (gateMode === 'shadow' || gateMode === 'enforce') {
          const GATE_MAX_ELAPSED_MS = 100_000;
          const firstUrl = tempUrl;
          let verdict = await assessRenderQuality(tempUrl);
          if (verdict === null) fallbackReasons.push('quality_gate:error');
          else if (verdict.pass) fallbackReasons.push(`quality_gate:${gateMode}:pass`);
          else {
            fallbackReasons.push(`quality_gate:${gateMode}:fail:${verdict.flags.join('+')}`);
            if (gateMode === 'enforce') {
              let cleared = false;
              // The base render the retries swap onto; replaced by a fresh
              // generation when the verdict is 'profile'.
              let gateBase = genResult.url;
              for (let ga = 0; ga < gateCfg.qualityGateMaxRetries; ga++) {
                if (Date.now() - t0 > GATE_MAX_ELAPSED_MS) {
                  fallbackReasons.push('quality_gate:skipped_deadline');
                  break;
                }
                try {
                  const needsRerender = verdict.flags.includes('profile');
                  if (needsRerender && faceSwapSources && faceSwapSources.length === 2) {
                    // DUAL + profile: NO retry (hotfix 2026-09-04). The retry
                    // path below runs a bare dispatch with none of the main
                    // path's verification (genderSafeDualSwap: split check,
                    // identity gate, gender-safe degrade) — a re-rendered couple
                    // whose heads overlapped came back with swappedUrl null and
                    // the unswapped base SHIPPED (Kevin's hearted canyon render:
                    // "the face isn't my wife"). Until the retry reuses the
                    // verified pipeline, a verified profile swap beats strangers.
                    fallbackReasons.push('quality_gate:profile_dual_noretry');
                    break;
                  }
                  if (needsRerender) {
                    const rr = await generateImage(
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
                      isDualFaceSwap ? 'jpg' : 'png'
                    );
                    gateBase = rr.url;
                    replicatePredictionId = rr.predictionId;
                    observability.replicateRawUrl = rr.url;
                    fallbackReasons.push(`quality_gate:rerender:${ga + 1}`);
                  }
                  if (faceSwapSources && faceSwapSources.length === 2) {
                    const r = await dispatchDualFaceSwap(
                      faceSwapSources[0].sourceUrl,
                      faceSwapSources[1].sourceUrl,
                      gateBase,
                      REPLICATE_TOKEN,
                      supabase,
                      userId,
                      t0 + 140_000,
                      !needsRerender, // skipPrimary only for the canned-output (broken) escape
                      { left: faceSwapSources[0].gender, right: faceSwapSources[1].gender },
                      queueJobId,
                      null,
                      qa_big_face_max_hfrac ??
                        (await fetchEngineConfig(supabase)).dualBigFaceMaxHFrac
                    );
                    // A gate re-swap is a BARE dispatch — it must pass the same
                    // identity bar as the main pipeline or it is a failed attempt.
                    // 2026-09-04 (Kevin's hearted cozy_porch couple): the pipeline
                    // had correctly degraded to a SOLO of self, the gate flagged
                    // that solo 'broken', and this re-swap on the ORIGINAL couple
                    // base shipped an unverified swap — a stranger as the wife.
                    const dualThr = identityThreshold();
                    const idL = r.identity ? r.identity.left : null;
                    const idR = r.identity ? r.identity.right : null;
                    const verified =
                      !!r.swappedUrl &&
                      (dualThr === null ||
                        (idL !== null && idR !== null && idL >= dualThr && idR >= dualThr));
                    if (verified) {
                      tempUrl = r.swappedUrl as string;
                      fallbackReasons.push(`quality_gate:reswap_identity:L${idL}/R${idR}`);
                    } else {
                      fallbackReasons.push(
                        `quality_gate:reswap_rejected:${r.swappedUrl ? `L${idL}/R${idR}` : 'no_split'}`
                      );
                      break; // ship the pipeline's own verdict (firstUrl), never an unverified swap
                    }
                  } else if (faceSwapSource) {
                    const candidate = await faceSwap(
                      faceSwapSource,
                      gateBase,
                      REPLICATE_TOKEN,
                      supabase,
                      userId,
                      {
                        skipPrimary: !needsRerender,
                      }
                    );
                    if (needsRerender) {
                      // A fresh render + swap skipped the main path's solo
                      // identity gate — apply it here; a weak likeness is a
                      // failed attempt, never a shipped one.
                      const soloThr = soloIdentityThreshold();
                      const v =
                        soloThr !== null
                          ? await verifySoloIdentity(candidate, faceSwapSource)
                          : null;
                      if (v && soloThr !== null && v.sim < soloThr) {
                        fallbackReasons.push(`quality_gate:rerender_identity_reject:${v.sim}`);
                        continue;
                      }
                      if (v) fallbackReasons.push(`quality_gate:rerender_identity:${v.sim}`);
                    }
                    tempUrl = candidate;
                  }
                } catch (e) {
                  fallbackReasons.push(
                    `quality_gate:retry_error:${(e as Error).message.slice(0, 60)}`
                  );
                  break;
                }
                verdict = await assessRenderQuality(tempUrl);
                if (verdict === null || verdict.pass) {
                  cleared = true;
                  fallbackReasons.push(`quality_gate:cleared_after:${ga + 1}`);
                  break;
                }
              }
              if (!cleared && verdict && !verdict.pass) {
                // Ship the ORIGINAL first output (what would have shipped
                // pre-gate) — never a worse retry, never nothing.
                tempUrl = firstUrl;
                fallbackReasons.push('quality_gate:shipped_unresolved');
              }
              if (tempUrl !== firstUrl) {
                // Buffers/hashes belong to the pre-retry output — drop them so
                // persist + thumbhash re-derive from the new tempUrl.
                outBuf = null;
                decodedOut = null;
              }
            }
          }
        }
      } catch (_e) {
        fallbackReasons.push('quality_gate:error');
      }
    }

    // Stage breadcrumb — storage upload + persist.
    markStage(supabase, queueJobId, 'upload', pickedModel);

    // Persist to Storage + log in parallel
    timings.total = Date.now() - t0;
    // Pre-generated log-row id so upload_id can be backfilled onto exactly
    // this row once the uploads insert returns (audit find: upload_id was
    // never set — forensics couldn't join log ↔ upload on job-less renders).
    if (activeStyle)
      fallbackReasons.push(
        ...assertStyleHonesty(finalPrompt, modelUsedOverride ?? pickedModel, activeStyle)
      );
    /**
     * THE +1 ROTATION'S MEMORY (2026-09-16). `rolled_axes.partnerId` is both the OUTPUT of tonight's roll
     * and the INPUT to tomorrow's recency window, so stamping it means "this person has had their turn".
     *
     * It used to be stamped right after the model pick — before the composition was decided and long before
     * the swap ran — so a turn was consumed by nights where the +1 never appeared at all:
     *   • a SOLO night (the roll runs whenever the user has a roster, before couple-vs-solo is chosen), and
     *   • a couple that DEGRADED to a solo, which is 21% of production couples.
     * On a roster of 5 with solo-heavy nights, someone's turn could be spent on a dream they were not in,
     * and they would wait another full cycle. Nobody would see a bug — just a +1 who "never shows up".
     *
     * So the turn is now recorded only when the partner actually rendered: a dual or a plus-one-solo that
     * did NOT degrade. Anything else leaves the rotation untouched and that person stays next in line.
     */
    const plusOneReachedPixels =
      (logAxes.dreamType === 'face_swap_dual' || logAxes.dreamType === 'face_swap_plus_one') &&
      !fallbackReasons.some((r) =>
        /dual_degrade_single|degrade_solo_multi_face|solo_rebuild/.test(String(r))
      );
    if (rolledPartnerId && plusOneReachedPixels) logAxes.partnerId = rolledPartnerId;
    else if (rolledPartnerId) fallbackReasons.push('partner_turn_not_consumed');

    const genLogId = crypto.randomUUID();
    // NO PIXELS IN THE ISOLATE, phase 1: original + display JPEG + thumbhash in ONE Fly call, awaited
    // BEFORE the generation log so its stamp lands in fallback_reasons. FAIL-OPEN to the in-isolate path.
    let flyPersisted: { url: string; displayUrl: string | null; thumbhash: string | null } | null =
      null;
    if (imageOpsEnabled()) {
      const p = await persistViaFly({
        sourceUrl: tempUrl,
        userId,
        mode: 'final',
        traceId: queueJobId ?? undefined,
      });
      fallbackReasons.push(p.stamp);
      if (p.ok && p.result.url)
        flyPersisted = {
          url: p.result.url,
          displayUrl: p.result.displayUrl,
          thumbhash: p.result.thumbhash,
        };
    }
    const persistPromise = flyPersisted
      ? Promise.resolve(flyPersisted.url)
      : outBuf
        ? persistBufferToStorage(outBuf, userId, supabase)
        : persistToStorage(tempUrl, userId, supabase);
    const [persistedUrl] = await Promise.all([
      persistPromise,
      insertGenerationLog(supabase, {
        id: genLogId,
        is_qa: isQa,
        user_id: userId,
        job_id: queueJobId,
        recipe_snapshot: asJsonbObject(vibe_profile),
        rolled_axes: { ...logAxes, timings, observability },
        enhanced_prompt: finalPrompt,
        model_used: modelUsedOverride ?? pickedModel,
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

    // Holiday POSTCARD (mig 459): decorative "Happy Halloween" lettering composited onto
    // the persisted render by the SEPARATE holiday-postcard fn (never pixel work in this
    // isolate). Scope = engine_config.holiday_postcard_scope: day-of heroes by default,
    // or every in-season holiday dream. Best-effort: any failure keeps the clean image.
    // uploads.postcard_pending (mig 479): the overlay was wanted but NOT applied (isolate refused an
    // oversize source, failed, or threw) → the display-variant cron composites it with sharp.
    let postcardPending: string | null = null;
    if (holidayCategory) {
      try {
        const pcScope = (await fetchEngineConfig(supabase)).holidayPostcardScope;
        if (pcScope === 'window' || (pcScope === 'day_of' && dayOfApplied)) {
          const pc = await dispatchHolidayPostcard(imageUrl, holidayCategory);
          fallbackReasons.push(pc.reason);
          if (!pc.ok && !pc.reason.includes(':skip:')) postcardPending = holidayCategory;
          lap('postcard');
        }
      } catch (_pcErr) {
        fallbackReasons.push('postcard:fail:threw');
        postcardPending = holidayCategory;
      }
    }

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
          model_used: modelUsedOverride ?? pickedModel,
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
    if (flyPersisted) {
      // Phase 1: the Fly call already built the display JPEG and the thumbhash — nothing decoded here, and
      // image_url_display is populated inline (the backfill cron finds nothing to do for these rows).
      displayUrl = flyPersisted.displayUrl;
      thumbhash = flyPersisted.thumbhash;
    } else if (decodedOut) {
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
          postcard_pending: postcardPending, // mig 479: the cron composites the overlay out-of-process

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
    // Backfill the log ↔ upload join key. AWAITED (2026-09-04): as a
    // fire-and-forget it raced the Response return and the isolate dropped the
    // in-flight request most of the time — ~85% of dual nightly log rows over
    // 3 days had upload_id null, so forensics couldn't join log ↔ upload. It's
    // one tiny UPDATE (~20ms); awaiting it is the fix. Still catches + warns.
    if (uploadId) {
      // Also re-stamp fallback_reasons: the log row was inserted in parallel with
      // persist, BEFORE the holiday postcard step pushed its outcome (mig 459).
      await supabase
        .from('ai_generation_log')
        .update({ upload_id: uploadId, fallback_reasons: fallbackReasons })
        .eq('id', genLogId)
        .then(
          () => {},
          (e: unknown) =>
            console.warn('[nightly-dreams] upload_id backfill failed:', (e as Error)?.message)
        );
    }
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
        day_of: dayOfApplied,
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
      is_qa: isQa,
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
