/**
 * engineConfig — Edge-side reader for the engine_config singleton (id=1).
 *
 * The admin-config backbone (ADMIN_CONFIG_PLAN.md Phase 0): create-screen /
 * economics knobs that used to be hardcoded in code now live on engine_config so
 * an admin can patch them via the dashboard. Every field falls back to the value
 * currently hardcoded in the client/server, so a missing row/column is harmless.
 *
 * Mirrors the chaosTier loader pattern: select the columns, cast, default-fill,
 * cache per invocation.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { DEFAULT_RELATIONSHIP_WORDS, DEFAULT_PET_WORDS } from './selfInsertDetector.ts';

export interface EngineConfig {
  baseSparkleCost: number;
  welcomeSparkleBonus: number;
  proTrialDays: number;
  promptMaxLength: number;
  photoPreprocessWidth: number;
  photoPreprocessQuality: number;
  nightlyMaxJobs: number;
  // Render quality gate (NIGHTLY_IMPRESS_PLAN §1, migration 453):
  // 'off' | 'shadow' (judge + telemetry only) | 'enforce' (fail → re-swap
  // retries, ship-first-pass, ship-original on exhaustion). Live-tunable —
  // set 'off' to kill judge cost instantly.
  qualityGateMode: string;
  qualityGateMaxRetries: number;
  selfRefRegex: string | null;
  relationshipRegex: string | null;
  // Cast-detection word lists (migration 256) — the single live source the
  // self-insert detector builds its "my ___" regexes from. Falls back to the
  // canonical constants in selfInsertDetector.ts when the DB value is missing.
  relationshipWords: string;
  petWords: string;
  // Queue worker concurrency (migration 264). dreamQueueMaxConcurrent is the
  // GLOBAL cap on simultaneously-rendering jobs — the real anti-546 lever; the
  // worker claims only up to (cap − in_progress) per tick. Tunable live so we
  // can dial it against the load test with no deploy.
  dreamQueueMaxConcurrent: number; // LIGHT (text, no-swap) cap
  dreamQueueMaxConcurrentHeavy: number; // HEAVY (face-swap / dual) cap
  dreamQueueMaxJobsPerTick: number;
  // Per-USER cap (migration 425): the most dreams one user can have
  // queued/in_progress at once. Enqueueing a 6th (default) is rejected 429.
  // Live-tunable so we can dial 3↔5↔N with no app build.
  maxInflightDreamsPerUser: number;
  // New Scene reference path (migration 341). Cap = group-size limit; the two
  // prices are the flat Standard / Best-likeness tiers.
  newSceneMaxPeople: number;
  newScenePriceStandard: number;
  newScenePriceBest: number;
  /** Stage 2 (FACE_SWAP_UPGRADE_PLAN.md): post-swap CodeFormer restoration.
   *  enabled = nightly; createEnabled = Create additionally (nightly soaks
   *  first per the staged rollout contract). */
  faceRestoreEnabled: boolean;
  faceRestoreCreateEnabled: boolean;
  faceRestoreFidelity: number;
  /** Sub-floor duals are the WRONG person and degrade to solo-of-self instead of
   *  shipping (dualSwapPipeline). Live-tunable (audit 2026-09-03 L3; Kevin raised
   *  0.15 -> 0.25 by hand on 2026-08-31, this makes the next tune a dashboard flip). */
  identityDegradeFloor: number;
  /** Phase A (ACTION_POSE_EXPANSION_PLAN.md): % of plain-location dual dreams
   *  that try the biome-tagged ACTIVE pose pool. 0 = off (default). */
  dualActionPosePct: number;
  /** Special-scene roll split for dual face-swap nightlies (was hardcoded
   *  20/20; remainder = the user's location). active defaults 0 (dark). */
  dualSceneGoofyPct: number;
  dualSceneElegantPct: number;
  dualSceneActivePct: number;
  /** Phase B: solo-side twins of the above. */
  singleActionPosePct: number;
  singleSceneGoofyPct: number;
  singleSceneElegantPct: number;
  singleSceneActivePct: number;
  /** Gendered-solo lean (Operation Sweet Dreams): for a solo dream of a KNOWN
   *  gender, widen the elegant + active windows (where the gendered glam/cool
   *  pools live) by this pct, split half/half, at the expense of plain-location.
   *  Modest by default; 0 = off. */
  singleGenderedBoostPct: number;
  /** When a face swap is UNUSABLE (dual cascade / solo failed / identity far below
   *  the floor), re-render the dream as a pure EMPTY scene instead of shipping a
   *  render with random strangers as the user (DREAM_CAST_HARDENING_PLAN.md). */
  pureSceneOnSwapFail: boolean;
  /** Option B (2026-08-10): % of plain-LOCATION face-swap nightlies (dual + solo)
   *  that generate a swap-safe, location-fit action beat (locationActionBeat.ts)
   *  instead of a static pose. Covers EVERY place, not just biome-tagged poses.
   *  0 = off (default). Rolls only when the biome ACTIVE pose didn't fire. */
  locationActionPct: number;
  /** Scene-first actions (SCENE_FIRST_ACTION_PLAN.md, 2026-09-05): % of nightly SCENARIO-row
   *  cast renders (goofy / elegant / holiday / hero — not active rows, not rows naming a
   *  pose_pool) whose action beat Sonnet AUTHORS from the scene inside the slot call, instead
   *  of a pre-rolled pool pose. 0 = off (default). */
  sceneActionPct: number;
  /** Stage 5c: % of solo face-swap renders using an expanded composition
   *  preset (three-quarter / environmental-wide). 0 = classic waist-up only. */
  singleCompositionExpandedPct: number;
  /** NIGHTLY female-hairstyle variation (2026-08-31): % chance a FEMALE cast
   *  member's hair is re-styled (color/length/bangs/coily texture preserved,
   *  scene-biased) instead of her static photo hairdo. 0 = always her own look.
   *  Kevin: 50. Nightly-only; the paid Create path never applies it. */
  femaleHairVariationPct: number;
  /** Holiday Dreams master kill switch (HOLIDAY_DREAMS_PLAN.md). When false the
   *  whole holiday layer is inert regardless of the date/catalog. Starts false. */
  holidaysEnabled: boolean;
  /** Couple model steer (dualModelSteer.ts, mig 462): steer DUAL face-swap picks off
   *  flux-1.1-pro/Ultra to a proven sibling the medium allows. false = off. */
  dualAvoidFlux11pro: boolean;
  /** Couple framing variance (2026-09-06, mig 463): % of couple renders framed as the closer
   *  waist-up two-shot instead of the knees-up default. 0 = off. */
  dualCloserPct: number;
  /** Scene-first beats on PLAIN-LOCATION dreams (mig 464) — own ramp, 0 = off. */
  sceneActionLocationPct: number;
  /** Genre action registers on scene-first renders (mig 464) — 0 = off. */
  actionRegistersPct: number;
  /** Let location COUPLES use scene-first beats (mig 465). false = held on the existing path. */
  sceneActionLocationCouples: boolean;
  /** Model for the couple-degrade SOLO rebuild (mig 466). '' → the couple's own model. */
  soloRebuildModel: string;
  /** Holiday POSTCARD overlay scope (migration 459): 'off' | 'day_of' (the day-of hero
   *  only — default) | 'window' (every in-season holiday dream). */
  holidayPostcardScope: 'off' | 'day_of' | 'window';
}

