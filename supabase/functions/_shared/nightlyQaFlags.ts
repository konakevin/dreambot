/**
 * nightlyQaFlags.ts — ONE typed parser for the nightly-dreams request flags (SCENE_FIRST_ACTION_PLAN.md §11.1).
 *
 * Behaviour-neutral extraction (2026-09-06) of the 40-odd ad-hoc `const force_x = body.force_x === true` lines
 * that lived inline in nightly-dreams/index.ts. Every coercion below is byte-for-byte the original one —
 * locked by __tests__/lib/nightlyQaFlags.test.ts. Nightly destructures the result under the same local names,
 * so downstream code is untouched.
 *
 * All `force_*` flags are QA-only (worker-token gated); `first_dream`, `strict_face_swap`, `persist`,
 * `queue_job_id` and `force_place` are also set by the production first-dream / queue paths.
 */
import type { MoodAxes } from './vibeProfile.ts';

export interface NightlyQaFlags {
  /** Preserves an explicit null (= "force scene-only, no cast"); undefined when absent. */
  force_cast_role: string | null | undefined;
  force_medium: string | undefined;
  force_moods: MoodAxes | undefined;
  /** A string forces that exact beat, `true` forces the roll on. */
  force_awe_beat: string | boolean | undefined;
  /** 1-12, floored; anything else → undefined. */
  force_season_month: number | undefined;
  force_vibe: string | undefined;
  force_nightly_path: string | undefined;
  force_model: string | undefined;
  force_female_hair_pct: number | undefined;
  isFirstDream: boolean;
  force_place: string | undefined;
  force_dual_pool: 'partner' | 'companion' | 'playful' | 'dynamic' | undefined;
  force_single_pool: 'portrait' | 'candid' | 'dynamic' | undefined;
  force_cluster_kind: 'activity' | 'spot' | undefined;
  force_face_swap_eligible_raw: boolean;
  force_playful: boolean;
  force_elegant: boolean;
  force_active: boolean;
  force_single_active: boolean;
  force_solo_comp: 'three_quarter' | 'enviro_wide' | null;
  force_active_pose: boolean;
  force_location_action: boolean;
  force_scene_action: boolean;
  force_dual_closer: boolean;
  force_action_registers: boolean;
  force_plain_location: boolean;
  force_action: string | null;
  force_single_playful: boolean;
  force_single_elegant: boolean;
  force_scene_category: string | null;
  /** Raw flag OR a forced scenario category (a bucket force implies a cast render). */
  force_face_swap_eligible: boolean;
  force_holiday_scene: string | null;
  force_pure_scene: boolean;
  dry_run: boolean;
  force_holiday_sub_theme: string | null;
  force_day_of: string | null;
  force_hero_register: 'cozy' | 'eerie' | null;
  force_hero_seed: string | null;
  strict_face_swap: boolean;
  /** Default true; only an explicit `false` disables persistence. */
  persist: boolean;
  queueJobId: string | null;
}

export function parseQaFlags(body: Record<string, unknown>): NightlyQaFlags {
  const force_face_swap_eligible_raw = body.force_face_swap_eligible === true;
  const force_scene_category =
    typeof body.force_scene_category === 'string' ? body.force_scene_category : null;
  return {
    force_cast_role:
      'force_cast_role' in body ? (body.force_cast_role as string | null) : undefined,
    force_medium: (body.force_medium as string) || undefined,
    force_moods:
      body.force_moods && typeof body.force_moods === 'object'
        ? (body.force_moods as MoodAxes)
        : undefined,
    force_awe_beat:
      typeof body.force_awe_beat === 'string'
        ? (body.force_awe_beat as string)
        : body.force_awe_beat === true
          ? true
          : undefined,
    force_season_month:
      typeof body.force_season_month === 'number' &&
      body.force_season_month >= 1 &&
      body.force_season_month <= 12
        ? Math.floor(body.force_season_month)
        : undefined,
    force_vibe: (body.force_vibe as string) || undefined,
    force_nightly_path: (body.force_nightly_path as string) || undefined,
    force_model: (body.force_model as string) || undefined,
    force_female_hair_pct:
      typeof body.force_female_hair_pct === 'number' ? body.force_female_hair_pct : undefined,
    isFirstDream: body.first_dream === true,
    force_place: (body.force_place as string) || undefined,
    force_dual_pool:
      (body.force_dual_pool as 'partner' | 'companion' | 'playful' | 'dynamic' | undefined) ||
      undefined,
    force_single_pool:
      (body.force_single_pool as 'portrait' | 'candid' | 'dynamic' | undefined) || undefined,
    force_cluster_kind: (body.force_cluster_kind as 'activity' | 'spot' | null) || undefined,
    force_face_swap_eligible_raw,
    force_playful: body.force_playful === true,
    force_elegant: body.force_elegant === true,
    force_active: body.force_active === true,
    force_single_active: body.force_single_active === true,
    force_solo_comp:
      body.force_solo_comp === 'three_quarter' || body.force_solo_comp === 'enviro_wide'
        ? (body.force_solo_comp as 'three_quarter' | 'enviro_wide')
        : null,
    force_active_pose: body.force_active_pose === true,
    force_location_action: body.force_location_action === true,
    force_scene_action: body.force_scene_action === true,
    force_dual_closer: body.force_dual_closer === true,
    force_action_registers: body.force_action_registers === true,
    force_plain_location: body.force_plain_location === true,
    force_action: typeof body.force_action === 'string' ? body.force_action : null,
    force_single_playful: body.force_single_playful === true,
    force_single_elegant: body.force_single_elegant === true,
    force_scene_category,
    force_face_swap_eligible: force_face_swap_eligible_raw || force_scene_category !== null,
    force_holiday_scene:
      typeof body.force_holiday_scene === 'string' ? body.force_holiday_scene : null,
    force_pure_scene: body.force_pure_scene === true,
    dry_run: body.dry_run === true,
    force_holiday_sub_theme:
      typeof body.force_holiday_sub_theme === 'string' ? body.force_holiday_sub_theme : null,
    force_day_of: typeof body.force_day_of === 'string' ? body.force_day_of : null,
    force_hero_register:
      body.force_hero_register === 'cozy' || body.force_hero_register === 'eerie'
        ? body.force_hero_register
        : null,
    force_hero_seed: typeof body.force_hero_seed === 'string' ? body.force_hero_seed : null,
    strict_face_swap: body.strict_face_swap === true,
    persist: body.persist !== false,
    queueJobId: (body.queue_job_id as string) || null,
  };
}
