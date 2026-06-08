/**
 * Chaos-tier helper + nightly dream-type roller (2026-06-07).
 *
 * Kevin's tiered distribution spec, gated on the user's onboarding chaos
 * slider (vibe_profile.moods.peaceful_chaotic, 0..1):
 *
 *   low  (<0.4)        → 0% embodied, base model list only
 *   mid  (0.4..<0.7)   → 10% embodied (lego, pixels) + flux-2-pro
 *   high (>=0.7)       → 15% embodied (lego, pixels, handcrafted) + flux-2-pro/flex/max
 *
 * Within the scene-territory the embodied roll fires first; if it misses
 * the remaining share splits 50/50 pure_scene vs epic_tiny. Face-swap
 * portion is 70% (60% dual / 20% self / 20% +1; collapses to 100% self
 * when no +1). No cast at all → full 100% scene-territory.
 *
 * All knobs live on engine_config (singleton id=1) — see migration 239.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export type ChaosTier = 'low' | 'mid' | 'high';

export type NightlyDreamType =
  | 'face_swap_dual'
  | 'face_swap_self'
  | 'face_swap_plus_one'
  | 'pure_scene'
  | 'epic_tiny'
  | 'embodied';

export interface ChaosConfig {
  low: number;
  high: number;
  embodied_low: number;
  embodied_mid: number;
  embodied_high: number;
  embodied_mediums_mid: string[];
  embodied_mediums_high: string[];
  extra_models_mid: string[];
  extra_models_high: string[];
  face_swap_share: number;
  face_swap_dual_rate: number;
  face_swap_self_rate: number;
}

const DEFAULT_CONFIG: ChaosConfig = {
  low: 0.4,
  high: 0.7,
  embodied_low: 0,
  embodied_mid: 0.333,
  embodied_high: 0.5,
  embodied_mediums_mid: ['lego', 'pixels'],
  embodied_mediums_high: ['lego', 'pixels', 'handcrafted'],
  extra_models_mid: ['black-forest-labs/flux-2-pro'],
  extra_models_high: [
    'black-forest-labs/flux-2-pro',
    'black-forest-labs/flux-2-flex',
    'black-forest-labs/flux-2-max',
  ],
  face_swap_share: 0.7,
  face_swap_dual_rate: 0.6,
  face_swap_self_rate: 0.2,
};

let cachedConfig: ChaosConfig | null = null;

/** Loads chaos knobs from engine_config (singleton). Cached per invocation. */
export async function fetchChaosConfig(sb: SupabaseClient): Promise<ChaosConfig> {
  if (cachedConfig) return cachedConfig;
  const { data, error } = await sb
    .from('engine_config')
    .select(
      'chaos_low_threshold, chaos_high_threshold, scene_embodied_rate_low, scene_embodied_rate_mid, scene_embodied_rate_high, embodied_mediums_mid, embodied_mediums_high, extra_models_mid, extra_models_high, face_swap_share, face_swap_dual_rate, face_swap_self_rate'
    )
    .eq('id', 1)
    .single();
  if (error || !data) {
    console.warn('[chaosTier] engine_config missing — using defaults:', error?.message);
    cachedConfig = DEFAULT_CONFIG;
    return cachedConfig;
  }
  cachedConfig = {
    low: Number(data.chaos_low_threshold ?? DEFAULT_CONFIG.low),
    high: Number(data.chaos_high_threshold ?? DEFAULT_CONFIG.high),
    embodied_low: Number(data.scene_embodied_rate_low ?? DEFAULT_CONFIG.embodied_low),
    embodied_mid: Number(data.scene_embodied_rate_mid ?? DEFAULT_CONFIG.embodied_mid),
    embodied_high: Number(data.scene_embodied_rate_high ?? DEFAULT_CONFIG.embodied_high),
    embodied_mediums_mid:
      (data.embodied_mediums_mid as string[]) ?? DEFAULT_CONFIG.embodied_mediums_mid,
    embodied_mediums_high:
      (data.embodied_mediums_high as string[]) ?? DEFAULT_CONFIG.embodied_mediums_high,
    extra_models_mid: (data.extra_models_mid as string[]) ?? DEFAULT_CONFIG.extra_models_mid,
    extra_models_high: (data.extra_models_high as string[]) ?? DEFAULT_CONFIG.extra_models_high,
    face_swap_share: Number(data.face_swap_share ?? DEFAULT_CONFIG.face_swap_share),
    face_swap_dual_rate: Number(data.face_swap_dual_rate ?? DEFAULT_CONFIG.face_swap_dual_rate),
    face_swap_self_rate: Number(data.face_swap_self_rate ?? DEFAULT_CONFIG.face_swap_self_rate),
  };
  return cachedConfig;
}

/** Resolves chaos value (0..1) to a tier. */
export function getChaosTier(chaosValue: number | undefined | null, cfg: ChaosConfig): ChaosTier {
  const v = typeof chaosValue === 'number' && !Number.isNaN(chaosValue) ? chaosValue : 0.5;
  if (v < cfg.low) return 'low';
  if (v >= cfg.high) return 'high';
  return 'mid';
}

/** Per-tier embodied within-scene rate (0..1). */
export function embodiedRateForTier(tier: ChaosTier, cfg: ChaosConfig): number {
  if (tier === 'low') return cfg.embodied_low;
  if (tier === 'high') return cfg.embodied_high;
  return cfg.embodied_mid;
}