// Defaults = the values currently hardcoded in code (behavior unchanged pre-edit).
export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  baseSparkleCost: 1,
  welcomeSparkleBonus: 25,
  proTrialDays: 14,
  promptMaxLength: 2000,
  photoPreprocessWidth: 1024,
  photoPreprocessQuality: 0.8,
  nightlyMaxJobs: 5000,
  qualityGateMode: 'enforce',
  qualityGateMaxRetries: 2,
  selfRefRegex: null,
  relationshipRegex: null,
  relationshipWords: DEFAULT_RELATIONSHIP_WORDS,
  petWords: DEFAULT_PET_WORDS,
  dreamQueueMaxConcurrent: 40,
  // HEAVY (dual/face-swap) cap default = 10, the load-tested ceiling of ONE
  // face-swap-dual Fly machine (2GB/1vCPU): 10 = clean, 15 = exhausts/OOMs it
  // (QUEUE_WORKERS_REFACTOR.md). The live engine_config row is 10; this fallback
  // was 15 — a latent landmine that would over-admit into the single machine if
  // the row were ever reset/missing. Aligned to 10 (2026-07-11). To raise real
  // heavy throughput, `fly scale count N` FIRST, then set the row to ~10×N.
  dreamQueueMaxConcurrentHeavy: 10,
  dreamQueueMaxJobsPerTick: 10,
  maxInflightDreamsPerUser: 5,
  newSceneMaxPeople: 3,
  newScenePriceStandard: 3,
  newScenePriceBest: 5,
  faceRestoreEnabled: false,
  faceRestoreCreateEnabled: false,
  faceRestoreFidelity: 0.9,
  identityDegradeFloor: 0.25,
  dualActionPosePct: 0,
  dualSceneGoofyPct: 20,
  dualSceneElegantPct: 20,
  dualSceneActivePct: 0,
  singleActionPosePct: 0,
  singleSceneGoofyPct: 20,
  singleSceneElegantPct: 20,
  singleSceneActivePct: 0,
  singleGenderedBoostPct: 0,
  singleCompositionExpandedPct: 0,
  femaleHairVariationPct: 0,
  locationActionPct: 0,
  sceneActionPct: 0,
  pureSceneOnSwapFail: true,
  holidaysEnabled: false,
  dualAvoidFlux11pro: false,
  dualCloserPct: 0,
  sceneActionLocationPct: 0,
  actionRegistersPct: 0,
  sceneActionLocationCouples: false,
  soloRebuildModel: 'black-forest-labs/flux-2-flex',
  holidayPostcardScope: 'day_of',
};

