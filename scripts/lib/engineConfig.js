/**
 * engineConfig — Node/scripts reader for the engine_config singleton (id=1).
 *
 * Admin-config backbone (ADMIN_CONFIG_PLAN.md Phase 0). Mirrors the Edge reader
 * (_shared/engineConfig.ts). Every field falls back to the value currently
 * hardcoded in the scripts, so a missing row/column is harmless.
 *
 * Usage:
 *   const { fetchEngineConfig } = require('./lib/engineConfig');
 *   const cfg = await fetchEngineConfig(sb);  // sb = service-role client
 */

const DEFAULT_ENGINE_CONFIG = {
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

let cached = null;

/** Load engine_config (cached for the process). Falls back to defaults on error. */
async function fetchEngineConfig(sb) {
  if (cached) return cached;
  const { data, error } = await sb
    .from('engine_config')
    .select(
      'base_sparkle_cost, welcome_sparkle_bonus, pro_trial_days, prompt_max_length, photo_preprocess_width, photo_preprocess_quality, nightly_max_jobs, self_ref_regex, relationship_regex'
    )
    .eq('id', 1)
    .single();
  if (error || !data) {
    console.warn('[engineConfig] engine_config missing — using defaults:', error && error.message);
    cached = DEFAULT_ENGINE_CONFIG;
    return cached;
  }
  const num = (v, d) => (v === null || v === undefined ? d : Number(v));
  cached = {
    baseSparkleCost: num(data.base_sparkle_cost, DEFAULT_ENGINE_CONFIG.baseSparkleCost),
    welcomeSparkleBonus: num(data.welcome_sparkle_bonus, DEFAULT_ENGINE_CONFIG.welcomeSparkleBonus),
    proTrialDays: num(data.pro_trial_days, DEFAULT_ENGINE_CONFIG.proTrialDays),
    promptMaxLength: num(data.prompt_max_length, DEFAULT_ENGINE_CONFIG.promptMaxLength),
    photoPreprocessWidth: num(
      data.photo_preprocess_width,
      DEFAULT_ENGINE_CONFIG.photoPreprocessWidth
    ),
    photoPreprocessQuality: num(
      data.photo_preprocess_quality,
      DEFAULT_ENGINE_CONFIG.photoPreprocessQuality
    ),
    nightlyMaxJobs: num(data.nightly_max_jobs, DEFAULT_ENGINE_CONFIG.nightlyMaxJobs),
    selfRefRegex: data.self_ref_regex ?? DEFAULT_ENGINE_CONFIG.selfRefRegex,
    relationshipRegex: data.relationship_regex ?? DEFAULT_ENGINE_CONFIG.relationshipRegex,
  };
  return cached;
}

module.exports = { fetchEngineConfig, DEFAULT_ENGINE_CONFIG };
