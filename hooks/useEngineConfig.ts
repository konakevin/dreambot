/**
 * useEngineConfig — client reader for the engine_config singleton, via the
 * get_engine_config() RPC (the client-facing subset only).
 *
 * Admin-config backbone (ADMIN_CONFIG_PLAN.md Phase 0): create-screen / economics
 * knobs that used to be hardcoded in the RN client now live on engine_config so an
 * admin can patch them via the dashboard with no app build. Every field falls back
 * to the value previously hardcoded in code, so a missing row / offline first paint
 * is harmless — the hook always returns a usable config.
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { setConfiguredTrialDays } from '@/lib/proStatus';

export interface EngineConfig {
  baseSparkleCost: number;
  welcomeSparkleBonus: number;
  proTrialDays: number;
  promptMaxLength: number;
  photoPreprocessWidth: number;
  photoPreprocessQuality: number;
  selfRefRegex: string | null;
  relationshipRegex: string | null;
  // Cast-detection word lists (migration 256). The helper-text regex is built
  // from these; null → create.tsx falls back to its bundled word-list constants.
  relationshipWords: string | null;
  petWords: string | null;
  // App-update gate (migration 312). Marketing-version strings; null = no gate.
  // ForceUpdateGate fails open on null/malformed, so these never brick the app.
  minAppVersion: string | null;
  latestAppVersion: string | null;
  // Gift Sparkles (migrations 334/335). giftingEnabled=false hides every
  // entry point client-side AND hard-blocks the RPC server-side.
  giftingEnabled: boolean;
  giftMaxPerSend: number;
  giftMaxPerDay: number;
  giftMessageMaxLen: number;
  // New Scene (uploaded-photo reference path), migration 341. Group-size cap
  // (over it → attach-time block, steer to Restyle) + the flat tier prices.
  newSceneMaxPeople: number;
  newScenePriceStandard: number;
  newScenePriceBest: number;
}

// Defaults = the values previously hardcoded in the client (behavior unchanged
// until an admin edits engine_config).
export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  baseSparkleCost: 1,
  welcomeSparkleBonus: 25,
  proTrialDays: 14,
  promptMaxLength: 2000,
  photoPreprocessWidth: 1024,
  photoPreprocessQuality: 0.8,
  selfRefRegex: null,
  relationshipRegex: null,
  relationshipWords: null,
  petWords: null,
  minAppVersion: null,
  latestAppVersion: null,
  giftingEnabled: false,
  giftMaxPerSend: 100,
  giftMaxPerDay: 200,
  giftMessageMaxLen: 100,
  newSceneMaxPeople: 3,
  newScenePriceStandard: 3,
  newScenePriceBest: 5,
};

function num(v: unknown, d: number): number {
  return v === null || v === undefined ? d : Number(v);
}

export function useEngineConfig(): EngineConfig {
  const { data } = useQuery({
    queryKey: ['engineConfig'],
    queryFn: async (): Promise<EngineConfig> => {
      const { data, error } = await supabase.rpc('get_engine_config');
      if (error || !data || typeof data !== 'object' || Array.isArray(data)) {
        return DEFAULT_ENGINE_CONFIG;
      }
      const c = data as Record<string, unknown>;
      return {
        baseSparkleCost: num(c.base_sparkle_cost, DEFAULT_ENGINE_CONFIG.baseSparkleCost),
        welcomeSparkleBonus: num(
          c.welcome_sparkle_bonus,
          DEFAULT_ENGINE_CONFIG.welcomeSparkleBonus
        ),
        proTrialDays: num(c.pro_trial_days, DEFAULT_ENGINE_CONFIG.proTrialDays),
        promptMaxLength: num(c.prompt_max_length, DEFAULT_ENGINE_CONFIG.promptMaxLength),
        photoPreprocessWidth: num(
          c.photo_preprocess_width,
          DEFAULT_ENGINE_CONFIG.photoPreprocessWidth
        ),
        photoPreprocessQuality: num(
          c.photo_preprocess_quality,
          DEFAULT_ENGINE_CONFIG.photoPreprocessQuality
        ),
        selfRefRegex:
          typeof c.self_ref_regex === 'string'
            ? c.self_ref_regex
            : DEFAULT_ENGINE_CONFIG.selfRefRegex,
        relationshipRegex:
          typeof c.relationship_regex === 'string'
            ? c.relationship_regex
            : DEFAULT_ENGINE_CONFIG.relationshipRegex,
        relationshipWords:
          typeof c.relationship_words === 'string'
            ? c.relationship_words
            : DEFAULT_ENGINE_CONFIG.relationshipWords,
        petWords: typeof c.pet_words === 'string' ? c.pet_words : DEFAULT_ENGINE_CONFIG.petWords,
        minAppVersion:
          typeof c.min_app_version === 'string'
            ? c.min_app_version
            : DEFAULT_ENGINE_CONFIG.minAppVersion,
        latestAppVersion:
          typeof c.latest_app_version === 'string'
            ? c.latest_app_version
            : DEFAULT_ENGINE_CONFIG.latestAppVersion,
        giftingEnabled:
          typeof c.gifting_enabled === 'boolean'
            ? c.gifting_enabled
            : DEFAULT_ENGINE_CONFIG.giftingEnabled,
        giftMaxPerSend: num(c.gift_max_per_send, DEFAULT_ENGINE_CONFIG.giftMaxPerSend),
        giftMaxPerDay: num(c.gift_max_per_day, DEFAULT_ENGINE_CONFIG.giftMaxPerDay),
        giftMessageMaxLen: num(c.gift_message_max_len, DEFAULT_ENGINE_CONFIG.giftMessageMaxLen),
        newSceneMaxPeople: num(c.new_scene_max_people, DEFAULT_ENGINE_CONFIG.newSceneMaxPeople),
        newScenePriceStandard: num(
          c.new_scene_price_standard,
          DEFAULT_ENGINE_CONFIG.newScenePriceStandard
        ),
        newScenePriceBest: num(c.new_scene_price_best, DEFAULT_ENGINE_CONFIG.newScenePriceBest),
      };
    },
    staleTime: 5 * 60_000,
  });
  const cfg = data ?? DEFAULT_ENGINE_CONFIG;
  // Keep the proStatus trial-window cache in sync with the admin config so the
  // client's Pro/trial computation honors engine_config.pro_trial_days (M5),
  // matching the SQL is_pro_active() + the nightly cron.
  useEffect(() => {
    setConfiguredTrialDays(cfg.proTrialDays);
  }, [cfg.proTrialDays]);
  return cfg;
}