let cached: EngineConfig | null = null;
let cachedAt = 0;
// 60s TTL so a dashboard edit to engine_config propagates within a minute even to
// WARM isolates (the module cache persists per-isolate, not per-invocation — see
// project_edge_isolate_module_cache_staleness). Mirrors chaosTier/dreamStyles.
const CONFIG_TTL_MS = 60_000;

/** Load engine_config (cached per isolate, 60s TTL). Falls back to defaults on error. */
export async function fetchEngineConfig(sb: SupabaseClient): Promise<EngineConfig> {
  if (cached && Date.now() - cachedAt < CONFIG_TTL_MS) return cached;
  // select('*') (not an explicit column list) so adding a column in a later
  // migration can never 400 this fetch before the migration is applied — a
  // missing column just isn't in `data` and falls back to the default below.
  const { data, error } = await sb.from('engine_config').select('*').eq('id', 1).single();
  if (error || !data) {
    console.warn('[engineConfig] engine_config missing — using defaults:', error?.message);
    cached = DEFAULT_ENGINE_CONFIG;
    cachedAt = Date.now();
    return cached;
  }
  cached = {
    baseSparkleCost: Number(data.base_sparkle_cost ?? DEFAULT_ENGINE_CONFIG.baseSparkleCost),
    welcomeSparkleBonus: Number(
      data.welcome_sparkle_bonus ?? DEFAULT_ENGINE_CONFIG.welcomeSparkleBonus
    ),
    proTrialDays: Number(data.pro_trial_days ?? DEFAULT_ENGINE_CONFIG.proTrialDays),
    promptMaxLength: Number(data.prompt_max_length ?? DEFAULT_ENGINE_CONFIG.promptMaxLength),
    photoPreprocessWidth: Number(
      data.photo_preprocess_width ?? DEFAULT_ENGINE_CONFIG.photoPreprocessWidth
    ),
    photoPreprocessQuality: Number(
      data.photo_preprocess_quality ?? DEFAULT_ENGINE_CONFIG.photoPreprocessQuality
    ),
    nightlyMaxJobs: Number(data.nightly_max_jobs ?? DEFAULT_ENGINE_CONFIG.nightlyMaxJobs),
    qualityGateMode: String(data.quality_gate_mode ?? DEFAULT_ENGINE_CONFIG.qualityGateMode),
    qualityGateMaxRetries: Number(
      data.quality_gate_max_retries ?? DEFAULT_ENGINE_CONFIG.qualityGateMaxRetries
    ),
    selfRefRegex: (data.self_ref_regex as string | null) ?? DEFAULT_ENGINE_CONFIG.selfRefRegex,
    relationshipRegex:
      (data.relationship_regex as string | null) ?? DEFAULT_ENGINE_CONFIG.relationshipRegex,
    relationshipWords:
      (data.relationship_words as string | null) || DEFAULT_ENGINE_CONFIG.relationshipWords,
    petWords: (data.pet_words as string | null) || DEFAULT_ENGINE_CONFIG.petWords,
    dreamQueueMaxConcurrent: Number(
      data.dream_queue_max_concurrent ?? DEFAULT_ENGINE_CONFIG.dreamQueueMaxConcurrent
    ),
    dreamQueueMaxConcurrentHeavy: Number(
      data.dream_queue_max_concurrent_heavy ?? DEFAULT_ENGINE_CONFIG.dreamQueueMaxConcurrentHeavy
    ),
    dreamQueueMaxJobsPerTick: Number(
      data.dream_queue_max_jobs_per_tick ?? DEFAULT_ENGINE_CONFIG.dreamQueueMaxJobsPerTick
    ),
    maxInflightDreamsPerUser: Number(
      data.max_inflight_dreams_per_user ?? DEFAULT_ENGINE_CONFIG.maxInflightDreamsPerUser
    ),
    newSceneMaxPeople: Number(data.new_scene_max_people ?? DEFAULT_ENGINE_CONFIG.newSceneMaxPeople),
    faceRestoreEnabled: Boolean(
      data.face_restore_enabled ?? DEFAULT_ENGINE_CONFIG.faceRestoreEnabled
    ),
    faceRestoreCreateEnabled: Boolean(
      data.face_restore_create_enabled ?? DEFAULT_ENGINE_CONFIG.faceRestoreCreateEnabled
    ),
    faceRestoreFidelity: Number(
      data.face_restore_fidelity ?? DEFAULT_ENGINE_CONFIG.faceRestoreFidelity
    ),
    identityDegradeFloor: Number(
      data.identity_degrade_floor ?? DEFAULT_ENGINE_CONFIG.identityDegradeFloor
    ),
    dualActionPosePct: Number(data.dual_action_pose_pct ?? DEFAULT_ENGINE_CONFIG.dualActionPosePct),
    dualSceneGoofyPct: Number(data.dual_scene_goofy_pct ?? DEFAULT_ENGINE_CONFIG.dualSceneGoofyPct),
    dualSceneElegantPct: Number(
      data.dual_scene_elegant_pct ?? DEFAULT_ENGINE_CONFIG.dualSceneElegantPct
    ),
    dualSceneActivePct: Number(
      data.dual_scene_active_pct ?? DEFAULT_ENGINE_CONFIG.dualSceneActivePct
    ),
    singleActionPosePct: Number(
      data.single_action_pose_pct ?? DEFAULT_ENGINE_CONFIG.singleActionPosePct
    ),
    singleSceneGoofyPct: Number(
      data.single_scene_goofy_pct ?? DEFAULT_ENGINE_CONFIG.singleSceneGoofyPct
    ),
    singleSceneElegantPct: Number(
      data.single_scene_elegant_pct ?? DEFAULT_ENGINE_CONFIG.singleSceneElegantPct
    ),
    singleSceneActivePct: Number(
      data.single_scene_active_pct ?? DEFAULT_ENGINE_CONFIG.singleSceneActivePct
    ),
    singleGenderedBoostPct: Number(
      data.single_gendered_boost_pct ?? DEFAULT_ENGINE_CONFIG.singleGenderedBoostPct
    ),
    singleCompositionExpandedPct: Number(
      data.single_composition_expanded_pct ?? DEFAULT_ENGINE_CONFIG.singleCompositionExpandedPct
    ),
    femaleHairVariationPct: Number(
      data.female_hair_variation_pct ?? DEFAULT_ENGINE_CONFIG.femaleHairVariationPct
    ),
    locationActionPct: Number(data.location_action_pct ?? DEFAULT_ENGINE_CONFIG.locationActionPct),
    sceneActionPct: Number(data.scene_action_pct ?? DEFAULT_ENGINE_CONFIG.sceneActionPct),
    pureSceneOnSwapFail:
      (data.pure_scene_on_swap_fail ?? DEFAULT_ENGINE_CONFIG.pureSceneOnSwapFail) !== false,
    holidaysEnabled: (data.holidays_enabled ?? DEFAULT_ENGINE_CONFIG.holidaysEnabled) === true,
    dualAvoidFlux11pro:
      (data.dual_avoid_flux11pro ?? DEFAULT_ENGINE_CONFIG.dualAvoidFlux11pro) === true,
    dualCloserPct: Number(data.dual_closer_pct ?? DEFAULT_ENGINE_CONFIG.dualCloserPct),
    sceneActionLocationPct: Number(
      data.scene_action_location_pct ?? DEFAULT_ENGINE_CONFIG.sceneActionLocationPct
    ),
    actionRegistersPct: Number(
      data.action_registers_pct ?? DEFAULT_ENGINE_CONFIG.actionRegistersPct
    ),
    sceneActionLocationCouples:
      (data.scene_action_location_couples ?? DEFAULT_ENGINE_CONFIG.sceneActionLocationCouples) ===
      true,
    soloRebuildModel: String(data.solo_rebuild_model ?? DEFAULT_ENGINE_CONFIG.soloRebuildModel),
    holidayPostcardScope:
      data.holiday_postcard_scope === 'off' || data.holiday_postcard_scope === 'window'
        ? data.holiday_postcard_scope
        : 'day_of',
    newScenePriceStandard: Number(
      data.new_scene_price_standard ?? DEFAULT_ENGINE_CONFIG.newScenePriceStandard
    ),
    newScenePriceBest: Number(data.new_scene_price_best ?? DEFAULT_ENGINE_CONFIG.newScenePriceBest),
  };
  cachedAt = Date.now();
  return cached;
}
