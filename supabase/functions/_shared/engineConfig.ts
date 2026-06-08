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

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
};

let cached: EngineConfig | null = null;

/** Load engine_config (cached per invocation). Falls back to defaults on error. */
export async function fetchEngineConfig(sb: SupabaseClient): Promise<EngineConfig> {
  if (cached) return cached;
  const { data, error } = await sb
    .from('engine_config')
    .select(
      'base_sparkle_cost, welcome_sparkle_bonus, pro_trial_days, prompt_max_length, photo_preprocess_width, photo_preprocess_quality, nightly_max_jobs, self_ref_regex, relationship_regex'
    )
    .eq('id', 1)
    .single();
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
  };
  return cached;
}
