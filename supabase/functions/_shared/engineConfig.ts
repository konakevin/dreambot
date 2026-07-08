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
  // New Scene reference path (migration 341). Cap = group-size limit; the two
  // prices are the flat Standard / Best-likeness tiers.
  newSceneMaxPeople: number;
  newScenePriceStandard: number;
  newScenePriceBest: number;
  /** Stage 2 (FACE_SWAP_UPGRADE_PLAN.md): post-swap CodeFormer restoration. */
  faceRestoreEnabled: boolean;
  faceRestoreFidelity: number;
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
  selfRefRegex: null,
  relationshipRegex: null,
  relationshipWords: DEFAULT_RELATIONSHIP_WORDS,
  petWords: DEFAULT_PET_WORDS,
  dreamQueueMaxConcurrent: 40,
  dreamQueueMaxConcurrentHeavy: 15,
  dreamQueueMaxJobsPerTick: 10,
  newSceneMaxPeople: 3,
  newScenePriceStandard: 3,
  newScenePriceBest: 5,
  faceRestoreEnabled: false,
  faceRestoreFidelity: 0.9,
};

let cached: EngineConfig | null = null;

/** Load engine_config (cached per invocation). Falls back to defaults on error. */
export async function fetchEngineConfig(sb: SupabaseClient): Promise<EngineConfig> {
  if (cached) return cached;
  // select('*') (not an explicit column list) so adding a column in a later
  // migration can never 400 this fetch before the migration is applied — a
  // missing column just isn't in `data` and falls back to the default below.
  const { data, error } = await sb.from('engine_config').select('*').eq('id', 1).single();
  if (error || !data) {
    console.warn('[engineConfig] engine_config missing — using defaults:', error?.message);
    cached = DEFAULT_ENGINE_CONFIG;
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
    newSceneMaxPeople: Number(data.new_scene_max_people ?? DEFAULT_ENGINE_CONFIG.newSceneMaxPeople),
    faceRestoreEnabled: Boolean(
      data.face_restore_enabled ?? DEFAULT_ENGINE_CONFIG.faceRestoreEnabled
    ),
    faceRestoreFidelity: Number(
      data.face_restore_fidelity ?? DEFAULT_ENGINE_CONFIG.faceRestoreFidelity
    ),
    newScenePriceStandard: Number(
      data.new_scene_price_standard ?? DEFAULT_ENGINE_CONFIG.newScenePriceStandard
    ),
    newScenePriceBest: Number(data.new_scene_price_best ?? DEFAULT_ENGINE_CONFIG.newScenePriceBest),
  };
  return cached;
}