/** Per-tier embodied medium subset (lego/pixels/handcrafted). */
export function embodiedMediumsForTier(tier: ChaosTier, cfg: ChaosConfig): string[] {
  if (tier === 'high') return cfg.embodied_mediums_high;
  if (tier === 'mid') return cfg.embodied_mediums_mid;
  return [];
}

/** Per-tier extra models to merge into the medium's allowed_models. */
export function extraModelsForTier(tier: ChaosTier, cfg: ChaosConfig): string[] {
  if (tier === 'high') return cfg.extra_models_high;
  if (tier === 'mid') return cfg.extra_models_mid;
  return [];
}

/**
 * Roll the nightly dream type given the user's cast availability + chaos tier.
 *
 * Distribution:
 *   - 70% face-swap (when hasSelf):
 *       - hasPlus1:  60% dual / 20% self / 20% +1
 *       - no +1:     100% self (the 60% dual share folds into self)
 *   - 30% scene-territory:
 *       - embodied roll (rate from chaos tier)
 *       - else 50/50 pure_scene vs epic_tiny (epic_tiny needs hasSelf, else pure_scene)
 *   - hasSelf=false: 100% scene-territory. Embodied roll fires; otherwise
 *     pure_scene (no epic_tiny since there's no figure to render tiny).
 *
 * First-dream override (`isFirstDream=true`): the onboarding reveal is the
 * app's showcase moment — we force a deterministic best-impression render:
 *   - hasSelf + hasPlusOne → face_swap_dual
 *   - hasSelf only         → face_swap_self
 *   - no cast              → 50/50 pure_scene / epic_tiny (NO embodied,
 *                            regardless of chaos slider — embodied first
 *                            renders are too off-genre for the showcase).
 */
export function rollNightlyDreamType({
  hasSelf,
  hasPlusOne,
  tier,
  cfg,
  isFirstDream = false,
}: {
  hasSelf: boolean;
  hasPlusOne: boolean;
  tier: ChaosTier;
  cfg: ChaosConfig;
  isFirstDream?: boolean;
}): NightlyDreamType {
  // First-dream showcase override — deterministic best-impression cascade.
  if (isFirstDream) {
    if (hasSelf && hasPlusOne) return 'face_swap_dual';
    if (hasSelf) return 'face_swap_self';
    // No cast: 50/50 pure_scene / epic_tiny — but epic_tiny needs a cast
    // figure to render tiny, so fall to pure_scene without one.
    return 'pure_scene';
  }

  // No cast → all scene territory (no face-swap, no epic_tiny).
  if (!hasSelf) {
    const embRate = embodiedRateForTier(tier, cfg);
    return Math.random() < embRate ? 'embodied' : 'pure_scene';
  }

  // Face-swap branch
  if (Math.random() < cfg.face_swap_share) {
    if (!hasPlusOne) return 'face_swap_self';
    const r = Math.random();
    if (r < cfg.face_swap_dual_rate) return 'face_swap_dual';
    if (r < cfg.face_swap_dual_rate + cfg.face_swap_self_rate) return 'face_swap_self';
    return 'face_swap_plus_one';
  }

  // Scene-territory branch
  const embRate = embodiedRateForTier(tier, cfg);
  if (Math.random() < embRate) return 'embodied';
  // 50/50 between pure_scene and epic_tiny
  return Math.random() < 0.5 ? 'pure_scene' : 'epic_tiny';
}

/**
 * Translate a rolled NightlyDreamType into the inputs the nightly-dreams
 * Edge Function needs:
 *   - mediumToken: resolveMediumFromDb token to pre-pick the right pool
 *   - forceCastRole: passed to rollDream so cast selection matches
 *   - forceComposition: passed to rollDream so composition matches
 *
 * Chaos tier is used for the embodied subset (lego+pixels at MID, plus
 * handcrafted at HIGH). All other types are tier-agnostic.
 */
export function mapDreamTypeToInputs(
  type: NightlyDreamType,
  tier: ChaosTier,
  cfg: ChaosConfig
): {
  mediumToken: string;
  forceCastRole: string | null;
  forceComposition: 'character' | 'epic_tiny' | 'pure_scene';
} {
  switch (type) {
    case 'face_swap_dual':
      return {
        mediumToken: 'dream_eligible_face_swap',
        forceCastRole: 'dual',
        forceComposition: 'character',
      };
    case 'face_swap_self':
      return {
        mediumToken: 'dream_eligible_face_swap',
        forceCastRole: 'self',
        forceComposition: 'character',
      };
    case 'face_swap_plus_one':
      return {
        mediumToken: 'dream_eligible_face_swap',
        forceCastRole: 'plus_one',
        forceComposition: 'character',
      };
    case 'epic_tiny':
      return {
        mediumToken: 'dream_eligible_scene_natural',
        forceCastRole: 'self',
        forceComposition: 'epic_tiny',
      };
    case 'embodied': {
      const subset = embodiedMediumsForTier(tier, cfg);
      // Embodied mediums render the cast AS the medium (LEGO minifigs,
      // pixel sprites). For nightly we still keep pure_scene composition
      // (LEGO landscape, pixel scenery) — character_render=embodied means
      // any figure that appears is auto-styled to match the medium.
      return {
        mediumToken: `dream_eligible_embodied:${subset.join(',')}`,
        forceCastRole: null,
        forceComposition: 'pure_scene',
      };
    }
    case 'pure_scene':
    default:
      return {
        mediumToken: 'dream_eligible_scene_natural',
        forceCastRole: null,
        forceComposition: 'pure_scene',
      };
  }
}
